
(() => {
    "use strict";

    const screen = document.getElementById("loadingScreen");

    if (!screen) return;

    const STORAGE_KEY = "dabogaLoaderNavigation";
    const SHOW_DELAY = 2000;
    const MINIMUM_DISPLAY_TIME = 2000;
    const FADE_OUT_TIME = 500;

    let navigation = null;
    let visibleAt = 0;
    let loaderVisible = false;
    let hideScheduled = false;

    const getSection = (url) => {
        const path = url.pathname.toLowerCase();
        const file = path.split("/").pop();

        if (file === "" || file === "index.html") {
            return "home";
        }

        if (file === "beatmaking.html") return "beatmaking";
        if (file === "daboga.html") return "daboga";
        if (file === "music.html") return "music";
        if (file === "archive.html") return "archive";

        return null;
    };

    const showLoader = () => {
        if (loaderVisible) return;

        loaderVisible = true;
        visibleAt = Date.now();

        screen.classList.remove("is-pending", "is-hidden");
        screen.setAttribute("aria-hidden", "false");
    };

    const hideLoader = () => {
        if (!loaderVisible || hideScheduled) return;

        hideScheduled = true;

        const elapsed = Date.now() - visibleAt;
        const remaining = Math.max(
            0,
            MINIMUM_DISPLAY_TIME - elapsed
        );

        window.setTimeout(() => {
            screen.classList.add("is-hidden");
            screen.setAttribute("aria-hidden", "true");

            window.setTimeout(() => {
                screen.remove();
            }, FADE_OUT_TIME);
        }, remaining);
    };

    // Recuperar la navegación anterior.
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);

        if (stored) {
            navigation = JSON.parse(stored);
            sessionStorage.removeItem(STORAGE_KEY);
        }
    } catch (error) {
        navigation = null;
    }

    // Primera entrada: mostrar siempre.
    if (!navigation) {
        showLoader();
        hideLoader();
    }

    // Cambio de directorio principal: mostrar inmediatamente.
    else if (navigation.type === "main") {
        showLoader();
        hideLoader();
    }

    // Mismo directorio: mostrar solo si supera los 2 segundos.
    else {
        screen.classList.add("is-pending");

        const elapsed = Math.max(
            0,
            Date.now() - navigation.startedAt
        );

        const remaining = Math.max(
            0,
            SHOW_DELAY - elapsed
        );

        window.setTimeout(() => {
            showLoader();
            hideLoader();
        }, remaining);
    }

    // Detectar navegaciones entre páginas.
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

        if (!href || href.startsWith("#")) return;

        let destination;

        try {
            destination = new URL(
                href,
                window.location.href
            );
        } catch (error) {
            return;
        }

        if (destination.origin !== window.location.origin) {
            return;
        }

        if (
            destination.pathname === window.location.pathname &&
            destination.search === window.location.search
        ) {
            return;
        }

        const currentSection = getSection(
            new URL(window.location.href)
        );

        const destinationSection = getSection(destination);

        const isMainNavigation =
            currentSection !== null &&
            destinationSection !== null &&
            currentSection !== destinationSection;

        try {
            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    type: isMainNavigation ? "main" : "internal",
                    startedAt: Date.now()
                })
            );
        } catch (error) {
            // La navegación continúa normalmente.
        }
    });

})();
