nlapiLogExecution("audit","FLOStart",new Date().getTime());
//var datain = {"author": "portal_admin", "author_email": "a@c.com", "po_id": 20602, "message_subject": "Portal Message", "recipient_email": "mr.a.l.aguilar@gmail.com", "date_created": "2016-01-22 02:40:15", "message": "test"};

function SaveMessageRecord(datain)
{
    var err = new Object();
    var stDate = '';
    var startDate = '';
    var stTime = '';
    var sstTime = '';
    nlapiLogExecution("debug","Author is :",datain.author);
    nlapiLogExecution("debug","Author Email is :",datain.author_email);
    nlapiLogExecution("debug","PO Id is :",datain.po_id);
    nlapiLogExecution("debug","message subject is :",datain.message_subject);
    nlapiLogExecution("debug","Receipient email is :",datain.recipient_email);
    nlapiLogExecution("debug","date created is :",datain.date_created);
    nlapiLogExecution("debug","message is :",datain.message);
    try
	{				
		if(!datain.date_created)
		{
			err.status = "failed";
			err.message= "missing date_created";
			return err;
		}
		if(datain.date_created != null)
		{
			stDate =datain.date_created.split('-');				 
			startDate =stDate[1]+'/'+stDate[2].split(' ')[0]+'/'+stDate[0];				 
			stTime = stDate[2].split(' ')[1];			 
			sstTime =stTime.split(':')[0];                                 
			 
			if( sstTime < 12)
			{        
			   stTime = sstTime + ":" + stTime.split(':')[1] + " am";
			} 
			else if( sstTime == 12)
			{        
				stTime = sstTime + ":" + stTime.split(':')[1] + " pm";
			} 
			else if( sstTime == 24)
			{        
				stTime = (parseInt(sstTime)-24) + ":" + stTime.split(':')[1] + " am";
			}         
			else
			{
				stTime = (parseInt(sstTime)-12) + ":" + stTime.split(':')[1] + " pm";
			}
		}
		
		// Validate if mandatory record type is set in the request
		if (!datain.po_id)
		{
			err.status = "failed";
			err.message= "missing po_id";
			return err;
		}
		if (!datain.author)
		{
			err.status = "failed";
			err.message= "missing author";
			return err;
		}
		if(datain.author_email =="" && datain.recipient_email =="" && datain.message=="" && datain.message_subject == "")
		{
			err.status = "failed";
			err.message= "missing author_email, recipient_email,message_subject and message values to be saved";
			return err;
		}		
		
		var vendorId = nlapiLookupField("purchaseorder",datain.po_id,"entity");
						
		var msgRecord = nlapiCreateRecord('message');
		msgRecord.setFieldValue('entity', vendorId); // Vendor internal Id (18918)				
		
		msgRecord.setFieldValue('compressattachments', 'F');
		msgRecord.setFieldValue('emailed', 'F');
		msgRecord.setFieldValue('hasattachment', 'F');
		msgRecord.setFieldValue('htmlmessage', 'F');
		msgRecord.setFieldValue('recipient', vendorId); // Vendor Id (18918)		
                
		msgRecord.setFieldValue('authoremail', datain.author_email);
		msgRecord.setFieldValue('recipientemail', datain.recipient_email);		
				
		msgRecord.setFieldValue('subject', datain.message_subject); 
		
		msgRecord.setFieldValue('templatetype', 'EMAIL');
		msgRecord.setFieldValue('transaction', datain.po_id); // po_id comes from portal '2751'
		
		msgRecord.setFieldValue('message', datain.message);	// message comes from portal 
		msgRecord.setFieldValue('messagedate', startDate); // date_created comes from portal FORMAT( 11/14/2013 )
		msgRecord.setFieldValue('time', stTime);
		msgRecord.setFieldValue('type', 'crmmessage');

		var result = nlapiSubmitRecord(msgRecord, true, true);
		nlapiLogExecution("DEBUG","PO id is : " + datain.po_id);
		nlapiLogExecution("DEBUG","message result id: " + result );
		err.status = "OK";
		err.message= result;
		return err;			
	}
	catch(err)
	{
		nlapiLogExecution("DEBUG","Error occur during execution of script is : " + err.message );
		err.status = "Failed";
		err.message= err.message;
		return err;
	}
}
