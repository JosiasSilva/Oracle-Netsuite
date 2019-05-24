function hideSaveAndPrintButton(type)
{
//Get the button
var button = form.getButton('custformbutton0');
 
//Make sure that the button is not null
if(button != null)
   //Hide the button in the UI
   button.setVisible(false);
}
function relabelUpdateOrderButton(type, form)
{
//Get the button
//var button = form.getButton('custformbutton0');
 
//Relabel the button's UI label
//button.setLabel('UnsetPO');

 var script = "alert('Hello World')";
                
       form.addButton('custombutton', 'Click Me', script);
}

function disableUpdateOrderButton(type, form)
{
//Get the button
var button = form.getButton('custformbutton0');
 
//Disable the button in the UI
button.setDisabled(true);
}