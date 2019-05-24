/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/url','N/error', 'N/record'],

function(url, error, record) {
  	var cntxt;

    function pageInit(context) {
    	var rtpPOs = [];
    	var nrtpPOs = [];
    	var curRecord = context.currentRecord;
        var lineCount = curRecord.getLineCount({sublistId: 'custpage_list_ready_to_pull'});
        
       // Count Transactions on Ready to Pull
        /**/
        for(var ln = 0; ln < lineCount; ln++){

        	var sublistPoId = curRecord.getSublistValue({
               sublistId: 'custpage_list_ready_to_pull',
        		fieldId : 'custpage_internalid',
        		line: ln
        		});
        	var foundLoc = rtpPOs.indexOf(sublistPoId);
			if(foundLoc < 0)
				rtpPOs.push(sublistPoId);
        }
        /**/
    	context.currentRecord.setValue({fieldId: 'custpage_count_rp', value: rtpPOs.length});
    	
    	var lineCount1 = curRecord.getLineCount({sublistId: 'custpage_list_not_ready_to_pull'});
    	
    	// Count Transactions on Not Ready to Pull
        /**/
        for(var ln = 0; ln < lineCount1; ln++){

        	var sublistPoId = curRecord.getSublistValue({
               sublistId: 'custpage_list_not_ready_to_pull',
        		fieldId : 'custpage_internalid',
        		line: ln
        		});
        	var foundLoc = nrtpPOs.indexOf(sublistPoId);
			if(foundLoc < 0)
				nrtpPOs.push(sublistPoId);
        }
        /**/
    	context.currentRecord.setValue({fieldId: 'custpage_count_nrp', value: nrtpPOs.length});
    	cntxt = context;
        window.ischanged = false;
    }
    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     * @param {string} context.fieldId - Field name
     * @param {number} context.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} context.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(context) {
      //console.log(context);
 	var curRec = context.currentRecord;
    	if(context.sublistId == 'custpage_list_ready_to_pull'){
    		var subListId = 'custpage_list_ready_to_pull';
    		if(context.fieldId == 'custpage_print'){
    			
    			var printValue = curRec.getCurrentSublistValue({
    				sublistId: subListId,
    				fieldId: 'custpage_print'
    				});
    			
              var totRowSel = parseInt(curRec.getValue({fieldId: 'custpage_total_select_rp'})) || 0;
              if(printValue){
                
                var numLines = curRec.getLineCount({
                	sublistId: subListId
                	});
                var poId = curRec.getCurrentSublistValue({
    				sublistId: subListId,
    				fieldId: 'custpage_internalid'
    				});
                var objSublist = curRec.getSublist({
                	sublistId: subListId
                	});
                for(var ln = 0; ln < numLines; ln++){

                	var sublistPoId = curRec.getSublistValue({
                       sublistId: subListId,
                		fieldId : 'custpage_internalid',
                		line: ln
                		});
                		if(sublistPoId == poId){
                          curRec.selectLine({
								sublistId: subListId,
								line: ln
								});
                          curRec.setCurrentSublistValue({
    							sublistId: subListId,
    							fieldId: 'custpage_print',
                           	 	value: true,
                                ignoreFieldChange: true
    						});
                          curRec.commitLine({
                        	  sublistId: subListId
                        	  });
                          totRowSel++;
                		}
                	}
                }
    			else{
                    var numLines = curRec.getLineCount({
                    	sublistId: subListId
                    	});
                    var poId = curRec.getCurrentSublistValue({
        				sublistId: subListId,
        				fieldId: 'custpage_internalid'
        				});
                    var objSublist = curRec.getSublist({
                    	sublistId: subListId
                    	});
                    for(var ln = 0; ln < numLines; ln++){

                    	var sublistPoId = curRec.getSublistValue({
                           sublistId: subListId,
                    		fieldId : 'custpage_internalid',
                    		line: ln
                    		});
                    		if(sublistPoId == poId){
                              curRec.selectLine({
    								sublistId: subListId,
    								line: ln
    								});
                              curRec.setCurrentSublistValue({
        							sublistId: subListId,
        							fieldId: 'custpage_print',
                               	   value: false,
                                  ignoreFieldChange: true
        						});
                              curRec.commitLine({
                            	  sublistId: subListId
                            	  });
                              totRowSel--;

                    		}
                      }
                  }
    		}
    	}
      if(context.sublistId == 'custpage_list_not_ready_to_pull'){
    		if(context.fieldId == 'custpage_print'){
    			var printValue = curRec.getCurrentSublistValue({
    				sublistId: 'custpage_list_not_ready_to_pull',
    				fieldId: 'custpage_print'
    				});
    			subListId = 'custpage_list_not_ready_to_pull';
              var totRowSel = parseInt(curRec.getValue({fieldId: 'custpage_total_select_nrp'})) || 0;
              if(printValue){
                  var numLines = curRec.getLineCount({
                  	sublistId: subListId
                  	});
                  var poId = curRec.getCurrentSublistValue({
      				sublistId: subListId,
      				fieldId: 'custpage_internalid'
      				});
                  var objSublist = curRec.getSublist({
                  	sublistId: subListId
                  	});
                  for(var ln = 0; ln < numLines; ln++){
     
                  	var sublistPoId = curRec.getSublistValue({
                         sublistId: subListId,
                  		fieldId : 'custpage_internalid',
                  		line: ln
                  		});
                  		if(sublistPoId == poId){
                            curRec.selectLine({
  								sublistId: subListId,
  								line: ln
  								});
                            curRec.setCurrentSublistValue({
      							sublistId: subListId,
      							fieldId: 'custpage_print',
                             	 value: true,
                              ignoreFieldChange: true
      						});
                            curRec.commitLine({
                          	  sublistId: subListId
                          	  });
                  		}
                  }
                }
    			else{
                    var numLines = curRec.getLineCount({
                    	sublistId: subListId
                    	});
                    var poId = curRec.getCurrentSublistValue({
        				sublistId: subListId,
        				fieldId: 'custpage_internalid'
        				});
                    var objSublist = curRec.getSublist({
                    	sublistId: subListId
                    	});
                    for(var ln = 0; ln < numLines; ln++){
 
                    	var sublistPoId = curRec.getSublistValue({
                           sublistId: subListId,
                    		fieldId : 'custpage_internalid',
                    		line: ln
                    		});
                    		if(sublistPoId == poId){
                              curRec.selectLine({
    								sublistId: subListId,
    								line: ln
    								});
                              curRec.setCurrentSublistValue({
        							sublistId: subListId,
        							fieldId: 'custpage_print',
                               	 value: false,
                                ignoreFieldChange: true
        						});
                              curRec.commitLine({
                            	  sublistId: subListId
                            	  });
                    	}
                    }
                }
    		}
    	}
    }
    
    // function to print labels
      function createZplLabel(){ 
         window.ischanged = false;
    	//Printing Purchase Order Stickers
		createLabels();
        setTimeout(function() {
    		window.location.href = window.location.href; }, 5000);
    }

    function createLabels(){	
    	var curRecord  = cntxt.currentRecord;
		var counter = 0;
		var zpl = '';
		var arrayPOs = [];
		var arrItem = [];
		var itemCounter = 0;
		var totalInsurance = 0;
		var subLists = ['custpage_list_ready_to_pull','custpage_list_not_ready_to_pull'];
		var zplAllPOs = '';
		var zplPO = '';
		var zplItems = '';

    	for(var subLn = 0; subLn < subLists.length; subLn++){
    		var subListId = subLists[subLn];
	
			var subListLines = curRecord.getLineCount({sublistId: subListId});
			
			for(var lineNbr = 0; lineNbr < subListLines; lineNbr++)
			{
				 var yesPrint = curRecord.getSublistValue({
						sublistId: subListId,
						fieldId: 'custpage_print',
						line: lineNbr
						});
				 
				if(yesPrint == true){
					var intrId = curRecord.getSublistValue({
						sublistId: subListId, fieldId: 'custpage_internalid',	line: lineNbr});
					
					var intIdLoc = arrayPOs.indexOf(intrId);
					if(intIdLoc < 0){
						/*if not found then add Internal Id of PO to the array*/
						arrayPOs.push(intrId);
						/*Initialise item count and sum of insurance to zero for new PO*/
						totalInsurance = 0;
						arrItem = [];
						itemCounter = 0;

						var lastName = curRecord.getSublistValue({
							sublistId: subListId, fieldId: 'custpage_last_name', line: lineNbr});
						var purchaseOrder = curRecord.getSublistValue({
							sublistId: subListId, fieldId: 'custpage_po', line: lineNbr});
						var PO_DocNbr = curRecord.getSublistValue({
							sublistId: subListId, fieldId: 'custpage_po_doc_nbr', line: lineNbr});
						var vendor = curRecord.getSublistValue({
							sublistId: subListId, fieldId: 'custpage_vendor', line: lineNbr});
						var salesOrder = curRecord.getSublistValue({
							sublistId: subListId, fieldId: 'custpage_so_doc_nbr', line: lineNbr});
						
						/*Item count for a PO*/
						var PO_TotalItemCount = getItemsCount(subListId, intrId);
						/*find sum of all line item insurance for this PO*/
						
							var subListLn = curRecord.getLineCount({sublistId: subListId}); 
							
					    	for(var lineNm = 0; lineNm < subListLn; lineNm++)
							{
					    		var intrIdSrch = curRecord.getSublistValue({
									sublistId: subListId, fieldId: 'custpage_internalid', line: lineNm });
					    		
					    		if(intrIdSrch == intrId){
					    			
					    			var itemSrch = curRecord.getSublistValue({
										
					    				sublistId: subListId, fieldId: 'custpage_item_upd', line: lineNm });
					    			/*Check for duplicate items*/ // removed this criteria 0914
						    			arrItem.push(itemSrch);
						    			
						    			var qtyToPullSrch = curRecord.getSublistValue({
											sublistId: subListId, fieldId: 'custpage_qty_pull', line: lineNm });
						    			var itemTxtSrch = curRecord.getSublistText({
											sublistId: subListId, fieldId: 'custpage_item_txt', line: lineNm });
						    			var descrSrch = curRecord.getSublistValue({
											sublistId: subListId, fieldId: 'custpage_descr', line: lineNm });
						    			var certSrch = curRecord.getSublistValue({
											sublistId: subListId, fieldId: 'custpage_certificate', line: lineNm });
						    			var originSrch = curRecord.getSublistValue({
											sublistId: subListId, fieldId: 'custpage_origin', line: lineNm });
						    			var holdBinderSrch = curRecord.getSublistValue({
											sublistId: subListId, fieldId: 'custpage_hold_binder', line: lineNm });
						    			var specGemSrch = curRecord.getSublistValue({
											sublistId: subListId, fieldId: 'custpage_specific_gem', line: lineNm });
						    			var insuranceSrch = curRecord.getSublistValue({
											sublistId: subListId, fieldId: 'custpage_insurance', line: lineNm });
						    			itemCounter++;
						    			totalInsurance += insuranceSrch;
                                  		
						    			var dispOrigin = '';
						    			if((originSrch) && (originSrch != 'Lab Created'))
						    				dispOrigin = 'NATURAL';
						    			
						    			var dispHoldBinder = '';
                                        if(holdBinderSrch)
						    				dispHoldBinder = 'HOLD BINDER';
                                        
						    			var dispSpecificGem = '';
						    			if(specGemSrch)
						    				dispSpecificGem = 'SPECIFIC GEM';
						    			
						    			if(certSrch)
						    				certSrch = 'CERT # ' + certSrch;
						    			
						    			var dispItemCount = itemCounter + ' of ' + PO_TotalItemCount + ' (' + PO_DocNbr + ')'; 
						    	
						    			/*Create ZPL for PO Item Sticker*/
						    			zplItems+= '^XA\n';
						    			zplItems+= '^CFF,30\n';
						    			zplItems+= '^FO20,20^FDQty -' + qtyToPullSrch + '^FS\n';
						    			zplItems+= '^CF0,20\n';
						    			zplItems+= '^FO20,60^FDStock # ' + itemTxtSrch + '^FS\n';
						    			zplItems+= '^CF0,20\n';
						    			zplItems+= '^FO20,90^FD' + descrSrch + '^FS\n';
						    			zplItems+= '^CF0,30\n';
						    			zplItems+= '^FO20,130^FD' + certSrch + '^FS\n';
						    			zplItems+= '^CFF,30\n';
						    			zplItems+= '^FO20,160^FD' + dispOrigin + '^FS\n';
                                        zplItems+= '^CF0,45\n';
						    			zplItems+= '^FO20,200^FD' + dispHoldBinder + '^FS\n';
                                        zplItems+= '^CFF,30\n';
						    			zplItems+= '^FO20,240^FD' + dispSpecificGem + '^FS\n';
						    			zplItems+= '^FO20,360^FD' + dispItemCount + '^FS\n';
						    			zplItems+= '^XZ\n';
										/*End of Create ZPL for PO Item Sticker*/
						    		}
							}
						//} commented 0914
				    	/*pass PO ids and items array to backend suitelet for status update*/
						updateItems(intrId, arrItem);
						console.log('arrItem : ' + arrItem);
						
						/*Create ZPL for PO Sticker*/
						zplPO+= '^XA\n';
						zplPO+= '^CFF,30\n';
						zplPO+= '^FO20,20^FD' + salesOrder + '^FS\n';
						zplPO+= '^FO20,60^FDLN: ' + lastName + '^FS\n';
                        zplPO+= '^CF0,40\n';
						zplPO+= '^FO20,130^FDPO #' + PO_DocNbr + '^FS\n';
                        zplPO+= '^CFF,30\n';
						zplPO+= '^FO20,170^FD' + vendor + '^FS\n';
						zplPO+= '^FO20,210^FDInsurance: ' + totalInsurance + '^FS';
						zplPO+= '^BY2,5,75\n';
						zplPO+= '^FO80,280^BC^FD' + PO_DocNbr  + '^FS\n';	
						zplPO+= '^XZ\n';
						/*End of Create ZPL for PO Sticker*/
						
						/*Append PO Item Sticker to PO Sticker*/
						zplPO+= zplItems;
						zplItems = '';
						/*End of Append PO Item Sticker to PO Sticker*/
					}
					zplAllPOs += zplPO;
					zplPO = '';
		
				}
			}

    	}
    	/* save the created zpl file to the record */
		if(zplAllPOs)
	    {
	        var zplRecord = record.create({
	        	type: 'customrecord_zpl_label_holder',
	        	isDynamic: true
	        	});
            var now = new Date();
	        var curTime = now.toString();
	        var fileName = curTime + '.zpl';
          
	        
	        zplRecord.setValue({
	        	fieldId: 'custrecord_zpl_filename',
	        	value: fileName
	        	});
	        zplRecord.setValue({
	        	fieldId: 'custrecord_zpl_data',
	        	value: zplAllPOs
	        	});
	        
	        var zplRecordId = zplRecord.save();
	        console.log('ZPL File Name :' + fileName + ' \n saved with internal Id : ' + zplRecordId);
            if(zplRecordId){
	        var param = {};
	        param.operation = 'Display';
	        param.recId = zplRecordId;
              var outUrl = url.resolveScript({
	        	scriptId: 'customscript_zag_be_vendorbox_stick_rndr',
    			deploymentId: 'customdeploy_zag_be_vendorbox_stick_rndr',
                params: param
	        	});
              
	        var newWin = window.open(outUrl,"printWin","width=400,height=400");
	        setTimeout(function(){ newWin.close(); }, 5000);
        }
	    }
    	/* End of - save the created zpl file to the record */
    }
    /*End of Function createZPLlabel*/
    
    /*Function to get total number of items for a PO*/
    function getItemsCount(itemSubList, PO_internalId){
      console.log(itemSubList);
    	var curRecord = cntxt.currentRecord;
    	var itemCount = 0;
		var subListLn = curRecord.getLineCount({sublistId: itemSubList});
		console.log(subListLn);
    	for(var lineNm = 0; lineNm < subListLn; lineNm++)
		{
    		var intrIdSrch = curRecord.getSublistValue({
				sublistId: itemSubList, fieldId: 'custpage_internalid', line: lineNm });
    		if(intrIdSrch == PO_internalId)
    			itemCount++;
		}
     return itemCount;
    }
    /*End of Function to get total number of items for a PO*/
    
    /*Function to call backend suitelet*/
    function updateItems(PO_intrId, items){
    	/*Sending PO for processing*/
     	var backendURL = url.resolveScript({
    		scriptId: 'customscript_zag_vendorbox_zpl_backend',
    		deploymentId: 'customdeploy_zag_vendorbox_zpl_backend'
    		});
     	
       var xmlRequest = new XMLHttpRequest();
        var data = {};
        data.operation = 'Update';
        data.poId = PO_intrId;
        data.itemIds = items;
       
        xmlRequest.onreadystatechange = function() {};
        
       var xmlOpen = xmlRequest.open('POST', backendURL, true);
       xmlRequest.setRequestHeader("Content-Type", "application/json");
       xmlRequest.send(JSON.stringify(data)); 
    }
    /*End of Function to call backend suitelet*/
    
	return{
      pageInit: pageInit,
      fieldChanged: fieldChanged,
      createZplLabel : createZplLabel

    };
});

