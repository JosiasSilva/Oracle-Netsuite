nlapiLogExecution("audit","FLOStart",new Date().getTime());
function  Add_DisplayMeleeItem(type)
{

  //if(type=="delete" || type=="edit")
  //{
  nlapiLogExecution("debug","type",type);
  var parentID =nlapiGetRecordId();
  if(parentID == null || parentID =='')
  {
    return ;
  }
  nlapiLogExecution("debug","parent id",parentID);
  var searchResult=nlapiSearchRecord('customrecord_melee_item',null,new nlobjSearchFilter('custrecord_melee_item',null,'is',parentID),null);
  if(searchResult != null)
  {
    //Add_NewMeleeItem(parentID);
    //return;
    var refId = nlapiLookupField('customrecord_refresh_halo_melee',1,'custrecord_ref_id');
    nlapiLogExecution("debug","refresh id",refId);
    if(refId == 0)
    {
      dynamicStockUnit(parentID);
      Add_NewMeleeItem(parentID);
      nlapiSubmitField("customrecord_refresh_halo_melee",1,"custrecord_ref_id",1);
      //nlapiLogExecution("debug","if 1");
      var field = form.addField("custpage_page_refresh","inlinehtml");
      var set_value="<script type='text/javascript'> location.reload(); </script>";
      field.setDefaultValue(set_value);
      //nlapiLogExecution("debug","if 2");
    }
    else
    {
      nlapiSubmitField("customrecord_refresh_halo_melee",1,"custrecord_ref_id",0);
    }
    return;
  }

  var parentItemId= nlapiLookupField('customrecord_halo_melee',parentID,'custrecord_parent_halo'); 
  nlapiLogExecution("debug","parent Item Id",parentItemId);
  if(parentItemId=='' || parentItemId==null)
    return;
  var centerSize= nlapiLookupField('customrecord_halo_melee',parentID,'custrecord_center_size');  
  nlapiLogExecution("debug","center Size",centerSize);

  var meleeSize= nlapiLookupField('customrecord_halo_melee',parentID,'custrecord_melee_size');   
  nlapiLogExecution("debug","melee Size",meleeSize);
  meleeSize = meleeSize.replace(/ ./g,'');
  nlapiLogExecution("debug","melee Size replace after space and dot",meleeSize);

  var gemCount= nlapiLookupField('customrecord_halo_melee',parentID,'custrecord_gemstone_count');   
  nlapiLogExecution("debug","gem count",gemCount);


  var itemFields=["custitem9","custitem11","custitem13","custitem94","custitem_sub_item_5","custitem_sub_item_6","custitem_sub_item_7","custitem8","custitem10","custitem12","custitem95","custitem_quantity_5","custitem_quantity_6","custitem_quantity_7"];

  var Item=nlapiLookupField("item",parentItemId,itemFields);

  var subItem01=Item.custitem9;
  var subItem02=Item.custitem11;
  var subItem03=Item.custitem13;
  var subItem04=Item.custitem94;
  var subItem05=Item.custitem_sub_item_5;
  var subItem06=Item.custitem_sub_item_6;
  var subItem07=Item.custitem_sub_item_7;

  var qty1=Item.custitem8;
  var qty2=Item.custitem10;
  var qty3=Item.custitem12;
  var qty4=Item.custitem95;
  var qty5=Item.custitem_quantity_5;
  var qty6=Item.custitem_quantity_6;
  var qty7=Item.custitem_quantity_7;

  var Item=nlapiLookupField("item",parentItemId,itemFields,true);

  var subItem1=Item.custitem9;
  var subItem2=Item.custitem11;
  var subItem3=Item.custitem13;
  var subItem4=Item.custitem94;
  var subItem5=Item.custitem_sub_item_5;
  var subItem6=Item.custitem_sub_item_6;
  var subItem7=Item.custitem_sub_item_7
  var meleeItem = nlapiCreateRecord('customrecord_melee_item');
  var tot_gemstoneCount=0;
  var tot_gemStoneCarat=0;
  var stockUnit = 0;
  for(var s=0;s<7;s++)
  {
    if(s==0)
    {
      if((qty1 !='' && qty1 !=null) && (subItem01 !='' && subItem01 !=null))
      {
        var subItemShape1=getItemHaloShape(subItem01);    
        nlapiLogExecution("debug","sub item shape 1",subItemShape1);     
        if(subItemShape1=='1')
        {
          if(meleeSize==subItem1)
          {
            var myStockUnitStr= nlapiLookupField("item",subItem01,"stockunit",true);
            nlapiLogExecution("debug","stock unit",myStockUnitStr);
            meleeItem.setFieldValue('custrecord_sub_item', subItem1);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount); 
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId); 
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize); 
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);
            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
            nlapiLogExecution("debug","gem stone count 1" ,tot_gemstoneCount);
            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(gemCount) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 1",tot_gemStoneCarat);
            }
          }
          else
          {
            var myStockUnitStr= nlapiLookupField("item",subItem01,"stockunit",true);
            nlapiLogExecution("debug","stock unit",myStockUnitStr);
            meleeItem.setFieldValue('custrecord_sub_item', subItem1);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', qty1); 
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId); 
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize); 
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);
            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty1);
            nlapiLogExecution("debug","gem stone count 2",tot_gemstoneCount);
            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(qty1) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 2",tot_gemStoneCarat);
            }
          }
        }
        //Added new code for Thread NS-1122
        else if(subItemShape1=='2')
          Princess_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='3')
          Cushion_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='4')
          Oval_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='5')
          Emerald_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='6')
          Asscher_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='7')
          Radiant_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='8')
          Pear_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='9')
          Marquise_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='10')
          Heart_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
        else if(subItemShape1=='11')
          Baguette_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem);
      }
    }
    else if(s==1)
    {
      if((qty2 !='' && qty2 !=null) && (subItem02 !='' && subItem02 !=null))
      {
        var subItemShape2=getItemHaloShape(subItem02);    
        nlapiLogExecution("debug","sub item shape 2",subItemShape2);     
        if(subItemShape2=='1')
        {
          if(meleeSize==subItem2)
          {
            var myStockUnitStr= nlapiLookupField("item",subItem02,"stockunit",true);
            nlapiLogExecution("debug","stock unit",myStockUnitStr);
            meleeItem.setFieldValue('custrecord_sub_item', subItem2);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);
            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
            nlapiLogExecution("debug","gem stone count 2",tot_gemstoneCount);
            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(gemCount) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 2",tot_gemStoneCarat);
            }
          }
          else
          {
            var myStockUnitStr= nlapiLookupField("item",subItem02,"stockunit",true);
            nlapiLogExecution("debug","stock unit",myStockUnitStr);
            meleeItem.setFieldValue('custrecord_sub_item', subItem2);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', qty2);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);
            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty2);
            nlapiLogExecution("debug","gem stone count 2",tot_gemstoneCount);

            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(qty2) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 2",tot_gemStoneCarat);
            }
          }
        }
        //Added new code for Thread NS-1122
        else if(subItemShape2=='2')
          Princess_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='3')
          Cushion_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='4')
          Oval_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='5')
          Emerald_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='6')
          Asscher_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='7')
          Radiant_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='8')
          Pear_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='9')
          Marquise_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='10')
          Heart_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
        else if(subItemShape2=='11')
          Baguette_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem);
      }
    }
    else if(s==2)
    {
      if((qty3 !='' && qty3 !=null) && (subItem03 !='' && subItem03 !=null))
      {
        var subItemShape3=getItemHaloShape(subItem03);    
        nlapiLogExecution("debug","sub item shape 3",subItemShape3);     
        if(subItemShape3=='1')
        {
          if(meleeSize==subItem3)
          {
            var myStockUnitStr= nlapiLookupField("item",subItem03,"stockunit",true);
            nlapiLogExecution("debug","stock unit",myStockUnitStr);
            meleeItem.setFieldValue('custrecord_sub_item', subItem3);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);

            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
            nlapiLogExecution("debug","gem stone count 3",tot_gemstoneCount);

            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(gemCount) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 3",tot_gemStoneCarat);
            }
          }
          else
          {
            var myStockUnitStr= nlapiLookupField("item",subItem03,"stockunit",true);
            nlapiLogExecution("debug","stock unit",myStockUnitStr);
            meleeItem.setFieldValue('custrecord_sub_item', subItem3);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', qty3);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);

            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty3);
            nlapiLogExecution("debug","gem stone count 3",tot_gemstoneCount);

            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(qty3) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 3",tot_gemStoneCarat);
            }
          }
        }
        //Added new code for Thread NS-1122
        else if(subItemShape3=='2')
          Princess_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='3')
          Cushion_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='4')
          Oval_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='5')
          Emerald_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='6')
          Asscher_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='7')
          Radiant_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='8')
          Pear_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='9')
          Marquise_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='10')
          Heart_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
        else if(subItemShape3=='11')
          Baguette_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem);
      }
    }
    else if(s==3)
    {
      if((qty4 !='' && qty4 !=null) && (subItem04 !='' && subItem04 !=null))
      {
        var subItemShape4=getItemHaloShape(subItem04);    
        nlapiLogExecution("debug","sub item shape 4",subItemShape4);     
        if(subItemShape4=='1')
        {
          if(meleeSize==subItem4)
          {
            var myStockUnitStr= nlapiLookupField("item",subItem04,"stockunit",true);
            nlapiLogExecution("debug","stock unit",myStockUnitStr);
            meleeItem.setFieldValue('custrecord_sub_item', subItem4);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);

            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
            nlapiLogExecution("debug","gem stone count 4",tot_gemstoneCount);
            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(gemCount) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 4",tot_gemStoneCarat);
            }
          }
          else
          {
            var myStockUnitStr= nlapiLookupField("item",subItem04,"stockunit",true);
            nlapiLogExecution("debug","stock unit",myStockUnitStr);
            meleeItem.setFieldValue('custrecord_sub_item', subItem4);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', qty4);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);

            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty4);
            nlapiLogExecution("debug","gem stone count 4",tot_gemstoneCount);
            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(qty4) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 4",tot_gemStoneCarat);
            }
          }
        }
        //Added new code for Thread NS-1122
        else if(subItemShape4=='2')
          Princess_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='3')
          Cushion_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='4')
          Oval_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='5')
          Emerald_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='6')
          Asscher_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='7')
          Radiant_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='8')
          Pear_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='9')
          Marquise_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='10')
          Heart_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
        else if(subItemShape4=='11')
          Baguette_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem);
      }
    }
    else if(s==4)
    {
      if((qty5 !='' && qty5 !=null) && (subItem05 !='' && subItem05 !=null))
      {
        var subItemShape5=getItemHaloShape(subItem05);    
        nlapiLogExecution("debug","sub item shape 5",subItemShape5);     
        if(subItemShape5=='1')
        {
          if(meleeSize==subItem5)
          {
            var myStockUnitStr= nlapiLookupField("item",subItem05,"stockunit",true);
            meleeItem.setFieldValue('custrecord_sub_item', subItem5);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);
            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
            nlapiLogExecution("debug","gem stone count 5",tot_gemstoneCount);
            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(gemCount) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 5",tot_gemStoneCarat);
            }
          }
          else
          {
            var myStockUnitStr= nlapiLookupField("item",subItem05,"stockunit",true);
            meleeItem.setFieldValue('custrecord_sub_item', subItem5);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', qty5);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);

            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty5);
            nlapiLogExecution("debug","gem stone count 5",tot_gemstoneCount);

            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(qty5) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 5",tot_gemStoneCarat);
            }
          }
        }
        //Added new code for Thread NS-1122
        else if(subItemShape5=='2')
          Princess_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='3')
          Cushion_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='4')
          Oval_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='5')
          Emerald_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='6')
          Asscher_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='7')
          Radiant_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='8')
          Pear_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='9')
          Marquise_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='10')
          Heart_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
        else if(subItemShape5=='11')
          Baguette_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem);
      }
    }
    else if(s==5)
    {
      if((qty6 !='' && qty6 !=null) && (subItem06 !='' && subItem06 !=null))
      {
        var subItemShape6=getItemHaloShape(subItem06);    
        nlapiLogExecution("debug","sub item shape 6",subItemShape6);     
        if(subItemShape6=='1')
        {
          if(meleeSize==subItem6)
          {
            var myStockUnitStr= nlapiLookupField("item",subItem06,"stockunit",true);
            meleeItem.setFieldValue('custrecord_sub_item', subItem6);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);
            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
            nlapiLogExecution("debug","gem stone count 6",tot_gemstoneCount);

            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(gemCount) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 6",tot_gemStoneCarat);
            }
          }
          else
          {
            var myStockUnitStr= nlapiLookupField("item",subItem06,"stockunit",true);
            meleeItem.setFieldValue('custrecord_sub_item', subItem6);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', qty6);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);

            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty6);
            nlapiLogExecution("debug","gem stone count 6",tot_gemstoneCount);

            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(qty6) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 6",tot_gemStoneCarat);
            }
          }
        }
        //Added new code for Thread NS-1122
        else if(subItemShape6=='2')
          Princess_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='3')
          Cushion_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='4')
          Oval_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='5')
          Emerald_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='6')
          Asscher_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='7')
          Radiant_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='8')
          Pear_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='9')
          Marquise_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='10')
          Heart_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
        else if(subItemShape6=='11')
          Baguette_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem);
      }
    }
    else if(s==6)
    {
      if((qty7 !='' && qty7 !=null) && (subItem07 !='' && subItem07 !=null))
      {
        var subItemShape7=getItemHaloShape(subItem07);    
        nlapiLogExecution("debug","sub item shape 7",subItemShape7);     
        if(subItemShape7=='1')
        {
          if(meleeSize==subItem7)
          {
            var myStockUnitStr= nlapiLookupField("item",subItem07,"stockunit",true);
            meleeItem.setFieldValue('custrecord_sub_item', subItem7);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);
            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
            nlapiLogExecution("debug","gem stone count 7",tot_gemstoneCount);
            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(gemCount) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 7",tot_gemStoneCarat);
            }
          }
          else
          {
            var myStockUnitStr= nlapiLookupField("item",subItem07,"stockunit",true);
            meleeItem.setFieldValue('custrecord_sub_item', subItem7);
            meleeItem.setFieldValue('custrecord_melee_item', parentID);
            meleeItem.setFieldValue('custrecord_sub_item_qty', qty7);
            meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
            meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
            meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
            nlapiSubmitRecord(meleeItem);

            tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty7);
            nlapiLogExecution("debug","gem stone count 7",tot_gemstoneCount);
            if(myStockUnitStr!=null && myStockUnitStr!='')
            {
              stockUnit=myStockUnitStr.split(' ')[0];
            }
            if(tot_gemstoneCount > 0 && stockUnit!=0)
            {             
              tot_gemStoneCarat=parseFloat(tot_gemStoneCarat)+(parseFloat(qty7) * parseFloat(stockUnit));
              tot_gemStoneCarat=Math.round(tot_gemStoneCarat * 100)/100;
              tot_gemStoneCarat=tot_gemStoneCarat.toFixed(2);
              nlapiLogExecution("debug","tot stock 7",tot_gemStoneCarat);
            }
          }
        }
        //Added new code for Thread NS-1122
        else if(subItemShape7=='2')
          Princess_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='3')
          Cushion_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='4')
          Oval_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='5')
          Emerald_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='6')
          Asscher_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='7')
          Radiant_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='8')
          Pear_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='9')
          Marquise_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='10')
          Heart_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
        else if(subItemShape7=='11')
          Baguette_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem);
      }
    }
  }
  if(tot_gemstoneCount !=0 && tot_gemStoneCarat !=0)
  {
    //nlapiLogExecution("debug","test 1");
    nlapiSubmitField("customrecord_halo_melee",parentID,["custrecord_tot_gem_stone_count","custrecord_tot_carat_wt"],[tot_gemstoneCount,tot_gemStoneCarat]);
    //nlapiLogExecution("debug","test 2");
    var field = form.addField("custpage_page_refresh","inlinehtml");
    var set_value="<script type='text/javascript'> location.reload(); </script>";
    field.setDefaultValue(set_value);
  }
  else
  {
    var refId = nlapiLookupField('customrecord_refresh_halo_melee',1,'custrecord_ref_id');
    nlapiLogExecution("debug","refresh id else",refId);
    if(refId == 0)
    {
      //nlapiLogExecution("debug","test 01");
      nlapiSubmitField("customrecord_refresh_halo_melee",1,"custrecord_ref_id",1);
      nlapiSubmitField("customrecord_halo_melee",parentID,["custrecord_tot_gem_stone_count","custrecord_tot_carat_wt"],['','']);
      // nlapiLogExecution("debug","test 02");
      var field = form.addField("custpage_page_refresh","inlinehtml");
      var set_value="<script type='text/javascript'> location.reload(); </script>";
      field.setDefaultValue(set_value);
    }
    else
    {
      nlapiSubmitField("customrecord_refresh_halo_melee",1,"custrecord_ref_id",0);
      //nlapiLogExecution("debug","else 0");
    }
  }
  //}
}
function getItemHaloShape(itemId)
{
  var shape='0';
  shape=nlapiLookupField("item",itemId,"custitem5");
  return shape;
}

