nlapiLogExecution("audit","FLOStart",new Date().getTime());
function process(email)
{
  try
  {
    var fromAddress = email.getFrom();
    var fromEmail = fromAddress.getEmail();
    nlapiLogExecution("DEBUG","From Email",fromEmail);
    var fromName = fromAddress.getName();
    nlapiLogExecution("DEBUG","From Name",fromName);
    var attachments = email.getAttachments();
    var sentDateTime = email.getSentDate();
    nlapiLogExecution("DEBUG","Sent Date & Time with PDT",sentDateTime);
    var d = new Date(sentDateTime);
    nlapiLogExecution("DEBUG","Sent Date & Time with PDT 2",d);
    var lastemaildatetime = nlapiDateToString(d,'datetime');
    nlapiLogExecution("DEBUG","Sent Date & Time ",lastemaildatetime);
    lastemaildatetime = lastemaildatetime.split(' ');
    lastemaildatetime = lastemaildatetime[0]+' '+lastemaildatetime[1]+':00'+' '+lastemaildatetime[2];
    nlapiLogExecution("DEBUG","Sent Date & Time Time Zone ",lastemaildatetime);
    var lastemaildate = nlapiDateToString(d,'date');
    nlapiLogExecution("DEBUG","Sent Date",lastemaildate);
    var toAddress = email.getTo();
    for(var k=0; k < toAddress.length; k++)
    {
      nlapiLogExecution("DEBUG", "To Email Address(s) Result", "To Address #"+(k+1)+" : "+toAddress[k].getEmail());
    }
    var subject = email.getSubject();
    nlapiLogExecution("DEBUG","Subject",subject);
    var textBody = email.getTextBody();
    nlapiLogExecution("DEBUG","Text Body",textBody);
    var htmlBody = email.getHtmlBody();
    nlapiLogExecution("DEBUG","Html Body",htmlBody);
    var ccEmails = [];
    var ccAddress = email.getCc();
    var toEmails = [];//Primary RECIPIENT
    var filters = [];
    var attachmentsFile =[];
    var toInfo = false;
    var toSupport = false;
    for(var x=0; x < toAddress.length; x++)
    {
      if(toAddress[x].getEmail()=="info@brilliantearth.com")
      {
        toInfo = true;
        toEmails.push(toAddress[x].getEmail());
      }
      else if(toAddress[x].getEmail()=="support@brilliantearth.com")
      {
        toSupport = true;
        toEmails.push(toAddress[x].getEmail());
      }
    }
    if(toEmails.length>0)
      nlapiLogExecution("DEBUG","To Emails(Primary recipient)",toEmails);

    nlapiLogExecution("DEBUG","To Info",toInfo);
    nlapiLogExecution("DEBUG","To Support",toSupport);

    if(toInfo==true || toSupport==true)
    {
      filters.push(new nlobjSearchFilter("email",null,"is",fromEmail));
      filters.push(new nlobjSearchFilter("isinactive",null,"is",'F'));
      var results = nlapiSearchRecord("customer",null,filters,null);
      if(results)
      {
        try
        {
          var custId = results[0].getId();
          nlapiLogExecution("DEBUG","Customer/Lead Id",custId);
          var  subjectheader ='';
          if(attachments.length > 0)
            subjectheader = subject + " (See Message Tab for attachment)";
          else
            subjectheader = subject;
          //Account for 4,000 character limit in the field custbody2
          if(textBody!=null && textBody!="")
          {
            if(textBody.length > 4000)
            {
              textBody = textBody.substring(0,3900);
            }
          }
          var email_body_content='';
          if(textBody!='' && textBody!=null)
            email_body_content = textBody;
          else
            email_body_content = htmlBody;

          fileAttachments(attachments,attachmentsFile);
          attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,custId,textBody);
          nlapiSubmitField('customer',custId,["custentity1","custentity2","custentity_last_email_from","custentity_last_email_date_time","custentity_last_email_date","custentity_last_customer_email_body"],[subjectheader,textBody,'2',lastemaildatetime,lastemaildate,email_body_content]);

          nlapiLogExecution("Debug","Information","In existing Lead email has been synced successfully and mark external sync field");
        }
        catch(ex)
        {
          nlapiLogExecution("DEBUG","Error occur in existing Lead from Email","Details: " + ex.message);
        }
      }
      else
      {
        try
        {
          //Create custom record for logging
          var cr = nlapiCreateRecord("customrecord_incoming_email_log");
          cr.setFieldValue("custrecord_incoming_email_from_name",fromName);
          cr.setFieldValue("custrecord_incoming_email_from_email",fromEmail);
          cr.setFieldValue("custrecord_incoming_email_subject",subject);
          cr.setFieldValue("custrecord_incoming_email_body",textBody);
          cr.setFieldValue("custrecord_to_emails_raw",toEmails.join(","));
          //cr.setFieldValue("custrecord_cc_emails_raw",ccEmails.join(","));
          if(toInfo==true)
            cr.setFieldValue("custrecord_incoming_email_to_email","info@brilliantearth.com");
          else if(toSupport==true)
            cr.setFieldValue("custrecord_incoming_email_to_email","support@brilliantearth.com");
          var crID = nlapiSubmitRecord(cr,true,true);
          //Parse first name and last name
          var firstname = null;
          var lastname = null;
          if(fromName!=null && fromName!="" && fromName.indexOf(" ")!=-1)
          {
            firstname = fromName.substring(0,fromName.indexOf(" "));
            lastname = fromName.substring(fromName.indexOf(" ")+1);
          }
          else
          {
            firstname = fromName;
            if(firstname==null || firstname=="")
            {
              if(toInfo==true)
                firstname = "info@";
              else if(toSupport==true)
                firstname = "support@";
            }
            if(toInfo==true)
              lastname = "info@";
            else if(toSupport==true)
              lastname = "support@";
          }
          var lead = nlapiCreateRecord("lead");
          lead.setFieldValue("firstname",firstname);
          lead.setFieldValue("lastname",lastname);
          lead.setFieldValue("email",fromEmail);
          if(attachments.length > 0)
            lead.setFieldValue("custentity1",subject + " (See Message Tab for attachment)");
          else
            lead.setFieldValue("custentity1",subject);
          //Account for 4,000 character limit in the field custbody2
          if(textBody!=null && textBody!="")
          {
            if(textBody.length > 4000)
            {
              textBody = textBody.substring(0,3900);
            }
          }
          lead.setFieldValue("custentity2",textBody);
          lead.setFieldValue("custentity_last_email_from",'2');
          lead.setFieldValue("custentity_last_email_date_time",lastemaildatetime);
          lead.setFieldValue("custentity_last_email_date",lastemaildate);
          lead.setFieldValue('custentity_celigo_subs_to_newsletter','F');//SUBSCRIBE TO NEWSLETTER
          if(textBody!='' && textBody!=null)
            lead.setFieldValue('custentity_last_customer_email_body',textBody);
          else
            lead.setFieldValue('custentity_last_customer_email_body',htmlBody);
          var leadID = nlapiSubmitRecord(lead,true,true);
          nlapiLogExecution("DEBUG","New Lead Information","New Lead Id ::" + leadID);
          fileAttachments(attachments,attachmentsFile);
          /* attachEmailToMesssage function used for sync email into the customer or lead page within message*/
          attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,leadID,textBody);
          nlapiSubmitField("customrecord_incoming_email_log",crID,"custrecord_incoming_email_lead_record",leadID);

          nlapiLogExecution("DEBUG","Information","Lead has been created successfully with syncs email into Customer/Lead and mark external sync field");
        }
        catch(ex)
        {
          nlapiLogExecution("DEBUG","Error Creating new Lead from Email","Details: " + ex.message);
        }
      }
    }
  }
  catch(err)
  {
    nlapiLogExecution("DEBUG","Error" + err.message);
  }
}




