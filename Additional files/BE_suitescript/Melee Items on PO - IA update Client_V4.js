/**
	@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
	@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
	@Task			   			:-	NS-671 (Melee Items on PO - IA update)
	@Script Type   				:-	Client and Restlet Script
	@Created Date  				:-	Nov 18, 2017
	@Last Modified Date 		:-  Nov 18, 2017
	@Comments                 	: 	Script will Add items in Melee Items tab and add Popup on PO
	@Live UserEvent Script		:-	/app/common/scripting/script.nl?id=1828
	@Live Clien Script			:-	/app/common/scripting/script.nl?id=1829
	@Live Restlet Script		:-	/app/common/scripting/script.nl?id=1830
	@Live Schedule Script		:-	/app/common/scripting/script.nl?id=2071
	@Live Schedule Script		:-	/app/common/scripting/script.nl?id=2130
	@Live RecordType URL		:-	/app/common/custom/custrecord.nl?id=704
	@Live Saved Search URL		:-	/app/common/search/searchresults.nl?searchid=8086
	@Live Saved Search URL		:-	/app/common/search/searchresults.nl?searchid=8275
*/
function submitMeleeItem(type,name) 
{
    try 
	{   
		var melee_tems_type = nlapiGetFieldValue('custpage_melee_tems_type');       
		if(melee_tems_type == 'true')
		{
			var TempTotalQty = 0;
			var TempQtyTxt = nlapiGetFieldValue('custpage_melee_tems_qty');         
			var TempQtyObj=JSON.parse(TempQtyTxt);
            var TotalQty = TempQtyObj[0];
			var CurrentTemp = parseFloat(TempQtyObj[1]);
			for (var z = 1; z <= nlapiGetLineItemCount('recmachcustrecord_melee_items_po_link'); z++) 
			{
				var qty = nlapiGetLineItemValue('recmachcustrecord_melee_items_po_link', 'custrecord_melee_items_quantity' , z) ;
				if (qty != '' && qty != null) 
				{
					TempTotalQty += parseFloat(qty);
				}
			}
			if(TotalQty != '' && TotalQty != null)
			{
				TotalQty = parseFloat(TotalQty);
				if((TotalQty != TempTotalQty) && (CurrentTemp != TempTotalQty))
				{
					alert('Total quantity of melee items for eternity styles should be '+ TotalQty);
					return false;
				}
			}
		}        
    } 
	catch (ex) 
	{

    }
    return true;
}

function submitMelee(element) 
{
    try 
	{
        var allInput = document.getElementsByClassName('subquantityinput');
        if (allInput.length > 0) 
		{
            var postData = [];
			var TotalQty = 0;
            var flag = false;
			var pev = 0;
            for (var z = 0; z < allInput.length; z++) 
			{
                var elmnt = allInput[z];
                var NewQuantity = elmnt.value;
				var OldQuantity = elmnt.getAttribute('data-quantity');
				var pev = OldQuantity;
                if (NewQuantity == '')
				{
					//alert('Please Enter Quantity..!!!');
                    allInput[z].focus();
                    return false;
                }                
                if ( NewQuantity != '') 
				{
                    flag = true;
					TotalQty += parseFloat(NewQuantity);
                    postData.push({
                        line: elmnt.getAttribute('data-field'),
                        quantity: NewQuantity
                    });
				}
				else
				{
					TotalQty += parseFloat(OldQuantity);
				}
            }
			var MeleeFlag=element.getAttribute('data-type');
			if(MeleeFlag == 'true')
			{
				var melee=element.getAttribute('data-melee');
				if(melee != '' && melee != null)
				{
					melee = parseFloat(melee);				
					if(melee != TotalQty )
					{
						alert('Total quantity of melee items for eternity styles should be '+melee);
						return false;
					}
				}
			}
			 var poId=element.getAttribute('data-poId');
            if (flag && poId != '' && poId != null &&  postData != '' && postData != null && postData.length>0) 
			{
				var MainItemID = element.getAttribute('data-MainItem');
				var chk_store = 'F';
				if(document.getElementById('chk_store_melee_count_popup').checked) 
				{
					chk_store = 'T';
				} 
				var JsonObj = [];
                JsonObj.push({
                    poId		: 	poId,
					MainItemID	: 	MainItemID,
					chk_store	:	chk_store,
                    MeleeItems	: 	postData
                });
				document.getElementById("wait").innerHTML = "<b style='font-size: 13px;'>Please Wait...</b>";
				element.setAttribute('disabled',true);
				AjaxRestlet(JsonObj);
            }
			else 
			{
                alert('Please Enter Quantity..!!!');
            }
        }
    } 
	catch (ex) 
	{
		alert(ex);
    }
    return false;
}

function AjaxRestlet(JsonObj)
{
	var restUrl = nlapiResolveURL('RESTLET', 'customscript_melee_items_on_po_ia_restle', 'customdeploy_melee_items_on_po_ia_restle');
	//var restUrl = '/app/site/hosting/restlet.nl?script=1269&deploy=1';
	 var JsonText =JSON.stringify(JsonObj);
	   $.ajax({
			type: "POST",
			url: restUrl,
			data: JsonText, 
			contentType: "application/json;",
			dataType: "text",
			success: function (data) 
			{
				alert('Melee Items successfully updated.');				
				window.location.reload(true);
			},
			error: function (result) {
				alert('1 Melee Items successfully updated.');			  
				window.location.reload(true);
			}
		});
	  return true;
}
/****************************Restlet Coding of script 1269*******************/

function postRESTletYagya(dataIn) 
{
    try 
	{        
		nlapiLogExecution('DEBUG', 'Request data of PO ', dataIn);
        var poId = dataIn[0].poId;
        var MeleeItems = dataIn[0].MeleeItems;
        nlapiLogExecution('DEBUG', 'MeleeItems of PO #' + poId, JSON.stringify(MeleeItems));
        if (poId != null && poId != '' && MeleeItems != null && MeleeItems != '' && MeleeItems.length > 0) 
		{
            var Obj = nlapiLoadRecord('purchaseorder', poId);
            for (var z = 0; z < MeleeItems.length; z++) 
			{
                Obj.setLineItemValue('recmachcustrecord_melee_items_po_link', 'custrecord_melee_items_quantity', MeleeItems[z].line, MeleeItems[z].quantity);                
            }
			Obj.setFieldValue('custbody_melee_count_updated', 'T');
            Obj.setFieldValue('custbody_melee_items_inv_status', 'T');
            Obj.setFieldValue('custbody_store_melee_count',dataIn[0].chk_store);
            Obj.setFieldValue('custbody_melee_item_id',dataIn[0].MainItemID);
            var ss= nlapiSubmitRecord(Obj, true, true);
			nlapiLogExecution('DEBUG', 'Done on PO #' + poId, ss);
			return ss;
        }
    } 
	catch (ex) 
	{
        nlapiLogExecution('DEBUG', 'Error on PO #' + poId, ex);
    }
   var err = {
			"status" : "failed",
			"message": 1
		}
  return JSON.stringify(err);
}
/************************************End Restlet******************************/