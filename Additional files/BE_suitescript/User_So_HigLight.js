nlapiLogExecution("audit","FLOStart",new Date().getTime());
function IA_Requested_HighLight(type,form)
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

	if(type=="view")
	{
		var Id  = nlapiGetRecordId();
                 nlapiLogExecution("debug", "High light So Field 'custbody144' for SO Id: " + Id  );
		var soFields = nlapiLookupField('salesorder',Id,'custbody144');
             nlapiLogExecution("debug", "High light So Field 'custbody144'  Value for 2,3 only");
            nlapiLogExecution("debug", "High light So Field 'custbody144'  Current Value is: " + soFields );

         var fraudyFields = nlapiLookupField('salesorder',Id,'custbody352');

       if(soFields  == '2' ||   soFields == '3')
     {   
         nlapiLogExecution("debug", "High light So Field 'custbody144' for SO Id: " + Id  );
          var field = form.addField("custpage_custbody144","inlinehtml","Highlight Fields");
           
		   var fieldValue = "<script type='text/javascript'>";
                  fieldValue += "if(document.getElementById('custbody144_fs_lbl'))";
                 
		fieldValue += "document.getElementById('custbody144_fs_lbl').parentNode.parentNode.childNodes[1].style.backgroundColor='yellow';"
		fieldValue += "</script>";
		field.setDefaultValue(fieldValue);//set default value
	  }

	  if(fraudyFields =='T')
	  {
		var field = form.addField("custpage_entity","inlinehtml","Highlight Fields");
		var fieldValue = "<script type='text/javascript'>";
                 fieldValue += "if(document.getElementById('entity_fs_lbl'))";      
		fieldValue += "document.getElementById('entity_fs_lbl').parentNode.parentNode.childNodes[1].style.backgroundColor='#ddd3ee';";
		fieldValue += "</script>";
		field.setDefaultValue(fieldValue);//set default value
	  }

	}

	 if(type=="edit")
	{
		var Id  = nlapiGetRecordId();
        var fraudyFields = nlapiLookupField('salesorder',Id,'custbody352');    
	  if(fraudyFields =='T')
	  {
		var field = form.addField("custpage_entity","inlinehtml","Highlight Fields");
		var fieldValue = "<script type='text/javascript'>";
        fieldValue += "if(document.getElementById('entity_display'))";      
		fieldValue += "document.getElementById('entity_display').style.backgroundColor='#ddd3ee';";
		fieldValue += "</script>";
		field.setDefaultValue(fieldValue);//set default value
	  }
	}
}



