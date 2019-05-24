function setPOCommentsCol(type)
{
  if(type=="create" || type=="specialorder")
  {
    try
    {
      var purchase_order=nlapiGetRecordId();

      var chk=setPOCommentsCol_call(type,purchase_order);
      if(!chk)
      {
        var get_result= Add_Comment(purchase_order,null);
        var search_record=get_result[1]; 
        var get_commentsStr=get_result[0]; 
        var commentsStr;
        var itemCategory=search_record[0].getValue("custitem20", "item");
		var uniqueDiamond=search_record[0].getValue("custitem198", "item");
		var inscribed=search_record[0].getValue('custitemdiamond_inscription','item');
        var purchaseDescription=search_record[0].getValue("memo", "applyingTransaction");
        var get_origin=search_record[0].getValue('custitem18','item');
        var commentsStr_origin='';
        if(get_origin)
        {
          commentsStr_origin=", Origin: "+get_origin;
        }
        var certificateNumber=search_record[0].getValue('custcol16');
        var vendorProdNotes=search_record[0].getValue("custitem_usny_production_notes","item");
        var itemNameText= search_record[0].getText("item");
        var sales_price= parseFloat(search_record[0].getValue('rate'));
        var get_price=0.8* sales_price;
        var insurence_value='';
        if(itemCategory==7 || uniqueDiamond=="T") 
        {
          commentsStr += "Set with:\n"
          commentsStr += "- Dia stock # " + purchaseDescription +commentsStr_origin +"\n\n"
          commentsStr += "- Cert # " + certificateNumber + "\n\n"
		  if(inscribed=="T")
		  {
		  commentsStr += "-Inscription: Yes \n";
		  }
		  else
		  {
			 commentsStr += "-Inscription: No \n";
		  }
          if(vendorProdNotes)
            commentsStr += vendorProdNotes + "\n\n" ;	 
          commentsStr+=get_commentsStr;
          insurence_value="\n Stone Insurance Value:"+   get_price.toFixed(2);
        }
        else if(itemCategory==8 || itemCategory==15 || itemCategory==18 || itemCategory==14 || itemCategory==20 || itemCategory==31)
        {
          commentsStr += "Set with:\n"
          commentsStr += "- Stock # " + itemNameText + "\n"
          commentsStr += "- Description " + purchaseDescription + "\n"
          if(vendorProdNotes!=null && vendorProdNotes!="")
            commentsStr += vendorProdNotes + "\n\n";
          commentsStr+=get_commentsStr;
          insurence_value="\n Stone Insurance Value:"+   get_price.toFixed(2);
        }
        else
        {
          commentsStr=get_commentsStr;
        }
        var poLineID= search_record[0].getValue("line", "applyingTransaction");	

        var soLineItem=search_record[0].getValue('item');
        try
        {
          //Set Comments Field on Purchase Order and Sales Order
          //PURCHASE ORDER    
          var poRec=nlapiLoadRecord('purchaseorder',purchase_order);
          for(var x=0; x < poRec.getLineItemCount("item"); x++)
          {
            if(poRec.getLineItemValue("item", "line", x+1)==poLineID)
            {
              var currentComments = poRec.getLineItemValue("item","custcol5",x+1)
              if(currentComments)
              {
                commentsStr = currentComments + "\n" + commentsStr;
              }
              commentsStr+=insurence_value;
              poRec.setLineItemValue("item", "custcol5", x+1, commentsStr);       
              nlapiSubmitRecord(poRec, false, true)
              break
            }
          }

          var currentComments = ""
          //SALES ORDER
          var soRec = nlapiLoadRecord("salesorder", search_record[0].getId())
          for(var x=0; x < soRec.getLineItemCount("item"); x++)
          {
            if(soRec.getLineItemValue("item", "item", x+1)==soLineItem)
            {			
              soRec.setLineItemValue("item", "custcol5", x+1, commentsStr);       
              nlapiSubmitRecord(soRec, false, true)
              break
            }
          }
          return true;
        }
        catch(err)
        {
          nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error setting Comments column on Sales Order and Purchase Order. Details: " + err.message)
          return false;
        }	
      }
    }
    catch(er){}
  }
} 



