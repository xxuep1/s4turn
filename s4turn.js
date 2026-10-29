// BareMux & Proxy Setup
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
const bareUrl = (location.protocol === "https:" ? "https" : "http") + "://" + location.host + "/bare/";

const iframeWindow = document.getElementById("iframeWindow");
const browserHomeContainer = document.getElementById("browserHomeContainer");
const urlInput = document.getElementById("urlInput");
const searchButton = document.getElementById("searchButton");

// ==========================================
// Custom Configuration Variables
// ==========================================
const TOP_SIDEBAR_LOGO_URL = "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/saturngif.gif"; // Assign logo image URL here if desired

const SIDEBAR_ICON_URLS = {
    "home-view": "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/houseicon.png",
    "browser-view": "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/globeicon.png",
    "games-view": "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/gameicon.png",
    "apps-view": "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/appsicon.png",
    "music-view": "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/musicicon.png",
    "settings-view": "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/settingsicon.png"
};

const UI_ICON_URLS = {
    search: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/searchicon.png",
    newTab: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/plusicon.png",
    back: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/backarrowicon.png",
    forward: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/forwardarrowicon.png",
    refresh: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/refreshicon.png",
    home: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/houseicon.png",
    website: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/globeicon.png",
    fullscreen: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fullscreenicon.png",
    devTools: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/devtoolsicon.png",
    close: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/closeicon.png"
};

function createUiIcon(name, extraClass = "") {
    const img = document.createElement("img");
    img.className = `custom-ui-icon ${extraClass}`.trim();
    img.dataset.icon = name;
    img.alt = "";
    img.draggable = false;
    img.src = UI_ICON_URLS[name] || "";
    return img;
}

function applyUiIcons() {
    document.querySelectorAll("img.custom-ui-icon[data-icon]").forEach(img => {
        img.src = UI_ICON_URLS[img.dataset.icon] || "";
        img.draggable = false;
    });
}

// Wallpapers configuration
const WALLPAPERS = {
    1: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wp10726440-saturn-4k-wallpapers.jpg",
    2: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wp10726466-saturn-4k-wallpapers.jpg",
    3: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wp10726474-saturn-4k-wallpapers.jpg"
};

// Search Engines Mapping
const SEARCH_ENGINES = {
    duckduckgo: "https://duckduckgo.com/?q=",
    brave: "https://search.brave.com/search?q=",
    yahoo: "https://search.yahoo.com/search?p=",
    bing: "https://www.bing.com/search?q=",
    google: "https://www.google.com/search?q="
};

// Random swinging banner options
const SWINGING_TEXT_OPTIONS = [
    "woah s4turn back",
    "t!tan still goated yall",
    "remember the odyssey beef w t!tan",
    "nexora still exists btw",
    "people use htmls nowadays",
    "s4turn reborn before gta 6",
    "who actually reads these",
    "made during the baby u buggin meme",
    "2 + 2 = 4",
    "whats worse ixl or khan academy",
    "lightspeed gng here",
    "real proxies boring besides truffled",
    "sybau funny till variants came out",
    "surronster likes something i dont. i hate him",
    "t!tan still in its prime",
    "340 games on version 1 btw",
    "gooning > sleeping",
    "real eyes realize real lies",
    "maybe movies might come sometime",
    "shut up meg",
    "ebike kid humor is horrid",
    "veritys from minecraft >>>"
];

// User Preferences state
let currentSettings = {
    transport: "epoxy",
    searchEngine: "duckduckgo",
    colorInvert: false,
    wallpaper: "1"
};

// ==========================================
// Tab System State & Management
// ==========================================
let tabs = [
    { id: 1, title: "Home", url: "", history: [], historyIndex: -1, icon: "home" }
];
let activeTabId = 1;

window.addEventListener("DOMContentLoaded", () => {
    applyUiIcons();
    // Logo setup
    const customLogoImg = document.getElementById("customLogoImg");
    const defaultLogoText = document.getElementById("defaultLogoText");
    if (TOP_SIDEBAR_LOGO_URL.trim() !== "") {
        customLogoImg.src = TOP_SIDEBAR_LOGO_URL;
        customLogoImg.style.display = "block";
        defaultLogoText.style.display = "none";
    }

    document.querySelectorAll(".nav-btn[data-target] .sidebar-nav-icon").forEach(img => {
        const viewId = img.parentElement.getAttribute("data-target");
        const url = SIDEBAR_ICON_URLS[viewId];
        if (url && url.trim()) {
            img.src = url;
        } else {
            img.style.display = "none";
        }
    });

    // Force wallpaper background initialization
    document.body.classList.toggle("home-active", document.getElementById("home-view").classList.contains("active-view"));
    const wallpaperBg = document.getElementById("wallpaper-bg");
    wallpaperBg.style.backgroundImage = `url('${WALLPAPERS[currentSettings.wallpaper]}')`;

    // Initialize randomized swinging banner text
    initSwingingBanner();

    // Typewriter effect on home page
    initTypewriter();
    
    // Initialize Tab System UI
    renderTabs();

    // Settings UI Listeners
    setupSettingsListeners();

    // Fullscreen and hover header logic
    setupFullscreenControls();

    // Start live tracking loop for iframe URL and titles
    setupIframeLiveTracker();
});

function initSwingingBanner() {
    const el = document.getElementById("swingingText");
    if (el) {
        const randomIndex = Math.floor(Math.random() * SWINGING_TEXT_OPTIONS.length);
        el.textContent = SWINGING_TEXT_OPTIONS[randomIndex];
    }
}

// Typewriter Effect
function initTypewriter() {
    const titleEl = document.getElementById("typewriter-title");
    if (titleEl) titleEl.textContent = "s4turn reborn";
}

// Sidebar View Switching Logic
document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        
        document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".view").forEach(view => view.classList.remove("active-view"));
        
        button.classList.add("active");
        document.getElementById(targetId).classList.add("active-view");

        if (targetId === "home-view") {
            document.body.classList.add("home-active");
        } else {
            document.body.classList.remove("home-active");
        }
    });
});

