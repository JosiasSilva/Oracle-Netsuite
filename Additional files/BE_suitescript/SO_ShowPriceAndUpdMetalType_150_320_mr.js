/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search','N/runtime'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search,runtime) {
   
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
      //log.debug("Inside get input data");
    	var intID = runtime.getCurrentScript().getParameter({name:'custscript_so_internal_id_metal_type'});
    	var myFilter;
        if (intID){
        	if(intID.indexOf(",") > -1){
        		var arrIntId = intID.split(",");
        		myFilter = ["internalid","anyof",arrIntId];
        		log.debug("Inside if", "arrIntId : " + arrIntId);
        	}
        	else{
        		myFilter = ["internalid","anyof",intID];
        		log.debug("Inside else ", "intID : " + intID);
        	}
        }else{
        	myFilter = ["lastmodifieddate","on","yesterday"];
        }
        	
    	var salesorderSearchObj = search.create({
    		   type: "salesorder",
    		   filters:
    		   [
    		      ["type","anyof","SalesOrd"], 
    		      "AND", 
    		      ["mainline","is","T"], 
    		      "AND", 
    		      ["status","anyof","SalesOrd:A","SalesOrd:B"], //Pending Approval, Pending Fulfillment
    		      "AND", 
    		      myFilter
                 //["lastmodifieddate","on","yesterday"]
    		      //["internalid","anyof","24972088","24972089"]
    		      //,"AND", ["internalid","anyof","24904530"]
    		   ],
    		   columns:[
                 search.createColumn({name: "internalid", label: "Internal ID"})
               ]

    		});
    	//log.debug("salesorderSearchObj ", JSON.stringify(salesorderSearchObj));
    	return salesorderSearchObj;	
    	//return [];
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
		var searchData = JSON.parse(context.value);
    	var recordID = searchData.id;
        var isRecChanged = false;
    	log.debug("Inside Map", "SO Id : " + recordID);
   	    var order = record.load({type: record.Type.SALES_ORDER, id: recordID});
		var show_price_on_receipt = order.getValue("custbody97");
		//log.debug("Inside Map", "show_price_on_receipt : " + show_price_on_receipt);
		if(show_price_on_receipt!= true && order.getValue("customform")!="130"){					
			order.setValue("customform","130");
            isRecChanged = true;
		}
			/****/
			
			//Reset fields
			
			var cur_metal1 = order.getValue("custbody_metal_1");
			var cur_metal2 = order.getValue("custbody_metal_2");
			var cur_metal3 = order.getValue("custbody_metal_3");
			var cur_metal4 = order.getValue("custbody_metal_4");
			var cur_metal5 = order.getValue("custbody_metal_5");
			var cur_metal6 = order.getValue("custbody_metal_6");
			
			var metal1 = "";
			var metal2 = "";
			var metal3 = "";
			var metal4 = "";
			var metal5 = "";
			var metal6 = "";
			
			var numLines = order.getLineCount({sublistId: 'item'});
			//log.debug("Inside Map", "Sublist numLines : " + numLines);
			for(var x=0; x < numLines; x++){
			
				var itemId = order.getSublistValue({sublistId: 'item', fieldId: 'item', line: x});
			
				var ItemObj = search.lookupFields({
						type: search.Type.ITEM,	id: itemId,	columns: 'custitem1'});
					
				//log.debug("Inside Map - FOR Loop", "itemId : " + itemId + ", ItemObj : " + JSON.stringify(ItemObj));
				//var arrItem1 = ItemObj.custitem1;
				//log.debug("Inside Map", "FOR Loop  itemOb: " + itemArray + " , length : " + itemArray.length);
				
				if(ItemObj.custitem1.length > 0){
				var metal_type = ItemObj.custitem1[0].value;
				//log.debug("Inside Map", " metal_type : " + metal_type);
				if(metal_type!=null && metal_type!=""){
					/*var metal1 = order.getValue("custbody_metal_1");
					var metal2 = order.getValue("custbody_metal_2");
					var metal3 = order.getValue("custbody_metal_3");
					var metal4 = order.getValue("custbody_metal_4");
					var metal5 = order.getValue("custbody_metal_5");
					var metal6 = order.getValue("custbody_metal_6");*/
					
					
				
					if(metal1==null || metal1=="")
						metal1 = metal_type;
					else if(metal2==null || metal2=="")
						metal2 = metal_type;
					else if(metal3==null || metal3=="")
						metal3 = metal_type;
					else if(metal4==null || metal4=="")
						metal4 = metal_type;
					else if(metal5==null || metal5=="")
						metal5 = metal_type;
					else if(metal6==null || metal6=="")
						metal6 = metal_type;
					
					log.debug("Inside Map, Inside of IF", " metal1 : " + metal1 + ", metal2 : " + metal2+ ", metal3 : " + metal3 + ", metal4 : " + metal4 + ", metal5 : " + metal5 + ", metal6 : " + metal6);	
					
					
					/*
					 if(new_metal1==null || new_metal1=="")
						new_metal1 = metal_type;
					else if(new_metal2==null || new_metal2=="")
						new_metal2 = metal_type;
					else if(new_metal3==null || new_metal3=="")
						new_metal3 = metal_type;
					else if(new_metal4==null || new_metal4=="")
						new_metal4 = metal_type;
					else if(new_metal5==null || new_metal5=="")
						new_metal5 = metal_type;
					else if(new_metal6==null || new_metal6=="")
						new_metal6 = metal_type;
						
					 ============================================
					 
					if(metal1==null || metal1=="")
						order.setValue("custbody_metal_1",metal_type);
					else if(metal2==null || metal2=="")
						order.setValue("custbody_metal_2",metal_type);
					else if(metal3==null || metal3=="")
						order.setValue("custbody_metal_3",metal_type);
					else if(metal4==null || metal4=="")
						order.setValue("custbody_metal_4",metal_type);
					else if(metal5==null || metal5=="")
						order.setValue("custbody_metal_5",metal_type);
					else if(metal6==null || metal6=="")
						order.setValue("custbody_metal_6",metal_type);
					*/
					
                    //isRecChanged = true;
				} 
				}
			}
			if(metal1 != cur_metal1){
				order.setValue("custbody_metal_1",metal1);
				isRecChanged = true;
				log.debug("metal changed", " metal1 : " + metal1);
			} 
			if(metal2 != cur_metal2){
				order.setValue("custbody_metal_2",metal2);
				isRecChanged = true;
				log.debug("metal changed", " metal2 : " + metal2);
			}
			if(metal3 != cur_metal3){
				order.setValue("custbody_metal_3",metal3);
				isRecChanged = true;
				log.debug("metal changed", " metal3 : " + metal3);
			}
			if(metal4 != cur_metal4){
				order.setValue("custbody_metal_4",metal4);
				isRecChanged = true;
				log.debug("metal changed", " metal4 : " + metal4);
			}
			if(metal5 != cur_metal5){
				order.setValue("custbody_metal_5",metal5);
				isRecChanged = true;
				log.debug("metal changed", " metal5 : " + metal5);
			}
			if(metal6 != cur_metal6){
				order.setValue("custbody_metal_6",metal6);
				isRecChanged = true;
				log.debug("metal changed", " metal6 : " + metal6);
			}
			
	  //log.debug("Inside Map, Outside of Loop", " isRecChanged : " + isRecChanged);
      if(isRecChanged){
			var recId = order.save(false, true);
			if(recId)
				log.debug("Record Updated", "SO Id : " + recId);
      }else
        log.debug("Record not Updated", "No change in Data for SO Id : " + recordID);
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

    	summary.reduceSummary.errors.iterator().each(function(key, error) {
    	     log.error('Reduce Error for key: ' + key, error);
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
