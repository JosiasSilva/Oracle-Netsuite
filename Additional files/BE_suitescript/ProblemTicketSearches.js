nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript
 * Script Name   : ProblemTicketSearches.js
 * Created Date  : March 28, 2016
 * Last Modified Date : March 28, 2016
 * Comments : Script will create Problem Ticket Searches Results and send Email..............
 * URL: https://system.netsuite.com/app/common/scripting/script.nl?id=892
 */

function problemTicketSearches()
{
	
	try
	{		
	   var ArrSearchIdNames= [];		
	   ArrSearchIdNames= ['3935#KPI - Gem Request Problem Tickets Last Week: Results','3933#KPI - Inventory Problem Tickets Last Week: Results','3932#KPI - Order Management Problem Tickets Last Week: Results','3934#KPI - Production Problem Tickets Last Week: Results','3899#KPI - Fulfillment Problem Tickets Last Week: Results'];				   
	   var ArrLength=ArrSearchIdNames.length;
		if(ArrLength>0)
		{	
			//nlapiLogExecution('DEBUG',"Array Length", ArrLength); 
			var searchId='',searchName='';
			var IdNameArr='';
			var units='';
			var msgArr='';
			var htmlStr='';		 
			for(i=0;i<ArrLength;i++)
			{
			   IdNameArr=ArrSearchIdNames[i].split('#');
			   searchId=IdNameArr[0];
			   searchName=IdNameArr[1];
			   nlapiLogExecution('DEBUG',"search Id:"+searchId+",searchName:"+searchName, searchId); 
			   var ItemArray =new Array();
			   var ObjSearch = nlapiLoadSearch(null,searchId);
			   var searchResults = ObjSearch.runSearch();
			   var index = 0; 
			   var resultStep = 1000;
			   var resultSet=null;
			   var searchCount=0;
			   do{ 
					var url="https://system.netsuite.com/app/common/search/searchresults.nl?searchid="+searchId;
					//nlapiLogExecution('DEBUG', url);
					msgStr ="<table border='0' align='left' width='100%' cellpadding='0' cellspacing='0'>"
					msgStr =msgStr +"<tr><td>&nbsp;</td></tr>";
					msgStr =msgStr +"<tr>";
					msgStr =msgStr +"<td width='100%' align='left' align='left'><b><a href='"+url+"'>"+searchId+" - "+searchName+"</b></a></td>";
					msgStr =msgStr +"</tr>";
					msgStr =msgStr +"<tr><td>&nbsp;</td></tr>";
					
					msgStr =msgStr +"<tr>";
					msgStr =msgStr +"<td>";
					msgStr =msgStr +"<table border='0' align='left' width='50%' cellpadding='0' cellspacing='0'>";
					
					/*msgStr =msgStr +"<tr>";				
					msgStr =msgStr +"<td width='30%' align='left'><b>Name</b></td>";
					msgStr =msgStr +"<td width='20%' align='left'><b>Total No.</b></td>";				
					msgStr =msgStr +"</tr>";*/
				   resultSet = searchResults.getResults(index, index + resultStep);
				   index = index + resultStep;
				   var count=0;
				   for(var m=0; resultSet!=null && m<resultSet.length; m++) 
				   { 
						count=count+1;
						var Results = resultSet[m].getAllColumns();	
						var itemName= resultSet[m].getText(Results[0]);
						var itemCount= resultSet[m].getValue(Results[1]);
						
						msgStr =msgStr +"<tr>";	
						msgStr =msgStr +"<td width='40%' align='left'><b>"+itemName+"</b></td>";
						msgStr =msgStr +"<td width='10%' align='left'><b>"+itemCount+"</b></td>";
						msgStr =msgStr +"</tr>";
					  
				   }
					if(count==0)	
					{
						msgStr =msgStr +"<tr><td colspan='2' align='left'>No Search Results found</td></tr>";
					}
					msgStr =msgStr +"</table>"   
					msgStr =msgStr +"</td>";
					msgStr =msgStr +"<tr><td>&nbsp;</td></tr>";
					msgStr =msgStr +"</tr>";
					msgStr =msgStr +"</table>"  
					searchCount=searchCount+1;
				 }while (resultSet.length >= 1000);
				 htmlStr= htmlStr + msgStr;
				 //nlapiLogExecution('DEBUG',"Details", msgStr); 
		   }//end of loop
			   
			if(searchCount>=1)
			{
				//nlapiLogExecution('DEBUG',"html string format", htmlStr); 
				var subject="Problem Ticket Searches"; 
				var body=htmlStr;
							
				var emailTo='opsmgrs@brilliantearth.com';                               
				//var emailtoCc='aaguilar@brilliantearth.com';
				//var emailtoCc=null; //Set empty
				nlapiSendEmail(20186, emailTo, subject, body,emailtoCc);
				nlapiLogExecution("debug","Problem Ticket Searches Email To : "+emailTo+", Email CC: "+emailtoCc);
				
			
			}		   
		}
	}
	catch(err)
	{
		nlapiLogExecution("Error", "Error on Problem Ticket Searches", "Error : " + err.toString());

	}
}