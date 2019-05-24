function Print_Sales_Order_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_sales_order_label_zpl","customdeploy_sales_order_label_zpl");
				url+= "&soid=" + nlapiGetRecordId();
				
			form.addButton("custpage_print_salesorder_label","SO Label","var newWin = window.open('" + url + "','printPOLblWin','height=400,width=400'); setTimeout(function(){ newWin.close(); }, 2500);");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print PO Label Button","Details: " + err.message);
		}
	}
}

function gen_salesorder_ZPL_label_SL(request,response)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",request.getParameter("soid")));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("trandate"));
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("entity"));
	cols.push(new nlobjSearchColumn("mainname"));
	cols.push(new nlobjSearchColumn("custbody6"));
	cols.push(new nlobjSearchColumn("custbody110"));
	cols.push(new nlobjSearchColumn("custbody111"));
	cols.push(new nlobjSearchColumn("custbody194"));
	cols.push(new nlobjSearchColumn("custbody348"));
    cols.push(new nlobjSearchColumn("custbody_international_shipping"));
    cols.push(new nlobjSearchColumn("custbody319"));
	cols.push(new nlobjSearchColumn("createdfrom"));
	cols.push(new nlobjSearchColumn("custbody140"));
    //cols.push(new nlobjSearchColumn("lastname","entity"));
    //cols.push(new nlobjSearchColumn("firstname","entity"));
	var results = nlapiSearchRecord("salesorder",null,filters,cols);
	if(results)
	{
			
		var customerName = results[0].getText("entity");
		customerName = customerName.substr(customerName.indexOf(" ") + 1);

		
		var zpl = '';
			zpl+= '^XA\n';
			zpl+= '^CF0,40\n';
			zpl+= '^FO20,120^FD' + results[0].getValue("tranid") + '^FS\n';
            zpl+= '^FO20,60^FD' + customerName +'^FS\n';
            zpl+= '^BY1,1,60'
            zpl+= '^FO80,260^BC^FD' + results[0].getValue("tranid") + '^FS\n';
			zpl+= '^XZ';
			
		//Save file for debugging purposes only
		var zplFile = nlapiCreateFile(results[0].getValue("tranid") + ".zpl","PLAINTEXT",zpl);
		
		//Write file back to user so they can open and print
		response.setContentType("PLAINTEXT",results[0].getValue("tranid")+".zpl","attachment");
		response.write("<script>this.close();</script>");
		response.write(zplFile.getValue());
	}
}
