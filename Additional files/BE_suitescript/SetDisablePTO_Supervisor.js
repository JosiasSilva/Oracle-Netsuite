nlapiLogExecution("audit","FLOStart",new Date().getTime());
// /app/common/scripting/script.nl?id=1070&whence=   :- new script
// /app/common/workflow/setup/nextgen/workflowdesktop.nl?id=116&whence=# :- inactive
function Check_PTO_Status(type)
{
    if(type == "edit"){
        var current_user = nlapiGetUser();
	var pto_supervisor	= nlapiLookupField ( 'customrecord_pto' , nlapiGetRecordId() , "custrecord_pto_other_supervisor");
      nlapiLogExecution('debug','PTO Supervisor',pto_supervisor);
	var supervisor	= nlapiLookupField ( 'customrecord_pto' , nlapiGetRecordId() , "custrecord_pto_supervisor");
      nlapiLogExecution('debug','Supervisor',supervisor);
	var pto_arr=[];	
	var fixed_User = [-5,1877,477470]; //Beth  Gerstein,Eric Grossberg,Jaime Yas
	if (pto_supervisor != null)
    {
		pto_arr=pto_supervisor.split(',');
	}
       if ((current_user != null) && (current_user != ''))
       {
         var index = fixed_User.indexOf(current_user);
         nlapiLogExecution("debug","matching index value is : ",index);
		if((supervisor == current_user) || (pto_arr.indexOf(current_user) != -1) || (fixed_User.indexOf(current_user) != -1))
		{
			nlapiDisableField('custrecord_pto_status', false);
			nlapiLogExecution("debug","Disable PTO Status Field for current user Id : "+current_user);
		}
		else
		{
            var current_user = nlapiGetUser();
			nlapiDisableField('custrecord_pto_status', true);
			nlapiLogExecution("debug","Disable PTO Status Field for current user Id : "+current_user);
		}
	}
   }//end event type
   if(type == "create")
   {
         var current_user = nlapiGetUser();
         nlapiDisableField('custrecord_pto_status', true);
	     nlapiLogExecution("debug","Disable PTO Status Field for current user Id : "+current_user);
   }
}