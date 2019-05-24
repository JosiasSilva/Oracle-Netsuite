nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Name : Insurance Total.js
 * Script Type : User Event After Submit
 * Script Author : RaviTeja Thota
 * Created Date : 12/24/2014
 * Last Modified Date : 12/25/2014
 * Comments : This script is going to calculate the Total of all Insurance values in the Line Items Of the Sales Orders ....
 */

function insuranceTotal(type){
	if(type == 'create' || type == 'edit'){
		try{
			var totalInsurance='0.00';
			var recId= nlapiGetRecordId();
			var recType= nlapiGetRecordType();
			var transferRec= nlapiLoadRecord(recType, recId);
			var transferRecLineCount=  transferRec.getLineItemCount('item');
			if(transferRecLineCount != null && transferRecLineCount != ''){
				for(var line=1;line<=transferRecLineCount;line++){
					var lineInsurance= transferRec.getLineItemValue('item','custcol_full_insurance_value', line);
					if(lineInsurance != null && lineInsurance != ''){
						totalInsurance= parseFloat(totalInsurance) + parseFloat(lineInsurance);
					}
				}
			}
			nlapiLogExecution('debug','total insurance value is',totalInsurance);
			transferRec.setFieldValue('custbody_insurance_total',parseFloat(totalInsurance).toFixed(2));
			var transferRecId= nlapiSubmitRecord(transferRec,false,false);
			nlapiLogExecution('debug','transferRecId is',transferRecId);
		}catch(e){
			nlapiLogExecution('error','exception in the Code is ',e);
		}
	}
  
}
