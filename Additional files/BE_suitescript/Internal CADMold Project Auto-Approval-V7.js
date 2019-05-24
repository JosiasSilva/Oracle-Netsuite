nlapiLogExecution("audit", "FLOStart", new Date().getTime());
var save_search_id = '9252';

function Auto_Approval() {

  var data_sales_order = [];
  nlapiLogExecution("debug", "salesorder array is   ", data_sales_order);
  Reset_Script();
  var search_record = nlapiSearchRecord(null, save_search_id); //var save_search_id='6145'
  if (search_record) {
    for (var a = 0; a < search_record.length; a++) {
      var get_so = search_record[a].getId();
      if (data_sales_order.indexOf(get_so) == -1) {
        data_sales_order.push(get_so);
      }
    }
    if (data_sales_order.length > 0) {
      try {
        for (var m = 0; m < data_sales_order.length; m++) {
          try {
            var get_parent_item = nlapiSearchRecord('salesorder', null, [
              new nlobjSearchFilter('internalid', null, 'anyof', data_sales_order[m]),
              new nlobjSearchFilter('parent', 'item', 'noneof', '@NONE@'),
              new nlobjSearchFilter('custitem20', 'item', 'anyof', '2')
            ], [
              new nlobjSearchColumn('parent', 'item'),
              new nlobjSearchColumn('item'),
              new nlobjSearchColumn('vendor', 'item'),
            ]);
              var ItemId = get_parent_item[0].getValue('item');
             var SubItemHead = nlapiLookupField('item', ItemId, 'custitem9');
			var pegHead=nlapiLookupField('item', ItemId, 'custitempeg_head');
             nlapiLogExecution("debug", "Peg head value is",pegHead );			
            if (get_parent_item && pegHead=='F') {
              var arr_stone_msrmt_shape = Get_measurment(data_sales_order[m]);
              var get_so_measurement = arr_stone_msrmt_shape[0];
              var get_so_shape = getCorrectShape(parseInt(arr_stone_msrmt_shape[1]));

              nlapiLogExecution("debug", "mesurment of so data", get_so_measurement);
              if (get_so_measurement) {
                //Molds comparison

                var get_molds_obj = Get_Mold_width_length(get_parent_item, get_so_shape, get_so_measurement);

                nlapiLogExecution("debug", "molds object is", get_molds_obj);
                if (get_molds_obj) {
                  var get_vendor = get_molds_obj[2];
                  var get_item_id = get_molds_obj[3];
                  create_po_so_update_mods(get_vendor, get_item_id, data_sales_order[m]);
                  continue;
                }
                //Cads comparison  
                var get_cads_obj = Get_CAD_width_length(get_parent_item, get_so_shape, get_so_measurement);

                nlapiLogExecution("debug", "cads object is", get_cads_obj);
                if (get_cads_obj) {
                  var get_vendor = get_cads_obj[2];
                  var get_item_id = get_cads_obj[3];
                  create_po_so_update_cads(get_vendor, get_item_id, data_sales_order[m], '42', '2');
                  continue;
                }
              }
            }else{
				nlapiLogExecution('debug','Peg head value of item is:-',pegHead);
			}
          } catch (er) {
            nlapiLogExecution("debug", "error", er.message);
          }
        }
      } catch (er) {
        nlapiLogExecution("debug", "error", er.message);
      }
    }
  }
}

function getCompair_value(get_measurment, obj_width, obj_length) {
  if (get_measurment && obj_width && obj_length) {
    var get_mold_width = parseFloat(obj_width);
    var get_mold_length = parseFloat(obj_length);
    var val_mes = get_measurment;
    get_measurment = get_measurment.split('x');
    var get_measurment_length = parseFloat(get_measurment[0]);
    var get_measurment_width = parseFloat(get_measurment[1]);
    var diffrence_width = get_mold_width - get_measurment_width;
    var diffrence_length = get_mold_length - get_measurment_length;
    if (diffrence_width == 0 && diffrence_length == 0) {
      return true;
    } else if ((diffrence_width <= .25 && diffrence_length <= .25 && diffrence_width > 0 && diffrence_length > 0) || (diffrence_width >= -.25 && diffrence_length >= -.25 && diffrence_width < 0 && diffrence_length < 0)) {
      return true;
    }

    return false;
  }
}