function switchView(viewId) {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        if (btn.getAttribute("data-target") === viewId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    document.querySelectorAll(".view").forEach(view => view.classList.remove("active-view"));
    document.getElementById(viewId).classList.add("active-view");

    if (viewId === "home-view") {
        document.body.classList.add("home-active");
    } else {
        document.body.classList.remove("home-active");
    }
}

async function loadShortcutFavicons() {
    const shortcuts = [...document.querySelectorAll(".shortcut-icon[data-url]")];
    if (!shortcuts.length) return;

    const canProxy = typeof __uv$config !== "undefined";
    const proxied = url => __uv$config.prefix + __uv$config.encodeUrl(url);

    const checkImage = (src, timeout = 5500) => new Promise(resolve => {
        const probe = new Image();
        let finished = false;
        const timer = setTimeout(() => finish(false), timeout);
        function finish(ok) {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            probe.onload = null;
            probe.onerror = null;
            resolve(ok);
        }
        probe.onload = () => finish(probe.naturalWidth > 0);
        probe.onerror = () => finish(false);
        probe.src = src;
    });

    const entries = shortcuts.map(shortcut => {
        const image = shortcut.querySelector("img");
        const website = new URL(shortcut.dataset.url, location.href);
        if (image) {
            image.alt = shortcut.title || website.hostname;
            image.style.display = "block";
            const oldPlaceholder = shortcut.querySelector(".shortcut-fallback-icon");
            if (oldPlaceholder) oldPlaceholder.remove();
        }
        return { shortcut, image, website };
    });

    await Promise.all(entries.map(async ({ shortcut, image, website }) => {
        if (!image) return;
        const sources = [
            `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(website.origin)}&sz=64`,
            `https://icons.duckduckgo.com/ip3/${website.hostname}.ico`,
            new URL("/favicon.ico", website).href
        ];
        for (const src of sources) {
            if (await checkImage(src, 4500)) {
                image.src = src;
                return;
            }
        }
        image.style.display = "none";
        const placeholder = createUiIcon("website", "shortcut-fallback-icon");
        shortcut.appendChild(placeholder);
    }));

    if (!canProxy || !("serviceWorker" in navigator)) return;

    try {
        const controller = navigator.serviceWorker;
        await Promise.race([
            controller.ready,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Proxy unavailable")), 6500))
        ]);
        if (!await connection.getTransport()) {
            await connection.setTransport(currentSettings.transport === "epoxy" ? "/epoxy/index.mjs" : "/baremod/index.mjs", currentSettings.transport === "epoxy" ? [{ wisp: wispUrl }] : [bareUrl]);
        }
    } catch (error) {
        return;
    }

    await Promise.all(entries.map(async ({ image, website }) => {
        if (!image) return;
        try {
            const abort = new AbortController();
            const timer = setTimeout(() => abort.abort(), 6500);
            let response;
            try {
                response = await fetch(proxied(website.href), { signal: abort.signal });
            } finally {
                clearTimeout(timer);
            }
            if (!response.ok) return;
            const doc = new DOMParser().parseFromString(await response.text(), "text/html");
            const links = [...doc.querySelectorAll('link[rel][href]')];
            const selected = links.find(link => /(?:^|\s)(?:shortcut\s+)?icon(?:\s|$)/i.test(link.getAttribute("rel"))) ||
                links.find(link => /apple-touch-icon/i.test(link.getAttribute("rel")));
            const candidates = [];
            if (selected) candidates.push(new URL(selected.getAttribute("href"), website.href).href);
            candidates.push(new URL("/favicon.ico", website).href);
            for (const candidate of candidates) {
                const source = candidate.startsWith("data:") ? candidate : proxied(candidate);
                if (await checkImage(source, 5000)) {
                    image.src = source;
                    image.style.display = "block";
                    return;
                }
            }
        } catch (error) {
        }
    }));
}

loadShortcutFavicons();

// Shortcut Icons on Home View
document.querySelectorAll(".shortcut-icon").forEach(icon => {
    const rawUrl = icon.getAttribute("data-url");
    if (!rawUrl) return;
    const url = new URL(rawUrl, location.href).href;
    const ultravioletUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
    icon.dataset.uvUrl = ultravioletUrl;

    icon.addEventListener("click", async () => {
        switchView("browser-view");
        await loadProxyUrl(url, true, icon.dataset.uvUrl);
    });
});

// Home Search Bar Handlers
document.getElementById("homeSearchBtn").addEventListener("click", async () => {
    const val = document.getElementById("homeUrlInput").value.trim();
    if (val) {
        switchView("browser-view");
        await loadProxyUrl(val);
    }
});

document.getElementById("homeUrlInput").addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("homeSearchBtn").click();
    }
});

// Browser Home State Search Handler
document.getElementById("browserHomeSearchBtn").addEventListener("click", async () => {
    const val = document.getElementById("browserHomeInput").value.trim();
    if (val) {
        await loadProxyUrl(val);
    }
});

document.getElementById("browserHomeInput").addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("browserHomeSearchBtn").click();
    }
});

// ==========================================
// Advanced Chrome-Style Tab System Logic
// ==========================================
function renderTabs() {
    const container = document.getElementById("browserTabsContainer");
    const newTabBtn = document.getElementById("newTabBtn");
    
    container.querySelectorAll(".browser-tab").forEach(el => el.remove());

    tabs.forEach(tab => {
        const tabEl = document.createElement("div");
        tabEl.className = `browser-tab ${tab.id === activeTabId ? "active" : ""}`;
        const tabIcon = createUiIcon(tab.icon);
        const tabTitle = document.createElement("span");
        tabTitle.textContent = tab.title;
        const closeIcon = createUiIcon("close", "close-tab");
        closeIcon.dataset.id = tab.id;
        tabEl.append(tabIcon, tabTitle, closeIcon);

        tabEl.addEventListener("click", (e) => {
            if (e.target.classList.contains("close-tab")) {
                e.stopPropagation();
                closeTab(tab.id);
            } else {
                switchTab(tab.id);
            }
        });

        container.insertBefore(tabEl, newTabBtn);
    });
}

function addNewTab(url = "") {
    const newId = Date.now();
    tabs.push({
        id: newId,
        title: url ? url : "Home",
        url: url,
        history: url ? [url] : [],
        historyIndex: url ? 0 : -1,
        icon: url ? "website" : "home"
    });
    switchTab(newId);
    if (url) {
        loadProxyUrl(url);
    } else {
        showBrowserHome();
    }
}

function closeTab(id) {
    if (tabs.length === 1) {
        tabs[0] = { id: Date.now(), title: "Home", url: "", history: [], historyIndex: -1, icon: "home" };
        showBrowserHome();
        renderTabs();
        return;
    }

    const index = tabs.findIndex(t => t.id === id);
    tabs = tabs.filter(t => t.id !== id);

    if (activeTabId === id) {
        activeTabId = tabs[Math.max(0, index - 1)].id;
        loadActiveTabState();
    }
    renderTabs();
}

function switchTab(id) {
    activeTabId = id;
    renderTabs();
    loadActiveTabState();
}

function showBrowserHome() {
    iframeWindow.style.display = "none";
    browserHomeContainer.style.display = "flex";
    iframeWindow.src = "";
    urlInput.value = "";
}

function hideBrowserHome() {
    browserHomeContainer.style.display = "none";
    iframeWindow.style.display = "block";
}

function loadActiveTabState() {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.url) {
        hideBrowserHome();
        urlInput.value = tab.url;
        iframeWindow.src = __uv$config.prefix + __uv$config.encodeUrl(tab.url);
    } else {
        showBrowserHome();
    }
}

document.getElementById("newTabBtn").addEventListener("click", () => {
    addNewTab();
});

// Navigation Controls
document.getElementById("backBtn").addEventListener("click", () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.historyIndex > 0) {
        tab.historyIndex--;
        tab.url = tab.history[tab.historyIndex];
        loadProxyUrl(tab.url, false);
    }
});

document.getElementById("forwardBtn").addEventListener("click", () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.historyIndex < tab.history.length - 1) {
        tab.historyIndex++;
        tab.url = tab.history[tab.historyIndex];
        loadProxyUrl(tab.url, false);
    }
});

document.getElementById("refreshBtn").addEventListener("click", () => {
    if (iframeWindow.style.display !== "none") {
        iframeWindow.contentWindow.location.reload();
    }
});

document.getElementById("homeTabBtn").addEventListener("click", () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        tab.url = "";
        tab.title = "Home";
        tab.icon = "home";
        renderTabs();
    }
    showBrowserHome();
});

