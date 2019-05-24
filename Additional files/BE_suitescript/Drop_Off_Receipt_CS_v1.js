function Drop_Off_Receipt_CS_PI()
{
	var currentState = nlapiGetFieldValue("custpage_state");
	
	if(currentState=="init")
	{
		loadItems(nlapiGetFieldValue("custpage_order"));
	}
	else if(currentState=="sign_do_receipt")
	{
		Sign_Drop_Off_Receipt();
	}
}

function Drop_Off_Receipt_CS_SR()
{
	try
	{
		//Get current state
		var currentState = nlapiGetFieldValue("custpage_state");
		
		switch(currentState)
		{
			case "init":
				// *** INIT STATE SAVE RECORD ***
				//Check items on page
				var items = [];
				
				//Verify at least one line is selected
				if(jQuery('input[id^="pu_"]:checked').length <= 0)
				{
					alert("Please select at least one item.");
					
					return false;
				}
				
				jQuery('input[id^="pu_"]:checked').each(function(){
					items.push({
						id : jQuery(this).val(),
						line : jQuery(this).attr('line'),
						picked : jQuery(this).attr('picked')
					});
				});
				
				//Update item JSON values
				nlapiSetFieldValue("custpage_items",JSON.stringify(items));
				
				break;
			case "collect_affidavit":
			case "review_affidavit":
				//Verify affidavit is reviewed and approved
				if(nlapiGetFieldValue("custpage_affidavit_approved")!="T")
				{
					alert('Please review and approve affidavit before proceeding.');
					return false;
				}
		
				break;
		}
		
		return true;
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Executing Save Record Functions","Details: " + err.message);
		return true;
	}
}

function loadItems(orderId)
{
	jQuery('#backbtn').hide();
	
	var items = [];
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",orderId));
	filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
	filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
	filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
	filters.push(new nlobjSearchFilter("memo",null,"isnotempty"));
	filters.push(new nlobjSearchFilter("custbody_drop_off",null,"is","1"));
	filters.push(new nlobjSearchFilter("type","item","anyof",["InvtPart","Assembly"]));
	var cols = [];
	cols.push(new nlobjSearchColumn("item"));
	cols.push(new nlobjSearchColumn("memo"));
	cols.push(new nlobjSearchColumn("quantity"));
	cols.push(new nlobjSearchColumn("quantitypicked"));
	cols.push(new nlobjSearchColumn("line"));
	cols.push(new nlobjSearchColumn("custcol_image_url"));
	cols.push(new nlobjSearchColumn("custcol_certificate_included"));
	cols.push(new nlobjSearchColumn("type","item"));
	cols.push(new nlobjSearchColumn("custitemcertificate_included","item"));
	var results = nlapiSearchRecord("transaction",null,filters,cols);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			items.push({
				id : results[x].getValue("item"),
				name : results[x].getText("item"),
				desc : results[x].getValue("memo"),
				qty : results[x].getValue("quantity"),
				cert : results[x].getValue("custcol_certificate_included"),
				item_type : results[x].getValue("type","item"),
				image : results[x].getValue("custcol_image_url"),
				itemcert : results[x].getValue("custitemcertificate_included","item"),
				line : results[x].getValue("line"),
				picked : results[x].getValue("quantitypicked")
			});
		}
	}
	
	var table = "<table cellpadding='5' cellspacing='0' id='itemtable' style='margin-top: 15px; font-size: 14px;'>";
		table+= "<tr><th width='30px' style='border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;'>&nbsp;</th><th width='120px' style='border-top: 1px solid black; border-bottom: 1px solid black;'>Item</th><th width='250px' style='border-top: 1px solid black; border-bottom: 1px solid black;'>Description</th><th width='75px' style='border-top: 1px solid black; border-bottom: 1px solid black;'>Qty</th><th width='110px' style='border-right: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;'>&nbsp;</th></tr>";
		
		for(var x=0; x < items.length; x++)
		{
			table+= "<tr>";
			table+= "<td><input type='checkbox' class='includeitem' id='pu_" + items[x].id + "' value='" + items[x].id + "' line='" + items[x].line + "' picked='" + items[x].picked + "' cert=''/></td>";
			table+= "<td>" + items[x].name + "</td>";
			table+= "<td>" + items[x].desc + "</td>";
			table+= "<td>" + items[x].qty + "</td>";
			if(items[x].image!=null && items[x].image!="")
				table+= "<td><img src='" + items[x].image + "' style='width: 90px; height: 90px;'/></td>";
			else
				table+= "<td>&nbsp;</td>";
			table+= "</tr>";
		}
		
		table += "</table>";
		
	jQuery('#content').html(table);
}

