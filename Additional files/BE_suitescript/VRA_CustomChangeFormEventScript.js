function changeform(type, form)
{
 //var currentForm = request.getParameter('cf');
 //nlapiLogExecution('debug','VAR From Values:'+currentForm , type )
 // if(nlapiGetContext().getExecutionContext() == 'userinterface' && type == 'view' && currentForm != '10')
 // {
  // var formId = 10; // Custom form Internal ID of the desired form
  
  // nlapiSetRedirectURL('RECORD', nlapiGetRecordType(), nlapiGetRecordId(), false,{cf:formId});
 // }
 //return;

 // The second parameter of the event it will return the current form of the record 
   form.addButton('custpage_buttonUnsetPO', 'Unset PO', 'onclick_callUnsetPO()');  
   form.setScript('customscript_add_buttonVRA'); // sets the script on the client side
   nlapiLogExecution('debug','VAR From Values:'+form , type )
   // addButton(name, label, script)
   
   // name - The internal ID name of the button. The internal ID must be in lowercase, 
   // contain no spaces, and include the prefix custpage if you are adding the button to
   // an existing page. For example, if you add a button that appears as Update Order, 
   // the button internal ID should be something similar to custpage_updateorder. 
   // ID must start with custpage
   
   // label - the display text of the button
   
   // script - assign the function of the script to be executed
   // There are a couple of options on how to set the script with the function to be called
   // 1. Assign the ID of a deployed script 
   // 2. Deploy a Client Side Script onto the record    

}