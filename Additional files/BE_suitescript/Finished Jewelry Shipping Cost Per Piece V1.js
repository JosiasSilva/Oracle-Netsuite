nlapiLogExecution("audit","FLOStart",new Date().getTime());
function set_shipping_cost()
{
  var category_obj=['5','6','4','34','9'];
  var internalid_check='0';
  do
  {
    try
    {
      Reset_Script();
      var filter=[];
      filter.push(new nlobjSearchFilter('type',null,'anyof',['PurchOrd','VendBill']));
      filter.push(new nlobjSearchFilter('custbody_fj_shipping_cost_per_price',null,'isempty'));
      filter.push(new nlobjSearchFilter('datecreated',null,'within',['daysago10','daysago0']));
      filter.push(new nlobjSearchFilter('account',null,'anyof','89'));
      filter.push(new nlobjSearchFilter('internalidnumber',null,'greaterthan',internalid_check));
      var column=[];
      column.push(new nlobjSearchColumn('internalid',null,'group').setSort(false));
      column.push(new nlobjSearchColumn('type',null,'group'));
      var searh_record=nlapiSearchRecord('transaction',null,filter,column);
      if(searh_record)
      {
        var col=searh_record[0].getAllColumns();
        var get_trans_id=[];
        for(var a=0;a<searh_record.length;a++)
        {
          internalid_check=searh_record[a].getValue(col[0]);
          get_trans_id.push(internalid_check);	  
        }   
        var filter_new=[];
        filter_new.push(new nlobjSearchFilter('quantity',null,'isnotempty'));
        filter_new.push(new nlobjSearchFilter('custcol_category',null,'anyof',category_obj));
        filter_new.push(new nlobjSearchFilter('internalid',null,'anyof',get_trans_id));
        Reset_Script();
        var searh_record_new=nlapiSearchRecord('transaction',null,filter_new,column);

        if(searh_record_new)
        {   
          var col=searh_record_new[0].getAllColumns();
          for(var a=0;a<searh_record_new.length;a++)
          {
            try
            {
              var obj_id=searh_record_new[a].getValue(col[0]);
              var obj_record_type=searh_record_new[a].getValue(col[1]);
              if(obj_record_type=='PurchOrd'){obj_record_type='purchaseorder'}else{obj_record_type='vendorbill'; }
              var record_load=nlapiLoadRecord(obj_record_type,obj_id);
              var expene_account=0;
              var quantity=0;
              for(var b=1;b<=record_load.getLineItemCount('expense');b++)
              {
                if(record_load.getLineItemValue('expense','account',b)=='89')
                {
                  expene_account+=parseFloat(record_load.getLineItemValue('expense','amount',b));
                }	    
              }         
              for(var c=1;c<=record_load.getLineItemCount('item');c++)
              {
                var get_categpry=record_load.getLineItemValue('item','custcol_category',c);
                if(category_obj.indexOf(get_categpry)>=0)
                {
                  quantity+=parseFloat(record_load.getLineItemValue('item','quantity',c));
                }

              }

              if(expene_account && quantity && expene_account>0 && quantity>0)
              {
                var shipping_cost=(expene_account/quantity);
                try
                { 
                  Reset_Script();
                  shipping_cost=shipping_cost.toFixed(2);
                  nlapiSubmitField ( obj_record_type , obj_id , 'custbody_fj_shipping_cost_per_price' , shipping_cost);
                  var details="Record Type :- " +obj_record_type +' >>  Record ID :-'+obj_id+' >>  FJ shipping cost per piece  :- '+ shipping_cost; 
                  nlapiLogExecution ( 'debug' , 'details' , details ); 
                }
                catch(er){}
              }
            }
            catch(er){}

          }
        }
      }
    }
    catch(er){}
  }while(searh_record);
}
function Reset_Script()
{
  if (nlapiGetContext().getRemainingUsage() <= 500){
    nlapiLogExecution('debug', 'nlapiGetContext().getRemainingUsage()', nlapiGetContext().getRemainingUsage());
    var stateMain = nlapiYieldScript(); 
    if( stateMain.status == 'FAILURE'){ 
      nlapiLogExecution("debug","Failed to yield script (do-while), exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size); 
      throw "Failed to yield script"; 
    } 
    else if ( stateMain.status == 'RESUME' ){ 
      nlapiLogExecution("debug", "Resuming script (do-while) because of " + stateMain.reason+". Size = "+ stateMain.size); 
    } 
  }
}