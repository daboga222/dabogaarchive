
(() => {
    "use strict";

    const screen = document.getElementById("loadingScreen");

    if (!screen) return;

    const STORAGE_KEY = "dabogaNavigationStarted";
    const MINIMUM_DISPLAY_TIME = 2000;
    const NAVIGATION_THRESHOLD = 1500;
    const FADE_OUT_TIME = 500;

    let startedAt = Date.now();
    let internalNavigation = false;

    // Recuperar el inicio de una navegación interna.
    try {
        const storedValue = sessionStorage.getItem(STORAGE_KEY);

        if (storedValue) {
            const timestamp = Number(storedValue);

            if (Number.isFinite(timestamp) && timestamp > 0) {
                startedAt = timestamp;
                internalNavigation = true;
            }

            sessionStorage.removeItem(STORAGE_KEY);
        }
    } catch (error) {
        // El loader sigue funcionando sin sessionStorage.
    }

    const elapsed = Date.now() - startedAt;

    // Evitar mostrar el loader en navegaciones demasiado rápidas.
    if (internalNavigation && elapsed < NAVIGATION_THRESHOLD) {
        screen.remove();
        return;
    }

    const hideLoadingScreen = () => {
        const remainingTime = Math.max(
            0,
            MINIMUM_DISPLAY_TIME - (Date.now() - startedAt)
        );

        window.setTimeout(() => {
            screen.classList.add("is-hidden");
            screen.setAttribute("aria-hidden", "true");

            window.setTimeout(() => {
                screen.remove();
            }, FADE_OUT_TIME);

        }, remainingTime);
    };

    if (document.readyState === "complete") {
        hideLoadingScreen();
    } else {
        window.addEventListener("load", hideLoadingScreen, {
            once: true
        });
    }

    // Registrar navegación entre páginas de la propia web.
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");

        if (!link) return;

        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            link.target === "_blank" ||
            link.hasAttribute("download")
        ) {
            return;
        }

        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        let destination;

        try {
            destination = new URL(href, window.location.href);
        } catch (error) {
            return;
        }

        if (
            destination.origin !== window.location.origin ||
            destination.pathname === window.location.pathname &&
            destination.search === window.location.search &&
            destination.hash
        ) {
            return;
        }

        try {
            sessionStorage.setItem(
                STORAGE_KEY,
                String(Date.now())
            );
        } catch (error) {
            // La navegación continúa normalmente.
        }
    });
})();
