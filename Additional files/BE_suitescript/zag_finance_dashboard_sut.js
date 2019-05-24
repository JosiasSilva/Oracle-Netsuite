/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * Developer Satya Prakash (ZAG Insight)
 */
define(['N/search', 'N/ui/serverWidget', 'N/url'],
/**
 * @param {search} search
 * @param {serverWidget} serverWidget
 */
function(search, serverWidget, url) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
      
    	var request = context.request;
    	var response = context.response;
    	
        var dispVendorId = request.parameters.apDispVendorId;
        var dispVendorTxt = request.parameters.apDispVendorTxt;
        var ChargebackSts = request.parameters.chargebackStatus;
      
        var apProdVendorId = request.parameters.apProdVendorId;
      	var apProdVendorTxt = request.parameters.apProdVendorTxt;
		var apProdCategoryId = request.parameters.apProdCategoryId;
		var dispSubList = request.parameters.dispTab; // 
		var dispMonth = request.parameters.month;
		
		var paraMachine = request.parameters.machine;

        var custForm = serverWidget.createForm({title:'Finance Dashboard',hideNavBar:false});
		
        custForm.clientScriptModulePath = 'SuiteScripts/zag_fin_dashboard_cl.js';

        if(dispSubList == 'AP_Disputes'){
        	AP_DisputesTab(custForm, dispVendorId, dispVendorTxt, dispSubList, dispMonth, paraMachine);
        }else{
        	AP_ProductivityTab(custForm, apProdVendorId, apProdVendorTxt, apProdCategoryId, paraMachine);
	        AP_DisputesTab(custForm, dispVendorId, dispVendorTxt, dispSubList, dispMonth, paraMachine);
	        AR_Tab(custForm, ChargebackSts, paraMachine);
        }
        response.writePage(custForm);   
    }
    
    // AR Tab
    function AR_Tab(custForm, ChargebackSts, paraMachine){
    	//Add Tabs to the Form
        var tabAR = custForm.addTab({
        	id: 'custpage_tab_ar',
        	label: 'AR'
			});
        // Add sublists to the Tabs
        var subListArId = 'custpage_list_ar';
        var subListAr = custForm.addSublist({
            id: subListArId,
            label:'AR',
            type: serverWidget.SublistType.LIST,
            tab: 'custpage_tab_ar'
          }); 
        // Add fields/columns to the SubList 
        addColumnsAr(subListAr, subListArId);
        
        // add two fields to display Total Amount for this year and Last year
        var fldAmtYear = custForm.addField({id:'custpage_ar_total_chargeback', type:'TEXT', label: 'Total Amount for Year', container: 'custpage_tab_ar'}).updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
        var fldAmtLastYear = custForm.addField({id:'custpage_ar_total_chargeback_last_yr', type:'TEXT', label: 'Total Amount for Last Year', container: 'custpage_tab_ar'}).updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE}).updateBreakType({breakType : serverWidget.FieldBreakType.STARTCOL});
      
	    // Adding Chargeback Status filter to AR Tab
	    var selChargebackSts = custForm.addField({id:'custpage_ar_chargeback_sts',type:'SELECT', source: 'customlist396', label: 'Chargeback Status', container: 'custpage_tab_ar'});
	      
	    //assigning Chargeback Status fetched from the parameter
	    if(ChargebackSts)
	       	selChargebackSts.defaultValue = ChargebackSts;
	      
	 // Add data to the SubLists
	    if(!paraMachine || paraMachine == 'custpage_list_ar')
	    	addDataToAR(subListAr, custForm, ChargebackSts);
	    
    }
    
    // AP Productivity/Credit Tab
    function AP_ProductivityTab(custForm, apProdVendorId, apProdVendorTxt, apProdCategoryId, paraMachine){
    	 //Add Tabs to the Form
        var tabApProductivity = custForm.addTab({
	        	id: 'custpage_tab_ap_prod',
	        	label: 'AP Productivity'
        		});
        
        // Add sublists to the Tabs
        var subListApProductivityId = 'custpage_list_ap_prod';
        var subListApProductivity = custForm.addSublist({
            id: subListApProductivityId,
            label:'AP Productivity',
            type: serverWidget.SublistType.LIST,
            tab: 'custpage_tab_ap_prod'
          });
        
        // Adding Category and Vendor filter to AP Productivity Tab
        var selApProdCategory = custForm.addField({id:'custpage_ap_prod_category',type:'SELECT', source: 'customlist13', label: 'Category', container: 'custpage_tab_ap_prod'});
        var selApProdVendor = custForm.addField({id:'custpage_ap_prod_vendor',type:'SELECT', source: 'customlist504', label: 'Vendor', container: 'custpage_tab_ap_prod'});
        
        //assigning Vendor Id and Category fetched from the parameter
        if(apProdVendorId)
        	selApProdVendor.defaultValue = apProdVendorId;
        if(apProdCategoryId)
        	selApProdCategory.defaultValue = apProdCategoryId;
        
        // Add fields/columns to the SubList
        addColumnsApProductivity(subListApProductivity, subListApProductivityId);
        
	    // Add data to the SubLists
        if(!paraMachine || paraMachine == 'custpage_list_ap_prod')
        	addDataToApProductivity(subListApProductivity, apProdVendorTxt, apProdCategoryId);
    }
    // End of AP Productivity and Credit Tab
    
    // AP Disputes/Credit Tab
    function AP_DisputesTab(custForm, dispVendorId, dispVendorTxt, dispSubList, dispMonth, paraMachine){
    	
    	//Add Tabs to the Form
    	var tabApDisputes = custForm.addTab({
        	id: 'custpage_tab_ap_disputes',
        	label: 'AP disputes/credits'
    		});
    	
    	// Add sublists to the Tabs
        var subListApDisputesId = 'custpage_list_ap_disputes';
        var subListApDisputes = custForm.addSublist({
            id: subListApDisputesId,
            label:'AP disputes/credits',
            type: serverWidget.SublistType.LIST,
            tab: 'custpage_tab_ap_disputes'
          });
        
        // Adding Vendor filter to AP Disputes Tab
        var selApDisVendor = custForm.addField({id:'custpage_ap_disputes_vendor',type:'SELECT', source: 'customlist504', label: 'Select Vendor', container: 'custpage_tab_ap_disputes'});
        //assigning Vendor Id fetched from the parameter
        if(dispVendorId)
        	selApDisVendor.defaultValue = dispVendorId;
        
        // Add fields/columns to the SubLists
        addColumnsApDisputes(subListApDisputes, subListApDisputesId, dispSubList);
        
     // Add data to the SubList
        if(!paraMachine || paraMachine == 'custpage_list_ap_disputes')
        	addDataToApDisputes(subListApDisputes, dispVendorId, dispVendorTxt, dispSubList, dispMonth);
    } 
    // End AP Disputes/Credit Tab
    
    //Add fields to AP Productivity SubList
    function addColumnsApProductivity(objSubList, subListId){
    	
       	// Month
       	var fldMonth = objSubList.addField({
        	id: 'custpage_month',
        	type: serverWidget.FieldType.TEXT,
            label:'Month'
        	});
       	
       	// # bills paid this month to date
       	var fldNbrBillsPaid = objSubList.addField({
        	id: 'custpage_nbr_bills_paid',
        	type: serverWidget.FieldType.TEXT,
            label:'# bills paid this month to date'
        	});
       	
       	// $ bills paid this month to date
       	var fldAmtBillsPaid = objSubList.addField({
        	id: 'custpage_amt_bills_paid',
        	type: serverWidget.FieldType.TEXT,
            label:'$ bills paid this month to date'
        	});
  	
       	// $ amount bills open
       	var fldAmtBillsOpen = objSubList.addField({
        	id: 'custpage_amt_bills_open',
        	type: serverWidget.FieldType.TEXT,
            label:'$ amount bills open'
        	});
       	
       	//Total days payables outstanding
       	var fldTotalDays = objSubList.addField({
        	id: 'custpage_total_days',
        	type: serverWidget.FieldType.TEXT,
            label:'days payables outstanding'
        	});
       	fldTotalDays.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	
       	//Number of payables outstanding
       	var fldNbrPays = objSubList.addField({
        	id: 'custpage_nbr_pays',
        	type: serverWidget.FieldType.TEXT,
            label:'# of payables outstanding'
        	});
       	fldNbrPays.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	
       	//Average days payables outstanding
       	var fldAvgDays = objSubList.addField({
        	id: 'custpage_avg_days',
        	type: serverWidget.FieldType.TEXT,
            label:'Average days payables outstanding'
        	});
    }
    //Add fields to AP disputes/credits SubList
    function addColumnsApDisputes(objSubList, subListId, dispSubList){
    	
    	// URL View
		// URL - If it is not a drill down 
		if(dispSubList){
			var lblMonth = 'Date Created';
			var lblInvDispute = 'invoice in dispute';
		}else{
	       var fldView = objSubList.addField({
	        	id: 'custpage_view',
	        	type: serverWidget.FieldType.URL,
	            label:'View'
	        	});
	       	fldView.linkText= 'View';
	       	
	       	var lblMonth = 'Month';
	       	var lblInvDispute = '# of invoices in dispute';
		}
       	// Month
       	var fldMonth = objSubList.addField({
        	id: 'custpage_month',
        	type: serverWidget.FieldType.TEXT,
            label: lblMonth
        	});
       	
       	// # of invoices in dispute
       	var fldNbrInvDispute = objSubList.addField({
        	id: 'custpage_nbr_inv_dispute',
        	type: serverWidget.FieldType.TEXT,
            label: lblInvDispute
        	});
       	
       	// $ of invoices
       	var fldAmtInvoice = objSubList.addField({
        	id: 'custpage_amt_inv',
        	type: serverWidget.FieldType.TEXT,
            label:'$ of invoices'
        	});
       	
       	// $ amount in dispute
       	var fldAmtDispute = objSubList.addField({
        	id: 'custpage_amt_inv_dispute',
        	type: serverWidget.FieldType.TEXT,
            label:'$ amount in dispute'
        	});
     // Total $ of Invoices
       	var fldTotalAmtInvoice = objSubList.addField({
        	id: 'custpage_total_amt_inv_dispute',
        	type: serverWidget.FieldType.TEXT,
            label:'Total $ of Invoices'
        	});
     // % of Total in Dispute
       	var fldPerctTotalDispute = objSubList.addField({
        	id: 'custpage_perct_total_dispute',
        	type: serverWidget.FieldType.TEXT,
            label:'% of Total in Dispute'
        	});
    }

    //Add fields to AR SubList
    function addColumnsAr(objSubList, subListId){
    	
       	// Month
       	var fldMonth = objSubList.addField({
        	id: 'custpage_month',
        	type: serverWidget.FieldType.TEXT,
            label:'Month'
        	});
       	
       	//$ Chargebacks this month to date 
       	var fld = objSubList.addField({
        	id: 'custpage_chargeback',
        	type: serverWidget.FieldType.TEXT,
            label:'$ Chargebacks this month to date'
        	});
       	
       	//$ Chargebacks this month to date last Year
       	var fld = objSubList.addField({
        	id: 'custpage_chargeback_last_year',
        	type: serverWidget.FieldType.TEXT,
            label:'$ Chargebacks this month to date last Year'
        	});

    }
	
    // Add data to the Sub List AP Productivity
    function addDataToApProductivity(objSubList, vendorId, categoryId){


    	if(vendorId || categoryId){
    		if(vendorId && categoryId){
    			var srchFilters = [["type","anyof","VendBill"], 
    		      "AND", 
    		      ["mainline","is","T"], 
    		      "AND", 
    		      ["trandate","onorafter","startoflastrollingyear"],
    		      "AND", 
    		      ["custcolitem_link.custitem20","anyof",categoryId], 
    		      "AND", 
    		      ["vendor.entityid","startswith",vendorId]	];
    		      
    		}else if(vendorId){
    			var srchFilters = [["type","anyof","VendBill"], 
    			     		      "AND", 
    			     		      ["mainline","is","T"], 
    			     		      "AND", 
    			     		      ["trandate","onorafter","startoflastrollingyear"],
    			     		      "AND", 
    			     		     ["vendor.entityid","startswith",vendorId]	];
    		}else if(categoryId){
    			var srchFilters = [["type","anyof","VendBill"], 
    			     		      "AND", 
    			     		      ["mainline","is","T"], 
    			     		      "AND", 
    			     		      ["trandate","onorafter","startoflastrollingyear"],
    			     		      "AND", 
    			     		      ["custcolitem_link.custitem20","anyof",categoryId] ];	
    		}
    	//log.audit('Data AP Prod srchFilters','srchFilters : ' + srchFilters);	
    	var srchColumns = [
    	          search.createColumn({name: "trandate", summary: "GROUP", sort: search.Sort.ASC, function: "month"}),
    		      search.createColumn({
    		         name: "formulanumeric", 
    		         summary: "COUNT",
    		         formula: "CASE WHEN {systemnotes.field} = 'Document Status' AND {systemnotes.newvalue} = 'Paid In Full' THEN {internalid} END"
    		      }),
    		      search.createColumn({
    		         name: "formulanumeric",
    		         summary: "SUM",
    		         formula: "CASE WHEN {systemnotes.field} = 'Document Status' AND {systemnotes.newvalue} = 'Paid In Full' THEN {amount} END"
    		      }),
    		      search.createColumn({
    		         name: "formulanumeric",
    		         summary: "SUM",
    		         formula: "CASE WHEN {status} = 'Open' THEN {amount} END"
    		      }),
    		      search.createColumn({
    		         name: "formulanumeric",
    		         summary: "SUM",
    		         formula: "CASE WHEN {status} = 'Open' THEN CASE WHEN {today} > {duedate} THEN TRUNC({today})-TRUNC({duedate}) END END"
    		      }),
    		      search.createColumn({
    		         name: "formulanumeric",
    		         summary: "SUM",
    		         formula: "CASE WHEN {status} = 'Open' THEN CASE WHEN {today} > {duedate} THEN 1 END END"
    		      }) ]; 
 
    	var apProdSearchObj = search.create({
    		   type: "vendorbill",
    		   filters: srchFilters,
    		   columns: srchColumns
    		});
		//var searchResultCount = apProdSearchObj.runPaged().count;
		//log.debug("apProdSearchObj result count",searchResultCount);
    	}else
    		var apProdSearchObj = search.load({id: 'customsearch_db_ap_productivity'});
    	
    	var rowNbr = 0;
    	var apProdResultSet = apProdSearchObj.run();
    	apProdResultSet.each(function(result){

    		var transMonth = result.getValue(apProdSearchObj.columns[0]);
    		var nbrBillPaid = result.getValue(apProdSearchObj.columns[1]);
    		var amtBillPaid = result.getValue(apProdSearchObj.columns[2]);
    		var amtBillOpen = result.getValue(apProdSearchObj.columns[3]);
    		var totalDaysPayable = result.getValue(apProdSearchObj.columns[4]);
    		var nbrDaysPayable = result.getValue(apProdSearchObj.columns[5]);
    		var avgDaysPayable = 0;
    		if(totalDaysPayable && nbrDaysPayable)
            	avgDaysPayable = (totalDaysPayable/nbrDaysPayable).toFixed(2);

    		//add data to sublist row
    		// # bills paid this month to date
    	      if(transMonth)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_month',
    		        	line : rowNbr,
    					value : transMonth 
    					});
    	   // # bills paid this month to date
    	      if(nbrBillPaid)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_nbr_bills_paid',
    		        	line : rowNbr,
    					value : nbrBillPaid 
    					});
    	      
    	   // $ bills paid this month to date
    	      if(amtBillPaid)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amt_bills_paid',
    		        	line : rowNbr,
    					value : amtBillPaid
    					});
    	   // $ amount bills open
    	      if(amtBillOpen)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amt_bills_open',
    		        	line : rowNbr,
    					value : amtBillOpen
    					});
    		
    		// Total Days PAYABLES OUTSTANDING
    	      if(totalDaysPayable)
    	    	  objSubList.setSublistValue({
  		        		id: 'custpage_total_days',
  		        		line : rowNbr,
  		        		value : totalDaysPayable
  						});
    	      
    	   // # of PAYABLES OUTSTANDING
    	      if(nbrDaysPayable)
    	    	  objSubList.setSublistValue({
  		        		id: 'custpage_nbr_pays',
  		        		line : rowNbr,
  		        		value : nbrDaysPayable
  						});
    	      
    	   // Average Days PAYABLES OUTSTANDING
    	      if(avgDaysPayable)
    	    	  objSubList.setSublistValue({
  		        		id: 'custpage_avg_days',
  		        		line : rowNbr,
  		        		value : avgDaysPayable
  						});
    		rowNbr++;
    		return true;
    		});
    }
    
    // Add data to the Sub List AP Disputes/Credit
    function addDataToApDisputes(objSubList, vendorId, vendorTxt, dispSubList, dispMonth){
    	var startDate;
    	var endDate;
    	var isValidDates = false;

    	if(dispMonth){
    		dispMonth = String(dispMonth);

    		var mnth = dispMonth.substr(dispMonth.length - 2, dispMonth.length);
    		var yr = dispMonth.substr(0, 4);
        	if(mnth && yr){
	        	startDate = mnth + '/' + '01' + '/' + yr;
	        	var monthEndDt = new Date(yr, mnth, 0);
	        	endDate = mnth + '/' + monthEndDt.getDate() + '/' + yr;
	        	isValidDates = true;
        	}
    	}
    	if(isValidDates || vendorId){
    		if(isValidDates && vendorId){
    			log.debug('startDate 1', startDate);
    			log.debug('endDate 1', endDate);
    			log.debug('Valid dates n vendor', vendorTxt);
    			var srchFilters = [ ["created","within", startDate, endDate], 
    			    			      "AND", 
    			    			     ["custrecordvendor.entityid","startswith",vendorTxt]];
    			var srchColumns = [
    			                   search.createColumn({name: "created", label: "Date Created"}),
    			                   search.createColumn({
    			                      name: "formulanumeric",
    			                      formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {internalid} END",
    			                      label: "# Of Invoices in Dispute"
    			                   }),
    			                   search.createColumn({
    			                      name: "formulanumeric",
    			                      formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecordinvoice_amount} END",
    			                      label: "$ Of Invoices in Dispute"
    			                   }),
    			                   search.createColumn({
    			                      name: "formulanumeric",
    			                      formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecorddisputed_amount} END",
    			                      label: "$ Amount in Dispute"
    			                   }),
    			                   search.createColumn({name: "custrecordinvoice_amount", label: "Invoice Amount"}),
    			                   search.createColumn({
    			                      name: "formulapercent",
    			                      formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecorddisputed_amount} END/{custrecordinvoice_amount}",
    			                      label: "Formula (Percent)",
    			                      function: "roundToHundredths"
    			                   })
    			                ];
    		}else if(isValidDates){
    			log.debug('Valid dates', startDate + ' : ' + endDate);
    			var srchFilters = [ ["created","within", startDate, endDate]];
    			
    			var srchColumns = [
    			                   search.createColumn({name: "created", label: "Date Created"}),
    			                   search.createColumn({
    			                      name: "formulanumeric",
    			                      formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {internalid} END",
    			                      label: "# Of Invoices in Dispute"
    			                   }),
    			                   search.createColumn({
    			                      name: "formulanumeric",
    			                      formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecordinvoice_amount} END",
    			                      label: "$ Of Invoices in Dispute"
    			                   }),
    			                   search.createColumn({
    			                      name: "formulanumeric",
    			                      formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecorddisputed_amount} END",
    			                      label: "$ Amount in Dispute"
    			                   }),
    			                   search.createColumn({name: "custrecordinvoice_amount", label: "Invoice Amount"}),
    			                   search.createColumn({
    			                      name: "formulapercent",
    			                      formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecorddisputed_amount} END/{custrecordinvoice_amount}",
    			                      label: "Formula (Percent)",
    			                      function: "roundToHundredths"
    			                   })
    			                ];
    		}else if(vendorId){
              //log.debug('Valid vendor', vendorTxt);
    			var srchFilters = [ ["created","onorafter","startoflastrollingyear"], 
  			    			      "AND", 
  			    			     ["custrecordvendor.entityid","startswith",vendorTxt]];
    			
    			var srchColumns = [search.createColumn({
    			     			         name: "created",
    			     			         summary: "GROUP",
    			     			         label: "Date Created",
    			                          function: "month"
    			     			      }),
    			     			      search.createColumn({
    			     			         name: "formulanumeric",
    			     			         summary: "COUNT",
    			     			         formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {internalid} END",
    			     			         label: "# Of Invoices in Dispute"
    			     			      }),
    			     			      search.createColumn({
    			     			         name: "formulanumeric",
    			     			         summary: "SUM",
    			     			         formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecordinvoice_amount} END",
    			     			         label: "$ Of Invoices in Dispute"
    			     			      }),
    			     			      search.createColumn({
    			     			         name: "formulanumeric",
    			     			         summary: "SUM",
    			     			         formula: "CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecorddisputed_amount} END",
    			     			         label: "$ Amount in Dispute"
    			     			      }),
    			     			      search.createColumn({
    			     			          name: "formulanumeric",
    			     			          summary: "SUM",
    			     			          formula: "{custrecordinvoice_amount}",
    			     			          label: "Total $ of Invoices"
    			     			       }),
    			     			       search.createColumn({
    			     			          name: "formulapercent",
    			     			          summary: "MAX",
    			     			          formula: "SUM(CASE WHEN {custrecordstatus} = ANY('Pending vendor response', 'Pending credit', 'Pending internal research') THEN {custrecorddisputed_amount} END)/SUM({custrecordinvoice_amount})",
    			     			          label: "% of Total in Dispute"
    			     			       })
    			     			   ];
    		}

    		var apDisputeSearchObj = search.create({
 			   type: "customrecordbilling_dispute",
 			   filters:	srchFilters	,
 			   columns: srchColumns
    		});
          
    	}else{
          //log.debug('default at ap Disputes','default at ap Disputes' );
          
    		var apDisputeSearchObj = search.load({id: 'customsearch_db_ap_disputes_credit'});

    	}
    	var rowNbr = 0;
    	var apDisputeResultSet = apDisputeSearchObj.run();

    	apDisputeResultSet.each(function(result){
    		
    		var transMonth = result.getValue(apDisputeResultSet.columns[0]);
    		var nbrInvDispute = result.getValue(apDisputeResultSet.columns[1]);
    		var amtInv = result.getValue(apDisputeResultSet.columns[2]);
    		var amtInvDispute = result.getValue(apDisputeResultSet.columns[3]);
    		var totalAmtInv = result.getValue(apDisputeResultSet.columns[4]);
    		var perctAmtDispute = result.getValue(apDisputeResultSet.columns[5]);

    		//add data to sublist row
    		// URL - If it is not a drill down 
    		if(!dispSubList){
	    		var param = {};
	    		param.dispTab = 'AP_Disputes';
	          	param.month = transMonth;
	          	param.apDispVendorId = vendorId;
	          	param.apDispVendorTxt = vendorTxt;
	    		if(transMonth){
	    			
		    		var outURL = url.resolveScript({
		    				scriptId: 'customscript_zag_finance_dashboard_sut',
		    				deploymentId: 'customdeploy_zag_finance_dashboard_sut',
		    				params: param
		    				});
		  	     	 objSubList.setSublistValue({
		  		        	id: 'custpage_view',
		  		        	line : rowNbr,
		  					value : outURL 
		  					});
	          	}
    		}
    		// month
    	      if(transMonth)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_month',
    		        	line : rowNbr,
    					value : transMonth 
    					});
    	   // # of invoices in dispute
    	      if(nbrInvDispute)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_nbr_inv_dispute',
    		        	line : rowNbr,
    					value : nbrInvDispute 
    					});
    	      
    	   // $ of invoices
    	      if(amtInv)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amt_inv',
    		        	line : rowNbr,
    					value : amtInv
    					});
    	   // $ amount in dispute
    	      if(amtInvDispute)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amt_inv_dispute',
    		        	line : rowNbr,
    					value : amtInvDispute
    					});
       	   // Total $ of Invoices
    	      if(totalAmtInv)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_total_amt_inv_dispute',
    		        	line : rowNbr,
    					value : totalAmtInv
    					});
       	   // % of Total in Dispute
    	      if(perctAmtDispute)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_perct_total_dispute',
    		        	line : rowNbr,
    					value : perctAmtDispute
    					});
    		rowNbr++;
    		return true;
    		});

    }
    // Add data to the Sub List AR
    function addDataToAR(objSubList, objForm, ChargebackSts){

    	//Find data of last rolling year
    	// var lastFive = id.substr(id.length - 5);
    	var curDate = new Date();
    	curDate.setDate(1);
    	var curMonth = curDate.getMonth() + 1;
    	var lastYr = curDate.getFullYear() - 2;
    	var lastYrRollingStDt = curMonth + '/' + curDate.getDate() + '/' + lastYr;

    	curDate = new Date();
    	curDate.setDate(0);
    	curDate.setFullYear(curDate.getFullYear() - 1);
    	var lastMonth = curDate.getMonth() + 1;
    	var lastYrRollingEndDt = lastMonth + '/' + curDate.getDate() + '/' + curDate.getFullYear();

    	var objLastYrData = {};
    	// filter the data if Chargeback status is selected
    	var srchColumn =  [search.createColumn({name: "created", summary: "GROUP", label: "Date Created", function: "month"}),
    		    		   search.createColumn({name: "custrecordamount", summary: "SUM",label: "Amount"})
    		    		   ];
    	if(ChargebackSts){
	    	var arSearchLastYrObj = search.create({
	    		   type: "customrecordchargeback",
	    		   filters:
	    		   [
	    		      ["created","within", lastYrRollingStDt, lastYrRollingEndDt],
    			      "AND", 
    			      ["custrecordchargeback_status","anyof", ChargebackSts]
	    		    ],
	    		   columns: srchColumn
	    		});
    	}else{
    		
	    	var arSearchLastYrObj = search.create({
	    		   type: "customrecordchargeback",
	    		   filters:
	    		   [
	    		      ["created","within", lastYrRollingStDt, lastYrRollingEndDt]
	    		    ],
	    		   columns: srchColumn
	    		});
    	}
    		//var searchResultCount = arSearchLastYrObj.runPaged().count;
    		var arLastYrResultSet = arSearchLastYrObj.run();
    		arLastYrResultSet.each(function(result){
    		   var lastYrMonth = result.getValue(arLastYrResultSet.columns[0]);
               var month = lastYrMonth.substr(lastYrMonth.length - 2);
               var lastYrAmnt = result.getValue(arLastYrResultSet.columns[1]);
               objLastYrData[month] = lastYrAmnt;
    		   return true;
    		});
    	//End of Find data of last rolling year

    	var arrKey = Object.keys(objLastYrData);
	
    	// filter the data if Chargeback status is selected
    	if(ChargebackSts){
    		var arSearchObj = search.create({
    			   type: "customrecordchargeback",
    			   filters:
    			   [
    			      ["created","onorafter","startoflastrollingyear"],
    			      "AND", 
    			      ["custrecordchargeback_status","anyof", ChargebackSts]
    			   ],
    			   columns: srchColumn
    			   });
    	
    	}else{
    		var arSearchObj = search.load({id: 'customsearch_db_ar_chargeback'});
    	}	
	
    	var rowNbr = 0;
        var totalAmtChargeBack = 0;
        var totalAmtLastYrChargeBack;
    	var arResultSet = arSearchObj.run();
    	arResultSet.each(function(result){
    		
    		var transMonth = result.getValue(arResultSet.columns[0]);
    		var amtChargeBack = result.getValue(arResultSet.columns[1]);
    		var curMonth = transMonth.substr(transMonth.length - 2);
    		//add data to sublist row
    		// month
    	      if(transMonth)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_month',
    		        	line : rowNbr,
    					value : transMonth 
    					});
    	   // $ Chargeback per month
    	      if(amtChargeBack)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_chargeback',
    		        	line : rowNbr,
    					value : amtChargeBack 
    					});
    	      totalAmtChargeBack += parseFloat(amtChargeBack) || 0;
    	   // $ Chargeback per month last year
    	      var amtLastYrChargeBack = 0;
    	      if(arrKey.indexOf(curMonth) >= 0)
    	    	  amtLastYrChargeBack = objLastYrData[curMonth];
          
    	     if(amtLastYrChargeBack)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_chargeback_last_year',
    		        	line : rowNbr,
    					value : amtLastYrChargeBack
    					}); 
            totalAmtLastYrChargeBack += parseFloat(amtLastYrChargeBack) || 0;
    	    rowNbr++;
    		return true;
    		});
      //Assign values to the fields
      var fldAmtYear = objForm.getField({id : 'custpage_ar_total_chargeback'});
      var fldAmtLastYear = objForm.getField({id : 'custpage_ar_total_chargeback_last_yr'});
      if(totalAmtChargeBack)
      	fldAmtYear.defaultValue = totalAmtChargeBack;
      if(totalAmtLastYrChargeBack)
      	fldAmtLastYear.defaultValue = totalAmtLastYrChargeBack;
    }

    return {
        onRequest: onRequest
    };

});
