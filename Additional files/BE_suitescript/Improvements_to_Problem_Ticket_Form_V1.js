//TASK:[NS-791] & [NS-826]
function problemTicketForm(type,form)
{
  try
  {
    var ctx = nlapiGetContext().getExecutionContext();
    nlapiLogExecution("debug","Context",ctx);
    if(ctx!="userinterface")
      return true;
    nlapiLogExecution("debug","type",type);
    if(type == "create" || type == "edit" || type=="view")
    {
      var salesOrderId =  nlapiGetFieldValue('custrecord4');
      nlapiLogExecution("Debug","Sales Order","SO Id :: "+salesOrderId);
      var fld = form.addField("custpage_items","multiselect","Items");
      form.insertField(fld,'custrecord246');
      if(salesOrderId==null || salesOrderId=='')return false;
      var soObj = nlapiLoadRecord("salesorder",salesOrderId);
      //var fld = form.addField("custpage_items","multiselect","Items");
      nlapiSetFieldValue('custrecord13',3);//Status {custrecord13} to be set to ‘Ongoing customer communications’ 
      if(type=="view" || type=="edit")
      {
        var item =  nlapiGetFieldValue('custrecord6');
        nlapiLogExecution("Debug","Item Id (View or Edit) Mode",item);
      }
      for(var litem=0;litem<soObj.getLineItemCount('item');litem++)
      {
        var itemText= soObj.getLineItemText('item','item',litem+1); 
        nlapiLogExecution("Debug","Item Text",itemText);
        var itemId= soObj.getLineItemValue('item','item',litem+1);
        nlapiLogExecution("Debug","Item Id",itemId);
        var itemType= soObj.getLineItemValue('item','itemtype',litem+1);

        if(itemType=="InvtPart")
        {
          var itemCategory = nlapiLookupField('inventoryitem',itemId,'custitem20');         if(itemCategory==2||itemCategory==3||itemCategory==36||itemCategory==35||itemCategory==32||itemCategory==24||itemCategory==7||itemCategory==8||itemCategory==15||itemCategory==18||itemCategory==31||itemCategory==14||itemCategory==20||itemCategory==4||itemCategory==5||itemCategory==34)
          {
            if(type=="view")
            {
              //if(item!=null && item !='')
              //{
                if(itemId==item)
                {
                  fld.addSelectOption(itemId,itemText,true);
                  break;
                }
             // }
            }
            else if(type=="edit")
            {
             // if(item!=null && item !='')
              //{
                if(itemId==item)
                {
                  fld.addSelectOption(itemId,itemText,true);
                }
                else
                  fld.addSelectOption(itemId,itemText);
              //}
            }
            else
              fld.addSelectOption(itemId,itemText);
          }
        }else if(itemType=="Assembly")
        {
          var itemCategory = nlapiLookupField('assemblyitem',itemId,'custitem20');
          if(itemCategory==2||itemCategory==3||itemCategory==36||itemCategory==35||itemCategory==32||itemCategory==24||itemCategory==7||itemCategory==8||itemCategory==15||itemCategory==18||itemCategory==31||itemCategory==14||itemCategory==20||itemCategory==4||itemCategory==5||itemCategory==34)
          {
            if(type=="view")
            {
              //if(item!=null && item !='')
              //{
                if(itemId==item)
                {
                  fld.addSelectOption(itemId,itemText,true);
                  break;
                }
              //}
            }
            else if(type=="edit")
            {
             // if(item!=null && item !='')
              //{
                if(itemId==item)
                {
                  fld.addSelectOption(itemId,itemText,true);
                }
                else
                  fld.addSelectOption(itemId,itemText);
             // }
            }
            else
              fld.addSelectOption(itemId,itemText);
          }
        }
      }
    }
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error",ex.message);
  }
}

/*
   List Of item Category are:
   Setting with large center stone [2]
   Ring with no large center stone [3]
   Uncerted Preset Engagement Ring [36]
   Certed Preset Engagement Ring [35]
   Preset Engagement Ring[32]       
   Loose Diamond [7]
   Loose Sapphire [8]
   Loose Ruby [14]
   Loose Aquamarine [15]
   Loose Colored Gemstone [18]
   Loose Emerald [20]
   Loose Gemstone [31]
   Earrings[4]
   Pendant[5]
   Bracelets[34]
  */
/* Anuj Kumar Verma */