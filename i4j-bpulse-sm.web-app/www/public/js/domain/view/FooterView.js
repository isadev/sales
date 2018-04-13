/**
 * @name FooterView
 * @description Vista para el manejo del Footer
 */
var FooterView = BaseView.extend({
    el: "#footer-container",
    rootTemplate: "domain",
    template: "footer-content",
    events: {
        "click .lang-change-btn": "setLanguageAppication"
    },
    /**
     * @name initialize_child
     * @description Método initialize de la vista Header
     */
    initialize_child: function () {
        var self = this;
    },
    /**
     * @name render
     */
    render: function () {
        var self = this;
        self.loadTemplate();
    }
});
