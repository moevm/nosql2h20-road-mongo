import CreatePlanDialog  from "./createPlanDialog.js";
import ErrWindow from "./errWindow.js";
import Menu from "./menuEngine.js";
import WaitAnimation from "./waitAnimation.js";

function App() {
    this.createPlanDialog = new CreatePlanDialog(this);
    this.errWindow = new ErrWindow(this);
    this.menu = new Menu(this);
    this.waitAnimation = new WaitAnimation(this);
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
        console.log(status);
        this.waitAnimation.close();
        if (status !== 200) {
            this.errWindow.show(this.createPlanDialog.planExistsMsg);
        }
    };
    this.showCreatePlanDialog = () => {
        this.menu.close();
        this.createPlanDialog.show();
    };
}

let app = new App();
app.run();
