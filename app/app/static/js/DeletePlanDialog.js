import ReviewPlanDialog from "./ReviewPlanDialog.js";
import DeletePlanCommand from "./DeletePlanCommand.js";

export default function DeletePlanDialog(app, id) {
    ReviewPlanDialog.apply(this, arguments);

    this.sendDeletePlanRequest = async () => {
        this.planName = this.select.value;
        this.app.onSendDeletePlanRequestStart();
        let res;
        try {
            res = await new DeletePlanCommand().execute(this.planName);
        } catch (e) {
            this.app.onServerUnexpectedError(e);
            return;
        }
        this.app.onSendDeletePlanRequestEnd(res);
    };
    this.parentInit = this.init;
    this.init = () => {
        this.parentInit();
        document.querySelectorAll("#Menu a.delete")[0].onclick = this.sendGetPlanNamesRequest;
        this.dialog.querySelectorAll('input.submit-modal')[0].onclick = this.sendDeletePlanRequest;
    };
}