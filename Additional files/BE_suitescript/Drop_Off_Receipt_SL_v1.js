function Drop_Off_Receipt_SL(request,response)
{
	if(request.getMethod()=="GET")
	{
		var order = request.getParameter("order");
		var customer = request.getParameter("customer");
		var doid = request.getParameter("doid");
		var recType = request.getParameter("rectype");
		
		var form = nlapiCreateForm("Drop Off Appointment",true);
		
		form.addButton("custpage_back","Back","Go_Back()");
		form.addButton("custpage_cancel","Cancel","Cancel_PUR()");
		form.addSubmitButton("Next");
		
		form.setScript("customscript_do_receipt_cs");
		
		var header = "<div id='buttonHeader'><input type='button' id='backbtn' value='Back' stage=''/>&nbsp;&nbsp;&nbsp;<input type='button' id='nextbtn' value='Next' stage='init'/></div>";
		
		var body = "<div id='content' style='margin-left: 25px; margin-top: 25px;'></div>";
		
		var fld = form.addField("custpage_header","inlinehtml","Header");
		fld.setDefaultValue(header);
		fld.setLayoutType("startrow","startcol");
		fld.setDisplayType("hidden");
		
		fld = form.addField("custpage_body","inlinehtml","Body");
		fld.setDefaultValue(body);
		fld.setLayoutType("startrow","none");
		
		fld = form.addField("custpage_do_metadata","select","Drop Off Metadata","customrecord_drop_off_metadata");
		fld.setDisplayType("hidden");
		fld.setLayoutType("startrow","none");
		
		var doRecId = null;
		
		var filters = [];
		if(order!=null && order!="")
			filters.push(new nlobjSearchFilter("custrecord_do_sales_order",null,"is",order));
		else if(doid!=null && doid!="")
			filters.push(new nlobjSearchFilter("internalid",null,"is",doid));
		var results = nlapiSearchRecord("customrecord_drop_off_metadata",null,filters);
		if(results)
		{
			fld.setDefaultValue(results[0].getId());
			doRecId = results[0].getId();
		}
		else
		{
			var doRec = nlapiCreateRecord("customrecord_drop_off_metadata");
			doRec.setFieldValue("custrecord_do_sales_order",order);
			doRec.setFieldValue("custrecord_do_customer",customer);
			doRecId = nlapiSubmitRecord(doRec,true,true);
			
			fld.setDefaultValue(doRecId);
		}
		
		var doRec = nlapiLoadRecord("customrecord_drop_off_metadata",doRecId);
		
		fld = form.addField("custpage_do_recordtype","text","Record Type");
		fld.setDisplayType("hidden");
		fld.setLayoutType("startrow","none");
		if(recType!=null && recType!="")
			fld.setDefaultValue(recType);
		
		fld = form.addField("custpage_order","select","Sales Order","salesorder");
		fld.setDefaultValue(order);
		fld.setDisplayType("hidden");
		fld.setLayoutType("startrow","none");
		if(doRec!=null && doRec!="")
			fld.setDefaultValue(doRec.getFieldValue("custrecord_do_sales_order"));
		
		fld = form.addField("custpage_customer","select","Customer","customer");
		fld.setDefaultValue(customer);
		fld.setDisplayType("hidden");
		fld.setLayoutType("startrow","none");
		if(doRec!=null && doRec!="")
			fld.setDefaultValue(doRec.getFieldValue("custrecord_do_customer"));
		
		fld = form.addField("custpage_items","longtext","Item Info");
		fld.setDisplayType("hidden");
		fld.setLayoutType("startrow","none");
		if(doRec!=null && doRec!="")
			fld.setDefaultValue(doRec.getFieldValue("custrecord_do_items"));
		
		var currentState = "init";
		
		fld = form.addField("custpage_state","longtext","State Info");
		fld.setDisplayType("hidden");
		fld.setLayoutType("startrow","none");
		fld.setDefaultValue("init");
		if(doRec!=null && doRec!="" && doRec.getFieldValue("custrecord_do_state")!=null && doRec.getFieldValue("custrecord_do_state")!="")
		{
			fld.setDefaultValue(doRec.getFieldValue("custrecord_do_state"));
			currentState = doRec.getFieldValue("custrecord_do_state");
		}	
		else if(request.getParameter("state")!=null && request.getParameter("state")!="")
		{
			fld.setDefaultValue(request.getParameter("state"));
			currentState = request.getParameter("state");
		}
	
		response.writePage(form);
	}
	else
	{
		var do_metadata = request.getParameter("custpage_do_metadata");
		var order = request.getParameter("custpage_order");
		var customer = request.getParameter("custpage_customer");
		var fulfillment = request.getParameter("custpage_fulfillment");
		var items = request.getParameter("custpage_items");
		var do_state = request.getParameter("custpage_state");
		
		nlapiLogExecution("debug","Current State",do_state);
		
		var nextState = "";
		
		if(do_state=="init")
		{
			//Check for item fulfillment
			checkCreateFulfillment(items,fulfillment,order,pu_metadata,customer);
			
			//Check Pendings
			pending = checkPendings(order,pu_metadata);
			
			if(pending.pending_showroom_ring===true || pending.pending_id===true || pending.pending_finance_receipt===true || pending.pending_affidavit===true || pending.pending_balance===true)
				nextStep = "pendings";
			else
				nextStep = "cash_carry";
			
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_items","custrecord_pu_receipt_state"],[items,nextStep]);
		}
		else if(do_state=="pendings")
		{
			pending = JSON.parse(pending);
			
			//Determine next pending page to go to
			if(pending.pending_showroom_ring===true)
				nextStep = "collect_ring";
			else if(pending.pending_id===true)
				nextStep = "collect_id";
			else if(pending.pending_finance_receipt===true)
				nextStep = "collect_finance";
			else if(pending.pending_affidavit===true)
				nextStep = "collect_affidavit";
			else if(pending.pending_balance===true)
				nextStep = "cash_carry";
				
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state"],[nextStep]);
		}
		else if(do_state=="collect_ring")
		{
			pending = JSON.parse(pending);
			
			nlapiSubmitField("itemfulfillment",fulfillment,"custbody_pending_showroom_qa",qa_employee);
			
			//Determine next pending page to go to
			if(pending.pending_id===true)
				nextStep = "collect_id";
			else if(pending.pending_finance_receipt===true)
				nextStep = "collect_finance";
			else if(pending.pending_affidavit===true)
				nextStep = "collect_affidavit";
			//else if(pending.pending_balance===true)
			//	nextStep = "collect_balance";
			else
				nextStep = "cash_carry";
				
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state","custrecord_pu_receipt_qa_employee"],[nextStep,qa_employee]);
		}
		else if(do_state=="collect_id")
		{
			pending = JSON.parse(pending);
			
			//Determine next pending page to go to
			if(pending.pending_finance_receipt===true)
				nextStep = "collect_finance";
			else if(pending.pending_affidavit===true)
				nextStep = "collect_affidavit";
			//else if(pending.pending_balance===true)
			//	nextStep = "collect_balance";
			else
				nextStep = "cash_carry";
				
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state","custrecord_pu_receipt_id_checked"],[nextStep,"T"]);
		}
		else if(do_state=="collect_finance")
		{
			pending = JSON.parse(pending);
			
			//Determine next pending page to go to
			if(pending.pending_affidavit===true)
				nextStep = "collect_affidavit";
			//else if(pending.pending_balance===true)
			//	nextStep = "collect_balance";
			else
				nextStep = "cash_carry";
				
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state","custrecord_pu_receipt_finance_rcpt_recvd"],[nextStep,"T"]);
		}
		else if(do_state=="collect_affidavit" || do_state=="review_affidavit")
		{
			//Set Affidavit Status = Signed
			nlapiSubmitField("salesorder",order,"custbody125","2");
			
			//Determine next pending page to go to
			//if(pending.pending_balance===true)
			//	nextStep = "collect_balance";
			//else
			//	nextStep = "cash_carry";
			nextStep = "cash_carry";
				
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state","custrecord_pu_receipt_affidavit_reviewed"],[nextStep,"T"]);
		}
		else if(do_state=="cash_carry")
		{
			//Check the Yes/No value on the initial screen
			var ccSelection = request.getParameter("cashCarryResp");
			nlapiLogExecution("debug","Cash/Carry Value: " + ccSelection);
			
			if(ccSelection=="Y")
			{
				nlapiSubmitField("salesorder",order,"custbody_cash_and_carry","T");
				nextStep = "cc_confirm";
			}
			else
			{
				nextStep = "collect_balance";
			}
			
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state"],[nextStep]);
		}
		else if(do_state=="cc_confirm")
		{
			nextStep = "collect_balance";
			
			//nlapiSubmitField("salesorder",order,"custbody_cash_and_carry_qa",request.getParameter("cc_qa"));
			nlapiSubmitField("itemfulfillment",fulfillment,"custbody_cash_and_carry_qa",request.getParameter("cc_qa"));
			
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state"],[nextStep]);
		}
		else if(do_state=="collect_balance" && request.getParameter("custpage_go_to_mgr_approval")=="F")
		{
			nextStep = "sign_pu_receipt";
			
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state"],[nextStep]);
		}
		else if(do_state=="collect_balance" && request.getParameter("custpage_go_to_mgr_approval")=="T")
		{
			nextStep = "manager_approval";
			
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state"],[nextStep]);
		}
		else if(do_state=="manager_approval")
		{
			//Update sales order fields
			var currentNotes = nlapiLookupField("salesorder",order,"custbody163");
			var newNotes = currentNotes + " " + request.getParameter("custpage_manager_notes");
			
			nlapiSubmitField("salesorder",order,["custbody294","custbody163","custbody162","custbody265"],[request.getParameter("custpage_comped_approved_mgr"),newNotes,"1","2"]);
			
			nextStep = "collect_balance";
			
			nlapiSubmitField("customrecord_pu_receipt_metadata",pu_metadata,["custrecord_pu_receipt_state"],[nextStep]);
		}
		else if(do_state=="sign_pu_receipt")
		{
			//Mark item fulfillment as Shipped
			var fulfillmentRec = nlapiLoadRecord("itemfulfillment",fulfillment);
			
			//Ensure only picked up items are on item fulfillment. If additional exist, remove them and create new IF.
			items = JSON.parse(items);
			
			var newFulfillment = {
				shipmethod : "",
				shipdate : "",
				items : []
			}
			
			for(var x=0; x < fulfillmentRec.getLineItemCount("item"); x++)
			{
				var found = false;
				
				if(fulfillmentRec.getLineItemValue("item","item",x+1) == items[x].id)
				{
					found = true;
					break;
				}
				
				if(!found)
				{
					fulfillmentRec.setLineItemValue("item","itemreceive",x+1,"F");
					
					newFulfillment.shipmethod = fulfillmentRec.getFieldValue("shipmethod");
					newFulfillment.trandate = fulfillmentRec.getFieldValue("trandate");
					
					newFulfillment.items.push({
						item : fulfillmentRec.getLineItemValue("item","item",x+1),
						quantity : fulfillmentRec.getLineItemValue("item","quantity",x+1),
						location : fulfillmentRec.getLineItemValue("item","location",x+1)
					});
				}
			}
			
			fulfillmentRec.setFieldValue("shipstatus","C");
			nlapiSubmitRecord(fulfillmentRec,true,true);
			
			//Create new fulfillment if needed
			if(newFulfillment.items.length > 0)
			{
				var newIFrecord = nlapiTransformRecord("salesorder","","itemfulfillment");
				newIFrecord.setFieldValue("shipmethod",newFulfillment.shipmethod);
				newIFrecord.setFieldValue("trandate",newFulfillment.trandate);
				
				for(var x=0; x < newIFrecord.getLineItemCount("item"); x++)
				{
					for(var i=0; i < newFulfillment.items.length; i++)
					{
						if(newIFrecord.getLineItemValue("item","item",x+1) == newFulfillment.items[i].item)
						{
							newIFrecord.setLineItemValue("item","itemreceive",x+1,"T");
							newIFrecord.setLineItemValue("item","quantity",x+1,newFulfillment.items[i].quantity);
							newIFrecord.setLineItemValue("item","location",x+1,newFulfillment.items[i].location);
							break;
						}
					}
				}
				
				nlapiSubmitRecord(newIFrecord,true,true);
			}
			
			//Redirect user to confirmation screen
			var form = nlapiCreateForm("Pick-up Receipt Complete",true);
			form.setScript("customscript_pu_receipt_cs");
			
			var fld = form.addField("custpage_message","inlinehtml","Message");
			fld.setDefaultValue("<p style='font-size: 14px;'>The email will be sent to the following email address: " + nlapiLookupField("customer",request.getParameter("custpage_customer"),"email") + ". If this email is not correct, please do not send the email.</p><p style='font-size: 14px;'>Pick-up receipt has been successfully completed. You may now close the window.</p>");
			
			fld = form.addField("custpage_customer","select","Customer","customer");
			fld.setDisplayType("hidden");
			fld.setDefaultValue(request.getParameter("custpage_customer"));
			
			fld = form.addField("custpage_fulfillment","select","Item Fulfillment","itemfulfillment");
			fld.setDisplayType("hidden");
			fld.setDefaultValue(request.getParameter("custpage_fulfillment"));
			
			//fld = form.addField("custpage_email_msg","inlinehtml","Email Message");
			//fld.setDefaultValue("<p style='font-size: 14px;'>The email will be sent to the follwoing email address: " + nlapiLookupField("customer",request.getParameter("custpage_customer"),"email") + ". If this email is not correct, please do not send the email.</p>");
			
			form.addButton("custpage_email_receipt","Email Pick-up Receipt","Email_PUR()");
			
			response.writePage(form);
		}
		
		if(do_state!="sign_pu_receipt")
		{
			var params = new Object();
			params["puid"] = pu_metadata;
			
			response.sendRedirect("SUITELET","customscript_pickup_window","customdeploy_pickup_window",null,params);
		}
	}
	
}

