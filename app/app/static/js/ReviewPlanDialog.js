export default function ReviewPlanDialog(app, id) {
    this.maxSelectSize = 5;
    this.app = app;
    this.dialog = document.getElementById(id);
    this.select = this.dialog.querySelectorAll('select')[0];
    this.select.size = this.maxSelectSize;
    this.submit = this.dialog.querySelectorAll("input.submit-modal");
    this.show = () => {
        this.select.size = Math.min(this.select.length, this.maxSelectSize);
        this.dialog.classList.add("is-visible");
    };
    this.close = () => {
        this.dialog.classList.remove("is-visible");
    };
    this.clearItemList = () => {
        for(let i = this.select.length - 1; i >= 0; --i) {
            this.select.options[i] = null;
        }
    };
    this.pushItem = (item) => {
        let opt = document.createElement('option');
        opt.text = item;
        this.select.add(opt, null);
    };
    this.pushItemList = (itemList) => {
        itemList.forEach(item => this.pushItem(item));
    };
    this.getSelectedItem = () => {
        return this.select.value;
    }
    this.init = () => {
        this.dialog.querySelectorAll('button.close-modal')[0].onclick = this.close;
    }
}