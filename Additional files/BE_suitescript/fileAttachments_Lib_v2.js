function fileAttachments(attachments, attachmentsFile) {
  try {
    for (var indexAtt in attachments) {
      var attachment = attachments[indexAtt];

      nlapiLogExecution("debug", "Attachments Name", attachment.getName());
      nlapiLogExecution("debug", "Attachments Type", attachment.getType());
      nlapiLogExecution("debug", "Attachments Value", attachment.getValue());
      nlapiLogExecution("debug", "Attachments Size in bytes", attachment.getSize());
      //if( attachment.getSize() <= 10485760 )
      //{
      nlapiLogExecution("debug", "Attachments Size in if block", attachment.getSize());

      try {
        attachment.setFolder("10353640"); //Sync Emails with NetSuite File Attachments Folder Id
        var fileID = nlapiSubmitFile(attachment);
        nlapiLogExecution("debug", "Created File ID", fileID);
        attachmentsFile.push(fileID);
      } catch (ex) {
        nlapiLogExecution("Debug", 'Error in attaching files', ex.getDetails());
      }
      //}

    }
  } catch (e) {
    nlapiLogExecution("Debug", 'Error in attaching files', e.getDetails());
  }
  return attachmentsFile;
}