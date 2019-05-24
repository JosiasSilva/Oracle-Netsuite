/** 
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : pushCdpEmailMsgToPortal.js
 * Created Date  : December 29, 2015
 * Last Modified Date : December 29, 2015
 * Comments : Script will push NS CDP Vendors Emails Record to web portal
 * Sandbox URL: https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=830&whence=
 * Production URL: https://system.netsuite.com/app/common/scripting/script.nl?id=831&whence=
 */
function pushCDPRecordToPortal()
{
	try
	{
		var mySearch = nlapiLoadSearch(null, 3782);
		var searchresult = [];
		var resultset = mySearch.runSearch();
		var searchid = 0;
		do {
			 var resultslice = resultset.getResults(searchid, searchid + 1000);
			 if (resultslice != null && resultslice != '') 
			 {
			for (var rs in resultslice) 
				{
			   searchresult.push(resultslice[rs]);
			   searchid++;
			}
			 }
		  } while (resultslice.length >= 1000);
		  var searchCount1 = 0;
		  var msgIdCdpIdArr=new Array();
		  var msgIdCdpId="";
		  searchCount1 = searchresult.length;
		  if(searchresult && searchCount1 > 0) 
		  {
			//var cdpIdArr=new Array();
			//var columns = searchresult [0].getAllColumns(); 
			for ( var i = 0; i < searchresult.length; i++) 
			{	
			   
			   //nlapiLogExecution('debug', 'searchresult.length is', searchresult.length);			
			   var msgId= searchresult[i].getId();  
			   if(msgId!='')
			   {
				 var msgObj=nlapiLoadRecord("message",msgId);
				 var msgCdpId=msgObj.getFieldValue('record');
				 if(msgCdpId != '' && msgCdpId != null)
				 {
				   msgIdCdpId=msgId+'~'+msgCdpId;
				   msgIdCdpIdArr.push(msgIdCdpId);
				   
				 }
			   }
			}
		   
		  }
		 //var totCdpCount=msgIdCdpIdArr.length;
		 
		for (var k=0;k<msgIdCdpIdArr.length;k++)
		{
			if(msgIdCdpIdArr != null)
			{
				var msgId=msgIdCdpIdArr[k].split('~')[0];
				var cdpId=msgIdCdpIdArr[k].split('~')[1];
				pushDataNSToPortal(msgId,cdpId);
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occur during getting cdp message list is :",err.message); 
	}
}

function pushDataNSToPortal(msgId,cdpId)
{
                  
   if(msgId!='' && cdpId!='')
   { 
		 /*var msgObg=nlapiLoadRecord('message',cdpId) ;  
		 var record = nlapiLoadRecord('message', cdpId,{recordmode: 'dynamic'});
	  
		 var strMsgId=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_cdp_hidden_msg_id");
		 var strMsgIdArr='',lastMsgId ='';    
		 if(strMsgId!='')
		 {   
		  strMsgIdArr=strMsgId.split(',')
		  lastMsgId = strMsgIdArr.pop();
		 }*/     
     
		if(msgId!='')
		{
		   var vendorId=nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_custom_diamond_vendor");
		   var vendorEmail= nlapiLookupField("vendor",vendorId,"email");     
		   var cdpArrField = ["author","message","messagedate","recipientemail","subject"];
		   var cdpVal = nlapiLookupField("message",msgId,cdpArrField);
		   var author=cdpVal.author;
		   var message=cdpVal.message;
		   var date_created=cdpVal.messagedate;     
		   var recipient_email11=cdpVal.recipientemail;
		   var recipient_email=vendorEmail;
		   var author_email="diaops@brilliantearth.com";
		   var message_subject=cdpVal.subject;
		   //var message_id=author;
                  var message_id=msgId;
		  // nlapiLogExecution('debug','MsgId:'+msgId, message);
		   var dateTimeArr='',dateStr='',timeStr='';
			if(date_created!='' && date_created!=null)
			{
			 dateTimeArr=date_created.split(' ');
			 dateStr=dateFormatYMD(dateTimeArr[0]);
			 timeStr=dateTimeArr[1]+':'+'00';
			}
			date_created= dateStr+' '+timeStr;
			if(author!='' && message!='' && date_created!='' && author!='' &&  author_email!='' &&  message_subject!='' &&  message_id!='')
			{
			   //Setting up URL of CDP             
				 var url = "https://partner.brilliantearth.com/api/message/";     

				  //Setting up Headers 
				  var headers = new Array(); 
				  headers['http'] = '1.1';    
				  headers['Accept'] = 'application/json';       
				  headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
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
					 nlapiLogExecution('debug','Successfully Push CDP Message to Portal for CdpId:'+cdpId+',msgId:'+msgId, cdpId);
				  } 
				 
			 }// end check
		}// end check of msgId 
   }//end check of msgId & cdpId
 
}
function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
        return String(value);
   }
   return value;
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