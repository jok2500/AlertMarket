
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import {
      getAuth,
      onAuthStateChanged,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      sendPasswordResetEmail,
      signOut,
      updateProfile
    } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import {
      getDatabase,
      ref,
      onValue,
      get,
      set,
      update,
      push,
      runTransaction,
      serverTimestamp
    } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
    import {
      getMessaging,
      getToken,
      onMessage
    } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

    const firebaseConfig = {
      apiKey: "__API_KEY__",
      authDomain: "__AUTH_DOMAIN__",
      databaseURL: "__DATABASE_URL__",
      projectId: "__PROJECT_ID__",
      storageBucket: "__STORAGE_BUCKET__",
      messagingSenderId: "__MESSAGING_SENDER_ID__",
      appId: "__APP_ID__"
    };

    const vapidKey = "__VAPID_KEY__";
    const defaultSettings = {
      siteName: "Family Forecast Market",
      siteTagline: "שוק תחזית משפחתי בזמן אמת",
      maintenanceMode: false,
      defaultCoinsPerMarket: 10,
      activeMarketId: null
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);
    const messaging = getMessaging(app);

    const el = (id) => document.getElementById(id);
    const authView = el("authView");
    const appView = el("appView");
    const toastWrap = el("toastWrap");
    const adminPanel = el("adminPanel");

    const loginForm = el("loginForm");
    const registerForm = el("registerForm");
    const resetForm = el("resetForm");

    const loginEmail = el("loginEmail");
    const loginPassword = el("loginPassword");
    const registerName = el("registerName");
    const registerEmail = el("registerEmail");
    const registerPassword = el("registerPassword");
    const registerPassword2 = el("registerPassword2");
    const resetEmail = el("resetEmail");

    const themeBtn = el("themeBtn");
    const logoutBtn = el("logoutBtn");
    const notifyBtn = el("notifyBtn");
    const refreshBtn = el("refreshBtn");
    const enableNotificationsBtn = el("enableNotificationsBtn");
    const guestPreviewBtn = el("guestPreviewBtn");
    const roleChip = el("roleChip");
    const connectionChip = el("connectionChip");

    const siteNameEl = el("siteName");
    const siteTaglineEl = el("siteTagline");
    const walletValue = el("walletValue");
    const availableCoinsValue = el("availableCoinsValue");
    const rankValue = el("rankValue");
    const activeMarketState = el("activeMarketState");
    const broadcastState = el("broadcastState");
    const countdownValue = el("countdownValue");
    const notificationState = el("notificationState");

    const marketEmpty = el("marketEmpty");
    const marketCard = el("marketCard");
    const marketStatusBadge = el("marketStatusBadge");
    const marketCategoryBadge = el("marketCategoryBadge");
    const marketIdBadge = el("marketIdBadge");
    const marketQuestion = el("marketQuestion");
    const marketDescription = el("marketDescription");
    const yesTotalValue = el("yesTotalValue");
    const noTotalValue = el("noTotalValue");
    const totalPoolValue = el("totalPoolValue");
    const yesOddsValue = el("yesOddsValue");
    const yesOddsLabel = el("yesOddsLabel");
    const noOddsLabel = el("noOddsLabel");
    const yesProgress = el("yesProgress");
    const noProgress = el("noProgress");
    const yesAmount = el("yesAmount");
    const noAmount = el("noAmount");
    const placeBetBtn = el("placeBetBtn");
    const maxYesBtn = el("maxYesBtn");
    const maxNoBtn = el("maxNoBtn");
    const clearBetBtn = el("clearBetBtn");
    const myBetSummary = el("myBetSummary");
    const myRemainingCoins = el("myRemainingCoins");
    const marketOpenedAt = el("marketOpenedAt");
    const marketClosesAt = el("marketClosesAt");
    const betHelper = el("betHelper");

    const historyList = el("historyList");
    const historyCount = el("historyCount");
    const walletBalance = el("walletBalance");
    const profitTotal = el("profitTotal");
    const betsPlacedCount = el("betsPlacedCount");
    const winsCount = el("winsCount");
    const leaderboardList = el("leaderboardList");
    const leaderboardCount = el("leaderboardCount");
    const activityList = el("activityList");
    const activityCount = el("activityCount");
    const myBetsList = el("myBetsList");
    const myBetsCount = el("myBetsCount");

    const createMarketForm = el("createMarketForm");
    const broadcastForm = el("broadcastForm");
    const siteSettingsForm = el("siteSettingsForm");

    const marketQuestionInput = el("marketQuestionInput");
    const marketDescriptionInput = el("marketDescriptionInput");
    const marketCategoryInput = el("marketCategoryInput");
    const marketMinutesInput = el("marketMinutesInput");
    const marketAutoNotifyInput = el("marketAutoNotifyInput");
    const marketInitialStatusInput = el("marketInitialStatusInput");
    const openMarketBtn = el("openMarketBtn");
    const closeMarketBtn = el("closeMarketBtn");
    const requestResolveBtn = el("requestResolveBtn");
    const seedDemoBtn = el("seedDemoBtn");
    const adminMarketList = el("adminMarketList");

    const broadcastTitleInput = el("broadcastTitleInput");
    const broadcastBodyInput = el("broadcastBodyInput");
    const broadcastTargetInput = el("broadcastTargetInput");
    const broadcastTypeInput = el("broadcastTypeInput");
    const testBroadcastBtn = el("testBroadcastBtn");
    const broadcastQueueList = el("broadcastQueueList");

    const usersTableBody = el("usersTableBody");
    const adminUserSearch = el("adminUserSearch");
    const usersCountValue = el("usersCountValue");
    const adminsCountValue = el("adminsCountValue");
    const openMarketsCountValue = el("openMarketsCountValue");
    const broadcastCountValue = el("broadcastCountValue");

    const siteNameInput = el("siteNameInput");
    const siteTaglineInput = el("siteTaglineInput");
    const maintenanceModeInput = el("maintenanceModeInput");
    const defaultCoinsInput = el("defaultCoinsInput");
    const reloadSettingsBtn = el("reloadSettingsBtn");

    const rulesPreview = el("rulesPreview");
    const swPreview = el("swPreview");
    const copyRulesBtn = el("copyRulesBtn");
    const copySwBtn = el("copySwBtn");
    const copyFunctionsBtn = el("copyFunctionsBtn");

    const authTabs = Array.from(document.querySelectorAll("[data-auth-tab]"));
    const adminTabs = Array.from(document.querySelectorAll("[data-admin-tab]"));

    const state = {
      user: null,
      profile: null,
      wallet: null,
      role: "user",
      settings: { ...defaultSettings },
      activeMarket: null,
      markets: [],
      users: [],
      activity: [],
      broadcasts: [],
      myBets: [],
      theme: localStorage.getItem("ffm-theme") || "dark",
      liveTimer: null,
      notificationsEnabled: false,
      subscriptions: []
    };

    const addSub = (unsub) => typeof unsub === "function" && state.subscriptions.push(unsub);
    const clearSubs = () => { while (state.subscriptions.length) { try { state.subscriptions.pop()(); } catch {} } };
    const readNum = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
    const round2 = (v) => Math.round((readNum(v) + Number.EPSILON) * 100) / 100;
    const fmt = (v) => new Intl.NumberFormat("he-IL", { maximumFractionDigits: 2 }).format(readNum(v));
    const ts = (v) => {
      if (!v) return "—";
      const d = new Date(Number(v));
      return Number.isNaN(d.getTime()) ? "—" : new Intl.DateTimeFormat("he-IL", { dateStyle: "medium", timeStyle: "short" }).format(d);
    };
    const esc = (s) => String(s ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
    const toast = (title, body = "", type = "info") => {
      const node = document.createElement("div");
      node.className = "toast";
      node.style.borderColor = type === "success" ? "#22c55e55" : type === "danger" ? "#ef444455" : "#7c3aed55";
      node.innerHTML = `<strong>${esc(title)}</strong><span>${esc(body)}</span>`;
      toastWrap.appendChild(node);
      setTimeout(() => node.remove(), 3800);
    };
    const showAuthTab = (name) => {
      authTabs.forEach((btn) => btn.classList.toggle("active", btn.dataset.authTab === name));
      loginForm.classList.toggle("hidden", name !== "login");
      registerForm.classList.toggle("hidden", name !== "register");
      resetForm.classList.toggle("hidden", name !== "reset");
    };
    const showAdminTab = (name) => {
      adminTabs.forEach((btn) => btn.classList.toggle("active", btn.dataset.adminTab === name));
      el("adminTabMarket").classList.toggle("hidden", name !== "market");
      el("adminTabBroadcast").classList.toggle("hidden", name !== "broadcast");
      el("adminTabUsers").classList.toggle("hidden", name !== "users");
      el("adminTabSettings").classList.toggle("hidden", name !== "settings");
      el("adminTabSecurity").classList.toggle("hidden", name !== "security");
    };

    const setTheme = (theme) => {
      state.theme = theme;
      document.body.dataset.theme = theme;
      localStorage.setItem("ffm-theme", theme);
      themeBtn.textContent = theme === "dark" ? "☾" : "☀";
    };

    const roleLabel = () => state.role === "admin" ? "מנהל" : "משתמש";
    const uidShort = (uid) => uid ? `${uid.slice(0, 5)}…${uid.slice(-4)}` : "—";
    const marketPath = (id) => `markets/${id}`;

    const isOpen = (market) => market && market.status === "open";
    const currentCoins = () => clamp(readNum(state.settings.defaultCoinsPerMarket, 10), 1, 100);
    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    const activeMarket = () => state.activeMarket;
    const myBet = (market) => market?.bets?.[auth.currentUser?.uid] || null;

    const odds = (market) => {
      const yes = readNum(market?.totalYes, 0);
      const no = readNum(market?.totalNo, 0);
      const total = yes + no;
      const yesOdds = total > 0 ? (yes / total) * 100 : 50;
      const noOdds = total > 0 ? (no / total) * 100 : 50;
      return { yes, no, total, yesOdds, noOdds };
    };

    const setVisible = (node, visible) => node.classList.toggle("hidden", !visible);
    const resetMarketInputs = () => { yesAmount.value = ""; noAmount.value = ""; };

    const renderSettings = () => {
      siteNameEl.textContent = state.settings.siteName || defaultSettings.siteName;
      siteTaglineEl.textContent = state.settings.siteTagline || defaultSettings.siteTagline;
      siteNameInput.value = state.settings.siteName || defaultSettings.siteName;
      siteTaglineInput.value = state.settings.siteTagline || defaultSettings.siteTagline;
      maintenanceModeInput.value = state.settings.maintenanceMode ? "on" : "off";
      defaultCoinsInput.value = state.settings.defaultCoinsPerMarket || 10;
    };

    const renderHeader = () => {
      roleChip.textContent = roleLabel();
      notificationState.textContent = state.notificationsEnabled ? "פועל" : "כבוי";
      activeMarketState.textContent = state.activeMarket ? `${state.activeMarket.question} · ${state.activeMarket.status}` : "אין שוק פעיל";
      broadcastState.textContent = state.settings.maintenanceMode ? "תחזוקה" : "רגיל";
      walletValue.textContent = fmt(state.wallet?.balance || 0);
      walletBalance.textContent = fmt(state.wallet?.balance || 0);
      profitTotal.textContent = fmt(state.wallet?.profit || 0);
      availableCoinsValue.textContent = String(currentCoins());
      rankValue.textContent = state.profile?.rank ? `#${state.profile.rank}` : "—";
    };

    const renderMarket = () => {
      const m = activeMarket();
      if (!m) {
        setVisible(marketEmpty, true);
        setVisible(marketCard, false);
        countdownValue.textContent = "—";
        return;
      }
      setVisible(marketEmpty, false);
      setVisible(marketCard, true);
      const o = odds(m);
      marketStatusBadge.innerHTML = `<span class="status-dot ${m.status}"></span><span>${m.status}</span>`;
      marketCategoryBadge.textContent = m.category || "custom";
      marketIdBadge.textContent = uidShort(m.id);
      marketQuestion.textContent = m.question || "—";
      marketDescription.textContent = m.description || "—";
      yesTotalValue.textContent = fmt(o.yes);
      noTotalValue.textContent = fmt(o.no);
      totalPoolValue.textContent = fmt(o.total);
      yesOddsValue.textContent = `${o.yesOdds.toFixed(1)}%`;
      yesOddsLabel.textContent = `${o.yesOdds.toFixed(1)}%`;
      noOddsLabel.textContent = `${o.noOdds.toFixed(1)}%`;
      yesProgress.style.width = `${o.yesOdds.toFixed(2)}%`;
      noProgress.style.width = `${o.noOdds.toFixed(2)}%`;
      myBetSummary.textContent = myBet(m) ? `כן ${readNum(myBet(m).yes,0)} / לא ${readNum(myBet(m).no,0)}` : "טרם הימרת";
      myRemainingCoins.textContent = String(readNum(myBet(m)?.remaining, currentCoins()));
      marketOpenedAt.textContent = ts(m.openedAt || m.createdAt);
      marketClosesAt.textContent = ts(m.closesAt);
      const ms = readNum(m.closesAt, 0) - Date.now();
      countdownValue.textContent = m.status === "open" ? (ms > 0 ? new Date(ms).toISOString().substr(14, 5) : "00:00") : m.status;
      betHelper.textContent = m.status === "open"
        ? `ניתן לפזר עד ${currentCoins()} מטבעות זמניים בסבב.`
        : "השוק סגור כרגע. ניתן לצפות בלבד.";
      placeBetBtn.disabled = m.status !== "open";
    };

    const renderHistory = () => {
      const items = state.markets.filter((m) => ["closed","resolved"].includes(m.status)).slice(0, 18);
      historyCount.textContent = String(items.length);
      if (!items.length) {
        historyList.innerHTML = `<div class="soft" style="padding:24px;text-align:center;">אין עדיין היסטוריה.</div>`;
        return;
      }
      historyList.innerHTML = items.map((m) => {
        const o = odds(m);
        return `<div class="list-item"><strong>${esc(m.question)}</strong><small>כן ${fmt(o.yes)} · לא ${fmt(o.no)} · ${esc(m.status)} · ${esc(ts(m.closedAt || m.resolvedAt))}</small></div>`;
      }).join("");
    };

    const renderLeaderboard = () => {
      const items = [...state.users].sort((a,b) => (readNum(b.balance,0)-readNum(a.balance,0))).slice(0, 12);
      leaderboardCount.textContent = String(items.length);
      if (!items.length) {
        leaderboardList.innerHTML = `<div class="soft" style="padding:24px;text-align:center;">אין נתונים להצגה.</div>`;
        return;
      }
      leaderboardList.innerHTML = items.map((u, idx) => `<div class="list-item"><strong>#${idx+1} ${esc(u.displayName)}</strong><small>${esc(u.email || "")} · balance ${fmt(u.balance || 0)} · profit ${fmt(u.profit || 0)}</small></div>`).join("");
    };

    const renderActivity = () => {
      const items = state.activity.slice(0, 12);
      activityCount.textContent = String(items.length);
      if (!items.length) {
        activityList.innerHTML = `<div class="soft" style="padding:24px;text-align:center;">אין פעילות להצגה.</div>`;
        return;
      }
      activityList.innerHTML = items.map((a) => `<div class="list-item"><strong>${esc(a.title || a.kind || "log")}</strong><small>${esc(a.detail || "")} · ${esc(ts(a.createdAt))}</small></div>`).join("");
    };

    const renderMyBets = () => {
      const items = state.myBets.slice(0, 10);
      myBetsCount.textContent = String(items.length);
      if (!items.length) {
        myBetsList.innerHTML = `<div class="soft" style="padding:24px;text-align:center;">טרם ביצעת הימורים.</div>`;
        return;
      }
      myBetsList.innerHTML = items.map((b) => `<div class="list-item"><strong>${esc(b.question)}</strong><small>כן ${fmt(b.yes)} · לא ${fmt(b.no)} · remaining ${fmt(b.remaining)} · ${esc(b.status || "open")}</small></div>`).join("");
    };

    const renderAdminMarkets = () => {
      const items = state.markets.slice(0, 16);
      if (!items.length) {
        adminMarketList.innerHTML = `<div class="soft" style="padding:24px;text-align:center;">אין שווקים להצגה.</div>`;
        return;
      }
      adminMarketList.innerHTML = items.map((m) => `<div class="list-item"><strong>${esc(m.question)}</strong><small>${esc(m.description || "")}<br>id ${esc(m.id)} · ${esc(m.status)} · כן ${fmt(odds(m).yes)} · לא ${fmt(odds(m).no)}</small></div>`).join("");
    };

    const renderBroadcastQueue = () => {
      const items = state.broadcasts.slice(0, 10);
      broadcastCountValue.textContent = String(items.length);
      if (!items.length) {
        broadcastQueueList.innerHTML = `<div class="soft" style="padding:24px;text-align:center;">אין הודעות בתור.</div>`;
        return;
      }
      broadcastQueueList.innerHTML = items.map((j) => `<div class="list-item"><strong>${esc(j.title || "broadcast")}</strong><small>${esc(j.body || "")} · ${esc(j.type || "custom")} · ${esc(j.status || "queued")}</small></div>`).join("");
    };

    const renderUsersTable = () => {
      const q = String(adminUserSearch.value || "").toLowerCase().trim();
      const items = state.users.filter((u) => !q || [u.uid, u.email, u.displayName, u.role].some((x) => String(x || "").toLowerCase().includes(q)));
      usersCountValue.textContent = String(state.users.length);
      adminsCountValue.textContent = String(state.users.filter((u) => u.role === "admin").length);
      openMarketsCountValue.textContent = String(state.markets.filter((m) => m.status === "open").length);
      if (!items.length) {
        usersTableBody.innerHTML = `<tr><td colspan="6">אין תוצאות.</td></tr>`;
        return;
      }
      usersTableBody.innerHTML = items.map((u) => `
        <tr>
          <td><strong>${esc(u.displayName || "—")}</strong><br><small>${esc(uidShort(u.uid))}</small></td>
          <td>${esc(u.email || "—")}</td>
          <td>${esc(u.role || "user")}</td>
          <td>${fmt(u.balance || 0)}</td>
          <td>wins ${u.wins || 0}<br>profit ${fmt(u.profit || 0)}</td>
          <td><button class="btn secondary" data-role-toggle="${esc(u.uid)}">${u.role === "admin" ? "הסר admin" : "קבע admin"}</button></td>
        </tr>
      `).join("");
    };

    const renderAll = () => {
      renderSettings();
      renderHeader();
      renderMarket();
      renderHistory();
      renderLeaderboard();
      renderActivity();
      renderMyBets();
      renderAdminMarkets();
      renderBroadcastQueue();
      renderUsersTable();
    };

    const attachSettingsListener = () => {
      addSub(onValue(ref(db, "settings/public"), (snap) => {
        state.settings = { ...defaultSettings, ...(snap.val() || {}), maintenanceMode: !!(snap.val() || {}).maintenanceMode };
        renderAll();
      }));
    };

    const attachMarketsListener = () => {
      addSub(onValue(ref(db, "markets"), (snap) => {
        const raw = snap.val() || {};
        state.markets = Object.entries(raw).map(([id, m]) => ({ id, ...m }));
        state.activeMarket = state.markets.find((m) => m.status === "open") || state.markets.find((m) => m.id === state.settings.activeMarketId) || state.markets[0] || null;
        const uid = auth.currentUser?.uid;
        state.myBets = state.markets.filter((m) => m.bets && m.bets[uid]).map((m) => ({
          question: m.question,
          yes: m.bets[uid].yes || 0,
          no: m.bets[uid].no || 0,
          remaining: m.bets[uid].remaining ?? currentCoins(),
          status: m.status
        })).slice(0, 20);
        renderAll();
      }));
    };

    const attachProfilesListener = () => {
      addSub(onValue(ref(db, "profiles"), (snap) => {
        const raw = snap.val() || {};
        state.users = Object.entries(raw).map(([uid, p]) => ({
          uid,
          displayName: p.displayName || "משתמש",
          email: p.email || "",
          role: p.role || "user",
          balance: 0,
          profit: readNum(p.profit, 0),
          wins: readNum(p.wins, 0),
          losses: readNum(p.losses, 0),
          totalBets: readNum(p.totalBets, 0)
        }));
        renderLeaderboard();
        renderUsersTable();
      }));
    };

    const attachWalletsListener = () => {
      addSub(onValue(ref(db, "wallets"), (snap) => {
        const raw = snap.val() || {};
        state.users = state.users.map((u) => ({
          ...u,
          balance: readNum(raw[u.uid]?.balance, u.balance || 0),
          profit: readNum(raw[u.uid]?.profit, u.profit || 0)
        }));
        const mine = raw[auth.currentUser?.uid || ""];
        state.wallet = mine || state.wallet || { balance: 0, profit: 0 };
        renderAll();
      }));
    };

    const attachActivityListener = () => {
      addSub(onValue(ref(db, "audit/logs"), (snap) => {
        const raw = snap.val() || {};
        state.activity = Object.entries(raw).map(([id, a]) => ({ id, ...a })).sort((a,b) => readNum(b.createdAt,0) - readNum(a.createdAt,0));
        renderActivity();
      }));
    };

    const attachQueueListener = () => {
      addSub(onValue(ref(db, "adminQueue"), (snap) => {
        const raw = snap.val() || {};
        state.broadcasts = Object.entries(raw.broadcasts || {}).map(([id, x]) => ({ id, ...x })).sort((a,b) => readNum(b.createdAt,0) - readNum(a.createdAt,0));
        renderBroadcastQueue();
      }));
    };

    const attachRoleListener = () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      addSub(onValue(ref(db, `roles/${uid}`), (snap) => {
        state.role = snap.val()?.admin ? "admin" : "user";
        roleChip.textContent = roleLabel();
        adminPanel.classList.toggle("hidden", state.role !== "admin");
        renderUsersTable();
      }));
    };

    const attachSelfListeners = () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      addSub(onValue(ref(db, `profiles/${uid}`), (snap) => {
        const p = snap.val() || {};
        state.profile = { ...p, uid };
        rankValue.textContent = p.rank ? `#${p.rank}` : "—";
      }));
      addSub(onValue(ref(db, `wallets/${uid}`), (snap) => {
        state.wallet = snap.val() || { balance: 0, profit: 0 };
        renderHeader();
      }));
    };

    const openAuth = () => { authView.classList.remove("hidden"); appView.classList.add("hidden"); };
    const openApp = () => { authView.classList.add("hidden"); appView.classList.remove("hidden"); };

    const bootstrapProfile = async (user) => {
      const pRef = ref(db, `profiles/${user.uid}`);
      const wRef = ref(db, `wallets/${user.uid}`);
      const pSnap = await get(pRef);
      if (!pSnap.exists()) {
        await set(pRef, {
          displayName: user.displayName || user.email.split("@")[0],
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          wins: 0,
          losses: 0,
          profit: 0,
          totalBets: 0
        });
      }
      const wSnap = await get(wRef);
      if (!wSnap.exists()) {
        await set(wRef, { balance: 0, lifetimeWinnings: 0, lifetimeStaked: 0, profit: 0, updatedAt: serverTimestamp() });
      }
    };

    const loadSession = async (user) => {
      state.user = user;
      await bootstrapProfile(user);
      attachSettingsListener();
      attachMarketsListener();
      attachProfilesListener();
      attachWalletsListener();
      attachActivityListener();
      attachQueueListener();
      attachRoleListener();
      attachSelfListeners();
      openApp();
      renderAll();
      if (!state.liveTimer) {
        state.liveTimer = setInterval(renderMarket, 1000);
      }
    };

    const signIn = async (email, password) => signInWithEmailAndPassword(auth, email, password);
    const signUp = async (name, email, password) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      return cred.user;
    };

    const wireAuth = () => {
      authTabs.forEach((btn) => btn.addEventListener("click", () => showAuthTab(btn.dataset.authTab)));
      el("showLoginLink").addEventListener("click", () => showAuthTab("login"));
      el("showRegisterLink")?.addEventListener("click", (e) => { e.preventDefault(); showAuthTab("register"); });
      el("cancelResetBtn").addEventListener("click", () => showAuthTab("login"));

      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try { await signIn(loginEmail.value.trim(), loginPassword.value); toast("ברוך הבא", "התחברת בהצלחה", "success"); }
        catch (err) { console.error(err); toast("כניסה נכשלה", "בדוק את פרטי ההתחברות", "danger"); }
      });

      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (registerPassword.value !== registerPassword2.value) return toast("אי התאמה", "הסיסמאות לא זהות", "warning");
        if ((registerPassword.value || "").length < 8) return toast("סיסמה חלשה", "לפחות 8 תווים", "warning");
        try { await signUp(registerName.value.trim(), registerEmail.value.trim(), registerPassword.value); toast("נוצר חשבון", "התחברת אוטומטית", "success"); }
        catch (err) { console.error(err); toast("הרשמה נכשלה", "בדוק אם האימייל כבר קיים", "danger"); }
      });

      resetForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try { await sendPasswordResetEmail(auth, resetEmail.value.trim()); toast("נשלח", "מייל איפוס נשלח", "success"); }
        catch (err) { console.error(err); toast("שגיאה", "לא ניתן לשלוח מייל איפוס", "danger"); }
      });
    };

    const wireMain = () => {
      themeBtn.addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
      logoutBtn.addEventListener("click", async () => signOut(auth));
      refreshBtn.addEventListener("click", () => renderAll());
      notifyBtn.addEventListener("click", enableNotifications);
      enableNotificationsBtn.addEventListener("click", enableNotifications);
      guestPreviewBtn.addEventListener("click", () => toast("מצב צפייה", "הצפייה פעילה. התחברות נדרשת להימור.", "info"));
      maxYesBtn.addEventListener("click", () => { yesAmount.value = String(currentCoins()); noAmount.value = "0"; });
      maxNoBtn.addEventListener("click", () => { noAmount.value = String(currentCoins()); yesAmount.value = "0"; });
      clearBetBtn.addEventListener("click", resetMarketInputs);
      placeBetBtn.addEventListener("click", placeBet);
      document.addEventListener("click", async (e) => {
        const roleBtn = e.target.closest("[data-role-toggle]");
        if (roleBtn) {
          if (state.role !== "admin") return;
          const uid = roleBtn.getAttribute("data-role-toggle");
          await toggleAdmin(uid);
        }
      });
      adminTabs.forEach((btn) => btn.addEventListener("click", () => showAdminTab(btn.dataset.adminTab)));
      createMarketForm.addEventListener("submit", createMarketHandler);
      broadcastForm.addEventListener("submit", broadcastHandler);
      siteSettingsForm.addEventListener("submit", settingsHandler);
      reloadSettingsBtn.addEventListener("click", () => updateSettingsUI());
      openMarketBtn.addEventListener("click", () => openMarket());
      closeMarketBtn.addEventListener("click", () => closeMarket());
      requestResolveBtn.addEventListener("click", () => requestResolution());
      seedDemoBtn.addEventListener("click", seedDemo);
      testBroadcastBtn.addEventListener("click", queueTestBroadcast);
      adminUserSearch.addEventListener("input", renderUsersTable);
      copyRulesBtn.addEventListener("click", () => copyToClipboard(FIREBASE_RULES_TEMPLATE, "חוקי Firebase"));
      copySwBtn.addEventListener("click", () => copyToClipboard(FIREBASE_SW_TEMPLATE, "Service Worker"));
      copyFunctionsBtn.addEventListener("click", () => copyToClipboard(FIREBASE_FUNCTIONS_TEMPLATE, "Functions"));
      onMessage(messaging, (payload) => {
        toast(payload.notification?.title || "התראה חדשה", payload.notification?.body || "", "success");
      });
    };

    const copyToClipboard = async (text, label) => {
      try { await navigator.clipboard.writeText(text); toast(label, "הועתק ללוח", "success"); }
      catch { toast("שגיאה", "לא ניתן להעתיק", "danger"); }
    };

    const enableNotifications = async () => {
      if (!("Notification" in window)) return toast("לא נתמך", "הדפדפן לא תומך בהתראות", "warning");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return toast("נדחה", "יש לאשר התראות", "warning");
      const reg = await navigator.serviceWorker.register("./firebase-messaging-sw.js");
      const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg });
      if (!token) return toast("ללא token", "לא התקבל טוקן", "warning");
      state.notificationsEnabled = true;
      notificationState.textContent = "פועל";
      await set(ref(db, `notifications/tokens/${auth.currentUser.uid}/${token.slice(0, 20)}`), { token, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), active: true });
      toast("FCM הופעל", "הטוקן נשמר", "success");
      renderHeader();
    };

    const getCurrentMarketId = () => state.activeMarket?.id || state.settings.activeMarketId || null;

    const placeBet = async () => {
      const market = activeMarket();
      if (!market || market.status !== "open") return toast("שוק סגור", "אי אפשר להמר עכשיו", "warning");
      const y = clamp(readNum(yesAmount.value, 0), 0, currentCoins());
      const n = clamp(readNum(noAmount.value, 0), 0, currentCoins());
      if (y + n <= 0) return toast("הימור ריק", "הכנס ערכים", "warning");
      if (y + n > currentCoins()) return toast("חריגה", "מותר עד 10 מטבעות", "warning");
      const uid = auth.currentUser.uid;
      try {
        await runTransaction(ref(db, marketPath(market.id)), (current) => {
          if (!current || current.status !== "open") return current;
          current.bets = current.bets || {};
          const existing = current.bets[uid] || { yes: 0, no: 0, remaining: currentCoins() };
          if (readNum(existing.remaining, currentCoins()) < y + n) return;
          current.bets[uid] = {
            yes: readNum(existing.yes, 0) + y,
            no: readNum(existing.no, 0) + n,
            remaining: readNum(existing.remaining, currentCoins()) - (y + n),
            updatedAt: Date.now(),
            displayName: state.profile?.displayName || auth.currentUser.displayName || auth.currentUser.email
          };
          current.totalYes = readNum(current.totalYes, 0) + y;
          current.totalNo = readNum(current.totalNo, 0) + n;
          current.totalVolume = readNum(current.totalVolume, 0) + y + n;
          current.totalBettors = current.bets[uid] && current.bets[uid].remaining === currentCoins() ? readNum(current.totalBettors, 0) + 1 : readNum(current.totalBettors, 0);
          return current;
        });
        await update(ref(db, `profiles/${uid}`), { totalBets: readNum(state.profile?.totalBets, 0) + 1, updatedAt: serverTimestamp() });
        await push(ref(db, "audit/logs"), { kind: "bet", title: "הימור נרשם", detail: `${uidShort(uid)} yes ${y} no ${n}`, createdAt: serverTimestamp(), actor: uid });
        yesAmount.value = ""; noAmount.value = "";
        toast("הימור נשמר", "ההימור נוסף לשוק", "success");
      } catch (err) {
        console.error(err);
        toast("שגיאה", "ההימור לא נשמר", "danger");
      }
    };

    const createMarketHandler = async (e) => {
      e.preventDefault();
      if (state.role !== "admin") return toast("אין הרשאה", "רק מנהל יכול", "danger");
      const question = marketQuestionInput.value.trim();
      if (!question) return toast("חסר שאלה", "יש להזין שאלה", "warning");
      const id = push(ref(db, "markets")).key;
      const minutes = clamp(readNum(marketMinutesInput.value, 30), 1, 10080);
      const openNow = marketInitialStatusInput.value === "open";
      const payload = {
        question,
        description: marketDescriptionInput.value.trim(),
        category: marketCategoryInput.value,
        status: openNow ? "open" : "draft",
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        createdByName: state.profile?.displayName || auth.currentUser.email,
        openedAt: openNow ? serverTimestamp() : null,
        closesAt: openNow ? Date.now() + minutes * 60 * 1000 : null,
        closedAt: null,
        resolvedAt: null,
        result: null,
        totalYes: 0,
        totalNo: 0,
        totalVolume: 0,
        totalBettors: 0,
        defaultCoins: currentCoins(),
        bets: {},
        settlement: {}
      };
      await set(ref(db, `markets/${id}`), payload);
      await update(ref(db, "settings/public"), { activeMarketId: id });
      if (marketAutoNotifyInput.value === "yes") {
        await push(ref(db, "adminQueue/broadcasts"), {
          title: question,
          body: marketDescriptionInput.value.trim(),
          target: "all",
          type: "market_open",
          status: "queued",
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser.uid
        });
      }
      toast("שוק נוצר", id, "success");
      renderAll();
    };

    const openMarket = async () => {
      const market = activeMarket();
      if (!market) return toast("אין שוק", "אין שוק לפתיחה", "warning");
      await update(ref(db, `markets/${market.id}`), { status: "open", openedAt: serverTimestamp(), closesAt: Date.now() + 30 * 60 * 1000 });
      await update(ref(db, "settings/public"), { activeMarketId: market.id });
      toast("השוק נפתח", market.question, "success");
    };

    const closeMarket = async () => {
      const market = activeMarket();
      if (!market) return toast("אין שוק", "אין שוק לסגירה", "warning");
      await update(ref(db, `markets/${market.id}`), { status: "closed", closedAt: serverTimestamp() });
      toast("השוק נסגר", market.question, "warning");
    };

    const requestResolution = async () => {
      const market = activeMarket();
      if (!market) return toast("אין שוק", "אין שוק להכרעה", "warning");
      const result = String(prompt("הכנס תוצאה: yes / no / draw", "yes") || "").trim().toLowerCase();
      if (!["yes","no","draw"].includes(result)) return toast("תוצאה לא חוקית", "הכנס yes / no / draw", "warning");
      await push(ref(db, "adminQueue/resolutions"), {
        marketId: market.id,
        result,
        status: "queued",
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });
      await push(ref(db, "adminQueue/broadcasts"), {
        title: "הכרעת שוק בתהליך",
        body: `השוק ${market.question} נמצא בהכרעה.`,
        target: "all",
        type: "market_resolve",
        status: "queued",
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });
      toast("הכרעה בתור", "Cloud Function תבצע settlement", "success");
    };

    const seedDemo = async () => {
      if (state.role !== "admin") return;
      marketQuestionInput.value = "האם תהיה אזעקה ב-6 השעות הקרובות?";
      marketDescriptionInput.value = "שוק דמו לבדיקת ממשק, תחזיות וחלוקת רווחים.";
      marketCategoryInput.value = "alerts";
      marketMinutesInput.value = 120;
      marketInitialStatusInput.value = "open";
      marketAutoNotifyInput.value = "no";
      await createMarketHandler(new Event("submit"));
    };

    const broadcastHandler = async (e) => {
      e.preventDefault();
      if (state.role !== "admin") return toast("אין הרשאה", "רק מנהל יכול לשדר", "danger");
      const title = broadcastTitleInput.value.trim();
      const body = broadcastBodyInput.value.trim();
      if (!title || !body) return toast("חסר נתון", "כותרת ותוכן נדרשים", "warning");
      await push(ref(db, "adminQueue/broadcasts"), {
        title,
        body,
        target: broadcastTargetInput.value,
        type: broadcastTypeInput.value,
        status: "queued",
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });
      broadcastTitleInput.value = ""; broadcastBodyInput.value = "";
      toast("שידור בתור", "Cloud Function תשלח את ההתראה", "success");
    };

    const settingsHandler = async (e) => {
      e.preventDefault();
      if (state.role !== "admin") return toast("אין הרשאה", "רק מנהל יכול לערוך", "danger");
      await update(ref(db, "settings/public"), {
        siteName: siteNameInput.value.trim() || defaultSettings.siteName,
        siteTagline: siteTaglineInput.value.trim() || defaultSettings.siteTagline,
        maintenanceMode: maintenanceModeInput.value === "on",
        defaultCoinsPerMarket: clamp(readNum(defaultCoinsInput.value, 10), 1, 100),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid
      });
      toast("נשמר", "הגדרות עודכנו", "success");
    };

    const updateSettingsUI = () => renderSettings();

    const toggleAdmin = async (uid) => {
      if (state.role !== "admin") return;
      const snap = await get(ref(db, `roles/${uid}`));
      const current = snap.val()?.admin === true;
      await set(ref(db, `roles/${uid}`), { admin: !current, updatedAt: serverTimestamp(), updatedBy: auth.currentUser.uid });
      toast("תפקיד עודכן", `${uidShort(uid)} -> ${!current ? "admin" : "user"}`, "success");
    };

    const liveClock = () => {
      setInterval(() => {
        if (state.activeMarket && state.activeMarket.status === "open") renderMarket();
      }, 1000);
    };

    const init = () => {
      setTheme(state.theme);
      showAuthTab("login");
      showAdminTab("market");
      authTabs.forEach((btn) => btn.addEventListener("click", () => showAuthTab(btn.dataset.authTab)));
      wireAuth();
      wireMain();
      onAuthStateChanged(auth, async (user) => {
        clearSubs();
        state.user = user;
        state.profile = null;
        state.wallet = null;
        state.role = "user";
        state.activeMarket = null;
        state.markets = [];
        state.activity = [];
        state.broadcasts = [];
        state.myBets = [];
        if (!user) {
          openAuth();
          renderAll();
          return;
        }
        await bootstrapProfile(user);
        await loadSession(user);
        openApp();
        roleChip.textContent = roleLabel();
        adminPanel.classList.toggle("hidden", state.role !== "admin");
        if (!state.liveTimer) liveClock();
      });
    };

    async function bootstrapProfileLegacy(user) {
      const pRef = ref(db, `profiles/${user.uid}`);
      const wRef = ref(db, `wallets/${user.uid}`);
      const pSnap = await get(pRef);
      if (!pSnap.exists()) {
        await set(pRef, { displayName: user.displayName || user.email.split("@")[0], email: user.email, role: "user", createdAt: serverTimestamp(), updatedAt: serverTimestamp(), wins: 0, losses: 0, profit: 0, totalBets: 0 });
      }
      const wSnap = await get(wRef);
      if (!wSnap.exists()) {
        await set(wRef, { balance: 0, lifetimeWinnings: 0, lifetimeStaked: 0, profit: 0, updatedAt: serverTimestamp() });
      }
    }

    init();

    const FIREBASE_RULES_TEMPLATE = `{
  "rules": {
    ".read": false,
    ".write": false,

    "settings": {
      "public": {
        ".read": "auth != null",
        ".write": "root.child('roles').child(auth.uid).child('admin').val() === true"
      }
    },

    "profiles": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('roles').child(auth.uid).child('admin').val() === true)",
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['displayName','email'])"
      }
    },

    "wallets": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('roles').child(auth.uid).child('admin').val() === true)",
        ".write": "root.child('roles').child(auth.uid).child('admin').val() === true"
      }
    },

    "roles": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('roles').child(auth.uid).child('admin').val() === true)",
        ".write": "root.child('roles').child(auth.uid).child('admin').val() === true",
        ".validate": "newData.hasChildren(['admin'])"
      }
    },

    "notifications": {
      "tokens": {
        "$uid": {
          ".read": "auth != null && (auth.uid === $uid || root.child('roles').child(auth.uid).child('admin').val() === true)",
          ".write": "auth != null && auth.uid === $uid"
        }
      }
    },

    "markets": {
      "$marketId": {
        ".read": "auth != null",
        ".write": "root.child('roles').child(auth.uid).child('admin').val() === true",

        "bets": {
          "$uid": {
            ".read": "auth != null && (auth.uid === $uid || root.child('roles').child(auth.uid).child('admin').val() === true)",
            ".write": "auth != null && auth.uid === $uid && root.child('markets').child($marketId).child('status').val() === 'open'",
            ".validate": "newData.hasChildren(['yes','no','remaining'])"
          }
        }
      }
    },

    "adminQueue": {
      ".read": "root.child('roles').child(auth.uid).child('admin').val() === true",
      ".write": "root.child('roles').child(auth.uid).child('admin').val() === true",

      "broadcasts": {
        "$id": {
          ".validate": "newData.hasChildren(['title','body','target','type','status'])"
        }
      },

      "resolutions": {
        "$id": {
          ".validate": "newData.hasChildren(['marketId','result','status'])"
        }
      }
    },

    "audit": {
      "logs": {
        ".read": "root.child('roles').child(auth.uid).child('admin').val() === true",
        ".write": "auth != null"
      }
    }
  }
}`;
    const FIREBASE_SW_TEMPLATE = `/* firebase-messaging-sw.js */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '__API_KEY__',
  authDomain: '__AUTH_DOMAIN__',
  projectId: '__PROJECT_ID__',
  messagingSenderId: '__MESSAGING_SENDER_ID__',
  appId: '__APP_ID__'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Family Forecast Market';
  const options = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});`;
    const FIREBASE_FUNCTIONS_TEMPLATE = `// functions/index.js

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
    await db.ref(\`adminQueue/broadcasts/\${broadcastId}\`).update({ status: 'sent', delivered: 0 });
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

  await db.ref(\`adminQueue/broadcasts/\${broadcastId}\`).update({
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
  const marketRef = db.ref(\`markets/\${data.marketId}\`);
  const marketSnap = await marketRef.get();
  const market = marketSnap.val();

  if (!market || market.status === 'resolved') {
    await db.ref(\`adminQueue/resolutions/\${resolutionId}\`).update({ status: 'ignored' });
    return;
  }

  const result = String(data.result).toLowerCase();
  const bets = market.bets || {};
  const totalYes = Number(market.totalYes || 0);
  const totalNo = Number(market.totalNo || 0);
  const totalPool = totalYes + totalNo;
  const winningPool = result === 'yes' ? totalYes : result === 'no' ? totalNo : 0;

  const updates = {};
  updates[\`markets/\${data.marketId}/status\`] = 'resolved';
  updates[\`markets/\${data.marketId}/result\`] = result;
  updates[\`markets/\${data.marketId}/resolvedAt\`] = admin.database.ServerValue.TIMESTAMP;
  updates[\`markets/\${data.marketId}/closedAt\`] = market.closedAt || admin.database.ServerValue.TIMESTAMP;
  updates[\`markets/\${data.marketId}/settlement/result\`] = result;
  updates[\`markets/\${data.marketId}/settlement/processedAt\`] = admin.database.ServerValue.TIMESTAMP;
  updates[\`adminQueue/resolutions/\${resolutionId}/status\`] = 'processed';

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

    updates[\`wallets/\${uid}/balance\`] = Number((walletBalance + payout).toFixed(2));
    updates[\`wallets/\${uid}/lifetimeWinnings\`] = Number(((wallets[uid]?.lifetimeWinnings || 0) + payout).toFixed(2));
    updates[\`wallets/\${uid}/profit\`] = Number(((wallets[uid]?.profit || 0) + profit).toFixed(2));
    updates[\`profiles/\${uid}/wins\`] = result === 'yes' ? (profiles[uid]?.wins || 0) + 1 : (profiles[uid]?.wins || 0);
    updates[\`profiles/\${uid}/losses\`] = result === 'no' ? (profiles[uid]?.losses || 0) + 1 : (profiles[uid]?.losses || 0);
    updates[\`profiles/\${uid}/profit\`] = Number(((profiles[uid]?.profit || 0) + profit).toFixed(2));
    updates[\`profiles/\${uid}/updatedAt\`] = admin.database.ServerValue.TIMESTAMP;
  });

  const logKey = db.ref('audit/logs').push().key;
  updates[\`audit/logs/\${logKey}\`] = {
    kind: 'settlement',
    title: 'שוק הוכרע',
    detail: \`\${data.marketId} => \${result} / pool \${totalPool} / winning \${winningPool}\`,
    createdAt: admin.database.ServerValue.TIMESTAMP,
    actor: data.createdBy || 'system'
  };

  await db.ref().update(updates);
});`;

    window.__FIREBASE_RULES_TEMPLATE__ = FIREBASE_RULES_TEMPLATE;
    window.__FIREBASE_SW_TEMPLATE__ = FIREBASE_SW_TEMPLATE;
    window.__FIREBASE_FUNCTIONS_TEMPLATE__ = FIREBASE_FUNCTIONS_TEMPLATE;

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toast("קיצור דרך", "מוגדר כרגע רק בממשק", "info");
      }
    });
  