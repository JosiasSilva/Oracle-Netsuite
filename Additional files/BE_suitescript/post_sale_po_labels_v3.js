function Print_Prod_PO_Post_Sale_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_post_sale_prod_sticker","customdeploy_post_sale_prod_sticker");
				url+= "&poid=" + nlapiGetRecordId();
				
			form.addButton("custpage_print_po_post_sale_label","OM PO Label","var newWin = window.open('" + url + "','printPOLblWin','height=400,width=400'); setTimeout(function(){ newWin.close(); }, 2500);");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print PO Label Button","Details: " + err.message);
		}
	}
}

function Gen_Prod_PO_Post_Sale_Label_SL(request,response)
{
  {
   {
   var para = new Array();
    var id = request.getParameter('id');
    var po_id;
    try {
        if (id) {
            para["status"] = false;
            var po_obj = nlapiLoadRecord('purchaseorder', id);
            for (var i = 1; i <= po_obj.getLineItemCount('item'); i++) {
                var itemId = po_obj.getLineItemValue('item', 'item', i);
                po_obj.setLineItemValue('item', 'custcol28', i, '1');
                po_obj.setLineItemValue('item', 'custcoldiamondinscription', i, 'T');

            }
          po_id=nlapiSubmitRecord(po_obj, true, true);
            para["po_id"] = po_id;
            nlapiLogExecution('debug', 'PO successfully updated #' + po_id);
        }

    } catch (ex) {
        nlapiLogExecution('error', 'Error on Page', ex);
    }
        }
    }
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",request.getParameter("poid")));
	filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
	var cols = [];
	cols.push(new nlobjSearchColumn("trandate"));
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("entity"));
	cols.push(new nlobjSearchColumn("mainname"));
	cols.push(new nlobjSearchColumn("custcol_full_insurance_value"));
	cols.push(new nlobjSearchColumn("custbody6","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody110","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody129","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody111","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody194","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody348","createdfrom"));
    cols.push(new nlobjSearchColumn("custbody82","createdfrom"));
	cols.push(new nlobjSearchColumn("createdfrom"));
    cols.push(new nlobjSearchColumn("internalid"));
	cols.push(new nlobjSearchColumn("tranid","createdfrom"));
	cols.push(new nlobjSearchColumn("entity","createdfrom"));
	var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
	
	var insurance = 0.00;
	
	for(var x=0; x < results.length; x++)
	{
		if(results[x].getValue("custcol_full_insurance_value")!=null && results[x].getValue("custcol_full_insurance_value")!="")
		{
			insurance += parseFloat(results[x].getValue("custcol_full_insurance_value"));
		}
	}
	
	//if(results)
	//{
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
			
		//var customerName = results[0].getText("entity","createdfrom");
		//customerName = customerName.substr(customerName.lastIndexOf(" ") + 1);
		
		//var tbwMessage = "";
		//if(results[0].getValue("custbody129","createdfrom")=="T")
			//tbwMessage = "TBW";
		
		var zpl = '';
		zpl+= '^XA\n';
		zpl+= '^CF0,40\n';
		zpl+= '^FO20,40^FD' + results[0].getValue("tranid","createdfrom") + '^FS\n';
		zpl+= '^FO20,90^FDPO #' + results[0].getValue("tranid") + '^FS\n';
		zpl+= '^FO20,140^FD' + results[0].getText("mainname") + '^FS\n';
                zpl+= '^FO20,190^FD' + nlapiFormatCurrency(insurance) + '^FS/n';
        zpl+= '^BY2,2,100';
        zpl+= '^FO100,260^BC^FD' + results[0].getValue("tranid") + '^FS\n';
		zpl+= '^XZ';
			
		//Save file for debugging purposes only
		var zplFile = nlapiCreateFile(results[0].getValue("tranid") + ".zpl","PLAINTEXT",zpl);
		
		//Write file back to user so they can open and print
		response.setContentType("PLAINTEXT",results[0].getValue("tranid")+".zpl","attachment");
		response.write("<script>this.close();</script>");
		response.write(zplFile.getValue());
	//}

 
    //nlapiSetRedirectURL('record', 'purchaseorder', po_id, 'view', para);

}

