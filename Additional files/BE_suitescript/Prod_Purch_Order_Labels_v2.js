function Print_Prod_PO_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_print_po_label","customdeploy_print_po_label");
				url+= "&poid=" + nlapiGetRecordId();
				
			form.addButton("custpage_print_po_label","PO Label","var newWin = window.open('" + url + "','printPOLblWin','height=400,width=400'); setTimeout(function(){ newWin.close(); }, 2500);");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print PO Label Button","Details: " + err.message);
		}
	}
}

function Gen_Prod_PO_Label_SL(request,response)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",request.getParameter("poid")));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("trandate"));
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("entity"));
	cols.push(new nlobjSearchColumn("mainname"));
	cols.push(new nlobjSearchColumn("custbody6","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody110","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody129"));
	cols.push(new nlobjSearchColumn("custbody111","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody194","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody348","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody82","createdfrom"));
	cols.push(new nlobjSearchColumn("createdfrom"));
	cols.push(new nlobjSearchColumn("tranid","createdfrom"));
	cols.push(new nlobjSearchColumn("entity","createdfrom"));
	var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
	if(results)
	{
		var prodPOCount = 0;
		
		nlapiLogExecution("debug","Sales Order",results[0].getValue("createdfrom"));
		
		var filters1 = [];
		filters1.push(new nlobjSearchFilter("createdfrom",null,"is",results[0].getValue("createdfrom")));
		filters1.push(new nlobjSearchFilter("mainline",null,"is","T"));
		filters1.push(new nlobjSearchFilter("custentity4","vendor","is","6")); //Type of Contact = Production Vendor/Jeweler
		var cols1 = [];
		cols1.push(new nlobjSearchColumn("internalid",null,"count"));
		var results1 = nlapiSearchRecord("purchaseorder",null,filters1,cols1);
		if(results1)
		{
			var poCount = results1[0].getValue("internalid",null,"count");
			nlapiLogExecution("debug","Production PO's Associated With Sales Order",poCount);
			
			if(poCount!=null && poCount!="")
				prodPOCount = poCount;
		}
		
		var deliveryInstructions = results[0].getValue("custbody194","createdfrom");
		nlapiLogExecution("debug","Delivery Instructions",deliveryInstructions);
		var displayDiMessage = false;
		if(deliveryInstructions!=null && deliveryInstructions!="")
		{
			if(deliveryInstructions.indexOf(",")!=-1)
			{
				deliveryInstructions = deliveryInstructions.split(",");
				for(var x=0; x < deliveryInstructions.length; x++)
				{
					if(deliveryInstructions[x]=="2" || deliveryInstructions[x]=="3")
						displayDiMessage = true;
				}
			}
			else
			{
				if(deliveryInstructions=="2" || deliveryInstructions=="3")
						displayDiMessage = true;
			}
		}
		
		var prodPOCountMsg = "";
		if(prodPOCount > 1)
			prodPOCountMsg = "1 of " + prodPOCount;
			
		//If BE Engraving Status = Engraving Needed, print 'E'
		var beEngravingStatus = "";
		if(results[0].getValue("custbody348","createdfrom")=="1")
			beEngravingStatus = "E";
			
		var customerName = results[0].getText("entity","createdfrom");
		customerName = customerName.substr(customerName.lastIndexOf(" ") + 1);
		
		var tbwMessage = "";
		if(results[0].getValue("custbody129")=="T")
			tbwMessage = "TBW";
		
		var zpl = '';
			zpl+= '^XA\n';
            zpl+= '^CFF,20\n';
            zpl+= '^FO20,20^FD' + prodPOCountMsg + '^FS\n';
            zpl+= '^CF0,60\n';
            zpl+= '^FO360,20^FD'+ beEngravingStatus + '^FS\n';
			zpl+= '^CF0,40\n';
			zpl+= '^FO20,60^FD' + results[0].getValue("tranid","createdfrom") + '^FS\n';
			zpl+= '^FO20,100^FD' + customerName + '^FS\n';
            zpl+= '^FO320,140^FD' + tbwMessage + '^FS\n';
			zpl+= '^CFF,20\n';
			zpl+= '^FO20,140^FDPO #' + results[0].getValue("tranid") + '^FS\n';
			zpl+= '^FO20,180^FD' + results[0].getText("mainname") + '^FS\n';
			zpl+= '^FO20,220^FDDD:' + results[0].getValue("custbody6","createdfrom") + '^FS\n';
            if(results[0].getValue("custbody82","createdfrom")=="T")
				zpl+= '^FO250,220^FDFIRM^FS\n';
			zpl+= '^FO20,260^FDDTS:' + results[0].getValue("custbody110","createdfrom") + '^FS\n';
			if(results[0].getValue("custbody111","createdfrom")=="T")
				zpl+= '^FO20,300^FDLAYAWAY^FS\n';
			if(displayDiMessage==true)
				zpl+= '^FO190,300^FDDD SPEC DATE^FS\n';
            zpl+= '^BY2,2,50\n';
            zpl+= '^FO100,330^BC^FD' + results[0].getValue("tranid") + '^FS\n';
			zpl+= '^XZ';
			
		//Save file for debugging purposes only
		var zplFile = nlapiCreateFile(results[0].getValue("tranid") + ".zpl","PLAINTEXT",zpl);
		
		//Write file back to user so they can open and print
		response.setContentType("PLAINTEXT",results[0].getValue("tranid")+".zpl","attachment");
		response.write("<script>this.close();</script>");
		response.write(zplFile.getValue());
	}
}
