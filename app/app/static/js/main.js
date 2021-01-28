import OpenPlanDialog from "./OpenPlanDialog.js";
import CreatePlanDialog from "./CreatePlanDialog.js";
import DeletePlanDialog from "./DeletePlanDialog.js";
import MsgWindow from "./MsgWindow.js";
import Menu from "./Menu.js";
import WaitAnimation from "./WaitAnimation.js";
import PlanWidget from "./PlanWidget.js";
import MapWidget from "./MapWidget.js";
import PlanSaver from "./PlanSaver.js";
import * as Const from "./Constants.js"
import * as msg from "./ServerResMsg.js";

function App() {
    this.mapWidget = new MapWidget(this);
    this.menu = new Menu(this);
    this.createPlanDialog = new CreatePlanDialog(this, this.menu);
    this.openPlanDialog = new OpenPlanDialog(this, this.menu, "open-plan-dialog");
    this.deletePlanDialog = new DeletePlanDialog(this, this.menu, "delete-plan-dialog");
    this.msgWindow = new MsgWindow(this);
    this.waitAnimation = new WaitAnimation(this);
    this.planWidget = new PlanWidget(this);
    this.planSaver = new PlanSaver(this, this.menu);

    this.run = () => {
        this.createPlanDialog.init();
        this.openPlanDialog.init();
        this.deletePlanDialog.init();
        this.planWidget.init();
        this.menu.init();
        this.msgWindow.init();
        this.waitAnimation.init();
        this.planSaver.init();
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
            this.planSaver.setSaveState(true);
            this.menu.setExportCommandState(true);
            this.mapWidget.setWidgetEnabled(true);
            this.mapWidget.clearMap();
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
        this.waitAnimation.close();
        let [m, text] = msg.buildOpenPlanResMsg(res);
        if (text === Const.SUCCESS) {
            this.planSaver.setSaveState(true);
            this.menu.setExportCommandState(true);
            this.planWidget.setPlanName(this.openPlanDialog.getPlanName());
            this.planWidget.show();
            this.mapWidget.setWidgetEnabled(true);
            this.mapWidget.setPlan(res.plan);
            return;
        }
        this.msgWindow.show(m);
    };
    this.onGetPlanNamesRequestStart = () => {
        this.menu.close();
        this.waitAnimation.show();
    };
    this.onGetPlanNamesRequestEnd = (res, e) => {
        this.waitAnimation.close();
        let [m, text] = msg.buildGetPlanNamesResMsg(res);
        if (text !== Const.SUCCESS) {
            this.msgWindow.show(m);
            return;
        }
        if (e.id === 'open-plan-dialog') {
            this.openPlanDialog.pushItemList(res.names);
            this.openPlanDialog.show();
        }
        if (e.id === 'delete-plan-dialog') {
            this.deletePlanDialog.pushItemList(res.names);
            this.deletePlanDialog.show();
        }
    };
    this.onSendDeletePlanRequestStart = () => {
        this.deletePlanDialog.close();
        this.menu.close();
        this.waitAnimation.show();
    };
    this.onSendDeletePlanRequestEnd = (res) => {
        this.waitAnimation.close();
        let [m, text] = msg.buildDeletePlanResMsg(res);
        if (text === Const.SUCCESS) {
            let currentPlanName = this.planWidget.getPlanName();
            let deletedPlanName = this.deletePlanDialog.getPlanName();
            if (currentPlanName === deletedPlanName) {
                this.planWidget.close();
                this.planSaver.setSaveState(false);
                this.menu.setExportCommandState(false);
                this.mapWidget.setWidgetEnabled(false);
                this.mapWidget.clearMap();
            }
            return;
        }
        this.msgWindow.show(m);
    };
    this.showOpenPlanDialog = () => {
        this.menu.close();
        this.openPlanDialog.show();
    };
    this.showCreatePlanDialog = () => {
        this.menu.close();
        this.createPlanDialog.show();
    };
    this.onPlanNameChange = () => {
        this.menu.close();
    };
    this.onServerUnexpectedError = (e) => {
        this.waitAnimation.close();
        this.msgWindow.show(Const.UNEXPECTED_ERR_MSG);
        console.log(e);
        console.log('а монга-то запущена?:)');
        console.log('sudo service mongodb start');
    };
    this.onSavePlanStart = () => {
        this.waitAnimation.show();
        let plan = this.mapWidget.getPlan();
        let planName = this.planWidget.getPlanName();
        return [planName, plan];
    }
    this.onSavePlanEnd = (res) => {
        this.waitAnimation.close()
        let [m, text] = msg.buildUpdatePlanResMsg(res);
        if (text !== Const.SUCCESS) {
            this.msgWindow.show(m);
        }
    };
    this.onMapWidgetIsReady = () => {
        this.createPlanDialog.setDialogState(true);
        this.openPlanDialog.setDialogState(true);
        this.deletePlanDialog.setDialogState(true);
        this.planSaver.setSaveState(true);
        this.menu.setImportCommandState(true);
    }
}

let app = new App();
app.run();
