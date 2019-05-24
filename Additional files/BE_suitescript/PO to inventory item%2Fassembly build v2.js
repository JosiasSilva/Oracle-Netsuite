/*=====This script uses saved search(customsearch_po_modified_within24hours sandbox) retrieves all PO modified within 24 hours and snyc that PO fields
values with corresponding inventory or Assembly billed fields, The script were created to fulfill requirement of task NS-1028  as mentioned on date 12/01/2018  to automate sync process with help of scheduled script =====*/


function UpdatePOtoInvAssmItems()
{
  try
  {
    var mySearch = nlapiLoadSearch(null, 'customsearch_po_modified_within24hours'); // For Sandbox #customsearch_po_modified_within24hours
    var searchresult = [];
    var resultset = mySearch.runSearch();
    var searchid = 0;
    do
    {
      var resultslice = resultset.getResults(searchid, searchid + 1000);
      if (resultslice != null && resultslice != '')
      {
        for (var rs in resultslice)
        {
          searchresult.push(resultslice[rs]);
          searchid++;
        }
      }
    } while (resultslice.length >= 1000);
    var searchCount = searchresult.length;
    if (searchCount > 0)
    {
      for(var j = 0; j <searchresult.length; j++)
      {
        if (nlapiGetContext().getRemainingUsage() < 500) {
          var stateMain = nlapiYieldScript();
          if (stateMain.status == 'FAILURE') {
            nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
            throw "Failed to yield script";
          } else if (stateMain.status == 'RESUME') {
            nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
          }
        }
        var email =false;
        //=======Fields of PO that needs to sync with corresponding fields of Inventory and Assembly Billed  item...==================
        var orderId= searchresult[j].id;
        var Backing_Type = searchresult[j].getValue('custbodybacking_type','custitemcustitem_pd_po_link');
        var Clasp_Type=searchresult[j].getValue('custbodyclasp_type','custitemcustitem_pd_po_link');
        var Chain_Length_inches=searchresult[j].getValue('custbodychain_length','custitemcustitem_pd_po_link');
        var Finished_Jewelry_Width_mm=searchresult[j].getValue('custbodyfinished_jewelry_width_mm','custitemcustitem_pd_po_link');
        var Finished_Jewelry_Length_mm=searchresult[j].getValue('custbodyfinished_jewelry_length_mm','custitemcustitem_pd_po_link');
        var Contour=searchresult[j].getValue('custbodycontour','custitemcustitem_pd_po_link');
        var Milled_Design=searchresult[j].getValue('custbodymilled_design','custitemcustitem_pd_po_link');
        var Eternity_Design=searchresult[j].getValue('custbodyeternity_design','custitemcustitem_pd_po_link');
        var Accent_Setting_Style=searchresult[j].getValue('custbodyaccent_setting_style','custitemcustitem_pd_po_link');
        var Center_Setting_Style=searchresult[j].getValue('custbodycenter_setting_style','custitemcustitem_pd_po_link');
        var Halo_Style=searchresult[j].getValue('custbodyhalo_style','custitemcustitem_pd_po_link');
        var Finish=searchresult[j].getValue('custbodyfinish','custitemcustitem_pd_po_link');
		var Main_Collection = searchresult[j].getValue('custbody_main_collection','custitemcustitem_pd_po_link');
		var Trend = searchresult[j].getValue('custbody_trend','custitemcustitem_pd_po_link');
		var Gallery_Accents = searchresult[j].getValue('custbody_gallery_accents','custitemcustitem_pd_po_link');
		var Prongs = searchresult[j].getValue('custbody_prongs','custitemcustitem_pd_po_link');
		var Split_Shank = searchresult[j].getValue('custbody_split_shank','custitemcustitem_pd_po_link');
		var Milgrain = searchresult[j].getValue('custbody_milgrain_check','custitemcustitem_pd_po_link');
		var Fancy_Melee = searchresult[j].getValue('custbody_fancy_melee','custitemcustitem_pd_po_link');
		var Halo_Shape = searchresult[j].getValue('custbody_halo_shape','custitemcustitem_pd_po_link');
		var Coverage = searchresult[j].getValue('custbody_coverage','custitemcustitem_pd_po_link');
        nlapiLogExecution('debug','finish',Finish);
        var Center_Stones_Available=[];
        var idOfCenterStones=searchresult[j].getValue('custbodycustbodycenter_stones_avail','custitemcustitem_pd_po_link').split(',');
        if(idOfCenterStones)
          {
           for(var v=0; v<idOfCenterStones.length; v++)
             {
                Center_Stones_Available.push(idOfCenterStones[v]);
             }
          }
        
        nlapiLogExecution('debug','center_stones_available',idOfCenterStones);
        var Notes_for_Copy=searchresult[j].getValue('custbodycustbody_notes_for_copy','custitemcustitem_pd_po_link');
        var Shipping_Days=searchresult[j].getValue('custbodycustbody_shipping_days','custitemcustitem_pd_po_link');
        var Engraved_Style=searchresult[j].getValue('custbodycustbody_engraved_style','custitemcustitem_pd_po_link');
        var Melee_Or_sides_sent_from_SF=searchresult[j].getValue('custbodycustbody_ms_sent_from_sf','custitemcustitem_pd_po_link');
        var Ring_Depth=searchresult[j].getValue('custbody191','custitemcustitem_pd_po_link');
        nlapiLogExecution('debug','ring_depth',Ring_Depth);
        var Ring_Width=searchresult[j].getValue('custbody192','custitemcustitem_pd_po_link');
        nlapiLogExecution('debug','Ring_Width',Ring_Width);
        var Min_Ct_Wt=searchresult[j].getValue('custbodycustbody_min_ct_wt','custitemcustitem_pd_po_link');
        nlapiLogExecution('debug','min.ct.wt',Min_Ct_Wt);
        //======end of PO fields that will be sync with Inventory and Assembly  Billed items.....===================
        var inventoryItem;
        
        try
          {
          inventoryItem=nlapiLoadRecord('inventoryitem',orderId);
          }
        catch(ex)
          {
            inventoryItem=nlapiLoadRecord('assemblyitem',orderId);
          }
     
        
      
        if(inventoryItem)
        {
              nlapiLogExecution('debug','itemRecord',JSON.stringify(inventoryItem));
              inventoryItem.setFieldValue('custitembacking_type', Backing_Type);
              inventoryItem.setFieldValue('custitemclasp', Clasp_Type);
              inventoryItem.setFieldValue('custitemchain_length', Chain_Length_inches);
              inventoryItem.setFieldValue('custitemfinished_jewelry_width_mm', Finished_Jewelry_Width_mm);
              inventoryItem.setFieldValue('custitemfinished_jewelry_length_mm', Finished_Jewelry_Length_mm);
              inventoryItem.setFieldValue('custitem_contour', Contour);
              inventoryItem.setFieldValue('custitem199', Milled_Design);
              if (Eternity_Design == 'T') {
                inventoryItem.setFieldValue('custitem172', 1);
              }
              else 
              {
                inventoryItem.setFieldValue('custitem172', 2);
              }
			  var Category = inventoryItem.getFieldValue('custitem20')
			  nlapiLogExecution("Debug","Category",Category);
			  if (Category == 2|| Category == 3){
				  
				inventoryItem.setFieldValue('custitemaccent_setting_style', Accent_Setting_Style);
				inventoryItem.setFieldValue('custitem6',Center_Setting_Style);
				inventoryItem.setFieldValue('custitemhalo_setting', Halo_Style);
				inventoryItem.setFieldValue('custitemcustitem_finish', Finish);
				inventoryItem.setFieldValue('custitem_main_collection', Main_Collection);
				inventoryItem.setFieldValue('custitem_trend', Trend);
				inventoryItem.setFieldValue('custitem_gallery_accents', Gallery_Accents);
				inventoryItem.setFieldValue('custitem_prongs', Prongs);
				inventoryItem.setFieldValue('custitem_split_shank', Split_Shank);
				inventoryItem.setFieldValue('custitem_milgrain_check', Milgrain);
				inventoryItem.setFieldValue('custitem_fancy_melee', Fancy_Melee);
				inventoryItem.setFieldValue('custitem_halo_shape', Halo_Shape);
				inventoryItem.setFieldValue('custitem_coverage', Coverage);
			  }
              if(Center_Stones_Available)
              {
             // for(var v=0; v<Center_Stones_Available.length;v++)
               // {
                   inventoryItem.setFieldValue('custitemcenter_stones_available', Center_Stones_Available);
               //}
              }
              inventoryItem.setFieldValue('custitem141', Notes_for_Copy);
              inventoryItem.setFieldValue('custitemshipping_days', Shipping_Days);
              inventoryItem.setFieldValue('custitemengraved_style', Engraved_Style);
              inventoryItem.setFieldValue('custitemmelee_sides_sent_from_sf', Melee_Or_sides_sent_from_SF);
              inventoryItem.setFieldValue('custitem17', Ring_Depth);
              inventoryItem.setFieldValue('custitem15', Ring_Width);
              inventoryItem.setFieldValue('custitemcustitem_min_ct_wt', Min_Ct_Wt);
              nlapiSubmitRecord(inventoryItem,true);
			  nlapiLogExecution('debug','v',j);
              //nlapiLogExecution('debug',itemtype,itemtype+'commited to database');
            }
          }
        }

      }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error Saved Search 8260",ex.message);
  }

}
  
  
