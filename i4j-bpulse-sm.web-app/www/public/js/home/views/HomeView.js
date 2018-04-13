/**
 * View de Home
 */
var HomeView = BaseView.extend({
    rootTemplate: "home",
    template:     "content-home",
    events: {
        'click #load': 'onLoadDashboard'
    },
    /**
     * @name initialize_child
     * @description Método de inicialización de la Vista Login
     */
    initialize_child: function () {
        var self = this;
    },
    /**
     * @name render
     */
    render:function () {
        var self = this;
        self.loadTemplate();
    }
});