function Create_PO(get_vendor, get_item_id, so_id, status_value) {

  if (get_vendor && get_item_id) {
    var filter_po = [];
    filter_po.push(new nlobjSearchFilter('createdfrom', null, 'anyof', so_id));
    filter_po.push(new nlobjSearchFilter('entity', null, 'anyof', get_vendor));
    filter_po.push(new nlobjSearchFilter('item', null, 'anyof', get_item_id));
    //filter_po.push(new nlobjSearchFilter('custitem20', 'item', 'noneof', [7,8,14,15,18,19,31]));// Added on 21 May 2018
    // Design Approval Status will not be set Internal CAD Needed for diamond PO
    var search_po = nlapiSearchRecord('purchaseorder', null, filter_po);
    if (search_po) {
      for (var b = 0; b < search_po.length; b++) {
        nlapiSubmitField('purchaseorder', search_po[b].getId(), 'custbody41', status_value);
        nlapiLogExecution("debug", "PO-ID - design approval status value is", search_po[b].getId() + ' - ' + status_value);
      }
    } else {
      var create_po_rec = nlapiCreateRecord('purchaseorder', {
        recordmode: 'dynamic'
      });
      create_po_rec.setFieldValue('entity', get_vendor);
      // Added on 21 May 2018 
      // nlapiLogExecution("debug", "Get Item Id in Create PO fun()", get_item_id);
      //if(get_item_id !=null && get_item_id !='')
      //{
      //var item_category = nlapiLookupField("inventoryitem",get_item_id,"custitem20");
      //nlapiLogExecution("debug", "Item Category in Create PO fun()", item_category);
      // Design Approval Status will not be set Internal CAD Needed for diamond PO
      //if(item_category != 7 && item_category != 8 && item_category != 14 && item_category != 15 && item_category != 18 && item_category != 19 && item_category != 31)
      //create_po_rec.setFieldValue('custbody41', status_value);
      // }
      create_po_rec.setFieldValue('custbody41', status_value);
      create_po_rec.setFieldValue('createdform', so_id);
      create_po_rec.setFieldValue('custbody59', nlapiDateToString(new Date()));
      create_po_rec.selectNewLineItem('item');
      create_po_rec.setCurrentLineItemValue('item', 'item', get_item_id);
      create_po_rec.commitLineItem('item');
      var id = nlapiSubmitRecord(create_po_rec, true, true);
      nlapiLogExecution("debug", "NEW PO-ID -so_id ", id + '  -  ' + so_id);
    }
  }
}

function Get_measurment(sales_order) {
  var search_mess = nlapiSearchRecord('salesorder', null, [
    new nlobjSearchFilter('custitem30', 'item', 'isnotempty'),
    new nlobjSearchFilter('internalid', 'null', 'anyof', sales_order)
  ], [new nlobjSearchColumn('custitem30', 'item'), new nlobjSearchColumn('custitem5', 'item')]);
  if (search_mess) {
    return [search_mess[0].getValue('custitem30', 'item'), search_mess[0].getValue('custitem5', 'item')];
  }
}

function Get_Mold_width_length(get_parent_item, get_so_shape, get_measurment) {
  if (get_parent_item) {
    for (var a = 0; a < get_parent_item.length; a++) {

      var parent_item = get_parent_item[a].getValue('parent', 'item');

      var get_vendor;
      var search_vendor = nlapiSearchRecord('item', null, new nlobjSearchFilter('internalid', null, 'anyof', parent_item), new nlobjSearchColumn('vendor'));
      if (search_vendor) {
        get_vendor = search_vendor[0].getValue('vendor');
      }
      if (parent_item && get_vendor) {
        var search_mold = nlapiSearchRecord('customrecord_mold', null, [
          new nlobjSearchFilter('custrecord_mold_item', null, 'anyof', parent_item),
          // new nlobjSearchFilter('custrecord_length',null,'isnotempty'),
          // new nlobjSearchFilter('custrecord_width',null,'isnotempty'),
          new nlobjSearchFilter('mainline', 'custrecord_mold_purchase_order', 'is', 'T'),
          new nlobjSearchFilter('custrecord_mold_purchase_order', null, 'noneof', '@NONE@'),
          new nlobjSearchFilter('custrecord_shape', null, 'anyof', get_so_shape),
          new nlobjSearchFilter('custrecord_mold_vendor', null, 'anyof', get_vendor),
        ], [
          new nlobjSearchColumn('internalid', 'custrecord_mold_purchase_order').setSort(true),
          new nlobjSearchColumn('custrecord_length'),
          new nlobjSearchColumn('custrecord_width'),
          new nlobjSearchColumn('custrecord_mold_vendor')
        ]);
          if (search_mold) {
          get_measurment = get_measurment.split('x');
          var get_measurment_length = parseFloat(get_measurment[0]);
        var get_measurment_width = parseFloat(get_measurment[1]);

        var len_plus_tolerance = parseFloat(get_measurment_length) + .25;
        var len_minus_tolerance = parseFloat(get_measurment_length) - .25;

        var width_plus_tolerance = parseFloat(get_measurment_width) + .25;
        var width_minus_tolerance = parseFloat(get_measurment_width) - .25;

        //Filter out the molds on the basis of tolerance
        var temp = search_mold.filter(function(item) {
          var cols = item.getAllColumns();
          var len = parseFloat(item.getValue(cols[1]));
          var width = parseFloat(item.getValue(cols[2]));
          return ((len <= get_measurment_length && len >= len_minus_tolerance && width <= get_measurment_width && width >= width_minus_tolerance) || (len <= len_plus_tolerance && len >= get_measurment_length && width <= width_plus_tolerance && width >= get_measurment_width));
        });


        //Sort the array
        if (temp.length > 0) {
          temp.sort(function(a, b) {
            var _inner_cols = a.getAllColumns();
            var a_id = a.getValue(_inner_cols[0]);

            var b_id = b.getValue(_inner_cols[0]);

            if (a_id > b_id) {
              return 1;
            } else if (a_id < b_id) {
              return -1;
            }
          });


          var get_width = parseFloat(temp[0].getValue('custrecord_width'));
          var get_length = parseFloat(temp[0].getValue('custrecord_length'));
          var get_vendor = get_parent_item[a].getValue('vendor', 'item');
          var get_item = get_parent_item[a].getValue('item');
          if (get_width && get_length && get_vendor && get_item) {
            return [get_width, get_length, get_vendor, get_item];
          }
        }
      }
    }
  }
}
}

