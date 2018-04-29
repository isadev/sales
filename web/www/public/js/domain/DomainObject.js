/**
 * Domain para gestionar las operaciones básicas del la aplicación
 */
DomainObject =  (function (){
	'use strict';
   /****************************************************************
	* Declaracion de variables
    *****************************************************************/
    var $variable1,
    	$variable2,
    	$variable3,
    	$variable4,
		$filterTime;
   /****************************************************************
	* Declaracion de metodos
    *****************************************************************/
    var init,
    	Create,
    	Edit,
		Delete,
		fromToJSON,
        Load,
		customLoading,
		buttomLoading;
    /**
     * @name: init
     * @description: Método de inicialización
     */
	init = function() {
		try{
			// console.info("Instancia creada exitosamente");
		}catch(ex)
		{
			console.warn(ex);
		}
	},
    /**
     * @name: Create
     * @description: Método para el maejo de peticiones CREATE
     * @param: {String} url - Url destino de la Petición
     * @param: {String} id - Identificador del Registro
     * @param: {function} callback - Función de Vuelta al ejecutar Petición
     */
	Create = function($url,$data, callback){
		try{
			$.ajax({
				type: "POST",
				url: $url,
				data: $data,
				dataType: "json",
				success: function (response) {
                    DomainAlertMessages.MessageCustom(response.title, response.message, "success");
                                    if(callback)
                                            callback(response);
				},
				error: function (error){
                    DomainAlertMessages.MessageCustom(error.responseJSON.title, error.responseJSON.message, "error");
				}
			});
		}catch(ex)
		{
			console.warn(ex);
		}
    },
    /**
     * @name: Edit
     * @description: Método para el manejo de peticiones UPDATE
     * @param: {String} url - Url destino de la Petición
     * @param: {String} id - Identificador del Registro
     * @param: {function} callback - Función de Vuelta al ejecutar Petición
     */
	Edit = function($url,$data,callback){
		try{
			$.ajax({
				type: "PUT",
				url: $url,
				data: $data,
				dataType: "json",
				success: function (response) {
					DomainAlertMessages.MessageCustom("Titulo Success", "Mensaje de éxito", "success");
					if(callback)
						callback(response);
				},
				error: function (error){
					DomainAlertMessages.MessageCustom("Titulo Error", "Mensaje de Error", "error");
				}
			});
		}catch(ex)
		{
			console.warn(ex);
		}
    },
    /**
     * @name: Delete
     * @description: Método para el manejo de peticiones DELETE
     * @param: {String} url - Url destino de la Petición
     * @param: {String} id - Identificador del Registro
     * @param: {function} callback - Función de Vuelta al ejecutar Petición
     */
    Delete = function($url, $data, callback){
		try{
			$.ajax({
				type: "DELETE",
				url: $url,
				data: $data,
				dataType: "json",
				success: function (response) {
					DomainAlertMessages.MessageCustom("Titulo Success", "Mensaje de éxito", "success");
					if(callback)
						callback(response);
				},
				error: function (error){
					DomainAlertMessages.MessageCustom("Titulo Error", "Mensaje de Error", "error");
				}
			});
		}catch(ex)
		{
			console.warn(ex);
		}
	},
    /**
     * @name: Load
     * @description: Método para el manejo de consultas ajax
     * @param: {String} url - Url destino de la Petición
     * @param: {String} id - Identificador del Registro
     * @param: {function} callback - Función de Vuelta al ejecutar Petición
     */
    Load = function($url, $data, callback){
        try{
            $.ajax({
                type: "POST",
                url: $url,
                data: $data,
                dataType: "JSON",
                success: function (response) {
                    if(callback)
                        callback(response);
                },
                error: function (error){
                    
                }
            });
        }catch(ex)
        {
                console.warn(ex);
        }
    },
	 /**
     * @name: customLoading
     * @description: Método para el manejo del Loading Hide/Show
     * @param: {String} action - Acción a ejecutar con el Loading
     */
    customLoading = function($action){
		try{
			var overlay = $("#overlay-container-loading");
			var loading = $(".loading-container");
			switch($action){
				case ENUMS.GENERAL.COMPARATION.HIDE:
					overlay.fadeOut("fast");
					overlay.parent("body").css('overflow', 'visible');
					loading.fadeOut("fast");
					break;
					case ENUMS.GENERAL.COMPARATION.SHOW:
					overlay.fadeIn("slow");
					overlay.parent("body").css('overflow', 'hidden');
					loading.fadeIn("slow");
					break;
				default:
					console.info("No se ha elegido ninguna acción");
					break;
			}
		}catch(ex)
		{
			console.warn(ex);
		}
	},
	/**
     * @name: buttomLoading
     * @description: Método para el manejo del Loading en botones
     * @param: {String} btn - Selector del Boton a configurar
     * @param: {String} status - Estatus para el botón
     * @param: {String} html ["enable", "disable"]- Texto del botón cuando se va a habilitar
     */
    buttomLoading = function(btn, status, html){
		try{
			var button = $(btn);
			switch(status){
				case ENUMS.GENERAL.COMPARATION.DISABLE:
					button.html('<i class="fa fa-spinner fa-spin"></i><span class="sr-only">Loading...</span>');
					button.attr("disabled", "disabled");
					break;
				case ENUMS.GENERAL.COMPARATION.ENABLE:
					var html = html;
					button.html(html);
					button.removeAttr("disabled");
					break;
				default:
					console.info("No se ha elegido ninguna status");
					break;
			}
		}catch(ex)
		{
			console.warn(ex);
		}
	};
    return {
    	init:init,
    	Create:Create,
    	Edit:Edit,
		Delete:Delete,
		fromToJSON: fromToJSON,
		Load:Load,
		customLoading: customLoading,
		buttomLoading: buttomLoading
    }
})();
DomainObject.init();