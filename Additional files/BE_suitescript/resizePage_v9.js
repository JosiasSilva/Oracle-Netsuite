var RESIZE = "2";
var REPAIR = "3";
var ENGRAVING = "8";
var WEDDING_BAND = "5";
var EXCHANGE = "4";

var TYPE_RING = "3";
var TYPE_PENDANT = "5";
var TYPE_EARRINGS = "4";
var TYPE_FINISHED = "9";
var TYPE_PEARLS = "21";
var TYPE_LOOSE_DIAMOND = "7";
var TYPE_LOOSE_SAPPHIRE = "8";

function resizePage_Btn(type,form)
{
	if(type=="view")
	{
		try	
		{
			var so = nlapiGetRecordId();
			var orderStatus = nlapiLookupField("salesorder",so,"status");

			if(orderStatus=="fullyBilled" || orderStatus=="closed")
			{
				var resizeLink = nlapiResolveURL("SUITELET","customscript_resize","customdeploy_resize") + "&so=" + so;
				
				form.addButton("custpage_resize","Resize","window.location.href='"+resizeLink+"';");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Resize Button Error","Details: " + err.message);
			return true;
		}
	}
}

function resizePage(request,response)
{
	if(request.getMethod()=="GET")
	{
		try
		{
			var order = request.getParameter("so");
			var soRec = nlapiLoadRecord("salesorder",order);
			
			var form = nlapiCreateForm("New Resize Order");
			
			form.addFieldGroup("info_group","Order Information");
			form.addFieldGroup("item_group","Item Details");
			form.addFieldGroup("delivery_group","Delivery/Shipping");
			
			var fld = form.addField("custpage_customer","select","Customer Name","customer","info_group");
			fld.setMandatory(true);
			fld.setDefaultValue(soRec.getFieldValue("entity"));
			
			fld = form.addField("custpage_actual_ship_date","date","Actual Ship Date",null,"info_group");
			fld.setDefaultValue(nlapiLookupField("salesorder",order,"actualshipdate"));
			fld.setMandatory(true);
			
			fld = form.addField("custpage_items","multiselect","Items",null,"item_group");
			for(var x=0; x < soRec.getLineItemCount("item"); x++)
			{
				if(soRec.getLineItemValue("item","isclosed",x+1)=="F")
					fld.addSelectOption(soRec.getLineItemValue("item","item",x+1),soRec.getLineItemText("item","item",x+1));
			}
			fld.setMandatory(true);
			
			fld = form.addField("custpage_new_size_item_1","float","New size of item 1",null,"item_group");
			fld.setMandatory(true);
			
			fld = form.addField("custpage_new_size_item_2","float","New size of item 2",null,"item_group");
			
			fld = form.addField("custpage_delivery_date","date","Delivery Date",null,"delivery_group");
			fld.setMandatory(true);
			
			fld = form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm",null,"delivery_group");
			
			fld = form.addField("custpage_address_1","text","Address Line 1",null,"delivery_group");
			fld.setDefaultValue(soRec.getFieldValue("shipaddr1"));
			fld = form.addField("custpage_address_2","text","Address Line 2",null,"delivery_group");
			fld.setDefaultValue(soRec.getFieldValue("shipaddr2"));
			fld = form.addField("custpage_city","text","City",null,"delivery_group");
			fld.setDefaultValue(soRec.getFieldValue("shipcity"));
			fld = form.addField("custpage_state","text","State",null,"delivery_group");
			fld.setDefaultValue(soRec.getFieldValue("shipstate"));
			fld = form.addField("custpage_zip","text","Zip Code",null,"delivery_group");
			fld.setDefaultValue(soRec.getFieldValue("shipzip"));
			fld = form.addField("custpage_country","text","Country",null,"delivery_group");
			fld.setDefaultValue(soRec.getFieldValue("shipcountry"));
			
			fld = form.addField("custpage_return_label_status","select","Return Label Status","customlist126","delivery_group");
			
			fld = form.addField("custpage_pickup_at_be","checkbox","Pickup at BE",null,"delivery_group");
			
			fld = form.addField("custpage_price","currency","Price",null,"item_group");
			fld.setMandatory(true);
			
			fld = form.addField("custpage_price_2","currency","Price 2",null,"item_group");
			
			fld = form.addField("custpage_notes","textarea","Notes",null,"info_group");
			
			fld = form.addField("custpage_has_resize","checkbox","Has Another Resize Order?",null,"info_group");
			fld.setDisplayType("inline");
			
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			filters.push(new nlobjSearchFilter("entity",null,"is",soRec.getFieldValue("entity")));
			filters.push(new nlobjSearchFilter("custbody87",null,"anyof",2));
			var results = nlapiSearchRecord("salesorder",null,filters);
			if(results)
				fld.setDefaultValue("T");
			else
				fld.setDefaultValue("F");
				
			fld = form.addField("custpage_sales_rep","select","Sales Rep",null,"info_group");
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
			fld.setDefaultValue(soRec.getFieldValue("salesrep"));
			
			fld = form.addField("custpage_date_received_at_be","date","Date Received at BE from Customer",null,"delivery_group");
			
			fld = form.addField("custpage_order_num","text","Order Numbers");
			fld.setDisplayType("hidden");
			fld.setDefaultValue(soRec.getFieldValue("tranid"));
			
			fld = form.addField("custpage_order_id","text","Order ID");
			fld.setDisplayType("hidden");
			fld.setDefaultValue(soRec.getId());
			
			form.addSubmitButton();
			
			response.writePage(form)
		}
		catch(err)
		{
			nlapiLogExecution("error","Resize Page UI Error","Details: " + err.message);
			return true;
		}
	}
	else
	{
		try
		{
			//Get Form Data
			var customer = request.getParameter("custpage_customer");
			var deliveryDate = request.getParameter("custpage_delivery_date");
			var deliveryDateFirm = request.getParameter("custpage_delivery_date_firm");
			var unitPrice = request.getParameter("custpage_price");
			var unitPrice2 = request.getParameter("custpage_price_2");
			var orderID = request.getParameter("custpage_order_id");
			var orderNumber = request.getParameter("custpage_order_num");
			var items = request.getParameterValues("custpage_items");
			var return_label = request.getParameter("custpage_return_label_status");
			var notes = request.getParameter("custpage_notes");
			var salesrep = request.getParameter("custpage_sales_rep");
			var datereceived = request.getParameter("custpage_date_received_at_be");
			nlapiLogExecution("debug","items",items);
			var item1 = items[0];
			if(items.length > 1)
				var item2 = items[1];
			else
				var item2 = "";
			var size1 = request.getParameter("custpage_new_size_item_1");
			var size2 = request.getParameter("custpage_new_size_item_2");
			
			var originalOrder = nlapiLoadRecord("salesorder",orderID);
			
			//Get Shipping Information From Form
			var address1 = request.getParameter("custpage_address_1");
			var address2 = request.getParameter("custpage_address_2");
			var city = request.getParameter("custpage_city");
			var state = request.getParameter("custpage_state");
			var zipcode = request.getParameter("custpage_zip");
			var country = request.getParameter("custpage_country");
			
			//Create Sales Order
			var soRec = nlapiTransformRecord("customer",customer,"salesorder");
			var numericSize = size1.replace(/\./g,"");
			var so_number = orderNumber + "SZ" + numericSize;
			
			//Verify SO number doesn't already exist
			var filters = [];
			filters.push(new nlobjSearchFilter("tranid",null,"is",so_number));
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			var results = nlapiSearchRecord("salesorder",null,filters);
			if(results)
			{
				so_number = so_number + "2";
				filters.push(new nlobjSearchFilter("tranid",null,"is",so_number));
				var results = nlapiSearchRecord("salesorder",null,filters);
				if(results)
				{
					so_number = so_number + "3";
					filters.push(new nlobjSearchFilter("tranid",null,"is",so_number));
					var results = nlapiSearchRecord("salesorder",null,filters);
					if(results)
					{
						so_number = so_number + "4";
						filters.push(new nlobjSearchFilter("tranid",null,"is",so_number));
						var results = nlapiSearchRecord("salesorder",null,filters);
						if(results)
						{
							so_number = so_number + "5";
							filters.push(new nlobjSearchFilter("tranid",null,"is",so_number));
							var results = nlapiSearchRecord("salesorder",null,filters);
							if(results)
							{
								so_number = so_number + "6";
								soRec.setFieldValue("tranid",so_number);
							}
							else
								soRec.setFieldValue("tranid",so_number);
						}
						else
							soRec.setFieldValue("tranid",so_number);
					}
					else
						soRec.setFieldValue("tranid",so_number);
				}
				else
					soRec.setFieldValue("tranid",so_number);
			}
			else
				soRec.setFieldValue("tranid",so_number);
				
			soRec.setFieldValue("custbody87",2);
			soRec.setFieldValue("custbody6",deliveryDate);
			soRec.setFieldValue("custbody82",deliveryDateFirm);
			soRec.setFieldValue("custbody58",notes);
			soRec.setFieldValue("salesrep",salesrep);
			soRec.setFieldValue("custbody36",datereceived);
			
			if(return_label!=null && return_label!="")
				soRec.setFieldValue("custbody138",return_label);
			
			if(request.getParameter("custpage_pickup_at_be")!=null && request.getParameter("custpage_pickup_at_be")!="")
				soRec.setFieldValue("custbody53",request.getParameter("custpage_pickup_at_be"));
			
			soRec.setFieldValue("custbody55",0.00); //Amount Paid By Customer
			soRec.setFieldValue("custbody132",3); //Diamond Confirmed New - N/A
			soRec.setFieldValue("class",2); //Place of Sale - Phone: Not Bank Wire
			
			//Handle full insurance value - Added 07.31.2013 TB
			var totalAmount = 0.00;
			var item1amount = 0.00;
			var item2amount = 0.00;	
			
			soRec.selectNewLineItem("item");
			soRec.setCurrentLineItemValue("item","item",15381);
			var description = nlapiLookupField("item",item1,"salesdescription");
			description = description.substring(0,description.indexOf(","));
			soRec.setCurrentLineItemValue("item","description",description + " resize to size " + size1);
			soRec.setCurrentLineItemValue("item","price",-1);
			soRec.setCurrentLineItemValue("item","rate",unitPrice);
			soRec.setCurrentLineItemValue("item","istaxable","T");
			//soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",totalAmount);
			
			for(var x=0; x < originalOrder.getLineItemCount("item"); x++)
			{
				if(originalOrder.getLineItemValue("item","item",x+1)==item1)
				{
					soRec.setCurrentLineItemValue("item","custcol5",originalOrder.getLineItemValue("item","custcol5",x+1));
					item1amount += (parseFloat(originalOrder.getLineItemValue("item","amount",x+1)) * .8);
					//soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",item1amount);
					//totalAmount += item1amount;
					//break;	
				}
				
				if(originalOrder.getLineItemValue("item","itemtype",x+1)=="InvtPart")
				{
					totalAmount += (parseFloat(originalOrder.getLineItemValue("item","amount",x+1)) * .8);
				}
			}
			
			soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",totalAmount);
			soRec.commitLineItem("item");
			
			if(item2!=null && item2!="")
			{
				soRec.selectNewLineItem("item");
				soRec.setCurrentLineItemValue("item","item",15381);
				var description = nlapiLookupField("item",item2,"salesdescription");
				description = description.substring(0,description.indexOf(","));
				soRec.setCurrentLineItemValue("item","description",description + " resize to size " + size2);
				soRec.setCurrentLineItemValue("item","price",-1);
				soRec.setCurrentLineItemValue("item","rate",unitPrice2);
				soRec.setCurrentLineItemValue("item","istaxable","T");
				soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",totalAmount);
				
				for(var x=0; x < originalOrder.getLineItemCount("item"); x++)
				{
					if(originalOrder.getLineItemValue("item","item",x+1)==item2)
					{
						soRec.setCurrentLineItemValue("item","custcol5",originalOrder.getLineItemValue("item","custcol5",x+1));
						item2amount += (parseFloat(originalOrder.getLineItemValue("item","amount",x+1)) * .8);
						//soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",item2amount);
						//totalAmount += item2amount;
						break;	
					}
				}
				
				soRec.commitLineItem("item");
			}
			
			soRec.setFieldValue("custbody_full_insurance_amount",totalAmount);
			
			//Update Shipping Address if Necessary
			var updateAddress = false;
			
			if(address1 != soRec.getFieldValue("shipaddr1"))
				updateAddress = true;
			if(!updateAddress && address2 != soRec.getFieldValue("shipaddr2"))
				updateAddress = true;
			if(!updateAddress && city != soRec.getFieldValue("shipcity"))
				updateAddress = true;
			if(!updateAddress && state != soRec.getFieldValue("shipstate"))
				updateAddress = true;
			if(!updateAddress && zipcode != soRec.getFieldValue("shipzip"))
				updateAddress = true;
			if(!updateAddress && country != soRec.getFieldValue("shipcountry"))
				updateAddress = true;
				
			if(updateAddress)
			{
				var attention = soRec.getFieldValue("shipattention");
				var addressee = soRec.getFieldValue("shipaddressee");
					
				soRec.setFieldValue("shipaddresslist","");
				soRec.setFieldValue("shipaddressee",addressee);
				if(attention!=null && attention!="")
					soRec.setFieldValue("shipattention",attention);
				soRec.setFieldValue("shipaddr1",address1);
				soRec.setFieldValue("shipaddr2",address2);
				soRec.setFieldValue("shipcity",city);
				soRec.setFieldValue("shipstate",state);
				soRec.setFieldValue("shipzip",zipcode);
				soRec.setFieldText("shipcountry",country);
				
				var shipaddress = "";
				if(attention!=null && attention!="")
					shipaddress += attention + "\n";
				shipaddress += addressee + "\n";
				shipaddress += address1 + "\n";
				if(address2!=null && address2!="")
					shipaddress += address2 + "\n";
				shipaddress += city + " " + state + " " + zipcode + "\n";
				shipaddress += country;
				
				soRec.setFieldValue("shipaddress",shipaddress);
			}
			
			if(request.getParameter("custpage_pickup_at_be")=="T")
			{
				soRec.setFieldValue("shipcountry","US");
				soRec.setFieldValue("shipaddressee","Pick-up at BE");
				soRec.setFieldValue("shipaddr1","26 O'Farrell Street, Floor 10");
				soRec.setFieldValue("shipaddr2","");
				soRec.setFieldValue("shipcountry","US");
				soRec.setFieldValue("shipcity","San Francisco");
				soRec.setFieldValue("shipstate","CA");
				soRec.setFieldValue("shipzip","94108");
				soRec.setFieldValue("shipaddress","Pick-up at BE\nSan Francisco, CA 94108\nUnited States");
			}	
			
			var resizeOrderID = nlapiSubmitRecord(soRec,true,true);
			
			//Redirect user to new sales order
			response.sendRedirect("RECORD","salesorder",resizeOrderID,false);
		}
		catch(err)
		{
			nlapiLogExecution("error","Resize Page Processing Error","Details: " + err.message);
			return true;
		}
	}
}

function createCountryList(fieldObj)
{
	fieldObj.addSelectOption("AF","Afghanistan");
	fieldObj.addSelectOption("AX","Aland Islands");
	fieldObj.addSelectOption("AL","Albania");
	fieldObj.addSelectOption("DZ","Algeria");
	fieldObj.addSelectOption("AS","American Samoa");
	fieldObj.addSelectOption("AD","Andorra");
	fieldObj.addSelectOption("AO","Angola");
	fieldObj.addSelectOption("AI","Anguilla");
	fieldObj.addSelectOption("AQ","Antarctica");
	fieldObj.addSelectOption("AG","Antigua and Barbuda");
	fieldObj.addSelectOption("AR","Argentina");
	fieldObj.addSelectOption("AM","Armenia");
	fieldObj.addSelectOption("AW","Aruba");
	fieldObj.addSelectOption("AU","Australia");
	fieldObj.addSelectOption("AT","Austria");
	fieldObj.addSelectOption("AZ","Azerbaijan");
	fieldObj.addSelectOption("HS","Bahamas");
	fieldObj.addSelectOption("BH","Bahrain");
	fieldObj.addSelectOption("BD","Bangladesh");
	fieldObj.addSelectOption("BB","Barbados");
	fieldObj.addSelectOption("BY","Belarus");
	fieldObj.addSelectOption("BE","Belgium");
	fieldObj.addSelectOption("BZ","Belize");
	fieldObj.addSelectOption("BJ","Benin");
	fieldObj.addSelectOption("BM","Bermuda");
	fieldObj.addSelectOption("BT","Bhutan");
	fieldObj.addSelectOption("BO","Bolivia");
	fieldObj.addSelectOption("BQ","Bonaire, Saint Eustatius and Saba");
	fieldObj.addSelectOption("BA","Bosnia and Herzegovina");
	fieldObj.addSelectOption("BW","Botswana");
	fieldObj.addSelectOption("BV","Bouvet Island");
	fieldObj.addSelectOption("BR","Brazil");
	fieldObj.addSelectOption("IO","British Indian Ocean Territory");
	fieldObj.addSelectOption("BN","Brunei Darussalam");
	fieldObj.addSelectOption("BG","Bulgaria");
	fieldObj.addSelectOption("BF","Burkina Faso");
	fieldObj.addSelectOption("AX","Burundi");
	fieldObj.addSelectOption("AL","Cambodia");
	fieldObj.addSelectOption("DZ","Cameroon");
	fieldObj.addSelectOption("AS","Canada");
	fieldObj.addSelectOption("AD","Canary Islands");
	fieldObj.addSelectOption("AO","Cape Verde");
	fieldObj.addSelectOption("AI","Cayman Islands");
	fieldObj.addSelectOption("AQ","Central African Republic");
	fieldObj.addSelectOption("AG","Ceuta and Melilla");
	fieldObj.addSelectOption("AR","Chad");
	fieldObj.addSelectOption("AM","Chile");
	fieldObj.addSelectOption("AW","China");
	fieldObj.addSelectOption("AU","Christmas Island");
	fieldObj.addSelectOption("AT","Cocos (Keeling) Islands");
	fieldObj.addSelectOption("AZ","Colombia");
	fieldObj.addSelectOption("HS","Comoros");
	fieldObj.addSelectOption("BH","Congo, Democratic People's Republic");
	fieldObj.addSelectOption("AF","Congo, Republic of");
	fieldObj.addSelectOption("AX","Cook Islands");
	fieldObj.addSelectOption("AL","Costa Rica");
	fieldObj.addSelectOption("DZ","Cote d'Ivoire");
	fieldObj.addSelectOption("AS","Croatia/Hrvatska");
	fieldObj.addSelectOption("AD","Cuba");
	fieldObj.addSelectOption("AO","Cura�ao");
	fieldObj.addSelectOption("AI","Cyprus");
	fieldObj.addSelectOption("AQ","Czech Republic");
	fieldObj.addSelectOption("AG","Antigua and Barbuda");
	fieldObj.addSelectOption("AR","Argentina");
	fieldObj.addSelectOption("AM","Armenia");
	fieldObj.addSelectOption("AW","Aruba");
	fieldObj.addSelectOption("AU","Australia");
	fieldObj.addSelectOption("AT","Austria");
	fieldObj.addSelectOption("AZ","Azerbaijan");
	fieldObj.addSelectOption("HS","Bahamas");
	fieldObj.addSelectOption("BH","Bahrain");
	fieldObj.addSelectOption("AF","Afghanistan");
	fieldObj.addSelectOption("AX","Aland Islands");
	fieldObj.addSelectOption("AL","Albania");
	fieldObj.addSelectOption("DZ","Algeria");
	fieldObj.addSelectOption("AS","American Samoa");
	fieldObj.addSelectOption("AD","Andorra");
	fieldObj.addSelectOption("AO","Angola");
	fieldObj.addSelectOption("AI","Anguilla");
	fieldObj.addSelectOption("AQ","Antarctica");
	fieldObj.addSelectOption("AG","Antigua and Barbuda");
	fieldObj.addSelectOption("AR","Argentina");
	fieldObj.addSelectOption("AM","Armenia");
	fieldObj.addSelectOption("AW","Aruba");
	fieldObj.addSelectOption("AU","Australia");
	fieldObj.addSelectOption("AT","Austria");
	fieldObj.addSelectOption("AZ","Azerbaijan");
	fieldObj.addSelectOption("HS","Bahamas");
	fieldObj.addSelectOption("BH","Bahrain");
	return fieldObj;
}
