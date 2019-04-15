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
				if (second == "Round" || "Princess" || "Cushion" || "Oval" || "Emerald" || "Asscher" || "Radiant" || "Pear" || "Marquise" || "Heart" || "Baguette ") {
					var v = value.split('\n');

					var Gemstone = v[0];
					var Shape = v[1];
					var Setting_type = v[4];
					var Color = v[5];
					var clarity = v[6];

					var string = '<table><th><td>Gemstone</td><td>Shape</td><td>Setting_type</td><td>Color</td><td>clarity</td></th><tr><td>';
					string += Gemstone + '</td><td>';
					string += Shape + "</td><td>";
					string += Setting_type + "</td></td>";
					string += Color + "</td></td>";
					string += clarity + "</td></td>";
					string += '</tr></table>';
					nlapiLogExecution("debug", 'sending mail', 'mail sent ' + string);
					nlapiSendEmail('25963357', 'avinash.singh@inoday.com', 'test', "hi this is test mail", null, null, { transaction: 24015026 }, null);

				}

			}

			//      var item_pattern = /^be.*/im;
			//    var item_result = item_pattern.test(SO_Item_No);
			//  if (item_result) {
			//  Parent_Item.push(SO_Item_No.split(':')[0]);
			// }
		}

	}
}
