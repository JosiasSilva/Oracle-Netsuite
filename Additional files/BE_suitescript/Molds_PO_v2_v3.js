nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Create_Mold(type)
{
  if(type=="create" || type=="edit")
  {
    try
    {
      var po = nlapiGetNewRecord();
      for(var x=0; x <po.getLineItemCount("item"); x++)
      {
        if(po.getLineItemValue("item","custcol13",x+1)=="T" && (po.getLineItemValue("item","custcol17",x+1)!=null && nlapiGetLineItemValue("item","custcol17",x+1)!=null) && (nlapiGetLineItemValue("item","custcol_mold_new",x+1)==null || nlapiGetLineItemValue("item","custcol_mold_new",x+1)==null) && (po.getLineItemValue("item","custcolitem_link",x+1)==null || po.getLineItemValue("item","custcolitem_link",x+1) ==''))
        {
          var mold_name = po.getLineItemValue("item","custcol17",x+1);
          nlapiLogExecution("DEBUG","MOLD NAME HAVING LINK ITEM EMPTY(MOLD)",mold_name);
          var item = po.getLineItemValue("item","item",x+1);
          nlapiLogExecution("DEBUG","INVENTORY ITEM ID HAVING LINK ITEM EMPTY(MOLD)",item);
          var ringSize = nlapiLookupField('inventoryitem',item,"custitem2",true);// // ADDED NEW CODE AS PER NS-1007
          nlapiLogExecution("DEBUG","RING SIZE HAVING LINK ITEM EMPTY(MOLD)",ringSize);
          var parent = nlapiLookupField("item",item,"parent");
          nlapiLogExecution("DEBUG","PARENT ITEM ID HAVING LINK ITEM EMPTY(MOLD)",parent);
          if(parent==null || parent=="")
            parent = item;

          var vendor = po.getFieldValue("entity");
          nlapiLogExecution("DEBUG","VENDOR HAVING LINK ITEM EMPTY(MOLD)",vendor);
          var filters = [];
          filters.push(new nlobjSearchFilter("name",null,"is",mold_name));
          filters.push(new nlobjSearchFilter("custrecord_mold_vendor",null,"is",vendor));
          filters.push(new nlobjSearchFilter("custrecord_mold_item",null,"is",parent));
          var results = nlapiSearchRecord("customrecord_mold",null,filters);
          if(results)
          {
            nlapiLogExecution("DEBUG","Type (Mold) HAVING ITEM LINK EMPTY",type);
            var moldID = results[0].getId();
            nlapiLogExecution("DEBUG","EXISTING MOLD RECORD ID HAVING ITEM LINK EMPTY(MOLD)",moldID);
            //nlapiSetLineItemValue("item","custcol_mold_new",x+1,moldID);
          }
          else
          {
            nlapiLogExecution("DEBUG","Type (Mold) HAVING ITEM LINK EMPTY",type);
            var moldRecord = nlapiCreateRecord("customrecord_mold");
            moldRecord.setFieldValue("name",mold_name);
            moldRecord.setFieldValue("custrecord_mold_vendor",vendor);
            moldRecord.setFieldValue("custrecord_mold_item",parent);
            moldRecord.setFieldValue("custrecord_mold_purchase_order",nlapiGetRecordId());
            if(ringSize!=null && ringSize !='')
              moldRecord.setFieldValue("custrecord_ring_size",ringSize);// ADDED NEW CODE AS PER NS-1007
            var moldID = nlapiSubmitRecord(moldRecord,true,true);
            nlapiLogExecution("DEBUG","NEW MOLD RECORD ID HAVING ITEM LINK EMPTY(MOLD)",moldID);
            //nlapiSetLineItemValue("item","custcol_mold_new",x+1,moldID);
          }
        }
        else if(po.getLineItemValue("item","custcol13",x+1)=="T" && (po.getLineItemValue("item","custcol17",x+1)!=null && nlapiGetLineItemValue("item","custcol17",x+1)!=null) && (nlapiGetLineItemValue("item","custcol_mold_new",x+1)==null || nlapiGetLineItemValue("item","custcol_mold_new",x+1)==null) && (po.getLineItemValue("item","custcolitem_link",x+1)!=null && po.getLineItemValue("item","custcolitem_link",x+1)!=''))
        {
          // ADDED NEW CODE AS PER NS-1007
          var itemLink = po.getLineItemValue("item","custcolitem_link",x+1);
          nlapiLogExecution("DEBUG","ITEM LINK ID(MOLD)",itemLink);
          var itemlinkFields = nlapiLookupField("inventoryitem",itemLink,['custitem5','custitem30']);
          nlapiLogExecution("DEBUG","ITEM LINK Fields JSON (MOLD)",JSON.stringify(itemlinkFields));
          var shape='';
          var measurements ='';
          var ringSize ='';
          if(itemlinkFields!=null && itemlinkFields!='')
          {
            shape = itemlinkFields.custitem5;// shape
            nlapiLogExecution("DEBUG","SHAPE (MOLD)",shape);
            measurements = itemlinkFields.custitem30;// measurements
            nlapiLogExecution("DEBUG","MEASUREMENTS (MOLD)",measurements);
          }
          var length='',width='',depth='',description='', shapeText='';
          if(measurements !=null && measurements !='')
          {
            var mrsInfo = measurements.split('x');
            length = mrsInfo[0];
            nlapiLogExecution("DEBUG","LENGTH (MOLD)",length);
            if(mrsInfo[1] == null)
              width = '';
            else
              width = mrsInfo[1];
            nlapiLogExecution("DEBUG","WIDTH (MOLD)",width);
            if(mrsInfo[2]== null)
              depth ='';
            else 
              depth = mrsInfo[2];
            nlapiLogExecution("DEBUG","DEPTH (MOLD)",depth);
          }
          if(shape==1)
            shapeText='RD'; // Round = RD
          else if(shape==2)
            shapeText='PC'; //	Princess = PC
          else if(shape==3)
            shapeText='CU'; // Cushion = CU
          else if(shape==4)
            shapeText='OV'; //  Oval = OV
          else if(shape==5)
            shapeText='EC'; //  Emerald = EC (NOT CLEAR)
          else if(shape==6)
            shapeText='AS'; //  Asscher = AS
          else if(shape==7) 
            shapeText='RA'; //	Radiant = RA
          else if(shape==8)
            shapeText='PS';	// 	Pear = PS
          else if(shape==9)
            shapeText='MQ'; // 	Marquise = MQ
          else if(shape==10)
            shapeText='HS'; //	Heart = HS (NOT CLEAR)
          nlapiLogExecution("DEBUG","SHAPE TEXT (MOLD)",shapeText);
          // END HERE
          var mold_name = po.getLineItemValue("item","custcol17",x+1);
          nlapiLogExecution("DEBUG","MOLD NAME (MOLD)",mold_name);
          var item = po.getLineItemValue("item","item",x+1);
          nlapiLogExecution("DEBUG","INVENTORY ITEM ID (MOLD)",item);
          var ring_Size = nlapiLookupField('inventoryitem',item,'custitem2',true); // ADDED NEW CODE AS PER NS-1007
          if(ring_Size!=null && ring_Size !='')
            ringSize = ring_Size;
          nlapiLogExecution("DEBUG","RING SIZE(MOLD)",ringSize);
          if(measurements != null && measurements != '')
            description = measurements + ' '+ shapeText +' '+'Size'+' '+ringSize; // ADDED NEW CODE AS PER NS-1007
          nlapiLogExecution("DEBUG","DESCRIPTION (MOLD)",description);
          var parent = nlapiLookupField("item",item,"parent");
          nlapiLogExecution("DEBUG","PARENT ITEM ID(MOLD)",parent);
          if(parent==null || parent=="")
            parent = item;
          var vendor = po.getFieldValue("entity");
          nlapiLogExecution("DEBUG","VENDOR(MOLD)",vendor);
          var filters = [];
          filters.push(new nlobjSearchFilter("name",null,"is",mold_name));
          filters.push(new nlobjSearchFilter("custrecord_mold_vendor",null,"is",vendor));
          filters.push(new nlobjSearchFilter("custrecord_mold_item",null,"is",parent));
          var results = nlapiSearchRecord("customrecord_mold",null,filters);
          if(results)
          {
            nlapiLogExecution("DEBUG","Type (Mold 1)",type);
            var moldID = results[0].getId();
            nlapiLogExecution("DEBUG","EXISTING MOLD RECORD ID (MOLD)",moldID);
            //nlapiSetLineItemValue("item","custcol_mold_new",x+1,moldID);
          }
          else
          {
            nlapiLogExecution("DEBUG","Type (Mold 2)",type);
            var moldRecord = nlapiCreateRecord("customrecord_mold");
            moldRecord.setFieldValue("name",mold_name);
            moldRecord.setFieldValue("custrecord_mold_vendor",vendor);
            moldRecord.setFieldValue("custrecord_mold_item",parent);
            moldRecord.setFieldValue("custrecord_mold_purchase_order",nlapiGetRecordId());
            // ADDED NEW CODE AS PER NS-1007
            moldRecord.setFieldText("custrecord_shape",shapeText);
            moldRecord.setFieldValue("custrecord_length",length);
            moldRecord.setFieldValue("custrecord_width",width);
            moldRecord.setFieldValue("custrecord_depth",depth);
            moldRecord.setFieldValue("custrecord_ring_size",ringSize);
            moldRecord.setFieldValue("custrecord178",description);

            var moldID = nlapiSubmitRecord(moldRecord,true,true);
            //nlapiSetLineItemValue("item","custcol_mold_new",x+1,moldID);
            nlapiLogExecution("DEBUG","NEW MOLD RECORD ID (MOLD)",moldID);
          }
        }
      }
      // ADD NEW CAD RECORD [NS-1007]
      try
      {
        for(var x=0; x <po.getLineItemCount("item"); x++)
        {
          if(po.getLineItemValue("item","custcol_cad_item",x+1)=="T" && (po.getLineItemValue("item","custcolitem_link",x+1)==null || po.getLineItemValue("item","custcolitem_link",x+1) ==''))
          {
            var item = po.getLineItemValue("item","item",x+1);
            nlapiLogExecution("DEBUG","INVENTORY ITEM ID HAVING ITEM LINK EMPTY (CAD)",item);
            var ringSize = nlapiLookupField('inventoryitem',item,'custitem2',true);
            nlapiLogExecution("DEBUG","RING SIZE HAVING ITEM LINK EMPTY (CAD)",ringSize);
            var parent = nlapiLookupField("item",item,"parent");
            nlapiLogExecution("DEBUG","PARENT ITEM ID HAVING ITEM LINK EMPTY (CAD)",parent);
            if(parent==null || parent=="")
              parent = item;
            var vendor = po.getFieldValue("entity");
            nlapiLogExecution("DEBUG","VENDOR HAVING ITEM LINK EMPTY (CAD)",vendor);

            var filters = [];
            filters.push(new nlobjSearchFilter("custrecord_icr_vendor",null,"is",vendor));
            filters.push(new nlobjSearchFilter("custrecord_icr_parent_sku",null,"is",parent));
            filters.push(new nlobjSearchFilter("custrecord_icr_purchase_order",null,"is",nlapiGetRecordId()));
            var results = nlapiSearchRecord("customrecord_internal_cad",null,filters);
            if(results)
            {
              nlapiLogExecution("DEBUG","Type (CAD 1) HAVING ITEM LINK EMPTY",type);
              var cadID = results[0].getId();
              nlapiLogExecution("DEBUG","EXISTING CAD RECORD ID HAVING ITEM LINK EMPTY (CAD)",cadID);
            }
            else 
            {
              nlapiLogExecution("DEBUG","Type (CAD 1) HAVING ITEM LINK EMPTY",type);
              var cadRecord = nlapiCreateRecord("customrecord_internal_cad");
              cadRecord.setFieldValue("custrecord_icr_vendor",vendor);
              cadRecord.setFieldValue("custrecord_icr_parent_sku",parent);
              cadRecord.setFieldValue("custrecord_icr_purchase_order",nlapiGetRecordId());
              if(ringSize!=null && ringSize!='')
                cadRecord.setFieldValue("custrecord_icr_ring_size",ringSize);

              var cadID = nlapiSubmitRecord(cadRecord,true,true);
              nlapiLogExecution("DEBUG","NEW CAD RECORD ID WITH RING SIZE HAVING ITEM LINK EMPTY (CAD)",cadID);
            }
          }
          else if(po.getLineItemValue("item","custcol_cad_item",x+1)=="T" && (po.getLineItemValue("item","custcolitem_link",x+1)!=null && po.getLineItemValue("item","custcolitem_link",x+1) !=''))
          {
            var itemLink = po.getLineItemValue("item","custcolitem_link",x+1);
            nlapiLogExecution("DEBUG","ITEM LINK ID (CAD)",itemLink);
            var shape = '';
            var measurements ='';
            var ringSize ='';
            var itemlinkFields = nlapiLookupField("inventoryitem",itemLink,['custitem5','custitem30']);
            nlapiLogExecution("DEBUG","ITEM LINK Fields JSON (CAD)",JSON.stringify(itemlinkFields));
            if(itemlinkFields!=null && itemlinkFields!='')
            {
              shape = itemlinkFields.custitem5;// shape
              nlapiLogExecution("DEBUG","SHAPE (CAD)",shape);
              measurements = itemlinkFields.custitem30;// measurements
              nlapiLogExecution("DEBUG","MEASUREMENTS (CAD)",measurements);
            }
            var length='',width='',depth='',description='', shapeText='';
            if(measurements !=null && measurements !='')
            {
              var mrsInfo = measurements.split('x');
              length = mrsInfo[0];
              nlapiLogExecution("DEBUG","LENGTH (CAD)",length);
              if(mrsInfo[1] == null)
                width = '';
              else
                width = mrsInfo[1];
              nlapiLogExecution("DEBUG","WIDTH (CAD)",width);
              if(mrsInfo[2]== null)
                depth ='';
              else 
                depth = mrsInfo[2];
              nlapiLogExecution("DEBUG","DEPTH (CAD)",depth);
            }
            if(shape==1)
              shapeText='RD'; // Round = RD
            else if(shape==2)
              shapeText='PC'; // Princess = PC
            else if(shape==3)
              shapeText='CU'; // Cushion = CU
            else if(shape==4)
              shapeText='OV'; // Oval = OV
            else if(shape==5)
              shapeText='EC'; // Emerald = EC (NOT CLEAR)
            else if(shape==6)
              shapeText='AS'; // Asscher = AS
            else if(shape==7)
              shapeText='RA'; // Radiant = RA
            else if(shape==8)
              shapeText='PS'; // Pear = PS
            else if(shape==9)
              shapeText='MQ'; // Marquise = MQ
            else if(shape==10)
              shapeText='HS'; // Heart = HS (NOT CLEAR)
            nlapiLogExecution("DEBUG","SHAPE TEXT (CAD)",shapeText);

            var item = po.getLineItemValue("item","item",x+1);
            nlapiLogExecution("DEBUG","INVENTORY ITEM ID(CAD)",item);
            var ring_Size = nlapiLookupField('inventoryitem',item,'custitem2',true);
            if(ring_Size!=null && ring_Size !='')
              ringSize = ring_Size;
            nlapiLogExecution("DEBUG","RING SIZE(CAD)",ringSize);
            if(measurements!=null && measurements!='')
              description = measurements + ' '+ shapeText +' '+'Size'+' '+ringSize;
            nlapiLogExecution("DEBUG","DESCRIPTION (CAD)",description);
            var parent = nlapiLookupField("item",item,"parent");
            nlapiLogExecution("DEBUG","PARENT ITEM ID(CAD)",parent);
            if(parent==null || parent=="")
              parent = item;
            var vendor = po.getFieldValue("entity");
            nlapiLogExecution("DEBUG","VENDOR (CAD)",vendor);

            var filters = [];
            filters.push(new nlobjSearchFilter("custrecord_icr_vendor",null,"is",vendor));
            filters.push(new nlobjSearchFilter("custrecord_icr_parent_sku",null,"is",parent));
            filters.push(new nlobjSearchFilter("custrecord_icr_purchase_order",null,"is",nlapiGetRecordId()));
            var results = nlapiSearchRecord("customrecord_internal_cad",null,filters);
            if(results)
            {
              nlapiLogExecution("DEBUG","Type (CAD 1)",type);
              var cadID = results[0].getId();
              nlapiLogExecution("DEBUG","EXISTING CAD RECORD ID(CAD)",cadID);
            }
            else 
            {
              nlapiLogExecution("DEBUG","Type (CAD 2)",type);
              var cadRecord = nlapiCreateRecord("customrecord_internal_cad");
              cadRecord.setFieldValue("custrecord_icr_vendor",vendor);
              cadRecord.setFieldValue("custrecord_icr_parent_sku",parent);
              cadRecord.setFieldValue("custrecord_icr_purchase_order",nlapiGetRecordId());

              cadRecord.setFieldText("custrecord_icr_shape",shapeText);
              cadRecord.setFieldValue("custrecord_icr_length",length);
              cadRecord.setFieldValue("custrecord_icr_width",width);
              cadRecord.setFieldValue("custrecord_icr_depth",depth);
              cadRecord.setFieldValue("custrecord_icr_ring_size",ringSize);
              cadRecord.setFieldValue("custrecord_dimensions_n_shape",description);

              var cadID = nlapiSubmitRecord(cadRecord,true,true);
              nlapiLogExecution("DEBUG","NEW CAD RECORD ID (CAD)",cadID);
            }
          }
        }
      }
      catch(ex)
      {
        nlapiLogExecution("error","Error Creating Cad Record","Details: " + err.message);
        return true;
      }
    }
    catch(err)
    {
      nlapiLogExecution("error","Error Creating Mold Record","Details: " + err.message);
      return true;
    }
  }
}

