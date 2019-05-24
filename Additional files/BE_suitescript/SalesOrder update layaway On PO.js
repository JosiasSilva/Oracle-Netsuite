/**
 * Script Author : Rahul Panchal (rahul.panchal@inoday.com/rahul.panchal186@gmail.com)
 * Author Desig. : Netsuite Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (User Event Script)
 * Script Name   : 
 * Created Date  : September 01, 2017
 * Last Modified Date : 
 * Comments : 
 * SS URL : 
 * Script URL: /app/common/scripting/script.nl?id=2111&whence= 
 */


function update_layaway_on_PO(type){
	try{
		var soId=nlapiGetRecordId();
		var layaway_chk=nlapiLookupField('salesorder',soId,'custbody111');		
		if (type == "approve"){
			if(layaway_chk=='T'){
				setLayaway(soId);   }			
		}
		else if(type == "edit"){
			if(layaway_chk=='T'){				
				setLayaway(soId); }
		}
	}
	catch(ex){
		nlapiLogExecution("debug","Error Occuring while updating layaway field on PO from SO",ex.message);
	}
}

function setLayaway(soId){
	var layaway_chk=nlapiLookupField('salesorder',soId,'custbody111');
	if(layaway_chk=='T'){
		var filter = [];
		var column = [];	
		filter.push(new nlobjSearchFilter('internalid', null, 'is', soId));		
		filter.push(new nlobjSearchFilter('mainline', null, 'is', 'F'));      
		column.push(new nlobjSearchColumn('purchaseorder',null,'group'));              
		var PO_Result = nlapiSearchRecord('salesorder',null,filter,column);
		if(PO_Result){
		  var col = PO_Result[0].getAllColumns();
		  for(var p=0;p<PO_Result.length;p++){
			 var  po_id=PO_Result[p].getValue(col[0]); 
			 if(po_id){						 
					nlapiSubmitField('purchaseorder',po_id,'custbody111','T');	}
			}                  
		}
	}
}