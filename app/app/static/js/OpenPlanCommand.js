export default function OpenPlanCommand() {
    this.execute = async (planName) => {
        const response = await fetch(`/api/open-plan/${planName}`);
        return await response.json();
    };
}