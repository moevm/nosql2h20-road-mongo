export default function RenamePlanCommand() {
    this.execute = async (oldPlanName, newPlanName) => {
        const response = await fetch('/api/rename-plan', {
            method: 'PUT',
            body: JSON.stringify({
                oldPlanName: oldPlanName,
                newPlanName: newPlanName,
            })
        });
        return await response.json();
    };
}