/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/email', 'N/runtime'],
    function(search, record, email, runtime) {
		//Global variables
        var strMsg="";
        var htmlBody = "";

        function execute() {
            try {
				//Array of objects having processing details of searches
				var arrSearchData=[
				{
					category:'OM Searches:',
					details:	[
						{
							search_title:'KPI OM - Orders Processed This Week',
							search_id:1586,
							search_columns:['SET BY','COUNT OF SALES ORDER'],
                          	text_column_index:[0],
                          	value_column_index:[1]
						},
						{
							search_title:'KPI OM - Ops/CS Flips per User',
							search_id:9721,
							search_columns:['USER','NUMBER OF FLIPS'],
                          	text_column_index:[0],
                          	value_column_index:[1]
						},
						{
							search_title:'KPI - OM Tasks Completed by Team Member',
							search_id:4784,
							search_columns:['SET BY','COUNT OF INTERNAL ID'],
                          	text_column_index:[0],
                          	value_column_index:[1]
						},
						{
							search_title:'KPI OM- Backstock Pulled Per Person Last Week',
							search_id:9613,
							search_columns:['NEW VALUE','COUNT OF INTERNAL ID'],
                          	text_column_index:[],
                          	value_column_index:[0,1]
						}
						
					]
				},
				{
					category:'Prod:',
					details:	[
						{
							search_title:'POs QA’ed per Person last Week',
							search_id:5405,
							search_columns:['TEAM MEMBER','TOTAL','ROUND 1','ROUND 2'],
                          	text_column_index:[0],
                          	value_column_index:[1]
						},
						{
							search_title:'KPI - Production Tasks Completed by Team Member',
							search_id:8672,
							search_columns:['SET BY','COUNT OF INTERNAL ID'],
                          	text_column_index:[0],
                          	value_column_index:[1]
						},
						{
							search_title:'KPI Production - Repair Evals This Week',
							search_id:2550,
							search_columns:['USER','REPAIR EVALS THIS WEEK'],
                          	text_column_index:[0],
                          	value_column_index:[1]
						}
					]
				},
				{
					category:'Fraud:',
					details:	[
						{
							search_title:'KPI - Fraud Checked (this week)',
							search_id:8869,
							search_columns:['COUNT OF # ORDERS','SET BY'],
                          	text_column_index:[1],
                          	value_column_index:[0]
						},
						{
							search_title:'KPI Fraud - Fraud Check Requested by Ops Last Week',
							search_id:9182,
							search_columns:['SET BY','# OF SALES ORDER','# OF PASSED','% PASSED','# OF REQUESTED','% REQUESTED'],
                         	text_column_index:[0],
                          	value_column_index:[1,2,3,4,5]
						},
						{
							search_title:'KPI Fraud - Address Change Request Completed by User this Week',
							search_id:9722,
							search_columns:['SET BY','COUNT OF FC APPROVED','COUNT OF REQUESTED MORE INFO','COUNT OF REQUEST REJECTED'],
                          	text_column_index:[0],
                          	value_column_index:[1,2,3]
						},
						{
							search_title:'KPI - Fraud Tasks Completed by Team Member',
							search_id:5969,
							search_columns:['SET BY','COUNT OF INTERNAL ID'],
                          	text_column_index:[0],
                          	value_column_index:[1]
						},
						{
							search_title:'KPI Fraud - Information Requested from Customer Last Week ',
							search_id:9739,
							search_columns:['AUTHOR','# CUSTOMERS','# MESSAGES SENT'],
                          	text_column_index:[0],
                          	value_column_index:[1,2]
						}
						
					]
				}
				];
			
				//Process all the searches
				arrSearchData.forEach(processResults);
				
				//Send email with summary of each search
				sendEmail(htmlBody, email);
                   
            } catch (e) {
				log.debug({
					title: e.name,
					details: e.message
				});
            }
        }
		return {
             execute: execute
         };
        function processResults(arrObj) {
			//Get details of each search
			var search_category= arrObj.category;
			var obj_search_detail=arrObj.details;
			
			//Generate category header of searches
			strMsg = strMsg + "<p style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 15px'><b>"+search_category+" </b></p>";
			
			//Looping through each search
			for(var icount=0;icount<obj_search_detail.length;icount++)
			{
				//Get all the details of each search
				var search_title=obj_search_detail[icount].search_title;
				var search_id=obj_search_detail[icount].search_id;
				var columns=obj_search_detail[icount].search_columns;
             	var text_columns=obj_search_detail[icount].text_column_index;
                var value_columns=obj_search_detail[icount].value_column_index;
				
				//Generate email body in HTML
				var url = "https://system.netsuite.com/app/common/search/searchresults.nl?searchid=" + search_id;
                strMsg = strMsg + "<p style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 15px'><a href='" + url + "'>" + search_title + "</a></p>";
				strMsg = strMsg + "<table width='100%' border='1' cellspacing='0' cellpadding='0' style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 13px'>"
				
				//Generate search headers in HTML
				strMsg = strMsg + "<tr>";
				for(var icolumns=0;icolumns<columns.length;icolumns++)
				{
					 strMsg = strMsg + "<td align='center'><b>" + columns[icolumns] + "</b></td>";
				}
				strMsg = strMsg + "</tr>";
				
				//Load search
				var mySearch = search.load({
                    id: search_id
                });
				
				//Get all columns from the search
              	var search_columns = mySearch.columns;
				
				//Get data for paged run
                var myPagedData = mySearch.runPaged();
				
                //Looping through the search results
				var flag=false;
                myPagedData.pageRanges.forEach(function(pageRange) {
                    var myPage = myPagedData.fetch({
                        index: pageRange.index
                    });
					
					//Looping through each page result
                    myPage.data.forEach(function(result) {
						strMsg = strMsg + "<tr>";
						
                        //Looping through each columns
                        for (var y = 0; y < columns.length; y++) {
                          if(text_columns.indexOf(y)>-1)
                          {
                            var searchResult = result.getText(search_columns[y]);
                          }
                          if(value_columns.indexOf(y)>-1)
                          {
                            var searchResult = result.getValue(search_columns[y]);
                          }
							
						strMsg = strMsg + "<td  align='center'>" + searchResult + "</td>";
                        flag=true;
                        }
						 strMsg = strMsg + "</tr>";
                    });
                });
				
				//Check whether there is any data for the search if not then set message for no result
				if(!flag)
				{
				 strMsg = strMsg + "<tr><td colspan='6' align='left' style='padding:3px'>No Result Found!</td></tr>";
				}
				strMsg = strMsg + "</table>";
				flag=false;
			}
				

            if (htmlBody == "") {
                htmlBody = strMsg;
            } else {

                htmlBody = htmlBody + strMsg;
            }
			strMsg="";
            return true;
        }
    });

function sendEmail(body, email) {
    var subject = "OM/Prod KPIs (weekly)";
    try {
        email.send({
            author: 20186,
            recipients: 'tringquist@brilliantearth.com', //jgautier@brilliantearth.com //rflaata@brilliantearth.com
            subject: subject,
            body: body
        });
        log.debug({
            title: 'Delivery Status',
            details: 'Delivered Successfully'
        });
    } catch (e) {
        log.debug({
            title: ex.name,
            details: ex.message
        });
    }
}