var MINIMUM_USAGE=500;

function Set_Message()
{
  checkGovernance();
  do
  {
    var load_diployemnet=nlapiLoadRecord('scriptdeployment',8841 );
    var get_max_number=load_diployemnet.getFieldValue('custscript_set_message_id');
    if(!get_max_number){get_max_number=0;}
    var filter_new=[];
    filter_new.push(new nlobjSearchFilter('internalidnumber','messages','greaterthan',get_max_number));
    filter_new.push(new nlobjSearchFilter('custentity_date_time_last_email',null,'noton','today'));
    var Search_customer=nlapiSearchRecord('customer',null,filter_new,[ 
      new nlobjSearchColumn('stage',null,'group'),  new nlobjSearchColumn('internalid',null,'group').setSort(false)]);
    if(Search_customer)
    {

      var col=Search_customer[0].getAllColumns();
      for(var a=0;a<Search_customer.length;a++)
      {

        checkGovernance();
        var cust_id=Search_customer[a].getValue(col[1]);
        var get_latest_email=nlapiSearchRecord('customer',null,new nlobjSearchFilter('internalid',null,'anyof',cust_id),new nlobjSearchColumn('internalid','messages').setSort(true));
        if(get_latest_email)
        {
          var get_number_id=get_latest_email[0].getValue(get_latest_email[0].getAllColumns()[0]);
          var get_number_new_id=(parseInt(get_number_id)-parseInt(get_max_number));
          if(get_number_new_id>0)
          {
            nlapiLogExecution("debug","Customer Id", cust_id);
            get_max_number=get_number_id;
            try{ Update_Email_Update(get_max_number);}catch(er){}
            nlapiLogExecution("debug","Message Id", get_max_number);
          }
        }

      }
    }
    nlapiLogExecution("debug",'get_max_number',get_max_number);
    load_diployemnet.setFieldValue('custscript_set_message_id',get_max_number);
    nlapiSubmitRecord ( load_diployemnet); 

  }
  while(Search_customer);  
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