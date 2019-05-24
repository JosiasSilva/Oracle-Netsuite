function fileAttachments(attachments,attachmentsFile)
{
  for(var indexAtt in attachments)
  {
    var attachment = attachments[indexAtt];

    nlapiLogExecution("debug","Attachments Name",attachment.getName());
    nlapiLogExecution("debug","Attachments Type",attachment.getType());
    nlapiLogExecution("debug","Attachments Value",attachment.getValue());

    attachment.setFolder("10353640");//Sync Emails with NetSuite File Attachments Folder Id
    var fileID = nlapiSubmitFile(attachment);
    nlapiLogExecution("debug","File ID",fileID);
    attachmentsFile.push(fileID);
  }
}