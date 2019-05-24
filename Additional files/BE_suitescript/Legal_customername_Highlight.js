function Highlight_CustomerName_On_SO(type,form)
{
  try
  {
	  nlapiLogExecution("debug", "Form Type :"+type, type);
	  if(type=='edit' || type=='view')
	  {
		  var soId=nlapiGetRecordId();
		  var soObj=nlapiLoadRecord("salesorder",soId);
		  var custId=soObj.getFieldValue("entity");
		  var custLegal=nlapiLookupField("customer",custId,"custentity131");
                   nlapiLogExecution("Debug","Legal Id Is:"+custLegal,custLegal);
		  if(custLegal!="" || custLegal!=null)
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
	  }
  } 
  catch(err)
  {
	  nlapiLogExecution("debug", "Error Highlight CustomerName On SO :", err.message);
  }  
}