export default function CreatePlanDialog(app) {
    this.planExistsMsg = 'Не удалось добавить план. План с таким названием уже существует.';
    this.app = app;
    this.init = () => {
        this.dialog = document.getElementById("createPlanDialog");
        this.planNameInput = this.dialog.querySelectorAll('input[name="plan-name"]')[0];

        document.querySelectorAll("#Menu a.create")[0].onclick = this.app.showCreatePlanDialog;
        document.querySelectorAll('#createPlanDialog input.submit-modal')[0].onclick = this.sendCreatePlanRequest;
        document.querySelectorAll('#createPlanDialog button.close-modal')[0].onclick = this.close;
    };
    this.show = () => {
        this.planNameInput.value = "";
        this.dialog.classList.add("is-visible");
    };
    this.close = () => {
        this.dialog.classList.remove("is-visible");
    };
    this.sendCreatePlanRequest = () => {
        this.app.onSendCreatePlanRequestStart();
        fetch('/create-plan', {
            method: 'POST',
            body: this.planNameInput.value
        }).then(response => this.app.onSendCreatePlanRequestEnd(response.status));
    };
}