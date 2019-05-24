nlapiLogExecution("audit", "FLOStart", new Date().getTime());
/** 
 * Script Author 						: 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
 * Author Desig. 						: 	Jr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   						: 	SuiteletScript
 * Created Date  						: 	Feb 01, 2016
 * Last Modified Date 					:  	Feb 01, 2016
 * Comments                 			: 	Script will Create Customer Deposite
 * Script Name                          :   Layaway Payment Dashboard Suitelet V6.js
 * Sandbox User Interface				:	/app/site/hosting/scriptlet.nl?script=1158&deploy=1
 * Sandbox Suitelet Script URL 			:	/app/common/scripting/script.nl?id=1163
 * Sandbox Client Script URL			:	/app/common/scripting/script.nl?id=1159
 * Sandbox Scheduled Script URL			:	/app/common/scripting/script.nl?id=1111
 * Sandbox Save Search 1 URL			:	/app/common/search/savedsearch.nl?id=4622 
 * Sandbox Save Search 2 URL			:	/app/common/search/savedsearch.nl?id=4624
 * Sandbox Save Search 3 URL			:	/app/common/search/savedsearch.nl?id=4671
 * Production User Interface			:	/app/site/hosting/scriptlet.nl?script=1158&deploy=1
 * Production Suitelet Script URL 		:	/app/common/scripting/script.nl?id=1158
 * Production Client Script URL			:	/app/common/scripting/script.nl?id=1159
 * Production Scheduled Script URL		:	/app/common/scripting/script.nl?id=1163
 * Production Save Search 1 URL			:	/app/common/search/savedsearch.nl?id=5598
 * Production Save Search 2 URL			:	/app/common/search/savedsearch.nl?id=5599
 * Production Save Search 3 URL			:	/app/common/search/savedsearch.nl?id=5609
 */
