function Update_Stores_Halo_Melee_Count(poId,storeMeleeCount,new_center_size)
{
  var matching_halo_melee_count_page_url='';
  try
  {
    var obj =  nlapiLoadRecord('purchaseorder',poId);
    var shape =0
    var custitem30 ='';
    var Count = obj.getLineItemCount('item');
    if(Count>0)
    {
      for(var z = 1; z <= Count; z++ )
      {
        var ItemId = obj.getLineItemValue('item','item',z);
        //var itemObj = nlapiLoadRecord('inventoryitem',ItemId);
        var ItemLink = obj.getLineItemValue('item','custcolitem_link',z);
        nlapiLogExecution('debug','ItemLink in Update_Stores_Halo_Melee_Count() fun is '+ItemLink);
        if(ItemLink != '' && ItemLink != null)
        {
          var temp_obj = nlapiLookupField('inventoryitem', ItemLink,['custitem5','custitem30']);
          shape = temp_obj.custitem5;
          custitem30 = temp_obj.custitem30;
          nlapiLogExecution('DEBUG','shape and measurements in Update_Stores_Halo_Melee_Count() fun' ,'shape is '+shape +' & measurements is '+ custitem30);
          var parent = nlapiLookupField('inventoryitem',ItemId,'parent');
          //var parent = itemObj.getFieldValue('parent');
          getStoreHaloMeleeCountPageDetails(parent,custitem30,shape,storeMeleeCount,new_center_size,poId);  
        }// end if block for itemlink 
      }// end for loop having variable count
    }//end if part of count				  
  }
  catch(ex)
  {
    nlapiLogExecution('DEBUG','Error has been occurred in Update_Stores_Halo_Melee_Count() fun',ex.message);
  }
}

