function  Princess_Shape_1(meleeSize,subItem1,parentID,gemCount,parentItemId,centerSize,qty1,subItem01,meleeItem)
{
  if(meleeSize==subItem1)
  {
    var myStockUnitStr= nlapiLookupField("item",subItem01,"stockunit",true);
    //nlapiLogExecution("debug","Stock Unit Princess_Shape_1 (Test 1)",myStockUnitStr);
    meleeItem.setFieldValue('custrecord_sub_item', subItem1);
    meleeItem.setFieldValue('custrecord_melee_item', parentID);
    meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount); 
    meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId); 
    meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize); 
    meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
    nlapiSubmitRecord(meleeItem);
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
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
    }*/
  }
  else
  {
    var myStockUnitStr= nlapiLookupField("item",subItem01,"stockunit",true);
    //nlapiLogExecution("debug","Stock Unit Princess_Shape_1 (Test 2)",myStockUnitStr);
    meleeItem.setFieldValue('custrecord_sub_item', subItem1);
    meleeItem.setFieldValue('custrecord_melee_item', parentID);
    meleeItem.setFieldValue('custrecord_sub_item_qty', qty1); 
    meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId); 
    meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize); 
    meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
    nlapiSubmitRecord(meleeItem);
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty1);
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
    }*/
  }
}

function  Princess_Shape_2(meleeSize,subItem2,parentID,gemCount,parentItemId,centerSize,qty2,subItem02,meleeItem)
{
  if(meleeSize==subItem2)
  {
    var myStockUnitStr= nlapiLookupField("item",subItem02,"stockunit",true);
    // nlapiLogExecution("debug","stock unit",myStockUnitStr);
    meleeItem.setFieldValue('custrecord_sub_item', subItem2);
    meleeItem.setFieldValue('custrecord_melee_item', parentID);
    meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
    meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
    meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
    meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
    nlapiSubmitRecord(meleeItem);
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
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
    }*/
  }
  else
  {
    var myStockUnitStr= nlapiLookupField("item",subItem02,"stockunit",true);
    // nlapiLogExecution("debug","stock unit",myStockUnitStr);
    meleeItem.setFieldValue('custrecord_sub_item', subItem2);
    meleeItem.setFieldValue('custrecord_melee_item', parentID);
    meleeItem.setFieldValue('custrecord_sub_item_qty', qty2);
    meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
    meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
    meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
    nlapiSubmitRecord(meleeItem);
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty2);
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
    }*/
  }

}
function  Princess_Shape_3(meleeSize,subItem3,parentID,gemCount,parentItemId,centerSize,qty3,subItem03,meleeItem)
{
  if(meleeSize==subItem3)
  {
    var myStockUnitStr= nlapiLookupField("item",subItem03,"stockunit",true);
    // nlapiLogExecution("debug","stock unit",myStockUnitStr);
    meleeItem.setFieldValue('custrecord_sub_item', subItem3);
    meleeItem.setFieldValue('custrecord_melee_item', parentID);
    meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
    meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
    meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
    meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
    nlapiSubmitRecord(meleeItem);
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
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
    }*/
  }
  else
  {
    var myStockUnitStr= nlapiLookupField("item",subItem03,"stockunit",true);
    //nlapiLogExecution("debug","stock unit",myStockUnitStr);
    meleeItem.setFieldValue('custrecord_sub_item', subItem3);
    meleeItem.setFieldValue('custrecord_melee_item', parentID);
    meleeItem.setFieldValue('custrecord_sub_item_qty', qty3);
    meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
    meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
    meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
    nlapiSubmitRecord(meleeItem);
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty3);
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
    }*/
  }
}
function  Princess_Shape_4(meleeSize,subItem4,parentID,gemCount,parentItemId,centerSize,qty4,subItem04,meleeItem)
{
  if(meleeSize==subItem4)
  {
    var myStockUnitStr= nlapiLookupField("item",subItem04,"stockunit",true);
    //nlapiLogExecution("debug","stock unit",myStockUnitStr);
    meleeItem.setFieldValue('custrecord_sub_item', subItem4);
    meleeItem.setFieldValue('custrecord_melee_item', parentID);
    meleeItem.setFieldValue('custrecord_sub_item_qty', gemCount);
    meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
    meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
    meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
    nlapiSubmitRecord(meleeItem);
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
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
    }*/
  }
  else
  {
    var myStockUnitStr= nlapiLookupField("item",subItem04,"stockunit",true);
    //nlapiLogExecution("debug","stock unit",myStockUnitStr);
    meleeItem.setFieldValue('custrecord_sub_item', subItem4);
    meleeItem.setFieldValue('custrecord_melee_item', parentID);
    meleeItem.setFieldValue('custrecord_sub_item_qty', qty4);
    meleeItem.setFieldValue('custrecord_melee_item_parent',parentItemId);
    meleeItem.setFieldValue('custrecord_center_size_melee_item',centerSize);
    meleeItem.setFieldValue('custrecord_stock_unit',myStockUnitStr);
    nlapiSubmitRecord(meleeItem);
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty4);
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
    }*/
  }
}
function  Princess_Shape_5(meleeSize,subItem5,parentID,gemCount,parentItemId,centerSize,qty5,subItem05,meleeItem)
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
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
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
    }*/
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

    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty5);
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
    }*/
  }
}
function  Princess_Shape_6(meleeSize,subItem6,parentID,gemCount,parentItemId,centerSize,qty6,subItem06,meleeItem)
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
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
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
    }*/
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
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty6);
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
    }*/
  }
}
function  Princess_Shape_7(meleeSize,subItem7,parentID,gemCount,parentItemId,centerSize,qty7,subItem07,meleeItem)
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
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(gemCount);
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
    }*/
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
    /*tot_gemstoneCount=parseFloat(tot_gemstoneCount)+parseFloat(qty7);
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
    }*/
  }
}

