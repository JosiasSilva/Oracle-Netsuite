function editEmailTemplate(orderId,emailType)
{
  if(emailType =="repair")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

    var editEmailTemplateUrl = nlapiResolveURL('SUITELET', 'customscript_edit_email_template_suitele', 'customdeploy_edit_email_template_suitele');
    editEmailTemplateUrl += '&orderId='+orderId+'&emailType='+emailType ;
    return  "window.open('"+editEmailTemplateUrl+"','','width=950,height=620,left=200')";
  }
  else if(emailType =="resize")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

    var editEmailTemplateUrl = nlapiResolveURL('SUITELET', 'customscript_edit_email_template_suitele', 'customdeploy_edit_email_template_suitele');
    editEmailTemplateUrl += '&orderId='+orderId+'&emailType='+emailType ;
    return  "window.open('"+editEmailTemplateUrl+"','','width=950,height=620,left=200')";
  }
  else if(emailType =="exchange")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

     var editEmailTemplateUrl = nlapiResolveURL('SUITELET', 'customscript_edit_email_template_suitele', 'customdeploy_edit_email_template_suitele');
    editEmailTemplateUrl += '&orderId='+orderId+'&emailType='+emailType ;
    return  "window.open('"+editEmailTemplateUrl+"','','width=950,height=620,left=200')";
  }
  else if(emailType =="matchedweddingband")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

    var editEmailTemplateUrl = nlapiResolveURL('SUITELET', 'customscript_edit_email_template_suitele', 'customdeploy_edit_email_template_suitele');
    editEmailTemplateUrl += '&orderId='+orderId+'&emailType='+emailType ;
    return  "window.open('"+editEmailTemplateUrl+"','','width=950,height=620,left=200')";
  }
  else if(emailType =="engrave" || emailType=="set" || emailType=="upgrade")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

     var editEmailTemplateUrl = nlapiResolveURL('SUITELET', 'customscript_edit_email_template_suitele', 'customdeploy_edit_email_template_suitele');
    editEmailTemplateUrl += '&orderId='+orderId+'&emailType='+emailType ;
    return  "window.open('"+editEmailTemplateUrl+"','','width=950,height=620,left=200')";
  }

}
