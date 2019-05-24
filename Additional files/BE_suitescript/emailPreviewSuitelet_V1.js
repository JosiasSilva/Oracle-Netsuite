nlapiLogExecution("audit","FLOStart",new Date().getTime());
function emailPreview(request,response)
{
  var emailTempId =null;
  var form = nlapiCreateForm('Preview Email',true);
  var orderId = request.getParameter('orderId');
  nlapiLogExecution('debug','Order Id:',orderId);
  var emailType = request.getParameter('emailType');
  nlapiLogExecution('debug','Email Type:',emailType);
  form.addButton('custpage_email_preview_close', 'Close', "window.close();" );
  var emailPreviewContent =  form.addField('custpage_email_body','inlinehtml','Content');
  var newEmailTemplateId = loadNewEmailTemplate();
  nlapiLogExecution('debug','new Email TemplateId:',newEmailTemplateId);
  
  /* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	  var addressee = request.getParameter('addressee');
	  // var attention = request.getParameter('custpage_attention');
  var address_1 = request.getParameter('address1');
  var address_2 = request.getParameter('address2');
  var city = request.getParameter('city');
  // var state = request.getParameter('state');
  var state_txt = request.getParameter('statetxt');
  var country = request.getParameter('country');
  var zipcode = request.getParameter('zipcode');
  var addrArr = [];
  addrArr.push({
	addressee0: addressee,
	address_10: address_1,
	address_20: address_2,
	city0: city,
	// state0: state,
	state_txt0: state_txt,
	country0: country,
	zipcode0: zipcode
  });
  /* End: Added by Nikhil on October 18, 2018 for NS-1363 */
  
  var chkNewEmailTemplate = null;
  if(emailType =="resize")
  {
    if(newEmailTemplateId == '0')
    {
      emailTempId = 405;
      chkNewEmailTemplate = false;
      emailPreviewForResize(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr); // Edited by Nikhil Bhutani on October 30, 2018 for NS-1363
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForResize(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr); // Edited by Nikhil Bhutani on October 30, 2018 for NS-1363
    }
  }
  else if(emailType =="repair")
  {
    if(newEmailTemplateId == '0')
    {
      emailTempId = 641;
      chkNewEmailTemplate = false;
      emailPreviewForRepair(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr); // Edited by Nikhil Bhutani on October 30, 2018 for NS-1363
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForRepair(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr); // Edited by Nikhil Bhutani on October 30, 2018 for NS-1363
    }
  }
  else if(emailType =="exchange")
  {
    if(newEmailTemplateId =='0')
    {
      emailTempId = 397;
      chkNewEmailTemplate = false;
      emailPreviewForExchange(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr); // Edited by Nikhil Bhutani on October 30, 2018 for NS-1363
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForExchange(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr); // Edited by Nikhil Bhutani on October 30, 2018 for NS-1363
    }
  }
  else if(emailType =="matchedweddingband")
  {
    if(newEmailTemplateId =='0')
    {
      emailTempId = 407;
      chkNewEmailTemplate = false;
      emailPreviewForMatchedWeddingBand(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr); // Edited by Nikhil Bhutani on October 30, 2018 for NS-1363
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForMatchedWeddingBand(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr); // Edited by Nikhil Bhutani on October 30, 2018 for NS-1363
    }
  }
  else if(emailType =="engrave" || emailType=="set" || emailType=="upgrade")
  {
    if(newEmailTemplateId =='0')
    {
      emailTempId = 399;
      chkNewEmailTemplate = false;
      emailPreviewForEngraveSetUpgrade(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForEngraveSetUpgrade(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
  }
  response.writePage(form);
}
function emailPreviewForRepair(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr)
{
  if(chkNewEmailTemplate == false)
  {
    var custId= nlapiLookupField('salesorder',orderId,'entity');
    nlapiLogExecution("debug","customer id",custId);
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailSubj = emailTemp.getFieldValue('subject');
    var emailBody = emailTemp.getFieldValue('content');
    var record = nlapiLoadRecord('salesorder', orderId);
	/* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	var updateAddress = false;
	if(addrArr[0].address_10 != record.getFieldValue("shipaddr1"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].address_20 != record.getFieldValue("shipaddr2"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].city0 != record.getFieldValue("shipcity"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].zipcode0 != record.getFieldValue("shipzip"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].country0 != record.getFieldValue("shipcountry"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].addressee0 != record.getFieldValue("shipaddressee"))
		updateAddress = true;
	/* 
	Commented by Nikhil on November 02, 2018 as per new comments on NS-1363
	if(addrArr[0].state0 !='' && addrArr[0].state0 !=null)
	{
		if(!updateAddress && addrArr[0].state0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	}
	else if(addrArr[0].state_txt0 !='' && addrArr[0].state_txt0 !=null)
	{
		if(!updateAddress && addrArr[0].state_txt0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	}
	*/
	if(!updateAddress && addrArr[0].state_txt0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	nlapiLogExecution("Debug","Update Address",updateAddress);
	/* End: Added by Nikhil on October 18, 2018 for NS-1363 */
	
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.addRecord('transaction', record);
    renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
	/* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	if(updateAddress)
	{
		nlapiLogExecution("Debug","Email Preview Content for Repair",renderBody);
		if(renderBody && renderBody != '' && renderBody != null && renderBody  != 'undefined')
		{
			var temp1 = '\r\n<strong>Original Shipping Address:</strong><br />\r\n<br />\r\n<span style="background-color: rgb(255, 255, 255);">';
			var temp2 = '</span><br />\r\n<br />\r\n<span style="background-color: rgb(255, 255, 255);">Your complimentary shipping label is attached to this email, and I have included return shipping instructions below.'
			var a = renderBody.split(temp1);
			var b = a[1].split(temp2);
			var str = '' + addrArr[0].addressee0 + '<br />' + addrArr[0].address_10 + '<br />' + addrArr[0].address_20 + '<br />' + addrArr[0].city0 + ' ' + addrArr[0].state_txt0 + ' ' + addrArr[0].zipcode0 + '<br />' + addrArr[0].country0;
			var newBody = a[0] + temp1 + str + temp2 + b[1];
			nlapiLogExecution("Debug","Email Preview New Body for Repair", newBody);
			emailPreviewContent.setDefaultValue(newBody);
		}
	}
	else
	{
		nlapiLogExecution("Debug","Email Preview Content for Repair",renderBody);
		emailPreviewContent.setDefaultValue(renderBody);
	}
	/* End: Added by Nikhil on October 18, 2018 for NS-1363 */
  }else if(chkNewEmailTemplate == true)
  {
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailBody = emailTemp.getFieldValue('content');
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("Debug","Email Preview Content for Repair",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
  }
}
function emailPreviewForResize(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr)
{
  if(chkNewEmailTemplate == false)
  {
    var custId= nlapiLookupField('salesorder',orderId,'entity');
    nlapiLogExecution("debug","customer id",custId);
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailSubj = emailTemp.getFieldValue('subject');
    var emailBody = emailTemp.getFieldValue('content');
    var record = nlapiLoadRecord('salesorder', orderId);
	/* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	var updateAddress = false;
	if(addrArr[0].address_10 != record.getFieldValue("shipaddr1"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].address_20 != record.getFieldValue("shipaddr2"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].city0 != record.getFieldValue("shipcity"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].zipcode0 != record.getFieldValue("shipzip"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].country0 != record.getFieldValue("shipcountry"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].addressee0 != record.getFieldValue("shipaddressee"))
		updateAddress = true;
	/* 
	Commented by Nikhil on November 02, 2018 as per new comments on NS-1363
	if(addrArr[0].state0 !='' && addrArr[0].state0 !=null)
	{
		if(!updateAddress && addrArr[0].state0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	}
	else if(addrArr[0].state_txt0 !='' && addrArr[0].state_txt0 !=null)
	{
		if(!updateAddress && addrArr[0].state_txt0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	}
	*/
	if(!updateAddress && addrArr[0].state_txt0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	nlapiLogExecution("Debug","Update Address",updateAddress);
	/* End: Added by Nikhil on October 18, 2018 for NS-1363 */
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.addRecord('transaction', record);
    renderer.addRecord('entity', nlapiLoadRecord('customer', custId)); 
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    // nlapiLogExecution("Debug","Email Preview Content for Resize",renderBody);
    // emailPreviewContent.setDefaultValue(renderBody);
	/* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	if(updateAddress)
	{
		nlapiLogExecution("Debug","Email Preview Content for Resize",renderBody);
		if(renderBody && renderBody != '' && renderBody != null && renderBody  != 'undefined')
		{
			var temp1 = '<strong style="background-color: rgb(255, 255, 255);">Original Shipping Address:</strong><br style="background-color: rgb(255, 255, 255);" />\r\n<br style="background-color: rgb(255, 255, 255);" />\r\n<span style="background-color: rgb(255, 255, 255);">';
			var temp2 = '</span><br style="background-color: rgb(255, 255, 255);" />\r\n<br style="background-color: rgb(255, 255, 255);" />\r\n<span style="background-color: rgb(255, 255, 255);">Your complimentary shipping label is attached to this email, and we have included return shipping instructions below.';
			var a = renderBody.split(temp1);
			var b = a[1].split(temp2);
			var str = '' + addrArr[0].addressee0 + '<br />' + addrArr[0].address_10 + '<br />' + addrArr[0].address_20 + '<br />' + addrArr[0].city0 + ' ' + addrArr[0].state_txt0 + ' ' + addrArr[0].zipcode0 + '<br />' + addrArr[0].country0;
			var newBody = a[0] + temp1 + str + temp2 + b[1];
			nlapiLogExecution("Debug","Email Preview New Body for Resize", newBody);
			emailPreviewContent.setDefaultValue(newBody);
		}
	}
	else
	{
		nlapiLogExecution("Debug","Email Preview Content for Resize",renderBody);
		emailPreviewContent.setDefaultValue(renderBody);
	}
	/* End: Added by Nikhil on October 18, 2018 for NS-1363 */
  }
  else if(chkNewEmailTemplate ==true)
  {
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailSubj = emailTemp.getFieldValue('subject');
    var emailBody = emailTemp.getFieldValue('content');
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("Debug","Email Preview Content for Resize",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
  }
}
function emailPreviewForExchange(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr)
{
  if(chkNewEmailTemplate == false)
  {
    var custId= nlapiLookupField('salesorder',orderId,'entity');
    nlapiLogExecution("debug","customer id",custId);
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailSubj = emailTemp.getFieldValue('subject');
    var emailBody = emailTemp.getFieldValue('content');
    var record = nlapiLoadRecord('salesorder', orderId);
	/* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	var updateAddress = false;
	if(addrArr[0].address_10 != record.getFieldValue("shipaddr1"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].address_20 != record.getFieldValue("shipaddr2"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].city0 != record.getFieldValue("shipcity"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].zipcode0 != record.getFieldValue("shipzip"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].country0 != record.getFieldValue("shipcountry"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].addressee0 != record.getFieldValue("shipaddressee"))
		updateAddress = true;
	/* 
	Commented by Nikhil on November 02, 2018 as per new comments on NS-1363
	if(addrArr[0].state0 !='' && addrArr[0].state0 !=null)
	{
		if(!updateAddress && addrArr[0].state0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	}
	else if(addrArr[0].state_txt0 !='' && addrArr[0].state_txt0 !=null)
	{
		if(!updateAddress && addrArr[0].state_txt0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	}
	*/
	if(!updateAddress && addrArr[0].state_txt0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	nlapiLogExecution("Debug","Update Address",updateAddress);
	/* End: Added by Nikhil on October 18, 2018 for NS-1363 */
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.addRecord('transaction', record);
    renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    // nlapiLogExecution("Debug","Email Preview Content for Exchange",renderBody);
    // emailPreviewContent.setDefaultValue(renderBody);
	/* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	if(updateAddress)
	{
		nlapiLogExecution("Debug","Email Preview Content for Exchange",renderBody);
		if(renderBody && renderBody != '' && renderBody != null && renderBody  != 'undefined')
		{
			var temp1 = '\r\n<strong style="font-family: arial, helvetica, sans-serif; background-color: rgb(255, 255, 255);">Original Shipping Address:</strong><br />\r\n<br />\r\n<span style="background-color: rgb(255, 255, 255);">';
			var temp2 = '</span><br />\r\n<br />\r\n<span style="background-color: rgb(255, 255, 255);">Your complimentary shipping label is attached to this email, and we have included return shipping instructions below.';
			var a = renderBody.split(temp1);
			var b = a[1].split(temp2);
			var str = '' + addrArr[0].addressee0 + '<br />' + addrArr[0].address_10 + '<br />' + addrArr[0].address_20 + '<br />' + addrArr[0].city0 + ' ' + addrArr[0].state_txt0 + ' ' + addrArr[0].zipcode0 + '<br />' + addrArr[0].country0;
			var newBody = a[0] + temp1 + str + temp2 + b[1];
			nlapiLogExecution("Debug","Email Preview Content for Exchange",newBody);
			emailPreviewContent.setDefaultValue(newBody);
		}
	}
	else
	{
		nlapiLogExecution("Debug","Email Preview Content for Exchange",renderBody);
		emailPreviewContent.setDefaultValue(renderBody);
	}
	/* End: Added by Nikhil on October 18, 2018 for NS-1363 */
  }else if(chkNewEmailTemplate == true)
  {
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailBody = emailTemp.getFieldValue('content');
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("Debug","Email Preview Content for Exchange",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
  }
}
function emailPreviewForMatchedWeddingBand(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate, addrArr)
{
  if(chkNewEmailTemplate== false)
  {
    var custId= nlapiLookupField('salesorder',orderId,'entity');
    nlapiLogExecution("debug","customer id",custId);
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailSubj = emailTemp.getFieldValue('subject');
    var emailBody = emailTemp.getFieldValue('content');
    var record = nlapiLoadRecord('salesorder', orderId);
	/* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	var updateAddress = false;
	if(addrArr[0].address_10 != record.getFieldValue("shipaddr1"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].address_20 != record.getFieldValue("shipaddr2"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].city0 != record.getFieldValue("shipcity"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].zipcode0 != record.getFieldValue("shipzip"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].country0 != record.getFieldValue("shipcountry"))
		updateAddress = true;
	if(!updateAddress && addrArr[0].addressee0 != record.getFieldValue("shipaddressee"))
		updateAddress = true;
	/* 
	Commented by Nikhil on November 02, 2018 as per new comments on NS-1363
	if(addrArr[0].state0 !='' && addrArr[0].state0 !=null)
	{
		if(!updateAddress && addrArr[0].state0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	}
	else if(addrArr[0].state_txt0 !='' && addrArr[0].state_txt0 !=null)
	{
		if(!updateAddress && addrArr[0].state_txt0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	}
	*/
	if(!updateAddress && addrArr[0].state_txt0 != record.getFieldValue("shipstate"))
			updateAddress = true;
	nlapiLogExecution("Debug","Update Address",updateAddress);
	/* End: Added by Nikhil on October 18, 2018 for NS-1363 */
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.addRecord('transaction', record);
    renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("debug","matched wedding band before email send");
    // nlapiLogExecution("Debug","Email Preview Content for Matched & Wedding Band",renderBody);
    // emailPreviewContent.setDefaultValue(renderBody);
	/* Start: Added by Nikhil on October 18, 2018 for NS-1363 */
	if(updateAddress)
	{
		nlapiLogExecution("Debug","Email Preview Content for Matched & Wedding Band",renderBody);
		if(renderBody && renderBody != '' && renderBody != null && renderBody  != 'undefined')
		{
			var temp1 = '<strong>Shipping Address</strong><br />\r\n<br />\r\n<span style="background-color: rgb(255, 255, 255);">';
			var temp2 = '</span><br />\r\n<br />\r\n<span style="background-color: rgb(255, 255, 255);">Your complimentary shipping label is attached to this email, and we have included return shipping instructions below.'
			var a = renderBody.split(temp1);
			var b = a[1].split(temp2);
			var str = '' + addrArr[0].addressee0 + '<br />' + addrArr[0].address_10 + '<br />' + addrArr[0].address_20 + '<br />' + addrArr[0].city0 + ' ' + addrArr[0].state_txt0 + ' ' + addrArr[0].zipcode0 + '<br />' + addrArr[0].country0;
			var newBody = a[0] + temp1 + str + temp2 + b[1];
			nlapiLogExecution("Debug","Email Preview Content for Matched & Wedding Band",newBody);
			emailPreviewContent.setDefaultValue(newBody);
		}
	}
	else
	{
		nlapiLogExecution("Debug","Email Preview Content for Matched & Wedding Band",renderBody);
		emailPreviewContent.setDefaultValue(renderBody);
	}
	/* End: Added by Nikhil on October 18, 2018 for NS-1363 */
  }else if(chkNewEmailTemplate == true)
  {
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailBody = emailTemp.getFieldValue('content');
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("Debug","Email Preview Content for Matched & Wedding Band",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
  }
}
function emailPreviewForEngraveSetUpgrade(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate)
{
  if(chkNewEmailTemplate == false)
  {
    var custId= nlapiLookupField('salesorder',orderId,'entity');
    nlapiLogExecution("debug","customer id",custId);
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailSubj = emailTemp.getFieldValue('subject');
    var emailBody = emailTemp.getFieldValue('content');
    var record = nlapiLoadRecord('salesorder', orderId);
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.addRecord('transaction', record);
    renderer.addRecord('entity', nlapiLoadRecord('customer', custId)); 
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("Debug","Email Preview Content for Engrave,Set & Upgrade",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
  }
  else if(chkNewEmailTemplate == true)
  {
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailBody = emailTemp.getFieldValue('content');
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("Debug","Email Preview Content for  Engrave,Set & Upgrade",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
  }
}