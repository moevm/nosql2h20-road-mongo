import CreatePlanDialog  from "./CreatePlanDialog.js";
import ErrWindow from "./ErrWindow.js";
import Menu from "./Menu.js";
import WaitAnimation from "./WaitAnimation.js";
import PlanWidget from "./PlanWidget.js";

function App() {
    this.createPlanDialog = new CreatePlanDialog(this);
    this.errWindow = new ErrWindow(this);
    this.menu = new Menu(this);
    this.waitAnimation = new WaitAnimation(this);
    this.planWidget = new PlanWidget(this);

    this.run = () => {
        this.createPlanDialog.init();
        this.errWindow.init();
        this.waitAnimation.init();
    };
    this.onSendCreatePlanRequestStart = () => {
        this.createPlanDialog.close();
        this.waitAnimation.show();
    };
    this.onSendCreatePlanRequestEnd = (status) => {
        this.waitAnimation.close();
        if (status !== 200) {
            this.errWindow.show(this.createPlanDialog.planExistsMsg);
        }
        else {
            this.planWidget.setPlanName(this.createPlanDialog.getPlanName());
            this.planWidget.show();
        }
    };
    this.showCreatePlanDialog = () => {
        this.menu.close();
        this.createPlanDialog.show();
    };
}

let app = new App();
app.run();
