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
			
			fld = form.addField("custpage_new_sales_rep","select","Rep in Communication",null,"exchange");
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
			
			fld = form.addField("custpage_block_auto_emails","checkbox","Block Auto Emails",null,"exchange");
			
			//Delivery/Shipping Section Form Fields
			fld = form.addField("custpage_delivery_date","date","Delivery Date",null,"delivery");
			fld.setMandatory(true);
			
			form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm",null,"delivery");
			
			form.addField("custpage_date_recd_at_be","date","Date Received at BE from Customer",null,"delivery");
			
			//Changed from customlist338 to customlist344
			fld = form.addField("custpage_location_received_at_be","select","Location Received at BE from Customer","customlist344","delivery");
			//fld.setMandatory(true);
			
			fld = form.addField("custpage_addressee","text","Addressee",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipaddressee"));
			fld = form.addField("custpage_attention","text","Attention",null,"delivery");
			fld.setDefaultValue(soRec.getFieldValue("shipattention"));
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
			//fld = form.addField("custpage_country","text","Country",null,"delivery");
			
			fld = form.addField("custpage_country","select","Country",null,"delivery");
			
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
			
			form.addField("custpage_pickup_at_be","checkbox","Pick-up at BE",null,"delivery");
			
			fld = form.addField("custpage_pickup_location","select","Pickup Location","customlist334","delivery");
			
			fld = form.addField("custpage_return_shipping_label","select","Return Shipping Label","customlist126","delivery");
			if(soRec.getFieldValue("custbody138")!=null && soRec.getFieldValue("custbody138")!="")
				fld.setDefaultValue(soRec.getFieldValue("custbody138"));
			fld.setMandatory(true);
			
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
			var locationReceived = request.getParameter("custpage_location_received_at_be");
			var pickupLocation = request.getParameter("custpage_pickup_location");
			var items_not_returned = [];
			
			var delta_mgr = [];
			
			nlapiLogExecution("debug","(POST) Parameters Retrieved");
			
			//Get Shipping Information From Form
			var addressee = request.getParameter("custpage_addressee");
			var attention = request.getParameter("custpage_attention");
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
			ra.setFieldValue("salesrep",original_salesrep); //1. Sales rep will always go on the return auth
			ra.setFieldValue("custbody32",return_reason);
			ra.setFieldValue("custbody35",type_of_send_back);
			ra.setFieldValue("custbody14",exchange_notes);
			ra.setFieldValue("custbody245",locationReceived);
			ra.setFieldValue("custbody247",new_salesrep);
			ra.setFieldValue("custbody138",return_shipping_label);
			
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
							
						var delta_found = false;
						for(var t=0; t < delta_mgr.length; t++)
						{
							if(delta_mgr[t].category == itemCat)
							{
								delta_mgr[t].returned += parseFloat(ra.getLineItemValue("item","amount",x+1));
								delta_found = true;
								break;
							}
						}
						
						if(delta_found==false)
						{
							delta_mgr.push({
								category : itemCat,
								returned : parseFloat(ra.getLineItemValue("item","amount",x+1)),
								ordered : 0
							});
						}
						
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
			if(!updateAddress && attention != ra.getFieldValue("shipattention"))
				updateAddress = true;
				
			if(updateAddress)
			{
				var subrecord = ra.editSubrecord("shippingaddress");
				subrecord.setFieldValue("country",country);
				subrecord.setFieldValue("addressee",addressee);
				if(attention!=null && attention!="")
					subrecord.setFieldValue("attention",attention);
				subrecord.setFieldValue("addr1",address1);
				subrecord.setFieldValue("addr2",address2);
				subrecord.setFieldValue("city",city);
				subrecord.setFieldValue("state",state);
				subrecord.setFieldValue("zip",zipcode);
				subrecord.commit();
				
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
			
			var return_total = ra.getFieldValue("subtotal");
			
			//Add invoice date to RA
			var filters = [];
			filters.push(new nlobjSearchFilter("createdfrom",null,"is",created_from));
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			var cols = [];
			cols.push(new nlobjSearchColumn("trandate"));
			var results = nlapiSearchRecord("invoice",null,filters,cols);
			if(results)
			{
				ra.setFieldValue("custbody_invoice_date",results[0].getValue("trandate"));
			}
			
			var rmaID = nlapiSubmitRecord(ra,true,true);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating Return Authorization","Details: " + err.message);
			return true;
		}
		
		try
		{
			//Create new Sales Order
			var newOrder = nlapiTransformRecord("customer",customer,"salesorder",{recordmode: "dynamic"});
			newOrder.setFieldValue("tranid",so_num + "EX");
			
			//Check if transaction ID already exists
			var tranid = newOrder.getFieldValue("tranid");
			newOrder.setFieldValue("tranid",checkNumber(tranid,null));
			
			//Set created from (original sales order)
			newOrder.setFieldValue("custbody_created_from",created_from);
			
			//Set Invoice Date
			var filters = [];
			filters.push(new nlobjSearchFilter("createdfrom",null,"is",created_from));
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			var cols = [];
			cols.push(new nlobjSearchColumn("trandate").setSort(true));
			var results = nlapiSearchRecord("invoice",null,filters,cols);
			if(results)
			{
				newOrder.setFieldValue("custbody_invoice_date",results[0].getValue("trandate"));
			}
			
			newOrder.setFieldValue("entity",customer);
			newOrder.setFieldValue("salesrep",new_salesrep); //2. The Rep in Comm will always go on the EX SO as the "Sales Rep". This in turn would essentially make Rep in Comm obsolete on the sales order, but we can just leave it there for now.
			newOrder.setFieldValue("custbody247",new_salesrep);
			newOrder.setFieldValue("custbody58",exchange_notes);
			newOrder.setFieldValue("custbody6",delivery_date);
			newOrder.setFieldValue("custbody87","4"); //Type of Order = Exchange
			newOrder.setFieldValue("custbody82",delivery_date_firm);
			newOrder.setFieldValue("custbody53",pickup_at_be);
			newOrder.setFieldValue("custbody_pickup_location",pickupLocation);
			//newOrder.setFieldValue("custpage_return_shipping_label",return_shipping_label);
			newOrder.setFieldValue("custbody132",2); //Diamond Confirmed New (default to No)
			newOrder.setFieldValue("custbody55",amount_paid); //Amount Paid By Customer
			newOrder.setFieldValue("class",place_of_sale); //Place of Sale
			newOrder.setFieldValue("custbody84","1"); //Fraud Check=Yes
			newOrder.setFieldValue("custbody245",locationReceived);
			newOrder.setFieldValue("custbody138",return_shipping_label);
			if(return_shipping_label=="T")
			{
				newOrder.setFieldValue("custbody138","1"); //Return Label Status = Return label needed
			}
			newOrder.setFieldValue("custbody36",date_received_at_be); //Date Received at BE from Customer
			
			if(request.getParameter("custpage_block_auto_emails")=="T")
			{
				newOrder.setFieldValue("custbodyblock_auto_emails","T");
			}
			
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
					
				var delta_found = false;
				for(var t=0; t < delta_mgr.length; t++)
				{
					if(delta_mgr[t].category == newOrder.getCurrentLineItemValue("item","custcol_category"))
					{
						delta_mgr[t].ordered += parseFloat(newOrder.getCurrentLineItemValue("item","amount"));
						delta_found = true;
						break;
					}
				}
				
				if(delta_found==false)
				{
					delta_mgr.push({
						category : newOrder.getCurrentLineItemValue("item","custcol_category"),
						ordered : parseFloat(newOrder.getCurrentLineItemValue("item","amount")),
						returned : 0
					});
				}
					
				newItemAmount += parseFloat(newOrder.getCurrentLineItemValue("item","amount"));
				newOrder.commitLineItem("item");
			}
			
			nlapiLogExecution("debug","newItemAmount",newItemAmount);
			
			if(insuranceValue!=null && insuranceValue!="" && insuranceValue > 0)
				var fullInsuranceAmt = (newItemAmount + parseFloat(insuranceValue)) * 0.8;
			else
				var fullInsuranceAmt = parseFloat(newItemAmount) * 0.8;
			
			nlapiLogExecution("debug","fullInsuranceAmt",fullInsuranceAmt);
			
			newOrder.setFieldValue("custbody_full_insurance_amount",nlapiFormatCurrency(fullInsuranceAmt));
			for(var x=0; x < newOrder.getLineItemCount("item"); x++)
			{
				newOrder.selectLineItem("item",x+1);
				newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",fullInsuranceAmt);
				newOrder.commitLineItem("item");
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
			if(!updateAddress && attention != newOrder.getFieldValue("shipattention"))
				updateAddress = true;
				
			if(updateAddress)
			{
				var subrecord = newOrder.editSubrecord("shippingaddress");
				subrecord.setFieldValue("country",country);
				subrecord.setFieldValue("addressee",addressee);
				if(attention!=null && attention!="")
					subrecord.setFieldValue("attention",attention);
				subrecord.setFieldValue("addr1",address1);
				subrecord.setFieldValue("addr2",address2);
				subrecord.setFieldValue("city",city);
				subrecord.setFieldValue("state",state);
				subrecord.setFieldValue("zip",zipcode);
				subrecord.commit();
				
				var shipaddress = "";
				if(attention!=null && attention!="")
					shipaddress += attention + "\n";
				shipaddress += addressee + "\n";
				shipaddress += address1 + "\n";
				if(address2!=null && address2!="")
					shipaddress += address2 + "\n";
				shipaddress += city + " " + state + " " + zipcode + "\n";
				shipaddress += newOrder.getFieldValue("shipcountry");
				
				newOrder.setFieldValue("shipaddress",shipaddress);
			}
			
			newOrder.setFieldValue("tranid",so_num + "EX");
			
			var new_total = newOrder.getFieldValue("subtotal");
			
			nlapiLogExecution("debug","Delta Mgr",JSON.stringify(delta_mgr));
			
			var delta = 0;
			for(var x=0; x < delta_mgr.length; x++)
			{
				delta += delta_mgr[x].ordered - delta_mgr[x].returned;
			}
			
			newOrder.setFieldValue("custbody_exchange_delta",delta);
			if(delta > 0)
			{
				//If delta is positive, credit new sales rep
				newOrder.setFieldValue("custbody_exchange_delta",delta);
			}
			else
			{
				//If delta is negative, store delta on RMA, EX SO delta = $0 or empty
				nlapiSubmitField("returnauthorization",rmaID,"custbody_exchange_delta",delta);
				newOrder.setFieldValue("custbody_exchange_delta","");				
			}
			
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
			//var orderStatus = nlapiLookupField("salesorder",so,"status");
			var orderStatus = nlapiGetFieldValue("orderstatus");

			//if(orderStatus=="fullyBilled" || orderStatus=="closed")
			if(orderStatus=="G" || orderStatus=="H")
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