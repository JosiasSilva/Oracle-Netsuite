function Drop_Ship_Checklist_Promo_Items()
{
  var orders = [];
  var results = nlapiSearchRecord("transaction","customsearch_ds_promo_items_so_2"); //5314
  if(results)
  {
    var cols = results[0].getAllColumns();
    nlapiLogExecution("debug","# Results: " + results.length);		
    for(var x=0; x < results.length; x++)
    {			
      var drop_ship_checklist_temp = results[x].getValue(cols[3]);
      var SO = results[x].getValue("internalid",null,"group");
      //if(SO == '14790734')
      {
        if(drop_ship_checklist_temp == "" || drop_ship_checklist_temp == "- None -" || drop_ship_checklist_temp == null)
        {
          drop_ship_checklist_temp = Drop_Ship_Data(SO);
        }
        try
        {					
          nlapiSubmitField("salesorder",SO,"custbody_drop_ship_promo_item",drop_ship_checklist_temp);	
          nlapiLogExecution("debug","Updating order internal ID - " + SO,"Promo Items: " + drop_ship_checklist_temp);
        }
        catch(w)
        {
          nlapiLogExecution("debug", "Erron in SO update #"+SO,w);	
        }
        orders.push(SO);
        RescheduleScript();
      }
    }
  }	
  if(orders.length > 0)
  {
    nlapiLogExecution("debug", "Total orders #",JSON.stringify(orders));
    var filters = [];
    filters.push(new nlobjSearchFilter("createdfrom",null,"anyof",orders));
    var col = [];
    col.push(new nlobjSearchFilter("custbody_on_vendor_portal",null));		
    col.push(new nlobjSearchFilter("date",null));
    var results = nlapiSearchRecord("transaction","customsearch_ds_promo_item_po",filters);
    nlapiLogExecution("debug","# results.length: " + results.length);
    if(results)
    {
      for(var x=0; x < results.length; x++)
      {
        var promo_item =  results[x].getValue("custbody_drop_ship_promo_item","createdfrom","max");
        var poId =  results[x].getValue("internalid",null,"min");
        var fieldObj = nlapiLookupField("purchaseorder",poId,['custbody_on_vendor_portal','custbody_pushtoportal','custbody_pushrevisedpo','custbody_revise_count']);			
        if(fieldObj.custbody_on_vendor_portal == 'T')
        {  
          var fieldName = [];
          var fieldValue = [];
          if(fieldObj.custbody_pushtoportal == 'T' && fieldObj.custbody_pushrevisedpo == 'F')
          {
            var Res = PushPODataNSToPortal(poId,promo_item,"1128");
            if(Res)
            {
              fieldName = ['custbody_portal_status','custbody_pushtoportal','custbody_on_vendor_portal','custbody_po_portal_url','custbody_drop_ship_promo_item'];
              fieldValue = Res;
              nlapiLogExecution("debug", "PO successfully pushed to Portal. #"+poId);	
            }
          }
          else if(fieldObj.custbody_pushrevisedpo == 'T')
          {
            var Res = PushRevisedPODataNSToPortal(poId,promo_item,"1128");
            if(Res)
            {
              fieldName = ['custbody_portal_status','custbody_pushrevisedpo','custbody_po_portal_url','custbody_drop_ship_promo_item'];
              fieldValue = Res;
              nlapiLogExecution("debug","Revised PO successfully pushed to Portal."+poId);
            }
          }				
          if(fieldName && fieldName.length>2 && fieldValue && fieldValue.length>2)
          {							
            try
            {
              nlapiSubmitField('purchaseorder',poId,fieldName,fieldValue);					
              nlapiLogExecution("debug", "PO successfully updated #"+poId);	
            }
            catch(err)
            {
              nlapiLogExecution("debug", "Erron in PO update #"+poId,ex);	
            }	
          }
        }
        RescheduleScript();
      }
    }
  }
}
function PushPODataNSToPortal(poId,promo_item,scriptId)
{
  var ResPO = [];
  try
  { 		
    nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId , poId);
    if(poId)
    {			
      var POObj = nlapiLoadRecord("purchaseorder",poId);
      var AddFees = POObj.getFieldValue('custbody_addional_fee_check');



      var transid=POObj.getFieldValue('tranid') ;
      var custbody_ship_date1 = POObj.getFieldValue('custbody_po_ship_date'); //NEW NS DATE FIELD TBD
      if(custbody_ship_date1 == '' || custbody_ship_date1 == null) // added by ajay(ship date)
      {
        custbody_ship_date1 = nlapiDateToString(new Date());
      }
      var custbody146 = POObj.getFieldValue('custbody146');// Diamond ETA   
      if(custbody146 == '' || custbody146 == null)
      {				   
        custbody146 = null;
      }
      var custbody39= POObj.getFieldValue('custbody39')  ;   // DROP SHIP MATERIALS SENT TO VENDOR
      if(custbody39=='' || custbody39==null)
      {
        custbody39='F';
      }
      else
      {
        custbody39='T';
      }
      var custbody116=POObj.getFieldValue('custbody116'); // CAD OR WAX DUE DATE
      if(custbody116=='' || custbody116==null)
      {
        custbody116=null;
      }
      var custbody209 = POObj.getFieldValue('custbody209');  //  Date shippend from vendor
      if(custbody209=='' || custbody209==null)
      {
        custbody209=null;
      }
      var custbody6=POObj.getFieldValue('custbody6'); // DELIVERY DATE
      if(custbody6 == '' || custbody6 == null)
      {
        custbody6 = nlapiDateToString(new Date());
      }
      var custbody129 = POObj.getFieldValue('custbody129'); //   TO BE WATCHED
      var custbody58=POObj.getFieldValue('custbody58'); //  Important Notes/ SO Notes
      if(custbody58=='' || custbody58==null)
      {
        custbody58="";
      }
      var custbody41 =  POObj.getFieldValue('custbody41'); //  DESIGN APPROVAL STATUS
      var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
      var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS
      var certificate_status = POObj.getFieldValue('custbodycertificate_status'); // CERTIFICATE STATUS
      if(certificate_status=='' || certificate_status==null)
      {
        certificate_status=null;
      }
      var cad_file_name = POObj.getFieldValue('custbodycustbody_internal_cad_file_nam');
      if(cad_file_name == null || cad_file_name == '')
      {
        cad_file_name = null;
      }
      var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
      if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
      {				   
        approved_to_grow_confirmation = null;
      }			
      var VendorId = POObj.getFieldValue('entity');
      // [PP-348]
      var drop_ship_eligible =  POObj.getFieldText('custbody_drop_ship_eligible');
      if(drop_ship_eligible == "Yes")
        drop_ship_eligible ="yes";
      else if(drop_ship_eligible =="No")
        drop_ship_eligible ="no";
      else if(drop_ship_eligible=="N/A")
        drop_ship_eligible="na";

      //PP-336
      var updated_datetime_on_ns = POObj.getFieldValue('custbody_updated_datetime_on_ns');

      var itemCount  = POObj.getLineItemCount("item");
      var IteArray = new Array();
      for ( var i = 1 ; i<= itemCount  ; i++)
      {
        var itemType = POObj.getLineItemValue("item","itemtype",i);
        var isLooseDiamond='F';
        if(itemType == "InvtPart")
        {
          var CategoryId = POObj.getLineItemValue("item","custcol_category",i);
          if(CategoryId=='7')
          {
            isLooseDiamond='T';
          }					
        } 
        var item = POObj.getLineItemValue("item","item",i);
        var item_name = POObj.getLineItemValue("item","item_display",i);
        var vendorCode = POObj.getLineItemValue("item","vendorname",i);
        var CodeVendor ='';

        if(vendorCode !='' && vendorCode != null)
        {
          CodeVendor= vendorCode;
        }
        var itemlink = POObj.getLineItemValue("item","custcolitem_link_display",i);
        if(itemlink=='' || itemlink==null)
        {
          itemlink=""; // not accepting null
        }
        var itemDesc=POObj.getLineItemValue("item","description",i);
        if(itemDesc=='' || itemDesc==null)
        {
          itemDesc=""; // not accepting null
        }
        var itemNotes=POObj.getLineItemValue("item","custcol5",i);

        if(itemNotes=='' || itemNotes==null)
        {
          itemNotes="";
        }
        var certificate_included = POObj.getLineItemValue("item","custcol28",i);
        if(certificate_included =='' || certificate_included ==null)
        {
          certificate_included = null;
        }
        var itemInsVal=POObj.getLineItemValue("item","custcol_full_insurance_value",i);
        if(itemInsVal=='' || itemInsVal==null)
        {
          itemInsVal=0;
        }
        var dt_sentFrom_sf=POObj.getLineItemValue("item","custcol18",i);
        if(dt_sentFrom_sf == '' || dt_sentFrom_sf == null)// Added by ajay
        {
          dt_sentFrom_sf = null;
        }
        var ObjItem = {
          "item_id" :parseInt(item), 
          //"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
          "item": (vendorCode=='' && vendorCode==null) ? item_name : item_name,
          "vendor_sku" : (vendorCode !='' && vendorCode != null) ? CodeVendor : CodeVendor,							
          "description" : itemDesc,
          "description" : itemDesc,
          "notes" : itemNotes,
          "insurance_value" : itemInsVal,
          "itemlink" : itemlink ,
          "date_sent_from_sf" : dt_sentFrom_sf, 
          "loose_diamond" : isLooseDiamond,
          "certificate_included" : certificate_included,
          "line_id" : POObj.getLineItemValue("item","line",i)
        };

        if(parseInt(item) != 4204513)
        {
          IteArray.push(ObjItem);
        }								
      }			
      var SOID = POObj.getFieldValue('createdfrom');
      var drop_ship_checklist = Drop_Ship_Data(SOID);
      drop_ship_checklist = Check_Drop_Ship(promo_item, drop_ship_checklist);

      var PoStatus = POObj.getFieldValues('custbody_portal_status'); 
      var PortalStatus = GetPOStatusValue(IteArray, PoStatus);
      var objJSON = {
        "po_id" : poId,
        "portal_status":PortalStatus, 
        "transaction_id" :transid,
        "items" :IteArray,
        "ship_date": custbody_ship_date1, 
        "diamond_eta" : custbody146,
        "drop_ship" : custbody39,
        "cad_due_date" : custbody116, 
        "date_shipped_from_vendor" : custbody209, 
        "delivery_date" : custbody6, 
        "to_be_watched" : custbody129, 
        "so_notes" : custbody58,
        "pro_vendor" :  parseInt(VendorId),
        "wait_cad" : custbody41,
        "certificate_status" : certificate_status,
        "on_vendor_portal" : true,
        "approved_to_grow_confirmation" : approved_to_grow_confirmation,
        "internal_cad_file_name" : cad_file_name,
        "promo_item" : promo_item, //added by ajay 21Nov 2016
        "drop_ship_checklist" : drop_ship_checklist,  //Added by Yagya 19 May 2016
        "script_id" : scriptId,
        "drop_ship_eligible" : drop_ship_eligible,
        "updated_datetime_on_ns" : updated_datetime_on_ns
      }; 

      //Setting up URL of CDP	
      var url = "https://testportal.brilliantearth.com/api/production/po/";      //for sandbox
     // var url = "https://partner.brilliantearth.com/api/production/po/";       //for production

      //Setting up Headers 
      var headers = new Array(); 
      headers['http'] = '1.1';    
      headers['Accept'] = 'application/json';       								
      headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //for sandbox
      //headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; //for production
      headers['Content-Type'] = 'application/json'; 
      headers['User-Agent-x'] = 'SuiteScript-Call';

      //Stringifying JSON
      var myJSONText = JSON.stringify(objJSON, replacer); 
      nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
      var response = nlapiRequestURL(url, myJSONText, headers); 
      nlapiLogExecution('debug','PO Response Body as Portal Output: #'+poId, response.body);
      //Below is being used to put a breakpoint in the debugger	

      if(response.code==200)
      {
        var responsebody = JSON.parse(response.getBody());
        var portalStatus = responsebody["portal_status"];
        var poUrl = "https://testportal.brilliantearth.com"+responsebody["po_url"]; //for sandbox
       // var poUrl = "https://partner.brilliantearth.com"+responsebody["po_url"]; //for production				
        ResPO = [portalStatus,'T','T',poUrl,promo_item];			
      }
      else
      {			
        nlapiLogExecution("debug","Portal response # "+poId,response.body);		
      }// end check of response.code                       
    }
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal is : ",err.message); 		
  }
  return ResPO;
}

