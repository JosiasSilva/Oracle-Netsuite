var CATEGORIES = ["1","8","14","15","18","20","21","23","30","31"];

function VRA_Overhaul_Melee_Gems(request,response)
{
	var returns = [];
	
	var filters = [];
	filters.push(new nlobjSearchFilter("custcol37",null,"is","T")); //Return = Yes
	filters.push(new nlobjSearchFilter("custbody236",null,"on","today")); //Date of Return = Today
	filters.push(new nlobjSearchFilter("custcol_category",null,"anyof",CATEGORIES));
	filters.push(new nlobjSearchFilter("closed",null,"is","F"));
	filters.push(new nlobjSearchFilter("status",null,"anyof",["PurchOrd:B","PurchOrd:D","PurchOrd:E"]));
	var formula = "NVL({quantity},0) - NVL({quantityshiprecv},0)";
	var qtyFilter = new nlobjSearchFilter("formulanumeric",null,"greaterthan","0");
	qtyFilter.setFormula(formula);
	filters.push(qtyFilter);
	var cols = [];
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("item"));
	cols.push(new nlobjSearchColumn("quantity"));
	cols.push(new nlobjSearchColumn("rate"));
	cols.push(new nlobjSearchColumn("amount"));
	cols.push(new nlobjSearchColumn("entity"));
	cols.push(new nlobjSearchColumn("mainname"));
	cols.push(new nlobjSearchColumn("status"));
	cols.push(new nlobjSearchColumn("line"));
	cols.push(new nlobjSearchColumn("unit"));
	var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			var found = false;
			
			for(var i=0; i < returns.length; i++)
			{
				if(returns[i].po == results[x].getId())
				{
					returns[i].lines.push({
						item : results[x].getValue("item"),
						qty : results[x].getValue("quantity"),
						rate : results[x].getValue("rate"),
						amount : results[x].getValue("amount"),
						line : results[x].getValue("line"),
						po : results[x].getId(),
						po_number : results[x].getValue("tranid"),
						po_status : results[x].getValue("status"),
						uom : results[x].getValue("unit")
					});
					
					found = true;
					break;
				}
			}
			
			if(found==false)
			{
				returns.push({
					po : results[x].getId(),
					po_number : results[x].getValue("tranid"),
					po_status : results[x].getValue("status"),
					vendor : results[x].getValue("mainname"),
					lines : [{
						item : results[x].getValue("item"),
						qty : results[x].getValue("quantity"),
						rate : results[x].getValue("rate"),
						amount : results[x].getValue("amount"),
						line : results[x].getValue("line"),
						po : results[x].getId(),
						po_number : results[x].getValue("tranid"),
						po_status : results[x].getValue("status"),
						uom : results[x].getValue("unit")
					}]
				});
			}
		}
	}
	
	nlapiLogExecution("debug","Returns JSON",JSON.stringify(returns));
	
	//Receive Purchase Order Lines
	for(var x=0; x < returns.length; x++)
	{
		var ir = nlapiTransformRecord("purchaseorder",returns[x].po,"itemreceipt");
		
		for(var i=0; i < ir.getLineItemCount("item"); i++)
		{
			ir.setLineItemValue("item","itemreceive",i+1,"F");
		}
		
		for(var i=0; i < returns[x].lines.length; i++)
		{
			for(var r=0; r < ir.getLineItemCount("item"); r++)
			{
				if(returns[x].lines[i].item == ir.getLineItemValue("item","item",r+1) && returns[x].lines[i].line == ir.getLineItemValue("item","orderline",r+1))
				{
					ir.setLineItemValue("item","itemreceive",i+1,"T");
					break;
				}
			}
		}
		
		nlapiSubmitRecord(ir,true,true);
	}
	
	//Create VRAs grouped by vendor up to $70K max
	var returns2 = [];
	
	for(var x=0; x < returns.length; x++)
	{
		var vendorFound = false;
		
		for(var i=0; i < returns2.length; i++)
		{
			if(returns2[i].vendor == returns[x].vendor)
			{
				for(var l=0; l < returns[x].lines.length; l++)
				{
					returns2[i].items.push({
						item : returns[x].lines[l].item,
						qty : returns[x].lines[l].qty,
						rate : returns[x].lines[l].rate,
						amount : returns[x].lines[l].amount,
						line : returns[x].lines[l].line,
						po : returns[x].po,
						po_num : returns[x].po_number,
						po_status : returns[x].po_status,
						uom : returns[x].lines[l].uom
					});
				}
				
				vendorFound = true;
				break;
			}
		}
		
		if(vendorFound==false)
		{
			returns2.push({
				vendor : returns[x].vendor,
				items : returns[x].lines
			});
		}
	}
	
	nlapiLogExecution("debug","Returns2 JSON",JSON.stringify(returns2));
	
	var vraIDs = [];
	
	//Create VRA's - One Per Vendor up to $70K (90 Units Per VRA assuming 
	for(var x=0; x < returns2.length; x++)
	{
		var vra = nlapiCreateRecord("vendorreturnauthorization"); //10 UNITS
		var vraTotal = 0.00;
		
		vra.setFieldValue("entity",returns2[x].vendor);
		vra.setFieldValue("orderstatus","B");
		vra.setFieldValue("custbody_po_ship_date",nlapiDateToString(new Date(),"date"));
		//vra.setFieldValue("shipmethod","1965157"); //FedEx Priority Overnight - Integrated
		
		for(var i=0; i < returns2[x].items.length; i++)
		{
			if((vraTotal + returns2[x].items[i].amount) > 70000.00 && vra.getLineItemCount("item") > 0)
			{
				vraIDs.push(nlapiSubmitRecord(vra,true,true));
				
				vra = nlapiCreateRecord("vendorreturnauthorization");
				vra.setFieldValue("entity",returns2[x].vendor);
				vra.setFieldValue("orderstatus","B");
				vra.setFieldValue("custbody_po_ship_date",nlapiDateToString(new Date(),"date"));
				//vra.setFieldValue("shipmethod","1965157"); //FedEx Priority Overnight - Integrated

				vraTotal = 0.00;
			}
			
			vra.selectNewLineItem("item");
			vra.setCurrentLineItemValue("item","item",returns2[x].items[i].item);
			vra.setCurrentLineItemValue("item","quantity",returns2[x].items[i].qty);
			vra.setCurrentLineItemValue("item","units",returns2[x].items[i].uom);
			vra.setCurrentLineItemValue("item","rate",returns2[x].items[i].rate);
			vra.setCurrentLineItemValue("item","amount",returns2[x].items[i].amount);
			vra.setCurrentLineItemValue("item","custcol_vra_po",returns2[x].items[i].po);
			vra.setCurrentLineItemValue("item","custcol_vra_insurance",returns2[x].items[i].amount);
			if(returns2[x].items[i].po_status=="fullyBilled")
				vra.setCurrentLineItemValue("item","custcol_vra_credit","T");
			vra.commitLineItem("item");
		}
		
		vraIDs.push(nlapiSubmitRecord(vra,true,true)); //20 UNITS
		nlapiLogExecution("debug","Finished Creating VRA",JSON.stringify(vraIDs));
	}
	
	//Fulfill VRA's
	for(var x=0; x < vraIDs.length; x++)
	{
		//var vraIF = nlapiTransformRecord("vendorreturnauthorization",vraIDs[x],"itemfulfillment",{recordmode:"dynamic",nsi:"1965157"}); //10 UNITS
		var vraIF = nlapiTransformRecord("vendorreturnauthorization",vraIDs[x],"itemfulfillment",{recordmode:"dynamic"});
		
		nlapiLogExecution("debug","Shipping Country",vraIF.getFieldValue("shipcountry"));
		
		var integratedShipping = false;
		if(vraIF.getFieldValue("shipcountry")=="US")
			integratedShipping = true;
		else
			vraIF = nlapiTransformRecord("vendorreturnauthorization",vraIDs[x],"itemfulfillment",{recordmode:"dynamic"});
		
		vraIF.setFieldValue("custbody_vra_overhaul_if_diamonds","T");
		
		nlapiLogExecution("debug","Is Integrated Shipping?",integratedShipping);
		
		if(integratedShipping==true)
		{
			//vraIF.setFieldValue("shipmethod","1965157"); //FedEx Priority Overnight - Integrated
			//vraIF.setFieldValue("generateintegratedshipperlabel","T"); //**IMPORTANT** Update to 'T' before moving to production	
		}
		
		var costTotal = 0.00;
		
		for(var i=0; i < vraIF.getLineItemCount("item"); i++)
		{
			vraIF.selectLineItem("item",i+1);
			
			costTotal += parseFloat(vraIF.getCurrentLineItemValue("item","custcol_vra_insurance"));
			
			vraIF.setCurrentLineItemValue("item","itemreceive","T");
			vraIF.setCurrentLineItemValue("item","location","2");
			
			vraIF.commitLineItem("item");
		}
		
		nlapiLogExecution("debug","Insurance Cost for Package (1)",costTotal);
		
		if(integratedShipping==true)
		{
			nlapiLogExecution("debug","Using integration shipping","Package Line Count: " + vraIF.getLineItemCount("packagefedex"));
			
			if(vraIF.getLineItemCount("packagefedex") > 0)
			{
				for(var p=0; p < vraIF.getLineItemCount("packagefedex"); p++)
				{
					vraIF.removeLineItem("packagefedex",p+1);
					p--;
				}
			}
			
			nlapiLogExecution("debug","Package Count After Removal",vraIF.getLineItemCount("packagefedex"));
			
			vraIF.selectNewLineItem("packagefedex");
			
			vraIF.setCurrentLineItemValue("packagefedex","packageweightfedex","2"); //Package Weight
				
			vraIF.setCurrentLineItemValue("packagefedex","packagingfedex","8"); //Carrier Packaging = FedEx Box
			nlapiLogExecution("debug","Set Carrier Packaging = FedEx Box");
			
			vraIF.setCurrentLineItemValue("packagefedex","deliveryconffedex","5"); //Delivery Confirmation = Signature Required
			nlapiLogExecution("debug","Delivery Confirmation = Signature Required");
			
			vraIF.setCurrentLineItemValue("packagefedex","signatureoptionsfedex","1"); //Signature Options = Direct Signature
			nlapiLogExecution("debug","Signature Options = Direct Signature");
			//1 = Direct Signature, 2 = Indirect Signature, 3 = Adult Signature, 4 = Service Default
			
			costTotal = costTotal * 1.15;
			nlapiLogExecution("debug","Insurance Cost for Package (2)",costTotal);
			
			if(costTotal > 50000)
				vraIF.setCurrentLineItemValue("packagefedex","reference1fedex","RE2014"+(parseInt(costTotal) - 50000)+"200305zT"+nlapiLookupField("vendorreturnauthorization",vraIDs[x],"tranid")); //Reference Information
			else
				vraIF.setCurrentLineItemValue("packagefedex","reference1fedex","BEF8956"+(parseInt(costTotal))+"X1560-T"+nlapiLookupField("vendorreturnauthorization",vraIDs[x],"tranid")); //Reference Information
			
			vraIF.setCurrentLineItemValue("packagefedex","useinsuredvaluefedex","T"); //Declared Value (checkbox)
			
			if(costTotal > 50000)
				vraIF.setCurrentLineItemValue("packagefedex","insuredvaluefedex","50000"); //Declared Value ($$$)
			else
				vraIF.setCurrentLineItemValue("packagefedex","insuredvaluefedex",(costTotal)); //Declared Value ($$$)
			
			vraIF.commitLineItem("packagefedex");
			
			nlapiLogExecution("debug","Finished setting package information....")
		}
		
		nlapiSubmitRecord(vraIF,true,true); //20 UNITS
		nlapiLogExecution("debug","Finishing Fulfilling VRA ID " + vraIDs[x]);
	}
	
	//Bill Credits
	for(var x=0; x < vraIDs.length; x++)
	{
		var billCredit = nlapiTransformRecord("vendorreturnauthorization",vraIDs[x],"vendorcredit"); //10 UNITS
		nlapiLogExecution("debug","Checking Bill Credit Need for VRA " + vraIDs[x]);
		
		for(var i=0; i < billCredit.getLineItemCount("item"); i++)
		{
			if(billCredit.getLineItemValue("item","custcol_vra_credit",i+1)!="T")
			{
				billCredit.removeLineItem("item",i+1);
				i--;
			}
		}
		
		if(billCredit.getLineItemCount("item") > 0)
		{
			nlapiLogExecution("debug","Bill Credit Saving");
			
			nlapiSubmitRecord(billCredit,true,true); //20 UNITS
		}
		else
		{
			nlapiLogExecution("debug","No Bill Credit Needed");
			billCredit = null;
		}
	}
	
	//Close PO's if needed
	var ptc = []; //PO's To Close (PTC)
	
	for(var x=0; x < returns2.length; x++)
	{
		for(var i=0; i < returns2[x].items.length; i++)
		{
			if(returns2[x].items[i].po_status!="fullyBilled")
			{
				var poFound = false;
				
				for(var p=0; p < ptc.length; p++)
				{
					if(ptc[p].id == returns2[x].items[i].po)
					{
						ptc[p].lines.push({
							line : returns2[x].items[i].line,
							item : returns2[x].items[i].item
						});
						
						poFound = true;
						break;
					}
				}
				
				if(poFound==false)
				{
					ptc.push({
						id : returns2[x].items[i].po,
						lines : [{
							line : returns2[x].items[i].line,
							item : returns2[x].items[i].item
						}]
					});
				}
			}
		}
	}
	
	nlapiLogExecution("debug","PO's To Close (PTC)",JSON.stringify(ptc));
	
	for(var x=0; x < ptc.length; x++)
	{
		var poRec = nlapiLoadRecord("purchaseorder",ptc[x].id); //10 UNITS
		nlapiLogExecution("debug","Opening PO ID " + ptc[x].id + " to close line items.");
		
		for(var i=0; i < ptc[x].lines.length; i++)
		{
			for(var z=0; z < poRec.getLineItemCount("item"); z++)
			{
				if(ptc[x].lines[i].item == poRec.getLineItemValue("item","item",z+1) && ptc[x].lines[i].line == poRec.getLineItemValue("item","line",z+1))
				{
					poRec.setLineItemValue("item","isclosed",z+1,"T");
					break;
				}
			}
		}
		
		nlapiLogExecution("debug","Saving PO ID " + ptc[x].id + " after closing line items.");
		nlapiSubmitRecord(poRec,true,true); //20 UNITS
	}
	
	//Redirect user to Print Checks & Forms > Packing Slips and Return Forms
	var params = [];
	params["title"] = "Packing+Slips+and+Return+Forms";
	
	response.sendRedirect("TASKLINK","TRAN_PRINT_PACKINGSLIP",null,null,params);
}
