/**
 * View de Profile
 */
var ProfileView = BaseView.extend({
    rootTemplate: "user",
    template:     "content-profile",
    templateChangePass:     "modal-change-pass",
    formChangePass:     "#form-user-change-pass",
    events: {
        'click #load': 'onLoadActivity',
        'click #btn-change-pass': 'onChangePass',
        'click #btn-edit-profile': 'onEditProfile'
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
    },
    /**
     * @name renderModal
     */
    renderModal: function (aData, table, rowObject, action) {
        var self = this, html = "";
        var literal1 = "modals.title.profile.edit";
        var literal2 = "modals.buttons.profile.close";
        var literal3 = "modals.buttons.profile.edit";
        // Contenido del formilario 
        var aData = aData;
        var template = {
            name: "content-modal-edit",
            container: "#modal-content-body"
        }
        self.$el.parent().find("#modal-btn-save").off("click");
        self.$el.parent().find("#modal-btn-save").on("click", function (evt) {
            DomainObject.buttomLoading($(evt.currentTarget), ENUMS.GENERAL.COMPARATION.DISABLE);
            self.onEditProfile();
        });
        self.loadTemplate({ user: aData }, null, template);
        self.$el.parent().find("#modal-content-body").html(html);
        self.setTextModal(literal1, literal2, literal3);
        $("#principalModal").on('shown.bs.modal', function (event) {
            self.createRulesForm();
        });
        $('#principalModal').modal('show');
    },
    /**
     * @name onEditProfile
     */
    onEditProfile: function (evt) {
        var self = this;
        var aData = app.session.user.attributes;
        self.renderModal(aData);
    },
    /**
     * @name onChangePass
     */
    onChangePass: function (evt) {
        var self = this;
        var template = {
            name: self.templateChangePass,
            container: "#modal-content-body"
        }
        self.loadTemplate({}, function(){
            self.$el.find("#principalModal").localize();
            self.$el.parent().find("#modal-btn-save").on("click", function () {
                var aData = self.fromToJSON(self.formChangePass);
                aData = JSON.parse(aData);
                self.changePass(table, rowObject);
            });
            $('#principalModal').modal('show');
        }, template);
    },
    /**
     * @name changePass
     */
    changePass: function (aData, ) {
        var self = this;
        var template = {
            name: self.templateChangePass,
            container: "#modal-content-body"
        }
        self.loadTemplate({}, function(){
            self.$el.find("#principalModal").localize();
            self.$el.parent().find("#modal-btn-save").on("click", function () {
                var aData = self.fromToJSON(self.formChangePass);
                aData = JSON.parse(aData);
                self.changePass(table, rowObject);
            });
            $('#principalModal').modal('show');
        }, template);
    },
    /**
     * @name createRulesForm
     */
    createRulesForm: function (aData) {
        var self = this;
        var form = $(self.formId);
        var rulesForm = {
            first_name: {
                required: true,
                minlength: 2,
                maxlength: 50,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            role: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            last_name: {
                required: true,
                minlength: 2,
                maxlength: 50,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            email: {
                required: true,
                email: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            password: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            repeatepassword: {
                equalTo: "#password"
            }
        };
        self.onSetRulesForm(form, rulesForm);
    }
});