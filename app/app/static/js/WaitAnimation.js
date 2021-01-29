export default function WaitAnimation(app) {
    this.app = app;
    this.init = () => {
        this.waitAnimation = document.getElementById('wait-animation');
    };
    this.show = () => {
        this.waitAnimation.classList.add("is-visible");
    };
    this.close = () => {
        this.waitAnimation.classList.remove("is-visible");
    };
}