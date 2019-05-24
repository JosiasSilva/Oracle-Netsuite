// Added new code for [NS-671] on jul 2017
function MeleeItemCountOn_PO(order, createPOLinkCount)
{
  var haloCheck='F';
  var meleeArr=[];
  for (var m = 1; m <= createPOLinkCount; m++)
  {

    var curr_item_type = order.getLineItemValue('links', 'type', m);
    var curr_item_PoID = order.getLineItemValue('links', 'tranid', m);
    nlapiLogExecution('DEBUG', 'curr_record_type and ID', curr_item_type + " " + curr_item_PoID);

    if (curr_item_type === 'Purchase Order')
    {
      var itemType = 'purchaseorder';
      var filters = new Array();
      filters[0] = nlobjSearchFilter('tranid', null, 'is', curr_item_PoID);
      var itemResult = nlapiSearchRecord(itemType, null, filters);
      if (itemResult != null)
      {
        var itemPO = nlapiLoadRecord(itemType, itemResult[0].getId());
        var  meleeItemPOCount = itemPO.getLineItemCount('recmachcustrecord_melee_items_po_link');
        // updated by [NS-876]
        var melee_count_updated = nlapiLookupField(itemType,itemResult[0].getId(),"custbody_melee_count_updated");
        nlapiLogExecution("Debug","Melee Count Updated on PO",melee_count_updated);

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

        var Baguette_totalMeleeCount=0;
        var Baguette_meleeCarat =0;
        var Baguette_totalMeleeCarat =0;
        var Baguette_meleeStockUnit=0;
        var Baguette_meleeShape =0;
        var Baguette_meleeShapeText ='';
        var Baguette_MeleeColor ='';
        var Baguette_MeleeClarity='';

        // updated by [NS-876]
        if(melee_count_updated == 'T')
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
            if(meleeShape =='11')
            {
              var chkbaguetteMelee =false;
              Baguette_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Baguette Melee Shape",Baguette_meleeShape);
              Baguette_meleeShapeText="Baguette";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var Baguette_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkbaguetteMelee==false)
              {
                var Baguette_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var Baguette_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkbaguetteMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                Baguette_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(Baguette_meleeCount > 0 && Baguette_meleeStockUnit!=0)
              {
                Baguette_meleeCarat=parseFloat(Baguette_meleeCount) * parseFloat(Baguette_meleeStockUnit);
                Baguette_meleeCarat=Math.round(Baguette_meleeCarat * 100)/100;
                Baguette_meleeCarat=Baguette_meleeCarat.toFixed(2);
                Baguette_totalMeleeCount = Baguette_totalMeleeCount + parseInt(Baguette_meleeCount);
                Baguette_totalMeleeCarat = parseFloat(Baguette_totalMeleeCarat) + parseFloat(Baguette_meleeCarat);
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
              heart_totalMeleeCount:heart_totalMeleeCount,heart_totalMeleeCarat:heart_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,heart_meleeShape:heart_meleeShape,heart_meleeShapeText:heart_meleeShapeText,heart_MeleeColor:heart_MeleeColor,heart_MeleeClarity:heart_MeleeClarity,
              
 Baguette_totalMeleeCount:Baguette_totalMeleeCount,Baguette_totalMeleeCarat:Baguette_totalMeleeCarat.toFixed(2),Baguette_meleeShape:Baguette_meleeShape,Baguette_meleeShapeText:Baguette_meleeShapeText,Baguette_MeleeColor:Baguette_MeleeColor,Baguette_MeleeClarity:Baguette_MeleeClarity
            });
        }
      }
    }
  }
  return meleeArr;
}