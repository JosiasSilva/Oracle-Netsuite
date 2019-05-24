/**
 * @NApiVersion 2.x
 * @NScriptType scheduledscript
*/
/*
	@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
	@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
	@Task			   			:-	NS-671 (Melee Items on PO - IA update)
	@Script Type   				:-	Scheduled Script
	@Created Date  				:-	Nov 18, 2017
	@Last Modified Date 		:-  Nov 18, 2017
	@Comments                 	: 	Script will create Melee Halo Count Page by PO
	@Live UserEvent Script		:-	/app/common/scripting/script.nl?id=1828
	@Live Clien Script			:-	/app/common/scripting/script.nl?id=1829
	@Live Restlet Script		:-	/app/common/scripting/script.nl?id=1830
	@Live Schedule Script		:-	/app/common/scripting/script.nl?id=2071
	@Live Schedule Script		:-	/app/common/scripting/script.nl?id=2130
	@Live RecordType URL		:-	/app/common/custom/custrecord.nl?id=704
	@Live Saved Search URL		:-	/app/common/search/searchresults.nl?searchid=8086
	@Live Saved Search URL		:-	/app/common/search/searchresults.nl?searchid=8275
*/
define(['N/search', 'N/record'], function(search,record) {/*execute(search,record);*/ 
  function execute(context) 
  {
    var searchId = 'customsearch_store_melee_information';
    try 
    {
      search.load({ id: searchId }).run().each( function(result) 
                                               {
        try 
        {
          var po_id 	= result.id;			
          log.debug('PO # :',po_id);

          var po_obj = record.load({ type : record.Type.PURCHASE_ORDER, id : po_id });

          var po_count = po_obj.getLineCount({sublistId: 'recmachcustrecord_melee_items_po_link' });
          if(po_count && po_count >0 )
          {							
            //var item_id = result.getValue({name: 'internalid',join: 'item' });
            var parent  = result.getValue({name: 'parent',join: 'item' });
            var shape  	= result.getValue({name: 'custitem5',join: 'custcolitem_link' });
            var size 	= result.getValue({name: 'custitem30',join: 'custcolitem_link' });
            var new_size 	= result.getValue({name: 'custitem_new_measurements',join: 'custcolitem_link' });
            log.debug('parent :'+parent+'shape :'+shape+'size :'+size +'new size :'+new_size);

            var halo_obj = record.create({ type : 'customrecord_halo_melee'});
            if(new_size!='' && new_size!=null)
              halo_obj.setValue('custrecord_center_size' , new_size); // new measurements
            else
              halo_obj.setValue('custrecord_center_size' , size); // old measurements
            halo_obj.setValue('custrecord_center_shape', shape );
            halo_obj.setValue('custrecord_parent_halo' , parent);
            //halo_obj.setValue('custrecord_gemstone_count' , parent);
            //halo_obj.setValue('custrecord_tot_gem_stone_count' , parent);
            //halo_obj.setValue('custrecord_tot_carat_wt' , parent);
            halo_obj.setValue('custrecord_linked_purchase_order' , po_id);

            var halo_id = halo_obj.save();
            log.debug('halo_id # :'+ halo_id,'PO # :'+po_id);
            var gemstone = 0;
            var carat    = 0;
            if(halo_id>0)
            {
              for(var x=0; x < po_count; x++)
              {
                var melee_item =  po_obj.getSublistValue({ sublistId: 'recmachcustrecord_melee_items_po_link', fieldId: 'custrecord_melee_items_item_display', line: x });
                var melee_qty  =  po_obj.getSublistValue({ sublistId: 'recmachcustrecord_melee_items_po_link', fieldId: 'custrecord_melee_items_quantity', line: x });
                if( melee_qty )
                {
                  melee_qty  = parseFloat(melee_qty);
                  gemstone   = gemstone + melee_qty; 
                }


                var stock_unit =  search.lookupFields({type: search.Type.ITEM, id: po_obj.getSublistValue({ sublistId: 'recmachcustrecord_melee_items_po_link', fieldId: 'custrecord_melee_items_item', line: x }), columns: ['stockunit'] }).stockunit[0].text;							
                stock_unit = stock_unit.replace('Carat','');
                if( stock_unit && melee_qty)
                {
                  stock_unit = parseFloat(stock_unit);
                  if(stock_unit > 0 && melee_qty > 0)
                  {
                    carat = carat + (stock_unit * melee_qty);
                  }
                }

                var melee_obj  = record.create({ type : 'customrecord_melee_item'});
                melee_obj.setValue('custrecord_melee_item_parent', parent );
                melee_obj.setValue('custrecord_sub_item' , melee_item);
                melee_obj.setValue('custrecord_sub_item_qty' , melee_qty);
                melee_obj.setValue('custrecord_melee_item' , halo_id  );
                var melee_id = melee_obj.save();
                log.debug('melee_id # :'+ melee_id,'PO # :'+po_id);
              }
              if(carat)
              {
                carat = carat.toFixed(2);
              }
              record.submitFields({
                type: 'customrecord_halo_melee',
                id: halo_id,
                values: {
                  "custrecord_tot_gem_stone_count":	gemstone,
                  "custrecord_tot_carat_wt"		:	carat
                }
              });
            }
          }				
          po_obj.setValue('custbody_store_melee_count', false);
          po_obj.save();
          log.debug('updated PO # :' + po_id );
        }
        catch (ee) 
        {
          log.debug('Error in updating PO record :', ee);
        }
        return true;
      });
    }
    catch (e) 
    {
      log.debug('Error on record :', e);
    }
  }
  return { execute: execute} 
});
