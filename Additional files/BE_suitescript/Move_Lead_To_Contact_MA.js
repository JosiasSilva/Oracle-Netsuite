nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Move_Lead_To_Contact_MA(rec_type,rec_id)
{
	try
	{
		//Get values from created lead record
		var leadFields = nlapiLookupField(rec_type,rec_id,["entityid","firstname","lastname","altemail","custentity129","custentity_sweepstakes_newsletter_sub"]);
		
		//Create contact record with matching values
		var contact = nlapiCreateRecord("contact");
		contact.setFieldValue("entityid",leadFields.entityid);
		contact.setFieldValue("firstname",leadFields.firstname);
		contact.setFieldValue("lastname",leadFields.lastname);
		contact.setFieldValue("altemail",leadFields.altemail);
		contact.setFieldValue("custentity129",leadFields.custentity129);
		contact.setFieldValue("custentity_sweepstakes_newsletter_sub",leadFields.custentity_sweepstakes_newsletter_sub);
		nlapiSubmitRecord(contact,true,true);
		
		//Delete original lead record
		nlapiDeleteRecord(rec_type,rec_id);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Moving Lead to Contact","Details: " + err.message);
	}
}
