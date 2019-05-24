function attachEmailToMesssage(fromEmail,toEmails,subject,htmlBody,attachmentsFile,leadID,textBody,ccEmailsNS)
{
  nlapiLogExecution("Debug","From Email in attachEmailToMesssage() Fun",fromEmail);
  nlapiLogExecution("Debug","To Emails in attachEmailToMesssage() Fun",toEmails);
  nlapiLogExecution("Debug","To add Cc email in NS in attachEmailToMesssage() Fun",ccEmailsNS);
  if(attachmentsFile.length>0)
    nlapiLogExecution("Debug","Attachments File in attachEmailToMesssage() Fun",attachmentsFile);
  var msgRecord = nlapiCreateRecord('message'); //creating new message record
  msgRecord.setFieldValue('entity', leadID); // link message to lead
  msgRecord.setFieldValue('authoremail',fromEmail);
  msgRecord.setFieldValue('recipientemail',toEmails);
  if(ccEmailsNS !='' && ccEmailsNS != null)
    msgRecord.setFieldValue('cc',ccEmailsNS);
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
