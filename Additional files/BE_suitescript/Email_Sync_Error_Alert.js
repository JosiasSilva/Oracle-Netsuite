function  Email_Sync_Error_Alert(fromEmail,toEmails,subject,lastemaildatetime,error_details)
{
  var sync_email_error_rec = nlapiCreateRecord('customrecord_sync_email_alert');
  sync_email_error_rec.setFieldValue('custrecord_from_email_error_alert',fromEmail);
  sync_email_error_rec.setFieldValue('custrecord_to_email_error_alert',toEmails);
  sync_email_error_rec.setFieldValue('custrecord_date_time_email_error_alert',lastemaildatetime);
  sync_email_error_rec.setFieldValue('custrecord_subject_email_error_alert',subject);
  sync_email_error_rec.setFieldValue('custrecord_error_details_email_alert',error_details);

  nlapiSubmitRecord(sync_email_error_rec);
  nlapiLogExecution("DEBUG","For email sync error information","Custom record has been created successfully for email sync error");

  /*var htmlString ='';
  var emailTo ="anuj.verma@inoday.com";
  var subjectAlert ="Alert! Email Sync Error!";

  htmlString = "<table border='0' align='left' cellpadding='0' cellspacing='0' width='100%'>" ;
  htmlString =htmlString +"<tr><td colspan='2' style='text-align:center;font-weight:bold;'> Email Sync Error Report </td></tr>";
  //htmlString =htmlString +"<tr><td> &nbsp; </td><td> &nbsp; </td></tr>";
  htmlString =htmlString +"<tr><td><b>Date : </b> </td><td>"+ lastemaildatetime +"</td></tr>";
  htmlString =htmlString +"<tr><td><b>From Email :</b>  </td><td>"+ fromEmail +"</td></tr>";
  htmlString =htmlString +"<tr><td><b>To Email :</b>  </td><td>"+ toEmails +"</td></tr>";

  htmlString =htmlString +"<tr><td><b> Subject :</b></td><td>"+ subject +"</td></tr>";
  htmlString =htmlString +"<tr><td><b> Error Details : </b>  </td><td>"+ error_details +"</td></tr>";
  //htmlString =htmlString +"<tr><td> &nbsp; </td><td> &nbsp; </td></tr>";

  //htmlString =htmlString +"<tr><td> &nbsp; </td><td> &nbsp; </td></tr>";
  htmlString =htmlString+"</table>";
  nlapiLogExecution("DEBUG","Alert email sync error content",htmlString);
  nlapiSendEmail(13905299,emailTo,subjectAlert,htmlString);*/
}