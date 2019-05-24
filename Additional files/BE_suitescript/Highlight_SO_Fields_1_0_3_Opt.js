nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Highlight_SO_Fields(type,form)
{
	var ctx = nlapiGetContext().getExecutionContext();
	if(ctx!="userinterface")
		return true;
	
	if(type=="view" || type=="edit")
	{
		var orderID = nlapiGetRecordId();
		//displayFraudMessage(form); This is commented and merged with script#2099 (Missing Doc Alert)
		//Highlight GE$ Receipt Field
		try
		{
			//Verify GE$ Receipt field is not 'GE$ Receipt Received' and has a line item of 'Financing'
			if(nlapiGetFieldValue("custbody128")!="5" && nlapiFindLineItemValue("item","item","2569496")!=-1)
			{
				//Highlight GE$ Receipt field
				var	field = form.addField("custpage_highlight_ge_receipt","inlinehtml","Highlight GE Receipt");
				field.setDefaultValue("<script type='text/javascript'>document.getElementById('custbody128_fs_lbl').parentNode.parentNode.style.backgroundColor='yellow';</script>");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Script Error","Error highlighting GE$ Receipt field on Sales Order ID " + orderID + ". Details: " + err.message);
		}
		
		//Highlight To Be Watched
		try
		{
			var results2 = nlapiSearchRecord("customer","customsearch2138",new nlobjSearchFilter("internalid","transaction","is",orderID));
			if(results2)
			{
				nlapiLogExecution("debug","Highlighting Field...")
				fld = form.getField("custbody_to_be_watched_so_only");
				fld.setDefaultValue("<span style='background-color: yellow; font-weight: bold; font-size: 9pt;'>To Be Watched <span class='checkbox_read_ck'><img class='checkboximage' src='/images/nav/ns_x.gif'/></span></span>");
			}
			else
			{
				nlapiLogExecution("debug","No Results Found")
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Highlighting To Be Watched","Detailed: " + err.message);
		}
		
		//Highlight Backstock Fields
		try
		{
			if(nlapiGetFieldValue("custbody_pot_backstock_ring_match")=="T")
			{
				var fieldAddingHighLight = form.addField("custpage_highlight_bs_match", "inlinehtml", "Potential Backstock Ring Match");
	
				var fieldAddingHighLightValue = "<script type='text/javascript'>";
				fieldAddingHighLightValue += 'var node = document.getElementById("custbody_pot_backstock_ring_match_fs_lbl");';
				fieldAddingHighLightValue += 'node.parentNode.parentNode.style.background="yellow";';
				fieldAddingHighLightValue += "</script>";
				fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Highlighting Backstock Fields","Detailed: " + err.message);
		}
	}
}
function displayFraudMessage(form) {
  try
    {
    var fraudCheckVal = nlapiGetFieldValue('custbodyfraud_check_new');
    var fraudCheckFld = form.addField("custpage_fraud_check", "inlinehtml", "Fraudcheck");
    var fraudMsg = '<h3 class="uir-record-type" style="background-color:red;color:black;font-size:14px" id="ext-gen22">FRAUD QUESTIONS REQUIRED, SEE FRAUD NOTES</h3>';
    fraudCheckFld.setDefaultValue("<script type='text/javascript'>\
	  document.onreadystatechange = function(){\
     if(document.readyState === 'complete'){\
	    var fraudCheckVal=" + fraudCheckVal + ";\
       	if(fraudCheckVal=='4')\
		{\
        var div_f = document.getElementsByClassName('uir-page-title-firstline');\
		div_f[0].innerHTML=div_f[0].innerHTML+'" + fraudMsg + "';\
		}\
      }\
      }\
    </script>");
    }
  catch(ex)
    {
      
    }
}