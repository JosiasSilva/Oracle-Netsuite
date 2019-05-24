var chk_day,chk_custome_day;
var data_value={};
var data_field={};
function Sales_Territory_assignment()
{

  var modify_data=nlapiGetContext ( ).getSetting ('script' , 'custscript_sales_territory_css' );
  var current_date=nlapiDateToString (new Date()); 
  if(current_date!=modify_data)
  {
    Get_Current_Day();
    data_value.territory_internalid='5'
    Deleate_Sales_Territory(data_value);
    Insert_CSS_lead_assignment(data_value);
    var load_deployement=nlapiLoadRecord('scriptdeployment',nlapiSearchRecord('scriptdeployment',null,new nlobjSearchFilter('scriptid',null,'is',nlapiGetContext ( ) .getDeploymentId ( ) ))[0].getId());
    load_deployement.setFieldValue('custscript_sales_territory_css',current_date);
    nlapiSubmitRecord (load_deployement);
  }
  data_value.territory_internalid='5'
  data_field.Check_closing_time=true;
  data_field.sales_rep='custentity_css_rep';
  data_field.date ='custentity_css_rep_date';
  Set_Employee_From_Sales_Territory(data_field,data_value);
}
function checkGovernance()
{
  if (nlapiGetContext().getRemainingUsage() < 500) {
    var stateMain = nlapiYieldScript();
    if (stateMain.status == 'FAILURE') {
      nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
      throw "Failed to yield script";
    } else if (stateMain.status == 'RESUME') {
      nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
    }
  }
}