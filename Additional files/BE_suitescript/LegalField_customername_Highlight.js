nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Highlight_CustomerName_On_SO(type,form)
{
  try
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
	  nlapiLogExecution("debug", "Form Type :"+type, type);
	  if(type=='edit' || type=='view')
	  {
		  var soId=nlapiGetRecordId();
		  var soObj=nlapiLoadRecord("salesorder",soId);
		  var custId=soObj.getFieldValue("entity");
		  var custLegal=nlapiLookupField("customer",custId,"custentity131");
                   nlapiLogExecution("Debug","Legal Id Is:"+custLegal,custLegal);
		  if(custLegal==1 || custLegal==2 || custLegal==3)
		  {
                    	 var field = form.addField("custpage_highlight_customer","inlinehtml","Highlight Fields");
                       nlapiLogExecution("Debug","field label",field.getLabel());
			 var fieldValue = "<script type='text/javascript'>";           
	             fieldValue += "if(document.getElementById('entity_fs_lbl_uir_label'))";
		        fieldValue += "document.getElementById('entity_fs_lbl_uir_label').parentNode.parentNode.style.backgroundColor='pink';";	
                           fieldValue += "</script>";
	            field.setDefaultValue(fieldValue);//set default value
                       nlapiLogExecution("debug", "Customer Highlighted Field Id:"+soId, soId); 
		  }
                   else
		  {
			  nlapiLogExecution("Debug","Legal Field is not set to any Value :");
		  }
	  }
  } 
  catch(err)
  {
	  nlapiLogExecution("debug", "Error Highlight CustomerName On SO :", err.message);
  }  
}