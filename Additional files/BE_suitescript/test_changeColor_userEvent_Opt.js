nlapiLogExecution("audit","FLOStart",new Date().getTime());
function test_changeColor_userEvent(type, form) {
	if (type == 'view') {
		try {
			var SO_Id = nlapiGetRecordId();
			var SO_Type = nlapiGetRecordType();
			
			// item sublist
			var itemCount = nlapiGetLineItemCount("item");
			nlapiLogExecution('DEBUG', 'itemCount:', itemCount);
			
			for (var i = 1; i <= itemCount; i++)
			{
				// Get Description and Item Internal ID
				var description = nlapiGetLineItemValue('item', 'description', i);
				var itemType = nlapiGetLineItemValue('item', 'itemtype', i);
				var itemId = nlapiGetLineItemValue('item', 'item', i);
				
				if(itemType!="InvtPart")
					continue;

				var invertoryLocation = nlapiGetLineItemText('item','location', i);
				// nlapiLogExecution('DEBUG','invertoryLocation:',invertoryLocation);
				
				// Description contains ETERNITY
				if(containEternity(description) && getSameSizeItem(itemId))
				{
					nlapiLogExecution('DEBUG', 'description:', description);
					addFieldUnderWOPB(form);
				}
				else if(invertoryLocation == "San Francisco")
				{
					var category = nlapiGetLineItemText('item','custcol_category', i);
					nlapiLogExecution('DEBUG', 'category:', category);
					if(category == "Setting with large center stone"|| category == "Ring with no large center stone")
					{
						getItemSize(itemId);
					}
				}
			}
		} catch (e) {
			if (e instanceof nlobjError) {
				nlapiLogExecution("ERROR", e.getCode(), e.getDetails());
			} else {
				nlapiLogExecution("ERROR", e.message);
			}
		}
	}
}

function getQuantityAvailable(item) {
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",item));
	filters.push(new nlobjSearchFilter("inventorylocation",null,"is","2")); //San Francisco
	filters.push(new nlobjSearchFilter("locationquantityavaialble",null,"greaterthan","0"));
	var results = nlapiSearchRecord("item",null,filters);
	if(results)
	{
		//if results, there is stock, return true
		return true;
	}
	else
	{
		return false;
	}
}

function get_size(item) {
	var size = nlapiLookupField('item',item,'custitem2',true);
	return size;
}

function containEternity(description) {
	var regex = /ETERNITY/i;
	return regex.test(description);
}

function getItemSize(item) {
	var n = 0;
	var arr = [];
	var f = 0;
	var nameSize = [];
	var name_size = [];
	
	var item_flds_txt = nlapiLookupField('item',item,['custitem2','parent'],true);
	
	var itemSize = parseFloat(item_flds_txt.custitem2);
	nlapiLogExecution('DEBUG', 'itemSize:', itemSize);
	
	var name = nlapiLookupField('item',item,'itemid');
	var regex = /^(.*?-S)(\d+)$/;
	var sname = name.replace(regex, "$1");
	nlapiLogExecution('DEBUG', 'sname:', sname);
	
	var parentItems = item_flds_txt.parent;
	nlapiLogExecution('DEBUG', 'parentItems:', parentItems);
	
	var filter = [];
	filter.push(new nlobjSearchFilter("itemid", null, "is", parentItems));
	var cols = [];
	cols.push(new nlobjSearchColumn("custitem2"));
	var result = nlapiSearchRecord("inventoryitem", null, filter, cols);
	if (result) {
		for (var i = 0; i < result.length; i++) {
			var id = result[0].getId();
			var type = result[0].getRecordType();
			//var record = nlapiLoadRecord(type, id);
			var size = [];
			size = result[0].getText('custitem2');
			for (var k = 0; k < size.length; k++) {
				// nlapiLogExecution('DEBUG','size:',size[k]);
				if (parseFloat(size[k]) >= (itemSize - 2) && parseFloat(size[k]) <= (itemSize + 2)) {
					// nlapiLogExecution('DEBUG','itemSize:',itemSize);
					arr[f++] = size[k];
					// nlapiLogExecution('DEBUG','arr:',arr[f++]);
				}
			}
		}
	}
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].indexOf(".") != -1) {
			var name = arr[i].split(".");
			nameSize[n++] = name[0] + name[1];
			// nlapiLogExecution('DEBUG','nameSize:',nameSize[n++]);
		} else {
			nameSize[n++] = arr[i];
			// nlapiLogExecution('DEBUG','nameSize:',nameSize[n++]);
		}
	}
	for (var x = 0; x < nameSize.length; x++) {
		name_size[x] = sname + nameSize[x];
		// nlapiLogExecution('DEBUG','name_size:',name_size[x]);
	}
	for (var m = 0; m < name_size.length; m++) {
		var filter1 = [];
		filter1.push(new nlobjSearchFilter("itemid", null, "is", name_size[m]));
		filter1.push(new nlobjSearchFilter("inventorylocation", null, "is", "2"));
		filter1.push(new nlobjSearchFilter("locationquantityonhand", null, "greaterthan", 0));
		var result1 = nlapiSearchRecord("inventoryitem", null, filter1);
		if (result1) {
			for (var x = 0; x < result1.length; x++) {
				var id = result1[x].getId();
				//var type = result1[x].getRecordType();
				//var record = nlapiLoadRecord(type, id);
				//if (getQuantityAvailable(record)) {
					nlapiLogExecution('DEBUG', 'id:', id);
					addFieldUnderWOPB(form);
					displayItem(id);
					return true;
				//}
			}
		}
	}
	return false;
}
function addFieldUnderWOPB(form) {
	var fieldAdding = form.addField("custpage_fieldadding", "text", "Potential Backstock Ring Match");
	fieldAdding.setDefaultValue("Yes");
	
	var fieldAddingHighLight = form.addField("custpage_highlight_fieldhighlight", "inlinehtml", "Potential Backstock Ring Match");
	
	var fieldAddingHighLightValue = "<script type='text/javascript'>";
	fieldAddingHighLightValue += 'var node = document.getElementById("custpage_fieldadding_fs_lbl");';
	fieldAddingHighLightValue += 'node.parentNode.parentNode.style.background="yellow";';
	fieldAddingHighLightValue += "</script>";
	fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
	
	nlapiLogExecution('DEBUG', 'fieldValueAdding:', fieldAddingHighLightValue);
	
	form.insertField(fieldAdding, "custbody228");
}
function getSameSizeItem(item) {
	return getQuantityAvailable(item);
}
function displayItem(id) {
	//var record = nlapiLoadRecord("inventoryitem", id);
	var itemValue = nlapiLookupField("item",id,"itemid");
	var fieldAddingHighLight = form.addField("custpage_highlight_fielddisplay", "inlinehtml", "Potential Backstock Ring Match");
	var fieldAddingHighLightValue = "<script type='text/javascript'>";
	fieldAddingHighLightValue += 'var node = document.getElementById("custpage_fieldadding_fs_lbl");';
	fieldAddingHighLightValue += 'var divElement = document.createElement("DIV");';
	fieldAddingHighLightValue += 'node.parentNode.insertBefore(divElement);';
	fieldAddingHighLightValue += 'divElement.innerHTML="<tr><span>' + itemValue
			+ '</span></tr>"';
	fieldAddingHighLightValue += "</script>";
	fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
	nlapiLogExecution('DEBUG', 'fieldValueAdding:', fieldAddingHighLightValue);
}
