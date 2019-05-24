/**
 * Script Author : Tanuja Srivastav (tanuja@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (User Event Script)
 * Script Name   : QA Record DD Push Log.js
 * Created Date  : SEP 12, 2018
 * Last Modified Date : 
 * Comments : Link QA record and DD Push Log record
 * SS URL : (user event) https://system.netsuite.com/app/common/scripting/script.nl?id=2525&whence=
 * client script: https://system.netsuite.com/app/common/scripting/script.nl?id=2524&whence=
 * Script URL: 
 */
// function when DD and DD push reason updated on sales order
nlapiLogExecution("Debug","FLOStart",new Date().getTime());
function qarecord_ddpushlog(type) {
    try {
    //    if (type == 'edit') {
			var qaid=nlapiGetRecordId();
			nlapiLogExecution('DEBUG', 'qaid #', qaid);			     
            var userId = nlapiGetUser(); // entity id of the current userAgent
            var recordtype = nlapiGetRecordType();
            nlapiLogExecution('DEBUG', 'recordtype #', recordtype);
			var oldObj,dateObjOld;
			var oldDD='';
			
			if (type=='edit'){
				var id = nlapiGetRecordId();
				var oldObj = nlapiGetOldRecord();
				var oldDD = oldObj.getFieldValue('custrecord_delivery_by_date');
				nlapiLogExecution('DEBUG', 'Old DD #', oldDD);
				var dateObjOld = new Date(oldDD);
				dateObjOld= dateObjOld.toString();
				nlapiLogExecution('DEBUG', 'Old DD date format #', dateObjOld);
			}			
			
            var newObj = nlapiGetNewRecord();   	
            var newDD = newObj.getFieldValue('custrecord_delivery_by_date');
            nlapiLogExecution('DEBUG', 'new DD #', newDD);
            var dateObjNew = new Date(newDD);
            dateObjNew= dateObjNew.toString();
            nlapiLogExecution('DEBUG', 'New DD date format #', dateObjNew);
      
            var dd_push_Reason = newObj.getFieldValue('custrecord_dd_push_reason');
			nlapiLogExecution('DEBUG', 'dd_push_Reason', dd_push_Reason);
            var soId=newObj.getFieldValue('custrecord3');
		    nlapiLogExecution('DEBUG', 'SO ID', soId);
			
			//var qa_po=newObj.getFieldValue('custrecord_qa_po_number');
			var qa_po=nlapiLookupField('customrecord32', qaid, 'custrecord_qa_po_number');
            nlapiLogExecution('DEBUG', 'qa_po', qa_po);
		   // var qa_vendor=newObj.getFieldValue('custrecord_qa_vendor');
		   var qa_vendor=nlapiLookupField('customrecord32', qaid, 'custrecord_qa_vendor');
            nlapiLogExecution('DEBUG', 'qa_vendor', qa_vendor);
             if (dateObjOld != dateObjNew) {
                var so_status, poId,vendorID, item_cat, po_LD, v_LD,itemCount,item;
				var po_count = 0;
				var poarray = new Array();
               
                if (soId!=null && soId!='') {                   
                    so_status = nlapiLookupField('salesorder', soId, 'status',true);
                    var soobj=nlapiLoadRecord('salesorder',soId);
					itemCount = soobj.getLineItemCount('item') // Get line Item count
                    po_count = 0;
                    var is_loose_diamond = false;
                    if (itemCount > 0) {
                        for (var i = 1; i <= itemCount; i++) { //Loop through the lines					    
                            item = soobj.getLineItemValue('item', 'item', i);                           
                              if ((soobj.getLineItemValue('item', 'poid', i) != null) && (soobj.getLineItemValue('item', 'poid', i) != '')) {
                                po_count = po_count + 1;
                                poId = soobj.getLineItemValue('item', 'poid', i);
                                vendorID = soobj.getLineItemValue('item', 'povendor', i);
								//item_cat = soobj.getLineItemValue('item', 'custcol_category', i);
								item_cat = nlapiLookupField('inventoryitem', item, 'custitem20');	
								poarray.push(poId);								
                            }
                            if (item_cat == '7') {
                                is_loose_diamond = true;
                            }
                            if (item_cat == '7' && (poId != null && poId != '')) {
                                po_LD = poId;
                                v_LD = vendorID;
                            }
                        }
                    }
                    if ((po_count == 1 && is_loose_diamond == true) || (po_count > 1 && is_loose_diamond == false)) {
                        // poId = null;
                        // vendorID = null;
						poId = qa_po;
                        vendorID = qa_vendor;
                    }
                    if (po_count > 1 && is_loose_diamond ==true && (dd_push_Reason == '36' || dd_push_Reason == '2' || dd_push_Reason == '26')) {
                        poId = po_LD;
                        vendorID = v_LD;
                    }
					if (po_count > 1 && is_loose_diamond ==true && (dd_push_Reason != '36' && dd_push_Reason != '2' && dd_push_Reason != '26')){						
                        // poId = null;
                        // vendorID = null;
					    poId = qa_po;
                        vendorID = qa_vendor;						
                    }
                  if (po_count == 0)
					{
						poId = null;
                        vendorID = null;
					}
					if (vendorID==null || vendorID==''){
                      vendorID=qa_vendor;
                    }
					if (poId==null || poId==''){
                      poId = qa_po;
                    }
					  var obj_dd_pushlog = nlapiCreateRecord('customrecorddelivery_date_push_log');
                obj_dd_pushlog.setFieldValue('custrecordsales_order_number', soId);
                obj_dd_pushlog.setFieldValue('custrecordold_delivery_date', oldDD);
                obj_dd_pushlog.setFieldValue('custrecordnew_delivery_date', newDD);
                obj_dd_pushlog.setFieldValue('custrecordpurchase_order_number', poId);
                obj_dd_pushlog.setFieldValue('custrecordpurchase_order_vendor', vendorID);
                obj_dd_pushlog.setFieldValue('custrecorddd_push_reason', dd_push_Reason);
                obj_dd_pushlog.setFieldValue('custrecorddd_push_user', userId);
                obj_dd_pushlog.setFieldValue('custrecordsales_order_status', so_status);
                var dd_pushlog_rec_id = nlapiSubmitRecord(obj_dd_pushlog);
                nlapiLogExecution('DEBUG', 'DD push Log Rec Id#', dd_pushlog_rec_id);
				nlapiSubmitField('salesorder' , soId , 'custbody251' , dd_push_Reason);
				// if (qa_po!='' && qa_po!=null){
					// nlapiSubmitField('purchaseorder' , qa_po , 'custbody251' , dd_push_Reason);
				// }
				for (var a = 0; a < poarray.length; a++) {
					nlapiSubmitField('purchaseorder' , poarray[a] , 'custbody251' , dd_push_Reason);
                    nlapiSubmitField('purchaseorder' , poarray[a] , 'custbody6' , newDD);					
					}
                }			
            }
      //  }
    } catch (ex) {
        nlapiLogExecution("Debug", "Error Occurred", "Details: " + ex.message);
    }
}
// called when Delivery date field changed on sales order or purchase order 
function ddchange_on_qarecord(type, name) { 
    if (name == 'custrecord_delivery_by_date') {
		debugger;
             
       // if (id != null && id != '') {
			var type = nlapiGetRecordType();
            nlapiLogExecution('DEBUG', 'type #', type);
			
			// code to get current Delivery by date
            var new_dd = nlapiGetFieldValue('custrecord_delivery_by_date');			
            nlapiLogExecution('DEBUG', 'new_dd #', new_dd);
			var dateObjNew = new Date(new_dd);
            dateObjNew= dateObjNew.toString();
            nlapiLogExecution('DEBUG', 'New DD date format #', dateObjNew);
			// end code to get current Delivery by date
			
		     // code to get old Delivery by date
			  var dateObjOld,old_dd;
			  if (type=='edit'){
				  var id = nlapiGetRecordId(); 
				 old_dd = nlapiLookupField(type, id, 'custrecord_delivery_by_date');		
				 nlapiLogExecution('DEBUG', 'old_dd #', old_dd);
				
				 dateObjOld = new Date(old_dd);
				 dateObjOld= dateObjOld.toString();
				 nlapiLogExecution('DEBUG', 'Old DD date format #', dateObjOld);
			  }
			
			 // end code to get old Delivery by date
			
            var dd_push_reason = nlapiGetFieldValue('custrecord_dd_push_reason'); // code to get DD Push Reason
            nlapiLogExecution('DEBUG', 'DD push reason #', dd_push_reason);
            if (dateObjOld != dateObjNew) {
                nlapiSetFieldValue('custrecord_dd_push_reason', '',false); // code to update blank in DD Push Reason	               
			   nlapiSetFieldMandatory('custrecord_dd_push_reason',true);			
			
            }
     //   }

    }
}

function saveRecord()
{
   var t = nlapiGetFieldMandatory('custrecord_dd_push_reason');  
   if(t && (nlapiGetFieldValue('custrecord_dd_push_reason')== null || nlapiGetFieldValue('custrecord_dd_push_reason') == 'undefined' || nlapiGetFieldValue('custrecord_dd_push_reason') == ''))
   {
	   nlapiLogExecution('Debug', 't: ', t);
	   alert("Please select DD PUSH REASON");
	   return false;
   }
   return true;
}

