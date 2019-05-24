nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updateEngravingStatus(type,form)
{
  try
  {
    var so_id = nlapiGetRecordId();
    var so_obj = nlapiLoadRecord('salesorder',so_id);
    var be_engraving_status = so_obj.getFieldValue('custbody348');
    var line_count = so_obj.getLineItemCount('links');
    for(var i = 1; i<=line_count; i++)
    {
      var rec_type = so_obj.getLineItemValue('links','type',i);
      if(rec_type== "Purchase Order")
      {
        var link_po = so_obj.getLineItemValue('links','id',i);
        if(link_po)
        {
          nlapiSubmitField('purchaseorder',link_po,'custbody348',be_engraving_status,false);
          nlapiLogExecution('debug','record submitted successfully');
          Push_BE_Engraving_Status_to_Portal(link_po);
        }
      }
    }
  }
  catch(ee)
  {
    nlapiLogExecution('debug','error',ee.message);
  }
}
nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Push_BE_Engraving_Status_to_Portal(poId)
{
  try
  {
    nlapiLogExecution('DEBUG',"933 poId : ", poId);
    var push_to_portal = nlapiLookupField("purchaseorder",poId,"custbody_pushtoportal");
    nlapiLogExecution('DEBUG',"Push to Portal Checkbox Value : ", push_to_portal);
    if(push_to_portal == 'F')
      return;
    var old_be_engraving_status = nlapiGetOldRecord().getFieldValue("custbody348");
    nlapiLogExecution("DEBUG","Old Be Engraving Status","old Be Engraving Status value is : "+ old_be_engraving_status);
    var new_be_engraving_status = nlapiGetNewRecord().getFieldValue("custbody348");
    nlapiLogExecution("DEBUG","New Be Engraving Status","New Be Engraving Status value is : "+ new_be_engraving_status);
    if(new_be_engraving_status!='' && new_be_engraving_status!=null)
    {
      if(new_be_engraving_status != old_be_engraving_status)
      {
        var obj = PushPOToPortal(poId);
        obj = JSON.parse(obj);
        if(obj.status == "OK")
        {
          PushCustomerAddress(poId);
        }
        else
        {
          nlapiLogExecution("debug","Message during Push from NS to portal is : ",obj.message);
        }
      }
    }
  }
  catch(err)
  {             
    nlapiLogExecution("debug","Error occur during Push from NS to portal is : ",err.message);   
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
        SendNStoPortal(shipAddress,poId);
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

function SendNStoPortal(shipAddress,poId)
{
  var objJSON = {
    "shipping_address_name" : shipAddress[0],
    "shipping_address_street" : shipAddress[1], 
    "shipping_address_city" : shipAddress[2],
    "shipping_address_country" : shipAddress[3]						
  };

  //Setting up URL of CDP  		
  var url = "https://partner.brilliantearth.com/api/production/po/"+poId+"/customer-address/"; 	
  //var url = "https://testportal.brilliantearth.com/api/production/po/"+poId+"/customer-address/"; 	

  //Setting up Headers 
  var headers = new Array(); 
  headers['http'] = '1.1';    
  headers['Accept'] = 'application/json';       						
  headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';						  
  //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
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
