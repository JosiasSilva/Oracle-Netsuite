nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Ajay kumar (ajay@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : User Event Script
 * Script Name   : Highlight_TBW_On_PO.js
 * Created Date  : April 25, 2016
 * Last Modified Date : April 36, 2016
 * Comments : Script will highlight TBW field of PO......
 * Script URL: /app/common/scripting/script.nl?id=923 
 */
 
function Highlight_TBW(type,form)
{	
	//Highlight TBW Fields
	try
	{
		if(type == "view" || type == "edit")
		{
			if(nlapiLookupField("purchaseorder",nlapiGetRecordId(),"custbody129")=="T")
			{
				var fieldAddingHighLight = form.addField("custpage_highlight_tbw_match", "inlinehtml", "TBW Match");

				var fieldAddingHighLightValue = "<script type='text/javascript'>";
				fieldAddingHighLightValue += 'var node = document.getElementById("custbody129_fs_lbl");';
				fieldAddingHighLightValue += 'node.parentNode.parentNode.style.background="yellow";';
				fieldAddingHighLightValue += "</script>";
				fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
              //return true;
			}
			/*******Updated By Vinay Soni For NS-1048*******/
			if(nlapiLookupField('purchaseorder',nlapiGetRecordId(),'custbody348')=='1' || nlapiLookupField('purchaseorder',nlapiGetRecordId(),'custbody348')=='7')
			{
				var engravingstatus = form.addField('custpage_highlight_be_engraving','inlinehtml','BE ENGRAVING STATUS');
				var highlightEngravingstatus = "<script type='text/javascript'>";
				highlightEngravingstatus += 'var node = document.getElementById("custbody348_fs_lbl");';
				highlightEngravingstatus += 'node.parentNode.parentNode.style.background="yellow";';
				highlightEngravingstatus += "</script>";
				engravingstatus.setDefaultValue(highlightEngravingstatus);
				//return true;
			}
			/********End *******/
		}
	}	
	catch(err)
	{
		nlapiLogExecution("debug","Error Occur during highlight TBW field is : ",err.message);
	}
}