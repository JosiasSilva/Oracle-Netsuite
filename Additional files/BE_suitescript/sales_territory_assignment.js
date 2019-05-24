var chk_day,chk_custome_day;
var data_value={};
var data_field={};
var appointement_location=["1","2","3","4","5","6","7"];  //[1=>San Francisco,2=>Los Angeles,3=>Boston,4=>Chicago,5=>SD (San Diego),6=>Washington DC,7=>Denver]
var employee_location=["2","10","14","18","25","26","30"]; //[2=>San Francisco,10=>Los Angeles,14=>Boston,18=>Chicago,25=>SD (San Diego),26=>Washington DC,30=>Denver]
var current_date=nlapiDateToString (new Date()); 
function Sales_Territory_assignment()
{

  Get_Current_Day();

  //Assign Custom CS//

  data_value.territory_internalid='1'
  Deleate_Sales_Territory(data_value);
  Insert_Assign_Custom_CS(data_value);

  //Assign Online Lead Forms

  data_value.territory_internalid='2'
  Deleate_Sales_Territory(data_value);
  Insert_Assign_Online_Lead_Forms(data_value);

  //Route Setster Appt Requests to Rep Location

  data_value.territory_internalid='6'
  Deleate_Sales_Territory(data_value);
  Insert_Route_Setster_Appt_Requests_to_Rep_Location(data_value);


  data_field.Check_closing_time=true;
  data_field.date ='custentity_lead_assistant_date';
  data_field.apply_sales_territory='custentity_appply_sales_territory_id';
  data_field.apply_sales_territory_rule='custentity_apply_save_search_rule';
  data_field.sales_rep='salesrep';
  //Route Setster Appt Requests to Rep Location
  data_value.territory_internalid='6';
  data_value.check_days_of_operation=true;
  data_value.Volume_Cap_Check=false;

  try{  Set_Employee_From_Sales_Territory(data_field,data_value);}catch(er){}

  //Assign Custom CS//
  data_value.territory_internalid='1';
  data_value.check_days_of_operation=false;
  data_value.Volume_Cap_Check=true;

  try{ Set_Employee_From_Sales_Territory(data_field,data_value);}catch(er){}

  //Assign Online Lead Forms
  data_value.territory_internalid='2';
  data_value.check_days_of_operation=false;
  data_value.Volume_Cap_Check=true;

  try{Set_Employee_From_Sales_Territory(data_field,data_value);;}catch(er){}

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