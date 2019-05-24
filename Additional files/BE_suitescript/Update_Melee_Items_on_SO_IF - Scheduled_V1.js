/**
	@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
	@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
	@Task			   			:-	NS-851 (Update Melee on Sales Order)
	@Related Task				:-	NS-671 (Melee Items on PO - IA update)
	@Script Type   				:-	Scheduled Script
	@Created Date  				:-	September 06, 2017
	@Last Modified Date 		:-  September 06, 2017
	@Comments                 	: 	Script will updated Melee Items quantity on Salesorder and Item Fulfillment in item tab w.r.t PO
	@Live UserEvent Script		:-	/app/common/scripting/script.nl?id=1828
	@Live Clien Script			:-	/app/common/scripting/script.nl?id=1829
	@Live Restlet Script		:-	/app/common/scripting/script.nl?id=1830
	@Live RecordType URL		:-	/app/common/custom/custrecord.nl?id=704
	@Live Scheduled Script	:-	/app/common/scripting/script.nl?id=2095
*/
function Update_SO_and_Itemfullfillment()
{
	try
	{
		var data = GetAllPoMeleeItems();
		for(var z = 0; z < data.length;z++)
		{
			var POID = data[z].po_id;
			if(POID)
			{				
				var SOID = data[z].so_id;
				var POMeleeData = data[z].melee_items;				
				if(SOID && POMeleeData && POMeleeData.length > 0)
				{
					UpdateRecord(SOID, POMeleeData, 'salesorder')
					nlapiLogExecution('debug','Updated salesorder #'+ SOID);
					var SO_Status = data[z].so_status;
					if(SO_Status)
					{
						UpdateAllItemFulfillment(SOID,POMeleeData);
					}
				}				 
			}
			nlapiSubmitField('purchaseorder',POID ,'custbody_melee_date','');
			nlapiLogExecution('debug','PO Updated #'+POID);
		}
		nlapiLogExecution('debug','Script ran completed',new Date());
	}
	catch(ex)
	{
		nlapiLogExecution('debug','Error in Script',ex);
	}
}
function GetAllPoMeleeItems()
{
	var POMeleeData = [];
	try
	{
		var fil = [];
		fil.push(new nlobjSearchFilter('mainline',null,'is','F'));
		fil.push(new nlobjSearchFilter('custrecord_melee_items_item','CUSTRECORD_MELEE_ITEMS_PO_LINK','noneof','@NONE@'));
		fil.push(new nlobjSearchFilter('createdfrom',null,'noneof','@NONE@'));
		fil.push(new nlobjSearchFilter('status','createdfrom','noneof',['SalesOrd:G']));
		var col = [];
		col.push(new nlobjSearchColumn('custrecord_melee_items_item','CUSTRECORD_MELEE_ITEMS_PO_LINK'));
		col.push(new nlobjSearchColumn('custrecord_melee_items_quantity','CUSTRECORD_MELEE_ITEMS_PO_LINK'));		
		col.push(new nlobjSearchColumn('createdfrom',null));
		col.push(new nlobjSearchColumn('status','createdfrom'));
		var POMeleeResult =  nlapiSearchRecord('purchaseorder',null,fil,col);
		if(POMeleeResult)
		{
			var po_arr = [];
			var POMeleeData = [];
			for(var m=0; m < POMeleeResult.length; m++)
			{
				var id = POMeleeResult[m].getId();				
	    		var melee_items_obj = {
										item : POMeleeResult[m].getValue('custrecord_melee_items_item','CUSTRECORD_MELEE_ITEMS_PO_LINK'), 
										quantity: POMeleeResult[m].getValue('custrecord_melee_items_quantity','CUSTRECORD_MELEE_ITEMS_PO_LINK')
									  };
				var index = POMeleeData.map(function(d) { return d['po_id']; }).indexOf(id);
				if(index == -1 )
				{					
					POMeleeData.push({
						po_id		:	id,
						so_id 		:	POMeleeResult[m].getValue('createdfrom'),
						so_status 	:	POMeleeResult[m].getValue('status','createdfrom'),
						melee_items :	[]
					});
					POMeleeData[POMeleeData.length-1].melee_items.push(melee_items_obj );
				}
				else
				{
					POMeleeData[index].melee_items.push(melee_items_obj);
				}
			}
			nlapiLogExecution('debug','PO Melee Items #',JSON.stringify(POMeleeData));
		}
	}
	catch(M)
	{
		nlapiLogExecution('debug','Error in Get PO Melee Items #',M);
	}
	return POMeleeData;
}
function UpdateAllItemFulfillment(SOID,POMeleeData)
{
	try
	{
		var fulfillmentResult =  nlapiSearchRecord('itemfulfillment',null,[['createdfrom','anyof',SOID],'AND',['mainline','is','T'],'AND',['status','noneof','ItemShip:C']]);
		if(fulfillmentResult) 
		{
			for(var v=0; v<fulfillmentResult.length; v++)
			{
				var fulfillmentId = fulfillmentResult[v].getId();
				if(fulfillmentId)
				{
					UpdateRecord(fulfillmentId, POMeleeData, 'itemfulfillment')
					nlapiLogExecution('debug','Updated Item Fulfillment #'+ fulfillmentId);
				}
			}
		}
		nlapiLogExecution('debug','Updated Item Fulfillment of SO #' + SOID,JSON.stringify(POMeleeData));
	}
	catch(F)
	{
		nlapiLogExecution('debug','Error in Update Item Fulfillment #' + SOID,F);
	}
}

function UpdateRecord(id, POMeleeData, type)
{
	try
	{
		if(id && POMeleeData && type)
		{
			var flag = false;
			var obj = nlapiLoadRecord(type,id);		
			var count = obj.getLineItemCount('item');
			for(var g = 1; g <= count; g++)
			{
				var itemId = obj.getLineItemValue('item','item',g);
				for(var me = 0; me < POMeleeData.length; me++)
				{
					if(itemId == POMeleeData[me].item)
					{
						flag = true;
						obj.setLineItemValue('item','quantity',g,POMeleeData[me].quantity);
						var amt = obj.getLineItemValue('item','amount',g);
						var amt = obj.getLineItemValue('item','amount',g);
						if(!amt || amt <= 0  )
						{
							obj.setLineItemValue('item','amount',g,0);
						}						
						break;
					}
				}
			}
			if(flag)
			{
				nlapiSubmitRecord(obj,true,true);
				nlapiLogExecution('debug','Updated '+ type +' #'+ id);
			}
		}
	}
	catch(ex)
	{
		nlapiLogExecution('debug','Error in Updating  '+ type +' #' + id,ex);
	}
}