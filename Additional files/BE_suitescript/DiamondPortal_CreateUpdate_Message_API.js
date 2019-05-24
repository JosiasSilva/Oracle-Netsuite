nlapiLogExecution("audit","FLOStart",new Date().getTime());
function PushMessageToPortal(type)
{
	nlapiLogExecution("debug","San Francisco", type + "::::" + nlapiGetRecordId() );
	var soObj = nlapiLoadRecord("message",nlapiGetRecordId() );
	var varrecordtype= soObj .getFieldValue('recordtype');
	var varrecord= soObj .getFieldValue('record');
	var varsubject= soObj .getFieldValue('subject');
	nlapiLogExecution("debug","RecordType",  varrecordtype + "    : varrecord :: "+  varrecord + "  :Subject: " + varsubject);
	if( varrecordtype == "231" && varsubject !="Portal Message")
	{
		nlapiLogExecution("debug","1", "1");
		PushMessageNSToPortal(nlapiGetRecordId(),varrecord)
	}
}
function PushMessageNSToPortal(msgId,cdpId)
{          

			nlapiLogExecution("debug","2", "2");        
	
			try
			{
		   var vendorId=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_custom_diamond_vendor");
		   var vendorEmail= nlapiLookupField("vendor",vendorId,"email"); 
	nlapiLogExecution("debug","3", "3");        		   
		   var cdpArrField = ["author","authoremail","message","messagedate","recipientemail","subject"];
		   var cdpVal = nlapiLookupField("message",msgId,cdpArrField);
		   	nlapiLogExecution("debug","4", "4");        
		   var author=cdpVal.author;
		   var authorEmail=cdpVal.authoremail;
		   var message=cdpVal.message;
		   var date_created=cdpVal.messagedate;     
		   var recipient_email11=cdpVal.recipientemail;
		   var recipient_email=vendorEmail;		  
		   var author_email= authorEmail;
		   var message_subject=cdpVal.subject;		   
           var message_id=msgId;		  
		   var dateTimeArr='',dateStr='',timeStr='';
		   	nlapiLogExecution("debug","5", "5");        
			if(date_created!='' && date_created!=null)
			{
			 dateTimeArr=date_created.split(' ');
			 dateStr=dateFormatYMD(dateTimeArr[0]);
			 timeStr=dateTimeArr[1]+':'+'00';
			}
				nlapiLogExecution("debug","6", "6");        
			date_created= dateStr+' '+timeStr;
			nlapiLogExecution("debug","Condition Value", author + ", " + author_email + ", " + recipient_email + ", " + date_created + ", "+ message_subject + ", " + message_id + ", " + message);  
			
			if(author!='' && author!=null &&  author_email!='' &&  author_email!=null && recipient_email!='' && recipient_email !=null && date_created!='' &&  message_subject!='' &&  message_id!='' && message_id!=null  && message!='')
			{
					nlapiLogExecution("debug","7", "7");        
			   //Setting up URL of CDP             
				 var url = "https://testportal.brilliantearth.com/api/message/";     // for Production
                
				  //Setting up Headers 
				  var headers = new Array(); 
				  headers['http'] = '1.1';    
				  headers['Accept'] = 'application/json';       
				  headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; // for Production
				  
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
				 "cdp_id": cdpId
				  }
						
				  //Stringifying JSON
				  var myJSONText = JSON.stringify(jsonobj, replacer); 
				  var response = nlapiRequestURL(url, myJSONText, headers);    
				  //Below is being used to put a breakpoint in the debugger  
				  var rst=response.action_needed;  
				  if(response.code=='200')
				  {
				   nlapiLogExecution('debug','CDP Communication Successfully Pushed to Portal for CdpId:'+cdpId+',msgId:'+msgId, cdpId);
				  }
				  else
				  {
						//var responsebody = JSON.parse(response.getBody());		                        
						nlapiLogExecution('debug','CDP Communication detail not exists to push on portal for CdpId:'+cdpId, response.getBody());
				  } 
				 
			 }// end check
			}
			catch (e)
			{
				nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal",e.message); 
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