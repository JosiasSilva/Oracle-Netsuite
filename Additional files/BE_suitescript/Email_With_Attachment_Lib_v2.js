function sendEmailWithAttachment(fileid,ccemail,soid,toEmail,emailtype,copyEmailTemplateInternalId)
{
  var emailTempId =null;
  nlapiLogExecution("Debug","Email Type[With Attachment]" ,emailtype);
  var cxtObj = nlapiGetContext() ;
  var userId = cxtObj.getUser();
  nlapiLogExecution("Debug","User Id" ,userId);
  var userEmail = cxtObj.getEmail();
  nlapiLogExecution("Debug","User Email" ,userEmail);
  if(emailtype =="resize")
  {
    if(copyEmailTemplateInternalId == '0')
    {
      emailTempId = 405;
      sendEmailWithAttachmentForResize(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
    }
    else
    {
      emailTempId = copyEmailTemplateInternalId;
      sendEmailWithAttachmentForResize(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
      deleteCopyEmailTemplate(copyEmailTemplateInternalId);
    }
  }
  else if(emailtype =="repair")
  {
    if(copyEmailTemplateInternalId=='0')
    {
      emailTempId = 641;
      sendEmailWithAttachmentForRepair(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
    }else
    {
      emailTempId = copyEmailTemplateInternalId;
      sendEmailWithAttachmentForRepair(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
      deleteCopyEmailTemplate(copyEmailTemplateInternalId);
    }
  }
  else if(emailtype =="exchange")
  {
    if(copyEmailTemplateInternalId== '0')
    {
      emailTempId = 397;
      sendEmailWithAttachmentForExchange(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
    }else
    {
      emailTempId = copyEmailTemplateInternalId;
      sendEmailWithAttachmentForExchange(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
      deleteCopyEmailTemplate(copyEmailTemplateInternalId);
    }
  }
  else if(emailtype =="matchedweddingband")
  {
    if(copyEmailTemplateInternalId=='0')
    {
      emailTempId = 407;
      sendEmailWithAttachmentForMatchedWeddingBand(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
    }else
    {
      emailTempId = copyEmailTemplateInternalId;
      sendEmailWithAttachmentForMatchedWeddingBand(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
      deleteCopyEmailTemplate(copyEmailTemplateInternalId);
    }
  }
  else if(emailtype =="engrave" || emailtype=="set" || emailtype=="upgrade")
  {
    if(copyEmailTemplateInternalId=='0')
    {
      emailTempId = 399;
      sendEmailWithAttachmentForEngraveSetUpgrade(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
    }else
    {
      emailTempId = copyEmailTemplateInternalId;
      sendEmailWithAttachmentForEngraveSetUpgrade(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail);
      deleteCopyEmailTemplate(copyEmailTemplateInternalId);
    }
  }
}
function  sendEmailWithAttachmentForResize(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail)
{
  nlapiLogExecution("Debug","Email So Id for Resize",soid);
  var custId= nlapiLookupField('salesorder',soid,'entity');
  nlapiLogExecution("Debug","Customer id for Resize",custId);
  nlapiLogExecution("Debug","File Id for Resize",fileid);
  nlapiLogExecution("Debug","Cc email for Resize",ccemail);
  nlapiLogExecution("Debug","To email for Resize",toEmail);
  var attachFile = nlapiLoadFile(fileid);
  var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
  var emailSubj = emailTemp.getFieldValue('subject');
  var emailBody = emailTemp.getFieldValue('content');
  var record = nlapiLoadRecord('salesorder', soid);
  var renderer = nlapiCreateTemplateRenderer();  
  renderer.setTemplate(emailTemp); // set the template
  renderer.addRecord('transaction', record);
  renderer.addRecord('entity', nlapiLoadRecord('customer', custId)); 
  //var  records = renderer.renderToString();
  renderer.setTemplate(emailSubj);
  var  renderSubj = renderer.renderToString();
  renderer.setTemplate(emailBody);
  var  renderBody = renderer.renderToString();
  var rec = new Array();
  rec['transaction']= soid;
  nlapiSendEmail(userId, toEmail, renderSubj, renderBody , ccemail, true, rec,attachFile);
  nlapiLogExecution("Debug","Email Information (Resize)","Email(Resize) has been send successfully");
  //attachEmailOnSOMessageTab(userEmail,toEmail,renderSubj,renderBody,soid,fileid);
}
function sendEmailWithAttachmentForRepair(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail)
{
  nlapiLogExecution("debug","Email So Id for Repair",soid);
  var custId= nlapiLookupField('salesorder',soid,'entity');
  nlapiLogExecution("debug","Customer id for Repair",custId);
  nlapiLogExecution("debug","File Id for Repair",fileid);
  nlapiLogExecution("debug","Cc email for Repair",ccemail);
  nlapiLogExecution("debug","To email for Repair",toEmail);
  var attachFile = nlapiLoadFile(fileid);
  var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
  var emailSubj = emailTemp.getFieldValue('subject');
  var emailBody = emailTemp.getFieldValue('content');
  var record = nlapiLoadRecord('salesorder', soid);
  var renderer = nlapiCreateTemplateRenderer();  
  renderer.setTemplate(emailTemp); // set the template
  renderer.addRecord('transaction', record);
  renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
  // var  records = renderer.renderToString();
  renderer.setTemplate(emailSubj);
  var  renderSubj = renderer.renderToString();
  renderer.setTemplate(emailBody);
  var  renderBody = renderer.renderToString();
  var rec = new Array();
  rec['transaction']= soid;
  nlapiSendEmail(userId, toEmail, renderSubj, renderBody , ccemail, true, rec,attachFile);
  nlapiLogExecution("Debug","Email Information (Repair)","Email(Repair) has been send successfully");
  //attachEmailOnSOMessageTab(userEmail,toEmail,renderSubj,renderBody,soid,fileid);
}
function sendEmailWithAttachmentForExchange(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail)
{
  nlapiLogExecution("debug","Email So Id for Exchange",soid);
  var custId= nlapiLookupField('salesorder',soid,'entity');
  nlapiLogExecution("debug","Customer id for Exchange",custId);
  nlapiLogExecution("debug","File Id for Exchange",fileid);
  nlapiLogExecution("debug","Cc email for Exchange",ccemail);
  nlapiLogExecution("debug","To email for Exchange",toEmail);
  var attachFile = nlapiLoadFile(fileid);
  var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
  var emailSubj = emailTemp.getFieldValue('subject');
  var emailBody = emailTemp.getFieldValue('content');
  var record = nlapiLoadRecord('salesorder', soid);
  var renderer = nlapiCreateTemplateRenderer();  
  renderer.setTemplate(emailTemp); // set the template
  renderer.addRecord('transaction', record);
  renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
  //var  records = renderer.renderToString();
  renderer.setTemplate(emailSubj);
  var  renderSubj = renderer.renderToString();
  renderer.setTemplate(emailBody);
  var  renderBody = renderer.renderToString();
  var rec = new Array();
  rec['transaction']= soid;
  nlapiSendEmail(userId, toEmail, renderSubj, renderBody , ccemail, true, rec,attachFile);
  nlapiLogExecution("Debug","Email Information (Exchange)","Email(Exchange) has been send successfully");
  //attachEmailOnSOMessageTab(userEmail,toEmail,renderSubj,renderBody,soid,fileid);
}
function  sendEmailWithAttachmentForMatchedWeddingBand(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail)
{
  nlapiLogExecution("debug","Email So Id for matched & wedding band",soid);
  var custId= nlapiLookupField('salesorder',soid,'entity');
  nlapiLogExecution("debug","Customer id for MWB",custId);
  nlapiLogExecution("debug","File Id for MWB",fileid);
  nlapiLogExecution("debug","Cc email for MWB",ccemail);
  nlapiLogExecution("debug","To email for MWB",toEmail);
  var attachFile = nlapiLoadFile(fileid);
  var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
  var emailSubj = emailTemp.getFieldValue('subject');
  var emailBody = emailTemp.getFieldValue('content');
  var record = nlapiLoadRecord('salesorder', soid);
  var renderer = nlapiCreateTemplateRenderer();  
  renderer.setTemplate(emailTemp); // set the template
  renderer.addRecord('transaction', record);
  renderer.addRecord('customer', nlapiLoadRecord('customer', custId)); 
  //var  records = renderer.renderToString();
  renderer.setTemplate(emailSubj);
  var  renderSubj = renderer.renderToString();
  renderer.setTemplate(emailBody);
  var  renderBody = renderer.renderToString();
  var rec = new Array();
  rec['transaction']= soid;
  //nlapiLogExecution("debug","matched wedding band before email send");
  nlapiSendEmail(userId, toEmail, renderSubj, renderBody , ccemail, true, rec,attachFile);
  nlapiLogExecution("Debug","Email Information (Matched & Wedding Band)","Email(Matched & Wedding Band) has been send successfully");
  //attachEmailOnSOMessageTab(userEmail,toEmail,renderSubj,renderBody,soid,fileid);
}
function sendEmailWithAttachmentForEngraveSetUpgrade(soid,emailTempId,fileid,ccemail,toEmail,userId,userEmail)
{
  nlapiLogExecution("debug","Email So Id for engrave,set and upgrade",soid);
  var custId= nlapiLookupField('salesorder',soid,'entity');
  nlapiLogExecution("debug","Customer id for Engrave Set Upgrade",custId);
  nlapiLogExecution("debug","File Id for Engrave Set Upgrade",fileid);
  nlapiLogExecution("debug","Cc email for Engrave Set Upgrade",ccemail);
  nlapiLogExecution("debug","To email for Engrave Set Upgrade",toEmail);
  var attachFile = nlapiLoadFile(fileid);
  var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
  var emailSubj = emailTemp.getFieldValue('subject');
  var emailBody = emailTemp.getFieldValue('content');
  var record = nlapiLoadRecord('salesorder', soid);
  var renderer = nlapiCreateTemplateRenderer();  
  renderer.setTemplate(emailTemp); // set the template
  renderer.addRecord('transaction', record);
  renderer.addRecord('entity', nlapiLoadRecord('customer', custId)); 
  // var  records = renderer.renderToString();
  renderer.setTemplate(emailSubj);
  var  renderSubj = renderer.renderToString();
  renderer.setTemplate(emailBody);
  var  renderBody = renderer.renderToString();
  var rec = new Array();
  rec['transaction']= soid;
  nlapiSendEmail(userId,toEmail,renderSubj,renderBody,ccemail,true,rec,attachFile);
  nlapiLogExecution("Debug","Email Information (Engrave,Set,Upgrade)","Email(Engrave,Set,Upgrade) has been send successfully");
  //attachEmailOnSOMessageTab(userEmail,toEmail,renderSubj,renderBody,soid,fileid);
}
function  deleteCopyEmailTemplate(copyEmailTemplateInternalId)
{
  nlapiDeleteRecord("emailtemplate",copyEmailTemplateInternalId);
  nlapiSubmitField('customrecord_email_template_copy_record',1,"custrecord_internal_id",'0');
  nlapiLogExecution("Debug","Delete Copy Email Template","Copy email template has been deleted successfully.");
}