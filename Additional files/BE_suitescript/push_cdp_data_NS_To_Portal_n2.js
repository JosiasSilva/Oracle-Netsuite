nlapiLogExecution("audit","FLOStart",new Date().getTime());
//Set Hyperlink of Portal Record Url
function Before_Load(type,form)
{
  //nlapiLogExecution("debug","event type is :",type);
  if(type == "view" || type == "edit")
  {
    var url  = nlapiLookupField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord_hidden_portal_url");
    //nlapiLogExecution("debug","Portal Diamond Record Url is :",url);

    if(url != null && url != "")
    {
      form.getField('custrecord_portal_record_url').setLinkText(url).setDefaultValue(url);
    }

  }
  // START HERE FOR DP-474
  var context = nlapiGetContext();
  var record_type = nlapiGetRecordType();
  var contextType = context.getExecutionContext();
  nlapiLogExecution("debug","context type is (WF):",contextType);
  if(type == "view")
  {
    var temp_portal_request_type  = nlapiLookupField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord267");
    nlapiLogExecution("debug","Temp Portal Request Type :",temp_portal_request_type +" having cdp id ::" +  nlapiGetRecordId() );
    if(temp_portal_request_type != '' && temp_portal_request_type != null)
    {
      nlapiSubmitField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord165",temp_portal_request_type); 
      nlapiLogExecution("debug","Portal Request Type Info (WF 1)","Portal request type updated successfully having cdp id ::" +  nlapiGetRecordId());
      nlapiSubmitField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord267",'');
      nlapiLogExecution("debug","Portal Request Type Info (WF 2)","Temp portal request has been reset successfully having cdp id ::" +  nlapiGetRecordId());
    }
  }
  //END HERE 
  //START HERE
  /*if(contextType =="workflow")
  {
    //var portal_request_type  = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord165");
    //var cdpFields =  nlapiLookupField("customrecord_custom_diamond",cdpId,["custrecord_custom_diamond_percent_paid","custrecord165"]);
    var cdpId = nlapiGetRecordId();
    var cdp_obj = nlapiLoadRecord('customrecord_custom_diamond', cdpId);
    var percent_paid = cdp_obj.getFieldValue('custrecord_custom_diamond_percent_paid');
    var portal_request_type = cdp_obj.getFieldValue('custrecord165');
    nlapiLogExecution('Debug',"% Paid (WF)",percent_paid);
    nlapiLogExecution('Debug',"Portal Request Type (WF)",portal_request_type);
    //var percent_paid =  cdpFields.custrecord_custom_diamond_percent_paid;
    if(percent_paid!='' && percent_paid!=null)
    {
      percent_paid=percent_paid.split('%')[0];
      if(percent_paid >= 20)
      {
        nlapiSubmitField("customrecord_custom_diamond",cdpId,"custrecord165", 3);
        nlapiLogExecution('Debug',"Portal Request Type info (WF)","Portal Request Type has been updated successfully");
      }
    }
  }*/
  //END HERE
  // DP-414
  /*if(type == "view")
  {
    try
    {
      var cdp_id = nlapiGetRecordId();
      nlapiLogExecution("debug","cdp_id(test) :",cdp_id);
      var date_expected_at_be = nlapiLookupField("customrecord_custom_diamond",cdp_id,"custrecord_date_expected_at_be");
      nlapiLogExecution("debug","date_expected_at_be(Test) :",date_expected_at_be);
      var date_expected_at_be_checkbox = nlapiLookupField("customrecord_custom_diamond",cdp_id,"custrecord_date_expected_at_be_checkbox");
      nlapiLogExecution("debug","date_expected_at_be checkbox(Test) :",date_expected_at_be_checkbox);
      if(date_expected_at_be =='' || date_expected_at_be ==null)
      {
        if(date_expected_at_be_checkbox == 'T')
        {
          nlapiSubmitField("customrecord_custom_diamond",cdp_id,"custrecord_date_expected_at_be_checkbox","F"); 
          //nlapiLogExecution("debug","111:");
        }
      }
      if(date_expected_at_be !='' && date_expected_at_be!=null)
      {
        if(date_expected_at_be_checkbox == 'F')
        {
          //nlapiLogExecution("debug","222:");
          var result = Push_Date_Expected_At_Be_To_Portal(cdp_id,date_expected_at_be);
          nlapiLogExecution('DEBUG','Response Body Output From Poratl having Cdp Id :'+ cdp_id, result.getBody());
          if(result.getCode() == 200)
          {
            nlapiSubmitField("customrecord_custom_diamond",cdp_id,"custrecord_date_expected_at_be_checkbox","T");
            nlapiLogExecution('DEBUG',"Information for date expected at be to portal" ,'Successfully Pushed date expected at be to Portal with sno: having CdpId :' + cdp_id);
          }
        }
      }
    }
    catch(ex)
    {
      nlapiLogExecution('DEBUG',"Error Info for date expected at be to portal " ,ex.message);
    }
  }*/
}