function Get_CAD_width_length(get_parent_item, get_so_shape, get_measurment) {
  if (get_parent_item) {
    for (var a = 0; a < get_parent_item.length; a++) {
      var parent_item = get_parent_item[a].getValue('parent', 'item');
      var get_vendor;
      var search_vendor = nlapiSearchRecord('item', null, new nlobjSearchFilter('internalid', null, 'anyof', parent_item), new nlobjSearchColumn('vendor'));
      if (search_vendor) {
        get_vendor = search_vendor[0].getValue('vendor');
      }
      if (parent_item && get_vendor) {
        var search_cad = nlapiSearchRecord('customrecord_internal_cad', null, [
          new nlobjSearchFilter('custrecord_icr_parent_sku', null, 'anyof', parent_item),
          //new nlobjSearchFilter('custrecord_icr_length',null,'isnotempty'),
          //new nlobjSearchFilter('custrecord_icr_width',null,'isnotempty'),
          new nlobjSearchFilter('mainline', 'custrecord_icr_purchase_order', 'is', 'T'),
          new nlobjSearchFilter('custrecord_icr_purchase_order', null, 'noneof', '@NONE@'),
          new nlobjSearchFilter('custrecord_icr_shape', null, 'anyof', get_so_shape),
          new nlobjSearchFilter('custrecord_icr_vendor', null, 'anyof', get_vendor)
        ], [
          new nlobjSearchColumn('internalid', 'custrecord_icr_purchase_order').setSort(true),
          new nlobjSearchColumn('custrecord_icr_length'),
          new nlobjSearchColumn('custrecord_icr_width'),
          new nlobjSearchColumn('custrecord_icr_vendor')
        ]);
        if (search_cad) {

          get_measurment = get_measurment.split('x');
          var get_measurment_length = parseFloat(get_measurment[0]);
          var get_measurment_width = parseFloat(get_measurment[1]);

          var len_plus_tolerance = parseFloat(get_measurment_length) + .25;
          var len_minus_tolerance = parseFloat(get_measurment_length) - .25;

          var width_plus_tolerance = parseFloat(get_measurment_width) + .25;
          var width_minus_tolerance = parseFloat(get_measurment_width) - .25;

          //Filter out the molds on the basis of tolerance
          var temp = search_cad.filter(function(item) {
            var cols = item.getAllColumns();
            var len = parseFloat(item.getValue(cols[1]));
            var width = parseFloat(item.getValue(cols[2]));
            return ((len <= get_measurment_length && len >= len_minus_tolerance && width <= get_measurment_width && width >= width_minus_tolerance) || (len <= len_plus_tolerance && len >= get_measurment_length && width <= width_plus_tolerance && width >= get_measurment_width));
          });

          //Sort the array
          if (temp.length > 0) {
            temp.sort(function(a, b) {
              var _inner_cols = a.getAllColumns();

              var a_id = a.getValue(_inner_cols[0]);
              var b_id = b.getValue(_inner_cols[0]);

              if (a_id > b_id) {
                return 1;
              } else if (a_id < b_id) {
                return -1;
              }
            });


            var get_width = parseFloat(temp[0].getValue('custrecord_icr_width'));
            var get_length = parseFloat(temp[0].getValue('custrecord_icr_length'));
            var get_vendor = get_parent_item[a].getValue('vendor', 'item');
            var get_item = get_parent_item[a].getValue('item');
            if (get_width && get_length && get_vendor && get_item) {
              return [get_width, get_length, get_vendor, get_item];
            }
          }
        }
      }
    }
  }
}



