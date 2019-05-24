function highLightPO(type, form){
  if(type=="view" || type =="edit")
  {
    try
    {
      if(nlapiGetContext().getExecutionContext()!="userinterface")
        return true;
      var id = nlapiGetRecordId();
      var get_obj=nlapiLookupField('purchaseorder',id,['customform','custbody_department_approver']);
      var customform =get_obj.customform;
	  
      var userId=nlapiGetUser()+'';
	 
      var departmentApprover = get_obj.custbody_department_approver;
	
      if(departmentApprover)
      {
        departmentApprover=departmentApprover.split(',');
        var index=departmentApprover.indexOf(userId);
		

        if(customform== '239' && departmentApprover.indexOf(userId)>=0)
        {
        
          var field = form.addField("custpage_highlight_fields_show_2015","inlinehtml","Highlight Fields",null,'custom');
          var fieldValue = "<script type='text/javascript'>";
          fieldValue += 'var items = document.getElementById("expense_splits");';
          
          fieldValue +="document.getElementById('custbodyinvoice_number_fs_lbl').parentNode.parentNode.style.backgroundColor='#ff66ff';";
          fieldValue +="document.getElementById('custbodyinvoice_date_fs_lbl').parentNode.parentNode.style.backgroundColor='#ff66ff';";
		  
		  var lineItemCount = nlapiGetLineItemCount('expense');
          for(var x=0; x < lineItemCount; x++)
          {
            fieldValue += 'var row = items.rows[' + (x+1) + '];';
            fieldValue += 'row.cells[1].style.setProperty("background-color","#ff66ff","important");';
            fieldValue += 'row.cells[2].style.setProperty("background-color","#ff66ff","important");';
            fieldValue += 'row.cells[3].style.setProperty("background-color","#ff66ff","important");';
          }
		  
          fieldValue += "</script>";
          field.setDefaultValue(fieldValue);//set default value
        }
      }

    }
    catch(err)
    {
      nlapiLogExecution("error","Error Showing Mods On SO","Details: " + err.message);
      return true;
    }
  }

}