async function loadProxyUrl(rawUrl, pushHistory = true, ultravioletUrl = null) {
    let url = rawUrl;
    let searchBase = SEARCH_ENGINES[currentSettings.searchEngine] || SEARCH_ENGINES.duckduckgo;

    if (!url.includes(".")) {
        url = searchBase + encodeURIComponent(url);
    } else {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
    }

    if (!await connection.getTransport()) {
        await connection.setTransport(currentSettings.transport === "epoxy" ? "/epoxy/index.mjs" : "/baremod/index.mjs", currentSettings.transport === "epoxy" ? [{ wisp: wispUrl }] : [bareUrl]);
    }
    
    hideBrowserHome();
    urlInput.value = url;
    iframeWindow.src = ultravioletUrl || (__uv$config.prefix + __uv$config.encodeUrl(url));

    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        tab.url = url;
        tab.title = url;
        tab.icon = "website";
        if (pushHistory) {
            tab.history = tab.history.slice(0, tab.historyIndex + 1);
            tab.history.push(url);
            tab.historyIndex = tab.history.length - 1;
        }
        renderTabs();
    }
}

urlInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});

searchButton.onclick = async function (event) {
    event.preventDefault();
    let val = urlInput.value.trim();
    if (val) {
        await loadProxyUrl(val);
    }
};

// Live URL & Title Tracker for inside the iframe
function setupIframeLiveTracker() {
    setInterval(() => {
        try {
            if (iframeWindow.style.display !== "none" && iframeWindow.contentWindow) {
                const currentIframeSrc = iframeWindow.contentWindow.location.href;
                if (currentIframeSrc && currentIframeSrc.includes(__uv$config.prefix)) {
                    const encodedPart = currentIframeSrc.split(__uv$config.prefix)[1];
                    if (encodedPart) {
                        const decodedUrl = __uv$config.decodeUrl(encodedPart);
                        const tab = tabs.find(t => t.id === activeTabId);
                        if (tab && tab.url !== decodedUrl) {
                            tab.url = decodedUrl;
                            urlInput.value = decodedUrl;
                            
                            // Check title
                            if (iframeWindow.contentDocument && iframeWindow.contentDocument.title) {
                                tab.title = iframeWindow.contentDocument.title;
                            } else {
                                tab.title = decodedUrl;
                            }

                            // Append to history if it changed
                            if (tab.history[tab.historyIndex] !== decodedUrl) {
                                tab.history = tab.history.slice(0, tab.historyIndex + 1);
                                tab.history.push(decodedUrl);
                                tab.historyIndex = tab.history.length - 1;
                            }
                            renderTabs();
                        }
                    }
                }
            }
        } catch (err) {
            // Silence cross-origin polling errors
        }
    }, 800);
}

// ==========================================
// Fullscreen & Slide-down Browser Controls
// ==========================================
function setupFullscreenControls() {
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const browserHeader = document.getElementById("browserHeader");
    const browserView = document.getElementById("browser-view");
    const revealZone = document.createElement("div");
    revealZone.className = "fullscreen-header-reveal-zone";
    browserView.appendChild(revealZone);

    revealZone.addEventListener("mouseenter", () => {
        if (document.fullscreenElement === browserView) browserHeader.classList.remove("hidden-header");
    });

    browserHeader.addEventListener("mouseleave", event => {
        if (document.fullscreenElement === browserView && event.clientY > browserHeader.getBoundingClientRect().bottom) {
            browserHeader.classList.add("hidden-header");
        }
    });

    fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            browserView.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            browserHeader.classList.add("hidden-header");
        } else {
            browserHeader.classList.remove("hidden-header");
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (document.fullscreenElement) {
            if (e.clientY < 40) {
                browserHeader.classList.remove("hidden-header");
            } else if (e.clientY > 120) {
                browserHeader.classList.add("hidden-header");
            }
        }
    });
}

// HTML Dev Tools Modal
const devToolsModal = document.getElementById("devToolsModal");
document.getElementById("devToolsBtn").addEventListener("click", () => {
    const textarea = document.getElementById("devToolsTextarea");
    try {
        const frameDoc = iframeWindow.contentDocument || iframeWindow.contentWindow.document;
        textarea.value = frameDoc ? frameDoc.documentElement.outerHTML : "Unable to fetch frame HTML (Cross-origin restriction).";
    } catch (e) {
        textarea.value = "Error fetching HTML source due to security policy or cross-origin limits.";
    }
    devToolsModal.classList.add("active");
});

document.getElementById("closeDevTools").addEventListener("click", () => {
    devToolsModal.classList.remove("active");
});

// ==========================================
// Settings UI Logic
// ==========================================
function setupSettingsListeners() {
    const proxySelect = document.getElementById("settingProxyTransport");
    const searchSelect = document.getElementById("settingSearchEngine");
    const colorToggle = document.getElementById("settingColorInvert");
    const wallpaperSelect = document.getElementById("settingWallpaperSelect");
    const wallpaperBg = document.getElementById("wallpaper-bg");

    proxySelect.addEventListener("change", async (e) => {
        currentSettings.transport = e.target.value;
        await connection.setTransport(currentSettings.transport === "epoxy" ? "/epoxy/index.mjs" : "/baremod/index.mjs", currentSettings.transport === "epoxy" ? [{ wisp: wispUrl }] : [bareUrl]);
    });

    searchSelect.addEventListener("change", (e) => {
        currentSettings.searchEngine = e.target.value;
    });

    colorToggle.addEventListener("change", (e) => {
        currentSettings.colorInvert = e.target.checked;
        if (currentSettings.colorInvert) {
            document.body.classList.add("inverted");
        } else {
            document.body.classList.remove("inverted");
        }
    });

    wallpaperSelect.addEventListener("change", (e) => {
        currentSettings.wallpaper = e.target.value;
        wallpaperBg.style.backgroundImage = `url('${WALLPAPERS[currentSettings.wallpaper]}')`;
    });
}

// ==========================================
// Data Libraries (Games, Apps, Music)
// ==========================================

