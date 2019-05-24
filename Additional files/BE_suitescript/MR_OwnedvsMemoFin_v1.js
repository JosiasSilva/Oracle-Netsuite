/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/format'],
/**
 * @param {record} record
 * @param {search} search
 * @param {format} format
 */
function(record, search, format) {

    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
    function getInputData() {

    	return search.load({
			id:'customsearch_upd_owned_memo_flds'
    		//id:'customsearch_upd_owned_memo_flds_4'
    	});

    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {

          var searchResults = JSON.parse(context.value);
          //log.debug("Search Results",searchResults.values);

          var searchValues = searchResults.values;
		  
		  //var itemId = searchValues.internalid.value;
          var itemId = searchResults.id;
		  //log.debug("Search Item",itemId);
		  var itemName = '';
		  var bill_date, bill_status, max_bill_date;
		  var order_date, order_status, max_order_date;
		  var bill_credit_date = null;
		  var ra_date = null;
		  var ra_created_from = null;
		  var ownedReason = null;
			
		  var billed = false;
		  var sold = false;
		  var owned = false;
		  		  
		  var resultsObj = search.create({
		   type: "transaction",
		   filters:
		   [
			  ["type","anyof","RtnAuth","SalesOrd","VendBill","VendCred"],"AND",
			  ["item","is",itemId], 
			  "AND", 
			  ["mainline","is","F"], 
			  "AND", 
			  ["status","noneof",["SalesOrd:C","SalesOrd:H"]]
		   ],
		   columns:
		   [
			  search.createColumn({name: "tranid", label: "Tran ID"}),
			  search.createColumn({name: "trandate", sort: search.Sort.DESC, label: "Transaction Date"}),
			  search.createColumn({name: "status", label: "Transaction Status"}),
			  search.createColumn({name: "createdfrom", label: "Created From"}),
			  search.createColumn({name: "custitem194", label: "custitem194", join: "item"}),
			  search.createColumn({name: "itemid", label: "item Name", join: "item"})
		   ]
		  });

		  /*****/
		  var outputRec = "";
		  resultsObj.run().each(function(result){
			var recType = result.recordType;
            var recId = result.id;
			itemName = result.getValue({name: "itemid", join: "item"});
			//log.debug("itemName :",itemName);
			//if(recType == "vendorbill" || recType == "salesorder" || recType == "vendorcredit" || recType == "vendorreturnauthorization")
				//outputRec += recType + ' : ' + recId + '\n';
				
			switch(recType){
					case "vendorbill":
						if(bill_date == null || bill_date == ""){
							bill_date = result.getValue("trandate");
							bill_status = result.getValue("status");
							billed = true; // 02/25
							if(!max_bill_date)
								max_bill_date = bill_date;
							else{
								if(bill_date > max_bill_date)
									max_bill_date = bill_date
							}                          
						  outputRec += recType + ' : ' + recId + ' : trandate: ' + bill_date + ' : max_bill_date: ' + max_bill_date +' : billed: ' + billed +'\n';
						}
						break;
					case "salesorder":
						if(order_date == null || order_date == ""){
							order_date = result.getValue("trandate");
							order_status = result.getValue("status");
							if(!max_order_date)
								max_order_date = order_date;
							else{
								if(order_date > max_order_date)
									max_order_date = order_date
							}
                        //log.debug("salesorder - order_date: ", order_date + " : order_status : " + order_status);
						outputRec += recType + ' : ' + recId + ' : trandate: ' + order_date + ' : max_order_date: ' + max_order_date + ' : status: ' + order_status +'\n';
						}						
						break;
					case "vendorcredit":
						if(bill_credit_date == null || bill_credit_date == ""){
							bill_credit_date = result.getValue("trandate");
                          //log.debug("vendorcredit - bill_credit_date: ", bill_credit_date);
						  outputRec += recType + ' : ' + recId + ' : trandate: ' + bill_credit_date + '\n';
						}
						break;
					case "returnauthorization":
						if(ra_date == null || ra_date == ""){
							ra_date = result.getValue("trandate");
							ra_created_from = result.getText("createdfrom");
                          //log.debug("returnauthorization - ra_date: ", ra_date + " : ra_created_from : " + ra_created_from);
						    outputRec += recType + ' : ' + recId + ' : trandate: ' + ra_date + ' : ra_created_from: ' + createdfrom +'\n';
						}
						break;
				}

			return true;
		});

		//return;
		if(ownedReason == null) {
			ownedReason = search.lookupFields({
				type: search.Type.INVENTORY_ITEM,
				id: itemId,
				columns: ['custitem194']
		});

		}

		//log.debug("Dates Value","bill_date : " + bill_date + " : bill_credit_date: " + bill_credit_date);
		if(bill_credit_date != null){
			//If most recent bill credit date > bill date, then item = NOT BILLED
			var billDate = '';
			var creditDate = format.parse({value:bill_credit_date, type: format.Type.DATE});
            if(max_bill_date)
          		 billDate = format.parse({value:max_bill_date, type: format.Type.DATE});
          	//log.debug("Dates Value - inside ","billDate : " + billDate + " : creditDate: " + creditDate);		
			if(creditDate > billDate)
				billed = false;
          //log.debug("billed inside bill credit dt",billed);

		}
		log.debug("billed outside bill credit dt",billed);
		//If Sales Order = Pending Approval, Pending Fulfillment, Billed item = SOLD
		if(order_date != null && order_date != ""){
			if(order_status == "fullyBilled")
				sold = true;
		}
		
		if(ra_date != null && ra_date != ""){
			if(max_order_date != null && max_order_date != ""){
				var raDate = format.parse({value:ra_date, type: format.Type.DATE});
				var orderDate = format.parse({value:max_order_date, type: format.Type.DATE});
				//log.debug("Dates Value - sold ","raDate : " + raDate + " : orderDate: " + orderDate);
				if(raDate > orderDate){
					sold = false;
				}
			}
		}
		
		//If Owned Reason = Preset, then owned
		if(ownedReason.custitem194[0] != null && ownedReason.custitem194[0] != "")
			owned = true;
		if(billed == true)
			owned = true;
		if(sold == true)
			owned = true;
		var OwnVsMemo,SoldVsNotSold, BilledVsNotBilled;	
		if(owned == true){
			owned = "2"; // own
			OwnVsMemo = "Own";
		}else{
			owned = "1"; // memo
			OwnVsMemo = "Memo";
		}	
		if(sold == true){
			sold = "1"; // sold
			SoldVsNotSold = "Sold";
		}else{
			sold = "2"; // not sold
			SoldVsNotSold = "Not Sold";
		}	
		if(billed == true){
			billed = "1"; // billed
			BilledVsNotBilled = "Billed";
		}else{
			billed = "2"; // not billed
			BilledVsNotBilled = "Not Billed";
        }    
		
		var itemRecord = record.load({
            type:record.Type.INVENTORY_ITEM,
            id: itemId,
            isDynamic: true
          });
		  
		itemRecord.setValue({
            fieldId:'custitem_billedvsnotbilledfin',
            value: billed
        });
		itemRecord.setValue({
            fieldId:'custitem_soldvsnotsoldfin',
            value: sold
        });
		itemRecord.setValue({
            fieldId:'custitem_memovsownedfin',
            value: owned
        });
		//log.debug("Item Record before Updated.","Internal Id : " + itemId + " \n itemName : " + itemName +  "\n Values Updated : " + "\n BilledVsNotBilled : " + BilledVsNotBilled + "\n SoldVsNotSold : " + SoldVsNotSold + "\n OwnVsMemo " + OwnVsMemo + "\n Transactions Considered : " + outputRec);
        var recId = itemRecord.save(true, true);
        if(recId){
		  log.debug("Item Record Updated.","Internal Id : " + recId + " \n itemName : " + itemName +  "\n Values Updated : " + "\n BilledVsNotBilled : " + BilledVsNotBilled + "\n SoldVsNotSold : " + SoldVsNotSold + "\n OwnVsMemo " + OwnVsMemo + "\n Transactions Considered : " + outputRec);
		}

    }

  	
    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {

    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
    if (summary.inputSummary.error) {
      log.error('Input Error', summary.inputSummary.error);
    };
    summary.mapSummary.errors.iterator().each(function(key, error) {
      log.error('Map Error for key: ' + key, error);
      return true;
    });
    }

    return {
        getInputData: getInputData,
        map: map,
        //reduce: reduce,
        summarize: summarize
    };

});