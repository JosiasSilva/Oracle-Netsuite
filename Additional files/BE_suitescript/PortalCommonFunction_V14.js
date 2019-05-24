function PushPOToPortal(poId,scriptId)
{
  try
  {
    var obj = new Object();
    //nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId);	

    if(poId!='' && poId!=null)
    {
      nlapiSubmitField("purchaseorder",poId,"custbody_ns_link",poId);
      var POObj = nlapiLoadRecord("purchaseorder",poId);
      var AddFees = POObj.getFieldValue('custbody_addional_fee_check');
      //var PoStatus = nlapiLookupField("purchaseorder",poId,'custbody_portal_status'); 
      //nlapiLogExecution("debug","portal status is :"+PoStatus);
      var PoStatus = POObj.getFieldValue('custbody_portal_status'); 
      if(PoStatus != null)
        PoStatus = PoStatus.replace(/\u0005/g,',');
      nlapiLogExecution("debug","Portal Status is :" , PoStatus);
      
      var PortalStatus;
      if(PoStatus == null || String(PoStatus).length == 0){
        PortalStatus = '[]';
        //nlapiLogExecution("debug","Portal status value is :",PortalStatus);
      }
      else
        PortalStatus = '[' +  PoStatus + ']';

      //Added by ajay 30Dec 2016
      var cad_approval_date = POObj.getFieldValue("custbody_cad_approval_date");
      //nlapiLogExecution("debug","initial cad approval date is :",cad_approval_date);
      //nlapiLogExecution('debug','Initial portal status value is :',PoStatus);
      if(PoStatus != null && PoStatus != "")
      {
        if(PoStatus.indexOf('11') != -1)
        {
          if(cad_approval_date == null || cad_approval_date == "")
          {
            nlapiSubmitField("purchaseorder",poId,"custbody_cad_approval_date",nlapiDateToString(new Date()));
          }
        }
        else
        {
          nlapiSubmitField("purchaseorder",poId,"custbody_cad_approval_date",null);
        }
      }
      else
      {
        nlapiSubmitField("purchaseorder",poId,"custbody_cad_approval_date",null);
      }
      cad_approval_date = nlapiLookupField("purchaseorder",poId,"custbody_cad_approval_date");
      if(cad_approval_date == null || cad_approval_date == "")
      {
        cad_approval_date = null;
      }
      //nlapiLogExecution("debug","updated cad approval date is :",cad_approval_date);
      //Ended by ajay 30Dec 2016

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
      //Added by ajay 14April 2017 
      var date_emailed_to_vendor = POObj.getFieldValue('custbody367');  //  Date emailed to vendor
      if(date_emailed_to_vendor == '' || date_emailed_to_vendor == null)
      {
        date_emailed_to_vendor = null;
      }
      //Ended by ajay
      var date_needed_in_sf = POObj.getFieldValue('custbody59');  //  Date needed in sf
      if(date_needed_in_sf == '' || date_needed_in_sf == null)
      {
        date_needed_in_sf = null;
      }
      var due_by_date_firm = POObj.getFieldValue('custbody81');  //  Due by date firm

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
      var approval_to_grow_confirmation ='';
      var custbody41 =  POObj.getFieldValue('custbody41'); //  DESIGN APPROVAL STATUS
      nlapiLogExecution("Debug","DESIGN APPROVAL STATUS",custbody41);
      if(custbody41==7)
        approval_to_grow_confirmation = false;
      nlapiLogExecution("Debug","Approval to Grow Confirmation",approval_to_grow_confirmation);
      var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
      var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS

      var certificate_status = POObj.getFieldValue('custbodycertificate_status'); // CERTIFICATE STATUS
      if(certificate_status=='' || certificate_status==null)
      {
        certificate_status=null;
      }
      //Added new code by ajay 23Sept 2016
      var cad_file_name = POObj.getFieldValue('custbody_internal_cad_file_name');
      if(cad_file_name == null || cad_file_name == '')
      {
        cad_file_name = null;
      }
      //Added new code by ajay 23Sept 2016
      var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
      if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
      {
        approved_to_grow_confirmation = null;
      }
      //Ended by ajay
      //Added by ajay 01Dec 2016
      var  promo_item = nlapiLookupField("purchaseorder",poId,"custbody_drop_ship_promo_item");
      //Ended by ajay 01Dec 2016
      //Added by ajay 25Jan 2017
      var tranid = "";
      var soId = nlapiLookupField("purchaseorder",poId,"createdfrom");
      if(soId != null && soId != "")
      {
        tranid = nlapiLookupField("salesorder",soId,"tranid");
      }
      //Ended by ajay 25Jan 2017

      //Added by ajay 28Feb 2017
      var ddFirm = POObj.getFieldValue('custbody82');
      //Ended 28Feb 2017

      //Added by Ravi 28Feb 2017
      var revisednotes = POObj.getFieldValue('custbody358');
      //Ended 28Feb 2017

      //Added for [PP-315]
      var be_engraving_status = POObj.getFieldValue('custbody348');
      nlapiLogExecution('DEBUG','PO Be Engraving Status Value:', be_engraving_status);
      //Added for [PP-317]
      var dd_push_reason =  POObj.getFieldValue('custbody251');
      nlapiLogExecution('DEBUG','PO DD Push Reason:', dd_push_reason);
      if(dd_push_reason !=null && dd_push_reason !='')
      {
        dd_push_reason = dd_push_reason.replace(/\u0005/g,',');
        nlapiLogExecution('DEBUG','PO DD Push Reason after replacing unicode:', dd_push_reason);
        dd_push_reason = '[' +  dd_push_reason + ']';
        nlapiLogExecution('DEBUG','PO DD Push Reason after adding [](Test 1):', dd_push_reason);
      }
      else
      {
        dd_push_reason = '[' +  dd_push_reason + ']';
        nlapiLogExecution('DEBUG','PO DD Push Reason after adding [](Test 2):', dd_push_reason);
      }
      // [PP-342]
      var pickup_location = POObj.getFieldText('custbody_pickup_location');
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
	  
	  var escalated_po  = POObj.getFieldValue('custbody_escalated_po'); // added by ZAG : 03/04/2019 : PP 373
	  
      var onVendorPortal = POObj.getFieldValue('custbody_on_vendor_portal');
      var VendorId = POObj.getFieldValue('entity');
      var itemCount  = POObj.getLineItemCount("item");
      var IteArray = new Array();
      var CategoryId ;
      for ( var i = 1 ; i<= itemCount  ; i++)
      {
        var itemType = POObj.getLineItemValue("item","itemtype",i);
        var isLooseDiamond='F';
        if(itemType == "InvtPart")
        {
          var invItemId = POObj.getLineItemValue("item","item",i);
          CategoryId =  nlapiLookupField("inventoryitem",invItemId,"custitem20");
          if(CategoryId=='7')
          {
            isLooseDiamond='T';
          }
        }
        var item = POObj.getLineItemValue("item","item",i);
        var item_name = POObj.getLineItemValue("item","item_display",i);
        var vendorCode = POObj.getLineItemValue("item","vendorname",i);
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

        //Added by ajay 30Dec 2016
        var mold_so = POObj.getLineItemValue("item","custcol_molds_so",i);
        if(mold_so == '' || mold_so == null)
        {
          mold_so = "";
        }
        var quantity = POObj.getLineItemValue("item","quantity",i);
        if(quantity == '' || quantity == null)
        {
          quantity = "";
        }
        //Ended by ajay 30Dec 2016
        //Added by Ravi on 22/03/2017
        var itemSku= POObj.getLineItemValue("item","custcol_item_sku",i);
        if(itemSku == '' || itemSku == null)
        {
          itemSku = "";
        }
        //Ended  

        var ObjItem = {
          "item_id" :parseInt(item), 
          "item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
          "description" : itemDesc,
          "notes" : itemNotes,
          "insurance_value" : itemInsVal,
          "itemlink" : itemlink ,
          "date_sent_from_sf" : dt_sentFrom_sf, 
          "loose_diamond" : isLooseDiamond,
          "certificate_included" : certificate_included,
          "mold_so" : mold_so, //new added by ajay 30Dec 2016
          "quantity" : quantity,
          "line_id" : i,
          "vendor_sku" : itemSku //Added by Ravi on 22/03/2017		 
        };

        //Added by ajay 27Sept 2016				
        if(parseInt(item) != 4204513)
        {
          IteArray.push(ObjItem);
        }				
        //Ended
      }

	  //Start : ZAG : 03/27/2019 : NS-1486

	var NS_url = 'https://666639-sb1.app.netsuite.com';
	if(nlapiGetContext().getEnvironment()=='PRODUCTION')
		NS_url = 'https://system.na3.netsuite.com';

	  var fileId = POObj.getFieldValue('custbody345'); // Internal CAD Image
      var Internal_CAD_image_url = '';
      if(fileId){
        var objFile = nlapiLoadFile(fileId);
        var fileName = objFile.name; 
        Internal_CAD_image_url = objFile.getURL();
         if(Internal_CAD_image_url && fileName){
          Internal_CAD_image_url = NS_url+Internal_CAD_image_url+'|'+fileName;
          //nlapiLogExecution('debug','Internal_CAD_image_url',Internal_CAD_image_url);
        }
      }
	  
	  var fileId = POObj.getFieldValue('custbody195'); // CAD Image1
      var CAD_image1_url = '';
      if(fileId){
        var objFile = nlapiLoadFile(fileId);
        var fileName = objFile.name; 
        CAD_image1_url = objFile.getURL();
         if(CAD_image1_url && fileName){
          CAD_image1_url = NS_url+CAD_image1_url+'|'+fileName;
          //nlapiLogExecution('debug','CAD_image1_url',CAD_image1_url);
        }
      }
	  
	  var fileId = POObj.getFieldValue('custbody197'); // CAD Image2
      var CAD_image2_url = '';
      if(fileId){
        var objFile = nlapiLoadFile(fileId);
        var fileName = objFile.name; 
        CAD_image2_url = objFile.getURL();
         if(CAD_image2_url && fileName){
          CAD_image2_url = NS_url+CAD_image2_url+'|'+fileName;
          //nlapiLogExecution('debug','CAD_image2_url',CAD_image2_url);
        }
      }
	  
	  var fileId = POObj.getFieldValue('custbody198'); // CAD Image3
      var CAD_image3_url = '';
      if(fileId){
        var objFile = nlapiLoadFile(fileId);
        var fileName = objFile.name; 
        CAD_image3_url = objFile.getURL();
         if(CAD_image3_url && fileName){
          CAD_image3_url = NS_url+CAD_image3_url+'|'+fileName;
          //nlapiLogExecution('debug','CAD_image3_url',CAD_image3_url);
        }
      }
	  
	  //Start : ZAG : 03/27/2019 : NS-1486
	  
	        /************************ Added by Yagya on 26/10/2017 for PP-293 ***************/
      var file_id = POObj.getFieldValue('custbody_fedex_shipping_label');
      var file_url = '';
      if(file_id)		
      {
        var file_obj = nlapiLoadFile(file_id);
        var name = file_obj.name; 
        var isOnline = file_obj.isOnline();
        file_url = file_obj.getURL();
        if(!isOnline)
        {
          file_obj.setIsOnline(true);
          nlapiSubmitFile(file_obj ,true,true);
        }
        if(file_url && name)
        {
          //file_url = 'https://666639-sb1.app.netsuite.com'+file_url+'|'+name; // ZAG
		  file_url = NS_url+file_url+'|'+name; // ZAG
          nlapiLogExecution('debug','file_url',file_url);
        }
      }
      /************************ End by Yagya on 26/10/2017 for PP-293 ***************/
	  
      var objJSON = 
          {
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
            "on_vendor_portal" : "T",                                       
            "approved_to_grow_confirmation" : approved_to_grow_confirmation,
            "internal_cad_file_name" : cad_file_name,
            "promo_item" : promo_item, //added by ajay 01Dec 2016
            "cad_approval_date"	: cad_approval_date, //Added by ajay 30Dec 2016
            "tranid" :	tranid, //Added by ajay 25Jan 2017
            "dd_firm" :	ddFirm, //Added 28Feb 2017
            "revised_notes"	:	revisednotes, //Added 28Feb 2017
            "date_emailed_to_vendor" : date_emailed_to_vendor,
            "date_needed_in_sf": date_needed_in_sf,
            "due_by_date_firm": due_by_date_firm,
            "so_id" : soId , //Added by Ravi on 11May 2017
            "attachment_url" : file_url, //Added by Yagya on 26/10/2017 for PP-293
            "be_engraving_status" : be_engraving_status,
            "dd_push_reason" : dd_push_reason,
            "approval_to_grow_confirmation":approval_to_grow_confirmation,
            "pickup_location" : pickup_location,
            "drop_ship_eligible" : drop_ship_eligible,
            "script_id" : scriptId,
            "updated_datetime_on_ns" : updated_datetime_on_ns,
			"escalated_po" : escalated_po, // added by ZAG : 03/04/2019 : PP 373
			"internal_cad_image_url" : Internal_CAD_image_url, // added by ZAG : 03/17/2019 : NS 1486
			"cad_image1_url" : CAD_image1_url, // added by ZAG : 03/17/2019 : NS 1486
			"cad_image2_url" : CAD_image2_url, // added by ZAG : 03/17/2019 : NS 1486
			"cad_image3_url" : CAD_image3_url // added by ZAG : 03/17/2019 : NS 1486
          };
    }
    //Setting up URL of CDP
    //var url = "https://partner.brilliantearth.com/api/production/po/";
	var url = "https://testportal.brilliantearth.com/api/production/po/";
    //Setting up Headers 
    var headers = new Array();
    headers['http'] = '1.1';
    headers['Accept'] = 'application/json';
    //headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // prod
	headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; // sandbox
    headers['Content-Type'] = 'application/json';
    headers['User-Agent-x'] = 'SuiteScript-Call';

    //Stringifying JSON
    var myJSONText = JSON.stringify(objJSON, replacer);
    nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);
    var response = nlapiRequestURL(url, myJSONText, headers);
    nlapiLogExecution('debug','PO Response Body as Portal Output:', response.body);
    //nlapiLogExecution('debug','PO Response Code as Portal Output -:', response.code);
    //Below is being used to put a breakpoint in the debugger

    if(response.code==200)
    {
      var responsebody = JSON.parse(response.getBody());
      var portalStatus = responsebody["portal_status"];
      //var poUrl = "https://partner.brilliantearth.com"+responsebody["po_url"]; 
      var poUrl = "https://testportal.brilliantearth.com"+responsebody["po_url"];
      nlapiLogExecution("debug", "PO successfully pushed to Portal.");
      try{
        nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushtoportal','custbody_on_vendor_portal','custbody_po_portal_url','custbody369'],[portalStatus,'T','T',poUrl,"933"]);
        obj = {
          "status" : "OK",
          "message": "Successfully Updated Purchase Order"
        }
        //nlapiLogExecution("debug","JSON Response output is :",JSON.stringify(obj));
        return JSON.stringify(obj);
      }
      catch(err)
      {
        obj = {
          "status" : "Fail",
          "message": err.message
        }
        //nlapiLogExecution("debug","JSON Response output is :",JSON.stringify(obj));
        return JSON.stringify(obj);
      }
    }
    else
    {
      obj = {
        "status" : "Fail",
        "message": response.body
      }
      //nlapiLogExecution("debug","JSON Response output is :",JSON.stringify(obj));
      return JSON.stringify(obj);	
    }
  }
  catch(err)
  {
    obj = 	{
      "status" : "Fail",
      "message": err.message
    }
    //nlapiLogExecution("debug","JSON Response output is :",JSON.stringify(obj));
    return JSON.stringify(obj);
  }
}

function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}