function collectAffidavit()
{
	var display = "<p style='font-size: 14px;'>Affidvait Pending - Action Item(s):</p><ul>";
	display += "<li style='font-size: 14px;'>Collect Affidavit <input type='button' name='signAffidavit' id='signAffidavit' value='Signing Session' onclick='Signed_Affidvait_SS();'/></li>";
	display += "<li id='reviewBullet' style='font-size: 14px; display: none;'>Review Affidavit <input type='button' name='reviewAffidavit' id='reviewAffidavit' value='Review Affidavit' onclick='Review_Affidavit();'/></li>";
	display += "</ul>";
	
	jQuery('#content').html(display);
}

function signReceipt()
{
	var display = "<ul>";
	display += "<li style='font-size: 14px;'>Collect Pick-Up Receipt <input type='button' name='signReceipt' id='signReceipt' value='Signing Session' onclick='Signed_PU_Receipt();'/></li>";
	display += "<li id='emailBullet' style='font-size: 14px; display: none;'>Email Receipt <input type='button' name='emailReceipt' id='emailReceipt' value='Email Receipt' onclick='Review_Affidavit();'/></li>";
	display += "</ul>";
	
	jQuery('#content').html(display);
}

jQuery('#nextbtn').click(function(){
	
	var url = nlapiResolveURL("SUITELET","customscript_pickup_window","customdeploy_pickup_window");
		url+= "&puid=" + nlapiGetFieldValue("custpage_pu_receipt_metadata");
	
	//var currentPage = jQuery('#nextbtn').attr('stage');
	var currentPage = nlapiGetFieldValue("custpage_state");
	console.log("Current Page: " + currentPage);
	
	var pendings = nlapiGetFieldValue("custpage_pending");
	if(pendings!=null && pendings!="")
		pendings = JSON.parse(pendings);
	
	if(currentPage=='cash_carry')
	{
		var cashCarryMarked = jQuery('#cashCarryResp').val();
		
		if(cashCarryMarked==null || cashCarryMarked=='')
		{
			alert('Please select Yes/No for Cash and Carry.');
		}
		else
		{
			if(cashCarryMarked=='Y')
			{
				//Go to Cash and Carry Confirmation
				jQuery('#nextbtn').attr('stage','sign_pu_receipt');;
				jQuery('#backbtn').attr('stage','cash_carry');
				nlapiSetFieldValue("custpage_state","cc_confirm",true,true);
				
				nlapiSubmitField("customrecord_pu_receipt_metadata",nlapiGetFieldValue("custpage_pu_receipt_metadata"),["custrecord_pu_receipt_state"],["cc_confirm"]);
				window.location.href = url + "&state=cc_confirm";
			}
			else
			{
				//Go to Pick-up Receipt
				jQuery('#nextbtn').hide();
				jQuery('#backbtn').attr('stage','cash_carry');
				nlapiSetFieldValue("custpage_state","sign_pu_receipt",true,true);
				
				nlapiSubmitField("customrecord_pu_receipt_metadata",nlapiGetFieldValue("custpage_pu_receipt_metadata"),["custrecord_pu_receipt_state"],["sign_pu_receipt"]);
				window.location.href = url + "&state=sign_pu_receipt";
			}
		}
	}
	else if(currentPage=='cc_confirm')
	{
		//Go to Pick-up Receipt
		jQuery('#nextbtn').hide();
		jQuery('#backbtn').attr('stage','cc_confirm');
		nlapiSetFieldValue("custpage_state","sign_pu_receipt",true,true);
		
		nlapiSubmitField("customrecord_pu_receipt_metadata",nlapiGetFieldValue("custpage_pu_receipt_metadata"),["custrecord_pu_receipt_state"],["sign_pu_receipt"]);
		window.location.href = url + "&state=sign_pu_receipt";
	}
});

