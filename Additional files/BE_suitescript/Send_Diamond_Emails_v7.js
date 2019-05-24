var SI = "10";
var SI1 = "7";
var SI2 = "8";

function Send_Diamond_Emails()
{
	//Get user who triggered script
	var user = nlapiGetContext().getSetting("SCRIPT","custscript_custom_diamond_email_user");
	var signature = nlapiLookupField("employee",user,"custentity_custom_emp_msg");
	
	//Get custom diamonds records to be sent out
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecord_diamond_email_status",null,"is","1"));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_be_diamond_stock_number"));
	cols.push(new nlobjSearchColumn("custrecord_vendor_stock_number"));
	cols.push(new nlobjSearchColumn("custrecord_diamond_customer_name"));
	cols.push(new nlobjSearchColumn("custrecord_custom_diamond_vendor"));
	cols.push(new nlobjSearchColumn("custrecord_diamond_inventory_location"));
	cols.push(new nlobjSearchColumn("custrecord_diamond_status"));
	cols.push(new nlobjSearchColumn("custrecord_cdp_group_a"));
	cols.push(new nlobjSearchColumn("custrecord_diamond_so_order_number"));
	cols.push(new nlobjSearchColumn("class","custrecord_diamond_so_order_number"));
	cols.push(new nlobjSearchColumn("custbody147","custrecord_diamond_so_order_number"));
	cols.push(new nlobjSearchColumn("salesdescription","custrecord_be_diamond_stock_number"));
	cols.push(new nlobjSearchColumn("custrecord_custom_diamond_request_type"));
	cols.push(new nlobjSearchColumn("custentity70","custrecord_custom_diamond_vendor")); //Vendor Contact
	cols.push(new nlobjSearchColumn("email","custrecord_custom_diamond_vendor"));
	cols.push(new nlobjSearchColumn("custitem19","custrecord_be_diamond_stock_number")); //Clarity
	cols.push(new nlobjSearchColumn("cost","custrecord_be_diamond_stock_number"));
	cols.push(new nlobjSearchColumn("vendorname","custrecord_be_diamond_stock_number")); //Vendor Name/Code
	cols.push(new nlobjSearchColumn("vendorcost","custrecord_be_diamond_stock_number")); //Vendor Price
	cols.push(new nlobjSearchColumn("custitem5","custrecord_be_diamond_stock_number")); //Gemstone Shape
	cols.push(new nlobjSearchColumn("custitem7","custrecord_be_diamond_stock_number")); //Color
	cols.push(new nlobjSearchColumn("custitem27","custrecord_be_diamond_stock_number")); //Carat
	cols.push(new nlobjSearchColumn("custitem18","custrecord_be_diamond_stock_number")); //Origin
	
	var search = nlapiCreateSearch("customrecord_custom_diamond",filters,cols);
	var resultSet = search.runSearch();
	var searchid = 0;
	do{
		var results = resultSet.getResults(searchid,searchid+1000);
		for(var x=0; x < results.length; x++)
		{
			try
			{
				var request_status = results[x].getValue("custrecord_custom_diamond_request_type");
				
				//Translate location to text version
				var location = results[x].getValue("custrecord_diamond_inventory_location");
				switch(location)
				{
					case "1":
						location = "Chicago";
						break;
					case "9":
						location = "Los Angeles";
						break;
					case "6":
						location = "USNY";
						break;
					case "8":
						location = "Tacoma";
						break;
					case "2":
						location = "San Francisco";
						break;
				}
				
				var vendor = results[x].getValue("custrecord_custom_diamond_vendor");
				var vendor_name = results[x].getValue("vendorname","custrecord_be_diamond_stock_number");
				var vendor_contact = results[x].getValue("custentity70","custrecord_custom_diamond_vendor");
				var eye_clean = "";
				if(results[x].getValue("custitem19","custrecord_be_diamond_stock_number")==SI || results[x].getValue("custitem19","custrecord_be_diamond_stock_number")==SI1 || results[x].getValue("custitem19","custrecord_be_diamond_stock_number")==SI2)
					eye_clean = "Please confirm that it is 100% eye-clean before shipping.";
				var price = results[x].getValue("vendorcost","custrecord_be_diamond_stock_number");
				var item_name = results[x].getText("custrecord_be_diamond_stock_number");
				
				var description = results[x].getText("custitem5","custrecord_be_diamond_stock_number");
					description+= " " + addLeadingZero(results[x].getValue("custitem27","custrecord_be_diamond_stock_number"));
					description+= " " + results[x].getText("custitem19","custrecord_be_diamond_stock_number");
					description+= " " + results[x].getText("custitem7","custrecord_be_diamond_stock_number");
				
				if(results[x].getValue("custrecord_diamond_status")=="8")
				{
					//HOLD RELEASE EMAILS
					var templateID = "299";
					var template = nlapiMergeRecord(templateID,"customrecord_custom_diamond",results[x].getId());
					
					var subject = template.getName();
					subject = subject.replace("[VENDORNAME]",vendor_name);
					subject = subject.replace("[SALESDESCRIPTION]",description);
					
					var body = template.getValue();
					body = body.replace("[VENDORCONTACT]",vendor_contact);
					body = body.replace("[VENDORNAME]",vendor_name);
					body = body.replace("[PRICE]","$"+nlapiFormatCurrency(price));
					body = body.replace("[SALESDESCRIPTION]",description);
					body = body.replace("[SIGNATURE]",signature);
					
					var records = new Object();
					records["recordtype"] = "customrecord_custom_diamond";
					records["record"] = results[x].getId();
					records["entity"] = vendor;
					
					nlapiSendEmail(user,vendor,subject,body,null,null,records);
				}
				else if(request_status=="2" || request_status=="9")
				{
					//MEMO AND APPOINTMENT REQUEST EMAIL
					var templateID = "279";
					var template = nlapiMergeRecord(templateID,"customrecord_custom_diamond",results[x].getId());
					
					var subject = template.getName();
					subject = subject.replace("[VENDORNAME]",vendor_name);
					subject = subject.replace("[SALESDESCRIPTION]",description);
					
					var body = template.getValue();
					body = body.replace("[VENDORCONTACT]",vendor_contact);
					body = body.replace("[EYECLEAN]",eye_clean);
					body = body.replace("[VENDORNAME]",vendor_name);
					body = body.replace("[PRICE]","$"+nlapiFormatCurrency(price));
					body = body.replace("[SALESDESCRIPTION]",description);
					body = body.replace("[SIGNATURE]",signature);
					
					var records = new Object();
					records["recordtype"] = "customrecord_custom_diamond";
					records["record"] = results[x].getId();
					records["entity"] = vendor;
					
					nlapiSendEmail(user,vendor,subject,body,null,null,records);
					//nlapiSendEmail(user,"18918",subject,body,null,null,records);
				}
				else if(request_status=="1" || request_status=="8")
				{
					//SOLD AND REPLACEMENT (CUSTOMER SWITCH) EMAIL
					if(vendor=="584840")
						var templateID = "283";
					else
						var templateID = "278";
						
					var type_of_order = results[x].getValue("class","custrecord_diamond_so_order_number");
					var payment_plan = results[x].getValue("custbody147","custrecord_diamond_so_order_number");
					
					//Check deposit total
					var customdeposit_total = 0;
					var sales_order = nlapiLoadRecord("salesorder",results[x].getValue("custrecord_diamond_so_order_number"));
					var relationRecordCount = sales_order.getLineItemCount('links');
					var total = sales_order.getFieldValue('total');
					for(var i = 1;i <= relationRecordCount;i++){
				        var curr_item_type = sales_order.getLineItemValue('links', 'type', i);
				        if(curr_item_type == "Customer Deposit"){
							var curr_item_tranid = sales_order.getLineItemValue('links','tranid',i);
				            var curr_item_total = getRealAmount(curr_item_tranid);//reference from Global_Config.js
				            customdeposit_total += parseFloat(curr_item_total);
				        }
				    }
					var rate_customdeposit_total = customdeposit_total/parseFloat(total) ;
					
					//If Order Type is Phone: Bank Wire OR Website: Bank Wire OR Payment Plan = Bank Wire
					//AND SO is less than or equal to 49% paid in full
					if((type_of_order=="9" || type_of_order=="6" || payment_plan=="5") && rate_customerdeposit_total <= 0.49)
					{
						//Use HOLD template
						var templateID = "280";
						var template = nlapiMergeRecord(templateID,"customrecord_custom_diamond",results[x].getId());
						
						var subject = template.getName();
						subject = subject.replace("[VENDORNAME]",vendor_name);
						subject = subject.replace("[SALESDESCRIPTION]",description);
						
						var body = template.getValue();
						body = body.replace("[VENDORCONTACT]",vendor_contact);
						body = body.replace("[EYECLEAN]",eye_clean);
						body = body.replace("[VENDORNAME]",vendor_name);
						body = body.replace("[PRICE]","$"+nlapiFormatCurrency(price));
						body = body.replace("[SALESDESCRIPTION]",description);
						body = body.replace("[SIGNATURE]",signature);
					}
					else
					{
						//Handle Group A Sold Diamond
						if(results[x].getValue("custrecord_cdp_group_a")=="T")
							templateID = "289";
						
						var template = nlapiMergeRecord(templateID,"customrecord_custom_diamond",results[x].getId());
						
						var subject = template.getName();
						subject = subject.replace("[VENDORNAME]",vendor_name);
						subject = subject.replace("[LOCATION]",location);
						
						var body = template.getValue();
						body = body.replace("[VENDORNAME]",vendor_name);
						body = body.replace("[EYECLEAN]",eye_clean);
						body = body.replace("[PRICE]","$"+nlapiFormatCurrency(price));
						body = body.replace("[LOCATION]",location);
						body = body.replace("[SALESDESCRIPTION]",description);
						body = body.replace("[SIGNATURE]",signature);
						
						if(vendor=="24771")
						{
							//Vendor = Dalumi
							if(item_name.charAt(item_name.length-2)=="A" && item_name.charAt(item_name.length-1)=="Y")
							{
								subject = subject.replace("[SALESDESCRIPTION]",description+" (IL)");
								body = body.replace("[VENDORCONTACT]","Addi and Ziv");
							}
							else if(item_name.charAt(item_name.length-1)=="Y")
							{
								subject = subject.replace("[SALESDESCRIPTION]",description + " (NY)");
								body = body.replace("[VENDORCONTACT]","Julia");
							}
							else
							{
								subject = subject.replace("[SALESDESCRIPTION]",description);
								body = body.replace("[VENDORCONTACT]",vendor_contact);
							}
						}
						else if(vendor=="69373")
						{
							//Vendor = IGC
							if(item_name.charAt(item_name.length-2)=="A" && item_name.charAt(item_name.length-1)=="Y")
							{
								subject = subject.replace("[SALESDESCRIPTION]",description+" (ANT)");
								body = body.replace("[VENDORCONTACT]","Myriam and Annelies");
							}
							else if(item_name.charAt(item_name.length-1)=="Y")
							{
								subject = subject.replace("[SALESDESCRIPTION]",description + " (NY)");
								body = body.replace("[VENDORCONTACT]","Laurie");
							}
							else
							{
								subject = subject.replace("[SALESDESCRIPTION]",description);
								body = body.replace("[VENDORCONTACT]",vendor_contact);
							}
						}
						else if(vendor=="255782")
						{
							//Vendor = KGK
							if(item_name.charAt(item_name.length-1)=="A")
								subject = subject.replace("[SALESDESCRIPTION]",description+" (" + results[x].getText("custitem18","custrecord_be_diamond_stock_number") + ")");
							else if(item_name.charAt(item_name.length-1)=="Y")
								subject = subject.replace("[SALESDESCRIPTION]",description + " (NY)");
							else
								subject = subject.replace("[SALESDESCRIPTION]",description);
							
							body = body.replace("[VENDORCONTACT]",vendor_contact);
						}
						else
						{
							subject = subject.replace("[SALESDESCRIPTION]",description);
							body = body.replace("[VENDORCONTACT]",vendor_contact);
						}
					}
					
					var records = new Object();
					records["recordtype"] = "customrecord_custom_diamond";
					records["record"] = results[x].getId();
					records["entity"] = vendor;
					
					nlapiSendEmail(user,vendor,subject,body,null,null,records);
					//nlapiSendEmail(user,"18918",subject,body,null,null,records);
				}
				else if(request_status=="4")
				{
					//PHOTOGRAPHY REQUEST EMAIL
					var templateID = "281";
					var template = nlapiMergeRecord(templateID,"customrecord_custom_diamond",results[x].getId());
					
					var subject = template.getName();
					subject = subject.replace("[VENDORNAME]",vendor_name);
					subject = subject.replace("[SALESDESCRIPTION]",description);
					
					var body = template.getValue();
					body = body.replace("[VENDORCONTACT]",vendor_contact);
					body = body.replace("[VENDORNAME]",vendor_name);
					body = body.replace("[PRICE]","$"+nlapiFormatCurrency(price));
					body = body.replace("[SALESDESCRIPTION]",description);
					body = body.replace("[SIGNATURE]",signature);
					
					var records = new Object();
					records["recordtype"] = "customrecord_custom_diamond";
					records["record"] = results[x].getId();
					records["entity"] = vendor;
					
					nlapiSendEmail(user,vendor,subject,body,null,null,records);
					//nlapiSendEmail(user,"18918",subject,body,null,null,records);
				}
				else if(request_status=="5")
				{
					//CHECK AVAILABILITY/EYE-CLEAN EMAIL
					var templateID = "282";
					var template = nlapiMergeRecord(templateID,"customrecord_custom_diamond",results[x].getId());
					
					var subject = template.getName();
					subject = subject.replace("[VENDORNAME]",vendor_name);
					subject = subject.replace("[SALESDESCRIPTION]",description);
					subject = subject.replace("[LOCATION]",location);
					
					var body = template.getValue();
					body = body.replace("[VENDORCONTACT]",vendor_contact);
					body = body.replace("[EYECLEAN]",eye_clean);
					body = body.replace("[VENDORNAME]",vendor_name);
					body = body.replace("[PRICE]","$"+nlapiFormatCurrency(price));
					body = body.replace("[SALESDESCRIPTION]",description);
					body = body.replace("[SIGNATURE]",signature);
					
					var records = new Object();
					records["recordtype"] = "customrecord_custom_diamond";
					records["record"] = results[x].getId();
					records["entity"] = vendor;
					
					nlapiSendEmail(user,vendor,subject,body,null,null,records);
					//nlapiSendEmail(user,"18918",subject,body,null,null,records);
				}
				else if(request_status=="6" || request_status=="7")
				{
					//HOLD EMAIL
					var templateID = "280";
					var template = nlapiMergeRecord(templateID,"customrecord_custom_diamond",results[x].getId());
					
					var subject = template.getName();
					subject = subject.replace("[VENDORNAME]",vendor_name);
					subject = subject.replace("[SALESDESCRIPTION]",description);
					
					var body = template.getValue();
					body = body.replace("[VENDORCONTACT]",vendor_contact);
					body = body.replace("[EYECLEAN]",eye_clean);
					body = body.replace("[VENDORNAME]",vendor_name);
					body = body.replace("[PRICE]","$"+nlapiFormatCurrency(price));
					body = body.replace("[SALESDESCRIPTION]",description);
					body = body.replace("[SIGNATURE]",signature);
					
					var records = new Object();
					records["recordtype"] = "customrecord_custom_diamond";
					records["record"] = results[x].getId();
					records["entity"] = vendor;
					
					nlapiSendEmail(user,vendor,subject,body,null,null,records);
					//nlapiSendEmail(user,"18918",subject,body,null,null,records);
				}
				else if(request_status=="3")
				{
					//CERT REQUEST
					var templateID = "302";
					var template = nlapiMergeRecord(templateID,"customrecord_custom_diamond",results[x].getId());
					
					var subject = template.getName();
					subject = subject.replace("[VENDORNAME]",vendor_name);
					subject = subject.replace("[SALESDESCRIPTION]",description);
					
					var body = template.getValue();
					body = body.replace("[VENDORCONTACT]",vendor_contact);
					body = body.replace("[SALESDESCRIPTION]",description);
					body = body.replace("[SIGNATURE]",signature);
					body = body.replace("[VENDORNAME]",vendor_name);
					body = body.replace("[PRICE]","$"+nlapiFormatCurrency(price));
					
					var records = new Object();
					records["recordtype"] = "customrecord_custom_diamond";
					records["record"] = results[x].getId();
					records["entity"] = vendor;
					
					nlapiSendEmail(user,vendor,subject,body,null,null,records);
				}
				
				//Update custom diamond page fields
				switch(request_status)
				{
					case "1": //Sold
					case "2": //Appointment Request
					case "4": //Photography Request
					case "6": //Hold
					case "8": //Replacement (customer switch)
					case "9": //Memo
					case "7": //Replacement (diamond unavailable)
					case "3": //Cert Request
					case "5": //Check availability/eye-clean
						nlapiSubmitField("customrecord_custom_diamond",results[x].getId(),"custrecord_diamond_email_status","2");
						break;
				}
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Sending Email (Diamond ID: " + results[x].getId(),"Details: " + err.message);
				return true;
			}
			searchid++;
		}
		
	}while(results.length >= 1000);
}

function Trigger_Send_Diamond_Emails(request,response)
{
	if(request.getMethod()=="GET")
	{
		var form = nlapiCreateForm("Send Custom Diamond Page Emails");
		var fld = form.addField("custpage_message","inlinehtml","Message");
		fld.setDefaultValue("Click the button to send all custom diamond emails marked 'To Be Emailed'.")
		form.addSubmitButton("Send");
		
		response.writePage(form);
	}
	else
	{
		var user = nlapiGetUser();
	
		var params = [];
		params["custscript_custom_diamond_email_user"] = user;
		
		nlapiScheduleScript("customscript297",null,params);
		
		var form = nlapiCreateForm("Custom Diamond Emails - Queued Successfully");
		var fld = form.addField("custpage_message","inlinehtml","Message");
		fld.setDefaultValue("You've successfully triggered the custom diamond emails to the vendor(s).")
		response.writePage(form);
	}
}

function addLeadingZero(value)
{
	if(value.toString().charAt(0)==".")
		return "0" + value.toString();
	else
		return value;
}
