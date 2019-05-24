/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/serverWidget'],
/**
 * @param {record} record
 * @param {serverWidget} serverWidget
 */
function(record, serverWidget) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	var request = context.request;
    	var response = context.response;
        var mold_obj ={};
        var mold_arr =[];
        var desc_cen = request.parameters.censtonedesc
     // var itemObj;
        //var vendor = "";
        //var item = "";
    	
      if (request.method == 'GET'){
    	//var item = JSON.parse(context.request.body);  
    	  var form = serverWidget.createForm({
    		  title: "Create Mold"
    	  });
        
        //form.clientScriptFileId = 30178579;
        form.clientScriptModulePath = 'SuiteScripts/OpenMoldForm_updated.js';
        var fld_line = form.addField({id:'custpage_hidden_line_info',type:serverWidget.FieldType.TEXT,label:'Hidden Line Number'});
          fld_line.updateDisplayType({displayType:serverWidget.FieldDisplayType.HIDDEN});
          fld_line.defaultValue = request.parameters.line;
    	  
    	 var fld = form.addField({id:'custpage_hidden_info',type:serverWidget.FieldType.TEXT,label:'Hidden Item'});
          fld.updateDisplayType({displayType:serverWidget.FieldDisplayType.HIDDEN});
        
          fld.defaultValue = request.parameters.item;
        
        var fld_sku = form.addField({id:'custpage_hidden_mul_sku',type:serverWidget.FieldType.TEXT,label:'Hidden SKU'});
          fld_sku.updateDisplayType({displayType:serverWidget.FieldDisplayType.HIDDEN});
         // item = request.parameters.custscript_item_number;
        
        var fld_vendor = form.addField({id:'custpage_hidden_vendor',type:serverWidget.FieldType.TEXT,label:'Hidden Vendor'});
          fld_vendor.updateDisplayType({displayType:serverWidget.FieldDisplayType.HIDDEN});
          fld_vendor.defaultValue = request.parameters.vendor;
        //  vendor = request.parameters.custscript_vendor_number;
       var namefld = form.addField({
    		  id:'custpage_name',
    		  type:serverWidget.FieldType.TEXT,
    		  label: 'Name'
    	  });
        namefld.isMandatory = true;  
      var fld_not_hid_item =   form.addField({
    		  id:'custpage_item',
    		  type:serverWidget.FieldType.SELECT,
    		  label: 'Item',
    		  source:'item'
    	  });
        
        fld_not_hid_item.defaultValue = request.parameters.item;
        
    var fld_not_hid_vendor =    form.addField({
    		  id:'custpage_vendor',
    		  type:serverWidget.FieldType.SELECT,
    		  label: 'Vendor',
    		  source:'vendor'
    	  });
        
    fld_not_hid_vendor.defaultValue = request.parameters.vendor;
        
    

    	  form.addField({
    		  id:'custpage_shape',
    		  type:serverWidget.FieldType.SELECT,
    		  label: 'Shape',
    		  source:'customlist_shape_abbreviations'
    	  });
    	  
    	  form.addField({
    		  id:'custpage_length',
    		  type:serverWidget.FieldType.TEXT,
    		  label: 'Length'
    	  });
    	  
    	  form.addField({
    		  id:'custpage_width',
    		  type:serverWidget.FieldType.TEXT,
    		  label: 'Width'
    	  });
    	  
    	  form.addField({
    		  id:'custpage_ringsize',
    		  type:serverWidget.FieldType.TEXT,
    		  label: 'Ring Size'
    	  });
    	  
    	  /*form.addField({
    		  id:'custpage_sku',
    		  type:serverWidget.FieldType.SELECT,
    		  label: 'Applicable Parent SKU',
    		  source:'item'
    	  });*/
        
       /* form.addField({
    		  id:'custpage_catalog',
    		  type:serverWidget.FieldType.TEXTAREA,
    		  label: 'Catalog'
    		 
    	  });*/
        
      var desc_fld =   form.addField({
    		  id:'custpage_description',
    		  type:serverWidget.FieldType.TEXT,
    		  label: 'Center Stone Description'
    		 
    	  });
        
     desc_fld.updateDisplayType({displayType:serverWidget.FieldDisplayType.INLINE});
     if (desc_cen){
       desc_fld.defaultValue = desc_cen;
     }
        var sublist = form.addSublist({id:'custpage_parent_sku_sublist',type:serverWidget.SublistType.INLINEEDITOR,label:'Applicable Parent SKU'});
        
        sublist.addField({
              id:'custpage_sku',
    		  type:serverWidget.FieldType.SELECT,
    		  label: 'Applicable Parent SKU',
    		  source:'item'});
    	  
    	 form.addButton({id:'custpage_save',label:'Save',functionName:'tempRecHold()'});
    	// form.addSubmitButton({title:'Save'});
    	  form.addButton({id:'custpage_save_and_add',label:'Save and Add another',functionName:'saveAndAdd()'});
    	  response.writePage(form);
      }
      

    }

    return {
        onRequest: onRequest
    };
    
});
