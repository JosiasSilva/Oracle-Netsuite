var RESIZE = "2";
var REPAIR = "3";
var ENGRAVING = "8";
var WEDDING_BAND = "5";
var EXCHANGE = "4";

var TYPE_RING = "3";
var TYPE_PENDANT = "5";
var TYPE_EARRINGS = "4";
var TYPE_FINISHED = "9";
var TYPE_PEARLS = "21";
var TYPE_LOOSE_DIAMOND = "7";
var TYPE_LOOSE_SAPPHIRE = "8";

function Retail_Value_UE(type)
{
	if(type=="create")
	{
		try
		{
			//Get record internal ID, order record obj, and order type
			var id = nlapiGetRecordId();
			var order = nlapiLoadRecord("salesorder",id);
			var order_type = order.getFieldValue("custbody87");
			
			//Determine if order has multiple purchase orders
			var po_count = 0;
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",id));
			filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
			filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
			var cols = [];
			cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
			var results = nlapiSearchRecord("salesorder",null,filters,cols);
			if(results)
			{
				po_count = results.length;
				nlapiLogExecution("debug","# PO's",po_count);
			}
			
			//Determine full insurance value for each subset of order types
			if(order_type!=RESIZE && order_type!=REPAIR && order_type!=WEDDING_BAND && order_type!=ENGRAVING && order_type!=EXCHANGE)
			{
				if(po_count <= 1)
				{
					//Handle orders with no PO or only one PO
					var totalAmount = 0.00;
					for(var x=0; x < order.getLineItemCount("item"); x++)
					{
						if(order.getLineItemValue("item","itemtype",x+1)=="InvtPart")
						{
							order.setLineItemValue("item","custcol_full_insurance_value",x+1,(order.getLineItemValue("item","amount",x+1) * .8));
							totalAmount += (parseFloat(order.getLineItemValue("item","amount",x+1)) * .8);
						}
					}
					order.setFieldValue("custbody_full_insurance_amount",totalAmount);
				}
				else
				{
					//Handle orders with multiple POs
					var totalAmount = 0.00;
					for(var x=0; x < order.getLineItemCount("item"); x++)
					{
						if(order.getLineItemValue("item","itemtype",x+1)=="InvtPart")
						{	
							if(order.getLineItemText("item","item",x+1).substring(0,3)=="BE1" || order.getLineItemValue("item","item",x+1)=="487937" || order.getLineItemValue("item","item",x+1)=="487942" || order.getLineItemValue("item","item",x+1)=="502780" || order.getLineItemValue("item","item",x+1)=="537603" || order.getLineItemValue("item","item",x+1)=="487938" || order.getLineItemValue("item","item",x+1)=="487941" || order.getLineItemValue("item","item",x+1)=="487940")
							{
								var subAmount = 0.00;
								for(var i=0; i < order.getLineItemCount("item"); i++)
								{
									var sub_item = order.getLineItemValue("item","item",i+1);
									var sub_category = nlapiLookupField("item",sub_item,"custitem20");
									
									if(i!=x && (sub_category==TYPE_LOOSE_DIAMOND || sub_category==TYPE_LOOSE_SAPPHIRE))
									{
										subAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
									}
								}
								
								order.setLineItemValue("item","custcol_full_insurance_value",x+1,subAmount + (parseFloat(order.getLineItemValue("item","amount",x+1) * .8)));
								totalAmount += (parseFloat(order.getLineItemValue("item","amount",x+1)) * .8);
								
							}
							else if(order.getLineItemText("item","item",x+1).substring(0,3)=="BE2" || order.getLineItemValue("item","item",x+1)=="14385")
							{
								order.setLineItemValue("item","custcol_full_insurance_value",x+1,(order.getLineItemValue("item","amount",x+1) * .8));
								totalAmount += (parseFloat(order.getLineItemValue("item","amount",x+1)) * .8);
							}
							else
							{
								order.setLineItemValue("item","custcol_full_insurance_value",x+1,parseFloat((order.getLineItemValue("item","amount",x+1)) * .8));
								totalAmount += (parseFloat(order.getLineItemValue("item","amount",x+1)) * .8);
							}
						}
					}
					order.setFieldValue("custbody_full_insurance_amount",totalAmount);
				}
				
			}
			else if(order_type==RESIZE || order_type==REPAIR)
			{
				//DO NOTHING FOR NOW - THESE WILL BE HANDLED ON THE RESIZE/REPAIR PAGE SUITELETS
			}
			else if(order_type==WEDDING_BAND || order_type==ENGRAVING)
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("entity",null,"is",order.getFieldValue("entity")));
				filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
				var cols = [];
				cols.push(new nlobjSearchColumn("trandate").setSort(true));
				var results = nlapiSearchRecord("salesorder",null,filters,cols);
				if(results)
				{
					var originalOrder = nlapiLoadRecord("salesorder",results[x].getId());
					
					var totalAmount = 0.00;
					for(var x=0; x < originalOrder.getLineItemCount("item"); x++)
					{
						if(originalOrder.getLineItemValue("item","itemtype",x+1)=="InvtPart")
						{
							originalOrder.setLineItemValue("item","custcol_full_insurance_value",x+1,(originalOrder.getLineItemValue("item","amount",x+1) * .8));
							totalAmount += (parseFloat(originalOrder.getLineItemValue("item","amount",x+1)) * .8);
						}
					}
					order.setFieldValue("custbody_full_insurance_amount",totalAmount);
					for(var x=0; x < order.getLineItemCount("item"); x++)
					{
						order.setLineItemValue("item","custcol_full_insurance_value",x+1,totalAmount);
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
			
			nlapiSubmitRecord(order,true,true);
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
