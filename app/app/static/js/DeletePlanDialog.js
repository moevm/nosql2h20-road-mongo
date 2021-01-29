import ReviewPlanDialog from "./ReviewPlanDialog.js";
import DeletePlanCommand from "./DeletePlanCommand.js";

export default function DeletePlanDialog(app, menu, id) {
    ReviewPlanDialog.apply(this, [app, id]);

    this.menu = menu;
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
        this.deleteCmd = document.querySelectorAll("#Menu a.delete")[0];
        this.dialog.querySelectorAll('input.submit-modal')[0].onclick = this.sendDeletePlanRequest;
    };
    this.setDialogState = (enabled) => {
        this.menu.setDeleteCommandState(enabled);
        if (enabled) {
            this.deleteCmd.onclick = this.sendGetPlanNamesRequest;
        } else {
            this.deleteCmd.onclick = '';
        }
    };
}