function setPOCommentsCol_call(type,purchase_order,get_result)
{

  var poFields = nlapiLookupField("purchaseorder", purchase_order, ['createdfrom','mainname'])
  var salesOrder = poFields["createdfrom"];
  var vendorID = poFields["mainname"];
  if(!salesOrder)
  {
    return false;
  }

  //Check to see if PO is to GM Casting House Inc (153) or Unique New York (7773) or Miracleworks (442500) or Harout (1223843) or Sasha Primak (1587345)
  //or Overnight (5852231) or Choice Jewelers (4740113) or Endless Designs (2388331) or Guild and Facet (5181551) or Frederick Goldman(11081056)  

  if(vendorID!=153 && vendorID!=7773 && vendorID!=442500 && vendorID!=1223843 && vendorID!=1587345 && vendorID!=5852231 && vendorID!=4740113 && vendorID!=2388331 && vendorID!=5181551 && vendorID!=11081056 && vendorID!=12996951)
    return false
    try
    {
      var filters = new Array()
      filters[0] = new nlobjSearchFilter("internalid", null, "is", salesOrder)
      filters[1] = new nlobjSearchFilter("mainline", null, "is", "F")
      filters[2] = new nlobjSearchFilter("custitem20", "item", "anyof", [7,8,15,18,14,20]);
      var cols = new Array()
      cols[0] = new nlobjSearchColumn("vendorcost", "item") //Purchase Price
      cols[1] = new nlobjSearchColumn("vendor", "item") //Vendor (currently pulls from item's preferred vendor)
      cols[2] = new nlobjSearchColumn("custitem30", "item") //Measurement
      cols[3] = new nlobjSearchColumn("purchasedescription", "item") //Purchase Description
      cols[4] = new nlobjSearchColumn("custcol16") //Certificate Number
      cols[5] = new nlobjSearchColumn("custitem20", "item") //Item: Category
      cols[6] = new nlobjSearchColumn("item")
      cols[7] = new nlobjSearchColumn("location")
      cols[8] = new nlobjSearchColumn("custbody146") //Diamond ETA
      cols[9] = new nlobjSearchColumn("custitem_usny_production_notes", "item") //Item: Vendor Production Notes	
      cols[10] = new nlobjSearchColumn("custbodywb_workflow"); //Auto Approval Workflow
      cols[11] = new nlobjSearchColumn('custitem18','item');
      cols[12] = new nlobjSearchColumn('rate');
	  cols[13] = new nlobjSearchColumn('custitem198','item');
	  cols[14] = new nlobjSearchColumn('custitemdiamond_inscription','item');
      var results = nlapiSearchRecord("salesorder", null, filters, cols)
      if(results!=null)
      {
        //SO PO RATE FIELD POPULATED **AFTER PO IS CREATED**
        var vendor = results[0].getText("vendor", "item");
        var measurement = results[0].getValue("custitem30", "item");
        if(measurement!="" && measurement!=null)
          measurement += "mm";
        var purchaseDescription = results[0].getValue("purchasedescription", "item");
        var certificateNumber = results[0].getValue("custcol16");
        var itemCategory = results[0].getValue("custitem20", "item");
        var itemNameText = results[0].getText("item");
        var itemID = results[0].getValue("item");
        var location = results[0].getValue("location");
        var diamondETA = results[0].getValue("custbody146");
        var vendorProdNotes = results[0].getValue("custitem_usny_production_notes","item");
        var autoApproved = results[0].getValue("custbodywb_workflow");
        var sales_price= parseFloat(results[0].getValue('rate'));
        var get_price=0.8* sales_price;
        var insurence_value="\n Stone Insurance Value:"+   get_price.toFixed(2);
        var get_origin= results[0].getText('custitem18','item');
		var uniqueDiamond = results[0].getValue("custitem198","item");
		var inscribed = results[0].getValue("custitemdiamond_inscription","item");
        if(get_origin)
        {
          var commentsStr_origin=", Origin: "+get_origin;
        }
        nlapiLogExecution("debug","Auto-Approved: " + autoApproved);
      }
      else
      {
        //No item with category Loose Diamond/Loose Sapphire is on the SO then exit the script
        nlapiLogExecution("debug", "Exit Script", "Exitting script because no SO search results.");
        return false;
      }
    }
  catch(err)
  {
    nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error collecting SO information from item where category is Loose Diamond/Sapphire. Details: " + err.message)
    return false;
  }
  var hasDiamond=false;
  try
  {
    //Search PO for Item with category Setting with large center stone
    var poLineID = null
    var soLineID = null

    var filters = new Array()
    filters[0] = new nlobjSearchFilter("internalid", null, "is", purchase_order)
    filters[1] = new nlobjSearchFilter("mainline", null, "is", "F");
    var cols = new Array()
    cols[0] = new nlobjSearchColumn("item") //Item Internal ID
    cols[1] = new nlobjSearchColumn("custitem20", "item") //Category (custom)
    cols[2] = new nlobjSearchColumn("line") //Line ID of Line Item
    var results = nlapiSearchRecord("purchaseorder", null, filters, cols)
    if(results!=null)
    {
      for(var x=0; x < results.length; x++)
      {
        //Check to see if Category = Setting with large center stone (ID=2)
        if(results[x].getValue("custitem20", "item")=="2" && results[x].getText("item")!="Custom Engagement Ring" && results[x].getText("item")!="Custom Wedding Ring")
        {
          hasDiamond = true
          poLineID = results[x].getValue("line");
          soLineItem = results[x].getValue("item");  
        }			  
      }
    }
    if(hasDiamond==false)
    {
      //If the PO doesn't have a item with category Setting with large center stone then exit the script
      nlapiLogExecution("debug", "Exit Script", "Exitting script because no there is no diamond.")
      return false;
    }

  }
  catch(err)
  {
    nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error determining whether PO contains an item with category Setting with large center stone. Details: " + err.message)
    return false;
  }

  try
  {
    //Build string to put in Comments column
    var commentsStr = ""
    var get_result= Add_Comment(purchase_order,itemID);
    if(get_result)
    {
      var get_commentsStr=get_result[0];
      if(itemCategory==7 || uniqueDiamond=="T") 
      {
        commentsStr += "Set with:\n"
        commentsStr += "- Dia stock # " + purchaseDescription +commentsStr_origin +"\n\n"
        commentsStr += "- Cert # " + certificateNumber + "\n\n"
		 if(inscribed=="T")
		  {
		  commentsStr += "-Inscription: Yes \n";
		  }
		 else
		  {
			 commentsStr += "-Inscription: No \n";
		  }
        if(vendorProdNotes!=null && vendorProdNotes!="")
          commentsStr += vendorProdNotes + "\n\n" ;	 
        commentsStr+=get_commentsStr;
      }
      else if(itemCategory==8 || itemCategory==15 || itemCategory==18 || itemCategory==14 || itemCategory==20 || itemCategory==31)
      {
        commentsStr += "Set with:\n"
        commentsStr += "- Stock # " + itemNameText + "\n"
        commentsStr += "- Description " + purchaseDescription + "\n"
        if(vendorProdNotes!=null && vendorProdNotes!="")
          commentsStr += vendorProdNotes + "\n\n";
        commentsStr+=get_commentsStr;
      }
    }
    else
    {  


      if(itemCategory==7 || uniqueDiamond=="T") 
      {
        //Diamonds
        commentsStr += "Set with:\n"
        //commentsStr += "- Dia stock # " + purchaseDescription + "\n\n"
        commentsStr += "- Dia stock # " + purchaseDescription +commentsStr_origin +"\n\n"
        commentsStr += "- Cert # " + certificateNumber + "\n\n"
		if(inscribed=="T")
		  {
		  commentsStr += "-Inscription: Yes \n";
		  }
		 else
		  {
			 commentsStr += "-Inscription: No \n";
		  }
        if(vendorProdNotes!=null && vendorProdNotes!="")
          commentsStr += vendorProdNotes + "\n\n"

          if(location=="2")
          {
            if(diamondETA!=null && diamondETA!="")
              diamondETA = nlapiStringToDate(diamondETA);
            else
              diamondETA = new Date();

            diamondETA = nlapiAddDays(diamondETA,1);

            if(diamondETA.getDay()=="6")
              diamondETA = nlapiAddDays(diamondETA,2); //Saturday = Add 2 Days to Monday
            else if(diamondETA.getDay()=="0")
              diamondETA = nlapiAddDays(diamondETA,1); //Sunday = Add 1 Day to Monday

            diamondETA = nlapiDateToString(diamondETA,"date");

            commentsStr += "Arriving from San Francisco on " + diamondETA + "\n"
          }
        else
        {
          if(diamondETA==null || diamondETA=="")
          {
            diamondETA = new Date();
            diamondETA = nlapiAddDays(diamondETA,1);

            if(diamondETA.getDay()=="6")
              diamondETA = nlapiAddDays(diamondETA,2); //Saturday = Add 2 Days to Monday
            else if(diamondETA.getDay()=="0")
              diamondETA = nlapiAddDays(diamondETA,1); //Sunday = Add 1 Day to Monday
          }						

          if(vendor!=null && vendor!="")
            commentsStr += "Arriving from " + vendor + " on " + diamondETA + "\n"
            else
              commentsStr += "Arriving on " + diamondETA + "\n"
              }
      }
      else if(itemCategory==8 || itemCategory==15 || itemCategory==18 || itemCategory==14 || itemCategory==20)
      {
        //Sapphires and other gems
        commentsStr += "Set with:\n"
        commentsStr += "- Stock # " + itemNameText + "\n"
        commentsStr += "- Description " + purchaseDescription + "\n"
        if(vendorProdNotes!=null && vendorProdNotes!="")
          commentsStr += vendorProdNotes + "\n\n"

          //Calculate next business day
          var currentDate = new Date()
          var nextBusinessDay = new Date()


          if(autoApproved=="T")
          {
            //For auto-approved sales order, deadline is 8AM
            if(currentDate.getHours() >= 8)
              currentDate = nlapiAddDays(currentDate,1);
          }
        else
        {
          //If after 2PM add one more business day
          if(currentDate.getHours() >= 14)
            currentDate = nlapiAddDays(currentDate,1);
        }

        switch(currentDate.getDay())
        {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
            //Sunday - Thursday
            nextBusinessDay.setDate(currentDate.getDate()+1);
            break;
          case 5:
            //Friday
            nextBusinessDay.setDate(currentDate.getDate()+3);
            break;
          case 6:
            //Saturday
            nextBusinessDay.setDate(currentDate.getDate()+2);
            break;
        }				
        commentsStr += "Arriving from SF on " + (nextBusinessDay.getMonth()+1) + "/" + nextBusinessDay.getDate() + "/" + nextBusinessDay.getFullYear() + "\n"
      }
    }   
  }
  catch(err)
  {
    nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error creating Comments column string. Details: " + err.message)
    return false;
  }

  try
  {
    //Set Comments Field on Purchase Order and Sales Order
    //PURCHASE ORDER    
    var poRec = nlapiLoadRecord("purchaseorder", purchase_order)
    for(var x=0; x < poRec.getLineItemCount("item"); x++)
    {
      if(poRec.getLineItemValue("item", "line", x+1)==poLineID)
      {
        poRec.setLineItemValue("item","custcolitem_link",x+1,itemID);
        var currentComments = poRec.getLineItemValue("item","custcol5",x+1)
        if(currentComments)
        {
          commentsStr = currentComments + "\n\n" + commentsStr;
        }
        commentsStr+=insurence_value;
        poRec.setLineItemValue("item", "custcol5", x+1, commentsStr);       
        nlapiSubmitRecord(poRec, false, true)
        break
      }
    }

    var currentComments = ""
    //SALES ORDER
    var soRec = nlapiLoadRecord("salesorder", salesOrder)
    for(var x=0; x < soRec.getLineItemCount("item"); x++)
    {
      if(soRec.getLineItemValue("item", "item", x+1)==soLineItem)
      {			
        soRec.setLineItemValue("item", "custcol5", x+1, commentsStr);       
        nlapiSubmitRecord(soRec, false, true)
        break
      }
    }
    return true;
  }
  catch(err)
  {
    nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error setting Comments column on Sales Order and Purchase Order. Details: " + err.message)
    return false;
  }
}


