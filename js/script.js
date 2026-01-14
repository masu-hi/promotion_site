document.addEventListener("DOMContentLoaded", () => {

    (() => {
        const header = document.querySelector(".header");
        if (!header) return;

        const isHome = document.body.classList.contains("is-home");
        if (!isHome) return; // 他ページはCSSで常時ONなので何もしない

        const THRESHOLD = 950;

        const update = () => {
            header.classList.toggle("is-solid", window.scrollY >= THRESHOLD);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
    })();

    // =========================
    // Drawer
    // =========================
    const drawer = document.querySelector(".drawer");
    const toggle = document.querySelector(".drawer__toggle");
    const closeBtn = document.querySelector(".drawer__close");
    const mask = document.querySelector(".drawer__mask");

    if (drawer && toggle) {
        toggle.addEventListener("click", () => drawer.classList.add("is-open"));
    }
    if (drawer && closeBtn) {
        closeBtn.addEventListener("click", () => drawer.classList.remove("is-open"));
    }
    if (drawer && mask) {
        mask.addEventListener("click", () => drawer.classList.remove("is-open"));
    }

    // Flash & underline
    const flash = document.querySelector(".flash-effect");
    const drawerLinks = document.querySelectorAll(".drawer__item a");

    if (flash && drawerLinks.length) {
        drawerLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                drawerLinks.forEach((l) => l.classList.remove("is-active"));
                e.currentTarget.classList.add("is-active");

                flash.classList.add("is-active");
                setTimeout(() => flash.classList.remove("is-active"), 200);
            });
        });
    }

    // =========================
    // Gallery tabs
    // =========================
    const tabs = document.querySelectorAll(".gallery__tab");
    const panels = document.querySelectorAll(".gallery__panel");

    if (tabs.length && panels.length) {
        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.dataset.galleryTab;

                tabs.forEach((t) => {
                    const isActive = t === tab;
                    t.classList.toggle("is-active", isActive);
                    t.setAttribute("aria-selected", String(isActive));
                });

                panels.forEach((panel) => {
                    const isActive = panel.dataset.galleryPanel === target;
                    panel.classList.toggle("is-active", isActive);
                    panel.hidden = !isActive;
                });
            });
        });
    }

    // =========================
    // ① 季節で鳩画像を切り替える
    // =========================
    const carry = document.querySelector(".inquiry-carry");
    const body = document.querySelector(".inquiry-carry__bird-body");

    if (carry && body) {
        const m = new Date().getMonth() + 1;
        let src = "images/webp/whitebird-spring.webp";
        if (m >= 6 && m <= 8) src = "images/webp/whitebird-summer.webp";
        else if (m >= 9 && m <= 11) src = "images/webp/whitebird-autumn.webp";
        else if (m === 12 || m <= 2) src = "images/webp/whitebird-winter.webp";
        body.src = src;
    }

    // =========================
    // ② carry の横幅を測って Uターン位置を正確にする
    // =========================
    const carryPack = document.querySelector(".inquiry-carry__anim");

    const setCarryWidthVar = () => {
        if (!carry || !carryPack) return;

        const width = Math.ceil(carryPack.getBoundingClientRect().width);
        carry.style.setProperty("--carry-w", `${width}px`);
    };

    // 初期化
    setCarryWidthVar();

    // リサイズ対応
    window.addEventListener("resize", setCarryWidthVar);

    // =========================
    // PC：戻り(左→右)判定してクラスを付ける（鳩を左へ移動用）
    // =========================
    const carryEl = document.querySelector(".inquiry-carry");
    if (carryEl) {
        let lastLeft = null;
        let lastIsBack = false;

        const loop = () => {
            // ★ホバー中は向きを更新しない（止まった瞬間の向きを維持）
            if (carryEl.matches(":hover")) {
                requestAnimationFrame(loop);
                return;
            }

            const left = carryEl.getBoundingClientRect().left;

            if (lastLeft !== null) {
                // leftが増える＝左→右（戻り）
                lastIsBack = left > lastLeft;
                carryEl.classList.toggle("is-back", lastIsBack);
            }

            lastLeft = left;
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    // =========================
    // Gallery modal
    // =========================
    const modal = document.getElementById("galleryModal");
    if (modal) {
        const modalImg = modal.querySelector(".gallery-modal__img");
        if (!modalImg) return;

        const openModal = (imgEl) => {
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            modalImg.src = imgEl.currentSrc || imgEl.src;
            modalImg.alt = imgEl.alt || "";
            document.body.style.overflow = "hidden";
        };

        const closeModal = () => {
            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            modalImg.src = "";
            modalImg.alt = "";
            document.body.style.overflow = "";
        };

        document.addEventListener(
            "click",
            (e) => {
                if (modal.classList.contains("is-open")) {
                    e.preventDefault();
                    closeModal();
                    return;
                }

                const img = e.target.closest("img[data-gallery-open]");
                if (img) {
                    e.preventDefault();
                    openModal(img);
                }
            },
            true
        );

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
        });
    }
});