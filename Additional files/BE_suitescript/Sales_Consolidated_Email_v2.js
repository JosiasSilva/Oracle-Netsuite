var DATA_CENTER_URL = "";

function consolidatedSearchEmail() {
    try {
        var ArrSearchIdNames = new Array();
		
        ArrSearchIdNames.push('617##0## KPI - Canadian Bookings: Results## Sum');
        ArrSearchIdNames.push('576##0## KPI - Avg Diamond Engagement Ring Order Value: Results## Average');
        ArrSearchIdNames.push('4274##0## KPI - Custom Order Bookings: Results## Group## Count# Sum');
		/*ArrSearchIdNames.push('1##0## KPI - Australian Bookings: Results## A');
        ArrSearchIdNames.push('2##0## KPI - US Bookings: Results## B');
        ArrSearchIdNames.push('3##0## KPI - Website Bookings: Results## C');
        ArrSearchIdNames.push('4##0## KPI - Gemstone Engagement Ring Bookings $: Results## D');
        ArrSearchIdNames.push('5##0## KPI - Diamond Engagement Ring Bookings $: Results## E');
        ArrSearchIdNames.push('6##0## KPI - Wedding Ring Bookings $: Results## F');
        ArrSearchIdNames.push('7##0## KPI - # Lab Diamond ER Orders (approval date): Results## G');
        ArrSearchIdNames.push('8##0## KPI - # Natural Diamond ER Orders: Results## H');
        ArrSearchIdNames.push('9##0## KPI - Preset Diamond ER Orders: Results## I');
		ArrSearchIdNames.push('10##0## KPI - Appt Bookings by location – SF: Results## J');
		ArrSearchIdNames.push('11##0## KPI - Appt Bookings by location – LA: Results## K');
        ArrSearchIdNames.push('12##0## KPI - Appt Bookings by location – BOS: Results## L');
        ArrSearchIdNames.push('13##0## KPI - Appt Bookings by location – CHI: Results## M');
        ArrSearchIdNames.push('14##0## KPI - KPI - Sales by approval date: Results## N');
        ArrSearchIdNames.push('15##0## KPI - UK Bookings: Results## O');
        ArrSearchIdNames.push('16##0## KPI - Post-sale bookings: Results## P');
		ArrSearchIdNames.push('17##0## KPI - Estate bookings: Results## Q');
        ArrSearchIdNames.push('18##0## KPI - KPI for Finished Jewelry Bookings $: Results## R');*/
		
		var colums = new Array();//
		colums.push(new nlobjSearchColumn("custrecord_sce_ranking").setSort());
        colums.push(new nlobjSearchColumn("custrecord_sce_search_id"));
        colums.push(new nlobjSearchColumn("custrecord_sce_search_title"));
	    colums.push(new nlobjSearchColumn("custrecord_sce_search_fields"));
        var searches = nlapiSearchRecord('customrecord_sales_cons_email_searches', null, null, colums);
        
       var kpiDateRages=getKPIdateRanges();

        var ArrLength = ArrSearchIdNames.length;
        if (searches) {
            var searchId = '',searchColumn = '', searchName = '';
            var htmlStr = '';
           var transCount = 0;
		   var msgStr = "";
		    
				//msgStr = msgStr + "<p style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 15px'><a href='" + url + "'>" + searchName + "</a></p>";
				msgStr = msgStr + "<table width='100%' border='1' cellspacing='0' cellpadding='0' style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 13px;padding-left:2px'>"
				msgStr = msgStr + "<tr>";
				msgStr = msgStr + "<td align='center'><b>SEARCH</b></td>";
				msgStr = msgStr + "<td align='center'><b>CURRENT</b></td>";
				msgStr = msgStr + "<td align='center'><b>PREVIOUS</b></td>";
				msgStr = msgStr + "<td align='center'><b>CHANGE</b></td>";
				msgStr = msgStr + "<td align='center'><b>PERIOD</b></td>";
				msgStr = msgStr + "</tr>";
            for (i = 0; i < searches.length; i++) {
                
               /* if (i == 0) {
                    var arrDateRange = getDateRange();
                    msgStr = msgStr + "<p style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 15px'><b>Date Range : </b> " + arrDateRange[0] + " - " + arrDateRange[1] + "</p>";
                }*/

                searchId = searches[i].getValue('custrecord_sce_search_id');
                searchColumn = searches[i].getValue('custrecord_sce_search_fields');
                searchName = searches[i].getValue('custrecord_sce_search_title');
                var currentYearVal;
				var previousYearVal;
				var changePercntge;
				var currentURL;
				var prevURL;
				
				try{
				 currentYearVal=getFiguresOnDateRange(kpiDateRages[0],kpiDateRages[1],searchId,searchColumn);
				 previousYearVal=getFiguresOnDateRange(kpiDateRages[2],kpiDateRages[3],searchId,searchColumn);
				 changePercntge= getChangePercentage(currentYearVal,previousYearVal);
				 if(changePercntge!='N/A')
					 changePercntge=changePercntge+'%';
				
				 currentURL=getKPIURL(searchColumn.toUpperCase(),searchId,'TMTD');
				 prevURL=getKPIURL(searchColumn.toUpperCase(),searchId,'SMLFYTD');
				}catch(ex)
				{
					nlapiLogExecution('DEBUG','Error in the search # searchId',ex.message);
					continue;
				}
				
				getDataCenterURL();
				
				var url = DATA_CENTER_URL + "/app/common/search/searchresults.nl?searchid=" + searchId;
				msgStr = msgStr + "<tr>";
				msgStr = msgStr + "<td  align='left'><a href='" + url + "'>" + searchName + "</a></td>";
				msgStr = msgStr + "<td  align='right'>" + formattedValue(currentYearVal) + "</td>";
				msgStr = msgStr + "<td  align='right'>" + formattedValue(previousYearVal) + "</td>";
				msgStr = msgStr + "<td  align='center'>" + changePercntge + "</td>";
				msgStr = msgStr + "<td  align='center'><a href='" + currentURL + "'>This Month to Date</a> vs. <a href='" + prevURL + "'>Same Month Last FYear to Date</a> </td>";
				msgStr = msgStr + "</tr>";
				
                transCount++;

                /*if (htmlStr == "") {
                    htmlStr = msgStr;
                } else {

                    htmlStr = htmlStr + msgStr;
                }*/


            } //end of loop
			msgStr = msgStr + "</table>";
            if (transCount >= 1) {

                sendEmail(msgStr);

            }
        }
    } catch (err) {
        nlapiLogExecution("Error", "Error on Consolidated Search", "Error : " + err.toString());

    }
}

