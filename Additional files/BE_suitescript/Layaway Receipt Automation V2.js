

function createLaywayReceipt(type)
{
   if(type=='approve'  || type=='edit')
  {
    var objOld=nlapiGetOldRecord();
    var statusOld=objOld.getFieldValue('orderstatus');
    nlapiLogExecution('Debug','Old status',statusOld);

    var objNew=nlapiGetNewRecord();
    var statusNew= objNew.getFieldValue('orderstatus');
    nlapiLogExecution('Debug','New status',statusNew);

    if( (statusOld=='A' && statusNew=='B') || type=='approve')
    {
        nlapiLogExecution('Debug','Get In','Status modified');
      //Get salesorder Id
      var soId=nlapiGetRecordId();
      //Load Salesorder
      var objSO=nlapiLoadRecord('salesorder',soId);
      var IsLayway=objSO.getFieldValue('custbody111');
      if(IsLayway=='T')
      {
        generateReceiptTemplate(objSO,soId,'approve');
      }
    }
  }
}
function addLayawayReceiptButton(type)
{
  if(type=="view")
	{
		try
		{
			var so_id=nlapiGetRecordId();
			var so_fields=nlapiLookupField('salesorder',so_id,['status','custbody111','custbody_layaway_receipt']);
			var orderstatus=so_fields.status;
			var IsLayway=so_fields.custbody111;
			var layaway_receipt=so_fields.custbody_layaway_receipt;
			if(orderstatus=='pendingFulfillment' && IsLayway=='T' && (layaway_receipt==null || layaway_receipt=='') )
			{
				var url = nlapiResolveURL("SUITELET","customscript_layway_receipt_auto_suitlet","customdeploy_layway_receipt_auto_suitlet");
				url += "&soid=" + so_id;
				form.addButton("custpage_layaway_receipt","Create Layaway Receipt","document.location='"+url+"';");
				//form.addButton("custpage_layaway_receipt","Create Layaway Receipt","window.open('" + url + "','layawayReceiptWin','height=800,width=600');");
			}
		}
		catch(err)
		{
			nlapiLogExecution("debug","Error Showing Layaway receipt","Details: " + err.message);
		}
	}
}
function createlayawayReceiptByButton(request,response)
{
	if(request.getMethod() == 'GET')
	{
		//Get salesorder Id
		var soId=request.getParameter('soid');
		if(soId)
		{
			//Load Salesorder
			var objSO=nlapiLoadRecord('salesorder',soId);
			var IsLayway=objSO.getFieldValue('custbody111');
			if(IsLayway=='T')
			{
				generateReceiptTemplate(objSO,soId,'custom');
			}
		}
	}
}
function generateReceiptTemplate(objSO,soId,createType)
{
	try{
		
		//Get required field's value from SO object
		var customer_id=objSO.getFieldValue('entity');
		var document_number=objSO.getFieldValue('tranid');
		var month_pay_date=objSO.getFieldText('custbody112');
		if(!month_pay_date)
		{
			month_pay_date='';
		}
		
		var total_amt=objSO.getFieldValue('total');
		var web_true_bal_amt=objSO.getFieldValue('custbody_website_truebalance_amt');
		var currency=objSO.getFieldText('currency');
		if(currency=='USA')
		{
			currency='USD';
		}
		
		var deposit_received=(parseFloat(total_amt)-parseFloat(web_true_bal_amt)).toFixed(2);
		var rem_balance=parseFloat(web_true_bal_amt).toFixed(2);
		var month_pay_amt= objSO.getFieldValue('custbody114'); //parseFloat(objSO.getFieldValue('custbody114')).toFixed(2);
		if(month_pay_amt)
		{
			month_pay_amt=parseFloat(month_pay_amt).toFixed(2);
		}
		else{
			month_pay_amt=parseFloat(0).toFixed(2);
		}
		
		//Get customer name
		var cust_name=nlapiLookupField('customer',customer_id,'altname');
		
		//Get formated date
		var date = getTodayDate();
		var today_date=date[0];
		
		var xml = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
		xml += '<pdf><head>';
		xml += '<macrolist>';
		xml += '<macro id="nlfooter" >';
		xml+=' <p align="center" style="font-family:Century Gothic,  sans-serif; color:#BABABA; font-size:10pt;">26 O&rsquo;Farrell Street • 10th Floor • San Francisco, CA 94108 • 800-691-0962 • www.BrilliantEarth.com</p>';
		xml += '</macro>';
		xml += '</macrolist>';
		xml+='<style> body{ font-size:10pt;}</style></head>';

		xml+='<body footer="nlfooter" footer-height="1%">\
			<table width="100%" border="0" cellspacing="0" cellpadding="0">\
				  <tr>\
					<td width="50%" align="left" valign="top"><img src="/core/media/media.nl?id=7429493&amp;c=666639&amp;h=f38c84ab4d27a4e5bdc6&amp;fcts=20170816041603" width="150" height="30"/></td>\
					<td width="50%" align="right" valign="top" style="font-family:Century Gothic, sans-serif; color:#A1A1A1; font-size:10pt;">Date: '+today_date+'</td>\
				  </tr>\
				  <tr>\
					<td align="left" valign="top">&nbsp;</td>\
					<td align="right" valign="top" style="font-family:Century Gothic, sans-serif; color:#777777; font-size:10pt;">&nbsp;</td>\
				  </tr>\
				  <tr>\
					<td colspan="2" align="center" valign="top" style="font-family:Century Gothic, sans-serif; color:#777777; font-size:12pt;">Layaway Receipt</td>\
				  </tr>\
				  <tr>\
					<td align="left" valign="top">&nbsp;</td>\
					<td align="right" valign="top" style="font-family:Century Gothic, sans-serif; color:#777777; font-size:10pt;">&nbsp;</td>\
				  </tr>\
				  <tr>\
					<td align="left" valign="top"><p style="font-family:Century Gothic, sans-serif; color:#777777; font-size:10pt; margin:0px; padding:0px; line-height:20px;">Name: '+cust_name+'</p>\
					<p style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt; margin:0px; padding:0px; line-height:20px;">Sales Order: '+document_number+'</p>\
					<p style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt; margin:0px; padding:0px; line-height:20px;">Monthly Payment Date: '+month_pay_date+'</p></td>\
					<td align="right" valign="top" style="font-family:Century Gothic, sans-serif; color:#777777; font-size:10pt;"><p style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt; margin:0px; padding:0px; line-height:20px;">Deposit Received: $'+deposit_received+' '+currency+'</p>\
					  <p style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt; margin:0px; padding:0px; line-height:20px;">Remaining Balance: $'+rem_balance+' '+currency+'</p>\
					<p style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt; margin:0px; padding:0px; line-height:20px;">Monthly Payment Amount: $'+month_pay_amt+' '+currency+'</p></td>\
				  </tr>\
				  <tr><td colspan="2" align="right" valign="top" style="font-family:Century Gothic, sans-serif; color:#777777; font-size:10pt;">&nbsp;</td></tr>\
				   <tr><td colspan="2" align="right" valign="top" style="font-family:Century Gothic, sans-serif; color:#777777; font-size:10pt;">&nbsp;</td></tr>\
				</table>\
			<table  style="background-color:#f2f2f2" width="100%" border="0" cellspacing="0" cellpadding="5">\
			  <tr>\
				<td colspan="2" style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt;">Items Purchased</td>\
			  </tr>';
			  var itemCount=objSO.getLineItemCount('item');
			  for(var i=1;i<=itemCount;i++)
			  {
				  var stock_number=objSO.getLineItemText('item','item',i);
				  var item_type=objSO.getLineItemValue('item','itemtype',i);
				  var item_amount=objSO.getLineItemValue('item','amount',i);
				  var item_desc=objSO.getLineItemValue('item','description',i);
				  if( (item_type=='InvtPart' || item_type=='AssemblyBuild') && parseFloat(item_amount)>0 && (item_desc!=null || item_desc!='') )
				  {
				   xml+='<tr>\
					<td width="20%" bgcolor="#FFFFFF" style="background-color:#FFFFFF;font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt;">Stock Number:</td>\
					<td width="80%" bgcolor="#FFFFFF" style="background-color:#FFFFFF;font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt;">'+stock_number+'</td>\
				  </tr>\
				  <tr>\
					<td bgcolor="#FFFFFF" style="background-color:#FFFFFF;font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt;">Description:</td>\
					<td bgcolor="#FFFFFF" style="background-color:#FFFFFF;font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt;">'+item_desc+'</td>\
				  </tr>';
				  }
			  }
			  xml+='</table>\
		 <table>\
		  <tr>\
			<td>&nbsp;</td>\
		  </tr>\
		  <tr>\
			<td>\
			<ul type="I" style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt;" >\
				<li type="I" style="padding-bottom:5px;">Items will be held for up to 12 months from the initial date of sale.</li>\
				<li type="I" style="padding-bottom:5px;">If before the end of the stated layaway period, the goods have for any reason become no longer available in the same condition as at the time of the sale, Brilliant Earth will refund any deposits or payments made under this layaway transaction.</li>\
			</ul>\
			</td>\
		  </tr>\
		  <tr>\
			<td>&nbsp;</td>\
		  </tr>\
		  <tr>\
			<td align="center" style="font-family:Century Gothic, sans-serif; color:#A1A1A1; font-size:10pt;">Other terms &amp;  conditions</td>\
		  </tr>\
		  <tr>\
			<td>\
			<ul type="a" style="font-family:Century Gothic, sans-serif; color:#777777; font-size:10pt; list-style-type:upper-roman; display:list-item">\
				<li style="padding-bottom:5px;">Brilliant Earth layaway  purchases require an initial deposit of 20% of the purchase price.</li>\
				<li style="padding-bottom:5px;">Layaway purchases require a  regular minimum payment on the 1st or the 15th of every month after the initial  deposit as agreed with the sales representative. Minimum monthly payment is  either a) 5% of the total order value or b) $100, whichever is lower in value.  Customer may make an additional or larger payment at any time.</li>\
				<li style="padding-bottom:5px;">Layaway orders must be paid  in full within 12 months from the original date of purchase. For orders not  paid in full after 12 months, Brilliant Earth reserves the right to discontinue  the hold on the layaway merchandise.</li>\
				<li style="padding-bottom:5px;">The layaway deposit may be  refunded or applied toward an exchange item within 30 days of purchase, with  the exception of custom designed, custom engraved, modified merchandise, or  special orders which are non-refundable and non-exchangeable.</li>\
				<li style="padding-bottom:5px;">Layaway payments are  non-refundable after 30 days from the initial purchase date. Should customer  need to cancel their layaway purchase before shipment and after the 30 days  from the initial purchase date, a restocking fee of 20% of the full purchase  price will be deducted from the amount paid, with the remaining balance to be  applied as store credit.</li>\
				<li style="padding-bottom:5px;">Layaway ring orders, <u>with  the exception of custom designed</u>, custom engraved, modified, or special  orders which are nonrefundable and non-exchangeable, may be resized within 30  calendar days of the ring being shipped from Brilliant Earth.</li>\
			</ul>\
			</td>\
		  </tr>\
		  <tr>\
			<td>&nbsp;</td>\
		  </tr>\
		  <tr>\
			<td align="right" style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt;">Signature: {{t:s;r:y;o:&quot;signer&quot;;w:150;h:15;}}</td>\
		  </tr>\
		  <tr>\
			<td>&nbsp;</td>\
		  </tr>\
		  <tr>\
			<td align="right" style="font-family:Century Gothic, sans-serif; color:#777777 font-size:10pt;">Date:  {{t:t;r:y;o:&quot;signer&quot;;l:&quot;Date&quot;;}}</td>\
		  </tr>\
		  <tr>\
			<td>&nbsp;</td>\
		  </tr>\
		 </table>\
		</body></pdf>';
		//var date = getTodayDate();
		
		var fileName = 'layaway_receipt_' + document_number + '_' + soId + '.pdf';
		
		var file = nlapiXMLToPDF(xml);
		// response.setContentType('PDF', 'Template_A.pdf ', 'inline');
		//response.write(fileA.getValue());
		var folderId = '11064888'; //Folder ID
		if (file != null && file != '') {
		  file.setFolder(folderId);
		  file.setName(fileName);
		}
		var fileId = nlapiSubmitFile(file);
		nlapiSubmitField('salesorder', soId, 'custbody_layaway_receipt', fileId);
      
      nlapiLogExecution('debug', 'Success', 'Success');
      nlapiLogExecution('debug', 'file id', fileId);
      if(createType=='custom')
		{
		   nlapiSetRedirectURL('RECORD', 'salesorder', soId, false);
		}
	}
	catch (ex) {
    nlapiLogExecution('debug', 'Error in Generating Layaway Receipt', ex.message);
  }
}
function getTodayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var format1 = mm + '/' + dd + '/' + yyyy;
  var format2 = mm + '_' + dd + '_' + yyyy;
  return [format1, format2];
}