function Princess_Stock_Unit_1(subItem01,parentID,subItem1,stockUnit,searchResult)
{
  nlapiLogExecution("debug","Dynamic stock unit 1 for Princess");     
  var myStockUnitStr= nlapiLookupField("item",subItem01,"stockunit",true);
  stockUnit=myStockUnitStr.split(' ')[0];
  update_stockUnitDynamically(parentID,stockUnit,subItem1,searchResult);
}
function Princess_Stock_Unit_2(subItem02,parentID,subItem2,stockUnit,searchResult)
{
  nlapiLogExecution("debug","Dynamic stock unit 2 for Princess");     
  var myStockUnitStr= nlapiLookupField("item",subItem02,"stockunit",true);
  stockUnit=myStockUnitStr.split(' ')[0];
  update_stockUnitDynamically(parentID,stockUnit,subItem2,searchResult);
}
function Princess_Stock_Unit_3(subItem03,parentID,subItem3,stockUnit,searchResult)
{
  nlapiLogExecution("debug","Dynamic stock unit 3 for Princess");     
  var myStockUnitStr= nlapiLookupField("item",subItem03,"stockunit",true);
  stockUnit=myStockUnitStr.split(' ')[0];
  update_stockUnitDynamically(parentID,stockUnit,subItem3,searchResult);
}
function Princess_Stock_Unit_4(subItem04,parentID,subItem4,stockUnit,searchResult)
{
  nlapiLogExecution("debug","Dynamic stock unit 4 for Princess");     
  var myStockUnitStr= nlapiLookupField("item",subItem04,"stockunit",true);  
  stockUnit=myStockUnitStr.split(' ')[0];
  update_stockUnitDynamically(parentID,stockUnit,subItem4,searchResult);
}
function Princess_Stock_Unit_5(subItem05,parentID,subItem5,stockUnit,searchResult)
{
  nlapiLogExecution("debug","Dynamic stock unit 5 for Princess");     
  var myStockUnitStr= nlapiLookupField("item",subItem05,"stockunit",true); 
  stockUnit=myStockUnitStr.split(' ')[0];
  update_stockUnitDynamically(parentID,stockUnit,subItem5,searchResult);
}
function Princess_Stock_Unit_6(subItem06,parentID,subItem6,stockUnit,searchResult)
{
  nlapiLogExecution("debug","Dynamic stock unit 6 for Princess");     
  var myStockUnitStr= nlapiLookupField("item",subItem06,"stockunit",true);
  stockUnit=myStockUnitStr.split(' ')[0];
  update_stockUnitDynamically(parentID,stockUnit,subItem6,searchResult);
}
function Princess_Stock_Unit_7(subItem07,parentID,subItem7,stockUnit,searchResult)
{
  nlapiLogExecution("debug","Dynamic stock unit 7 for Princess");     
  var myStockUnitStr= nlapiLookupField("item",subItem07,"stockunit",true);  
  stockUnit=myStockUnitStr.split(' ')[0];
  update_stockUnitDynamically(parentID,stockUnit,subItem7,searchResult);
}



