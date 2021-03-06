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
    function disable(enabled) {
        return !enabled ? "gray" : "black";
    }

    this.app = app;
    this.init = () => {
        this.createCommand = document.querySelectorAll("#Menu li a.create")[0];
        this.openCommand = document.querySelectorAll("#Menu li a.open")[0];
        this.saveCommand = document.querySelectorAll("#Menu li a.save")[0];
        this.deleteCommand = document.querySelectorAll("#Menu li a.delete")[0];
        this.importCommand = document.querySelectorAll("#Menu li a.import")[0];
        this.exportCommand = document.querySelectorAll("#Menu li a.export")[0];

        this.setCreateCommandState(false);
        this.setOpenCommandState(false);
        this.setSaveCommandState(false);
        this.setDeleteCommandState(false);
        this.setImportCommandState(false);
        this.setExportCommandState(false);
    }
    this.close = () => {
        document.querySelectorAll(".Menu li.-hasSubmenu").forEach((e) => {
            e.hideMenu();
        });
    };
    this.setCreateCommandState = (enabled) => {
        this.createCommand.style.color = disable(enabled);
    };
    this.setOpenCommandState = (enabled) => {
        this.openCommand.style.color = disable(enabled);
    };
    this.setSaveCommandState = (enabled) => {
        this.saveCommand.style.color = disable(enabled);
    };
    this.setDeleteCommandState = (enabled) => {
        this.deleteCommand.style.color = disable(enabled);
    };
    this.setImportCommandState = (enabled) => {
        this.importCommand.style.color = disable(enabled);
    };
    this.setExportCommandState = (enabled) => {
        this.exportCommand.style.color = disable(enabled);
        let parent = this.exportCommand.closest("li.-hasSubmenu");
        parent.querySelectorAll("li a.exportInJSON")[0].style.color = disable(enabled);
    };
}
