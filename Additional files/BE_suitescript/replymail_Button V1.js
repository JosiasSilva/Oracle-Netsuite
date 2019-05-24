/*
 * Script Author :  Saurabh Mishra(suarabh.mishra@inoday.com)
 * Author Desig. :  Netsuite Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   :  User Event Script
 * Script Name   :  Replying to emails as CSS
 * Script File   :  replymail_Button.js  (New Version)
 * Updated Date  :  May 23, 2018
 */

function set_reply_Mail(type,form)
{
   var fld=form.addField('custpage_inline','inlinehtml');
  //debugger;
  form.addButton("custpage_sendmail","Reply as CSS","openCustomCssEmailSuiteletPage()");
  var str='\
function openCustomCssEmailSuiteletPage()\
{debugger;var messageid = nlapiGetRecordId();\
if(opener)\
{\
var custpage_recordid =opener.nlapiGetRecordId();\
var  custpage_recordtype= opener.nlapiGetRecordType();\
}\
else\
{\
  var url_string = window.location.href;\
var url = new URL(url_string);\
 custpage_recordid = url.searchParams.get("recordId");\
  custpage_recordtype=url.searchParams.get("recordType");\
}\
var email="";\
if(custpage_recordtype=="salesorder")\
{\
email=nlapiLookupField(custpage_recordtype,custpage_recordid,"custbody2");\
}\
else if(custpage_recordtype=="customer" || custpage_recordtype=="employee")\
{\
  email=nlapiLookupField(custpage_recordtype,custpage_recordid,"email");\
}\
if(messageid){\
window.open("/app/site/hosting/scriptlet.nl?script=2217&deploy=1&msgId="+messageid+"&custpage_recid="+custpage_recordid+"&custpage_rectype="+custpage_recordtype+"&customerEmail="+email+"&reply=yes",\"Reply As CSS\",\"width=700,height=500\");\
}\
}\
';
  fld.setDefaultValue("<script>"+str+"</script>");
  }