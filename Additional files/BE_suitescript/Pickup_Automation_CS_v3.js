function Pickup_Automation_CS_PI()
{
	var currentState = nlapiGetFieldValue("custpage_state");
	
	if(currentState=="init")
	{
		loadItems(nlapiGetFieldValue("custpage_order"));
	}
	else if(currentState=="balance")
	{
		collectBalance(0);
	}
	else if(currentState=="pendings")
	{
		showPendingSummary();
	}
	else if(currentState=="collect_ring")
	{
		pendingRing();
	}
	else if(currentState=="collect_id")
	{
		collectID();
	}
	else if(currentState=="collect_finance")
	{
		financeReceipt();
	}
	else if(currentState=="collect_affidavit")
	{
		collectAffidavit();
	}
	else if(currentState=="review_affidavit")
	{
		
	}
	else if(currentState=="collect_balance")
	{
		checkBalance();
	}
	else if(currentState=="cash_carry")
	{
		Cash_Carry_Splash();
	}
	else if(currentState=="cc_confirm")
	{
		loadItems(nlapiGetFieldValue("custpage_order"));
		
		jQuery('#content').append('<textarea rows="8" cols="60" id="cc_qa" name="cc_qa"></textarea>');
	}
	else if(currentState=="sign_pu_receipt")
	{
		Sign_PU_Receipt();
	}
}

function Pickup_Automation_CS_SR()
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
						picked : jQuery(this).attr('picked'),
						cert : jQuery(this).attr('cert')
					});
				});
				
				//Update item JSON values
				nlapiSetFieldValue("custpage_items",JSON.stringify(items));
				
				break;
			case "collect_ring":
				//Ensure QA employee is populated
				var qaEmployee = jQuery('#qa_employee').val();
				
				if(pendings.pending_showroom_ring==true && (qaEmployee==null || qaEmployee==''))
				{
					alert('You must enter a value for QA Employee before proceeding.');
					return false;
				}
				
				break;
			case "collect_id":
				//Verify ID collected is pressed
				var idCollected = jQuery('#receivedID2').val();
				
				if(idCollected==null || idCollected=='')
				{
					alert('Please collected ID and mark before proceeding.');
					return false;
				}
		
				break;
			case "collect_finance":
				//Verify Finance Receipt Received is pressed
				var receiptRecvd = jQuery('#receivedReceipt2').val();
				
				if(receiptRecvd==null || receiptRecvd=='')
				{
					alert('Please collected finance receipt before proceeding.');
					return false;
				}
				
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
			case "collect_balance":
				var orderId = nlapiGetFieldValue("custpage_order");
				
				var fields = nlapiLookupField("salesorder",orderId,["custbody_website_truebalance_amt","custbody294","custbody_write_off_adjust_amt"]);
				var balance = fields.custbody_website_truebalance_amt;
				
				if(balance==null || balance=="")
					balance = 0.00;
				else
					balance = parseFloat(balance);
					
				var compedMgr = fields.custbody294;
				if(compedMgr==null || compedMgr=="")
					compedMgr = 0.00;
				else
					compedMgr = parseFloat(compedMgr);
					
				var compedOps = fields.custbody_write_off_adjust_amt;
				if(compedOps==null || compedOps=="")
					compedOps = 0.00;
				else
					compedOps = parseFloat(compedOps);
					
				balance = balance - compedOps - compedMgr;
				
				if(balance > 50 && nlapiGetFieldValue("custpage_go_to_mgr_approval")=="F")
				{
					alert('Please collect remaining balance before proceeding.');
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
	filters.push(new nlobjSearchFilter("custcol_pu_fulfilled",null,"is","F"));
	filters.push(new nlobjSearchFilter("memo",null,"isnotempty"));
	filters.push(new nlobjSearchFilter("type","item","anyof",["InvtPart","Assembly","NonInvtPart"]));
	var formula = "CASE WHEN {item}='Surprise Gift' THEN (1 - NVL({quantityshiprecv},0)) ELSE NVL({quantity},0) - NVL({quantityshiprecv},0) END";
	filters.push(new nlobjSearchFilter("formulanumeric",null,"greaterthan","0").setFormula(formula));
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
	var results = nlapiSearchRecord("salesorder",null,filters,cols);
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
		table+= "<tr><th width='30px' style='border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;'>&nbsp;</th><th width='120px' style='border-top: 1px solid black; border-bottom: 1px solid black;'>Item</th><th width='250px' style='border-top: 1px solid black; border-bottom: 1px solid black;'>Description</th><th width='75px' style='border-top: 1px solid black; border-bottom: 1px solid black;'>Qty</th><th width='100px' style='border-top: 1px solid black; border-bottom: 1px solid black;'>Cert Included</th><th width='110px' style='border-right: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black;'>&nbsp;</th></tr>";
		
		for(var x=0; x < items.length; x++)
		{
			table+= "<tr>";
			table+= "<td><input type='checkbox' class='includeitem' id='pu_" + items[x].id + "' value='" + items[x].id + "' line='" + items[x].line + "' picked='" + items[x].picked + "' cert=''/></td>";
			table+= "<td>" + items[x].name + "</td>";
			table+= "<td>" + items[x].desc + "</td>";
			table+= "<td>" + items[x].qty + "</td>";
			if(items[x].itemcert!=null && items[x].itemcert!="")
				table+= "<td><input type='button' id='cert_" + items[x].id + "_yes' class='yescert' value='Yes' onclick='certLine(\"" + items[x].id + "\",\"yes\");' />&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' class='nocert' value='No' onclick='certLine(\"" + items[x].id + "\",\"no\");' id='cert_" + items[x].id + "_no'><input type='hidden' id='cert_" + items[x].id + "_value' value='' /></td>";
			else
				table+= "<td>&nbsp;</td>";
			if(items[x].image!=null && items[x].image!="")
				table+= "<td><img src='" + items[x].image + "' style='width: 90px; height: 90px;'/></td>";
			else
				table+= "<td>&nbsp;</td>";
			table+= "</tr>";
		}
		
		table += "</table>";
		
	jQuery('#content').html(table);
}

