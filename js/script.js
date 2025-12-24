const drawer = document.querySelector(".drawer");
const toggle = document.querySelector(".drawer__toggle");
const closeBtn = document.querySelector(".drawer__close");
const mask = document.querySelector(".drawer__mask");

toggle.addEventListener("click", () => {
    drawer.classList.add("is-open");
});

closeBtn.addEventListener("click", () => {
    drawer.classList.remove("is-open");
});

mask.addEventListener("click", () => {
    drawer.classList.remove("is-open");
});

// ==== フラッシュ & 下線アニメーション ====
const flash = document.querySelector(".flash-effect");
const drawerLinks = document.querySelectorAll(".drawer__item a");

drawerLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        // 下線アニメーション
        drawerLinks.forEach(l => l.classList.remove("is-active"));
        e.target.classList.add("is-active");

        // フラッシュアニメーション
        flash.classList.add("is-active");
        setTimeout(() => {
            flash.classList.remove("is-active");
        }, 200);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".gallery__tab");
    const panels = document.querySelectorAll(".gallery__panel");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.galleryTab;

            // tabs
            tabs.forEach((t) => {
                const isActive = t === tab;
                t.classList.toggle("is-active", isActive);
                t.setAttribute("aria-selected", String(isActive));
            });

            // panels
            panels.forEach((panel) => {
                const isActive = panel.dataset.galleryPanel === target;
                panel.classList.toggle("is-active", isActive);
                panel.hidden = !isActive;
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("galleryModal");
    const modalImg = modal.querySelector(".gallery-modal__img");

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

    // 画像クリックで開く（任意：gallery内だけに限定）
    document.addEventListener("click", (e) => {
        // ① モーダルが開いてる時：どこを押しても閉じる
        if (modal.classList.contains("is-open")) {
            e.preventDefault();
            closeModal();
            return;
        }

        // ② モーダルが閉じてる時：画像を押したら開く
        const img = e.target.closest("img[data-gallery-open]");
        if (img) {
            e.preventDefault();
            openModal(img);
        }
    }, true); // ← captureで最優先で拾う（重要）

    // ESCで閉じる
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });
});