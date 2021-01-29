export default function DeletePlanCommand() {
    this.execute = async (planName) => {
        const response = await fetch(`/api/delete-plan/${planName}`, {method: 'DELETE'});
        return await response.json();
    };
}