(function () {
    function $(selector, context) {
        context = context || document;
        return context["querySelectorAll"](selector);
    }

    function forEach(collection, iterator) {
        for (var key in Object.keys(collection)) {
            iterator(collection[key]);
        }
    }

    function showMenu(menu) {
        var menu = this;
        var ul = $("ul", menu)[0];

        if (!ul || ul.classList.contains("-visible")) return;

        menu.classList.add("-active");
        ul.classList.add("-animating");
        ul.classList.add("-visible");
        setTimeout(function () {
            ul.classList.remove("-animating")
        }, 25);
    }

    function hideMenu(menu) {
        var menu = this;
        var ul = $("ul", menu)[0];

        if (!ul || !ul.classList.contains("-visible")) return;

        menu.classList.remove("-active");
        ul.classList.add("-animating");
        setTimeout(function () {
            ul.classList.remove("-visible");
            ul.classList.remove("-animating");
        }, 300);
    }

    function hideAllInactiveMenus(menu) {
        var menu = this;
        forEach(
            $("li.-hasSubmenu.-active:not(:hover)", menu.parent),
            function (e) {
                e.hideMenu && e.hideMenu();
            }
        );
    }

    window.addEventListener("load", function () {
        forEach($(".Menu li.-hasSubmenu"), function (e) {
            e.showMenu = showMenu;
            e.hideMenu = hideMenu;
        });

        forEach($(".Menu > li.-hasSubmenu"), function (e) {
            e.addEventListener("click", showMenu);
        });

        forEach($(".Menu > li.-hasSubmenu li"), function (e) {
            e.addEventListener("mouseenter", hideAllInactiveMenus);
        });

        forEach($(".Menu > li.-hasSubmenu li.-hasSubmenu"), function (e) {
            e.addEventListener("mouseenter", showMenu);
        });

        document.addEventListener("click", hideAllInactiveMenus);
    });
})();

export default function Menu(app) {
    this.app = app;
    this.init = () => {
        this.saveCommand = document.querySelectorAll("#Menu li a.save")[0];
        this.exportCommand = document.querySelectorAll("#Menu li a.export")[0];
        this.setSaveCommandState(true);
        this.setExportCommandState(true);
    }
    this.close = () => {
        document.querySelectorAll(".Menu li.-hasSubmenu").forEach( (e) => {
            e.hideMenu();
        });
    };
    this.setSaveCommandState = (disabled) => {
        this.saveCommand.style.color = disabled ? "gray": "black";
        this.saveCommandDisabled = disabled;
    }
    this.getSaveCommandState = () => {
        return this.saveCommandDisabled;
    };
    this.setExportCommandState = (disabled) => {
        this.exportCommand.style.color = disabled ? "gray": "black";
        this.exportCommandDisabled = disabled;
    }
    this.getExportCommandState = () => {
        return this.exportCommandDisabled;
    };
}
