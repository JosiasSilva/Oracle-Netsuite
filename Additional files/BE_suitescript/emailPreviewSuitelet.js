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
  var chkNewEmailTemplate = null;
  if(emailType =="resize")
  {
    if(newEmailTemplateId == '0')
    {
      emailTempId = 405;
      chkNewEmailTemplate = false;
      emailPreviewForResize(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForResize(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
  }
  else if(emailType =="repair")
  {
    if(newEmailTemplateId == '0')
    {
      emailTempId = 641;
      chkNewEmailTemplate = false;
      emailPreviewForRepair(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForRepair(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
  }
  else if(emailType =="exchange")
  {
    if(newEmailTemplateId =='0')
    {
      emailTempId = 397;
      chkNewEmailTemplate = false;
      emailPreviewForExchange(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForExchange(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
  }
  else if(emailType =="matchedweddingband")
  {
    if(newEmailTemplateId =='0')
    {
      emailTempId = 407;
      chkNewEmailTemplate = false;
      emailPreviewForMatchedWeddingBand(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
    }
    else
    {
      emailTempId = newEmailTemplateId;
      chkNewEmailTemplate = true;
      emailPreviewForMatchedWeddingBand(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate);
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
function emailPreviewForRepair(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate)
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
    renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("Debug","Email Preview Content for Repair",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
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
function emailPreviewForResize(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate)
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
    nlapiLogExecution("Debug","Email Preview Content for Resize",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
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
function emailPreviewForExchange(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate)
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
    renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("Debug","Email Preview Content for Exchange",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
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
function emailPreviewForMatchedWeddingBand(orderId,emailTempId,emailPreviewContent,chkNewEmailTemplate)
{
  if(chkNewEmailTemplate== false)
  {
    var custId= nlapiLookupField('salesorder',orderId,'entity');
    nlapiLogExecution("debug","customer id",custId);
    var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
    var emailSubj = emailTemp.getFieldValue('subject');
    var emailBody = emailTemp.getFieldValue('content');
    var record = nlapiLoadRecord('salesorder', orderId);
    var renderer = nlapiCreateTemplateRenderer();  
    renderer.addRecord('transaction', record);
    renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
    renderer.setTemplate(emailBody);
    var  renderBody = renderer.renderToString();
    nlapiLogExecution("debug","matched wedding band before email send");
    nlapiLogExecution("Debug","Email Preview Content for Matched & Wedding Band",renderBody);
    emailPreviewContent.setDefaultValue(renderBody);
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