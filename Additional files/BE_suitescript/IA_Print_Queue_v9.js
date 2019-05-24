function IA_Print_Queue(request,response)
{
	if(request.getMethod()=="GET")
	{
		var form = nlapiCreateForm("Print Insurance Appraisals");
		
		var orders = [];
		var order_ids = [];
		
		//Get order internal IDS
		var filters = [];
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
		filters.push(new nlobjSearchFilter("custbody249",null,"on","today"));
		filters.push(new nlobjSearchFilter("amount",null,"greaterthan","0.00"));
		filters.push(new nlobjSearchFilter("custbody87",null,"noneof",["2","3","4","10","17"]));
		filters.push(new nlobjSearchFilter("customform",null,"noneof",["152","169"]));
		filters.push(new nlobjSearchFilter("custbody152",null,"isempty"));
		var results = nlapiSearchRecord("salesorder",null,filters);
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				order_ids.push(results[x].getId());
			}
		}
		
		//Run report to filter out exclusions - Halo and Eternity items
		var exclude_orders = [];
		var filters = [];
		if(order_ids!=null && order_ids!="" && order_ids.length > 0)
		{
			filters.push(new nlobjSearchFilter("internalid",null,"anyof",order_ids));
			var results = nlapiSearchRecord("salesorder","customsearch_ia_halo_eternity_exclusions",filters);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					exclude_orders.push(results[x].getId());
				}
			}
		}
		
		//Filter Loose Stone Orders
		if(order_ids != null && order_ids != "" && order_ids.length > 0)
		{
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			filters.push(new nlobjSearchFilter("internalid",null,"anyof",order_ids));
			filters.push(new nlobjSearchFilter("custbody_category1",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
			filters.push(new nlobjSearchFilter("custbody_category2",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
			filters.push(new nlobjSearchFilter("custbody_category3",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
			filters.push(new nlobjSearchFilter("custbody_category4",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
			filters.push(new nlobjSearchFilter("custbody_category5",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
			filters.push(new nlobjSearchFilter("custbody_category6",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
			var results = nlapiSearchRecord("salesorder",null,filters);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					exclude_orders.push(results[x].getId());
				}
			}
		}
		
		
		var filters = [];
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
		filters.push(new nlobjSearchFilter("custbody249",null,"on","today"));
		filters.push(new nlobjSearchFilter("amount",null,"greaterthan","0.00"));
		filters.push(new nlobjSearchFilter("custbody87",null,"noneof",["2","3","4","10","17"]));
		filters.push(new nlobjSearchFilter("customform",null,"noneof",["152","169"]));
		filters.push(new nlobjSearchFilter("custbody152",null,"isempty"));
		if(exclude_orders.length > 0)
		{
			filters.push(new nlobjSearchFilter("internalid",null,"noneof",exclude_orders));
		}
		var cols = [];
		cols.push(new nlobjSearchColumn("tranid"));
		cols.push(new nlobjSearchColumn("trandate"));
		cols.push(new nlobjSearchColumn("entity"));
		cols.push(new nlobjSearchColumn("custbody110")); //Date to Ship
		cols.push(new nlobjSearchColumn("custbody249")); //Date to Print
		cols.push(new nlobjSearchColumn("firstname","customer").setSort());
		cols.push(new nlobjSearchColumn("lastname","customer"));
		var results = nlapiSearchRecord("salesorder",null,filters,cols);
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				orders.push({
					custpage_internalid : results[x].getId(),
					custpage_number : results[x].getValue("tranid"),
					custpage_date : results[x].getValue("trandate"),
					custpage_customer : results[x].getValue("firstname","customer") + " " + results[x].getValue("lastname","customer"),
					custpage_date_to_print : results[x].getValue("custbody249")
				});
			}
		}
		
		var list = form.addSubList("custpage_orders","list","Sales Orders");
		list.addField("custpage_print","checkbox","Print?");
		list.addField("custpage_internalid","text","Sales Order Internal ID").setDisplayType("hidden");
		list.addField("custpage_number","text","Sales Order #");
		list.addField("custpage_date","date","Date");
		list.addField("custpage_customer","text","Customer");
		list.addField("custpage_date_to_print","date","Date To Print");
		
		list.setLineItemValues(orders);
		
		list.addMarkAllButtons();
		
		form.addSubmitButton("Print Selected");
		
		response.writePage(form);
	}
	else
	{
		var orders = [];
		for(var x=0; x < request.getLineItemCount("custpage_orders"); x++)
		{
			if(request.getLineItemValue("custpage_orders","custpage_print",x+1)=="T")
				orders.push(request.getLineItemValue("custpage_orders","custpage_internalid",x+1));
		}
		
		var xml = "";
		xml += "<?xml version=\"1.0\"?>";
		xml += "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">";
		xml += "<pdf>";
		xml += "<head>";
		xml += "<link name='freightDispPro' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_book.otf'/>";
		xml += "<link name='freightDispSB' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_semibold.otf'/>";
		xml += "<link name='brandonMed' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/Brandon_med.otf'/>";
		xml += "<link name='brandon' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/Brandon_reg.otf'/>";
		xml += "<link name='brandonBold' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/Brandon_bld.otf'/>";
		xml += "<style>";
		xml += " .brandonGrotesqueMed {font-family:brandonMed;}";
		xml += " .brandonGrotesque {font-family:brandon;}";
		xml += " .brandonGrotesqueBold {font-family:brandonBold;}";
		xml += " .freightDispProSB {font-family:freightDispSB;}";
		xml += " .freightDispPro {font-family:freightDispPro;}";
		xml += " .pt9 {font-size:9pt; line-height: 11pt;}";
		xml += " .pt10 {font-size:10pt; line-height: 14pt;}";
		xml += " .photo {}";
		xml += " .topborder {border-top: 1px solid black; margin-left: 400px;}";
		xml += "</style>";
		xml += "<macrolist>";
		xml += "<macro id='nlheader'>";
		xml += "<table cellborder='0' cellmargin='0' cellpadding='0'><tr><td style='color: #ffffff;'>Header</td></tr></table>";
		//xml += "<hr color='#959595'/>";
		xml += "</macro>";
		xml += "</macrolist>";
		xml += "</head>";
		xml+= "<body size='letter' header='nlheader' header-height='35px'>";
		
		var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_template_file");
		var templateFile = nlapiLoadFile(templateID);
		var template = templateFile.getValue();
		var iaTemp = Handlebars.compile(template);
		var pages = 0;
		var email = false;
		
		for(var t=0; t < orders.length; t++)
		{
			pages = 0;
			var orderId = orders[t];
			var order = nlapiLoadRecord("salesorder",orderId);
			var customer_name = nlapiLookupField("customer",order.getFieldValue("entity"),["firstname","lastname"]);
			customer_name = nlapiEscapeXML(customer_name.firstname) + " " + nlapiEscapeXML(customer_name.lastname);
			
			var currency = order.getFieldValue("currency");
			switch(currency)
			{
				case "1":
					currency = "USD";
					break;
				case "3":
					currency = "CAD";
					break;
				case "5":
					currency = "AUD";
					break;
				default:
					currency = "USD";
					break;
			}
			
			if(t!=0)
				xml += "<pbr size='letter' header='nlheader' header-height='35px'/>";
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
				if(category=="2")
				{
					//Setting with large center stone
					var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9"];
					var diamondFields = ["custitem5","custitem28","custitem7","custitem19","custitem27","itemid","custitem18"];
					var diamondID = "";
					var sapphireID = "";
					var image = "";
					var replacementAmount = 0.00;
					var gemstone = "";
					var gemstone_desc = "";
					var centerHeader = "CENTER DIAMOND";
					replacementAmount += parseFloat(order.getLineItemValue("item","rate",x+1));
					
					nlapiLogExecution("debug","Replacement Amount",replacementAmount);
					
					for(var i=0; i < order.getLineItemCount("item"); i++)
					{
						if(x==i)
							continue;
						
						var sub_category = nlapiLookupField("item",order.getLineItemValue("item","item",i+1),"custitem20");
						if(sub_category=="7")
						{
							diamondID = order.getLineItemValue("item","item",i+1);
							replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
							nlapiLogExecution("debug","Replacement Amount",replacementAmount);
							break;
						}		
						else if(sub_category=="8" || sub_category=="13" || sub_category=="14" || sub_category=="20" || sub_category=="18")
						{
							sapphireID = order.getLineItemValue("item","item",i+1);
							replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
							nlapiLogExecution("debug","Replacement Amount",replacementAmount);
							break;
						}
					}				
					
					var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
					
					var diamond = null;
					if(diamondID!="")
					{
						diamond = nlapiLookupField("item",diamondID,diamondFields,true);
						diamond.itemid = nlapiLookupField("item",diamondID,"itemid");
						diamond.custitem27 = nlapiLookupField("item",diamondID,"custitem27") + "ct";
						
						//Only include is Origin = LAB GROWN or LAB CREATED
						if(diamond.custitem18!="Lab Grown" && diamond.custitem18!="Lab Created")
							diamond.custitem18 = "";
					}
					if(sapphireID!="")
					{
						diamond = nlapiLookupField("item",sapphireID,diamondFields,true);
						diamond.itemid = nlapiLookupField("item",sapphireID,"itemid");
						nlapiLogExecution("debug","Item ID",diamond.itemid);
						diamond.custitem27 = nlapiLookupField("item",sapphireID,"custitem27");
						var centerHeader = "CENTER GEMSTONE";
						gemstone = "T";
						gemstone_desc = nlapiEscapeXML(nlapiLookupField("item",sapphireID,"salesdescription"));
						
						diamond.custitem18 = "";
					}
					
						
					if(pages > 0)
						xml += "<pbr size='letter' header='nlheader' header-height='35px'/>";
					
					var accentText = "";
					var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
					if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
						accentText = item["parent.custitem101"];
						
					if(accentText!="" && accentText!=null)
					{
						accentText = accentText.split("\n");
						for(var i=0; i < accentText.length; i++)
						{
							var line = accentText[i].split(":");
							
							if(line[0].toLowerCase()=="number of gemstones" || line[0].toLowerCase()=="treatment")
								continue;
							
							accentTable += "<tr>";
							accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
							accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
							accentTable += "</tr>";
						}
						
						accentTable += "</table>";
					}
					else
					{
						accentTable = "";
					}
					
						
					if(diamond==null)
					{
						diamond = {
							custitem27 : "",
							custitem7 : "",
							custitem19 : "",
							custitem28 : "",
							custitem18 : ""
						}
					}
					
					nlapiLogExecution("debug","Tax Rate",order.getFieldValue("taxrate"));
					/*
					if(order.getFieldValue("taxrate") > 0)
					{
						var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
						replacementAmount = replacementAmount * taxrate;
					}
					*/
					
					nlapiLogExecution("debug","Replacement Amount",replacementAmount);
						
					replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
					
					nlapiLogExecution("debug","Replacement Amount",replacementAmount);

					var cutString = "";
					if(diamond.custitem5!=null && diamond.custitem5!="")
						cutString += diamond.custitem5;
					if(diamond.custitem28!=null && diamond.custitem28!="" && cutString!="")
						cutString += ", ";
					if(diamond.custitem28!=null && diamond.custitem28!="")
						cutString += diamond.custitem28;
						
					var center_section = "";
					if(diamond.custitem27!=null && diamond.custitem27!="")
						center_section = "T";
					if(cutString!=null && cutString!="")
						center_section = "T";
					if(diamond.custitem7!=null && diamond.custitem7!="")
						center_section = "T";
					if(diamond.custitem19!=null && diamond.custitem19!="")
						center_section = "T";
					
					if(sapphireID!="")
					{
						cutString = "";
						center_section = "";
						color = "";
						clarity = "";
					}
					
					var pdf = {
						date : formatDate(order.getFieldValue("trandate")),
						name : customer_name,
						address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
						city : nlapiEscapeXML(order.getFieldValue("billcity")),
						state : order.getFieldValue("billstate"),
						zipcode : order.getFieldValue("billzip"),
						type_of_jewelry : "One Lady's Engagement Ring",
						setting : "Brilliant Earth's " + item["parent.salesdescription"],
						material : setMetal(item.custitem1),
						carat : sapphireID!="" ? "" : diamond.custitem27,
						cut : sapphireID!="" ? "" : cutString,
						color : sapphireID!="" ? "" : diamond.custitem7,
						clarity : sapphireID!="" ? "" : diamond.custitem19,
						center_diamond : "",
						accent_carat_weight : accentTable,
						replacement_price : currency + " " + addCommas(replacementAmount),
						disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer")),
						signatory : "",
						signatory_title : "",
						order_number : order.getFieldValue("tranid"),
						center_section : center_section,
						center_header : centerHeader,
						gemstone : gemstone,
						gemstone_desc : gemstone_desc,
						origin : diamond.custitem18
					};
					
					nlapiLogExecution("debug","PDF JSON",JSON.stringify(pdf));
						
					for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
					{
						if(pages > 0)
						{
							xml += "<pbr size='letter' header='nlheader' header-height='35px'/>";
						}
						
						xml += iaTemp(pdf);
						pages++;
					}
				}
				else if(category=="3")
				{
					//Wedding Bands
					if(pages > 0)
						xml += "<pbr size='letter' header='nlheader' header-height='35px'/>";
					
					var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9"];
					var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
					
					var replacementAmount = order.getLineItemValue("item","amount",x+1);
					/*
					if(order.getFieldValue("taxrate") > 0)
					{
						var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
						replacementAmount = replacementAmount * taxrate;
					}
					*/
					
					replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
					
					var accentText = "";
					var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
					if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
						accentText = item["parent.custitem101"];
						
					if(accentText!="" && accentText!=null)
					{
						accentText = accentText.split("\n");
						for(var i=0; i < accentText.length; i++)
						{
							var line = accentText[i].split(":");
							
							if(line[0].toLowerCase()=="number of gemstones" || line[0].toLowerCase()=="treatment")
								continue;
							
							accentTable += "<tr>";
							accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
							accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
							accentTable += "</tr>";
						}
						
						accentTable += "</table>";
					}
					else
					{
						accentTable = "";
					}

					var pdf = {
						date : formatDate(order.getFieldValue("trandate")),
						name : customer_name,
						address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
						city : nlapiEscapeXML(order.getFieldValue("billcity")),
						state : order.getFieldValue("billstate"),
						zipcode : order.getFieldValue("billzip"),
						type_of_jewelry : "One wedding band",
						setting : "Brilliant Earth's " + item["parent.salesdescription"],
						material : setMetal(item.custitem1),
						carat : "",
						cut : "",
						color : "",
						clarity : "",
						center_diamond : "",
						accent_carat_weight : accentTable,
						replacement_price : currency + " " + addCommas(replacementAmount),
						disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer")),
						signatory : "",
						signatory_title : "",
						order_number : order.getFieldValue("tranid"),
						center_section : "",
						center_header : "",
						gemstone : "",
						gemstone_desc : "",
						origin : ""
					};
						
					for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
					{
						if(pages > 0)
						{
							xml += "<pbr size='letter' header='nlheader' header-height='35px'/>";
						}
						
						xml += iaTemp(pdf);
						pages++;
					}
				}
				else if(category=="24")
				{
					//Estate Rings
					var fields = ["salesdescription","custitem51","custitem61","custitem64","custitem77"];
					var fields2 = ["custitem56","custitem64"];
					var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
					var item2 = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields2,true);
					
					if(pages > 0)
						xml += "<pbr size='letter' header='nlheader' header-height='35px'/>";
					
					var replacementAmount = order.getLineItemValue("item","amount",x+1);
					/*
					if(order.getFieldValue("taxrate") > 0)
					{
						var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
						replacementAmount = replacementAmount * taxrate;
					}
					*/
					
					replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.10)));
					
					var centerText = item.custitem51;
					var centerTable = "<table cellpadding='0' cellmargin='0' cellborder='0' margin-left='10px'>";
					if(centerText!="" && centerText!=null)
					{
						centerText = centerText.split(",");
						for(var i=0; i < centerText.length; i++)
						{
							centerTable += "<tr>";
							centerTable += "<td width='250px' class='freightDispPro pt10'>" + nlapiEscapeXML(centerText[i]) + "</td>";
							centerTable += "</tr>";
						}
						
						centerTable += "</table>";
					}
					else
					{
						centerTable = "";
					}
					
					var accentText = item.custitem61;
					var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0' margin-left='10px' margin-bottom='10px'>";
					if(accentText!="" && accentText!=null)
					{
						accentText = accentText.split(",");
						for(var i=0; i < accentText.length; i++)
						{
							accentTable += "<tr>";
							accentTable += "<td width='250px' class='freightDispPro pt10'>" + nlapiEscapeXML(accentText[i]) + "</td>";
							accentTable += "</tr>";
						}
						
						accentTable += "</table>";
					}
					else
					{
						accentTable = "";
					}
					
					var pdf = {
						date : formatDate(order.getFieldValue("trandate")),
						name : customer_name,
						address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
						city : nlapiEscapeXML(order.getFieldValue("billcity")),
						state : order.getFieldValue("billstate"),
						zipcode : order.getFieldValue("billzip"),
						type_of_jewelry : "One " + item2.custitem56,
						setting : nlapiEscapeXML("One-of-a-Kind Vintage Estate Piece " + item.custitem77),
						material : setMetal(item.custitem64),
						carat : "",
						cut : "",
						color : "",
						clarity : "",
						center_diamond : centerTable,
						accent_carat_weight : accentTable,
						replacement_price : currency + " " + addCommas(replacementAmount),
						disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer")),
						signatory : "",
						signatory_title : "",
						order_number : order.getFieldValue("tranid"),
						center_section : "",
						center_header : "CENTER GEMSTONE",
						gemstone : "",
						gemstone_desc : "",
						origin : ""
					};
						
					for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
					{
						if(pages > 0)
						{
							xml += "<pbr size='letter' header='nlheader' header-height='35px'/>";
						}
						
						xml += iaTemp(pdf);
						pages++;
					}
				}
			}
		}
		
		xml += "</body></pdf>";
		
		var file = nlapiXMLToPDF(xml);
		response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
		response.write(file.getValue());
	}
}

function setMetal(metalID)
{
	var metalName = "";
	switch(metalID)
	{
		case "3":
			metalName = "950 Platinum";
			break;
		case "1":
			metalName = "18K White Gold";
			break;
		case "2":
			metalName = "18K Yellow Gold";
			break;
		case "7":
			metalName = "14K Rose Gold";
			break;
		case "4":
			metalName = "Palladium";
			break;
		case "32":
			metalName = "18K Rose Gold";
			break;
		case "5":
			metalName = "14K White Gold";
			break;
		case "6":
			metalName = "14K Yellow Gold";
			break;
		case "8":
			metalName = "18K Palladium White";
			break;
		case "25":
			metalName = "10K White Gold";
			break;
		case "27":
			metalName = "10K Yellow Gold";
			break;
		case "35":
			metalName = "22K Yellow Gold";
			break;
		case "36":
			metalName = "9K Yellow Gold";
			break;
	}
	return metalName;
}

function formatDate(dateStr)
{
	var rtnStr = "";
	var dateObj = nlapiStringToDate(dateStr);
	var month = dateObj.getMonth();
	switch(month)
	{
		case 0:
			rtnStr += "January ";
			break;
		case 1:
			rtnStr += "February ";
			break;
		case 2:
			rtnStr += "March ";
			break;
		case 3:
			rtnStr += "April ";
			break;
		case 4:
			rtnStr += "May ";
			break;
		case 5:
			rtnStr += "June ";
			break;
		case 6:
			rtnStr += "July ";
			break;
		case 7:
			rtnStr += "August ";
			break;
		case 8:
			rtnStr += "September ";
			break;
		case 9:
			rtnStr += "October ";
			break;
		case 10:
			rtnStr += "November ";
			break;
		case 11:
			rtnStr += "December ";
			break;
	}
	
	rtnStr += dateObj.getDate() + ", " + dateObj.getFullYear();
	
	return rtnStr;
}

function getSapphire(netsuiteID)
{
	var rtnStr = "";
	switch(netsuiteID)
	{
		case "SBSL6.0RD2":
			rtnStr = "SB6RD";
			break;
		case "SPSL6.0RD2":
			rtnStr = "SP6RD";
			break;
		case "SBSL6.5RD3":
			rtnStr = "SB65RD";
			break;
		case "SBSL6.0CU3":
			rtnStr = "SB6XCU";
			break;
		case "SBSL8X6OV3":
		case "SBSL8x6OV3":
			rtnStr = "SB8X6OV";
			break;
		case "SBSL5.5RD3":
			rtnStr = "SB55RD";
			break;
		case "SVSL6.0RD2":
			rtnStr = "SV6RD";
			break;
	}
	
	return rtnStr;
}

function addCommas(nStr)
{
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