function Molds_PO_BL(type,form)
{
  if(type=="view" || type=="edit" || type=="create")
  {
    try
    {
      if(nlapiGetContext().getExecutionContext()!="userinterface")
        return true;

      for(var x=0; x < nlapiGetLineItemCount("item"); x++)
      {
        var molds = [];
        var item = nlapiGetLineItemValue("item","item",x+1);
        var vendor = nlapiGetFieldValue("entity");

        var parent = nlapiLookupField("item",item,"parent");
        if(parent==null || parent=="")
          continue;

        nlapiLogExecution("debug","PO Vendor",vendor);

        var filters = [];
        filters.push(new nlobjSearchFilter("custrecord_mold_item",null,"is",parent));
        filters.push(new nlobjSearchFilter("custrecord_mold_vendor",null,"is",vendor));
        var cols = [];
        cols.push(new nlobjSearchColumn("name"));
        var results = nlapiSearchRecord("customrecord_mold",null,filters,cols);
        if(results)
        {
          for(var i=0; i < results.length; i++)
          {
            molds.push(results[i].getValue("name"));
          }
          nlapiLogExecution("debug","Molds",molds.join("\n"));
          nlapiSetLineItemValue("item","custcol_molds_so",x+1,molds.join("\n"));
        }
      }
    }
    catch(err)
    {
      nlapiLogExecution("error","Error Showing Molds On PO","Details: " + err.message);
      return true;
    }
  }
}
