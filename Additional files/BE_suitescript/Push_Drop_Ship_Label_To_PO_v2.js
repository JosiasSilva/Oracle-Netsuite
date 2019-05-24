function Push_Drop_Ship_Label_To_PO_Button(type)
{
	if(type=="view")
	{
		try
		{
			var label = nlapiGetFieldValue("custbody_fedex_shipping_label");
			
			if(label!=null && label!="")
			{
				//Check if a drop ship
				var dropShip = nlapiGetFieldValue("custbody39");
				
				if(dropShip!=null && dropShip!="")
				{
					var url = nlapiResolveURL("SUITELET","customscript_push_label_to_po","customdeploy_push_label_to_po");
					url += "&ifid=" + nlapiGetRecordId() + "&fileid=" + label + "&orderid=" + nlapiGetFieldValue("createdfrom");
					
					form.addButton("custpage_push_label_to_po","Push Label to PO","window.location.href='" + url + "';");
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Button to Push Label to PO","Details: " + err.message);
		}
	}
}

function Push_Drop_Ship_Label_To_PO(request,response)
{
	var ifId = request.getParameter("ifid");
	var fileId = request.getParameter("fileid");
	nlapiLogExecution('debug','File ID',fileId);
	var orderId = request.getParameter("orderid");
	
	//Find drop ship PO
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",orderId));
	filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
	filters.push(new nlobjSearchFilter("applyingtransaction",null,"is",ifId));
	filters.push(new nlobjSearchFilter("custbody39","purchaseorder","isnotempty"));
	var cols = [];
	cols.push(new nlobjSearchColumn("purchaseorder"));
	cols.push(new nlobjSearchColumn("mainname","purchaseorder"));
	var results = nlapiSearchRecord("salesorder",null,filters,cols);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			nlapiLogExecution("debug","Purchase Order ID",results[x].getValue("purchaseorder"));
			
			//Verify vendor is a production vendor
			var vendor = results[x].getValue("mainname","purchaseorder");
			nlapiLogExecution("debug","Main Name",vendor);
			
			var isProd = nlapiLookupField("vendor",vendor,"custentity4");
			nlapiLogExecution("debug","Type of Contact",isProd);
			
			if(isProd=="6")
			{
				nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody_fedex_shipping_label",fileId);
				break;
			}
		}
		
	}
	
	//Redirect user back to IF
	response.sendRedirect("RECORD","itemfulfillment",ifId);
}
