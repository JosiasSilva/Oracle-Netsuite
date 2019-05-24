nlapiLogExecution("audit","FLOStart",new Date().getTime());
function AppointmentCall(type,form)
{
   nlapiLogExecution('DEBUG',' Before Submit Script type:'+type);    

   var url = 'https://debugger.netsuite.com/app/site/hosting/restlet.nl?script=626&deploy=1';
//url += '&orderId=' + encodeURIComponent(orderId);
//url += '&customerId=' + encodeURIComponent(customerId);
//url = url + 'profile_id=' + '$base64(('aaguilar@brilliantearth.com'))';
//url = url + '&profile_key=' + '{'b11485f945288e617bc193b11de82d0a'}'; //c4fnfulqjurn5l3ac3sj9optu1 //New Session Token

var response = nlapiRequestURL(url, null, null, null);

   nlapiLogExecution('DEBUG',' After Submit Script  type:'+ response.getBody() );    
}