function fileAttachments(attachments,attachmentsFile)
{
  //try
  //{
  for(var indexAtt in attachments)
  {
    var attachment = attachments[indexAtt];

    nlapiLogExecution("debug","Attachments Name",attachment.getName());
    nlapiLogExecution("debug","Attachments Type",attachment.getType());
    nlapiLogExecution("debug","Attachments Value",attachment.getValue());

    var fileObj = nlapiCreateFile(attachment.getName(),attachment.getType(),attachment.getValue());
    fileObj.setFolder("10353640");//Sync Emails with NetSuite File Attachments Folder Id
    var fileID = nlapiSubmitFile(fileObj);
    nlapiLogExecution("debug","File ID",fileID);
    attachmentsFile.push(fileID);
  }
  // }
  /*catch(e)
  {
    nlapiLogExecution("ERROR",e.getCode(),e.getDetails());
  }*/
}