function Add_Comment(poRec,itemID)
{

  var columns=[];
  var filter=[];
  columns.push(new nlobjSearchColumn("custcolitem_link", "applyingTransaction"));
  columns.push(new nlobjSearchColumn("custitemmelee_sides_sent_from_sf", "item"));
  columns.push(new nlobjSearchColumn("location", "applyingTransaction"));
  columns.push(new nlobjSearchColumn("custcol18","applyingTransaction"));
  columns.push(new nlobjSearchColumn("custitem20", "item"));
  columns.push(new nlobjSearchColumn("memo", "applyingTransaction"));
  columns.push(new nlobjSearchColumn("custitem18","item"));
  columns.push(new nlobjSearchColumn("custitem_usny_production_notes","item"));
  columns.push(new nlobjSearchColumn("line", "applyingTransaction"));
  columns.push(new nlobjSearchColumn("item"));  	
  columns.push(new nlobjSearchColumn("custcol16"));  	
  columns.push(new nlobjSearchColumn("rate"));  
  filter.push(new nlobjSearchFilter('type','applyingTransaction','anyof','PurchOrd')); 
  filter.push(new nlobjSearchFilter('custcol18','applyingTransaction','isnotempty')); 	
  filter.push(new nlobjSearchFilter('applyingTransaction',null,'anyof',poRec)); 	
  var search_record=nlapiSearchRecord('salesorder',null,filter,columns);
  if(search_record)
  {
    var ItemLink_id=search_record[0].getValue("custcolitem_link", "applyingTransaction");
    if(!ItemLink_id)
    {
      ItemLink_id= itemID;
    }
    var melee_sides_sent_from_SF=search_record[0].getValue("custitemmelee_sides_sent_from_sf", "item"); 
    var item_id=search_record[0].getValue("item"); 
    var flag=false;  
    if (melee_sides_sent_from_SF == 'T') 
    {
      flag=true;
    }         		
    else if (ItemLink_id) 
    {
      item_link_category = nlapiLookupField('inventoryitem', ItemLink_id,'custitem20');
      if(item_link_category == '24' && item_id == '1093360')
      {
        flag = true;
      }
      else
      {
        if (item_link_category == '7' || item_link_category == '31' || item_link_category == '15' || item_link_category == '8' || item_link_category== '20' || item_link_category == '14' )
        {  
          var get_loction=search_record[0].getValue("location", "applyingTransaction");
          if(get_loction)
          {
            var search_location_avilbale=nlapiSearchRecord('item',null,[
              new nlobjSearchFilter('internalid',null,'anyof',ItemLink_id),
              new nlobjSearchFilter('inventorylocation',null,'anyof',get_loction),
              new nlobjSearchFilter('locationquantityonhand',null,'greaterthan','0').setLeftParens(1).setOr(true),
              new nlobjSearchFilter('locationquantityavailable',null,'greaterthan','0').setRightParens(1) ]);
            if(search_location_avilbale)
            {                  
              flag = true;
            }
          }
        }

      }	
    }
    if(flag)
    {
      var curr_SF_sent_date =search_record[0].getValue("custcol18","applyingTransaction");
      curr_SF_sent_date = nlapiStringToDate(curr_SF_sent_date, "date");
      nextBusinessDay = nlapiAddDays(curr_SF_sent_date, 1);
      curr_SF_sent_date = businessDay_date(nextBusinessDay);
      var get_date_return= "Arriving from SF on " + curr_SF_sent_date;
      return [get_date_return,search_record];
    }
  }
}

function businessDay_date(nextBusinessDay){
  var next_date='';
  var day = nextBusinessDay.getDay();
  if(day=='0' || day=='6'){
    switch(nextBusinessDay.getDay())
    {
      case 0:
        nextBusinessDay = nlapiAddDays(nextBusinessDay,1);
        break;			
      case 6: 
        nextBusinessDay = nlapiAddDays(nextBusinessDay,2);
        break; 		
    }
  }
  next_date = nlapiDateToString(nextBusinessDay,"date");
  return next_date;	
}