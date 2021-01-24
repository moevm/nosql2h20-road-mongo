import OpenPlanDialog from "./OpenPlanDialog.js";
import CreatePlanDialog from "./CreatePlanDialog.js";
import MsgWindow from "./MsgWindow.js";
import Menu from "./Menu.js";
import WaitAnimation from "./WaitAnimation.js";
import PlanWidget from "./PlanWidget.js";
import * as Const from "./Constants.js"
import * as msg from "./ServerResMsg.js";

function App() {
    this.createPlanDialog = new CreatePlanDialog(this);
    this.openPlanDialog = new OpenPlanDialog(this, "open-plan-dialog");
    this.msgWindow = new MsgWindow(this);
    this.menu = new Menu(this);
    this.waitAnimation = new WaitAnimation(this);
    this.planWidget = new PlanWidget(this);

    this.run = () => {
        this.createPlanDialog.init();
        this.openPlanDialog.init();
        this.planWidget.init();
        this.msgWindow.init();
        this.waitAnimation.init();
    };
    this.onSendCreatePlanRequestStart = () => {
        this.createPlanDialog.close();
        this.waitAnimation.show();
    };
    this.onSendCreatePlanRequestEnd = (res) => {
        this.waitAnimation.close();
        let [m, text] = msg.buildCreatePlanResMsg(res);
        if (text === Const.SUCCESS) {
            this.planWidget.setPlanName(this.createPlanDialog.getPlanName());
            this.planWidget.show();
            return;
        }
        this.msgWindow.show(m);
    };
    this.onSendRenamePlanRequestStart = () => {
        this.waitAnimation.show();
    };
    this.onSendRenamePlanRequestEnd = (res) => {
        this.waitAnimation.close();
        let [m, text] = msg.buildRenamePlanResMsg(res);
        if (text !== Const.SUCCESS) {
            this.msgWindow.show(m);
            this.planWidget.restorePlanName();
        }
    };
    this.onSendOpenPlanRequestStart = () => {
        this.openPlanDialog.close();
        this.waitAnimation.show();
    };
    this.onSendOpenPlanRequestEnd = (res) => {
        this.openPlanDialog.clearItemList();
        this.waitAnimation.close();
        let [m, text] = msg.buildOpenPlanResMsg(res);
        if (text === Const.SUCCESS) {
            this.planWidget.setPlanName(this.openPlanDialog.getPlanName());
            this.planWidget.show();
            return;
        }
        this.msgWindow.show(m);
    }
    this.onGetPlanNamesRequestStart = () => {
        this.menu.close();
        this.waitAnimation.show();
    };
    this.onGetPlanNamesRequestEnd = (res) => {
        this.waitAnimation.close();
        let [m, text] = msg.buildGetPlanNamesResMsg(res);
        if (text === Const.SUCCESS) {
            this.openPlanDialog.pushItemList(res.names);
            this.openPlanDialog.show();
            return;
        }
        this.msgWindow.show(m);
    }
    this.showOpenPlanDialog = (e) => {
        this.menu.close();
        this.openPlanDialog.show();
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
        this.msgWindow.show(Const.UNEXPECTED_ERR_MSG);
        console.log(e);
        console.log('а монга-то запущена?:)');
        console.log('sudo service mongodb start');
    }
}

let app = new App();
app.run();