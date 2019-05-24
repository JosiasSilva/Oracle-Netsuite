nlapiLogExecution("audit","FLOStart",new Date().getTime());
function getinventory()
{

var retObj = [];
var results = null;
retObj.push({InventoryList: [],});
try
{
			var searchResult = new Array();
			// Loading the Given saved search of Diamond 
			var searchObj = nlapiLoadSearch(null, 'customsearch_syncingcurrenti_2');
			// Running the Saved Search
			var searchResultSet = searchObj.runSearch();
			// Getting the All Results into one Array.
			var searchId = 0;
			do {
				var resultslice = searchResultSet.getResults(searchId,searchId + 1000);
				if (resultslice != null && resultslice != '') {
					for ( var rs in resultslice) {
						searchResult.push(resultslice[rs]);
						searchId++;
					}
				}
				
			} while (resultslice.length >= 1000);

			// Checking whether Search Result Array is null or not
			if (searchResult != null && searchResult != '') {
				nlapiLogExecution('debug', 'Length of Search result is',searchResult.length);
				var columns = searchResult[0].getAllColumns();
				//columns[17].setSort(true); // commented by ajay
                                columns[16].setSort(true); //added by ajay

				for ( var i = 0; i < searchResult.length; i++) {
					retObj[0].InventoryList.push({
					ItemNumber: searchResult[i].getValue(columns[0]),
					//Inventory_InventoryLocation: searchResult[i].getText(columns[17]), //commented by ajay
					//Inventory_LocationAvailable: searchResult[i].getValue(columns[16]),//commented by ajay
                                           Inventory_InventoryLocation: searchResult[i].getText(columns[16]), //added by ajay
                                           Inventory_LocationAvailable: searchResult[i].getValue(columns[15]),//added by ajay
					});
				}
			}
}
catch(e)
{
               nlapiLogExecution("debug","Error detail is : ",e.message);
		retObj[0].InventoryList.push({
		ItemNumber: "null",
        Inventory_InventoryLocation: "null",
        Inventory_LocationAvailable: "null",
		});
}
varResults = JSON.stringify(retObj);
nlapiLogExecution("DEBUG", "Results : ", varResults);
return varResults;
}