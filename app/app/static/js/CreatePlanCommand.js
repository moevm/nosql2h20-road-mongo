export default function CreatePlanCommand() {
    this.execute = async (planName) => {
        const response = await fetch('/api/create-plan', {method: 'POST',body: planName});
        return await response.json();
    };
}