function Layaway_Payment_Dashboard(request, response) {
    try {
        if (request.getMethod() == 'GET') {
            var sales_order = new Array();
            var form = nlapiCreateForm('Layaway Payment Dashboard', true);
            form.setScript('customscript_layaway_payment_client');

            var page = request.getParameter("page");
            if (page != null && page != "")
                page = parseFloat(page);

            var month = request.getParameter("month");
            if (month != "" && month != null) {
                month = month.split(',');
            } else {
                month = [];
            }

            var deparr = []; // variable deparr is declared for NS-1163 - by tanuja
            var date11 = request.getParameter("date");
            //nlapiLogExecution("Debug", "before calling Layaway_Data", timestamp());
            var results = Layaway_Data(month, date11);
            // nlapiLogExecution("Debug", "After calling Layaway_Data", timestamp());
            var numOrders = results.length;
             var recordLimit = 20;
            var index = 1;
            var lowEnd = 0;
            var highEnd = 0;
            // if (page == null || page == "" || page == 0 || page == 1) {
                // lowEnd = 0;
                // highEnd = recordLimit;
            // } else {
                // lowEnd = parseFloat(page) - 1;
                // highEnd = lowEnd + recordLimit;
            // }
            // nlapiLogExecution('debug', 'lowEnd : ' + lowEnd, 'highEnd : ' + highEnd);
            var orders = [];
            var SNo = lowEnd;
           // for (var i = lowEnd; i < highEnd; i++) {
			 for (  var i = 0; i < results.length; i++){
                if (numOrders == i) {
                    break;
                }
                results[i].custpage_sno = parseInt(SNo) + 1 + ".";
                orders.push(results[i]);
                SNo++;
            }
            var filterMonth = form.addField('custpage_month', 'multiselect', 'Monthly Payment Date');
            var customlist85 = nlapiLoadRecord('CustomList', '85');
            //  nlapiLogExecution("Debug", "customlist85 loading ", timestamp());
            if (month.indexOf('0') >= 0) {
                month[month.indexOf('0')] = '';
                filterMonth.addSelectOption('0', '', true);
            } else {
                filterMonth.addSelectOption('0', '', false);
            }
            for (var v = 1; v <= customlist85.getLineItemCount('customvalue'); v++) {
                var MonthNo = customlist85.getLineItemValue('customvalue', 'valueid', v);
                if (month.indexOf(MonthNo) >= 0) {
                    filterMonth.addSelectOption(MonthNo, customlist85.getLineItemValue('customvalue', 'value', v), true);
                } else {
                    filterMonth.addSelectOption(MonthNo, customlist85.getLineItemValue('customvalue', 'value', v), false);
                }
            }
            var filterdate = form.addField('custpage_date', 'select', 'Last Payment Date over 60 Days Ago');
            filterdate.addSelectOption('', '');
            filterdate.addSelectOption('No', 'No');
            filterdate.addSelectOption('Yes', 'Yes');
            filterdate.setDefaultValue(date11);
          /*  if (numOrders > recordLimit) {
                var pageFld = form.addField("custpage_page", "select", "Select Record");
                if (request.getParameter("page") != null && request.getParameter("page") != "")
                    var defaultSel = request.getParameter("page");
                else
                    var defaultSel = 1;

                for (var i = 0; i < Math.ceil(numOrders / recordLimit); i++) {
                    var isDefault = false;
                    if (defaultSel == index)
                        isDefault = true;

                    var nextIndex = index + recordLimit - 1;
                    if (nextIndex > numOrders)
                        nextIndex = numOrders;

                    pageFld.addSelectOption(index, index + " - " + nextIndex, isDefault);
                    index = nextIndex + 1;
                }
            }*/
            // code added to add a list to create to customer deposit for NS-1163 - by tanuja
           /*  if (results.length > 0) {
               for (var i = 0; i < results.length; i++) {
                     deparr.push({
                        custpage_charge: results[i]['custpage_charge'],
                        custpage_monthly_layaway_amount: results[i]['custpage_monthly_layaway_amount'],
                        custpage_website_balance: results[i]['custpage_website_balance'],
                        custpage_salesorder_id: results[i]['custpage_salesorder_id'],
                        custpage_customer_id: results[i]['custpage_customer_id'],
                        custpage_salesorder_link: results[i]['custpage_salesorder_link'],
                        custpage_customername: results[i]['custpage_customername']
                    });

                 }
                nlapiLogExecution("debug", "deparr : " + deparr.length, deparr);
           }*/
            // end code 
            if (orders.length > 0) {
                form.addSubmitButton('Create Customer Deposits');
                form.addButton('custpage_clearthatcache', 'Refresh', 'window.location.reload(true)');
                form.addButton('custpage_do_not_charge', 'Mark all as Do Not Charge', "return ChargeOption('Do not charge');");
                form.addButton('custpage_charge', 'Mark all as Charge', "return ChargeOption('Charge');");

                // code added to bind the deparr in a hidden field for NS-1163 - By tanuja
               /*  var hdn = form.addField('custpage_results_arr', 'inlinehtml', '')
                hdn.setDisplayType('hidden');
               var data = JSON.stringify(deparr);
                hdn.setDefaultValue(data);*/
                //end code

                var list = form.addSubList('custpage_list', 'list', 'Layaway Payment Dashboard');
                list.addField('custpage_sno', 'text', 'S.No');
                var list_chrage = list.addField('custpage_charge', 'select', 'Charge');
                list_chrage.addSelectOption('Do not charge', 'Do not charge');
                list_chrage.addSelectOption('Charge', 'Charge');
                list_chrage.addSelectOption('Successful', 'Successful');
                list_chrage.addSelectOption('Fail', 'Fail');
                list_chrage.addSelectOption('Pending', 'Pending');
                list_chrage.addSelectOption('No credit card', 'No credit card');

                list.addField('custpage_customer_id', 'text').setDisplayType('hidden');
                list.addField('custpage_salesorder_id', 'text').setDisplayType('hidden');
                list.addField('custpage_salesorder_link', 'text', 'SO #'); //.setDisplayType('hidden');
                list.addField('custpage_customername', 'text', 'Customer Name');
                list.addField('custpage_date', 'text', 'Date');
                list.addField('custpage_status', 'text', 'Status');
                list.addField('custpage_monthly_layaway_amount', 'currency', 'Monthly Layaway Amount').setDisplayType("entry");
                list.addField('custpage_monthly_payment_date', 'text', 'Monthly Payment Date');
                list.addField('custpage_date_of_last_payment', 'text', 'Date of Last Payment');
                list.addField('custpage_vip', 'text', 'VIP');
                list.addField('custpage_website_balance', 'Currency', 'Website Balance');
                list.addField('custpage_amount', 'currency', 'Amount');
                list.addField('custpage_currency', 'text', 'Currency');
                list.addField('custpage_so_important_notes', 'text', 'SO Important Notes');
                list.addField('custpage_payment_notes', 'text', 'Payment Notes'); //Added by sanjeet For Task NS-1090 Date-5 Feb 2018
                list.addField('custpage_paid', 'text', 'Paid');
                list.addField('custpage_cc_no', 'text', 'Credit Card No.');
                list.addField('custpage_cc_type', 'text', 'Credit Card Type');
                list.addField('custpage_last_email_date', 'text', 'Last Email Date');
                list.addField('custpage_default_credit_card', 'text', 'Default Credit Card'); //new added by ajay 02March 2017
                list.setHelpText("<h1 style='color: #6139fa; font-size: 13px;text-align: right;padding-right: 30px;'>Total Records : " + results.length + "</h1>");
                list.setLineItemValues(orders);
            } else {
                var url = "https://'+window.location.host+'/app/site/hosting/scriptlet.nl?script=1158&deploy=1";
                form.addButton('custpage_clear', 'Clear', "window.location.assign('" + url + "');");
                var html = "<div style='color: red;font-size: 25px;font-weight: 600;text-align: right;margin-top: 2%;margin-right: 60%;'> Record Not found. </div>";
                var htmlHeader = form.addField('custpage_pending', 'inlinehtml').setDefaultValue(html);
            }
            if (request.getParameter("msg") == 'yes') {
                form.addField('custpage_msg', 'text').setDisplayType('hidden').setDefaultValue('yagya');
            }
            form.addField('custpage_deposit', 'textarea').setDisplayType('hidden');
            response.writePage(form);
        } else if (request.getMethod() == "POST") {
            //  nlapiLogExecution("Debug", "post method call", timestamp());
            var param = new Array();
            var page = request.getParameter("custpage_page");
            var month = request.getParameter("custpage_month");
            if (page == null || page == "") {
                param['page'] = 0;
            } else {
                param['page'] = page;
            }
            if (month == null || month == "") {
                param['month'] = "";
            } else {
                param['month'] = month;
            }
            var DepositArr = request.getParameter("custpage_deposit");
            nlapiLogExecution('DEBUG', 'DepositArr#', DepositArr);
            var user = nlapiGetUser();
            // nlapiLogExecution('DEBUG', 'user#', user);
            // nlapiLogExecution('DEBUG', 'month#', month);


            if (DepositArr != null && DepositArr != "") {
                var filters = new Array();
                filters[0] = new nlobjSearchFilter('custrecord_user', null, 'is', user);
                if (month != '' && month != null) {
                    filters[1] = new nlobjSearchFilter('custrecord_monthlypaymentdate', null, 'is', month);
                } else {
                    filters[1] = new nlobjSearchFilter('custrecord_monthlypaymentdate', null, 'is', '');
                }
               filters[2] = new nlobjSearchFilter('custrecord_jsondata', null, 'is', DepositArr);
                if (date11 != '' && date11 != null) {
                    filters[3] = new nlobjSearchFilter('custrecord_lastpaymentdate', null, 'is', date11);
                }
               
                var columns = new Array();
                columns[0] = new nlobjSearchColumn('custrecord_jsondata');
                var depostarrLog = nlapiSearchRecord('customrecord_deposit_arr_log', null, filters, columns);
              
                if (depostarrLog == null) {                    
                    var obj_depositarr = nlapiCreateRecord('customrecord_deposit_arr_log');
                    obj_depositarr.setFieldValue('custrecord_monthlypaymentdate', month);
                    obj_depositarr.setFieldValue('custrecord_lastpaymentdate', date11);
                    obj_depositarr.setFieldValue('custrecord_jsondata', DepositArr);
                    obj_depositarr.setFieldValue('custrecord_user', user);

                    var depositarr_rec_id = nlapiSubmitRecord(obj_depositarr, true, true);
                    nlapiLogExecution('DEBUG', 'Deposit Arr Log Rec Id#', depositarr_rec_id);
                    var params = {
                        custscript_logid: depositarr_rec_id
                    };

                    var status = nlapiScheduleScript('customscript_update_so_layawaypayment', 'customdeploy_update_so_layawaypayment', params);
                   nlapiLogExecution('DEBUG', 'schedued script status#', status);


                    /*var DepositArr = JSON.parse(DepositArr);
					 alert(DepositArr);
					var date = nlapiDateToString(new Date(), 'date');
					for (var x = 0; x < DepositArr.length; x++) {
						nlapiSubmitField("salesorder", DepositArr[x].soId, ["custbodylast_deposit_date", "custbodylast_deposit_status", "custbodylast_deposit_amount", "custbody_user_email"], [date, "Pending", DepositArr[x].amount, nlapiGetUser()]);
					}
					param['msg'] = 'yes';
					 nlapiLogExecution("debug", "DepositArr : " + DepositArr.length, JSON.stringify(DepositArr));
					 */
                    param['msg'] = 'yes';
                    param['cust_rec_id'] = depositarr_rec_id; 
                    //param['ispost'] = '1';
                    SendEmailMsg();
                }
            }
          //  nlapiLogExecution("Debug", "redirection to ", timestamp());
            response.sendRedirect("SUITELET", "customscript_layaway_payment_dashboard", "customdeploy_layaway_payment_dashboard", false, param);
            //response.writePage(form);

        }
        //nlapiLogExecution("Debug", "end process ", timestamp());
    } catch (er) {
        nlapiLogExecution("Debug", "Error on Page", er.message);
        response.sendRedirect("SUITELET", "customscript_layaway_payment_dashboard", "customdeploy_layaway_payment_dashboard");
    }
}

