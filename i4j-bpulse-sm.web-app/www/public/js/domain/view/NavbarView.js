/**
 * @name NavbarView
 * @description Vista para el manejo del Navbar
 */
var NavbarView = BaseView.extend({
    el: "#navbar-menu-container",
    rootTemplate: "domain",
    template: "navbar-content",
    events: {
        "click .btn-toggle-fullwidth": "toggleBtnIcon"
    },
    /**
     * @name initialize_child
     * @description Método initialize de la vista Header
     */
    initialize_child : function () {
        var self = this;
    },
    /**
     * @name render
     */
    render: function(){
        var self = this;
        
        self.loadTemplate();
    },
    /**
     * @name loadNotifications
     */
    loadNotifications: function(evt){
        //Load Notofications 
    },
    /**
     * @name onChangeUser
     */
    onChangeUser: function(){
        var self = this;
        self.$el.find("#navbar-name-user").html(app.session.user.get("first_name") +" "+ app.session.user.get("last_name"));

    },
    /**
     * @name toggleBtnIcon
     */
    toggleBtnIcon: function(evt){
        var self = this;
        self.toggleSidebar();
        $(evt.currentTarget).find('.fa').toggleClass('fa-arrow-left fa-arrow-right');
    },
    /**
     * @name toggleSidebar
     */
    toggleSidebar: function(){
        var self = this;
        if (!$('body').hasClass('layout-fullwidth')) {
            $('body').addClass('layout-fullwidth');

        } else {
            $('body').removeClass('layout-fullwidth');
            $('body').removeClass('layout-default'); // also remove default behaviour if set
        }
        if ($(window).innerWidth() < 1025) {
            if (!$('body').hasClass('offcanvas-active')) {
                $('body').addClass('offcanvas-active');
            } else {
                $('body').removeClass('offcanvas-active');
            }
        }
    }
});
