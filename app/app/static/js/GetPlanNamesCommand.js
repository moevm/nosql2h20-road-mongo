export default function GetPlanNamesCommand() {
    this.execute = async () => {
        const response = await fetch('/api/get-plan-names');
        return await response.json();
    };
}