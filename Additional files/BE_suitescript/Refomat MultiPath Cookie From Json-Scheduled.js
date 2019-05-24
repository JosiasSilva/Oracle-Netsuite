/** 
 * Script Author             : 	Tanuja Srivastav (tanuja@inoday.com)
 * Author Desig.             : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type               : 	UserEvent
 * Created Date              : 	June 26, 2018
 * Last Modified Date        : June 26, 2018
 * Comments                  :   Script will Reformat the data in "multi Path Cookie from Json" to "Multi Path Cookie Field" for all existing Leads/ Prospects/ Customers when from website syncs to netsuite.
 * scriptURL                 :https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=2895&whence=
 * Production URL			 :https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2317&whence=
 */
function reformateMultiPathCookieFromJsonSCH() {
    try {

        if (nlapiGetContext().getRemainingUsage() < 500) {
            var stateMain = nlapiYieldScript();
            if (stateMain.status == 'FAILURE') {
                nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                throw "Failed to yield script";
            } else if (stateMain.status == 'RESUME') {
                nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
            }
        }

      //  var columns = new Array();
        //columns[0] = new nlobjSearchColumn('custentitymulti_path_cookie_json', null, null);
       // columns[1] = new nlobjSearchColumn('custentity107', null, null);
		var filters=new Array();
		filters[0]=new nlobjSearchFilter('lastmodifieddate',null,'notbefore','yesterday');
      
		// for system notes search	
		filters[1] = new nlobjSearchFilter('field', 'systemnotes', 'anyOf', 'CUSTENTITYMULTI_PATH_COOKIE_JSON');
		filters[2] = new nlobjSearchFilter('type', 'systemnotes', 'is', 'F');
		filters[3] = new nlobjSearchFilter('date', 'systemnotes', 'notbefore', 'yesterday');
		// end code for system note search
      
        var search = nlapiCreateSearch('customer', filters, null);

        var searchresult = [];
        var resultset = search.runSearch();
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
        nlapiLogExecution('debug', "searchCount", searchCount);
        if (searchCount > 0) {
            for (var j = 0; j < searchresult.length; j++) {
                if (nlapiGetContext().getRemainingUsage() < 500) {
                    var stateMain = nlapiYieldScript();
                    if (stateMain.status == 'FAILURE') {
                        nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                        throw "Failed to yield script";
                    } else if (stateMain.status == 'RESUME') {
                        nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
                    }
                }
                //var Results = searchresult[j].getAllColumns();
                var id = searchresult[j].getId();
                nlapiLogExecution('debug', "id", id);
               var multipathcookiejson = nlapiLookupField('customer',id,'custentitymulti_path_cookie_json'); // to fetch value of multi path cookie json field
                //var multipathcookiejson = searchresult[j].getValue('custentitymulti_path_cookie_json'); // to fetch value of multi path cookie json field
                nlapiLogExecution('debug', "multipathcookiejson", multipathcookiejson);         
              var mutipathcookie = nlapiLookupField('customer',id,'custentity107');
                //var mutipathcookie = searchresult[j].getValue('custentity107'); // to fetch value of multi path cookie field
                nlapiLogExecution('debug', "mutipathcookie", mutipathcookie);
                
				if (multipathcookiejson) {
                  //  var data=JSON.stringify(multipathcookiejson);
					// code block to Reformat the data in multi path cookie json field
                   
				    var result= JSON.parse(multipathcookiejson);					
					var mainarr=result.attribution;
					var jsonarr=[];
                    if (mainarr.length > 0) {
                        for (var i = 0; i < mainarr.length; i++) {
                            jsonarr.push({
                                  source:mainarr[i].source,
								   medium:mainarr[i].medium,  
								   campaign:mainarr[i].compaign,
								   content:mainarr[i].content,
								   keyword:mainarr[i].keyword,
								   adID:mainarr[i].adID,
								   repeat:mainarr[i].repeat,							  
								   date:mainarr[i].date
                            });

                        }

                        var content='{';
						content+='"total":' + result.total + ',';
						content+='"cid":"' + result.cid + '",';
						content+='"attribution":';

						content+=JSON.stringify(jsonarr);
						content+='}';
						content=JSON.stringify(content);
						content ='[["bam_attribution_path",' + content;
						content+=']]';
						// code to check whether the Reformatted data matches with the existing cookie field data or not if not then submit the new Formatted data in cookie field data
                        if (mutipathcookie != content) {
                            nlapiSubmitField('customer', id, 'custentity107', content);
                            nlapiLogExecution('debug', "Cookie field value updated for id: ", id);
                        } else {
                            nlapiLogExecution('debug', "Cookie field value already updated for id: ", id);
                        }
                    }
					// end code block
                }
            }
            // end of for loop
        }

    } catch (e) {
        nlapiLogExecution('Debug', 'error on page', e.message + '' + e.details);
    }
}
