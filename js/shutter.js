(() => {
    if (window.__SHUTTER_INIT__) return;
    window.__SHUTTER_INIT__ = true;

    const shutter = document.getElementById("shutter");
    if (!shutter) return;

    const show = () => shutter.classList.add("is-show");
    const hide = () => shutter.classList.remove("is-show");

    const opening = () => {
        show();
        shutter.classList.remove("is-closing", "is-opening");

        // まず閉じた状態を作る（CSSアニメのfrom=0に合わせる）
        shutter.querySelector(".panel--left").style.transform = "translateX(0)";
        shutter.querySelector(".panel--right").style.transform = "translateX(0)";

        requestAnimationFrame(() => {
            shutter.classList.add("is-opening");
            // 開き終わったら初期状態に戻して非表示
            setTimeout(() => {
                shutter.classList.remove("is-opening");
                shutter.querySelector(".panel--left").style.transform = "";
                shutter.querySelector(".panel--right").style.transform = "";
                hide();
            }, 260);
        });
    };

    const closing = () => {
        show();
        shutter.classList.remove("is-closing", "is-opening");
        void shutter.offsetWidth;
        shutter.classList.add("is-closing");
    };

    window.addEventListener("load", opening, { once: true });
    window.addEventListener("pageshow", (e) => { if (e.persisted) opening(); });

    let navigating = false;
    document.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (!a) return;

        const href = a.getAttribute("href") || "";
        const sameOrigin = a.origin === location.origin;
        if (a.target === "_blank" || a.hasAttribute("download") || !href || href.startsWith("#") || !sameOrigin) return;

        e.preventDefault();
        if (navigating) return;
        navigating = true;

        closing();
        setTimeout(() => { location.href = a.href; }, 210);
    }, { capture: true });
})();