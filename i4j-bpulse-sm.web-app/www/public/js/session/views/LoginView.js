/**
 * View de Login
 */
var LoginView = BaseView.extend({
    rootTemplate: "session",
    template:     "login-template",
    loginFormId:     "#login-form",
    formRecovery:     "#form-recovery-password",
    events: {
        'submit #login-form'                    : 'onLoginAttempt',
        'click #recoverPassword-btn'            : 'recoverPassword'
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
        self.$el.parent().find("#navbar-menu-container, #sidebar-menu-container, #footer-container").empty();
        self.loadTemplate({});
    },
    /**
     * @name recoverPassword
     */
    recoverPassword: function (aData, table, rowObject, action) {
        var self = this, html = "";
        var literal1 = "modals.title.session.recoverPassword";
        var literal2 = "modals.buttons.session.close";
        var literal3 = "modals.buttons.session.recoverPassword";
        // Contenido del formilario 
        var aData = null;
        var template = {
            name: "content-modal-password",
            container: "#modal-content-body"
        }
        self.loadTemplate({ invoice: aData }, function(){
            self.$el.parent().find("#modal-btn-save").off("click");
            self.$el.parent().find("#modal-btn-save").on("click", function (evt) {
                DomainObject.buttomLoading($(evt.currentTarget), ENUMS.GENERAL.COMPARATION.DISABLE);
                self.onRecoveryPassword(evt);
            });
            self.setTextModal(literal1, literal2, literal3);
            $("#principalModal").on('shown.bs.modal', function (event) {
                self.createRulesForm();
            });
            $('#principalModal').modal('show');
        }, template);
    },
    /**
     * @name onLoginAttempt
     */
    onLoginAttempt: function(evt){
        if(evt) evt.preventDefault();
        DomainObject.buttomLoading($(evt.currentTarget).find("#btn-login"), ENUMS.GENERAL.COMPARATION.DISABLE);
        var self = this;
        var form = self.$(self.loginFormId);
        var rulesLoginForm = {
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
            }
        };
        self.onSetRulesForm(form, rulesLoginForm);
        if (form.valid()){
            app.session.login({
                email: form.find("#user_email").val(),
                password: form.find("#user_password").val()
            }, {
                success: function(mod, res){
                    // if(DEBUG) console.log("SUCCESS", mod, res);
                    BaseRouter.navigate("/home", true);
                },
                error: function(err){
                    // if(DEBUG) console.log("ERROR", err);
                    DomainAlertMessages.MessageCustom(err.title, err.error.message, "error");
                    DomainObject.buttomLoading($(evt.currentTarget).find("#btn-login"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("views.login.buttonLogin"));
                }
            });
        } else {
            // Invalid clientside validations thru parsley
            DomainObject.buttomLoading($(evt.currentTarget).find("#btn-login"), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("views.login.buttonLogin"));
        }
    },
    /**
     * @name onRecoveryPassword
     */
    onRecoveryPassword: function(evt){
        if(evt) evt.preventDefault();
        var self = this;
        var form = $(self.formRecovery);
        if (form.valid()){
            app.session.recoveryPassword({
                email: form.find("#email_recovery").val()
            }, {
                success: function(mod, res){
                    DomainObject.buttomLoading($(evt.currentTarget), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.session.recoverPassword"));
                    $('#principalModal').modal('hide');
                    DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.recoveryPassword.success.title"), i18next.t("message:message.pnotify.recoveryPassword.success.message"), "success");
                },
                error: function(err){
                    DomainAlertMessages.MessageCustom(err.title, err.error.message, "error");
                    DomainObject.buttomLoading($(evt.currentTarget), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.session.recoverPassword"));
                }
            });
        } else {
            // Invalid clientside validations thru parsley
            DomainObject.buttomLoading($(evt.currentTarget), ENUMS.GENERAL.COMPARATION.ENABLE, i18next.t("modals.buttons.session.recoverPassword"));
        }
    },
    /**
     * @name createRulesForm
     */
    createRulesForm: function () {
        var self = this;
        var form = $(self.formRecovery);
        var rulesForm = {
            email_recovery: {
                required: true,
                email: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            }
        };
        self.onSetRulesForm(form, rulesForm);
    }
});