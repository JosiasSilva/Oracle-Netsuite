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
    var subject = email.getSubject();
    nlapiLogExecution("DEBUG","Subject",subject);
    if(subject == '' || subject == null)
    {
      subject = ".";
      nlapiLogExecution("DEBUG","Subject line having blank or empty",subject);
    }
    var textBody = email.getTextBody();
    nlapiLogExecution("DEBUG","Text Body",textBody);
    //var htmlBody = email.getHtmlBody();
    //nlapiLogExecution("DEBUG","Html Body",htmlBody);
    try
    {
      var htmlBody = email.getHtmlBody();
      nlapiLogExecution("DEBUG","Html Body having not null value(Test 1)",htmlBody);
    }
    catch(ex)
    {
      // no need to add error log
      nlapiLogExecution("DEBUG","Html Body having null value(Test 2)",ex.message);
    }
    var ccEmails = [];
    var ccAddress = email.getCc();
    var tocs_terms = false;
    var tocss = false;
    var toEmails = [];//Primary RECIPIENT
    var toEmail = [];//LAST EMAIL RECIPIENT
    var filters = [];
    var attachmentsFile =[];
    var chk_toAddress = false;
    var to_cc_Emails = [];//not using
    //Inactive Sales Reps: Results (Saved Search) [NS-913]
    var searchresult = nlapiSearchRecord(null,5740,null,null);
    for(var x=0; x < toAddress.length; x++)
    {
      if(toAddress[x].getEmail()=="cssupport@brilliantearth.com")
      {
        tocss = true;
        chk_toAddress = true ;
        toEmails.push(toAddress[x].getEmail());
      }
      else
      {
        if(searchresult)
        {
          for(var rs=0;rs<searchresult.length;rs++)
          {
            var email =   searchresult[rs].getValue('email');
            if(email !='' && email != null)
            {
              if(toAddress[x].getEmail() == email)
              {
                tocs_terms = true;
                chk_toAddress = true ;
                toEmails.push(toAddress[x].getEmail());
                break;
              }
            }
          }
        }
      }
    }
    if(toEmails.length>0)
      nlapiLogExecution("DEBUG","To Emails(Primary recipient no Cc email)",toEmails);
    if(chk_toAddress == false)
    {
      for(var x=0; x < ccAddress.length; x++)
      {
        if(ccAddress[x].getEmail()=="cssupport@brilliantearth.com") 
        {
          tocss = true;
          ccEmails.push(ccAddress[x].getEmail());
        }
        else
        {
          if(searchresult)
          {
            for(var rs=0;rs<searchresult.length;rs++)
            {
              var email =   searchresult[rs].getValue('email');
              if(email !='' && email != null)
              {
                if(ccAddress[x].getEmail() == email)
                {
                  tocs_terms = true;
                  ccEmails.push(ccAddress[x].getEmail());
                  break;
                }
              }
            }
          }
        }
      }
      if(tocss==true || tocs_terms == true)
      {
        for(var x=0; x < toAddress.length; x++)
        { 
          toEmail.push(toAddress[x].getEmail());
          toEmails.push(toAddress[x].getEmail());
        }
        toEmail = toEmail.concat(ccEmails);
        toEmail =toEmail.join(',');
      }
      if(toEmail.length>0)
        nlapiLogExecution("DEBUG","Last Email RECIPIENT",toEmail);
      if(toEmails.length>0)
        nlapiLogExecution("DEBUG","Primary recipient having Cc email",toEmails);
      if(ccEmails.length>0)
        nlapiLogExecution("DEBUG","Cc Emails",ccEmails);
    }
    nlapiLogExecution("DEBUG","To adrress",chk_toAddress);
    nlapiLogExecution("DEBUG","To csterms",tocs_terms);
    nlapiLogExecution("DEBUG","To cssupport",tocss);
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
          fileAttachments(attachments,attachmentsFile);
          attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,custId,textBody);
          nlapiSubmitField('customer',custId,["custentity1","custentity2","custentity_last_email_from","custentity_last_email_date_time","custentity_last_email_date"],[subjectheader,textBody,'2',lastemaildatetime,lastemaildate]);
          if(toEmail.length>0)
          {
            nlapiSubmitField("customer",custId,"custentity_last_email_recipient",toEmail);
            nlapiLogExecution("DEBUG","Last Email Recipient(Existing Lead)","Last Email Recipient updated successfully");
          }
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
          cr.setFieldValue("custrecord_cc_emails_raw",ccEmails.join(","));
          if(tocs_terms==true)
            cr.setFieldValue("custrecord_incoming_email_to_email","csterms@brilliantearth.com");
          else if(tocss==true)
            cr.setFieldValue("custrecord_incoming_email_to_email","cssupport@brilliantearth.com");
          var crID = nlapiSubmitRecord(cr,true,true);
          //Parse first name and last name
          var firstname = null;
          var lastname = null;
          if(fromName!=null && fromName!="" && fromName.indexOf(" ")!=-1)
          {
            firstname = fromName.substring(0,fromName.indexOf(" "));
            lastname = fromName.substring(fromName.indexOf(" ")+1);
            nlapiLogExecution("DEBUG","Last Name (Test 1)",lastname);
            if(lastname !='' && lastname !=null)
            {
              var last_name_length = lastname.length;
              nlapiLogExecution("DEBUG","Last Name Length",last_name_length);
              if(last_name_length>32)
              {
                lastname  = lastname.substring(0,31);
                nlapiLogExecution("DEBUG","Last Name having length <=32 (Test 2)",lastname);
              }
            }
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
          var leadID = nlapiSubmitRecord(lead,true,true);
          nlapiLogExecution("DEBUG","Information","New Lead Id ::" + leadID);
          fileAttachments(attachments,attachmentsFile);
          /* attachEmailToMesssage function used for sync email into the customer or lead page within message*/
          attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,leadID,textBody);
          nlapiSubmitField("customrecord_incoming_email_log",crID,"custrecord_incoming_email_lead_record",leadID);
          if(toEmail.length>0)
          {
            nlapiSubmitField("customer",leadID,"custentity_last_email_recipient",toEmail);
            nlapiLogExecution("DEBUG","Last Email Recipient(New Lead)","Last Email Recipient updated successfully");
          }
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




