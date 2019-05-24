nlapiLogExecution("audit","FLOStart",new Date().getTime());
function beforeLoad(type,form)
{
  try
  {
    var currentContext = nlapiGetContext();
    if ((currentContext.getExecutionContext() == 'userinterface') && (type == 'edit' || type == 'view'))
    {
     // var result = nlapiSearchRecord(null,6300, new nlobjSearchFilter('createdfrom',null,'anyOf',nlapiGetRecordId()));//Sandbox
      var result = nlapiSearchRecord(null,7440, new nlobjSearchFilter('createdfrom',null,'anyOf',so_id));//Production
      if(result)
      {
        changeTitleBackground(form,type);
      }
    }

  }
  catch(ex)
  {
    nlapiLogExecution("debug","Error", ex.message);
  }
}

function changeTitleBackground(form,type) {
  var highValueCheckFld = form.addField("custpage_high_val_cust", "inlinehtml", "High Value");
  var html="<script type='text/javascript'>\
document.onreadystatechange = function(){\
if(document.readyState === 'complete'){";
  html+="var div= document.getElementById('tranid_fs_lbl_uir_label').parentNode;\
div.setAttribute('style', 'background-color:#DDA0DD');";
  if(type=='edit')
  {
    html+="var val= document.getElementById('tranid');\
val.setAttribute('style', 'background-color:#DDA0DD');";
  }
  html+="}}</script>";
  highValueCheckFld.setDefaultValue(html);
}