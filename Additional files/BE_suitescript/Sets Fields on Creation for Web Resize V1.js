function Set_Field_Value()
{
  try
  {
    var get_class=nlapiGetFieldValue('class');
    if(get_class=='184')
    {
      for(var a=1;a<=nlapiGetLineItemCount('item');a++)
      {
        try
        {
          var item_obj=[];
          nlapiSelectLineItem ('item',a );
          var get_center_gem_item=nlapiGetCurrentLineItemValue('item','custcol_center_gem_item');
          var get_center_gem_item_text=nlapiGetCurrentLineItemText('item','custcol_center_gem_item');
          if(get_center_gem_item)
          {
            item_obj.push(get_center_gem_item);
          }
          var get_item_sku=nlapiGetCurrentLineItemValue('item','custcol_item_sku_so');
          if(get_item_sku)
          {
            item_obj.push(get_item_sku);
          }
          if(item_obj.length>0)
          {
            var item_insurence_amount=0;
            var columns=[];
            columns.push(new nlobjSearchColumn('baseprice'));
            columns.push(new nlobjSearchColumn('salesdescription'));
            columns.push(new nlobjSearchColumn('custitem46'));
            columns.push(new nlobjSearchColumn('custitem20'));
            var search_amount=nlapiSearchRecord('item',null,new nlobjSearchFilter('internalid',null,'anyof',item_obj),columns);
            if(search_amount)
            {
              for(var b=0;b<search_amount.length;b++)
              {
                var get_id=search_amount[b].getId();
                if(get_id==get_center_gem_item)
                {
                  item_insurence_amount+=parseFloat(search_amount[b].getValue('baseprice'))*.8;
                  var category=search_amount[b].getValue('custitem20');
                  comment+='Set with: ';
                  var comment='SKU: '+get_center_gem_item_text+'\n';
                  comment+='Description: '+ search_amount[b].getValue('salesdescription')+'\n';
                  if(category=='7')
                  {
                    comment+='Certificate #'+ search_amount[b].getValue('custitem46')+'\n';
                  }
                    comment+='Arriving from SF: ';
                  nlapiSetCurrentLineItemValue('item','custcol5',comment,true,true);
                }
                else
                {
                  item_insurence_amount+=parseFloat(search_amount[b].getValue('baseprice'))*.8;
                }
              }
              nlapiSetCurrentLineItemValue('item','custcol_full_insurance_value',item_insurence_amount.toFixed(2),true,true);
              nlapiCommitLineItem ( 'item' ); 
            }
          }
        }
        catch(er){}
      }
    }
  }
  catch(er){}
}