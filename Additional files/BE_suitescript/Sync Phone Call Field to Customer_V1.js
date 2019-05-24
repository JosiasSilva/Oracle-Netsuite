/**
 * Script Author : Sandeep Kumar (sandeep.kumar@inoday.com/sksandy28@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Scheduled Script)
 * Script Name   : 
 * Created Date  : May 17, 2018
 * Last Modified Date : 
 * Comments : 
 * SS URL : 
 * Script URL:
 */
function syncPhoneCallFieldToCustomer() {
    var customer_id = '';
    var phone_call_id = ''
    try {

        //Maintain execution state if timeout exception occured
        if (nlapiGetContext().getRemainingUsage() < 500) {
            var stateMain = nlapiYieldScript();
            if (stateMain.status == 'FAILURE') {
                nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                throw "Failed to yield script";
            } else if (stateMain.status == 'RESUME') {
                nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
            }
        }



        var filters = [[["custeventcontiviocontactresult","is","SUCCESS"],"OR",["custeventcontiviocontactresult","is","CALLBACK"]],"AND",["formulatext: {company}","isnotempty",""],"AND",["createddate","on","today"]];
        var cols = new Array();


        //Add Columns to retrieve
        cols.push(new nlobjSearchColumn('company', null, 'group'));
        cols.push(new nlobjSearchColumn('internalid', null, 'MAX'));


        var mySearch = nlapiCreateSearch('phonecall', filters, cols);

        var searchresult = [];
        var resultset = mySearch.runSearch();
        var searchid = 0;
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            if (resultslice != null && resultslice != '') {
                for (var rs in resultslice) {
                    searchresult.push(resultslice[rs]);
                    searchid++;
                }

            }
        } while (resultslice.length >= 1000);
        var searchCount = searchresult.length;
        if (searchCount > 0) {

            customer_id = '';
            phone_call_id = '';
            for (var j = 0; j <searchresult.length; j++) {

                //Maintain execution state if timeout exception occured
                if (nlapiGetContext().getRemainingUsage() < 500) {
                    var stateMain = nlapiYieldScript();
                    if (stateMain.status == 'FAILURE') {
                        nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                        throw "Failed to yield script";
                    } else if (stateMain.status == 'RESUME') {
                        nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
                    }
                }

                var Results = searchresult[j].getAllColumns();
                customer_id = searchresult[j].getValue(Results[0]);
                phone_call_id = searchresult[j].getValue(Results[1]); //assigned

              var organiser = nlapiLookupField('phonecall', phone_call_id, 'assigned');
              var isinactive= nlapiLookupField('employee',organiser,'isinactive');
              if(isinactive!='T')
                {
                 if(organiser!='8778265')
                 {
                      nlapiSubmitField('customer', customer_id, 'custentity_last_ph_call_sales_rep', organiser);
                      var arrSucess = [];
                      arrSucess.push({
                      'CUSTOMER ID': customer_id,
                      'PHONE CALL ID ': phone_call_id,
                      'ORGANISER' : organiser,
                      'CONTIVIO CONTACT RESULT' : 'SUCCESS OR CALLBACK',
                      'UPDATE STATUS' : 'UPDATED SUCESSFULLY'
                      });

                      nlapiLogExecution('Debug', 'Success', JSON.stringify(arrSucess));
                  }
                  else{
                      var arrSucess = [];
                      arrSucess.push({
                      'CUSTOMER ID': customer_id,
                      'PHONE CALL ID ': phone_call_id,
                      'ORGANISER' : organiser,
                      'CONTIVIO CONTACT RESULT' :'SUCCESS OR CALLBACK',
                      'UPDATE STATUS' : 'ORGNISER IS RESTRICTED'
                      });

                      nlapiLogExecution('Debug', 'Success ', JSON.stringify(arrSucess));
                  }
                }
              else
                {
                   var arrSucess = [];
                      arrSucess.push({
                      'CUSTOMER ID': customer_id,
                      'PHONE CALL ID ': phone_call_id,
                      'ORGANISER' : organiser,
                      'CONTIVIO CONTACT RESULT' :'SUCCESS OR CALLBACK',
                      'UPDATE STATUS' : 'ORGNISER IS INACTIVE'
                      });

                      nlapiLogExecution('Debug', 'Fail', JSON.stringify(arrSucess));
                }
                //Success Log Creation
            }
        }

    } catch (e) {
        //Error Log Creation
        var arrError = [];
        arrError.push({
            'CUSTOMER ID': customer_id,
            'PHONE CALL ID ': phone_call_id,
          	'ORGANISER' : organiser,
			'CONTIVIO CONTACT RESULT' :'SUCCESS',
          	'UPDATE STATUS' :'FAIL',
            'ERROR DETAILS': e.message
        });
        nlapiLogExecution('Debug', 'Error', JSON.stringify(arrError));
    }
}