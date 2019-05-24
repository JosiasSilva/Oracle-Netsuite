nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 *Script Name : TO Receive Button.js
 *Script Type : User Event Before Load
 *Script Author : Ravi Teja Thota
 *Created Date :  12/24/2014
 *Last modified Date : 12/24/2014
 *Comments : To create New Receive Button and New Fulfillment Button on Transfer Order ...........................
 *
 */

function Fulfill_Receive_Button(type,form){
	if(type=="view"){
		try{
			var toID = nlapiGetRecordId();
			var toType= nlapiGetRecordType();
			var toRec= nlapiLoadRecord(toType,toID);
			var status = toRec.getFieldValue("orderstatus");
			
			if(status == "F"){
				var url = nlapiResolveURL("SUITELET","customscript_create_transactions","customdeploy_create_transactions_dep");
				url += "&record=" + toID;
				url += "&status=" + status;
				form.addButton("custpage_receive","Receive All","window.location.href='"+url+"';");
			}
			
			if(status == "B"){
				var url = nlapiResolveURL("SUITELET","customscript_create_transactions","customdeploy_create_transactions_dep");
				url += "&record=" + toID;
				url += "&status=" + status;
				form.addButton("custpage_fulfill","Fulfill All","window.location.href='"+url+"';");
			}
		
		}
		catch(err){
			nlapiLogExecution("error","Error Showing Receive Button","Details: " + err.message);
			return true;
		}
	}
}
