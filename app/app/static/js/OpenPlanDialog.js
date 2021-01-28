import ReviewPlanDialog from "./ReviewPlanDialog.js";
import OpenPlanCommand from "./OpenPlanCommand.js";

export default function OpenPlanDialog(app, menu, id) {
    ReviewPlanDialog.apply(this, [app, id]);

    this.menu = menu;
    this.sendOpenPlanRequest = async () => {
        this.planName = this.select.value;
        this.app.onSendOpenPlanRequestStart();
        let res;
        try {
            res = await new OpenPlanCommand().execute(this.planName);
        } catch (e) {
            this.app.onServerUnexpectedError(e);
            return;
        }
        this.app.onSendOpenPlanRequestEnd(res);
    };
    this.parentInit = this.init;
    this.init = () => {
        this.parentInit();
        this.openCmd = document.querySelectorAll("#Menu a.open")[0];
        this.dialog.querySelectorAll('input.submit-modal')[0].onclick = this.sendOpenPlanRequest;
    };
    this.setDialogState = (enabled) => {
        this.menu.setOpenCommandState(enabled);
        if (enabled) {
            this.openCmd.onclick = this.sendGetPlanNamesRequest;
        } else {
            this.openCmd.onclick = '';
        }
    };
}