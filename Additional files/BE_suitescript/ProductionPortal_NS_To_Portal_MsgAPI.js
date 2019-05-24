nlapiLogExecution("audit","FLOStart",new Date().getTime());
function PushPOMessageToPortal(type)
{
	try
	{		
		var msgId = nlapiGetRecordId();		
        nlapiLogExecution("debug","Message Id is :",nlapiGetRecordId());
		var msgObj = nlapiLoadRecord("message",msgId);
		var poId= msgObj .getFieldValue('transaction');		
		var subject= msgObj .getFieldValue('subject');
		
		if( subject !="Portal Message" && poId > 0)
		{			
			PushMessageNSToPortal(msgId,poId,"942");
		}
	}
	catch(err)
	{
		nlapiLogExecution("debug","Message error is :",err.message);
	}
}

function PushMessageNSToPortal(msgId,poId,scriptId)
{
	try
	{
		var vendorId=nlapiLookupField("purchaseorder",poId,"entity");
		var vendorEmail= nlapiLookupField("vendor",vendorId,"email"); 
	         
		var pomsgArrField = ["author","authoremail","message","messagedate","recipientemail","subject"];
		var pomsgVal = nlapiLookupField("message",msgId,pomsgArrField);		   	
		var author=pomsgVal.author;
		var authorEmail=pomsgVal.authoremail;
	    var message=pomsgVal.message;
	    var date_created=pomsgVal.messagedate;     
	    var recipient_email11=pomsgVal.recipientemail;
	    var recipient_email=vendorEmail;		  
	    var author_email= authorEmail;
	    var message_subject=pomsgVal.subject;		   
	    var message_id=msgId;		  
	    var dateTimeArr='',dateStr='',timeStr='';
		
		if(date_created!='' && date_created!=null)
		{
			dateTimeArr=date_created.split(' ');
			dateStr=dateFormatYMD(dateTimeArr[0]);
			timeStr=dateTimeArr[1]+':'+'00';
		}
			
		date_created = dateStr+' '+timeStr;
		
		nlapiLogExecution("debug","date time Value : ", date_created);  
        nlapiLogExecution("debug","time Value : ", timeStr);  
				
		if(author!='' && author!=null &&  author_email!='' &&  author_email!=null && recipient_email!='' && recipient_email !=null && date_created!='' &&  message_subject!='' &&  message_id!='' && message_id!=null  && message!='')
		{			
			 //Setting up URL of PO             			 
			 //var url = "https://partner.brilliantearth.com/api/production/message/";  // for Production  
			 var url = "https://testportal.brilliantearth.com/api/production/message/";  // for test portal
			
			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       
			//headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // for Production
			headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';  // for sandbox
			headers['Content-Type'] = 'application/json'; 
			headers['User-Agent-x'] = 'SuiteScript-Call';  
			   
			//Setting up Datainput
			var jsonobj = {"author": author_email, 
				 "message": message,
				 "date_created": date_created,
				 "author_email": author_email,
				 "recipient_email": recipient_email,
				 "message_subject": message_subject,
				 "message_id": message_id,
				 "purchase_order": poId,
                 "script_id" : scriptId
			}
					
			//Stringifying JSON
			var myJSONText = JSON.stringify(jsonobj, replacer); 
			var response = nlapiRequestURL(url, myJSONText, headers);    
			//Below is being used to put a breakpoint in the debugger  
			
			if(response.code=='200')
			{				
			    nlapiLogExecution('debug','PO Communication Successfully Pushed to Portal for poId :'+poId+',msgId :'+msgId, poId);
				var responsebody = JSON.parse(response.getBody());
				var portalStatus = responsebody["portal_status"];
				nlapiSubmitField('purchaseorder',poId,'custbody_portal_status',portalStatus);
			}
			else
			{						
				nlapiLogExecution('debug','PO Communication detail does not exists to push on portal for poId :'+poId, response.getBody());
			} 			 
		}// end check
	}
	catch (e)
	{
		nlapiLogExecution("debug","Error occur during PoId Push from NS to portal",e.message); 
	}
}

function dateFormatYMD(strDate)
{
  var YYYYMMDD='';
  var strArr='';
  if(strDate!='')
  {
    strArr=strDate.split('/');
    var mm=strArr[0];
    if(mm.length=='1') mm='0'+mm;
    var dd=strArr[1];
    if(dd.length=='1') dd='0'+dd;
    var yyyy=strArr[2];
    YYYYMMDD=yyyy+'-'+mm+'-'+dd;
  }
  return YYYYMMDD;
}

// End function of cdp message to portal
function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
		return String(value);
   }
   return value;
}