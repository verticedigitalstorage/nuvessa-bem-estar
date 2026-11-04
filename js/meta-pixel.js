(() => {
  "use strict";

  const cfg = window.NERVO_CONFIG;
  const consentKey = "nervocure_consent";
  const libraryId = "meta-pixel-library";
  const state = window.__NUVESSA_META_PIXEL_STATE__ = window.__NUVESSA_META_PIXEL_STATE__ || {
    initialized: false,
    pageViewSent: false,
    libraryRequested: false,
    pixelId: ""
  };

  function hasConsent() {
    try {
      return localStorage.getItem(consentKey) === "accepted";
    } catch {
      return false;
    }
  }

  function validPixelId() {
    return cfg && /^\d{10,20}$/.test(String(cfg.META_PIXEL_ID || ""));
  }

  function ensureQueue() {
    if (window.fbq) return;
    const fbq = window.fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
  }

  function ensureLibrary() {
    if (state.libraryRequested || document.getElementById(libraryId)) return;
    state.libraryRequested = true;
    const script = document.createElement("script");
    script.id = libraryId;
    script.async = true;
    script.src = "https://connect.facebook.net/pt_BR/fbevents.js";
    document.head.append(script);
  }

  function load() {
    if (!hasConsent() || !validPixelId()) return false;
    ensureQueue();
    ensureLibrary();

    const pixelId = String(cfg.META_PIXEL_ID);
    if (!state.initialized) {
      window.fbq("init", pixelId);
      state.initialized = true;
      state.pixelId = pixelId;
    }
    if (!state.pageViewSent) {
      window.fbq("track", "PageView");
      state.pageViewSent = true;
    }
    return true;
  }

  function trackCustom(name, detail = {}) {
    if (!load()) return false;
    window.fbq("trackCustom", name, detail);
    return true;
  }

  function track(name, detail = {}) {
    if (!load()) return false;
    window.fbq("track", name, detail);
    return true;
  }

  window.NUVESSA_META_PIXEL = Object.freeze({ load, track, trackCustom, hasConsent });
})();
