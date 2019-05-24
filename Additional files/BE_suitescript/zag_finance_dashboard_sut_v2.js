/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * Developer Satya Prakash (ZAG Insight)
 */
define(['N/search', 'N/ui/serverWidget', 'N/url', 'N/record'],
/**
 * @param {search} search
 * @param {serverWidget} serverWidget
 */
function(search, serverWidget, url, record) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
      try{
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
		//log.debug("dispVendorId ",dispVendorId + " : dispVendorTxt : " + dispVendorTxt + " : ChargebackSts : " + ChargebackSts);
		//log.debug("apProdVendorId ",apProdVendorId + " : apProdVendorTxt : " + apProdVendorTxt + " : apProdCategoryId : " + apProdCategoryId);
		var paraMachine = request.parameters.machine;
		//log.debug("paraMachine -1 ",paraMachine + " : dispMonth : " + dispMonth + " : dispSubList : " + dispSubList);
        var custForm = serverWidget.createForm({title:'Finance Dashboard',hideNavBar:false});
		
        custForm.clientScriptModulePath = 'SuiteScripts/zag_fin_dashboard_cl_v2.js';

        if(dispSubList == 'AP_Disputes'){
        	AP_DisputesTab(custForm, dispVendorId, dispVendorTxt, dispMonth, paraMachine, dispSubList);
        }else if(dispSubList == 'AP_Productivity'){
        	AP_ProductivityTab(custForm, apProdVendorId, apProdVendorTxt, apProdCategoryId, paraMachine, dispSubList, dispMonth);
        }else if(dispSubList == 'AR_Chargeback'){
            //log.debug("calling AR Tab ");
        	AR_Tab(custForm, ChargebackSts, paraMachine, dispSubList, dispMonth);
        }else{
        	AP_DisputesTab(custForm, dispVendorId, dispVendorTxt, dispMonth, paraMachine, dispSubList);
	        AR_Tab(custForm, ChargebackSts, paraMachine, dispSubList, dispMonth);
			AP_ProductivityTab(custForm, apProdVendorId, apProdVendorTxt, apProdCategoryId, paraMachine, dispSubList, dispMonth);
        }
		addJQuery(custForm); // added 02/11/19
		
        response.writePage(custForm); 
	  }catch(er){
		  log.error("Error while loading the dashboard",er.message + "\n Details : " + er.stack + "\n Name : " + er.name);
	  }		
    }
    //added 02/11/19
	function addJQuery(custForm) {
      //log.emergency({title:'test',details:'entered'})
      var strVar="";
      strVar += "<script src='https://cdn.rawgit.com/meetselva/attrchange/master/js/attrchange.js'></script>";
      strVar += "<script language='JavaScript' type='text/javascript'>";
      strVar += " console.log('hello world');";
      strVar += "jQuery(document).ready(function(){";
	  //strVar += "    console.error('hello world')";
	  //strVar += "    console.log(nlapiGetLineItemCount('custpage_pickup_recon'))";
      strVar += "    jQuery('#custpage_ar_tabtxt,#custpage_ap_prod_tabtxt,#custpage_ap_disputes_tabtxt').click(function() {";
      strVar += "        var subId = '#' + this.id.replace('tabtxt', 'splits');";
      strVar += "        console.log(subId);";
      strVar += "        jQuery(subId).html('<div>Loading...</div>');";
      strVar += "        console.log(this.id);";
      strVar += "        var sublistId, params;";
      strVar += "        if(this.id.indexOf('ar') > -1) sublistId = 'custpage_ar';";
      strVar += "        if(this.id.indexOf('ap_prod') > -1) sublistId = 'custpage_ap_prod';";
      strVar += "        if(this.id.indexOf('ap_disputes') > -1) sublistId = 'custpage_ap_disputes';";
      strVar += "        console.log(sublistId);";
      strVar += "        document.getElementById('server_commands').src='/app/site/hosting/scriptlet.nl?script=2483&deploy=1&r=T&machine='+sublistId+'&loc='+params;";
      strVar += "    });";
      strVar += "});";
      strVar += "</script>";

      //log.emergency({title:'test',details:'before end'})

      custForm.addField({id:'custpage_jquery_code',type:serverWidget.FieldType.INLINEHTML,label:'inlinehtml'}).defaultValue = strVar;
      //log.emergency({title:'test',details:'end'})

    }
	//added 02/11/19
	
    // AR Tab
    function AR_Tab(custForm, ChargebackSts, paraMachine, dispSubList, dispMonth){
    	//Add Tabs to the Form
		var taARId = 'custpage_ar_tab';
        var tabAR = custForm.addTab({
        	id: taARId,
        	label: 'AR'
			});
        // Add sublists to the Tabs
        var subListArId = 'custpage_ar';
        var subListAr = custForm.addSublist({
            id: subListArId,
            label:'AR',
            type: serverWidget.SublistType.LIST,
            tab: taARId
          }); 
        // Add fields/columns to the SubList 
        addColumnsAr(subListAr, subListArId, dispSubList);
        
        // add two fields to display Total Amount for this year and Last year
        //var fldAmtYear = custForm.addField({id:'custpage_ar_total_chargeback', type:'TEXT', label: 'Total Amount for Year', container: taARId}).updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
        //var fldAmtLastYear = custForm.addField({id:'custpage_ar_total_chargeback_last_yr', type:'TEXT', label: 'Total Amount for Last Year', container: taARId}).updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE}).updateBreakType({breakType : serverWidget.FieldBreakType.STARTCOL});
      
	    // Adding Chargeback Status filter to AR Tab
	    var selChargebackSts = custForm.addField({id:'custpage_ar_chargeback_sts',type:'SELECT', source: 'customlist396', label: 'Chargeback Status', container: taARId});
	      
	    //assigning Chargeback Status fetched from the parameter
	    if(ChargebackSts)
	       	selChargebackSts.defaultValue = ChargebackSts;
	      
	 // Add data to the SubLists
	    //if(!paraMachine || paraMachine == subListArId) // zag: 02/14
		if(paraMachine == subListArId || dispSubList == 'AR_Chargeback'){
          	//log.debug("calling addDataToAR ");
	    	addDataToAR(subListAr, custForm, ChargebackSts, dispSubList, dispMonth);
        }
	    
    }
    
    // AP Productivity/Credit Tab
    function AP_ProductivityTab(custForm, apProdVendorId, apProdVendorTxt, apProdCategoryId, paraMachine, dispSubList, dispMonth){
    	 //Add Tabs to the Form
		var tabApProductivityId = 'custpage_ap_prod_tab';
        var tabApProductivity = custForm.addTab({
	        	id: tabApProductivityId,
	        	label: 'AP Productivity'
        		});
        
        // Add sublists to the Tabs
        var subListApProductivityId = 'custpage_ap_prod';
        var subListApProductivity = custForm.addSublist({
            id: subListApProductivityId,
            label:'AP Productivity',
            type: serverWidget.SublistType.LIST,
            tab: tabApProductivityId
          });
        
        // Adding Category and Vendor filter to AP Productivity Tab
        var selApProdCategory = custForm.addField({id:'custpage_ap_prod_category', type:'SELECT', source: 'customlist13', label: 'Category', container: tabApProductivityId});
        var selApProdVendor = custForm.addField({id:'custpage_ap_prod_vendor', type:'SELECT', source: 'customlist504', label: 'Vendor', container: tabApProductivityId});
        
        //assigning Vendor Id and Category fetched from the parameter
        if(apProdVendorId)
        	selApProdVendor.defaultValue = apProdVendorId;
        if(apProdCategoryId)
        	selApProdCategory.defaultValue = apProdCategoryId;
        
        // Add fields/columns to the SubList
        addColumnsApProductivity(subListApProductivity, subListApProductivityId, dispSubList);
        
	    // Add data to the SubLists
        //if(!paraMachine || paraMachine == subListApProductivityId) // zag : 02/14
		if(paraMachine == subListApProductivityId || dispSubList == 'AP_Productivity')
        	addDataToApProductivity(subListApProductivity, apProdVendorId, apProdVendorTxt, apProdCategoryId, dispSubList, dispMonth);
    }
    // End of AP Productivity and Credit Tab
    
    // AP Disputes/Credit Tab
    function AP_DisputesTab(custForm, dispVendorId, dispVendorTxt, dispMonth, paraMachine, dispSubList){
    	
    	//Add Tabs to the Form
		var tabApDisputesId = 'custpage_ap_disputes_tab';
    	var tabApDisputes = custForm.addTab({
        	id: tabApDisputesId,
        	label: 'AP disputes/credits'
    		});
    	
    	// Add sublists to the Tabs
        var subListApDisputesId = 'custpage_ap_disputes';
        var subListApDisputes = custForm.addSublist({
            id: subListApDisputesId,
            label:'AP disputes/credits',
            type: serverWidget.SublistType.LIST,
            tab: tabApDisputesId
          });
        
        // Adding Vendor filter to AP Disputes Tab
        var selApDisVendor = custForm.addField({id:'custpage_ap_disputes_vendor',type:'SELECT', source: 'customlist504', label: 'Select Vendor', container: tabApDisputesId});
        //assigning Vendor Id fetched from the parameter
        if(dispVendorId)
        	selApDisVendor.defaultValue = dispVendorId;
        
        // Add fields/columns to the SubLists
        addColumnsApDisputes(subListApDisputes, subListApDisputesId, dispSubList);
        
		// Add data to the SubList
        if(!paraMachine || paraMachine == subListApDisputesId) 
        	addDataToApDisputes(subListApDisputes, dispVendorId, dispVendorTxt, dispSubList, dispMonth);
    } 
    // End AP Disputes/Credit Tab
    
    //Add fields to AP Productivity SubList
    function addColumnsApProductivity(objSubList, subListId, dispSubList){
    	
		if(dispSubList){
			var lblMonth = 'Date Created';
			var lblNbrBillPaid = 'Internal Id';
			var lblAmtBillPaid = 'Amount bills paid'
			var lblAmtBillOpen = 'Amount bills open';

			// added : 02/15/
			var fldView = objSubList.addField({
	        	id: 'custpage_prod_rec_view',
	        	type: serverWidget.FieldType.TEXT,
	            label:'View'
	        	});
		}else{
	       var fldView = objSubList.addField({
	        	id: 'custpage_prod_view',
	        	type: serverWidget.FieldType.URL,
	            label:'View'
	        	});
	       	fldView.linkText= 'View';
	       	
	       	var lblMonth = 'Month';
	       	var lblNbrBillPaid = '# bills paid this month to date';
			var lblAmtBillPaid = '$ bills paid this month to date';
			var lblAmtBillOpen = '$ amount bills open';
		}		
		
       	// Month
       	var fldMonth = objSubList.addField({
        	id: 'custpage_month',
        	type: serverWidget.FieldType.TEXT,
            label:lblMonth
        	});
       	
       	// # bills paid this month to date
       	var fldNbrBillsPaid = objSubList.addField({
        	id: 'custpage_nbr_bills_paid',
        	type: serverWidget.FieldType.TEXT,
            label: lblNbrBillPaid
        	});
       	
       	// $ bills paid this month to date
       	var fldAmtBillsPaid = objSubList.addField({
        	id: 'custpage_amt_bills_paid',
        	type: serverWidget.FieldType.TEXT,
            label: lblAmtBillPaid
        	});
  	
       	// $ amount bills open
       	var fldAmtBillsOpen = objSubList.addField({
        	id: 'custpage_amt_bills_open',
        	type: serverWidget.FieldType.TEXT,
            label: lblAmtBillOpen
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
			var lblAmtInvDispute = '$ of Invoice';
			var lblPctAmtDispute = '% in Dispute';
			// added : 02/15/
			var fldView = objSubList.addField({
	        	id: 'custpage_dis_rec_view',
	        	type: serverWidget.FieldType.TEXT,
	            label:'View'
	        	});
		}else{
	       var fldView = objSubList.addField({
	        	id: 'custpage_dis_view',
	        	type: serverWidget.FieldType.URL,
	            label:'View'
	        	});
	       	fldView.linkText= 'View';
	       	
	       	var lblMonth = 'Month';
	       	var lblInvDispute = '# of invoices in dispute';
			var lblAmtInvDispute = 'Sum of Monthly Invoices';
			var lblPctAmtDispute = '% of Total in Dispute'
		}
       	// Month
       	var fldMonth = objSubList.addField({
        	id: 'custpage_month',
        	type: serverWidget.FieldType.TEXT,
            label: lblMonth
        	});
			
     // Total $ of Invoices
       	var fldTotalAmtInvoice = objSubList.addField({
        	id: 'custpage_total_amt_inv_dispute',
        	type: serverWidget.FieldType.TEXT,
            label:lblAmtInvDispute
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
            label:'Sum of Invoices Disputed'
        	});
       	
       	// $ amount in dispute
       	var fldAmtDispute = objSubList.addField({
        	id: 'custpage_amt_inv_dispute',
        	type: serverWidget.FieldType.TEXT,
            label:'Value of Pending Disputes'
        	});

     // % of Total in Dispute
       	var fldPerctTotalDispute = objSubList.addField({
        	id: 'custpage_perct_total_dispute',
        	type: serverWidget.FieldType.TEXT,
            label:lblPctAmtDispute
        	});
			
     // Resolved - added : 02/15
       	var fldPerctTotalDispute = objSubList.addField({
        	id: 'custpage_ar_disp_resolved',
        	type: serverWidget.FieldType.TEXT,
            label:'Resolved'
        	});
			
    }

    //Add fields to AR SubList
    function addColumnsAr(objSubList, subListId, dispSubList){
		if(dispSubList){
			//var lblMonth = 'Date Created';
			//var lblInvDispute = 'invoice in dispute';
			// Record Link 
			var fldView = objSubList.addField({
	        	id: 'custpage_ar_rec_view',
	        	type: serverWidget.FieldType.TEXT,
	            label:'View'
	        	});
			// Date
			var fldMonth = objSubList.addField({
				id: 'custpage_trans_date',
				type: serverWidget.FieldType.TEXT,
				label:'Date'
				});
			
			//Internal Id
			/*var fld = objSubList.addField({
				id: 'custpage_internal_id',
				type: serverWidget.FieldType.TEXT,
				label:'Internal Id'
				});*/
			
			//BE Action
			var fld = objSubList.addField({
				id: 'custpage_be_action',
				type: serverWidget.FieldType.TEXT,
				label:'BE Action'
				});
			//Amount BE Action 
			var fld = objSubList.addField({
				id: 'custpage_amnt_be_action',
				type: serverWidget.FieldType.TEXT,
				label:'Amount BE Action'
				});
		}else{
	        var fldView = objSubList.addField({
	        	id: 'custpage_ar_view',
	        	type: serverWidget.FieldType.URL,
	            label:'View'
	        	});
	       	fldView.linkText= 'View';
	       	
	       	//var lblMonth = 'Month';
	       	//var lblInvDispute = '# of invoices in dispute';
			
			// Month
			var fldMonth = objSubList.addField({
				id: 'custpage_month',
				type: serverWidget.FieldType.TEXT,
				label:'Month'
				});
			
			//Total Chargebacks
			var fld = objSubList.addField({
				id: 'custpage_total_chargeback',
				type: serverWidget.FieldType.TEXT,
				label:'Total Chargebacks'
				});
			
			//Pending BE Action
			var fld = objSubList.addField({
				id: 'custpage_pending_be_action',
				type: serverWidget.FieldType.TEXT,
				label:'Pending BE Action'
				});
			//Amount Pending BE Action 
			var fld = objSubList.addField({
				id: 'custpage_amnt_pending_be_action',
				type: serverWidget.FieldType.TEXT,
				label:'Amount Pending BE Action'
				});
			//Pending Bank Response
			var fld = objSubList.addField({
				id: 'custpage_pending_bank_response',
				type: serverWidget.FieldType.TEXT,
				label:'Pending Bank Response'
				});
			//Amount Pending Bank Response
			var fld = objSubList.addField({
				id: 'custpage_amnt_pending_bank_response',
				type: serverWidget.FieldType.TEXT,
				label:'Amount Pending Bank Response'
				});
			//BE Won	
			var fld = objSubList.addField({
				id: 'custpage_be_won',
				type: serverWidget.FieldType.TEXT,
				label:'BE Won'
				});
			//Amount BE Won
			var fld = objSubList.addField({
				id: 'custpage_amnt_be_won',
				type: serverWidget.FieldType.TEXT,
				label:'Amount BE Wonn'
				});
			//BE Lost	
			var fld = objSubList.addField({
				id: 'custpage_be_lost',
				type: serverWidget.FieldType.TEXT,
				label:'BE Lost'
				});
			//Amount BE Lost
			var fld = objSubList.addField({
				id: 'custpage_amnt_be_lost',
				type: serverWidget.FieldType.TEXT,
				label:'Amount BE Lost'
				});
			//Accepted	
			var fld = objSubList.addField({
				id: 'custpage_accepted',
				type: serverWidget.FieldType.TEXT,
				label:'Accepted'
				});
			//Amount Accepted
			var fld = objSubList.addField({
				id: 'custpage_amnt_accepted',
				type: serverWidget.FieldType.TEXT,
				label:'Amount Accepted'
				});
			//OM to Cancel Order
			var fld = objSubList.addField({
				id: 'custpage_om_cancel_order',
				type: serverWidget.FieldType.TEXT,
				label:'OM to Cancel Order'
				});
			//Amount OM to Cancel Order
			var fld = objSubList.addField({
				id: 'custpage_amnt_om_cancel_order',
				type: serverWidget.FieldType.TEXT,
				label:'Amount OM to Cancel Order'
				});
		}
    }
	
	// Add data to the Sub List AP Productivity
    function addDataToApProductivity(objSubList, vendorId, vendorText, categoryId, dispSubList, dispMonth){
		var startDate;
    	var endDate;
    	var isValidDates = false;
		var srchId = '';
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
		// update the search to add date : 02/14
		//log.debug('addDataToApProductivity ', 'startDate : ' + startDate + ' : endDate : ' + endDate + ' : isValidDates : ' + isValidDates + ' : dispSubList : ' + dispSubList + ' : dispMonth : ' + dispMonth + " : vendorId : " + vendorId + " : categoryId : " + categoryId);
    	if(vendorText || categoryId || isValidDates){
			var srchFilter1 = '';
			var srchFilter2 = '';
			var srchFilter3 = '';
			if(isValidDates){
    			//log.debug('Valid dates', startDate + ' : ' + endDate);
    			var srchFilters1 = search.createFilter({name:'trandate',operator:'within',values: [startDate, endDate]}); 
			}
    		/*if(vendorText && categoryId){
				var srchFilters1 = search.createFilter({name:'custitem20',join: 'custcolitem_link',operator:'anyof',values: categoryId}); 
    			var srchFilters2 = search.createFilter({name: 'entityid', join: 'vendor',operator: 'startswith', values: vendorText});  		      
    		}else */
			if(vendorText){
    			var srchFilters2 = search.createFilter({name: 'entityid', join: 'vendor',operator: 'startswith', values: vendorText});  
    		}//else 
			if(categoryId){
    			var srchFilters3 = search.createFilter({name:'custitem20',join: 'custcolitem_link',operator:'anyof',values: categoryId});	
    		}
    	//log.audit('Data AP Prod srchFilters','srchFilters : ' + srchFilters);	
		if(isValidDates)
			srchId = 'customsearch_db_ap_productivity_2';
		else
			srchId = 'customsearch_db_ap_productivity_3';// testing
			//srchId = 'customsearch_db_ap_productivity';
		log.debug("srchId",srchId);
    	var apProdSearchObj = search.load({id: srchId});
		var myFilters = apProdSearchObj.filters;
		if(srchFilters1)
			myFilters.push(srchFilters1);
		if(srchFilters2)
			myFilters.push(srchFilters2);
		if(srchFilters3)
			myFilters.push(srchFilters3);
		apProdSearchObj.filters = myFilters;
		
		log.debug("myFilters AP Prod: ", JSON.stringify(myFilters));

    	}else
			var apProdSearchObj = search.load({id: 'customsearch_db_ap_productivity_3'}); // testing
    		//var apProdSearchObj = search.load({id: 'customsearch_db_ap_productivity'});
    	
    	var rowNbr = 0;
		
		var searchResultCount = apProdSearchObj.runPaged().count; // testing
		log.debug("apProdSearchObj result count",searchResultCount); // testing
		
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

			if(isValidDates){
				var internalId = result.id;
              	var urlTxt = 'View';
				var recLink = url.resolveRecord({recordType:record.Type.VENDOR_BILL,recordId:result.id,isEditMode:false})
				var recURL = "<a href= "+recLink+" target=_blank>"+ urlTxt +"</a>"
				if(internalId){
					objSubList.setSublistValue({
		  		        	id: 'custpage_prod_rec_view',
		  		        	line : rowNbr,
		  					value : recURL 
		  					});
				}
			}else{
				// URL - If it is not a drill down 
				if(!dispSubList){
					var param = {};
					param.dispTab = 'AP_Productivity';
					param.month = transMonth;
					param.apProdVendorId = vendorId;
					param.apProdVendorTxt = vendorText;
					param.apProdCategoryId = categoryId;
					if(transMonth){
						
						var outURL = url.resolveScript({
								scriptId: 'customscript_zag_finance_dashboard_sut',
								deploymentId: 'customdeploy_zag_finance_dashboard_sut',
								params: param
								});
						 objSubList.setSublistValue({
								id: 'custpage_prod_view',
								line : rowNbr,
								value : outURL 
								});
					}
				}
			}
			
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
 	
	// End of function: Add data to the Sub List AP Productivity
  
	
	// Add data to the Sub List AP Disputes/Credit
    function addDataToApDisputes(objSubList, vendorId, vendorTxt, dispSubList, dispMonth){
    	var startDate;
    	var endDate;
    	var isValidDates = false;
		var srchId = '';
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
     // log.debug('Values Ap Disputes', 'startDate : ' + startDate + ' : endDate : ' + endDate + ' : isValidDates : ' + isValidDates + ' : dispSubList : ' + dispSubList + ' : dispMonth : ' + dispMonth);
    	if(isValidDates || vendorId){
			var srchFilters1 = '';
			var srchFilters2 = '';
    		/*if(isValidDates && vendorId){
    			log.debug('startDate 1', startDate);
    			log.debug('endDate 1', endDate);
    			log.debug('Valid dates n vendor', vendorTxt);
				var srchFilters1 = search.createFilter({name:'created',operator:'within',values: [startDate, endDate]}); 
    			var srchFilters2 = search.createFilter({name: 'entityid', join: 'custrecordvendor',operator: 'startswith',	values: vendorTxt});
    		}else */
			if(isValidDates){
    			//log.debug('Valid dates', startDate + ' : ' + endDate);
    			var srchFilters1 = search.createFilter({name:'created',operator:'within',values: [startDate, endDate]});    			
    		}//else 
			if(vendorId){
                //log.debug('Valid vendor', vendorTxt);
    			var srchFilters2 = search.createFilter({name: 'entityid', join: 'custrecordvendor',operator: 'startswith',	values: vendorTxt});    		
    		}
			if(isValidDates)
              srchId = 'customsearch_db_ap_disputes_credit_2';
                //srchId = 'customsearch_db_ap_disputes_credit';
				
			else
				srchId = 'customsearch_db_ap_disputes_credit';
          
			//log.debug("srchId AP Dis: ", srchId);
          
    		var apDisputeSearchObj = search.load({id: srchId});
			//apDisputeSearchObj.filters.push(srchFilters1); 
			var myFilters = apDisputeSearchObj.filters;
			if(srchFilters1)
				myFilters.push(srchFilters1);
			if(srchFilters2)
				myFilters.push(srchFilters2);
			apDisputeSearchObj.filters = myFilters;
			//log.debug("myFilters AP Dis: ", JSON.stringify(myFilters));
    	}else{
          //log.debug('default at ap Disputes','default at ap Disputes' );
          
    		var apDisputeSearchObj = search.load({id: 'customsearch_db_ap_disputes_credit'});

    	}
    	var rowNbr = 0;
        //var searchResultCount = apDisputeSearchObj.runPaged().count; // testing
		//log.debug("apDisputeSearchObj result count",searchResultCount); // testing
      
    	var apDisputeResultSet = apDisputeSearchObj.run();
		
    	apDisputeResultSet.each(function(result){
    		//log.debug("Inside apDisputeResultSet AP Dis ");
    		var transMonth = result.getValue(apDisputeResultSet.columns[0]);
    		var nbrInvDispute = result.getValue(apDisputeResultSet.columns[1]);
    		var amtInv = result.getValue(apDisputeResultSet.columns[2]);
    		var amtInvDispute = result.getValue(apDisputeResultSet.columns[3]);
    		var totalAmtInv = result.getValue(apDisputeResultSet.columns[4]);
    		var perctAmtDispute = result.getValue(apDisputeResultSet.columns[5]);
			var arResolved = result.getValue(apDisputeResultSet.columns[6]); // added : 02/15
			
    		//add data to sublist row
			if(isValidDates){
				arResolved = result.getText(apDisputeResultSet.columns[6]); // added : 02/15
				var internalId = result.id;
              	var urlTxt = 'View';
				var recLink = url.resolveRecord({recordType:'customrecordbilling_dispute',recordId:result.id,isEditMode:false})
				var recURL = "<a href= "+recLink+" target=_blank>"+ urlTxt +"</a>"
				if(internalId){
					objSubList.setSublistValue({
		  		        	id: 'custpage_dis_rec_view',
		  		        	line : rowNbr,
		  					value : recURL 
		  					});
				}
			}else{			
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
								id: 'custpage_dis_view',
								line : rowNbr,
								value : outURL 
								});
					}
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
						
			// Resolved : added : 02/15 
			if(arResolved)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_ar_disp_resolved',
    		        	line : rowNbr,
    					value : arResolved
    					});
    		rowNbr++;
    		return true;
    		});

    }
	// End of function - data to sub list AP Disputes/Credit
	
	
	// Add data to the Sub List AR
    function addDataToAR(objSubList, objForm, ChargebackSts, dispSubList, dispMonth){
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
		// update the search to add date : 02/14
		//log.debug('Values AR', 'startDate : ' + startDate + ' : endDate : ' + endDate + ' : isValidDates : ' + isValidDates + ' : dispSubList : ' + dispSubList + ' : dispMonth : ' + dispMonth);
		
		if(isValidDates || ChargebackSts){
			var srchFilters1 = '';
			var srchFilters2 = '';
    		
			if(isValidDates){
    			log.debug('Valid dates AR', startDate + ' : ' + endDate);
    			var srchFilters1 = search.createFilter({name:'created',operator:'within',values: [startDate, endDate]});    			
    		}//else 
			// filter the data if Chargeback status is selected
			if(ChargebackSts)
             	var srchFilters2 = search.createFilter({name: 'custrecordchargeback_status', operator: 'anyof',	values: [ChargebackSts]});    			
    		if(isValidDates) 
				var searchId = 'customsearch_db_ar_chargeback_2_2';
			else	
				var searchId = 'customsearch_db_ar_chargeback_2';
			
    		var arSearchObj = search.load({id: searchId});
    		//var arSearchObj = search.load({id: 'customsearch_db_ar_chargeback_2_2'});
			var myFilters = arSearchObj.filters;
			if(srchFilters1)
				myFilters.push(srchFilters1);
			if(srchFilters2)
				myFilters.push(srchFilters2);
			/***/
			//log.debug("myFilters AR : ", JSON.stringify(myFilters));
            arSearchObj.filters = myFilters;		
    	}else{
    		var arSearchObj = search.load({id: 'customsearch_db_ar_chargeback_2'});
    	}	

    	var rowNbr = 0;
        var totalAmtChargeBack = 0;
    	var arResultSet = arSearchObj.run();
    	arResultSet.each(function(result){
    		if(isValidDates){
				var transDate = result.getValue(arResultSet.columns[0]);		//Date 	 						
				var internalId = result.getValue(arResultSet.columns[1]);  // internal Id				
				var BeAction = result.getText(arResultSet.columns[2]);    // BE Action				
				var amntBeActn = result.getValue(arResultSet.columns[3]);  //Amount  BE Action	
			}else{
				var transMonth = result.getValue(arResultSet.columns[0]);		//Month	 						
				var totalChargeBack = result.getValue(arResultSet.columns[1]);  //Total Chargebacks				
				var pendingBeAction = result.getValue(arResultSet.columns[2]);    //Pending BE Action				
				var amntPendingBeActn = result.getValue(arResultSet.columns[3]);  //Amount Pending BE Action		
				var pendingBankResponse = result.getValue(arResultSet.columns[4]);  //Pending Bank Response			
				var amntPendingBankResponse = result.getValue(arResultSet.columns[5]); //Amount Pending Bank Response	
				var BeWon = result.getValue(arResultSet.columns[6]);  //BE Won						
				var amntBeWon = result.getValue(arResultSet.columns[7]);  //Amount BE Won					
				var beLost = result.getValue(arResultSet.columns[8]);	  //BE Lost		
				var amntBeLost = result.getValue(arResultSet.columns[9]); //Amount BE Lost
				var accepted = result.getValue(arResultSet.columns[10]);   //Accepted		
				var amntAccepted = result.getValue(arResultSet.columns[11]); //Amount Accepted
				var omToCancelOrdr = result.getValue(arResultSet.columns[12]); //OM to Cancel Order
				var amntOmToCancelOrdr = result.getValue(arResultSet.columns[13]); //Amount OM to Cancel Order	
			}
		// URL - If it is not a drill down 
    		if(!dispSubList){
	    		var param = {};
	    		param.dispTab = 'AR_Chargeback';
	          	param.month = transMonth;
	          	param.chargebackStatus = ChargebackSts;
	          	
	    		if(transMonth){
	    			
		    		var outURL = url.resolveScript({
		    				scriptId: 'customscript_zag_finance_dashboard_sut',
		    				deploymentId: 'customdeploy_zag_finance_dashboard_sut',
		    				params: param
		    				});
		  	     	 objSubList.setSublistValue({
		  		        	id: 'custpage_ar_view',
		  		        	line : rowNbr,
		  					value : outURL 
		  					});
	          	}
    		}
			/****/
			if(isValidDates){
				var urlTxt = 'View';
				var recLink = url.resolveRecord({recordType:'customrecordchargeback',recordId:internalId,isEditMode:false})
				var recURL = "<a href= "+recLink+" target=_blank>"+ urlTxt +"</a>";

				//Record URL
				objSubList.setSublistValue({
		  		        id: 'custpage_ar_rec_view',
		  		        line : rowNbr,
		  				value : recURL 
		  				});
				// Date
    	      if(transDate)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_trans_date',
    		        	line : rowNbr,
    					value : transDate 
    					});
    	   // Internal Id	
    	      /*if(internalId)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_internal_id',
    		        	line : rowNbr,
    					value : internalId 
    					});*/

			//BE Action			
		      if(BeAction)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_be_action',
    		        	line : rowNbr,
    					value : BeAction 
    					});
			//Amount BE Action 
		      if(amntBeActn)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amnt_be_action',
    		        	line : rowNbr,
    					value : amntBeActn 
    					});
			}else{
			
			/****/
    		//add data to sublist row
    		// month
    	      if(transMonth)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_month',
    		        	line : rowNbr,
    					value : transMonth 
    					});
    	   // Total Chargebacks	
    	      if(totalChargeBack)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_total_chargeback',
    		        	line : rowNbr,
    					value : totalChargeBack 
    					});

			//Pending BE Action			
		      if(pendingBeAction)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_pending_be_action',
    		        	line : rowNbr,
    					value : pendingBeAction 
    					});
			//Amount Pending BE Action 
		      if(amntPendingBeActn)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amnt_pending_be_action',
    		        	line : rowNbr,
    					value : amntPendingBeActn 
    					});
			//Pending Bank Response		
		      if(pendingBankResponse)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_pending_bank_response',
    		        	line : rowNbr,
    					value : pendingBankResponse 
    					});
			//Amount Pending Bank Response
		      if(amntPendingBankResponse)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amnt_pending_bank_response',
    		        	line : rowNbr,
    					value : amntPendingBankResponse 
    					});
			//BE Won					
		      if(BeWon)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_be_won',
    		        	line : rowNbr,
    					value : BeWon 
    					});
			//Amount BE Won 			
		      if(amntBeWon)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amnt_be_won',
    		        	line : rowNbr,
    					value : amntBeWon 
    					});
			//BE Lost			
		      if(beLost)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_be_lost',
    		        	line : rowNbr,
    					value : beLost 
    					});
			//Amount BE Lost		
		      if(amntBeLost)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amnt_be_lost',
    		        	line : rowNbr,
    					value : amntBeLost 
    					});
			//Accepted			
		      if(accepted)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_accepted',
    		        	line : rowNbr,
    					value : accepted 
    					});
			//Amount Accepted			
		      if(amntAccepted)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amnt_accepted',
    		        	line : rowNbr,
    					value : amntAccepted 
    					});
			//OM to Cancel Order		
		      if(omToCancelOrdr)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_om_cancel_order',
    		        	line : rowNbr,
    					value : omToCancelOrdr 
    					});
			//Amount OM to Cancel Order	
    	     if(amntOmToCancelOrdr)
    	    	  objSubList.setSublistValue({
    		        	id: 'custpage_amnt_om_cancel_order',
    		        	line : rowNbr,
    					value : amntOmToCancelOrdr
    					}); 
			}
            //totalAmtLastYrChargeBack += parseFloat(amtLastYrChargeBack) || 0;
    	    rowNbr++;
    		return true;
    		});
      //Assign values to the fields
      //var fldAmtYear = objForm.getField({id : 'custpage_ar_total_chargeback'});
     //var fldAmtLastYear = objForm.getField({id : 'custpage_ar_total_chargeback_last_yr'});
      //if(totalAmtChargeBack)
      	//fldAmtYear.defaultValue = totalAmtChargeBack;

    }

	//End of Add data to AR sub list

    return {
        onRequest: onRequest
    };

});
