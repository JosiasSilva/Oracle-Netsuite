/*
Script Author : Shruti Gupta ([shruti.gupta@inoday.com](mailto:shruti.guptai@inoday.com))
Author Desig. : Software Developer, Inoday Consultancy Pvt. Ltd.
Script Type   : Suitescript (Client Script) 
Script Name   : Locking item link_cs
Created Date  : July 28, 2018
Last Modified Date :
Comments : NS:1279 -To lock the Item Link field on the line item of POs when a box record has a value and to enable the Item Link field when box record is empty.
SS URL :
Script URL:
*/
function disable_itemLink_pageInit(type)
{
  var box_record='';
  var itemCount = nlapiGetLineItemCount('item');
  if (itemCount > 0) {
    for (var i = 1; i <= itemCount; i++) {
      box_record=nlapiGetLineItemValue('item', 'custcol_box_record_po', i);
      if (box_record)
      {
        nlapiSetLineItemDisabled('item','custcolitem_link',true,i);
      }
      else{
    
        nlapiSetLineItemDisabled('item','custcolitem_link',false,i);
      }
    }
  }
}


function disable_itemLink_field_change(name)
{
  var box_record=nlapiGetCurrentLineItemValue('item','custcol_box_record_po');
  if(box_record !='' )
  {
    nlapiSetLineItemDisabled('item','custcolitem_link',true);
  }
  else{
    nlapiSetLineItemDisabled('item','custcolitem_link',false);
  }
}


function disable_itemLink_lineInit(type) {
  if (type != "item")
    return;
  // Exit the function if we are not on the sublist

  // Change this to number of line where the field should be disabled
  var box_record = nlapiGetCurrentLineItemValue(type,'custcol_box_record_po');
  if (box_record) {
    nlapiDisableLineItemField(type, "custcolitem_link", true);
  } else {
    // allow user to enter value if we are not at that specific line
    nlapiDisableLineItemField(type, "custcolitem_link", false);
  }
}
