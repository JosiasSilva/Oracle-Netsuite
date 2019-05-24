nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SetDeliveryInstruction_On_SO(type)
{
	try
	{
		//Loading Sales Order having Legal Field Value set on Customer Page
		var mySearch = nlapiLoadSearch(null,4424);
		var searchresult = [];
		var resultset = mySearch.runSearch();
		var searchid = 0;
		do {
		    var resultslice = resultset.getResults( searchid, searchid+1000 );
		    if (resultslice !=null && resultslice !='') {	
		    for (var rs in resultslice) {
		    	searchresult.push( resultslice[rs] );
		        searchid++;
		    } 
		    }
		} while (resultslice.length >= 1000);
		 var cnt=0;
		if (searchresult)
		{
			nlapiLogExecution('debug','Total No. of sales orders:'+searchresult.length,searchresult.length);
			for ( var z = 0; z < searchresult.length; z++)
			{
				var Results = searchresult[z].getAllColumns();
				var recId= searchresult[z].getId();
				if(recId != null && recId != '')
				{
					var soFieldArr=['custbody194'];
					 var deliveryInstArr=[];                                          
					var soField=nlapiLookupField("salesorder",recId,soFieldArr);
					var deliveryInstruction=soField.custbody194;
					  if(deliveryInstruction.length>0)
					    {
						  deliveryInstruction=deliveryInstruction.split(',');
					    }
					for(var i=0;i<deliveryInstruction.length;i++)
					{
						if(deliveryInstruction[i] != 9)
						{
							deliveryInstArr[deliveryInstArr.length]=deliveryInstruction[i];
						}
					}
					if(deliveryInstArr.length>0)
					{
						deliveryInstArr.push(9);  //Approval Needed Before Shipping
						deliveryInstArr=deliveryInstArr.sort();
						nlapiSubmitField("salesorder",recId,"custbody194",deliveryInstArr);
						nlapiLogExecution("debug","delivery Instruction field updated for SO Id:"+recId,recId);						
					}
					else
					{
					    deliveryInstArr.push(9);   //Approval Needed Before Shipping
						deliveryInstArr=deliveryInstArr.sort();
						nlapiSubmitField("salesorder",recId,"custbody194",deliveryInstArr);
						nlapiLogExecution("debug","delivery Instruction field updated for SO Id:"+recId,recId);	
					}
				}
			}
		}
			
	}
	catch(err)
	{
	nlapiLogExecution("Debug","Exception search Id 4424",err);	
	}
}