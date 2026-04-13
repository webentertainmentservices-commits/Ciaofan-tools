(function () {
  if (window.__wesCookieConsentInitialized) return;
  window.__wesCookieConsentInitialized = true;

  var STORAGE_KEY = "wes_cookie_consent_v1";
  var BANNER_ID = "wes-cookie-banner";
  var MANAGE_ID = "wes-cookie-manage";

  function safeRead() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return {
        necessary: true,
        analytics: !!parsed.analytics,
        choiceMade: !!parsed.choiceMade,
        updatedAt: parsed.updatedAt || null
      };
    } catch (error) {
      return null;
    }
  }

  function safeWrite(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function getConsent() {
    return safeRead();
  }

  function canUseAnalytics() {
    var consent = getConsent();
    return !!(consent && consent.analytics);
  }

  function saveConsent(options) {
    var next = {
      necessary: true,
      analytics: !!options.analytics,
      choiceMade: true,
      updatedAt: new Date().toISOString()
    };

    safeWrite(next);
    window.dispatchEvent(new CustomEvent("wes-cookie-consent-changed", { detail: next }));
    return next;
  }

  function injectStyles() {
    if (document.getElementById("wes-cookie-consent-style")) return;

    var style = document.createElement("style");
    style.id = "wes-cookie-consent-style";
    style.textContent = [
      "#wes-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;display:flex;justify-content:center;pointer-events:none;}",
      "#wes-cookie-banner .wes-cookie-card{width:min(980px,100%);pointer-events:auto;padding:18px;border-radius:22px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(180deg,rgba(25,17,40,.98),rgba(18,12,30,.96));box-shadow:0 18px 44px rgba(0,0,0,.28),0 0 36px rgba(255,47,151,.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;}",
      "#wes-cookie-banner .wes-cookie-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:start;}",
      "#wes-cookie-banner .wes-cookie-kicker{margin:0 0 8px;font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#ff9dde;}",
      "#wes-cookie-banner h2{margin:0 0 10px;font-size:24px;line-height:1.08;letter-spacing:-.03em;}",
      "#wes-cookie-banner p{margin:0;font-size:14px;line-height:1.65;color:rgba(255,255,255,.76);}",
      "#wes-cookie-banner .wes-cookie-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;}",
      "#wes-cookie-banner .wes-cookie-links a{color:rgba(255,255,255,.88);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.28);padding-bottom:1px;}",
      "#wes-cookie-banner .wes-cookie-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;align-items:center;}",
      "#wes-cookie-banner .wes-btn{min-height:46px;padding:0 16px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#fff;font:inherit;font-size:14px;font-weight:800;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;}",
      "#wes-cookie-banner .wes-btn:hover,#wes-cookie-banner .wes-btn:focus-visible{transform:translateY(-1px);outline:none;}",
      "#wes-cookie-banner .wes-btn-primary{border:none;background:linear-gradient(90deg,#ff2f97,#7b4dff);box-shadow:0 14px 28px rgba(255,47,151,.18);}",
      "#wes-cookie-banner .wes-btn-secondary{background:rgba(255,255,255,.04);}",
      "#wes-cookie-banner .wes-btn-ghost{background:transparent;border-color:rgba(255,255,255,.1);}",
      "#wes-cookie-banner .wes-cookie-settings{display:none;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.08);}",
      "#wes-cookie-banner.is-settings-open .wes-cookie-settings{display:grid;gap:14px;}",
      "#wes-cookie-banner .wes-cookie-option{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:start;padding:14px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);}",
      "#wes-cookie-banner .wes-cookie-option input{margin-top:4px;accent-color:#ff4ecd;}",
      "#wes-cookie-banner .wes-cookie-option strong{display:block;font-size:14px;margin-bottom:4px;}",
      "#wes-cookie-banner .wes-cookie-option span{display:block;font-size:13px;line-height:1.55;color:rgba(255,255,255,.72);}",
      "#wes-cookie-banner .wes-cookie-disabled{opacity:.66;}",
      "#wes-cookie-manage{position:fixed;left:16px;bottom:16px;z-index:9998;display:none;align-items:center;justify-content:center;min-height:42px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(24,18,36,.92);color:#fff;font:inherit;font-size:13px;font-weight:800;box-shadow:0 14px 28px rgba(0,0,0,.22);cursor:pointer;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}",
      "#wes-cookie-manage:hover,#wes-cookie-manage:focus-visible{transform:translateY(-1px);outline:none;}",
      "@media (max-width:768px){#wes-cookie-banner{left:12px;right:12px;bottom:12px;}#wes-cookie-banner .wes-cookie-card{padding:16px;border-radius:20px;}#wes-cookie-banner .wes-cookie-top{grid-template-columns:1fr;}#wes-cookie-banner .wes-cookie-actions{justify-content:stretch;}#wes-cookie-banner .wes-btn{width:100%;}#wes-cookie-manage{left:auto;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);min-height:30px;padding:0 10px;border-radius:999px;border-color:rgba(255,255,255,.08);background:rgba(18,14,28,.74);color:rgba(255,255,255,.72);font-size:11px;font-weight:700;box-shadow:0 6px 14px rgba(0,0,0,.16);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);}}",
      "@media (max-width:480px){#wes-cookie-manage{right:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);min-height:28px;padding:0 8px;font-size:10px;letter-spacing:.01em;}}",
      "@media (prefers-reduced-motion:reduce){#wes-cookie-banner .wes-btn,#wes-cookie-manage{transition:none;}}"
    ].join("");

    document.head.appendChild(style);
  }

  function removeBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) banner.remove();
  }

  function ensureManageButton() {
    injectStyles();
    var manage = document.getElementById(MANAGE_ID);
    if (!manage) {
      manage = document.createElement("button");
      manage.type = "button";
      manage.id = MANAGE_ID;
      manage.textContent = "Cookie settings";
      manage.addEventListener("click", function () {
        openBanner(true);
      });
      document.body.appendChild(manage);
    }
    manage.style.display = getConsent() ? "inline-flex" : "none";
  }

  function closeAndPersist(options) {
    saveConsent(options);
    removeBanner();
    ensureManageButton();
  }

  function openBanner(openSettings) {
    injectStyles();
    removeBanner();

    var wrapper = document.createElement("div");
    wrapper.id = BANNER_ID;
    wrapper.className = openSettings ? "is-settings-open" : "";
    wrapper.innerHTML = [
      '<div class="wes-cookie-card" role="dialog" aria-modal="false" aria-labelledby="wes-cookie-title">',
      '  <div class="wes-cookie-top">',
      '    <div>',
      '      <div class="wes-cookie-kicker">Privacy & Cookies</div>',
      '      <h2 id="wes-cookie-title">We use cookies to keep the site useful and improve the experience.</h2>',
      '      <p>Necessary cookies support core functionality. Optional analytics cookies are only enabled if you allow them.</p>',
      '      <div class="wes-cookie-links"><a href="/privacy-policy">Privacy Policy</a><a href="/cookie-policy">Cookie Policy</a></div>',
      '    </div>',
      '    <div class="wes-cookie-actions">',
      '      <button type="button" class="wes-btn wes-btn-ghost" data-wes-cookie="settings">Settings</button>',
      '      <button type="button" class="wes-btn wes-btn-secondary" data-wes-cookie="reject">Reject</button>',
      '      <button type="button" class="wes-btn wes-btn-primary" data-wes-cookie="accept">Accept All</button>',
      '    </div>',
      '  </div>',
      '  <div class="wes-cookie-settings">',
      '    <label class="wes-cookie-option wes-cookie-disabled">',
      '      <input type="checkbox" checked disabled />',
      '      <span><strong>Necessary cookies</strong><span>Always on. They support navigation stability and store your consent preferences.</span></span>',
      '    </label>',
      '    <label class="wes-cookie-option">',
      '      <input type="checkbox" id="wes-analytics-toggle" />',
      '      <span><strong>Analytics cookies</strong><span>Used to understand site usage in aggregate so we can improve pages, tools, and user experience.</span></span>',
      '    </label>',
      '    <div class="wes-cookie-actions">',
      '      <button type="button" class="wes-btn wes-btn-primary" data-wes-cookie="save">Save preferences</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("");

    document.body.appendChild(wrapper);

    var current = getConsent();
    var analyticsToggle = document.getElementById("wes-analytics-toggle");
    if (analyticsToggle) {
      analyticsToggle.checked = !!(current && current.analytics);
    }

    wrapper.addEventListener("click", function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      var action = target.getAttribute("data-wes-cookie");
      if (!action) return;

      if (action === "settings") {
        wrapper.classList.toggle("is-settings-open");
        return;
      }
      if (action === "accept") {
        closeAndPersist({ analytics: true });
        return;
      }
      if (action === "reject") {
        closeAndPersist({ analytics: false });
        return;
      }
      if (action === "save") {
        closeAndPersist({ analytics: !!(analyticsToggle && analyticsToggle.checked) });
      }
    });
  }

  window.wesCookieConsent = {
    getConsent: getConsent,
    canUseAnalytics: canUseAnalytics,
    openSettings: function () { openBanner(true); },
    acceptAll: function () { closeAndPersist({ analytics: true }); },
    rejectAll: function () { closeAndPersist({ analytics: false }); }
  };

  function init() {
    injectStyles();
    ensureManageButton();
    if (!getConsent()) openBanner(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
