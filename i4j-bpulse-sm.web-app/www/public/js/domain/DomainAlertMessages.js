/**
 * Domain para Gestión de Alertas y mensajes de notificaciones
 */
DomainAlertMessages =  (function (){
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
		AlertCustom,
		AlertWithAjax,
		MessageCustom;
    /**
     * @name: init
     * @description: Método de inicialización
     */
	init = function() {
		try{
			// var callback = function (data) {
			// 	console.log("data: ", data);
			// };
			// AlertWithAjax("Your public IP", "Your public IP will be received via AJAX request", "Show my public IP", "https://api.ipify.org?format=json", callback);
			// MessageCustom('Regular Success','That thing that you were trying to do worked!', 'success');
		}catch(ex)
		{
			console.warn(ex);
		}
	},
	/**
     * @name: AlertCustom
     * @description: Método para el manejo de Alertas
     * @param: {String} title - Título del Mensaje
     * @param: {String} message - Mensaje a mostrar
     * @param: {String} type ["info", "error", "warning", "success"] - Tipo de Mensaje
     * @param: {function} callback - Función a ejecutarse luego de 
	 * 			cerrar la alerta
     */
	AlertCustom = function(title, message, type, callback){
		try{
			if (!callback){
				var callback = function(){};
			}
			swal({
				title: title,
				text: message,
				type: type,
			}).then(function (result) {
				callback();
			}, function (dismiss){});
		}catch(ex)
		{
			console.warn(ex);
		}
	},
	/**
     * @name: AlertWithAjax
     * @description: Método para el manejo de Alerta con Ajax request
     * @param: {String} title - Título del Mensaje
     * @param: {String} message - Mensaje a mostrar
     * @param: {String} confirmButtonText - Texto del Botón Confirm
     * @param: {string} url - Url Directions de la peticion Ajax GET
     * @param: {function} callback - Función de Vuelta al ejecutar Petición
     */
	AlertWithAjax = function(title, message, confirmButtonText, cancelButtonText, execute, callback){
		try{
                    swal.queue([{
                        title: title,
                        confirmButtonText: confirmButtonText,
                        cancelButtonText: cancelButtonText,
                        text: message,
                        showLoaderOnConfirm: true,
                        preConfirm: function (confirm) {
                            if (confirm) {
                                return new Promise(function (resolve) {
                                    execute();
                                    resolve();
                                });
                            }
                        }
                    }]).catch(swal.noop);
                }catch(ex)
		{
                    console.warn(ex);
                    return false;
		}
	},
	/**
     * @name: MessageCustom
     * @description: Método para el maejo de Alertas tipo Mensajes
     * @param: {String} title - Título del Mensaje
     * @param: {String} message - Mensaje a mostrar
     * @param: {String} type ["info", "error", "warning", "success"] - Tipo de Mensaje
     */
	MessageCustom = function(title, message, type){
		try{
			var message = new PNotify({
				title: title,
				text: message,
				type: type,
				addclass: 'custom-pnotify',
				styling: 'bootstrap3'
			});
			message.get().click(function () {
				message.remove();
			});
		}catch(ex)
		{
			console.warn(ex);
		}
	}
    return {
    	init:init,
		AlertCustom:AlertCustom,
		AlertWithAjax: AlertWithAjax,
		MessageCustom:MessageCustom
    }
})();
DomainAlertMessages.init();