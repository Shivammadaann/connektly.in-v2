(function () {
  const scriptUrl =
    document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : new URL("components/global.js", document.baseURI).href;
  const rootUrl = new URL("../", scriptUrl);
  let lastHeaderScrollY = 0;
  let headerScrollInitialized = false;
  let headerScrollFrameId = 0;
  let headerCompactState = null;

  function fromRoot(path) {
    return new URL(path, rootUrl).href;
  }

  function injectHeaderStyles() {
    if (document.getElementById("connektly-header-mega-menu-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "connektly-header-mega-menu-styles";
    style.textContent = `
      @media (min-width: 821px) {
        .nav-dropdown__menu.nav-dropdown__menu--mega {
          top: calc(100% + 0.78rem) !important;
          width: var(--mega-menu-header-width, min(calc(100vw - clamp(1rem, 3vw, 3rem)), min(var(--max-width), 1480px))) !important;
          min-width: 0 !important;
          max-width: none !important;
          padding: 0.65rem !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 1.45rem !important;
          background: rgba(17, 24, 39, 0.9) !important;
          backdrop-filter: blur(24px) !important;
          -webkit-backdrop-filter: blur(24px) !important;
          box-shadow:
            0 34px 80px rgba(0, 0, 0, 0.35),
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
          transform: translateX(calc(-50% + var(--mega-menu-shift-x, 0px))) translateY(0.95rem) scale(0.97) !important;
        }

        .nav-dropdown__menu--resources {
          width: var(--mega-menu-header-width, min(calc(100vw - clamp(1rem, 3vw, 3rem)), min(var(--max-width), 1480px))) !important;
          min-width: 0 !important;
        }

        .nav-dropdown:hover .nav-dropdown__menu--mega,
        .nav-dropdown[open] .nav-dropdown__menu--mega {
          transform: translateX(calc(-50% + var(--mega-menu-shift-x, 0px))) translateY(0) scale(1) !important;
        }
      }

      @media (min-width: 821px) and (max-width: 1080px) {
        .nav-dropdown__menu.nav-dropdown__menu--mega,
        .nav-dropdown__menu--resources {
          width: var(--mega-menu-header-width, min(calc(100vw - 1.5rem), min(var(--max-width), 1480px))) !important;
          min-width: 0 !important;
        }
      }

      .mega-menu {
        display: grid;
        grid-template-columns: minmax(220px, 0.78fr) minmax(0, 1.22fr);
        gap: 0.65rem;
      }

      .mega-menu__feature {
        position: relative;
        min-height: 100%;
        padding: 1.5rem;
        display: grid !important;
        align-content: end;
        gap: 0.55rem;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 1.05rem;
        background: linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
      }

      .mega-menu__feature::before {
        content: "";
        position: absolute;
        inset: auto -20% -25% 15%;
        height: 12rem;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(37, 218, 123, 0.15), transparent 70%);
      }

      .mega-menu__feature > * {
        position: relative;
        z-index: 1;
      }

      .mega-menu__feature-kicker,
      .mega-menu__heading {
        color: #27e681;
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .mega-menu__feature strong {
        color: #ffffff;
        font-family: "Sora", "Manrope", sans-serif;
        font-size: 1.25rem;
        line-height: 1.16;
      }

      .mega-menu__feature span:last-child {
        color: rgba(226, 232, 240, 0.65);
        font-size: 0.86rem;
        line-height: 1.55;
      }

      .mega-menu__columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
      }

      .mega-menu__columns--three {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .mega-menu__column {
        display: grid;
        align-content: start;
        gap: 0.35rem;
        padding: 0.5rem;
      }

      .mega-menu__heading {
        padding: 0.35rem 0.65rem 0.25rem;
        color: #27e681;
      }

      .nav-dropdown__menu--mega .mega-menu__column a {
        display: grid !important;
        grid-template-columns: 2.25rem minmax(0, 1fr);
        gap: 0.75rem;
        align-items: center;
        padding: 0.65rem !important;
        border-radius: 0.75rem;
        transition: background 180ms ease, transform 180ms ease !important;
      }

      .nav-dropdown__menu--mega .mega-menu__column a:hover,
      .nav-dropdown__menu--mega .mega-menu__column a.is-active {
        transform: translateY(0) !important;
        background: rgba(255, 255, 255, 0.06) !important;
      }

      .dropdown-item-icon {
        width: 2.25rem;
        height: 2.25rem;
        display: inline-grid;
        place-items: center;
        border-radius: 0.65rem;
        background: rgba(37, 218, 123, 0.12);
        color: #27e681;
        font-size: 0.75rem;
        font-weight: 900;
        letter-spacing: 0;
        box-shadow: inset 0 0 0 1px rgba(37, 218, 123, 0.12);
      }
      
      .dropdown-item-label {
        display: block;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.95rem;
        margin-bottom: 0.1rem;
      }

      .dropdown-item-desc {
        display: block;
        color: rgba(226, 232, 240, 0.65);
        font-size: 0.82rem;
        line-height: 1.4;
      }

      @media (max-width: 820px) {
        .nav-dropdown__menu--mega {
          padding: 0.5rem !important;
        }

        .mega-menu,
        .mega-menu__columns,
        .mega-menu__columns--three {
          grid-template-columns: 1fr;
        }

        .mega-menu__feature {
          min-height: auto;
        }
      }

      @media (min-width: 821px) {
        [data-site-header] {
          min-height: 5rem !important;
        }

        .site-header {
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          min-height: 5rem;
          padding: 1rem max(1.25rem, calc((100vw - var(--max-width)) / 2 + 1.25rem)) !important;
          grid-template-columns: 1fr auto 1fr !important;
          gap: 1rem !important;
          border-width: 0 0 1px !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          border-radius: 0 !important;
          background: #111827 !important;
          box-shadow: 0 8px 24px rgba(24, 60, 47, 0.08) !important;
          transform: translate3d(0, 0, 0) scale(1) !important;
          transform-origin: top center;
          backface-visibility: hidden;
          will-change: left, top, width, min-height, padding, border-radius, transform;
          animation: none !important;
          transition:
            left 400ms ease,
            top 400ms ease,
            width 400ms ease,
            min-height 400ms ease,
            padding 400ms ease,
            border-radius 400ms ease,
            background 400ms ease,
            border-color 400ms ease,
            box-shadow 400ms ease,
            transform 400ms ease,
            backdrop-filter 400ms ease,
            -webkit-backdrop-filter 400ms ease !important;
        }

        .site-header.is-scrolled {
          top: 0.45rem !important;
          left: 50% !important;
          width: min(calc(100% - clamp(1.25rem, 4vw, 4rem)), min(var(--max-width), 1380px)) !important;
          min-height: auto;
          padding: 0.42rem 0.62rem 0.42rem 0.72rem !important;
          grid-template-columns: auto minmax(0, 1fr) auto !important;
          gap: clamp(0.55rem, 1.4vw, 1.1rem) !important;
          border-width: 1px !important;
          border-color: rgba(255, 255, 255, 0.16) !important;
          border-radius: 999px !important;
          background: rgba(8, 13, 24, 0.92) !important;
          box-shadow:
            0 16px 44px rgba(8, 13, 24, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transform: translate3d(-50%, 0, 0) scale(0.985) !important;
        }

        .site-header.is-hidden:not(.is-open) {
          transform: translate3d(-50%, calc(-100% - 1.2rem), 0) scale(0.985) !important;
        }

        .site-header .brand {
          gap: 0.85rem !important;
          transition: gap 400ms ease, transform 220ms ease, opacity 220ms ease !important;
        }

        .site-header.is-scrolled .brand {
          gap: 0.62rem !important;
        }

        .site-header .brand__mark {
          width: 2.9rem !important;
          height: 2.9rem !important;
          border-radius: 1rem !important;
          transition: width 400ms ease, height 400ms ease, border-radius 400ms ease, box-shadow 320ms ease, transform 320ms ease !important;
        }

        .site-header.is-scrolled .brand__mark {
          width: 2.18rem !important;
          height: 2.18rem !important;
          border-radius: 0.72rem !important;
        }

        .site-header .brand__text strong {
          font-size: 1rem !important;
          transition: font-size 400ms ease !important;
        }

        .site-header.is-scrolled .brand__text strong {
          font-size: 0.94rem !important;
        }

        .site-header .site-nav {
          gap: 1.25rem !important;
          padding: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          transition: gap 400ms ease, padding 400ms ease, background 300ms ease !important;
        }

        .site-header.is-scrolled .site-nav {
          gap: 0.2rem !important;
          padding: 0.18rem !important;
          border-radius: 999px !important;
          background: rgba(255, 255, 255, 0.045) !important;
        }

        .site-header .site-nav > a:not(.button),
        .site-header .nav-dropdown__toggle {
          min-height: auto !important;
          padding: 0 !important;
          border-radius: 0 !important;
          color: #ffffff !important;
          font-size: 0.95rem !important;
          background: transparent !important;
          transition:
            color 200ms ease,
            min-height 400ms ease,
            padding 400ms ease,
            border-radius 400ms ease,
            font-size 400ms ease,
            background 200ms ease,
            transform 200ms ease !important;
        }

        .site-header.is-scrolled .site-nav > a:not(.button),
        .site-header.is-scrolled .nav-dropdown__toggle {
          min-height: 2.25rem !important;
          padding: 0.55rem 0.72rem !important;
          border-radius: 999px !important;
          color: rgba(255, 255, 255, 0.78) !important;
          font-size: 0.88rem !important;
        }

        .site-header:not(.is-scrolled) .site-nav > a:not(.button)::before,
        .site-header:not(.is-scrolled) .nav-dropdown__toggle::before {
          display: none !important;
        }

        .site-header:not(.is-scrolled) .site-nav > a:not(.button):hover,
        .site-header:not(.is-scrolled) .site-nav > a:not(.button).is-active,
        .site-header:not(.is-scrolled) .nav-dropdown__toggle:hover,
        .site-header:not(.is-scrolled) .nav-dropdown[open] > .nav-dropdown__toggle,
        .site-header:not(.is-scrolled) .nav-dropdown--current > .nav-dropdown__toggle {
          color: #25da7b !important;
          background: transparent !important;
          transform: translateY(-1px) !important;
        }

        .site-header.is-scrolled .site-nav > a:not(.button):hover,
        .site-header.is-scrolled .nav-dropdown__toggle:hover,
        .site-header.is-scrolled .nav-dropdown[open] > .nav-dropdown__toggle {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }

        .site-header.is-scrolled .site-nav > a:not(.button).is-active,
        .site-header.is-scrolled .nav-dropdown--current > .nav-dropdown__toggle {
          color: #27e681 !important;
        }

        .site-header .header-actions {
          gap: 1.25rem !important;
          transition: gap 400ms ease !important;
        }

        .site-header.is-scrolled .header-actions {
          gap: 0.62rem !important;
        }

        .site-header .header-actions .nav-login {
          padding: 0 !important;
          font-size: 0.95rem !important;
          background: transparent !important;
          transition: padding 400ms ease, font-size 400ms ease, color 180ms ease, transform 180ms ease !important;
        }

        .site-header.is-scrolled .header-actions .nav-login {
          padding: 0.58rem 0.62rem !important;
          font-size: 0.88rem !important;
        }

        .site-header .nav-cta {
          min-height: 2.75rem !important;
          padding: 0.72rem 1.15rem !important;
          transition: min-height 400ms ease, padding 400ms ease, transform 180ms ease, box-shadow 240ms ease !important;
        }

        .site-header.is-scrolled .nav-cta {
          min-height: 2.42rem !important;
          padding: 0.58rem 1rem !important;
        }
      }

      @media (max-width: 820px) {
        .site-header {
          transition:
            top 400ms ease,
            left 400ms ease,
            width 400ms ease,
            padding 400ms ease,
            border-radius 400ms ease,
            background 300ms ease,
            box-shadow 300ms ease,
            transform 400ms ease !important;
        }

        .site-header.is-scrolled:not(.is-open) {
          top: 0.45rem !important;
          left: 0.65rem !important;
          width: calc(100% - 1.3rem) !important;
          min-height: 3.85rem !important;
          padding: 0.5rem 0.7rem !important;
          border-width: 1px !important;
          border-radius: 1.35rem !important;
          background: rgba(8, 13, 24, 0.94) !important;
          box-shadow:
            0 14px 34px rgba(8, 13, 24, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        }

        .site-header.is-open {
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          border-radius: 0 !important;
        }
      }

      .whatsapp-connect-widget {
        position: fixed;
        right: clamp(1rem, 2.5vw, 1.6rem);
        bottom: clamp(1rem, 2.5vw, 1.6rem);
        z-index: 70;
        font-family: "Manrope", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .whatsapp-connect-widget.is-open .whatsapp-connect-panel {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateY(0) scale(1);
      }

      .whatsapp-connect-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.65rem;
        min-height: 3.65rem;
        padding: 0.8rem 1.1rem;
        border: 0;
        border-radius: 999px;
        background: linear-gradient(135deg, #25da7b, #14c76d);
        color: #ffffff;
        font-weight: 900;
        font-size: 0.94rem;
        line-height: 1;
        box-shadow: 0 18px 42px rgba(20, 199, 109, 0.34);
        transition: transform 180ms ease, box-shadow 180ms ease;
      }

      .whatsapp-connect-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 24px 52px rgba(20, 199, 109, 0.42);
      }

      .whatsapp-connect-button__icon {
        display: grid;
        place-items: center;
        width: 2.1rem;
        height: 2.1rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.18);
      }

      .whatsapp-connect-button__icon img {
        width: 1.25rem;
        height: 1.25rem;
        object-fit: contain;
        filter: brightness(0) invert(1);
      }

      .whatsapp-connect-panel {
        position: absolute;
        right: 0;
        bottom: calc(100% + 0.9rem);
        width: min(calc(100vw - 2rem), 380px);
        overflow: hidden;
        border: 1px solid rgba(19, 54, 41, 0.12);
        border-radius: 1.35rem;
        background: #f0f4ef;
        box-shadow: 0 28px 70px rgba(8, 13, 24, 0.24);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translateY(12px) scale(0.97);
        transform-origin: right bottom;
        transition:
          opacity 220ms ease,
          visibility 220ms ease,
          transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .whatsapp-connect-panel__header {
        display: flex;
        align-items: center;
        gap: 0.78rem;
        padding: 0.95rem 1rem;
        background: #075e54;
        color: #ffffff;
      }

      .whatsapp-connect-panel__avatar {
        display: grid;
        place-items: center;
        width: 2.65rem;
        height: 2.65rem;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.26);
        border-radius: 999px;
        background: #ffffff;
      }

      .whatsapp-connect-panel__avatar img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 0.14rem;
      }

      .whatsapp-connect-panel__identity {
        min-width: 0;
        flex: 1 1 auto;
      }

      .whatsapp-connect-panel__identity strong {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        color: #ffffff;
        font-size: 0.98rem;
        line-height: 1.18;
      }

      .whatsapp-connect-panel__identity span {
        display: block;
        margin-top: 0.18rem;
        color: rgba(255, 255, 255, 0.78);
        font-size: 0.78rem;
        font-weight: 700;
      }

      .whatsapp-verified-badge {
        display: inline-grid;
        place-items: center;
        flex: 0 0 auto;
        width: 1rem;
        height: 1rem;
        border-radius: 999px;
        background: #168aff;
      }

      .whatsapp-verified-badge svg {
        width: 0.68rem;
        height: 0.68rem;
        stroke: #ffffff;
        stroke-width: 3;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .whatsapp-connect-panel__close {
        display: grid;
        place-items: center;
        flex: 0 0 2rem;
        width: 2rem;
        height: 2rem;
        border: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
        font-size: 1.25rem;
        line-height: 1;
      }

      .whatsapp-chat-surface {
        display: grid;
        gap: 0.7rem;
        min-height: 300px;
        padding: 1rem;
        background:
          linear-gradient(rgba(240, 244, 239, 0.82), rgba(240, 244, 239, 0.82)),
          radial-gradient(circle at 18% 18%, rgba(37, 218, 123, 0.18), transparent 13rem);
      }

      .whatsapp-message {
        width: fit-content;
        max-width: 88%;
        padding: 0.68rem 0.78rem;
        border-radius: 0.88rem;
        color: #1f2d24;
        font-size: 0.9rem;
        line-height: 1.45;
        box-shadow: 0 8px 18px rgba(19, 54, 41, 0.08);
      }

      .whatsapp-message--received {
        justify-self: start;
        border-top-left-radius: 0.24rem;
        background: #ffffff;
      }

      .whatsapp-message--sent {
        justify-self: end;
        border-top-right-radius: 0.24rem;
        background: #dcf8c6;
      }

      .whatsapp-message small {
        display: block;
        margin-top: 0.28rem;
        color: rgba(31, 45, 36, 0.52);
        font-size: 0.68rem;
        text-align: right;
      }

      .whatsapp-connect-form {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 2.8rem;
        gap: 0.55rem;
        padding: 0.75rem;
        background: #f8fbfa;
        border-top: 1px solid rgba(19, 54, 41, 0.09);
      }

      .whatsapp-connect-form input {
        width: 100%;
        min-height: 2.8rem;
        padding: 0.75rem 0.92rem;
        border: 1px solid rgba(19, 54, 41, 0.1);
        border-radius: 999px;
        background: #ffffff;
        color: #13241d;
        font: inherit;
        outline: none;
      }

      .whatsapp-connect-form input:focus {
        border-color: rgba(24, 191, 99, 0.54);
        box-shadow: 0 0 0 4px rgba(24, 191, 99, 0.12);
      }

      .whatsapp-connect-form button {
        display: grid;
        place-items: center;
        width: 2.8rem;
        min-height: 2.8rem;
        border: 0;
        border-radius: 999px;
        background: #25da7b;
        color: #ffffff;
        box-shadow: 0 10px 22px rgba(20, 199, 109, 0.26);
      }

      .whatsapp-connect-form button svg {
        width: 1.15rem;
        height: 1.15rem;
        fill: currentColor;
      }

      @media (max-width: 560px) {
        .whatsapp-connect-widget {
          right: 0.85rem;
          bottom: 0.85rem;
        }

        .whatsapp-connect-button {
          min-height: 3.25rem;
          padding: 0.65rem;
          border-radius: 999px;
        }

        .whatsapp-connect-button__text {
          display: none;
        }

        .whatsapp-connect-button__icon {
          width: 2rem;
          height: 2rem;
        }

        .whatsapp-connect-panel {
          width: calc(100vw - 1.7rem);
          bottom: calc(100% + 0.7rem);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function renderHeader() {
    const mount = document.querySelector("[data-site-header]");

    if (!mount) {
      return;
    }

    mount.innerHTML = `
      <header class="site-header">
        <a class="brand" href="/" aria-label="Connektly home">
          <span class="brand__mark brand__mark--image"><img src="${fromRoot("logo.svg")}" alt="" /></span>
          <span class="brand__text"><strong>Connektly</strong></span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Toggle navigation">
          <span></span><span></span>
        </button>
        <nav class="site-nav" id="site-nav" aria-label="Primary">
          <a href="/">Home</a>
          <div class="nav-dropdown">
            <button class="nav-dropdown__toggle" type="button" aria-expanded="false">Solutions</button>
            <div class="nav-dropdown__menu nav-dropdown__menu--mega nav-dropdown__menu--solutions">
              <div class="mega-menu">
                <a class="mega-menu__feature" href="/solutions/unified-inbox">
                  <span class="mega-menu__feature-kicker">Customer workspace</span>
                  <strong>Omnichannel Inbox</strong>
                  <span>Unify WhatsApp, Instagram, Messenger, calls, email, and CRM context in one shared record.</span>
                </a>
                <div class="mega-menu__columns mega-menu__columns--three">
                  <div class="mega-menu__column">
                    <span class="mega-menu__heading">Messaging</span>
                    <a href="/solutions/unified-inbox">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg></span>
                      <span>
                        <span class="dropdown-item-label">Unified Inbox</span>
                        <span class="dropdown-item-desc">Manage every customer conversation in one place.</span>
                      </span>
                    </a>
                  </div>
                  <div class="mega-menu__column">
                    <span class="mega-menu__heading">WhatsApp Business API</span>
                    <a href="/solutions/whatsapp-api">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></span>
                      <span>
                        <span class="dropdown-item-label">Explore Whatsapp Business API</span>
                        <span class="dropdown-item-desc">Build official WhatsApp communication workflows.</span>
                      </span>
                    </a>
                    <a href="/solutions/whatsapp-calling">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span>
                      <span>
                        <span class="dropdown-item-label">WhatsApp Business Calling</span>
                        <span class="dropdown-item-desc">Enable direct voice calls with customers.</span>
                      </span>
                    </a>
                    <a href="/solutions/whatsapp-marketing">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg></span>
                      <span>
                        <span class="dropdown-item-label">WhatsApp Marketing Campaigns</span>
                        <span class="dropdown-item-desc">Broadcast updates and offers to your audience.</span>
                      </span>
                    </a>
                    <a href="/solutions/ctwa">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg></span>
                      <span>
                        <span class="dropdown-item-label">Click to WhatsApp Ads (CTWA)</span>
                        <span class="dropdown-item-desc">Run meta ads that start conversations instantly.</span>
                      </span>
                    </a>
                  </div>
                  <div class="mega-menu__column">
                    <span class="mega-menu__heading">Workflows</span>
                    <a href="/features">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span>
                      <span>
                        <span class="dropdown-item-label">Automation</span>
                        <span class="dropdown-item-desc">Route, qualify, and follow up without manual handoffs.</span>
                      </span>
                    </a>
                    <a href="/pricing">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg></span>
                      <span>
                        <span class="dropdown-item-label">Plans & Scaling</span>
                        <span class="dropdown-item-desc">Choose the right plan for your messaging operation.</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <div class="nav-dropdown">
            <button class="nav-dropdown__toggle" type="button" aria-expanded="false">Resources</button>
            <div class="nav-dropdown__menu nav-dropdown__menu--mega nav-dropdown__menu--resources">
              <div class="mega-menu">
                <a class="mega-menu__feature" href="/help">
                  <span class="mega-menu__feature-kicker">Support center</span>
                  <strong>Find answers faster</strong>
                  <span>Browse support guides, policy documents, and practical product resources.</span>
                </a>
                <div class="mega-menu__columns mega-menu__columns--three">
                  <div class="mega-menu__column">
                    <span class="mega-menu__heading">Company</span>
                    <a href="/blogs">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></span>
                      <span>
                        <span class="dropdown-item-label">Blogs</span>
                        <span class="dropdown-item-desc">Insights, updates, and tutorials.</span>
                      </span>
                    </a>
                    <a href="/faq">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                      <span>
                        <span class="dropdown-item-label">FAQ</span>
                        <span class="dropdown-item-desc">Answers to commonly asked questions.</span>
                      </span>
                    </a>
                  </div>
                  <div class="mega-menu__column">
                    <span class="mega-menu__heading">Support</span>
                    <a href="/help">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg></span>
                      <span>
                        <span class="dropdown-item-label">Help Center</span>
                        <span class="dropdown-item-desc">Support guides for using Connektly.</span>
                      </span>
                    </a>
                    <a href="/contact">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></span>
                      <span>
                        <span class="dropdown-item-label">Contact Support</span>
                        <span class="dropdown-item-desc">Reach the team for account help.</span>
                      </span>
                    </a>
                  </div>
                  <div class="mega-menu__column">
                    <span class="mega-menu__heading">Legal</span>
                    <a href="/privacy-policy">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg></span>
                      <span>
                        <span class="dropdown-item-label">Privacy Policy</span>
                        <span class="dropdown-item-desc">How we collect, use, and handle data.</span>
                      </span>
                    </a>
                    <a href="/terms-of-service">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></span>
                      <span>
                        <span class="dropdown-item-label">Terms of Service</span>
                        <span class="dropdown-item-desc">Guidelines and rules for the service.</span>
                      </span>
                    </a>
                    <a href="/data-deletion">
                      <span class="dropdown-item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span>
                      <span>
                        <span class="dropdown-item-label">Data Deletion</span>
                        <span class="dropdown-item-desc">Request safe deletion of your data.</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="/contact">Contact Us</a>
          <div class="mobile-actions">
            <a class="nav-login" href="https://app.connektly.in/login" target="_blank" rel="noopener noreferrer">Login</a>
            <a class="button button--sm nav-cta" href="https://app.connektly.in/signup" target="_blank" rel="noopener noreferrer">Get Started</a>
          </div>
        </nav>
        <div class="header-actions">
          <a class="nav-login" href="https://app.connektly.in/login" target="_blank" rel="noopener noreferrer">Login</a>
          <a class="button button--sm nav-cta" href="https://app.connektly.in/signup" target="_blank" rel="noopener noreferrer">Get Started</a>
        </div>
      </header>
    `;
  }

  function renderFooter() {
    const mount = document.querySelector("[data-site-footer]");

    if (!mount) {
      return;
    }

    mount.innerHTML = `
      <footer class="site-footer custom-footer">
        <div class="footer-grid">
          <div class="footer-brand-col">
            <a class="footer-brand" href="/">
              <img class="footer-brand-logo" src="https://connektly.in/logo.svg" alt="Connektly" width="48" height="48" />
              <span class="footer-brand-text">Connektly</span>
            </a>
            <p class="footer-desc">The modern infrastructure for WhatsApp Cloud API. Build better conversational experiences faster.</p>
            <div class="footer-socials">
              <a href="https://www.instagram.com/connektlyy/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" class="social-icon"><img src="${fromRoot("Social Media Icons/Instagram.png")}" alt="Instagram" /></a>
              <a href="https://www.facebook.com/connektly" aria-label="Facebook" target="_blank" rel="noopener noreferrer" class="social-icon"><img src="${fromRoot("Social Media Icons/Facebook.svg")}" alt="Facebook" /></a>
              <a href="https://wa.me/12899070610" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" class="social-icon"><img src="${fromRoot("Social Media Icons/WhatsApp.svg")}" alt="WhatsApp" /></a>
            </div>
          </div>
          <div class="footer-nav-col"><h3>Product</h3><ul>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/solutions/unified-inbox">Unified Inbox</a></li>
            <li><a href="/solutions/whatsapp-api">WhatsApp Business API</a></li>
          </ul></div>
          <div class="footer-nav-col"><h3>Resources</h3><ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/data-deletion">Data Deletion</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/help">Help Center</a></li>
          </ul></div>
          <div class="footer-nav-col"><h3>Company</h3><ul>
            <li><a href="/">Home</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="https://app.connektly.in/login" target="_blank" rel="noopener noreferrer">Login</a></li>
            <li><a href="https://app.connektly.in/signup" target="_blank" rel="noopener noreferrer">Get Started</a></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <div class="footer-bottom-flex">
            <p class="footer-copy">&copy; 2026 Connektly. All rights reserved.</p>
            <ul class="footer-legal">
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms-of-service">Terms of Service</a></li>
            </ul>
          </div>
          <p class="footer-disclaimer">WhatsApp is a trademark of WhatsApp LLC. Connektly is an independent provider and is not affiliated with, associated with, or endorsed by WhatsApp LLC or Meta Platforms Inc.</p>
        </div>
      </footer>
    `;
  }

  function renderWhatsAppWidget() {
    if (document.querySelector("[data-whatsapp-connect-widget]")) {
      return;
    }

    const widget = document.createElement("div");
    widget.className = "whatsapp-connect-widget";
    widget.dataset.whatsappConnectWidget = "true";
    widget.innerHTML = `
      <div class="whatsapp-connect-panel" id="whatsapp-connect-panel" role="dialog" aria-modal="false" aria-labelledby="whatsapp-connect-title">
        <div class="whatsapp-connect-panel__header">
          <span class="whatsapp-connect-panel__avatar" aria-hidden="true">
            <img src="${fromRoot("logo.svg")}" alt="" />
          </span>
          <span class="whatsapp-connect-panel__identity">
            <strong id="whatsapp-connect-title">
              Connektly Solutions Pvt Ltd
              <span class="whatsapp-verified-badge" aria-label="Meta verified">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4 4L19 7" /></svg>
              </span>
            </strong>
            <span>Typically replies instantly</span>
          </span>
          <button class="whatsapp-connect-panel__close" type="button" data-whatsapp-connect-close aria-label="Close WhatsApp chat">&times;</button>
        </div>
        <div class="whatsapp-chat-surface" aria-label="WhatsApp chat preview">
          <div class="whatsapp-message whatsapp-message--received">
            Hi, welcome to Connektly Solutions Pvt Ltd. How can we help you today?
            <small>now</small>
          </div>
          <div class="whatsapp-message whatsapp-message--sent">
            I want to know more about Connektly.
            <small>now</small>
          </div>
          <div class="whatsapp-message whatsapp-message--received">
            Send us a message and we will open WhatsApp so our team can continue the conversation.
            <small>now</small>
          </div>
        </div>
        <form class="whatsapp-connect-form" data-whatsapp-connect-form>
          <input type="text" name="message" aria-label="WhatsApp message" placeholder="Type your message" autocomplete="off" />
          <button type="submit" aria-label="Send message on WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21.2 12 3.4 3.6 3 10.2l10.1 1.8L3 13.8l.4 6.6z" /></svg>
          </button>
        </form>
      </div>
      <button class="whatsapp-connect-button" type="button" data-whatsapp-connect-toggle aria-expanded="false" aria-controls="whatsapp-connect-panel">
        <span class="whatsapp-connect-button__icon" aria-hidden="true"><img src="${fromRoot("assets/whatsapp.svg")}" alt="" /></span>
        <span class="whatsapp-connect-button__text">Connect on WhatsApp</span>
      </button>
    `;

    document.body.appendChild(widget);
  }

  function normalizePathname(pathname) {
    const rawPath = pathname || "/";
    let normalized = rawPath.split("?")[0].split("#")[0] || "/";

    normalized = normalized.replace(/\/index\.html$/i, "/");
    normalized = normalized.replace(/\.html$/i, "");

    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }

    if (normalized.length > 1) {
      normalized = normalized.replace(/\/+$/, "");
    }

    return normalized || "/";
  }

  function setActiveNavLink() {
    const currentPath = normalizePathname(window.location.pathname);
    const navLinks = document.querySelectorAll(".site-nav a");
    const navDropdowns = document.querySelectorAll(".nav-dropdown");

    navLinks.forEach((link) => {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");

      const linkUrl = new URL(link.href, window.location.href);

      if (normalizePathname(linkUrl.pathname) === currentPath) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });

    navDropdowns.forEach((dropdown) => {
      const hasActiveChild = dropdown.querySelector("a.is-active");
      dropdown.classList.toggle("nav-dropdown--current", Boolean(hasActiveChild));
    });
  }

  function closeNavDropdown(dropdown) {
    dropdown.removeAttribute("open");
    const toggle = dropdown.querySelector(".nav-dropdown__toggle");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }

    delete dropdown.dataset.pinned;
  }

  function openNavDropdown(dropdown, options = {}) {
    const navDropdowns = document.querySelectorAll(".nav-dropdown");

    updateMegaMenuMeasurements();

    navDropdowns.forEach((entry) => {
      if (entry !== dropdown) {
        closeNavDropdown(entry);
      }
    });

    dropdown.setAttribute("open", "");
    const toggle = dropdown.querySelector(".nav-dropdown__toggle");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }

    if (options.pinned) {
      dropdown.dataset.pinned = "true";
    }
  }

  function closeAllNavDropdowns() {
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => closeNavDropdown(dropdown));
  }

  function updateMegaMenuMeasurements() {
    const header = document.querySelector(".site-header");

    if (!header || window.matchMedia("(max-width: 820px)").matches) {
      return;
    }

    const headerRect = header.getBoundingClientRect();
    const headerCenter = headerRect.left + headerRect.width / 2;

    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
      const menu = dropdown.querySelector(".nav-dropdown__menu--mega");

      if (!menu) {
        return;
      }

      const dropdownRect = dropdown.getBoundingClientRect();
      const dropdownCenter = dropdownRect.left + dropdownRect.width / 2;

      menu.style.setProperty("--mega-menu-header-width", `${headerRect.width}px`);
      menu.style.setProperty("--mega-menu-shift-x", `${headerCenter - dropdownCenter}px`);
    });
  }

  function toggleMenu(forceState) {
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");

    if (!header || !navToggle) {
      return;
    }

    const shouldOpen =
      typeof forceState === "boolean" ? forceState : !header.classList.contains("is-open");

    header.classList.toggle("is-open", shouldOpen);
    navToggle.setAttribute("aria-expanded", String(shouldOpen));

    if (shouldOpen) {
      header.classList.remove("is-hidden");
    }

    if (!shouldOpen) {
      closeAllNavDropdowns();
    }
  }

  function updateHeaderScrollState() {
    const header = document.querySelector(".site-header");

    if (!header) {
      return;
    }

    const currentY = Math.max(window.scrollY || 0, 0);
    const scrolled = currentY > 2;
    const stateChanged = headerCompactState !== scrolled;

    header.classList.toggle("is-scrolled", scrolled);
    header.classList.remove("is-hidden");

    if (stateChanged) {
      headerCompactState = scrolled;
      updateMegaMenuMeasurements();
      window.setTimeout(updateMegaMenuMeasurements, 420);
    }

    lastHeaderScrollY = currentY;
    headerScrollInitialized = true;
  }

  function requestHeaderScrollStateUpdate() {
    if (headerScrollFrameId) {
      return;
    }

    headerScrollFrameId = window.requestAnimationFrame(() => {
      headerScrollFrameId = 0;
      updateHeaderScrollState();
    });
  }

  function bindWhatsAppWidgetInteractions() {
    const widget = document.querySelector("[data-whatsapp-connect-widget]");

    if (!widget || widget.dataset.whatsappBound === "true") {
      return;
    }

    const toggle = widget.querySelector("[data-whatsapp-connect-toggle]");
    const closeButton = widget.querySelector("[data-whatsapp-connect-close]");
    const form = widget.querySelector("[data-whatsapp-connect-form]");
    const input = form ? form.querySelector("input") : null;
    const whatsAppUrl = "https://wa.me/919953321314";

    widget.dataset.whatsappBound = "true";

    function setWidgetOpen(shouldOpen) {
      widget.classList.toggle("is-open", shouldOpen);

      if (toggle) {
        toggle.setAttribute("aria-expanded", String(shouldOpen));
      }

      if (shouldOpen && input) {
        window.setTimeout(() => input.focus({ preventScroll: true }), 120);
      }
    }

    if (toggle) {
      toggle.addEventListener("click", () => {
        setWidgetOpen(!widget.classList.contains("is-open"));
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => setWidgetOpen(false));
    }

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.href = whatsAppUrl;
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && widget.classList.contains("is-open")) {
        setWidgetOpen(false);
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      if (target instanceof Element && !target.closest("[data-whatsapp-connect-widget]")) {
        setWidgetOpen(false);
      }
    });
  }

  function bindHeaderInteractions() {
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelectorAll(".site-nav a");
    const navDropdowns = document.querySelectorAll(".nav-dropdown");

    if (!header || header.dataset.headerBound === "true") {
      return;
    }

    header.dataset.headerBound = "true";

    if (navToggle) {
      navToggle.addEventListener("click", () => toggleMenu());
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => toggleMenu(false));
    });

    navDropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".nav-dropdown__toggle");

      if (toggle) {
        toggle.addEventListener("click", (event) => {
          event.preventDefault();

          if (dropdown.dataset.pinned === "true") {
            closeNavDropdown(dropdown);
            return;
          }

          openNavDropdown(dropdown, { pinned: true });
        });
      }

      dropdown.addEventListener("mouseenter", () => {
        openNavDropdown(dropdown);
      });

      dropdown.addEventListener("mouseleave", () => {
        if (dropdown.dataset.pinned === "true") {
          return;
        }

        closeNavDropdown(dropdown);
      });
    });

    if (document.documentElement.dataset.globalNavClickBound !== "true") {
      document.documentElement.dataset.globalNavClickBound = "true";

      document.addEventListener("click", (event) => {
        const target = event.target;

        if (target instanceof Element && !target.closest(".nav-dropdown")) {
          closeAllNavDropdowns();
        }
      });

      window.addEventListener("scroll", requestHeaderScrollStateUpdate, { passive: true });
      window.addEventListener("resize", updateMegaMenuMeasurements);
    }

    updateMegaMenuMeasurements();
    updateHeaderScrollState();
  }

  function renderComponents() {
    injectHeaderStyles();
    renderHeader();
    renderFooter();
    renderWhatsAppWidget();
    setActiveNavLink();
    bindHeaderInteractions();
    bindWhatsAppWidgetInteractions();
    document.dispatchEvent(new Event("componentsLoaded"));
  }

  window.ConnektlyComponents = {
    render: renderComponents
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderComponents, { once: true });
  } else {
    renderComponents();
  }
})();
