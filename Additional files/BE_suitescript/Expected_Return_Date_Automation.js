nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Expected_Return_Date_Automation()
{
	//Check if time is before or after 2:00PM
	var now = new Date();
	if(now.getHours() >= 14)
	{
		var after2 = true;
		var searchFilter = "tomorrow";
	}
	else
	{
		var after2 = false;
		var searchFilter = "today";
	}
	
	var todayDate = nlapiDateToString(now,"date");
	var sevenDaysDate = nlapiDateToString(nlapiAddDays(now,7),"date");
	
	var baseDiamondIDs = [];
	var baseDiamondIDs2= [];
	var baseDiamondIDs3= [];
	
	var diamonds = [];
	var diamonds2 = [];
	var diamonds3 = [];
	
	//Story #1 - Diamond is available in SF, LA, or BOS and not on a sales order Pending Approval or Pending Fulfillment
	var filters = [];
	filters.push(new nlobjSearchFilter("custitem192",null,"noton",searchFilter));
	var cols = [];
	var dateFormulaCol = new nlobjSearchColumn("formuladate");
	dateFormulaCol.setFormula("{custitem108} + (TO_NUMBER({preferredvendor.custentityreturn_terms}) - 5)");
	cols.push(dateFormulaCol);
	var results = nlapiSearchRecord("item","customsearch_diamond_vra_story_1",filters,cols);
	if(results)
	{
		nlapiLogExecution("debug","Story #1 - Base Diamonds","# Diamonds Returned: " + results.length);
		
		for(var x=0; x < results.length; x++)
		{
			baseDiamondIDs.push(results[x].getId());
			
			nlapiLogExecution("debug","Diamond ID: " + results[x].getId(),"Date Needed for Return: " + results[x].getValue(dateFormulaCol));
			
			diamonds.push({
				id : results[x].getId(),
				date_needed_for_return : results[x].getValue(dateFormulaCol)
			});
		}
	}
	
	if(baseDiamondIDs!=null && baseDiamondIDs!="" && baseDiamondIDs.length > 0)
	{
		//Search for sales orders containing diamonds
		var orderedDiamonds = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("item",null,"anyof",baseDiamondIDs));
		filters.push(new nlobjSearchFilter("status",null,"anyof",["SalesOrd:A","SalesOrd:B"]));
		var cols = [];
		cols.push(new nlobjSearchColumn("item"));
		var results = nlapiSearchRecord("salesorder",null,filters,cols);
		if(results)
		{
			nlapiLogExecution("debug","Story #1 - Sales Order Diamonds","# Diamonds Returned: " + results.length);
			
			for(var x=0; x < results.length; x++)
			{
				orderedDiamonds.push(results[x].getValue("item"));
			}
		}
		
		//Search for appointments within next 7 days
		var apptDiamonds = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("startdate","custrecord_appointment_item_parent","within",todayDate,sevenDaysDate));
		filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"anyof",baseDiamondIDs));
		if(orderedDiamonds!=null && orderedDiamonds!="" && orderedDiamonds.length > 0)
			filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"noneof",orderedDiamonds));
		var cols = [];
		cols.push(new nlobjSearchColumn("custrecord_appointment_item_itemid"));
		cols.push(new nlobjSearchColumn("startdate","custrecord_appointment_item_parent"));
		var results = nlapiSearchRecord("customrecord_appointment_item",null,filters,cols);
		if(results)
		{
			nlapiLogExecution("debug","Story #1 - Appt Diamonds","# Diamonds Returned: " + results.length);
			
			for(var x=0; x < results.length; x++)
			{
				for(i=0; i < diamonds.length; i++)
				{
					if(diamonds[i].id == results[x].getValue("custrecord_appointment_item_itemid"))
					{
						if(diamonds[i].date_needed_for_return >= results[x].getValue("startdate","custrecord_appointment_item_parent"))
						{
							apptDiamonds.push(results[x].getValue("custrecord_appointment_item_itemid"));
						}
						break;
					}
				}
			}
		}
		
		//Return all diamonds minus the ones on orders and with appointments so they can be updated
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"anyof",baseDiamondIDs));
		if(orderedDiamonds!=null && orderedDiamonds!="" && orderedDiamonds.length > 0)
			filters.push(new nlobjSearchFilter("internalid",null,"noneof",orderedDiamonds));
		if(apptDiamonds!=null && apptDiamonds!="" && apptDiamonds.length > 0)
			filters.push(new nlobjSearchFilter("internalid",null,"noneof",apptDiamonds));
		filters.push(new nlobjSearchFilter("locationquantityavailable",null,"greaterthan","0"));
		filters.push(new nlobjSearchFilter("inventorylocation",null,"anyof",["2","10","14"]));
		var cols = [];
		cols.push(new nlobjSearchColumn("inventorylocation"));
		var results = nlapiSearchRecord("item",null,filters,cols);
		if(results)
		{
			nlapiLogExecution("debug","# Search Results - Final - Story #1",results.length);
			
			for(var x=0; x < results.length; x++)
			{
				nlapiLogExecution("debug","Updating Item Internal ID: " + results[x].getId(),"Location: " + results[x].getValue("inventorylocation"));
				
				try
				{
					if(after2==true)
					{
						switch(results[x].getValue("inventorylocation"))
						{
							case "2":
								nlapiSubmitField(results[x].getRecordType(),results[x].getId(),["custitem192","custitem40"],[nlapiDateToString(nlapiAddDays(now,1),"date"),"4"]);
								break;
							case "10":
							case "14":
								nlapiSubmitField(results[x].getRecordType(),results[x].getId(),["custitem192","custitem40"],[nlapiDateToString(nlapiAddDays(now,2),"date"),"4"]);
								break;	
						}
					}
					else
					{
						switch(results[x].getValue("inventorylocation"))
						{
							case "2":
								nlapiSubmitField(results[x].getRecordType(),results[x].getId(),["custitem192","custitem40"],[nlapiDateToString(now,"date"),"4"]);
								break;
							case "10":
							case "14":
								nlapiSubmitField(results[x].getRecordType(),results[x].getId(),["custitem192","custitem40"],[nlapiDateToString(nlapiAddDays(now,1),"date"),"4"]);
								break;	
						}
					}	
				}
				catch(err)
				{
					nlapiLogExecution("error","Error Updating Exp Return Date (Story #1)","Item: " + results[x].getId() + "\n\nDetails: " + err.message);
				}
			}
		}	
	}
	
	nlapiLogExecution("debug","Finished Processing Story #1");
	