function  Add_NewMeleeItem(pid)
{
  //nlapiLogExecution("debug","parent id 2",pid);
  var filters=new Array();
  var columns=new Array();
  columns.push(new nlobjSearchColumn('custrecord_sub_item_qty'));
  columns.push(new nlobjSearchColumn('custrecord_stock_unit')); 
  columns.push(new nlobjSearchColumn('custrecord_sub_item'));
  filters.push(new nlobjSearchFilter('custrecord_melee_item',null,'is',pid));
  var tot_gem_count=0;
  var tot_carat_weight = 0;
  var stockUnit = 0;
  var searchResult=nlapiSearchRecord('customrecord_melee_item',null,filters,columns);
  if(searchResult != null)
  { 
    for(var i=0; i<searchResult.length; i++)
    {
      var qty=searchResult[i].getValue('custrecord_sub_item_qty');
      var myStockUnitStr=searchResult[i].getValue('custrecord_stock_unit');
      var subItem=searchResult[i].getValue('custrecord_sub_item');
      var melee_shape = getMeleeItemShape(subItem);
      nlapiLogExecution("debug","melee_shape(Test)",melee_shape);
      if(melee_shape == 1)
      {
        if((qty !='' && qty !=null) && (subItem !='' && subItem !=null))
        {
          if(myStockUnitStr!=null && myStockUnitStr!='')
          {
            stockUnit=myStockUnitStr.split(' ')[0];
          }
          tot_gem_count = parseInt(tot_gem_count) +parseInt(qty);
          //nlapiLogExecution("debug","Total gem count(Test 1)",tot_gem_count);
          if(tot_gem_count > 0 && stockUnit!=0)
          {
            tot_carat_weight = parseFloat(tot_carat_weight)+(parseFloat(qty) * parseFloat(stockUnit));
            tot_carat_weight=Math.round(tot_carat_weight * 100)/100;
            tot_carat_weight=tot_carat_weight.toFixed(2);
            //nlapiLogExecution("debug","tot stock 1",tot_carat_weight);
          }
        }
      }
    }
    nlapiLogExecution("debug","Total gem count(Test 2)",tot_gem_count);
    nlapiLogExecution("debug","Total carat weight(Test 2)",tot_carat_weight);
    if(tot_gem_count !=0 && tot_carat_weight!=0)
    {
      //nlapiLogExecution("debug","test 01");
      nlapiSubmitField("customrecord_halo_melee",pid,["custrecord_tot_gem_stone_count","custrecord_tot_carat_wt"], [tot_gem_count,tot_carat_weight]);
      // nlapiLogExecution("debug","test 02");
    }
  }
}
function dynamicStockUnit(parentID)
{
  var parentItemId= nlapiLookupField('customrecord_halo_melee',parentID,'custrecord_parent_halo'); 
  if(parentItemId == null || parentItemId =='') return;
  nlapiLogExecution("debug","parent Item Id dynamic stock",parentItemId);

  var itemFields=["custitem9","custitem11","custitem13","custitem94","custitem_sub_item_5","custitem_sub_item_6","custitem_sub_item_7","custitem8","custitem10","custitem12","custitem95","custitem_quantity_5","custitem_quantity_6","custitem_quantity_7"];

  var Item=nlapiLookupField("item",parentItemId,itemFields);

  var subItem01=Item.custitem9;
  var subItem02=Item.custitem11;
  var subItem03=Item.custitem13;
  var subItem04=Item.custitem94;
  var subItem05=Item.custitem_sub_item_5;
  var subItem06=Item.custitem_sub_item_6;
  var subItem07=Item.custitem_sub_item_7

  var qty1=Item.custitem8;
  var qty2=Item.custitem10;
  var qty3=Item.custitem12;
  var qty4=Item.custitem95;
  var qty5=Item.custitem_quantity_5;
  var qty6=Item.custitem_quantity_6;
  var qty7=Item.custitem_quantity_7;

  var Item=nlapiLookupField("item",parentItemId,itemFields,true);

  var subItem1=Item.custitem9;
  var subItem2=Item.custitem11;
  var subItem3=Item.custitem13;
  var subItem4=Item.custitem94;
  var subItem5=Item.custitem_sub_item_5;
  var subItem6=Item.custitem_sub_item_6;
  var subItem7=Item.custitem_sub_item_7

  var stockUnit =0;
  var filters=new Array();
  var columns=new Array();
  columns.push(new nlobjSearchColumn('custrecord_sub_item_qty'));
  columns.push(new nlobjSearchColumn('custrecord_stock_unit')); 
  columns.push(new nlobjSearchColumn('custrecord_sub_item'));
  filters.push(new nlobjSearchFilter('custrecord_melee_item',null,'is',parentID));
  var searchResult=nlapiSearchRecord('customrecord_melee_item',null,filters,columns);
  //nlapiLogExecution("debug","search result length",searchResult.length);  
  for(var s=0;s<7;s++)
  {
    if(s==0)
    {
      if((qty1 !='' && qty1 !=null) && (subItem01 !='' && subItem01 !=null))
      {
        var subItemShape1=getItemHaloShape(subItem01);    
        nlapiLogExecution("debug","sub item shape 1",subItemShape1);     
        if(subItemShape1=='1')
        {
          nlapiLogExecution("debug","dynamic stock unit 1");     
          var myStockUnitStr= nlapiLookupField("item",subItem01,"stockunit",true);
          stockUnit=myStockUnitStr.split(' ')[0];
          update_stockUnitDynamically(parentID,stockUnit,subItem1,searchResult);
        }
        //Added new code for Thread NS-1122
        else if(subItemShape1=='2')
          Princess_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='3')
          Cushion_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='4')
          Oval_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='5')
          Emerald_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='6') 
          Asscher_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='7')
          Radiant_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='8')
          Pear_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='9')
          Marquise_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='10')
          Heart_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
        else if(subItemShape1=='11')
          Baguette_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult);
      }
    }
    else if(s==1)
    {
      if((qty2 !='' && qty2 !=null) && (subItem02 !='' && subItem02 !=null))
      {
        var subItemShape2=getItemHaloShape(subItem02);    
        nlapiLogExecution("debug","sub item shape 2",subItemShape2);     
        if(subItemShape2=='1')
        {
          nlapiLogExecution("debug","dynamic stock unit 2");     
          var myStockUnitStr= nlapiLookupField("item",subItem02,"stockunit",true);
          stockUnit=myStockUnitStr.split(' ')[0];
          update_stockUnitDynamically(parentID,stockUnit,subItem2,searchResult);
        }
        //Added new code for Thread NS-1122
        else if(subItemShape2=='2')
          Princess_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='3')
          Cushion_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='4')
          Oval_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='5')
          Emerald_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='6') 
          Asscher_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='7')
          Radiant_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='8')
          Pear_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='9')
          Marquise_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='10')
          Heart_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
        else if(subItemShape2=='11')
          Baguette_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult);
      }
    }
    else if(s==2)
    {
      if((qty3 !='' && qty3 !=null) && (subItem03 !='' && subItem03 !=null))
      {
        var subItemShape3=getItemHaloShape(subItem03);    
        nlapiLogExecution("debug","sub item shape 3",subItemShape3);     
        if(subItemShape3=='1')
        {
          nlapiLogExecution("debug","dynamic stock unit 3");     
          var myStockUnitStr= nlapiLookupField("item",subItem03,"stockunit",true);
          stockUnit=myStockUnitStr.split(' ')[0];
          update_stockUnitDynamically(parentID,stockUnit,subItem3,searchResult);
        }
        //Added new code for Thread NS-1122
        else if(subItemShape3=='2')
          Princess_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='3')
          Cushion_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='4')
          Oval_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='5')
          Emerald_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='6') 
          Asscher_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='7')
          Radiant_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='8')
          Pear_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='9')
          Marquise_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='10')
          Heart_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
        else if(subItemShape3=='11')
          Baguette_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult);
      }
    }
    else if(s==3)
    {
      if((qty4 !='' && qty4 !=null) && (subItem04 !='' && subItem04 !=null))
      {
        var subItemShape4=getItemHaloShape(subItem04);    
        nlapiLogExecution("debug","sub item shape 4",subItemShape4);     
        if(subItemShape4=='1')
        {
          var myStockUnitStr= nlapiLookupField("item",subItem04,"stockunit",true);
          stockUnit=myStockUnitStr.split(' ')[0];
          update_stockUnitDynamically(parentID,stockUnit,subItem4,searchResult);
        }
        //Added new code for Thread NS-1122
        else if(subItemShape4=='2')
          Princess_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='3')
          Cushion_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='4')
          Oval_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='5')
          Emerald_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='6') 
          Asscher_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='7')
          Radiant_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='8')
          Pear_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='9')
          Marquise_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='10')
          Heart_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape4=='11')
          Baguette_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult);
      }
    }
    else if(s==4)
    {
      if((qty5 !='' && qty5 !=null) && (subItem05 !='' && subItem05 !=null))
      {
        var subItemShape5=getItemHaloShape(subItem05);    
        nlapiLogExecution("debug","sub item shape 5",subItemShape5);     
        if(subItemShape5=='1')
        {
          var myStockUnitStr= nlapiLookupField("item",subItem05,"stockunit",true);  
          stockUnit=myStockUnitStr.split(' ')[0];
          update_stockUnitDynamically(parentID,stockUnit,subItem5,searchResult);
        }
        //Added new code for Thread NS-1122
        else if(subItemShape5=='2')
          Princess_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='3')
          Cushion_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='4')
          Oval_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='5')
          Emerald_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='6') 
          Asscher_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='7')
          Radiant_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='8')
          Pear_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='9')
          Marquise_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='10')
          Heart_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape5=='11')
          Baguette_Stock_Unit_5(subItem04,parentID,subItem4,stockUnit,searchResult);
      }
    }
    else if(s==5)
    {
      if((qty6 !='' && qty6 !=null) && (subItem06 !='' && subItem06 !=null))
      {
        var subItemShape6=getItemHaloShape(subItem06);    
        nlapiLogExecution("debug","sub item shape 6",subItemShape6);     
        if(subItemShape6=='1')
        {
          var myStockUnitStr= nlapiLookupField("item",subItem06,"stockunit",true);
          stockUnit=myStockUnitStr.split(' ')[0];
          update_stockUnitDynamically(parentID,stockUnit,subItem6,searchResult);
        }
        //Added new code for Thread NS-1122
        else if(subItemShape6=='2')
          Princess_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='3')
          Cushion_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='4')
          Oval_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='5')
          Emerald_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='6') 
          Asscher_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='7')
          Radiant_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='8')
          Pear_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='9')
          Marquise_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='10')
          Heart_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape6=='11')
          Baguette_Stock_Unit_6(subItem04,parentID,subItem4,stockUnit,searchResult);
      }
    }
    else if(s==6)
    {
      if((qty7 !='' && qty7 !=null) && (subItem07 !='' && subItem07 !=null))
      {
        var subItemShape7=getItemHaloShape(subItem07);    
        nlapiLogExecution("debug","sub item shape 7",subItemShape7);     
        if(subItemShape7=='1')
        {
          var myStockUnitStr= nlapiLookupField("item",subItem07,"stockunit",true);  
          stockUnit=myStockUnitStr.split(' ')[0];
          update_stockUnitDynamically(parentID,stockUnit,subItem7,searchResult);
        }
        //Added new code for Thread NS-1122
        else if(subItemShape7=='2')
          Princess_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='3')
          Cushion_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='4')
          Oval_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='5')
          Emerald_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='6') 
          Asscher_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='7')
          Radiant_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='8')
          Pear_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='9')
          Marquise_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='10')
          Heart_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
        else if(subItemShape7=='11')
          Baguette_Stock_Unit_7(subItem04,parentID,subItem4,stockUnit,searchResult);
      }
    }
  }
}   
function  update_stockUnitDynamically(pid,stUnit,subitem,searchResult)
{
  if(searchResult != null)
  { 
    var stockUnit =0;
    nlapiLogExecution("debug","dynamic stock pid",pid);    
    nlapiLogExecution("debug","dynamic stock unit",stUnit); 
    nlapiLogExecution("debug","dynamic stock unit subitem",subitem);   
    for(var i=0; i<searchResult.length; i++)
    {
      var myStockUnitStr=searchResult[i].getValue('custrecord_stock_unit');
      stockUnit=myStockUnitStr.split(' ')[0];
      var subItem=searchResult[i].getValue('custrecord_sub_item');
      nlapiLogExecution("debug","dynamic stock unit subitem in loop",subItem);
      subItem = subItem.replace(/ ./g,'');
      nlapiLogExecution("debug","dynamic stock unit subitem in loop after replace space with dot(.)",subItem);
      nlapiLogExecution("debug","dynamic my stock unit in loop",myStockUnitStr);  
      nlapiLogExecution("debug","dynamic stock unit in loop",stockUnit);   
      if(subitem == subItem && stUnit !=stockUnit)
      {
        nlapiLogExecution("debug","dynamic stock unit subitem if(1)",subItem);
        nlapiLogExecution("debug","dynamic stock unit subitem if(2)",subitem);
        nlapiLogExecution("debug","dynamic stock unit if(1)",stUnit);
        nlapiLogExecution("debug","dynamic stock unit if(2)",stockUnit);
        nlapiLogExecution("debug","dynamic stock unit (Test 1)");
        var internalId = searchResult[i].getId();
        nlapiLogExecution("debug","New internal id",internalId);
        nlapiSubmitField("customrecord_melee_item",internalId,"custrecord_stock_unit",stUnit);
        nlapiLogExecution("debug","dynamic stock unit (Test 2)");
      }
    }
  }
}

//Added new code for Thread NS-1122
function getMeleeItemShape(subItem)
{
  var itemnameatzeorindex = subItem.split(' ');
  var f1 = [];     
  f1[0] = nlobjSearchFilter("itemid",null,'is',itemnameatzeorindex[0]);
  var searchResult2 = nlapiSearchRecord("inventoryitem",null,f1,null); 
  nlapiLogExecution("Debug","Search result having Melee item internal id",JSON.stringify(searchResult2));
  if(searchResult2)
  {
    var meleeitemid = searchResult2[0].getId();
    var melee_item_Shape = getItemHaloShape(meleeitemid);
    return melee_item_Shape;
  }
}


function beforSubmit(type)
{

}