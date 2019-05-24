/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/runtime', 'N/search', 'N/url','N/record','N/https'],
/**
 * @param {record} record
 * @param {runtime} runtime
 * @param {search} search
 * @param {url} url
 */
function(currentRecord, runtime, search, url,record,https) {
  
  
  
  
  function OpenAttachForm(url){
    
    window.open(url,height=300,width=400);
    
  }
	
	function sendmailClient(scriptContext)
	{
      
	  var recordtype=currentRecord.type;
	  var recordId=currentRecord.id;
	  var customerEmail;
	  if(recordtype=='salesorder')
	  {
	    customerEmail= search.lookupFields({type:recordtype, id:recordId,columns:['custbody2']});
	  }
	  else
	  {
	    customerEmail= search.lookupFields({type:recordtype, id:recordId,columns:['email']});
	  }
	  var url2 = url.resolveScript({scriptId:'customscript_op_appointment_suitelet',deploymentId:'customdeploy_op_appointment_suitelet', returnExternalUrl:false});
	  url2 += '&recordId='+recordId;
	  url2 +='&recordtype='+recordtype;
	  url2+='&customerEmail='+customerEmail;
	  window.open(url2,'','width=750,height=550');

	}
	
	function fieldChanged(scriptContext)
	{
       var currentRecord = scriptContext.currentRecord;
       var field_Id = scriptContext.fieldId;
      if(field_Id == 'custpage_selectfield'){

	  var url_string =  window.location.href;
	  var url = new URL(url_string);
	  var isRelpyMail = url.searchParams.get("reply");
	var msgId=url.searchParams.get("msgId");
	var selectedTemplate = currentRecord.getValue({fieldId:'custpage_selectfield'});
	//console.log(selectedTemplate)
	
	  
	  
        
        if(selectedTemplate){
	    var transactionOrEntity;
	    var recordtype = currentRecord.getValue({fieldId:'custpage_recordtype'});
	    var recordId= currentRecord.getValue({fieldId:'custpage_recordid'});
	     //var recordId= currentRecord.getValue({fieldId:'custpage_rec_frm_cust_email'});                           
        console.log(recordtype+recordId);
	   // var template= currentRecord.getValue({fieldId:'custpage_selectfield'});
	    if(recordtype=='salesorder')
	    {
	      transactionOrEntity='transaction';
	    }
	    else if(recordtype=='customer')
	    {
	      transactionOrEntity='entity';
	    }
        //console.log(transactionOrEntity);
	    var objsend_data={};
        objsend_data.recordtype = recordtype;
	      objsend_data.recordId= recordId;
	      objsend_data.templateId = selectedTemplate;
	      objsend_data.transactionOrEntity = transactionOrEntity;
	    var send_data=JSON.stringify(objsend_data);
	    //console.log(send_data);
	    var rest_url=currentRecord.getValue({fieldId:'custpage_urlfld'});
          
 /*var rest_url = url.resolveScript({
 scriptId: 'customscript2575',
 deploymentId: 'customdeploy1',
 returnExternalUrl: false
});*/
          
         // console.log(rest_url);
          
  var headers = new Array();
  headers['Content-type'] = 'application/json';
          
         var response = https.post({
 url:rest_url,
 body: send_data,
 headers: headers
});
      var objectfromRestlet=JSON.parse(response.body)    
      var body= currentRecord.getValue({fieldId:'custpage_message'});  
      var role=runtime.getCurrentUser().role;
	   if(isRelpyMail=='yes')
	        {
	           var author='';
	           var recipient='';
	          var message='';
	          var subject='';

	          author = currentRecord.getValue({fieldId:'custpage_authtextfld'});//nlapiLookupField('message',msgId,'author',true)
	          recipient = currentRecord.getValue({fieldId:'custpage_rectextfld'});//nlapiLookupField('message',msgId,'recipient',true);

	          message = currentRecord.getValue({fieldId:'custpage_containmessage'}); //nlapiLookupField('message',msgId,'message');

	          subject = currentRecord.getValue({fieldId:'custpage_containsubject'}); //nlapiLookupField('message',msgId,'subject');

	        var dummy="<style>hr { \
	    display: block;\
	    margin-top: 0.1em;\
	    margin-bottom: 0.1em;\
	    margin-left: auto;\
	    margin-right: auto;\
	    border-style: inset;\
	    border-width: 2px;\
	width:200%\
	} </style><br></br><hr>From: "+author+"<br>To: "+recipient+"<br>Subject:"+subject+"<br><br><br><br>"+message;
	          currentRecord.setValue({fieldId:'custpage_message',value:objectfromRestlet['body']+dummy});
	        }
	        else
	        {
	          
	          currentRecord.setValue({fieldId:'custpage_subject',value:objectfromRestlet['subject']});
	          currentRecord.setValue({fieldId:'custpage_message',value:objectfromRestlet['body']});
	          
	        }

        }
    }
	  
   

    }
     function pageInit(scriptContext) {

    }

    return {
    	//pageInit:pageInit,
        OpenAttachForm:OpenAttachForm,
        fieldChanged:fieldChanged,
        sendmailClient:sendmailClient
        
    }

    });