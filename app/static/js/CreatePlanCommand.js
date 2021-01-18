export default function CreatePlanCommand() {
    this.execute = (planName) => {
        return fetch('/create-plan', {
            method: 'POST',
            body: planName
        });
    };
}