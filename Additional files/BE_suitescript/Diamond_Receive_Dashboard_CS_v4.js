nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Save_Validate()
{


for(var x=1; x <= nlapiGetLineItemCount ( 'custpage_list') ; x++)
			{
if(nlapiGetLineItemValue('custpage_list', 'custpage_changed', x) =="T")
{
     return true;
 }
 }
//alert('Please select at least one record to update.');
return true;

}

function Receive()
{

var Po_Multiple=[];
var Checkvalue=false;
for(var x=1; x <= nlapiGetLineItemCount ( 'custpage_list') ; x++)
{
if(nlapiGetLineItemValue('custpage_list', 'custpage_recive_check', x) =="T")
{

Po_Multiple.push({
InternalId:nlapiGetLineItemValue('custpage_list', 'custpage_po_id', x),
CERTIFICATE_INCLUDED:nlapiGetLineItemValue('custpage_list', 'custpage_certificate_included', x),
DIAMOND_INSCRIPTION:nlapiGetLineItemValue('custpage_list', 'custpage_diamond_inscription', x),
IMPORTANT_NOTES:nlapiGetLineItemValue('custpage_list', 'custpage_important_notes', x),
DATE_NEEDED_IN_SF:nlapiGetLineItemValue('custpage_list', 'custpage_date_needed_in_sf', x),
LineID:nlapiGetLineItemValue("custpage_list","custpage_po_line",x)
});

Checkvalue=true;
}
}
if(Checkvalue)
{

 window.onbeforeunload = null;
 var linkURL = nlapiResolveURL('SUITELET', 'customscriptupdatereceiptpo_suitelet','customdeployupdatereceiptpo_suitelet',   'internal');
   var url=linkURL +'&MultiPurchase='+encodeURIComponent(JSON.stringify(Po_Multiple)) ;
 window.open(url,"_self");
}
else
{
alert('Please select at least one receive.');
}
}