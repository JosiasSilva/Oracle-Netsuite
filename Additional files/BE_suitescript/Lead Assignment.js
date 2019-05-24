var chk_day,chk_custome_day;
var ignore_employee_list=[];
var available_employee_list=[];
var available_employee_list_volumn=[];
var check_custome_cs_employee=[];
var RF_Show_Leads='8471';
function Assing_Lead()
{
  Get_Current_Day();
  Check_Assignment_Sales_Rep();
  Value_Assign_Lead();
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