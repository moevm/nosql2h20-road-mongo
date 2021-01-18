export default function PlanWidget(app) {
    this.app = app;
    this.input = document.querySelectorAll('header input.plan-name')[0];
    this.widget = document.querySelectorAll('div.plan')[0];

    this.input.value = "";

    this.setPlanName = (name) => {
        this.input.value = name;
    }
    this.getPlanName = () => {
        return this.input.value;
    }
    this.show = () => {
        this.widget.style.visibility = 'visible';
    }
    this.close = () => {
        this.widget.style.visibility = 'hidden';
    }
}