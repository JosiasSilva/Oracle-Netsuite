function setShipService(orderId)
{
  var shipService ='';
  var order = null;
  var insuranceValue = 0.00;
  var now = new Date();
  var daysAgo25 = nlapiAddDays(now,-25);

  var fullInsuranceValue = 0.00;
  var prodInsuranceValue = 0.00;
  if(orderId!=null && orderId!="")
  {
    var filters = [];
    filters.push(new nlobjSearchFilter("internalid",null,"is",orderId));
    filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
    var cols = [];
    cols.push(new nlobjSearchColumn("custbody_full_insurance_amount"));
    cols.push(new nlobjSearchColumn("custcol_full_insurance_value"));
    cols.push(new nlobjSearchColumn("trandate"));
    cols.push(new nlobjSearchColumn("tranid"));
    cols.push(new nlobjSearchColumn("custcol_category"));
    cols.push(new nlobjSearchColumn("custbody110"));
    cols.push(new nlobjSearchColumn("custbody87")); //Type of Order
    cols.push(new nlobjSearchColumn("custbody35")); //Type of Send Back
    cols.push(new nlobjSearchColumn("custbody110","createdfrom")); //Created From: Date to Ship
    cols.push(new nlobjSearchColumn("custbody110","custbody_created_from")); //Created From: Date to Ship
    cols.push(new nlobjSearchColumn("custbody_return_label_insurance"));
    var results = nlapiSearchRecord("salesorder",null,filters,cols);
    if(results)
    {
      order = results[0];
      var hasDiamond = false;

      //if(recordType=="salesorder")
      var dateToShip = results[0].getValue("custbody110","custbody_created_from");
      // else
      //  var dateToShip = results[0].getValue("custbody110","createdfrom");

      insuranceValue = results[0].getValue("custbody_return_label_insurance");

      var typeOfOrder = results[0].getValue("custbody87");
      var typeOfSendback = results[0].getValue("custbody35");

      for(var x=0; x < results.length; x++)
      {
        if(results[x].getValue("custcol_category")=="7") //Loose Diamond
        {
          hasDiamond = true;
          break;
        }
      }

      //Determine service level
      if(nlapiStringToDate(dateToShip) <= daysAgo25 && hasDiamond==true && (typeOfOrder=="4" || typeOfSendback=="2"))
      {
        //If Date to Ship is older than 25 days and has a Category = LOOSE DIAMOND item then use FedEx Priority Overnight service
        //fld.setDefaultValue("PRIORITY_OVERNIGHT");
        shipService = "PRIORITY_OVERNIGHT" ;
      }
      else
      {
        //if(insuranceValue < 250 && typeOfOrder=="1")
        //shipService = "FEDEX_GROUND" ;
        //fld.setDefaultValue("FEDEX_GROUND");
        //else
        shipService = "FEDEX_2_DAY";
        // fld.setDefaultValue("FEDEX_2_DAY");
      }

      var tranID =results[0].getValue("tranid");
      // tranidFld.setDefaultValue(results[0].getValue("tranid"));

      /*  if(insuranceValue < 250 && typeOfOrder=="1")
                                  {
                                      fld.setDefaultValue("FEDEX_GROUND");
                                    //fld.addSelectOption("FEDEX_GROUND","FedEx Ground",true);
                                    //fld.setDisplayType("disabled");
                                  }
                                */
    }
  }

  return [shipService,tranID];
}