// functions/index.js

const admin = require('firebase-admin');
const { onValueCreated } = require('firebase-functions/v2/database');

admin.initializeApp();

exports.processAdminBroadcast = onValueCreated('/adminQueue/broadcasts/{broadcastId}', async (event) => {
  const broadcastId = event.params.broadcastId;
  const data = event.data.val();

  if (!data || data.status === 'sent') return;

  const db = admin.database();
  const tokensSnap = await db.ref('notifications/tokens').get();
  const tokensRoot = tokensSnap.val() || {};
  const tokens = [];

  Object.entries(tokensRoot).forEach(([uid, tokenGroup]) => {
    Object.values(tokenGroup || {}).forEach((row) => {
      if (row && row.token && row.active !== false) {
        tokens.push({ token: row.token, uid });
      }
    });
  });

  if (!tokens.length) {
    await db.ref(`adminQueue/broadcasts/${broadcastId}`).update({ status: 'sent', delivered: 0 });
    return;
  }

  const message = {
    notification: {
      title: data.title || 'Family Forecast Market',
      body: data.body || ''
    },
    data: {
      type: data.type || 'custom',
      target: data.target || 'all',
      marketId: data.marketId || ''
    }
  };

  let delivered = 0;
  const batches = [];
  while (tokens.length) {
    batches.push(tokens.splice(0, 500));
  }

  for (const batch of batches) {
    const multicast = {
      tokens: batch.map((x) => x.token),
      notification: message.notification,
      data: message.data
    };
    const response = await admin.messaging().sendEachForMulticast(multicast);
    delivered += response.successCount;
  }

  await db.ref(`adminQueue/broadcasts/${broadcastId}`).update({
    status: 'sent',
    delivered,
    sentAt: admin.database.ServerValue.TIMESTAMP
  });
});

exports.processMarketResolution = onValueCreated('/adminQueue/resolutions/{resolutionId}', async (event) => {
  const resolutionId = event.params.resolutionId;
  const data = event.data.val();
  if (!data || !data.marketId || !data.result) return;

  const db = admin.database();
  const marketRef = db.ref(`markets/${data.marketId}`);
  const marketSnap = await marketRef.get();
  const market = marketSnap.val();

  if (!market || market.status === 'resolved') {
    await db.ref(`adminQueue/resolutions/${resolutionId}`).update({ status: 'ignored' });
    return;
  }

  const result = String(data.result).toLowerCase();
  const bets = market.bets || {};
  const totalYes = Number(market.totalYes || 0);
  const totalNo = Number(market.totalNo || 0);
  const totalPool = totalYes + totalNo;
  const winningPool = result === 'yes' ? totalYes : result === 'no' ? totalNo : 0;

  const updates = {};
  updates[`markets/${data.marketId}/status`] = 'resolved';
  updates[`markets/${data.marketId}/result`] = result;
  updates[`markets/${data.marketId}/resolvedAt`] = admin.database.ServerValue.TIMESTAMP;
  updates[`markets/${data.marketId}/closedAt`] = market.closedAt || admin.database.ServerValue.TIMESTAMP;
  updates[`markets/${data.marketId}/settlement/result`] = result;
  updates[`markets/${data.marketId}/settlement/processedAt`] = admin.database.ServerValue.TIMESTAMP;
  updates[`adminQueue/resolutions/${resolutionId}/status`] = 'processed';

  const profilesSnap = await db.ref('profiles').get();
  const profiles = profilesSnap.val() || {};
  const walletsSnap = await db.ref('wallets').get();
  const wallets = walletsSnap.val() || {};

  Object.entries(bets).forEach(([uid, bet]) => {
    const stake = result === 'yes'
      ? Number(bet.yes || 0)
      : result === 'no'
        ? Number(bet.no || 0)
        : 0;

    const payout = winningPool > 0 && totalPool > 0 && stake > 0
      ? (stake / winningPool) * totalPool
      : 0;

    const walletBalance = Number(wallets[uid]?.balance || 0);
    const profit = Math.max(0, payout - stake);

    updates[`wallets/${uid}/balance`] = Number((walletBalance + payout).toFixed(2));
    updates[`wallets/${uid}/lifetimeWinnings`] = Number(((wallets[uid]?.lifetimeWinnings || 0) + payout).toFixed(2));
    updates[`wallets/${uid}/profit`] = Number(((wallets[uid]?.profit || 0) + profit).toFixed(2));
    updates[`profiles/${uid}/wins`] = result === 'yes' ? (profiles[uid]?.wins || 0) + 1 : (profiles[uid]?.wins || 0);
    updates[`profiles/${uid}/losses`] = result === 'no' ? (profiles[uid]?.losses || 0) + 1 : (profiles[uid]?.losses || 0);
    updates[`profiles/${uid}/profit`] = Number(((profiles[uid]?.profit || 0) + profit).toFixed(2));
    updates[`profiles/${uid}/updatedAt`] = admin.database.ServerValue.TIMESTAMP;
  });

  const logKey = db.ref('audit/logs').push().key;
  updates[`audit/logs/${logKey}`] = {
    kind: 'settlement',
    title: 'שוק הוכרע',
    detail: `${data.marketId} => ${result} / pool ${totalPool} / winning ${winningPool}`,
    createdAt: admin.database.ServerValue.TIMESTAMP,
    actor: data.createdBy || 'system'
  };

  await db.ref().update(updates);
});