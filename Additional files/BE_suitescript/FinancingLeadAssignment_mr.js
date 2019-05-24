/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/format', 'N/record', 'N/search'],
/**
 * @param {format} format
 * @param {record} record
 * @param {search} search
 */
function(format, record, search) {
	var objSalesRep = {};
	// Function to return current day of Sales Rep
	function GetCurrFinFld(){
		var chkDayFld = '';
		var currDate = new Date();
		var currDay = currDate.getDay();
		switch(currDay) {
		  case 1:
			  chkDayFld = 'custentitymonday_financing';
			  break;
		  case 2:
			  chkDayFld = 'custentitytuesday_financing';
			  break;
		  case 3:
			  chkDayFld = 'custentitywednesday_financing';
			  break;
		  case 4:
			  chkDayFld = 'custentitythursday_financing';
			  break;
		  case 5:
			  chkDayFld = 'custentityfriday_financing';
			  break;
		  case 6:
			  chkDayFld = 'custentitysaturday_financing';
			  break;
		  default:
			  chkDayFld = 'custentitysunday_financing';
		}
		return chkDayFld;
	}
	// End of Function to 
	
   // Function to delete Assigned Sales Rep
	function DeleteCurrSalesRepRoster(territoryId){
		var arrPrevSalesRep = [];
    	var leadAssnSearchObj = search.create({
 		   type: "customrecord_lead_assignment",
 		   filters:[["custrecord_salesterritory","anyof",territoryId]],
 		   columns:[ search.createColumn({name: "custrecord_sales_rep", label: "Sales Rep"})]
 		});
 		
 		leadAssnSearchObj.run().each(function(result){
 			var SalesRepId = result.getValue({name: "custrecord_sales_rep"});
		
 			if(Object.keys(objSalesRep).indexOf(SalesRepId) == -1){
 				var recId = record.delete({type: 'customrecord_lead_assignment', id: result.id});
	    	}else{
	    		arrPrevSalesRep.push(SalesRepId);
	    		// add it to an array - Existing Sales Rep
	    	}
 		   return true;
 		});
	}
	// End of Function to delete Assigned Sales Rep
	
	// Function to create financing rooster
	function CreateFinanceRooster(SalesTerrRecId){
		var arrSubListSalesRep = [];
		var arrCurrSalesRep = Object.keys(objSalesRep);
		var recAdded = false;
		var SalesTerrRec = record.load({type: 'customrecord_sales_territory', id: SalesTerrRecId});
		var srchId = SalesTerrRec.getValue({fieldId:'custrecord_apply_save_search_rule'});
		var numLines = SalesTerrRec.getLineCount({sublistId: 'recmachcustrecord_salesterritory'});
		
		if(numLines){ // if there is any assigned Sales Rep
			for(var ln = 0; ln < numLines; ln++){
				// create an array of existing sales Rep
				var salesRep = SalesTerrRec.getSublistValue({
					sublistId: 'recmachcustrecord_salesterritory',
					fieldId: 'custrecord_sales_rep',
					line: ln
					});
				arrSubListSalesRep.push(salesRep);
			}
			// compare the value of sales rep b/w the array and the object
	
			for(var id = 0; id < arrCurrSalesRep.length; id++){
				if(arrSubListSalesRep.indexOf(arrCurrSalesRep[id]) == -1){
					SalesTerrRec.insertLine({sublistId: 'recmachcustrecord_salesterritory',	line: id});
					
					SalesTerrRec.setSublistValue({
						sublistId: 'recmachcustrecord_salesterritory',
						fieldId: 'custrecord_sales_rep',
						line: id,
						value: arrCurrSalesRep[id]
						});
					recAdded = true;
				}
			}
			
			
		}else{
			// if there is no assigned Sales Rep; add current sales rep list to the sublist
			for(var idx = 0; idx < arrCurrSalesRep.length; idx++){
				SalesTerrRec.insertLine({sublistId: 'recmachcustrecord_salesterritory',	line: idx});
				
				SalesTerrRec.setSublistValue({
					sublistId: 'recmachcustrecord_salesterritory',
					fieldId: 'custrecord_sales_rep',
					line: idx,
					value: arrCurrSalesRep[idx]
					});				
				recAdded = true;
			}
		}
		if(recAdded)
			SalesTerrRec.save(true,true);
		
		return srchId
	}
	// End of Function to create financing rooster
	
	// Function to get Financing Sales Reps
	function GetFinSalesRep(dayFldId, SalesTerrRecId){
		
		var empSearchObj = search.create({
			   type: "employee",
			   filters:
			   [
			      ["salesrep","is","T"],
			      "AND", 
     		      ["isinactive","is","F"],
                 "AND", 
		     	 [dayFldId,"is","T"],
			      "AND", 
			      ["custentity_salesterritories","anyof",SalesTerrRecId]

			   ],
			   columns:
			   [
			      search.createColumn({name: "custentity85",label: "Showroom Location"})//,
		          //search.createColumn({name: "custrecord_office_closing_time",join: "custentity85",label: "Off Closing Time"}),
		          //search.createColumn({name: "timezone",join: "custentity85",label: "Time Zone"})
			   ]
			});

 		empSearchObj.run().each(function(result){
 			 var objEmpDtl = {};
	 		 var EmpId = result.id;
	 		 objSalesRep[EmpId] = [];
	 		 var empArray = objSalesRep[EmpId];
	 		 objEmpDtl['location'] = result.getValue({name: "custentity85"});
	 		 //objEmpDtl['closingtime'] = result.getValue({name: "custrecord_office_closing_time",join: "custentity85"});
	 		 //objEmpDtl['timezone'] = result.getValue({name: "timezone",join: "custentity85"});
	 		 
	 		empArray.push(objEmpDtl);
	 		objSalesRep[EmpId] = empArray;
	 		
 		   return true;
 		});
	}
	// End of Function to get Financing Sales Reps
	
	// Function to get a Sales Rep to assign to a Lead 
	function getSalesRepToAssign(objTempAssignSalesRep, arrSalesRep){
			// if there are sales rep already assigned to Leads today
			var salesRepToAssign = '';
			if(Object.keys(objTempAssignSalesRep).length > 0){
				//find out the number of lead assigned to each of sales rep for today and sort it 
				//find the sales rep with lowest number and assign it to the lead
				
				//var currSalesRepCount = [];
				var currSalesRepCount = {};
				for(var ln = 0; ln < arrSalesRep.length; ln++ ){
					var curSalesRep = arrSalesRep[ln];
					var TempCurrSalesRep = {};
					if(Object.keys(objTempAssignSalesRep).indexOf(curSalesRep) == -1){
						//if there is no lead assigned to this sale rep
						currSalesRepCount[curSalesRep] = 0;
					}else{
						//if lead has been assigned to this sale rep
						currSalesRepCount[curSalesRep] = objTempAssignSalesRep[curSalesRep];
					}
				}

				var SortedSalesRep = Object.keys(currSalesRepCount).sort(function(a,b){return currSalesRepCount[a]-currSalesRepCount[b]})
				var arrSalesRepToAssign = [];
				arrSalesRepToAssign.push(SortedSalesRep[0]);
				
				//if more than one sales rep have the lowest number then pick a random sales rep among these sales rep
				var lowestLeadCount = currSalesRepCount[SortedSalesRep[0]];
				for (var sr in currSalesRepCount){
					if((lowestLeadCount == currSalesRepCount[sr]) &&(arrSalesRepToAssign.indexOf(sr) == -1))
						arrSalesRepToAssign.push(sr);
				}
				arrSalesRepToAssign.sort(function(a, b){return 0.5 - Math.random()});

				if(arrSalesRepToAssign.length > 0)
					salesRepToAssign = arrSalesRepToAssign[0];
				//log.debug("Sales Rep to assign - IF",salesRepToAssign);
				
			}else{// if there are no sales rep assigned to Leads today; pick any random sales rep and assign it to the Leads
				if(arrSalesRep.length > 0){
					arrSalesRep.sort(function(a, b){return 0.5 - Math.random()}); 
					salesRepToAssign = arrSalesRep[0];
					//log.debug("Sales Rep to assign - Else",salesRepToAssign);
				}
			}
		return salesRepToAssign;	
	}
	// Function to get a Sales Rep to assign to a Lead 
			
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

    	var SalesRepTerrId = '7'; // Financing Assignment

     	var fldFinId = GetCurrFinFld();
    	
    	GetFinSalesRep(fldFinId, SalesRepTerrId);
    	DeleteCurrSalesRepRoster(SalesRepTerrId);
    	var searchId = CreateFinanceRooster(SalesRepTerrId);
    	log.debug("srchId",searchId);

    	var noOfSalesRep = Object.keys(objSalesRep).length;
    	if(!noOfSalesRep){
    		log.debug("No Sales Rep has been associated with the Sales territory. The process terminates")
    		return [];
    	}
    		
    	if(searchId){
    		var objSrchFinLeadRec = search.load({
    			id: searchId
    	    	});
    	    return objSrchFinLeadRec;
    	}else{
    		log.debug("No Search has been associated with the Sales territory. The process terminates")
    		return [];
    	}
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
    	
    	var srchLeadData = JSON.parse(context.value);
    	var leadId = srchLeadData.values["GROUP(entityid)"];

    	var arrSalesRep = [];
    	var SalesRepterrId = '7';
    	var leadAssnSearchObj = search.create({
 		   type: "customrecord_lead_assignment",
 		   filters:[["custrecord_salesterritory","anyof",SalesRepterrId]],
 		   columns:[ search.createColumn({name: "custrecord_sales_rep", label: "Sales Rep"})]
 		});
 		
 		leadAssnSearchObj.run().each(function(result){
 			var SalesRepId = result.getValue({name: "custrecord_sales_rep"});
 			arrSalesRep.push(SalesRepId);
 		   return true;
 		});
		log.debug("Sales Rep - in map ",arrSalesRep);
		
		// find the sales rep assigned to leads today
		var leadSearchObj = search.create({
			   type: "lead",
			   filters:
			   [
			      ["stage","anyof","LEAD"], 
			      "AND", 
			      ["isinactive","is","F"], 
			      "AND", 
			      ["email","doesnotcontain","brilliantearth.com"], 
			      "AND", 
			      ["leadsource","anyof","682344"], 
			      "AND", 
			      ["custentity_lead_assistant_date","on","today"]
			   ],
			   columns:
			   [
			      search.createColumn({
			         name: "salesrep",
			         summary: "GROUP",
			         label: "Sales Rep"
			      }),
			      search.createColumn({
			         name: "internalid",
			         summary: "COUNT",
			         sort: search.Sort.ASC,
			         label: "Internal ID"
			      })
			   ]
			});
		    var objTempAssignSalesRep = {};
			leadSearchObj.run().each(function(result){

				var AssignSalesRep = result.getValue({name: "salesrep",summary: "GROUP"});
				var count = result.getValue({name: "internalid",summary: "COUNT"});
				objTempAssignSalesRep[AssignSalesRep] = count;
			   return true;
			});
			
			var SalesRepToAssign = getSalesRepToAssign(objTempAssignSalesRep, arrSalesRep);
			var LeadIntrId = '';
			//update Lead record with the sales rep and today date
			// get internal id of the Lead record based on Lead id
			if(leadId){
				var leadAssgnSrchObj = search.create({type: "lead", filters: [["entityid","is",leadId]]	});
				leadAssgnSrchObj.run().each(function(result){
					LeadIntrId = result.id;
				});
			}
			if(LeadIntrId && SalesRepToAssign){
				//update the Lead record with sales rep
		    	var dtCurrent = new Date();
		        var AssignDate = format.parse({value: dtCurrent, type: format.Type.DATE});
		        var recId = record.submitFields({
		        	type: record.Type.LEAD,
		        	id: LeadIntrId,
		        	values: {
		        		salesrep: SalesRepToAssign,
		        		custentity_lead_assistant_date: AssignDate
		        	},
		        	options: {
		        	enableSourcing: false,
		        	ignoreMandatoryFields : true
		        	}
		        	});
		        if(recId)
		         log.debug("Lead Record has been updated","Internal id: " + recId + " : Sales Rep id :" + SalesRepToAssign);
			}else
				log.debug("Lead Record can not be updated","Internal id: " + LeadIntrId);
			
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
