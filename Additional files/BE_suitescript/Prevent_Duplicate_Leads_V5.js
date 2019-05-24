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
      nlapiLogExecution("DEBUG", "To Email Address(s) Result", "To Address #"+(k+1)+" : "+ toAddress[k].getEmail().toLowerCase());
    }
    var subject = email.getSubject();
    nlapiLogExecution("DEBUG","Subject",subject);
    if(subject == '' || subject == null)
    {
      subject = ".";
      nlapiLogExecution("DEBUG","Subject line having blank or empty",subject);
    }
    var textBody = email.getTextBody();
    nlapiLogExecution("DEBUG","Text Body",textBody);
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
    finally
    {
      var ccEmails = [];
      var ccEmailsNS =[];
      var otherToEmails =[];
      var ccAddress = email.getCc();
      var toEmails = [];//Primary RECIPIENT
      var filters = [];
      var attachmentsFile =[];
      var toInfo = false;
      var toSupport = false;
      var email_body_content ='';
      var error_details ='';
      var primary_recipient = [];
      var other_recipient_add_to_cc = [];
      //[NS-1220] Start Here To check maximum length for Cc email having only 10 emails
      var ccEmailsCount = 0;
      var ccEmailsLength = ccAddress.length;
      var othertoEmailsCount =0;
      nlapiLogExecution("DEBUG", "Total Cc Email Address(s)", ccEmailsLength);
      // Add Cc emails in NS under communication tab
      // No of Cc emails should not be greater than 10
      for(var k=0; k < ccAddress.length; k++)
      {
        ccEmailsCount++;
        if(ccEmailsCount>10)
          break;
        ccEmailsNS.push(ccAddress[k].getEmail());
        nlapiLogExecution("DEBUG", "Cc Email Address(s) Result", "Cc Email Address(s) #"+(k+1)+" : "+ccAddress[k].getEmail());
      }
      ccEmailsNS = ccEmailsNS.join(",");
      nlapiLogExecution("DEBUG","For adding Cc emails in NS under communication tab",ccEmailsNS);
      // End Here
      for(var x=0; x < toAddress.length; x++)
      {
        if(toAddress[x].getEmail()=="info@brilliantearth.com")
        {
          toInfo = true;
          toEmails.push(toAddress[x].getEmail());
          //break;
        }
        else if(toAddress[x].getEmail()=="support@brilliantearth.com")
        //else if(toAddress[x].getEmail().toLowerCase() == "vermaanuj12mca@yahoo.in")  
        {
          toSupport = true;
          toEmails.push(toAddress[x].getEmail());
          //break;
        }
        else
        {
          other_recipient_add_to_cc.push(toAddress[x].getEmail());
        }
      }
      if(toEmails.length>0)
        nlapiLogExecution("DEBUG","To Emails(Primary recipient)",toEmails);

      nlapiLogExecution("DEBUG","To Info",toInfo);
      nlapiLogExecution("DEBUG","To Support",toSupport);

      for(var e=0; e<toEmails.length;e++)
      {
        if(e==0)
          primary_recipient.push(toEmails[e]);
        else
          other_recipient_add_to_cc.push(toEmails[e]);
      }
      for(var k=0; k < other_recipient_add_to_cc.length; k++)
      {
        othertoEmailsCount++;
        if(othertoEmailsCount>10)
          break;
        otherToEmails.push(other_recipient_add_to_cc[k]);
        nlapiLogExecution("DEBUG", "Other ToEmail Address(s) Result", "Other ToEmail Address(s) #"+(k+1)+" : "+other_recipient_add_to_cc[k]);
      }
      otherToEmails = otherToEmails.join(",");
      nlapiLogExecution("DEBUG","Primary recipient(To..)",primary_recipient);
      nlapiLogExecution("DEBUG","Other recipients added into the Cc col in NS ",otherToEmails);
      // Add Cc emails in NS under communication tab
      /* for(var x=0; x < ccAddress.length; x++)
      {
        ccEmailsNS.push(ccAddress[x].getEmail());
      }
      ccEmailsNS = ccEmailsNS.join(",");
      nlapiLogExecution("DEBUG","For adding Cc emails in NS",ccEmailsNS);*/
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
            //Account for 4,000 character limit in the fields custentity2,custentity_last_customer_email_body
            /*if(textBody!=null && textBody!="")
          {
            if(textBody.length > 4000)
            {
              textBody = textBody.substring(0,3900);
            }
          }*/
            if(textBody!=null && textBody!="")
            {
              nlapiLogExecution("DEBUG","Text Body content length in existing lead",textBody.length);
              if(textBody.length > 4000)
              {
                email_body_content = textBody.substring(0,3900);
                nlapiLogExecution("DEBUG","Text Body content having length less than 4000 in existing lead",email_body_content);
              }
              else
              {
                email_body_content = textBody;
                nlapiLogExecution("DEBUG","Email body content having same as text body content in existing lead",email_body_content);
              }
            }
            else if(htmlBody !=null && htmlBody !='')
            {
              nlapiLogExecution("DEBUG","Html Body content length in existing lead",htmlBody.length);
              if(htmlBody.length > 4000)
              {
                email_body_content = htmlBody.substring(0,3900);
                nlapiLogExecution("DEBUG","Html Body content having length less than 4000 in existing lead",email_body_content);
              }
              else
              {
                email_body_content = htmlBody;
                nlapiLogExecution("DEBUG","Email body content having same as html body content in existing lead",email_body_content);
              }
            }
            attachmentsFile= fileAttachments(attachments,attachmentsFile); //Uncommented by Sandeep As per NS-1220 on 28Aug2018
            //fileAttachments(attachments,attachmentsFile);
            // commented file attachments fun on rachel feedback for ns-1220
            // Now email will be sync in NS without any attachments
            // attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,custId,textBody,ccEmailsNS); commented old fun due to new req NS-1220
            attachEmailToMesssage(fromEmail,primary_recipient,subject,htmlBody,attachmentsFile,custId,textBody,otherToEmails,ccEmailsNS);
            nlapiSubmitField('customer',custId,["custentity1","custentity2","custentity_last_email_from","custentity_last_email_date_time","custentity_last_email_date","custentity_last_customer_email_body"],[subject,email_body_content,'2',lastemaildatetime,lastemaildate,email_body_content]);
            nlapiLogExecution("Debug","Information","In existing Lead email has been synced successfully and mark external sync field");
          }
          catch(ex)
          {
            nlapiLogExecution("DEBUG","Error occur in existing Lead from Email","Details: " + ex.message);
            // NS-1220 
            error_details = ex.getDetails();
            Email_Sync_Error_Alert(fromEmail,toEmails,subject,lastemaildatetime,error_details);
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

            if(subject != "When you were offline (via LivePerson)")
              lead.setFieldValue("leadsource","102877"); //23 Email Request Form

            lead.setFieldValue("custentity1",subject);
            //Account for 4,000 character limit in the field custbody2
            /* if(textBody!=null && textBody!="")
          {
            if(textBody.length > 4000)
            {
              textBody = textBody.substring(0,3900);
            }
          }*/
            if(textBody!=null && textBody!="")
            {
              nlapiLogExecution("DEBUG","Text Body content length in new lead",textBody.length);
              if(textBody.length > 4000)
              {
                email_body_content = textBody.substring(0,3900);
                nlapiLogExecution("DEBUG","Text Body content having length less than 4000 in new lead",email_body_content);
              }
              else
              {
                email_body_content = textBody;
                nlapiLogExecution("DEBUG","Email body content having same as text body content in new lead",email_body_content);
              }
            }
            else if(htmlBody !=null && htmlBody !='')
            {
              nlapiLogExecution("DEBUG","Html Body content length in new lead",htmlBody.length);
              if(htmlBody.length > 4000)
              {
                email_body_content = htmlBody.substring(0,3900);
                nlapiLogExecution("DEBUG","Html Body content having length less than 4000 in new lead",email_body_content);
              }
              else
              {
                email_body_content = htmlBody;
                nlapiLogExecution("DEBUG","Email body content having same as html body content in new lead",email_body_content);
              }
            }
            lead.setFieldValue("custentity2",email_body_content);
            lead.setFieldValue("custentity_last_email_from",'2');
            lead.setFieldValue("custentity_last_email_date_time",lastemaildatetime);
            lead.setFieldValue("custentity_last_email_date",lastemaildate);
            lead.setFieldValue('custentity_celigo_subs_to_newsletter','F');//SUBSCRIBE TO NEWSLETTER
            lead.setFieldValue('custentity_last_customer_email_body',email_body_content);
            var leadID = nlapiSubmitRecord(lead,true,true);
            nlapiLogExecution("DEBUG","New Lead Information","New Lead Id ::" + leadID);
            attachmentsFile= fileAttachments(attachments,attachmentsFile); //Uncommented by Sandeep As per NS-1220 on 28Aug2018
            // commented file attachments fun on rachel feedback for ns-1220
            // Now email will be sync in NS without any attachments
            /* attachEmailToMesssage function used for sync email into the customer or lead page within message*/
            //attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,leadID,textBody,ccEmailsNS); commented old fun due to new req NS-1220
            attachEmailToMesssage(fromEmail,primary_recipient,subject,htmlBody,attachmentsFile,leadID,textBody,otherToEmails,ccEmailsNS);
            nlapiSubmitField("customrecord_incoming_email_log",crID,"custrecord_incoming_email_lead_record",leadID);
            nlapiLogExecution("DEBUG","Information","Lead has been created successfully with syncs email into Customer/Lead and mark external sync field");
          }
          catch(ex)
          {
            nlapiLogExecution("DEBUG","Error Creating new Lead from Email","Details: " + ex.message);
            error_details = ex.getDetails();
            Email_Sync_Error_Alert(fromEmail,toEmails,subject,lastemaildatetime,error_details);
          }
        }
      }
    }// End Finally
  }
  catch(err)
  {
    //nlapiLogExecution("DEBUG","Error" + err.message);
    //error_details = err.getDetails();
    //Email_Sync_Error_Alert(fromEmail,toEmails,subject,lastemaildatetime,error_details);
  }
}




