/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/record', 'N/search', 'N/ui/serverWidget','N/url','N/render','N/email','N/http','N/redirect'],
/**
 * @param {file} file
 * @param {record} record
 * @param {search} search
 * @param {serverWidget} serverWidget
 */
function(file, record, search, serverWidget,Url,render,email,http,redirect) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	var arr =[];
        var temp_rec_val_frm_search;
		
		var temp_rec_val_frm_email; // added : 01/13/19
        var reply_as_op = '0';
    	var request = context.request;
        var response = context.response;
    	var form = serverWidget.createForm({
    		title: 'Send Mail'
    	});
      //form.clientScriptFileId = 29757599;
	  form.clientScriptModulePath = 'SuiteScripts/OP_Email_on_appointment_page_cl_v1.js';
    	if(request.method === 'GET')
    	  {
    		
    		
    		var subjectFld= form.addField({id: 'custpage_subject',type:serverWidget.FieldType.TEXT, label: 'Subject'});
    		subjectFld.isMandatory = true;
    		subjectFld.updateDisplaySize({height:42,width:42});
    		subjectFld.updateLayoutType({layoutType:serverWidget.FieldLayoutType.OUTSIDE});
    		subjectFld.updateBreakType({breakType: serverWidget.FieldBreakType.STARTROW});
    		var ccFld= form.addField({id: 'custpage_cc',type:serverWidget.FieldType.TEXT, label: 'CC'})
    		ccFld.isMandatory = false;
    		ccFld.updateDisplaySize({height:42,width:42});
    		ccFld.updateLayoutType({layoutType:serverWidget.FieldLayoutType.OUTSIDE});
    		ccFld.updateBreakType({breakType: serverWidget.FieldBreakType.STARTROW});
    		var bccFld= form.addField({id: 'custpage_bcc',type:serverWidget.FieldType.TEXT, label: 'BCC'})
    		bccFld.isMandatory = false;
    		bccFld.updateDisplaySize({height:42,width:42});
    		bccFld.updateLayoutType({layoutType:serverWidget.FieldLayoutType.OUTSIDE});
    		bccFld.updateBreakType({breakType: serverWidget.FieldBreakType.STARTROW});
    		
    		 var customerEmail=request.parameters.customerEmail;
    		    var msgId=request.parameters.msgId;
    		    var recordid=request.parameters.recordId;
                var rec_num_id = parseInt(recordid);
    		    var recordtype=request.parameters.recordtype;
    		    var subject='';
    		    
    		    if(msgId)
    		      {
    		        subject=search.lookupFields({type: search.Type.MESSAGE,id:msgId,columns:['subject']}).subject;
                 
                    //log.debug("Subject Obj",search.lookupFields({type:search.Type.MESSAGE,id:msgId,columns:['author']}).author[0].text);
    		        recordid=request.parameters.custpage_recid;
    		    	recordtype=request.parameters.custpage_rectype;
    		      }
    		    var hidenEmailField= form.addField({id:'custpage_customeremail',type:serverWidget.FieldType.TEXT,label: 'hdnEmail'})
    		    hidenEmailField.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
                  hidenEmailField.defaultValue = customerEmail;
                 var hidenAuthTextField= form.addField({id:'custpage_authtextfld',type:serverWidget.FieldType.TEXT,label: 'hdnAuthtext'})
    		    hidenAuthTextField.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
                 var hidenRecTextField= form.addField({id:'custpage_rectextfld',type:serverWidget.FieldType.TEXT,label: 'hdnRecText'})
    		    hidenRecTextField.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
                 var getSubUrl = Url.resolveScript({scriptId:'customscript_op_get_subject_content',deploymentId:'customdeploy_op_get_subject_content',returnExternalUrl:false});
                 var hidenUrlFld= form.addField({id:'custpage_urlfld',type:serverWidget.FieldType.TEXT,label: 'hdnurlfld'})
    		    hidenUrlFld.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
    		   hidenUrlFld.defaultValue = getSubUrl;
             var hidenRecVal= form.addField({id:'custpage_temp_rec_val',type:serverWidget.FieldType.TEXT,label: 'hdnrec'});
             hidenRecVal.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
             var hidenReplyOpField= form.addField({id:'custpage_replyop_click',type:serverWidget.FieldType.TEXT,label: 'hdnReplyOp'})
    		    hidenReplyOpField.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
                hidenReplyOpField.defaultValue = reply_as_op;
    		    var hiddenrecordid=form.addField({id:'custpage_recordid',type:serverWidget.FieldType.TEXT,label: 'hdnRecid'});
    		    hiddenrecordid.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
    		    hiddenrecordid.defaultValue = recordid;
    		    var hiddnrecordtype=form.addField({id:'custpage_recordtype',type:serverWidget.FieldType.TEXT,label: 'hdnrectype'});
    		    hiddnrecordtype.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
    		    hiddnrecordtype.defaultValue = recordtype;
    		    var hdnReply= form.addField({id:'custpage_hdnreply',type:serverWidget.FieldType.TEXT,label: 'hdnreply'});
    		    hdnReply.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
    		    hdnReply.defaultValue = request.parameters.reply;
    		    var author=form.addField({id:'custpage_author',type:serverWidget.FieldType.TEXT ,label:'Sender Email Address'});
    		    author.updateDisplaySize({height:42,width:42});
    		    author.updateDisplayType({displayType:serverWidget.FieldDisplayType.READONLY});
    		    author.updateLayoutType({layoutType:serverWidget.FieldLayoutType.OUTSIDE});
    		    author.updateBreakType({breakType: serverWidget.FieldBreakType.STARTROW});
    		    author.defaultValue = 'orderprotection@brilliantearth.com'
    		    
    		    var recipient= form.addField({id:'custpage_recipient',type:serverWidget.FieldType.TEXT,label: 'Recipient Email Address'});
    		    recipient.updateDisplaySize({height:42,width:42});
    		    recipient.isMandatory = true;
    		    recipient.updateLayoutType({layoutType:serverWidget.FieldLayoutType.OUTSIDE});
    		    recipient.updateBreakType({breakType: serverWidget.FieldBreakType.STARTROW});
				// added : 01/13/19
    		    var rec_frm_customer_email = form.addField({id:'custpage_rec_frm_cust_email',type:serverWidget.FieldType.TEXT,label: 'Recipient Value'});
				rec_frm_customer_email.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
				
				
    		   if(customerEmail)
    		      {
                   
    		    recipient.defaultValue = customerEmail.replace(/\s/g,'');
                    //Added : 02/13/19
				if (recordtype == 'salesorder'){
                 
				rec_frm_customer_email.defaultValue = search.lookupFields({type:search.Type.SALES_ORDER,id:recordid,columns:['entity']}).entity[0].value; // Added. REVERT if necessary
				}
                    else if (recordtype == 'customer'){
                      rec_frm_customer_email.defaultValue = recordid;
                    }
                    else if (recordtype == 'lead'){
                      rec_frm_customer_email.defaultValue = recordid;
                    }
    		      }
    		    var tempSel = form.addField({id:'custpage_selectfield',type:serverWidget.FieldType.SELECT,label:'Select Template',source:'emailtemplate'});
    		    tempSel.updateLayoutType({layoutType:serverWidget.FieldLayoutType.OUTSIDE});
    		    tempSel.updateBreakType({breakType: serverWidget.FieldBreakType.STARTROW});

    		    
    		    var msgField= form.addField({id: 'custpage_message',type:serverWidget.FieldType.RICHTEXT,label:'Message'});
    		    msgField.updateLayoutType({layoutType:serverWidget.FieldLayoutType.OUTSIDE});
    		    msgField.updateBreakType({breakType: serverWidget.FieldBreakType.STARTROW});
    		    msgField.updateDisplaySize({height:70,width:70});
    		    if(msgId)
    		      {
                     
                    var rec_val = search.lookupFields({type:search.Type.MESSAGE,id:msgId,columns:['recipient']}).recipient[0].value;
                    hidenRecVal.defaultValue = rec_val;
    		           msgField.defaultValue='<style>hr { \
    		    display: block;\
    		    margin-top: 0.1em;\
    		    margin-bottom: 0.1em;\
    		    margin-left: auto;\
    		    margin-right: auto;\
    		    border-style: inset;\
    		    border-width: 2px;\
    		width:200%\
    		} </style><table style="font-family:sans-serif; font-size:10px"><tr><td>Best regards,</td></tr><tr><td>Brilliant Earth Customer Service</td></tr><tr><td>www.brilliantearth.com</td></tr><tr><td>orderprotection@brilliantearth.com</td></tr><tr><td>1 (800) 691-0952</td></tr></table><br></br><hr>'+'From: '+search.lookupFields({type:search.Type.MESSAGE,id:msgId,columns:['author']}).author[0].text+'<br>To: '+search.lookupFields({type:search.Type.MESSAGE,id:msgId,columns:['recipient']}).recipient[0].text+'<br>Subject: '+subject+'<br><br><br><br>'+ search.lookupFields({type:search.Type.MESSAGE,id:msgId,columns:['message']}).message;
    		        if(subject.indexOf('RE:') == 0 || subject.indexOf('FW:')== 0 || subject.indexOf('Re:')== 0 || subject.indexOf('Fw:') == 0){
        subjectFld.defaultValue = subject;
        }
        else{
          subjectFld.defaultValue = 'Re: '+subject;
        }

    		       var storeSender=form.addField({id: 'custpage_containsender',type:serverWidget.FieldType.TEXT,label:'hdnContainSender'});
    		       storeSender.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
    		        storeSender.defaultValue = search.lookupFields({type:search.Type.MESSAGE,id: msgId,columns:['author']}).author[0].value;
                    hidenAuthTextField.defaultValue = search.lookupFields({type:search.Type.MESSAGE,id: msgId,columns:['author']}).author[0].text;
    		        var storeReciever=form.addField({id:'custpage_containreciever',type:serverWidget.FieldType.TEXT,label:'hdncontainReciver'});
    		        storeReciever.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
    		        storeReciever.defaultValue = search.lookupFields({type:search.Type.MESSAGE,id: msgId,columns:['recipient']}).recipient[0].value; 
                    hidenRecTextField.defaultValue = search.lookupFields({type:search.Type.MESSAGE,id: msgId,columns:['recipient']}).recipient[0].text;
    		        var storeSubject=form.addField({id:'custpage_containsubject',type:serverWidget.FieldType.TEXT,label:'hdncontainReciver'});
    		        storeSubject.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
    		        storeSubject.defaultValue = subject;
    		        var storeMessage=form.addField({id: 'custpage_containmessage',type:serverWidget.FieldType.LONGTEXT,label:'hdncontainMessage'});
    		        storeMessage.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
    		        storeMessage.defaultValue =  search.lookupFields({type:search.Type.MESSAGE,id: msgId,columns:['message']}).message;
    		      }
    		    else
    		      {
    		    msgField.defaultValue = '<table style="font-family:sans-serif; font-size:10px"><tr><td>Best regards,</td></tr><tr><td>Brilliant Earth Customer Service</td></tr><tr><td>www.brilliantearth.com</td></tr><tr><td>orderprotection@brilliantearth.com</td></tr><tr><td>1 (800) 691-0952</td></tr></table>';
    		      }
    		    var javaScriptFileUrl=file.load({id:19968316}).url;  // Add New
    		    if(recordtype!='employee' && recordtype!='customer')
    		    {
    		     var inlineFld =  form.addField({id:'custpage_inlinhtml',type:serverWidget.FieldType.INLINEHTML,label:'inline'});
    		     inlineFld.defaultValue = '<script type="text/javascript" src="'+javaScriptFileUrl+'"></script><style type=text/css> .pgBntB .bntBgB, .pgBntB_sel .bntBgB, button.pgBntB {\
    		border-color: #125ab2 !important;\
    		top: 810px;\
    		background-color: #125ab2 !important;\
    		} #custpage_message{height:80px;width:80px}</style><br><br><span id="spn">INCLUDE TRANSACTION</span><input type="checkbox" id="custpage_chk" name="custpage_chk"/><br><br><select id="custpage_select" name="custpage_select" disabled style="width:260px; hight:200px"><option value="-1">Default</option><option value="1">Inline-Below</option><option value="2">Inline-Above</option><option value="3">HTML</option><option value="4">PDF</option></select><br><br>\
    		<script type="text/javascript">\
    		$(document).ready(function (){\
    		$("#custpage_chk").change(function (){\if(this.checked)$("#custpage_select").prop("disabled", false);else $("#custpage_select").prop("disabled", true);});});</script>';
    		    }
    		    var attachmentsSublist=form.addSublist({id:'custpage_attachment_sublist',type: serverWidget.SublistType.INLINEEDITOR,label:"Attached Files"});
    		    attachmentsSublist.addField({id:"fileid",type:serverWidget.FieldType.TEXT,label:"File Id"});
    		    attachmentsSublist.addField({id:"filename",type:serverWidget.FieldType.TEXT,label:"File Name"});

    		    
    		   var url = Url.resolveScript({scriptId:'customscript_attach_multiple_files_op',deploymentId:'customdeploy_attach_multiple_files_op',returnExternalUrl:false});
    		    form.addButton({id:"custpage_addfiles",label:"Attach File (s)",functionName:'OpenAttachForm("'+url+'")'});
   
             var layout = '<script language="Javascript" type="text/javascript">function CallParent(datain) { for(var a=0;a<datain.length;a++){\
for(var c in datain[a])\
{\
var obj=datain[a];\
nlapiSelectNewLineItem ("custpage_attachment_sublist" );  nlapiSetCurrentLineItemValue("custpage_attachment_sublist","fileid",obj[c],true,true);\
nlapiSetCurrentLineItemValue("custpage_attachment_sublist","filename",c,true,true);\
nlapiCommitLineItem ( "custpage_attachment_sublist" ); }}}</script>';
    		    var layoutFld = form.addField({id:'custpage_layout', type:serverWidget.FieldType.INLINEHTML,label:'Layout'});
    		    layoutFld.defaultValue = layout;

    		    var btn = form.addSubmitButton({label:'Submit'});
    		    response.writePage(form);    
    		    
    		    
    	  }
    	
    	else
    	{
    		var cc = [];
            var bcc = [];
          var paramsForSuitelet = {};
          var recordtype=request.parameters.custpage_recordtype;
		  temp_rec_val_frm_search = request.parameters.custpage_containreciever;
		  temp_rec_val_frm_email = request.parameters.custpage_rec_frm_cust_email; // added : 02/13/19
    	  paramsForSuitelet.custparam_recordType = recordtype;
    	  var recordid=request.parameters.custpage_recordid;
          paramsForSuitelet.custparam_recordId = recordid;
          var flag_for_reply_op =  request.parameters.custpage_replyop_click;
          paramsForSuitelet.custparam_flag_reply = flag_for_reply_op;
           var recp_val = request.parameters.custpage_temp_rec_val;
          if (recp_val !== '' && recp_val !== undefined && recp_val !== null && recp_val !== '-4'){ // Added. REVERT
           paramsForSuitelet.custparam_recipient = recp_val;
          }
          else { // Added. REVERT
            paramsForSuitelet.custparam_recipient = temp_rec_val_frm_email; // Added.REVERT
          }
    		    var getrecord=record.load({type:recordtype,id:recordid});
    		    var subject=request.parameters.custpage_subject;
    		    var body=request.parameters.custpage_message;
    		    var sender=request.parameters.custpage_author;
    		    var reciever=request.parameters.custpage_recipient;
    		    var tempalte=request.parameters.custpage_selectfield;
    		    var cc_temp=request.parameters.custpage_cc ;
    		    var bcc_temp=request.parameters.custpage_bcc;
    		   /* if(!bcc)
    		      bcc=null;
    		    if(!cc)
    		      cc=null;*/
          if (cc_temp){
            cc.push(cc_temp);
          }
          if(bcc_temp){
            bcc.push(bcc_temp);
          }
    		    var type='';
    		    var filecount = request.getLineCount({group:'custpage_attachment_sublist'}); 
    		    var records={};
    		    if(recordtype=='salesorder' || recordtype=='purchaseorder')
    		    {
    		      records['transaction']=recordid;
                  
    		      type='transaction';
    		    }
    		    else if(recordtype=='customer' || recordtype=='employee')
    		    {
    		      records['entity']=recordid;
    		      type='entity';
    		    }
    		    //nlapiLogExecution('debug','after obj ini',recordid);
    		    var id;
    		    var filefromCabinet=[];
    		    if(filecount>-1)
    		    {
    		      for(var c=0;c<filecount;c++)
    		      {
    		        var fileId=request.getSublistValue({group:'custpage_attachment_sublist',name:"fileid",line:c}); 
    		        filefromCabinet.push(file.load({id:fileId}));
    		        //nlapiLogExecution('debug','after loadin file',filefromCabinet);
    		      }
    		    }

    		    if( recordtype!='employee' && recordtype!="customer")
    		    {
    		      var includeTransactinId=request.parameters.custpage_select;
    		      if(includeTransactinId==1 ||includeTransactinId==2 || includeTransactinId==3 ||includeTransactinId==-1)
    		      {
    		        var htmlcontent;
    		        if( records.transaction)
    		        {
    		          htmlFile = render.transaction({entityId:records.transaction,printMode: render.PrintMode.HTML,formId:246});
    		         
    		        }
    		        else
    		        {
    		          htmlFile= render.statement({entityId:records.entity,printMode: render.PrintMode.HTML});
    		          
    		        }
    		        switch(includeTransactinId)
    		        {
    		          case '1':
    		            body=body+htmlFile.getContents();
    		            break;
    		          case '2':
    		            body=htmlFile.getContents()+body;
    		            break;
    		          case '3':
    		          case '-1':
    		            filefromCabinet.push(htmlFile);
    		            break;
    		            default:
    		            break;

    		        }
    		      }
    		      else if(includeTransactinId==4)
    		      {
    		        if(records.transaction)
    		          filefromCabinet.push(render.transaction({entityId:records.transaction,printMode: render.PrintMode.HTML,formId:246}));//248
    		        // else
    		        // filefromCabinet.push( nlapiPrintRecord('statement',records.entity,'PDF'));
    		      }
    		    }

          /*var entitySearchObj = search.create({
							   //type: "entity",
							   type: "customer",
							   filters:
							   [
								  ["email","is",reciever]
							   ],
							   columns:
							   [
								  search.createColumn({name: "internalid", label: "Internal ID"})
							   ]
							});
          
      entitySearchObj.run().each(function(result){
        temp_rec_val_frm_search = result.getValue({name:'internalid'});
      });   */ 

    	log.debug("Receiver",temp_rec_val_frm_search);
		//email.send({author:25266151,recipients:temp_rec_val_frm_search,subject:subject,body:body,cc:cc,bcc:bcc,relatedRecords:records,attachments:filefromCabinet});
		log.debug("Receiver from email",temp_rec_val_frm_email);//Added : 02/13/19
		if (temp_rec_val_frm_search !== null && temp_rec_val_frm_search !== undefined && temp_rec_val_frm_search !== ''&& temp_rec_val_frm_search !== '-4'){ // Added -4 condition , REVERT if necessary
            log.debug("Transaction value",records.transaction);
          email.send({author:25266151,recipients:temp_rec_val_frm_search,subject:subject,body:body,cc:cc,bcc:bcc,relatedRecords:{transactionId:records.transaction},attachments:filefromCabinet});
		}
		else {
            log.debug("Transaction value",records.transaction);
			email.send({author:25266151,recipients:temp_rec_val_frm_email,subject:subject,body:body,cc:cc,bcc:bcc,relatedRecords:{transactionId:records.transaction},attachments:filefromCabinet});
		}
          
    		    
    		     var  hdnSendAjaxCall=form.addField({id:'custpage_sendajaxcall',type:serverWidget.FieldType.INLINEHTML,label:'Send Ajax'});
    		     //var htmlHeader = form.addField({id:'custpage_popup_close', type:serverWidget.FieldType.INLINEHTML,label:'Inline'});
    		      hdnSendAjaxCall.defaultValue = '<input id="prodId" name="prodId" type="hidden" value="https://system.na3.netsuite.com/app/site/hosting/scriptlet.nl?'+request.parameters.entryformquerystring+'"><script>'+
'function SyncLastEmailRecipientViaSuiteLet(p) {'+

'try {'+
'var allowedRecordTypes = ["customer", "lead", "prospect", "salesorder"];'+
'if (allowedRecordTypes.includes("'+request.parameters.custpage_recordtype+'") == true) {'+
                      'sendRequest(p)'+
'}'+
'}'+
'catch (e) {'+
'console.log("error details: " + e.message);'+
'}'+
'}'+
'function sendRequest(p)'+
'{'+
 'var id= "";'+
'var url=new URL(opener.window.location.href);'+
'var recordType=url.searchParams.get("recordType");'+
'var recordId=url.searchParams.get("recordId");'+
                                     ' if(!recordType || !recordId)'+
   ' {'+
  'url=new URL(document.getElementById("prodId").value);'+
      'recordType=url.searchParams.get("custpage_rectype");'+
     ' recordId=url.searchParams.get("custpage_recid");'+
   ' }  '+
' if(recordType=="salesorder")'+
'{'+
 ' id=nlapiLookupField("salesorder",recordId,"entity")'+
'}'+
'else'+
'{'+
'id=recordId;'+
'}'+
 'var messageSearch = nlapiSearchRecord("message",null,'+
                                       ' ['+
                                         ' ["customer.internalid","anyof",id]'+
                                      '  ],'+
                                    '    ['+
                                         ' new nlobjSearchColumn("internalid"), new nlobjSearchColumn("messagedate").setSort(true)'+
                                      '  ]'+
                                    ');'+

  'if(messageSearch.length>0)'+
 ' {'+
  '  var record=messageSearch[0];'+
    'var columns=record.getAllColumns();'+
   ' var msgid=record.getValue(columns[0]);'+
   ' nlapiLogExecution("DEBUG","MessageID",msgid);'+
'var send_data = [];'+
'send_data.push({ \'get_Message_id\': msgid });'+
'var restUrl = nlapiResolveURL(\'RESTLET\', \'customscript_order_protection_email_sync\', \'customdeploy_order_protection_email_sync\');'+
'var xmlRequest = new XMLHttpRequest();'+
'var xmlOpen = xmlRequest.open("POST", restUrl, true);'+
'xmlRequest.setRequestHeader("Content-Type", "application/json");'+
'xmlRequest.send(JSON.stringify(send_data));'+
'/*jQuery.ajax({'+
'type: \'POST\','+
'contentType: "application/json;",'+
'url: restUrl,'+
'data: JSON.stringify(send_data),'+
'dataType: "json",'+
'beforeSend: function () {'+
'},'+
'success: function (msgesem) {p.close();'+
'}'+
'});*/'+
                                    '}}'+'</script>';
    var htmlHeader = form.addField({id:'custpage_popup_close', type:serverWidget.FieldType.INLINEHTML,label:'Inline'});
    htmlHeader.defaultValue = '<font size="5"  style="color:green">Please Wait for a while <img src="/images/setup/loading.gif" border="0" alt=""></font><script type="text/javascript">if("'+request.parameters.custpage_hdnreply+'"=="yes"){ SyncLastEmailRecipientViaSuiteLet(this) ;  }else{  window.opener.SyncEmailRecipientViaSuiteLet(this);}</script>';
    		    response.writePage(form);
       		
 redirect.toSuitelet({
 scriptId: 'customscript_create_email_instance_be' ,
 deploymentId: 'customdeploy_create_email_instance_be',
 parameters: paramsForSuitelet
});   

    	}
    		
     		
    }

    

    return {
        onRequest: onRequest
    };
    
});