/**  
 *      custom id = (id=2636)
 * 
 *      TYPE ---> User Event
        NAME ---> fetchShape
        ID -----> customscript_fetchshape
 */

function beforeLoad(type, form) {
	if (type == 'view' || type == 'edit') {
		var SO_ID = nlapiGetRecordId();
		var SO_Type = nlapiGetRecordType();
		var salesOrder = nlapiLoadRecord(SO_Type, SO_ID);

		var SO_item_count = salesOrder.getLineItemCount('item');

		for (var i = 1; i <= SO_item_count; i++) {

			var item_id = salesOrder.getLineItemValue('item', 'item', i);

			var category = nlapiLookupField("inventoryitem", item_id, 'custitem20');
			if (category == 2) {
				var parent = nlapiLookupField('inventoryitem', item_id, 'parent');
				var value = nlapiLookupField('inventoryitem', parent, 'custitem101');
				var first = value.split('\n')[1];
				var second = first.split(':')[1];
				if (second == "Round" || "Princess" || "Cushion" || "Oval" || "Emerald" || "Asscher" || "Radiant" || "Pear" || "Marquise" || "Heart" || "Baguette") {
					var v = value.split('\n');

					var Gemstone_value = v[0].split(':')[1];
					var Shape_value = v[1].split(':')[1];
					var Setting_type_value = v[4].split(':')[1];
					var Color_value = v[5].split(':')[1];
					var clarity_value = v[6].split(':')[1];

					var string = "<table style='width:100%'> \
					<tr>\
					  <th>Fields</th>\
					  <th colspan='1'>Values</th>\
					</tr>\
					<tr>\
					  <td>Gemstone</td>\
					  <td> "+ Gemstone_value +"</td>\
					</tr>\
					<tr>\
					  <td>Shape</td>\
					  <td>"+ Shape_value +"</td>\
					</tr>\
					<tr>\
					  <td>Setting_type</td>\
					  <td>"+ Setting_type_value +"</td>\
					</tr>\
					<tr>\
					  <td>Color</td>\
					  <td>"+ Color_value +"</td>\
					</tr>\
					  <tr>\
					  <td>clarity</td>\
					  <td>"+ clarity_value +"</td>\
					</tr>\
					</table>";
					
					nlapiLogExecution("debug", 'sending mail', 'mail sent ' + string);
					nlapiSendEmail('25963357', 'avinash.singh@inoday.com', 'test', "hi this is test mail", null, null, { transaction: 24015026 }, null);
				}
			}
		}
	}
}
