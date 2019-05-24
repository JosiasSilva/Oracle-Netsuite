nlapiLogExecution("audit","FLOStart",new Date().getTime());
// Upadete a custom Diamond NetSuite record
// {"author_email" :"", "message" :"","author_id" :"", "message" :"", "date_created" :"", "cdp_id" :"", "recipient_email":"", "recipient_id":"", "message_subject":""}

//var datain = {"author": "portal_admin", "author_email": "a@c.com", "cdp_id": 20602, "message_subject": "Portal Message", "recipient_email": "mr.a.l.aguilar@gmail.com", "date_created": "2016-01-22 02:40:15", "message": "test"};

function SaveRecord(datain)
{
    var err = new Object();
    var stDate = '';
    var startDate = '';
    var stTime = '';
    var sstTime = '';
  nlapiLogExecution("debug","Portal Data is : ",JSON.stringify(datain));
    nlapiLogExecution("debug","CDP Id is : ",datain.cdp_id);
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
			   //stTime = sstTime + ":" + stTime.split(':')[1] + " am"; //commented by ajay 12Dec 2016
               //Added by ajay 12Dec 2016
                if(sstTime == 00)
				{
					stTime = 12 + ":" + stTime.split(':')[1] + " am";
				}
				else
				{
					stTime = sstTime + ":" + stTime.split(':')[1] + " am";
				}
               //Ended by ajay 12Dec 2016
			} 
			else if( sstTime == 12)
			{        
				stTime = sstTime + ":" + stTime.split(':')[1] + " pm";
			} 
			else if( sstTime == 24)
			{        
				stTime = (parseInt(sstTime)-12) + ":" + stTime.split(':')[1] + " am";
			}         
			else
			{
				stTime = (parseInt(sstTime)-12) + ":" + stTime.split(':')[1] + " pm";
			}
		}
		
		// Validate if mandatory record type is set in the request
		if (!datain.cdp_id)
		{
			err.status = "failed";
			err.message= "missing cdp_id";
			return err;
		}
		if(datain.author_email =="" && datain.recipient_email =="" && datain.message=="")
		{
			err.status = "failed";
			err.message= "missing author_email, recipient_email and message values to be saved";
			return err;
		}
		
		/*var cdpFieldArr = ["custrecord_custom_diamond_vendor"];
		var cdpFieldVal = nlapiLookupField("customrecord_custom_diamond",datain.cdp_id,cdpFieldArr);
		
		var vendorId = cdpFieldVal.custrecord_custom_diamond_vendor;
		
		var cdpArrField=["email"];
		var cdpVal = nlapiLookupField("vendor",vendorId,cdpArrField);
		var vendorEmail = cdpVal.email; // for Vendor/Author Email
                */		
			
		var msgRecord = nlapiCreateRecord('message');
		msgRecord.setFieldValue('entity', ''); // Auther internal Id (18918)				
		//msgRecord.setFieldValue('authoremail', datain.author_email);
		msgRecord.setFieldValue('compressattachments', 'F');
		msgRecord.setFieldValue('emailed', 'F');
		msgRecord.setFieldValue('hasattachment', 'F');
		msgRecord.setFieldValue('htmlmessage', 'F');
		msgRecord.setFieldValue('recipient', ''); // Vendor Id (18918)
		
                if(datain.recipient_email == "diaops@brilliantearth.com") // For vendor message
                {
			msgRecord.setFieldValue('authoremail', datain.recipient_email);
			msgRecord.setFieldValue('recipientemail', "diaops@brilliantearth.com");
		}			
		else
		{
			msgRecord.setFieldValue('authoremail', datain.author_email);
			msgRecord.setFieldValue('recipientemail', datain.recipient_email);
		}
		
		if(datain.message_subject !="")
		{
			msgRecord.setFieldValue('subject', datain.message_subject); 
		}
		else
		{
			msgRecord.setFieldValue('subject', 'Vendor portal communication'); 
		}
		msgRecord.setFieldValue('templatetype', 'EMAIL');
		msgRecord.setFieldValue('record', datain.cdp_id); // cdp_id comes from portal '2751'
		msgRecord.setFieldValue('recordtype', '231');	// for CDP only
		msgRecord.setFieldValue('message', datain.message);	// message comes from portal 
		msgRecord.setFieldValue('messagedate', startDate); // date_created comes from portal FORMAT( 11/14/2013 )
		msgRecord.setFieldValue('time', stTime);
		msgRecord.setFieldValue('type', 'crmmessage');

		var result = nlapiSubmitRecord(msgRecord, true, true);
        //New code added by ajay 25Jan 2016
		if(result > 0)
		{
			var actNeeded = nlapiLookupField("customrecord_custom_diamond",datain.cdp_id,"custrecord_action_needed");
			var actArr = null;
			if(actNeeded != null)
			{
                actNeeded = actNeeded.replace('5','1'); 
				var actArr = actNeeded.split(',');                           
				actArr = actArr.sort();			    
				if(actArr[0] != '1')
				{
					actArr.push('1'); //New msg                               
				}
				actArr = actArr.sort();
			}
			nlapiSubmitField("customrecord_custom_diamond",datain.cdp_id,"custrecord_action_needed",actArr);
			nlapiLogExecution("DEBUG","Updated Action Needed field for CDP Id : " + datain.cdp_id );
		}
		//Ended by ajay
		nlapiLogExecution("DEBUG","message result id: " + result );
        nlapiLogExecution("DEBUG","CDP Id: " + datain.cdp_id);
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
