function Drop_Ship_Email_Confirmation_Status(type)
{
	if(type=="create")
	{
		try
		{
			var receipt = nlapiGetNewRecord();
			var po = receipt.getFieldValue("createdfrom");
			
			var receiptItems = [];
			for(var x=0; x < receipt.getLineItemCount("item"); x++)
			{
				receiptItems.push(receipt.getLineItemValue("item","item",x+1));
			}
			
			//Get sales order from PO
			// Start : Satya : 12/05/2018 : NS-1433
			//var so = nlapiLookupField("purchaseorder",po,"createdfrom");
			//var vendor = nlapiLookupField("purchaseorder",po,"entity");
          	//var poDropShip = nlapiLookupField("purchaseorder",po,"custbody39");
          	var poFlds = ["createdfrom", "entity", "custbody39"];
            var poObj = nlapiLookupField("purchaseorder",po, poFlds);
            var so = poObj.createdfrom;
            var vendor = poObj.entity;
            var poDropShip = poObj.custbody39; //Drop Ship Materials Sent to Vendor(Date)
           // End : Satya : 12/05/2018 : NS-1433
			var typeOfContact = nlapiLookupField("vendor",vendor,"custentity4");

			if(poDropShip==null || poDropShip=="")
			{
				nlapiLogExecution("error","PO is not Drop Ship","Script will exit.");
				return true;
			}
			
			if(typeOfContact!="6")
			{
				nlapiLogExecution("debug","Vendor Type of Contact != Production Vendor/Jeweler","Script will exit.");
				return true;
			}
          
			var filters = [];
			filters.push(new nlobjSearchFilter("anylineitem",null,"anyof",receiptItems));
			filters.push(new nlobjSearchFilter("createdfrom",null,"is",so));
			filters.push(new nlobjSearchFilter("custbody39",null,"isnotempty")); // Drop Ship Materials Sent to Vendor
			filters.push(new nlobjSearchFilter("custbody_pickup_location",null,"noneof","1")); // 1 - San Francisco
			filters.push(new nlobjSearchFilter("appliedtotransaction",null,"noneof","@NONE@"));
			filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","SalesOrd"));
			filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
			filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
			filters.push(new nlobjSearchFilter("cogs",null,"is","F"));
			filters.push(new nlobjSearchFilter("type","item","noneof",["NonInvtPart","Service"]));
			var cols = [];
			cols.push(new nlobjSearchColumn("internalid",null,"group"));
			cols.push(new nlobjSearchColumn("custbody_pickup_location",null,"group"));
			var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
            var isAllPOrecvd = false; // Added : Satya : 12/05/2018 : NS-1433
                      
			if(results)
			{
               if(so) // Added : Satya : 12/05/2018 : NS-1433
				isAllPOrecvd = allPOsReceived(so); // Added : Satya : 12/05/2018 : NS-1433
			nlapiLogExecution("debug","Inside the Result","isAllPOrecvd : " + isAllPOrecvd);
			   for(var x=0; x < results.length; x++)
				{
                  nlapiLogExecution("debug","custbody_pickup_location Testing ","custbody_pickup_location : " + results[x].getValue("custbody_pickup_location",null,"group")); // Testing : Satya : 12/05/2018 
                  
					if(results[x].getValue("custbody_pickup_location",null,"group")!=null && results[x].getValue("custbody_pickup_location",null,"group")!="")
					{
						nlapiSubmitField("itemfulfillment",results[x].getValue("internalid",null,"group"),"custbody89","7"); //In Transit
					}
					else
					{
						if(isAllPOrecvd){// Added : Satya : 12/05/2018 : NS-1433
                           nlapiSubmitField("itemfulfillment",results[x].getValue("internalid",null,"group"),"custbody89","1"); //To Be Emailed
                        nlapiLogExecution("debug","Inside else","itemfulfillment Record Updated. Iternal Id : " +  results[x].getValue("internalid",null,"group"));
                        } // Added : Satya : 12/05/2018 : NS-1433
							
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Transferring Satellite PU","Details: " + err.message);
		}
	}
}

// Start : Satya : 12/05/2018 : Fetch all the attched POs of the SO : NS-1433
function allPOsReceived(SOid){
	nlapiLogExecution("debug","SOid inside the function","SOid : " + SOid);
	
	var filters = [];
	var cols = [];
    cols.push(new nlobjSearchColumn("statusref","applyingTransaction",null));// 

	filters.push(new nlobjSearchFilter("type",null,"anyof","SalesOrd"));
	filters.push(new nlobjSearchFilter("internalid",null,"anyof",SOid));
	filters.push(new nlobjSearchFilter("type","applyingtransaction","anyof","PurchOrd"));
	filters.push(new nlobjSearchFilter("status","applyingtransaction","anyof","PurchOrd:B")); // Purchase Order:Pending Receipt
	
	var SrchSOresults = nlapiSearchRecord("salesorder", null, filters, cols);
	
	if(SrchSOresults){ // if the search returns any value
		return false;
    }else // if the search does not returns any value
        return true;
	
}
// End : Satya : 12/05/2018 : Fetch all the attched POs of the SO : NS-1433