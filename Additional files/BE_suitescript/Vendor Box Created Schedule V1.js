String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}
function checkGovernance()
{
  var context = nlapiGetContext();
  if(context.getRemainingUsage() < 500)
  {
    var state = nlapiYieldScript();
    if(state.status=="FAILURE")
    {
      nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = " + state.reason + " / Size = "+ state.size);
      throw "Failed to yield script";
    }
    else if(state.status=="RESUME")
    {
      nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason + ".  Size = " + state.size);
    }
  }
}

function Create_Box_Record()
{
  var search_record=nlapiSearchRecord('customrecord_box_record',null,new nlobjSearchFilter('custrecord_po_id',null,'isnotempty'),new nlobjSearchColumn('custrecord_po_id'));
  if(search_record)
  {
    for(var a=0;a<search_record.length;a++)
    {
      try

      {
        var flag_update=true;
        checkGovernance();
        var purchase_order_data=JSON.parse(search_record[a].getValue('custrecord_po_id'));
        if(purchase_order_data)
        {
          for(var b=0;b<purchase_order_data.length;b++)
          {
            checkGovernance();
            try
            {
              var error_po_data=[];
              var order_po= nlapiLoadRecord('purchaseorder',purchase_order_data[b].po_id);
              var index_number=order_po.findLineItemValue ('item' , 'lineuniquekey' , purchase_order_data[b].line_id );
              if(index_number>0)
              {
                flag_update=Error_po_agin_submit(search_record[a].getId(),index_number,order_po,purchase_order_data[b].po_id);
              }
            }
            catch(er){
              nlapiLogExecution('debug','error',"PO ID:- "+purchase_order_data[b].po_id+ "Error:- "+er.message);
              flag_update=false;
            }
          }

        }
        if(flag_update)
        {
          nlapiSubmitField ( 'customrecord_box_record' , search_record[a].getId() , 'custrecord_po_id' ,'' ) ;
        }
      }
      catch(ert){}
    }
  }

}


function Error_po_agin_submit(box_id,index_number,order_po,po_id)
{

  for(var c=0;c<3;c++)
  {
    try
    {
      var get_box_id=order_po.getLineItemValue('item' , 'custcol_box_record_po' ,index_number);
      if(get_box_id!=box_id)
      {
        order_po.setLineItemValue('item' , 'custcol_box_record_po' ,index_number, box_id);
        nlapiSubmitRecord ( order_po , true , true ) ;
      }
      return true;
    }
    catch(er)
    {
      nlapiLogExecution('debug','error',"PO ID:- "+po_id+ "Error:- "+er.message);
    }

  }
  return false;
}

