nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Rahul Panchal (rahul.panchal@inoday.com)
 * Author Desig. : Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : User Event
 * Script Name   : Highlight_tbw_on_SO_user.js 
 * Created Date  : NOV 23, 2016
 * SB Script URL: /app/common/scripting/script.nl?id=1135
 **/


function To_Be_Watched_Highlight(type,form)
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

	if(type=='edit' || type=='view')
	nlapiLogExecution("debug","Type is" +type,type)
	{
		try
		{

			var orderID = nlapiGetRecordId();			
			var results = nlapiSearchRecord("customer","customsearch2138",new nlobjSearchFilter("internalid","transaction","is",orderID));
			if(results)
			{		
				 if(nlapiLookupField("salesorder",orderID,"custbody129")=="T")
				{
					//nlapiSetFieldValue("custbody129","T",true);
					nlapiLogExecution("debug","Highlighting Field...");	
					
					var fieldAddingHighLight = form.addField("custpage_highlight_tbw_match", "inlinehtml", "TBW Match");
					var fieldAddingHighLightValue = "<script type='text/javascript'>";
					fieldAddingHighLightValue += 'var node = document.getElementById("custbody129_fs_lbl");';
					fieldAddingHighLightValue += 'node.parentNode.parentNode.style.background="yellow";';
					fieldAddingHighLightValue += "</script>";
					fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
					nlapiLogExecution("debug","To be watched field highlighted", orderID);	
				}				
				else
				{
					nlapiLogExecution("debug","To be Watched value is : F", orderID);
				}
			}
			else
			{
				nlapiLogExecution("debug","Sales order not exist in seacrh record",orderID);
			}			
		}
		catch(err)
		{
			nlapiLogExecution("debug","Error occuring while highlighting",err.message);
		}
	}
}