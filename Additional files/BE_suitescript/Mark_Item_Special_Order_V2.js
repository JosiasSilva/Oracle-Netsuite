/*
 * Script Author 		: 	Unknown
 * Author Designation 	: 	
 * Script Type 			:	Suitescript (User Event)
 * Description 			:	
 * Created Date 		:	Unknown
 * Last Modified Date	:	December 28, 2018 (Please put a comment with date when code is modified)
 * Comments 			:	// 12/28/2018 - Nikhil - Need to mark all Items with Category "Loose Diamond" as Special Order Item - Refer NS-1435
 *						:	// 02/07/2019 - Nikhil - Need to check for On hand and In transit Quantity before setting special order item as true.
 * SB SS URL 			:	https://system.netsuite.com/app/common/scripting/script.nl?id=468
 * Production SS URL	:	https://system.na3.netsuite.com/app/common/scripting/script.nl?id=468
 */


nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Mark_Item_Special_Order(type)
{
	if(type=="create" || type=="edit" || type=="xedit") // xedit added as an improvement with NS-1435 on December 28, 2018
	{
		try
		{
			var category = nlapiGetFieldValue("custitem20");
			var custitem97 = nlapiGetFieldValue("custitem97");
			
			if(category!="7")
			{
				nlapiLogExecution('Debug', 'Item is not a loose diamond', 'No actions taken.');
				return true;
			}
			/* Start: Adding code for NS-1435 on December 28, 2018 - Nikhil */
			
			else
			{
				/* Start: Added for NS-1514 on February 07, 2019*/
				
				var itemInternalId = nlapiGetNewRecord().getId();
				var itemSearch = nlapiSearchRecord("item",null,
				[
				   ["internalid","anyof",itemInternalId], 
				   "AND", 
				   ["inventorylocation","anyof","14","18","30","10","2","25","7","15","23","28","31","13","27","34","26"], 
				   "AND", 
				   [["locationquantityintransit","greaterthanorequalto","1"],"OR",["locationquantityonhand","greaterthanorequalto","1"]]
				], 
				[
				   new nlobjSearchColumn("inventorylocation"), 
				   new nlobjSearchColumn("locationquantityonhand"), 
				   new nlobjSearchColumn("locationquantityintransit")
				]
				);
				
				if(itemSearch && itemSearch.length > 0)
				{
					nlapiLogExecution('Debug', 'Item ' + itemInternalId + ' has On Hand Quantity or In Transit quantity > 1', 'Not marking item as special order.');
				}
				else
				{
					nlapiLogExecution('Debug', 'Item ' + itemInternalId + ' - 0 On hand or In transit quantity for scripted locations', 'Marking item as special order.');
					nlapiSetFieldValue("isspecialorderitem","T");
				}
				
				/* nlapiSetFieldValue("isspecialorderitem","T"); */
				/* End: Added for NS-1514 on February 07, 2019*/
			}
			
			/* End: Adding code for NS-1435 on December 28, 2018 - Nikhil */
			
			/* Start: Commenting below code for NS-1435 on December 28, 2018 - Nikhil */
			/*
			if(type=="create")
			{
				if(custitem97=="1" || custitem97=="7" || custitem97=="8" || custitem97=="" || custitem97==null)
				{
					nlapiSetFieldValue("isspecialorderitem","T");
				}
			}
			else if(type=="edit")
			{
				if(custitem97=="1" || custitem97=="7" || custitem97=="8" || custitem97=="" || custitem97==null)
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("item",null,"is",nlapiGetRecordId()));
					var results = nlapiSearchRecord("purchaseorder",null,filters);
					if(!results)
					{
						nlapiSetFieldValue("isspecialorderitem","T");
					}
				}
			}
			*/
			/* End: Commenting below code for NS-1435 on December 28, 2018 - Nikhil */
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Special Order Flag","Details: " + err.message);
			return true;
		}
	}
}
