/*
 * Script Author 	: 	Nikhil Bhutani (nikhil.bhutani@inoday.com)
 * Author/Designer 	: 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type 		:	Suitescript (Map/Reduce)
 * Description 		:	MR - Response Owner Sales Territory – Script will automatically assign a sales rep (in field Rep Assigned to Form (Main Rep OOO)) to a lead/customer (appearing in saved search 9778 - SB) based on the sales rep’s schedule.
 * Created Date 	:	October 03, 2018
 * Last Modified Date:	October 05, 2018 (Please put a comment with date when code is modified)
 * Comments 		:	Refer NS-1351
 * SB SS URL 		:	https://system.netsuite.com/app/common/scripting/script.nl?id=2544
 * Production SS URL:	https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2490
 */

/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/runtime', 'N/log'], function(search, record, runtime, log) {

    function getInputData(inputContext) {
        getSalesRepQueue();
        var search10059 = search.load({
            id: 'customsearch10059'
        });
        return search10059;
    }

    function map(mapContext) {
        var search10059Data = JSON.parse(mapContext.value);
        mapContext.write({
            key: search10059Data.id,
            value: mapContext.value
        });
    }

    function reduce(reduceContext) {
        var queue_availableSalesRep;
        var deployment_record = record.load({
            type: record.Type.SCRIPT_DEPLOYMENT,
            id: 9725 // Change for Production
        });
        var queue_availableSalesRep = JSON.parse(deployment_record.getValue({
            fieldId: 'custscript_queue_available'
        }));
        log.debug('1. queue_availableSalesRep', JSON.stringify(queue_availableSalesRep));
		if(queue_availableSalesRep && queue_availableSalesRep[0] != null && queue_availableSalesRep[0] != undefined)
		{
			var cust_id = reduceContext.key;
			log.debug('Customer ID: ', cust_id);
			var loadedCustomer = record.load({
				type: record.Type.CUSTOMER,
				id: cust_id
			});
			var assignedSalesRep = loadedCustomer.getValue({
				fieldId: 'salesrep'
			});
			var assignedOooSalesRep = loadedCustomer.getValue({
				fieldId: 'custentityrep_assigned_to_form_ooo'
			});
			if (assignedSalesRep == '' || assignedSalesRep == null || assignedSalesRep == undefined) {
				if (assignedOooSalesRep && assignedOooSalesRep != null && assignedOooSalesRep != undefined) {
					if (queue_availableSalesRep.indexOf(assignedOooSalesRep) >= 0) {
						loadedCustomer.setValue({
							fieldId: 'custentityrep_assigned_to_form_ooo',
							value: assignedOooSalesRep
						});
						try {
							var saved_customer = loadedCustomer.save({
								enableSourcing: false,
								ignoreMandatoryFields: true
							});
							log.debug('Saved Customer ID:', saved_customer);
							queue_availableSalesRep.push(queue_availableSalesRep.splice(queue_availableSalesRep.indexOf(assignedOooSalesRep), 1)[0]);
							log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
						} catch (ex) {
							log.debug('If Saved Customer - Exception Occured:', ex.message);
						}
					} else {
						loadedCustomer.setValue({
							fieldId: 'custentityrep_assigned_to_form_ooo',
							value: queue_availableSalesRep[0]
						});
						try {
							var saved_customer = loadedCustomer.save({
								enableSourcing: false,
								ignoreMandatoryFields: true
							});
							log.debug('Saved Customer ID:', saved_customer);
							queue_availableSalesRep.push(queue_availableSalesRep.shift());
							log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
						} catch (ex) {
							log.debug('Else Save Customer  ID - Exception Occured:', ex.message);
						}
					}
				} else {
					loadedCustomer.setValue({
						fieldId: 'custentityrep_assigned_to_form_ooo',
						value: queue_availableSalesRep[0]
					});
					try {
						var saved_customer = loadedCustomer.save({
							enableSourcing: false,
							ignoreMandatoryFields: true
						});
						log.debug('Saved Customer ID:', saved_customer);
						queue_availableSalesRep.push(queue_availableSalesRep.shift());
						log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
					} catch (ex) {
						log.debug("Else 2 Save Customer Exception:", ex.message);
					}
				}
			} else {
				if (queue_availableSalesRep.indexOf(assignedSalesRep) >= 0) {
					loadedCustomer.setValue({
						fieldId: 'custentityrep_assigned_to_form_ooo',
						value: assignedSalesRep
					});
					try {
						var saved_customer = loadedCustomer.save({
							enableSourcing: false,
							ignoreMandatoryFields: true
						});
						log.debug('Saved Customer ID:', saved_customer);
						queue_availableSalesRep.push(queue_availableSalesRep.splice(queue_availableSalesRep.indexOf(assignedSalesRep), 1)[0]);
						log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
					} catch (ex) {
						log.debug('Else3 Save Customer Exception', ex.message);
					}
				} else if (assignedOooSalesRep && assignedOooSalesRep != null && assignedOooSalesRep != undefined) {
					if (queue_availableSalesRep.indexOf(assignedOooSalesRep) >= 0) {
						/*
						loadedCustomer.setValue({
							fieldId: 'custentityrep_assigned_to_form_ooo',
							value: assignedOooSalesRep
						});
						try
						{
							var saved_customer = loadedCustomer.save({
								enableSourcing: false,
								ignoreMandatoryFields: true
							});
							log.debug('Saved Customer ID:', saved_customer);
							queue_availableSalesRep.push(queue_availableSalesRep.splice(queue_availableSalesRep.indexOf(assignedOooSalesRep),1)[0]);
							log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
						}
						catch(ex)
						{
							log.debug('else if Save Customer Exception', ex.message);
						}
						*/

						queue_availableSalesRep.push(queue_availableSalesRep.splice(queue_availableSalesRep.indexOf(assignedOooSalesRep), 1)[0]);
						log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
					} else {
						loadedCustomer.setValue({
							fieldId: 'custentityrep_assigned_to_form_ooo',
							value: queue_availableSalesRep[0]
						});
						try {
							var saved_customer = loadedCustomer.save({
								enableSourcing: false,
								ignoreMandatoryFields: true
							});
							log.debug('Saved Customer ID:', saved_customer);
							queue_availableSalesRep.push(queue_availableSalesRep.shift());
							log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
						} catch (ex) {
							log.debug('else5 Save Customer Exception Occured', ex.message);
						}
					}
				} else {
					loadedCustomer.setValue({
						fieldId: 'custentityrep_assigned_to_form_ooo',
						value: queue_availableSalesRep[0]
					});
					try {
						var saved_customer = loadedCustomer.save({
							enableSourcing: false,
							ignoreMandatoryFields: true
						});
						log.debug('Saved Customer ID:', saved_customer);
						queue_availableSalesRep.push(queue_availableSalesRep.shift());
						log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
					} catch (ex) {
						log.debug('else 6 Save Customer Exception', ex.message);
					}
				}
			}
			/*
			var scriptDeployment = record.load({
				type: record.Type.SCRIPT_DEPLOYMENT,
				id: 9725		// Change for Production
			});
			var temp1 = [];
			temp1.push(formatDate(new Date()));
			var setData = temp1.concat(queue_availableSalesRep);
			log.debug('Set Data: ', JSON.stringify(setData));
			scriptDeployment.setValue({
				fieldId: 'custscript_sales_rep_queue',
				value: JSON.stringify(setData)
			});
			try
			{
				var savedRecord = scriptDeployment.save({
					enableSourcing: false,
					ignoreMandatoryFields: true
				});
				log.debug('Saved Record: ', savedRecord);
			}
			catch(ex)
			{
				log.debug('Save Deployment Exception', ex.message);
			}
			*/
			deployment_record.setValue({
				fieldId: 'custscript_queue_available',
				value: JSON.stringify(queue_availableSalesRep)
			});
			try {
				var saved_deployment = deployment_record.save({
					enableSourcing: false,
					ignoreMandatoryFields: true
				});
				log.debug('Reduce Saved Deployment: ', saved_deployment);
			} catch (ex) {
				log.debug('Reduce Saved Deployment - Exception Occured', ex.message);
			}
		}
		else
		{
			log.debug('No Data in queue available', 'Please verify the data in queue. If the data is suppossed to be there in the Sales Rep Queue, then please clear the Deployment parameters.');
		}
    }

    function summarize(summaryContext) {
        if (summaryContext.inputSummary.error) {
            log.debug('Input Error', summaryContext.inputSummary.error);
        };
        summaryContext.reduceSummary.errors.iterator().each(function(key, error) {
            log.debug('Reduce Error for key: ' + key, error);
            return true;
        });
    }

    function getSalesRepQueue() {
        var queue_availableSalesRep = [];
        var set_sales_rep_queue = [];

        var deployment_record = record.load({
            type: record.Type.SCRIPT_DEPLOYMENT,
            id: 9725 // Change for Production
        });
        var script_parameter_sales_rep_queue = deployment_record.getValue({
            fieldId: 'custscript_sales_rep_queue'
        });

        if (script_parameter_sales_rep_queue && script_parameter_sales_rep_queue != undefined && script_parameter_sales_rep_queue != null) {
            var temp = JSON.parse(script_parameter_sales_rep_queue);
            log.debug('Parameter First variable', temp[0]);
            log.debug('formatDate(new Date())', formatDate(new Date()));
            if (temp[0] == formatDate(new Date())) {
                temp.shift();
                queue_availableSalesRep = temp;
                log.debug('Today Date found in parameter. Queue: ', queue_availableSalesRep);
                deployment_record.setValue({
                    fieldId: 'custscript_queue_available',
                    value: JSON.stringify(queue_availableSalesRep)
                });
            } else {
                var saleRepSearchObj = search.create({
                    type: "employee",
                    filters: [
                        ["salesrep", "is", "T"],
                        "AND",
                        ["isinactive", "is", "F"],
                        "AND",
                        ["formulanumeric: CASE WHEN TO_CHAR({today}, 'D') = '2' AND {custentitymonday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '3' AND {custentitytuesday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '4' AND {custentitywednesday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '5' AND {custentitythursday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '6' AND {custentityfriday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '7' AND {custentitysaturday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '7' AND {custentitysunday_forms} = 'T' THEN 1 ELSE 0 END", "equalto", "1"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "internalid",
                            label: "Internal ID"
                        })
                    ]
                });
                saleRepSearchObj.run().each(function(result) {
                    var rep_id = result.getValue({
                        name: 'internalid'
                    });
                    log.debug("rep_id: ", rep_id);
                    queue_availableSalesRep.push(rep_id);
                    return true;
                });
                log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
                var temp1 = [];
                temp1.push(formatDate(new Date()));
                set_sales_rep_queue = temp1.concat(queue_availableSalesRep);
                deployment_record.setValue({
                    fieldId: 'custscript_sales_rep_queue',
                    value: JSON.stringify(set_sales_rep_queue)
                });
                deployment_record.setValue({
                    fieldId: 'custscript_queue_available',
                    value: JSON.stringify(queue_availableSalesRep)
                });
                try {
                    var saved_deployment = deployment_record.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });
                    log.debug('1 Saved Deployment: ', saved_deployment);
                } catch (ex) {
                    log.debug('Saved Deployment - Exception Occured', ex.message);
                }
            }
        } else {
            var saleRepSearchObj = search.create({
                type: "employee",
                filters: [
                    ["salesrep", "is", "T"],
                    "AND",
                    ["isinactive", "is", "F"],
                    "AND",
                    ["formulanumeric: CASE WHEN TO_CHAR({today}, 'D') = '2' AND {custentitymonday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '3' AND {custentitytuesday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '4' AND {custentitywednesday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '5' AND {custentitythursday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '6' AND {custentityfriday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '7' AND {custentitysaturday_forms} = 'T' THEN 1 WHEN TO_CHAR({today}, 'D') = '7' AND {custentitysunday_forms} = 'T' THEN 1 ELSE 0 END", "equalto", "1"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        label: "Internal ID"
                    })
                ]
            });
            saleRepSearchObj.run().each(function(result) {
                var rep_id = result.getValue({
                    name: 'internalid'
                });
                log.debug("rep_id: ", rep_id);
                queue_availableSalesRep.push(rep_id);
                return true;
            });
            log.debug("queue_availableSalesRep: ", JSON.stringify(queue_availableSalesRep));
            var temp1 = [];
            temp1.push(formatDate(new Date()));
            set_sales_rep_queue = temp1.concat(queue_availableSalesRep);
            deployment_record.setValue({
                fieldId: 'custscript_sales_rep_queue',
                value: JSON.stringify(set_sales_rep_queue)
            });
            deployment_record.setValue({
                fieldId: 'custscript_queue_available',
                value: JSON.stringify(queue_availableSalesRep)
            });
            try {
                var saved_deployment = deployment_record.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });
                log.debug('Saved Deployment: ', saved_deployment);
            } catch (ex) {
                log.debug('2. Saved Deployment - Exception Occured', ex.message);
            }
        }
    }

    function formatDate(date) {
        return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});