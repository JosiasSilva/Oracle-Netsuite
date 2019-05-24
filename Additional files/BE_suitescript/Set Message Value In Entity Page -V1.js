var MINIMUM_USAGE=100;
function Set_Message()
{

  var get_max_number=0;
  var get_email_id=[];

  do
  {
    var load_diployemnet=nlapiLoadRecord('scriptdeployment',8841 );
    var get_last_id=load_diployemnet.getFieldValue('custscript_set_message_id');
    var Search_customer=nlapiSearchRecord('customer',null,new nlobjSearchFilter('internalidnumber','messages','greaterthan',get_last_id),[ 
      new nlobjSearchColumn('stage',null,'group'),  new nlobjSearchColumn('internalid',null,'group').setSort(false)]);
    if(Search_customer)
    {
      var col=Search_customer[0].getAllColumns();
      for(var a=0;a<Search_customer.length;a++)
      {
        var get_latest_email=nlapiSearchRecord('customer',null,new nlobjSearchFilter('internalid',null,'anyof',Search_customer[a].getValue(col[1])), 
                                               new nlobjSearchColumn('internalid','messages').setSort(true));
        if(get_latest_email)
        {
          var get_number_id=get_latest_email[0].getValue(get_latest_email[0].getAllColumns()[0]);
          get_email_id.push(get_number_id);
          if(get_number_id>get_max_number){ 
            get_max_number=get_number_id;
          }

        }

      }
    }
    if(get_email_id.length>0)
    {
      for(var c=0;c<get_email_id.length;c++)
      {
        checkGovernance();
        Update_Email_Update(get_email_id[c]);
      }
      load_diployemnet.setFieldValue('custscript_set_message_id',get_max_number);
      nlapiSubmitRecord ( load_diployemnet); 
    }
  }
  while(Search_customer)
}

function checkGovernance() {
  var context = nlapiGetContext();
  if (context.getRemainingUsage() < MINIMUM_USAGE) {
    var state = nlapiYieldScript();
    if (state.status == 'FAILURE') {
      nlapiLogExecution("ERROR",
                        "Failed to yield script, exiting: Reason = " + state.reason
                        + " / Size = " + state.size);
      throw "Failed to yield script";
    }
  }
}