function checkCreateFulfillment(items,fulfillmentId,orderId,metadata,customer)
{
	items = JSON.parse(items);
	
	nlapiLogExecution("debug","Fulfillment ID found in custpage_fulfillment",fulfillmentId);
	
	//if(fulfillmentId!=null && fulfillmentId!="")
	//	return true;
	
	var ffsToCreate = [];
	
	for(var x=0; x < items.length; x++)
	{
		if(items[x].picked==null || items[x].picked=='' || items[x].picked==0)
		{
			ffsToCreate.push({
				item : items[x].id,
				line : items[x].line,
				cert : items[x].cert
			});
		}
	}
	
	nlapiLogExecution("debug","FFS to Create",JSON.stringify(ffsToCreate));
	
	var templateId, folderId;
		
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
	{
		templateId = "28547232";
		folderId = "13752581";
	}
	else
	{
		templateId = "29154728";
		folderId = "14189399";
	}
	
	if(ffsToCreate.length > 0)
	{
		nlapiLogExecution("debug","Creating new item fulfillment");
		
		var fulfillment = nlapiTransformRecord("salesorder",orderId,"itemfulfillment",{recordmode:"dynamic"});
		
		var puLocation = nlapiLookupField("salesorder",orderId,"custbody_pickup_location");
		var location = null;
		
		var filters = [];
		filters.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"is",puLocation));
		var results = nlapiSearchRecord("location",null,filters);
		if(results)
		{
			location = results[0].getId();
		}
		
		var customer = fulfillment.getFieldValue("entity");
		
		fulfillment.setFieldValue("custbody89","2"); //Email Confirmation Status = Emailed
		
		//Ensure all IF lines are not marked to fulfill by default
		for(var x=0; x < fulfillment.getLineItemCount("item"); x++)
		{
			if(!checkAlwaysFulfill(fulfillment.getLineItemValue("item","custcol_category",x+1)))
			{
				fulfillment.selectLineItem("item",x+1);
				fulfillment.setCurrentLineItemValue("item","itemreceive","F");
				fulfillment.commitLineItem("item");	
			}
		}
		
		for(var x=0; x < fulfillment.getLineItemCount("item"); x++)
		{
			for(var i=0; i < ffsToCreate.length; i++)
			{
				nlapiLogExecution("debug","IF Order Item: " + fulfillment.getLineItemValue("item","item",x+1),"Array Item: " + ffsToCreate[i].item);
				nlapiLogExecution("debug","IF Order Line: " + fulfillment.getLineItemValue("item","orderline",x+1),"Array Line: " + ffsToCreate[i].line);
				
				if(fulfillment.getLineItemValue("item","item",x+1)==ffsToCreate[i].item && fulfillment.getLineItemValue("item","orderline",x+1)==ffsToCreate[i].line)
				{
					fulfillment.selectLineItem("item",x+1);
					fulfillment.setCurrentLineItemValue("item","itemreceive","T");
					fulfillment.setCurrentLineItemValue("item","location",location);
					if(ffsToCreate[i].cert=="Y")
						fulfillment.setCurrentLineItemValue("item","custcol_certificate_included","1");
					fulfillment.commitLineItem("item");
				}
			}
		}
		
		var fulfillmentId = nlapiSubmitRecord(fulfillment,true,true);
		fulfillment = nlapiLoadRecord("itemfulfillment",fulfillmentId);
		var orderRec = nlapiLoadRecord("salesorder",orderId);
		
		nlapiSubmitField("customrecord_pu_receipt_metadata",metadata,"custrecord_pu_receipt_item_fulfillment",fulfillmentId);
		
		//Generate pick-up receipt
		var templateXML = nlapiLoadFile(templateId);
			templateXML = templateXML.getValue();
			
		var renderer = nlapiCreateTemplateRenderer();
		renderer.setTemplate(templateXML); //Pick-up Receipt Template (SignNow)
		renderer.addRecord("record",orderRec);
		renderer.addRecord("fulfillment",fulfillment);
		
		var pdfObj = nlapiXMLToPDF(renderer.renderToString());
		pdfObj.setName("" + fulfillment.getFieldValue("tranid") + "_pu_receipt_" + fulfillmentId + ".pdf");
		pdfObj.setFolder(folderId);
		var pdfId = nlapiSubmitFile(pdfObj);
		
		var signNow = nlapiCreateRecord("customrecord_custom_signnow_document");
		signNow.setFieldValue("custrecord_document_type","4"); //Document Type = Pick-Up Receipt
		signNow.setFieldValue("custrecord_signnow_transaction",orderId);
		signNow.setFieldValue("custrecord_signnow_customer",customer);
		signNow.setFieldValue("custrecord_signnow_document",pdfId);
		var signNowId = nlapiSubmitRecord(signNow,true,true);
		
		nlapiLogExecution("debug","SignNow Document Created","ID: " + signNowId);
		
		getSigningLink(signNowId);
		nlapiLogExecution("debug","SignNow Signing Link Created");
	}
	else
	{
		if(fulfillmentId==null || fulfillmentId=="")
		{
			//Find linked item fulfillment
			var filters = [];
			filters.push(new nlobjSearchFilter("createdfrom",null,"is",orderId));
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			var results = nlapiSearchRecord("itemfulfillment",null,filters);
			if(results)
			{
				fulfillmentId = results[0].getId();
				nlapiLogExecution("debug","Found Linked IF",fulfillmentId);
				
				nlapiSetFieldValue("custpage_fulfillment",results[0].getId(),true,true);
				nlapiSubmitField("customrecord_pu_receipt_metadata",metadata,"custrecord_pu_receipt_item_fulfillment",results[0].getId());
			}
		}
		//var fulfillmentId = null;
		
		nlapiLogExecution("debug","Items JSON",JSON.stringify(items));
		
		var fulfillment = nlapiLoadRecord("itemfulfillment",fulfillmentId);
		
		//Update fulfillment for only line items selected and cert values
		for(var x=0; x < fulfillment.getLineItemCount("item"); x++)
		{
			var found = false;
			
			for(var i=0; i < items.length; i++)
			{
				nlapiLogExecution("debug","FF Item: " + fulfillment.getLineItemValue("item","item",x+1) + " | Line: " + fulfillment.getLineItemValue("item","orderline",x+1),"Items Item: " + items[i].id + " | Line: " + items[i].line);
				
				if(fulfillment.getLineItemValue("item","item",x+1)==items[i].id && fulfillment.getLineItemValue("item","orderline",x+1)==items[i].line)
				{
					nlapiLogExecution("debug","Keeping Item: " + items[i].id,"Line: " + items[i].line);
					
					fulfillment.selectLineItem("item",x+1);
					if(items[i].cert=="Y")
						fulfillment.setCurrentLineItemValue("item","custcol_certificate_included","1");
					fulfillment.commitLineItem("item");
					
					found = true;
					break;
				}
			}
			
			if(!found)
			{
				if(!checkAlwaysFulfill(fulfillment.getLineItemValue("item","custcol_category",x+1)))
				{
					fulfillment.selectLineItem("item",x+1);
					fulfillment.setCurrentLineItemValue("item","itemreceive","F");
					fulfillment.commitLineItem("item");
				}
			}
		}
		
		fulfillmentId = nlapiSubmitRecord(fulfillment,true,true);
		fulfillment = nlapiLoadRecord("itemfulfillment",fulfillmentId);
		
		var orderRec = nlapiLoadRecord("salesorder",orderId);
		
		//Check for PU receipt SignNow custom record
		var filters = [];
		filters.push(new nlobjSearchFilter("custrecord_signnow_customer",null,"is",customer));
		filters.push(new nlobjSearchFilter("custrecord_document_type",null,"is","4"));
		filters.push(new nlobjSearchFilter("custrecord_signnow_status",null,"noneof",["3","4"]));
		var results = nlapiSearchRecord("customrecord_custom_signnow_document",null,filters);
		if(!results)
		{
			//Generate pick-up receipt
			nlapiLogExecution("debug","Creating SignNow Document...");
			
			var templateXML = nlapiLoadFile(templateId);
			templateXML = templateXML.getValue();
			
			var renderer = nlapiCreateTemplateRenderer();
			renderer.setTemplate(templateXML); //Pick-up Receipt Template (SignNow)
			renderer.addRecord("record",orderRec);
			renderer.addRecord("fulfillment",fulfillment);
			
			var pdfObj = nlapiXMLToPDF(renderer.renderToString());
			pdfObj.setName("" + fulfillment.getFieldValue("tranid") + "_pu_receipt_" + fulfillmentId + ".pdf");
			pdfObj.setFolder(folderId);
			var pdfId = nlapiSubmitFile(pdfObj);
			
			var signNow = nlapiCreateRecord("customrecord_custom_signnow_document");
			signNow.setFieldValue("custrecord_document_type","4"); //Document Type = Pick-Up Receipt
			signNow.setFieldValue("custrecord_signnow_transaction",orderId);
			signNow.setFieldValue("custrecord_signnow_customer",customer);
			signNow.setFieldValue("custrecord_signnow_document",pdfId);
			var signNowId = nlapiSubmitRecord(signNow,true,true);
			
			nlapiLogExecution("debug","SignNow Document Created","ID: " + signNowId);
			
			getSigningLink(signNowId);
			nlapiLogExecution("debug","SignNow Signing Link Created");
		}
	}
}

