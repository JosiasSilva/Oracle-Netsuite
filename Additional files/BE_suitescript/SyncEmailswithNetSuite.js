nlapiLogExecution("audit","FLOStart",new Date().getTime());
function process(email)
{
  try
  {
    var fromAddress = email.getFrom();

    var fromEmail = fromAddress.getEmail();
    nlapiLogExecution("debug","From Email",fromEmail);

    var fromName = fromAddress.getName();
    nlapiLogExecution("debug","From Name",fromName);

    var attachments = email.getAttachments();
    nlapiLogExecution("debug","Attachments",attachments);

    var sentDateTime = email.getSentDate();
    nlapiLogExecution("debug","Sent Date & Time with PDT",sentDateTime);

    var d = new Date(sentDateTime);
    nlapiLogExecution("debug","Sent Date & Time with PDT 2",sentDateTime);

    var lastemaildatetime = nlapiDateToString(d,'datetime');
    nlapiLogExecution("debug","Sent Date & Time ",lastemaildatetime);

    var lastemaildate = nlapiDateToString(d,'date');
    nlapiLogExecution("debug","Sent Date",lastemaildate);

    var toAddress = email.getTo();
    nlapiLogExecution("debug","To Email",toAddress);

    var subject = email.getSubject();
    nlapiLogExecution("debug","Subject",subject);

    var textBody = email.getTextBody();
    nlapiLogExecution("debug","Text Body",textBody);

    var htmlBody = email.getHtmlBody();
    nlapiLogExecution("debug","Html Body",htmlBody);

    var tocs_terms = false;
    var tocss = false;
    var toEmails = [];
    var filters = [];
    var attachmentsFile =[];
    for(var x=0; x < toAddress.length; x++)
    {
      if(toAddress[x].getEmail()=="csterms@brilliantearth.com")
      {
        tocs_terms = true;
        toEmails.push(toAddress[x].getEmail());
      }
      else if(toAddress[x].getEmail()=="cssupport@brilliantearth.com")
      {
        tocss = true;
        toEmails.push(toAddress[x].getEmail());
      }
    }
    nlapiLogExecution("debug","To Emails",toEmails);
    nlapiLogExecution("debug","to cs-terms",tocs_terms);
    nlapiLogExecution("debug","to css",tocss);
    if(tocs_terms==true || tocss==true)
    {
      filters.push(new nlobjSearchFilter("email",null,"is",fromEmail));
      filters.push(new nlobjSearchFilter("isinactive",null,"is",'F'));
      var results = nlapiSearchRecord("customer",null,filters,null);
      if(results)
      {
        try
        {
          var custId = results[0].getId();
          nlapiLogExecution("Debug","Customer Id",custId);
          var  subjectheader ='';
          if(attachments.length > 0)
            subjectheader = subject + " (See Files Tab for attachment)";
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
          fileAttachments(attachments,attachmentsFile);
          attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,custId);
          nlapiSubmitField('customer',custId,["custentity1","custentity2","custentity_last_email_from","custentity_last_email_date_time","custentity_last_email_date"],[subjectheader,textBody,'2',lastemaildatetime,lastemaildate]);
        }
        catch(ex)
        {
          nlapiLogExecution("debug","Error occur in existing Lead from Email","Details: " + ex.message);
        }
      }
      else
      {
        try
        {
          var ccEmails = [];
          var ccAddress = email.getCc();
          for(var x=0; x < ccAddress.length; x++)
          {
            ccEmails.push(ccAddress[x].getEmail());
          }
          var validToEmail=['csterms@brilliantearth.com','cssupport@brilliantearth.com'];
          //Create custom record for logging
          var cr = nlapiCreateRecord("customrecord_incoming_email_log");
          cr.setFieldValue("custrecord_incoming_email_from_name",fromName);
          cr.setFieldValue("custrecord_incoming_email_from_email",fromEmail);
          cr.setFieldValue("custrecord_incoming_email_subject",subject);
          cr.setFieldValue("custrecord_incoming_email_body",textBody);
          cr.setFieldValue("custrecord_to_emails_raw",toEmails.join(","));
          cr.setFieldValue("custrecord_cc_emails_raw",ccEmails.join(","));
          if(tocs_terms==true)
            cr.setFieldValue("custrecord_incoming_email_to_email","csterms@brilliantearth.com");
          else if(tocss==true)
            cr.setFieldValue("custrecord_incoming_email_to_email","cssupport@brilliantearth.com");
          if(tocs_terms==true && tocss==true)
            cr.setFieldValue("custrecord_incoming_email_to_email",validToEmail.join(','));
          var crID = nlapiSubmitRecord(cr,true,true);
          //Parse first name and last name
          var firstname = null;
          var lastname = null;
          if(fromName!=null && fromName!="" && fromName.indexOf(" ")!=-1)
          {
            firstname = fromName.substring(0,fromName.indexOf(" "));
            lastname = fromName.substring(fromName.indexOf(" ")+1);
          }
          var lead = nlapiCreateRecord("lead");
          lead.setFieldValue("firstname",firstname);
          lead.setFieldValue("lastname",lastname);
          lead.setFieldValue("email",fromEmail);
          if(attachments.length > 0)
            lead.setFieldValue("custentity1",subject + " (See Files Tab for attachment)");
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
          var leadID = nlapiSubmitRecord(lead,true,true);
          nlapiLogExecution("Debug","Information","New Lead Id ::" + leadID);
          fileAttachments(attachments,attachmentsFile);
          /* attachEmailToMesssage function used for sync email into the customer or lead page within message*/
          attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,leadID);
          nlapiSubmitField("customrecord_incoming_email_log",crID,"custrecord_incoming_email_lead_record",leadID);
          nlapiLogExecution("Debug","Information","Lead has been created successfully with syncs email into Customer/Lead and mark external sync field");
        }
        catch(ex)
        {
          nlapiLogExecution("debug","Error Creating new Lead from Email","Details: " + ex.message);
        }
      }
    }
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error" + err.message);
  }
}




