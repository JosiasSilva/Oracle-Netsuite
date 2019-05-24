nlapiLogExecution("audit","FLOStart",new Date().getTime());
var strat_time=new Date().getTime();
function Post_Sale_Creation_Overhaul_UE(type,form)
{
  if(type=='view')
  {
    try
    {
      if(nlapiGetContext().getExecutionContext()!="userinterface")
        return true;
      var soId = nlapiGetRecordId();
      var orderStatus = nlapiGetFieldValue("orderstatus");
      // fullyBilled & Closed
      if(orderStatus=="G" || orderStatus=="H")
      {
        var Url = nlapiResolveURL('SUITELET', 'customscript_post_sale_suitelet', 'customdeploy_post_sale_suitelet_resize');
        Url += '&record='+soId+"&backdata=false";
        nlapiLogExecution("Debug","Url" ,Url);
        form.addButton('custpage_post_sale_overhaul','Create Post-Sale',"window.open('"+Url+"','','width=750,height=550');");//Changed by Ravi on 01/05/2017
        nlapiLogExecution('debug','SO Id :'+soId);
      }
    }
    catch(err)
    {
      nlapiLogExecution("Error","Post Sale Overhaul Button Error","Details: " + err.message);
      //return true;
    }
  }
}

// nlapiLogExecution("debug","Time Details",((new Date().getTime()-strat_time)/1000));  
// nlapiLogExecution("error","Time Details",((new Date().getTime()-strat_time)/1000));
//}
