nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SavedPurchaseOrder(type)
{
    if( type == 'create' || type == 'edit')
    {
        nlapiLogExecution("debug","Event Type :",type);
        nlapiLogExecution("debug","Purchase Order Id :",nlapiGetRecordId());
        //var objPO = nlapiLoadRecord('purchaseorder',4873331);
        var objPO = nlapiLoadRecord('purchaseorder',nlapiGetRecordId());
        var createdFromId = objPO.getFieldValue('createdfrom');
        var dateNeededInSF = objPO.getFieldValue('custbody59');
        var createdFrom = nlapiLookupField('purchaseorder',nlapiGetRecordId(),'createdfrom',true);

        if( createdFrom != '' && createdFromId != null)
        {
            if(createdFrom.indexOf('Sales Order') != -1)
           {
               //For Filters logic 
               var filters = [];
               filters[0] = new nlobjSearchFilter('createdfrom', null, 'is', createdFromId);
               var searchresults = nlapiSearchRecord('returnauthorization', null, filters, []); 
               if(searchresults != null)
              {    
                  var id = searchresults[0].id;
                  UpdateReturnAuthorization(id,dateNeededInSF);     
              }
          }
      }
   }
}

function UpdateReturnAuthorization(id,dateNeededInSF)
{
   var objReturnAuth = nlapiLoadRecord('returnauthorization',id);
   objReturnAuth.setFieldValue('custbody268',dateNeededInSF);
   var Id = nlapiSubmitRecord(objReturnAuth,true,true);
   nlapiLogExecution("debug","Submit Return Auth Id :",Id);
}










