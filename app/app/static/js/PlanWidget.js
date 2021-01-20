import RenamePlanCommand from "./RenamePlanCommand.js";

export default function PlanWidget(app) {
    this.app = app;
    this.input = document.querySelectorAll('header input.plan-name')[0];
    this.widget = document.querySelectorAll('div.plan')[0];
    this.input.value = "";
    this.planNameCopy = "";
    this.init = () => {
        this.input.onchange = this.onchangePlanName;
        this.input.onclick = this.onclickPlanName;
    };
    this.setPlanName = (name) => {
        this.input.value = name;
    };
    this.getPlanName = () => {
        return this.input.value;
    };
    this.show = () => {
        this.widget.style.visibility = 'visible';
    };
    this.close = () => {
        this.widget.style.visibility = 'hidden';
    };
    this.onchangePlanName = () => {
        this.app.onPlanNameChange();
        this.sendRenamePlanRequest();
        console.log("this.planNameCopy: ", this.planNameCopy);
    };
    this.onclickPlanName = () => {
        this.planNameCopy = this.input.value;
    };
    this.sendRenamePlanRequest = async () => {
        this.app.onSendRenamePlanRequestStart();
        this.app.onSendRenamePlanRequestEnd(
            await new RenamePlanCommand()
                .execute(this.planNameCopy, this.getPlanName()
                )
        );
    }
    this.restorePlanName = () => {
        this.input.value = this.planNameCopy;
    };
}
