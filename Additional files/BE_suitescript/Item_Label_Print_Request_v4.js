/*
 * v2 - Contains 16 digit auto incrementing counter variable (stored in custom record)
 */
function Item_Label_Button(type)
{
	if(type=="view")
	{
		try
		{
			var id = nlapiGetRecordId();
			var url = nlapiResolveURL("SUITELET","customscript_gen_print_req","customdeploy_gen_print_req") + "&item=" + id;
			url += "&itemtype=" + nlapiGetRecordType();
			
			form.addButton("custpage_item_label","Item Label (RF-Smart)","window.open('" + url + "','prReqWin','width=500,height=300');");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Item Label Button","Details: " + err.message);
		}
	}
}

function Create_Print_Request_SL(request,response)
{
	var item = request.getParameter("item");
	var itemType = request.getParameter("itemtype");
	
	try
	{
		var itemRec = nlapiLoadRecord(itemType,item);
		
		var category = itemRec.getFieldValue("custitem20");
		
		//Retrieve current counter variable
		var counter = nlapiLookupField("customrecord_item_label_counter","1","name");
		nlapiLogExecution("audit","Counter pull from custom record",counter);
      	var upccode = itemRec.getFieldValue("upccode").toUpperCase();
		
		var itemData = {
			parent : itemRec.getFieldText("parent"),
			custitem1 : itemRec.getFieldText("custitem1"),
			custitem2 : itemRec.getFieldText("custitem2"),
			custitem_rfid_description : itemRec.getFieldValue("custitem_rfid_description"),
			custitem64 : itemRec.getFieldText("custitem64"),
			custitem200 : itemRec.getFieldText("custitem200"),
			custitem202 : itemRec.getFieldText("custitem202"),
			custitem201 : itemRec.getFieldText("custitem201"),
			custitem46 : itemRec.getFieldValue("custitem46"),
			custitem18 : itemRec.getFieldText("custitem18"),
			custitem7 : itemRec.getFieldText("custitem7"),
			upccode : upccode,
			counter : counter,
          	itemid : itemRec.getFieldValue("itemid"),
          	upccounter : upccode.concat(counter),
          	custitem63 : itemRec.getFieldText("custitem63")
		}
		
		//Get user location
		var user = nlapiGetUser();
		var location = nlapiLookupField("employee",user,"location");
		
		var printer = null;
		var label = null;
		
		var filters = [];
		filters.push(new nlobjSearchFilter("custrecord_prlm_item_category",null,"is",category));
		var cols = [];
		cols.push(new nlobjSearchColumn("custrecord_prlm_label"));
		cols.push(new nlobjSearchColumn("custrecord_prlm_printer"));
		var results = nlapiSearchRecord("customrecord_print_request_label_mapping",null,filters,cols);
		if(results)
		{
			printer = results[0].getValue("custrecord_prlm_printer");
			label = results[0].getValue("custrecord_prlm_label");
		}
		
		if(location!="2")
		{
			//SF users will run printers based of item location
			//All other locations will use printer from default location on location record
			printer = nlapiLookupField("location",location,"custrecord_default_label_printer");	
		}
	
		var printRequest = nlapiCreateRecord("customrecord_rfs_print_request",{recordmode:"dynamic"});
		printRequest.setFieldValue("custrecord_rfs_print_request_printer",printer); //Printer Name (RFID Printer - 9th Floor)
		printRequest.setFieldValue("custrecord_rfs_print_request_function","8"); //Function (Item Lookup)
		printRequest.setFieldValue("custrecord_rfs_print_request_status","1"); //Status
		printRequest.setFieldValue("custrecord_rfs_print_request_qty","1"); //Quantity
		printRequest.setFieldValue("custrecord_rfs_print_request_data",JSON.stringify(itemData)); //Print Data
		printRequest.setFieldValue("custrecord_rfs_print_request_rec_type",itemType); //Record Type
		printRequest.setFieldValue("custrecord_rfs_print_request_rec_id",item); //Record Id
		printRequest.setFieldValue("custrecord_rfs_print_request_label",label); //Label
		var printRequestId = nlapiSubmitRecord(printRequest,true,true);
		
		//Update counter
		counter = parseInt(counter,10);
		nlapiLogExecution("audit","Counter after parseInt",counter);
		
		counter++;
		nlapiLogExecution("audit","Counter after incrementing by 1",counter);
		
		counter = pad(counter,16);
		nlapiLogExecution("audit","Counter after padding zeros (this will be saved)",counter);
		
		nlapiSubmitField("customrecord_item_label_counter","1","name",counter);
		
		response.write("<p>Print Request Successfully Generated. You may close this window.</p>");
	}
	catch(err)
	{
		var message = "<p>Print Request Failed.<br/><br/>Error Details:<br/>"
			message+= err.message;
			message+= "</p>";
		
		response.write(message);
	}
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}