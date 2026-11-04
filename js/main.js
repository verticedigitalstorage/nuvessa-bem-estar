
(() => {
  "use strict";

  const cfg = window.NERVO_CONFIG;
  const qs = new URLSearchParams(location.search);
  const eventQueue = window.siteEventQueue = window.siteEventQueue || [];

  function recordEvent(name, detail = {}) {
    const event = { name, detail, timestamp: Date.now() };
    eventQueue.push(event);
    window.dispatchEvent(
      new CustomEvent("nervocure:event", { detail: event })
    );

    if (window.NUVESSA_META_PIXEL) {
      window.NUVESSA_META_PIXEL.trackCustom(name, detail);
    }
  }

  function trackedCheckout(rawUrl) {
    const url = new URL(rawUrl);

    const essential = Object.fromEntries(
      ["pl", "ck", "af"]
        .map((key) => [key, url.searchParams.get(key)])
        .filter(([, value]) => Boolean(value))
    );

    cfg.TRACKABLE_PARAMS.forEach((key) => {
      const value = qs.get(key);

      if (value && !url.searchParams.has(key)) {
        url.searchParams.set(key, value.slice(0, 250));
      }
    });

    Object.entries(essential).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  }

  function offerCard(offer, special = false) {
    const article = document.createElement("article");

    article.className =
      `offer-card${offer.featured ? " offer-card--featured" : ""}`;

    article.dataset.offerId = offer.id;

    const image =
      offer.image || "assets/images/frasco-oficial-02.webp";

    const imageClass =
      offer.imageClass || "offer-image--product";

    const imageSize = image.includes("frasco-oficial") ? 768 : 900;

    article.innerHTML = `
      ${offer.featured ? '<p class="offer-badge">Kit em destaque</p>' : ""}
      <div class="offer-visual">
        <img class="offer-image ${imageClass}"
          src="${image}"
          width="${imageClass === 'offer-image--photo' ? 720 : imageSize}"
          height="${imageClass === 'offer-image--photo' ? 1280 : imageSize}"
          loading="lazy"
          decoding="async"
          alt="Imagem do NervoCure Max para o kit de ${offer.boxes} ${offer.boxes === 1 ? "caixa" : "caixas"}">

        <div class="offer-image-labels">
          <span class="offer-quantity"
            aria-label="Quantidade: ${offer.boxes} caixas">×${offer.boxes}</span>
          ${offer.gift && !offer.gift.startsWith("Sem")
            ? '<span class="offer-gift-chip">+ brinde</span>'
            : ""}
        </div>
      </div>

      <p class="offer-eyebrow">
        ${special ? "Oferta especial" : offer.label}
      </p>

      <h3>${offer.boxes} ${offer.boxes === 1 ? "caixa" : "caixas"}</h3>

      ${offer.gift
        ? `<p class="offer-gift">${offer.gift}</p>`
        : ""}

      ${offer.installmentPrice ? `
        <div class="offer-pricing">
          <p class="offer-installment">
            <span>${offer.installments}x de</span>
            <strong>${offer.installmentPrice}</strong>
          </p>
          <p class="offer-cash">
            ou <strong>${offer.price}</strong> à vista
          </p>
          <p class="offer-unit">${(Number(offer.price.replace(/[^0-9,]/g, "").replace(",", ".")) / offer.boxes).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} por caixa, no pagamento à vista</p>
          <p class="offer-terms">Confira no checkout as condições do parcelamento, frete e disponibilidade.</p>
        </div>`
        : `<p class="offer-price">${offer.price}</p>`}

      <a class="button button--buy"
        href="${trackedCheckout(offer.url)}"
        data-offer="${offer.id}"
        rel="sponsored noopener">
        Escolher ${offer.boxes} ${offer.boxes === 1 ? "caixa" : "caixas"}
      </a>

      <p class="offer-note">
        A compra é concluída em ambiente de pagamento seguro.
      </p>`;

    return article;
  }

  function renderOffers() {
    const main = document.querySelector("#main-offers");
    const extended = document.querySelector("#extended-offers");

    cfg.OFFERS.forEach((offer) => {
      (offer.placement === "main" ? main : extended)
        .append(offerCard(offer));
    });

    const specialSection =
      document.querySelector("#special-offers-section");

    if (cfg.SHOW_SPECIAL_OFFERS) {
      specialSection.hidden = false;

      cfg.SPECIAL_OFFERS.forEach((offer) => {
        document.querySelector("#special-offers")
          .append(offerCard(offer, true));
      });
    }

    document.querySelectorAll("[data-direct-checkout]")
      .forEach((link) => {
        const offer = cfg.OFFERS.find(
          (item) => item.id === link.dataset.directCheckout
        );

        if (offer) {
          link.href = trackedCheckout(offer.url);
          link.rel = "sponsored noopener";
        }
      });
  }

  // Controle de consentimento
  function consentState() {
    return localStorage.getItem("nervocure_consent") || "unset";
  }

  // Carregamento seguro do script original da UTMify
  function loadUtmify() {
    if (consentState() !== "accepted") return;

    if (document.querySelector(
      "script[data-nuvessa-utmify-loader]"
    )) return;

    const script = document.createElement("script");

    script.src = "/js/utmify.js";
    script.async = true;
    script.dataset.nuvessaUtmifyLoader = "true";

    script.onerror = () => {
      console.warn("Falha ao carregar o script da UTMify.");
      script.remove();
    };

    document.head.appendChild(script);
  }

  function loadMarketingScripts() {
    if (consentState() !== "accepted") return;

    if (window.NUVESSA_META_PIXEL) {
      window.NUVESSA_META_PIXEL.load();
    }

    loadUtmify();
  }

  function setConsent(value) {
    const previous = consentState();

    localStorage.setItem("nervocure_consent", value);

    document.querySelector("#cookie-banner").hidden = true;

    document.querySelector("#cookie-status").textContent =
      value === "accepted"
        ? "Cookies opcionais aceitos."
        : "Cookies opcionais recusados.";

    if (value === "accepted") {
      loadMarketingScripts();
    } else if (previous === "accepted") {
      // Recarrega para impedir novos eventos dos scripts
      // opcionais carregados nesta sessão.
      location.reload();
    }
  }

  function setupConsent() {
    const banner = document.querySelector("#cookie-banner");

    if (consentState() === "unset") {
      banner.hidden = false;
    }

    document.querySelector("#accept-cookies")
      .addEventListener("click", () => {
        setConsent("accepted");
      });

    document.querySelector("#reject-cookies")
      .addEventListener("click", () => {
        setConsent("rejected");
      });

    document.querySelector("#review-cookies")
      .addEventListener("click", () => {
        banner.hidden = false;
        banner.focus();
      });

    loadMarketingScripts();
  }

  function setupPage() {
    document.querySelectorAll("[data-guarantee]")
      .forEach((node) => {
        node.textContent = cfg.GUARANTEE_DAYS;
      });

    document.querySelectorAll("[data-email]")
      .forEach((node) => {
        node.textContent = cfg.COMMERCIAL_EMAIL;
      });

    document.querySelectorAll("[data-email-link]")
      .forEach((node) => {
        node.href = `mailto:${cfg.COMMERCIAL_EMAIL}`;
      });

    document.querySelectorAll("[data-responsible]")
      .forEach((node) => {
        node.textContent = cfg.LEGAL_RESPONSIBLE;
      });

    const canonical =
      document.querySelector('link[rel="canonical"]');

    if (canonical) {
      canonical.href = new URL(
        location.pathname.replace(/index\.html$/, ""),
        cfg.BASE_URL
      ).toString();
    }

    document.addEventListener("click", (event) => {
      const offer = event.target.closest("[data-offer]");
      const offersAnchor =
        event.target.closest("a[href^='#ofertas']");

      if (offer) {
        recordEvent("select_offer", {
          offer_id: offer.dataset.offer
        });
      }

      if (offersAnchor) {
        recordEvent("view_offers");
      }
    }, { capture: true });

    document.querySelector("#year").textContent =
      new Date().getFullYear();
  }

  renderOffers();
  setupConsent();
  setupPage();
})();
