nlapiLogExecution("audit","FLOStart",new Date().getTime());
/*
 * Sales Order Highest Line Item Categories v2
 * Type: User Event
 * Trigger: After Submit
 * 
 * This script looks at all line items on an approved sales order and fills in custom fields on the order based off of the
 * categories of the highest dollar amount line items.
 */
function setOrderCategoryItems(type)
{
  nlapiLogExecution("error","Type",type);
  var context = nlapiGetContext().getExecutionContext();
  nlapiLogExecution("error","Context",context);

  if(type=="create" || type=="approve" || type=="edit" || (type=="xedit" && context!="userevent"))
  {
    if(context!="userinterface" && context!="webservices" && context!="suitelet" && context!="userevent")
      return true;

    try
    {
      nlapiLogExecution("error","Context",'OK');
      var k=0;
      var filters = new Array()
      filters[0] = new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId())
      filters[1] = new nlobjSearchFilter("mainline",null,"is","F")
      filters[2] = new nlobjSearchFilter("taxline",null,"is","F")
      filters[3] = new nlobjSearchFilter("shipping",null,"is","F")
      //filters[4] = new nlobjSearchFilter("custbody_category1",null,"anyof","@NONE@")
      filters[4] = new nlobjSearchFilter("status",null,"noneof",["SalesOrd:C","SalesOrd:H"])
      filters[5] = new nlobjSearchFilter("custitem20","item","noneof","@NONE@")

      var columns = new Array()
      columns[0] = new nlobjSearchColumn("item")
      columns[1] = new nlobjSearchColumn("amount")
      columns[1].setSort(true) //Make sort order highest to lowest
      columns[2] = new nlobjSearchColumn("custitem20","item")

      var results = nlapiSearchRecord("salesorder",null,filters,columns)
      if(results!=null)
      {
        //nlapiLogExecution("debug","Results #",results.length)

        var fieldID = new Array()
        var fieldData = new Array()

        for(var x=0; x < results.length; x++)
        {
          if(results[x].getValue("custitem20","item")==null || results[x].getValue("custitem20","item")=="")
          {
            nlapiLogExecution("debug","Script Position","Continuing because no category found on item.")
            continue	
          }

          switch(x)
          {
            case 0:
              fieldID.push("custbody_category1")
              break
              case 1:
              fieldID.push("custbody_category2")
              break
              case 2:
              fieldID.push("custbody_category3")
              break
              case 3:
              fieldID.push("custbody_category4")
              break
              case 4:
              fieldID.push("custbody_category5")
              break
              case 5:
              fieldID.push("custbody_category6")
              break
              default:
              k=1;
              break
          }

          if(k == 0)
          {
            if(results[x].getValue("amount")==0.00 && (results[x].getValue("custitem20","item")=="4" || results[x].getValue("custitem20","item")=="5" || results[x].getValue("custitem20","item")=="9" || results[x].getValue("custitem20","item")=="34"))
              fieldData.push("37");
            else
              fieldData.push(results[x].getValue("custitem20","item"));
          }
        }

        //Check box so that scheduled script will come through and pick up sales order to update for item date of last order
        fieldID.push("custbody_run_item_date_fields_update");
        fieldData.push("T");

        nlapiSubmitField("salesorder",nlapiGetRecordId(),fieldID,fieldData,false);
        nlapiLogExecution("debug","fieldID",nlapiGetRecordId() + '>>'+  fieldData.join(' >> '));
      }	
    }
    catch(err)
    {
      nlapiLogExecution("error","SO Category Script Error","Error setting top categories on sales order. Details: " + err.message)
      return true
    }
  }
}
