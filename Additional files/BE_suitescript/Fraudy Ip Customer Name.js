nlapiLogExecution("audit","FLOStart",new Date().getTime());
// /app/common/scripting/script.nl?id=1088&whence= [sand box] 
// /app/common/search/searchresults.nl?searchid=4652&whence= [sand box]
// /app/common/scripting/script.nl?id=1100&whence= [production]
function fraudy_ip_adds_customer()
{
        try
        {
            var mySearch = nlapiLoadSearch(null,4898);
			var searchresult = [];
			var resultset = mySearch.runSearch();
			var searchid = 0;
			do {
				var resultslice = resultset.getResults(searchid, searchid+1000 );
				if (resultslice !=null && resultslice !='') 
				{	
					for (var rs in resultslice) 
					{
						searchresult.push(resultslice[rs]);                
						searchid++;
					   
					} 
				}
			} while (resultslice.length >= 1000);	

            var searchCount1=searchresult.length;   
            nlapiLogExecution("debug"," Length : "+ searchCount1, searchCount1);	   
			if (searchresult && searchCount1>0) 
			{        
                	
				for( var m = 0; m < searchresult.length; m++) 
				{
					var soId= searchresult[m].getId();			
					var isFraudy= searchresult[m].getValue('custbody352');
					nlapiLogExecution("debug","sales order id",soId);
                    updateisFraudy(isFraudy,soId);
				   
				}
				
			}	
		}
		catch(ex)
		{
			nlapiLogExecution("debug","Error raised on fraudy_ip_adds_customer fun is :",ex.message);
		}

}

function updateisFraudy(_isFraudy,_soId)
{
	  try
      {
			  if(_isFraudy =='F')
			 {
				nlapiSubmitField('salesorder',_soId,'custbody352','T') ;
			 }
		}
		catch(ex)
		{
			nlapiLogExecution("debug","Error raised on updateisFraudy fun is :",ex.message);
		}
}