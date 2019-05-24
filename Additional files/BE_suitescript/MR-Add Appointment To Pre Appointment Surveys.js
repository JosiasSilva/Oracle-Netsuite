/*
 * Script Author 	: 	Nikhil Bhutani (nikhil.bhutani@inoday.com)
 * Author/Designer 	: 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type 		:	Suitescript (Map/Reduce)
 * Description 		:	MR - Add any appointments found on the customer page that are on or after TODAY on pre-appointment surveys with no appointment
 * Created Date 	:	October 01, 2018
 * Last Modified Date:	October 08, 2018 (Please put a comment with date when code is modified)
 * Comments 		:	Refer NS-1360
 * SB SS URL 		:	https://system.netsuite.com/app/common/scripting/script.nl?id=2540
 * Production SS URL:	https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2489
*/

/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
*/

define(['N/search', 'N/record', 'N/log'],function(search, record, log){
	function getInputData(inputContext)
	{
		var search10004 = search.load({
			id: 'customsearch10004' // Change this for Production to - 'customsearch10004'
		});
		return search10004;
	}

	function map(mapContext)
	{
		var search10004Data = JSON.parse(mapContext.value);
		mapContext.write({
			key: search10004Data.id,
			value: mapContext.value
		});
	}

	function reduce(reduceContext)
	{
		var preApptId = reduceContext.key;
		var arr_appointments;
		arr_appointments = [];
		/*
		var loadedPreAppointmentSurvey = record.load({
			type: 'customrecord848',
			id: preApptId
		});
		var customer_id = loadedPreAppointmentSurvey.getValue({
			fieldId: 'custrecord_customer'
		});
		*/
		var fieldLookUp = search.lookupFields({
			type: 'customrecord848',
			id: preApptId,
			columns: 'custrecord_customer'
		});
      	var customer_id = null;
        if(fieldLookUp.custrecord_customer.length>0)
        {
          customer_id=fieldLookUp.custrecord_customer[0].value;
        }
		// log.debug("customer_id lookup: ", customer_id);
    	if(customer_id && customer_id != null && customer_id != undefined)
		{
			// log.debug('Customer ID: ', customer_id);
			var customerSearchObj = search.create({
				type: "customer",
				filters:
				[
					["internalid", "is", customer_id],
					"AND", 
					["event.date", "onorafter", "today"],
					"AND", 
					["event.status","is","CONFIRMED"]
				],
				columns:
				[
					search.createColumn({
					name: "internalid",
					join: "event",
					sort: search.Sort.ASC,
					label: "Appointment ID"
					})
				]
			});
			var apptPagedData = customerSearchObj.runPaged();
			var preApptSurveysCount = apptPagedData.count;
			// log.debug('customerSearchObj result count', preApptSurveysCount);
			apptPagedData.pageRanges.forEach(function(pageRange){
				var eachPage = apptPagedData.fetch({
					index: pageRange.index
				});

				eachPage.data.forEach(function(result){
					var appt_id = result.getValue({
						name: 'internalid',
						join: 'event'
					});
					arr_appointments.push(appt_id);
					return true;
				});
			});

			if(arr_appointments && arr_appointments.length != 0)
			{
				log.debug("arr_appointments for customer_id: " + customer_id + " and preApptId: " + preApptId, JSON.stringify(arr_appointments));
				/*
				loadedPreAppointmentSurvey.setValue({
					fieldId: 'custrecord_appointment',
					value: arr_appointments
				});
				var saved_preAppointment = loadedPreAppointmentSurvey.save({
					enableSourcing: true,
					ignoreMandatoryFields: true
				});
				*/
				var saved_preAppointment = record.submitFields({
					type: 'customrecord848',
					id: preApptId,
				    values: {
				    custrecord_appointment: arr_appointments
				   },
				   options: {
				   enableSourcing: false,
				   ignoreMandatoryFields : true
				   }
				  });
				log.debug('Saved Pre-Appointment Survey', saved_preAppointment);
			}
		}
	}

	function summarize(summaryContext)
	{
		if (summaryContext.inputSummary.error) {
			log.debug('Input Error', summaryContext.inputSummary.error);
		};
		summaryContext.mapSummary.errors.iterator().each(function(key, error) {
			log.debug('Map Error for key: ' + key, error);
			return true;
		});
		summaryContext.reduceSummary.errors.iterator().each(function(key, error) {
			log.debug('Reduce Error for key: ' + key, error);
			return true;
		});
	}

	return {
    getInputData: getInputData,
    map: map,
    reduce: reduce,
    summarize: summarize
	};
});