function Layaway_Data(month, date11) {
    //nlapiLogExecution('debug','month test',JSON.stringify(month));
    try {
        var Search = nlapiLoadSearch(null, 'customsearch_layaway_payment_dashboard');
        var results = Search.runSearch();
        var resultsArr = [];
        var so_arr = [];
        var searchid = 0;
        var count = 0;
        var indexRow = 0;
        var jsondata = "";
		var iscustRecId=false;
        var depositarr;        
        var user = nlapiGetUser();
        // nlapiLogExecution('DEBUG', 'user#', user);
       var cust_rec_id= request.getParameter("cust_rec_id");
       nlapiLogExecution("Debug", "cust_rec_id", cust_rec_id);
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custrecord_user', null, 'is', user);
        if (month != '' && month != null) {
            filters[1] = new nlobjSearchFilter('custrecord_monthlypaymentdate', null, 'is', month);
        } else {
            filters[1] = new nlobjSearchFilter('custrecord_monthlypaymentdate', null, 'is', '');
        }  
        if (cust_rec_id !='' && cust_rec_id!=null){
          filters[2] = new nlobjSearchFilter('id', null, 'is', cust_rec_id);   
          iscustRecId=true;		  
        }		
    
		if (date11 != '' && date11 != null) {
			if(iscustRecId)
				{
				filters[3] = new nlobjSearchFilter('custrecord_lastpaymentdate', null, 'is', date11); 
				}		
			else
				{	
			filters[2] = new nlobjSearchFilter('custrecord_lastpaymentdate', null, 'is', date11); 
				}
		}

        var columns = new Array();
        columns[0] = new nlobjSearchColumn('custrecord_jsondata');
        var depostarrLog = nlapiSearchRecord('customrecord_deposit_arr_log', null, filters, columns);
        if (depostarrLog != null) {
            try {
                jsondata = depostarrLog[0].getValue('custrecord_jsondata');
                nlapiLogExecution('DEBUG', 'jsondata2#', jsondata);
                depositarr = JSON.parse(jsondata);
            } catch (ex) {
                nlapiLogExecution("error", "Error in loading json data", ex.message);
            }
        }
        //..............
        var sales_order = [];

        do {
            var AllRows = results.getResults(searchid, searchid + 1000);
            if (AllRows != null && AllRows != '') {
                var date = nlapiDateToString(new Date(), 'date');
                for (var rs in AllRows) {
                     var customstatus='';
					 var customamount='';
					var so_id;
                    if (depositarr != '' && depositarr != null) {						
                        for (var x = 0; x < depositarr.length; x++) {
                             so_id = depositarr[x].soId;
                            if (so_id == AllRows[rs].id) {
                                customstatus = 'Pending';
                                //nlapiLogExecution('DEBUG', 'customstatus#', customstatus);
                                customamount = depositarr[x].amount;
                                //nlapiLogExecution('DEBUG', 'customamount#', customamount);
								break;
                            }
                        }
                    }
                    var allCol = AllRows[rs].getAllColumns();
                    var MonthNo = AllRows[rs].getValue(allCol[4]);
                    if (month.indexOf(MonthNo) >= 0 || month.length == 0) {
                        var VIP = 'False';
                        if (AllRows[rs].getValue(allCol[9]) == 'T' || AllRows[rs].getValue(allCol[10]) == 'T' || AllRows[rs].getValue(allCol[11]) == 'T' || AllRows[rs].getValue(allCol[12]) == 'T' || AllRows[rs].getValue(allCol[13]) == 'T') {
                            VIP = 'True';
                        }
                        var last_deposit_date = AllRows[rs].getValue(allCol[14]);
                        var last_deposit_status = AllRows[rs].getValue(allCol[15]);
                        var check_status = 'Charge';
						
                        if (last_deposit_date != "" && last_deposit_date != null && last_deposit_status != "" && last_deposit_status != null) {
                            if (last_deposit_date == date) {
                                if (last_deposit_status == "Successful") {
                                    check_status = 'Successful';
                                } else if (last_deposit_status == "Fail") {
                                    check_status = 'Fail';
                                } else if (last_deposit_status == "Pending") {
                                    check_status = 'Pending';
                                }
                            }
                        }
						// code added by tanuja to set status and MLAmout
                        if (customstatus != '' && customstatus != null) {
                            check_status = customstatus;
                        }
                        if (customamount != '' && customamount != null) {
                            MLAmount = customamount;
                        }
						// end code

                        var order_status = AllRows[rs].getValue(allCol[2]);
                        if (order_status == "pendingFulfillment") {
                            order_status = "Pending Fulfillment"
                        } else if (order_status == "pendingApproval") {
                            order_status = "Pending Approval"
                        }

                        var website_balance = AllRows[rs].getValue(allCol[5]);
                        website_balance = parseFloat(website_balance);
                        var total_amount = parseFloat(AllRows[rs].getValue(allCol[6]));
                        var paid = (((total_amount - website_balance) / total_amount) * 100).toFixed(0) + " %";
                        var customer_id = AllRows[rs].getValue(allCol[16]);
                        var customer_name = AllRows[rs].getValue(allCol[0]).split(' ');
                        var link_customer = "<a  target='_blank' title='Click here to link Item' href='/app/common/entity/custjob.nl?id=" + customer_id + "' style='color: #255599;    text-decoration: none;'>" + customer_name[1] + " " + customer_name[2] + "</a>";
                        var link_soId = "<a  target='_blank' title='Click here to link Item' href='/app/accounting/transactions/salesord.nl?id=" + AllRows[rs].id + "' style='color: #255599;    text-decoration: none;' >" + AllRows[rs].getValue(allCol[17]) + "</a>";
                        var MLAmount = AllRows[rs].getValue(allCol[3]);
                        if (MLAmount == "" || MLAmount == null) {
                            MLAmount = 0;
                        }

                        if (so_arr.indexOf(AllRows[rs].id) == -1) {
                            if (AllRows[rs].getValue(allCol[22]) == "T") {
                                var status = AllRows[rs].getValue(allCol[22]) == "T" ? "Yes" : "No";
                                count = 0;
                                resultsArr.push({
                                    custpage_sno: null,
                                    custpage_customer_id: customer_id,
                                    custpage_salesorder_id: AllRows[rs].id,
                                    custpage_salesorder_link: link_soId,
                                    custpage_charge: check_status,
                                    custpage_customername: link_customer,
                                    custpage_date: AllRows[rs].getValue(allCol[1]),
                                    custpage_status: order_status,
                                    custpage_monthly_layaway_amount: MLAmount,
                                    custpage_monthly_payment_date: AllRows[rs].getText(allCol[4]),
                                    custpage_date_of_last_payment: null,
                                    custpage_vip: VIP,
                                    custpage_website_balance: AllRows[rs].getValue(allCol[5]),
                                    custpage_amount: AllRows[rs].getValue(allCol[6]),
                                    custpage_currency: AllRows[rs].getText(allCol[7]),
                                    custpage_so_important_notes: AllRows[rs].getValue(allCol[8]).substring(0, 299),
                                    custpage_payment_notes: AllRows[rs].getValue(allCol[23]).substring(0, 299), //Added by sanjeet For Task NS-1090 Date-5 Feb 2018
                                    custpage_paid: paid,
                                    custpage_cc_no: AllRows[rs].getValue(allCol[18]),
                                    custpage_cc_type: AllRows[rs].getText(allCol[19]),
                                    custpage_last_email_date: AllRows[rs].getValue(allCol[21]),
                                    //custpage_default_credit_card:AllRows[rs].getValue(allCol[22])=="T"?"<style id='"+indexRow+"'>#custpage_listrow"+indexRow+" td{background:	#98FB98!important;}</style>Yes":"No" //new added by ajay 03March 2017
                                    custpage_default_credit_card: "<span id='custpage_span" + indexRow + "'>" + status + "</span>" //new added by ajay 03March 2017
                                });
                                sales_order.push(AllRows[rs].id);
                                indexRow++;
                            } else if (AllRows[rs].getValue(allCol[22]) == "F") {
                                check_status = "No credit card";
                                count++;
                                var status = AllRows[rs].getValue(allCol[22]) == "T" ? "Yes" : "No";
                                resultsArr.push({
                                    custpage_sno: null,
                                    custpage_customer_id: customer_id,
                                    custpage_salesorder_id: AllRows[rs].id,
                                    custpage_salesorder_link: link_soId,
                                    custpage_charge: check_status,
                                    custpage_customername: link_customer,
                                    custpage_date: AllRows[rs].getValue(allCol[1]),
                                    custpage_status: order_status,
                                    custpage_monthly_layaway_amount: MLAmount,
                                    custpage_monthly_payment_date: AllRows[rs].getText(allCol[4]),
                                    custpage_date_of_last_payment: null,
                                    custpage_vip: VIP,
                                    custpage_website_balance: AllRows[rs].getValue(allCol[5]),
                                    custpage_amount: AllRows[rs].getValue(allCol[6]),
                                    custpage_currency: AllRows[rs].getText(allCol[7]),
                                    custpage_so_important_notes: AllRows[rs].getValue(allCol[8]).substring(0, 299),
                                    custpage_payment_notes: AllRows[rs].getValue(allCol[23]).substring(0, 299), //Added by sanjeet For Task NS-1090 Date-5 Feb 2018
                                    custpage_paid: paid,
                                    custpage_cc_no: AllRows[rs].getValue(allCol[18]),
                                    custpage_cc_type: AllRows[rs].getText(allCol[19]),
                                    custpage_last_email_date: AllRows[rs].getValue(allCol[21]),
                                    // custpage_default_credit_card:AllRows[rs].getValue(allCol[22])=="T"?"Yes":"<style id='"+indexRow+"'>#custpage_listrow"+indexRow+" td{background:yellow!important;}</style>No" //new added by ajay 02March 2017
                                    custpage_default_credit_card: "<span id='custpage_span" + indexRow + "'>" + status + "</span>" //new added by ajay 03March 2017
                                });
                                sales_order.push(AllRows[rs].id);
                                indexRow++;
                            } else {
                                check_status = "No credit card";
                                count++;
                                var status = AllRows[rs].getValue(allCol[22]) == "T" ? "Yes" : "No";
                                resultsArr.push({
                                    custpage_sno: null,
                                    custpage_customer_id: customer_id,
                                    custpage_salesorder_id: AllRows[rs].id,
                                    custpage_salesorder_link: link_soId,
                                    custpage_charge: check_status,
                                    custpage_customername: link_customer,
                                    custpage_date: AllRows[rs].getValue(allCol[1]),
                                    custpage_status: order_status,
                                    custpage_monthly_layaway_amount: MLAmount,
                                    custpage_monthly_payment_date: AllRows[rs].getText(allCol[4]),
                                    custpage_date_of_last_payment: null,
                                    custpage_vip: VIP,
                                    custpage_website_balance: AllRows[rs].getValue(allCol[5]),
                                    custpage_amount: AllRows[rs].getValue(allCol[6]),
                                    custpage_currency: AllRows[rs].getText(allCol[7]),
                                    custpage_so_important_notes: AllRows[rs].getValue(allCol[8]).substring(0, 299),
                                    custpage_payment_notes: AllRows[rs].getValue(allCol[23]).substring(0, 299), //Added by sanjeet For Task NS-1090 Date-5 Feb 2018
                                    custpage_paid: paid,
                                    custpage_cc_no: AllRows[rs].getValue(allCol[18]),
                                    custpage_cc_type: AllRows[rs].getText(allCol[19]),
                                    custpage_last_email_date: AllRows[rs].getValue(allCol[21]),
                                    //custpage_default_credit_card:"<style id='"+indexRow+"'>#custpage_listrow"+indexRow+" td{background:yellow!important;}</style>" //new added by ajay 02March 2017
                                    custpage_default_credit_card: "<span id='custpage_span" + indexRow + "'>" + status + "</span>" //new added by ajay 03March 2017
                                });
                                sales_order.push(AllRows[rs].id);
                                indexRow++;
                            }
                            so_arr.push(AllRows[rs].id);
                        } else {
                            if (count > 0) {
                                if (AllRows[rs].getValue(allCol[22]) == "T") {
                                    resultsArr.pop(rs - count);
                                    indexRow--;
                                    var status = AllRows[rs].getValue(allCol[22]) == "T" ? "Yes" : "No";
                                    resultsArr.push({
                                        custpage_sno: null,
                                        custpage_customer_id: customer_id,
                                        custpage_salesorder_id: AllRows[rs].id,
                                        custpage_salesorder_link: link_soId,
                                        custpage_charge: check_status,
                                        custpage_customername: link_customer,
                                        custpage_date: AllRows[rs].getValue(allCol[1]),
                                        custpage_status: order_status,
                                        custpage_monthly_layaway_amount: MLAmount,
                                        custpage_monthly_payment_date: AllRows[rs].getText(allCol[4]),
                                        custpage_date_of_last_payment: null,
                                        custpage_vip: VIP,
                                        custpage_website_balance: AllRows[rs].getValue(allCol[5]),
                                        custpage_amount: AllRows[rs].getValue(allCol[6]),
                                        custpage_currency: AllRows[rs].getText(allCol[7]),
                                        custpage_so_important_notes: AllRows[rs].getValue(allCol[8]).substring(0, 299),
                                        custpage_payment_notes: AllRows[rs].getValue(allCol[23]).substring(0, 299), //Added by sanjeet For Task NS-1090 Date-5 Feb 2018
                                        custpage_paid: paid,
                                        custpage_cc_no: AllRows[rs].getValue(allCol[18]),
                                        custpage_cc_type: AllRows[rs].getText(allCol[19]),
                                        custpage_last_email_date: AllRows[rs].getValue(allCol[21]),
                                        //custpage_default_credit_card:AllRows[rs].getValue(allCol[22])=="T"?"<style id='"+indexRow+"'>#custpage_listrow"+indexRow+" td{background:	#98FB98!important;}</style>Yes":"No" //new added by ajay 03March 2017
                                        custpage_default_credit_card: "<span id='custpage_span" + indexRow + "'>" + status + "</span>" //new added by ajay 03March 2017
                                    });
                                    sales_order.push(AllRows[rs].id);
                                    indexRow++;
                                    count = 0;
                                } else if (AllRows[rs].getValue(allCol[22]) == "F") {
                                    count++;
                                } else {
                                    count++;
                                }
                            }
                            so_arr.push(AllRows[rs].id);
                        }
                    }
                    searchid++;
                }
            }
        }
        while (AllRows.length >= 1000);

        if (resultsArr != null && sales_order != null && sales_order.length > 0) {
            var Search = nlapiSearchRecord(null, 'customsearch_layaway_payment_date', new nlobjSearchFilter('salesorder', null, 'anyOf', sales_order));
            if (Search != null) {
                var FilterOrder = [];
                nlapiLogExecution('debug', 'Date1', date11);
                if (date11 == null || date11 == "") {
                    date11 = '';
                }
                for (var i = 0; i < resultsArr.length; i++) {
                    var dpsAmt = 0;
                    var search_order = resultsArr[i].custpage_salesorder_id;
                    for (var j = 0; j < Search.length; j++) {
                        var find_search = Search[j].getValue('salesorder');
                        if (search_order == find_search) {
                            var date1 = new Date(Search[j].getValue('trandate'));
                            var date2 = new Date();
                            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                            var diffDays = parseInt(Math.ceil(timeDiff / (1000 * 3600 * 24)));
                            resultsArr[i].custpage_date_of_last_payment = "<a target='_blank' title='Click here to link Item' href='/app/accounting/transactions/custdep.nl?id=" + Search[j].id + "' style='color: #255599;    text-decoration: none;' >" + Search[j].getValue('trandate') + "</a>";
                            if (diffDays > 60) {
                                resultsArr[i].custpage_date_of_last_payment = "<a target='_blank' title='Click here to link Item' href='/app/accounting/transactions/custdep.nl?id=" + Search[j].id + "' style='color: red;    text-decoration: none;' >" + Search[j].getValue('trandate') + "</a>";
                                if (date11 == 'Yes') {
                                    FilterOrder.push(resultsArr[i]);
                                }
                            } else if (date11 == 'No') {
                                FilterOrder.push(resultsArr[i]);
                            }
                            break;
                        }
                    }
                }
                if (date11 == 'Yes' || date11 == 'No') {
                    resultsArr = FilterOrder;
                }
            }
        }

        return resultsArr;
    } catch (er) {
        nlapiLogExecution("Debug", "Error on load Record", er.message);
    }
}

function SendEmailMsg() {
    var email = nlapiGetContext().getEmail();
    var subject = 'Sales Order is in pending deposit status.';
    var body = "The Layaway Payment Dashboard transactions are currently being processed. Please review the result in 10-15 minutes.";
    nlapiSendEmail(1564077, email, subject, body, ['ajay@inoday.com'], null, null, null, true); //from id : netsuite@brilliantearth.com
    nlapiLogExecution("debug", "Send Email to user email is : " + email);
}

function timestamp() {
    var str = "";

    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var meridian = "";
    if (hours > 12) {
        meridian += "pm";
    } else {
        meridian += "am";
    }
    if (hours > 12) {

        hours = hours - 12;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    str += hours + ":" + minutes + ":" + seconds + " ";

    return str + meridian;
}