function getChangePercentage(currentVal,previousVal)
{
	var percentage=0;
	if(previousVal!=0)
	{
	  percentage=(currentVal-previousVal)*100/previousVal;	
	  percentage= percentage.toFixed(1);
	}
	else
	{
		percentage="N/A";
	}
	 
	
	return percentage;
}

function getFiguresOnDateRange(startDate,endDate,searchId,col)
{
	var filters= new Array();
	var figureValue=0;
   	filters.push(new nlobjSearchFilter(col,null,'within',[startDate,endDate]));
    var results=nlapiSearchRecord(null,searchId,filters,null);
	if(results)
	{
		var cols = results[0].getAllColumns();
		figureValue=results[0].getValue(cols[0]);
	}
	if(figureValue=="")
	{
		figureValue=0;
	}
	return figureValue;
}
function getKPIURL(searchColumn,searchId,rptType)
{
	if(searchColumn=='TRANDATE')
	{
	  searchColumn='Transaction_'+searchColumn;
	}
	
	getDataCenterURL();
	
	var urlCurrYM = DATA_CENTER_URL + "/app/common/search/searchresults.nl?searchid="+searchId+"&kpi=T&"+searchColumn+"="+rptType+"&"+searchColumn+"modi=WITHIN&detail="+searchColumn;
	return urlCurrYM;
}

function getKPIdateRanges()
{
	var today = new Date();

    var date=today.getDate();
    var year= today.getFullYear();
    var month=today.getMonth()+1;
	
	var startDateCurrYearMonth=month+'/1/'+year;
	var endDateCurrYearMonth=month+'/'+date+'/'+year;
	
	var prevYear=year-1;
	
	var startDatePrevYearMonth=month+'/1/'+prevYear;
	var endDatePrevYearMonth=month+'/'+date+'/'+prevYear;
	
	return [startDateCurrYearMonth,endDateCurrYearMonth,startDatePrevYearMonth,endDatePrevYearMonth];

}

function sendEmail(body) {
    var subject = "Sales KPI Consolidated Search Results";
    // var emailToArr = ['rflaata@brilliantearth.com'];
     var emailToArr = ['beth@brilliantearth.com','eric@brilliantearth.com'];
	
    try {
        nlapiSendEmail(20186, emailToArr, subject, body);
        nlapiLogExecution("debug", "Consolidated saved search results emailed successfully", "");
       } catch (e) {
        nlapiLogExecution('DEBUG', 'Email Error ', e);
    }
}
function formattedValue(val)
{
	if(val==0)
	{
		return '-' ;
	}
	else
	{
		return numberWithCommas(val);
	}
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getDataCenterURL()
{
	var environment = nlapiGetContext().getEnvironment();
	
	var filters = [];
	filters.push(new nlobjSearchFilter("name",null,"is",environment));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_data_center_url"));
	var results = nlapiSearchRecord("customrecord_data_center_url",null,filters,cols);
	if(results)
		DATA_CENTER_URL = results[0].getValue("custrecord_data_center_url");
}
