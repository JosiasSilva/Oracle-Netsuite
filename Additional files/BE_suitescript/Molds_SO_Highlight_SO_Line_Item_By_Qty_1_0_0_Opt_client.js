function Molds_SO_Set(type,name)
{
  try
  {

    var molds = [];
    var item = nlapiGetCurrentLineItemValue("item","item");
    var vendor = nlapiGetCurrentLineItemValue("item","povendor");
    if(item && vendor)
    {
      var obj_data = (nlapiRequestURL("/app/site/hosting/scriptlet.nl?script=1172&deploy=1&item="+item+"&vendor="+vendor+"&index_number=0").getBody());  
      if(obj_data)
      {
        var get_data=JSON.parse(obj_data);
        nlapiSetCurrentLineItemValue("item","custcol_molds_so",get_data);
      }
      else
        {
           nlapiSetCurrentLineItemValue("item","custcol_molds_so",'');
        }
      return true;
    }
  }
  catch(err)
  {
    nlapiLogExecution("error","Error Showing Molds On SO","Details: " + err.message);
    return true;
  }
  return true;
}





/*
  function Molds_SO_Set(type,form)
  {
    if(type=="edit")
    {
      try
      {
        if(nlapiGetContext().getExecutionContext()!="userinterface")
          return true;

        var lineItemCount = nlapiGetLineItemCount('item');

        for(var x=0; x < lineItemCount; x++)
        {
          //Molds SO Script
          var molds = [];
          var item = nlapiGetLineItemValue("item","item",x+1);
          var vendor = nlapiGetLineItemValue("item","povendor",x+1);
          var quantity = nlapiGetLineItemValue('item','quantity',x+1);
          Get_Ajax_call(item,vendor,quantity,(x+1));
        }
      }
      catch(err)
      {
        nlapiLogExecution("error","Error Showing Molds On SO","Details: " + err.message);
        return true;
      }
    }
  }



function Get_Ajax_call(item,vendor,index_number)
{

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(xhttp.responseText)
      {
        alert(xhttp.responseText);
        var get_data=JSON.parse(xhttp.responseText);
        var index_number=get_data.line_number;
        var molds_so=get_data.custcol_molds_so;
        nlapiSetLineItemValue("item","custcol_molds_so",index_number,molds_so);
      }
    }
  };
  xhttp.open("GET", "/app/site/hosting/scriptlet.nl?script=1241&deploy=1&item="+item+"&vendor="+vendor+"&index_number="+index_number, true);
  xhttp.send();
}
  */