//v17 - Includes updates for CYO earrings/pendants (NS-1192)
//v18 - Contains updates for NS-1266 (Update Auto IF with PP Insurance for FedEx Shipping Address)
//v19 - Removed NS-1266 changes

function Gen_Fedex_Label(shipId,autoIF)
{
	nlapiLogExecution("debug","Generating FedEx International Label...");
	
	var shipment = nlapiLoadRecord("itemfulfillment",shipId);
	var salesOrderId = shipment.getFieldValue("createdfrom");
	
	var labelObj = {
		ship_timestamp : "",
		insurance_value : "",
		ship_addressee : "",
		ship_attention : "",
		ship_address_1 : "",
		ship_address_2 : "",
		ship_city : "",
		ship_state : "",
		ship_zipcode : "",
		ship_country : "",
		ship_phone : "",
		invoice_number : "",
		ship_date : "",
		customer_reference : "",
		terms_of_sale : "DDU",
		use_be_importer : false,
		ein : "203413075",
		third_party_duty : false,
		eei : "",
		items : [],
		purpose_of_shipment : "",
		currency : "",
		customs_value : "",
		comment_1 : "",
		comment_2 : "",
		comment_3 : "",
		au_tax_wording : "",
		bill_dtf : true,
		allowETD : true,
		discount : "",
		key : "",
		password : "",
		accountnumber : "",
		meternumber : "",
		dsr : "yes",
		saturday_delivery : false,
		othertaxes : "",
		dept : ""
	};
	
	var shipCountry = null;
	var isNewOrder = false;
	var hasServiceItems = false;
	var serviceAmountZero = true;
	var isDropShip = false;
	var deliveryDateObj = null;
	var fullInsuranceAmount = 0.00;
	var subtotal = 0.00;
	var postSale = false;
	var returnTrackingNumber = "";
	
	var items = [];
	
	var comment1 = null, comment2 = null, comment3 = null;
	
	var custbodyCreatedFrom = nlapiLookupField("salesorder",salesOrderId,"custbody_created_from");
	
	//Int Comp Item Field
	var intCompField = "custitem237";
		
	//Type of Insurance Field (transaction body)
	var insuranceTypeField = "custbody354";
		
	var insuranceType = null;
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",salesOrderId));
	filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
	filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
	filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
	filters.push(new nlobjSearchFilter("type","item","noneof","Discount"));
	if(custbodyCreatedFrom!=null && custbodyCreatedFrom!="")
		filters.push(new nlobjSearchFilter("mainline","custbody_created_from","is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("trandate"));
	cols.push(new nlobjSearchColumn("item"));
	cols.push(new nlobjSearchColumn("line"));
	cols.push(new nlobjSearchColumn("custitem1","item")); //Metal Type
	cols.push(new nlobjSearchColumn("custitem27","item")); //Carat Weight
	cols.push(new nlobjSearchColumn("type","item")); //Carat Weight
	cols.push(new nlobjSearchColumn("memo"));
	cols.push(new nlobjSearchColumn("rate"));
	cols.push(new nlobjSearchColumn("quantity"));
	cols.push(new nlobjSearchColumn("fxamount"));
	cols.push(new nlobjSearchColumn("custbody87")); //Type of Order
	cols.push(new nlobjSearchColumn("custitem20","item"));
	cols.push(new nlobjSearchColumn("custbody8")); //Customer Contact Phone
	cols.push(new nlobjSearchColumn("shipaddressee"));
	cols.push(new nlobjSearchColumn("shippingattention"));
	cols.push(new nlobjSearchColumn("shipaddress1"));
	cols.push(new nlobjSearchColumn("shipaddress2"));
	cols.push(new nlobjSearchColumn("shipcity"));
	cols.push(new nlobjSearchColumn("shipstate"));
	cols.push(new nlobjSearchColumn("shipzip"));
	cols.push(new nlobjSearchColumn("shipcountry"));
	cols.push(new nlobjSearchColumn("currency"));
	cols.push(new nlobjSearchColumn("custbody39")); //Drop Ship Materials Sent to Vendor
	cols.push(new nlobjSearchColumn("custbody6")); //Delivery Date
	cols.push(new nlobjSearchColumn("custbody_full_insurance_amount")); //Full Insurance Amount
	cols.push(new nlobjSearchColumn("custbody_aes_eei")); //AES/EEI
	cols.push(new nlobjSearchColumn("custbodyloose_gem_order")); //Loose Gem Order
	cols.push(new nlobjSearchColumn("custcol_full_insurance_value"));
	cols.push(new nlobjSearchColumn("custbody_full_insurance_amount"));
	cols.push(new nlobjSearchColumn("custbody69","custbody_created_from")); //Created from Tracking #
	cols.push(new nlobjSearchColumn("custbody123")); //Return Tracking #
	cols.push(new nlobjSearchColumn("custcol_gift_item"));
	cols.push(new nlobjSearchColumn(insuranceTypeField));
	cols.push(new nlobjSearchColumn(intCompField,"item"));
	cols.push(new nlobjSearchColumn("custitem_ci_fee","item"));
	cols.push(new nlobjSearchColumn("isspecialorderitem","item"));
	cols.push(new nlobjSearchColumn("custitem20","item"));
	cols.push(new nlobjSearchColumn("netamountnotax"));
	cols.push(new nlobjSearchColumn("taxtotal"));
	cols.push(new nlobjSearchColumn("location"));
	cols.push(new nlobjSearchColumn("custcol_item_price"));
	cols.push(new nlobjSearchColumn("total"));
	cols.push(new nlobjSearchColumn("custbody194"));
	cols.push(new nlobjSearchColumn("custbody87"));
	cols.push(new nlobjSearchColumn("custcol_center_gem"));
	cols.push(new nlobjSearchColumn("exchangerate"));
	var results = nlapiSearchRecord("salesorder",null,filters,cols);
	if(results)
	{
		nlapiLogExecution("debug","Search Results Found...");
		
		var useNewGBLogic = false;
		var trandate = results[0].getValue("trandate");
		trandate = nlapiStringToDate(trandate);
		nlapiLogExecution("debug","trandate object",trandate.toString());
		var cutOffDate = new Date(2017,5,22); //*****NEED TO CHANGE BEFORE PRODUCTION****
		nlapiLogExecution("debug","cutOffDate object",cutOffDate.toString());
		if(trandate >= cutOffDate && results[0].getValue("shipcountry")=="GB")
			useNewGBLogic = true;
		
		nlapiLogExecution("debug","Use New GB Logic?",useNewGBLogic);
		//var location = results[0].getValue("location");
		var location = shipment.getLineItemValue("item","location","1"); //Changed 6-14-18 to pull location from first line item on IF record (v15a)
		
		//Check for Saturday delivery
		if(results[0].getValue("custbody194")!=null && results[0].getValue("custbody194")!="")
		{
			nlapiLogExecution("debug","Delivery Instructions",results[0].getText("custbody194"));
			
			if(results[0].getText("custbody194").indexOf("Saturday Delivery")!=-1)
				labelObj.saturday_delivery = true;
				
			nlapiLogExecution("debug","Is Saturday Delivery?",labelObj.saturday_delivery);
		}
		
		//Handle australia logic
		if(results[0].getValue("shipcountry")=="AU")
		{
			labelObj.dept = "24 369 770 344";
			
			nlapiLogExecution("debug","Tax Total: " + results[0].getValue("taxtotal"),"Exchange Rate: " + results[0].getValue("exchangerate"));
			
			labelObj.othertaxes = nlapiFormatCurrency(results[0].getValue("taxtotal") / results[0].getValue("exchangerate"));
		}
		
		//Get FedEx API information from custom record for that location
		var apiFilters = [];
		apiFilters.push(new nlobjSearchFilter("custrecord_fedex_int_location",null,"is",location));
		var apiCols = [];
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_account_number"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_meter_number"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_key"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_password"));
		var apiResults = nlapiSearchRecord("customrecord_fedex_integration_key",null,apiFilters,apiCols);
		if(apiResults)
		{
			labelObj.key = apiResults[0].getValue("custrecord_fedex_int_key");
			labelObj.password = apiResults[0].getValue("custrecord_fedex_int_password");
			labelObj.accountnumber = apiResults[0].getValue("custrecord_fedex_int_account_number");
			labelObj.meternumber = apiResults[0].getValue("custrecord_fedex_int_meter_number");
		}
		
		shipCountry = results[0].getValue("shipcountry");
		labelObj.ship_phone = results[0].getValue("custbody8");
		labelObj.invoice_number = results[0].getValue("tranid");
		labelObj.eei = results[0].getValue("custbody_aes_eei");
		labelObj.currency = results[0].getValue("currency");
		
		insuranceType = results[0].getValue(insuranceTypeField);
		
		if(results[0].getValue("custbody123")!=null && results[0].getValue("custbody123")!="")
			returnTrackingNumber = results[0].getValue("custbody123");
		else
			returnTrackingNumber = results[0].getValue("custbody69","custbody_created_from");
		
		if(results[0].getValue("custbody87")=="1")
			isNewOrder = true;
		
		//If Country is United Kingdom, Canada, Guam, Northern Mariana Islands, Puerto Rico or Australia bill Third Party (194375506) else bill Receipient	
		if((useNewGBLogic==true && results[0].getValue("shipcountry")=="GB") ||results[0].getValue("shipcountry")=="CA" || results[0].getValue("shipcountry")=="GU" || results[0].getValue("shipcountry")=="MP" || results[0].getValue("shipcountry")=="PR" || results[0].getValue("shipcountry")=="AU")
			labelObj.bill_dtf = false;
		
		switch(labelObj.currency)
		{
			case "1":
				labelObj.currency = "USD";
				break;
			case "3":
				labelObj.currency = "CAD";
				break;
			case "5":
				labelObj.currency = "AUD";
				break;
			case "2":
				labelObj.currency = "UKL";
				break;
		}
		
		nlapiLogExecution("debug","Currency",labelObj.currency);
		
		//Check if order is under $250, if under $250 then do not require signature
		if(results[0].getValue("custbody87")=="1" && results[0].getValue("total") < 250)
			labelObj.dsr = "";
		
		//Update EIN for UK orders
		if(shipCountry=="GB" && useNewGBLogic)
			labelObj.ein = "GB267103319000";
		
		if(results[0].getValue("custbody87")=="1") //Type Of Order = New Order
			labelObj.purpose_of_shipment = "SOLD";
		else if(useNewGBLogic && shipCountry=="GB" && results[0].getValue("custbody87")!="1" && results[0].getValue("custbody87")!="5")
			labelObj.purpose_of_shipment = "REPAIR_AND_RETURN";
		else
			labelObj.purpose_of_shipment = "REPAIR_AND_RETURN";
			
		if(results[0].getValue("custbody87")=="2" || results[0].getValue("custbody87")=="3" || results[0].getValue("custbody87")=="4" ||  results[0].getValue("custbody87")=="5")
			postSale = true;
			
		if(postSale==true && results[0].getValue("shipcountry")=="GB")
			useNewGBLogic = true;
		
		//Address fields for recipient
		labelObj.ship_addressee = results[0].getValue("shipaddressee");
		labelObj.ship_attention = results[0].getValue("shippingattention");
		nlapiLogExecution("debug","Ship Attention Field",results[0].getValue("shippingattention"));
		labelObj.ship_address_1 = results[0].getValue("shipaddress1");
		labelObj.ship_address_2 = results[0].getValue("shipaddress2");
		labelObj.ship_city = results[0].getValue("shipcity");
		labelObj.ship_state = results[0].getValue("shipstate");
		labelObj.ship_zipcode = results[0].getValue("shipzip");
		labelObj.ship_country = results[0].getValue("shipcountry");
		
		if(results[0].getValue("custbody39")!=null && results[0].getValue("custbody39")!="")
			isDropShip = true;
			
		deliveryDateObj = nlapiStringToDate(results[0].getValue("custbody6"));
		
		//Check if country does not allow ETD
		nlapiLogExecution("debug","Ship Country",results[0].getValue("shipcountry"));
		switch(results[0].getValue("shipcountry"))
		{
			
			case "AE":
			case "AN":
			case "AO":
			case "BD":
			case "BN":
			case "BS":
			case "BQ":
			case "CW":
			case "DJ":
			case "DO":
			case "EG":
			case "GH":
			case "GP":
			case "GT":
			case "HN":
			case "JO":
			case "KE":
			case "KH":
			case "KN":
			case "KW":
			case "KY":
			case "LA":
			case "LC":
			case "LS":
			case "MF":
			case "MG":
			case "MS":
			case "MT":
			case "OM":
			case "PA":
			case "SA":
			case "SV":
			case "VG":
			case "SX":
			case "TC":
			case "TL":
			case "TT":
			case "VG":
			case "VI":
				labelObj.allowETD = false;
				break;
		}
		
		//fullInsuranceAmount = results[0].getValue("custbody_full_insurance_amount");
		
		var customsValue = 0.00;
		
		nlapiLogExecution("debug","Results.length",results.length);
		
		//Calculate subtotal
		for(var x=0; x < results.length; x++)
		{
			//Verify item is on IF
			var match = false;
			for(var i=0; i < shipment.getLineItemCount("item"); i++)
			{
				nlapiLogExecution("debug","SO Search Line: " + results[x].getValue("line"),"IF Orderline: " + shipment.getLineItemValue("item","orderline",i+1));
				
				if(results[x].getValue("line") == shipment.getLineItemValue("item","orderline",i+1))
				{
					match = true;
					break;
				}
			}
			
			if(match==true)
			{
				if(useNewGBLogic)
					subtotal += (parseFloat(Math.abs(results[x].getValue("custcol_item_price"))));
				else
					subtotal += (parseFloat(Math.abs(results[x].getValue("fxamount"))));
					
				fullInsuranceAmount += (parseFloat(Math.abs(results[x].getValue("custcol_full_insurance_value"))));
			}
		}
		
		nlapiLogExecution("debug","Subtotal",subtotal);
		
		var amountField = "fxamount";
		if(useNewGBLogic)
			amountField = "custcol_item_price";
		
		for(var x=0; x < results.length; x++)
		{
			//Verify item is on IF
			var match = false;
			for(var i=0; i < shipment.getLineItemCount("item"); i++)
			{
				if(results[x].getValue("line")==shipment.getLineItemValue("item","orderline",i+1))
				{
					match = true;
					break;
				}
			}
			
			if(!match)
			{
				nlapiLogExecution("debug","Item Not Found on IF","Item: " + results[x].getText("item") + "  |  Line: " + results[x].getValue("line"));
				continue;
			}
			
			nlapiLogExecution("debug","Item Type",results[x].getValue("type","item"));
			
			//Skip over anything with production insurance value = $0 or EMPTY
			if(results[x].getValue("custitem_ci_fee","item")=="F" && results[x].getValue(intCompField,"item")=="F" && results[x].getValue("custcol_gift_item")=="F" && (results[x].getValue("custcol_full_insurance_value")==null || results[x].getValue("custcol_full_insurance_value")=="" || results[x].getValue("custcol_full_insurance_value")==0.00))
				continue;
			
			nlapiLogExecution("debug","Category (0,5)",results[x].getText("custitem20","item").substring(0,5));
			
			if(results[x].getValue("custitem20","item")=="12")
			{
				//Service
				hasServiceItems = true;
				
				if(results[x].getValue(amountField) > 0)
					serviceAmountZero = false;
			}
			
			if(results[x].getValue("custitem20","item")=="2")
			{
				//Category = Setting with Large Center Stone
				var description = results[x].getText("custitem1","item") + " Engagement Ring";
				var quantity = 1;
				var amount = parseFloat(results[x].getValue(amountField));
				
				//Check for center stone
				for(var d=0; d < results.length; d++)
				{
					//Verify item is on IF
					var match = false;
					for(var i=0; i < shipment.getLineItemCount("item"); i++)
					{
						if(results[d].getValue("line")==shipment.getLineItemValue("item","orderline",i+1))
						{
							match = true;
							break;
						}
					}
					
					if(match==true)
					{
						var category = results[d].getText("custitem20","item");
						if(category!=null && category!="" && category.indexOf("Loose")!=-1)
						{
							amount += parseFloat(results[d].getValue(amountField));
						}
						else if(category=="Pearls" && results[d].getValue(amountField)!=null && results[d].getValue(amountField)!=null && results[d].getValue(amountField) > 0)
						{
							//NS-482 (Pearls)
							amount += parseFloat(results[d].getValue(amountField));
						}
					}
				}
				
				customsValue += amount;
				
				items.push({
					description : description,
					quantity : 1,
					amount : nlapiFormatCurrency(amount),
					haromized_code : "7113190000",
					country_of_mfg : "US",
					currency : labelObj.currency
				});
			}
			else if(results[x].getValue("isspecialorderitem","item")=="T" && (results[x].getValue("custitem20","item")=="4" || results[x].getValue("custitem20","item")=="5" || results[x].getValue("custitem20","item")=="6"))
			{
				//Category = Earrings, Pendant or Finding where Special Order Item = Checked
				nlapiLogExecution("debug","CYO Earring, Pendant or Finding","Checking for center stone too...");
				
				var description = results[x].getValue("memo");
				var quantity = results[x].getValue("quantity");
				var amount = parseFloat(results[x].getValue(amountField));
				
				var center_gem = results[x].getValue("custcol_center_gem");
				if(center_gem!=null && center_gem!="")
				{
					if(center_gem.indexOf(",")==-1)
					{
						var temp = center_gem;
						center_gem = [];
						center_gem.push(temp);
					}
					else
					{
						center_gem = center_gem.split(",");
					}
					
					nlapiLogExecution("debug","# Center Gems",center_gem.length);
					
					for(var cg = 0; cg < center_gem.length; cg++)
					{
						nlapiLogExecution("debug","Looking for center gem: " + center_gem[cg]);
						
						for(var d=0; d < results.length; d++)
						{
							//Verify item is on IF
							var match = false;
							for(var i=0; i < shipment.getLineItemCount("item"); i++)
							{
								if(results[d].getValue("line")==shipment.getLineItemValue("item","orderline",i+1))
								{
									match = true;
									break;
								}
							}
							
							if(match==true)
							{
								var itemName = results[d].getText("item");
								var category = results[d].getText("custitem20","item");
								
								nlapiLogExecution("debug","Center Gem Name: **" + center_gem[cg] + "**","Item Sublist Name: **" + itemName + "**");
								
								if(itemName==center_gem[cg].trim())
								{
									nlapiLogExecution("debug","Found Center Gem " + itemName,"Category: " + category);
									
									if(category.indexOf("Loose")!=-1)
										amount += parseFloat(results[d].getValue(amountField));
									else if(category=="Pearls" && results[d].getValue(amountField)!=null && results[d].getValue(amountField)!=null && results[d].getValue(amountField) > 0)
										amount += parseFloat(results[d].getValue(amountField));
										
									break;
								}
							}
						}
					}
					
					customsValue += amount;
				}
				else
				{
					//Check for center stone
					for(var d=0; d < results.length; d++)
					{
						//Verify item is on IF
						var match = false;
						for(var i=0; i < shipment.getLineItemCount("item"); i++)
						{
							if(results[d].getValue("line")==shipment.getLineItemValue("item","orderline",i+1))
							{
								match = true;
								break;
							}
						}
						
						if(match==true)
						{
							var category = results[d].getText("custitem20","item");
							if(category!=null && category!="" && category.indexOf("Loose")!=-1)
							{
								amount += parseFloat(results[d].getValue(amountField));
							}
							else if(category=="Pearls" && results[d].getValue(amountField)!=null && results[d].getValue(amountField)!=null && results[d].getValue(amountField) > 0)
							{
								//NS-482 (Pearls)
								amount += parseFloat(results[d].getValue(amountField));
							}
						}
					}
					
					customsValue += amount;
				}
				
				items.push({
					description : description,
					quantity : quantity,
					amount : nlapiFormatCurrency(amount),
					haromized_code : "7113190000",
					country_of_mfg : "US",
					currency : labelObj.currency
				});
			}
			else if(results[x].getValue("custitem20","item")=="3")
			{
				//Category = Setting with no Large Center Stone
				var description = results[x].getText("custitem1","item") + " Wedding Band";
				var quantity = results[x].getValue("quantity");
				var amount = parseFloat(results[x].getValue(amountField));
				
				customsValue += amount;
				
				items.push({
					description : description,
					quantity : results[x].getValue("quantity"),
					amount : amount / results[x].getValue("quantity"),
					haromized_code : "7113190000",
					country_of_mfg : "US",
					currency : labelObj.currency
				});
			}
			else if(results[x].getValue("type","item")=="Discount")
			{
				//labelObj.discount = results[x].getValue(amountField);
			}
			else if(results[x].getValue("custitem_ci_fee","item")=="F" && postSale==true && results[x].getValue("custitem20","item")=="12" && results[x].getValue("memo")!=null && results[x].getValue("memo")!="")
			{
				nlapiLogExecution("debug","Post Sale - Service Item - With Description");
				
				//Service Items with Description NOT EMPTY
				items.push({
					description : results[x].getValue("memo"),
					quantity : 1,
					amount : (results[x].getValue("custcol_full_insurance_value") / 0.8),
					haromized_code : "7113190000",
					country_of_mfg : "US",
					currency : labelObj.currency
				});
				
				customsValue += (results[x].getValue("custcol_full_insurance_value") / 0.8);
				
				if(results[x].getValue(amountField)==0)
				{
					nlapiLogExecution("debug","Amount Empty - Adding $20");
					
					items.push({
						description : "Repair Cost",
						quantity : 1,
						amount : 20.00,
						haromized_code : "7113190000",
						country_of_mfg : "US",
						currency : labelObj.currency
					});
					
					customsValue += 20.00;
				}
				else if(results[x].getValue(amountField) > 0)
				{
					nlapiLogExecution("debug","Amount Not Empty - Adding Line Amount");
					
					items.push({
						description : "Repair Cost",
						quantity : 1,
						amount : (results[x].getValue(amountField)),
						haromized_code : "7113190000",
						country_of_mfg : "US",
						currency : labelObj.currency
					});
					
					customsValue += parseFloat(results[x].getValue(amountField));
				}
			}
			else if((results[x].getValue("custbody87")=="4" || results[x].getValue("custbodyloose_gem_order")=="T") && results[x].getText("custitem20","item").substring(0,5)=="Loose")
			{
				//Loose Gem Orders
				if(results[x].getValue("custbody87")=="4")
				{
					items.push({
						description : results[x].getValue("memo") + " set in customer item.",
						quantity : 1,
						amount : (results[x].getValue(amountField)),
						haromized_code : "7102.39.0010",
						country_of_mfg : "US",
						currency : labelObj.currency
					});
				}
				else
				{
					if(results[x].getValue("custitem20","item")=="7")
					{
						//Loose Diamonds
						if(results[x].getValue("custitem27","item") <= 0.50)
						{
							items.push({
								description : "Non industrial polished diamond weighing not over 0.5 carat each",
								quantity : 1,
								amount : (results[x].getValue(amountField)),
								haromized_code : "7102.39.0010",
								country_of_mfg : "US",
								currency : labelObj.currency
							});
						}
						else
						{
							items.push({
								description : "Non industrial polished diamond weighing over 0.5 carat each",
								quantity : 1,
								amount : (results[x].getValue(amountField)),
								haromized_code : "7102.39.0050",
								country_of_mfg : "US",
								currency : labelObj.currency
							});
						}
					}
					else if(results[x].getValue("custitem20","item")=="8")
					{
						//Loose Sapphire
						items.push({
							description : "Precious stones and semiprecious stones - Sapphires",
							quantity : 1,
							amount : (results[x].getValue(amountField)),
							haromized_code : "7103.91.0020",
							country_of_mfg : "US",
							currency : labelObj.currency
						});
					}
					else if(results[x].getValue("custitem20","item")=="20")
					{
						//Loose Emerald
						items.push({
							description : "Precious stones and semiprecious stones - Emeralds",
							quantity : 1,
							amount : (results[x].getValue(amountField)),
							haromized_code : "7103.91.0030",
							country_of_mfg : "US",
							currency : labelObj.currency
						});
					}
					else
					{
						//All other Loose categories...
						items.push({
							description : results[x].getValue("memo"),
							quantity : 1,
							amount : (results[x].getValue(amountField)),
							haromized_code : "7113190000",
							country_of_mfg : "US",
							currency : labelObj.currency
						});
					}
				}
				
				
				customsValue += parseFloat(results[x].getValue(amountField));
			}
			else if(postSale==true && results[x].getValue(amountField)==0.00 && results[x].getValue("custitem20","item")!="12" && results[x].getValue("custitem20","item")!="1" && results[x].getValue("custitem20","item")!="23" && results[x].getValue("custitem20","item")!="30")
			{
				//$0 amount and not service category items
				items.push({
					description : results[x].getValue("memo"),
					quantity : results[x].getValue("quantity"),
					amount : 20.00,
					haromized_code : "7113190000",
					country_of_mfg : "US",
					currency : labelObj.currency
				});
				
				customsValue += 20.00;
			}
			else if(results[x].getValue(amountField)!=0.00 && results[x].getValue("custitem20","item")!="12" && results[x].getValue("custitem20","item")!="1" && results[x].getValue("custitem20","item")!="23" && results[x].getValue("custitem20","item")!="30")
			{
				nlapiLogExecution('debug','Index of "Loose"',results[x].getText("custitem20","item").indexOf("Loose"));
				
				if(results[x].getText("custitem20","item").indexOf("Loose")==-1)
				{
					var qty = results[x].getValue("quantity");
					if(qty==null || qty=="")
						qty = "1";
					
					nlapiLogExecution("debug","Category",results[x].getText("custitem20","item"));
					
					if(results[x].getValue("custitem20","item")=="21")
						continue;
					
					//All other Loose categories...
					items.push({
						description : results[x].getValue("memo"),
						quantity : qty,
						amount : (results[x].getValue(amountField)),
						haromized_code : "7113190000",
						country_of_mfg : "US",
						currency : labelObj.currency
					});
					
					customsValue += parseFloat(results[x].getValue(amountField));
				}
			}
			else if(results[x].getValue("item")=="2724544")
			{
				//Surprise Gift Item
				items.push({
					description : "Complimentary Silver Jewelry",
					quantity : results[x].getValue("quantity"),
					amount : 20.00,
					haromized_code : "7113190000",
					country_of_mfg : "US",
					currency : labelObj.currency
				});
			}
			else if(results[x].getValue(amountField)==0.00 && results[x].getValue("custitem20","item")!="12" && results[x].getValue("custitem20","item")!="1" && results[x].getValue("custitem20","item")!="23" && results[x].getValue("custitem20","item")!="30")
			{
				nlapiLogExecution('debug','Index of "Loose"',results[x].getText("custitem20","item").indexOf("Loose"));
				
				if(results[x].getText("custitem20","item").indexOf("Loose")==-1 && results[x].getValue("item")!="53547")
				{
					//All other Loose categories...
					items.push({
						description : results[x].getValue("memo"),
						quantity : results[x].getValue("quantity"),
						amount : 20.00,
						haromized_code : "7113190000",
						country_of_mfg : "US",
						currency : labelObj.currency
					});
					
					customsValue += parseFloat(results[x].getValue(amountField));
				}
			}
			else if(results[x].getValue("custitem_ci_fee","item")=="T" && results[x].getValue(amountField) > 0)
			{
				//CI Fee/Discount
				items.push({
					description : results[x].getValue("memo"),
					quantity : "1",
					amount : (results[x].getValue(amountField)),
					haromized_code : "7113190000",
					country_of_mfg : "US",
					currency : labelObj.currency
				});
				
				customsValue += parseFloat(results[x].getValue(amountField));

				if(results.length == 1)
				{
					customsValue += (parseFloat(results[x].getValue("custcol_full_insurance_value"))  / 0.80);
					subtotal += (parseFloat(results[x].getValue("custcol_full_insurance_value")) / 0.80);
				}
			}
			else
			{
				nlapiLogExecution("debug","Not falling into logic at all...","Amount: " + results[x].getValue(amountField));
			}
			
			//subtotal += parseFloat(results[x].getValue(amountField));
		}
	}
	
	nlapiLogExecution("debug","Items JSON",JSON.stringify(items));
	
	labelObj.items = items;
	labelObj.customs_value = (customsValue);
	
	nlapiLogExecution("debug","Customs Value",customsValue);
	
	//Ship Date = Today. If Drop Ship Materials Sent To Vendor != Empty, Then Ship Date = Delivery Day - 1 Business Day
	nlapiLogExecution("debug","Is Drop Ship?",isDropShip);
	
	var shipDate = new Date();
	if(isDropShip==true)
	{
		nlapiLogExecution("debug","Delivery Date",nlapiDateToString(deliveryDateObj,"date"));
		
		shipDate = nlapiAddDays(deliveryDateObj,-1);
		nlapiLogExecution("debug","Delivery Date - 1",nlapiDateToString(shipDate,"date"));
		
		nlapiLogExecution("debug","Ship Date Day",shipDate.getDay());
		
		switch(shipDate.getDay())
		{
			case 0: //Sunday
				shipDate = nlapiAddDays(shipDate,-2);
				break;
			case 6: //Saturday
				shipDate = nlapiAddDays(shipDate,-1);
				break;
		}
		
		nlapiLogExecution("debug","Ship Date",nlapiDateToString(shipDate,"date"));
	}
	
	//Generate shipment timestamp
	var now = shipDate;
	var timestamp = "" + now.getFullYear() + "-";
	var month = now.getMonth();
	month = month + 1;
	if(month < 10)
		timestamp += "0" + month + "-";
	else
		timestamp += month + "-";
	
	if(now.getDate() < 10)
		timestamp += "0" + now.getDate() + "T";
	else
		timestamp += now.getDate() + "T";
	
	if(now.getHours() < 10)
		timestamp += "0" + now.getHours() + ":";
	else
		timestamp += now.getHours() + ":";
		
	if(now.getMinutes() < 10)
		timestamp += "0" + now.getMinutes() + ":";
	else
		timestamp += now.getMinutes() + ":";
		
	if(now.getSeconds() < 10)
		timestamp += "0" + now.getSeconds();
	else
		timestamp += now.getSeconds();
		
	labelObj.ship_timestamp = timestamp;
	
	nlapiLogExecution("debug","Insurance Type",insuranceType);
	
	if(parseFloat(subtotal) > 0)
		var label_insurance = (subtotal * 0.80);
	else
		var label_insurance = (fullInsuranceAmount);
	
	var fedExInsLimit = "";
	var parcelProLimit = 25000;
	
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecord_insurance_limit_country",null,"is",shipCountry));
	filters.push(new nlobjSearchFilter("custrecord_shipping_method",null,"is","2531266")); //FedEx International Priority
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_fedex_insurance_limit"));
	cols.push(new nlobjSearchColumn("custrecord_parcel_pro_insurance_limit"));
	var results = nlapiSearchRecord("customrecord_shipping_country_insurance",null,filters,cols);
	if(results)
	{
		if(results[0].getValue("custrecord_fedex_insurance_limit")!=null && results[0].getValue("custrecord_fedex_insurance_limit")!="")
			fedExInsLimit = results[0].getValue("custrecord_fedex_insurance_limit");
		if(results[0].getValue("custrecord_parcel_pro_insurance_limit")!=null && results[0].getValue("custrecord_parcel_pro_insurance_limit")!="")
			parcelProLimit = results[0].getValue("custrecord_parcel_pro_insurance_limit");
	}
	
	if(insuranceType=="2")
	{
		//Insurance Type = 'FedEx'
		nlapiLogExecution("debug","Using BEF label","Label Insurance: " + label_insurance);
		
		labelObj.customer_reference = "BEF8956" + parseInt(label_insurance) + "X1560";
	}
	else if(insuranceType=="1")
	{
		//Insurance Type = 'Parcel Pro'
		if((label_insurance / 0.80) > parcelProLimit)
		{
			nlapiLogExecution("debug","Using RE2014 label","Subtotal: " + (label_insurance / 0.80) + " - " + parcelProLimit);
			
			labelObj.customer_reference = "RE2014" + parseInt((label_insurance / 0.80) - parcelProLimit) + "200305";
			fullInsuranceAmount = parcelProLimit;
		}
		else
		{
			nlapiLogExecution("debug","Using RE2014 label","Label Insurance: " + label_insurance);
			labelObj.customer_reference = "RE2014" + parseInt(label_insurance / 0.80) + "200305";	
		}
	}
	else
	{
		//Do not create label
		return true;
	}
	
	if(shipCountry=="AU")
		labelObj.insurance_value = (subtotal);
	else
		labelObj.insurance_value = (fullInsuranceAmount);
		
	nlapiLogExecution("debug","Insurance Value",labelObj.insurance_value);
	
	//Ensure insurance value does not exceed customs value
	if(labelObj.insurance_value > labelObj.customs_value)
		labelObj.customs_value = labelObj.insurance_value;
	
	//Terms of Sale (Use DDP for United Kingdom, Canada, Guam, Northern Mariana Islands, Puerto Rico and Australia. Everything else use DDU)
	if((useNewGBLogic==true && shipCountry=="GB") || shipCountry=="CA" || shipCountry=="GU" || shipCountry=="MP" || shipCountry=="PR" || shipCountry=="AU")
	{
		labelObj.terms_of_sale = "DDP";
		labelObj.use_be_importer = true;
	}
	else if(autoIF==true)
	{
		//Prevent international labels from creating when country is DDU on automatically generated labels only. Buttons will still generate. 
		return true;
	}
	
	//Comments
	if(shipCountry=="AU")
	{
		comment1 = "AUSFTA duty exemption Section 153YE rule type P.S.";
		labelObj.au_tax_wording = "Please see OTHER section below for GST amount collected.";
		
		if(isNewOrder==false && serviceAmountZero==true)
		{
			comment2 = "Repair covered under warranty at no cost to customer";
			comment3 = "Proof of Export AWB " + returnTrackingNumber;
		}
		else if(isNewOrder==false && serviceAmountZero==false)
		{
			comment2 = "Proof of Export AWB " + returnTrackingNumber;
		}
	}
	else if(shipCountry=="GB" && useNewGBLogic)
	{
		//Get CPR ship timestamp
		var originalExportDate = null;
		if(returnTrackingNumber!=null && returnTrackingNumber!="")
		{
			var cprFilters = [];
			cprFilters.push(new nlobjSearchFilter("custrecord_tracking_id",null,"is",returnTrackingNumber));
			var cprCols = [];
			cprCols.push(new nlobjSearchColumn("custrecord_ship_time_stamp"));
			var cprResults = nlapiSearchRecord("customrecord_custom_package_record",null,cprFilters,cprCols);
			if(cprResults)
			{
				originalExportDate = cprResults[0].getValue("custrecord_ship_time_stamp");
			}
		}
		
		
		if(isNewOrder==false && serviceAmountZero==true)
		{
			comment1 = "Repair covered under warranty at no cost to customer";
			comment2 = "Proof of Export AWB " + returnTrackingNumber;
			comment3 = "Personal belongings previously exported " + "Originally exported on " + originalExportDate;
		}
		else if(isNewOrder==false && serviceAmountZero==false)
		{
			comment1 = "Proof of Export AWB " + returnTrackingNumber;
			comment2 = "Personal belongings previously exported";
			comment3 = "Originally exported on " + originalExportDate;
		}
	}
	else
	{
		if(isNewOrder==false && serviceAmountZero==true)
		{
			comment1 = "Repair covered under warranty at no cost to customer";
			comment2 = "Proof of Export AWB " + returnTrackingNumber;
		}
		else if(isNewOrder==false && serviceAmountZero==false)
		{
			comment1 = "Proof of Export AWB " + returnTrackingNumber;
		}
	}
	
	labelObj.comment_1 = comment1;
	labelObj.comment_2 = comment2;
	labelObj.comment_3 = comment3;
	
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
	{
		var templateID = "27193939"; //FedEx International Tag API v8 - FedEx CI - PROD.xml
		var folderID = "8762529";
	}
	else
	{
		var templateID = "27193939"; //FedEx International Tag API v8 - FedEx CI - PROD.xml
		var folderID = "8762529";
	}
	
	
	var templateFile = nlapiLoadFile(templateID);
	var template = templateFile.getValue();
	var xmlTemp = Handlebars.compile(template);
	
	var soap = xmlTemp(labelObj);
	
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
	{
		//Create Request Log file
		var requestFile = nlapiCreateFile(labelObj.invoice_number + "_Request.txt","PLAINTEXT",soap);
		requestFile.setFolder("8771896");
		var requestFileId = nlapiSubmitFile(requestFile);
	}
	else if(nlapiGetContext().getEnvironment()=="PRODUCTION" && nlapiGetContext().getSetting("SCRIPT","custscript_log_soap")=="T")
	{
		//Create Request Log file
		var requestFile = nlapiCreateFile(labelObj.invoice_number + "_Request.txt","PLAINTEXT",soap);
		requestFile.setFolder("8771896");
		var requestFileId = nlapiSubmitFile(requestFile);
	}
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
	
	var body = cResp.getBody();
	
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
	{
		//Create Response Log file
		var responseFile = nlapiCreateFile(labelObj.invoice_number + "_Response.txt","PLAINTEXT",body);
		responseFile.setFolder("8771896");
		var responseFileId = nlapiSubmitFile(responseFile);
	}
	else if(nlapiGetContext().getEnvironment()=="PRODUCTION" && nlapiGetContext().getSetting("SCRIPT","custscript_log_soap")=="T")
	{
		//Create Request Log file
		var responseFile = nlapiCreateFile(labelObj.invoice_number + "_Response.txt","PLAINTEXT",body);
		responseFile.setFolder("8771896");
		var responseFile = nlapiSubmitFile(responseFile);
	}
	
	var xmlBody = nlapiStringToXML(body);
	
	//Check for errors and handle appropriately
	var errors = [];
	var errorNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='Notifications']");
	for(var x=0; x < errorNodes.length; x++)
	{
		var code = nlapiSelectValue(errorNodes[x],".//*[name()='Code']");
		var message = nlapiSelectValue(errorNodes[x],".//*[name()='Message']");
		var severity = nlapiSelectValue(errorNodes[x],".//*[name()='Severity']");
		
		nlapiLogExecution("error","Error Code: " + code,"Message: " + message);
		
		if(code=="0000")
			continue;
			
		if(severity=="WARNING" || severity=="NOTE")
			continue;
		
		errors.push({
			code : code,
			message : message
		});
	}
	
	if(errors.length == 0)
	{
		var partsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='Label']/*[name()='Parts']")
		var imageXml = nlapiSelectValue(partsNode,".//*[name()='Image']");
		
		nlapiLogExecution("debug","Image XML",imageXml);
		
		var partsNode2 = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='ShipmentDocuments']/*[name()='Parts']")
		var commercialInvoiceXml = nlapiSelectValue(partsNode2,".//*[name()='Image']");
		
		nlapiLogExecution("debug","Commercial Invoice XML",commercialInvoiceXml);
		
		var trackingNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='TrackingIds']");
		var trackingNumber = nlapiSelectValue(trackingNode,".//*[name()='TrackingNumber']");
		
		nlapiLogExecution("debug","Tracking Number",trackingNumber);
		
		//Get last 4 digits of tracking #
		var last4 = trackingNumber.substring(trackingNumber.length - 4);
		
		var image2xml = null;
		var ciPNG = null;
		
		try
		{
			var testNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='PackageDocuments']");
			var labelType = nlapiSelectValue(testNode,".//*[name()='Type']");
			if(labelType=="AUXILIARY_LABEL")
			{
				var partsNode3 = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='PackageDocuments']/*[name()='Parts']")
				if(partsNode3!=null && partsNode3!='')
				{
					image2xml = nlapiSelectValue(partsNode3,".//*[name()='Image']");
					nlapiLogExecution("debug","Image XML (2)",image2xml);	
				}
			}
		}
		catch(e1)
		{
			nlapiLogExecution("error","Error Handling Label #2","Details: " + e1.message);
		}
		
		var ifLabelFields = nlapiLookupField("itemfulfillment",shipId,["custbody_fedex_shipping_label","custbody_commercial_invoice","custbody_fedex_label_png","custbody_fedex_label_png_2","custbody_fedex_label_png_3"]);
		if(ifLabelFields.custbody_commercial_invoice!=null && ifLabelFields.custbody_commercial_invoice!="")
			nlapiDeleteFile(ifLabelFields.custbody_commercial_invoice);
		if(ifLabelFields.custbody_fedex_shipping_label!=null && ifLabelFields.custbody_fedex_shipping_label!="")
			nlapiDeleteFile(ifLabelFields.custbody_fedex_shipping_label);
		if(ifLabelFields.custbody_fedex_label_png!=null && ifLabelFields.custbody_fedex_label_png!="")
			nlapiDeleteFile(ifLabelFields.custbody_fedex_label_png);
		if(ifLabelFields.custbody_fedex_label_png_2!=null && ifLabelFields.custbody_fedex_label_png_2!="")
			nlapiDeleteFile(ifLabelFields.custbody_fedex_label_png_2);
		if(ifLabelFields.custbody_fedex_label_png_3!=null && ifLabelFields.custbody_fedex_label_png_3!="")
			nlapiDeleteFile(ifLabelFields.custbody_fedex_label_png_3);
		
		var labelfile = nlapiCreateFile(labelObj.invoice_number + "_" + last4 + "_intlabel.png","PNGIMAGE",imageXml);
		labelfile.setFolder(folderID); //Return Shipping Labels
		labelfile.setIsOnline(true);
		var labelFileID = nlapiSubmitFile(labelfile);
		
		var labelFileID2 = "";
		if(image2xml!=null)
		{
			var labelfile2 = nlapiCreateFile(labelObj.invoice_number + "_" + last4 + "_intlabel_2.png","PNGIMAGE",image2xml);
			labelfile2.setFolder(folderID);
			labelfile2.setIsOnline(true);
			labelFileID2 = nlapiSubmitFile(labelfile2);
		}
		
		var labelFileID3 = "";
		
		var labelFileObj = nlapiLoadFile(labelFileID);
		var labelImageUrl = labelFileObj.getURL();
		if(nlapiGetContext().getEnvironment()=="PRODUCTION")
			labelImageUrl = "https://system.na3.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
		else
			labelImageUrl = "https://system.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
			
		var pdfxml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
		pdfxml+= "<pdf>";
			pdfxml+= "<body width='4.00in' height='6.00in' padding='0' margin='0.00in'>";
				pdfxml+= "<img src='" + labelImageUrl + "' dpi='200'/>";
				
				if(image2xml!=null)
				{
					var labelFileObj2 = nlapiLoadFile(labelFileID2);
					var labelImageUrl2 = labelFileObj2.getURL();
					if(nlapiGetContext().getEnvironment()=="PRODUCTION")
						labelImageUrl2 = "https://system.na3.netsuite.com" + labelImageUrl2.replace(/&/g,"&amp;");
					else
						labelImageUrl2 = "https://system.netsuite.com" + labelImageUrl2.replace(/&/g,"&amp;");
						
					pdfxml+= "<pbr/>";
					pdfxml+= "<img src='" + labelImageUrl2 + "' dpi='200'/>";
				}
				
			pdfxml+= "</body>";
		pdfxml+= "</pdf>";
		
		var pdfFileObj = nlapiXMLToPDF(pdfxml);
			pdfFileObj.setName(labelObj.invoice_number + "_" + last4 + "_intlabel.pdf");
			pdfFileObj.setFolder(folderID);
			pdfFileObj.setIsOnline(true);
		var pdfFileId = nlapiSubmitFile(pdfFileObj);
		
		var ciFile = nlapiCreateFile(labelObj.invoice_number + "_" + last4 + " commercial_invoice.pdf","PDF",commercialInvoiceXml);
		ciFile.setFolder(folderID); //Return Shipping Labels
		ciFile.setIsOnline(true);
		var ciFileID = nlapiSubmitFile(ciFile);
		
		nlapiSubmitField("itemfulfillment",shipId,["custbody_fedex_shipping_label","custbody_commercial_invoice","custbody_fedex_label_png","custbody_fedex_label_png_2","custbody_fedex_ws_tracking_number","custbody_fedex_label_png_3"],[pdfFileId,ciFileID,labelFileID,labelFileID2,trackingNumber,labelFileID3]);
		
		//Output PDF to screen for user
		if(autoIF==false)
		{
			response.setContentType("PDF",labelObj.invoice_number + "intlabel.pdf","inline");
			response.write(pdfFileObj.getValue());
		}
	}
	else
	{
		//Store errors back on IF record
		nlapiLogExecution("debug","Writing errors to custom field",JSON.stringify(errors));
		
		nlapiSubmitField("itemfulfillment",shipId,"custbody_fedex_error_message",JSON.stringify(errors));
		
		if(autoIF==false)
		{
			var responseHTML = "The following errors have occurred:<br/><br/>";
		
			for(var x=0; x < errors.length; x++)
			{
				responseHTML += errors[x].code + ": " + errors[x].message + "<br/><br/>";
			}
			
			response.write(responseHTML);
		}
	}
}
