function Print_PU_IF_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
         if(nlapiGetFieldValue("shipstatus")!="C" && nlapiGetFieldValue("custbody53")=="T")
           {
			var url = nlapiResolveURL("SUITELET","customscript_sales_order_pu_label","customdeploy_sales_order_pu_label");
				url+= "&shipid=" + nlapiGetRecordId();
				
			form.addButton("custpage_print_so_label","PU Label","var newWin = window.open('" + url + "','printPOLblWin','height=400,width=400'); setTimeout(function(){ newWin.close(); }, 2500);");
		}
           }
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print PO Label Button","Details: " + err.message);
		}
	}
}

function Gen_PU_IF_Label_SL(request,response)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",request.getParameter("soid")));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("trandate"));
	cols.push(new nlobjSearchColumn("tranid"));
    cols.push(new nlobjSearchColumn("internalid"));
    cols.push(new nlobjSearchColumn("tranid","createdfrom"));
	cols.push(new nlobjSearchColumn("entity"));
	cols.push(new nlobjSearchColumn("mainname"));
	cols.push(new nlobjSearchColumn("custbody6"));
	cols.push(new nlobjSearchColumn("custbody110"));
	cols.push(new nlobjSearchColumn("custbody111"));
	cols.push(new nlobjSearchColumn("custbody194","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody348"));
    cols.push(new nlobjSearchColumn("custbody_international_shipping"));
    cols.push(new nlobjSearchColumn("custbody319"));
	cols.push(new nlobjSearchColumn("createdfrom"));
	cols.push(new nlobjSearchColumn("custbody140","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody319","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody_pickup_location"));
	cols.push(new nlobjSearchColumn("entity"));
    cols.push(new nlobjSearchColumn("custbody_website_truebalance_amt","createdfrom"));
	var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
	if(results)
	{
		//var prodPOCount = 0;
		
		//nlapiLogExecution("debug","Sales Order",results[0].getValue("createdfrom"));
		
		//var filters1 = [];
		//filters1.push(new nlobjSearchFilter("createdfrom",null,"is",results[0].getValue("createdfrom")));
		//filters1.push(new nlobjSearchFilter("mainline",null,"is","T"));
		//filters1.push(new nlobjSearchFilter("custentity4","vendor","is","6")); //Type of Contact = Production Vendor/Jeweler
		//var cols1 = [];
		//cols1.push(new nlobjSearchColumn("internalid",null,"count"));
		//var results1 = nlapiSearchRecord("purchaseorder",null,filters1,cols1);
		//if(results1)
		//{
			//var poCount = results1[0].getValue("internalid",null,"count");
			//nlapiLogExecution("debug","Production PO's Associated With Sales Order",poCount);
			
			//if(poCount!=null && poCount!="")
				//prodPOCount = poCount;
		//}
		
		//var deliveryInstructions = results[0].getValue("custbody194","createdfrom");
		//nlapiLogExecution("debug","Delivery Instructions",deliveryInstructions);
		//var displayDiMessage = false;
		//if(deliveryInstructions!=null && deliveryInstructions!="")
		//{
			//if(deliveryInstructions.indexOf(",")!=-1)
			//{
				//deliveryInstructions = deliveryInstructions.split(",");
				//for(var x=0; x < deliveryInstructions.length; x++)
				//{
					//if(deliveryInstructions[x]=="2" || deliveryInstructions[x]=="3")
						//displayDiMessage = true;
				//}
			//}
			//else
			//{
				//if(deliveryInstructions=="2" || deliveryInstructions=="3")
						//displayDiMessage = true;
			//}
		//}
		
		//var prodPOCountMsg = "";
		//if(prodPOCount > 1)
			//prodPOCountMsg = "1 of " + prodPOCount;
			
		//If BE Engraving Status = Engraving Needed, print 'E'
		//var beEngravingStatus = "";
		//if(results[0].getValue("custbody348","createdfrom")=="1")
			//beEngravingStatus = "E";
			
		var customerName = results[0].getText("entity");
		customerName = customerName.substr(customerName.indexOf(" ") + 1);
		
		//var compedItem = "";
		//if(results[0].getValue("custbody319","createdfrom")=="T")
			//compedItem = "Include Comped Item";
		
		var zpl = '';
			zpl+= '^XA\n';
			zpl+= '^CFF,20\n';
			zpl+= '^FO20,40^FD' + results[0].getValue("tranid","createdfrom") + '^FS\n';
            zpl+= '^FO20,80^FDLocation: ' + results[0].getText("custbody_pickup_location") + '^FS\n';
			zpl+= '^FO20,120^FD' + customerName + '^FS\n';
            zpl+= '^FO20,160^FDBalance: ' + results[0].getValue("custbody_website_truebalance_amt","createdfrom") + '^FS\n';
            zpl+= '^CF0,20\n';
			zpl+= '^FO20,200^FD' + results[0].getText("custbody140","createdfrom") + '^FS\n';
            zpl+= '^FO20,230^FD' + results[0].getText("custbody194","createdfrom") + '^FS\n';
            zpl+= '^BY2,1,60'
            zpl+= '^FO50,280^BC^FD' + results[0].getText("internalid") + '^FS\n';
			//zpl+= '^FO20,90^FD' + results[0].getText("mainname") + '^FS\n';
      		//zpl+= '^CFA,30\n';
            if(results[0].getValue("custbody319","createdfrom")=="T")
				zpl+= '^FO20,260^FDInclude Comped Item^FS\n';
            //zpl+= '^CF0,40\n';
            //if(results[0].getValue("custbody_international_shipping","createdfrom")=="T")
				//zpl+= '^FO20,380^FDInternational^FS\n';
			//zpl+= '^FO20,200^FDDD:' + results[0].getValue("custbody6","createdfrom") + ' ' + tbwMessage + '^FS\n';
			//zpl+= '^FO20,240^FDDTS:' + results[0].getValue("custbody110","createdfrom") + '^FS\n';			
			//if(displayDiMessage==true)
				//zpl+= '^FO20,320^FDDD on Specific Date^FS\n';
			//zpl+= '^FO100,360^FD' + prodPOCountMsg + ' ' + beEngravingStatus + '^FS\n';
			zpl+= '^XZ';
			
		//Save file for debugging purposes only
		var zplFile = nlapiCreateFile(results[0].getValue("tranid") + ".zpl","PLAINTEXT",zpl);
		
		//Write file back to user so they can open and print
		response.setContentType("PLAINTEXT",results[0].getValue("tranid")+".zpl","attachment");
		response.write("<script>this.close();</script>");
		response.write(zplFile.getValue());
	}
}
