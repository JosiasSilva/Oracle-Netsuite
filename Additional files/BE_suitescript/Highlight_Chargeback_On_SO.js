nlapiLogExecution("audit","FLOStart",new Date().getTime());
function beforeLoad(type,form)
{
  try
  {
    if(nlapiGetContext().getExecutionContext() == 'userinterface')
    {
      var obj_so= nlapiLoadRecord('salesorder',nlapiGetRecordId());
      var chargeback_count=obj_so.getLineItemCount('recmachcustrecordsales_order_chargeback');

      if(chargeback_count>0)
      {

        highlightChargbackOnSO(form,type);
      }
    }

  }
  catch(ex)
  {
    nlapiLogExecution("Error","Error", ex.message);
  }
}

function highlightChargbackOnSO(form,type) {
  var chargeback_highlight = form.addField("custpage_highlight_chargeback", "inlinehtml", "Chargeback");
  var html="<script type='text/javascript'>\
document.onreadystatechange = function(){\
if(document.readyState === 'complete'){";
  var inner_html = '<h1 class="uir-record-type" style="background-color:orange">Chargeback</h1>';
  html+="var div_h = document.getElementsByClassName('uir-page-title-firstline');";
  html+="div_h[0].innerHTML=div_h[0].innerHTML+'"+inner_html+"'";
  html+="}}</script>";
  chargeback_highlight.setDefaultValue(html);
}
