import ReviewPlanDialog from "./ReviewPlanDialog.js";
import OpenPlanCommand from "./OpenPlanCommand.js";
import GetPlanNamesCommand from "./GetPlanNamesCommand.js";

export default function OpenPlanDialog(app, id) {
    ReviewPlanDialog.apply(this, arguments);

    this.planName = "";
    this.sendGetPlanNamesRequest = async () => {
        this.app.onGetPlanNamesRequestStart();
        let res;
        try {
            res = await new GetPlanNamesCommand().execute();
        } catch (e) {
            this.app.onServerUnexpectedError(e);
            return;
        }
        this.app.onGetPlanNamesRequestEnd(res);
    };
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
    this.getPlanName = () => {
        return this.planName;
    };
    this.parentInit = this.init;
    this.init = () => {
        this.parentInit();
        document.querySelectorAll("#Menu a.open")[0].onclick = this.sendGetPlanNamesRequest;
        this.dialog.querySelectorAll('input.submit-modal')[0].onclick = this.sendOpenPlanRequest;
    };
}