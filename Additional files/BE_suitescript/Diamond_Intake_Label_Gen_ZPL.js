function Print_Cert_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_print_diamond_cert","customdeploy_print_diamond_cert");
				url+= "&item=" + nlapiGetRecordId();
				
			form.addButton("custpage_print_cert","Print Certificate Label","var newWin = window.open('" + url + "','printCertWin','height=400,width=400'); setTimeout(function(){ newWin.close(); }, 8500);");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print Cert Label Button","Details: " + err.message);
		}
	}
}

function Gen_Diamond_Intake_Label_SL(request,response)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("item",null,"is",request.getParameter("item")));
	var cols = [];
	cols.push(new nlobjSearchColumn("trandate").setSort(true));
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("entity"));
	cols.push(new nlobjSearchColumn("firstname","customer"));
	cols.push(new nlobjSearchColumn("lastname","customer"));
	cols.push(new nlobjSearchColumn("custbody110"));
	cols.push(new nlobjSearchColumn("custbody39"));
	cols.push(new nlobjSearchColumn("itemid","item"));
	cols.push(new nlobjSearchColumn("custitem27","item"));
	cols.push(new nlobjSearchColumn("custitem5","item"));
	cols.push(new nlobjSearchColumn("custitem7","item"));
	cols.push(new nlobjSearchColumn("custitem19","item"));
	cols.push(new nlobjSearchColumn("custitem46","item"));
	cols.push(new nlobjSearchColumn("othervendor","item"));
	var results = nlapiSearchRecord("salesorder",null,filters,cols);
	if(results)
	{
		var zpl = '';
			zpl+= '^XA\n';
			zpl+= '^FX\n';
			zpl+= '^CF0,30\n';
			zpl+= '^FO20,55^FD' + results[0].getValue("tranid") + '^FS\n';
			zpl+= '^FO20,100^FD' + results[0].getValue("firstname","customer") + " " + results[0].getValue("lastname","customer") + '^FS\n';
      		zpl+= '^CFF,30\n';
			zpl+= '^FO20,140^FD' + results[0].getValue("custitem27","item") + ", " + results[0].getText("custitem5","item") + ", " + results[0].getText("custitem7","item") + ", " + results[0].getText("custitem19","item") + '^FS\n';
			zpl+= '^FO20,180^FD' + results[0].getText("othervendor","item") + '^FS\n';
			zpl+= '^FO20,220^FD' + results[0].getValue("custbody110") + '^FS\n';
			if(results[0].getValue("custbody39")!=null && results[0].getValue("custbody39")!="")
				zpl+= '^FO20,260^FDDrop Ship^FS\n';
			zpl+= '^CFA,15\n';
			zpl+= '^FX\n';
			zpl+= '^BY2,5,75\n';
			zpl+= '^FO40,300^BC^FD' + results[0].getValue("custitem46","item") + "^FS\n";
			zpl+= '\n';
			zpl+= '^XZ';
			
		//Save file for debugging purposes only
		var zplFile = nlapiCreateFile(results[0].getValue("itemid","item") + ".zpl","PLAINTEXT",zpl);
		//zplFile.setFolder("10842471");
		//nlapiSubmitFile(zplFile);
		
		//Write file back to user so they can open and print
		response.setContentType("PLAINTEXT",results[0].getValue("itemid","item")+".zpl","attachment");
		response.write("<script>this.close();</script>");
		response.write(zplFile.getValue());
	}
	else
	{
		//If no SO on CDP, use Memo stone label 
		var filters1 = [];
		filters1.push(new nlobjSearchFilter("internalid",null,"is",request.getParameter("item")));
		var cols1 = [];
		cols1.push(new nlobjSearchColumn("itemid"));
		cols1.push(new nlobjSearchColumn("custitem27"));
		cols1.push(new nlobjSearchColumn("custitem5"));
		cols1.push(new nlobjSearchColumn("custitem7"));
		cols1.push(new nlobjSearchColumn("custitem19"));
		cols1.push(new nlobjSearchColumn("custitem46"));
		cols1.push(new nlobjSearchColumn("othervendor"));
		var results1 = nlapiSearchRecord("item",null,filters1,cols1);
		if(results1)
		{
			var zpl = '';
			zpl+= '^XA\n';
			zpl+= '^CFF,35\n';
			zpl+= '^FO20,80^FD' + results1[0].getValue("itemid") + '^FS\n';
			zpl+= '^FO20,140^FD' + results1[0].getValue("custitem27") + ", " + results1[0].getText("custitem5") + ", " + results1[0].getText("custitem7") + ", " + results1[0].getText("custitem19") + '^FS\n';
			zpl+= '^FO20,210^FD' + results1[0].getText("othervendor") + '^FS\n';
			zpl+= '^BC80,75\n';
			zpl+= '^FO40,280^BC^FD' + results1[0].getValue("custitem46") + "^FS\n";
			zpl+= '^XZ';
			
			//Save file for debugging purposes only
			var zplFile = nlapiCreateFile(results1[0].getValue("itemid") + ".zpl","PLAINTEXT",zpl);
			//zplFile.setFolder("10842471");
			//nlapiSubmitFile(zplFile);
			
			//Write file back to user so they can open and print
			response.setContentType("PLAINTEXT",results1[0].getValue("itemid")+".zpl","attachment");
			response.write("<script>this.close();</script>");
			response.write(zplFile.getValue());
		}
	}
}
