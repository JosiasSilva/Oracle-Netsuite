nlapiLogExecution("audit", "FLOStart", new Date().getTime());
/**
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com/shivamupc73@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript
 * Script Name   : PersonalConsolidateSearchEmail.js
 * Created Date  : April 6, 2016
 * Last Modified Date : April 6, 2016
 * Comments : Script will search consolidated result of Sales Rep. & send to his/her Personal Email .....
 * Unit Test : Worked well
 * URL: https://system.netsuite.com/app/common/scripting/script.nl?id=903 
 */

function consolidatedSearchPersonalEmail() {
  try {
    var ArrSearchIdNames = new Array();
    //ArrSearchIdNames.push('2825#1# Setster Appts Not Confirmed'); Removed by EI 20180831 per SD
    ArrSearchIdNames.push('1500#5# Open (CS) Ops/CS Status');
    ArrSearchIdNames.push('1329#7# All Appointments - no items');
    //ArrSearchIdNames.push('6124#7# Customer Follow Up'); Removed by EI 20180831 per SD //created error to get EtityId of Employee directly So we get via Customer
    ArrSearchIdNames.push('3327#0# My Leads To Follow Up With Today (for email)'); // Used for unit test as given format
    ArrSearchIdNames.push('3082#3# Contoured Rings Sold');
    ArrSearchIdNames.push('2506#2# MY Missing Post Appointment Status');
    ArrSearchIdNames.push('3181#1# Wells Fargo App');
    ArrSearchIdNames.push('3705#4# Quote Color Sample');
    ArrSearchIdNames.push('748#2# All CS Open Gem Requests');
    ArrSearchIdNames.push('1360#6# Diamond Request - Open CS');
    ArrSearchIdNames.push('199#5# SO with no email confirmation');
    ArrSearchIdNames.push('1868#1# Photography Item Sent to CS');
    ArrSearchIdNames.push('795#4# Open (CS) Status of Repairs/Resizes');
    ArrSearchIdNames.push('842#6# CAD/Wax-CS to send to customer');
    ArrSearchIdNames.push('692#6# CAD or wax waiting on customer');
    ArrSearchIdNames.push('1028#5# Open Quotes-CS Custom Quote Search (est)');
    ArrSearchIdNames.push('1620#1# Synchrony App Ready To Be Sent to Customer');
    ArrSearchIdNames.push('1531#1# Diamond Unavailable-Options pending customer decision');
    ArrSearchIdNames.push('5466#7# CS - Ring Sizer Returned to Sender - Need to Contact'); //Added by Sandeep 12-Jan-2017 as per NS-542
    ArrSearchIdNames.push('7811#5#  NEW Online customer forms not replied to yet'); //Added by Aradhana 8-Mar-2018 as per NS-1126
    //ArrSearchIdNames.push('7537#1# High value appointments to be double checked'); //Added by Aradhana 8-Mar-2018 as per NS-1126 -- Removed by JJ 10-Oct-2018 per SD and CF
    ArrSearchIdNames.push('688#3# All customers not replied to customer within 3 weeks - Ltd distn'); //Added by Aradhana 4-July-2018 as per NS-1260
    ArrSearchIdNames.push('447#3# All leads not replied to customer within 3 weeks'); //Added by Aradhana 4-July-2018 as per NS-1260
    ArrSearchIdNames.push('3258#3# Escalation Search'); //Added by EI 20180903 per MPD/SD Request
    ArrSearchIdNames.push('9957#5# Billing/CS Status - Info Needed From CS'); // Added by JJ 18-Sept-2018
    ArrSearchIdNames.push('9380#3# Address Change Request - Open Requests'); // Added by JJ 2-Jan-2019

    var ArrLength = ArrSearchIdNames.length;
    if (ArrLength > 0) {
      var searchId = '',
          searchColumn = '',
          searchName = '';
      var IdNameArr = '';
      var units = '';
      var msgArr = '';
      var urlMsg = '';
      var searchResult = '';
      var searchResultArr = new Array();
      var prevSearchId = '';
      for (i = 0; i < ArrLength; i++) {
        IdNameArr = ArrSearchIdNames[i].split('#')
        searchId = IdNameArr[0];
        searchColumn = IdNameArr[1];
        searchName = IdNameArr[2];
        var ItemArray = new Array();
        var ObjSearch = nlapiLoadSearch(null, searchId);
        var searchResults = ObjSearch.runSearch();
        var index = 0;
        var resultStep = 1000;
        var resultSet;
        var transCount = 0;
        var salesRepArr = new Array();
        do {
          resultSet = searchResults.getResults(index, index + resultStep);
          index = index + resultStep;
          var salesRepNameStr = '';
          for (var m = 0; resultSet != null && m < resultSet.length; m++) {
            var Results = resultSet[m].getAllColumns();
            var salesRepName = resultSet[m].getText(Results[searchColumn]);
            var salesRepId = resultSet[m].getValue(Results[searchColumn]);
            var salesRepNameValid = validate(salesRepName);
            if (searchId == '5422') {
              custId = resultSet[m].id;
              salesRepId = nlapiLookupField('customer', custId, 'salesrep'); // Get salesRepId w.r.t Customer Id for searchId-5422;

            }
            salesRepNameStr = salesRepId + '-' + salesRepNameValid;
            salesRepArr.push(salesRepNameStr);
          }
          YieldExecution();
        } while (resultSet.length >= 1000);
        var salesRepArrayResults = count(salesRepArr);
        var resultMsg = '';
        if (salesRepArrayResults.length <= 0) {
          resultMsg = 'There are no search results at this time.';
          nlapiLogExecution('DEBUG', 'Search Id-' + searchId + ', ' + searchName + ' - No Result found!', resultMsg);
        } else {
          //nlapiLogExecution('DEBUG', 'Search Id-'+searchId+', '+ searchName+' - Array list Result', salesRepArrayResults);
          var salesRepArrayStr = '';
          var consolidatedEmpLeads = '';
          //var url="https://system.netsuite.com/app/common/search/searchresults.nl?searchid="+searchId;
          //var subject="Personal Consolidated Search Result:"+searchName;

          for (var j = 0; j < salesRepArrayResults.length; j++) //j<salesRepArrayResults.length
          {
            var empId = salesRepArrayResults[j].split('-')[0];
            var empName = salesRepArrayResults[j].split('-')[1];
            var empLeads = salesRepArrayResults[j].split('-')[2];
            consolidatedEmpLeads = consolidatedEmpLeads + '<br/>' + empName + '- ' + empLeads;
            if ((empId != '' && empId != null) && empId != 'Unassigned' && empId != 'None') {
              if (empId != '7820') {
                var empSearchField = ["entityid", "issalesrep", "isinactive"];
                var empArrFieldVal = nlapiLookupField("employee", empId, empSearchField);
                var emp_Title = empArrFieldVal.entityid;
                var emp_IsSalesRep = empArrFieldVal.issalesrep;
                var emp_InActive = empArrFieldVal.isinactive;
                if (emp_IsSalesRep == 'T' && emp_InActive == 'F') {
                  searchResultArr.push({
                    empId: empId,
                    searchId: searchId,
                    searchName: searchName,
                    empLeads: empLeads
                  });
                }
              }

            }
            YieldExecution();
          } //end of for loop of salesRepArrayResults
          // nlapiLogExecution('DEBUG', 'final Result of search Id:'+searchId, consolidatedEmpLeads); 
        }
        prevSearchId = searchId;
        YieldExecution();

      } //end of outer loop
      searchResultArr.sort(function(a, b) {
        return a.empId - b.empId;
      });
      var empLeadArr = new Array();
      var empLeadStr = '';
      var empId = '',
          preEmpId = '';
      var resultArr = new Array();
      var tempArr = new Array();
      if (searchResultArr.length > 0) {
        for (var m = 0; m < searchResultArr.length; m++) {

          empId = searchResultArr[m].empId;
          //searchId=searchResultArr[m].searchId;
          //searchName=searchResultArr[m].searchName;
          // searchLead=searchResultArr[m].empLeads;
          if (empId == preEmpId) {
            tempArr.push(searchResultArr[m]);
          } else {
            resultArr.push(tempArr);
            tempArr = new Array();
            tempArr.push(searchResultArr[m]);
          }
          preEmpId = empId;
          YieldExecution();
        }
        if (tempArr != null) {
          resultArr.push(tempArr);
          tempArr = null;
        }
        if (resultArr.length > 0) {
          var n = 0;
          do {
            var resultVal = resultArr[n];
            var msgStr = "<table border='0' align='left' width='60%' cellpadding='0' cellspacing='0'>"
            msgStr = msgStr + "<tr><td colspan='1'>&nbsp;</td></tr>";
            msgStr = msgStr + "<tr><td colspan='1'>You have items that need action on the following searches. Please clear these and flip status accordingly as soon as possible.</td></tr>";
            msgStr = msgStr + "<tr><td colspan='1'>&nbsp;</td></tr>";
            var eCount = 0;
            var eId = 0;
            for (var p = 0; p < resultVal.length; p++) {
              eCount = eCount + 1;
              eId = resultVal[p].empId;
              var eSearchId = resultVal[p].searchId;
              var eSearchName = resultVal[p].searchName;
              var eSearchLead = resultVal[p].empLeads;
              var url = "/app/common/search/searchresults.nl?searchid=" + eSearchId;
              //msgStr =msgStr +"<tr><td width='40%' align='left'><a href='"+url+"'>"+eSearchName+"</a>&nbsp;</td><td align='left'>&nbsp;"+eSearchLead+"</td></tr>";
              msgStr = msgStr + "<tr><td width='40%' align='left'><p><b>" + eSearchName + "</b>:<br/>&nbsp;<a href='" + url + "'>" + eSearchLead + "</a></p></td></tr>";
              msgStr = msgStr + "<tr><td colspan='1'>&nbsp;</td></tr>";
              YieldExecution();
            }

            msgStr = msgStr + "</table>"

            if (eCount >= 1) //  Note:- Allowed to receive email for All Sales Rep who having at least one search result && eId=='3365149'
            {
              // nlapiLogExecution('DEBUG',"email format", msgStr); 
              var empSearchField = ["firstname", "email", "issalesrep", "entityid"];
              var empArrFieldVal = nlapiLookupField("employee", eId, empSearchField);
              var emp_Title = empArrFieldVal.entityid;
              var emp_Email = empArrFieldVal.email;
              var emp_IsSalesRep = empArrFieldVal.issalesrep;
              var emp_InActive = empArrFieldVal.isinactive;
              var body = msgStr;
              var subject = "**ACTION NEEDED** My Search Summary";
              try {
                var emailTo = emp_Email;
                var emailtoCc = null; //Set empty
                //var emailtoCc='aaguilar@brilliantearth.com'; 

                nlapiSendEmail(20186, emailTo, subject, body, emailtoCc);
                nlapiLogExecution("debug", "Personal Searches Email To : " + emp_Email + ", empId: " + eId);

                //var emailTo = 'aradhana.gautam@inoday.com';  //emp_Email;
                //var emailtoCc = null; //Set empty
                //var emailtoCc='aaguilar@brilliantearth.com'; 

                //nlapiSendEmail(20186, emailTo, subject, body, emailtoCc);
                nlapiLogExecution("debug", "Personal Searches Email To : " + emailTo + ", empId: " + eId);


              } catch (e) {
                nlapiLogExecution('DEBUG', 'Email Error ', e);
              }
            } // end check of eCount
            n = n + 1;
            //YieldExecution();

            YieldExecution();

          } while (n < resultArr.length)
        } //end check of resultArr
        }

      } //end of check ArrLength
      var k = 0;
    } catch (err) {
      nlapiLogExecution("Error", "Error on Personal Consolidated Searches", "Error : " + err.toString());

    }
  }

  function validate(current) {
    var value = current;
    if (value == '') {
      value = "Unassigned";
    }
    return value;
  }

  function count(ItemArray) {
    array_elements = ItemArray;
    array_elements.sort();
    var returnArray = [];
    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
      if (array_elements[i] != null && array_elements[i] != current) {
        if (cnt > 0) {
          //returnArray.push('<br/>' + current + '-'+ cnt);
          returnArray.push(current + '-' + cnt);
        }
        current = array_elements[i];
        cnt = 1;
      } else {
        cnt++;
      }
      YieldExecution();
    }
    if (cnt > 0) {
      //returnArray.push('<br/>' + current + '-'+ cnt);
      returnArray.push(current + '-' + cnt);
    }

    return returnArray;
  }

  function YieldExecution() {
    if (nlapiGetContext().getRemainingUsage() <= 300) {
      var stateMain = nlapiYieldScript();
      if (stateMain.status == 'FAILURE') {
        nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
        throw "Failed to yield script";
      } else if (stateMain.status == 'RESUME') {
        nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
      }
    }
  }