function checkPendings(orderId,metadata)
{
	var pending = {
		pending_showroom_ring : false,
		pending_id : false,
		pending_finance_receipt : false,
		pending_affidavit : false,
		pending_balance : false,
		balance_amount : ""
	};
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",orderId));
	var cols = [];
	cols.push(new nlobjSearchColumn("custbody194"));
	cols.push(new nlobjSearchColumn("custbodydriverslicense"));
	cols.push(new nlobjSearchColumn("custbodyfraud_check_new"));
	cols.push(new nlobjSearchColumn("custbody128"));
	cols.push(new nlobjSearchColumn("custbody125"));
	cols.push(new nlobjSearchColumn("custbody_website_truebalance_amt"));
	var results = nlapiSearchRecord("salesorder",null,filters,cols);
	if(results)
	{
		var deliveryInstructions = results[0].getText("custbody194");
		if(deliveryInstructions.indexOf("Special Shipment/PU Confirmation Email")!=-1 || deliveryInstructions.indexOf("Pending Showroom Item Return")!=-1)
			pending.pending_showroom_ring = true;
			
		if(results[0].getValue("custbodydriverslicense")=="3" || results[0].getValue("custbodydriverslicense")=="1")
			pending.pending_id = true;
		if(results[0].getValue("custbodydriverslicense")!="1")
			pending.pending_id = true;
			
		if(results[0].getValue("custbody128")=="1" || results[0].getValue("custbody128")=="3" || results[0].getValue("custbody128")=="4" || results[0].getValue("custbody128")=="6")
			pending.pending_finance_receipt = true;
			
		if(results[0].getValue("custbody125")=="3" || results[0].getValue("custbody125")=="4" || results[0].getValue("custbody125")=="5" || results[0].getValue("custbody125")=="6")
			pending.pending_affidavit = true;
			
		if(results[0].getValue("custbody_website_truebalance_amt") > 0)
		{
			pending.pending_balance = true;
			pending.balance_amount = results[0].getValue("custbody_website_truebalance_amt");
		}
	}
	
	nlapiLogExecution("debug","Pendings:",JSON.stringify(pending));
	
	nlapiSubmitField("customrecord_pu_receipt_metadata",metadata,"custrecord_pu_receipt_pending_info",JSON.stringify(pending));
	
	return pending;
}

