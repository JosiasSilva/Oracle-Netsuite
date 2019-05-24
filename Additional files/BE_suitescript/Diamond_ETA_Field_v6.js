nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Diamond_ETA_Field(type)
{
  try
  {
    //Added by ajay 10April 2017
    var context = nlapiGetContext();
    var contextType = context.getExecutionContext();
    if(contextType!="userinterface" && contextType!="userevent")
    {
      nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
      return true;
    }
    //Ended by ajay 10April 2017

    var record_type = nlapiGetRecordType();
    nlapiLogExecution("debug","Record Type",record_type);
    nlapiLogExecution("debug","Event Type",type);
    if(type=="create" || type=="specialorder")
    {
      if(record_type=="purchaseorder")
      {
        var vendor = nlapiGetNewRecord().getFieldValue("entity");
        var vendor_category = nlapiLookupField("vendor",vendor,"custentity4");
        if(vendor_category=="1" || vendor_category=="5")                               
        {
          var sales_order = nlapiGetNewRecord().getFieldValue("createdfrom");
          if(sales_order!=null && sales_order!="")
          {
            var diamond_eta = nlapiLookupField("salesorder",sales_order,"custbody146");
            if(diamond_eta!=null && diamond_eta!="")
            {
              nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",diamond_eta);

              var filters = [];
              filters.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",sales_order));
              var results = nlapiSearchRecord("customrecord_custom_diamond",null,filters);
              if(results)
              {
                for(var x=0; x < results.length; x++)
                {
                  // Added new logic for NS-1398
                  //It is possible for a Custom Diamond Page to not have a Diamond ETA while its Sales Order does.
                  //A Custom Diamond Page’s Diamond ETA will not be synced to the Sales Order’s Diamond ETA unless the Custom Diamond Page’s Diamond Status is “Confirmed” 
                  //or “On Hold - Customer Payment Pending.” 
                  //In fact, a Custom Diamond Page should not even have a Diamond ETA unless its Diamond Status is “Confirmed” or “On Hold - Customer Payment Pending.”
                  var diamondETABolVal = get_DiamondETA_Frm_PO_Or_SO(results[x].getId());
                  nlapiLogExecution("debug","diamond eta boolean value (case 1) :",diamondETABolVal);
                  if(diamondETABolVal == true)
                    nlapiSubmitField("customrecord_custom_diamond",results[x].getId(),"custrecord_diamond_eta",diamond_eta);
                }
              }
            }
            else if((diamond_eta==null || diamond_eta=="") && (nlapiGetNewRecord().getFieldValue("custbody59")!=null && nlapiGetNewRecord().getFieldValue("custbody59")!=""))
            {
              nlapiSubmitField("salesorder",sales_order,"custbody146",nlapiGetNewRecord().getFieldValue("custbody59"));

              var filters = [];
              filters.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",sales_order));
              var results = nlapiSearchRecord("customrecord_custom_diamond",null,filters);
              if(results)
              {
                for(var x=0; x < results.length; x++)
                {
                  // Added new logic for NS-1398
                  var diamondETABolVal = get_DiamondETA_Frm_PO_Or_SO(results[x].getId());
                  nlapiLogExecution("debug","diamond eta boolean value (case 2) :",diamondETABolVal);
                  if(diamondETABolVal == true)
                    nlapiSubmitField("customrecord_custom_diamond",results[x].getId(),"custrecord_diamond_eta",nlapiGetNewRecord().getFieldValue("custbody59"));
                }
              }
            }
          }
        }
      }
    }
    else if(type=="edit")
    {
      if(record_type=="purchaseorder")
      {
        var vendor = nlapiGetNewRecord().getFieldValue("entity");
        var vendor_category = nlapiLookupField("vendor",vendor,"custentity4");
        if(vendor_category=="1" || vendor_category=="5")                                
        {
          var old_diamond_eta = nlapiGetOldRecord().getFieldValue("custbody59");
          var new_diamond_eta = nlapiGetNewRecord().getFieldValue("custbody59");
          if(old_diamond_eta!=new_diamond_eta)
          {
            var sales_order = nlapiGetNewRecord().getFieldValue("createdfrom");
            if(sales_order!=null && sales_order!="")
            {
              nlapiSubmitField("salesorder",sales_order,"custbody146",nlapiGetNewRecord().getFieldValue("custbody59"));

              var filters = [];
              filters.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",sales_order));
              var results = nlapiSearchRecord("customrecord_custom_diamond",null,filters);
              if(results)
              {
                for(var x=0; x < results.length; x++)
                {
                  // Added new logic for NS-1398
                  var diamondETABolVal = get_DiamondETA_Frm_PO_Or_SO(results[x].getId());
                  nlapiLogExecution("debug","diamond eta boolean value (case 3) :",diamondETABolVal);
                  if(diamondETABolVal == true)
                    nlapiSubmitField("customrecord_custom_diamond",results[x].getId(),"custrecord_diamond_eta",nlapiGetNewRecord().getFieldValue("custbody59"));
                }
              }
            }
          }
        }
      }
      else if(record_type=="salesorder")
      {
        var old_diamond_eta = nlapiGetOldRecord().getFieldValue("custbody146");
        var new_diamond_eta = nlapiGetNewRecord().getFieldValue("custbody146");

        nlapiLogExecution("debug","old diamond eta value :",old_diamond_eta);
        nlapiLogExecution("debug","new diamond eta value :",new_diamond_eta);
        if(old_diamond_eta !=new_diamond_eta && new_diamond_eta !=null && new_diamond_eta !="")
        {
          var diamondCount = 0;
          if(nlapiGetNewRecord().getFieldValue("custbody_category1")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category2")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category3")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category4")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category5")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category6")=="7")
            diamondCount++;

          nlapiLogExecution("debug","Total diamond count :",diamondCount);

          var filters = [];
          filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
          filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
          filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
          var cols = [];
          cols.push(new nlobjSearchColumn("purchaseorder"));
          cols.push(new nlobjSearchColumn("mainname","purchaseorder"));
          cols.push(new nlobjSearchColumn("custbody146"));
          var results = nlapiSearchRecord("salesorder",null,filters,cols);
          nlapiLogExecution("debug","Total results count :",JSON.stringify(results));
          if(results)
          {
            for(var x=0; x < results.length; x++)
            {
              var vendor = results[x].getValue("mainname","purchaseorder");
              var vendor_category = nlapiLookupField("vendor",vendor,"custentity4");
              nlapiLogExecution("debug","Vendor category :",vendor_category);
              var poId = results[x].getValue("purchaseorder");

              if(vendor_category=="1" || vendor_category=="5")                                                        
              {
                nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody59",new_diamond_eta);								
                var filters1 = [];
                filters1.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",nlapiGetRecordId()));
                var results1 = nlapiSearchRecord("customrecord_custom_diamond",null,filters1);

                if(results1)
                {
                  nlapiLogExecution("debug","New results length :",results1.length);
                  for(var x1=0; x1 < results1.length; x1++)
                  {
                    // Added new logic for NS-1398
                    var diamondETABolVal = get_DiamondETA_Frm_PO_Or_SO(results1[x1].getId());
                    nlapiLogExecution("debug","diamond eta boolean value (case 4) :",diamondETABolVal);
                    if(diamondETABolVal == true)
                      nlapiSubmitField("customrecord_custom_diamond",results1[x1].getId(),"custrecord_diamond_eta",new_diamond_eta);                          
                  }
                }
              }

              //IF SO ONLY HAS ONE LOOSE DIAMOND, THEN UPDATE ALL PO's WITH CHANGED DIAMOND ETA
              if(diamondCount < 2)
              { 
                if(vendor_category == "6")
                {
                  nlapiLogExecution("debug","Updation on Diamond Eta field of PO");                                    
                  nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody146",new_diamond_eta);								
                  nlapiLogExecution("debug","Diamond Eta updated");
                  var filters1 = [];
                  filters1.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",nlapiGetRecordId()));
                  var results1 = nlapiSearchRecord("customrecord_custom_diamond",null,filters1);

                  if(results1)
                  {
                    nlapiLogExecution("debug","New results1 length :",results1.length);
                    for(var x1=0; x1 < results1.length; x1++)
                    {
                      // Added new logic for NS-1398
                      var diamondETABolVal = get_DiamondETA_Frm_PO_Or_SO(results1[x1].getId());
                      nlapiLogExecution("debug","diamond eta boolean value (case 5) :",diamondETABolVal);
                      if(diamondETABolVal == true)
                        nlapiSubmitField("customrecord_custom_diamond",results1[x1].getId(),"custrecord_diamond_eta",new_diamond_eta); 
                      //nlapiLogExecution("debug","custom record diamond1 updated.");                                                                            
                    }
                  }
                }
              } 
            }
          }
        }
      }
    }
    else if(type=="approve")
    {                      

      if(record_type=="salesorder")
      {
        var new_diamond_eta = nlapiGetOldRecord().getFieldValue("custbody146");                                  
        nlapiLogExecution("debug","new diamond eta value after approve :",new_diamond_eta);

        var filters = [];
        filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
        filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
        filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
        var cols = [];
        cols.push(new nlobjSearchColumn("purchaseorder"));
        cols.push(new nlobjSearchColumn("mainname","purchaseorder"));
        cols.push(new nlobjSearchColumn("custbody146"));
        var results = nlapiSearchRecord("salesorder",null,filters,cols);
        if(results && new_diamond_eta != null && new_diamond_eta !="")
        {
          var diamondCount = 0;
          if(nlapiGetNewRecord().getFieldValue("custbody_category1")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category2")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category3")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category4")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category5")=="7")
            diamondCount++;
          if(nlapiGetNewRecord().getFieldValue("custbody_category6")=="7")
            diamondCount++;

          nlapiLogExecution("debug","Total diamond count :",diamondCount);

          for(var x=0; x < results.length; x++)
          {
            var vendor = results[x].getValue("mainname","purchaseorder");
            var vendor_category = nlapiLookupField("vendor",vendor,"custentity4");
            var poId = results[x].getValue("purchaseorder");

            if(vendor_category=="1" || vendor_category=="5")                                                
            {
              nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody59",new_diamond_eta);

              var filters1 = [];
              filters1.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",nlapiGetRecordId()));
              var results1 = nlapiSearchRecord("customrecord_custom_diamond",null,filters1);
              if(results1)
              {
                for(var x1=0; x1 < results1.length; x1++)
                {
                  // Added new logic for NS-1398
                  var diamondETABolVal = get_DiamondETA_Frm_PO_Or_SO(results1[x1].getId());
                  nlapiLogExecution("debug","diamond eta boolean value (case 6) :",diamondETABolVal);
                  if(diamondETABolVal == true)
                    nlapiSubmitField("customrecord_custom_diamond",results1[x1].getId(),"custrecord_diamond_eta",new_diamond_eta);
                }
              }
            }

            //IF SO ONLY HAS ONE LOOSE DIAMOND, THEN UPDATE ALL PO's WITH CHANGED DIAMOND ETA
            if(diamondCount < 2)
            { 
              if(vendor_category == "6")
              {                           
                nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody146",new_diamond_eta);

                var filters1 = [];
                filters1.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",nlapiGetRecordId()));
                var results1 = nlapiSearchRecord("customrecord_custom_diamond",null,filters1);

                if(results1)
                {
                  for(var x1=0; x1 < results1.length; x1++)
                  {
                    // Added new logic for NS-1398
                    var diamondETABolVal = get_DiamondETA_Frm_PO_Or_SO(results1[x1].getId());
                    nlapiLogExecution("debug","diamond eta boolean value (case 7) :",diamondETABolVal);
                    if(diamondETABolVal == true)
                      nlapiSubmitField("customrecord_custom_diamond",results1[x1].getId(),"custrecord_diamond_eta",new_diamond_eta);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  catch(err)
  {
    nlapiLogExecution("error","Error Updating Dimaond ETA Field","Details: " + err.message);
    return true;
  }
}