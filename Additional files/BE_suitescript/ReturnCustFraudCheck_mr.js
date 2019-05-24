/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', './moment.min', 'N/format','N/runtime'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search, moment, format,runtime) {
   
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
    	var intID = runtime.getCurrentScript().getParameter({name:'custscript_so_internal_id_2602'});  
    	
    	var timeNow = new Date().getTime();
		var tempDateNow = new Date(timeNow);
		var currentTime = format.format({value:tempDateNow, type: format.Type.DATETIME});
		
    	var tFrame = getTimeFrame(currentTime);
      	var startTime;
      	var endTime;
      	//log.debug("Time Frame", tFrame);
        //if (startTime == null) {
          startTime = tFrame[3].from;
          endTime = tFrame[0].to;
          
          log.debug("Time Frame1", startTime);
          log.debug("Time Frame2", endTime);
          
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
        	myFilter = ["datecreated","within",startTime,endTime];
        }   
        //log.debug("myFilter ", myFilter);
          
    	var salesorderSearchObj = search.create({
    		   type: "salesorder",
    		   filters:
    		   [
    		      ["type","anyof","SalesOrd"], 
    		      "AND", 
    		      ["mainline","is","T"], 
    		      "AND", 
    		      ["taxline","is","F"], 
    		      "AND", 
    		      ["shipcomplete","is","F"], 
    		      "AND", 
    		      myFilter
    		      //["datecreated","within",startTime,endTime] //test 
    		      //["internalid","anyof","24972088","24972089"]
    		      //["internalid","is","24938708"]
    		   ],
    		   columns:
    		   [
    		      search.createColumn({name: "datecreated", label: "Date Created"})
    		   ]
    		});
    	//log.debug("salesorderSearchObj ", JSON.stringify(salesorderSearchObj));
    	return salesorderSearchObj;	
    	//return [];	
    }
    /******/
    
    function getTimeFrame(currentTime) {
		
		//var hours = tempDateNow.getHours();
		
		//log.debug("Current TIME", currentTime);
		
		var timestampString = currentTime; //'03/12/2019 02:39 am';
		
		var firstTo = moment(timestampString , 'MM-DD-YYYY hh:mm a');

		// Calculate first "from" time using startOf to "round down" to 
		// start of current hour
		var firstFrom = firstTo .clone().startOf('hour');
		//log.debug("firstFrom", firstFrom);
		var format = 'MM/DD/YYYY hh:mm a'

		// Add first formatted range into timeRanges array    
		/*var timeRanges = [{ 
			from : firstFrom.format(format), 
			to : firstTo.format(format) 
		}]*/
        var timeRanges = [];

		// Iterate three times to compute and add remaining time ranges
		// to timeRanges result array
		for(var i = 0; i < 4; i++) {

			// Calculate "from" and "to" times for each of the remaining 
			// times ranges we want to calculate
			var from = firstFrom.clone().subtract(i + 1, 'hours').startOf('hour')
			var to = firstFrom.clone().subtract(i, 'hours').startOf('hour')

			// Add formatted time range to timeRanges array
			timeRanges.push({ 
				from : from.format(format),
				to : to.format(format)
			 })
		}
		log.debug("timeRanges", timeRanges);
		return timeRanges;	
	}
    //End of getTimeFrame
    
    function Get_Field_Value(data_value)
    {

      if(data_value)
      {
        if(data_value[0])
        {
          if(data_value[0].value)
          {
            return data_value[0].value;
          }
        }
      }
      return "";
    }
    
    function Returning_Customer_Fraud_Data(soId) {
    	log.debug("soId inside Returning_Customer_Fraud_Data", soId);
        var SalesRecord = record.load({
            type: record.Type.SALES_ORDER, 
            id: soId,
            isDynamic: true
          });
        var field_value={};
    	var get_custbody148=SalesRecord.getValue('custbody148');
    	var get_custbody228=SalesRecord.getValue('custbody228');
    	var customer_ID = SalesRecord.getValue('entity');
    	var salesorder_IN_IDs = [];
   	    var yellow_gold_flag = false;
   	    var engrave_ring_flag = false;
   	    var confirmed_fraud_flag = false;
   	    var returnning_custom = [];
   	    var last_saleorder_date = null;
   	    if(customer_ID){
    	      var customer = search.lookupFields({
    	        type: 'customer',
    	        id: SalesRecord.getValue('entity'),
    	        columns: ['custentity_sales_order_1', 'custentity_sales_order_2', 'custentity_sales_order_3', 'custentity_sales_order_4','custentity_sales_order_5']
    	      });
    	      var customer_data={'custentity_sales_order_1':Get_Field_Value(customer.custentity_sales_order_1), 
    	                         'custentity_sales_order_2':Get_Field_Value(customer.custentity_sales_order_2),
    	                         'custentity_sales_order_3':Get_Field_Value(customer.custentity_sales_order_3),
    	                         'custentity_sales_order_4':Get_Field_Value(customer.custentity_sales_order_4),
    	                         'custentity_sales_order_5':Get_Field_Value(customer.custentity_sales_order_5)
    	                        }	
    	      if(customer_data.custentity_sales_order_1 && (customer_data.custentity_sales_order_1 !=SalesRecord.id) )
    	        salesorder_IN_IDs.push(customer_data.custentity_sales_order_1);
    	      if(customer_data.custentity_sales_order_2 && (customer_data.custentity_sales_order_2 !=SalesRecord.id))
    	        salesorder_IN_IDs.push(customer_data.custentity_sales_order_2);
    	      if(customer_data.custentity_sales_order_3 && (customer_data.custentity_sales_order_3 !=SalesRecord.id))
    	        salesorder_IN_IDs.push(customer_data.custentity_sales_order_3);
    	      if(customer_data.custentity_sales_order_4 && (customer_data.custentity_sales_order_4 !=SalesRecord.id))
    	        salesorder_IN_IDs.push(customer_data.custentity_sales_order_4);
    	      if(customer_data.custentity_sales_order_5 && (customer_data.custentity_sales_order_5 !=SalesRecord.id))
    	        salesorder_IN_IDs.push(customer_data.custentity_sales_order_5);
    	    }

    	    if(salesorder_IN_IDs.length>0)
    	    {
    	      //log.debug({ title: 'salesorder_IN_IDs', details:salesorder_IN_IDs});
    	      var mySearch = search.load({id:'customsearch_returning_customers_informa'});
    	      var mySearchFilter = search.createFilter('internalid',null,'anyof',salesorder_IN_IDs);
    	      mySearch.filters.push(mySearchFilter);
    	      var search_record = mySearch.run(); 
    	      var col=search_record.columns;
    	      var run_filter=0;
    	      search_record.each(function(result) {
    	        run_filter++;
    	        //log.debug({ title: 'run_filter', details:run_filter});
    	        var trandate=result.getValue(col[0]);
    	        var curr_item=result.getText(col[1]);
    	        var frad_check=result.getValue(col[2]);
    	        if(last_saleorder_date)
    	        {

    	          var parsed_trandate = format.parse({value: trandate,type: format.Type.DATE});
    	          var parsed_last_saleorder_date = format.parse({value: last_saleorder_date,type: format.Type.DATE});			
    	          if(parsed_trandate>parsed_last_saleorder_date){
    	            last_saleorder_date = trandate;
    	          }
    	        }
    	        else{
    	          last_saleorder_date = trandate;
    	        }	
    	        if(frad_check=='T')
    	        {
    	          confirmed_fraud_flag=true;
    	        }
    	        var pattern = /^be[152].*/im;
    	        var result = pattern.test(curr_item);
    	        if(result){
    	          if(curr_item.indexOf('18KY') != -1){
    	            yellow_gold_flag = true;
    	          }
    	        }
    	        if(curr_item == 'Engrave Ring'){
    	          engrave_ring_flag = true;
    	        }
    	        return true;
    	      });
    	      if(yellow_gold_flag){
    	        returnning_custom.push(1);
    	      }
    	      if(engrave_ring_flag){
    	        returnning_custom.push(2);
    	      }
    	      if(!yellow_gold_flag&&!engrave_ring_flag){
    	        returnning_custom.push(3);
    	      }
    	      if(confirmed_fraud_flag){
    	        returnning_custom.push(4);
    	      }
    	      if(last_saleorder_date){
    	        var salesorder_notes = SalesRecord.getValue('custbody148');
    	        if(salesorder_notes){
    	          salesorder_notes = "Returning Customer, Last order: "+ last_saleorder_date+";  "+salesorder_notes;
    	        }else{
    	          salesorder_notes = "Returning Customer, Last order: "+ last_saleorder_date;
    	        }

    	        if(salesorder_notes!=get_custbody148 ){			
    	          field_value["custbody148"]=salesorder_notes; //FRAUD NOTES
    	        }
    	      }
    	      if(returnning_custom.length>0 && returnning_custom!=get_custbody228){
    	        field_value["custbody228"]=returnning_custom;
    	      }
    	    }  
    	  //update the SO  
    	   // var new_data_value=JSON.stringify(field_value);
    	    var fldLen = Object.keys(field_value).length;
    	    //log.debug("field_value: ", JSON.stringify(field_value) + ", fldLen: " + fldLen);
    	    if(fldLen > 0){
              log.debug("field_value: ", JSON.stringify(field_value) + ", fldLen: " + fldLen);
    	    	var id= record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: SalesRecord.id,
                    values:field_value ,
                    options: {
                      enableSourcing: false,
                      ignoreMandatoryFields : true
                    }
                  });
    	    	if(id){log.debug("Sales Order has been updated. Internal Id: ",id);}
    	    }
 	}
    
   /***********/
    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	var searchData = JSON.parse(context.value);
    	var recordID = searchData.id;
    	Returning_Customer_Fraud_Data(recordID);
    	
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
