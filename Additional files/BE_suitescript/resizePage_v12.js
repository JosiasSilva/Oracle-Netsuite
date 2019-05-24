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
			if(nlapiGetContext().getExecutionContext()!="userinterface")
				return true;
			
			var so = nlapiGetRecordId();
			//var orderStatus = nlapiLookupField("salesorder",so,"status");
			var orderStatus = nlapiGetFieldValue("orderstatus");

			//if(orderStatus=="fullyBilled" || orderStatus=="closed")
			if(orderStatus=="G" || orderStatus=="H")
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
			
			form.setScript("customscript_repair_resize_client");
			
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
			//fld = form.addField("custpage_country","text","Country",null,"delivery_group");
			fld = form.addField("custpage_country","select","Country",null,"delivery_group");
			
			fld.addSelectOption("AF","Afghanistan");
			fld.addSelectOption("AL","Albania");
			fld.addSelectOption("DZ","Algeria");
			fld.addSelectOption("AS","American Samoa");
			fld.addSelectOption("AD","Andorra");
			fld.addSelectOption("AO","Angola");
			fld.addSelectOption("AI","Anguilla");
			fld.addSelectOption("AQ","Antarctica");
			fld.addSelectOption("AG","Antigua and Barbuda");
			fld.addSelectOption("AR","Argentina");
			fld.addSelectOption("AM","Armenia");
			fld.addSelectOption("AW","Aruba");
			fld.addSelectOption("AU","Australia");
			fld.addSelectOption("AT","Austria");
			fld.addSelectOption("AZ","Azerbaijan");
			fld.addSelectOption("BS","Bahamas");
			fld.addSelectOption("BH","Bahrain");
			fld.addSelectOption("BD","Bangladesh");
			fld.addSelectOption("BB","Barbados");
			fld.addSelectOption("BY","Belarus");
			fld.addSelectOption("BE","Belgium");
			fld.addSelectOption("BZ","Belize");
			fld.addSelectOption("BJ","Benin");
			fld.addSelectOption("BM","Bermuda");
			fld.addSelectOption("BT","Bhutan");
			fld.addSelectOption("BO","Bolivia");
			fld.addSelectOption("BA","Bosnia and Herzegovina");
			fld.addSelectOption("BW","Botswana");
			fld.addSelectOption("BV","Bouvet Island");
			fld.addSelectOption("BR","Brazil");
			fld.addSelectOption("IO","British Indian Ocean Territory");
			fld.addSelectOption("BN","Brunei Darussalam");
			fld.addSelectOption("BG","Bulgaria");
			fld.addSelectOption("BF","Burkina Faso");
			fld.addSelectOption("BI","Burundi");
			fld.addSelectOption("KH","Cambodia");
			fld.addSelectOption("CM","Cameroon");
			fld.addSelectOption("CA","Canada");
			fld.addSelectOption("CV","Cap Verde");
			fld.addSelectOption("KY","Cayman Islands");
			fld.addSelectOption("CF","Central African Republic");
			fld.addSelectOption("TD","Chad");
			fld.addSelectOption("CL","Chile");
			fld.addSelectOption("CN","China");
			fld.addSelectOption("CX","Christmas Island");
			fld.addSelectOption("CC","Cocos (Keeling) Islands");
			fld.addSelectOption("CO","Colombia");
			fld.addSelectOption("KM","Comoros");
			fld.addSelectOption("CD","Congo, Democratic People's Republic");
			fld.addSelectOption("CG","Congo, Republic of");
			fld.addSelectOption("CK","Cook Islands");
			fld.addSelectOption("CR","Costa Rica");
			fld.addSelectOption("CI","Cote d'Ivoire");
			fld.addSelectOption("HR","Croatia/Hrvatska");
			fld.addSelectOption("CU","Cuba");
			fld.addSelectOption("CY","Cyprus");
			fld.addSelectOption("CZ","Czech Republic");
			fld.addSelectOption("DK","Denmark");
			fld.addSelectOption("DJ","Djibouti");
			fld.addSelectOption("DM","Dominica");
			fld.addSelectOption("DO","Dominican Republic");
			fld.addSelectOption("TP","East Timor");
			fld.addSelectOption("EC","Ecuador");
			fld.addSelectOption("EG","Egypt");
			fld.addSelectOption("SV","El Salvador");
			fld.addSelectOption("GQ","Equatorial Guinea");
			fld.addSelectOption("ER","Eritrea");
			fld.addSelectOption("EE","Estonia");
			fld.addSelectOption("ET","Ethiopia");
			fld.addSelectOption("FK","Falkland Islands (Malvina)");
			fld.addSelectOption("FO","Faroe Islands");
			fld.addSelectOption("FJ","Fiji");
			fld.addSelectOption("FI","Finland");
			fld.addSelectOption("FR","France");
			fld.addSelectOption("GF","French Guiana");
			fld.addSelectOption("PF","French Polynesia");
			fld.addSelectOption("TF","French Southern Territories");
			fld.addSelectOption("GA","Gabon");
			fld.addSelectOption("GM","Gambia");
			fld.addSelectOption("GE","Georgia");
			fld.addSelectOption("DE","Germany");
			fld.addSelectOption("GH","Ghana");
			fld.addSelectOption("GI","Gibraltar");
			fld.addSelectOption("GR","Greece");
			fld.addSelectOption("GL","Greenland");
			fld.addSelectOption("GD","Grenada");
			fld.addSelectOption("GP","Guadeloupe");
			fld.addSelectOption("GU","Guam");
			fld.addSelectOption("GT","Guatemala");
			fld.addSelectOption("GG","Guernsey");
			fld.addSelectOption("GN","Guinea");
			fld.addSelectOption("GW","Guinea-Bissau");
			fld.addSelectOption("GY","Guyana");
			fld.addSelectOption("HT","Haiti");
			fld.addSelectOption("HM","Heard and McDonald Islands");
			fld.addSelectOption("VA","Holy See (City Vatican State)");
			fld.addSelectOption("HN","Honduras");
			fld.addSelectOption("HK","Hong Kong");
			fld.addSelectOption("HU","Hungary");
			fld.addSelectOption("IS","Iceland");
			fld.addSelectOption("IN","India");
			fld.addSelectOption("ID","Indonesia");
			fld.addSelectOption("IR","Iran (Islamic Republic of)");
			fld.addSelectOption("IQ","Iraq");
			fld.addSelectOption("IE","Ireland");
			fld.addSelectOption("IM","Isle of Man");
			fld.addSelectOption("IL","Israel");
			fld.addSelectOption("IT","Italy");
			fld.addSelectOption("JM","Jamaica");
			fld.addSelectOption("JP","Japan");
			fld.addSelectOption("JE","Jersey");
			fld.addSelectOption("JO","Jordan");
			fld.addSelectOption("KZ","Kazakhstan");
			fld.addSelectOption("KE","Kenya");
			fld.addSelectOption("KI","Kiribati");
			fld.addSelectOption("KP","Korea, Democratic People's Republic");
			fld.addSelectOption("KR","Korea, Republic of");
			fld.addSelectOption("KW","Kuwait");
			fld.addSelectOption("KG","Kyrgyzstan");
			fld.addSelectOption("LA","Lao People's Democratic Republic");
			fld.addSelectOption("LV","Latvia");
			fld.addSelectOption("LB","Lebanon");
			fld.addSelectOption("LS","Lesotho");
			fld.addSelectOption("LR","Liberia");
			fld.addSelectOption("LY","Libyan Arab Jamahiriya");
			fld.addSelectOption("LI","Liechtenstein");
			fld.addSelectOption("LT","Lithuania");
			fld.addSelectOption("LU","Luxembourg");
			fld.addSelectOption("MO","Macau");
			fld.addSelectOption("MK","Macedonia");
			fld.addSelectOption("MG","Madagascar");
			fld.addSelectOption("MW","Malawi");
			fld.addSelectOption("MY","Malaysia");
			fld.addSelectOption("MV","Maldives");
			fld.addSelectOption("ML","Mali");
			fld.addSelectOption("MT","Malta");
			fld.addSelectOption("MH","Marshall Islands");
			fld.addSelectOption("MQ","Martinique");
			fld.addSelectOption("MR","Mauritania");
			fld.addSelectOption("MU","Mauritius");
			fld.addSelectOption("YT","Mayotte");
			fld.addSelectOption("MX","Mexico");
			fld.addSelectOption("FM","Micronesia, Federal State of");
			fld.addSelectOption("MD","Moldova, Republic of");
			fld.addSelectOption("MC","Monaco");
			fld.addSelectOption("MN","Mongolia");
			fld.addSelectOption("ME","Montenegro");
			fld.addSelectOption("MS","Montserrat");
			fld.addSelectOption("MA","Morocco");
			fld.addSelectOption("MZ","Mozambique");
			fld.addSelectOption("MM","Myanmar");
			fld.addSelectOption("NA","Namibia");
			fld.addSelectOption("NR","Nauru");
			fld.addSelectOption("NP","Nepal");
			fld.addSelectOption("NL","Netherlands");
			fld.addSelectOption("AN","Netherlands Antilles");
			fld.addSelectOption("NC","New Caledonia");
			fld.addSelectOption("NZ","New Zealand");
			fld.addSelectOption("NI","Nicaragua");
			fld.addSelectOption("NE","Niger");
			fld.addSelectOption("NG","Nigeria");
			fld.addSelectOption("NU","Niue");
			fld.addSelectOption("NF","Norfolk Island");
			fld.addSelectOption("MP","Northern Mariana Islands");
			fld.addSelectOption("NO","Norway");
			fld.addSelectOption("OM","Oman");
			fld.addSelectOption("PK","Pakistan");
			fld.addSelectOption("PW","Palau");
			fld.addSelectOption("PS","Palestinian Territories");
			fld.addSelectOption("PA","Panama");
			fld.addSelectOption("PG","Papua New Guinea");
			fld.addSelectOption("PY","Paraguay");
			fld.addSelectOption("PE","Peru");
			fld.addSelectOption("PH","Philippines");
			fld.addSelectOption("PN","Pitcairn Island");
			fld.addSelectOption("PL","Poland");
			fld.addSelectOption("PT","Portugal");
			fld.addSelectOption("PR","Puerto Rico");
			fld.addSelectOption("QA","Qatar");
			fld.addSelectOption("RE","Reunion Island");
			fld.addSelectOption("RO","Romania");
			fld.addSelectOption("RU","Russian Federation");
			fld.addSelectOption("RW","Rwanda");
			fld.addSelectOption("BL","Saint Barthelemy");
			fld.addSelectOption("KN","Saint Kitts and Nevis");
			fld.addSelectOption("LC","Saint Lucia");
			fld.addSelectOption("MF","Saint Martin");
			fld.addSelectOption("VC","Saint Vincent and the Grenadines");
			fld.addSelectOption("SM","San Marino");
			fld.addSelectOption("ST","Sao Tome and Principe");
			fld.addSelectOption("SA","Saudi Arabia");
			fld.addSelectOption("SN","Senegal");
			fld.addSelectOption("RS","Serbia");
			fld.addSelectOption("CS","Serbia and Montenegro (Deprecated)");
			fld.addSelectOption("SC","Seychelles");
			fld.addSelectOption("SL","Sierra Leone");
			fld.addSelectOption("SG","Singapore");
			fld.addSelectOption("SK","Slovak Republic");
			fld.addSelectOption("SI","Slovenia");
			fld.addSelectOption("SB","Solomon Islands");
			fld.addSelectOption("SO","Somalia");
			fld.addSelectOption("ZA","South Africa");
			fld.addSelectOption("GS","South Georgia");
			fld.addSelectOption("ES","Spain");
			fld.addSelectOption("LK","Sri Lanka");
			fld.addSelectOption("SH","St. Helena");
			fld.addSelectOption("PM","St. Pierre and Miquelon");
			fld.addSelectOption("SD","Sudan");
			fld.addSelectOption("SR","Suriname");
			fld.addSelectOption("SJ","Svalbard and Jan Mayen Islands");
			fld.addSelectOption("SZ","Swaziland");
			fld.addSelectOption("SE","Sweden");
			fld.addSelectOption("CH","Switzerland");
			fld.addSelectOption("SY","Syrian Arab Republic");
			fld.addSelectOption("TW","Taiwan");
			fld.addSelectOption("TJ","Tajikistan");
			fld.addSelectOption("TZ","Tanzania");
			fld.addSelectOption("TH","Thailand");
			fld.addSelectOption("TG","Togo");
			fld.addSelectOption("TK","Tokelau");
			fld.addSelectOption("TO","Tonga");
			fld.addSelectOption("TT","Trinidad and Tobago");
			fld.addSelectOption("TN","Tunisia");
			fld.addSelectOption("TR","Turkey");
			fld.addSelectOption("TM","Turkmenistan");
			fld.addSelectOption("TC","Turks and Caicos Islands");
			fld.addSelectOption("TV","Tuvalu");
			fld.addSelectOption("UM","US Minor Outlying Islands");
			fld.addSelectOption("UG","Uganda");
			fld.addSelectOption("UA","Ukraine");
			fld.addSelectOption("AE","United Arab Emirates");
			fld.addSelectOption("GB","United Kingdom (GB)");
			fld.addSelectOption("US","United States");
			fld.addSelectOption("UY","Uruguay");
			fld.addSelectOption("UZ","Uzbekistan");
			fld.addSelectOption("VU","Vanuatu");
			fld.addSelectOption("VE","Venezuela");
			fld.addSelectOption("VN","Vietnam");
			fld.addSelectOption("VG","Virgin Islands (British)");
			fld.addSelectOption("VI","Virgin Islands (USA)");
			fld.addSelectOption("WF","Wallis and Futuna Islands");
			fld.addSelectOption("EH","Western Sahara");
			fld.addSelectOption("WS","Western Samoa");
			fld.addSelectOption("YE","Yemen");
			fld.addSelectOption("ZM","Zambia");
			fld.addSelectOption("ZW","Zimbabwe");
			
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
			
			fld = form.addField("custpage_block_auto_emails","checkbox","Block Auto Emails",null,"info_group");
			
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
			soRec.setFieldValue("tranid",orderNumber + "SZ" + numericSize);
			
			//Check if transaction ID already exists
			var tranid = soRec.getFieldValue("tranid");
			soRec.setFieldValue("tranid",checkNumber(tranid,null));
			
			//Set created from sales order
			soRec.setFieldValue("custbody_created_from",orderID);
			
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
			
			if(request.getParameter("custpage_block_auto_emails")=="T")
			{
				soRec.setFieldValue("custbodyblock_auto_emails","T");
			}
			
			//Handle full insurance value - Added 07.31.2013 TB
			var totalAmount = 0.00;
			var item1amount = 0.00;
			var item2amount = 0.00;	
			
			soRec.selectNewLineItem("item");
			//soRec.setCurrentLineItemValue("item","item",15381);
			soRec.setCurrentLineItemValue("item","item",1093360);
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
				//soRec.setCurrentLineItemValue("item","item",15381);
				soRec.setCurrentLineItemValue("item","item",1093360);
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
					
				soRec.setFieldValue("shipcountry",country);
				
				soRec.setFieldValue("shipaddresslist","");
				soRec.setFieldValue("shipaddressee",addressee);
				if(attention!=null && attention!="")
					soRec.setFieldValue("shipattention",attention);
				soRec.setFieldValue("shipaddr1",address1);
				soRec.setFieldValue("shipaddr2",address2);
				soRec.setFieldValue("shipcity",city);
				soRec.setFieldValue("shipstate",state);
				soRec.setFieldValue("shipzip",zipcode);
				
				var shipaddress = "";
				if(attention!=null && attention!="")
					shipaddress += attention + "\n";
				shipaddress += addressee + "\n";
				shipaddress += address1 + "\n";
				if(address2!=null && address2!="")
					shipaddress += address2 + "\n";
				shipaddress += city + " " + state + " " + zipcode + "\n";
				shipaddress += soRec.getFieldValue("shipcountry");
				
				soRec.setFieldValue("shipaddress",shipaddress);
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
