nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Repair_Fld_Changed_Fun_Edit_Template(type,name)
{
  var orderId = nlapiGetFieldValue('custpage_order_id');
  var soObj = nlapiLookupField('salesorder',orderId,['entity','tranid','shipaddress']);
  var custId = soObj.entity;
  var tranid = soObj.tranid;
  var shipaddress = soObj.shipaddress;
  shipaddress = shipaddress.replace(/\r\n/g,"<br/>");
  shipaddress = shipaddress.replace(/\n/g,"<br/>");
  var firstname =  nlapiLookupField('customer', custId,'firstname');
  //var loadConfigObj = nlapiLoadConfiguration('userpreferences');
  //var message_sig =  loadConfigObj.getFieldValue('MESSAGE_SIGNATURE');
  if(name =="custpage_type_of_email_template")
  {
    if(nlapiGetFieldValue('custpage_type_of_email_template')=='1')//Return '15 - Instructions for Resize (US) =========== Template Id :405
    {
      var emailTempId = 405; // internal id of the email template
      var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
      var emailBody = emailTemp.getFieldValue('content');
      //emailBody = emailBody.replace("${transaction.tranId}",tranid);
      //<#if (entity.firstName)?has_content>${entity.firstName}<#else>${company.firstName}</#if>
      emailBody = emailBody.replace("${entity.firstName}",firstname);
      emailBody = emailBody.replace("<#if (entity.firstName)?has_content>${entity.firstName}<#else>${company.firstName}</#if>",firstname);
      emailBody = emailBody.replace("<#--FM:BEGIN-->",'');
      emailBody = emailBody.replace("<#--FM:END-->",'');
      emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
      emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
      nlapiSetFieldValue("custpage_email_body",emailBody);
    }
    else if(nlapiGetFieldValue('custpage_type_of_email_template')=='2')//Return '15 - Instructions for Repair (US) ========= Template Id :641
    {
      var emailTempId = 641; // internal id of the email template
      var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
      var emailBody = emailTemp.getFieldValue('content');
      //emailBody = emailBody.replace("${transaction.tranId}",tranid);
      emailBody = emailBody.replace("${customer.firstName}",firstname);
      emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
      emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
      nlapiSetFieldValue("custpage_email_body",emailBody);
    }
    else if(nlapiGetFieldValue('custpage_type_of_email_template')=='3')//Return - Instructions for Exchange (US) ========== Template Id :397
    {
      var emailTempId = 397; // internal id of the email template
      var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
      var emailBody = emailTemp.getFieldValue('content'); 
      //emailBody = emailBody.replace("${transaction.tranId}",tranid);
      emailBody = emailBody.replace("${transaction.entity.firstname}",firstname);
      emailBody = emailBody.replace("<#if (entity.firstName)?has_content>${entity.firstName}<#else>${company.firstName}</#if>",firstname);
      emailBody = emailBody.replace("<#--FM:BEGIN-->",'');
      emailBody = emailBody.replace("<#--FM:END-->",'');
      emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
      emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
      nlapiSetFieldValue("custpage_email_body",emailBody);
    }
    else if(nlapiGetFieldValue('custpage_type_of_email_template')=='4')//Return '15 - Instructions for General Return (US) ====== Template Id :399
    {
      var emailTempId = 399; // internal id of the email template
      var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
      var emailBody = emailTemp.getFieldValue('content');
      // emailBody = emailBody.replace("${transaction.tranId}",tranid);
      emailBody = emailBody.replace("${transaction.entity.firstname}",firstname);
      emailBody = emailBody.replace("<#if (entity.firstName)?has_content>${entity.firstName}<#else>${company.firstName}</#if>",firstname);
      emailBody = emailBody.replace("<#--FM:BEGIN-->",'');
      emailBody = emailBody.replace("<#--FM:END-->",'');
      emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
      emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
      nlapiSetFieldValue("custpage_email_body",emailBody);
    }
    else if(nlapiGetFieldValue('custpage_type_of_email_template')=='5')//Return '15 - Instructions for Shadow Band (US) ======== Template Id :407
    {
      var emailTempId = 407; // internal id of the email template
      var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId);
      var emailBody = emailTemp.getFieldValue('content');
      //emailBody = emailBody.replace("${transaction.tranId}",tranid);
      emailBody = emailBody.replace("${customer.firstName}",firstname);
      emailBody = emailBody.replace("<#if (entity.firstName)?has_content>${entity.firstName}<#else>${company.firstName}</#if>",firstname);
      emailBody = emailBody.replace("<#--FM:BEGIN-->",'');
      emailBody = emailBody.replace("<#--FM:END-->",'');
      emailBody = emailBody.replace("${transaction.shipAddress}",shipaddress);
      emailBody = emailBody.replace("${preferences.MESSAGE_SIGNATURE}","");
      nlapiSetFieldValue("custpage_email_body",emailBody);
    }
  }
}