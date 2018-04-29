/**
 * @desc        backbone router for pushState page routing
 */
var BaseRouter = Backbone.Router.extend({
    routes: {
        "" : "login",
        "signin" : "login",
        "home" : "home",
        "users" : "user",
        "profile" : "profile",
        "clients" : "client",
        "products" : "product",
        "product_categories": "productCategory",
        "questionnaires": "questionnaire",
        "customers": "customer",
        "customer_list": "customer",
        "assign_customer": "assign_customer",
        "approve_customer": "approve_customer",
        "customer_contacts": "customerContact",
        "itinerary_list": "itinerary",
        "itinerary_calendar": "itinerary_calendar",
        "invoices": "invoice",
        "invoice_details/:id": "invoice_details",
        "*notFound": "page404"
    },
    execute: function (callback, args, name) {
        //your logic
        var self = this;
        self.before(callback, args, name);
        self.after();
    },
    before: function (callback, args, name) {
        app.session.checkAuth(); 
        if (!app.session.get("logged_in") && name!=="login" ){
            this.login.apply(this,args);
            this.navigate("", true);
        }else{
            if (callback) callback.apply(self, args);
        }
     },
    after: function (route, params) {},
    /**
     * @name initI18n
     * @description Setear la configuración de traducciones
     */
    initI18n: function () {
        var self = this;
        var lang = localStorage.getItem(app.session.namespaceUrl) && JSON.parse(localStorage.getItem(app.session.namespaceUrl)).domain.language ? JSON.parse(localStorage.getItem(app.session.namespaceUrl)).domain.language : "es";
        i18next
        .use(window.i18nextXHRBackend)
        .init({
            lng: lang,
            fallbackLng: "es",
            useDataAttrOptions: true,
            debug: true,
            ns: ["translation", "message"],
            backend: {
                // for all available options read the backend's repository readme file
                loadPath: '/locales/i18next/{{lng}}/{{ns}}.json'
            },
            getAsync: false
        },
        function (err, t) {
            jqueryI18next.init(i18next, $, {
                tName: 't', // --> appends $.t = i18next.t
                i18nName: 'i18n', // --> appends $.i18n = i18next
                handleName: 'localize', // --> appends $(selector).localize(opts);
                selectorAttr: 'data-i18n', // selector for translating elements
                targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
                optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
                useOptionsAttr: false, // see optionsAttr
                parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
            });
            $("body").localize();
            // self.setLanguageTables(i18next.language);
        });
    },
    /**
     * @name setLanguageTables
     * @description Método para destruir la tabla y cambiar el idioma
     */
    setLanguageTables: function(lang){
        _.each($.fn.dataTable.tables(), function(table){
            var settings = $("#" + table.id).DataTable().settings()[0];
            if ($.fn.DataTable.isDataTable('#' + table.id)) {
                $('#' + table.id).DataTable().destroy();
                settings.oLanguage.sUrl = "/locales/datatables/" +lang+".json";
                settings.oLanguage.url = "/locales/datatables/" +lang+".json";
                $("#" + table.id).DataTable(settings);
                $("#" + table.id).DataTable().on("draw", function(){
                    $("#" + table.id).localize();
                });
            }
        });
    },
    /**
     * @name initialize
     * @description Método de inicialización del enrutador
     */
    initialize: function(){
        var self = this;
        localStorage.clear();
        self.navbar = new NavbarView();
        self.sidebar = new SidebarView();
        self.footer = new FooterView();
        self.initI18n();
    },
    /**
     * @name show
     */
    // show: function(view, options){
    //     // Every page view in the router should need a header.
    //     // Instead of creating a base parent view, just assign the view to this
    //     // so we can create it if it doesn't yet exist
    //     if(!this.headerView){
    //         this.headerView = new HeaderView({});
    //         this.headerView.setElement($(".header")).render();
    //     }

    //     // Close and unbind any existing page view
    //     if(this.currentView && _.isFunction(this.currentView.close)) this.currentView.close();

    //     // Establish the requested view into scope
    //     this.currentView = view;

    //     // Need to be authenticated before rendering view.
    //     // For cases like a user's settings page where we need to double check against the server.
    //     if (typeof options !== 'undefined' && options.requiresAuth){        
    //         var self = this;
    //         app.session.checkAuth({
    //             success: function(res){
    //                 // If auth successful, render inside the page wrapper
    //                 $('#content').html( self.currentView.render().$el);
    //             }, error: function(res){
    //                 self.navigate("/", { trigger: true, replace: true });
    //             }
    //         });

    //     } else {
    //         // Render inside the page wrapper
    //         $('#content').html(this.currentView.render().$el);
    //         //this.currentView.delegateEvents(this.currentView.events);        // Re-delegate events (unbound when closed)
    //     }

    // },
    /**
     * @name test
     */
    test: function() {
        var self = this;
        $("#container-body").html("");
        console.log("asdasdasdadada");
    },
    /**
     * @name home
     */
    home: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.DASHBOARD });
        BaseRouter.footer.render();
        var homeView = new HomeView().render();
    },
    /**
     * @name user
     */
    user: function() {
        BaseRouter.navbar.render({});
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.USERLIST });
        BaseRouter.footer.render();
        var userView = new UserView().render();
    },
    /**
     * @name profile
     */
    profile: function() {
        BaseRouter.navbar.render({});
        BaseRouter.sidebar.render();
        BaseRouter.footer.render();
        var profileView = new ProfileView().render();
    },
    /**
     * @name client
     */
    client: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.CLIENTLIST });
        BaseRouter.footer.render();
        var clientView = new ClientView().render();
    },
    /**
     * @name product
     */
    product: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.PRODUCTLIST });
        BaseRouter.footer.render();
        var productView = new ProductView().render();
    },
    /**
     * @name productCategory
     */
    productCategory: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.PRODUCTCATEGORYLIST });
        BaseRouter.footer.render();
        var productCategoryView = new ProductCategoryView().render();
    },
    /**
     * @name questionnaire
     */
    questionnaire: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.QUESTIONNAIRELIST });
        BaseRouter.footer.render();
        var questionnaireView = new QuestionnaireView().render();
    },
    /**
     * @name customer
     */
    customer: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.CUSTOMERLIST });
        BaseRouter.footer.render();
        var customerView = new CustomerView().render();
    },
    /**
     * @name approve_customer
     */
    approve_customer: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.CUSTOMERAPPROVE });
        BaseRouter.footer.render();
        var customerApproveView = new CustomerByApproveView().render();
    },
    /**
     * @name assign_customer
     */
    assign_customer: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.CUSTOMERASSIGN });
        BaseRouter.footer.render();
        var customerAssignView = new CustomerAssignView().render();
    },
    /**
     * @name customerContact
     */
    customerContact: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.CUSTOMERCONTACTLIST });
        BaseRouter.footer.render();
        var customerContactView = new CustomerContactView().render();
    },
    /**
     * @name itinerary
     */
    itinerary: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.ITINERARYLIST });
        BaseRouter.footer.render();
        var itineraryView = new ItineraryView().render();
    },
    /**
     * @name itinerary_calendar
     */
    itinerary_calendar: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.ITINERARYLIST });
        BaseRouter.footer.render();
        var calendarView = new CalendarView();
        calendarView.render();
    },
    /**
     * @name invoice
     */
    invoice: function() {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.INVOICELIST });
        BaseRouter.footer.render();
        var invoiceView = new InvoiceView().render();
    },
    /**
     * @name invoice_details
     */
    invoice_details: function(id) {
        BaseRouter.navbar.render();
        BaseRouter.sidebar.render({ currentPage: ENUMS.GENERAL.PAGES.INVOICEDETAILS });
        BaseRouter.footer.render();
        var invoiceDetailsView = new InvoiceDetailsView({id: id}).render();
    },
    /**
     * @name login
     */
    login: function() {
        var loginView = new LoginView().render();
    },
    /**
     * @name page404
     */
    page404: function () {
        console.log("Not FOund");
    }

});
var BaseRouter = new BaseRouter();
Backbone.history.start({ pushState: false});
