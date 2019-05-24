/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/ui/serverWidget', 'N/url', 'N/task'],
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
            var productionForm = serverWidget.createForm({
                title: 'Production Recon Dashboard'
            });
           // productionForm.clientScriptFileId = 28644498; 
          productionForm.clientScriptModulePath = 'SuiteScripts/ProductionReconClient.js';
          productionForm.addTab({
                id: 'report',
                label: 'Repairs'
            });
            addReconSublist(productionForm);
            getSearchData(productionForm);

            response.writePage(productionForm);

        }

        function addReconSublist(form) {

            var sublist = form.addSublist({
                id: 'reconsublist',
                type: serverWidget.SublistType.LIST,
                label: 'Repairs'
            });
			
			  sublist.addField({
                id: 'custpage_trans_date_field',
                type: serverWidget.FieldType.DATE,
                label: 'Date'
            });
			

            sublist.addField({
                id: 'custpage_type_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Type'
            });


            sublist.addField({
                id: 'custpage_post_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Type of Order'
            });
            sublist.addField({
                id: 'custpage_doc_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Document Number'
            });


            sublist.addField({
                id: 'custpage_name_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Name'
            });

            sublist.addField({
                id: 'custpage_t_status_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Status'
            });

            sublist.addField({
                id: 'custpage_status_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Status of Repairs/Resizes'
            });

            sublist.addField({
    		id:'custpage_so_notes_field',
    		type: serverWidget.FieldType.TEXTAREA,
    		label: 'Notes(Upd)'
			});

            sublist.addField({
                id: 'custpage_test_field',
                type: serverWidget.FieldType.DATE,
                label: 'Production Recon Date'
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.ENTRY
            });

            sublist.addField({
                id: 'custpage_amt_paid_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Amount Paid'
            });

            sublist.addField({
                id: 'custpage_total_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Total'
            });

            sublist.addField({
                id: 'custpage_order_ch_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Ordered with CH'
            });

            sublist.addField({
                id: 'custpage_dc_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Diamond Confirmed'
            });

            sublist.addField({
                id: 'custpage_dd_field',
                type: serverWidget.FieldType.TEXT,
                label: 'DD'
            });

            sublist.addField({
                id: 'custpage_date_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Date Rx from Customer'
            });

            sublist.addField({
                id: 'custpage_location_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Item Location'
            });

            sublist.addField({
                id: 'custpage_sr_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Sales Rep'
            });

            sublist.addField({
                id: 'custpage_op_status_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Ops/CS Status'
            });

            sublist.addField({
                id: 'custpage_op_notes_field',
                type: serverWidget.FieldType.TEXT,
                label: 'OPS/CS Status Notes'
            });
            sublist.addField({
                id: 'custpage_internal_field',
                type: serverWidget.FieldType.TEXT,
                label: 'INTERNAL ID'
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
          sublist.addField({
                id: 'custpage_temp_doc_field',
                type: serverWidget.FieldType.TEXT,
                label: 'Doc Number'
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            sublist.addButton({
                id: 'custpage_recon',
                label: 'Bulk Recon',
                functionName: 'bulkRecon'
            });

            sublist.addButton({
                id: 'custpage_update_record',
                label: 'Update',
                functionName: 'updateRecords'
            });

        }

        function getSearchData(form) {

            var sublistObj = form.getSublist({
                id: 'reconsublist'
            });
			
            var reconField = sublistObj.getField({
                id: 'custpage_test_field'
            });

            reconField.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.ENTRY
            });

            var prodSearch = search.load({
                //id: 'customsearch_production_recon_search'
                id: 'customsearch10208'
            });
			var i= 0;
            prodSearch.run().each(function(result) {
				
                var customerURL = url.resolveRecord({
                    recordType: 'customer',
                    recordId: result.getValue({name: 'entity'}),
                    isEditMode: false
                });

                var salesOrdURL = url.resolveRecord({
                    recordType: 'salesorder',
                    recordId: result.id,
                    isEditMode: false
                });
              
              if(result.getValue({name: 'tranid'}))
                sublistObj.setSublistValue({
                  id:'custpage_temp_doc_field',
                  line:i,
                  value:result.getValue({name: 'tranid'})
                });
              

                var customerURL_f = "<a href=" + customerURL + ">" + result.getText({
                    name: 'entity'
                }) + "</a>";
                var salesOrdURL_f = "<a href=" + salesOrdURL + ">" + result.getValue({
                    name: 'tranid'
                }) + "</a>";

                if(result.getValue({ name: 'trandate'}))
	                sublistObj.setSublistValue({
	                    id: 'custpage_trans_date_field',
	                    line: i,
	                    value: result.getValue({ name: 'trandate'})
	                });
                
                if(result.getText({ name: 'custbody87'}))
	                sublistObj.setSublistValue({
	                    id: 'custpage_post_field',
	                    line: i,
	                    value: result.getText({ name: 'custbody87'})
	                });
                
                if(result.id)
	                sublistObj.setSublistValue({
	                    id: 'custpage_internal_field',
	                    line: i,
	                    value: result.id
	                });
                
                if(result.getText({name: 'type'}))
	                sublistObj.setSublistValue({
	                    id: 'custpage_type_field',
	                    line: i,
	                    value: result.getText({name: 'type'})
	                });
                
                if(salesOrdURL_f)
	                sublistObj.setSublistValue({
	                    id: 'custpage_doc_field',
	                    line: i,
	                    value: salesOrdURL_f
	                });
                
                if(customerURL_f)
	                sublistObj.setSublistValue({
	                    id: 'custpage_name_field',
	                    line: i,
	                    value: customerURL_f
	                });
                
                if(result.getText({name: 'statusref' }))
	                sublistObj.setSublistValue({
	                    id: 'custpage_t_status_field',
	                    line: i,
	                    value: result.getText({name: 'statusref' })
	                });
				

				//Status of Repairs/Resizes
                if(result.getText({name: 'custbody142' }))
					sublistObj.setSublistValue({
	                id: 'custpage_status_field',
	                line: i,
	                value: result.getText({name: 'custbody142' })
					});
				// Notes(Upd)
                	var notes = result.getValue({name: 'custbody58' });
                    notes = notes.substring(1, 300);
                    if(notes){
					sublistObj.setSublistValue({
					id:'custpage_so_notes_field',
					line: i,
	                value: notes
					});
                }

                if(result.getValue({name: 'custbody_productionrecondate' }))
                	sublistObj.setSublistValue({
	                id: 'custpage_test_field',
	                line: i,
	                value: result.getValue({name: 'custbody_productionrecondate' }) //'Production Recon Date'
                	});
		
             if(result.getValue({name: 'custbody55' }))
            	 	sublistObj.setSublistValue({
	                id: 'custpage_amt_paid_field',
	                line: i,
	                value: result.getValue({name: 'custbody55' }) //Amount Paid
            	 	});
             
             if(result.getValue({name: 'amount' }))
            	 	sublistObj.setSublistValue({
	                id: 'custpage_total_field',
	                line: i,
	                value: result.getValue({name: 'amount' }) //Total
            	 	});
             
			if(result.getText({name: 'custbody11' }))
	            	sublistObj.setSublistValue({
	                id: 'custpage_order_ch_field',
	                line: i,
	                value: result.getText({name: 'custbody11' }) //Ordered with CH
	            	});
			
			if(result.getText({name: 'custbody28' }))
	            	sublistObj.setSublistValue({
	                id: 'custpage_dc_field',
	                line: i,
	                value: result.getText({name: 'custbody28' }) //Diamond Confirmed
	            	});
			
             if(result.getValue({name: 'custbody6' }))
            	 	sublistObj.setSublistValue({
	                id: 'custpage_dd_field',
	                line: i,
	                value: result.getValue({name: 'custbody6' }) //DD
            	 	});
             
             if(result.getValue({name: 'custbody36' }))
            	 	sublistObj.setSublistValue({
	                id: 'custpage_date_field',
	                line: i,
	                value: result.getValue({name: 'custbody36' }) //Date Rx from Customer
            	 	});
             
             if(result.getText({name: 'custbody245' }))
            	 	sublistObj.setSublistValue({
	                id: 'custpage_location_field',
	                line: i,
	                value: result.getText({name: 'custbody245' }) //Item Location
            	 	});
             
             if(result.getText({name: 'salesrep' }))
            	 sublistObj.setSublistValue({
                id: 'custpage_sr_field',
                line: i,
                value: result.getText({name: 'salesrep' }) //Sales Rep
            	 });

             if(result.getText({name: 'custbodyops_cs_status' }))
            	 sublistObj.setSublistValue({
                id: 'custpage_op_status_field',
                line: i,
                value: result.getText({name: 'custbodyops_cs_status' }) //Ops/CS Status
            	 });

            	 var statusNotes = result.getValue({name: 'custbodyops_cs_status_notes' });
            	 statusNotes = statusNotes.substring(1, 300);
            	 if(statusNotes){
            	 sublistObj.setSublistValue({
                id: 'custpage_op_notes_field',
                line: i,
                value: statusNotes //OPS/CS Status Notes
            	 });
             }
			i++;
			return true;
            });
        }
        return {
            onRequest: onRequest
        };
    });