jQuery('#backbtn').click(function(){
	var prevPage = jQuery('#backbtn').attr('stage');
	console.log("Previous Page: " + prevPage);
	
	if(prevPage=='init')
	{
		loadItems(nlapiGetFieldValue("custpage_order"));
		nlapiSetFieldValue("custpage_state","init",true,true);
	}
	else if(prevPage=='collect_id')
	{
		collectID();
		nlapiSetFieldValue("custpage_state","collect_id",true,true);
	}
	else if(prevPage=='collect_finance')
	{
		financeReceipt();
		nlapiSetFieldValue("custpage_state","collect_finance",true,true);
	}
	else if(prevPage=='collect_affidavit')
	{
		collectAffidavit();
		nlapiSetFieldValue("custpage_state","collect_affidavit",true,true);
	}
});

function Signed_Affidvait_SS()
{
	//Find most recent SignNow Affidvait record signing link URL
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecord_signnow_customer",null,"is",nlapiGetFieldValue("custpage_customer")));
	filters.push(new nlobjSearchFilter("custrecord_document_type",null,"is","3"));
	var cols = [];
	cols.push(new nlobjSearchColumn("internalid").setSort(true));
	cols.push(new nlobjSearchColumn("custrecord_signnow_signing_link"));
	var results = nlapiSearchRecord("customrecord_custom_signnow_document",null,filters,cols);
	if(results)
	{
		var url = results[0].getValue("custrecord_signnow_signing_link");
		
		console.log("SignNow Signing URL: " + url);
		
		window.open(url,"affidavitSigner","width=800,height=800,location=no,menubar=no,scrollbars=yes,toolbar=no,titlebar=no");
		
		nlapiSetFieldValue("custpage_affidavit_signed","T",true,true);
	
		//Green Sign Affidavit button
		jQuery('#signAffidavit').css('background-color','green');
		jQuery('#signAffidavit').css('color','white');
		jQuery('#signAffidavit').attr('disabled','disabled');
		
		//Add Review Affidavit button
		jQuery('#reviewBullet').show();
	}
	else
	{
		alert("ERROR: No SignNow Affidavit record on file for this customer.");
	}
}

function Review_Affidavit()
{
	//Find most recent SignNow Affidvait record signing link URL
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecord_signnow_customer",null,"is",nlapiGetFieldValue("custpage_customer")));
	filters.push(new nlobjSearchFilter("custrecord_document_type",null,"is","3"));
	var cols = [];
	cols.push(new nlobjSearchColumn("internalid").setSort(true));
	cols.push(new nlobjSearchColumn("custrecord_signnow_signing_link"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_status"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_document"));
	var results = nlapiSearchRecord("customrecord_custom_signnow_document",null,filters,cols);
	if(results)
	{
		//Verify Status = Signed, otherwise display error message
		if(results[0].getValue("custrecord_signnow_status")!="3")
		{
			alert("Affidavit is pending signature. You cannot move to the next page until this step is complete.");
		}
		else
		{
			var display = "<p style='font-size: 14px;'><input type='button' name='approveDoc' id='approveDoc' value='Approve' onclick='Approve_Affidavit();'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' name='rejectDoc' id='rejectDoc' value='Reject'/></p>";
			
			var docId = results[0].getValue("custrecord_signnow_document");
			console.log("Document ID: " + docId);
			
			var docURL = "#";
			
			var fileFilters = [];
			fileFilters.push(new nlobjSearchFilter("internalid",null,"is",docId));
			var fileCols = [];
			fileCols.push(new nlobjSearchColumn("url"));
			var fileResults = nlapiSearchRecord("file",null,fileFilters,fileCols);
			if(fileResults)
			{
				docURL = fileResults[0].getValue("url");
				docURL = "https://system.netsuite.com" + docURL;
				
				console.log("Document URL: " + docURL);
			}
			
			display += "<iframe src='" + docURL + "' width='850px' height='650px' style='padding-top: 10px;'></iframe>";
			
			jQuery('#content').html(display);
		}
	}
}

