nlapiLogExecution("audit","FLOStart",new Date().getTime());
function HighLight_CustBody39(type,form)
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

    if(type == "view" || type == "edit")
    {
       try
       {
           nlapiLogExecution("debug","Event Type :",type);
           var Item_ID = nlapiGetRecordId(); //get record id
           var Item_Type =  nlapiGetRecordType(); //get record type
           var getDropShipMaterial = nlapiLookupField(Item_Type,Item_ID,'custbody39');  //get record dropship material sent to vendor 
  
          if(getDropShipMaterial != '')
          {
	      var field = form.addField("custpage_highlight_fields_show","inlinehtml","Highlight Fields");
	      nlapiLogExecution("Debug","field label",field.getLabel());
	      var fieldValue = "<script type='text/javascript'>";           
	            fieldValue += "if(document.getElementById('custbody39_fs_lbl'))";
		    fieldValue += "document.getElementById('custbody39_fs_lbl').parentNode.parentNode.style.backgroundColor='yellow';";			
		    fieldValue += "</script>";
	     field.setDefaultValue(fieldValue);//set default value
          }
      }
      catch(err)
      {
           nlapiLogExecution("error","Error raised during highlight the field :",err.message);
           return true;
      }
   }
}