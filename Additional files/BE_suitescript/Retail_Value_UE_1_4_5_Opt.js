nlapiLogExecution("audit","FLOStart",new Date().getTime());
var RESIZE = "2";
var REPAIR = "3";
var ENGRAVING = "8";
var WEDDING_BAND = "5";
var EXCHANGE = "4";
//Added new Parameter
var UPGRADE ="10";
var SET ="17";

var TYPE_RING = "3";
var TYPE_PENDANT = "5";
var TYPE_EARRINGS = "4";
var TYPE_FINISHED = "9";
var TYPE_PEARLS = "21";
var TYPE_LOOSE_DIAMOND = "7";
var TYPE_LOOSE_SAPPHIRE = "8";
var TYPE_LOOSE_COLORED_GEMSTONE = "18";
var TYPE_LOOSE_RUBY = "14";
var TYPE_LOOSE_EMERALD = "20";
var TYPE_LOOSE_AQUAMARINE = "15";
var TYPE_LOOSE_GEMSTONE = "31";

function Retail_Value_UE(type)
{
  if(type=="create" || type=="edit")
  {
    try
    {
      //Get record internal ID, order record obj, and order type
      var id = nlapiGetRecordId();

      var order = nlapiGetNewRecord();

      var order_type = order.getFieldValue("custbody87");

      var useNewGBLogic = false;
      var trandate = order.getFieldValue("trandate");
      trandate = nlapiStringToDate(trandate);
      nlapiLogExecution("debug","trandate object",trandate.toString());
      var cutOffDate = new Date(2017,5,22); //*****NEED TO CHANGE BEFORE PRODUCTION****
      nlapiLogExecution("debug","cutOffDate object",cutOffDate.toString());
      nlapiLogExecution("debug","Order Currency",order.getFieldValue("currency"));
      if(trandate >= cutOffDate && order.getFieldValue("currency")=="2") //GBP=2
        useNewGBLogic = true;

      nlapiLogExecution("debug","Use New GB Logic?",useNewGBLogic);

      var amountField = "amount";
      if(useNewGBLogic==true)
        amountField = "custcol_item_price";

      nlapiLogExecution("debug","Amount Field Being Used",amountField);

      //If edit, verify that total has actually changed as to not overwrite
      if(type=="edit" && forceNull(order.getFieldValue("custbody_full_insurance_amount"))!=forceNull(nlapiGetOldRecord().getFieldValue("custbody_full_insurance_amount")) && nlapiGetContext().getExecutionContext()=="userinterface")
      {
        //Full insurance value is manually overridden, do not recalculate
        nlapiLogExecution("debug","Insurance Value Manually Overridden","Old: " + nlapiGetOldRecord().getFieldValue("custbody_full_insurance_amount") + " |  New: " + order.getFieldValue("custbody_full_insurance_amount"));
        return true;
      }
      else if(type=="edit" && order.getFieldValue("total")==nlapiGetOldRecord().getFieldValue("total") && nlapiGetContext().getExecutionContext()=="userinterface")
      {

        //Do not overwrite line level options, just update total
        nlapiLogExecution("debug","SO Total Didn't Change - Just Update FIV Total");

        var hasRing = false;
        for(var x=0; x < order.getLineItemCount("item"); x++)
        {
			var itemFields = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),["isspecialorderitem","custitem20"]);
			
          if((itemFields.isspecialorderitem=="T" && (itemFields.custitem20=="2" || itemFields.custitem20=="4" || itemFields.custitem20=="5" || itemFields.custitem20=="6")) || order.getLineItemValue("item","item",x+1)=="14375" || order.getLineItemValue("item","item",x+1)=="487939" || order.getLineItemValue("item","item",x+1)=="487937" || order.getLineItemValue("item","item",x+1)=="487942" || order.getLineItemValue("item","item",x+1)=="502780" || order.getLineItemValue("item","item",x+1)=="537603" || order.getLineItemValue("item","item",x+1)=="487938" || order.getLineItemValue("item","item",x+1)=="487941" || order.getLineItemValue("item","item",x+1)=="487940")
          {
            hasRing = true;
            break;
          }
        }

        var totalValue = 0.00;
        for(var x=0; x < order.getLineItemCount("item"); x++)
        {
          if(order.getLineItemValue("item","custcol_full_insurance_value",x+1)!=null && order.getLineItemValue("item","custcol_full_insurance_value",x+1)!="")
          {
            if(hasRing)
            {
				var sub_category = order.getLineItemValue("item","custcol_category",x+1);
				
              if(sub_category!=TYPE_LOOSE_DIAMOND && sub_category!=TYPE_LOOSE_SAPPHIRE && sub_category!=TYPE_LOOSE_COLORED_GEMSTONE && sub_category!=TYPE_LOOSE_RUBY && sub_category!=TYPE_LOOSE_AQUAMARINE && sub_category!=TYPE_LOOSE_EMERALD && sub_category!=TYPE_PEARLS && sub_category!=TYPE_LOOSE_GEMSTONE)
                totalValue += forceParse(order.getLineItemValue("item","custcol_full_insurance_value",x+1));
            }
            else
            {
              totalValue += forceParse(order.getLineItemValue("item","custcol_full_insurance_value",x+1));
            }
          }

        }

        nlapiSetFieldValue("custbody_full_insurance_amount",totalValue,false,true);

        return true;
      }
      else if(type!="create" && nlapiGetContext().getExecutionContext()!="userinterface")
      {
        nlapiLogExecution("debug","Not Create, Not UI Change, Script Exit","Sales Order ID: " + nlapiGetRecordId());
        return true;
      }

      //Determine full insurance value for each subset of order types
      //if(order_type!=RESIZE && order_type!=REPAIR && order_type!=WEDDING_BAND && order_type!=ENGRAVING && order_type!=EXCHANGE) commented old if condition
	  
	  //zag: Commented following lines of script as per NS-1488
      //if(order_type!=RESIZE && order_type!=REPAIR && order_type!=WEDDING_BAND && order_type!=ENGRAVING && order_type!=EXCHANGE && order_type !=UPGRADE && order_type!=SET)
      //{
		  //modified if condition - removed EXCHANGE as per NS-1488: zag
	  if(order_type!=RESIZE && order_type!=REPAIR && order_type!=WEDDING_BAND && order_type!=ENGRAVING  && order_type !=UPGRADE && order_type!=SET)
      {
        //Check for Antique/Resize Order
        var antique = false;
        var service = false;
        var antiqueValue = 0.00;

        var cat1 = order.getFieldValue("custbody_category1");
        var cat2 = order.getFieldValue("custbody_category2");
        var cat3 = order.getFieldValue("custbody_category3");
        var cat4 = order.getFieldValue("custbody_category4");
        var cat5 = order.getFieldValue("custbody_category5");
        var cat6 = order.getFieldValue("custbody_category6");

        if(cat1=="24" || cat2=="24" || cat3=="24" || cat4=="24" || cat5=="24" || cat6=="24")
          antique = true;

        if(cat1=="12" || cat2=="12" || cat3=="12" || cat4=="12" || cat5=="12" || cat6=="12")
          service = true;

        //Handle orders with multiple POs
        var totalAmount = 0.00;
        for(var x=0; x < order.getLineItemCount("item"); x++)
        {
          if(order.getLineItemValue("item","itemtype",x+1)=="InvtPart" || order.getLineItemValue("item","itemtype",x+1)=="Assembly")
          {	

            //Handle promo/gift items at $0 (Earrings, Pendants, Finished Jewelry, or Bracelets)
            var category = order.getLineItemValue("item","custcol_category",x+1);
            if(order.getLineItemValue("item",amountField,x+1)==0 && (category=="4" || category=="5" || category=="9" || category=="34"))
            {
              //Insurance value for these lines will be $0
              nlapiLogExecution("debug","Promo Item - Setting to $0 Insurance Value");
              nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,0.00);
            }
            else if(order.getLineItemText("item","item",x+1).substring(0,3)=="BE1" || order.getLineItemText("item","item",x+1).substring(0,3)=="BE5" || order.getLineItemValue("item","item",x+1)=="14375" || order.getLineItemValue("item","item",x+1)=="487939" || order.getLineItemValue("item","item",x+1)=="487937" || order.getLineItemValue("item","item",x+1)=="487942" || order.getLineItemValue("item","item",x+1)=="502780" || order.getLineItemValue("item","item",x+1)=="537603" || order.getLineItemValue("item","item",x+1)=="487938" || order.getLineItemValue("item","item",x+1)=="487941" || order.getLineItemValue("item","item",x+1)=="487940")
            {
              var subAmount = 0.00;
              for(var i=0; i < order.getLineItemCount("item"); i++)
              {
                var sub_item = order.getLineItemValue("item","item",i+1);
                var sub_category = nlapiLookupField("item",sub_item,"custitem20");

                if(i!=x && (sub_category==TYPE_LOOSE_DIAMOND || sub_category==TYPE_LOOSE_SAPPHIRE || sub_category==TYPE_LOOSE_COLORED_GEMSTONE  || sub_category==TYPE_LOOSE_RUBY  || sub_category==TYPE_LOOSE_AQUAMARINE  || sub_category==TYPE_LOOSE_EMERALD  || sub_category==TYPE_PEARLS || sub_category==TYPE_LOOSE_GEMSTONE))
                {
				  // Start: Zag: NS-1488: 
				  // Commented below lines of code
                  // subAmount += forceParse(order.getLineItemValue("item",amountField,i+1)) * 0.8;
				  // Added below lines of code
					var lineInsSubAmnt = 0.0;
					if(order.getLineItemValue("item",amountField,i+1) == 0){
						lineInsSubAmnt = (forceParse(order.getLineItemValue("item",'custcol_full_insurance_value',i+1)));
					}else{
						lineInsSubAmnt = (forceParse(order.getLineItemValue("item",amountField,i+1)) * .8);
					}
					subAmount += lineInsSubAmnt;
					nlapiLogExecution("debug","Sub Category");
				  // End: Zag: NS-1488:
                }
              }
				// Start: Zag: NS-1488: 
				// Commented below lines of code
				// nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,subAmount + (forceParse(order.getLineItemValue("item",amountField,x+1) * .8)));
				// totalAmount += (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);
				// Added below lines of code
				var lineInsAmnt = 0.0;
				if(order.getLineItemValue("item",amountField,x+1) == 0){
					lineInsAmnt = (forceParse(order.getLineItemValue("item",'custcol_full_insurance_value',x+1)));
				}else{
					lineInsAmnt = (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);
					nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,subAmount + lineInsAmnt);
				}
				totalAmount += lineInsAmnt; 
				nlapiLogExecution("debug","sub category - Outer");
				// End: Zag: NS-1488:

            }
            else if(order.getLineItemText("item","item",x+1).substring(0,3)=="BE2" || order.getLineItemValue("item","item",x+1)=="14385")
            {
			// Start: Zag: NS-1488: 
			// Commented below lines of code
            // nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,(forceParse(order.getLineItemValue("item",amountField,x+1)) * .8));
            // totalAmount += (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);
			// Added below lines of code
				
				var lineInsAmnt = 0.0;
				if(order.getLineItemValue("item",amountField,x+1) == 0){
					lineInsAmnt = (forceParse(order.getLineItemValue("item",'custcol_full_insurance_value',x+1)));
				}else{
					lineInsAmnt = (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);
					nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,lineInsAmnt);
				}
				totalAmount += lineInsAmnt;
				nlapiLogExecution("debug","Item - BE2");
			// End: Zag: NS-1488:
            }
            else
            {
              if(antique && service)
              {
                nlapiLogExecution("debug","Is Both Antique/Service");

                if(nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20")=="24")
                {
                  nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,0.00);
                  antiqueValue = (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);

                  nlapiLogExecution("debug","Antique Value",antiqueValue);

                  totalAmount += antiqueValue;
                }
                else if(order.getLineItemValue("item","item",x+1)=="15381")
                {
                  nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,antiqueValue);
                  //totalAmount += antiqueValue;
                }
                else
                {
				 // Start: Zag: NS-1488: 
				 //Commented below lines of code
                 // nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,(forceParse(order.getLineItemValue("item",amountField,x+1)) * .8));
                 // totalAmount += (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);
				 // Added below lines of code
				
				var lineInsAmnt = 0.0;
				if(order.getLineItemValue("item",amountField,x+1) == 0){
					lineInsAmnt = (forceParse(order.getLineItemValue("item",'custcol_full_insurance_value',x+1)));
				}else{
					lineInsAmnt = (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);
					nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,lineInsAmnt);
				}
				totalAmount += lineInsAmnt;
				// End: Zag: NS-1488:
                }
              }
              else
              {
				// Start: Zag: NS-1488: 
				//Commented below lines of code
				//nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,(forceParse(order.getLineItemValue("item",amountField,x+1)) * .8));
                //totalAmount += (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);	
				
				// Added below lines of code
				
				var lineInsAmnt = 0.0;
				//nlapiLogExecution("debug","before - amount: ", order.getLineItemValue("item",amountField,x+1));
				if(order.getLineItemValue("item",amountField,x+1) == 0){
					lineInsAmnt = (forceParse(order.getLineItemValue("item",'custcol_full_insurance_value',x+1)));
				}else{
					lineInsAmnt = (forceParse(order.getLineItemValue("item",amountField,x+1)) * .8);
					nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,lineInsAmnt);
				}
				totalAmount += lineInsAmnt;
				// End: Zag: NS-1488:
              }
            }
          }
        }
		
		nlapiLogExecution("debug","Setting Overall Insurance Value",totalAmount);
		
        nlapiSetFieldValue("custbody_full_insurance_amount",totalAmount);
      }
      else if(order_type==RESIZE || order_type==REPAIR)
      {
        //DO NOTHING FOR NOW - THESE WILL BE HANDLED ON THE RESIZE/REPAIR PAGE SUITELETS
      }
      else if(/*order_type==WEDDING_BAND ||*/ order_type==ENGRAVING)
      {
        var filters = [];
        filters.push(new nlobjSearchFilter("entity",null,"is",order.getFieldValue("entity")));
        filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
        filters.push(new nlobjSearchFilter("internalid",null,"noneof",nlapiGetRecordId()));
        var cols = [];
        cols.push(new nlobjSearchColumn("trandate").setSort(false));
        var results = nlapiSearchRecord("salesorder",null,filters,cols);
        if(results)
        {
          var originalOrder = nlapiLoadRecord("salesorder",results[0].getId());

          var totalAmount = 0.00;
          for(var x=0; x < originalOrder.getLineItemCount("item"); x++)
          {
            if(originalOrder.getLineItemValue("item","itemtype",x+1)=="InvtPart")
            {
              //originalOrder.setLineItemValue("item","custcol_full_insurance_value",x+1,parseFloat(originalOrder.getLineItemValue("item","amount",x+1) * .8));
              totalAmount += (forceParse(originalOrder.getLineItemValue("item",amountField,x+1)) * .8);
            }
          }

          nlapiSetFieldValue("custbody_full_insurance_amount",totalAmount);

          for(var x=0; x < order.getLineItemCount("item"); x++)
          {
            nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,totalAmount);
          }
        }
        else
        {
          nlapiLogExecution("debug","No SO found for Wedding Band/Engraving order.");
        }
      }
      else if(order_type==EXCHANGE)
      {
        //DO NOTHING FOR NOW - THESE WILL BE HANDLED ON THE EXCHANGE PAGE SUITELET
      }
      else if(order_type==UPGRADE)
      {
        //DO NOTHING FOR NOW - THESE WILL BE HANDLED ON THE UPGRADE PAGE SUITELET
      }
      else if(order_type==SET)
      {
        //DO NOTHING FOR NOW - THESE WILL BE HANDLED ON THE SET PAGE SUITELET
      }
    }
    catch(err)
    {
      nlapiLogExecution("error","Error Updating Insurance Value","Details: " + err.message);
      return true;
    }
  }
}

Array.prototype.getUnique = function(){
  var u = {}, a = [];
  for(var i = 0, l = this.length; i < l; ++i){
    if(u.hasOwnProperty(this[i])) {
      continue;
    }
    a.push(this[i]);
    u[this[i]] = 1;
  }
  return a;
}

function forceNull(value)
{
	if(value==null || value=="")
		return null;
	else
		return value;
}

function forceParse(value)
{
	if(value==null || value=="")
		return 0.00;
	else
		return parseFloat(value);
}
