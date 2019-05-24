function Randomize_POs_for_Louping()
{	
	var pos = [];
	
	//Get list of Purchase Orders from saved search
	var search = nlapiLoadSearch("purchaseorder", "customsearch_random_po_louping");
	
    var resultSet = search.runSearch();
    var searchid = 0;

    do{
        var results = resultSet.getResults(searchid, searchid + 1000);
       
	    for(var x = 0; x < results.length; x++)
		{
            pos.push(results[x].getId());
			
            searchid++;
        }

    }while(results.length >= 1000);
	
	//Ensure array of PO internal IDs is unique
	pos = uniq(pos);
	
	//Find 10% value of array of POs
	var numPOs = Math.floor(pos.length * 0.20);
	
	//Retrive the internal IDs of those 10%
	var posToUpdate = getRandom(pos,numPOs);
	
	//Loop through each PO and check Louping field
	for(var x=0; x < posToUpdate.length; x++)
	{
		try
		{
			checkGovernance();
			
			nlapiSubmitField("purchaseorder",posToUpdate[x],"custbody_random_qa","T");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Marking PO " + posToUpdate[x] + " for Louping","Details: " + err.message);
		}
	}
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

function checkGovernance()
{
	var context = nlapiGetContext();
	nlapiLogExecution("audit","Remaining Usage: " + context.getRemainingUsage());
	
	if(context.getRemainingUsage() < 2500)
	{
 		var state = nlapiYieldScript();
		if(state.status == 'FAILURE')
     	{
      		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
   			throw "Failed to yield script";
  		} 
  		else if(state.status == 'RESUME')
  		{
   			nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
  		}
  		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 	}
}