function Approve_Affidavit()
{
	nlapiSetFieldValue("custpage_affidavit_approved","T",true,true);
	
	//Set Affidavit Status = Signed
	nlapiSubmitField("salesorder",nlapiGetFieldValue("custpage_order"),"custbody125","2");
	
	//Redirect user to Collect Balance Page
	//checkBalance();
	
	nlapiSubmitField("customrecord_pu_receipt_metadata",nlapiGetFieldValue("custpage_pu_receipt_metadata"),["custrecord_pu_receipt_state","custrecord_pu_receipt_affidavit_reviewed"],["collect_balance","T"]);
	
	var url = nlapiResolveURL("SUITELET","customscript_pickup_window","customdeploy_pickup_window");
		url+= "&puid=" + nlapiGetFieldValue("custpage_pu_receipt_metadata");
	
	window.location.href = url + "&state=collect_balance";
}

function Sign_Drop_Off_Receipt()
{
	//Find most recent SignNow Affidvait record signing link URL
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecord_signnow_customer",null,"is",nlapiGetFieldValue("custpage_customer")));
	filters.push(new nlobjSearchFilter("custrecord_document_type",null,"is","4"));
	filters.push(new nlobjSearchFilter("custrecord_signnow_status",null,"noneof",["3","4"]));
	var cols = [];
	cols.push(new nlobjSearchColumn("internalid").setSort(true));
	cols.push(new nlobjSearchColumn("custrecord_signnow_signing_link"));
	var results = nlapiSearchRecord("customrecord_custom_signnow_document",null,filters,cols);
	if(results)
	{
		var url = results[0].getValue("custrecord_signnow_signing_link");
		
		console.log("SignNow Signing URL: " + url);
		
		window.open(url,"receiptSigner","width=800,height=800,location=no,menubar=no,scrollbars=yes,toolbar=no,titlebar=no");
		
		nlapiSetFieldValue("custpage_affidavit_signed","T",true,true);
	
		var display = "<h3>Please move pick up receipt to tablet and allow customer to complete the signing process</h3>";
		
		jQuery('#content').html(display);
	}
	else
	{
		//Generate drop-off receipt
		var renderer = nlapiCreateTemplateRenderer();
		renderer.setTemplate(templateId); //Pick-up Receipt Template (SignNow)
		renderer.addRecord("record",fulfillment);
		
		var pdfObj = nlapiXMLToPDF(renderer.renderToString());
		pdfObj.setName("" + fulfillment.getFieldValue("tranid") + "_pu_receipt_" + fulfillmentId + ".pdf");
		pdfObj.setFolder(folderId);
		var pdfId = nlapiSubmitFile(pdfObj);
		
		var signNow = nlapiCreateRecord("customrecord_custom_signnow_document");
		signNow.setFieldValue("custrecord_document_type","4"); //Document Type = Pick-Up Receipt
		signNow.setFieldValue("custrecord_signnow_transaction",fulfillmentId);
		signNow.setFieldValue("custrecord_signnow_customer",customer);
		signNow.setFieldValue("custrecord_signnow_document",pdfId);
		var signNowId = nlapiSubmitRecord(signNow,true,true);
	}
}

function Cancel_PUR()
{
	var pu_metadata = nlapiGetFieldValue("custpage_pu_receipt_metadata");
	
	nlapiDeleteRecord("customrecord_pu_receipt_metadata",pu_metadata);
	
	this.close();
}

function Email_PUR()
{
	var url = nlapiResolveURL("SUITELET","customscript_pickup_receipt_email","customdeploy_pickup_receipt_email");
		url+= "&customer=" + nlapiGetFieldValue("custpage_customer") + "&fulfillment=" + nlapiGetFieldValue("custpage_fulfillment");
		
	var cResp = nlapiRequestURL(url,null,null);
	
	alert("Email Sent!");
}

function Go_Back()
{
	var pu_state = nlapiGetFieldValue("custpage_state");
	var pendings = nlapiGetFieldValue("custpage_pending");
	
	if(pu_state=="pending")
	{
		
	}
	else
	{
		
	}
}
