nlapiLogExecution("audit", "FLOStart", new Date().getTime());

function priority_PD_PO_Link_Item_Edit(type, form)
{
  if ( type == 'create' || type=='view' || type=='edit')
  {
    nlapiLogExecution('debug','veiw operation','view operatin performed');
    var context = nlapiGetContext();
    var exeContext = context.getExecutionContext();

    if (exeContext == 'custommassupdate' || exeContext=='scheduled') {
      nlapiLogExecution('debug', 'Triggered by Mass Update', 'Exiting script.');
      return true;
    }


    nlapiLogExecution("Debug", "PD PO Link value:", "test");
    var Item_ID = nlapiGetRecordId(); //get record id
    var Item_Type = nlapiGetRecordType(); //get record type
    var activeStatus=nlapiLookupField(Item_Type,Item_ID,'custitem160');
    if (!activeStatus || activeStatus=='-1')
    {
      try {
        var Item = nlapiLoadRecord(Item_Type, Item_ID); //get item record
        var old_Item = nlapiGetOldRecord();//get the old record
        var category = Item.getFieldText('custitem20');
        if (category == 'Setting with large center stone' || category == 'Ring with no large center stone') {
          ////////////////////category begin////////////////////////////
          var pD_PO_Link = Item.getFieldValue('custitemcustitem_pd_po_link');
          var pD_PO_Link_Value = Item.getFieldValue('custitemcustitem_pd_po_link');
          var old_PD_PO_Link_Value = old_Item.getFieldValue('custitemcustitem_pd_po_link');
          nlapiLogExecution("Debug", "Category value:", category);
          nlapiLogExecution("Debug", "PD PO Link value:", pD_PO_Link);
          nlapiLogExecution("Debug", "PD PO Link value:", pD_PO_Link_Value);
          nlapiLogExecution("Debug", "PD PO Link value equal null:", pD_PO_Link != null);
          nlapiLogExecution("Debug", "PD PO Link value equal null:", pD_PO_Link == '');
          nlapiLogExecution("Debug", "PD PO Link value equal null:", pD_PO_Link_Value == null);
          nlapiLogExecution("Debug", "Old PD PO Link value equal null:", old_PD_PO_Link_Value == null);
          if (pD_PO_Link_Value != null) {
            //////////////////PD PO Link not equal null//////////////////////
            var Record_Type = 'purchaseorder';//set record type
            var Record_ID = pD_PO_Link_Value;//set record id
            var Purchase = nlapiLoadRecord(Record_Type, Record_ID);
            var gender = Purchase.getFieldText('custbodycustbody_gender');
            var finish = Purchase.getFieldText('custbodyfinish');
            var centerStones = Purchase.getFieldText('custbodycustbodycenter_stones_avail');
            var notesForCopy = Purchase.getFieldValue('custbodycustbody_notes_for_copy');
            var shippingDays = Purchase.getFieldValue('custbodycustbody_shipping_days');
            var engravedStyle = Purchase.getFieldValue('custbodycustbody_engraved_style');
            var msSentFromSf = Purchase.getFieldValue('custbodycustbody_ms_sent_from_sf');
            var depth = Purchase.getFieldValue('custbody191');
            var width = Purchase.getFieldValue('custbody192');
            var minctwt = Purchase.getFieldValue('custbodycustbody_min_ct_wt');
            var status = Purchase.getFieldValue('status');
            var desApprStatus = Purchase.getFieldText('custbody41');
            //12212017
            var BackingType = Purchase.getFieldValue('custbodybacking_type');
            var ClaspType = Purchase.getFieldValue('custbodyclasp_type');
            var ChainLength = Purchase.getFieldValue('custbodychain_length');
            var FinishedJewelryWidth = Purchase.getFieldValue('custbodyfinished_jewelry_width_mm');
            var FinishedJewelryLength = Purchase.getFieldValue('custbodyfinished_jewelry_length_mm');
            var Contour = Purchase.getFieldValue('custbodycontour');
            var MilledDesign = Purchase.getFieldValue('custbodymilled_design');
            var EternityDesign = Purchase.getFieldValue('custbodyeternity_design');
            var AccentSettingStyle = Purchase.getFieldValue('custbodyaccent_setting_style');
            var CenterSettingStyle = Purchase.getFieldValue('custbodycenter_setting_style');
            var HaloStyle = Purchase.getFieldValue('custbodyhalo_style');
            var RingDepth = Purchase.getFieldValue('custbody191');
            var RingWidth = Purchase.getFieldValue('custbody192');
            var MinCtWt = Purchase.getFieldValue('custbodycustbody_min_ct_wt');
            var Main_Collection = Purchase.getFieldValue('custbody_main_collection');
            var Trend = Purchase.getFieldValue('custbody_trend');
            var Gallery_Accents = Purchase.getFieldValue('custbody_gallery_accents');
            var Prongs = Purchase.getFieldValue('custbody_prongs');
            var Split_Shank = Purchase.getFieldValue('custbody_split_shank');
            var Milgrain = Purchase.getFieldValue('custbody_milgrain_check');
            var Fancy_Melee = Purchase.getFieldValue('custbody_fancy_melee');
            var Halo_Shape = Purchase.getFieldValue('custbody_halo_shape');
            var Coverage = Purchase.getFieldValue('custbody_coverage');
            var Center_Stone_min_size_mm=Purchase.getFieldValue('custbodycenter_stone_min_size_mm');
            var typeOfSetting=Purchase.getFieldValue('custbodycenter_setting_style');
            nlapiLogExecution("Debug", "PO Backing Type value:", BackingType);
            nlapiLogExecution("Debug", "PO Clasp Type value:", ClaspType);
            nlapiLogExecution("Debug", "PO Chain Length value:", ChainLength);
            nlapiLogExecution("Debug", "PO Finished Jewelry Width value:", FinishedJewelryWidth);
            nlapiLogExecution("Debug", "PO Finished Jewelry Length value:", FinishedJewelryLength);
            nlapiLogExecution("Debug", "PO Contour value:", Contour);
            nlapiLogExecution("Debug", "Milled Design value :", MilledDesign);

            nlapiLogExecution("Debug", "Eternity Design value :", EternityDesign);
            nlapiLogExecution("Debug", "Accent Setting Style value :", AccentSettingStyle);
            nlapiLogExecution("Debug", "Center Setting Style value :", CenterSettingStyle);
            nlapiLogExecution("Debug", "Halo Style value :", HaloStyle);
            nlapiLogExecution("Debug", "Ring Depth value :", RingDepth);
            nlapiLogExecution("Debug", "Ring Width value :", RingWidth);
            nlapiLogExecution("Debug", "MinCt.Wt. value :", MinCtWt);
            // 12212017
            nlapiLogExecution("Debug", "PO Gender value:", gender);
            nlapiLogExecution("Debug", "PO Finish value:", finish);
            nlapiLogExecution("Debug", "PO Center Stones Available value:", centerStones);
            nlapiLogExecution("Debug", "PO Notes For Copy value:", notesForCopy);
            nlapiLogExecution("Debug", "PO Shipping Days value:", shippingDays);
            nlapiLogExecution("Debug", "PO Engraved Style value:", engravedStyle);
            nlapiLogExecution("Debug", "PO Melee/slides sent from SF value:", msSentFromSf);
            nlapiLogExecution("Debug", "PO Depth from SF value:", depth);
            nlapiLogExecution("Debug", "PO Width value:", width);
            nlapiLogExecution("Debug", "PO Min Ct. Wt. value:", minctwt);
            nlapiLogExecution("Debug", "PO Order Status value:", status);
            nlapiLogExecution("Debug", "PO Design Approval Status value:", desApprStatus);
            nlapiLogExecution("Debug", "Main Collection", Main_Collection);
            nlapiLogExecution("Debug", "Trend", Trend);
            nlapiLogExecution("Debug", "Gallery Accents", Gallery_Accents);
            nlapiLogExecution("Debug", "Prongs", Prongs);
            nlapiLogExecution("Debug", "Split Shank", Split_Shank);
            nlapiLogExecution("Debug", "Milgrain", Milgrain);
            nlapiLogExecution("Debug", "Fancy Melee", Fancy_Melee);
            nlapiLogExecution("Debug", "Halo Shape", Halo_Shape);
            nlapiLogExecution("Debug", "Coverage", Coverage);
            nlapiLogExecution("Debug", "PO Backing Type value:", BackingType);
            
            Item.setFieldValue('custitem6',typeOfSetting);
            //21122017
            Item.setFieldValue('custitembacking_type', BackingType);
            Item.setFieldValue('custitemclasp', ClaspType);
            Item.setFieldValue('custitemchain_length', ChainLength);
            Item.setFieldValue('custitemfinished_jewelry_width_mm', FinishedJewelryWidth);
            Item.setFieldValue('custitemfinished_jewelry_length_mm', FinishedJewelryLength);
            Item.setFieldValue('custitem_contour', Contour);
            Item.setFieldValue('custitem199', MilledDesign);
            Item.setFieldValue('custitem_main_collection', Main_Collection);
            Item.setFieldValue('custitem_trend', Trend);
            Item.setFieldValue('custitem_gallery_accents', Gallery_Accents);
            Item.setFieldValue('custitem_prongs', Prongs);
            Item.setFieldValue('custitem_split_shank', Split_Shank);
            Item.setFieldValue('custitem_milgrain_check', Milgrain);
            Item.setFieldValue('custitem_fancy_melee', Fancy_Melee);
            Item.setFieldValue('custitem_halo_shape', Halo_Shape);
            Item.setFieldValue('custitem_coverage', Coverage);
            if (EternityDesign == 'T') {
              Item.setFieldValue('custitem172', 1);
            }
            else {
              Item.setFieldValue('custitem172', 2);
            }

            Item.setFieldValue('custitem6',CenterSettingStyle);
            Item.setFieldValue('custitemaccent_setting_style', AccentSettingStyle);
            Item.setFieldValue('custitemhalo_setting', HaloStyle);
            Item.setFieldValue('custitem3', gender);
            Item.setFieldText('custitemcustitem_finish', finish);
            Item.setFieldText('custitemcenter_stones_available', centerStones);
            Item.setFieldValue('custitem141', notesForCopy);
            Item.setFieldValue('custitemshipping_days', shippingDays);
            Item.setFieldValue('custitemengraved_style', engravedStyle);
            Item.setFieldValue('custitemmelee_sides_sent_from_sf', msSentFromSf);
            Item.setFieldValue('custitem17', depth);
            Item.setFieldValue('custitem15', width);
            Item.setFieldValue('custitemcustitem_min_ct_wt', minctwt);
            Item.setFieldValue('custitemcenterstoneminsize',Center_Stone_min_size_mm);
            //else
            //	Item.setFieldValue('custitemcustitem_min_ct_wt',null);
            //if(status=='Pending Bill' || desApprStatus == 'Finished Custom Pending Approval')
            if (desApprStatus == 'Finished Item Approved' && old_PD_PO_Link_Value == null)//Finished Custom Pending Approval
            {
              var photograph = Item.getFieldText('custitem85');
              if (photograph != 'To Be Photographed') {
                Item.setFieldText('custitem85', 'To Be Photographed');
              }
            }

            if (desApprStatus == 'Finished Item Approved' && old_PD_PO_Link_Value != pD_PO_Link_Value)//Finished Custom Pending Approval
            {
              var photograph = Item.getFieldText('custitem85');
              if (photograph != 'To Be Photographed') {
                Item.setFieldText('custitem85', 'To Be Photographed');
              }
            }

            try {
              var id = nlapiSubmitRecord(Item);
              nlapiLogExecution('DEBUG', 'submitted id ', id);
            } catch (e) {
              nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
            }
            ////////////////////PD PO Link not equal null////////////////////
          }
          /////////////////////////category end////////////////////////////
        }
        else
        {
          var pD_PO_Link = Item.getFieldValue('custitemcustitem_pd_po_link');
          var pD_PO_Link_Value = Item.getFieldValue('custitemcustitem_pd_po_link');
          var old_PD_PO_Link_Value = old_Item.getFieldValue('custitemcustitem_pd_po_link');
          nlapiLogExecution("Debug", "Category value:", category);
          nlapiLogExecution("Debug", "PD PO Link value:", pD_PO_Link);
          nlapiLogExecution("Debug", "PD PO Link value:", pD_PO_Link_Value);
          nlapiLogExecution("Debug", "PD PO Link value equal null:", pD_PO_Link != null);
          nlapiLogExecution("Debug", "PD PO Link value equal null:", pD_PO_Link == '');
          nlapiLogExecution("Debug", "PD PO Link value equal null:", pD_PO_Link_Value == null);
          nlapiLogExecution("Debug", "Old PD PO Link value equal null:", old_PD_PO_Link_Value == null);

          if (pD_PO_Link_Value != null) {
            //////////////////PD PO Link not equal null//////////////////////
            var Record_Type = 'purchaseorder';//set record type
            var Record_ID = pD_PO_Link_Value;//set record id
            var Purchase = nlapiLoadRecord(Record_Type, Record_ID);
            var gender = Purchase.getFieldText('custbodycustbody_gender');
            var finish = Purchase.getFieldText('custbodyfinish');
            var centerStones = Purchase.getFieldText('custbodycustbodycenter_stones_avail');
            var notesForCopy = Purchase.getFieldValue('custbodycustbody_notes_for_copy');
            var shippingDays = Purchase.getFieldValue('custbodycustbody_shipping_days');
            var engravedStyle = Purchase.getFieldValue('custbodycustbody_engraved_style');
            var msSentFromSf = Purchase.getFieldValue('custbodycustbody_ms_sent_from_sf');
            var depth = Purchase.getFieldValue('custbody191');
            var width = Purchase.getFieldValue('custbody192');
            var minctwt = Purchase.getFieldValue('custbodycustbody_min_ct_wt');
            var status = Purchase.getFieldValue('status');
            var desApprStatus = Purchase.getFieldText('custbody41');
            //12212017
            var BackingType = Purchase.getFieldValue('custbodybacking_type');
            var ClaspType = Purchase.getFieldValue('custbodyclasp_type');
            var ChainLength = Purchase.getFieldValue('custbodychain_length');
            var FinishedJewelryWidth = Purchase.getFieldValue('custbodyfinished_jewelry_width_mm');
            var FinishedJewelryLength = Purchase.getFieldValue('custbodyfinished_jewelry_length_mm');
            var Contour = Purchase.getFieldValue('custbodycontour');
            var MilledDesign = Purchase.getFieldValue('custbodymilled_design');
            var EternityDesign = Purchase.getFieldValue('custbodyeternity_design');
            var AccentSettingStyle = Purchase.getFieldValue('custbodyaccent_setting_style');
            var CenterSettingStyle = Purchase.getFieldValue('custbodycenter_setting_style');
            var HaloStyle = Purchase.getFieldValue('custbodyhalo_style');
            var RingDepth = Purchase.getFieldValue('custbody191');
            var RingWidth = Purchase.getFieldValue('custbody192');
            var MinCtWt = Purchase.getFieldValue('custbodycustbody_min_ct_wt');
            var Center_Stone_min_size_mm=Purchase.getFieldValue('custbodycenter_stone_min_size_mm');
            var typeOfSetting=Purchase.getFieldValue('custbodycenter_setting_style');
            nlapiLogExecution("Debug", "PO Backing Type value:", BackingType);
            nlapiLogExecution("Debug", "PO Clasp Type value:", ClaspType);
            nlapiLogExecution("Debug", "PO Chain Length value:", ChainLength);
            nlapiLogExecution("Debug", "PO Finished Jewelry Width value:", FinishedJewelryWidth);
            nlapiLogExecution("Debug", "PO Finished Jewelry Length value:", FinishedJewelryLength);
            nlapiLogExecution("Debug", "PO Contour value:", Contour);
            nlapiLogExecution("Debug", "Milled Design value :", MilledDesign);
            nlapiLogExecution("Debug", "Eternity Design value :", EternityDesign);
            nlapiLogExecution("Debug", "Accent Setting Style value :", AccentSettingStyle);
            nlapiLogExecution("Debug", "Center Setting Style value :", CenterSettingStyle);
            nlapiLogExecution("Debug", "Halo Style value :", HaloStyle);
            nlapiLogExecution("Debug", "Ring Depth value :", RingDepth);
            nlapiLogExecution("Debug", "Ring Width value :", RingWidth);
            nlapiLogExecution("Debug", "MinCt.Wt. value :", MinCtWt);
            // 12212017
            nlapiLogExecution("Debug", "PO Gender value:", gender);
            nlapiLogExecution("Debug", "PO Finish value:", finish);
            nlapiLogExecution("Debug", "PO Center Stones Available value:", centerStones);
            nlapiLogExecution("Debug", "PO Notes For Copy value:", notesForCopy);
            nlapiLogExecution("Debug", "PO Shipping Days value:", shippingDays);
            nlapiLogExecution("Debug", "PO Engraved Style value:", engravedStyle);
            nlapiLogExecution("Debug", "PO Melee/slides sent from SF value:", msSentFromSf);
            nlapiLogExecution("Debug", "PO Depth from SF value:", depth);
            nlapiLogExecution("Debug", "PO Width value:", width);
            nlapiLogExecution("Debug", "PO Min Ct. Wt. value:", minctwt);
            nlapiLogExecution("Debug", "PO Order Status value:", status);
            nlapiLogExecution("Debug", "PO Design Approval Status value:", desApprStatus);
            nlapiLogExecution("Debug", "Main Collection", Main_Collection);
            nlapiLogExecution("Debug", "Trend", Trend);
            nlapiLogExecution("Debug", "Gallery Accents", Gallery_Accents);
            nlapiLogExecution("Debug", "Prongs", Prongs);
            nlapiLogExecution("Debug", "Split Shank", Split_Shank);
            nlapiLogExecution("Debug", "Milgrain", Milgrain);
            nlapiLogExecution("Debug", "Fancy Melee", Fancy_Melee);
            nlapiLogExecution("Debug", "Halo Shape", Halo_Shape);
            nlapiLogExecution("Debug", "Coverage", Coverage);
            //21122017
            Item.setFieldValue('custitembacking_type', BackingType);
            Item.setFieldValue('custitemclasp', ClaspType);
            Item.setFieldValue('custitemchain_length', ChainLength);
            Item.setFieldValue('custitemfinished_jewelry_width_mm', FinishedJewelryWidth);
            Item.setFieldValue('custitemfinished_jewelry_length_mm', FinishedJewelryLength);
            Item.setFieldValue('custitem_contour', Contour);
            Item.setFieldValue('custitem199', MilledDesign);
            Item.setFieldValue('custitem6',typeOfSetting);
            if (EternityDesign == 'T') {
              Item.setFieldValue('custitem172', 1);
            }
            else {
              Item.setFieldValue('custitem172', 2);
            }
            Item.setFieldValue('custitemaccent_setting_style', AccentSettingStyle);
            Item.setFieldValue('custitem6',CenterSettingStyle);
            Item.setFieldValue('custitemhalo_setting', HaloStyle);


            Item.setFieldValue('custitem3', gender);
            Item.setFieldText('custitemcustitem_finish', finish);
            Item.setFieldText('custitemcenter_stones_available', centerStones);
            Item.setFieldValue('custitem141', notesForCopy);
            Item.setFieldValue('custitemshipping_days', shippingDays);
            Item.setFieldValue('custitemengraved_style', engravedStyle);
            Item.setFieldValue('custitemmelee_sides_sent_from_sf', msSentFromSf);
            Item.setFieldValue('custitem17', depth);
            Item.setFieldValue('custitem15', width);


            Item.setFieldValue('custitemcustitem_min_ct_wt', minctwt);
            Item.setFieldValue('custitemcenterstoneminsize',Center_Stone_min_size_mm);
            //else
            //	Item.setFieldValue('custitemcustitem_min_ct_wt',null);
            //if(status=='Pending Bill' || desApprStatus == 'Finished Custom Pending Approval')
            if (desApprStatus == 'Finished Item Approved' && old_PD_PO_Link_Value == null)//Finished Custom Pending Approval
            {
              var photograph = Item.getFieldText('custitem85');
              if (photograph != 'To Be Photographed') {
                Item.setFieldText('custitem85', 'To Be Photographed');
              }
            }

            if (desApprStatus == 'Finished Item Approved' && old_PD_PO_Link_Value != pD_PO_Link_Value)//Finished Custom Pending Approval
            {
              var photograph = Item.getFieldText('custitem85');
              if (photograph != 'To Be Photographed') {
                Item.setFieldText('custitem85', 'To Be Photographed');
              }
            }

            try {
              var id = nlapiSubmitRecord(Item);
              nlapiLogExecution('DEBUG', 'submitted id ', id);
            } catch (e) {
              nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
            }
            ////////////////////PD PO Link not equal null////////////////////
          }
          /////////////////////////category end////////////////////////////
        }


      }
      catch (err)
      {
        nlapiLogExecution("error", "Item Error", "Item Error Details: " + err.message);
      }
    }
  }
}