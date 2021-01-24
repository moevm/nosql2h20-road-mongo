export default function DeletePlanCommand() {
    this.execute = async (planName) => {
        const response = await fetch('/api/delete-plan', {method: 'DELETE',body: planName});
        return await response.json();
    };
}