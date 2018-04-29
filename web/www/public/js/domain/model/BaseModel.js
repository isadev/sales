/**
 * Base Model de donde extienden todos los modelos
 */
var BaseModel = Backbone.Model.extend({
	/**
	 * Valores por defecto de los atributos del modelo.
	 */
	defaults : {
		"title" : null,
		"message" : null,
		"domain" : null,
		"error" : null
	},
	/**
	 * Root de la Aplicacińn Web.
	 */
	urlRoot: "",
	/**
	 * URL de sincronización Bidireccional App.
	 */
	urlSync: null,
	/**
	 * executeSave Se encarga de correr el método de guardado para un modelo.
	 * 
	 */
	executeSave: function (pUrl) {
		var self = this;
		self.save(self.urlRoot + pUrl).done(function(data, textStatus, jqXHR) {
			if (data !== null) {
				console.warn("Message success");
			} else {
				console.warn("Message Error");
			}
		});
		return self;
	},
	/**
	 * Override save function.
	 * 
	 */
	save: function(url, attributes, options) {
		var self = this, urlR = url ? url : self.url;
		var config = _.defaults((options || {}), { url: urlR});
		return Backbone.Model.prototype.save.call(self, attributes, config);
	},
	/**
	 * executeDestroy Se encarga de correr el método de guardado para un modelo.
	 * 
	 */	
	executeDestroy: function (pUrl,options) {
		var self = this;
		self.destroy(pUrl + "/" + self.get("id"), {
			success: function (model, response) {
				if (options && options.table)
					DomainDataTables.Delete(options.table, options.rowObject);
				DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.success.title"), i18next.t("message:message.pnotify.request.success.message"), "success");
			},
			error: function (model, error) {
				DomainAlertMessages.MessageCustom(i18next.t("message:message.pnotify.request.error.title"), i18next.t("message:message.pnotify.request.error.message"), "error");
			}
		});
		return self;
	},
	/**
	 * Override desroy function.
	 * 
	 */
	destroy : function (url, options) {
		var self = this;
		config = _.defaults((options || {}), {url: url});
		return Backbone.Model.prototype.destroy.call(self, config);
	}
});