/*
function create_po_so_update_cads(get_vendor, get_item, so_id, status_value) {
    if (get_vendor && get_item && so_id) {

        var type_of_contact = nlapiLookupField('vendor', get_vendor, 'custentity4');
        Reset_Script();
        if (type_of_contact == '6') {
            nlapiSubmitField('salesorder', so_id, ['orderstatus', 'custbody41'], ['B', status_value]);
            Create_PO(get_vendor, get_item, so_id, status_value);
        } else {
            nlapiSubmitField('salesorder', so_id, 'orderstatus', 'B');
            Create_PO(get_vendor, get_item, so_id, '');
        }
    }
}

function create_po_so_update_mods(get_vendor, get_item, so_id) {
    if (get_vendor && get_item && so_id) {
        nlapiSubmitField('salesorder', so_id, 'orderstatus', 'B');
        Reset_Script();
        Create_PO(get_vendor, get_item, so_id, '');
        Reset_Script();
    }
}*/

// New Code implemented by Sanjeet
function create_po_so_update_cads(get_vendor, get_item, so_id, status_value, cad_result_id) {
  if (get_vendor && get_item && so_id) {

    var so_fields = nlapiLookupField('salesorder', so_id, ['custbody87', 'custbody227', 'custbody285', 'custbodyops_cs_status', 'custbody111', 'custbodyfraud_check_new']);
    nlapiLogExecution("debug", "salesorder field is", so_fields);
    var type_of_order = so_fields.custbody87.split(',');
    nlapiLogExecution("debug", "Type of order is", type_of_order);
    var order_status = so_fields.custbody227.split(',');
    nlapiLogExecution("debug", "order status is", order_status);
    nlapiLogExecution("debug", "cad result id", cad_result_id);
    var wb_value = so_fields.custbody285;
    var ops_cs_status = so_fields.custbodyops_cs_status.split(',');
    nlapiLogExecution("debug", "Ops CS Status", ops_cs_status);
    var layaway = so_fields.custbody111;
    nlapiLogExecution("debug", "Layaway?", layaway);
    var fraud_check_new = so_fields.custbodyfraud_check_new;
    nlapiLogExecution("debug", "Fraud Check New", fraud_check_new);

    if (type_of_order.indexOf('1') > -1 && order_status.indexOf('8') > -1 && order_status.indexOf('6') == -1 && order_status.indexOf('7') == -1 && so_fields.custbody285 == 'F' && layaway == 'F' && fraud_check_new != '4' && ops_cs_status != '3') {
      // nlapiSubmitField ( 'salesorder' ,  so_id, 'orderstatus' , 'B') ;
      //nlapiSubmitField('salesorder', so_id, ['orderstatus', 'custbody41'], ['B', status_value]);
      var obj_so = nlapiLoadRecord('salesorder', so_id);
      obj_so.setFieldValue('orderstatus', 'B');
      obj_so.setFieldValue('custbody41', status_value);
      var item_count = obj_so.getLineItemCount('item');
      for (var l = 1; l <= item_count; l++) {
        var check_item_id = obj_so.getLineItemValue('item', 'item', l);
        if (check_item_id == get_item) {
          obj_so.setLineItemValue('item', 'custcol39', l, cad_result_id);
          nlapiLogExecution("debug", "cad result id - inner", cad_result_id);
          nlapiLogExecution("debug", "item id - inner", get_item);
          try {
            var order_id =  nlapiSubmitRecord(obj_so, true, true);
            nlapiLogExecution("debug", "sales order Id is", order_id);
            Unset_Design_Approval_Status_On_Diamond_PO(order_id);
          } catch (ex) {
            nlapiLogExecution("debug", "error", ex.message);
          }

          break;
        }
      }
      //Added By Sanjeet 10th may 2018
      var type_of_contact = nlapiLookupField('vendor', get_vendor, 'custentity4');
      if (type_of_contact == '6') {
        Create_PO(get_vendor, get_item, so_id, status_value);
      }
      //end 
      Reset_Script();
    } else {

      var obj_so = nlapiLoadRecord('salesorder', so_id);
      var item_count = obj_so.getLineItemCount('item');
      for (var l = 1; l <= item_count; l++) {
        var check_item_id = obj_so.getLineItemValue('item', 'item', l);
        if (check_item_id == get_item) {
          obj_so.setLineItemValue('item', 'custcol39', l, cad_result_id);
          nlapiLogExecution("debug", "cad result id - inner", cad_result_id);
          nlapiLogExecution("debug", "item id - inner", get_item);
          try {
            nlapiSubmitRecord(obj_so, true, true);
            nlapiLogExecution("debug", "sales order Id is", so_id);
          } catch (ex) {
            nlapiLogExecution("debug", "error", ex.message);
          }

          break;
        }
      }

    }

    //end
  }

}


