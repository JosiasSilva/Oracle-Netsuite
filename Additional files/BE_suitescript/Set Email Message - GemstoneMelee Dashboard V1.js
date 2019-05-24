function setEmailMessage(type,form,request)
{
  if(request)
  {
    var gem_call= request.getParameter("gem_call");
    try
    {
      if(gem_call==1)
      {
        var po_id=request.getParameter("transaction");
        //var po_id = 16370956;
        var objPO = nlapiLoadRecord('purchaseorder', po_id);
        // var body ='Hello, <br/> <br/> Please send us the following items: <br/> <br/> '+itemDet+'<br/><br/>'+sign;
        var body=generateTemplate(objPO);

        nlapiSetFieldValue('message',body);
        nlapiSetFieldValue('includetransaction','F');

      }
    }
    catch(ex)
    {
      nlapiLogExecution('Debug','Error',ex.message);
    }
  }
}
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
function generateTemplate(objPO)
{

  // var email_notes = objPO.getFieldValue('custbodyvendor_email_notes');
  var  po_no=objPO.getFieldValue('tranid');
  var  tran_date=objPO.getFieldValue('trandate');
  var  date_needed_in_sf=objPO.getFieldValue('custbody59');


  var billaddress=objPO.getFieldValue('billaddress');
  billaddress=billaddress.replaceAll('\n','<br/>');

  var shipaddress=objPO.getFieldValue('shipaddress');
  shipaddress=shipaddress.replaceAll('\n','<br/>');

  var email_notes = objPO.getFieldValue('custbodyvendor_email_notes');
  nlapiLogExecution('error','email notes',email_notes);
  var arr_email_notes=[];
  if(email_notes.indexOf('\r\n')>-1)
    arr_email_notes = email_notes.split('\r\n');
  else
    arr_email_notes = email_notes.split('\n');

  /// var arr_email_notes = email_notes.split('\n');
  var itemCount = objPO.getLineItemCount('item');
  var qty_field_title='Quantity';
  var price_fld_title='Price Per Unit';
  if(itemCount>0)
  {
    var item_id = objPO.getLineItemValue('item', 'item', 1);
    var item_category=nlapiLookupField('inventoryitem', item_id, 'custitem20');
    if (item_category == 1 || item_category == 23 || item_category == 30) {
      qty_field_title='Quantity (Carats)';
      price_fld_title='Price Per Carat';
    } else {
      qty_field_title='Quantity';
      price_fld_title='Price Per Unit';
    }
  }

  // var qty_email_display, price, item_desc,itemDet;
  /* var price_fld_title;

		  */



  var config=nlapiLoadConfiguration('userpreferences');
  var sign= config.getFieldValue('message_signature');

  // var body ='Hello, <br/> <br/> Please send us the following items: <br/> <br/> '+itemDet+'<br/><br/>'+sign;
  // var body=generateTemplate();
  var body="<STYLE>\
\
body, p, td, th {\
font-family: Verdana, Arial, Helvetica, sans-serif;\
font-size: 11px;\
}\
th {\
font-weight: bold;\
color: #FFFFFF;\
}\
.headline {\
font-family: Helvetica, sans-serif;\
font-size: 17pt;\
font-weight: bold;\
}\
.disclaimer {\
font-family: Verdana, Arial, Helvetica, sans-serif;\
font-size: 9px;\
}\
.lined {\
border: 1px solid #777777;\
}\
\
</STYLE>\
<body bgcolor='#FFFFFF'  class='body_2010 nl-pagetint ' link='#000000' vlink='#000000' alink='#000000' text='#000000' style='background-image:none;margin: 5px 0px 5px 0px;'>\
<div id='outerwrapper' style='width:100%'>\
<div id='innerwrapper'>\
\
<div id='div__header' \
class='noprint' \
leftmargin='0' topmargin='0' marginwidth='1'>\
<table border='0' cellspacing='0' cellpadding='0' width='100%'>\
<tr bgcolor='#FFFFFF'><td>\
<table border='0' cellspacing='0' cellpadding='0' width='100%'>\
<tr>\
</tr>\
</table></td></tr>\
\
</table></div>\
<div id='div__title' style='margin: 0px;'></div>\
<div id='div__label' class='scrollarea' style='margin: 0px; overflow:hidden;'></div>\
<div id='div__body' style='margin: 0px; '>\
<table align=center border=0 cellpadding=0 cellspacing=0 width=100%>\
<tr>\
<td valign=top>\
<IMG SRC='/core/media/media.nl?id=7429493&amp;c=666639&amp;h=f38c84ab4d27a4e5bdc6&amp;fcts=20170816041603' ALT='' BORDER=0><BR>\
\
Brilliant Earth\
<br>26 O'Farrell Street\
<br>10th Floor\
<br>San Francisco CA 94108\
<br>United States\
<P>\
<table border=0 cellpadding=1 cellspacing=0>\
<tr>\
<TD valign=top><p><b>Vendor</b><br>\
"+billaddress+"</p>\
</TD>\
<td>&nbsp;&nbsp;</td>\
<TD valign=top><b>Ship To</b><br>"+shipaddress+"</TD>\
</tr>\
</table>\
</td>\
<td valign=top>\
<table align=center border=0 cellpadding=1 cellspacing=0>\
<tr><td colspan=3><div class='headline'>Purchase Order</div></td></tr>\
<tr><td>Date</td><td>&nbsp;</td>\
<td>"+tran_date+"</td></tr>\
<tr><td>PO #</td><td>&nbsp;</td><td>"+po_no+"</td></tr>\
\
<tr><td>Date needed in SF</td><td>&nbsp;</td>\
<td>"+date_needed_in_sf+"</td></tr>\
</table>\
</td>\
</tr>\
</table>\
<P>\
<table align=center border=0 cellpadding=3 cellspacing=0 width=100% style='border-collapse: collapse;'><tr bgcolor='#777777'><th nowrap class='lined' align=left>Item</th>\
<th nowrap class='lined' align=left>"+qty_field_title+"</th>\
<th nowrap class='lined' align=left>Description</th>\
<th nowrap class='lined' align=left>Vendor Origin</th>\
<th nowrap class='lined' align=left>Notes</th>\
<th nowrap class='lined' align=right>"+price_fld_title+"</th>\
</tr>";
  for (var i = 1; i <= itemCount; i++) {
    //  var email_notes = objPO.getLineItemValue('item', 'notes', i);
    nlapiLogExecution('debug','arr',JSON.stringify(arr_email_notes));
    var email_notes=''
    if(arr_email_notes.length<itemCount)
    {
      if(i<arr_email_notes.length-1)
      {
        email_notes = arr_email_notes[i - 1].split('-')[1].trim();
      }
    }
    else
    {
      email_notes = arr_email_notes[i - 1].split('-')[1].trim();
    }


    var item_id = objPO.getLineItemValue('item', 'item', i);
    var item_name = objPO.getLineItemText('item', 'item', i);

    var item_det=nlapiLookupField('inventoryitem', item_id, ['custitem20','custitem_vendor_description']);
    // var origin=nlapiLookupField('inventoryitem', item_id, 'custitem18',true);
    var origin=nlapiLookupField('inventoryitem', item_id, 'custitem_vendor_origin',true);
    var vendor_desc=item_det.custitem_vendor_description;
    var item_category = item_det.custitem20;
    var qty = objPO.getLineItemValue('item', 'quantity', i);
    var price= objPO.getLineItemValue('item', 'rate', i);
    var item_desc = vendor_desc;
    body+="<tr>\
<td valign=top class='lined' >"+item_name+"</td>\
<td valign=top class='lined' >"+qty+"</td>\
<td valign=top class='lined'>"+item_desc+"</td>\
<td valign=top class='lined' >"+origin+"</td>\
<td valign=top class='lined' >"+email_notes+"</td>\
<td valign=top class='lined' align=right nowrap>"+price+"</td>\
</tr>";

  }


  body+="</table>\
<table align=center border=0 cellpadding=3 cellspacing=1 width=100%><tr bgcolor='#FFFFFF'><td align=left>&nbsp;</td></tr></table>\
<table align=center border=0 cellpadding=3 cellspacing=0 width=100% style='border-collapse: collapse;'> </table>\
<table align=center border=0 cellpadding=3 cellspacing=1 width=100%  ><tr bgcolor='#FFFFFF'> </tr></table>\
</div>\
<div id='div__footer' class='noprint' leftmargin='0' topmargin='0' marginwidth='1' marginheight='1'>\
</div>\
</div></div>\
</body>";
  return body;

}