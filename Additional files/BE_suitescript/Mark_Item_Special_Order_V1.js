/*
 * Script Author 		: 	Unknown
 * Author Designation 	: 	
 * Script Type 			:	Suitescript (User Event)
 * Description 			:	
 * Created Date 		:	Unknown
 * Last Modified Date	:	December 28, 2018 (Please put a comment with date when code is modified)
 * Comments 			:	// 12/28/2018 - Nikhil - Need to mark all Items with Category "Loose Diamond" as Special Order Item - Refer NS-1435
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
				return true;
			/* Start: Adding code for NS-1435 on December 28, 2018 - Nikhil */
			
			else
			{
				nlapiSetFieldValue("isspecialorderitem","T");
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