function PushCdpDataNSToPortal(type)
{
  if(type == "create" || type == "edit"  || type == "xedit")
  {
    try
    {
      var scriptId = "874";
      var cdpId = nlapiGetRecordId();
      var context = nlapiGetContext();
      var record_type = nlapiGetRecordType();
      var contextType = context.getExecutionContext();
      nlapiLogExecution("debug","context type is :",contextType);
      if(contextType!="userinterface" && contextType!="userevent")
      {
        nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
        return true;
      }
      nlapiLogExecution('debug','CDP Initiated to push on portal for cdpId:'+cdpId , cdpId );
      /***************************** Start Added by Yagya Kumar 18 April 17 for DP-296 ************************/
      var filter = new Array();
      filter.push(new nlobjSearchFilter('custrecord_cdp_id' , null , 'equalto' ,cdpId));
      var result = nlapiSearchRecord('customrecord_pending_inv_for_cdp',null,filter,null);
      if(result)
      {
        var recordId = result[0].id;
        var poId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_po_number");	
        if(poId != null && poId != "")
        {					
          nlapiSubmitField('customrecord_pending_inv_for_cdp',recordId,'custrecord_po_number',poId);
          nlapiLogExecution('debug','PO field Set for pending_inv_for_cdp' , 'CDP #'+cdpId );
        }
      }
      /***************************** End Added by Yagya Kumar 18 April 17 for DP-296 ************************/

      var soId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_so_order_number");
      var assetAcct='';
      var soStatus = null;
      if(soId !='' && soId != null)
      {
        soStatus = nlapiLookupField("salesorder",soId,"status");
        var soObj = nlapiLoadRecord("salesorder",soId);
        var itemCount = soObj.getLineItemCount("item");
        for(var j=1; j<= itemCount; j++)
        {
          var itemType = soObj.getLineItemValue("item","itemtype",j);
          if(itemType == "InvtPart")
          {
            var invItemId=soObj.getLineItemValue("item","item",j);
            if(nlapiLookupField("inventoryitem",invItemId,"custitem20") == 7)
            {
              assetAcct = nlapiLookupField("inventoryitem",soObj.getLineItemValue("item","item",j),"assetaccount");
              break;
            }
          }// end check of itemType
        }// end of loop
      }// end check of soId

      // CallCDPToPortal(cdpId,assetAcct,soStatus,type,scriptId); //Call new library function
      Diamond_Portal_Logic_Rewrite(cdpId,type,record_type);
    }
    catch(err)
    {
      nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal",err.message); 
    }
  }
}

function  Push_Date_Expected_At_Be_To_Portal(cdp_id,date_expected_at_be)
{
  //Setting up URL of CDP             
  var url = "https://testportal.brilliantearth.com/api/cdp/";    

  //Setting up Headers 
  var headers = new Array(); 
  headers['http'] = '1.1';    
  headers['Accept'] = 'application/json';       
  headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
  headers['Content-Type'] = 'application/json'; 
  headers['User-Agent-x'] = 'SuiteScript-Call';

  var jsonobj = {
    "cdp_id"      		  :   cdp_id,
    "date_expected_at_be" :   date_expected_at_be
  }
  //Stringifying JSON
  var myJSONText = JSON.stringify(jsonobj, replacer); 
  nlapiLogExecution('debug','CDP date_expected_at_be Response Body From NS:', myJSONText);
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