function certLine(lineId,certValue)
{
	if(certValue=='yes')
	{
		jQuery('#cert_' + lineId + '_yes').css('background-color','green');
		jQuery('#cert_' + lineId + '_yes').css('color','white');
		jQuery('#pu_' + lineId).attr('cert','Y');
		
		jQuery('#cert_' + lineId + '_no').css('background-color','buttonface');
		jQuery('#cert_' + lineId + '_no').css('color','black');
	}
	else
	{
		jQuery('#cert_' + lineId + '_no').css('background-color','green');
		jQuery('#cert_' + lineId + '_no').css('color','white');
		jQuery('#pu_' + lineId).attr('cert','');
		
		jQuery('#cert_' + lineId + '_yes').css('background-color','buttonface');
		jQuery('#cert_' + lineId + '_yes').css('color','black');
	}
}

function showPendingSummary()
{	
	var pending = nlapiGetFieldValue("custpage_pending");
	pending = JSON.parse(pending);
	
	var hasPending = false;
	
	var display = "<p style='font-size: 14px;'>Collect the following item(s)</p><ul>";
	
	if(pending.pending_showroom_ring==true)
	{
		display += "<li style='font-size: 14px;'>Showroom Ring</li>";
		hasPending = true;
	}
	if(pending.pending_id==true)
	{
		display += "<li style='font-size: 14px;'>Government Photo ID</li>";
		hasPending = true;
	}	
	if(pending.pending_finance_receipt==true)
	{
		display += "<li style='font-size: 14px;'>Pending Fraud Check - Check ID</li>";
		hasPending = true;
	}	
	if(pending.pending_showroom_ring==true)
	{
		display += "<li style='font-size: 14px;'>Financing Receipt</li>";
		hasPending = true;
	}	
	if(pending.pending_affidavit==true)
	{
		display += "<li style='font-size: 14px;'>Affidavit</li>";
		hasPending = true;
	}	
	if(pending.pending_balance==true)
	{
		display += "<li style='font-size: 14px;'>Balance <span style='color: red;'>" + pending.balance_amount + "</span></li>";
		hasPending = true;
	}
	
	display += "</ul>";
	
	if(hasPending==true)
	{
		jQuery('#content').html(display);
	}
	else
	{
		//Move to cash and carry page
		Cash_Carry_Splash();
	}
}

function pendingRing()
{
	var display = "<p style='font-size: 14px;'>Showroom Ring Pending - Action Item(s):</p><ul>";
		display += "<li style='font-size: 14px;'>Collect Showroom Ring</li>";
		display += "<li style='font-size: 14px;'>Have an additional team member QA the returned showroom ring</li>";
		display += "</ul>";
		
		display += "QA Employee Notes<br/><input type='text' name='qa_employee' id='qa_employee'/>";
		
		jQuery('#content').html(display);
	
	var pendings = nlapiGetFieldValue("custpage_pending");
	if(pendings!=null && pendings!="")
		pendings = JSON.parse(pendings);
		
	if(nlapiGetFieldValue("custpage_qa_employee")!=null && nlapiGetFieldValue("custpage_qa_employee")!="")
	{
		jQuery('#qa_employee').val(nlapiGetFieldValue("custpage_qa_employee"));
	}
}

