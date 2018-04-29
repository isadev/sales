/**
 * View de Calendar
 */
var CalendarView = BaseView.extend({
    rootTemplate: "itinerary",
    template:     "content-calendar",
    formId:       "#form-calendar",
    calendarId:   "#calendar",
    calendarTemplate: "/templates/itinerary/tmpls/",
    urlList: "/itinerary/list",
    events: {
        'click #btn-filter-calendar': 'createCalendar'
    },
    /**
     * @name initialize_child
     * @description Método de inicialización
     */
    initialize_child: function () {
        var self = this;
    },
    /**
     * @name render
     */
    render:function () {
        var self = this;
        self.loadTemplate({}, function(){
            self.buildSelect("#select_itinerary_type", null, "<span data-i18n='tables.default.select_all'></span>", false, { url: "/itinerary_type/list", query: "", selected: -1 });
            self.buildSelect("#select_seller", null, "<span data-i18n='tables.default.select_all'></span>", false, { url: "/user/seller_list", query: "", selected: -1 });
            self.buildSelectlocation(
                { selector: '#country_select_ajax', url: '/country/list', placeholder: "<span data-i18n='tables.default.select_all'></span>" },
                { selector: '#province_select_ajax', url: '/province/list', placeholder: "<span data-i18n='tables.default.select_all'></span>" },
                { selector: '#city_select_ajax', url: '/city/list', placeholder: "<span data-i18n='tables.default.select_all'></span>" },
                false
            );
            self.setToggleCollapse();
            self.createCalendar();
        });
    },
    /**
     * @name createCalendar
     */
    createCalendar: function (evt) {
        var self = this;
        var dataFilter = { selllerId: self.$el.find("#select_seller").val() || -1, "cityId": self.$el.find("#city_select_ajax").val() || -1, "itinerary_type": self.$el.find("#select_itinerary_type").val() || -1};
        var colectionItinerary = new ItineraryCollection();
        $("#events-modal").on("shown.bs.modal", function(elemtn){
            $("#content-modal-events").localize();
        });
        colectionItinerary.fnCallback = function(){
            var eventsData = [];
            for(i=0; i<colectionItinerary.models.length; i++){
                var unixtime = new Date(colectionItinerary.models[i].get("date_time"));
                var eventClass= "";
                    switch (colectionItinerary.models[i].get("itinerary_type_id")) {
                        case "1":
                            eventClass =  "event-success";
                            break;
                        case "2":
                            eventClass = "event-info";
                            break;
                        case "3":
                            eventClass = "event-warning";
                            break;
                    
                        default:
                            break;
                    }
                data = {
                    "id": colectionItinerary.models[i].get("id"),
                    "title": colectionItinerary.models[i].get("city").name,
                    "url": "/itinerary/"+colectionItinerary.models[i].get("id"),
                    "class": eventClass,
                    "data": colectionItinerary.models[i].attributes,
                    "start": unixtime.getTime(),
                    "end":   Date.parse(moment(unixtime).add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"))
                }
                eventsData.push(data);
            }
        var options = {
            events_source: eventsData,
            view: 'month',
            modal: "#events-modal",
            modal_type: "template",
            tmpl_path: self.calendarTemplate,
            tmpl_cache: false,
            day: moment().format('YYYY-MM-DD'),
            onBeforeEventsLoad: function (next) {
                next();
            },
            onAfterViewLoad: function (view) {
                $('.page-header h3').text(this.getTitle());
                $('.btn-group button').removeClass('active');
                $('button[data-calendar-view="' + view + '"]').addClass('active');
            },
            classes: {
                months: {
                    general: 'label'
                }
            }
        };
        var calendar = $(self.calendarId).calendar(options);
        if(i18next.language){
            var locale = i18next.language +"-"+ i18next.language.toUpperCase();
            calendar.setLanguage(locale);
        }
        calendar.view();
        $('.btn-group button[data-calendar-nav]').each(function () {
            var $this = $(this);
            $this.click(function () {
                calendar.navigate($this.data('calendar-nav'));
            });
        });

        $('.btn-group button[data-calendar-view]').each(function () {
            var $this = $(this);
            $this.click(function () {
                calendar.view($this.data('calendar-view'));
            });
        });

        }
        if (evt){
            colectionItinerary.fetch({ data: dataFilter});
        }else{
            colectionItinerary.fetch();
        }
    }
});