//Story #2 - Any Returned Diamonds (Item Link PO contains 'unset')
	var filters = [];
	filters.push(new nlobjSearchFilter("custitem192",null,"noton",searchFilter));
	var cols = [];
	var dateFormulaCol = new nlobjSearchColumn("formuladate");
	dateFormulaCol.setFormula("{custitem108} + (TO_NUMBER({preferredvendor.custentityreturn_terms}) - 5)");
	cols.push(dateFormulaCol);
	var results = nlapiSearchRecord("item","customsearch_diamond_vra_story_2",filters,cols);
	if(results)
	{
		nlapiLogExecution("debug","Story #2 Results",results.length);
		
		for(var x=0; x < results.length; x++)
		{
			baseDiamondIDs2.push(results[x].getId());
			
			var po_status,date_needed_in_sf;
			
			if(results[x].getValue("custcol5","custitem142").indexOf("unset")!=-1)
			{
				po_status = results[x].getValue("status","custitem142");
				date_needed_in_sf = results[x].getValue("custbody59","custitem142");
			}
			else if(results[x].getValue("custcol5","custitem144").indexOf("unset")!=-1)
			{
				po_status = results[x].getValue("status","custitem144");
				date_needed_in_sf = results[x].getValue("custbody59","custitem144");
			}
			else if(results[x].getValue("custcol5","custitem146").indexOf("unset")!=-1)
			{
				po_status = results[x].getValue("status","custitem146");
				date_needed_in_sf = results[x].getValue("custbody59","custitem146");
			}
			
			//Verify that diamond doesn't already exist in array (in case of multiple line items having 'unset' in them)
			var diamondExists = false;
			for(var i=0; i < diamonds2.length; i++)
			{
				if(diamonds2[i].id == results[x].getId())
				{
					diamondExists = true;
					break;
				}
			}
			
			if(diamondExists == false)
			{
				diamonds2.push({
					id : results[x].getId(), 
					status : po_status,
					date_needed_in_sf : date_needed_in_sf,
					date_needed_for_return : results[x].getValue(dateFormulaCol)
				});	
			}
		}
	}
	
	nlapiLogExecution("debug","diamonds2",JSON.stringify(diamonds2));
	
	if(baseDiamondIDs2!=null && baseDiamondIDs2!="" && baseDiamondIDs2.length > 0)
	{
		var apptDiamonds2 = [];
	
		var filters = [];
		filters.push(new nlobjSearchFilter("startdate","custrecord_appointment_item_parent","within",todayDate,sevenDaysDate));
		filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"anyof",baseDiamondIDs2));
		var cols = [];
		cols.push(new nlobjSearchColumn("custrecord_appointment_item_itemid"));
		cols.push(new nlobjSearchColumn("startdate","custrecord_appointment_item_parent"));
		var results = nlapiSearchRecord("customrecord_appointment_item",null,filters,cols);
		if(results)
		{
			nlapiLogExecution("debug","Story #2 - Appt Diamonds","# Diamonds Returned: " + results.length);
			
			for(var x=0; x < results.length; x++)
			{
				for(i=0; i < diamonds2.length; i++)
				{
					if(diamonds2[i].id == results[x].getValue("custrecord_appointment_item_itemid"))
					{
						if(diamonds2[i].date_needed_for_return >= results[x].getValue("startdate","custrecord_appointment_item_parent"))
						{
							apptDiamonds2.push(results[x].getValue("custrecord_appointment_item_itemid"));
						}
						break;
					}
				}
			}
		}
		
		for(var x=0; x < diamonds2.length; x++)
		{
			var apptFound = false;
			
			for(var i=0; i < apptDiamonds2.length; i++)
			{
				if(diamonds2[x].id == apptDiamonds2[i])
				{
					apptFound = true;
					break;
				}
			}
			
			if(apptFound == false)
			{
				try
				{
					if(diamonds2[x].status=="pendingReceipt")
					{
						//If PO Status = Pending Receipt
						nlapiSubmitField("inventoryitem",diamonds2[x].id,["custitem192","custitem40"],[diamonds2[x].date_needed_in_sf,"4"]);
					}
					else
					{
						//Otherwise set Expected Return Date to today if before 2PM or tomorrow if after
						if(after2==false)
						{
							nlapiSubmitField("inventoryitem",diamonds2[x].id,["custitem192","custitem40"],[nlapiDateToString(now,"date"),"4"]);
						}
						else
						{
							nlapiSubmitField("inventoryitem",diamonds2[x].id,["custitem192","custitem40"],[nlapiDateToString(nlapiAddDays(now,1),"date"),"4"]);
						}
					}	
				}
				catch(err)
				{
					nlapiLogExecution("error","Error Updating Exp Return Date (Story #2)","Item: " + diamonds2[x].id + "\n\nDetails: " + err.message);
				}
			}
		}
	}
	
	nlapiLogExecution("debug","Finished Processing Story #2");
	
