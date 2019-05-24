/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * Developed By Satya Prakash (Zag Insight)
 */
define(['N/ui/serverWidget', 'N/search'],
/**
 * @param {serverWidget} serverWidget
 * @param {search} search
 */
function(serverWidget, search) {
	var SO_InternalIds= [];
	var PO_InternalIds= [];
	
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	var request = context.request; // added 1109
        var custForm = serverWidget.createForm({title:'Vendor Box Inventory Stickers Queue',hideNavBar:false});

        custForm.clientScriptModulePath = 'SuiteScripts/print_zpl_label_cl_v2.js';
       
        // added 1109
        var paraMachine = request.parameters.machine;
        var paraRTPdate = request.parameters.inputRTPdate;
        var paraNRTPdate = request.parameters.inputNRTPdate;
        
        CreateSubListRTP(custForm, paraMachine, paraRTPdate);
        CreateSubListNRTP(custForm, paraMachine, paraNRTPdate);
              
        context.response.writePage(custForm);
    }
    

    function CreateSubListRTP(custForm, paraMachine, userDate){
    	var tabReadyToPull = custForm.addTab({
        	id: 'custpage_tab_ready_to_pull',
        	label: 'Ready to Pull'
        		});
    	//log.audit('userDate RTP:', userDate);
        var totalSelected_rp = custForm.addField({id:'custpage_total_select_rp',type:'text', label: 'Total Selected', container: 'custpage_tab_ready_to_pull'});
        totalSelected_rp.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN});
        
        var date_rp= custForm.addField({id:'custpage_date_rp',type:serverWidget.FieldType.DATE, label: 'Select Date', container: 'custpage_tab_ready_to_pull'});
        
        var count_rp = custForm.addField({id:'custpage_count_rp',type:'text', label: 'Total PO Count: ', container: 'custpage_tab_ready_to_pull'}).updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE});
        //count_rp.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE});
               
        var subListReadyToPullId = 'custpage_list_ready_to_pull';
        var sublistReadyToPull = custForm.addSublist({
          id: subListReadyToPullId,
          label:'Ready to Pull',
          type: serverWidget.SublistType.LIST,
          tab: 'custpage_tab_ready_to_pull'
        });	
        
        //Ready to Pull
        addFieldToSubList(sublistReadyToPull, subListReadyToPullId);

      //Fetch and assign values to sublists
        if(!paraMachine || paraMachine == 'custpage_list_ready_to_pull')
        	getDataFromSearch(custForm, subListReadyToPullId, userDate);
   
    }
    function CreateSubListNRTP(custForm, paraMachine, userDate){
    	   
    	  var tabNotReadyToPull = custForm.addTab({
          	id: 'custpage_tab_not_ready_to_pull',
          	label: 'Not Ready to Pull'
          		});
    	  //log.audit('userDate NRTP:', userDate);
          var totalSelected_nrp = custForm.addField({id:'custpage_total_select_nrp',type:'text', label: 'Total Selected', container: 'custpage_tab_not_ready_to_pull'});
          totalSelected_nrp.updateDisplayType({
              displayType: serverWidget.FieldDisplayType.HIDDEN});

          var date_nrp= custForm.addField({id:'custpage_date_nrp',type:serverWidget.FieldType.DATE, label: 'Select Date', container: 'custpage_tab_not_ready_to_pull'}); 
          
          var count_nrp = custForm.addField({id:'custpage_count_nrp',type:'text', label: 'Total PO Count: ', container: 'custpage_tab_not_ready_to_pull'});
          count_nrp.updateDisplayType({
              displayType: serverWidget.FieldDisplayType.INLINE});
          
          var subListNotReadyToPullId = 'custpage_list_not_ready_to_pull';
          var sublistNotReadyToPull = custForm.addSublist({
              id: subListNotReadyToPullId,
              label:'Not Ready to Pull',
              type: serverWidget.SublistType.LIST,
              tab: 'custpage_tab_not_ready_to_pull'
            });
          
          // Not Ready to Pull
          addFieldToSubList(sublistNotReadyToPull, subListNotReadyToPullId); 

          //Fetch and assign values to sublists
          if(!paraMachine || paraMachine == 'custpage_list_not_ready_to_pull')
        	  getDataFromSearch(custForm, subListNotReadyToPullId, userDate);
    }
    
    function addFieldToSubList(subList, subListId){

    	subList.addButton({id:'custpage_btn_print', label: 'Print',functionName: "createZplLabel()"});
        subList.addMarkAllButtons();

        /*Print*/
       	var fldSubListPrint = subList.addField({
        	id: 'custpage_print',
        	type: serverWidget.FieldType.CHECKBOX,
        	label:'Print', 
        	});
      fldSubListPrint.updateDisplayType({displayType : serverWidget.FieldDisplayType.ENTRY});
        /*Internal Id*/
      var fldSubListInternalId = subList.addField({
      	id: 'custpage_internalid',
      	type: serverWidget.FieldType.TEXT,
          label:'Internal Id'
      	});
      fldSubListInternalId.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	/* 	Vendor */
       	var fldSubListVendor = subList.addField({
        	id: 'custpage_vendor',
        	type: serverWidget.FieldType.TEXT,
            label:'Vendor'
        	});
       	fldSubListVendor.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
       	/* 	PO # */
       	var fldSubListPO = subList.addField({
        	id: 'custpage_po',
            type: serverWidget.FieldType.TEXT,
        	label:'PO #'
        	});
       	fldSubListPO.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
       	
       	/* 	PO Doc Number */
       	var fldSubListPODoc = subList.addField({
        	id: 'custpage_po_doc_nbr',
            type: serverWidget.FieldType.TEXT,
        	label:'PO Doc Number'
        	});
       	fldSubListPODoc.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	/* 	Sales Order */
       	var fldSubListSO = subList.addField({
        	id: 'custpage_so',
        	type: serverWidget.FieldType.SELECT,
           	label:'Sales Order', 
        	source: 'salesorder'
        	});
       	fldSubListSO.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
       	
       	/* 	Sales Order Doc Number*/
       	var fldSubListSODoc = subList.addField({
        	id: 'custpage_so_doc_nbr',
        	type: serverWidget.FieldType.TEXT,
        	label:'Sales Order Doc Nbr'
        	});
       	fldSubListSODoc.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	/* 	Item */
       	var fldSubListItem = subList.addField({
		        	id: 'custpage_item',
		        	type: serverWidget.FieldType.SELECT,
		        	label:'Item', 
		        	source: 'Item'
		        	});
        fldSubListItem.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
         /* Item Text */
       	var fldSubListItemTxt = subList.addField({
		        	id: 'custpage_item_txt',
		        	type: serverWidget.FieldType.TEXT,
		        	label:'Item Text'
		        	});
       	fldSubListItemTxt.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
     	/* 	Item to be Updated */
       	var fldSubListItemUpd = subList.addField({
		        	id: 'custpage_item_upd',
		        	type: serverWidget.FieldType.TEXT,
		        	label:'Item to be Updated'
		        	});
       	fldSubListItemUpd.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	
    	/* 	Description */
       	var fldSubListDescr = subList.addField({
		        	id: 'custpage_descr',
		        	type: serverWidget.FieldType.TEXTAREA,
		        	label:'Description'
		        	});
    	/* 	Notes */
       	var fldSubListNotes = subList.addField({
		        	id: 'custpage_notes',
		        	type: serverWidget.FieldType.TEXTAREA,
		        	label:'Notes'
		        	});
        /* 	Qty to Pull */
       	var fldSubListQtyPull = subList.addField({
		        	id: 'custpage_qty_pull',
		        	type: serverWidget.FieldType.FLOAT,
		        	label:'Qty to Pull'
		        	});
		/*	On Hand   */
       	var fldSubListQtyHand = subList.addField({
		        	id: 'custpage_qty_on_hand',
		        	type: serverWidget.FieldType.FLOAT,
		        	label:'On Hand'
		        	});
		/*	On Order   */
       	var fldSubListQtyOrder = subList.addField({
		        	id: 'custpage_qty_on_order',
		        	type: serverWidget.FieldType.FLOAT,
		        	label:'On Order'
		        	});
		/*	Date Sent from SF */
       	var fldSubListDateSent = subList.addField({
		        	id: 'custpage_date_sent',
		        	type: serverWidget.FieldType.DATE,
		        	label:'Date Sent from SF'
		        	});
		/*	VBD Status  */
       	var fldSubListVbdStatus = subList.addField({
		        	id: 'custpage_vbd_status',
		        	type: serverWidget.FieldType.SELECT,
		        	label:'VBD Status', 
		        	source: 'customlist_vbd_status'
		        	});
       	fldSubListVbdStatus.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
		/*	Category  */ 
       	var fldSubListVbdCategory = subList.addField({
		        	id: 'custpage_category',
		        	type: serverWidget.FieldType.SELECT,
		        	label:'Category', 
		        	source: 'customlist13'
		        	});
       	fldSubListVbdCategory.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
		/*	Diamond ETA  */
       	var fldSubListDiamondEta = subList.addField({
		        	id: 'custpage_diamond_eta',
		        	type: serverWidget.FieldType.DATE,
		        	label:'Diamond ETA'
		        	});
		/*	Specific Gem  */
       	var fldSubListSpecificGem = subList.addField({
		        	id: 'custpage_specific_gem',
		        	type: serverWidget.FieldType.SELECT,
		        	label:'Specific Gem', 
		        	source: 'customlist337'
		        	});
       	fldSubListSpecificGem.updateDisplayType({displayType : serverWidget.FieldDisplayType.INLINE});
       	/*	Last Name    */
       	var fldSubListLastName = subList.addField({
		        	id: 'custpage_last_name',
		        	type: serverWidget.FieldType.TEXT,
		        	label:'Last Name'
		        	});
       	fldSubListLastName.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	/*	Insurance    */
       	var fldSubListInsurance = subList.addField({
		        	id: 'custpage_insurance',
		        	type: serverWidget.FieldType.FLOAT,
		        	label:'Insurance'
		        	});
       	fldSubListInsurance.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	
       	/*	Certificate  */
       	var fldSubListCertificate = subList.addField({
		        	id: 'custpage_certificate',
		        	type: serverWidget.FieldType.TEXT,
		        	label:'Certificate'
		        	});
       fldSubListCertificate.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	
       	/*	Origin    */
       	var fldSubListOrigin = subList.addField({
		        	id: 'custpage_origin',
		        	type: serverWidget.FieldType.TEXT,
		        	label:'Origin'
		        	});
       	fldSubListOrigin.updateDisplayType({displayType : serverWidget.FieldDisplayType.HIDDEN});
       	
		/*	Hold Binder    */
       	var fldSubListHoldBinder = subList.addField({
		        	id: 'custpage_hold_binder',
		        	type: serverWidget.FieldType.CHECKBOX,
		        	label:'Hold Binder', 
		        	});
      fldSubListHoldBinder.updateDisplayType({displayType : serverWidget.FieldDisplayType.DISABLED});
    }
    
    //Newer version of the code
    function getDataFromSearch(custForm, subListId, userDate){ // added : 1109

    	//Fetch data for Ready to pull Tab
    	var sublistReadyToPull = custForm.getSublist({id : 'custpage_list_ready_to_pull'});
    	var sublistNotReadyToPull = custForm.getSublist({id : 'custpage_list_not_ready_to_pull'});
    	var lineNbr1 = 0;
    	var lineNbr2 = 0;
    	var objPOs = {};
    	
    	if(userDate){
			var todayDate = userDate;
		}else{
    		var curdate = new Date();
    		var day = curdate.getDate();
    		var month = curdate.getMonth() + 1; // jan = 0
    		var year = curdate.getFullYear();
    		var todayDate = month + '/' + day + '/' + year;
		} // added : 1109
    	
    	//Fetch all PO and SO Ids to an array
    	 getPoAndSoIds(todayDate); // added : 1109
    	/*Search for POs*/
    	if(PO_InternalIds.length > 0){
           	var purchaseorderSearchObj = search.create({
	    		   type: "purchaseorder",
	    		   filters:
	    		   [
	    		      ["type","anyof","PurchOrd"], 
	    		      "AND", 
	    		      ["internalid","anyof",PO_InternalIds]
	    		   ],
	    		   columns:
	    		   [
	    		      search.createColumn({name: "mainline", label: "Main Line"}),
	    		      search.createColumn({name: "internalid", label: "Internal Id"}),
	    		      search.createColumn({name: "mainname", label: "Vendor Name"}),
	    		      // search.createColumn({name: "entityid",join: "vendor",label: "Vendor Name"}),
	    		      search.createColumn({name: "tranid", label: "Document Number"}),
	    		      search.createColumn({name: "transactionname", label: "Transaction Name"}),
	    		      search.createColumn({name: "createdfrom", label: "Sales Order"}),
	    		      search.createColumn({name: "tranid",join: "createdFrom",label: "Document Number"}),
	    		      search.createColumn({name: "item", label: "Item"}),
	    		      search.createColumn({name: "memo", label: "Memo"}),
	    		      search.createColumn({name: "custcolitem_link", label: "Item Link"}),
	    		      search.createColumn({name: "custcol_full_insurance_value", label: "Insurance"}),
	    		      search.createColumn({name: "custcol_vbd_status", label: "Vendor Box Dashboard Status"}),
	    		      search.createColumn({name: "quantityuom", label: "Quantity in Transaction Units"}),
	    		      search.createColumn({name: "custcol18", label: "Date Sent from SF"}),
	    		      search.createColumn({name: "custcol5", label: "Comments"}),
	    		      search.createColumn({name: "salesdescription", join: "item", label: "Description"}),
	    		      search.createColumn({name: "quantityonhand", join: "item",label: "On Hand"}),
	    		      search.createColumn({name: "quantityonorder",join: "item",label: "On Order"}),
	    		      search.createColumn({name: "custitem18",join: "item",label: "Origin"}),
	    		      search.createColumn({name: "custitem46",join: "item",label: "Certificate"}),
	    		      search.createColumn({name: "custitem20",join: "item",label: "Category"}),
	    		      search.createColumn({name: "custitem_zpl_description",join: "item",label: "ZPL Description"}),
	    		      search.createColumn({name: "custbody146",join: "createdFrom",label: "Diamond ETA"}),
	    		      search.createColumn({name: "custbody244",join: "createdFrom",label: "Specific Gem"}),
	    		      search.createColumn({name: "lastname",join: "customer",label: "Last Name"}),
	    		      search.createColumn({name: "quantityonhand",join: "CUSTCOLITEM_LINK",label: "On Hand"}),
	    		      search.createColumn({name: "custitem46",join: "CUSTCOLITEM_LINK",label: "Certificate Number"}),
	    		      search.createColumn({name: "quantityonorder",join: "CUSTCOLITEM_LINK",label: "On Order"}),
	    		      search.createColumn({name: "custitem_zpl_description",join: "CUSTCOLITEM_LINK",label: "ZPL Description"}),
	    		      search.createColumn({name: "custitem20",join: "CUSTCOLITEM_LINK",label: "Category"}),
	    		      search.createColumn({name: "custitem18",join: "CUSTCOLITEM_LINK",label: "Item Link Origin"})
	    		   ]
	    		});

          var searchResultCount = purchaseorderSearchObj.runPaged().count; // 1109
		  //log.debug("Inside IF purchase order Search Obj result count",searchResultCount); //1109
          
	    		purchaseorderSearchObj.run().each(function(result){
	    		   // .run().each has a limit of 4,000 results
	    			var poId = result.getValue({name: 'internalid'});
	    			var mainLine = result.getValue({name: "mainline"});
	    			var salesOrderId = result.getValue({name: "createdfrom"});
	    	    	var objLineItem = {};
	    	    	if(Object.keys(objPOs).indexOf(poId) == -1){
	    	    		objPOs[poId] = [];
	    	    	}
	    	    	if(mainLine == '*'){
	    	    		// Pushing SO Internal Ids to an array
	         			if(salesOrderId){
	        	 			var soIntrIdFound = SO_InternalIds.indexOf(salesOrderId);
	        	  			if(soIntrIdFound < 0)
	        	  				SO_InternalIds.push(salesOrderId);
	         			}
	    	    	}else{
		    	    	var itemArray = objPOs[poId];
		    	    	
		    	    	objLineItem['internalid'] = result.getValue({name: "internalid"});
		    	    	//objLineItem['vendorName'] = result.getValue({name: "entityid",join: "vendor"});
		    	    	objLineItem['vendorName'] = result.getText({name: "mainname", label: "Vendor Name"});
		    	    	objLineItem['tranid'] = result.getValue({name: "tranid", label: "Document Number"});
		    	    	objLineItem['transactionname'] = result.getValue({name: "transactionname", label: "Transaction Name"});
		    	    	objLineItem['createdfrom'] = result.getValue({name: "createdfrom", label: "Sales Order"});
		    	    	objLineItem['soTranid'] = result.getValue({name: "tranid",join: "createdFrom",label: "Document Number"});
		    	    	objLineItem['item'] = 		result.getValue({name: "item", label: "Item"});
		    	    	objLineItem['itemText'] = 	result.getText({name: "item", label: "Item"});
		    	    	objLineItem['memo'] = 		result.getValue({name: "memo", label: "Memo"});
		    	    	objLineItem['itemLink'] = result.getValue({name: "custcolitem_link", label: "Item Link"});
	                    objLineItem['itemLinkText'] = result.getText({name: "custcolitem_link", label: "Item Link"});
		    	    	objLineItem['insurance'] = result.getValue({name: "custcol_full_insurance_value", label: "Insurance"});
		    	    	objLineItem['dashboardStatus'] = result.getValue({name: "custcol_vbd_status", label: "Vendor Box Dashboard Status"});
		    	    	objLineItem['dashboardStatusText'] = result.getText({name: "custcol_vbd_status", label: "Vendor Box Dashboard Status"});
		    	    	objLineItem['quantityuom'] = result.getValue({name: "quantityuom", label: "Quantity in Transaction Units"});
		    	    	objLineItem['dtSentSF'] = result.getValue({name: "custcol18", label: "Date Sent from SF"});
		    	    	objLineItem['notes'] = result.getValue({name: "custcol5", label: "Comments"});
		    	    	objLineItem['itemDescr'] = result.getValue({name: "salesdescription", join: "item", label: "Description"});
		    	    	objLineItem['itemQtyOnHand'] = result.getValue({name: "quantityonhand", join: "item",label: "On Hand"});
		    	    	objLineItem['itemQtyOnOrder'] = result.getValue({name: "quantityonorder",join: "item",label: "On Order"});
		    	    	//objLineItem['itemOrigin'] = result.getValue({name: "custitem18",join: "item",label: "Origin"});
		    	    	objLineItem['itemOrigin'] = result.getText({name: "custitem18",join: "item",label: "Origin"});
		    	    	objLineItem['itemCertificate'] = result.getValue({name: "custitem46",join: "item",label: "Certificate"});
		    	    	objLineItem['itemCategory'] = result.getValue({name: "custitem20",join: "item",label: "Category"});
		    	    	objLineItem['itemZplDescr'] = result.getValue({name: "custitem_zpl_description",join: "item",label: "ZPL Description"});
		    	    	objLineItem['soDiamondEta'] = result.getValue({name: "custbody146",join: "createdFrom",label: "Diamond ETA"});
		    	    	objLineItem['soSpecificGem'] = result.getValue({name: "custbody244",join: "createdFrom",label: "Specific Gem"});
		    	    	objLineItem['custLastName'] = result.getValue({name: "lastname",join: "customer",label: "Last Name"});
		    	    	objLineItem['itemLinkQtyOnHand'] = result.getValue({name: "quantityonhand",join: "CUSTCOLITEM_LINK"});
		    	    	objLineItem['itemLinkCertNumber'] = result.getValue({name: "custitem46",join: "CUSTCOLITEM_LINK"});
		    	    	objLineItem['itemLinkQtyOnOrder'] = result.getValue({name: "quantityonorder",join: "CUSTCOLITEM_LINK"});
		    	    	objLineItem['itemLinkZplDescr'] = result.getValue({name: "custitem_zpl_description",join: "CUSTCOLITEM_LINK"});
		    	    	objLineItem['itemLinkCategory'] = result.getValue({name: "custitem20",join: "CUSTCOLITEM_LINK"});
		    	    	//objLineItem['itemLinkOrigin'] = result.getValue({name: "custitem18",join: "CUSTCOLITEM_LINK"});
		    	    	objLineItem['itemLinkOrigin'] = result.getText({name: "custitem18",join: "CUSTCOLITEM_LINK"});
		    	    	
		    	    	itemArray.push(objLineItem);
		    	    	
		    	    	objPOs[poId] = itemArray;
		                //count++;
	    	    	}
	    		   return true;
	    		});
    		}
    		//log.audit('SO_InternalIds Length : ', SO_InternalIds.length);
    		var soResultSet = parseSoResults();
    		
    	// Loop through the POs	
    		//log.audit('PO_InternalIds.length b4 loop : ',PO_InternalIds.length);
    		for(var poCntr = 0; poCntr < PO_InternalIds.length; poCntr++){
    			var poIntId = PO_InternalIds[poCntr];
    			//fetch the individual PO
    			var poObj = objPOs[poIntId];
    			//var itemCntr = 0;
    			//var itemCntn = 0;
    			var rtp = false;
    			var AllRtp = true;
    			var AllNotRtp = true;
    			var nrtp = false;
    			var rtpItems = []; 
    			var nrtpItems = [];
    			var noTab = true;
  				/*Start: 09-20-18: Added new criteria */
				//Not on either Tabs
    			for(var cntr = 0; cntr <poObj.length; cntr++){
      				//fetch each Line item of a PO
    				var lineItem = poObj[cntr];
    	            //var itemLinkText = lineItem['itemLinkText'];
    	            var itemLinkCategory = lineItem['itemLinkCategory']
                    //var vdbStatus = lineItem['dashboardStatus'];
                    //Ring with no large center stone(id: 3) 
    	            if(itemLinkCategory != '3')
    	            	noTab = false;
                    
    			}
    			if(noTab){
    				log.audit('No Tab','PO IntId : ' + poIntId);
    			}else{
				/*End: 09-20-18: Added new criteria */
    				if(subListId == 'custpage_list_ready_to_pull'){ // added : 1109
    					//log.audit('inside subListId : ',subListId + ' : todayDate : ' + todayDate + ': poObj.length : ' + poObj.length);
		    			//Ready to Pull Tab
		    			for(var itemCntr = 0; itemCntr <poObj.length; itemCntr++){
		      				//fetch each Line item of a PO
		    				var lineItem = poObj[itemCntr];
		
		    				//var itemNm = 0;
		    				var dtSentSF = lineItem['dtSentSF'];
		    				//log.audit('dtSentSF ',dtSentSF);
		    				var itemLinkQtyHand = parseInt(lineItem['itemLinkQtyOnHand']);
		    				var itemLink = lineItem['itemLink'];
		                    var itemLinkText = lineItem['itemLinkText'];
		    				var item = lineItem['item'];
		    				var itemText = lineItem['itemText'];
		    				var vdbStatus = lineItem['dashboardStatus'];
		    				var vdbStatusText = lineItem['dashboardStatusText'];
		                    if (isNaN(itemLinkQtyHand))
		                    	itemLinkQtyHand = 0;
		    				//check the criteria for Ready to Pull Tab

		    				if((dtSentSF == todayDate) && (vdbStatus == '1')){
		    					
		    					if((itemLinkQtyHand > 0 || itemLink == '') && (itemLink != '' || itemText == 'Transfer')){
			    					rtp = true;
			    					rtpItems.push(lineItem);
		    					}else{
			    					AllRtp = false;
			    				}
		    				}
			   			}
		    			// if all Line items meets the criteria of Ready to Pull
		    			if(AllRtp && rtp){
		    				if(rtpItems.length > 0){
		    					for(var i = 0; i <rtpItems.length; i++){ //commented 0916
		            				//fetch Line items
		            				var lineItem = rtpItems[i];
		            				addDataToSubList(sublistReadyToPull, lineItem, lineNbr1, soResultSet);
		                 			lineNbr1 ++;
		                 		}
		    				}
		    			}
	    			} // added : 1109
	    			//End of Ready to Pull Tab
    			
	    			//Not Ready to Pull Tab
	    			if(subListId == 'custpage_list_not_ready_to_pull'){ // added : 1109
		    			for(var itemCntn = 0; itemCntn <poObj.length; itemCntn++){
		    				//fetch Line items
		    				var lineItem = poObj[itemCntn];
		    				
		    				var dtSentSF = lineItem['dtSentSF'];
		    				var itemLinkQtyHand = parseInt(lineItem['itemLinkQtyOnHand']);
		    				var itemLink = lineItem['itemLink'];
		                    var itemLinkText = lineItem['itemLinkText'];
		    				var item = lineItem['item'];
		    				var itemText = lineItem['itemText'];
		    				var vdbStatus = lineItem['dashboardStatus'];
		    				var vdbStatusText = lineItem['dashboardStatusText'];
		                  	if (isNaN(itemLinkQtyHand))
		                    	itemLinkQtyHand = 0;
		
		                  	if((itemText == 'Transfer') && (itemLink == ''))
		                  		itemLinkQtyHand = 1;
			
		                    if((dtSentSF == todayDate) && (vdbStatus == '1')){
		                    	nrtpItems.push(lineItem);
		                	  if((itemLinkQtyHand <= 0) && ((itemLink) || (itemText == 'Transfer'))){
		    					nrtp = true;
			    				}
		                  	}
		    			}
		    			// if any of the line item meets the criteria of Not Ready to Pull - 0918
		    			if(nrtp){
		    				if(nrtpItems.length > 0){
		    					for(var j = 0; j <nrtpItems.length; j++){ 
		            				//fetch Line items
		            				var lineItem = nrtpItems[j];
		            				addDataToSubList(sublistNotReadyToPull, lineItem, lineNbr2, soResultSet);
		  	           			    lineNbr2 ++;
		                 		}
		    				}
		    			}
	    			} // added : 1109
    			// end of loop to fetch Line items
   				//End of Not Ready to Pull Tab
    		} // added 0920 
    	}
    }
  
    //function to get Holding Binder from SO
    function parseSoResults() {
    	
    	var resultSet = {};
    	var vistedTransactions = [];
    	if(SO_InternalIds.length > 0){ 
	    	var SoSearchObj = search.create({
	 		   type: "salesorder",
	 		   filters:
	 		   [
	 		      ["type","anyof","SalesOrd"], 
	 		      "AND", 
	 		      ["mainline","is","F"],
	 		      "AND",
	 		      ["internalid","anyof",SO_InternalIds]
	 		   ],
	 		   columns:
	 		   [
	 		      search.createColumn({name: "internalid", label: "Internal ID", sort: search.Sort.DESC}),
	 		      search.createColumn({name: "transactionname", label: "Transaction Name"}),
	 	          search.createColumn({name: "item", label: "Item"}),
	 		      search.createColumn({name: "custcol_diamond_in_hold_binder", label: "Diamond in hold binder"})
	 		   ]
	 		});
	    	
	    	SoSearchObj.run().each(function(result){
	     		var transaction = result.getValue({name: 'internalid'});
	    		var item = result.getValue({name: 'item'});
	    		var binder= result.getValue({name: 'custcol_diamond_in_hold_binder'});
	    		if(vistedTransactions.indexOf(transaction) == -1) {
	    			resultSet[transaction] = {};
	    			vistedTransactions.push(transaction);
	    		}
	    		var transaObj = resultSet[transaction];
	    		transaObj[item] = binder;
	    		resultSet[transaction] = transaObj;
	    		   return true;
	    		});
    	}
        //var SOKey = Object.keys(resultSet);
        //log.debug('ALL SOKey', 'SOKey length: ' + SOKey.length);
        
    	return resultSet;
    }
  //End of function to get Holding Binder from SO
    
    // Function to Add data to Sublists
    function addDataToSubList(subList, objLineItem, lineNbr, SO_ResultSet){

    	var internalId = objLineItem['internalid'];
		var po_DocNbr = objLineItem['tranid'];
  		var poNum = objLineItem['transactionname'];
		var salesOrder = objLineItem['createdfrom'];
		var item = objLineItem['item'];
  		var itemTxt = objLineItem['itemText'];
		var memo = objLineItem['memo'];
		var itemLink = objLineItem['itemLink'];
		var itemLinkTxt = objLineItem['itemLinkText'];
		var insurance = objLineItem['insurance'];
		var vbdStatus = objLineItem['dashboardStatus'];
		//var vbdStatus = objLineItem['dashboardStatusText'];
		var qtyToPull = objLineItem['quantityuom'];
		var dtSentFrmSF = objLineItem['dtSentSF'];
		var notes = objLineItem['notes'];
		var qtyOnHand = objLineItem['itemQtyOnHand'];
		var qtyOnOrder = objLineItem['itemQtyOnOrder'];
		var origin = objLineItem['itemOrigin'];
		var certificate = objLineItem['itemCertificate'];
		var certItemLink = objLineItem['itemLinkCertNumber'];
		var category = objLineItem['itemCategory'];
		var zplDescr = objLineItem['itemZplDescr'];
		var SoDocNbr = objLineItem['soTranid'];
		var diamondtETA = objLineItem['soDiamondEta'];
		var specificGem = objLineItem['soSpecificGem'];
		var lastName = objLineItem['custLastName'];
		var vendorName = objLineItem['vendorName'];
		var qtyOnOrderItemLink = objLineItem['itemLinkQtyOnOrder'];
		var qtyOnHandItemLink = objLineItem['itemLinkQtyOnHand'];
		var zplDescrItemLink = objLineItem['itemLinkZplDescr'];
		var categoryItemLink = objLineItem['itemLinkCategory'];
		var originItemLink = objLineItem['itemLinkOrigin']; 
      		var holdBinder = false;
      		if(salesOrder && itemLink && SO_ResultSet){
				holdBinder = findHoldBinder(SO_ResultSet,salesOrder,itemLink );
				}
			/* 	internalId */
		if(internalId)
			subList.setSublistValue({
	        	id: 'custpage_internalid',
	        	line : lineNbr,
				value : internalId
				});
			/* 	Vendor */
      if(vendorName)
	       	subList.setSublistValue({
	        	id: 'custpage_vendor',
	        	line : lineNbr,
				value : vendorName
				});
	       	/* 	PO # */
      if(poNum)
	       	subList.setSublistValue({
	        	id: 'custpage_po',
	        	line : lineNbr,
				value : poNum 
				});
  		/* 	PO Doc Number */
      if(po_DocNbr)
	       	subList.setSublistValue({
	        	id: 'custpage_po_doc_nbr',
	        	line : lineNbr,
				value : po_DocNbr 
				});
      
	       	/* 	Sales Order */
      if(salesOrder)
	       	subList.setSublistValue({
	        	id: 'custpage_so',
	        	line : lineNbr,
				value : salesOrder
				});
      /* 	Sales Order Document Number*/
      if(SoDocNbr)
    		subList.setSublistValue({
	        	id: 'custpage_so_doc_nbr',
	        	line : lineNbr,
				value : SoDocNbr
				});
	       	/* 	Item */
      var itemDisp = '';
      if(itemLink)
    	itemDisp =  itemLink; 
      else
    	  itemDisp =  item;
      if(itemDisp)
	        subList.setSublistValue({
			    id: 'custpage_item',
			    line : lineNbr,
				value : itemDisp
				});
       	/* 	Item Text*/
      var itemTxtDisp = '';
      if(itemLink)
      	itemTxtDisp =  itemLinkTxt; 
        else
        	itemTxtDisp =  itemTxt;
      
      if(itemTxtDisp)
	        subList.setSublistValue({
			    id: 'custpage_item_txt',
			    line : lineNbr,
				value : itemTxtDisp
				});
      /* Item to be updated*/
      if(item)
	        subList.setSublistValue({
			    id: 'custpage_item_upd',
			    line : lineNbr,
				value : item
				});
      
	    	/* 	Description */
      var descrDisp = '';
      if(itemLink){
    	  descrDisp = zplDescrItemLink;}
      else if(itemTxt = 'Transfer'){
    	  descrDisp = memo;}
      else{descrDisp = zplDescr;}
      
      if(descrDisp)
	       	subList.setSublistValue({
			    id: 'custpage_descr',
			    line : lineNbr,
				value : descrDisp
				});
	    	/* 	Notes */
      if(notes)
	       	subList.setSublistValue({
			    id: 'custpage_notes',
			    line : lineNbr,
				value : notes
				});
	  /* 	Qty to Pull */
      if(qtyToPull)
	       	subList.setSublistValue({
			    id: 'custpage_qty_pull',
			    line : lineNbr,
				value : qtyToPull
				});
			/*	On Hand   */
      var qtyOnHandDisp = '';
      if(itemLink)
    	  qtyOnHandDisp =  qtyOnHandItemLink; 
        else
          qtyOnHandDisp =  qtyOnHand;
      
      if(qtyOnHandDisp)
	       	subList.setSublistValue({
			    id: 'custpage_qty_on_hand',
			    line : lineNbr,
				value : qtyOnHandDisp
				});
	  /*	On Order   */
      var qtyOnOrderDisp = '';
      if(itemLink)
    	  qtyOnOrderDisp =  qtyOnOrderItemLink; 
        else
        	qtyOnOrderDisp =  qtyOnOrder;
      
      if(qtyOnOrderDisp)
	       	subList.setSublistValue({
			    id: 'custpage_qty_on_order',
			    line : lineNbr,
				value : qtyOnOrderDisp
				});
	  /*	Date Sent from SF */
      if(dtSentFrmSF)
	       	subList.setSublistValue({
			    id: 'custpage_date_sent',
			    line : lineNbr,
				value : dtSentFrmSF
				});
		/*	VBD Status  */
      if(vbdStatus)
	       	subList.setSublistValue({
			    id: 'custpage_vbd_status',
			    line : lineNbr,
				value : vbdStatus
				});
	   	/*	Category  */ 
      var categoryDisp = '';
      if(itemLink)
    	  categoryDisp =  categoryItemLink; 
        else
        	categoryDisp =  category;
      if(categoryDisp)
	       	subList.setSublistValue({
			    id: 'custpage_category',
			    line : lineNbr,
				value : categoryDisp
				});
		/*	Diamond ETA  */
      if(diamondtETA)
	       	subList.setSublistValue({
			    id: 'custpage_diamond_eta',
			    line : lineNbr,
				value : diamondtETA
				});
		/*	Specific Gem  */
      if(specificGem)
	       	subList.setSublistValue({
			    id: 'custpage_specific_gem',
			    line : lineNbr,
				value : specificGem
				});
	       	/*	Last Name    */
      if(lastName)
			subList.setSublistValue({
			    id: 'custpage_last_name',
			    line : lineNbr,
				value : lastName
				});
	       	/*	Insurance    */
      if(insurance)
	       	subList.setSublistValue({
			    id: 'custpage_insurance',
			    line : lineNbr,
				value : insurance
				});
	       	/*	Certificate  */
      var certDisp = '';
      if(itemLink)
    	  certDisp =  certItemLink; 
      else
    	  certDisp =  certificate;
      
      if(certDisp)
	       	subList.setSublistValue({
			    id: 'custpage_certificate',
			    line : lineNbr,
				value : certDisp
				});
      
	  	/*	Origin    */
      var originDisp = '';
      if(itemLink)
    	  originDisp =  originItemLink; 
      else
    	  originDisp =  origin;
      
      if(originDisp)
	       	subList.setSublistValue({
			    id: 'custpage_origin',
			    line : lineNbr,
				value : originDisp
				});
      
			/*	Hold Binder    */
      if(holdBinder)
	       	subList.setSublistValue({
			    id: 'custpage_hold_binder',
			    line : lineNbr,
				value : 'T'
				});
    }

 
    /*Function to fetch Holder Binder from SO*/
    function findHoldBinder(SO_ResultSet,salesOrderOnPO,itemLinkOnPO ){
      var SOKey = Object.keys(SO_ResultSet);
      
      if(SOKey.indexOf(salesOrderOnPO) >= 0)
       	return SO_ResultSet[salesOrderOnPO][itemLinkOnPO];
      else
    	 return '';
    } 
    /*End of Function to fetch Holder Binder from SO*/
    
    /*Function to fetch PO ids and SO ids*/
    function getPoAndSoIds(userDate){ // added : 1109
    	//log.audit('userDate inside getPO: ',userDate);
    	var PoAndSoSearchObj = search.create({
    		   type: "purchaseorder",
    		   filters:
    		   [
    		      ["type","anyof","PurchOrd"], 
    		      "AND", 
    		      //["custcol18","on","today"], //commented : 1109
    		      ["custcol18","on",userDate], // added : 1109
    		      "AND", 
    		      ["custcol_vbd_status","anyof","1"], 
    		      "AND", 
    		      ["custbody14","doesnotcontain","unset"]
    		   ],
    		   columns:
    		   [
    		      search.createColumn({name: "internalid",
    		         summary: search.Summary.GROUP, sort: search.Sort.DESC, label: "Internal ID"})
    		   ]
    		});
      
    		PoAndSoSearchObj.run().each(function(result){

    			var purchaseOrderId = result.getValue({name: "internalid", summary: search.Summary.GROUP});
     			// Pushing PO Internal Ids to an array
     			if(purchaseOrderId){
    	 			var poIntrIdFound = PO_InternalIds.indexOf(purchaseOrderId);
    	  			if(poIntrIdFound < 0)
    	  				PO_InternalIds.push(purchaseOrderId);
     			}
    		   return true;
    		});
      //log.debug("PO_InternalIds Length : ",PO_InternalIds.length);
    }
    /*End of Function to fetch PO ids and SO ids*/
    
    return {
        onRequest: onRequest
    };
});
