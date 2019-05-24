nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SO_IA_Single_Pdf_File_Creation()
{
  try
  {
    if (nlapiGetContext().getRemainingUsage() < 500) 
    {
      var stateMain = nlapiYieldScript();
      if (stateMain.status == 'FAILURE')
      {
        nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
        throw "Failed to yield script";
      } 
      else if (stateMain.status == 'RESUME') 
      {
        nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
      }
    }
    // var mySearch = nlapiLoadSearch(null, 7660); // For Sandbox
    var mySearch = nlapiLoadSearch(null, 7671); // For Production
    var searchresult = [];
    var resultset = mySearch.runSearch();
    var searchid = 0;
    var type = "soIASinglePdfFileCreation";
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
        var orderId= searchresult[j].id;
        var pickupatBE = searchresult[j].getValue('custbody53');
        var shippingCountry=searchresult[j].getValue('shipcountry');
        nlapiLogExecution("debug","Shipping Country",shippingCountry);
        var formulatext=searchresult[j].getValue('formulatext');
        //var blockIA = searchresult[j].getValue('custitemblock_insurance_appraisal');
        var docNumber = searchresult[j].getValue('tranid');
        //Sales Order & IA PDF
        if(pickupatBE=='T' || shippingCountry!='US')
        {
          try
          {
            var   so_ia_FileObj_Two_Copies = Sales_Order_IA_Two_Copies(orderId,email,type);
            var so_ia_FileContent_Two_Copies = so_ia_FileObj_Two_Copies.getValue();
            var so_ia_PdfFileContent_Two_Copies = nlapiCreateFile(docNumber+".pdf", "PDF", so_ia_FileContent_Two_Copies);
            so_ia_PdfFileContent_Two_Copies.setFolder("10844148");
            so_ia_PdfFileContent_Two_Copies.setIsOnline(true); 
            var so_ia_FileId_Two_Copies = nlapiSubmitFile(so_ia_PdfFileContent_Two_Copies);
            nlapiSubmitField("salesorder",orderId,"custbody_sales_order_ia_file",so_ia_FileId_Two_Copies);
            nlapiLogExecution("Debug","Message","Sales Order(Two Copies) & IA PDF file has been created successfully having Id# ::"+orderId);
          }
          catch(ex)
          {
            nlapiLogExecution("Debug","Error Message If Block",ex.message);
          }
        }
        else
        {
          try
          {
            var so_ia_FileObj = Sales_Order_IA(orderId,email,type);
            var so_ia_FileContent = so_ia_FileObj.getValue();
            var so_ia_PdfFileContent = nlapiCreateFile(docNumber+".pdf", "PDF", so_ia_FileContent);
            so_ia_PdfFileContent.setFolder("10844148");
            so_ia_PdfFileContent.setIsOnline(true); 
            var so_ia_FileId = nlapiSubmitFile(so_ia_PdfFileContent);
            nlapiSubmitField("salesorder",orderId,"custbody_sales_order_ia_file",so_ia_FileId);
            nlapiLogExecution("Debug","Message","Sales Order & IA PDF file has been created successfully having id#::"+orderId);
          }
          catch(ex)
          {
            nlapiLogExecution("Debug","Error Message Else Block",ex.message);
          }
        }
      }
    }
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error Saved Search 7671",ex.message);
  }
}
function formatDate(dateStr)
{
  var rtnStr = "";
  var dateObj = nlapiStringToDate(dateStr);
  var month = dateObj.getMonth();
  switch(month)
  {
    case 0:
      rtnStr += "January ";
      break;
    case 1:
      rtnStr += "February ";
      break;
    case 2:
      rtnStr += "March ";
      break;
    case 3:
      rtnStr += "April ";
      break;
    case 4:
      rtnStr += "May ";
      break;
    case 5:
      rtnStr += "June ";
      break;
    case 6:
      rtnStr += "July ";
      break;
    case 7:
      rtnStr += "August ";
      break;
    case 8:
      rtnStr += "September ";
      break;
    case 9:
      rtnStr += "October ";
      break;
    case 10:
      rtnStr += "November ";
      break;
    case 11:
      rtnStr += "December ";
      break;
  }
  rtnStr += dateObj.getDate() + ", " + dateObj.getFullYear();
  return rtnStr;
}
function getSapphire(netsuiteID)
{
  var rtnStr = "";
  switch(netsuiteID)
  {
    case "SBSL6.0RD2":
      rtnStr = "SB6RD";
      break;
    case "SPSL6.0RD2":
      rtnStr = "SP6RD";
      break;
    case "SBSL6.5RD3":
      rtnStr = "SB65RD";
      break;
    case "SBSL6.0CU3":
      rtnStr = "SB6XCU";
      break;
    case "SBSL8X6OV3":
    case "SBSL8x6OV3":
      rtnStr = "SB8X6OV";
      break;
    case "SBSL5.5RD3":
      rtnStr = "SB55RD";
      break;
    case "SVSL6.0RD2":
      rtnStr = "SV6RD";
      break;
  }
  return rtnStr;
}
function addCommas(nStr)
{
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;l
}
// Block-1 start to Calculate Halo Melee Count Added By Shiv//
//new code
function getHaloMeleeDetail(dmd_Id,dmd_ParentItemId)
{
  var haloMeleeResult=[];
  if((dmd_Id!='' && dmd_ParentItemId!=null))
  {
    var haloCheck='F';
    var grpItemArr=[];
    //nlapiLogExecution("debug","My Parent Item Id:"+dmd_ParentItemId,dmd_Id);
    var diamondMesearure=nlapiLookupField("item",dmd_Id,"custitem30"); 
    nlapiLogExecution("debug","diamond Mesearure:",diamondMesearure);
    var diamondShape=nlapiLookupField("item",dmd_Id,"custitem5");
    var mesearureSize=0;
    if(diamondMesearure!='' && diamondMesearure!=null)
    {
      mesearureSize=diamondMesearure.split('x')[0];
    }
    var itemFields=["parent","custitem20","custitem9","custitem11","custitem13","custitem94","custitem_sub_item_5","custitem_sub_item_6","custitem_sub_item_7"];
    //var qty_fields=["parent","custitem8","custitem10","custitem12","custitem95","custitem_quantity_5","custitem_quantity_6","custitem_quantity_7"];
    var Item=nlapiLookupField("item",dmd_ParentItemId,itemFields);
    //var quantity=nlapiLookupField("item",dmd_ParentItemId,qty_fields);
    var itemParentId=Item.parent;
    var itemParentName='';
    var haloMeleeCollection='';
    if(itemParentId!='' && itemParentId!=null)
    {
      itemParentName=nlapiLookupField("item",dmd_ParentItemId,"parent",true);
      haloMeleeCollection=nlapiLookupField("item",itemParentId,"custitemhalo_setting");
    }
    if(haloMeleeCollection=='T' && diamondShape=='1') // Check for Halo Settings Collection & diamond Shape
    {                 
      var itemCategId=Item.custitem20;
      var subItem1=Item.custitem9;
      var subItem2=Item.custitem11;
      var subItem3=Item.custitem13;
      var subItem4=Item.custitem94;
      var subItem5=Item.custitem_sub_item_5;
      var subItem6=Item.custitem_sub_item_6;
      var subItem7=Item.custitem_sub_item_7
      var stockUnit=0;
      var meleeSize=0;
      if(subItem1!='' && subItem1!=null)
      {
        meleeSize=1;
      }
      if(subItem2!='' && subItem2!=null)
      {
        meleeSize=2; // If more than 1 melee Size stone found       
      } 
      nlapiLogExecution("debug","Halo melee Size:"+meleeSize+ " calc. w.r.t. Parent Item Id:"+dmd_ParentItemId+", Dmd Id:"+dmd_Id,dmd_Id);
      if(meleeSize==1 || meleeSize==2)
      {
        var filters = [];     
        filters[0] = nlobjSearchFilter("custrecord_center_shape",null,'is',1); //Shape= Round
        filters[1] = nlobjSearchFilter("custrecord_parent_halo",null,'is',itemParentId);
        var searchResult = nlapiSearchRecord("customrecord_halo_melee",4391,filters,[]);  
        if(searchResult==null)return haloMeleeResult;
        var haloMeleeArr=[];
        var count=searchResult.length;
        if(searchResult.length>0)
        {
          for(i=0;i<searchResult.length;i++)
          {
            var ResultColm = searchResult[i].getAllColumns();
            var hmId = searchResult[i].getId();     
            var hmItemId = searchResult[i].getValue(ResultColm[0]);  
            var hmGemCount = searchResult[i].getValue(ResultColm[1]);                                     
            var hmCenterSize = searchResult[i].getValue(ResultColm[3]);
            var hmMeleeSize = searchResult[i].getValue(ResultColm[4]);
            var hmSize=0;
            if(hmCenterSize!='' && hmCenterSize!=null)
            {
              hmSize=hmCenterSize.replace('mm','');
            }             
            haloMeleeArr.push({hmId:hmId,hmSize:hmSize,hmGemCount:hmGemCount,hmMeleeSize:hmMeleeSize,hmItemId:hmItemId});
          }
          nlapiLogExecution("Debug","haloMeleeArr (Test)",JSON.stringify(haloMeleeArr));
          haloMeleeArr.sort(function(a, b) {
            return a.hmSize- b.hmSize;
          });
          nlapiLogExecution("Debug","sorted haloMeleeArr (Test)",JSON.stringify(haloMeleeArr));
          var k=0; var range1 = 0, range2=0,range3=0; 
          var gemCount=0;
          var haloMeleeId=0;
          var haloMeleeSize='';
          var haloParentItemId=0;
          for(var i=0; i<haloMeleeArr.length; i++)
          {
            range1 = parseFloat(haloMeleeArr[i].hmSize) - 0.25;
            range2 = parseFloat(haloMeleeArr[i].hmSize) + 0.25;
            range3 = parseFloat(haloMeleeArr[i].hmSize);                         
            if((range1 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2) || (range3 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2))
            {
              gemCount=haloMeleeArr[i].hmGemCount;
              haloMeleeId=haloMeleeArr[i].hmId;
              haloMeleeSize=haloMeleeArr[i].hmMeleeSize;
              haloParentItemId=haloMeleeArr[i].hmItemId;
              break;
            }
          }
          nlapiLogExecution("Debug","gemCount (Test)",gemCount);
          nlapiLogExecution("Debug","haloMeleeId (Test)",haloMeleeId);
          nlapiLogExecution("Debug","haloMeleeSize (Test)",haloMeleeSize);
          nlapiLogExecution("Debug","haloParentItemId (Test)",haloParentItemId);
          if(haloParentItemId!='' && haloParentItemId!=null)
          {
            if(subItem1!='' && subItem1!=null)
            {
              var subItemShape1=getItemHaloShape(subItem1);
              if(subItemShape1=='1')
              {
                var gemStoneCarat=0;  
                var gemStoneCount=0;
                var checkHaloMeleeSize=nlapiLookupField("item",haloParentItemId,"custitem9",true);
                nlapiLogExecution("Debug","checkHaloMeleeSize sub item 1",checkHaloMeleeSize);
                if(checkHaloMeleeSize == haloMeleeSize)
                {
                  gemStoneCount=gemCount;
                  var myStockUnitStr= nlapiLookupField("item",subItem1,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem1,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
                else
                {
                  gemStoneCount=nlapiLookupField("item",haloParentItemId,"custitem8");
                  var myStockUnitStr= nlapiLookupField("item",subItem1,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem1,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
              }
            }
            if(subItem2!='' && subItem2!=null)
            {
              var subItemShape2=getItemHaloShape(subItem2);         
              if(subItemShape2=='1')
              { 
                var gemStoneCarat=0;  
                var gemStoneCount=0;
                var checkHaloMeleeSize=nlapiLookupField("item",haloParentItemId,"custitem11",true);
                nlapiLogExecution("Debug","checkHaloMeleeSize sub item 2",checkHaloMeleeSize);
                if(checkHaloMeleeSize == haloMeleeSize)
                {
                  gemStoneCount=gemCount;
                  var myStockUnitStr= nlapiLookupField("item",subItem2,"stockunit",true);           
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem2,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
                else
                {
                  gemStoneCount=nlapiLookupField("item",haloParentItemId,"custitem10"); 
                  var myStockUnitStr= nlapiLookupField("item",subItem2,"stockunit",true);           
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem2,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
              }         
            }
            if(subItem3!='' && subItem3!=null)
            {
              var subItemShape3=getItemHaloShape(subItem3);
              if(subItemShape3=='1')
              {
                var gemStoneCarat=0;
                var gemStoneCount=0;  
                var checkHaloMeleeSize=nlapiLookupField("item",haloParentItemId,"custitem13",true);
                nlapiLogExecution("Debug","checkHaloMeleeSize sub item 3",checkHaloMeleeSize);
                if(checkHaloMeleeSize == haloMeleeSize)
                {
                  gemStoneCount=gemCount;
                  var myStockUnitStr= nlapiLookupField("item",subItem3,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem3,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
                else
                {
                  gemStoneCount=nlapiLookupField("item",haloParentItemId,"custitem12");
                  var myStockUnitStr= nlapiLookupField("item",subItem3,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem3,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
              }         
            }
            if(subItem4!='' && subItem4!=null)
            {
              var subItemShape4=getItemHaloShape(subItem4);
              if(subItemShape4=='1')
              {
                var gemStoneCarat=0;  
                var gemStoneCount=0;
                var checkHaloMeleeSize=nlapiLookupField("item",haloParentItemId,"custitem94",true);
                nlapiLogExecution("Debug","checkHaloMeleeSize sub item 4",checkHaloMeleeSize);
                if(checkHaloMeleeSize == haloMeleeSize)
                {
                  gemStoneCount=gemCount;
                  var myStockUnitStr= nlapiLookupField("item",subItem4,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem4,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
                else
                {
                  gemStoneCount=nlapiLookupField("item",haloParentItemId,"custitem95");
                  var myStockUnitStr= nlapiLookupField("item",subItem4,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem4,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
              }         
            }
            if(subItem5!='' && subItem5!=null)
            {
              var subItemShape5=getItemHaloShape(subItem5);
              if(subItemShape5=='1')
              {
                var gemStoneCarat=0;  
                var gemStoneCount=0;
                var checkHaloMeleeSize=nlapiLookupField("item",haloParentItemId,"custitem_subitem_5",true);
                nlapiLogExecution("Debug","checkHaloMeleeSize sub item 5",checkHaloMeleeSize);
                if(checkHaloMeleeSize == haloMeleeSize)
                {
                  gemStoneCount=gemCount;
                  var myStockUnitStr= nlapiLookupField("item",subItem5,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem5,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
                else
                {
                  gemStoneCount=nlapiLookupField("item",haloParentItemId,"custitem_quantity_5");
                  var myStockUnitStr= nlapiLookupField("item",subItem5,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem5,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
              }         
            }
            if(subItem6!='' && subItem6!=null)
            {
              var subItemShape6=getItemHaloShape(subItem6);
              if(subItemShape6=='1')
              {
                var gemStoneCarat=0;  
                var gemStoneCount=0;
                var checkHaloMeleeSize=nlapiLookupField("item",haloParentItemId,"custitem_subitem_6",true);
                nlapiLogExecution("Debug","checkHaloMeleeSize sub item 6",checkHaloMeleeSize);
                if(checkHaloMeleeSize == haloMeleeSize)
                {
                  gemStoneCount=gemCount;
                  var myStockUnitStr= nlapiLookupField("item",subItem6,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem6,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
                else
                {
                  gemStoneCount=nlapiLookupField("item",haloParentItemId,"custitem_quantity_6");
                  var myStockUnitStr= nlapiLookupField("item",subItem6,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem6,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
              }         
            }
            if(subItem7!='' && subItem7!=null)
            {
              var subItemShape7=getItemHaloShape(subItem7);
              if(subItemShape7=='1')
              {
                var gemStoneCarat=0;  
                var gemStoneCount=0;
                var checkHaloMeleeSize=nlapiLookupField("item",haloParentItemId,"custitem_subitem_7",true);
                nlapiLogExecution("Debug","checkHaloMeleeSize sub item 7",checkHaloMeleeSize);
                if(checkHaloMeleeSize == haloMeleeSize)
                {
                  gemStoneCount=gemCount;
                  var myStockUnitStr= nlapiLookupField("item",subItem7,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem7,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
                else
                {
                  gemStoneCount=nlapiLookupField("item",haloParentItemId,"custitem_quantity_7");
                  var myStockUnitStr= nlapiLookupField("item",subItem7,"stockunit",true);
                  if(myStockUnitStr!=null && myStockUnitStr!='')
                  {
                    stockUnit=myStockUnitStr.split(' ')[0];
                  }
                  if(gemStoneCount > 0 && stockUnit!=0)
                  {             
                    gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
                    gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
                    gemStoneCarat=gemStoneCarat.toFixed(2);
                  }
                  grpItemArr.push({subItemId:subItem7,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
                }
              }         
            }
            nlapiLogExecution("debug","grpItemArr (Test)",JSON.stringify(grpItemArr));
            var totgemCount=0;
            var totGemCarat=0;
            if(grpItemArr.length>0)
            {
              for(var i=0;i<grpItemArr.length;i++)
              {
                var gemStone=grpItemArr[i].gemStone;
                var gemCarat=grpItemArr[i].gemCarat;
                totgemCount=parseInt(totgemCount)+parseInt(gemStone);
                totGemCarat=parseFloat(totGemCarat)+ parseFloat(gemCarat);
              }
            }
            nlapiLogExecution("debug","totgemCount (Test)",totgemCount);
            nlapiLogExecution("debug","gemCarat (Test)",gemCarat);
            haloCheck='T';            
            haloMeleeResult.push({
              haloCheck:haloCheck,
              haloDmdShape:diamondShape,                  
              haloMeleeId:haloMeleeId,
              haloMesearure:mesearureSize,
              totalGem:totgemCount,
              stockUnit:stockUnit,
              totMinCarat:parseFloat(totGemCarat).toFixed(2)
            });
          }       
        }
      }
    }
  }
  return haloMeleeResult;
}
function getItemHaloShape(itemId)
{
  var shape='0';
  shape=nlapiLookupField("item",itemId,"custitem5");
  return shape;
}
// Block-1 end to Calculate Halo Melee Count //

// Block-2 start to Calculate Eternity Melee Count Added By Shiv//
function isCheckEternity(myItemId)
{
  var eternityFlag='F';
  if(myItemId!='' && myItemId!=null)
  {
    var field = ["parent","custitem9"];
    var item = nlapiLookupField("item",myItemId,field);
    var myParentItemId=item.parent;
    var isEternity= nlapiLookupField("item",myParentItemId,"custitem172");
    var fields = ["custitemeternitymeleecountsize3","custitemeternitymeleecountsize35","custitemeternitymeleecountsize4","custitemeternitymeleecountsize45","custitemeternitymeleecountsize5","custitemeternitymeleecountsize55","custitemeternitymeleecountsize6","custitemeternitymeleecountsize65","custitemeternitymeleecountsize7","custitemeternitymeleecountsize75","custitemeternitymeleecountsize8","custitemeternitymeleecountsize85","custitemeternitymeleecountsize9","custitemeternitymeleecountsize95","custitemeternitymeleecountsize10","custitemeternitymeleecountsize105","custitemeternitymeleecountsize11","custitemeternitymeleecountsize115","custitemeternitymeleecountsize12","custitemeternitymeleecountsize125"];
    var eternityItem = nlapiLookupField("item",myItemId,fields);
    var eMC3=eternityItem.custitemeternitymeleecountsize3;
    var eMC35=eternityItem.custitemeternitymeleecountsize35;
    var eMC4=eternityItem.custitemeternitymeleecountsize4;
    var eMC45=eternityItem.custitemeternitymeleecountsize45;
    var eMC5=eternityItem.custitemeternitymeleecountsize5;
    var eMC55=eternityItem.custitemeternitymeleecountsize55;
    var eMC6=eternityItem.custitemeternitymeleecountsize6;
    var eMC65=eternityItem.custitemeternitymeleecountsize65;
    var eMC7=eternityItem.custitemeternitymeleecountsize7;
    var eMC75=eternityItem.custitemeternitymeleecountsize75;
    var eMC8=eternityItem.custitemeternitymeleecountsize8;
    var eMC85=eternityItem.custitemeternitymeleecountsize85;
    var eMC9=eternityItem.custitemeternitymeleecountsize9;
    //added new enternity melee count size
    var eMC95=eternityItem.custitemeternitymeleecountsize95;
    var eMC10=eternityItem.custitemeternitymeleecountsize10;
    var eMC105=eternityItem.custitemeternitymeleecountsize105;
    var eMC11=eternityItem.custitemeternitymeleecountsize11;
    var eMC115=eternityItem.custitemeternitymeleecountsize115;
    var eMC12=eternityItem.custitemeternitymeleecountsize12;
    var eMC125=eternityItem.custitemeternitymeleecountsize125;
    if(eMC3.length > 0 || eMC35.length > 0 || eMC4.length > 0 || eMC45.length > 0 || eMC5.length > 0 || eMC55.length > 0 || eMC6.length > 0 || eMC65.length > 0 || eMC7.length > 0 || eMC75.length > 0 || eMC8.length > 0 || eMC85.length > 0 || eMC9.length > 0 || eMC95.length>0 || eMC10.length>0 || eMC105.length>0 ||eMC11.length>0 || eMC115.length>0 || eMC12.length>0 || eMC125.length>0)  
    {
      eternityFlag='T';
    }
  }
  return eternityFlag;
}
function getEternityMeleeDetail(myItemId)
{
  var eternityMeleeArr=[];
  if(myItemId!='' && myItemId!=null)
  {
    var fields = ["parent","custitem9"];
    var item = nlapiLookupField("item",myItemId,fields);
    var myParentItemId=item.parent;
    var myChildId=item.custitem9;
    if(myChildId!='' && myChildId !=null)     
    {
      var ringSize = nlapiLookupField("item",myItemId,"custitem2",true); //get ring Size;
      var fracPart=0, wholePart=0;
      if(ringSize.length >1)
      { 
        nlapiLogExecution("debug","My ringSize:"+ringSize+", Ring Size:"+ringSize,myItemId);     
        wholePart=ringSize.split('.')[0];
        fracPart=ringSize.split('.')[1];// Get fraction part of ring size
        fracPart='0.'+fracPart;                                                   
        if(parseFloat(fracPart)>=0 && parseFloat(fracPart)<=0.49)
        {
          //ringSize= Math.round(ringSize);
          ringSize=wholePart;
        }
        else if(parseFloat(fracPart)>=0.50 && parseFloat(fracPart)<=0.99)
        {
          //ringSize= Math.round(ringSize);                           
          ringSize=wholePart+'5';          
        }
      }
      var fldName="custitemeternitymeleecountsize"+ringSize;
      nlapiLogExecution("debug","My fldName:"+fldName+", Ring Size:"+ringSize,myItemId);
      var EternityMeleeCount=nlapiLookupField("item",myItemId,fldName); //custitemeternitymeleecountsize6
      /*var subItemObj=nlapiLoadRecord('inventoryitem',myParentItemId);                                
              var isEternity=subItemObj.getFieldValue('custitem172');*/
      var isEternity= nlapiLookupField("item",myParentItemId,"custitem172");
      /*var subItemObj2=nlapiLoadRecord('inventoryitem',myChildId);                                
              var myStockUnitStr=subItemObj2.getFieldText('stockunit');*/
      var myStockUnitStr= nlapiLookupField("item",myChildId,"stockunit",true);
      var stockUnit='';
      var totalCarat='';
      var NoOfGemStone='';
      if(myStockUnitStr!=null && myStockUnitStr!='')
      {
        stockUnit=myStockUnitStr.split(' ')[0];
      }
      if(isEternity=='1');
      {
        NoOfGemStone=EternityMeleeCount; 
        if(NoOfGemStone=='' || NoOfGemStone==null)
        {
          NoOfGemStone='0';
        }
        //nlapiLogExecution("debug","My No. Of GemStone:"+NoOfGemStone+", stockUnit:"+stockUnit,myItemId);
        if((stockUnit !='' && stockUnit != null) && (NoOfGemStone !='' && NoOfGemStone != null))
        {
          totalCarat=parseFloat(NoOfGemStone) * parseFloat(stockUnit);
          totalCarat=Math.round(totalCarat * 100)/100;
          totalCarat=totalCarat.toFixed(2);
          eternityMeleeArr.push({NoOfGemStone:NoOfGemStone,
                                 totalCarat:totalCarat});

        }
      }
    }
  }

  return eternityMeleeArr;
}
// Block-2 End to Calculate Eternity Melee Count //

function MeleeItemCountOn_PO(order, createPOLinkCount)
{
  var haloCheck='F';
  var meleeArr=[];
  for (var m = 1; m <= createPOLinkCount; m++)
  {

    var curr_item_type = order.getLineItemValue('links', 'type', m);
    var curr_item_PoID = order.getLineItemValue('links', 'tranid', m);
    nlapiLogExecution('DEBUG', 'curr_record_type and ID', curr_item_type + " " + curr_item_PoID);

    if (curr_item_type === 'Purchase Order') {
      var itemType = 'purchaseorder';
      var filters = new Array();
      filters[0] = nlobjSearchFilter('tranid', null, 'is', curr_item_PoID);
      var itemResult = nlapiSearchRecord(itemType, null, filters);
      if (itemResult != null) {
        var itemPO = nlapiLoadRecord(itemType, itemResult[0].getId());
        var  meleeItemPOCount = itemPO.getLineItemCount('recmachcustrecord_melee_items_po_link'); 

        var totalMeleeCount=0;
        var meleeCarat =0;
        var totalMeleeCarat =0;
        var meleeStockUnit=0;
        var roundMeleeShape =0;
        var roundMeleeShapeText ='';
        var roundMeleeColor ='';
        var roundMeleeClarity='';

        var marquise_totalMeleeCount=0;
        var marquise_meleeCarat =0;
        var marquise_totalMeleeCarat =0;
        var marquise_meleeStockUnit=0;
        var marquise_meleeShape =0;
        var marquise_meleeShapeText ='';
        var marquise_MeleeColor ='';
        var marquise_MeleeClarity='';

        var princess_totalMeleeCount=0;
        var princess_meleeCarat =0;
        var princess_totalMeleeCarat =0;
        var princess_meleeStockUnit=0;
        var princess_meleeShape =0;
        var princess_meleeShapeText ='';
        var princess_MeleeColor ='';
        var princess_MeleeClarity='';

        var cushion_totalMeleeCount=0;
        var cushion_meleeCarat =0;
        var cushion_totalMeleeCarat =0;
        var cushion_meleeStockUnit=0;
        var cushion_meleeShape =0;
        var cushion_meleeShapeText ='';
        var cushion_MeleeColor ='';
        var cushion_MeleeClarity='';

        var oval_totalMeleeCount=0;
        var oval_meleeCarat =0;
        var oval_totalMeleeCarat =0;
        var oval_meleeStockUnit=0;
        var oval_meleeShape =0;
        var oval_meleeShapeText ='';
        var oval_MeleeColor ='';
        var oval_MeleeClarity='';

        var emerald_totalMeleeCount=0;
        var emerald_meleeCarat =0;
        var emerald_totalMeleeCarat =0;
        var emerald_meleeStockUnit=0;
        var emerald_meleeShape =0;
        var emerald_meleeShapeText ='';
        var emerald_MeleeColor ='';
        var emerald_MeleeClarity='';

        var asscher_totalMeleeCount=0;
        var asscher_meleeCarat =0;
        var asscher_totalMeleeCarat =0;
        var asscher_meleeStockUnit=0;
        var asscher_meleeShape =0;
        var asscher_meleeShapeText ='';
        var asscher_MeleeColor ='';
        var asscher_MeleeClarity='';

        var radiant_totalMeleeCount=0;
        var radiant_meleeCarat =0;
        var radiant_totalMeleeCarat =0;
        var radiant_meleeStockUnit=0;
        var radiant_meleeShape =0;
        var radiant_meleeShapeText ='';
        var radiant_MeleeColor ='';
        var radiant_MeleeClarity='';

        var pear_totalMeleeCount=0;
        var pear_meleeCarat =0;
        var pear_totalMeleeCarat =0;
        var pear_meleeStockUnit=0;
        var pear_meleeShape =0;
        var pear_meleeShapeText ='';
        var pear_MeleeColor ='';
        var pear_MeleeClarity='';

        var heart_totalMeleeCount=0;
        var heart_meleeCarat =0;
        var heart_totalMeleeCarat =0;
        var heart_meleeStockUnit=0;
        var heart_meleeShape =0;
        var heart_meleeShapeText ='';
        var heart_MeleeColor ='';
        var heart_MeleeClarity='';

        if(meleeItemPOCount >0)
        {
          for(var k=1;k<=meleeItemPOCount;k++)
          {
            var itemId = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item',k);
            var meleeShape = getItemHaloShape(itemId);
            if(meleeShape == '1')
            {
              var chkroundMelee = false;
              roundMeleeShape = meleeShape;
              nlapiLogExecution("debug","Round Melee Shape",roundMeleeShape);
              roundMeleeShapeText ="Round";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(chkroundMelee==false)
              {
                var roundMeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var roundMeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkroundMelee = true;
              }
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(meleeCount > 0 && meleeStockUnit!=0)
              {
                meleeCarat=parseFloat(meleeCount) * parseFloat(meleeStockUnit);
                meleeCarat=Math.round(meleeCarat * 100)/100;
                meleeCarat=meleeCarat.toFixed(2);
                totalMeleeCount = totalMeleeCount + parseInt(meleeCount);
                totalMeleeCarat = parseFloat(totalMeleeCarat) + parseFloat(meleeCarat);
              }
            }
            if(meleeShape =='2')
            {
              var chkprincessMelee = false;
              princess_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Princess Melee Shape",princess_meleeShape);
              princess_meleeShapeText="Heart";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var princess_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkprincessMelee==false)
              {
                var princess_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var princess_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkprincessMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                princess_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(princess_meleeCount > 0 && princess_meleeStockUnit!=0)
              {
                princess_meleeCarat=parseFloat(princess_meleeCount) * parseFloat(princess_meleeStockUnit);
                princess_meleeCarat=Math.round(princess_meleeCarat * 100)/100;
                princess_meleeCarat=princess_meleeCarat.toFixed(2);
                princess_totalMeleeCount = princess_totalMeleeCount + parseInt(princess_meleeCount);
                princess_totalMeleeCarat = parseFloat(princess_totalMeleeCarat) + parseFloat(princess_meleeCarat);
              }
            }
            if(meleeShape =='3')
            {
              var chkcushionMelee =false;
              cushion_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Cushion Melee Shape",cushion_meleeShape);
              cushion_meleeShapeText="Cushion";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var cushion_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkcushionMelee==false)
              {
                var cushion_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var cushion_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkcushionMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                cushion_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(cushion_meleeCount > 0 && cushion_meleeStockUnit!=0)
              {
                cushion_meleeCarat=parseFloat(cushion_meleeCount) * parseFloat(cushion_meleeStockUnit);
                cushion_meleeCarat=Math.round(cushion_meleeCarat * 100)/100;
                cushion_meleeCarat=cushion_meleeCarat.toFixed(2);
                cushion_totalMeleeCount = cushion_totalMeleeCount + parseInt(cushion_meleeCount);
                cushion_totalMeleeCarat = parseFloat(cushion_totalMeleeCarat) + parseFloat(cushion_meleeCarat);
              }
            }
            if(meleeShape =='4')
            {
              var chkovalMelee =false;
              oval_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Oval Melee Shape",oval_meleeShape);
              oval_meleeShapeText="Oval";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var oval_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkovalMelee==false)
              {
                var oval_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var oval_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkovalMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                oval_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(oval_meleeCount > 0 && oval_meleeStockUnit!=0)
              {
                oval_meleeCarat=parseFloat(oval_meleeCount) * parseFloat(oval_meleeStockUnit);
                oval_meleeCarat=Math.round(oval_meleeCarat * 100)/100;
                oval_meleeCarat=oval_meleeCarat.toFixed(2);
                oval_totalMeleeCount = oval_totalMeleeCount + parseInt(oval_meleeCount);
                oval_totalMeleeCarat = parseFloat(oval_totalMeleeCarat) + parseFloat(oval_meleeCarat);
              }
            }
            if(meleeShape =='5')
            {
              var chkemeraldMelee =false;
              emerald_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Emerald Melee Shape",emerald_meleeShape);
              emerald_meleeShapeText="Oval";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var emerald_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkemeraldMelee==false)
              {
                var emerald_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var emerald_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkemeraldMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                emerald_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(emerald_meleeCount > 0 && emerald_meleeStockUnit!=0)
              {
                emerald_meleeCarat=parseFloat(emerald_meleeCount) * parseFloat(emerald_meleeStockUnit);
                emerald_meleeCarat=Math.round(emerald_meleeCarat * 100)/100;
                emerald_meleeCarat=emerald_meleeCarat.toFixed(2);
                emerald_totalMeleeCount = emerald_totalMeleeCount + parseInt(emerald_meleeCount);
                emerald_totalMeleeCarat = parseFloat(emerald_totalMeleeCarat) + parseFloat(emerald_meleeCarat);
              }
            }
            if(meleeShape =='6')
            {
              var chkasscherMelee =false;
              asscher_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Asscher Melee Shape",asscher_meleeShape);
              asscher_meleeShapeText="Asscher";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var asscher_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkasscherMelee==false)
              {
                var asscher_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var asscher_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkasscherMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                asscher_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(asscher_meleeCount > 0 && asscher_meleeStockUnit!=0)
              {
                asscher_meleeCarat=parseFloat(asscher_meleeCount) * parseFloat(asscher_meleeStockUnit);
                asscher_meleeCarat=Math.round(asscher_meleeCarat * 100)/100;
                asscher_meleeCarat=asscher_meleeCarat.toFixed(2);
                asscher_totalMeleeCount = asscher_totalMeleeCount + parseInt(asscher_meleeCount);
                asscher_totalMeleeCarat = parseFloat(asscher_totalMeleeCarat) + parseFloat(asscher_meleeCarat);
              }
            }
            if(meleeShape =='7')
            {
              var chkradiantMelee =false;
              radiant_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Radiant Melee Shape",radiant_meleeShape);
              radiant_meleeShapeText="Asscher";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var radiant_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkradiantMelee==false)
              {
                var radiant_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var radiant_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkradiantMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                radiant_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(radiant_meleeCount > 0 && radiant_meleeStockUnit!=0)
              {
                radiant_meleeCarat=parseFloat(radiant_meleeCount) * parseFloat(radiant_meleeStockUnit);
                radiant_meleeCarat=Math.round(radiant_meleeCarat * 100)/100;
                radiant_meleeCarat=radiant_meleeCarat.toFixed(2);
                radiant_totalMeleeCount =radiant_totalMeleeCount + parseInt(radiant_meleeCount);
                radiant_totalMeleeCarat = parseFloat(radiant_totalMeleeCarat) + parseFloat(radiant_meleeCarat);
              }
            }
            if(meleeShape =='8')
            {
              var chkpearMelee =false;
              pear_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Pear Melee Shape",pear_meleeShape);
              pear_meleeShapeText="Pear";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var pear_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(chkpearMelee==false)
              {
                var pear_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var pear_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkpearMelee = true;
              }
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                pear_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(pear_meleeCount > 0 && pear_meleeStockUnit!=0)
              {
                pear_meleeCarat=parseFloat(pear_meleeCount) * parseFloat(pear_meleeStockUnit);
                pear_meleeCarat=Math.round(pear_meleeCarat * 100)/100;
                pear_meleeCarat=pear_meleeCarat.toFixed(2);
                pear_totalMeleeCount =pear_totalMeleeCount + parseInt(pear_meleeCount);
                pear_totalMeleeCarat = parseFloat(pear_totalMeleeCarat) + parseFloat(pear_meleeCarat);
              }
            }
            if(meleeShape =='9')
            {
              var chkmarquiseMelee = false;
              marquise_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Marquise Melee Shape",marquise_meleeShape);
              marquise_meleeShapeText="Marquise";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var marquise_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkmarquiseMelee==false)
              {
                var marquise_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var marquise_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkmarquiseMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                marquise_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(marquise_meleeCount > 0 && marquise_meleeStockUnit!=0)
              {
                marquise_meleeCarat=parseFloat(marquise_meleeCount) * parseFloat(marquise_meleeStockUnit);
                marquise_meleeCarat=Math.round(marquise_meleeCarat * 100)/100;
                marquise_meleeCarat=marquise_meleeCarat.toFixed(2);
                marquise_totalMeleeCount = marquise_totalMeleeCount + parseInt(marquise_meleeCount);
                marquise_totalMeleeCarat = parseFloat(marquise_totalMeleeCarat) + parseFloat(marquise_meleeCarat);
              }
            }
            if(meleeShape =='10')
            {
              var chkheartMelee =false;
              heart_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Heart Melee Shape",heart_meleeShape);
              heart_meleeShapeText="Heart";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var heart_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkheartMelee==false)
              {
                var heart_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var heart_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkheartMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                heart_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(heart_meleeCount > 0 && heart_meleeStockUnit!=0)
              {
                heart_meleeCarat=parseFloat(heart_meleeCount) * parseFloat(heart_meleeStockUnit);
                heart_meleeCarat=Math.round(heart_meleeCarat * 100)/100;
                heart_meleeCarat=heart_meleeCarat.toFixed(2);
                heart_totalMeleeCount = heart_totalMeleeCount + parseInt(heart_meleeCount);
                heart_totalMeleeCarat = parseFloat(heart_totalMeleeCarat) + parseFloat(heart_meleeCarat);
              }
            }
          }
          haloCheck = 'T';
          meleeArr.push({
            meleeItemPOCount:meleeItemPOCount,

            totalMeleeCount:totalMeleeCount,totalMeleeCarat:totalMeleeCarat.toFixed(2),haloCheck:haloCheck,roundMeleeShape:roundMeleeShape,roundMeleeShapeText:roundMeleeShapeText,roundMeleeColor:roundMeleeColor,roundMeleeClarity:roundMeleeClarity,
            marquise_totalMeleeCount:marquise_totalMeleeCount,marquise_totalMeleeCarat:marquise_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,marquise_meleeShape:marquise_meleeShape,marquise_meleeShapeText:marquise_meleeShapeText,marquise_MeleeColor:marquise_MeleeColor,marquise_MeleeClarity:marquise_MeleeClarity,
            princess_totalMeleeCount:princess_totalMeleeCount,princess_totalMeleeCarat:princess_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,princess_meleeShape:princess_meleeShape,princess_meleeShapeText:princess_meleeShapeText,princess_MeleeColor:princess_MeleeColor,princess_MeleeClarity:princess_MeleeClarity,
            cushion_totalMeleeCount:cushion_totalMeleeCount,cushion_totalMeleeCarat:cushion_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,cushion_meleeShape:cushion_meleeShape,cushion_meleeShapeText:cushion_meleeShapeText,cushion_MeleeColor:cushion_MeleeColor,cushion_MeleeClarity:cushion_MeleeClarity,
            oval_totalMeleeCount:oval_totalMeleeCount,oval_totalMeleeCarat:oval_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,oval_meleeShape:oval_meleeShape,oval_meleeShapeText:oval_meleeShapeText,oval_MeleeColor:oval_MeleeColor,oval_MeleeClarity:oval_MeleeClarity,
            emerald_totalMeleeCount:emerald_totalMeleeCount,emerald_totalMeleeCarat:emerald_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,emerald_meleeShape:emerald_meleeShape,emerald_meleeShapeText:emerald_meleeShapeText,emerald_MeleeColor:emerald_MeleeColor,emerald_MeleeClarity:emerald_MeleeClarity,
            asscher_totalMeleeCount:asscher_totalMeleeCount,asscher_totalMeleeCarat:asscher_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,asscher_meleeShape:asscher_meleeShape,asscher_meleeShapeText:asscher_meleeShapeText,asscher_MeleeColor:asscher_MeleeColor,asscher_MeleeClarity:asscher_MeleeClarity,
            radiant_totalMeleeCount:radiant_totalMeleeCount,radiant_totalMeleeCarat:radiant_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,radiant_meleeShape:radiant_meleeShape,radiant_meleeShapeText:radiant_meleeShapeText,radiant_MeleeColor:radiant_MeleeColor,radiant_MeleeClarity:radiant_MeleeClarity,
            pear_totalMeleeCount:pear_totalMeleeCount,pear_totalMeleeCarat:pear_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,pear_meleeShape:pear_meleeShape,pear_meleeShapeText:pear_meleeShapeText,pear_MeleeColor:pear_MeleeColor,pear_MeleeClarity:pear_MeleeClarity,
            heart_totalMeleeCount:heart_totalMeleeCount,heart_totalMeleeCarat:heart_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,heart_meleeShape:heart_meleeShape,heart_meleeShapeText:heart_meleeShapeText,heart_MeleeColor:heart_MeleeColor,heart_MeleeClarity:heart_MeleeClarity

          });
        }
      }
    }
  }
  return meleeArr;
}

function rtnNewMeleeItemTable(meleeResult,newTempTable)
{
  if(meleeResult[0].roundMeleeShape=='1')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].princess_meleeShape=='2')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].princess_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].cushion_meleeShape=='3')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].cushion_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].oval_meleeShape=='4')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].oval_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].emerald_meleeShape=='5')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].emerald_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].asscher_meleeShape=='6')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].asscher_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].radiant_meleeShape=='7')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].radiant_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].pear_meleeShape=='8')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].pear_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].marquise_meleeShape=='9')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].marquise_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].heart_meleeShape=='10')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].heart_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  return newTempTable;
}


