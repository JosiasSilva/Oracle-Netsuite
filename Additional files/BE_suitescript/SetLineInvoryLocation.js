nlapiLogExecution("audit","FLOStart",new Date().getTime());
function After_SubmitLoc(type)
{
   try
   {
	    nlapiLogExecution("debug","Event type after submit event is :",type);
            nlapiLogExecution("debug","Record type is :",nlapiGetRecordType());
        if( type == "create" || type == "edit"){
         if(nlapiGetRecordType() == "vendorbill" || nlapiGetRecordType() == "check" || nlapiGetRecordType() == "vendorcredit"){
            var obj = nlapiLoadRecord(nlapiGetRecordType(),nlapiGetRecordId());
	    var count = obj.getLineItemCount("expense");
		var newCount = nlapiGetLineItemCount("expense");
	    nlapiLogExecution("debug","Line item count after submit event is :",count);
		nlapiLogExecution("debug","New Line item count after submit event is :",newCount);
	    for(var i=1; i <= count; i++)
	    {
            var loc = obj.getLineItemValue("expense","location",i);
			var newLoc = nlapiGetLineItemValue("expense","location",i);
			var editLoc = 0;
			nlapiLogExecution("debug","Line item location value after submit event default is :"+i,loc);
			nlapiLogExecution("debug","Line item location value after submit event edit is :"+i,newLoc);
			if(loc == 2 && newLoc == 2){							
				obj.selectLineItem("expense",i);
				editLoc = nlapiGetCurrentLineItemValue("expense","location");
				nlapiLogExecution("debug","Current Line item1 location value is :"+i,editLoc);
				obj.setCurrentLineItemValue("expense","location",newLoc);
				obj.commitLineItem("expense");
			}
			  else if(newLoc == ""){
				obj.selectLineItem("expense",i);
				editLoc = nlapiGetCurrentLineItemValue("expense","location");
				nlapiLogExecution("debug","Current Line item2 location value is :"+i,editLoc);
				obj.setCurrentLineItemValue("expense","location","");
				obj.commitLineItem("expense"); 
			}
			else{
				obj.selectLineItem("expense",i);
				editLoc = nlapiGetCurrentLineItemValue("expense","location");
				if(newLoc !=2 && newLoc != editLoc){
					nlapiLogExecution("debug","Current Line item3 location value is :"+i,editLoc);
					obj.setCurrentLineItemValue("expense","location",newLoc);
					obj.commitLineItem("expense");
				}
				else{
					nlapiLogExecution("debug","Current Line item4 location value is :"+i,editLoc);
					obj.setCurrentLineItemValue("expense","location","");
					obj.commitLineItem("expense");  
				}
			}
	    }
           var id = nlapiSubmitRecord(obj,true,true);
           nlapiLogExecution("debug"," submit record id is :",id);            
          }//End Record Type         
      }//End event type
   }
   catch(err)
   {
		nlapiLogExecution("debug","Error occur after submit function is :",err.message);
   }
}