/*
[DP-411] Push Cost to Portal 
This script will push the updated cost of the a diamond to the diamond portal via schedule script
*/
function Push_Diamond_Cost_To_Portal()
{
  try
  {
    //Saved Search :Update Vendor Cost on Portal: Results id #  8348 For Sandbox
    // var mySearch = nlapiLoadSearch(null, 8348); // For Sandbox
    var mySearch = nlapiLoadSearch(null, 8878); // For Production
    var searchresult = [];
    var resultset = mySearch.runSearch();
    var searchid = 0;
    do 
    {
      var resultslice = resultset.getResults(searchid, searchid + 1000);
      if (resultslice != null && resultslice != '') 
      {
        for (var rs in resultslice) 
        {
          searchresult.push(resultslice[rs]);
          searchid++;
        }
      }
    } while (resultslice.length >= 1000);
    var searchCount = searchresult.length;
    if (searchCount > 0) 
    {
      for(var j = 0; j <searchresult.length; j++)
      {
        if (nlapiGetContext().getRemainingUsage() < 500) {
          var stateMain = nlapiYieldScript();
          if (stateMain.status == 'FAILURE') {
            nlapiLogExecution("DEBUG", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
            throw "Failed to yield script";
          } else if (stateMain.status == 'RESUME') {
            nlapiLogExecution("DEBUG", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
          }
        }
        var cdp_id = searchresult[j].getId(); // CDP ID
        var vendor_cost= searchresult[j].getValue('formulacurrency');// Vendor Cost
        var vendor_stock_no= searchresult[j].getValue('custrecord_vendor_stock_number');// Vendor Stock No
        var diamond_stock_no= searchresult[j].getValue('custrecord_be_diamond_stock_number');// Dimaond Stock No
        if((diamond_stock_no !='' && diamond_stock_no!=null) && (vendor_stock_no!='' && vendor_stock_no !=null))
        {
          if(vendor_cost=='' || vendor_cost==null)
            vendor_cost = 0;
          var result = Push_Diamond_Cost_NS_To_Portal(cdp_id,vendor_cost,vendor_stock_no,diamond_stock_no);
          nlapiLogExecution('DEBUG','CDP Vendor Cost Response Code From Portal with sno: ' + (j+1) +' having Cdp Id:'+ cdp_id, result.getCode());
          nlapiLogExecution('DEBUG','Response Body Output From Poratl with sno: ' + (j+1) +' having Cdp Id :'+ cdp_id, result.getBody()); 
          if(result.getCode() == 200)
          {
            nlapiLogExecution('DEBUG',"Information for push cost to portal" ,'Successfully Pushed diamond cost to Portal with sno: ' + (j+1) +' having CdpId :' + cdp_id);
          }
          else
          {
            nlapiLogExecution('DEBUG','Diamond cost sync error for with sno: ' + (j+1) +' having CdpId :'+ cdp_id, result.getError());
          }
        }
        else
        {
          nlapiLogExecution('DEBUG',"Saved Search Information" ,'Either Be Stock No or Vendor Stock No is empty or blank with sno: ' + (j+1) +' having CdpId :' + cdp_id);
        }
      }
    }
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error Saved Search 8348",ex.message);
  }
}

function  Push_Diamond_Cost_NS_To_Portal(cdp_id,vendor_cost,vendor_stock_no,diamond_stock_no)
{
  var url = "https://testportal.brilliantearth.com/api/item/";  
  //var url = "https://partner.brilliantearth.com/api/item/";     
  var headers = new Array(); 
  headers['http'] = '1.1';    
  headers['Accept'] = 'application/json';            
  //headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';	
  headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
  headers['Content-Type'] = 'application/json'; 
  headers['User-Agent-x'] = 'SuiteScript-Call';

  var jsonobj = {
    "cdp_id"      :   cdp_id,
    "cost"        :   vendor_cost,
    "stock_no"    :   vendor_stock_no,
    "be_stock_no" :   diamond_stock_no
  }
  //Stringifying JSON
  var myJSONText = JSON.stringify(jsonobj, replacer); 
  nlapiLogExecution('debug','CDP Vendor Cost Response Body From NS:', myJSONText);
  var response = nlapiRequestURL(url, myJSONText, headers);  
  return response;
}
function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}