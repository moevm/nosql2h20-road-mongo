import CreatePlanDialog  from "./CreatePlanDialog.js";
import ErrWindow from "./ErrWindow.js";
import Menu from "./Menu.js";
import WaitAnimation from "./WaitAnimation.js";
import PlanWidget from "./PlanWidget.js";
import * as Constants from "./Constants.js"

function App() {
    this.createPlanDialog = new CreatePlanDialog(this);
    this.errWindow = new ErrWindow(this);
    this.menu = new Menu(this);
    this.waitAnimation = new WaitAnimation(this);
    this.planWidget = new PlanWidget(this);

    this.run = () => {
        this.createPlanDialog.init();
        this.planWidget.init();
        this.errWindow.init();
        this.waitAnimation.init();
    };
    this.onSendCreatePlanRequestStart = () => {
        this.createPlanDialog.close();
        this.waitAnimation.show();
    };
    this.onSendCreatePlanRequestEnd = (res) => {
        this.waitAnimation.close();
        if (res.status !== 'success') {
            switch (res.text) {
                case Constants.EMPTY_PLAN_NAME_ERR:
                    this.errWindow.show(Constants.EMPTY_PLAN_NAME_MSG);
                    break;
                case Constants.PLAN_NAME_EXISTS_ERR:
                    this.errWindow.show(Constants.PLAN_NAME_EXISTS_MSG);
                    break;
                default:
                    this.errWindow.show(Constants.UNEXPECTED_ERROR_MSG);
            }
        }
        else {
            this.planWidget.setPlanName(this.createPlanDialog.getPlanName());
            this.planWidget.show();
        }
    };
    //Дописал это
    this.onSendRenamePlanRequestStart = () => {
        //Запомнить имя
        this.waitAnimation.show();
    };
    this.onSendRenamePlanRequestEnd = (res) => {
        this.waitAnimation.close();
        if (res.status !== 'success') {
            switch (res.text) {
                case Constants.EMPTY_PLAN_NAME_ERR:
                    break;
                case Constants.PLAN_NAME_EXISTS_ERR:
                    this.errWindow.show(Constants.PLAN_NAME_EXISTS_MSG);
                    break;
                default:
                    this.errWindow.show(Constants.UNEXPECTED_ERROR_MSG);
            }
            //Вернули предыдущее имя
            this.planWidget.restorePlanName();
        }
    };
    this.showCreatePlanDialog = () => {
        this.menu.close();
        this.createPlanDialog.show();
    };
    this.onPlanNameChange = () => {
        this.menu.close();
    }
}

let app = new App();
app.run();
