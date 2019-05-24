function Exchange_Page(request,response)
{
	if(request.getMethod()=="GET")
	{
		try
		{
			//Get Sales Order from Parameter
			var sales_order = request.getParameter("order");
			var soRec = nlapiLoadRecord("salesorder",sales_order);
			
			var form = nlapiCreateForm("New Exchange");
			form.setScript("customscript_exchange_page_client_script");
			
			//Create Field Groups
			form.addFieldGroup("exchange","Exchange");
			form.addFieldGroup("delivery","Delivery/Shipping");
			form.addFieldGroup("items","Item Details");
			
			//Exchange Section Form Fields
			var fld = form.addField("custpage_customer","select","Customer","customer","exchange");
			fld.setMandatory(true);
			fld.setDefaultValue(soRec.getFieldValue("entity"));
			
			fld = form.addField("custpage_date","date","Date",null,"exchange");
			fld.setMandatory(true);
			var today = new Date();
			fld.setDefaultValue(nlapiDateToString(today,"date"));
			
			fld = form.addField("custpage_so_num","text","Sales Order Number");
			fld.setDefaultValue(soRec.getFieldValue("tranid"));
			fld.setDisplayType("hidden");
			
			fld = form.addField("custpage_so_total","currency","Sales Order Total");
			fld.setDefaultValue(soRec.getFieldValue("total"));
			fld.setDisplayType("hidden");
			
			fld = form.addField("custpage_created_from","select","Created From","salesorder","exchange");
			fld.setMandatory(true);
			fld.setDisplayType("inline");
			fld.setDefaultValue(sales_order);
			
			fld = form.addField("custpage_orig_sales_rep","select","Original Sales Rep","employee","exchange");
			fld.setMandatory(true);
			fld.setDisplayType("inline");
			fld.setDefaultValue(soRec.getFieldValue("salesrep"));
			
			fld = form.addField("custpage_new_sales_rep","select","New Sales Rep",null,"exchange");
			var filters = [];
			filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
			filters.push(new nlobjSearchFilter("salesrep",null,"is","T"));
			var cols = [];
			cols.push(new nlobjSearchColumn("entityid"));
			var results = nlapiSearchRecord("employee",null,filters,cols);
			if(results)
			{
				fld.addSelectOption("","");
				for(var x=0; x < results.length; x++)
				{
					fld.addSelectOption(results[x].getId(),results[x].getValue("entityid"));
				}
			}
			fld.setMandatory(true);
			fld.setDefaultValue(nlapiGetUser());
			
			fld = form.addField("custpage_actual_ship_date","date","Actual Ship Date",null,"exchange");
			fld.setMandatory(true);
			fld.setDefaultValue(nlapiLookupField("salesorder",sales_order,"actualshipdate"));
			fld.setDisplayType("disabled");
			
			fld = form.addField("custpage_so_imp_notes","textarea","Sales Order Important Notes",null,"exchange");
			fld.setDefaultValue(soRec.getFieldValue("custbody58"));
			fld.setDisplayType("disabled");
			
			fld = form.addField("custpage_reason_for_return","select","Reason For Return","customlist21","exchange");
			fld.setMandatory(true);
			
			fld = form.addField("custpage_type_of_send_back","select","Type of Send Back","customlist22","exchange");
			fld.setMandatory(true);
			fld.setDefaultValue("6"); //Default to EXCHANGE
			
			fld = form.addField("custpage_exchange_notes","longtext","Exchange Notes",null,"exchange");
			fld.setMandatory(true);
			
			fld = form.addField("custpage_place_of_sale","select","Place of Sale","classification","exchange");
			fld.setMandatory(true);
			fld.setDefaultValue(2); //Phone: Not Bank Wire
			fld.setDisplayType("disabled");
			
			fld = form.addField("custpage_amount_paid","float","Amount Paid By Customer",null,"exchange");
			fld.setMandatory(true);
			//fld.setDefaultValue(nlapiLookupField("salesorder",sales_order,"custbody55"));
			
			//Delivery/Shipping Section Form Fields
			fld = form.addField("custpage_delivery_date","date","Delivery Date",null,"delivery");
			fld.setMandatory(true);
			
			form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm",null,"delivery");
			
			form.addField("custpage_date_recd_at_be","date","Date Received at BE from Customer",null,"delivery");
			
			fld = form.addField("custpage_addressee","text","Addressee",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipaddressee"));
			fld = form.addField("custpage_address_1","text","Address Line 1",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipaddr1"));
			fld = form.addField("custpage_address_2","text","Address Line 2",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipaddr2"));
			fld = form.addField("custpage_city","text","City",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipcity"));
			fld = form.addField("custpage_state","text","State",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipstate"));
			fld = form.addField("custpage_zip","text","Zip Code",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipzip"));
			fld = form.addField("custpage_country","text","Country",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipcountry"));
			
			form.addField("custpage_pickup_at_be","checkbox","Pick-up at BE",null,"delivery");
			
			form.addField("custpage_return_shipping_label","checkbox","Return Shipping Label",null,"delivery");
			
			//Item Details Section Form Fields
			fld = form.addField("custpage_items_returned","multiselect","Item(s) Returned",null,"items");
			fld.setMandatory(true);
			for(var x=0; x < soRec.getLineItemCount("item"); x++)
			{
				if(soRec.getLineItemValue("item","isclosed",x+1)=="F")
					fld.addSelectOption(soRec.getLineItemValue("item","item",x+1),soRec.getLineItemText("item","item",x+1));
			}
			
			var itemList = form.addSubList("custpage_new_items","inlineeditor","New Item(s) Ordered");
			fld = itemList.addField("custpage_new_items_item","select","Item","item");
			fld.setMandatory(true);
			itemList.addField("custpage_new_items_desc","text","Description");
			fld = itemList.addField("custpage_new_items_qty","integer","Quantity");
			fld.setMandatory(true);
			fld = itemList.addField("custpage_new_items_rate","currency","Rate");
			fld.setMandatory(true);
			itemList.addField("custpage_new_items_amount","currency","Amount");
			fld.setMandatory(true);
			
			form.addSubmitButton();
			
			response.writePage(form);		
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating Exchange Page UI","Details: " + err.message);
			return true;
		}
	}
	else
	{
		try
		{
			//Get POST variables
			var customer = request.getParameter("custpage_customer");
			var trandate = request.getParameter("custpage_date");
			var created_from = request.getParameter("custpage_created_from");
			var original_salesrep = request.getParameter("custpage_orig_sales_rep");
			var new_salesrep = request.getParameter("custpage_new_sales_rep");
			var so_notes = request.getParameter("custpage_so_imp_notes");
			var return_reason = request.getParameter("custpage_reason_for_return");
			var type_of_send_back = request.getParameter("custpage_type_of_send_back");
			var exchange_notes = request.getParameter("custpage_exchange_notes");
			var actual_ship_date = request.getParameter("custpage_actual_ship_date");
			var delivery_date = request.getParameter("custpage_delivery_date");
			var delivery_date_firm = request.getParameter("custpage_delivery_date_firm");
			var date_received_at_be = request.getParameter("custpage_date_recd_at_be");
			var pickup_at_be = request.getParameter("custpage_pickup_at_be");
			var return_shipping_label = request.getParameter("custpage_return_shipping_label");
			var items_returned = request.getParameterValues("custpage_items_returned");
			var so_num = request.getParameter("custpage_so_num");
			var place_of_sale = request.getParameter("custpage_place_of_sale");
			var amount_paid = request.getParameter("custpage_amount_paid");
			var so_total = request.getParameter("custpage_so_total");
			var items_not_returned = [];
			
			nlapiLogExecution("debug","(POST) Parameters Retrieved");
			
			//Get Shipping Information From Form
			var addressee = request.getParameter("custpage_addressee");
			var address1 = request.getParameter("custpage_address_1");
			var address2 = request.getParameter("custpage_address_2");
			var city = request.getParameter("custpage_city");
			var state = request.getParameter("custpage_state");
			var zipcode = request.getParameter("custpage_zip");
			var country = request.getParameter("custpage_country");
			
			nlapiLogExecution("debug","(POST) Shipping Info Retrieved");
			
			var new_items = [];
			for(var x=0; x < request.getLineItemCount("custpage_new_items"); x++)
			{
				new_items.push({
					item : request.getLineItemValue("custpage_new_items","custpage_new_items_item",x+1),
					quantity : request.getLineItemValue("custpage_new_items","custpage_new_items_qty",x+1),
					rate : request.getLineItemValue("custpage_new_items","custpage_new_items_rate",x+1)
				});
			}
			
			nlapiLogExecution("debug","(POST) New Item List Retrieved");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Getting POST Values","Details: " + err.message);
			return true;
		}
		
		try
		{
			//Create RA for customer
			var ra = nlapiTransformRecord("salesorder",created_from,"returnauthorization");
			ra.setFieldValue("tranid",so_num+"EX");
			
			//Check if transaction ID already exists
			var tranid = ra.getFieldValue("tranid");
			ra.setFieldValue("tranid",checkRaNumber(tranid,null));
			
			ra.setFieldValue("custbody32",return_reason);
			ra.setFieldValue("custbody35",type_of_send_back);
			ra.setFieldValue("custbody14",exchange_notes);
			
			nlapiLogExecution("debug","(POST) RA Line Item Count",ra.getLineItemCount("item"));
			
			var keepMelee = false;
			for(var x=0; x < ra.getLineItemCount("item"); x++)
			{
				var found = false;
				for(var z=0; z < items_returned.length; z++)
				{
					if(ra.getLineItemValue("item","item",x+1)==items_returned[z])
					{
						var itemCat = nlapiLookupField("item",ra.getLineItemValue("item","item",x+1),"custitem20");
						if(itemCat=="2")
							keepMelee = true;
						
						found = true;
						break;
					}
				}
				
				if(!found)
				{
					var itemCat = nlapiLookupField("item",ra.getLineItemValue("item","item",x+1),"custitem20");
					if(keepMelee && itemCat=="1")
					{
						continue;
					}
					else
					{
							items_not_returned.push({
								id: ra.getLineItemValue("item","item",x+1),
								desc: ra.getLineItemValue("item","description",x+1),
								val: ra.getLineItemValue("item","amount",x+1)
							});
						ra.removeLineItem("item",x+1);
						x--;	
					}
				}
			}
			
			//Update Shipping Address if Necessary
			var updateAddress = false;
			
			if(address1 != ra.getFieldValue("shipaddr1"))
				updateAddress = true;
			if(!updateAddress && address2 != ra.getFieldValue("shipaddr2"))
				updateAddress = true;
			if(!updateAddress && city != ra.getFieldValue("shipcity"))
				updateAddress = true;
			if(!updateAddress && state != ra.getFieldValue("shipstate"))
				updateAddress = true;
			if(!updateAddress && zipcode != ra.getFieldValue("shipzip"))
				updateAddress = true;
			if(!updateAddress && country != ra.getFieldValue("shipcountry"))
				updateAddress = true;
			if(!updateAddress && addressee != ra.getFieldValue("shipaddressee"))
				updateAddress = true;
				
			if(updateAddress)
			{
				var attention = ra.getFieldValue("shipattention");
					
				ra.setFieldValue("shipaddresslist","");
				ra.setFieldValue("shipaddressee",addressee);
				if(attention!=null && attention!="")
					ra.setFieldValue("shipattention",attention);
				ra.setFieldValue("shipaddr1",address1);
				ra.setFieldValue("shipaddr2",address2);
				ra.setFieldValue("shipcity",city);
				ra.setFieldValue("shipstate",state);
				ra.setFieldValue("shipzip",zipcode);
				ra.setFieldValue("shipcountry",country);
				
				var shipaddress = "";
				if(attention!=null && attention!="")
					shipaddress += attention + "\n";
				shipaddress += addressee + "\n";
				shipaddress += address1 + "\n";
				if(address2!=null && address2!="")
					shipaddress += address2 + "\n";
				shipaddress += city + " " + state + " " + zipcode + "\n";
				shipaddress += country;
				
				ra.setFieldValue("shipaddress",shipaddress);
			}
			
			nlapiSubmitRecord(ra,true,true);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating Return Authorization","Details: " + err.message);
			return true;
		}
		
		try
		{
			//Create new Sales Order
			var newOrder = nlapiTransformRecord("customer",customer,"salesorder");
			newOrder.setFieldValue("tranid",so_num + "EX");
			
			//Check if transaction ID already exists
			var tranid = newOrder.getFieldValue("tranid");
			newOrder.setFieldValue("tranid",checkNumber(tranid,null));
			
			//Set created from (original sales order)
			newOrder.setFieldValue("custbody_created_from",created_from);
			
			newOrder.setFieldValue("entity",customer);
			newOrder.setFieldValue("salesrep",new_salesrep);
			newOrder.setFieldValue("custbody58",exchange_notes);
			newOrder.setFieldValue("custbody6",delivery_date);
			newOrder.setFieldValue("custbody87","4"); //Type of Order = Exchange
			newOrder.setFieldValue("custbody82",delivery_date_firm);
			newOrder.setFieldValue("custbody53",pickup_at_be);
			//newOrder.setFieldValue("custpage_return_shipping_label",return_shipping_label);
			newOrder.setFieldValue("custbody132",2); //Diamond Confirmed New (default to No)
			newOrder.setFieldValue("custbody55",amount_paid); //Amount Paid By Customer
			newOrder.setFieldValue("class",place_of_sale); //Place of Sale
			newOrder.setFieldValue("custbody84","1"); //Fraud Check=Yes
			if(return_shipping_label=="T")
			{
				newOrder.setFieldValue("custbody138","1"); //Return Label Status = Return label needed
			}
			newOrder.setFieldValue("custbody36",date_received_at_be); //Date Received at BE from Customer
			
			var diamondDescription = "";
			var ringDescription = "";
			var insuranceValue = 0.00;
			
			nlapiLogExecution("debug","# Items NOT Returned",items_not_returned.length);
			for(var x=0; x < items_not_returned.length; x++)
			{
				insuranceValue += parseFloat(items_not_returned[x].val);
				
				var category = nlapiLookupField("item",items_not_returned[x].id,"custitem20");
				nlapiLogExecution("debug","Item Category",category);
				if(category=="2")
				{
					ringDescription = items_not_returned[x].desc;
					//ringDescription += "\n insurance value: " + so_total;
					break;	
				}
				else if(category=="7" || category=="8")
				{
					diamondDescription = items_not_returned[x].desc;
					//diamondDescription += "\n insurance value: " + so_total;
					break;
				}
			}
			
			ringDescription += "\n insurance value: " + nlapiFormatCurrency(insuranceValue);
			diamondDescription += "\n insurance value: " + nlapiFormatCurrency(insuranceValue);
			
			nlapiLogExecution("debug","Diamond Desc",diamondDescription);
			nlapiLogExecution("debug","Ring Desc",ringDescription);
			
			var newItemAmount = 0.00;
			
			for(var x=0; x < new_items.length; x++)
			{
				newOrder.selectNewLineItem("item");
				newOrder.setCurrentLineItemValue("item","item",new_items[x].item);
				newOrder.setCurrentLineItemValue("item","quantity",new_items[x].quantity);
				if(diamondDescription!="")
					newOrder.setCurrentLineItemValue("item","custcol5",diamondDescription);
				else if(ringDescription!="")
					newOrder.setCurrentLineItemValue("item","custcol5",ringDescription);
					
				newItemAmount += parseFloat(newOrder.getCurrentLineItemValue("item","amount"));
				newOrder.commitLineItem("item");
			}
			
			var fullInsuranceAmt = (newItemAmount + insuranceValue) * 0.8;
			newOrder.setFieldValue("custbody_full_insurance_amount",nlapiFormatCurrency(fullInsuranceAmt));
			for(var x=0; x < newOrder.getLineItemCount("item"); x++)
			{
				newOrder.setLineItemValue("item","custcol_full_insurance_value",x+1,fullInsuranceAmt);
			}
			
			//Update Shipping Address if Necessary
			var updateAddress = false;
			
			if(address1 != newOrder.getFieldValue("shipaddr1"))
				updateAddress = true;
			if(!updateAddress && address2 != newOrder.getFieldValue("shipaddr2"))
				updateAddress = true;
			if(!updateAddress && city != newOrder.getFieldValue("shipcity"))
				updateAddress = true;
			if(!updateAddress && state != newOrder.getFieldValue("shipstate"))
				updateAddress = true;
			if(!updateAddress && zipcode != newOrder.getFieldValue("shipzip"))
				updateAddress = true;
			if(!updateAddress && country != newOrder.getFieldValue("shipcountry"))
				updateAddress = true;
			if(!updateAddress && addressee != newOrder.getFieldValue("shipaddressee"))
				updateAddress = true;
				
			if(updateAddress)
			{
				newOrder.setFieldValue("shipaddressee",addressee);
				newOrder.setFieldValue("shipaddr1",address1);
				newOrder.setFieldValue("shipaddr2",address2);
				newOrder.setFieldValue("shipcity",city);
				newOrder.setFieldValue("shipstate",state);
				newOrder.setFieldValue("shipzip",zipcode);
				newOrder.setFieldText("shipcountry",country);
				
				var shipaddress = "";
				shipaddress += addressee + "\n";
				shipaddress += address1 + "\n";
				if(address2!=null && address2!="")
					shipaddress += address2 + "\n";
				shipaddress += city + " " + state + " " + zipcode;
				
				newOrder.setFieldValue("shipaddress",shipaddress);
			}
			
			newOrder.setFieldValue("tranid",so_num + "EX");
			var orderID = nlapiSubmitRecord(newOrder,true,true);
			response.sendRedirect("RECORD","salesorder",orderID);
			
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating New Sales Order","Details: " + err.message);
			return true;
		}
	}
}

function Exchange_Page_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var so = nlapiGetRecordId();
			var orderStatus = nlapiLookupField("salesorder",so,"status");

			if(orderStatus=="fullyBilled" || orderStatus=="closed")
			{
				var suitelet = nlapiResolveURL("SUITELET","customscript_exchange_page","customdeploy_exchange_page");
				suitelet += "&order=" + so;
				form.addButton("custpage_exchange","Exchange","window.location.href='"+suitelet+"';");	
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Exchange Button Error","Details: " + err.message);
			return true;
		}
	}
}

function checkNumber(tranid,index)
{
	
	var filters = [];
	if(index==null)
		filters.push(new nlobjSearchFilter("tranid",null,"is",tranid));
	else
		filters.push(new nlobjSearchFilter("tranid",null,"is",tranid+index));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var results = nlapiSearchRecord("salesorder",null,filters);
	if(results)
	{
		return checkNumber(tranid,index+1);
	}
	else
	{
		if(index!=null)
			return tranid+index;
		else
			return tranid;
	}
}

function checkRaNumber(tranid,index)
{
	
	var filters = [];
	if(index==null)
		filters.push(new nlobjSearchFilter("tranid",null,"is",tranid));
	else
		filters.push(new nlobjSearchFilter("tranid",null,"is",tranid+index));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var results = nlapiSearchRecord("returnauthorization",null,filters);
	if(results)
	{
		return checkNumber(tranid,index+1);
	}
	else
	{
		if(index!=null)
			return tranid+index;
		else
			return tranid;
	}
}