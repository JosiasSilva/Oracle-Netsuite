/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Dec 2014     Apoorva
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
function userEventAfterSubmitFullInsurance(type){
	if ((type == 'edit' ) || (type == 'create') || (type == 'xedit' )){
		try{
		//getting the transfer order after submit...
		var tranOrderId= nlapiGetRecordId();
		var tranOrderType = nlapiGetRecordType();
		var tranOrderRec = nlapiLoadRecord(tranOrderType, tranOrderId);
		var insuranceValue = '0.0';
		
		var countLine = tranOrderRec.getLineItemCount('item');
		if(countLine != null && countLine != ''){
			
		
		for(var i=0; i < countLine.length; i++){
	
			var insuranceValue =tranOrderRec.getLineItemValue('item', 'custcol_full_insurance_value','i');
				if(insuranceValue != null && insuranceValue != ''){
					insuranceValue = insuranceValue + Number(countLine[i]);
							nlapiLogExecution('debug', 'total', total);
				}
					}
						}
				tranOrderRec.setFieldValue('custbody_insurance_total', insuranceValue);
					nlapiLogExecution('debug', 'full-insurance', insuranceValue);
						var tranOrdSubmit = nlapiSubmitRecord(tranOrderRec, true, true);
							nlapiLogExecution('debug', 'TransferOrder:', tranOrdSubmit);
		}
		catch(e){
			lapiLogExecution('error','exception in the Code is: ',e);	
		}
		}
  
}
