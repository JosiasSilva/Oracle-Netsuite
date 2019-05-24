nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Push_BE_Engraving_Status_to_Portal(type,form)
{
  try
  {
    var context = nlapiGetContext();
    var contextType = context.getExecutionContext();
    nlapiLogExecution("debug","Current Execution Context","Context: " + contextType);
    if(contextType !="userinterface")
    {
      nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
      return true;
    }
    nlapiLogExecution('DEBUG',"Type:", type);
    if(type=="edit")
    {
      var poId = nlapiGetRecordId();
      nlapiLogExecution('DEBUG',"2175 poId : ", poId);
      var push_to_portal = nlapiLookupField("purchaseorder",poId,"custbody_pushtoportal");
      nlapiLogExecution('DEBUG',"Push to Portal Checkbox Value : ", push_to_portal);
      if(push_to_portal == 'F')
        return;
      Updated_Date_Time(type,poId);
      var obj = PushPOToPortal(poId,"2175");
      obj = JSON.parse(obj);
      if(obj.status == "OK")
      {
        PushCustomerAddress(poId);
        nlapiSetRedirectURL("RECORD","purchaseorder",poId);
      }
      else
      {
        nlapiLogExecution("debug","Message during Push from NS to portal is : ",obj.message);
        nlapiSetRedirectURL("RECORD","purchaseorder",poId);
      }
    }
  }
  catch(err)
  {             
    nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal is : ",err.message);   
    nlapiSetRedirectURL("RECORD","purchaseorder",poId) ;
  }
}

//Added by ajay 01Dec 2016
function PushCustomerAddress(poId)
{
  try
  {		
    var soId = nlapiLookupField("purchaseorder",poId,"createdfrom");
    if(soId != null && soId != "")
    {
      var shipTo = nlapiLookupField("salesorder",soId,"shipaddress");

      if(shipTo != null && shipTo != "")
      {
        var shipAddress = shipTo.split('\n');
        SendNStoPortal(shipAddress,poId,"2175");
      }
    }
    else
    {
      nlapiLogExecution("debug","Sales order record does not link with existing PO");
    }
  }
  catch(ex)
  {
    nlapiLogExecution("debug","Error on pushing ship address is : ",ex.message);
  }
}

function SendNStoPortal(shipAddress,poId,scriptId)
{
  var objJSON = {
    "shipping_address_name" : shipAddress[0],
    "shipping_address_street" : shipAddress[1], 
    "shipping_address_city" : shipAddress[2],
    "shipping_address_country" : shipAddress[3],
    "script_id" : scriptId
  };

  //Setting up URL of CDP  		
  //var url = "https://partner.brilliantearth.com/api/production/po/"+poId+"/customer-address/"; 	
  var url = "https://testportal.brilliantearth.com/api/production/po/"+poId+"/customer-address/"; 	

  //Setting up Headers 
  var headers = new Array(); 
  headers['http'] = '1.1';    
  headers['Accept'] = 'application/json';       						
  //headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';						  
  headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
  headers['Content-Type'] = 'application/json'; 
  headers['User-Agent-x'] = 'SuiteScript-Call';			

  //Stringifying JSON
  var myJSONText = JSON.stringify(objJSON, replacer); 
  nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
  var response = nlapiRequestURL(url, myJSONText, headers); 
  nlapiLogExecution('debug','Ship Address Response Body as Portal Output:', response.body);

  if(response.code==200)
  {
    var responsebody = JSON.parse(response.getBody());	
    nlapiLogExecution("debug", "Portal response for ship address submition is : ",responsebody.message);		
  }
  else
  {	
    nlapiLogExecution("debug","Portal error response is : ",response.body);		
  } 
}
//Ended by ajay 01Dec 2016

function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}
