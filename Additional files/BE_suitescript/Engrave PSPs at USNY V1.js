function Check_Vendor(type,form)
{
  if(type=='create')
  {
    var Petite_Shared_Prong=false;
    var Engrave_Ring=false;
    for(var a=1;a<=nlapiGetLineItemCount('item');a++)
    {
      var get_des=nlapiGetLineItemValue('item' , 'description',a);
      var get_item=nlapiGetLineItemValue('item' , 'item',a);
      if(get_des){get_des=get_des.toLowerCase();}
      else{get_des='';}
        
      if(get_item=='39300')
      {
        Engrave_Ring=true;
      }
      else if(get_des.search('petite shared prong')>=0)
     // else if(get_des.indexOf('petite shared prong')>=0)
      {
        Petite_Shared_Prong=true;
      }

    }
    if(Engrave_Ring && Petite_Shared_Prong)
    {
      var get_index=nlapiFindLineItemValue ( 'item' , 'item' , '39300' ) ;
      nlapiSetLineItemValue('item' , 'povendor',get_index,'7773');
    }
  }
}