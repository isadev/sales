/**
 * @name SidebarView
 * @description Vista para el manejo del Sidebar
 */
var SidebarView = BaseView.extend({
    el: "#sidebar-menu-container",
    rootTemplate: "domain",
    urlLoadMenu: "/side_menu",
    template: "sidebar-content",
    currentPage: null,
    events: {
        "click .sidebar a[data-toggle='collapse']": "sidebarCollapse"
    },
    /**
     * @name initialize_child
     * @description Método initialize de la vista Header
     */
    initialize_child: function (options) {
        var self = this;
    },
    /**
     * @name render
     */
    render: function (options) {
        var self = this;
        self.currentPage = options !== undefined && options.currentPage !== undefined ? options.currentPage :  null;
        self.removeClassSidebarBody();
        self.loadMenuPermission(function(data){
            self.loadTemplate({ currentPage: self.currentPage, sections: data}, function(){
                if ($('.sidebar-scroll').length > 0) {
                    $('.sidebar-scroll').slimScroll({
                        height: '100%',
                        wheelStep: 2,
                    });
                }
            });
        });
    },
    /**
     * @name sidebarCollapse
     */
    sidebarCollapse: function (evt) {
        if ($(evt.currentTarget).hasClass('collapsed')) {
            $(evt.currentTarget).addClass('active');
        } else {
            $(evt.currentTarget).removeClass('active');
        }
    },
    /**
     * @name removeClassSidebarBody
     */
    removeClassSidebarBody: function () {
        var self = this;
        $('body').removeClass('offcanvas-active', 1000);
        $('body').removeClass('layout-fullwidth', 1000);
        $('body').removeClass('layout-default', 1000); // also remove default behaviour if set
    },
    /**
     * @name loadMenuPermission
     */
    loadMenuPermission: function (callback) {
        var self = this;
        $.get(self.urlLoadMenu, function (data) {
            if (callback)
                callback(JSON.parse(data).domain);
        }, 'html');
    }
});
