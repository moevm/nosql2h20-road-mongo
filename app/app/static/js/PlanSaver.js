import UpdatePlanCommand from "./UpdatePlanCommand.js";

export default function PlanSaver(app) {
    this.app = app;

    this.savePlan = async (planName, plan) => {
        this.app.onSavePlanStart();
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