function getSigningLink(signNowId)
{
	var config = nlapiLoadRecord("customrecord_signnow_token","1");
	var userConfig = nlapiLoadRecord("customrecord_signnow_token","2");
	
	var encoded_credentials = nlapiEncrypt(config.getFieldValue("custrecord_signnow_client_id")+":"+config.getFieldValue("custrecord_signnow_client_secret"),"base64");
	nlapiLogExecution("debug","Encoded Credentials",encoded_credentials);
	
	var snRec = nlapiLoadRecord("customrecord_custom_signnow_document",signNowId);
	
	var docType = snRec.getFieldValue("custrecord_document_type");
	
	var fileId = snRec.getFieldValue("custrecord_signnow_document");
	nlapiLogExecution("debug","Using File ID",fileId);
	
	var file = nlapiLoadFile(fileId);
	
	//Post document to SignNow and get Document ID
	var url = "https://integrations.signnow.com/netsuite/document/";
		url+= "" + snRec.getFieldText("custrecord_signnow_document") + "/application%2Fpdf/" + signNowId;
	
	var headers = new Object();
	headers["Authorization"] = "Bearer " + config.getFieldValue("custrecord_access_token");
	headers["Content-Type"] = ' text/plain;charset=UTF-8';
	
	var res = nlapiRequestURL(url, file.getValue(), headers, 'POST');
	
	var documentId = res.getBody();
	nlapiLogExecution("debug","Document ID",documentId);
	
	if(documentId.indexOf("error")!=-1)
	{
		var errorMsg = JSON.parse(documentId);
		nlapiSubmitField("customrecord_custom_signnow_document",signNowId,"custrecord_signnow_error",errorMsg.error);
		
		return true;
	}
	
	var headers1 = new Object();
	headers1["Authorization"] = "Bearer " + config.getFieldValue("custrecord_access_token");
	headers1["Content-Type"] = 'application/json';
	
	//Create Invite to Sign Uploaded Document
	var inviteURL = "https://api.signnow.com/document/" + documentId + "/invite?email=disable";
	
	var invitePayload = {
		to : [{
			email : userConfig.getFieldValue("custrecord_signnow_api_username"),
			role : "signer",
			order : 1,
			role_id : ""
		}],
		from : config.getFieldValue("custrecord_signnow_api_username"),
		cc : [],
		subject : "Please Sign",
		message : "Please Sign"
	};
	
	var cResp = nlapiRequestURL(inviteURL,JSON.stringify(invitePayload),headers1,"POST");
	nlapiLogExecution("debug","Invite Response Body",cResp.getBody());
	
	if(cResp.getBody())
	{
		var responseBody = JSON.parse(cResp.getBody());
		
		if(responseBody.errors && responseBody.errors.length > 0)
		{
			var errorMessage = responseBody.errors[0].message;
			
			nlapiSubmitField("customrecord_custom_signnow_document",signNowId,"custrecord_signnow_error",errorMessage);
		
			return true;
		}
	}
	
	//Generate Restricted Scope Access Token for Signing Link
	var headers2 = new Object();
	headers2["Authorization"] = "Basic " + encoded_credentials;
	headers2["Accept"] = "application/json";
	headers2["Content-Type"] = "application/x-www-form-urlencoded";
	
	var body = "username=" + userConfig.getFieldValue("custrecord_signnow_api_username");
		body+= "&password=" + escape(userConfig.getFieldValue("custrecord_signnow_api_password"));
		body+= "&grant_type=password";
		body+= "&scope=signer_limited_scope_token document/" + documentId;
		
	nlapiLogExecution("debug","Body",body);
		
	var url = "https://api.signnow.com/oauth2/token";
	
	var cResp = nlapiRequestURL(url,body,headers2);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body",cResp.getBody());
	
	var tokenData = JSON.parse(cResp.getBody());
	var userToken = tokenData.access_token;
	
	if(userToken==null || userToken=="" || userToken=="undefined" || userToken==undefined)
	{
		nlapiSubmitField("customrecord_custom_signnow_document",signNowId,"custrecord_signnow_error","Error getting user token. " + cResp.getBody());
		
		return true;
	}
	
	var signingURL = "https://signnow.com/dispatch?route=fieldinvite&document_id=" + documentId + "&access_token=" + userToken + "&disable_email=true";
	
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
		signingURL+= "&redirect_uri=http://forms.netsuite.com/app/site/hosting/scriptlet.nl%3Fscript=2529%26deploy=1%26compid=666639_SB1%26h=f6f2ab53e57c46c0c164%26docid=" + documentId;
	else
		signingURL+= "&redirect_uri=https://forms.na3.netsuite.com/app/site/hosting/scriptlet.nl%3Fscript=2517%26deploy=1%26compid=666639%26h=e2b3329e87f6bfe9f633%26docid=" + documentId;
	
	//Update fields on custom record
	nlapiSubmitField("customrecord_custom_signnow_document",signNowId,["custrecord_signnow_status","custrecord_signnow_date_sent","custrecord_signnow_document_id","custrecord_signnow_signing_link","custrecord_signnow_error"],["2",nlapiDateToString(new Date(),"date"),documentId,signingURL,""]);
}

function checkAlwaysFulfill(category)
{
	var fulfill = false;
	
	switch(category)
	{
		case "1": //Melee (Diamond)
		case 1: //Melee (Diamond)
		case "11": //Financing
		case 11: //Financing
		case "12": //Service
		case 12: //Service
		case "23": //Melee (Sapphire)
		case 23: //Melee (Sapphire)
		case "30": //Melee (Other colored gemstone)
		case 30: //Melee (Other colored gemstone)
			fulfill = true;
			break;
	}
	
	return fulfill;
}