function PushRevisedPODataNSToPortal(poId,promo_item,scriptId)
{
  try
  {
    var ResPO = [];
    nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId , poId);	
    if((poId!='' && poId!=null))
    { 
      var POObj = nlapiLoadRecord("purchaseorder",poId);
      var revisedCount =  1;
      //Added by Ajay 25Oct 2016
      if(POObj.getFieldValue("custbody_revise_count") != "" && POObj.getFieldValue("custbody_revise_count") != null )
      {
        revisedCount =  parseInt(POObj.getFieldValue("custbody_revise_count"));
      }
      nlapiLogExecution('debug','Initial Revised Count value is :',revisedCount);
      //Ended by Ajay

      var AddFees = POObj.getFieldValue('custbody_addional_fee_check');


      var transid=POObj.getFieldValue('tranid') ;
      var custbody_ship_date1 = POObj.getFieldValue('custbody_po_ship_date'); //NEW NS DATE FIELD TBD
      if(custbody_ship_date1 == '' || custbody_ship_date1 == null) // added by ajay(ship date)
      {				   
        custbody_ship_date1 = nlapiDateToString(new Date());
      }
      var custbody146=POObj.getFieldValue('custbody146');// Diamond ETA   
      if(custbody146=='' || custbody146==null)
      {				   
        custbody146=null;
      }
      var custbody39= POObj.getFieldValue('custbody39')  ;   // DROP SHIP MATERIALS SENT TO VENDOR
      if(custbody39=='' || custbody39==null)
      {
        custbody39='F';
      }
      else
      {
        custbody39='T';
      }
      var custbody116=POObj.getFieldValue('custbody116'); // CAD OR WAX DUE DATE
      if(custbody116=='' || custbody116==null)
      {				   
        custbody116=null;
      }
      var custbody209 = POObj.getFieldValue('custbody209');  //  Date shippend from vendor
      if(custbody209=='' || custbody209==null)
      {				   
        custbody209=null;
      }
      var custbody6=POObj.getFieldValue('custbody6'); // DELIVERY DATE
      if(custbody6 == '' || custbody6 == null)
      {
        custbody6 = nlapiDateToString(new Date());
      }
      var custbody129 = POObj.getFieldValue('custbody129'); //   TO BE WATCHED
      var custbody58=POObj.getFieldValue('custbody58'); //  Important Notes/ SO Notes
      if(custbody58=='' || custbody58==null)
      {
        custbody58="";
      }
      var custbody41 =  POObj.getFieldValue('custbody41'); //  DESIGN APPROVAL STATUS
      var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
      var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS			   
      var custbody_ns_link = POObj.getFieldText('custbody_ns_link');

      if(custbody_ns_link=='' || custbody_ns_link==null)
      {
        custbody_ns_link="";
      }
      var certificate_status = POObj.getFieldValue('custbodycertificate_status'); // CERTIFICATE STATUS
      if(certificate_status=='' || certificate_status==null)
      {
        certificate_status=null;
      }
      //Added new code by ajay 13Sept 2016
      var cad_file_name = POObj.getFieldValue('custbodycustbody_internal_cad_file_nam');
      if(cad_file_name == null || cad_file_name == '')
      {
        cad_file_name = null;
      }
      //Added new code by ajay 07Sept 2016
      var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
      if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
      {
        approved_to_grow_confirmation = null;
      }
      // [PP-348]
      var drop_ship_eligible =  POObj.getFieldText('custbody_drop_ship_eligible');
      if(drop_ship_eligible == "Yes")
        drop_ship_eligible ="yes";
      else if(drop_ship_eligible =="No")
        drop_ship_eligible ="no";
      else if(drop_ship_eligible=="N/A")
        drop_ship_eligible="na";

      //PP-336
      var updated_datetime_on_ns = POObj.getFieldValue('custbody_updated_datetime_on_ns');
      var VendorId = POObj.getFieldValue('entity');
      var itemCount  = POObj.getLineItemCount("item");
      var IteArray = new Array();
      for ( var i = 1 ; i<= itemCount  ; i++)
      {
        var itemType = POObj.getLineItemValue("item","itemtype",i);
        var isLooseDiamond='F';
        if(itemType == "InvtPart")
        {
          var CategoryId = POObj.getLineItemValue("item","custcol_category",i);
          if(CategoryId=='7')
          {
            isLooseDiamond='T';
          }					
        } 
        var item = POObj.getLineItemValue("item","item",i);
        var item_name = POObj.getLineItemValue("item","item_display",i);
        var vendorCode = POObj.getLineItemValue("item","vendorname",i);
        var CodeVendor ='';
        // Added by Rahul Panchal as per PP-184 on dated 16 Nov 2016
        if(vendorCode !='' && vendorCode != null)
        {
          CodeVendor= vendorCode;
        }
        var itemlink = POObj.getLineItemValue("item","custcolitem_link_display",i);
        if(itemlink=='' || itemlink==null)
        {
          itemlink=""; // not accepting null
        }
        var itemDesc=POObj.getLineItemValue("item","description",i);
        if(itemDesc=='' || itemDesc==null)
        {
          itemDesc=""; // not accepting null
        }
        var itemNotes=POObj.getLineItemValue("item","custcol5",i);
        nlapiLogExecution("debug","item notes is : ",itemNotes);
        if(itemNotes=='' || itemNotes==null)
        {
          itemNotes="";
        }
        var certificate_included = POObj.getLineItemValue("item","custcol28",i);
        if(certificate_included =='' || certificate_included ==null)
        {
          certificate_included = null;
        }
        var itemInsVal=POObj.getLineItemValue("item","custcol_full_insurance_value",i);
        if(itemInsVal=='' || itemInsVal==null)
        {
          itemInsVal=0;
        }
        var dt_sentFrom_sf=POObj.getLineItemValue("item","custcol18",i);
        if(dt_sentFrom_sf == '' || dt_sentFrom_sf == null)// Added by ajay
        {					
          dt_sentFrom_sf = null;
        }
        var ObjItem = {
          "item_id" :parseInt(item), 
          //"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
          "item": (vendorCode=='' && vendorCode==null) ? item_name : item_name,
          "vendor_sku" : (vendorCode !='' && vendorCode != null) ? CodeVendor : CodeVendor,
          "description" : itemDesc,
          "notes" : itemNotes,
          "insurance_value" : itemInsVal,
          "itemlink" : itemlink ,
          "date_sent_from_sf" : dt_sentFrom_sf, 
          "loose_diamond" : isLooseDiamond,
          "certificate_included" : certificate_included,
          "line_id" : POObj.getLineItemValue("item","line",i)
        };

        if(parseInt(item) != 4204513)
        {
          IteArray.push(ObjItem);
        }				
      }
      var SOID = POObj.getFieldValue('createdfrom');
      var drop_ship_checklist = Drop_Ship_Data(SOID);
      drop_ship_checklist = Check_Drop_Ship(promo_item, drop_ship_checklist);

      var PoStatus = POObj.getFieldValues('custbody_portal_status'); 
      var PortalStatus = GetPOStatusValue(IteArray, PoStatus);
      var objJSON =  {
        "po_id" : poId,
        "portal_status":PortalStatus, 
        "transaction_id" :transid,
        "items" :IteArray,
        "ship_date": custbody_ship_date1, 
        "diamond_eta" : custbody146,
        "drop_ship" : custbody39,
        "cad_due_date" : custbody116, 
        "date_shipped_from_vendor" : custbody209, 
        "delivery_date" : custbody6, 
        "to_be_watched" : custbody129, 
        "so_notes" : custbody58,
        'ns_link' : custbody_ns_link, 
        "pro_vendor" :  parseInt(VendorId),
        "wait_cad" : custbody41,
        "certificate_status" : certificate_status,
        "approved_to_grow_confirmation" : approved_to_grow_confirmation,
        "internal_cad_file_name" : cad_file_name,
        "revise_count" : revisedCount,
        "promo_item" : promo_item, //added by ajay 21Nov 2016
        "drop_ship_checklist" : drop_ship_checklist,  //Added by Yagya 19 May 2016
        "script_id" : scriptId,
        "drop_ship_eligible" : drop_ship_eligible,
        "updated_datetime_on_ns" : updated_datetime_on_ns
      }; 

      //Setting up URL of CDP  
      var url = "https://testportal.brilliantearth.com/api/production/revised-po/"; //for sandbox
     // var url = "https://partner.brilliantearth.com/api/production/revised-po/"; //for production

      //Setting up Headers 
      var headers = new Array(); 
      headers['http'] = '1.1';    
      headers['Accept'] = 'application/json';
      headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //for sandbox
     //headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; //for production
      headers['Content-Type'] = 'application/json'; 
      headers['User-Agent-x'] = 'SuiteScript-Call';

      //Stringifying JSON
      var myJSONText = JSON.stringify(objJSON, replacer); 
      nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
      var response = nlapiRequestURL(url, myJSONText, headers); 
      nlapiLogExecution('debug','PO Response Body as Portal Output: #'+poId, response.body);
      //Below is being used to put a breakpoint in the debugger					  
      if(response.code==200)
      {
        var responsebody = JSON.parse(response.getBody());
        var portalStatus = responsebody["portal_status"];
        var poUrl = "https://testportal.brilliantearth.com"+responsebody["po_url"]; //for sandbox
       //var poUrl = "https://partner.brilliantearth.com"+responsebody["po_url"]; //for production

        ResPO = [portalStatus,'T',poUrl,promo_item];
      }
      else
      {				
        nlapiLogExecution("debug",response.body);
      }// end check of response.code			
    }
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error occur during PO ID Push from NS to portal is : ",err.message);         
  }
}

