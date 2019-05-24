/**
@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
@Task			   			:-	NS-671 (Melee Items on PO - IA update)
@Script Type   				:-	User Event Script
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

function MeleeItemsOnPO_IA_Update(type,form)
{
   var flag = false;
   try
   {
      var context = nlapiGetContext();
      var contextType = context.getExecutionContext();
      nlapiLogExecution('debug','contextType is '+contextType,'type is '+type);
      if((type == 'view' || type == 'edit') && (contextType=="userinterface"))
      {
         var poId = nlapiGetRecordId();
         var obj =  nlapiLoadRecord('purchaseorder',poId);
         var soId = obj.getFieldValue('createdfrom');
         if( soId != '' && soId !=null )
         {
            var status = nlapiLookupField('salesorder',soId,'status');
            if(status != 'pendingApproval' )
            {
               var Count = obj.getLineItemCount('item');
               if(Count>0)
               {
                  for(var z = 1; z <= Count; z++ )
                  {
                     var ItemId = obj.getLineItemValue('item','item',z);
                     var itemObj = nlapiLoadRecord('inventoryitem',ItemId);
                     //,['custitem20','custitemhalo_setting','custitem172','','','']);
                     var HaloSetting = itemObj.getFieldValue('custitemhalo_setting');
                     var Eternity = itemObj.getFieldValue('custitem172');
                     var TotalQty = 0;
                     var MeleeFlag = false;
                     nlapiLogExecution('debug','Eternity #'+Eternity,'HaloSetting #'+HaloSetting );
                     if(HaloSetting == 'T' || Eternity == 1)
                     {
                        var parent_flag = false;
                        var Category = itemObj.getFieldValue('custitem20');
                        if(HaloSetting == 'T' && Category == '2')
                        {
                           var custitem30 ='';
                           var shape = '';
                           // itemObj.getFieldValue('custitem5');
                           var ItemLink = obj.getLineItemValue('item','custcolitem_link',z);
                           nlapiLogExecution('debug','ItemLink is '+ItemLink);
                           if(ItemLink != '' && ItemLink != null)
                           {
                              var temp_obj = nlapiLookupField('inventoryitem', ItemLink,['custitem5','custitem30']);
                              shape = temp_obj.custitem5;
                              custitem30 = temp_obj.custitem30;

                              nlapiLogExecution('debug','shape is '+shape,'custitem30 '+custitem30);
                              var parent = itemObj.getFieldValue('parent');
                              if(parent && custitem30)
                              {
                                 if(Page(parent,shape,custitem30))
                                 {
                                    flag = true;
                                 }
                                 else
                                 {
                                    if(obj.getFieldValue('custbody_melee_items_updated_by_parent') != 'T')
                                    {
                                       nlapiSubmitField('purchaseorder',poId,'custbody_melee_items_updated_by_parent','T');
                                       Reload(type,poId);
                                    }
                                 }
                              }
                              else
                              {
                                 flag = true;
                                 nlapiLogExecution('debug','parent OR shape field is empty');

                              }
                           }
                           else
                           {
                              flag = true;
                              nlapiLogExecution('debug','Item link not found bu botton should be comming');
                           }
                        }
                        else if(Eternity == 1)
                        {
                           MeleeFlag = true;
                           obj.setFieldValue('custbody_melee_items_updated_by_parent','T');
                           var RingSize = itemObj.getFieldText('custitem2');
                           nlapiLogExecution('debug','RingSize',RingSize);
                           if(RingSize != '' && RingSize != null )
                           {
                              var fieldName = 'custitemeternitymeleecountsize'+RingSize.replace('.','');
                              TotalQty = itemObj.getFieldValue(fieldName);
                              if(TotalQty != '' && TotalQty != null)
                              {
                                 flag = true;
                              }
                           }
                        }
                     }
                     else
                     {
                        nlapiLogExecution('debug','HaloSetting OR Eternity Not match for item #'+ItemId,'SO #'+soId );
                     }
                     if(flag)
                     {
                        nlapiLogExecution('debug','Melee Item found on PO #'+poId);
                        var data = '';
                        nlapiLogExecution('debug',"test 11");
                        if(nlapiGetFieldValue('custbody_melee_items_inv_status') != 'T')
                        {
                           nlapiLogExecution('debug',"test 12");
                           var MeleeItemsText = '[';
                           MeleeItemsText += '{"item":"' + itemObj.getFieldValue('custitem9')+'","quantity":"' + itemObj.getFieldValue('custitem8')+'"},';
                           MeleeItemsText += '{"item":"' + itemObj.getFieldValue('custitem11')+'","quantity":"' + itemObj.getFieldValue('custitem10')+'"},';
                           MeleeItemsText += '{"item":"' + itemObj.getFieldValue('custitem13')+'","quantity":"' + itemObj.getFieldValue('custitem12')+'"},';
                           MeleeItemsText += '{"item":"' + itemObj.getFieldValue('custitem94')+'","quantity":"' + itemObj.getFieldValue('custitem95')+'"},';
                           MeleeItemsText += '{"item":"' + itemObj.getFieldValue('custitem_sub_item_5')+'","quantity":"' + itemObj.getFieldValue('custitem_quantity_5')+'"},';
                           MeleeItemsText += '{"item":"' + itemObj.getFieldValue('custitem_sub_item_6')+'","quantity":"' + itemObj.getFieldValue('custitem_quantity_6')+'"},';
                           MeleeItemsText += '{"item":"' + itemObj.getFieldValue('custitem_sub_item_7')+'","quantity":"' + itemObj.getFieldValue('custitem_quantity_7')+'"}';
                           MeleeItemsText += ']';
                           nlapiLogExecution('debug','SO MeleeItemsText #'+MeleeItemsText);
                           var MeleeItemsObj = JSON.parse(MeleeItemsText);
                           var MeleeItems = RemoveNull(MeleeItemsObj);
                           nlapiLogExecution('debug','SO MeleeItemsText #',JSON.stringify(MeleeItems));
                           var MeleeItemsJSON = [];
                           obj.setFieldValue('custbody_melee_items_inv_status','T');
                           for(var E=0; E< MeleeItems.length; E++)
                           {
                              var quantity1 = MeleeItems[E].quantity;
                              obj.setLineItemValue('recmachcustrecord_melee_items_po_link', 'custrecord_melee_items_item' , E+1,MeleeItems[E].item);

                              if(TotalQty != '' && TotalQty != null)
                              {
                                 quantity1 = TotalQty;
                              }
                              obj.setLineItemValue('recmachcustrecord_melee_items_po_link', 'custrecord_melee_items_quantity',E+1,  quantity1) ;
                           }
                           try
                           {
                              nlapiSubmitRecord(obj,true,true);
                           }
                           catch(e)
                           {
                              nlapiLogExecution('ERROR',e.getCode(),e.getDetails() );
                              return true;
                           }
                           Reload(type,poId);
                        }
                        else if(type == 'view' )
                        {
                           var MStatus = obj.getFieldValue('custbody_melee_count_updated');
                           nlapiLogExecution('debug',"test 1");
                           if(MStatus != 'T')
                           {
                              nlapiLogExecution('debug',"test 2");
                              var MCount =  obj.getLineItemCount('recmachcustrecord_melee_items_po_link');
                              if(MCount>0)
                              {
                                 nlapiLogExecution('debug',"test 3");
                                 var html_store_melee_count = '';
                                 var store_melee_count = obj.getFieldValue('custbody_store_melee_count');
                                 if(store_melee_count == 'T')
                                 {
                                    html_store_melee_count = 'checked';
                                 }
                                 html_store_melee_count = '<tr><td colspan="3"><input type="checkbox" id="chk_store_melee_count_popup" data-chk="'+html_store_melee_count+'" '+html_store_melee_count+' style="width: 20px;margin-left: -1px;float: left;height: 20px;"><p style="line-height: 26px;font-size: 13px;font-weight: 600;">Store Melee Count</p> </td></tr>';


                                 for(var E=1; E<= MCount; E++)
                                 {
                                    var qqty = obj.getLineItemValue("recmachcustrecord_melee_items_po_link", "custrecord_melee_items_quantity" , E);
                                    data += '<tr><td><span class="ItemName" >'+obj.getLineItemText("recmachcustrecord_melee_items_po_link", "custrecord_melee_items_item" , E)+'</span> </td><td style="text-align: center;" >'+qqty+'</td><td><input type="text"  onkeypress="return event.charCode >= 48 && event.charCode <= 57" class="subquantityinput" data-quantity="'+qqty+'"  data-field="'+ E+'" /></td></tr>';
                                 }

                                 form.addButton('custpage_melee_tems_button','Update Melee Count',"return PopupMelee_Items_Show();");
                                 var table='<table class="MeleeItemsCSS" style="width:500px; border: none;"><tr><td><input type="submit" class="submitMelee" value="Save" data-type="'+MeleeFlag+'" data-poId="'+poId+'" data-MainItem="'+ItemId+'"  data-melee="'+TotalQty+'" onclick="return submitMelee(this);" />|<input type="submit" class="submitClose" value="Close" onclick="return PopupMelee_Items_Show();" /></td><td data-src="" id="wait" ></td></tr><tr><td></td><td><b>Current Quantity</b></td><td><b>Quantity</b></td></tr>'+data+ html_store_melee_count+'</table>';
                                 var html1='<style>.MeleeItemsCSS tr:nth-child(even) {background: rgba(96, 119, 153, 0.06); line-height: 3;} .MeleeItemsCSS tr:nth-child(odd) {background: #FFF}.submitClose{padding: 5px 20px 8px 20px;background-color: #f1f1f1 !important;color: black;font-weight: bold;border-radius: 5px;margin-left: 10px;border: solid 2px silver;cursor: pointer;}.submitMelee{border: solid 2px silver;cursor: pointer;padding: 5px 20px 8px 20px;background-color: #1467cc !important;color: white;font-weight: bold;border-radius: 5px; margin-right: 10px;}.subquantityinput{width: 100%;padding:10px;}.ItemName{font-Weight:bold;}.popup-inner{    border: solid #607799 5px;padding:40px;position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);box-shadow:0 2px 6px rgba(0,0,0,1);border-radius:3px;background:#fff}.popup{z-index: 99999999999999999999999999999; width: 70%;height: 80%;position: fixed;top: 10%;left: 15%;}.payment{padding-bottom:15px}.payment-text{width:70%;padding:8px}.payment-button{padding:10px}</style><div class="popup" data-popup="popup-1" id="popup"><div class="popup-inner">'+table+'</div></div>';
                                 var html='<script type="text/javascript"> function PopupMelee_Items_Show(){ $("#testItem").toggle(); return false;}; </script><div id="testItem" style="display: none;" >'+html1+'</div>';
                                 var htmlHeader = form.addField('custpage_melee_tems_header', 'inlinehtml');
                                 htmlHeader.setDefaultValue(html);
                                 form.setScript('customscript_melee_items_on_po_ia_client');
                              }
                           }
                           else
                           {
                              nlapiLogExecution('debug',' Melee Count Updated checkbox is ',MStatus);
                           }
                        }
                        else if(type == 'edit' )
                        {
                           var ResultQty = 0;
                           var fil = [];
                           fil.push(new nlobjSearchFilter('custrecord_melee_items_po_link',null, 'is',nlapiGetRecordId()));
                           var col = [];
                           col.push(new nlobjSearchColumn('custrecord_melee_items_quantity',null,'sum'));
                           var Result = nlapiSearchRecord('customrecord_melee_items',null,fil,col);
                           if(Result)
                           {
                              if(Result[0].getValue('custrecord_melee_items_quantity',null,'sum'))
                              {
                                 ResultQty = Result[0].getValue('custrecord_melee_items_quantity',null,'sum')
                              }
                           }
                           var TempQty = [TotalQty,ResultQty];
                           form.addField('custpage_melee_tems_type','text','Melee Item Type').setDisplayType('hidden').setDefaultValue(MeleeFlag);
                           form.addField('custpage_melee_tems_qty','text','Melee Item Total Qty').setDisplayType('hidden').setDefaultValue(JSON.stringify(TempQty));
                           //form.addField('custpage_melee_tems_type','text','Melee Item Type').setDefaultValue(MeleeFlag);
                           //form.addField('custpage_melee_tems_qty','text','Melee Item Total Qty').setDefaultValue(JSON.stringify(TempQty));
                        }
                        return true;
                        break;
                     }
                     else
                     {
                        nlapiLogExecution('debug','Not found Melee Item',poId);
                     }
                  }
               }
            }
            else
            {
               nlapiLogExecution('debug','SO #'+soId+' is not approved for PO #'+poId);
            }
         }
         else
         {
            nlapiLogExecution('debug','SO not found on PO #'+poId);
         }
      }
   }
   catch(ex)
   {
      nlapiLogExecution('debug','Error on page',ex);
   }
   if(!flag)
   {
      var html='<style>#recmachcustrecord_melee_items_po_linklnk{display:none;} </style>';
      if(type=='edit')
      {
         html='<style>#recmachcustrecord_melee_items_po_linktxt{display:none;} </style>';
      }
      var htmlHeader = form.addField('custpage_melee_tems_header11', 'inlinehtml');
      htmlHeader.setDefaultValue(html);
   }
}

//  ---------------------------------------

function Reload(type,poId)
{
   if(type == 'view')
   {
      nlapiSetRedirectURL('RECORD','purchaseorder', poId, false);
   }
   else if(type == 'edit')
   {
      nlapiSetRedirectURL('RECORD','purchaseorder', poId, true);
   }
}

//  ---------------------------------------

function RemoveNull(MeleeItemsObj)
{
   var MeleeItems = [];
   for(var x=0; x < MeleeItemsObj.length; x++)
   {
      var item = MeleeItemsObj[x].item;
      if(item != '' && item != null && item != 'null' )
      {
         var quantity = MeleeItemsObj[x].quantity;
         if(quantity == '' || quantity == null)
         {
            quantity = 0;
         }
         MeleeItems.push(
         {
            item	: 	item,
            quantity:	quantity
         }
         );
      }
   }
   return MeleeItems;
}

//  ---------------------------------------

function Page(parent,shape,custitem30)
{
   var flag = true;
   try
   {
      if(parent && custitem30)
      {
         var fill = [];
         fill.push(new nlobjSearchFilter('custrecord_parent_halo',null,'is',parent));
         fill.push(new nlobjSearchFilter('custrecord_center_shape',null,'is',shape));
         //nlapiLogExecution('debug','parent #'+parent,'SUB_ITEM '+JSON.stringify(SUB_ITEM));
         var result = nlapiSearchRecord('customrecord_halo_melee',null,fill,new nlobjSearchColumn('custrecord_center_size'));
         if(result != null && result != '' && result.length > 0)
         {

            nlapiLogExecution('debug','Halo Melee Records ',JSON.stringify(result));
            if(shape == 1)
            {

               var mesearureSize = parseFloat(custitem30);

               nlapiLogExecution('debug','main size :'+custitem30);
               for(var l=0; l< result.length; l++)
               {
                  var center_size = result[l].getValue('custrecord_center_size');
                  if( center_size )
                  {
                     var range1 = parseFloat(center_size) - 0.25;
                     var range2 = parseFloat(center_size) + 0.25;
                     var range3 = parseFloat(center_size);

                     nlapiLogExecution('debug','main size 1 : '+center_size);
                     if((range1 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2) || (range3 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2))
                     {
                        nlapiLogExecution('debug','Match ID ',result[l].getId());
                        flag = false;
                        return false;
                     }
                  }
               }
            }
            else
            {
               var measure_center_size_halo_melee_count = custitem30;
               measure_center_size_halo_melee_count = measure_center_size_halo_melee_count.split('x');
               var r1 = parseFloat(measure_center_size_halo_melee_count[0]) - parseFloat(0.20);
               var r2 = parseFloat(measure_center_size_halo_melee_count[1]) - parseFloat(0.20);

               var r3 = parseFloat(measure_center_size_halo_melee_count[0]) + parseFloat(0.20);
               var r4 = parseFloat(measure_center_size_halo_melee_count[1]) + parseFloat(0.20);

               var r5 = parseFloat(measure_center_size_halo_melee_count[0]) - parseFloat(0.10);
               var r6 = parseFloat(measure_center_size_halo_melee_count[1]) + parseFloat(0.10);

               var r7 = parseFloat(measure_center_size_halo_melee_count[0]) + parseFloat(0.10);
               var r8 = parseFloat(measure_center_size_halo_melee_count[1]) - parseFloat(0.10);

               var r1_20_min_1 = r1.toFixed(2);
               var r3_20_max_1 = r3.toFixed(2);

               var r2_20_min_2 = r2.toFixed(2);
               var r4_20_max_2 = r4.toFixed(2);

               var r5_10_min_1 = r5.toFixed(2);
               var r7_10_max_1 = r7.toFixed(2);

               var r8_10_min_2 = r8.toFixed(2);
               var r6_10_max_2 = r6.toFixed(2);

               nlapiLogExecution('debug','main size :'+custitem30);
               for(var l=0; l< result.length; l++)
               {
                  var center_size = result[l].getValue('custrecord_center_size');
                  if(center_size)
                  {
                     nlapiLogExecution('debug','Halo melee count page center size: '+center_size);
                     var center_arr = center_size.split('x');
                     var m1 = parseFloat(center_arr[0]);
                     var m2 = parseFloat(center_arr[1]);
                     if((parseFloat(m1)== parseFloat(r1_20_min_1) || parseFloat(m1)== parseFloat(r3_20_max_1)) || (parseFloat(m1)>parseFloat(r1_20_min_1)&& parseFloat(m1)<parseFloat(r3_20_max_1)))
                     {
                        if((parseFloat(m2)== parseFloat(r2_20_min_2) || parseFloat(m2)== parseFloat(r4_20_max_2)) || (parseFloat(m2)>parseFloat(r2_20_min_2)&& parseFloat(m2)<parseFloat(r4_20_max_2)))
                        {
                           nlapiLogExecution('debug','Matched halo melee count page ID (range 1 & range 2) : ',result[l].getId());
                           flag = false;
                           return false;
                        }
                     }
                     if((parseFloat(m1)== parseFloat(r5_10_min_1) || parseFloat(m1)== parseFloat(r7_10_max_1)) || (parseFloat(m1)>parseFloat(r5_10_min_1)&& parseFloat(m1)<parseFloat(r7_10_max_1)))
                     {
                        if((parseFloat(m2)== parseFloat(r8_10_min_2) || parseFloat(m2)== parseFloat(r6_10_max_2)) || (parseFloat(m2)>parseFloat(r8_10_min_2)&& parseFloat(m2)<parseFloat(r6_10_max_2)))
                        {
                           nlapiLogExecution('debug','Matched halo melee count page ID (range 3 & range 4) : ',result[l].getId());
                           flag = false;
                           return false;
                        }
                     }
                  }
               }
            }
         }
      }
   }
   catch(W)
   {
      nlapiLogExecution('debug','Match Error',W);
   }
   return flag;
}

//  ---------------------------------------
