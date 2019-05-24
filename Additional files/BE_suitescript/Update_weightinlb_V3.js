/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 June 2017   mjflores    Advanced Solution Team
 * 2.00		  29 June 2017   kilaga		 Line Item Change
 *
*/

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord estimate 
 * 
 * @param {String} 
 * @returns {Void}
 * This function would round of the Reorder Point's value to the nearest hundredth value so that it would stop exceeding the 15-character limit.
 * using the JavaScript function, Math.round() to round off the value. This script could be triggered on Before Submit so that the value gets modified before saving the record: 
 */

function weightRoundOff(){
	try{
		
		var lineItemCount = nlapiGetLineItemCount('item');
		for(var i = 1; i <= lineItemCount; i++){
			var weightinlb = nlapiGetLineItemValue('item', 'weightinlb', i);
			var roundOff = Math.round(weightinlb*100)/100;
			nlapiSetLineItemValue('item', 'weightinlb', i, roundOff);
		}
	
	
	}catch(err){
		if (error.getDetails != undefined){
	           nlapiLogExecution('DEBUG','Process Error',  error.getCode() + ': ' + error.getDetails() + ' : ' + error.message);
	          
		}
		else{
	           nlapiLogExecution('DEBUG','Unexpected Error', error.toString()); 
	         
		}   
		
	}

}