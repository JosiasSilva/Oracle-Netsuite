/**
 * Script Author : Ajay kumar (ajay@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : GenerateItemReceiptOfPO.js
 * Created Date  : June 07, 2016
 * Last Modified Date : June 07, 2016
 * Comments : Script will create Button 'Generate Item Receipt of PO' and on submit it created item receipt of PO......
 * Script URL : https://system.netsuite.com/app/common/scripting/script.nl?id=1016
 * Button URL : https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=1016&deploy=1
 * Save Search URL : https://system.netsuite.com/app/common/search/searchresults.nl?searchid=5248
 */

//Create a Suitelet Script that generate an Item Receipt
/*function GenerateItemReceipt(request,response)
{
	var form = nlapiCreateForm("Create Item Receipt of POs for Guild and Facet");
	if(request.getMethod()=="GET")
	{
		try
		{
			nlapiLogExecution("debug","GET Method Invoked ", form);
			form.addSubmitButton("Create Item Receipt");			
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error occur during creation of Item Receipt form ","Details: " + err.message);
			return false;
		}
	}
	else
	{
		try
		{
			//Capture File Information
			nlapiLogExecution("debug","POST Method Invoked ", form);			
			var mySearch = nlapiLoadSearch(null,5248); //Save search id of POs list
			var searchresult = [];
			var resultset = mySearch.runSearch();
			var searchid = 0;
			do {
				var resultslice = resultset.getResults( searchid, searchid+1000 );
				if (resultslice !=null && resultslice !='') 
				{	
					for (var rs in resultslice) 
					{
						searchresult.push(resultslice[rs]);                
						searchid++;
					   
					} 
				}
			} while (resultslice.length >= 1000);			
			var searchCount1=searchresult.length;   
                        nlapiLogExecution("debug"," Length : "+ searchCount1, searchCount1);	   
			if (searchresult && searchCount1>0) 
			{                              
				for( var m = 0; m < searchresult.length; m++) 
				{
					var Results = searchresult[m].getAllColumns();
					var Id = searchresult[m].getId();
					CreateItemReceiptOfPO(Id);
				}
			}
			var formSavedLabel = form.addField('custpage_form_saved', 'inlinehtml');
			formSavedLabel.setDefaultValue("<html><body><span style=\"font-size:30px;color:green;\">Item Receipt has been created of related POs.</span></body></html>");
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Generate Item Receipt POST Error","Details: " + err.message);
		}
	}
}

function CreateItemReceiptOfPO(Id)
{
	try
	{		
		var poFields = ["custbody_receive_po","custbody_create_ir"];
		var poFieldsVal = nlapiLookupField("purchaseorder",Id,poFields);
		var receive_po = poFieldsVal.custbody_receive_po;
		var create_ir = poFieldsVal.custbody_create_ir;
		nlapiLogExecution("debug","Receive PO value is : ",receive_po);
		nlapiLogExecution("debug","Create IR value is : ",create_ir);
		if(receive_po == 'T' && create_ir == 'F')
		{
			var receipt = nlapiTransformRecord("purchaseorder",Id,"itemreceipt");
			for(var x=0; x < receipt.getLineItemCount("item"); x++)
			{
				receipt.setLineItemValue("item","itemreceive",x+1,"T");
			}
			var irId = nlapiSubmitRecord(receipt,true,true);
                        if(irId > 0)
                       {
                             nlapiSubmitField("purchaseorder",Id,"custbody_create_ir",'T');		
			    //response.sendRedirect("RECORD","itemreceipt",irId);
                            nlapiLogExecution("debug","Created Item Receipt Id is : ", irId);
                       }
		}				
	}
	catch(ex)
	{
		nlapiLogExecution("debug","Error occur during generation of an Item Receipt of PO id : " + Id + " is : ",ex.message);
	}
}*/

//Suitelet that call Schedule Script
function GenerateItemReceipt(request, response)
{
	var form = nlapiCreateForm('Create Item Receipt of POs for Guild and Facet');		
	if ( request.getMethod() == 'GET' )
	{		
		form.addSubmitButton("Create Item Receipt");			
		response.writePage( form );
	}
	else if(request.getMethod() == 'POST')
	{
                var params = new Array();
                params['custscript_savedsearch_id1'] = 5248;
		var result = nlapiScheduleScript('customscript1109', 'customdeploy1',params);  // 1054 is internal id of the scheduled script that you wish to reschedule and 1 is deployment id
		nlapiLogExecution("debug","Result is :",result);
		var formSavedLabel = null;
		if(result == 'QUEUED')
		{
			formSavedLabel = form.addField('custpage_form_saved', 'inlinehtml');
			formSavedLabel.setDefaultValue("<html><body><span style=\"font-size:30px;color:green;\">Item receipts are creating for Guild and Facet.</span></body></html>");
			response.writePage(form);
		}
		else if(result == 'INQUEUE')
		{
			formSavedLabel = form.addField('custpage_form_saved', 'inlinehtml');
			formSavedLabel.setDefaultValue("<html><body><span style=\"font-size:30px;color:green;\">Item receipts are creating for Guild and Facet.</span></body></html>");
			response.writePage(form);
		}
    }
}