function collectID()
{
	var display = "<p style='font-size: 14px;'>Government Photo ID Needed/Fraud Check Pending - Action Item(s):</p><ul>";
		display += "<li style='font-size: 14px;'>Collect/Check Government Photo ID <input type='button' name='receivedID' id='receivedID' value='Received/ID Checked' onclick='ID_Collected();'/></li>";
		display += "</ul>";
		
		display += "<input type='hidden' id='receivedID2' name='receivedID2' value=''/>";
		
		jQuery('#content').html(display);
		
	var pendings = nlapiGetFieldValue("custpage_pending");
	if(pendings!=null && pendings!="")
		pendings = JSON.parse(pendings);
	
	if(nlapiGetFieldValue("custpage_collected_id")=="T")
	{
		jQuery('#receivedID2').val('X');
		
		jQuery('#receivedID').css('background-color','green');
		jQuery('#receivedID').css('color','white');
	}
}

function financeReceipt()
{
	var display = "<p style='font-size: 14px;'>Finance Receipt Pending - Action Item(s):</p><ul>";
	display += "<li style='font-size: 14px;'>Collect Financing Receipt <input type='button' name='receivedReceipt' id='receivedReceipt' value='Received' onclick='Finance_Received();'/></li>";
	display += "</ul>";
	
	display += "<input type='hidden' id='receivedReceipt2' name='receivedReceipt2' value=''/>";
	
	jQuery('#content').html(display);
	
	if(nlapiGetFieldValue("custpage_finance_received")=="T")
	{
		jQuery('#receivedReceipt2').val('X');
		
		jQuery('#receivedReceipt').css('background-color','green');
		jQuery('#receivedReceipt').css('color','white');
	}
}

function collectAffidavit()
{
	var display = "<p style='font-size: 14px;'>Affidvait Pending - Action Item(s):</p><ul>";
	display += "<li style='font-size: 14px;'>Collect Affidavit <input type='button' name='signAffidavit' id='signAffidavit' value='Signing Session' onclick='Signed_Affidvait_SS();'/></li>";
	display += "<li id='reviewBullet' style='font-size: 14px; display: none;'>Review Affidavit <input type='button' name='reviewAffidavit' id='reviewAffidavit' value='Review Affidavit' onclick='Review_Affidavit();'/></li>";
	display += "</ul>";
	
	jQuery('#content').html(display);
}

function collectBalance(balance)
{
	var display = "<p style='font-size: 14px;'>Pending Balance - Action Item(s):</p><ul>";
	display += "<li style='font-size: 14px;'>Collect Balance of " + nlapiFormatCurrency(balance) + "</li>";
	display += "</ul>";
	
	if(balance > 0)
		display += "<input type='button' name='createDeposit' id='createDeposit' value='Create Deposit' onclick='Create_Deposit();'/>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' name='mgrApproval' id='mgrApproval' value='Manager Approval' onclick='Mgr_Approval();'/>";
	
	jQuery('#content').html(display);
}

function Create_Deposit()
{
	var depositURL = "/app/accounting/transactions/custdep.nl?entity=" + nlapiGetFieldValue("custpage_customer") + "&salesorder=" + nlapiGetFieldValue("custpage_order") + "&record.custbody_triggered_from_pu_receipt=" + nlapiGetFieldValue("custpage_pu_receipt_metadata");
	
	//var display = "<iframe src='" + depositURL + "' width='850px' height='650px' style='padding-top: 10px;'></iframe>";
	
	//jQuery('#content').html(display);
	
	window.location.href = depositURL;
}

function Mgr_Approval()
{
	nlapiSetFieldValue("custpage_go_to_mgr_approval","T",true,true);
	
	jQuery('#submitter').click();
}

function Cash_Carry_Splash()
{
	var display = "<ul>";
	display += "<li style='font-size: 14px;'>Was this cash and carry order?</li>";
	display += "</ul>";
	
	display += "<input type='button' name='yesCashCarry' id='yesCashCarry' value='Yes' onclick='CC_Mark_Yes();'/>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' name='noCashCarry' id='noCashCarry' value='No' onclick='CC_Mark_No();'/>";
	
	display += "<input type='hidden' id='cashCarryResp' name='cashCarryResp' value=''/>";
	
	jQuery('#content').html(display);
}

function CC_Mark_Yes()
{
	jQuery('#cashCarryResp').val('Y');
	
	jQuery('#yesCashCarry').css('background-color','green');
	jQuery('#yesCashCarry').css('color','white');
	
	jQuery('#noCashCarry').css('background-color','buttonface');
	jQuery('#noCashCarry').css('color','black');
}

