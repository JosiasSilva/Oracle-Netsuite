/**
	@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
	@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
	@Task			   			:-	NS-671 (Melee Items on PO - IA update)
	@Script Type   				:-	UserEvent Script
	@Created Date  				:-	July 13, 2017
	@Last Modified Date 		:-  July 13, 2017
	@Comments                 	: 	Script will Add items in Melee Items tab and add Popup on PO
	@Live UserEvent Script		:-	/app/common/scripting/script.nl?id=1828
	@Live Clien Script			:-	/app/common/scripting/script.nl?id=1829
	@Live Restlet Script		:-	/app/common/scripting/script.nl?id=1830
	@Live RecordType URL		:-	/app/common/custom/custrecord.nl?id=704
	@SandBox UserEvent Script	:-	/app/common/scripting/script.nl?id=1248
	@SandBox Clien Script		:-	/app/common/scripting/script.nl?id=1250
	@SandBox Restlet Script		:-	/app/common/scripting/script.nl?id=1269
	@SandBox RecordType URL		:-	/app/common/custom/custrecord.nl?id=583
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
				var JsonObj = [];
                JsonObj.push({
                    poId: poId,
                    MeleeItems: postData
                });
				AjaxRestlet(JsonObj);
				window.location.reload(true);
            }
			else 
			{
                alert('Please Enter Quantity..!!!');
            }
        }
    } 
	catch (ex) 
	{

    }
    return false;
}

function AjaxRestlet(JsonObj)
{
	var restUrl = nlapiResolveURL('RESTLET', 'customscript_melee_items_on_po_ia_restle', 'customdeploy_melee_items_on_po_ia_restle');
	//var restUrl = '/app/site/hosting/restlet.nl?script=1269&deploy=1';
	 var JsonText =JSON.stringify(JsonObj);
	 //alert(JsonText+restUrl);
	   $.ajax({

			type: "POST",
			contentType: "application/json;",
			url: restUrl,
			data: JsonText, 
			success: function (data) {
				alert('Melee Items successfully updated.');
				//alert(JSON.stringify(data));
			},
			error: function (result) {
              alert('Melee Items successfully updated.');
				//alert("Error");
				//alert(JSON.stringify(result));
			}
		});
	  return true;
}
/*
function submitMelee11(itemId,poId)
{
	try
	{
      
		//document.getElementById('wait').style.visibility = 'visible;';
		//$('.wait').toggle();
		var allInput = document.getElementsByClassName('subquantityinput');
		if(allInput.length > 0) 
		{
			var flag = false;
			var Obj = nlapiLoadRecord('purchaseorder',poId);
			for(var z=0; z<allInput.length; z++)
			{
				var elmnt = allInput[z];
				var NewQuantity = elmnt.value;
				 if (NewQuantity == '' )
				{
					alert('Please Enter Quantity..!!!');
					allInput[z].focus();
					//document.getElementById('wait').style.visibility = 'hidden;';
					return false;
				}
				var OldQuantity = elmnt.getAttribute('data-quantity');
				if(NewQuantity != OldQuantity)
				{
					flag = true;
					Obj.setLineItemValue('recmachcustrecord_melee_items_po_link', 'custrecord_melee_items_quantity' , elmnt.getAttribute('data-field'),NewQuantity);					
				}			
			}
			if(flag)
			{
				Obj.setFieldValue('custbody_melee_count_updated','T');
				Obj.setFieldValue('custbody_melee_items_inv_status','T');
				nlapiSubmitRecord(Obj,true,true);
				alert('Melee Items successfully updated.');
				window.location.reload(true);
			}
			else
			{
				alert('Please Enter Quantity..!!!');
			}			
		}		
	}
	catch(ex)
	{
		
	}
	//document.getElementById('wait').style.visibility = 'hidden;';
	return false;
}*/
/****************************Restlet Coding of script 1269*******************/

function postRESTletYagya(dataIn) 
{
    try 
	{
        
		nlapiLogExecution('DEBUG', 'Request data of PO ', dataIn);
       // var dataIn = JSON.parse(dataIn);
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