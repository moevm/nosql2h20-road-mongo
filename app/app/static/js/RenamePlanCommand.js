//Добавил эту штуку не знаю надо ли было в отдельный файл, вроде да
export default function RenamePlanCommand() {
    this.execute = async (planName) => {
        const response = await fetch('/api/rename-plan', {method: 'PUT',body: planName});
        return await response.json();
    };
}