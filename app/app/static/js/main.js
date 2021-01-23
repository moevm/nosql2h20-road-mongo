import CreatePlanDialog from "./CreatePlanDialog.js";
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
        this.checkServerRequestResult(res,
            () => {
                this.planWidget.setPlanName(this.createPlanDialog.getPlanName());
                this.planWidget.show();
            },
            () => {}
            );
    };
    this.onSendRenamePlanRequestStart = () => {
        this.waitAnimation.show();
    };
    this.onSendRenamePlanRequestEnd = (res) => {
        this.checkServerRequestResult(res,
            () => {},
            () => {this.planWidget.restorePlanName();}
            );
    };
    this.showCreatePlanDialog = (e) => {
        this.menu.close();
        this.createPlanDialog.show();
    };
    this.onPlanNameChange = () => {
        this.menu.close();
    }
    this.onServerUnexpectedError = (e) => {
        this.waitAnimation.close();
        this.errWindow.show(Constants.UNEXPECTED_ERROR_MSG);
        console.log(e);
        console.log('а монга-то запущена?:)');
        console.log('sudo service mongodb start');
    }
    this.checkServerRequestResult = (res, successCallback, failureCallback) => {
        console.log(res)
        this.waitAnimation.close();
        if (typeof res === 'undefined' ||
            !res.hasOwnProperty('status') ||
            typeof res.status === 'undefined' ||
            !res.hasOwnProperty('action') ||
            typeof res.action === 'undefined')
        {
            this.errWindow.show(Constants.UNEXPECTED_ERROR_MSG);
            failureCallback();
        }
        else if (res.status !== 'success') {
            let actionMsg = "", textMsg = "";
            switch (res.action) {
                case Constants.ACTON_CREATE_PLAN:
                    actionMsg = Constants.FAILED_TO_CREATE_PLAN_MSG;
                    break;
                case Constants.ACTON_RENAME_PLAN:
                    actionMsg = Constants.FAILED_TO_RENAME_PLAN_MSG;
                    break;
                default:
                    break;
            }
            switch (res.text) {
                case Constants.INVALID_PLAN_NAME_ERR:
                    textMsg = Constants.INVALID_PLAN_NAME_MSG;
                    break;
                case Constants.PLAN_NAME_EXISTS_ERR:
                case Constants.RENAME_PLAN_NAME_EXISTS_ERR:
                    textMsg = Constants.PLAN_NAME_EXISTS_MSG;
                    break;
                case Constants.PLAN_NAME_NOT_EXISTS_ERR:
                default:
                    break;
            }
            if (actionMsg === "" || textMsg === "") {
                this.errWindow.show(Constants.UNEXPECTED_ERROR_MSG);
            }
            else {
                this.errWindow.show(actionMsg + " " + textMsg);
            }
            failureCallback();
        }
        else {
            successCallback();
        }
    }
}

let app = new App();
app.run();