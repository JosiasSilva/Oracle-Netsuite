/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/format', 'N/record', 'N/search'],
/**
 * @param {file} file
 * @param {format} format
 * @param {record} record
 * @param {search} search
 */
function(file, format, record, search) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {
    	var objDiamondChildData = search.create({
    		type: 'customrecord_diamond_receive_dashboard',
    		columns:
	    		   [
	    		     search.createColumn({name: "custrecord_po_data_update", label: "PO Data Update"}),
	    		     search.createColumn({name: "custrecord_cdp_update", label: "CDP Update"}),
	    		     search.createColumn({name: "custrecord_po_cdp_id", label: "PO CDP ID"}),
	    		     search.createColumn({name: "custrecord_so_data_update", label: "SO Data Update"})		    	     
	    		   ]
    	});
    	return objDiamondChildData;
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
    	var intrnId = context.key;
    	var poCdpId = '';
    	  for (var i = 0; i < context.values.length; i++) {
    	      var srchChildData = JSON.parse(context.values[i]);
       	      poCdpId = srchChildData.values['custrecord_po_cdp_id'].value;
    	      var json_obj_po = JSON.parse(srchChildData.values['custrecord_po_data_update']);
    	      var json_obj_cdp = JSON.parse(srchChildData.values['custrecord_cdp_update']);
    	      var json_obj_so = JSON.parse(srchChildData.values['custrecord_so_data_update']);

    	      if(json_obj_cdp){
	    	      if(json_obj_cdp.internalid!=null && json_obj_cdp.internalid!='' ){
	    	    	  try{
	    	    		  var recId = record.submitFields({
	    	    			  type: 'customrecord_custom_diamond', 
	    	    			  id: json_obj_cdp.internalid, 
	    	    			  values: {
	    	    				  'custrecord_diamond_status' : json_obj_cdp.custrecord_diamond_status
	    	    			  }
	    	    		  });
	    	    	  }catch(er){
	    	    		  log.debug("Error while updating Diamond Status", er.message);
	    	    	  }
	                }
    	      }
    	      if(json_obj_po){
	    	      if(json_obj_po.internalid){
	                  try{
	                    Update_PurchaseOrder(json_obj_po); 
	                  }catch(er){
	                	  log.debug("Error while updating Purchase Order", er.message);
	                  }
	
	                  try{
	                    Create_Item_Recipt(json_obj_po); 
	                  }catch(er){
	                	  log.debug("Item Recipt can not be created for this PO", er.message + "\n : PO Internal Id: " + json_obj_po.internalid);
	                  }
	    	      	}
                }
    	     
    	      if(json_obj_so){
                  if(json_obj_so.internalid){
                    try{
                      Update_Sales_Order(json_obj_so);
                    }catch(er){
                    	log.debug("Error while updating Sales Order", er.message);
                    }
                  }
                }
    	  }
    	  //delete child record
    	  try{
			  var RecChildId = record.delete({
				type: 'customrecord_diamond_receive_dashboard',
				id: intrnId
				});
            log.debug("Child Record deleted ", "Record Id: " + RecChildId);
			}catch(er){
                log.debug("Error while deleting Child Record", "Record Id: " + intrnId + "; Error: "+ er.message);
            }
    	  
    	  context.write({
    	      key: intrnId,
    	      value: poCdpId
    	    });
    }

    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    	var arrChildRecId = [];
    	var arrParentRecId = [];
    	if (summary.inputSummary.error) {
            log.error('Input Error', summary.inputSummary.error);
          };
        summary.reduceSummary.errors.iterator().each(function(key, error) {
            log.error('Reduce Error for key: ' + key, error);
            return true;
          });
        
        summary.output.iterator().each(function(key, value) {
            if(arrChildRecId.indexOf(key) == -1)arrChildRecId.push(key);
            if(arrParentRecId.indexOf(value) == -1)arrParentRecId.push(value);
            return true;
          });
       
        // Delete Parent Records
    	for(var ln = 0; ln < arrParentRecId.length; ln++){
    		log.audit("Parent Record - Deleted","Rec Id : " + arrParentRecId[ln]);
    		try{
    		   var RecParentId = record.delete({
				type: 'customrecord_po_cdp_data',
				id: arrParentRecId[ln]
				});
			}catch(er){
              	log.debug("Error while deleting Parent Record", "Record Id: " + arrParentRecId[ln] + "; Error: "+ er.message);
            }
    	}
    }

    function Update_PurchaseOrder(json_obj_po)
    {
    	var PO_Data = record.load({
		  type: record.Type.PURCHASE_ORDER,
		  id: json_obj_po.internalid
		  });
    	
      if(!json_obj_po.location){json_obj_po.location="2";}
      PO_Data.setValue({
    	  fieldId: 'custbody58',
    	  value: json_obj_po.custbody58 // SALES ORDER IMPORTANT NOTES
    	  });
//var dtVendor = '';
      if(json_obj_po.custbody59){
         var dtVendor = format.parse({value: json_obj_po.custbody59, type: format.Type.DATE });
      //}
         PO_Data.setValue({
             fieldId: 'custbody59',
             //value: json_obj_po.custbody59 // DATE NEEDED BY VENDOR
             value : dtVendor
            });
      } /*else{
        var dtVendor = '';
        PO_Data.setText({
             fieldId: 'custbody59',
             value : dtVendor
            });
      }*/
      
      if(json_obj_po.line_number > 0){
	      PO_Data.setSublistValue({
	    	  sublistId: 'item', 
	    	  fieldId: 'location',
	    	  line: json_obj_po.line_number-1, // in 1.0 line# start with 1, while in 2.0 it starts with 0
	    	  value: json_obj_po.location
	    	  });
	      
	      var diamondInscription = false;
	      if(json_obj_po.custcoldiamondinscription == "T")
	    	  diamondInscription = true;
	      
	      PO_Data.setSublistValue({
	    	  sublistId: 'item', 
	    	  fieldId: 'custcoldiamondinscription',
	    	  line: json_obj_po.line_number-1, // in 1.0 line# start with 1, while in 2.0 it starts with 0
	    	  value: diamondInscription
	    	  });
	      PO_Data.setSublistValue({
	    	  sublistId: 'item',
	    	  fieldId: 'custcol28',
	    	  line: json_obj_po.line_number-1, // in 1.0 line# start with 1, while in 2.0 it starts with 0
	    	  value: json_obj_po.custcol28
	    	  });
      }
      var recId = PO_Data.save({
    	  enableSourcing: true,
    	  ignoreMandatoryFields: true
    	  });
      
    }

    function Update_Sales_Order(json_obj_so)
    {
      var get_so_data = record.load({
			  		type: record.Type.SALES_ORDER,
			  		id: json_obj_so.internalid
			  		//,isDynamic: true,
			  		});
      var linenum = get_so_data.findSublistLineWithValue({
    	  sublistId: 'item',
    	  fieldId: 'item',
    	  value: json_obj_so.line_id
    	  });
      
      if(!json_obj_so.location)
         json_obj_so.location="2";

      if(linenum > -1){
	      get_so_data.setSublistValue({
	    	  sublistId: 'item', 
	    	  fieldId: 'location',
	    	  line: linenum,
	    	  value: json_obj_so.location
	    	  });
	      
	      var holdBinder = false;
	      if(json_obj_so.diamond_in_hold_binder=="T")
	    	  holdBinder = true;
	      
	      get_so_data.setSublistValue({
	    	  sublistId: 'item', 
	    	  fieldId: 'custcol_diamond_in_hold_binder',
	    	  line: linenum,
	    	  value : holdBinder
	    	  });
      }
      if(json_obj_so.diamond_in_hold_binder=="T")
      {
    	  if(linenum > -1){
	        var get_item = get_so_data.getSublistText({
	        	sublistId: 'item',
	        	fieldId: 'item',
	        	line: linenum
	        	});
    	  }
        var old_value_get=get_so_data.getValue({fieldId : 'custbody58'});
        var data_up_field = format.format({value: new Date(), type: format.Type.DATE }) +' '+get_item+' '+'diamond in hold binder';
        var set_field_value_notes='';
        if(!old_value_get){
          set_field_value_notes=data_up_field;
        }else{
	          if(old_value_get.search(data_up_field)==-1){
	            set_field_value_notes=old_value_get+'<br>'+data_up_field;  
	          }else{
	        	set_field_value_notes=old_value_get;
	          }
        }
        get_so_data.setValue({fieldId : 'custbody58', value : set_field_value_notes});
      }
     var recId = get_so_data.save({
    	  enableSourcing: true,
    	  ignoreMandatoryFields: true
    	  });
    }

    function Create_Item_Recipt(json_obj_po)
    {
      var get_req_line = json_obj_po.line_number;
      var receipt = record.transform({
	    	  fromType: record.Type.PURCHASE_ORDER,
	    	  fromId: json_obj_po.internalid,
	    	  toType: record.Type.ITEM_RECEIPT
	    	  //,isDynamic: true,
	    	  });
      
      var stone_received_by=json_obj_po.stone_received_by; 
      receipt.setValue({fieldId : 'custbody357', value : stone_received_by});
      for(var xx = 0; xx < receipt.getLineCount({sublistId: 'item'}) ; xx++){
        var line_id_get=receipt.getSublistValue({sublistId: 'item', fieldId:'line', line:xx});
        if(get_req_line==line_id_get){
          receipt.setSublistValue({
        	  sublistId: 'item', 
        	  fieldId: 'location',
        	  line: xx,
        	  value: json_obj_po.location
        	  });
          receipt.setSublistValue({
        	  sublistId: 'item', 
        	  fieldId: 'itemreceive',
        	  line: xx,
        	  value: true
        	  });
          var holdBinder = false;
	      if(json_obj_po.diamond_in_hold_binder=="T")
	    	  holdBinder = true;
          
          receipt.setSublistValue({
        	  sublistId: 'item', 
        	  fieldId: 'custcol_diamond_in_hold_binder',
        	  line: xx,
        	  value: holdBinder
        	  });
        }else{
        	receipt.setSublistValue({
          	  sublistId: 'item', 
          	  fieldId: 'itemreceive',
          	  line: xx,
          	  value: false
          	  });;
        }
      }
      var idreceipt = receipt.save({
    	  enableSourcing: true,
    	  ignoreMandatoryFields: true
    	  });
    }

    return {
        getInputData: getInputData,
        reduce: reduce,
        summarize: summarize
    };
});
