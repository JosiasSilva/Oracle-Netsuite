function Insurance_Appraisal(request,response)
{
	try
	{
		var email = request.getParameter("email");
		if(email==null || email=="")
			email = false;
		if(email=="true")
			email = true;
		
		var orderId = request.getParameter("order");
		var order = nlapiLoadRecord("salesorder",orderId);
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
		
		var pages = 0;
		var today = new Date(); 
		var dd = today.getDate(); 
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear(); 
		var todaysDate=mm+'/'+dd+'/'+yyyy;
		
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
		xml += "</head>";
		xml+= "<body size='letter'>";
		
		var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_ia_template_file");
		var templateFile = nlapiLoadFile(templateID);
		var template = templateFile.getValue();
		var iaTemp = Handlebars.compile(template);
		
		var customer_name = nlapiLookupField("customer",order.getFieldValue("entity"),["firstname","lastname"]);
			customer_name = nlapiEscapeXML(customer_name.firstname) + " " + nlapiEscapeXML(customer_name.lastname);
		
		for(var x=0; x < order.getLineItemCount("item"); x++)
		{
			var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
			if(category=="2")
			{
				//Setting with large center stone
				var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
				var diamondFields = ["custitem5","custitem28","custitem7","custitem19","custitem27","itemid","custitem18"];
				var diamondID = "";
				var sapphireID = "";
				var image = "";
				var gemstone = "";
				var gemstone_desc = "";
				var replacementAmount = 0.00;
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
						image += "http://image.brilliantearth.com/media/shape_images/";
						replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
						nlapiLogExecution("debug","Replacement Amount",replacementAmount);
						break;
					}		
					else if(sub_category=="8" || sub_category=="13" || sub_category=="14" || sub_category=="20" || sub_category=="18")
					{
						sapphireID = order.getLineItemValue("item","item",i+1);
						image += "http://image.brilliantearth.com/media/images/";
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
					image += item["parent.itemid"] + "_" + diamond.custitem5.toLowerCase() + "_";
					
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
					image += item["parent.itemid"] + "-" + getSapphire(diamond.itemid) + "_";
					centerHeader = "CENTER GEMSTONE";
					gemstone = "T";
					gemstone_desc = nlapiEscapeXML(nlapiLookupField("item",sapphireID,"salesdescription"));
					
					diamond.custitem18 = "";
				}
				
				switch(item.custitem1)
				{
					case "1": //18K White Gold
					case "3": //Platinum
						image += "white";
						break;
					case "2": //18K Yellow Gold
						image += "yellow";
						break;
					case "7": //14K Rose Gold
						image += "rose";
						break;
				}
				image += "_top_t_w300_h300.jpg";
					
				if(pages > 0)
					xml += "<pbr/>";
				
				var accentText = "";
				var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
				if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
					accentText = item["parent.custitem101"];
					
				//If vendor is Harout R, then use website text as sub-items are not populated
				if(item["vendor"]=="1223843")
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
				
				var imgCheck = nlapiRequestURL(image);
				if(imgCheck.getCode()!="200")
					image = "";
					
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
					logo : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo")),
					title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_title"),
					//date : formatDate(order.getFieldValue("trandate")),
					date : formatDate(todaysDate),
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
					image : image,
					disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer")),
					signatory : "",
					signatory_title : "",
					order_number : order.getFieldValue("tranid"),
					center_section : center_section,
					center_header : centerHeader,
					gemstone : gemstone,
					gemstone_desc : gemstone_desc,
					origin : diamond.custitem18
				};
				
				if(email)
					pdf.letterhead = "yes";
				else
					pdf.letterhead = "";
				
				nlapiLogExecution("debug","PDF JSON",JSON.stringify(pdf));
				
				if(email)
					xml += "<img align='center' src='" + nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo") + "' />";
				else
					xml += "<div style='height: 60px;'> </div>";
					
				for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
				{
					if(pages > 0)
					{
						xml += "<pbr/>";
						if(email)
							xml += "<img align='center' src='" + nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo") + "' />";
						else
							xml += "<div style='height: 60px;'> </div>";
					}
					
					xml += iaTemp(pdf);
					pages++;
				}	
			}
			else if(category=="3")
			{
				//Wedding Bands
				
				var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
				var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
				
				var replacementAmount = order.getLineItemValue("item","rate",x+1);
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
					
				//If vendor is Harout R, then use website text as sub-items are not populated
				if(item["vendor"]=="1223843")
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
				
				var image = "http://image.brilliantearth.com/media/images/" + item["parent.itemid"] + "_";
				switch(item.custitem1)
				{
					case "1": //18K White Gold
					case "3": //Platinum
						image += "white";
						break;
					case "2": //18K Yellow Gold
						image += "yellow";
						break;
					case "7": //14K Rose Gold
						image += "rose";
						break;
				}
				image += "_top_t_w300_h300.jpg";
				nlapiLogExecution("debug","Ring Image",image);
				
				var imgCheck = nlapiRequestURL(image);
				if(imgCheck.getCode()!="200")
					image = "";
				
				var pdf = {
					logo : nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo"),
					title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_title"),
					//date : formatDate(order.getFieldValue("trandate")),
					date : formatDate(todaysDate),
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
					image : image,
					disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer")),
					signatory : "",
					signatory_title : "",
					order_number : order.getFieldValue("tranid"),
					center_section : "",
					center_header : "",
					gemstone : "",
					gemstone_desc : "",
					origin : ""
				};
				
				if(email)
					pdf.letterhead = "yes";
				else
					pdf.letterhead = "";
				
				if(email)
					xml += "<img align='center' src='" + nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo") + "' />";
				else
					xml += "<div style='height: 60px;'> </div>";
					
				for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
				{
					if(pages > 0)
					{
						xml += "<pbr/>";
						if(email)
							xml += "<img align='center' src='" + nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo") + "' />";
						else
							xml += "<div style='height: 60px;'> </div>";
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
				
				var replacementAmount = order.getLineItemValue("item","rate",x+1);
				
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
				/*
				var imgCheck = nlapiRequestURL(image);
				if(imgCheck.getCode()!="200")
					image = "";
				*/
				
				var pdf = {
					logo : nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo"),
					title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_title"),
					//date : formatDate(order.getFieldValue("trandate")),
					date : formatDate(todaysDate),
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
					image : "",
					disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer")),
					signatory : "",
					signatory_title : "",
					order_number : order.getFieldValue("tranid"),
					center_section : "",
					center_header : "CENTER GEMSTONE",
					gemstone : "",
					gemstone_desc : "",
					origin : ""
				};
				
				if(email)
					pdf.letterhead = "yes";
				else
					pdf.letterhead = "";
				
				if(email)
					xml += "<img align='center' src='" + nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo") + "' />";
				else
					xml += "<div style='height: 60px;'> </div>";
					
				for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
				{
					if(pages > 0)
					{
						xml += "<pbr/>";
						if(email)
							xml += "<img align='center' src='" + nlapiGetContext().getSetting("SCRIPT","custscript_ia_logo") + "' />";
						else
							xml += "<div style='height: 60px;'> </div>";
					}
					
					xml += iaTemp(pdf);
					pages++;
				}	
			}
		}
		
		xml += "</body></pdf>";
		
		var file = nlapiXMLToPDF(xml);         
		response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
		response.write(file.getValue());
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Generating Insurance Appraisal for Order ID " + orderId,"Details: " + err.message);
		return true;
	}
}

function IA_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
			filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
			filters.push(new nlobjSearchFilter("itemid","item","contains","custom"));
			var results = nlapiSearchRecord("salesorder",null,filters);
			if(results)
				return true;
				
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
			filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
			filters.push(new nlobjSearchFilter("memo",null,"contains","modified"));
			var results = nlapiSearchRecord("salesorder",null,filters);
			if(results)
				return true;
			
			var url = nlapiResolveURL("SUITELET","customscript_create_ia_form","customdeploy_create_ia_form");
			url += "&order=" + nlapiGetRecordId();
			
			//form.addButton("custpage_ia_button","Create IA Form","window.location.href='"+url+"';");
			form.addButton("custpage_ia_button", "Create IA Form", "window.open('" + url + "', 'printIA', 'location=no,menubar=yes,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=yes,height=600,width=800')")
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing IA Form Button","Details: " + err.message);
			return true;
		}
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
