function Print_Item_Label_Button(type,form)
{
	if(type=="view")
	{
		try
        {

            var gemstone = nlapiGetFieldValue("custitem7");

            if(gemstone!=null && gemstone!="")
          
		{
			var url = nlapiResolveURL("SUITELET","customscript_print_item_label_zpl","customdeploy_print_item_label_zpl");
				url+= "&item=" + nlapiGetRecordId();
				
			form.addButton("custpage_print_item","ZPL Item Label","var newWin = window.open('" + url + "','printCertWin','height=400,width=400'); setTimeout(function(){ newWin.close(); }, 2500);");
		}
          }
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print Cert Label Button","Details: " + err.message);
		}
	}
}

function Gen_Item_Intake_Label_SL(request,response)
{
		//item label
        var filters1 = [];
		filters1.push(new nlobjSearchFilter("internalid",null,"is",request.getParameter("item")));
		var cols1 = [];
		cols1.push(new nlobjSearchColumn("itemid"));
		cols1.push(new nlobjSearchColumn("custitem27")); //Carat
		cols1.push(new nlobjSearchColumn("custitem5")); //Gemstone Shape
		cols1.push(new nlobjSearchColumn("custitem7")); //Color
		cols1.push(new nlobjSearchColumn("custitem19")); //Clarity
		cols1.push(new nlobjSearchColumn("custitem46")); //Certificate Number
		cols1.push(new nlobjSearchColumn("othervendor"));
        cols1.push(new nlobjSearchColumn("custitem4")); //Type of Gemstone
        cols1.push(new nlobjSearchColumn("custitem14")); //Length
        cols1.push(new nlobjSearchColumn("custitem18")); //Origin
        cols1.push(new nlobjSearchColumn("custitem20")); //Category
        cols1.push(new nlobjSearchColumn("purchasedescription"));
		var results1 = nlapiSearchRecord("item",null,filters1,cols1);
		if(results1)
		{
			var zpl = '';
			zpl+= '^XA\n';
			zpl+= '^CFO,30\n';
			zpl+= '^FO20,40^FD' + results1[0].getValue("itemid") + '^FS\n';
            zpl+= '^CFC,15\n';
            zpl+= '^FO20,100^FDMeasurement: ' + results1[0].getValue("custitem14")+ 'mm' + '^FS\n';
            zpl+= '^FO20,150^FDShape: ' + results1[0].getText("custitem5") + '^FS\n';
            zpl+= '^FO20,200^FDColor: ' + results1[0].getText("custitem7") + '^FS\n';
            zpl+= '^FO20,250^FDOrigin: ' + results1[0].getText("custitem18") + '^FS\n';
            zpl+= '^FO20,300^FDType: ' + results1[0].getText("custitem4") + '^FS\n';
          {
            if(results1[0].getValue("custitem20")=="1")
			 zpl+= '^FO20,350^FDClarity: ' + results1[0].getText("custitem19") + '^FS\n';
           }
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
