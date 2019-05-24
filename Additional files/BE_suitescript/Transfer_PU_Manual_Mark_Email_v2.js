nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Transfer_PU_Manual_Mark_Email(type)
{
	if(type=="edit")
	{
		try
		{
			var context = nlapiGetContext();
			
			//Only execute if a user is manually making the change. We don't want this to trigger during the scheduled script.
			if(context.getExecutionContext()=="userinterface")
			{
				var ifRec = nlapiGetNewRecord();
				
				if(ifRec.getFieldValue("custbody89")=="2" && nlapiGetOldRecord().getFieldValue("custbody89")!="2")
				{
					var soId = ifRec.getFieldValue("createdfrom");
					nlapiLogExecution("debug","Created From Sales Order",soId);
					
					if(soId!=null && soId!="")
					{
						//Check if it's a pick-up order for LA, Boston, or Chicago. If so, need to do inventory transfers.
						var soFields = nlapiLookupField("salesorder",soId,["custbody53","custbody_pickup_location"]);
						nlapiLogExecution("debug","Is Pick-up Order?",soFields.custbody53);
						nlapiLogExecution("debug","Pick-up Location",soFields.custbody_pickup_location);
						
						if(soFields.custbody53=="T" && (soFields.custbody_pickup_location=="2" || soFields.custbody_pickup_location=="3" || soFields.custbody_pickup_location=="4"))
						{
							var puLocation;
							switch(soFields.custbody_pickup_location)
							{
								case "2":
									puLocation = "10"; //Los Angeles
									break;
								case "3":
									puLocation = "14"; //Boston
									break;
								case "4":
									puLocation = "18"; //Chicago
									break;
							}
							
							nlapiLogExecution("debug","Pick-up Order, Transferring Inventory","Sales Order ID: " + soId + "\n\nLocation: " + puLocation);
							
							transferReceivedItemsToLocation(soId,puLocation);
							transferNonSpecialOrderSalesOrderCommittedQuantitesToLocation(soId,puLocation);
						}
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Transferring PU Items (Manual)","Details: " + err.message);
		}
	}
}

/**
 * transfer items to location by creating an inventory transfer
 * @param {Integer} destLocation   the location to transfer the items to
 * @return {Array | nlobjRecord[]} createdRecords    the newly created records
 */
function transferReceivedItemsToLocation(order,location) { 
	nlapiLogExecution('debug','hi', 'transferReceivedItem');
	//NewlyCreatedRecord[]
	var newlyCreatedRecords = [];

	/*Get Special Order POs for this SO*/
	var orderObj = nlapiLoadRecord("salesorder",order);
	
	var poIds = [];
	for (var i = 1; i <= orderObj.getLineItemCount('item'); i++)
		if (orderObj.getLineItemValue('item', 'creatpo', i) && orderObj.getLineItemValue('item','location',i)!=location)
			poIds.push(orderObj.getLineItemValue('item', 'creatpo', i));
			
	nlapiLogExecution('debug','poIds',JSON.stringify(poIds));

	/*Get POs created from this SO*/
	var results = Util.search('purchaseorder', null, [new nlobjSearchFilter('createdfrom', null, 'is', order), new nlobjSearchFilter('mainline', null, 'is', 'T')]);
	if (results) {
		for (var i = 0; i < results.length; i++)
			poIds.push(results[i].getId());
	}
	poIds = poIds.unique();
	if (poIds.length < 1)
		return newlyCreatedRecords;

	/* loading each IR record is a workaround for NS bug whereby nlobjSearchResult.getValue('unit') return text value not id*/
	results = Util.search('itemreceipt', null, [new nlobjSearchFilter('createdfrom', null, 'anyof', poIds), new nlobjSearchFilter('mainline', null, 'is', 'T')]/*, new nlobjSearchFilter('location', null, 'noneof', location)], ['unit', 'item', 'quantity', 'location']*/);
	if (!results)
		return newlyCreatedRecords;
	
	var tos ={}; //place holder for data to create transfer order
	var trans = [] //place holder for the transfer orders 
	//iterate all item receipt in the for pos created
	for (var i = 0; i < results.length; i++) {
		//r is an item reipt
		nlapiLogExecution('debug','Item REceipt ID: ' + results[i].getId());
		
		var r = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		//iterate the whole result, figure out how many transfer orders need to be created and from where to where
		var len = r.getLineItemCount('item');
		for(var j=1;j<=len;j++){
			var fromlocation = r.getLineItemValue('item', 'location', j);
			//if the item receipt item TO location is the same as the this location, ignore
			nlapiLogExecution('debug','from/to',fromlocation+'/'+location);
			if ( fromlocation == location)
				continue;
			//if the location differs, add an entry to the transfer order place holder
			if(!tos[fromlocation]){
				tos[fromlocation]= [];
			}
			var filters1 = [];
			filters1.push(new nlobjSearchFilter("locationquantityonhand",null,"greaterthan","0"));
			filters1.push(new nlobjSearchFilter("internalid",null,"is",r.getLineItemValue('item', 'item', j)));
			var cols1 = [];
			cols1.push(new nlobjSearchColumn("inventorylocation"));
			var results1 = nlapiSearchRecord("item",null,filters1,cols1);
			if(results1)
			{
				if(results1[0].getValue("inventorylocation")!=location)
				{
					tos[fromlocation].push({
						'item': r.getLineItemValue('item', 'item', j),
						'quantity': r.getLineItemValue('item', 'quantity', j),
						'units':r.getLineItemValue('item', 'units', j),
					});
				}
			}
			else
			{
				tos[fromlocation].push({
					'item': r.getLineItemValue('item', 'item', j),
					'quantity': r.getLineItemValue('item', 'quantity', j),
					'units':r.getLineItemValue('item', 'units', j),
				});
			}
		}
	}
	for(var x in tos) {
		nlapiLogExecution('debug','transfer from '+x,tos[x[0]['item']]);
	}
	//iterate T(ransfer)O(rder)s place holder and create tranferorders
	
	nlapiLogExecution('debug','tos',JSON.stringify(tos));

	for(var p in tos) {
		if(!tos.hasOwnProperty(p)||typeof tos[p]==='function')
			continue;
		//create transfer order, fulfill and receive, revert whenever failed
		var from = p,
		to = location,
		items = tos[p],
		lines = [],
		createdR = [], // temp holder for newly created records in this iteration
		transferorder,
		itemfulfillment,
		itemreceipt,
		tran = [],
		step;

		//before transfer, set the locations on the salesorder so that the committed item should be available at source location
		//only do this once
		
		//do the transfer
		try {
			nlapiLogExecution('debug','from: '+from, 'to: '+to);
			step = 'to';
			if(items.length > 0)
			{
				//create a transfer order
				var transfer = nlapiCreateRecord('inventorytransfer');
				transfer.setFieldValue('memo', 'BE Fulfill: Automated Inventory Transfer for Item Fulfillment purposes. SO # ' + orderObj.getFieldValue('tranid'));
				transfer.setFieldValue('location', from);
				transfer.setFieldValue('transferlocation', to);
				//add line items
				for(var x=0,xlen = items.length;x<xlen;x++) {
					transfer.selectNewLineItem('inventory');
					transfer.setCurrentLineItemValue('inventory', 'item', items[x].item);
					transfer.setCurrentLineItemValue('inventory', 'adjustqtyby', items[x].quantity);
					//transfer.setCurrentLineItemValue('item', 'amount', 0.00);
					transfer.setCurrentLineItemValue('inventory', 'units', items[x].units);
					transfer.commitLineItem('inventory');
					//construct lines, which is attached with newlyCreatedRecords
					lines.push({
						'item': items[x].item,
						'quantity' : items[x].quantity,
						'location': items[x].location,
						'units': items[x].units,
						'adjustqtyby': 0, // not involved
						'unitcost': 0 //not involved
					});
				}
				//create transfer order
				transferorder = nlapiSubmitRecord(transfer, true, false);
				tran.push(transferorder);
				nlapiLogExecution('debug','inventory transfer',transferorder);
				step = 'ff';
				createdR.push({
					label: 'Inventory Transfer',
					type: 'inventorytransfer',
					internalid: transferorder,
					tranid: nlapiLookupField('inventorytransfer',transferorder,'tranid'),
					items: lines
				});

				//check if the fulfillment has all the items in the transfer order fulfilled
				nlapiLogExecution('debug','verifying itemfulfillment for transfer order');	
			}

			//if everything works concat the temp createdR with newlyCreatedRecord
			//newlyCreatedRecords = newlyCreatedRecords.concat(createdR);
		} catch(e) {
			nlapiLogExecution('ERROR',e.name,e.message);
			//revert
			//revertTran(tran);
			//revertTrans(trans);
			//reset error message
			var es = 'error creating ';
			if(step ==='to') {
				es += 'inventory transfer';
			} else if(step ==='ff') {
				es += 'item fulfillment';
				es +=': Please make sure suffcient quantity is available at source location.';
			} else if(step === 'ir') {
				es += 'item receipt';
			}
			//throw
			throw new Error(es+' ['+e.message+']');
		}
	}
	return newlyCreatedRecords;
};

/**
 * @param {Integer} destLocation   the destination location
 * @param {Array} newlyCreatedRecord
 */
function transferNonSpecialOrderSalesOrderCommittedQuantitesToLocation(order,location) { //NewlyCreatedRecord[]
	nlapiLogExecution('debug','hi', 'transferNonSpecialSO');
	//objects holder
	var newlyCreatedRecords = [];
	var tos ={};//place holder for transfer orders
	var trans =[];
	var orderObj = nlapiLoadRecord("salesorder",order);
	//line item holder
	var lines = [];
	//iterate sales order line item
	for (var i = 1; i <= orderObj.getLineItemCount('item'); i++) {
		if (!orderObj.getLineItemValue('item', 'createpo', i) && orderObj.getLineItemValue('item', 'location', i) && /*orderObj.getLineItemValue('item', 'location', i) != location &&*/ (orderObj.getLineItemValue('item','itemtype',i).toLowerCase()==='invtpart' || orderObj.getLineItemValue('item','itemtype',i).toLowerCase()==='assembly')) {
			//for the rest group by location for transfer order creation
			//var from = orderObj.getLineItemValue('item', 'location', i);
			//if(!tos[from])tos[from] = [];
			var filters = [];
			filters.push(new nlobjSearchFilter("locationquantityonhand",null,"greaterthan","0"));
			filters.push(new nlobjSearchFilter("internalid",null,"is",orderObj.getLineItemValue('item', 'item', i)));
			var cols = [];
			cols.push(new nlobjSearchColumn("inventorylocation"));
			var results = nlapiSearchRecord("item",null,filters,cols);
			if(results)
			{
				nlapiLogExecution("debug","Inventory Location: " + results[0].getValue("inventorylocation"),"Needed Location: " + location);
				
				var invLocation = results[0].getValue("inventorylocation");
				var from = invLocation;
				if(!tos[from])tos[from] = [];
				
				if(results[0].getValue("inventorylocation")!=location)
				{
					nlapiLogExecution("debug","Adding Record to Transfer");
					
					tos[from].push({
						item: orderObj.getLineItemValue('item', 'item', i),
						quantity: orderObj.getLineItemValue('item', 'quantity', i),
						units: orderObj.getLineItemValue('item', 'units', i)
					});
				}
			}
			/*
			else
			{
				tos[from].push({
					item: orderObj.getLineItemValue('item', 'item', i),
					quantity: orderObj.getLineItemValue('item', 'quantity', i),
					units: orderObj.getLineItemValue('item', 'units', i)
				});
			}
			*/
		}
	}
	
	//iterate TOS place holder and create transfer orders
	for(var p in tos) {
		if(!tos.hasOwnProperty(p)||typeof tos[p]==='function')
			continue;
		//create transfer order, fulfill and receive, revert whenever failed
		var from = p,
		to = location,
		items = tos[p],
		lines = [],
		createdR = [], // temp holder for newly created records in this iteration
		transferorder,
		itemfulfillment,
		itemreceipt,
		tran = [],
		step;
		//before tranfer, set salesorder line locations to fulfillment location so that committed items becomes available for the source location

		//do the transfer
		try {
			step = 'to';
			//create a transfer order
			if(items.length > 0)
			{
				var transfer = nlapiCreateRecord('inventorytransfer');
				transfer.setFieldValue('memo', 'BE Fulfill: Automated Inventory Transfer for Item Fulfillment purposes. SO # ' + orderObj.getFieldValue('tranid'));
				transfer.setFieldValue('location', from);
				transfer.setFieldValue('transferlocation', to);
				//add line items
				for(var x=0,xlen = items.length;x<xlen;x++) {
					transfer.selectNewLineItem('inventory');
					transfer.setCurrentLineItemValue('inventory', 'item', items[x].item);
					transfer.setCurrentLineItemValue('inventory', 'adjustqtyby', items[x].quantity);
					//transfer.setCurrentLineItemValue('item', 'amount', 0.00);
					transfer.setCurrentLineItemValue('inventory', 'units', items[x].units);
					transfer.commitLineItem('inventory');
					//construct lines, which is attached with newlyCreatedRecords
					lines.push({
					'item': items[x].item,
					'quantity' : items[x].quantity,
					'location': items[x].location,
					'units': items[x].units,
					'adjustqtyby': 0, // not involved
					'unitcost': 0 //not involved
					});
				}
				//create transfer order
				transferorder = nlapiSubmitRecord(transfer, true, false);
				tran.push(transferorder);
				nlapiLogExecution('debug','inventory transfer',transferorder);
				step = 'ff';
				nlapiLogExecution('debug','inventory transfer',transferorder);

				//check if the fulfillment has all the items in the transfer order fulfilled
				nlapiLogExecution('debug','verifying itemfulfillment for transfer order');
			}

			//if everything works concat the temp createdR with newlyCreatedRecord
			//newlyCreatedRecords = newlyCreatedRecords.concat(createdR);
			nlapiLogExecution('debug','ncr',newlyCreatedRecords.length);
		} catch(e) {
			nlapiLogExecution('error',e.name,e.message);
			//revert
			//revertTran(tran);
			//revertTrans(trans);
			//reset error message
			var es = 'error creating ';
			if(step ==='to'){
				es += 'inventory transfer';
			}else if(step ==='ff'){
				es += 'item fulfillment';
				es +=': Please make sure suffcient quantity is available at source location.';
			}else if(step === 'ir'){
				es += 'item receipt';
			}
			//throw
			throw new Error(es+' ['+e.message+']');
		}
	}
	return newlyCreatedRecords;
};
