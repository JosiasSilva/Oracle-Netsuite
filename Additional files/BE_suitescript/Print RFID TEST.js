/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/runtime', 'N/ui/message'],
/**
 * @param {record} record
 * @param {redirect} redirect
 */
function(record, search, runtime, message) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
       

    }
    function create_RFID_label(backStockRec){
		
		var defprinter = '';
		var empLoc = '';
		var printer = '';
		var label = '';
		var funcName = '';
		var user = runtime.getCurrentUser().id;
		var empLocObj = search.lookupFields({
				type: record.Type.EMPLOYEE,
				id: user,
				columns: ["location", "location.custrecord_default_label_printer"]
				});
		//console.log("empLocObj: " + JSON.stringify(empLocObj));	
		if(empLocObj.location.length > 0)
			empLoc = empLocObj.location[0].value;
		
		if(empLocObj["location.custrecord_default_label_printer"].length > 0)
			defprinter = empLocObj["location.custrecord_default_label_printer"][0].value;
				
		//console.log("empLoc: " + empLoc + ", defprinter: " + defprinter);
		var srchObjPrintReqLabelMap = search.create({
		   type: "customrecord_print_request_label_mapping",
		   filters:
		   [
			  ["custrecord_prlm_label","anyof","20"]
		   ],
		   columns:
		   [
			  search.createColumn({name: "custrecord_prlm_label", label: "Label"}),
			  search.createColumn({name: "custrecord_prlm_printer", label: "Printer"})
		   ]
		});
		var searchResultCount = srchObjPrintReqLabelMap.runPaged().count;
		console.log("srchObjPrintReqLabelMap result count: " + searchResultCount);
		srchObjPrintReqLabelMap.run().each(function(result){
			printer = result.getValue("custrecord_prlm_printer");
			label = result.getValue("custrecord_prlm_label");
			});
		console.log("printer: " + printer + ", label: " + label );
		//if(empLoc != '2')	printer = defprinter;
		
		var itemData = {
			custrecord_item_name : backStockRec.getText("custrecord_item_name"),
			custrecord_upc_counter : backStockRec.getValue("custrecord_upc_counter"),
			custrecord_matrix_item : backStockRec.getText("custrecord_matrix_item"),			
			custrecord_stone_shape : backStockRec.getText("custrecord_stone_shape"),
			custrecord_measurement_1 : backStockRec.getValue("custrecord_measurement_1"),
			custrecord_rfid_description : backStockRec.getValue("custrecord_rfid_description")		
		};
		//console.log("itemData: " + JSON.stringify(itemData));
		var printRequest = record.create({type:"customrecord_rfs_print_request",isDynamic: true});
		printRequest.setValue("custrecord_rfs_print_request_printer",printer); //Printer Name (RFID Printer - 9th Floor)
		printRequest.setValue("custrecord_rfs_print_request_function","8"); //Function (Item Lookup) 8
		printRequest.setValue("custrecord_rfs_print_request_status","1"); //Status
		printRequest.setValue("custrecord_rfs_print_request_qty","1"); //Quantity
		printRequest.setValue("custrecord_rfs_print_request_data",JSON.stringify(itemData)); //Print Data
		printRequest.setValue("custrecord_rfs_print_request_rec_type",backStockRec.type); //Record Type
		printRequest.setValue("custrecord_rfs_print_request_rec_id",backStockRec.id); //Record Id
		printRequest.setValue("custrecord_rfs_print_request_label",label); //Label 15
		var printRequestId = printRequest.save(printRequest,true,true);
		if(printRequestId)
			console.log('printRequestId created with rec id: ' + printRequestId);
	}
    function rfidPrint(backStockId){
    	console.log('backStockId ='+backStockId);
		/*var myMsg = message.create({
		  title: 'Backstock Item',
		  message: 'Generating Print Request. Please wait...',
		  type: message.Type.INFORMATION
		});
		myMsg.show();*/
		//setTimeout(5000);
    	var backStockRec = record.load({
			type: 'customrecord_backstock_item',
			id: backStockId,
			isDynamic: true
		});
    	var upcCode = backStockRec.getValue({
         	fieldId: 'custrecord_upc_counter'
 			});
		create_RFID_label(backStockRec);
    	console.log('upcCode ='+upcCode);
    	if(upcCode)
		{
			var itemLabelId = 1;
    		var itemlabel = search.lookupFields({
				type: 'customrecord_item_label_counter',
				id: itemLabelId,
				columns: ['name']
				});
			
			var itemlabelCounter = itemlabel.name;
			console.log("itemlabel: " + JSON.stringify(itemlabel));
			console.log("itemlabelCounter: " + itemlabelCounter);
			itemlabelCounter = parseInt(itemlabelCounter,10);
			itemlabelCounter++;
			itemlabelCounter = pad(itemlabelCounter,16);
			console.log("itemlabelCounter: " + itemlabelCounter);
			var submitFieldsPromise = record.submitFields.promise({
    				type: 'customrecord_item_label_counter',
    				id: itemLabelId,
    				values: {
    				name: itemlabelCounter
    				},
				});
		}
		//myMsg.hide();
        var myMsg = message.create({
          title: 'Backstock Item',
		  message: 'Print Request Generated.',
          type: message.Type.CONFIRMATION
        });
        myMsg.show();
    	//window.location.reload();
    }
    function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
    return {
        pageInit: pageInit,
        rfidPrint: rfidPrint,     
    };
    
});
