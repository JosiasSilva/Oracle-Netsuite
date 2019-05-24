nlapiLogExecution("audit","FLOStart",new Date().getTime());
function  Page_Init(type)
{     
  nlapiSetFieldValue('custbodyaction',type);  
}

function ClientValidateLine(type)
{
  try
  {  
    if(nlapiGetFieldValue('custbodyaction') == 'edit')
    {       
      var salesObj = nlapiLoadRecord('salesorder',nlapiGetRecordId());
      var status = salesObj.getFieldValue('status');
      if( status == 'Pending Fulfillment')
      {          
        if (type=='item') 
        {          
          var specialOrderLine = nlapiGetCurrentLineItemValue('item','createpo');
          if((specialOrderLine != null || specialOrderLine !='') && (specialOrderLine != 'SpecOrd') && (specialOrderLine != 'DropShip'))
          {
             return true;
          }             
          else
          {
             alert('This item is already in production, please task OM for any adjustments you would like to make.');
          }
        }
      }
      else
      {
         return true;
      }
    }
    else
    {
       return true;
    }
  }
  catch(e)
  {
    nlapiLogExecution("error",e.message);
    return true;
  }
}





