
/***** Script written by Vinay soni on 05/12/2017 for Task NS-999 *****/

function updateItemsShippingSeparately() 
{
	try 
	{
		var mySearch = nlapiLoadSearch(null, 'customsearchupdate_items_ship_separately'); // For Sandbox 
		var searchresult = [];
        var resultset = mySearch.runSearch();
        var searchid = 0;
        do 
		{
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            if (resultslice != null && resultslice != '') 
			{
                for (var rs in resultslice) 
				{
					ReSchedule();
					var so_id = resultslice[rs].getId();
					var flag = false;
					var temp = '';
					var diamond_certificate_status = resultslice[rs].getValue('custbody_certificate_status_so');
					if(diamond_certificate_status == 1 || diamond_certificate_status=='1')
					{
						temp = '8';
					}
					else if(diamond_certificate_status == 2 || diamond_certificate_status=='2')
					{
						temp = '1';
					}
					if(temp)
					{
						var item_shipping_separately = resultslice[rs].getValue('custbody304');
						if(item_shipping_separately)
						{
							item_shipping_separately = item_shipping_separately.split(',');
							if(item_shipping_separately.indexOf(temp) == -1)
							{
								flag = true;
								item_shipping_separately.push(temp);
							}
						}
						else
						{
							flag = true;							
							item_shipping_separately = [];
							item_shipping_separately.push(temp);
						}
						try
						{
							if(flag)
							{
								nlapiSubmitField('salesorder',so_id, 'custbody304',item_shipping_separately);
								nlapiLogExecution("Debug", "Update SO #"+so_id+" before #"+ resultslice[rs].getValue('custbody304'), JSON.stringify(item_shipping_separately));
							}
							else
							{							
								nlapiLogExecution("Debug", "Not Update SO #"+so_id+" before #"+ resultslice[rs].getValue('custbody304'), JSON.stringify(item_shipping_separately));
							}
						}
						catch(exec)
						{
							 nlapiLogExecution('error', 'Error in updating SO', exec);
						}
					}
                    searchid++;
                }
            }
        } 
		while (resultslice.length >= 1000);
	} 
	catch (e) 
	{
        nlapiLogExecution('error', 'Error', e.message);
    }
}

function ReSchedule() 
{
	if (nlapiGetContext().getRemainingUsage() < 500) 
	{
		var stateMain = nlapiYieldScript();
		if (stateMain.status == 'FAILURE') 
		{
			nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
			throw "Failed to yield script";
		} 
		else if (stateMain.status == 'RESUME') 
		{
			nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
		}
	}
}