/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/email', 'N/runtime'],
    function(search, record, email, runtime) {
        var transCount = 0;
        var htmlStr = "";

        function execute() {
            try {
                search.create({
                    "type": "customrecord_sales_cons_email_searches",
                    "columns": ['custrecord_sce_search_id', 'custrecord_sce_search_title', 'custrecord_sce_search_fields']
                }).run().each(processResults);

                if (transCount >= 1) {

                    sendEmail(htmlStr, email);
                }
            } catch (e) {
            }
        }
        //execute();
       return {
             execute: execute
         };
        function processResults(result) {

            var kpiDateRages = getKPIdateRanges();
            var id = result.getValue('custrecord_sce_search_id');
            var msgStr = "";
            var searchId = result.getValue('custrecord_sce_search_id');
            var searchColumn = result.getValue('custrecord_sce_search_fields');
            var searchName = result.getValue('custrecord_sce_search_title');
            var currentYearVal;
            var previousYearVal;
            var changePercntge;
            var currentURL;
            var prevURL;

            try {
                currentYearVal = getFiguresOnDateRange(kpiDateRages[0], kpiDateRages[1], searchId, searchColumn, search);
                previousYearVal = getFiguresOnDateRange(kpiDateRages[2], kpiDateRages[3], searchId, searchColumn, search);
                changePercntge = getChangePercentage(currentYearVal, previousYearVal);
                if (changePercntge != 'N/A')
                    changePercntge = changePercntge + '%';

                currentURL = getKPIURL(searchColumn.toUpperCase(), searchId, 'TMTD');
                prevURL = getKPIURL(searchColumn.toUpperCase(), searchId, 'SMLFYTD');
            } catch (ex) {
                log.debug({
                    title: ex.name,
                    details: ex.message
                });
                //nlapiLogExecution('DEBUG','Error in the search # searchId',ex.message);
                //continue;
            }
			
			getDataCenterURL();
			
            var url = DATA_CENTER_URL + "/app/common/search/searchresults.nl?searchid=" + searchId;
            msgStr = msgStr + "<p style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 15px'><a href='" + url + "'>" + searchName + "</a></p>";
            msgStr = msgStr + "<table width='100%' border='1' cellspacing='0' cellpadding='0' style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 13px'>"
            msgStr = msgStr + "<tr>";
            msgStr = msgStr + "<td align='center'><b>SEARCH</b></td>";
            msgStr = msgStr + "<td align='center'><b>PERIOD</b></td>";
            msgStr = msgStr + "<td align='center'><b>CURRENT</b></td>";
            msgStr = msgStr + "<td align='center'><b>PREVIOUS</b></td>";
            msgStr = msgStr + "<td align='center'><b>CHANGE</b></td>";
            msgStr = msgStr + "</tr>";



            msgStr = msgStr + "<tr>";
            msgStr = msgStr + "<td  align='center'>" + searchName + "</td>";
            msgStr = msgStr + "<td  align='center'><a href='" + currentURL + "'>This Month to Date</a> vs. <a href='" + prevURL + "'>Same Month Last FYear to Date</a> </td>";
            msgStr = msgStr + "<td  align='center'>" + currentYearVal + "</td>";
            msgStr = msgStr + "<td  align='center'>" + previousYearVal + "</td>";
            msgStr = msgStr + "<td  align='center'>" + changePercntge + "</td>";
            msgStr = msgStr + "</tr>";
            msgStr = msgStr + "</table>";
            transCount++;

            if (htmlStr == "") {
                htmlStr = msgStr;
            } else {

                htmlStr = htmlStr + msgStr;
            }

            return true;
        }


    });


var DATA_CENTER_URL = "";

function getChangePercentage(currentVal, previousVal) {
    var percentage = 0;
    if (previousVal != 0) {
        percentage = (currentVal - previousVal) * 100 / previousVal;
        percentage = percentage.toFixed(1);
    } else {
        percentage = "N/A";
    }


    return percentage;
}

function getFiguresOnDateRange(startDate, endDate, searchId, col, search) {


    var figureValue = 0;
    var mySearch = search.load({
        id: searchId
    });
    var mySearchFilter = search.createFilter(col, null, 'within', [startDate, endDate]);

    mySearch.filters.push(mySearchFilter);
    var search_record = mySearch.run();
    search_record.each(function(result) {
        figureValue = result.getValue(result.columns[0]);
        var k = 0;
    });
    if (figureValue == "") {
        figureValue = 0;
    }


    return figureValue;
}

function getKPIURL(searchColumn, searchId, rptType) {
    if (searchColumn == 'TRANDATE') {
        searchColumn = 'Transaction_' + searchColumn;
    }
	
	getDataCenterURL();
	
    var urlCurrYM = DATA_CENTER_URL + "/app/common/search/searchresults.nl?searchid=" + searchId + "&kpi=T&" + searchColumn + "=" + rptType + "&" + searchColumn + "modi=WITHIN&detail=" + searchColumn;
    return urlCurrYM;
}

function getKPIdateRanges() {
    var today = new Date();

    var date = today.getDate();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;

    var startDateCurrYearMonth = month + '/1/' + year;
    var endDateCurrYearMonth = month + '/' + date + '/' + year;

    var prevYear = year - 1;

    var startDatePrevYearMonth = month + '/1/' + prevYear;
    var endDatePrevYearMonth = month + '/' + date + '/' + prevYear;

    return [startDateCurrYearMonth, endDateCurrYearMonth, startDatePrevYearMonth, endDatePrevYearMonth];

}

function sendEmail(body, email) {
    var subject = "Sales KPI Consolidated Search Results";
    //var emailToArr=['cssupport@brilliantearth.com']; 
    //var emailCCArr=['sdziesietnik@brilliantearth.com']; 
    //var emailToArr = ['rflaata@brilliantearth.com'];
    var emailToArr = ['sandeep.kumar@inoday.com'];
    var emailCCArr = ['sandeep.kumar@inoday.com'];
    //var emailBCCArr=['eito@brilliantearth.com','sprastogi@inoday.com'];
    try {
        email.send({
            author: 20186,
            recipients: 'sandeep.kumar@inoday.com',
            subject: subject,
            body: body
        });
        //nlapiSendEmail(20186, emailToArr, subject, body, emailCCArr);
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