function CC_Mark_No()
{
	jQuery('#cashCarryResp').val('N');
	
	jQuery('#noCashCarry').css('background-color','green');
	jQuery('#noCashCarry').css('color','white');
	
	jQuery('#yesCashCarry').css('background-color','buttonface');
	jQuery('#yesCashCarry').css('color','black');
}

function signReceipt()
{
	var display = "<ul>";
	display += "<li style='font-size: 14px;'>Collect Pick-Up Receipt <input type='button' name='signReceipt' id='signReceipt' value='Signing Session' onclick='Signed_PU_Receipt();'/></li>";
	display += "<li id='emailBullet' style='font-size: 14px; display: none;'>Email Receipt <input type='button' name='emailReceipt' id='emailReceipt' value='Email Receipt' onclick='Review_Affidavit();'/></li>";
	display += "</ul>";
	
	jQuery('#content').html(display);
}

function checkBalance()
{
	var orderId = nlapiGetFieldValue("custpage_order");
	
	var fields = nlapiLookupField("salesorder",orderId,["custbody_website_truebalance_amt","custbody294","custbody_write_off_adjust_amt"]);
	var balance = fields.custbody_website_truebalance_amt;
	
	if(balance==null || balance=="")
		balance = 0.00;
	else
		balance = parseFloat(balance);
		
	var compedMgr = fields.custbody294;
	if(compedMgr==null || compedMgr=="")
		compedMgr = 0.00;
	else
		compedMgr = parseFloat(compedMgr);
		
	var compedOps = fields.custbody_write_off_adjust_amt;
	if(compedOps==null || compedOps=="")
		compedOps = 0.00;
	else
		compedOps = parseFloat(compedOps);
		
	balance = balance - compedOps - compedMgr;
	
	collectBalance(balance);
	
	//if(balance > 50)
	//{
		//If balance > $0 then go back to deposit/approval page
	//	collectBalance(balance);
	//}
	//else
	//{
		//If balance <= $0 then continue to next page
		//jQuery('#nextbtn').click();
		//jQuery('#submitter').click();
	//}
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
	else if(prevPage=='pendings')
	{
		showPendingSummary();
		nlapiSetFieldValue("custpage_state","pendings",true,true);
	}
	else if(prevPage=='collect_ring')
	{
		pendingRing();
		
		nlapiSetFieldValue("custpage_state","collect_ring",true,true);
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

function ID_Collected()
{
	var currentVal = jQuery('#receivedID2').val();
	
	if(currentVal==null || currentVal=='')
	{
		jQuery('#receivedID2').val('X');
		//jQuery('#receivedID').attr('disabled','disabled');
		
		nlapiSetFieldValue("custpage_collected_id","T",true,true);
		
		jQuery('#receivedID').css('background-color','green');
		jQuery('#receivedID').css('color','white');
	}
	else
	{
		jQuery('#receivedID2').val('');
		
		nlapiSetFieldValue("custpage_collected_id","F",true,true);
		
		jQuery('#receivedID').css('background-color','buttonface');
		jQuery('#receivedID').css('color','black');
	}
}

function Finance_Received()
{
	var currentVal = jQuery('#receivedReceipt2').val();
	
	if(currentVal==null || currentVal=='')
	{
		jQuery('#receivedReceipt2').val('X');
		//jQuery('#receivedReceipt').attr('disabled','disabled');
		
		nlapiSetFieldValue("custpage_finance_received","T",true,true);
		
		jQuery('#receivedReceipt').css('background-color','green');
		jQuery('#receivedReceipt').css('color','white');
	}
	else
	{
		jQuery('#receivedReceipt2').val('');
		
		nlapiSetFieldValue("custpage_finance_received","F",true,true);
		
		jQuery('#receivedReceipt').css('background-color','buttonface');
		jQuery('#receivedReceipt').css('color','black');
	}
}

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

function checkCreateFulfillment()
{
	var items = nlapiGetFieldValue("custpage_items");
	items = JSON.parse(items);
	
	var fulfillmentId = nlapiGetFieldValue("custpage_fulfillment");
	console.log('Fulfillment ID found in custpage_fulfillment: ' + fulfillmentId);
	
	if(fulfillmentId!=null && fulfillmentId!="")
		return true;
	
	var ffsToCreate = [];
	
	for(var x=0; x < items.length; x++)
	{
		if(items[x].picked==null || items[x].picked=='' || items[x].picked==0)
		{
			ffsToCreate.push({
				item : items[x].item,
				line : items[x].line
			});
		}
	}
	
	var templateId, folderId;
		
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
	{
		templateId = 126;
		folderId = "13039762";
	}
	else
	{
		templateId = 126;
		folderId = "13039762";
	}
	
	if(ffsToCreate.length > 0)
	{
		console.log('Creating new item fulfillment');
		
		var fulfillment = nlapiTransformRecord("salesorder",nlapiGetFieldValue("custpage_order"),"itemfulfillment");
		
		var puLocation = nlapiLookupField("salesorder",nlapiGetFieldValue("custpage_order"),"custbody_pickup_location");
		var location = null;
		
		var filters = [];
		filters.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"is",puLocation));
		var results = nlapiSearchRecord("location",null,filters);
		if(results)
		{
			location = results[0].getId();
		}
		
		var customer = fulfillment.getFieldValue("entity");
		
		fulfillment.setFieldValue("custbody89",""); //Email Confirmation Status = Emailed
		
		for(var x=0; x < fulfillment.getLineItemCount("item"); x++)
		{
			for(var i=0; i < ffsToCreate.length; i++)
			{
				if(fulfillment.getLineItemValue("item","item",x+1)==ffsToCreate[i].item && fulfillment.getLineItemValue("item","orderline",x+1)==ffsToCreate[i].line)
				{
					fulfillment.selectLineItem("item",x+1);
					fulfillment.setCurrentLineItemValue("item","itemreceive","T");
					fulfillment.setCurrentLineItemValue("item","location",location);
					fulfillment.commitLineItem("item");
				}
			}
		}
		
		var fulfillmentId = nlapiSubmitRecord(fulfillment,true,true);
		fulfillment = nlapiLoadRecord("itemfulfillment",fulfillmentId);
		
		nlapiSetFieldValue("custpage_fulfillment",fulfillmentId,true,true);
		nlapiSubmitField("customrecord_pu_receipt_metadata",nlapiGetFieldValue("custpage_pu_receipt_metadata"),"custrecord_pu_receipt_item_fulfillment",fulfillmentId);
		
		//Generate pick-up receipt
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
	else
	{
		console.log('Use existing item fulfillment');
		var fulfillmentId = null;
		
		//Find linked item fulfillment
		var filters = [];
		filters.push(new nlobjSearchFilter("createdfrom",null,"is",nlapiGetFieldValue("custpage_order")));
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
		var results = nlapiSearchRecord("itemfulfillment",null,filters);
		if(results)
		{
			console.log('Fulfillment ID Used: ' + results[0].getId());
			
			fulfillmentId = results[0].getId();
			
			nlapiSetFieldValue("custpage_fulfillment",results[0].getId(),true,true);
			nlapiSubmitField("customrecord_pu_receipt_metadata",nlapiGetFieldValue("custpage_pu_receipt_metadata"),"custrecord_pu_receipt_item_fulfillment",results[0].getId());
		}
		
		//Check for PU receipt SignNow custom record
		var filters = [];
		filters.push(new nlobjSearchFilter("custrecord_signnow_customer",null,"is",nlapiGetFieldValue("custpage_customer")));
		filters.push(new nlobjSearchFilter("custrecord_document_type",null,"is","4"));
		filters.push(new nlobjSearchFilter("custrecord_signnow_status",null,"noneof",["3","4"]));
		var results = nlapiSearchRecord("customrecord_custom_signnow_document",null,filters);
		if(!results)
		{
			//Generate pick-up receipt
			var renderer = nlapiCreateTemplateRenderer();
			renderer.setTemplate(templateId); //Pick-up Receipt Template (SignNow)
			renderer.addRecord("record",nlapiLoadRecord("itemfulfillment",fulfillmentId));
			
			var pdfObj = nlapiXMLToPDF(renderer.renderToString());
			pdfObj.setName("" + fulfillment.getFieldValue("tranid") + "_pu_receipt_" + fulfillmentId + ".pdf");
			pdfObj.setFolder(folderId);
			var pdfId = nlapiSubmitFile(pdfObj);
			
			var signNow = nlapiCreateRecord("customrecord_custom_signnow_document");
			signNow.setFieldValue("custrecord_document_type","4"); //Document Type = Pick-Up Receipt
			signNow.setFieldValue("custrecord_signnow_transaction",fulfillmentId);
			signNow.setFieldValue("custrecord_signnow_customer",nlapiGetFieldValue("custpage_customer"));
			signNow.setFieldValue("custrecord_signnow_document",pdfId);
			var signNowId = nlapiSubmitRecord(signNow,true,true);
		}
	}
}

function Sign_PU_Receipt()
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
		alert("ERROR: No PU Receipt on file to send for signature.");
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
