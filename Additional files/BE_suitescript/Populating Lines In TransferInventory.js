nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Jun 2015     Siva Kalyan
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmit(type){
	try{
	if(type=='edit'){
	var type=nlapiGetRecordType();
	var id=nlapiGetRecordId();
	var itemsWithduplicates=new Array();
	var itemQuantityduplicates=new Array();
	var itemWithoutduplicates=new Array();
	var itemquantitywithoutDuplicates=new Array();
	
	
	// Loading Item Receipt to get Transfer Id 
	var rec_obj=nlapiLoadRecord(type, id);
	var transferId=rec_obj.getFieldValue('custbody_inventory_transfer');
	nlapiLogExecution('debug', 'Transfer Id is', transferId);
	if(transferId){
		var filters=new Array();
		filters[0]= new nlobjSearchFilter('custbody_inventory_transfer', null, 'anyof', transferId);
		filters[1]= new nlobjSearchFilter('mainline', null, 'is', 'T');
		var searchObj=nlapiSearchRecord('itemreceipt', null, filters, null);
		nlapiLogExecution('debug', 'searchObj is', searchObj);
		if(searchObj){
			for(var len=0;len<searchObj.length;len++){
				nlapiLogExecution('debug', 'Intarenal id is', searchObj[len].getId());
				var relatedObj=nlapiLoadRecord(searchObj[len].getRecordType(), searchObj[len].getId());
				var count=relatedObj.getLineItemCount('item');
				nlapiLogExecution('debug', 'No of lines are', count);
				for(var noofline=1;noofline<=count;noofline++){
					// Storing all items for Corresponding Item Receipt.  
					itemsWithduplicates[itemsWithduplicates.length]=relatedObj.getLineItemValue('item', 'custcolitem_link', noofline);
					itemQuantityduplicates[itemQuantityduplicates.length]=relatedObj.getLineItemValue('item', 'quantity', noofline);
				}
				
			}
			
			nlapiLogExecution('debug', 'item with duplicates are', itemsWithduplicates);
			nlapiLogExecution('debug', 'Item Quantity with duplicates ', itemQuantityduplicates);
			// Removing duplications from Items array
			if(itemsWithduplicates.length>0){
				
				itemWithoutduplicates=itemsWithduplicates.filter(function(item, pos) {
					return itemsWithduplicates.indexOf(item) == pos;
				});
				
				nlapiLogExecution('debug', 'item without duplicates are', itemWithoutduplicates);
				
				for(var list=0;list<itemWithoutduplicates.length;list++){
					var qty=parseInt(0);
					for(var duplicateList=0;duplicateList<itemsWithduplicates.length;duplicateList++){
						if(itemWithoutduplicates[list]==itemsWithduplicates[duplicateList]){
							qty=qty+parseFloat(itemQuantityduplicates[duplicateList]);
						}
						
					}
					itemquantitywithoutDuplicates[list]=qty;
				}// End of ItemWithoutDuplicate for loop 
				
				
				nlapiLogExecution('debug', 'item Quantity without duplicates are', itemquantitywithoutDuplicates);
				
				
				// Adding the lines to Item Receipt 
				var itemreciptObj=nlapiLoadRecord('inventorytransfer', transferId);
				var itemreciptcount=itemreciptObj.getLineItemCount('inventory');
				
				for(var reciptline=itemreciptcount;reciptline>0;reciptline--){
					// Removing the all the lines in Transfer Inventory
					itemreciptObj.removeLineItem('inventory', reciptline);
				}
				
				// Adding line to Item Receipt
				for(var newline=0;newline<itemWithoutduplicates.length;newline++){
					itemreciptObj.setLineItemValue('inventory', 'item', newline+1, itemWithoutduplicates[newline]);
					itemreciptObj.setLineItemValue('inventory', 'adjustqtyby', newline+1, itemquantitywithoutDuplicates[newline]);
				}
				
				var adjTransferId=nlapiSubmitRecord(itemreciptObj, true, true);
				nlapiLogExecution('debug', 'adjTransferId is ', adjTransferId);
			}
		}
	}
	}
	}catch(e){
		nlapiLogExecution('Error', 'There is an error occured ', e);
	}
}