function getStoreHaloMeleeCountPageDetails(parent,custitem30,shape,storeMeleeCount,new_center_size,poId)
{
  try
  {
    var matching_halo_melee_count_page_url ='';
    if(parent && custitem30)
    {
      var fill = [];
      fill.push(new nlobjSearchFilter('custrecord_parent_halo',null,'is',parent));
      fill.push(new nlobjSearchFilter('custrecord_center_shape',null,'is',shape));
      var result = nlapiSearchRecord('customrecord_halo_melee',null,fill,new nlobjSearchColumn('custrecord_center_size'));
      nlapiLogExecution('debug','Halo Melee Records (Result) ',JSON.stringify(result));
      if(result != null && result != '' && result.length > 0)
      {
        if(shape == 1)
        {
          var mesearureSize = parseFloat(custitem30);
          nlapiLogExecution('debug','main size in getStoreHaloMeleeCountPageDetails() fun:'+custitem30);
          for(var l=0; l< result.length; l++)
          {
            var center_size = result[l].getValue('custrecord_center_size');
            if( center_size )
            {
              var range1 = parseFloat(center_size) - 0.25;
              var range2 = parseFloat(center_size) + 0.25;
              var range3 = parseFloat(center_size);

              nlapiLogExecution('debug','main size 1 in getStoreHaloMeleeCountPageDetails() fun: '+center_size);
              if((range1 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2) || (range3 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2))
              {
                nlapiLogExecution('debug','Match ID in getStoreHaloMeleeCountPageDetails() fun',result[l].getId());
                matching_halo_melee_count_page_url= nlapiResolveURL ('record' , 'customrecord_halo_melee' , result[l].getId());
                nlapiLogExecution('debug','Matching halo melee count page url in getStoreHaloMeleeCountPageDetails() fun (1)',matching_halo_melee_count_page_url);

                var matching_halo_melee_count_rec = nlapiLookupField('purchaseorder',poId,'custbody_matching_halo_melee_count_rec');
                nlapiLogExecution('debug','Value of Matching Halo Melee Count Page Url (In Restlet)',matching_halo_melee_count_rec );
                if(matching_halo_melee_count_rec == '' || matching_halo_melee_count_rec == null)
                  nlapiSubmitField("purchaseorder",poId,'custbody_matching_halo_melee_count_rec',matching_halo_melee_count_page_url);

                if(storeMeleeCount == 'T')
                  nlapiSubmitField("customrecord_halo_melee",result[l].getId(),'custrecord_center_size' ,new_center_size);
                break;
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

          nlapiLogExecution('DEBUG','main size for non-round in getStoreHaloMeleeCountPageDetails() fun:'+custitem30);
          for(var l=0; l< result.length; l++)
          {
            var center_size = result[l].getValue('custrecord_center_size');
            if(center_size)
            {
              nlapiLogExecution('DEBUG','Halo melee count page center size in getStoreHaloMeleeCountPageDetails() fun: '+center_size);
              var center_arr = center_size.split('x');
              var m1 = parseFloat(center_arr[0]);
              var m2 = parseFloat(center_arr[1]);
              if((parseFloat(m1)== parseFloat(r1_20_min_1) || parseFloat(m1)== parseFloat(r3_20_max_1)) || (parseFloat(m1)>parseFloat(r1_20_min_1)&& parseFloat(m1)<parseFloat(r3_20_max_1)))
              {
                if((parseFloat(m2)== parseFloat(r2_20_min_2) || parseFloat(m2)== parseFloat(r4_20_max_2)) || (parseFloat(m2)>parseFloat(r2_20_min_2)&& parseFloat(m2)<parseFloat(r4_20_max_2)))
                {
                  nlapiLogExecution('DEBUG','Matched halo melee count page ID (range 1 & range 2) in getStoreHaloMeleeCountPageDetails() fun: ',result[l].getId());
                  matching_halo_melee_count_page_url= nlapiResolveURL ('record' , 'customrecord_halo_melee' , result[l].getId());
                  nlapiLogExecution('debug','Matching halo melee count page url in getStoreHaloMeleeCountPageDetails() fun (2)',matching_halo_melee_count_page_url);

                  var matching_halo_melee_count_rec = nlapiLookupField('purchaseorder',poId,'custbody_matching_halo_melee_count_rec');
                  nlapiLogExecution('debug','Value of Matching Halo Melee Count Page Url (In Restlet) (range 1 & range 2)',matching_halo_melee_count_rec );
                  if(matching_halo_melee_count_rec=='' || matching_halo_melee_count_rec == null)
                    nlapiSubmitField("purchaseorder",poId,'custbody_matching_halo_melee_count_rec',matching_halo_melee_count_page_url);

                  if(storeMeleeCount == 'T')
                    nlapiSubmitField("customrecord_halo_melee",result[l].getId(),'custrecord_center_size',new_center_size);
                  break;
                }
              }
              if((parseFloat(m1)== parseFloat(r5_10_min_1) || parseFloat(m1)== parseFloat(r7_10_max_1)) || (parseFloat(m1)>parseFloat(r5_10_min_1)&& parseFloat(m1)<parseFloat(r7_10_max_1)))
              {
                if((parseFloat(m2)== parseFloat(r8_10_min_2) || parseFloat(m2)== parseFloat(r6_10_max_2)) || (parseFloat(m2)>parseFloat(r8_10_min_2)&& parseFloat(m2)<parseFloat(r6_10_max_2)))
                {
                  nlapiLogExecution('DEBUG','Matched halo melee count page ID (range 3 & range 4) in getStoreHaloMeleeCountPageDetails() fun : ',result[l].getId());
                  matching_halo_melee_count_page_url= nlapiResolveURL ('record' , 'customrecord_halo_melee' , result[l].getId());
                  nlapiLogExecution('debug','Matching halo melee count page url in getStoreHaloMeleeCountPageDetails() fun (3)',matching_halo_melee_count_page_url);

                  var matching_halo_melee_count_rec = nlapiLookupField('purchaseorder',poId,'custbody_matching_halo_melee_count_rec');
                  nlapiLogExecution('debug','Value of Matching Halo Melee Count Page Url (In Restlet) (range 3 & range 4)',matching_halo_melee_count_rec );
                  if(matching_halo_melee_count_rec=='' || matching_halo_melee_count_rec == null)
                    nlapiSubmitField("purchaseorder",poId,'custbody_matching_halo_melee_count_rec',matching_halo_melee_count_page_url);

                  if(storeMeleeCount == 'T')
                    nlapiSubmitField("customrecord_halo_melee",result[l].getId(),'custrecord_center_size',new_center_size);
                  break;
                }
              }
            }// end of if part for center size
          }// end for loop for innermost result
        }//end else part for non-round shape
      }// end if part for result
    }// end if part for parent and custitem 30
  }
  catch(ex)
  {
    nlapiLogExecution('DEBUG','Error has been occurred in getStoreHaloMeleeCountPageDetails() fun',ex.message);
  }
}