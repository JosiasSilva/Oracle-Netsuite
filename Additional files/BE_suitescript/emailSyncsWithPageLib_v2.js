//function attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,leadID,textBody)// commented old function due to new requirement NS-1254
// Added new parameters for scenario one(other_recipient_add_to_cc) and scenario 2 (ccEmailsNS) in below function according to NS-1254
function attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,leadID,textBody,other_recipient_add_to_cc,ccEmailsNS)
{
  var chk_cc_emails_to_add_in_ns = false;
  var to_add_cc_emails_in_ns =[];
  nlapiLogExecution("Debug","From Email in attachEmailToMesssage() Fun",fromEmail);
  nlapiLogExecution("Debug","To Emails(Primary Recipients) in attachEmailToMesssage() Fun",toEmails);
  nlapiLogExecution("Debug","Other Recipients in attachEmailToMesssage() Fun",other_recipient_add_to_cc);
  nlapiLogExecution("Debug","To add Cc email in NS in attachEmailToMesssage() Fun",ccEmailsNS);
  if(other_recipient_add_to_cc!='' && other_recipient_add_to_cc!=null)
    to_add_cc_emails_in_ns.push(other_recipient_add_to_cc);
  if(ccEmailsNS!='' && ccEmailsNS!=null)
    to_add_cc_emails_in_ns.push(ccEmailsNS);
  to_add_cc_emails_in_ns = to_add_cc_emails_in_ns.join(",");
  nlapiLogExecution("Debug","To add Cc email in NS + Other Recipients of emails in attachEmailToMesssage() Fun",to_add_cc_emails_in_ns);
  if(attachmentsFile.length>0)
    nlapiLogExecution("Debug","Attachments File in attachEmailToMesssage() Fun",attachmentsFile);
  var msgRecord = nlapiCreateRecord('message'); //creating new message record
  msgRecord.setFieldValue('entity', leadID); // link message to lead
  msgRecord.setFieldValue('authoremail',fromEmail);
  msgRecord.setFieldValue('recipientemail',toEmails);
  // if(other_recipient_add_to_cc !='' && other_recipient_add_to_cc!=null)
  // msgRecord.setFieldValue('cc',other_recipient_add_to_cc); // commented old code
  // added below new logic as per scenario one(recipient having more than one email) and scenario two(Cc having more than one email)
  if(ccEmailsNS !='' && ccEmailsNS != null)
  {
    msgRecord.setFieldValue('cc',to_add_cc_emails_in_ns);
    chk_cc_emails_to_add_in_ns = true;
    // if chk_cc_emails_to_add_in_ns variable is true then Cc email having more than one email 
    nlapiLogExecution("Debug","Value of common variable for (Scenario Two) will be true in attachEmailToMesssage() Fun",chk_cc_emails_to_add_in_ns);
    nlapiLogExecution("Debug","More than one email info (Scenario Two) in attachEmailToMesssage() Fun", "Cc email having more than one email ");
  }
  if(chk_cc_emails_to_add_in_ns == false)
  {
    if(other_recipient_add_to_cc !='' && other_recipient_add_to_cc!=null)
    {
      msgRecord.setFieldValue('cc',to_add_cc_emails_in_ns);
      // if chk_cc_emails_to_add_in_ns variable is false then recipient email having more than one email
      nlapiLogExecution("Debug","Value of common variable for (Scenario One) will be false in attachEmailToMesssage() Fun",chk_cc_emails_to_add_in_ns);
      nlapiLogExecution("Debug","More than one email info (Scenario One) in attachEmailToMesssage() Fun", " Recipient email having more than one email ");
    }
  }
  if(htmlBody != null && htmlBody != '')
    msgRecord.setFieldValue('message', htmlBody);
  else
    msgRecord.setFieldValue('message', textBody);
  msgRecord.setFieldValue('subject',subject);
  for(var f=0;f<attachmentsFile.length;f++)
  {
    msgRecord.selectNewLineItem('mediaitem');
    msgRecord.setCurrentLineItemValue('mediaitem','mediaitem',attachmentsFile[f]);
    msgRecord.commitLineItem('mediaitem');
  }
  var messageId = nlapiSubmitRecord(msgRecord);
  if(attachmentsFile.length>0)
    nlapiLogExecution("Debug","Attachments","File has been attached in attachments tab");
  nlapiLogExecution("Debug","Message","Message has been attached");
  /* creating a custom record for new message having two fields message internal  id and external sync.*/
  var  extSyncPerMessage = nlapiCreateRecord('customrecord_extsyncpermessage');
  extSyncPerMessage.setFieldValue('custrecord_new_message_id',messageId);
  extSyncPerMessage.setFieldValue('custrecord_ext_sync','T');
  nlapiSubmitRecord(extSyncPerMessage);
  nlapiLogExecution("Debug","External Sync Per Message","Record for external sync per message has been created");
}
