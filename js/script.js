document.addEventListener("DOMContentLoaded", () => {
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
    // Inquiry carry - season bird (花つき切り替え)
    // =========================
    const carry = document.querySelector(".inquiry-carry");
    const carryBird = document.querySelector(".inquiry-carry__bird");

    if (carry && carryBird) {
        const month = new Date().getMonth() + 1;

        // ★ここだけあなたの画像パスに合わせて変えてOK
        // 例：/images/webp/ など
        let src = "images/webp/whitebird-spring.webp";

        if (month >= 6 && month <= 8) {
            src = "images/webp/whitebird-summer.webp";
        } else if (month >= 9 && month <= 11) {
            src = "images/webp/whitebird-autumn.webp";
        } else if (month === 12 || month <= 2) {
            src = "images/webp/whitebird-winter.webp";
        }

        // 既に同じなら何もしない（無駄な再読み込み防止）
        if (!carryBird.getAttribute("src") || carryBird.getAttribute("src") !== src) {
            carryBird.setAttribute("src", src);
        }

        // 任意：季節クラスも付ける（CSSでちょい演出したい時用）
        carry.classList.remove(
            "is-spring",
            "is-summer",
            "is-autumn",
            "is-winter"
        );

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