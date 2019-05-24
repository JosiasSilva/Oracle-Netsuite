var FEDEX_RETURN_TAG_PRODUCTION = "26472180";
var FEDEX_RETURN_TAG_SANDBOX = "22330188";
var DATA_CENTER_URL = "";

function Web_Resize_Requests_BS(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var recordType = nlapiGetRecordType();
			
			var record = nlapiGetNewRecord();
			
			var returnInsurance = 0.00;
			
			var typeOfSendBack = record.getFieldValue("custbody35");
			var typeOfOrder = record.getFieldValue("custbody87");
			
			if(recordType=="salesorder")
			{
				//BEGIN SET FIELDS ON CREATION FOR WEB RESIZE SCRIPT (BEFORE SUBMIT)
				if(type=="create")
				{
					var get_class = record.getFieldValue('class');
					if(get_class=='184')
					{
						for(var a=1; a <= record.getLineItemCount('item'); a++)
						{
							try
							{
								var item_obj=[];
								nlapiSelectLineItem('item',a);
								var get_center_gem_item = nlapiGetCurrentLineItemValue('item','custcol_center_gem_item');
								var get_center_gem_item_text = nlapiGetCurrentLineItemText('item','custcol_center_gem_item');
								if(get_center_gem_item)
								{
									item_obj.push(get_center_gem_item);
								}
								
								var get_item_sku=nlapiGetCurrentLineItemValue('item','custcol_item_sku_so');
								if(get_item_sku)
								{
									item_obj.push(get_item_sku);
								}
								
								if(item_obj.length > 0)
								{
									var item_insurence_amount = 0;
									var columns = [];
									columns.push(new nlobjSearchColumn('baseprice'));
									columns.push(new nlobjSearchColumn('salesdescription'));
									columns.push(new nlobjSearchColumn('custitem46'));
									columns.push(new nlobjSearchColumn('custitem20'));
									var search_amount = nlapiSearchRecord('item',null,new nlobjSearchFilter('internalid',null,'anyof',item_obj),columns);
									if(search_amount)
									{
										for(var b=0;b < search_amount.length; b++)
										{
											var get_id = search_amount[b].getId();
											if(get_id==get_center_gem_item)
											{
												item_insurence_amount += parseFloat(search_amount[b].getValue('baseprice'))*.8;
												var category = search_amount[b].getValue('custitem20');
												comment += 'Set with: ';
												var comment = 'SKU: '+get_center_gem_item_text+'\n';
												comment += 'Description: '+ search_amount[b].getValue('salesdescription')+'\n';
												if(category=='7')
												{
													comment+='Certificate #'+ search_amount[b].getValue('custitem46')+'\n';
												}
												comment+='Arriving from SF: ';
												nlapiSetCurrentLineItemValue('item','custcol5',comment,true,true);
											}
											else
											{
												item_insurence_amount+=parseFloat(search_amount[b].getValue('baseprice'))*.8;
											}
										}
										nlapiSetCurrentLineItemValue('item','custcol_full_insurance_value',item_insurence_amount.toFixed(2),true,true);
										nlapiCommitLineItem ('item'); 
									}
								}
							}
							catch(er)
							{
								nlapiLogExecution("error","Error Setting Fields on Creation for Web Resize","Details: " + er.message);
							}
						}
					}
				}
				//END SET FIELDS ON CREATION FOR WEB RESIZE SCRIPT (BEFORE SUBMIT)
				
				if(typeOfSendBack=="2")
				{
					for(var x=0; x < record.getLineItemCount("item"); x++)
					{
						returnInsurance += parseFloat(record.getLineItemValue("item","custcol_full_insurance_value",x+1));
					}
				}
				else if(typeOfOrder=="4")
				{
					//Type of Order = Exchange
					var createdFrom = record.getFieldValue("custbody_created_from");
					if(createdFrom!=null && createdFrom!="")
					{
						returnInsurance = nlapiLookupField("salesorder",createdFrom,"custbody_full_insurance_amount");
					}
				}
				else
				{
					for(var x=0; x < record.getLineItemCount("item"); x++)
					{
						if(record.getLineItemValue("item","custcol_category",x+1)=="12")
						{
							returnInsurance += parseFloat(record.getLineItemValue("item","custcol_full_insurance_value",x+1));
						}
					}
				}
			}
			else if(recordType=="returnauthorization")
			{
				for(var x=0; x < record.getLineItemCount("item"); x++)
				{
					returnInsurance += parseFloat(record.getLineItemValue("item","custcol_full_insurance_value",x+1));
				}
			}
			
			//nlapiSubmitField(recordType,nlapiGetRecordId(),"custbody_return_label_insurance",returnInsurance);
			nlapiSetFieldValue("custbody_return_label_insurance",returnInsurance,true,true);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Calculating Return Label Insurance","Details: " + err.message);
		}
	}
}

