function Print_DiaFlute_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_print_diamond_flute","customdeploy_print_diamond_flute");
				url+= "&item=" + nlapiGetRecordId();
				
			form.addButton("custpage_print_dia_flute","Print Diamond Flute Label Label","var newWin = window.open('" + url + "','printFluteWin','height=400,width=400'); setTimeout(function(){ newWin.close(); }, 10000);");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print Diamond Flute Label Button","Details: " + err.message);
		}
	}
}

function Gen_Diamond_Flute_Label_SL(request,response)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",request.getParameter("item")));
	var cols = [];
	cols.push(new nlobjSearchColumn("itemid"));
	cols.push(new nlobjSearchColumn("custitem46"));
	cols.push(new nlobjSearchColumn("custitem27"));
	cols.push(new nlobjSearchColumn("custitem5"));
	cols.push(new nlobjSearchColumn("custitem7"));
	cols.push(new nlobjSearchColumn("custitem19"));
	cols.push(new nlobjSearchColumn("custitem37"));
	cols.push(new nlobjSearchColumn("custitem33"));
	cols.push(new nlobjSearchColumn("custitem28"));
	cols.push(new nlobjSearchColumn("custitem34"));
	cols.push(new nlobjSearchColumn("custitem18"));
	cols.push(new nlobjSearchColumn("custitem30"));
	var results = nlapiSearchRecord("item",null,filters,cols);
	if(results)
	{
		var zpl = '';
			zpl+= '^XA\n';
			zpl+= '^FX\n';
			zpl+= '^CF0,30\n';
			zpl+= '^FO20,155^FDBE: ' + results[0].getValue("itemid") + '^FS\n';
			zpl+= '^FO20,190^FDCert: ' + results[0].getValue("custitem46") + '^FS\n';
			zpl+= '^FO20,225^FD' + results[0].getValue("custitem27") + ' Carat, ' + results[0].getText("custitem5") + '^FS\n';
      		zpl+= '^CFA,20\n';
			zpl+= '^FO20,260^FD' + results[0].getText("custitem7") + ", " + results[0].getText("custitem19") + '^FS\n';
			zpl+= '^FO20,280^FDFluorescence: ' + results[0].getValue("custitem37") + '^FS\n';
			zpl+= '^FO20,300^FDPolish: ' + results[0].getValue("custitem33") + '^FS\n';
			zpl+= '^FO20,320^FDCut: ' + results[0].getText("custitem28") + '^FS\n';
			zpl+= '^FO20,340^FDSymmetry: ' + results[0].getValue("custitem34") + '^FS\n';
			zpl+= '^FO20,360^FDOrigin: ' + results[0].getText("custitem18") + '^FS\n';
			zpl+= '^FO20,380^FD' + results[0].getValue("custitem30") + '^FS\n';
			zpl+= '^CFA,15\n';
			zpl+= '^FX\n';
			zpl+= '^BY2,5,75\n';
			zpl+= '\n';
			zpl+= '^XZ';
			
		//Save file for debugging purposes only
		var zplFile = nlapiCreateFile(results[0].getValue("itemid") + ".zpl","PLAINTEXT",zpl);
		
		//Write file back to user so they can open and print
		response.setContentType("PLAINTEXT",results[0].getValue("itemid")+".zpl","attachment");
		response.write(zplFile.getValue());
	}
}
