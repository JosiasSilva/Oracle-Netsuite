nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Rahul Panchal (rahul.panchal@inoday.com)
 * Author Desig. : Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Scheduled
 * Script Name   : Highlight_To_be_watched_on_SO.js  
 * Created Date  : Nov 23,2016 
 * SB Script URL: /app/common/scripting/script.nl?id=1134
 **/


function Highlight_TBW_on_SO()
{
	try
	{
		var context = nlapiGetContext();
		var mySearch = nlapiLoadSearch(null,2138);
		var searchresult = [];
		var resultset = mySearch.runSearch();
		var searchid = 0;
		do
		{
			var resultslice = resultset.getResults( searchid, searchid+1000 );
		    if (resultslice !=null && resultslice !='')
			{	
				for (var rs in resultslice)
				{
					searchresult.push( resultslice[rs] );
					searchid++;
				} 
		    }
		}
		while (resultslice.length >= 1000);
		 var cnt=0;
		if (searchresult)
		{
			nlapiLogExecution('debug','Total No. of sales orders:'+searchresult.length,searchresult.length);	
			var reschedulePoint = nlapiGetContext().getSetting('SCRIPT','custscript_reschedule');
	     	reschedulePoint = (reschedulePoint!=null && reschedulePoint!=undefined) ? parseInt(reschedulePoint) : 0;
			for ( var z = reschedulePoint; z < searchresult.length; z++)		
			{				
	     		//nlapiLogExecution("debug","Starting Point is :z",reschedulePoint);				
				var Results = searchresult[z].getAllColumns();
				var recId= searchresult[z].getId();
				var documentNo=searchresult[z].getValue(Results[0]);
				if(recId != null && recId != '')
				{
					var filters = [];
					filters[0] = nlobjSearchFilter("tranid",null,"is",documentNo);
					filters[1] = nlobjSearchFilter("mainline",null,"is","T");
					var searchResults = nlapiSearchRecord("salesorder",null,filters,null);
					if(searchResults)
					{
						var soId = searchResults[0].id;
						var TobeWatched=nlapiLookupField("salesorder",soId,"custbody129");
						if(TobeWatched=='F')
						{	
							TobeWatched ='T';
							nlapiSubmitField("salesorder",soId,"custbody129",TobeWatched);
							nlapiLogExecution("debug","TBW is checked on SO",documentNo);
						}
				   } // end of recId
				}
				if ( context.getRemainingUsage() <= 0 && (z+1) < searchresult.length )
				{
					//nlapiLogExecution("debug","Rescheduling Point is :",z);
					var params = new Array();
					params['custscript_reschedule'] = z;
					var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(),params);
					if ( status == 'QUEUED' )
					{
						//nlapiLogExecution("debug","scheduled script status is :",status);					
						break;
					}					     
				}	
			  }  // end of for loop			
		  }  // end of searchresult		
	 }  // end of try block
	catch(err)
	{
		nlapiLogExecution("debug","Error occuring in Sales order",err.message);
	}
}