function Web_Resize_Requests_AS(type)
{
	if(type=="create")
	{
		try
		{
			var order = nlapiGetNewRecord();
			
			//Return Label Status = 'Website Generated Label'
			if(order.getFieldValue("custbody138")=="6")
			{
				var now = new Date();
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
				
				var shipMethod = "FEDEX_2_DAY";
				
				//var insurance = parseFloat(order.getFieldValue("custbody_return_label_insurance"));
				
				//Get insurance figures from items on order
				var insurance = 0.00;
				var items = [];
				for(var x=0; x < order.getLineItemCount("item"); x++)
				{
					var item_sku = order.getLineItemValue("item","custcol_item_sku_so",x+1);
					var center_gemstone = order.getLineItemValue("item","custcol_center_gem_item",x+1);
					
					if(item_sku!=null && item_sku!="")
					{
						var item_sku_price = nlapiLookupField("item",item_sku,"baseprice");
						item_sku_price = item_sku_price * 0.80;
						
						nlapiLogExecution("debug","Adding Insurance for Item SKU " + order.getLineItemText("item","custcol_item_sku_so",x+1),"Insurance: " + item_sku_price);
						insurance += parseFloat(item_sku_price);
					}
					
					nlapiLogExecution("debug","Insurance Value: " + insurance);
					
					if(center_gemstone!=null && center_gemstone!="")
					{
						var center_gemstone_price = nlapiLookupField("item",center_gemstone,"baseprice");
						center_gemstone_price = center_gemstone_price * 0.80;
						
						nlapiLogExecution("debug","Adding Insurance for Center Gem " + order.getLineItemText("item","custcol_center_gem_item",x+1),"Insurance: " + center_gemstone_price);
						insurance += parseFloat(center_gemstone_price);
					}
					
					nlapiLogExecution("debug","Insurance Value: " + insurance);
				}
				
				nlapiLogExecution("debug","Final Insurance Value: " + insurance);
				
				var insurance_label = "";
				if(insurance > 15000 && shipMethod=="FEDEX_2_DAY")
				{
					var diff = insurance - 15000;
					insurance = 15000;
					
					insurance_label = "RE2014" + parseInt(diff) + "200305";
				}
				else if(insurance > 50000)
				{
					var diff = insurance - 50000;
					insurance = 50000;
					
					insurance_label = "RE2014" + parseInt(diff) + "200305";
				}
				else
				{
					insurance_label = "BEF8956" + parseInt(insurance) + "X1560";
				}
				
				var labelObj = {
					ship_timestamp : timestamp,
					service_type : shipMethod,
					insurance_value : insurance,
					insurance_label : insurance_label,
					tranid : order.getFieldValue("tranid"),
					ship_to_addressee : "",
					ship_to_address_1 : "",
					ship_to_address_2 : "",
					ship_to_city : "",
					ship_to_state : "",
					ship_to_zip : "",
					ship_to_country : ""
				};
				
				//Get return label email config record
				var shipToLocation = "2"; 
				var typeOfOrder = order.getFieldValue("custbody87");
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_rlec_order_type",null,"anyof",typeOfOrder));
				var cols = [];
				cols.push(new nlobjSearchColumn("custrecord_inventory_location_returns"));
				var results = nlapiSearchRecord("customrecord_return_label_email_config",null,filters,cols);
				if(results)
				{
					if(results[0].getValue("custrecord_inventory_location_returns")!=null && results[0].getValue("custrecord_inventory_location_returns")!=null)
						shipToLocation = results[0].getValue("custrecord_inventory_location_returns");
				}
				
				//Get address details from location record
				var shipToFilters = [];
				shipToFilters.push(new nlobjSearchFilter("internalid",null,"is",shipToLocation));
				var shipToCols = [];
				shipToCols.push(new nlobjSearchColumn("address1","address"));
				shipToCols.push(new nlobjSearchColumn("address2","address"));
				shipToCols.push(new nlobjSearchColumn("city","address"));
				shipToCols.push(new nlobjSearchColumn("state","address"));
				shipToCols.push(new nlobjSearchColumn("zip","address"));
				shipToCols.push(new nlobjSearchColumn("countrycode","address"));
				shipToCols.push(new nlobjSearchColumn("phone","address"));
				shipToCols.push(new nlobjSearchColumn("addressee","address"));
				shipToCols.push(new nlobjSearchColumn("attention","address"));
				var shipToResults = nlapiSearchRecord("location",null,shipToFilters,shipToCols);
				if(shipToResults)
				{
					labelObj.ship_to_addressee = shipToResults[0].getValue("attention","address");
					labelObj.ship_to_address_1 = shipToResults[0].getValue("address1","address");
					labelObj.ship_to_address_2 = shipToResults[0].getValue("address2","address");
					labelObj.ship_to_city = shipToResults[0].getValue("city","address");
					labelObj.ship_to_state = shipToResults[0].getValue("state","address");
					labelObj.ship_to_zip = shipToResults[0].getValue("zip","address");
					labelObj.ship_to_country = shipToResults[0].getValue("countrycode","address");
					labelObj.ship_to_phone = shipToResults[0].getValue("phone","address");	
				}
				
				if(nlapiGetContext().getEnvironment()=="SANDBOX")
					templateID = FEDEX_RETURN_TAG_SANDBOX;
				else
					templateID = FEDEX_RETURN_TAG_PRODUCTION;
				
				nlapiLogExecution("debug","FedEx Template ID",templateID);
				var templateFile = nlapiLoadFile(templateID);
				var template = templateFile.getValue();
				var xmlTemp = Handlebars.compile(template);
				
				var soap = xmlTemp(labelObj);
				
				var headers = new Object();
				headers["Content-Type"] = "application/xml";
				
				nlapiLogExecution("debug","Environment",nlapiGetContext().getEnvironment());
				
				//if(nlapiGetContext().getEnvironment()=="PRODUCTION")
				//	var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
				//else if(nlapiGetContext().getEnvironment()=="SANDBOX")
				//	var cResp = nlapiRequestURL("https://wsbeta.fedex.com:443/web-services",soap,headers);
				
				var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
				
				nlapiLogExecution("debug","Response Code",cResp.getCode());
				nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
				
				var body = cResp.getBody();
				var xmlBody = nlapiStringToXML(body);
				
				var partsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='Label']/*[name()='Parts']")
				var imageXml = nlapiSelectValue(partsNode,".//*[name()='Image']");
				
				nlapiLogExecution("debug","Image XML",imageXml);
				
				var trackingNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='TrackingIds']");
				var trackingNumber = nlapiSelectValue(trackingNode,".//*[name()='TrackingNumber']");
				
				nlapiLogExecution("debug","Tracking Number",trackingNumber);
				
				var file = nlapiCreateFile(order.getFieldValue("tranid") + " return_label.pdf","PDF",imageXml);
				file.setFolder("407735"); //Return Shipping Labels
				file.setIsOnline(true);
				var fileID = nlapiSubmitFile(file);
				
				var xml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
				xml+= "<pdfset>";
				
				getDataCenterURL();
				
				var fileObj = nlapiLoadFile(fileID); //10 Units
				var fileUrl = fileObj.getURL();
				if(nlapiGetContext().getEnvironment()=="PRODUCTION")
					fileUrl = DATA_CENTER_URL + "" + fileUrl;
				else
					fileUrl = DATA_CENTER_URL + "" + fileUrl;
				nlapiLogExecution("debug","File URL",fileUrl);
				
				xml+= "<pdf src='" + nlapiEscapeXML(fileUrl) + "' />";
				
				fileObj = nlapiLoadFile(nlapiGetContext().getSetting("SCRIPT","custscript_return_label_instructions_pdf")); //10 Units
				fileUrl = fileObj.getURL();
				if(nlapiGetContext().getEnvironment()=="PRODUCTION")
					fileUrl = DATA_CENTER_URL + "" + fileUrl;
				else
					fileUrl = DATA_CENTER_URL + "" + fileUrl;
				nlapiLogExecution("debug","File URL",fileUrl);
				
				xml+= "<pdf src='" + nlapiEscapeXML(fileUrl) + "' />";
				
				xml+= "</pdfset>";
				
				var pdf = nlapiXMLToPDF(xml);
				pdf.setFolder("407735");
				pdf.setName(order.getFieldValue("tranid") + " return_label.pdf");
				var pdfId = nlapiSubmitFile(pdf);
				
				nlapiSubmitField("salesorder",nlapiGetRecordId(),["custbody137","custbody123"],[pdfId,trackingNumber]);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Generating Return Label","Details: " + err.message);
		}
	}
}

function getDataCenterURL()
{
	var environment = nlapiGetContext().getEnvironment();
	
	var filters = [];
	filters.push(new nlobjSearchFilter("name",null,"is",environment));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_data_center_url"));
	var results = nlapiSearchRecord("customrecord_data_center_url",null,filters,cols);
	if(results)
		DATA_CENTER_URL = results[0].getValue("custrecord_data_center_url");
}
