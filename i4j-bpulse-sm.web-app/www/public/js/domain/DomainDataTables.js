/**
 * Domain para gestion de acciones en DataTables JQUERY
 */
DomainDataTables =  (function (){
	'use strict';
   /****************************************************************
	* Declaracion de variables
    *****************************************************************/
    var aDataRow = [];
    var aTable = [];
    var aObject = [];
   /****************************************************************
	* Declaracion de metodos
    *****************************************************************/
    var init,
        initTable,
        Insert,
        Update,
        Delete,
        getDataRow,
        initEventsButtons,
        setDataRow,
        detailsControl;
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
     * @name: initTable
     * @description: Método para el maejo de la acción initTable en Tablas
     * @param: {String} table - Identificador de la tabla
     * @param: {Object} config - Configuración de la Tabla
     * @param: {Object} domain - Objeto de dominio de la Entidad
     */
	initTable = function(table, config, domain, actions){
        try{
            var actions = actions || {};
            var buttons="",i;
            if (actions.length>0){
                if (actions[0]===true){
                    i=true;
                    buttons += "<button class='btn btn-sm btn-info btn-edit-row'><i class='fa fa-edit'></i><span data-i18n='tables.buttons.edit'>Edit</span></button>";
                }
                if (actions[1] === true){
                    i=true;
                    buttons += "<button class='btn btn-sm btn-danger btn-delete-row'><i class='fa fa-remove'></i><span data-i18n='tables.buttons.delete'>Delete</span></button>";
                }
                if (actions[3] === true){
                    i=true;
                    buttons += "<button class='btn btn-sm btn-success btn-impersonate'><i class='fa fa-user'></i><span data-i18n='tables.buttons.impersonate'>impersonate</span></button>";
                }
                if (actions[4] === true){
                    i=true;
                    buttons += "<button class='btn btn-sm btn-info btn-approve'><i class='fa fa-check'></i><span data-i18n='tables.buttons.approve'></span></button>";
                }
                if (i === true){
                    config.columns.push({
                        title: "<span data-i18n='tables.actions'></span>",
                        name: "<span data-i18n='tables.actions'></span>",
                        targets: config.columns.length,
                        defaultContent: buttons,
                        data: null,
                        width: "15%"
                    });
                }
            }
            if (i18next.language!==undefined){
                config.language= {
                    "url": "/locales/datatables/"+i18next.language+".json"
                }
            }else{
                config.language= {
                    "url": "/locales/datatables/es.json"
                }
            }
            config.initComplete = function(){
                domain.localize();
            }
            aTable = $(table).DataTable(config);
            var $newItemBtn = $("#btn-new-row");
            if (domain.tableInstance) domain.tableInstance = aTable;
            $newItemBtn.on('click', function(e) {
                domain.renderModal({}, aTable, {}, "create");
            });
            if (i) {
                initEventsButtons(aTable, domain, actions);
            }
        }catch(ex)
        {
            console.warn(ex);
        }
    },
    /**
     * @name: Insert
     * @description: Método para el maejo de la acción initTable en Tablas
     * @param: {Object} table - Identificador de la tabla
     * @param: {Object} aDataRow - Data de la fila a insertar
     */
    Insert = function (aData, table){
        try{
            table.row.add(aData).draw(false);
            setDataRow([]);
        }catch(ex)
        {
            console.warn(ex);
        }
    },
    /**
     * @name: Edit
     * @description: Método para el manejo de acciones EDITAR en Tablas
     * @param: {Object} table - Identificador de la tabla
     * @param: {Object} row - Fila a editar
     * @param: {Object} aData - Data editada en la tabla (Global)
     */
    Update = function (aData, table, object){
        try{
            var nRow = $(object).parents('tr')[0];
            table.row(nRow).data(aData).draw();
            
        }catch(ex)
        {
            console.warn(ex);
        }
    },
    /**
     * @name: Delete
     * @description: Método para el manejo de acciones ELIMINAR en Tablas
     * @param: {Object} table - Identificador de la tabla
     * @param: {Object} Object - this Del elemento desencadenador (td activado con Click)
     */
    Delete = function(table, object){
        try{
            var nRow = $(object).parents('tr')[0];
            table.row(nRow).remove().draw();
        }catch(ex)
        {
            console.warn(ex);
        }
    },
    /**
     * @name: getDataRow
     * @description: Método para extraer la data de una Fila
     * @param: {Object} table - Identificador de la table
     * @param: {Object} Object - this Del elemento desencadenador (td activado con Click)
     */
    getDataRow = function(table,object){
        try{
            var nRow = $(object).parents('tr')[0];
            var aData = table.row(nRow).data();
            
            return aData;
        }catch(ex)
        {
            console.warn(ex);
        }
    },
    /**
     * @name: initEventsButtons
     * @description: Método que instancia los eventos básicos de Actions
     * @param: {Object} table - Identificador de la table
     * @param: {Object} domain - Objeto de Dominio de la Entidad
     */
    initEventsButtons = function(table, domain, actions){
        try{
            if (actions[0] === true) {
                table.on('click', 'button.btn-edit-row', function(e) {
                    var aData;
                    var rowObject = this;
                    // Recupera los datos del registro a editar.
                    aData = getDataRow(table, rowObject);
                    domain.renderModal(aData, table, rowObject, "edit");
                    e.stopPropagation();
                });
            }
            if (actions[1] === true) {
                table.on('click', 'button.btn-delete-row', function(e) {
                    var aData;
                    // Recupera los datos del registro a editar.
                    aData = getDataRow(table, this);
                    var rowObject = this;
                    // Problema con el domain, se crea un nuevo domain para resources o se trabaja en el de temas ??
                    domain.onDelete(aData, table, rowObject);
                    e.stopPropagation();
                });
            }
            if (actions[2] === true) {
                table.on('click', 'a.btn-view-data', function(e) {
                    var aData;
                    var rowObject = this;
                    // Recupera los datos del registro a editar.
                    aData =  getDataRow(table, rowObject);
                    domain.viewData(aData);
                });
            }
            if (actions[3] === true) {
                table.on('click', 'button.btn-impersonate', function(e) {
                    var aData;
                    var rowObject = this;
                    // Recupera los datos del registro a editar.
                    aData =  getDataRow(table, rowObject);
                    domain.onImpersonate(aData);
                });
            }
            if (actions[4] === true) {
                table.on('click', 'button.btn-approve', function(e) {
                    var aData;
                    var rowObject = this;
                    // Recupera los datos del registro a editar.
                    aData =  getDataRow(table, rowObject);
                    domain.onApprove(aData, table, rowObject);
                });
            }
        }catch(ex)
        {
            console.warn(ex);
        }
    },
    /**
     * @name: setDataRow
     * @description: Método que instancia los eventos básicos de Actions
     * @param: {Object} table - Identificador de la table
     * @param: {Object} domain - Objeto de Dominio de la Entidad
     */
    setDataRow = function(aData){
        try{
            aDataRow = aData;
        }catch(ex)
        {
            console.warn(ex);
        }
    };
    /**
     * @name: detailsControl
     * @description: Método que maneja los click de los eventos de detalles de dataTables
     * @param: {Object} table - Identificador de la table
     * @param: {Object} format - Formato del detailsControl
     */
    detailsControl = function (table, format) {
        try {
            $(table + ' tbody').on('click', 'td.details-control', function(e){
                var tr = $(this).closest('tr');
                var row = $(table).DataTable().row(tr);
                var data = format(row.data());
                
                if (row.child.isShown()) {
                    tr.removeClass('shown');
                    row.child.hide();
                } else {
                    tr.addClass('shown');
                    row.child(data.table).show();
                    DomainDataTables.initTable(data.tb, data.config, data.domain);
                }
            });
        } catch (ex)
        {
            console.warn(ex);
        }
    };
    return {
    	init:init,
    	initTable:initTable,
    	Insert:Insert,
    	Update:Update,
        Delete:Delete,
        getDataRow: getDataRow,
        setDataRow: setDataRow,
        detailsControl:detailsControl
    };
})();
DomainDataTables.init();
