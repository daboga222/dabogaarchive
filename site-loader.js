(() => {
    "use strict";

    const screen = document.getElementById("loadingScreen");

    if (!screen) {
        return;
    }

    const STORAGE_KEY = "dabogaNavigationStarted";
    const MINIMUM_DISPLAY_TIME = 2000;
    const NAVIGATION_THRESHOLD = 1500;
    const FADE_OUT_TIME = 500;

    let startedAt = Date.now();
    let internalNavigation = false;

    // Recuperar el momento en que comenzó la navegación interna.
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
        // El sistema sigue funcionando si sessionStorage no está disponible.
    }

    const elapsed = Math.max(0, Date.now() - startedAt);

    // Evitar que el loader parpadee en navegaciones rápidas.
    if (internalNavigation && elapsed < NAVIGATION_THRESHOLD) {
        screen.remove();
        return;
    }

    // Ocultar el loader cuando la página esté lista,
    // respetando el tiempo mínimo de visualización.
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

    // Registrar únicamente los enlaces internos reales.
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");

        if (!link) {
            return;
        }

        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        const href = link.getAttribute("href");

        if (
            !href ||
            href === "#" ||
            link.target === "_blank" ||
            link.hasAttribute("download")
        ) {
            return;
        }

        let destination;

        try {
            destination = new URL(href, window.location.href);
        } catch (error) {
            return;
        }

        // No activar el loader para enlaces externos
        // ni para enlaces a la página actual.
        if (
            destination.origin !== window.location.origin ||
            destination.href === window.location.href
        ) {
            return;
        }

        try {
            sessionStorage.setItem(
                STORAGE_KEY,
                String(Date.now())
            );
        } catch (error) {
            // La navegación continúa aunque falle el almacenamiento.
        }
    });
})();
