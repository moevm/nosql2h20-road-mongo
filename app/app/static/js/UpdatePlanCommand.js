export default function UpdatePlanCommand() {
    this.execute = async (planName, plan) => {
        const response = await fetch('/api/update-plan', {
            method: 'PUT',
            body: JSON.stringify({
                planName: planName,
                plan: plan,
            })
        });
        return await response.json();
    };
}