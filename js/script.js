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