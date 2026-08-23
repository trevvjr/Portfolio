function openMenu() {
    document.body.classList.add("menu--open");
}

function closeMenu() {
    document.body.classList.remove("menu--open");
}

// Scroll Animation - Swipe in from left and right
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate sections and elements
document.addEventListener("DOMContentLoaded", () => {
    const animateElements = document.querySelectorAll(
        "section, .feature, .step, .value, .plan"
    );
    
    animateElements.forEach((element) => {
        observer.observe(element);
    });
});