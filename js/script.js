document.addEventListener("DOMContentLoaded", () => {

    (() => {
        if (window.__SHUTTER_BOUND__) return;
        window.__SHUTTER_BOUND__ = true;

        const shutter = document.getElementById("shutter");
        if (!shutter) return;

        const play = () => {
            shutter.classList.add("show");
            shutter.classList.remove("play");
            void shutter.offsetWidth;      // アニメ再始動
            shutter.classList.add("play");
        };

        // ページ表示時：開く演出→消す
        window.addEventListener("pageshow", () => {
            play();
            setTimeout(() => shutter.classList.remove("show"), 980);
        });

        // リンククリック時：閉じてから遷移
        document.addEventListener("click", (e) => {
            const a = e.target.closest("a");
            if (!a) return;

            const href = a.getAttribute("href") || "";
            const sameOrigin = a.origin === location.origin;

            // 除外（外部、新規タブ、DL、ページ内#）
            if (a.target === "_blank" || a.hasAttribute("download") || !href || href.startsWith("#") || !sameOrigin) return;

            e.preventDefault();
            play();

            // 閉じ切るタイミング（0.95sの30%あたり）
            setTimeout(() => {
                location.href = a.href;
            }, 320);
        }, { capture: true });
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
    const carryBird = document.querySelector(".inquiry-carry__bird");

    if (carry && carryBird) {
        const month = new Date().getMonth() + 1;

        let src = "images/webp/whitebird-spring.webp";

        if (month >= 6 && month <= 8) {
            src = "images/webp/whitebird-summer.webp";
        } else if (month >= 9 && month <= 11) {
            src = "images/webp/whitebird-autumn.webp";
        } else if (month === 12 || month <= 2) {
            src = "images/webp/whitebird-winter.webp";
        }

        carryBird.src = src;

        // 季節クラス（CSS演出用・使わなくてもOK）
        carry.classList.remove("is-spring", "is-summer", "is-autumn", "is-winter");

        const season =
            month >= 3 && month <= 5
                ? "spring"
                : month >= 6 && month <= 8
                    ? "summer"
                    : month >= 9 && month <= 11
                        ? "autumn"
                        : "winter";

        carry.classList.add(`is-${season}`);
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

        const loop = () => {
            const left = carryEl.getBoundingClientRect().left;

            if (lastLeft !== null) {
                // leftが増える＝左→右（戻り）
                carryEl.classList.toggle("is-back", left > lastLeft);
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