//Story #3 - Gemstone Status = 'To Be Returned' for any Not Eye Clean diamonds
	var filters = [];
	filters.push(new nlobjSearchFilter("custitem192",null,"noton",searchFilter));
	var cols = [];
	cols.push(new nlobjSearchColumn("internalid",null,"group"));
	var dateFormulaCol = new nlobjSearchColumn("formuladate",null,"group");
	dateFormulaCol.setFormula("{custitem108} + (TO_NUMBER({preferredvendor.custentityreturn_terms}) - 5)");
	cols.push(dateFormulaCol);
	var results = nlapiSearchRecord("item","customsearch_diamond_vra_story_3",filters,cols);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			baseDiamondIDs3.push(results[x].getValue("internalid",null,"group"));
			
			diamonds3.push({
				id : results[x].getValue("internalid",null,"group"), 
				date_needed_for_return : results[x].getValue(dateFormulaCol)
			});
		}
	}
	
	nlapiLogExecution("debug","baseDiamondIDs3",JSON.stringify(baseDiamondIDs3));
	nlapiLogExecution("debug","diamonds3",JSON.stringify(diamonds3));
	
	if(baseDiamondIDs3!=null && baseDiamondIDs3!="" && baseDiamondIDs3.length > 0)
	{
		var apptDiamonds3 = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("startdate","custrecord_appointment_item_parent","within",todayDate,sevenDaysDate));
		filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"anyof",baseDiamondIDs3));
		var cols = [];
		cols.push(new nlobjSearchColumn("custrecord_appointment_item_itemid"));
		cols.push(new nlobjSearchColumn("startdate","custrecord_appointment_item_parent"));
		var results = nlapiSearchRecord("customrecord_appointment_item",null,filters,cols);
		if(results)
		{
			nlapiLogExecution("debug","Story #3 - Appt Diamonds","# Diamonds Returned: " + results.length);
			
			for(var x=0; x < results.length; x++)
			{
				for(i=0; i < diamonds3.length; i++)
				{
					if(diamonds3[i].id == results[x].getValue("custrecord_appointment_item_itemid"))
					{
						if(diamonds3[i].date_needed_for_return >= results[x].getValue("startdate","custrecord_appointment_item_parent"))
						{
							apptDiamonds3.push(results[x].getValue("custrecord_appointment_item_itemid"));
						}
						break;
					}
				}
			}
		}
		
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"anyof",baseDiamondIDs3));
		if(apptDiamonds3!=null && apptDiamonds3!="" && apptDiamonds3.length > 0)
			filters.push(new nlobjSearchFilter("internalid",null,"noneof",apptDiamonds3));
		var results = nlapiSearchRecord("item",null,filters);
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				try
				{
					if(after2==true)
					{
						nlapiSubmitField(results[x].getRecordType(),results[x].getId(),"custitem192",nlapiDateToString(nlapiAddDays(now,1),"date"));
					}
					else
					{
						nlapiSubmitField(results[x].getRecordType(),results[x].getId(),"custitem192",nlapiDateToString(now,"date"));
					}	
				}
				catch(err)
				{
					nlapiLogExecution("error","Error Updating Exp Return Date (Story #3)","Item: " + results[x].getId() + "\n\nDetails: " + err.message);
				}
			}
		}
	}
	
	
	
	nlapiLogExecution("debug","Finished Processing Story #3");	
}
