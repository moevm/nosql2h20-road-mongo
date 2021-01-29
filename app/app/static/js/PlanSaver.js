import UpdatePlanCommand from "./UpdatePlanCommand.js";

export default function PlanSaver(app, menu) {
    this.app = app;
    this.menu = menu;

    this.init = () => {
        this.saveCmd = document.querySelectorAll("#Menu a.save")[0];
    }
    this.setSaveState = (enabled) => {
        this.menu.setSaveCommandState(enabled);
        if (enabled) {
            this.saveCmd.onclick = this.savePlan;
        } else {
            this.saveCmd.onclick = '';
        }
    };
    this.savePlan = async () => {
        let [planName, plan] = this.app.onSavePlanStart();
        let res;
        try {
            res = await new UpdatePlanCommand().execute(planName, plan);
        } catch (e) {
            this.app.onServerUnexpectedError(e);
            return;
        }
        this.app.onSavePlanEnd(res);
    };
}