const games = [
    { title: "-3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minus33.jpg", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/-3__minus_3_.html" },
    { title: "-b", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minusbb.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/-b__minus_b_.html" },
    { title: "10 Minutes till Dawn", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/10-minutes-till-dawn_1x1.jpeg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/10-minutes-till-dawn.html" },
    { title: "12 Mini Battles", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/12minibattles.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/12-mini-battles.html" },
    { title: "1 Date Danger", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/onedatedangerr.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/1_Date_Danger.html" },
    { title: "1 On 1 Soccer", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/1-on-1-soccer.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/1-on-1soccer.html" },
    { title: "1 On 1 Tennis", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/1on1tennis.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/1-on-1tennis.html" },
    { title: "1v1.lol", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/1v1 loo.jpeg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/1v1.lol.html" },
    { title: "2048", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/2048logo.jpeg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/2048.html" },
    { title: "2048 Cupcakes", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/2048logocupcakes.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/2048-cupcakes.html" },
    { title: "2048 Merge Run", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/2048cubemergee.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/2048_Merge_Run.html" },
    { title: "20 Minutes Till Dawn", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/20minstilldawnn.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/20_Minutes_Till_Dawn.html" },
    { title: "3D Bolt Master", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/3dboltmasterr.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/3D_Bolt_Master.html" },
    { title: "3D Bowling", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/3dbowlingg.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/3D_Bowling.html" },
    { title: "3D Flight Simulator", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/3dflight.jpeg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/3D-flight-simulator.html" },
    { title: "60 Seconds Reatomized", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/60secondss.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/60_Seconds__Reatomized.html" },
    { title: "64 in 1 NES", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/64in11.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/64_in_1_NES.html" },
    { title: "8 Ball Classic", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/8ballclassiclogo.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/8-ball-classic.html" },
    { title: "8 Ball Pool", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/8ballpooll.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/8_Ball_Pool.html" },
    { title: "9007199254740992", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/90071gamee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/9007199254740992.html" },
    { title: "99 Balls", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/99ballss.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/99_Balls.html" },
    { title: "A Bite at Freddys", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/abiteatfreddyss.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/A_Bite_at_Freddy_s.html" },
    { title: "A Dance of Fire and Ice", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/adancee.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/A_Dance_of_Fire_and_Ice.html" },
    { title: "A Difficult Game About Climbing", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/adifficultt.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/A_Difficult_Game_About_Climbing.html" },
    { title: "A Game About Feeding A Black Hole", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/blackholee.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/A_Game_About_Feeding_A_Black_Hole" },
    { title: "A Small World Cup", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/asmallworldcupp.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/A_Small_World_Cup" },
    { title: "Abandoned", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/abandonedd.png", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/Abandoned.html" },
    { title: "Ace Attorney Investigations - Miles Edgeworth", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/aceattorneyy.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/Ace_Attorney_Investigations_-_Miles_Edgeworth.html" },
    { title: "Age of War", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ageofwar.jpeg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/age-of-war.html" },
    { title: "Age of War 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ageofwar2.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/age-of-war-2.html" },
    { title: "Ages of Conflict", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/agesofclonflictlogo.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/ages-of-conflict.html" },
    { title: "Among Us", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/amongus.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/among-us.html" },
    { title: "Angry Birds", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/angry%20birds.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/angry-birds.html" },
    { title: "Angry Birds Showdown", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/angrybirdsshowdown.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/angry-birds-showdown.html" },
    { title: "Angry Birds Space", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/angrybirdsspace.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/angry-birds-space.html" },
    { title: "Angry Neighbor", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/angryneighborr.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/angryneighborsinglefile/main/angryneighborsingle.html" },
    { title: "Awesome Tanks", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/awesome-tanks-game-icon.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/awesome-tanks.html" },
    { title: "Awesome Tanks 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/awesome-tanks-2-icon.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/awesome-tanks-2.html" },
    { title: "Axiom Verge", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/axiomvergee.png", htmlUrl: "https://raw.githubusercontent.com/xxuep1/axiom-verge-single-file/main/axiomvergesingle.html" },
    { title: "Backrooms", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/backroomsgame.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/backrooms.html" },
    { title: "Bacon May Die", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/baconmaydieeee.jpeg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bacon-may-die.html" },
    { title: "Bad Ice Cream", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/badicecream1.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bad-ice-cream.html" },
    { title: "Bad Ice Cream 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/badicecream2.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bad-ice-cream-2.html" },
    { title: "Bad Ice Cream 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/badicecream3.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bad-ice-cream-3.html" },
    { title: "Bad Parenting", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/badparentingg.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bad-parenting.html" },
    { title: "Bad Piggies", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/badpiggiess.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bad-piggies.html" },
    { title: "Baldi's Basics", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/baldisbasicss.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/baldisbasics.html" },
    { title: "Baseball Bros", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/baseballbross.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/baseball-bros.html" },
    { title: "Basketball Legends", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/basketball-legends-2020.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/basketball-legends.html" },
    { title: "Basketball Stars", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/basketballstarss.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/basketball-stars.html" },
    { title: "Basket Bros", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/basketbross.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/basket-bros.html" },
    { title: "Basket Random", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/basketrandomm.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/basket-random.html" },
    { title: "Bitlife", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bitlifee.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bitlife.html" },
    { title: "Bit Planes", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bitplaness.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bit-planes.htm" },
    { title: "Blocky Snakes", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/blockysnakess.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/blocky-snakes.html" },
    { title: "Bloons TD", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bloonstd1.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bloons-TD.html" },
    { title: "Bloons TD 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bloonstd2.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bloons-TD-2.html" },
    { title: "Bloons TD 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bloonstd3.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bloons-TD-3.html" },
    { title: "Bloons TD 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bloonstd4.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bloons-TD-4.html" },
    { title: "Bloons TD 5", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bloondtd5.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bloons-TD-5.html" },
    { title: "Bloxorz", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bloxorzz.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bloxorz.html" },
    { title: "Blumgi Racers", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/blumgiracerss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/blumgi-racers.html" },
    { title: "Blumgi Rocket", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/blumgirockett.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/blumgi-rocket.html" },
    { title: "Bob the Robber", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bobtherobber1.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bob-the-robber.html" },
    { title: "Bob the Robber 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bobtherobber2.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bob-the-robber-2.html" },
    { title: "Bob the Robber 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bobtherobber3.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bob-the-robber-3.html" },
    { title: "Bouncy Motors", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bouncymotorss.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bouncy-motors.html" },
    { title: "Bow Masters", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bowmasterssss.jpeg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bow-masters.html" },
    { title: "Boxing Random", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/boxingrandomm.jpeg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/boxing-random.htm" },
    { title: "Breaking the Bank", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/breakingthebankk.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/breaking-the-bank.html" },
    { title: "Bubble Shooter", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/bubbleshooterr.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/bubble-shooter.html" },
    { title: "CARRION", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/carrionn.jpe", htmlUrl: "https://raw.githubusercontent.com/AgentCube/carrion-wasm/main/singlefile.html" },
    { title: "Candy Crush", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/candycrushh.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/candy-crush.html" },
    { title: "Capybara Clicker", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/capybaraclickerr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/capybara-clicker.html" },
    { title: "Car Drawing", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/cardrawingg.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/car-drawing.html" },
    { title: "Car King Arena", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/carkingarenaa.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/car-king-arena.html" },
    { title: "Chess", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/chesss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/chess.html" },
    { title: "Choppy Orc", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/choppyorcc.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/choppy-orc.html" },
    { title: "Circlo O", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/circleoo.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/circloO.html" },
    { title: "Circlo O 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/circleoo2.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/circloO-2.html" },
    { title: "Clash of Vikings", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/clashofvikingss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/clash-of-vikings.html" },
    { title: "Cleanup.io", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/cleanupioo.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/cleanup-io.html" },
    { title: "Cluster Rush", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/clusterrushh.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/cluster-rush.html" },
    { title: "Cookie Clicker", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/cookieclickerr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/cookie-clicker.htm" },
    { title: "Crazy Cars", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/crazycarss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/crazy-cars.html" },
    { title: "Crazy Cattle 3d", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/crazycattle3dd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/crazy-cattle-3D.html" },
    { title: "Crazy Crash Landing", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/crazycrashlandingg.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/crazy-crash-landing.html" },
    { title: "Crazy Motorcycle", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/crazymotorcyclee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/crazy-motercycle.html" },
    { title: "Crossy Road", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/crossyroadd.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-HTML-Games-Pack/master/offline/crossy-road.htm" },
    { title: "Cut the Rope", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/cuttheropee.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/cut-the-rope.html" },
    { title: "Dadish", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/dadishh.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/dadish.html" },
    { title: "Dadish 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/dadishh2.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/dadish-2.html" },
    { title: "Dadish 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/dadishh3.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/dadish-3.html" },
    { title: "Deadly Descent", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/deadlydescentt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/deadly-descent.html" },
    { title: "Death Chase", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/deathchasee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/death-chase.html" },
    { title: "Death Run 3D", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/deathrun3dd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/death-run-3D.html" },
    { title: "Demolition Derby Crash Racing", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/demolitionderbyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/demolition-derby-crash-racing.html" },
    { title: "Doki Doki Literature Club", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/dokidokii.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/Doki_Doki_Literature_Club.html" },
    { title: "Doodle Jump", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/doodlejumpp.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/doodle-jump.html" },
    { title: "Draw Climber", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/drawclimberr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/draw-climber.html" },
    { title: "Dreadhead Parkour", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/dreadheadparkourr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/dreadhead-parkour.htm" },
    { title: "Drift Boss", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/driftbosss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/drift-boss.htm" },
    { title: "Drift Hunters Pro", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/drifthuntersproo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/drift-hunters-pro.html" },
    { title: "Drive Mad", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/drivemadd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/drive-mad.htm" },
    { title: "Duck Life", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ducklifee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/duck-life.html" },
    { title: "Duck Life 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ducklife22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/duck-life-2.html" },
    { title: "Duck Life 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ducklife33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/duck-life-3.html" },
    { title: "Duck Life 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ducklife44.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/duck-life-4.html" },
    { title: "Duck Life 5", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ducklife55.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/duck-life-5.html" },
    { title: "Ducklings.io", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ducklingsioo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ducklings-io.html" },
    { title: "Eagle Ride", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/eagleridee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/eagle-ride.html" },
    { title: "EaglerCraft 1.12", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minecraft1.12.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/1.12.html" },
    { title: "EaglerCraft 1.5", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minecraft1.5.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/1.5.html" },
    { title: "EaglerCraft 1.8", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minecraft1.8.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/1.8.html" },
    { title: "EaglerCraft 26.2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minecraft26.2.jpg", htmlUrl: "https://raw.githubusercontent.com/3lit3-Pl4y3r/eaglercraft-26.2/main/index.html" },
    { title: "EaglerCraft Alpha 1.2.6", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minecraftalpha.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/Alpha_1.2.6.html" },
    { title: "EaglerCraft Beta 1.3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minecraftbeta.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/Beta_1.3.html" },
    { title: "EaglerCraft Indev", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minecraftindev.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/Indev.html" },
    { title: "Earn to Die", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/earntodiee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/earn-to-die.html" },
    { title: "Earn to Die 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/earntodie22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/earn-to-die-2.html" },
    { title: "Eggy Car", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/eggycarr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/eggy-car.html" },
    { title: "Elastic Face", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/elasticskinn.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/elastic-face.htm" },
    { title: "Escape Road", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/escaperoadd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/escape-road.html" },
    { title: "Escape Road 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/escaperoad22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/escape-road-2.html" },
    { title: "Escape Road 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/escaperoad33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/escape-road-3.html" },
    { title: "Escaping the Prison", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/escapingtheprisonn.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/escaping-the-prison.html" },
    { title: "Eugenes Life", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/eugeneslifee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/eugenes-life.html" },
    { title: "Evil Glitch", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/evilglitchh.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/evil-glitch.html" },
    { title: "The Fancy Pants Adventures", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fancypantss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fancy-pants-adventure.html" },
    { title: "The Fancy Pants Adventures 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fancypants22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fancy-pants-adventure-2.html" },
    { title: "Fire Blob", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fireblobb.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fireblob.html" },
    { title: "Fire Boy and Water Girl", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/firewaterr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fireboy-and-watergirl.html" },
    { title: "Fire Boy and Water Girl 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/firewater22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fireboy-and-watergirl-2.html" },
    { title: "Fire Boy and Water Girl 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/firewater33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fireboy-and-watergirl-3.html" },
    { title: "Fire Boy and Water Girl 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/firewater44.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fireboy-and-watergirl-4.html" },
    { title: "Flappy Bird", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/flappybirdd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/flappy-bird.html" },
    { title: "Fleeing The Complex", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fleeingthecomplexx.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fleeing-the-complex.html" },
    { title: "Flood Runner 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/floodrunner22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/flood-runner-2.html" },
    { title: "Flood Runner 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/floodrunner33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/flood-runner-3.html" },
    { title: "Flood Runner 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/floodrunner44.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/flood-runner-4.html" },
    { title: "Five Nights at Freddys", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fnaf11.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fnaf.html" },
    { title: "Five Nights at Freddys 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fnaf22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fnaf-2.html" },
    { title: "Five Nights at Freddys 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fnaf33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fnaf-3.html" },
    { title: "Five Nights at Freddys 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fnaf44.jpg", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fnaf-4.html" },
    { title: "Five Nights at Freddys SL", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fnafsll.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fnaf-sister-location.html" },
    { title: "Football Bros", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/footballbross.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/football-bros.html" },
    { title: "Football Legends", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/footballlegendss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/football-legends.html" },
    { title: "Free Rider 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/freerider33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/free-rider-3.html" },
    { title: "Friday Night Funkin", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fridaynightfunkinn.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/friday-night-funkin.html" },
    { title: "Fruit Ninja", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/fruitninjaa.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/fruit-ninja.html" },
    { title: "Funny Battle", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/funnybattlee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/funny-battle.html" },
    { title: "Funny Battle 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/funnybattle22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/funny-battle-2.html" },
    { title: "Funny Mad Racing", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/funnymadracingg.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/funny-mad-racing.html" },
    { title: "Funny Shooter 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/funnyshooter22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/funny-shooter-2.html" },
    { title: "Gang Beasts", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/gangbeastss.jpg", htmlUrl: "https://raw.githubusercontent.com/xxuep1/webport-list-for-wasm.rip-but-sf/main/gangbeasts/gangbeastssf.html" },
    { title: "Geometry Dash Real", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/geometrydashwasmm.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/geometrydashreal.html" },
    { title: "Geometry Vibes", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/geometrydashvibess.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/geometry-vibes.html" },
    { title: "Get On Top", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/getontopp.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/get-on-top.html" },
    { title: "Getaway Shootout", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/getawayshootoutt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/getaway-shootout.htm" },
    { title: "Gladihoppers", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/gladihopperss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/gladi-hoppers.html" },
    { title: "Google Baseball", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/googlebaseballl.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/google-baseball.html" },
    { title: "Google Dino", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/googledinoo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/google-dino.html" },
    { title: "Gorilla Tag Winter Feb 2023", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/winterfeb20233.png", htmlUrl: "https://raw.githubusercontent.com/xxuep1/webport-list-for-wasm.rip-but-sf/main/gtagwinterfeb2023/winterfeb2023sf.html" },
    { title: "Grand Theft Auto III", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/gtaiii.jpe", htmlUrl: "https://raw.githubusercontent.com/woahhcrackers/GTA3Web/main/index.html" },
    { title: "Granny", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/grannyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/granny.html" },
    { title: "Granny 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/granny22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/granny-2.html" },
    { title: "Guess Their Answer", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/guesstheiranswerr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/guess-their-answer.html" },
    { title: "Hanger 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/hanger22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/hanger-2.html" },
    { title: "Happy Wheels", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/happywheelss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/happy-wheels.html" },
    { title: "Helix Jump", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/helixjumpp.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/helix-jump.html" },
    { title: "Highway Traffic", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/highwaytrafficc.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/highway-traffic.html" },
    { title: "Hill Climb Racing Lite", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/hillclimblitee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/hill-climb-racing-lite.html" },
    { title: "Hole.io", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/holeioo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/hole-io.html" },
    { title: "House of Hazards", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/houseofhazardss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/house-of-hazards.html" },
    { title: "Hover Racer Drive", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/hoverracerdrivee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/hover-racer-drive.html" },
    { title: "Ice Dodo", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/icedodoo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ice-dodo.html" },
    { title: "Idle Breakout", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/idlebreakoutt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/idlebreakout.html" },
    { title: "Idle Dice", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/idledicee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/idle-dice.html" },
    { title: "Infiltrating The Airship", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/infiltratingtheairshipp.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/infiltrating-the-airship.html" },
    { title: "Iron Snout", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ironsnoutt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/iron-snout.html" },
    { title: "Jacksmith", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/jacksmithh.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/jacksmith.html" },
    { title: "Jetpack Joyride", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/jetpackk.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/jetpack-joyride.html" },
    { title: "Johnny Trigger", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/johnnytriggerr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/johnny-trigger.html" },
    { title: "Jumping Shell", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/jumpingshelll.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/jumping-shell.html" },
    { title: "Karate Bros", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/karatebross.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/karate-bros.html" },
    { title: "Kart Bros", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/kartbross.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/kart-bros.html" },
    { title: "Keep Talking and Nobody Explodes", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ktanee.jpe", htmlUrl: "https://raw.githubusercontent.com/squidward5/ktane-webport/main/singlefile.html" },
    { title: "Kittytoy", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/kittytoyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/kittytoy.html" },
    { title: "Learn To Fly", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/learntoflyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/learn-to-fly.html" },
    { title: "Learn To Fly 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/learntofly22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/learn-to-fly-2.html" },
    { title: "Learn To Fly 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/learntofly33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/learn-to-fly-3.html" },
    { title: "Learn To Fly Idle", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/learntoflyidle.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/learn-to-fly-idle.html" },
    { title: "Level Devil", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/leveldevill.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/level-devil.html" },
    { title: "Little Alchemy 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/littlealchemy22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/littlealchemy-2.html" },
    { title: "Madalin Stunt Cars 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/madalinstuntcars22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/madalin-stunt-cars-2.html" },
    { title: "Madness Project Nexus", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/madnessprojectnexuss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/madness-project-nexus.html" },
    { title: "MeowDoku!", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/meowdokuu.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/meowdoku.html" },
    { title: "Melon Playground", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/melonplaygroundd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/melon-playground.html" },
    { title: "Merge Round Racers", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/mergeroundracerss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/merge-round-racers.html" },
    { title: "Minesweeper", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/minesweeperr.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/minesweeper.html" },
    { title: "Monkey Mart", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/monkeymartt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/monkey-mart.html" },
    { title: "Monster Tracks", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/monstertrackss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/monster-tracks.html" },
    { title: "Motherload", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/motherloadd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/motherload.html" },
    { title: "MotoX3m", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/motox3mm.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/moto-x3m.htm" },
    { title: "MotoX3m 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/motox3m22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/moto-x3m-2.html" },
    { title: "MotoX3m 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/motox3m33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/moto-x3m-3.html" },
    { title: "MotoX3m Pool Party", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/motox3mpoolpartyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/moto-x3m-pool-party.html" },
    { title: "MotoX3m Spooky Land", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/motox3mspookylandd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/moto-x3m-spooky-land.html" },
    { title: "MotoX3m Winter", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/motox3mwinterr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/moto-x3m-winter.html" },
    { title: "Murder", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/murderr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/murder.html" },
    { title: "Noob Miner", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/noobminerr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/noob-miner.html" },
    { title: "Open TTD", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/openttdd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/openTTD.html" },
    { title: "Opposite Day", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/oppositedayy.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/opposite-day.html" },
    { title: "OVO", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ovoo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ovo.html" },
    { title: "OVO 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ovo22.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ovo-2.html" },
    { title: "OVO 3 Dimensions", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ovo33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ovo-3-dimensions.html" },
    { title: "PacMan", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/pacmann.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/pac-man.html" },
    { title: "Papas Bakeria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papasbb.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-bakeria.html" },
    { title: "Papas Burgeria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papasbr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-burgeria.html" },
    { title: "Papas Cheeseria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papasch.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-cheeseria.html" },
    { title: "Papas Cupcakeria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papascc.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-cupcakeria.html" },
    { title: "Papas Donuteria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papasdn.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-donuteria.html" },
    { title: "Papas Freezeria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papasfz.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-freezeria.html" },
    { title: "Papas Hot Doggeria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papashd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-hot-doggeria.html" },
    { title: "Papas Pancakeria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papaspc.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-pancakeria.html" },
    { title: "Papas Pastaria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papaspt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-pastaria.html" },
    { title: "Papas Pizzeria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papaspz.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-pizzeria.html" },
    { title: "Papas Scooperia", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papassc.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-scooperia.html" },
    { title: "Papas Sushiria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papasss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-sushiria.html" },
    { title: "Papas Taco Mia", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papastm.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-taco-mia.html" },
    { title: "Papas Wingeria", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/papaswg.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/papas-wingeria.html" },
    { title: "Paper.io 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/paperio22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/paper-io-2.htm" },
    { title: "Parking Fury", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/parkingfuryy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/parking-fury.html" },
    { title: "Parking Fury 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/parkingfury22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/parking-fury-2.html" },
    { title: "Parking Fury 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/parkingfury33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/parking-fury-3.html" },
    { title: "PEAK", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/peakk.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/webport-list-for-wasm.rip-but-sf/main/peak" },
    { title: "Picos School", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/picosschooll.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/picos-school.html" },
    { title: "Ping Pong Chaos", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/pingpongchaoss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ping-pong-chaos.html" },
    { title: "Pixel Speedrun", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/pixelspeedrunn.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/pixel-speedrun.html" },
    { title: "Plants Vs Zombies", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/pvzz.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/plants-vs-zombies.html" },
    { title: "Plonky", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/plonkyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/plonky.html" },
    { title: "Poly Track", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/polytrackk.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/polytrack.html" },
    { title: "Poor Bunny", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/poorbunnyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/poor-bunny.html" },
    { title: "Pou", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/pouu.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/pou.html" },
    { title: "Ragdoll Archers", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ragdollarcherss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ragdoll-archers.htm" },
    { title: "Ragdoll Hit", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ragdollhitt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ragdoll-hit.html" },
    { title: "Ragdoll Soccer", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ragdollsoccerss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/ragdoll-soccer.html" },
    { title: "Red Ball 4 Vol.1", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/redballvol11.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/red-ball-4-vol-1.html" },
    { title: "Red Ball 4 Vol.2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/redballvol22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/red-ball-4-vol-2.html" },
    { title: "Red Ball 4 Vol.3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/redballvol33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/red-ball-4-vol-3.html" },
    { title: "Retro Bowl College", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/retrobowlcollegee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/retro-bowl-college.html" },
    { title: "Retro Bowl", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/retrobowll.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/retro-bowl.html" },
    { title: "Retro Highway", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/retrohighwayy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/retro-highway.html" },
    { title: "Riddle School", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/riddleschooll.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/riddle-school.html" },
    { title: "Riddle School 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/riddleschool22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/riddle-school-2.html" },
    { title: "Riddle School 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/riddleschool33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/riddle-school-3.html" },
    { title: "Riddle School 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/riddleschool44.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/riddle-school-4.html" },
    { title: "Riddle School 5", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/riddleschool55.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/riddle-school-5.html" },
    { title: "Riddle Transfer", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/riddletransferr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/riddle-transfer.html" },
    { title: "Riddle Transfer 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/riddletransfer22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/riddle-transfer-2.html" },
    { title: "Rocket Soccer Derby", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/rocketsoccerderbyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/rocket-soccer-derby.html" },
    { title: "Rooftop Run", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/rooftoprunn.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/rooftop-run.html" },
    { title: "Rooftop Snipers", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/rooftopsniperss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/rooftop-snipers.htm" },
    { title: "Rooftop Snipers 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/rooftopsnipers22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/rooftop-snipers-2.html" },
    { title: "Run", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/runn.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/run.html" },
    { title: "Run 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/run22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/run-2.html" },
    { title: "Run 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/run33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/run-3.html" },
    { title: "Sand Game", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/sandgamee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/sand-game.html" },
    { title: "Sandbox City", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/sandboxcityy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/sandbox-city.html" },
    { title: "Short Life", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/shortlifee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/short-life.html" },
    { title: "Six Cats Under", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/sixcatsunderr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/six-cats-under.html" },
    { title: "Slope", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/slopee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/slope.html" },
    { title: "Slope 2 Player", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/slope22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/slope-2-player.html" },
    { title: "Slope 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/slope33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/slope-3.html" },
    { title: "Slow Roads", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/slowroadss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/slow-roads.html" },
    { title: "Super Mario 63", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/supermario633.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/sm-63.html" },
    { title: "Super Mario 64", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/supermario644.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/sm-64.html" },
    { title: "Snail Bob", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snailbobb.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snail-bob.html" },
    { title: "Snail Bob 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snailbob22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snail-bob-2.html" },
    { title: "Snail Bob 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snailbob33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snail-bob-3.html" },
    { title: "Snail Bob 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snailbob44.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snail-bob-4.html" },
    { title: "Snail Bob 5", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snailbob55.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snail-bob-5.html" },
    { title: "Snail Bob 6", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snailbob66.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snail-bob-6.html" },
    { title: "Snail Bob 7", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snailbob77.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snail-bob-7.html" },
    { title: "Snail Bob 8", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snailbob88.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snail-bob-8.html" },
    { title: "Snow Rider", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snowriderr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snow-rider.htm" },
    { title: "Snow Road", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snowroadd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snow-road.htm" },
    { title: "Snowball.io", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/snowballioo.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/snowball-io.html" },
    { title: "Soccer Bros", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/soccerbross.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/soccer-bros.html" },
    { title: "Soccer Random", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/soccerrandomm.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/soccer-random.htm" },
    { title: "Space Is Key", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/spaceiskeyy.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/space-is-key.html" },
    { title: "Space Is Key 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/spaceiskey22.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/space-is-key-2.html" },
    { title: "Space Waves", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/spacewavess.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/space-waves.html" },
    { title: "Spacebar Clicker", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/spacebarclickerr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/spacebar-clicker.html" },
    { title: "Speed Stars", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/speedstarss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/speed-stars.html" },
    { title: "Sprunki", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/sprunkii.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/sprunki.html" },
    { title: "Stack", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/stackk.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/stack.html" },
    { title: "Stacktris", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/stacktris.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/stacktris.html" },
    { title: "State.io", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/stateioo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/state-io.html" },
    { title: "Stealing the Diamond", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/stealingthediamondd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/stealing-the-diamond.html" },
    { title: "Stick Archers Battle", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/stickarchersbattlee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/stick-archers-battle.html" },
    { title: "Stick Fighter", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/stickfighterr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/stick-fighter.html" },
    { title: "Stick Merge", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/stickmergee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/stick-merge.html" },
    { title: "Stickman Hook", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/stickmanhookk.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/stickman-hook.html" },
    { title: "Subway Surfers Beijing", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ssbeijingg.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/subway-surfers-beijing.html" },
    { title: "Subway Surfers Havana", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/sshavanaa.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/subway-surfers-havana.html" },
    { title: "Subway Surfers San Francisco", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/sssanfranciscoo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/subway-surfers-san-francisco.html" },
    { title: "Super Bike the Champion", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/superbikethechampionn.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/super-bike-the-champion.html" },
    { title: "Super Liquid Soccer", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/superliquidsoccerr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/super-liquid-soccer.html" },
    { title: "Super Star Car", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/supercarstarr.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/super-star-car.html" },
    { title: "SuperHot", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/superhott.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/superhot.html" },
    { title: "Table Tennis World Tour", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ttwtt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/table-tennis-world-tour.html" },
    { title: "Tag", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/taggamee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/tag.html" },
    { title: "Tanuki Sunset", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/tanukisunsett.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/tanuki-sunset.html" },
    { title: "Tap Road", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/taproadd.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/tap-road.html" },
    { title: "Temple of Boom", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/templeofboomm.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/temple-of-boom.html" },
    { title: "Temple Run 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/templerun22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/temple-run-2.htm" },
    { title: "Territorial.io", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/territorialioo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/territorial-io.html" },
    { title: "Tetrominoes", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/tetrominn.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/tetrominoes.html" },
    { title: "The Impossible Quiz", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/impossiblequizz.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/the-impossible-quiz.html" },
    { title: "The Impossible Quiz 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/impossiblequiz22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/the-impossible-quiz-2.html" },
    { title: "There Is No Game", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/thereisnogamee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/there-is-no-g.html" },
    { title: "They Are Coming", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/theyarecomingg.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/they-are-coming.html" },
    { title: "This Is the Only Level", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/thisistheonlylevell.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/this-is-the-only-level.html" },
    { title: "This Is the Only Level Too", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/thisistheonlylevel22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/this-is-the-only-level-too.html" },
    { title: "Time Shooter 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/timeshooter22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/time-shooter-2.html" },
    { title: "Time Shooter 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/timeshooter33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/time-shooter-3.htm" },
    { title: "Tiny Fishing", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/tinyfishingg.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/tiny-fishing.html" },
    { title: "Tomb of the Mask", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/tombofthemaskk.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/tomb-of-the-mask.htm" },
    { title: "Trap the Cat", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/trapthecatt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/trap-the-cat.html" },
    { title: "Trees Hate You", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/treeshateyouu.jpe", htmlUrl: "https://raw.githubusercontent.com/xxuep1/webport-list-for-wasm.rip-but-sf/main/treeshateyou/treeshateyousf.html" },
    { title: "Trivia Crack", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/triviacrackk.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/trivia-crack.html" },
    { title: "Tube Jumpers", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/tubejumperss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/tube-jumpers.html" },
    { title: "Tunnel Rush", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/tunnelrushh.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/tunnel-rush.html" },
    { title: "UltraKill", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/ultrakilll.png", htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/ultrakill.htmll" },
    { title: "Unicycle Hero", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/unicycleheroo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/unicycle-hero.html" },
    { title: "Vex x3m", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/vexx3mm.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/vex-x3m.html" },
    { title: "Vex x3m 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/vexx3m22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/vex-x3m-2.html" },
    { title: "Vex 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/vex44.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/vex-4.html" },
    { title: "Vex 5", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/vex55.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/vex-5.html" },
    { title: "Vex 6", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/vex66.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/vex-6.html" },
    { title: "Vex 7", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/vex77.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/vex-7.htm" },
    { title: "Vex 8", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/vex88.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/vex-8.htm" },
    { title: "Volley Random", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/volleyrandomm.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/volley-random.html" },
    { title: "War the Knights", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wartheknightss.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/war-the-knights.html" },
    { title: "We Become What We Behold", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wbwwbb.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/we-become-what-we-behold.html" },
    { title: "Wheelie Bike", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheeliebikee.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheelie-bike.html" },
    { title: "Wheely", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheelyy.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheely.html" },
    { title: "Wheely 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheely22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheely-2.html" },
    { title: "Wheely 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheely33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheely-3.html" },
    { title: "Wheely 4", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheely44.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheely-4.html" },
    { title: "Wheely 5", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheely55.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheely-5.html" },
    { title: "Wheely 6", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheely66.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheel-6.html" },
    { title: "Wheely 7", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheely77.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheely-7.html" },
    { title: "Wheely 8", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wheely88.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wheely-8.html" },
    { title: "Wordle Unlimited", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wordleunlimitedd.png", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wordle-unlimited.html" },
    { title: "Worlds Hardest Game", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/whgg.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/worlds-hardest-game.html" },
    { title: "Worlds Hardest Game 2", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/whg22.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/worlds-hardest-game-2.html" },
    { title: "Worlds Hardest Game 3", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/whg33.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/worlds-hardest-game-3.html" },
    { title: "Wrestle Bros", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/wrestlebross.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/wrestle-bros.html" },
    { title: "Yohoho.io", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/yohohoioo.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/yohoho-io.html" },
    { title: "Zombie Rush", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/zombierushh.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/zombie-rush.html" },
    { title: "Zrist", img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/zristt.jpe", htmlUrl: "https://raw.githubusercontent.com/CoolDude2349/Offline-Single-File-Games/master/offline/zrist.html" },



];

const apps = [
    {
        title: "HTML editor",
        img: "https://raw.githubusercontent.com/xxuep1/offline-game-thumbnails/main/htmleditorr.png",
        htmlUrl: "https://raw.githubusercontent.com/xxuep1/randomgames/main/live-code-editor.html"
    },
];

// Music items open directly via Google Drive link without about:blank
const musicItems = [
    {
        title: "coming soon",
        img: "https://null",
        driveUrl: "https://comingsoon.com"
    }
];

// Generic Library Renderer - Pure Image Buttons (No bottom text container)
function renderLibrary(dataArray, gridId, countId, searchInputId, isMusic = false) {
    const grid = document.getElementById(gridId);
    const countEl = document.getElementById(countId);
    const searchInput = document.getElementById(searchInputId);

    function populate(filterText = "") {
        grid.innerHTML = "";
        const filtered = dataArray.filter(item => item.title.toLowerCase().includes(filterText.toLowerCase()));
        countEl.textContent = `Showing ${filtered.length} / ${dataArray.length} items`;

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "library-card";
            card.title = item.title;
            card.innerHTML = `
                <img src="${item.img}" alt="${item.title}" loading="lazy">
            `;
            card.addEventListener("click", () => {
                if (isMusic) {
                    window.open(item.driveUrl, "_blank");
                } else {
                    launchAboutBlank(item.title, item.htmlUrl);
                }
            });
            grid.appendChild(card);
        });
    }

    searchInput.addEventListener("input", (e) => {
        populate(e.target.value);
    });

    populate();
}

function launchAboutBlank(title, url) {
    const win = window.open("about:blank", "_blank");
    if (!win) {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
        return;
    }

    win.document.open();
    win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Loading...</title></head><body style="margin:0;background:#000;color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">Loading...</body></html>');
    win.document.close();

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            if (win.closed) return;
            const baseTag = `<base href="${new URL(url, location.href).href.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}">`;
            if (/<head\b[^>]*>/i.test(html)) {
                html = html.replace(/<head\b[^>]*>/i, match => match + baseTag);
            } else {
                html = baseTag + html;
            }
            win.document.open();
            win.document.write(html);
            win.document.close();
        })
        .catch(error => {
            if (win.closed) return;
            win.document.open();
            win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unable to load</title></head><body style="background:#000;color:#fff;font-family:Arial,sans-serif;padding:40px"><h2>Could not load game HTML</h2><p>The file could not be fetched. Check the URL, its public access, and CORS permissions.</p></body></html>');
            win.document.close();
            console.error("Failed to load HTML:", url, error);
        });
}

// Initialize Libraries
renderLibrary(games, "gamesGrid", "game-count", "gameSearchInput", false);
renderLibrary(apps, "appsGrid", "app-count", "appSearchInput", false);
renderLibrary(musicItems, "musicGrid", "music-count", "musicSearchInput", true);
const animatedSiteCursor = document.getElementById("animated-site-cursor");
document.addEventListener("pointermove", (event) => {
    animatedSiteCursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
});
document.addEventListener("pointerleave", () => {
    animatedSiteCursor.style.transform = "translate3d(-100px, -100px, 0)";
});
document.addEventListener("fullscreenchange", () => {
    (document.fullscreenElement || document.body).appendChild(animatedSiteCursor);
});


function setupBrowserGifCursor() {
    const frame = document.getElementById("iframeWindow");
    const sourceCursor = document.getElementById("animated-site-cursor");
    if (!frame || !sourceCursor) return;
    const cursorUrl = sourceCursor.src;
    const prepared = new WeakSet();

    function installCursor(win) {
        let doc;
        try {
            doc = win.document;
            if (!doc || !doc.documentElement || !doc.body || prepared.has(doc)) return;
        } catch (e) {
            return;
        }
        prepared.add(doc);

        const style = doc.createElement("style");
        style.textContent = `html, body, body * { cursor: none !important; } #s4turn-frame-gif-cursor { position: fixed !important; top: 0 !important; left: 0 !important; width: 32px !important; height: 32px !important; pointer-events: none !important; z-index: 2147483647 !important; transform: translate3d(-100px,-100px,0); max-width: none !important; max-height: none !important; opacity: 1 !important; }`;
        (doc.head || doc.documentElement).appendChild(style);

        const cursor = doc.createElement("img");
        cursor.id = "s4turn-frame-gif-cursor";
        cursor.src = cursorUrl;
        cursor.alt = "";
        cursor.setAttribute("aria-hidden", "true");
        doc.body.appendChild(cursor);

        doc.addEventListener("pointermove", event => {
            cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
            if (win === frame.contentWindow) sourceCursor.style.transform = "translate3d(-100px,-100px,0)";
        }, true);
        doc.addEventListener("pointerout", event => {
            if (!event.relatedTarget) cursor.style.transform = "translate3d(-100px,-100px,0)";
        }, true);
        doc.addEventListener("pointerdown", () => {}, true);
    }

    function update() {
        try {
            if (frame.contentWindow) installCursor(frame.contentWindow);
        } catch (e) {
        }
    }

    frame.addEventListener("load", update);
    frame.addEventListener("pointerenter", () => {
        sourceCursor.style.transform = "translate3d(-100px,-100px,0)";
        update();
    });
    setInterval(update, 700);
    update();
}
setupBrowserGifCursor();
