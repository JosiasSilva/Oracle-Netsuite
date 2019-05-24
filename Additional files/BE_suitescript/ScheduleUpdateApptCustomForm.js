nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Schedule_UpdateApptCustomForm()
{
	try
	{
		var Search = nlapiLoadSearch(null, '5507');
 		var results = Search.runSearch();
 		var resultsArr = [];
		var so_arr = [];
 		var searchid = 0;
		do
		{
			var AllRows = results.getResults(searchid, searchid + 1000);
			if (AllRows != null && AllRows != '')
			{
			 	for (var rs=200; rs< AllRows.length; rs++)
				{
					var allCol = AllRows[rs].getAllColumns();
                    var apptId = AllRows[rs].getId();
					var apptCustomForm = AllRows[rs].getValue(allCol[6]);
					if(apptCustomForm == null)
					{
						var apptObj = nlapiLoadRecord("calendarevent",apptId);
						apptObj.setFieldValue("custevent_customform",apptObj.getFieldValue("customform"));
						apptId = nlapiSubmitRecord(apptObj,true,true);
						nlapiLogExecution("debug","Successfully updated appt custom form field of appt Id is :",apptId);
					}
				}
			}
		}while (AllRows.length >= 1000);
	}
	catch(e)
	{
		nlapiLogExecution("debug","Error raised during appt custom form field updation is : ",e.message);
	}
}
