function emailPreview(orderId,emailType)
{
  if(emailType =="repair")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

    var emailPreviewUrl = nlapiResolveURL('SUITELET', 'customscript_email_preview', 'customdeploy_email_preview');
    emailPreviewUrl += '&orderId='+orderId+'&emailType='+emailType ;
    return  "window.open('"+emailPreviewUrl+"','','width=950,height=620,left=200')";
  }
  else if(emailType =="resize")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

    var emailPreviewUrl = nlapiResolveURL('SUITELET', 'customscript_email_preview', 'customdeploy_email_preview');
    emailPreviewUrl += '&orderId='+orderId+'&emailType='+emailType ;
    return  "window.open('"+emailPreviewUrl+"','','width=950,height=620,left=200')";
  }
  else if(emailType =="exchange")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

    var emailPreviewUrl = nlapiResolveURL('SUITELET', 'customscript_email_preview', 'customdeploy_email_preview');
    emailPreviewUrl += '&orderId='+orderId+'&emailType='+emailType ;
    return  "window.open('"+emailPreviewUrl+"','','width=950,height=620,left=200')";
  }
  else if(emailType =="matchedweddingband")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

    var emailPreviewUrl = nlapiResolveURL('SUITELET', 'customscript_email_preview', 'customdeploy_email_preview');

    emailPreviewUrl += '&orderId='+orderId+'&emailType='+emailType;
    return  "window.open('"+emailPreviewUrl+"','','width=950,height=620,left=200')";
  }
  else if(emailType =="engrave" || emailType=="set" || emailType=="upgrade")
  {
    nlapiLogExecution("Debug","Information","Order Id :"+orderId);
    nlapiLogExecution("Debug","Information","Email Type :"+emailType);

    var emailPreviewUrl = nlapiResolveURL('SUITELET', 'customscript_email_preview', 'customdeploy_email_preview');

    emailPreviewUrl += '&orderId='+orderId+'&emailType='+emailType;
    return  "window.open('"+emailPreviewUrl+"','','width=950,height=620,left=200')";
  }

}
