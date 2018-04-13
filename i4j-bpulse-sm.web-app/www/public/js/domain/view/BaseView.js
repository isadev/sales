/**
 * Base View de donde extienden todas las vistas.
 * 
 */
var BaseView = Backbone.View.extend({
	/**
	 * Valores por defecto de los atributos de la vista.
	 */
	el: "#container-body",
	root: "/",   // The root path to run the application through.
	URL: "/",    // Base application URL
	API: "/api", // Base API URL (used by models & collections)
	containerId: null,
	restUrl: null,
    rootTemplate: null,   // The root path to template.
	template: null,    // temlate Name
	/**
	 * @name Initilize
	 */
	initialize : function(options) {
		var self = this;
		var options = options || {};
		self.setSettings();

		self.initialize_child(options);
	},
    /**
	 * @name initialize_child
	 */
	initialize_child: function (options) {},
	/**
	 * @name setTextModal
	 */
	setTextModal: function (title, btnClose, btnSave) {
		var self = this;
		self.$el.parent().find("#modal-content-title").attr("data-i18n", title);
		self.$el.parent().find("#modal-btn-close").attr("data-i18n", btnClose);
		self.$el.parent().find("#modal-btn-save").attr("data-i18n", btnSave);
		self.localize();
	},
    /**
     * @name close
     */
	close: function () {
		this.remove();
		this.unbind();
		if (this.onClose) {
			this.onClose();
		}
	},
    /**
     * @name loadTemplate
     */
    loadTemplate: function(params, callback, config){
		var self = this;
		switch (config) {
			case undefined:
				$.get('/templates/'+self.rootTemplate+"/" + self.template + ".html", function (data) {
					var template = _.template(data)(params);
					self.$el.html(template); 
					if(callback) 
						callback();
					self.localize();
				}, 'html');
				break;
			default:
				$.get('/templates/' + self.rootTemplate + "/" + config.name + ".html", function (data) {
					var template = _.template(data)(params);
					self.$el.parent().find(config.container).html(template); 
					if(callback) 
						callback();
					self.localize();
				}, 'html');
				break;
		}
	},
    /**
     * @name onSetRulesForm
     * @param form Objeto Jquery correspondiente al formulario a Validar
     */
	onSetRulesForm: function (form, rules, invalidmessages) {
		var messages = invalidmessages || {};
		form.validate({
			rules: rules,
			messages: messages
		});
	},
    /**
     * @name setSetting
     * @description Setear la configuración del Motor de Plantillas
     */
	setSettings: function () {
		_.templateSettings = {
			evaluate: /{%([\s\S]+?)%}/g,
			interpolate: /{{([\s\S]+?)}}/g
		};
	},
    /**
     * @name localize
     * @description Setear la configuración del Motor de Plantillas
     */
	localize: function() {
		if(typeof $.fn.localize == 'function') {
			$("body").localize();
		}
	},
    /**
     * @name setLanguageAppication
     * @description Método para cambiar el idioma
     */
    setLanguageAppication: function (event) {
		var self = this;
		var lang = $(event.currentTarget).data("lang");
		i18next.changeLanguage(lang, function () {
			BaseRouter.setLanguageTables(lang);
			self.localize();
		});
	},
	/**
	 * @name: fromToJSON
	 * @description: Método para el manejo de Serializado de Forms
	 * @param: {String} idForm - Identificador del Formulario
 	*/
	fromToJSON: function ($idForm) {
		try {
			var values = {};
			$.each($($idForm).serializeArray(), function (i, field) {
				values[field.name] = field.value;
			});
			return JSON.stringify(values);
		} catch (ex) {
			console.warn(ex);
		}
	},
	/**
	 * @name: buildSelectlocation
	 * @description: Método para la construcción de los select de Country, Province, City
	 * @param: {object} setContry - Setting del select Country
	 * @param: {object} setProvince - Setting del select Province
	 * @param: {object} setCity - Setting del select City
	 * @param: {string} dropdownParent - Contenedor aplicable a modales
 	*/
	buildSelectlocation: function (setContry, setProvince, setCity, dropdownParent) {
		try {
			var self = this;
			$(setContry.selector).select2({
				placeholder: setContry.placeholder,
				escapeMarkup: function (m) { return m; },
				theme: "classic",
				width: "100%",
				minimumInputLength: 3,
				dropdownParent: dropdownParent,
				ajax: {
					url: setContry.url,
					cache: true,
					dataType: 'json',
					data: function (params) {
						var query = {
							query: params.term
						}
						return query;
					},
					processResults: function (data) {
						var rows = _.map(data.domain, function (country) {
							return {
								id: country.id,
								text: country.name
							};
						});
						return {
							results: rows
						};
					}
				}
			}).on('change', function (e, data) {
				// Do something
				$(setProvince.selector).val(null).html("<option></option>").trigger("change");
				$.get(setProvince.url, {
					query: $(e.currentTarget).val()
				}).done(function (data) {
					var rows = _.map(data.domain, function (province) {
						return {
							id: province.id,
							text: province.name
						};
					});
					self.buildSelect(setProvince.selector, rows, setProvince.placeholder, dropdownParent);
				});
			});
			$(setProvince.selector).select2({
				placeholder: setProvince.placeholder,
				escapeMarkup: function (m) { return m; },
				theme: "classic",
				width: "100%",
				dropdownParent: dropdownParent,
				minimumInputLength: 3,
				ajax: {
					url: setProvince.url,
					cache: true,
					dataType: 'json',
					data: function (params) {
						var query = {
							term: params.term,
							query: $(setContry.selector).val()
						}
						return query;
					},
					processResults: function (data) {
						var rows = _.map(data.domain, function (province) {
							return {
								id: province.id,
								text: province.name
							};
						});
						return {
							results: rows
						};
					}
				}
			}).on('change', function (e, data) {
				// Do something
				$(setCity.selector).val(null).html("<option></option>").trigger("change");
				$.get(setCity.url, {
					query: $(e.currentTarget).val()
				}).done(function (data) {
					var rows = _.map(data.domain, function (city) {
						return {
							id: city.id,
							text: city.name
						};
					});
					self.buildSelect(setCity.selector, rows, setCity.placeholder, dropdownParent);
				});
			});
			$(setCity.selector).select2({
				placeholder: setCity.placeholder,
				escapeMarkup: function (m) { return m; },
				theme: "classic",
				width: "100%",
				dropdownParent: dropdownParent,
				minimumInputLength: 3,
				ajax: {
					url: setCity.url,
					cache: true,
					dataType: 'json',
					data: function (params) {
						var query = {
							term: params.term,
							query: $(setProvince.selector).val()
						}
						return query;
					},
					processResults: function (data) {
						var rows = _.map(data.domain, function (city) {
							return {
								id: city.id,
								text: city.name
							};
						});
						return {
							results: rows
						};
					}
				}
			});
		} catch (ex) {
			console.warn(ex);
		}
	},
	/**
	 * @name: buildCustomerContactSelect
	 * @description: Método para la construcción de los select de Customer, CustomerContact
	 * @param: {object} setCustomer - Setting del select Country
	 * @param: {object} setCustomerContact - Setting del select Province
	 * @param: {string} dropdownParent - Contenedor aplicable a modales
 	*/
	buildCustomerContactSelect: function (setCustomer, setCustomerContact, dropdownParent) {
		try {
			var self = this;
			$(setCustomer.selector).select2({
				placeholder: setCustomer.placeholder,
				escapeMarkup: function (m) { return m; },
				theme: "classic",
				width: "100%",
				minimumInputLength: 3,
				dropdownParent: dropdownParent,
				ajax: {
					url: setCustomer.url,
					cache: true,
					dataType: 'json',
					data: function (params) {
						var query = {
							query: params.term
						}
						return query;
					},
					processResults: function (data) {
						var rows = _.map(data.domain, function (customer) {
							return {
								id: customer.id,
								text: customer.name
							};
						});
						return {
							results: rows
						};
					}
				}
			}).on('change', function (e, data) {
				// Do something
				$(setCustomerContact.selector).val(null).html("<option></option>").trigger("change");
				$.get(setCustomerContact.url, {
					query: $(e.currentTarget).val()
				}).done(function (data) {
					var rows = _.map(data.domain, function (customer_contact) {
						return {
							id: customer_contact.id,
							text: customer_contact.first_name + " " + customer_contact.last_name
						};
					});
					self.buildSelect(setCustomerContact.selector, rows, setCustomerContact.placeholder, dropdownParent);
				});
			});
			$(setCustomerContact.selector).select2({
				placeholder: setCustomerContact.placeholder,
				escapeMarkup: function (m) { return m; },
				theme: "classic",
				width: "100%",
				dropdownParent: dropdownParent,
				minimumInputLength: 3,
				ajax: {
					url: setCustomerContact.url,
					cache: true,
					dataType: 'json',
					data: function (params) {
						var query = {
							term: params.term,
							query: $(setCustomer.selector).val()
						}
						return query;
					},
					processResults: function (data) {
						var rows = _.map(data.domain, function (customer_contact) {
							return {
								id: customer_contact.id,
								text: customer_contact.name
							};
						});
						return {
							results: rows
						};
					}
				}
			});
		} catch (ex) {
			console.warn(ex);
		}
	},
	/**
	 * @name: buildCustomerNotAssign
	 * @description: Método para la construcción de los select de Customer, CustomerContact
	 * @param: {object} setSeller - Setting del select Vendedor
	 * @param: {object} setCustomer - Setting del select Customer
	 * @param: {string} dropdownParent - Contenedor aplicable a modales
 	*/
	buildCustomerNotAssign: function (setSeller, setCustomer, dropdownParent) {
		try {
			var self = this;
			$(setSeller.selector).select2({
				placeholder: setSeller.placeholder,
				escapeMarkup: function (m) { return m; },
				theme: "classic",
				width: "100%",
				minimumInputLength: 3,
				allowClear: true,
				dropdownParent: dropdownParent,
				ajax: {
					url: setSeller.url,
					cache: true,
					dataType: 'json',
					data: function (params) {
						var query = {
							query: params.term
						}
						return query;
					},
					processResults: function (data) {
						var rows = _.map(data.domain, function (customer) {
							return {
								id: customer.id,
								text: customer.name
							};
						});
						return {
							results: rows
						};
					}
				}
			}).on('change', function (e, data) {
				// Do something
				$(setCustomer.selector).val(null).html("<option></option>").trigger("change");
				$.get(setCustomer.url, {
					query: $(e.currentTarget).val()
				}).done(function (data) {
					var rows = _.map(data.domain, function (customer) {
						return {
							id: customer.id,
							text: customer.name
						};
					});
					self.buildSelect(setCustomer.selector, rows, setCustomer.placeholder, dropdownParent);
				});
			});
			self.buildSelect(setCustomer.selector, null, setCustomer.placeholder, dropdownParent);
		} catch (ex) {
			console.warn(ex);
		}
	},
	/**
	 * @name: buildSelect
	 * @description: Método para la construcción de select
	 * @param: {String} selector - Identificador del select
	 * @param: {string} placeholder - Texto de placeholder
	 * @param: {string} dropdownParent - Selector de Contenedor aplicable a modales
	 * @param: {object} data - Data de las opciones
 	*/
	buildSelect: function (selector, data, placeholder, dropdownParent, ajaxData) {
		try {
			var rows = {};
			switch (typeof ajaxData) {
				case "undefined":
					var rows = data;
					$(selector).select2({
						placeholder: placeholder,
						escapeMarkup: function (m) { return m; },
						theme: "classic",
						width: "100%",
						dropdownParent: dropdownParent,
						data: rows
					}).trigger("change");
					break;
				
				default:
					$.get(ajaxData.url, {
						query: ajaxData.query
					}).done(function (data) {
						var rows = _.map(data.domain, function (response) {
							return {
								id: response.id,
								text: response.name || response.id,
								selected: ajaxData.selected === response.id ? true : false
							};
						});
						$(selector).select2({
							placeholder: placeholder,
							escapeMarkup: function (m) { return m; },
							theme: "classic",
							width: "100%",
							dropdownParent: dropdownParent,
							data: rows
						}).trigger("change");
						$("body").localize();
					});
					break;
			}
		} catch (ex) {
			console.warn(ex);
		}
	},
	/**
	 * @name: toISODateTime
	 * @description: Método para formatear Datetime a ISO
	 * @param: {String} datetime - Datetime a formatear
 	*/
	toISODateTime: function (datetime) {
		try {
			return moment(datetime).format("DD-MM-YYYY HH-mm-ss")
		} catch (ex) {
			console.warn(ex);
		}
	},
	/**
	 * @name: createColumsTable
	 * @description: Método para formatear Datetime a ISO
	 * @param: {String} datetime - Datetime a formatear
 	*/
	createColumsTable: function () {
		try {
			var self = this;
			var colums = _.map(self.getTableColums,function(colum){
				return { 
					"title": "<span data-i18n='tables."+colum.node+"."+colum.attribute+"'>"+colum.attribute+"</span>",
					"name": colum.attribute,
					"data": colum.attribute
				};
			});
			return colums;
		} catch (ex) {
			console.warn(ex);
		}
	},
	/**
	* @name renderTable
	*/
    renderTable: function(){
        var self = this;
        config = {
            "ajax": {
                "url": self.urlList,
                "method": "GET",
                "dataType": "JSON",
                dataSrc: function(data){
                    return self.setTableAttributes(data);
                }
            },
			"info": false,
			"destroy": true,
            "aLengthMenu": [[10, 25, 50, 75, -1], [10, 25, 50, 75, "All"]],
            "columns": self.createColumsTable(),
            "columnDefs": self.getTableColumnDefs
        };
        DomainDataTables.initTable(self.tableId, config, self,  self.getTableActions);
    },
	/**
	* @name setToggleCollapse
	*/
    setToggleCollapse: function(){
        var self = this;
		// panel collapse/expand
		var affectedElement = self.$el.find('.panel-body');
		self.$el.find('.panel .btn-toggle-collapse').clickToggle(
			function (e) {
				e.preventDefault();
				// if has scroll
				if ($(this).parents('.panel').find('.slimScrollDiv').length > 0) {
					affectedElement = $('.slimScrollDiv');
				}
				$(this).parents('.panel').find(affectedElement).slideDown(300);
				$(this).find('i').hasClass("lnr-chevron-down") ? $(this).find('i').removeClass('lnr-chevron-down') : $(this).find('i').addClass('lnr-chevron-down');
				$(this).find('i').toggleClass('lnr-chevron-up');
			},
			function (e) {
				e.preventDefault();
				// if has scroll
				if ($(this).parents('.panel').find('.slimScrollDiv').length > 0) {
					affectedElement = $('.slimScrollDiv');
				}
				$(this).parents('.panel').find(affectedElement).slideUp(300);
				$(this).find('i').hasClass("lnr-chevron-down") ? $(this).find('i').removeClass('lnr-chevron-down') : $(this).find('i').addClass('lnr-chevron-down');
				$(this).find('i').toggleClass('lnr-chevron-up');
			}
		);
    },
	/**
	* @name reloadSelfTable
	*/
	reloadSelfTable: function (destroy){
        var self = this;
		// panel collapse/expand
		var settings = $.fn.dataTableSettings;
		if (settings.length > 0) {
			var setting = _.omit(settings, function (set, index) {
				var id = "#" + set.sInstance;
				return id !== self.tableId;
			});
			if (Object.keys(setting).length > 0) {
				if (destroy) $(self.tableId).DataTable().destroy();
				$(self.tableId).DataTable(setting[parseInt(Object.keys(setting)[0])]);
				$(self.tableId).localize();
			} else {
				self.renderTable();
			}
		} else {
			self.renderTable();
		}
	},
	/**
	* @name fileExist
	* @description Verifica si un archivo existe en una ruta
	*/
	fileExist: function(url) {
		if (url) {
			var req = new XMLHttpRequest();
			req.open('GET', url, false);
			req.send();
			return req.status == 200;
		} else {
			return false;
		}
	}
});