function create_po_so_update_mods(get_vendor, get_item, so_id) {
  if (get_vendor && get_item && so_id) {
    //var so_fields = nlapiLookupField('salesorder', 15709997, ['custbody87', 'custbody227', 'custbody285']);
    var so_fields = nlapiLookupField('salesorder', so_id, ['custbody87', 'custbody227', 'custbody285', 'custbodyops_cs_status', 'custbody111', 'custbodyfraud_check_new']);
    var type_of_order = so_fields.custbody87.split(',');
    var order_status = so_fields.custbody227.split(',');
    var wb_value = so_fields.custbody285;
    var ops_cs_status = so_fields.custbodyops_cs_status.split(',');
    var layaway = so_fields.custbody111;
    var fraud_check_new = so_fields.custbodyfraud_check_new;


    if (type_of_order.indexOf('1') > -1 && order_status.indexOf('8') > -1 && order_status.indexOf('6') == -1 && order_status.indexOf('7') == -1 && so_fields.custbody285 == 'F' && layaway == 'F' && fraud_check_new != '4' && ops_cs_status != '3') {

      //nlapiSubmitField('salesorder', so_id, 'orderstatus', 'B');
      var obj_so = nlapiLoadRecord('salesorder', so_id);
      obj_so.setFieldValue('orderstatus', 'B');
      var item_count = obj_so.getLineItemCount('item');
      for (var l = 1; l <= item_count; l++) {
        var check_item_id = obj_so.getLineItemValue('item', 'item', l);
        if (check_item_id == get_item) {
          obj_so.setLineItemValue('item', 'custcol39', l, '1');
          var order_id = nlapiSubmitRecord(obj_so, true, true);
          nlapiLogExecution("debug", "salesorder record ID is", order_id);
          Unset_Design_Approval_Status_On_Diamond_PO(order_id);
          break;
        }
      }
      //Added By Sanjeet 10th may 2018
      var type_of_contact = nlapiLookupField('vendor', get_vendor, 'custentity4');
      if (type_of_contact == '6') {
        Create_PO(get_vendor, get_item, so_id, status_value);
      }
      // end
      Reset_Script();
    } else {

      var obj_so = nlapiLoadRecord('salesorder', so_id);
      var item_count = obj_so.getLineItemCount('item');
      for (var l = 1; l <= item_count; l++) {
        var check_item_id = obj_so.getLineItemValue('item', 'item', l);
        if (check_item_id == get_item) {
          obj_so.setLineItemValue('item', 'custcol39', l, '1');
          nlapiSubmitRecord(obj_so, true, true);
          nlapiLogExecution("debug", "salesorder record ID is", so_id);
          break;
        }
      }
    }

    //end
  }
}

function getCorrectShape(shape) {
  var shape_id_on_mold;
  switch (shape) {
    case 1: //Round
      shape_id_on_mold = 1; //RD
      break;
    case 2: //Princess
      shape_id_on_mold = 2; //PC
      break;
    case 3: //Cushion
      shape_id_on_mold = 3; //CU
      break;
    case 4: //Oval
      shape_id_on_mold = 6; //OV
      break;
    case 5: //Emerald
      shape_id_on_mold = 9; //EC
      break;
    case 6: //Asscher
      shape_id_on_mold = 4; //AS
      break;
    case 7: //Radiant
      shape_id_on_mold = 7; // RA
      break;
    case 8: //Pear
      shape_id_on_mold = 8; // PS
      break;
    case 9: //Marquise
      shape_id_on_mold = 5; // MQ
      break;
    case 10: //Marquise
      shape_id_on_mold = 10; // HS
      break;
    default:
      shape_id_on_mold = 0; //Nothing
      break;

  }
  return shape_id_on_mold;
}