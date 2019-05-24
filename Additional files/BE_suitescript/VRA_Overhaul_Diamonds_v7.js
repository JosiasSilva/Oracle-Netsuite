function VRA_Overhaul_Diamonds(request,response)
{
	//Search for items to return
	//Conditions:
	// 1 - Expected Return Date = Today
	// 2 - No Sales Orders with Pending APproval or Pending Fulfillment
	// 3 - On Hold Through (custbody86) is not future date
	// 4 - No Appointments in Next 7 Days Unless Date Needed for Return < Appointment Date
	
	var items1 = [];
	var diamonds = [];
	
	var exceptions = [];
	
	var now = new Date();
	var todayDate = nlapiDateToString(now,"date");
	var sevenDaysDate = nlapiDateToString(nlapiAddDays(now,7),"date");
	
	var filterExp = [
		["custitem20","is","7"],
		"and",
		["custitem192","on","today"],
		"and",
		[
			["custitem86","onorbefore","today"],
			"or",
			["custitem86","isempty",null]
		]
	];
	var cols = [];
	var dateFormulaCol = new nlobjSearchColumn("formuladate");
	dateFormulaCol.setFormula("{custitem108} + (TO_NUMBER({preferredvendor.custentityreturn_terms}) - 5)");
	cols.push(dateFormulaCol);
	cols.push(new nlobjSearchColumn("custitem192"));
	var results = nlapiSearchRecord("item",null,filterExp,cols); //10 UNITS
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			items1.push(results[x].getId());
			
			diamonds.push({
				id : results[x].getId(),
				date_needed_for_return : results[x].getValue(dateFormulaCol),
				exp_return_date : results[x].getValue("custitem192")
			});
		}	
	}
	
	nlapiLogExecution("debug","Diamond Items (Base)",JSON.stringify(diamonds));
	
	if(items1!=null && items1.length > 0)
	{
		//Search for sales orders containing diamonds
		var orderedDiamonds = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("item",null,"anyof",items1));
		filters.push(new nlobjSearchFilter("status",null,"anyof",["SalesOrd:A","SalesOrd:B"]));
		var cols = [];
		cols.push(new nlobjSearchColumn("item"));
		cols.push(new nlobjSearchColumn("tranid"));
		cols.push(new nlobjSearchColumn("vendor","item"));
		cols.push(new nlobjSearchColumn("custitem46","item"));
		var results = nlapiSearchRecord("salesorder",null,filters,cols); //10 UNITS
		if(results)
		{	
			nlapiLogExecution("debug","# SO's Found",results.length);
			
			for(var x=0; x < results.length; x++)
			{
				orderedDiamonds.push(results[x].getValue("item"));
				
				exceptions.push({
					id : results[x].getText("item"),
					reason : "On Sales Order # " + results[x].getValue("tranid"),
					vendor : results[x].getText("vendor","item"),
					certificate : results[x].getValue("custitem46","item")
				});
			}
				
		}
		
		var apptDiamonds = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("startdate","custrecord_appointment_item_parent","within",todayDate,sevenDaysDate));
		filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"anyof",items1));
		if(orderedDiamonds!=null && orderedDiamonds!="" && orderedDiamonds.length > 0)
			filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"noneof",orderedDiamonds));
		var cols = [];
		cols.push(new nlobjSearchColumn("custrecord_appointment_item_itemid"));
		cols.push(new nlobjSearchColumn("vendor","custrecord_appointment_item_itemid"));
		cols.push(new nlobjSearchColumn("custitem46","custrecord_appointment_item_itemid"));
		cols.push(new nlobjSearchColumn("startdate","custrecord_appointment_item_parent"));
		var results = nlapiSearchRecord("customrecord_appointment_item",null,filters,cols); //10 UNITS
		if(results)
		{	
			for(var x=0; x < results.length; x++)
			{
				for(i=0; i < diamonds.length; i++)
				{
					if(diamonds[i].id == results[x].getValue("custrecord_appointment_item_itemid"))
					{
						if(diamonds[i].date_needed_for_return >= results[x].getValue("startdate","custrecord_appointment_item_parent"))
						{
							nlapiLogExecution("debug","Appt Found for Diamond - " + results[x].getText("custrecord_appointment_item_itemid"));
							
							apptDiamonds.push(results[x].getValue("custrecord_appointment_item_itemid"));
							
							exceptions.push({
								id : results[x].getText("custrecord_appointment_item_itemid"),
								reason : "Appointment On " + results[x].getValue("startdate","custrecord_appointment_item_parent"),
								vendor : results[x].getText("vendor","custrecord_appointment_item_itemid"),
								certificate : results[x].getValue("custitem46","custrecord_appointment_item_itemid")
							});
						}
						break;
					}
				}
			}
		}
		
		var notOnHandDiamonds = [];
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"anyof",items1));
		if(orderedDiamonds!=null && orderedDiamonds!="" && orderedDiamonds.length > 0)
			filters.push(new nlobjSearchFilter("internalid",null,"noneof",orderedDiamonds));
		if(apptDiamonds!=null && apptDiamonds!="" && apptDiamonds.length > 0)
			filters.push(new nlobjSearchFilter("internalid",null,"noneof",apptDiamonds));
		filters.push(new nlobjSearchFilter("inventorylocation",null,"is","2"));
		var cols = [];
		cols.push(new nlobjSearchColumn("locationquantityonhand"));
		cols.push(new nlobjSearchColumn("itemid"));
		cols.push(new nlobjSearchColumn("vendor"));
		cols.push(new nlobjSearchColumn("custitem47"));
		var results = nlapiSearchRecord("item",null,filters,cols); //10 UNITS
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				var qoh = results[x].getValue("locationquantityonhand");
				
				if(qoh==null || qoh=="" || qoh==0)
				{
					notOnHandDiamonds.push(results[x].getId());
							
					exceptions.push({
						id : results[x].getValue("itemid"),
						reason : "Item Not In Stock In SF",
						vendor : results[x].getText("vendor"),
						certificate : results[x].getValue("custitem46")
					});
				}
			}
		}
		
	}
	else
	{
		return true;
	}
	
	//Lookup diamond and PO information
	var returns = [];
	var returnItems = [];
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"anyof",items1));
	if(orderedDiamonds.length > 0)
		filters.push(new nlobjSearchFilter("internalid",null,"noneof",orderedDiamonds));
	if(apptDiamonds.length > 0)
		filters.push(new nlobjSearchFilter("internalid",null,"noneof",apptDiamonds));
	if(notOnHandDiamonds.length > 0)
		filters.push(new nlobjSearchFilter("internalid",null,"noneof",notOnHandDiamonds));
	
	filters.push(new nlobjSearchFilter("type","transaction","is","PurchOrd"));
	filters.push(new nlobjSearchFilter("locationquantityonhand",null,"greaterthan","0"));
	//filters.push(new nlobjSearchFilter("custbody331","transaction","is","F")); //Filter out PO's where Return Confirmation = Yes
	var cols = [];
	cols.push(new nlobjSearchColumn("mainname","transaction"));
	cols.push(new nlobjSearchColumn("internalid","transaction"));
	cols.push(new nlobjSearchColumn("amount","transaction"));
	cols.push(new nlobjSearchColumn("status","transaction"));
	cols.push(new nlobjSearchColumn("line","transaction"));
	cols.push(new nlobjSearchColumn("custbody331","transaction"));
	cols.push(new nlobjSearchColumn("trandate","transaction").setSort(true));
	cols.push(new nlobjSearchColumn("cost"));
	cols.push(new nlobjSearchColumn("itemid"));
	cols.push(new nlobjSearchColumn("custitem46"));
	var results = nlapiSearchRecord("item",null,filters,cols); //10 UNITS
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			//Check to ensure item isn't already added from another PO
			var itemAlreadyFound = false;
			
			for(var i=0; i < returnItems.length; i++)
			{
				if(returnItems[i] == results[x].getId())
				{
					itemAlreadyFound = true;
					break;
				}
			}
			
			if(itemAlreadyFound == true)
				continue;
			
			var vendorFound = false;
			
			if(results[x].getValue("custbody331","transaction")=="T")
			{
				exceptions.push({
					id : results[x].getValue("itemid"),
					reason : "Return Confirmation = Yes",
					vendor : results[x].getText("mainname","transaction"),
					certificate : results[x].getValue("custitem46")
				});
				
				continue;
			}
			
			for(var i=0; i < returns.length; i++)
			{
				if(returns[i].vendor == results[x].getValue("mainname","transaction"))
				{
					returns[i].items.push({
						id : results[x].getId(),
						amt : results[x].getValue("amount","transaction"),
						po : results[x].getValue("internalid","transaction"),
						po_status : results[x].getValue("status","transaction"),
						po_line : results[x].getValue("line","transaction"),
						cost : results[x].getValue("cost")
					});
					
					returns[i].total += parseFloat(results[x].getValue("amount","transaction"));
					
					vendorFound = true;
					break;
				}
			}
			
			if(vendorFound == false)
			{
				returns.push({
					vendor : results[x].getValue("mainname","transaction"),
					total : parseFloat(results[x].getValue("amount","transaction")),
					items : [{
						id : results[x].getId(),
						amt : results[x].getValue("amount","transaction"),
						po : results[x].getValue("internalid","transaction"),
						po_status : results[x].getValue("status","transaction"),
						po_line : results[x].getValue("line","transaction"),
						cost : results[x].getValue("cost")
					}]
				})
			}
			
			returnItems.push(results[x].getId());
		}
	}
	
	nlapiLogExecution("debug","VRA's to Create",JSON.stringify(returns));
	
	//----50 Units to This Point----
	
	var vraIDs = [];
	
	//Create VRA's - One Per Vendor up to $70K (90 Units Per VRA assuming 
	for(var x=0; x < returns.length; x++)
	{
		var vra = nlapiCreateRecord("vendorreturnauthorization"); //10 UNITS
		var vraTotal = 0.00;
		
		vra.setFieldValue("entity",returns[x].vendor);
		vra.setFieldValue("orderstatus","B");
		vra.setFieldValue("custbody_po_ship_date",nlapiDateToString(new Date(),"date"));
		//vra.setFieldValue("shipmethod","1965157"); //FedEx Priority Overnight - Integrated
		
		for(var i=0; i < returns[x].items.length; i++)
		{
			if((vraTotal + returns[x].items[i].amt) > 70000.00)
			{
				vraIDs.push(nlapiSubmitRecord(vra,true,true));
				
				vra = nlapiCreateRecord("vendorreturnauthorization");
				vra.setFieldValue("entity",returns[x].vendor);
				vra.setFieldValue("orderstatus","B");
				vra.setFieldValue("custbody_po_ship_date",nlapiDateToString(new Date(),"date"));
				//vra.setFieldValue("shipmethod","1965157"); //FedEx Priority Overnight - Integrated

				vraTotal = 0.00;
			}
			
			vra.selectNewLineItem("item");
			vra.setCurrentLineItemValue("item","item",returns[x].items[i].id);
			vra.setCurrentLineItemValue("item","rate",returns[x].items[i].amt);
			vra.setCurrentLineItemValue("item","amount",returns[x].items[i].amt);
			vra.setCurrentLineItemValue("item","custcol_vra_po",returns[x].items[i].po);
			vra.setCurrentLineItemValue("item","custcol_vra_insurance",returns[x].items[i].cost);
			if(returns[x].items[i].po_status=="fullyBilled")
				vra.setCurrentLineItemValue("item","custcol_vra_credit","T");
			vra.commitLineItem("item");
		}
		
		vraIDs.push(nlapiSubmitRecord(vra,true,true)); //20 UNITS
		nlapiLogExecution("debug","Finished Creating VRA",JSON.stringify(vraIDs));
	}
	
	//Fulfill VRA's
	for(var x=0; x < vraIDs.length; x++)
	{
		var vraIF = nlapiTransformRecord("vendorreturnauthorization",vraIDs[x],"itemfulfillment",{recordmode:"dynamic",nsi:"1965157"}); //10 UNITS
		//var vraIF = nlapiTransformRecord("vendorreturnauthorization",vraIDs[x],"itemfulfillment",{recordmode:"dynamic"});
		
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
			vraIF.setFieldValue("shipmethod","1965157"); //FedEx Priority Overnight - Integrated
			vraIF.setFieldValue("generateintegratedshipperlabel","T"); //**IMPORTANT** Update to 'T' before moving to production	
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
				vraIF.setCurrentLineItemValue("packagefedex","reference1fedex","RE2014"+(parseInt(costTotal) - 50000)+"200305"); //Reference Information
			else
				vraIF.setCurrentLineItemValue("packagefedex","reference1fedex","BEF8956"+(parseInt(costTotal))+"X1560 "+nlapiLookupField("vendorreturnauthorization",vraIDs[x],"tranid")); //Reference Information
			
			vraIF.setCurrentLineItemValue("packagefedex","useinsuredvaluefedex","T"); //Declared Value (checkbox)
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
	
	for(var x=0; x < returns.length; x++)
	{
		for(var i=0; i < returns[x].items.length; i++)
		{
			if(returns[x].items[i].po_status!="fullyBilled")
			{
				var poFound = false;
				
				for(var p=0; p < ptc.length; p++)
				{
					if(ptc[p].id == returns[x].items[i].po)
					{
						ptc[p].lines.push({
							line : returns[x].items[i].po_line,
							item : returns[x].items[i].id
						});
						
						poFound = true;
						break;
					}
				}
				
				if(poFound==false)
				{
					ptc.push({
						id : returns[x].items[i].po,
						lines : [{
							line : returns[x].items[i].po_line,
							item : returns[x].items[i].id
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
	
	//Email Report of Diamonds Not Returned
	if(exceptions.length > 0)
	{
		nlapiLogExecution("debug","Diamonds Not Returned - Sending Email");
		
		var now = new Date();
		
		var emailBody = "<p>Diamonds Not Returned Report - " + now.toString() + "</p>";
			emailBody += "<table cellpadding='2' border='0' cellspacing='2'>";
				emailBody += "<tr><th>Stock Number</th><th>Certificate Number</th><th>Vendor Name</th><th>Reason for not being Returned</th></tr>";
				
		for(var x=0; x < exceptions.length; x++)
		{
			emailBody += "<tr>";
				emailBody += "<td>" + exceptions[x].id + "</td>";
				emailBody += "<td>" + exceptions[x].certificate + "</td>";
				emailBody += "<td>" + exceptions[x].vendor + "</td>";
				emailBody += "<td>" + exceptions[x].reason + "</td>";
			emailBody += "</tr>";
		}
		
		emailBody += "</table>";
		
		nlapiLogExecution("debug","Report Email Body",emailBody);
		
		nlapiSendEmail(nlapiGetUser(),"diaops@brilliantearth.com","Diamonds Not Returned Report",emailBody); //10 UNITS
		
		nlapiLogExecution("debug","Finished Sending Email");
	}
	
	//Redirect user to Print Checks & Forms > Packing Slips and Return Forms
	var params = [];
	params["title"] = "Packing+Slips+and+Return+Forms";
	
	response.sendRedirect("TASKLINK","TRAN_PRINT_PACKINGSLIP",null,null,params);
}
