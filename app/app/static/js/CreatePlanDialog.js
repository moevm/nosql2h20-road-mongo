import CreatePlanCommand from "./CreatePlanCommand.js";

export default function CreatePlanDialog(app) {
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
    this.getPlanName = () => {
       return this.planNameInput.value;
    };
    this.sendCreatePlanRequest = async () => {
        this.app.onSendCreatePlanRequestStart();
        let planName = this.getPlanName();
        let res;
        try {
            res = await new CreatePlanCommand().execute(planName);
        }
        catch(e) {
            this.app.onServerUnexpectedError(e);
            return;
        }
        this.app.onSendCreatePlanRequestEnd(res);
    };
}