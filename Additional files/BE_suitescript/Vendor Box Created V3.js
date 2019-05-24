String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}


function GET_DATA(datain)
{
  if(datain.type=='new_record')
  {

    var send_data=JSON.stringify(datain.send_data);
    create_box_api(send_data);
    return true;
  }
  else if(datain.type=='old_record')
  {
    var send_data=JSON.stringify(datain.send_data);
    update_box_api(send_data);
    return true;

  }
  else if(datain.type=='bulk_update')
  {
    var return_status= bulkupdate_po_lineitems(datain.status,datain.tranid);
    nlapiLogExecution('debug', 'Success: ', return_status);
    return return_status;
  }

}
function bulkupdate_po_lineitems(status,tranid)
{
  nlapiLogExecution('Debug', 'bulkupdate_po_lineitems ', 'Entering bulkupdate_po_lineitems');
	var return_status='fail';
	var searchResult;
	var notupdatedrecords = [];
	if(status)
	{
		nlapiLogExecution('Debug', 'if: ', 'Entering main if block');
		var lineitem = tranid;
		searchResult = nlapiSearchRecord('purchaseorder', null, [new nlobjSearchFilter('tranid', null, 'is', lineitem), new nlobjSearchFilter('mainline', null, 'is', 'T')]);
		if(searchResult && searchResult != null && searchResult.length > 0)
		{
		  nlapiLogExecution('Debug', 'if(searchResult): ', 'Entering searchrsult if block');
			var po_id = searchResult[0].getId();
			var po = nlapiLoadRecord('purchaseorder', po_id);
			var po_li_count = po.getLineItemCount('item');
			var flag = 0;
			for(var j = 1; j <= po_li_count; j++)
			{
				flag = 0;
				nlapiLogExecution('Debug', 'for: ', 'Entered for block');
				var custcol18 = convertDate(new Date(po.getLineItemValue('item', 'custcol18', j)));
				var today;
				if(custcol18 != 'undefined' && custcol18!= null)
				{
				  nlapiLogExecution('Debug', 'custcol18 if block', 'Entered custcol18 block: ' + custcol18);
					today = convertDate(new Date());
				  nlapiLogExecution('Debug', 'today: ', today);
					if(custcol18 == today)
					{
					  nlapiLogExecution('Debug', 'custcol18 == today ', 'Entered because custcol18 and today are equal.');
						po.setLineItemValue('item', 'custcol_vbd_status', j, status);
						flag = 1;
						/*
						var submitted_po = nlapiSubmitRecord(po);
						nlapiLogExecution('Debug', 'Submitted PO: ', submitted_po);
						return_status='success';
						*/
					}
				}
			}
			var submitted_po = nlapiSubmitRecord(po);
			nlapiLogExecution('Debug', 'Submitted PO: ', submitted_po);
			return_status='success';
		}		
	}
	return return_status;
}


function convertDate(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth()+1).toString();
  var dd  = date.getDate().toString();

  var mmChars = mm.split('');
  var ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}