function userEventBeforeSubmit(type){
	if(type=='delete'){
		var type=nlapiGetRecordType();
		var id=nlapiGetRecordId();
		var itemsWithduplicates=new Array();
		var itemQuantityduplicates=new Array();
		var itemWithoutduplicates=new Array();
		var itemquantitywithoutDuplicates=new Array();
		
		
		// Loading Item Receipt to get Transfer Id 
		//var rec_obj=nlapiLoadRecord(type, id);
		var transferId=nlapiGetFieldValue('custbody_inventory_transfer');
		nlapiLogExecution('debug', 'Transfer Id is', transferId);
		if(transferId){
			var filters=new Array();
			filters[0]= new nlobjSearchFilter('custbody_inventory_transfer', null, 'anyof', transferId);
			filters[1]= new nlobjSearchFilter('mainline', null, 'is', 'T');
			var searchObj=nlapiSearchRecord('itemreceipt', null, filters, null);
			nlapiLogExecution('debug', 'searchObj is', searchObj);
			if(searchObj){
				if(searchObj.length==1){
					nlapiDeleteRecord('inventorytransfer', transferId);
					return;
				}else{
					for(var len=0;len<searchObj.length;len++){
						nlapiLogExecution('debug', 'Intarenal id is', searchObj[len].getId());
						if(searchObj[len].getId() && searchObj[len].getId()!= nlapiGetRecordId()){
						var relatedObj=nlapiLoadRecord(searchObj[len].getRecordType(), searchObj[len].getId());
						var count=relatedObj.getLineItemCount('item');
						nlapiLogExecution('debug', 'No of lines are', count);
						for(var noofline=1;noofline<=count;noofline++){
							// Storing all items for Corresponding Item Receipt.  
							itemsWithduplicates[itemsWithduplicates.length]=relatedObj.getLineItemValue('item', 'custcolitem_link', noofline);
							itemQuantityduplicates[itemQuantityduplicates.length]=relatedObj.getLineItemValue('item', 'quantity', noofline);
						}// End of item cout for loop 
					}
					}// End of search for loop 

				}
								
				nlapiLogExecution('debug', 'item with duplicates are', itemsWithduplicates);
				nlapiLogExecution('debug', 'Item Quantity with duplicates ', itemQuantityduplicates);
				// Removing duplications from Items array
				if(itemsWithduplicates.length>0){
					
					itemWithoutduplicates=itemsWithduplicates.filter(function(item, pos) {
						return itemsWithduplicates.indexOf(item) == pos;
					});
					
					nlapiLogExecution('debug', 'item without duplicates are', itemWithoutduplicates);
					
					for(var list=0;list<itemWithoutduplicates.length;list++){
						var qty=parseInt(0);
						for(var duplicateList=0;duplicateList<itemsWithduplicates.length;duplicateList++){
							if(itemWithoutduplicates[list]==itemsWithduplicates[duplicateList]){
								qty=qty+parseFloat(itemQuantityduplicates[duplicateList]);
							}
							
						}
						itemquantitywithoutDuplicates[list]=qty;
					}// End of ItemWithoutDuplicate for loop 
					
					
					nlapiLogExecution('debug', 'item Quantity without duplicates are', itemquantitywithoutDuplicates);
					
					
					// Adding the lines to Item Receipt 
					var itemreciptObj=nlapiLoadRecord('inventorytransfer', transferId);
					var itemreciptcount=itemreciptObj.getLineItemCount('inventory');
					
					for(var reciptline=itemreciptcount;reciptline>0;reciptline--){
						// Removing the all the lines in Transfer Inventory
						itemreciptObj.removeLineItem('inventory', reciptline);
					}
					
					// Adding line to Item Receipt
					for(var newline=0;newline<itemWithoutduplicates.length;newline++){
						itemreciptObj.setLineItemValue('inventory', 'item', newline+1, itemWithoutduplicates[newline]);
						itemreciptObj.setLineItemValue('inventory', 'adjustqtyby', newline+1, itemquantitywithoutDuplicates[newline]);
					}
					
					var adjTransferId=nlapiSubmitRecord(itemreciptObj, true, true);
					nlapiLogExecution('debug', 'adjTransferId is ', adjTransferId);
				}
			}
		}
		
		
	}
	 
}