//Added new logic for checking itemlink column field
function GetPOStatusValue(IteArray, PoStatus)
{
  var myArr = [];
  var itemLnkMatch = 0;   
  if(IteArray.length > 0)
  {
    for(var i=0; i<IteArray.length; i++)
    {
      if(IteArray[i].itemlink != "" && IteArray[i].itemlink != null)
      {
        itemLnkMatch = 1;
        break;
      }
    }
  }  
  nlapiLogExecution("debug","PoStatus  #",JSON.stringify(PoStatus)); 
  if(PoStatus )
  {			
    for(var i=0; i< PoStatus.length; i++)
    {				
      if(itemLnkMatch == 0 && (PoStatus[i] == "12" || PoStatus[i] == 12))
      {

      }
      else
      {
        myArr.push(PoStatus[i]);					
      }
    }
  }	
  return "["+myArr.join(',')+"]";
}
function Drop_Ship_Data(SOID)
{
  var drop_ship =[];
  try
  {
    if(SOID != null && SOID != '')
    {
      var ItemsShippingSeparately = nlapiLookupField("salesorder",SOID,"custbody304");
      if(ItemsShippingSeparately != ''&& ItemsShippingSeparately != null)
      {
        var ItemsShippingSeparatelyArr = ItemsShippingSeparately.split(',');
        if(ItemsShippingSeparatelyArr.indexOf('8') != -1 || ItemsShippingSeparatelyArr.indexOf(8) != -1)
        {
          drop_ship.push('Cert Kept for Drop Ship');
        }
        if(ItemsShippingSeparatelyArr.indexOf('2') != -1 || ItemsShippingSeparatelyArr.indexOf(2) != -1 || ItemsShippingSeparatelyArr.indexOf('9') != -1 || ItemsShippingSeparatelyArr.indexOf(9) != -1)
        {
          drop_ship.push('BE to Send Materials Separately');
        }
        else
        {
          drop_ship.push('Materials');
        }	
      }
      else
      {
        drop_ship.push('Materials');
      }
    }
  }
  catch(ed)
  {
    nlapiLogExecution("debug","Error Drop_Ship_Data function : ",ed.message); 
  }
  nlapiLogExecution("debug","Drop_Ship_Data for  #"+SOID,JSON.stringify(drop_ship)); 
  return drop_ship.join('|');
}
function Check_Drop_Ship(promo_item, drop_ship_checklist)
{
  promo_item = promo_item.split("|");
  drop_ship_checklist = drop_ship_checklist.split("|");

  for(var g=0; g < promo_item.length; g++)
  {
    var curr_promo_item = promo_item[g];
    var index = drop_ship_checklist.indexOf(curr_promo_item);
    if (index > -1) 
    {
      drop_ship_checklist.splice(index, 1);
    }	
  }
  drop_ship_checklist = drop_ship_checklist.join('|');
  return drop_ship_checklist;
}
function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}

//Rescheduling Concept
function RescheduleScript()
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
}