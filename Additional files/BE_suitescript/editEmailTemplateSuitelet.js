nlapiLogExecution("audit","FLOStart",new Date().getTime());
function editEmailTemplate(request,response)
{
  try
  {
    var copyEmailTemplateId = null;
    var form = nlapiCreateForm('Edit Email Template',true);
    form.addSubmitButton('Save');
    form.setScript('customscript_edit_email_template');
    form.addButton('custpage_edit_template_close', 'Close', "window.close();" );
    form.addField("custpage_type_of_email_template","select","Type Of Email Template",'customlist_type_of_email_template');
    var orderId = request.getParameter('orderId');
    nlapiLogExecution('debug','Order Id:',orderId);
    form.addField("custpage_order_id","text","Sale Order").setDisplayType('hidden').setDefaultValue(orderId);
    var emailType = request.getParameter('emailType');
    nlapiLogExecution('debug','Email Type:',emailType);
    nlapiLogExecution('debug','Method Type():',request.getMethod());
    form.addField("custpage_edit_email_template_order_id","text","").setDisplayType('hidden').setDefaultValue(orderId);
    form.addField("custpage_edit_email_template_email_type","text","").setDisplayType('hidden').setDefaultValue(emailType);
    var editEmailTemplateContent =  form.addField('custpage_email_body','richtext','').setRichTextWidth(800).setRichTextHeight(600).setLayoutType("outsidebelow","startrow").setPadding(2);
    // var editEmailTemplateContentCopy =  form.addField('custpage_email_body_copy','richtext','').setDisplayType('hidden');
    var newEmailTemplateId = loadNewEmailTemplate();
    nlapiLogExecution('debug','new Template Id:',newEmailTemplateId);
    if(request.getMethod() == 'GET')
    {
      var soObj = nlapiLookupField('salesorder',orderId,['entity','tranid','shipaddress']);
      var custId = soObj.entity;
      var tranid = soObj.tranid;
      var shipaddress = soObj.shipaddress;
      shipaddress = shipaddress.replace(/\r\n/g,"<br/>");
      shipaddress = shipaddress.replace(/\n/g,"<br/>");
      var firstname =  nlapiLookupField('customer', custId,'firstname');
      if(newEmailTemplateId =='0')
      {
        if(emailType =="resize")
        {
          var emailTempId = 405; // internal id of the email template
          var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
          var emailBody = emailTemp.getFieldValue('content');
          //emailBody = emailBody.replace("${transaction.tranId}",tranid);
          emailBody = emailBody.replace("${entity.firstName}",firstname);
          emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
          emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
          editEmailTemplateContent.setDefaultValue(emailBody);
        }
        else if(emailType =="repair")
        {
          var emailTempId = 641; // internal id of the email template
          var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
          var emailBody = emailTemp.getFieldValue('content');
          //emailBody = emailBody.replace("${transaction.tranId}",tranid);
          emailBody = emailBody.replace("${customer.firstName}",firstname);
          emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
          emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
          editEmailTemplateContent.setDefaultValue(emailBody);
        }
        else if(emailType =="exchange")
        {
          var emailTempId = 397; // internal id of the email template
          var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
          var emailBody = emailTemp.getFieldValue('content');
          //emailBody = emailBody.replace("${transaction.tranId}",tranid);
          emailBody = emailBody.replace("${transaction.entity.firstname}",firstname);
          emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
          emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
          editEmailTemplateContent.setDefaultValue(emailBody);
        }
        else if(emailType =="matchedweddingband")
        {
          var emailTempId = 407; // internal id of the email template
          var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
          var emailBody = emailTemp.getFieldValue('content');
          //emailBody = emailBody.replace("${transaction.tranId}",tranid);
          emailBody = emailBody.replace("${customer.firstName}",firstname);
          emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
          emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
          editEmailTemplateContent.setDefaultValue(emailBody);
        }
        else if(emailType =="engrave" || emailType=="set" || emailType=="upgrade")
        {
          var emailTempId = 399; // internal id of the email template
          var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
          var emailBody = emailTemp.getFieldValue('content');
          //emailBody = emailBody.replace("${transaction.tranId}",tranid);
          emailBody = emailBody.replace("${transaction.entity.firstname}",firstname);
          emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
          emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
          editEmailTemplateContent.setDefaultValue(emailBody);
        }
      }else
      {
        if(emailType =="resize")
        {
          var emailTemp = nlapiLoadRecord('emailtemplate',newEmailTemplateId); 
          var emailBody = emailTemp.getFieldValue('content');
          var renderer = nlapiCreateTemplateRenderer();  
          renderer.setTemplate(emailBody);
          var  renderBody = renderer.renderToString();
          nlapiLogExecution("Debug","Edit Email Template Content for Resize",renderBody);
          editEmailTemplateContent.setDefaultValue(renderBody);
        }
        else if(emailType =="repair")
        {
          var emailTemp = nlapiLoadRecord('emailtemplate',newEmailTemplateId); 
          var emailBody = emailTemp.getFieldValue('content');
          var renderer = nlapiCreateTemplateRenderer();  
          renderer.setTemplate(emailBody);
          var  renderBody = renderer.renderToString();
          nlapiLogExecution("Debug","Edit Email Template Content for Repair",renderBody);
          editEmailTemplateContent.setDefaultValue(renderBody);
        }
        else if(emailType =="exchange")
        {
          var emailTemp = nlapiLoadRecord('emailtemplate',newEmailTemplateId); 
          var emailBody = emailTemp.getFieldValue('content');
          var renderer = nlapiCreateTemplateRenderer();  
          renderer.setTemplate(emailBody);
          var  renderBody = renderer.renderToString();
          nlapiLogExecution("Debug","Edit Email Template Content for Exchange",renderBody);
          editEmailTemplateContent.setDefaultValue(renderBody);
        }
        else if(emailType =="matchedweddingband")
        {
          var emailTemp = nlapiLoadRecord('emailtemplate',newEmailTemplateId); 
          var emailBody = emailTemp.getFieldValue('content');
          var renderer = nlapiCreateTemplateRenderer();  
          renderer.setTemplate(emailBody);
          var  renderBody = renderer.renderToString();
          nlapiLogExecution("Debug","Edit Email Template Content for Matched & Wedding Band",renderBody);
          editEmailTemplateContent.setDefaultValue(renderBody);
        }
        else if(emailType =="engrave" || emailType=="set" || emailType=="upgrade")
        {
          var emailTemp = nlapiLoadRecord('emailtemplate',newEmailTemplateId); 
          var emailBody = emailTemp.getFieldValue('content');
          var renderer = nlapiCreateTemplateRenderer();  
          renderer.setTemplate(emailBody);
          var  renderBody = renderer.renderToString();
          nlapiLogExecution("Debug","Edit Email Template Content for Engrave,Set & Upgrade",renderBody);
          editEmailTemplateContent.setDefaultValue(renderBody);
        }
      }
      response.writePage(form);
    }  
    else if(request.getMethod() == 'POST')
    { 
      var orderId = request.getParameter('custpage_edit_email_template_order_id');
      nlapiLogExecution('debug','[POST Method]Edit Email Template Order Id :',orderId);

      var emailType = request.getParameter('custpage_edit_email_template_email_type');
      nlapiLogExecution('debug','[POST Method]Edit Email Template Email Type:',emailType);
      if(emailType =="resize")
      {
        var templateContent = request.getParameter('custpage_email_body');
        nlapiLogExecution('debug','[POST Method] Template Content for Resize:',templateContent);
        var emailTempId = 405; // internal id of the email template
        copyEmailTemplateId = createCopyOriginalEmailTemplate(emailTempId,templateContent);
        nlapiLogExecution('debug','[POST Method] Copy Email Template Id for Resize:',copyEmailTemplateId);
      }
      else if(emailType =="repair")
      {
        var templateContent = request.getParameter('custpage_email_body');
        nlapiLogExecution('debug','[POST Method] Template Content for Repair:',templateContent);
        var emailTempId = 641; // internal id of the email template
        copyEmailTemplateId = createCopyOriginalEmailTemplate(emailTempId,templateContent);
        nlapiLogExecution('debug','[POST Method] Copy Email Template Id for Repair:',copyEmailTemplateId);
      }
      else if(emailType =="exchange")
      {
        var templateContent = request.getParameter('custpage_email_body');
        nlapiLogExecution('debug','[POST Method] Template Content for Exchange:',templateContent);
        var emailTempId = 397; // internal id of the email template
        copyEmailTemplateId = createCopyOriginalEmailTemplate(emailTempId,templateContent);
        nlapiLogExecution('debug','[POST Method] Copy Email Template Id for Exchange:',copyEmailTemplateId);
      }
      else if(emailType =="matchedweddingband")
      {
        var templateContent = request.getParameter('custpage_email_body');
        nlapiLogExecution('debug','[POST Method] Template Content for Matched & Wedding Band:',templateContent);
        var emailTempId = 407; // internal id of the email template
        copyEmailTemplateId = createCopyOriginalEmailTemplate(emailTempId,templateContent);
        nlapiLogExecution('debug','[POST Method] Copy Email Template Id for Matched & Wedding Band:',copyEmailTemplateId);
      }
      else if(emailType =="engrave" || emailType=="set" || emailType=="upgrade")
      {
        var templateContent = request.getParameter('custpage_email_body');
        nlapiLogExecution('debug','[POST Method] Template Content for Engrave,Set & Upgrade:',templateContent);
        var emailTempId = 399; // internal id of the email template having email type (engrave , set , upgrade)
        copyEmailTemplateId = createCopyOriginalEmailTemplate(emailTempId,templateContent);
        nlapiLogExecution('debug','[POST Method] Copy Email Template Id for Engrave | Set | Upgrade:',copyEmailTemplateId);
      }
      form.addField("custpage_edit_template_window_close","inlinehtml").setDefaultValue('<script type="text/javascript"> if (window.opener != null && !window.opener.closed){var   copy_Email_Template_Id = window.opener.document.getElementById("custpage_copy_email_template_id");copy_Email_Template_Id.value ='+copyEmailTemplateId+'} window.close();</script>');
      response.writePage(form);
    }
  }
  catch(ex)
  {
    nlapiLogExecution('debug','Error',ex.message);
  }
}

