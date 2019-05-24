nlapiLogExecution("audit","FLOStart",new Date().getTime());
function  Highlight_custbody319(type,form)
{
	//Added by ajay 01March 2017
    var context = nlapiGetContext();
    var contextType = context.getExecutionContext();
    if(contextType!="userinterface")
    {
	    nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
	    return true;
    }
    //Ended by ajay 01March 2017

	try
	{
		if(type=='view' || type=='edit')
		{
			var soId=nlapiGetRecordId();
			var soObj=nlapiLoadRecord('salesorder',soId);    		   
            var incomped_item= soObj.getFieldValue('custbody319');
			nlapiLogExecution("debug", "incomped_item :"+ incomped_item,  soId );		  
			//nlapiLogExecution("debug", "Highlight Record :"+ soId+", Include comped item Field Val: " + incomped_item );		  
			var getDropShipMaterial= soObj.getFieldValue('custbody39');
			nlapiLogExecution("debug", "getDropShipMaterial :"+ getDropShipMaterial,  soId );		  
			if(incomped_item == "T" &&  getDropShipMaterial!= '' && getDropShipMaterial != null )
			{			
				var field = form.addField("custpage_highlight_custbody319_field","inlinehtml","Highlight custbody319 Fields");
				//nlapiLogExecution("Debug","field label",field.getLabel());
				var fieldValue = "<script type='text/javascript'>";           
				fieldValue += "if(document.getElementById('custbody319_fs_lbl'))";
				fieldValue += "document.getElementById('custbody319_fs_lbl').parentNode.parentNode.style.backgroundColor='yellow';";			
				fieldValue += "</script>";
				field.setDefaultValue(fieldValue);//set default value
				nlapiLogExecution("debug", "Include Comped Item  Highlighted Sucessfully.", soId);
			}
		}
	}
	catch(err)
    {
        nlapiLogExecution("error","Error on Include comped item highlight the field :",err.toString());
		return true;
    }

}