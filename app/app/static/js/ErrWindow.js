export default function ErrWindow(app) {
    this.app = app;
    this.init = () => {
        this.errWindow = document.getElementById('err-window');
        this.contentHolder = this.errWindow.querySelectorAll('.content')[0];

        document.querySelectorAll('#err-window button.close-modal')[0].onclick = this.close;
    };
    this.close = () => {
        this.errWindow.classList.remove("is-visible");
    };
    this.show = (innerHTMLContent) => {
        this.errWindow.classList.add("is-visible");
        this.contentHolder.innerHTML = innerHTMLContent;
    };
}