//Добавил эту штуку не знаю надо ли было в отдельный файл, вроде да
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