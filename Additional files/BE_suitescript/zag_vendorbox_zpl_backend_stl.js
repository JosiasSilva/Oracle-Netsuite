/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/record'],

function(https,record) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	var response = context.response;
    	var request = context.request;
    	var data = context.request.body;
    	var param = request.parameters;
    	var itemFound = false;
    	if(data){
        data = JSON.parse(data);
        var Operation = data.operation;

        /*Update Items of PO*/
        if(Operation = 'Update'){
	        var PO_InternalId = data.poId;

	        var arrItems = data.itemIds;

	        if((PO_InternalId) && (arrItems.length > 0)){
		        var objPoRecord = record.load({
		        	type: record.Type.PURCHASE_ORDER,
		        	id: PO_InternalId,
		        	isDynamic: true
		        	});
		        
		        var subItemLn = objPoRecord.getLineCount({sublistId: 'item'});
		     
		        for(var i = 0; i < arrItems.length; i++){
		        	var itemId = arrItems[i];
		        	//loop through line items to update the status
			        for(var itemLine = 0; itemLine < subItemLn; itemLine++){
			        	
			        	objPoRecord.selectLine({sublistId: 'item', line: itemLine });
			        	
			        	var subItemValue = objPoRecord.getCurrentSublistValue({
			        		sublistId: 'item',
			        		fieldId: 'item'
			        		});
			        	var subVbdStatus = objPoRecord.getCurrentSublistValue({
			        		sublistId: 'item',
			        		fieldId: 'custcol_vbd_status'
			        		});

			        	//if the item found with status Not Started then update the status to In Progress
			        	if(subItemValue == itemId && subVbdStatus == 1){
			        		objPoRecord.setCurrentSublistValue({
				        		sublistId: 'item',
				        		fieldId: 'custcol_vbd_status',
				        		value: 2	
				        		});
			        		objPoRecord.commitLine({sublistId : 'item'});
			        		itemFound = true;
			        		//log.audit('Item Found', 'itemId : ' + itemId + ' : Line#' + itemLine)
			        	}
			        }
		        }
		      
		       if(itemFound)
		       		var recId = objPoRecord.save({ignoreMandatoryFields: true});
		        
		        if(itemFound && recId)
		        	log.audit('Record Updated','Record has been Updated with Internal Id : ' + recId);
              else
                log.audit('Record could not be updated.','PO Internal Id :' + PO_InternalId);
		        /*End of Update PO Items*/
	        }
        }
    }
  }
    return {
        onRequest: onRequest
    };
    
});
