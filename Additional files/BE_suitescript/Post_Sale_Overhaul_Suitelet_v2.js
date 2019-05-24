nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Post_Sale_Overhaul_Suitelet(request, response)
{
  try
  {
    var soId = request.getParameter('record');
    nlapiLogExecution('debug','SO Id:',soId);
    var backdataUrl = request.getParameter('backdata');
    nlapiLogExecution('debug','backdataUrl variable value:',backdataUrl);
    var form = nlapiCreateForm('Create Post-Sale');
    form.addField('custpage_so','text').setDisplayType('hidden').setDefaultValue(soId);
    if(request.getMethod() == 'GET')
    {
      if(backdataUrl == "false")
      {
        nlapiLogExecution('debug','Get Method:',request.getMethod());
        form.setScript('customscript_chkpostsaleoverhaul');
        // add a select field and then add the select options that will appear in the dropdown
        var select = form.addField('selectfield', 'select', 'Type of Post-Sale');
        select.addSelectOption('0','Please select type of post-sale');
        select.addSelectOption('1','Repair');
        select.addSelectOption('2','Resize');
        select.addSelectOption('3','Exchange');
        select.addSelectOption('4','Setting to be added');
        select.addSelectOption('5','Engrave');
        select.addSelectOption('6','Upgrade');
        select.addSelectOption('7','Matched Wedding Band');
		select.setLayoutType('outsideabove','startrow');
		
		//Shipping address
		var shipAddrGroup = form.addFieldGroup("shipaddress","Confrim address customer is shipping item(s) FROM");
		
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"is",soId));
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
		var cols = [];
		cols.push(new nlobjSearchColumn("shipaddress1"));
		cols.push(new nlobjSearchColumn("shipaddress2"));
		cols.push(new nlobjSearchColumn("shipcity"));
		cols.push(new nlobjSearchColumn("shipstate"));
		cols.push(new nlobjSearchColumn("shipzip"));
		cols.push(new nlobjSearchColumn("shipcountry"));
		cols.push(new nlobjSearchColumn("shipaddressee"));
		cols.push(new nlobjSearchColumn("shipattention"));
		cols.push(new nlobjSearchColumn("custbody8"));
		var results = nlapiSearchRecord("salesorder",null,filters,cols);
		
		var fld = form.addField("custpage_country","select","Country","country","shipaddress");
		
		var countries = getCountry();
		for(var x=0; x < countries.length; x++)
		{
			fld.addSelectOption(countries[x].value,countries[x].text,false);
		}
		
		fld.setMandatory(true);
		if(results)
			fld.setDefaultValue(results[0].getValue("shipcountry"));
		
		fld = form.addField("custpage_attention","text","Attention",null,"shipaddress");
		if(results)
			fld.setDefaultValue(results[0].getValue("shipattention"));
		fld = form.addField("custpage_addressee","text","Addressee",null,"shipaddress");
		if(results)
			fld.setDefaultValue(results[0].getValue("shipaddressee"));
		fld = form.addField("custpage_addr1","text","Address Line 1",null,"shipaddress");
		if(results)
			fld.setDefaultValue(results[0].getValue("shipaddress1"));
		fld.setMandatory(true);
		fld = form.addField("custpage_addr2","text","Address Line 2",null,"shipaddress");
		if(results)
			fld.setDefaultValue(results[0].getValue("shipaddress2"));
		fld = form.addField("custpage_city","text","City",null,"shipaddress");
		if(results)
			fld.setDefaultValue(results[0].getValue("shipcity"));
		fld.setMandatory(true);
		
		fld = form.addField("custpage_state","text","State",null,"shipaddress");
		if(results)
			fld.setDefaultValue(results[0].getValue("shipstate"));
		
		fld = form.addField("custpage_zip","text","Zip Code",null,"shipaddress");
		if(results)
			fld.setDefaultValue(results[0].getValue("shipzip"));
		fld.setMandatory(true);
		
		fld = form.addField("custpage_phone","text","Phone",null,"shipaddress");
		if(results)
			fld.setDefaultValue(results[0].getValue("custbody8"));
		fld.setMandatory(true);
		
        form.addSubmitButton('Next');
        form.addButton('custpage_close', 'Close', "window.close();" );
        response.writePage(form);
      }
      if(backdataUrl=="true")
      {
        //postSaleType
        nlapiLogExecution('debug','Method for back data url:',request.getMethod());
        nlapiLogExecution('debug','SO Id  for back data url:',soId);
        if(soId !=null && soId !='')
        {
          var soRec = nlapiLoadRecord("salesorder",soId);
          var typeOfPostSaleValue =request.getParameter("postSaleType");
          nlapiLogExecution('Debug','Post Sale Type for back data url :',typeOfPostSaleValue);
          if(typeOfPostSaleValue=='1')// 1 for repair
          {
            Repair_Landing_Page(soRec,soId);
          }
          else if(typeOfPostSaleValue=='2')// 2 for resize
          {
            Resize_Landing_Page(soRec,soId);
          }
          else if(typeOfPostSaleValue=='3')// 3 for exchange 
          {
            Exchange_Landing_Page(soRec,soId);
          }
          else if(typeOfPostSaleValue=='4')// 4 for set
          {
            Set_Landing_Page(soRec,soId);
          }
          else if(typeOfPostSaleValue=='5')// 5 for engrave
          {
            Engrave_Landing_Page(soRec,soId);
          }
          else if(typeOfPostSaleValue=='6')// 6 for upgrade
          {
            Upgrade_Landing_Page(soRec,soId);
          }
          else if(typeOfPostSaleValue=='7')// 7 for Matched Wedding Band
          {
            Matched_Wedding_Band_Landing_Page(soRec,soId);
          }
        }
      }
    }
    else if(request.getMethod() == 'POST')
    {
      nlapiLogExecution('debug','Check Method:',request.getMethod());
      var soId = request.getParameter('custpage_so');
      //nlapiLogExecution('debug','POST soId:',soId);
      if(soId !=null && soId !='')
      {
        nlapiLogExecution('debug','SO Id post :',soId);
        //nlapiLogExecution('debug','type',type);
        var soRec = nlapiLoadRecord("salesorder",soId);
		
		//Check if user changed the Ship Country
		if(request.getParameter("custpage_country")!=soRec.getFieldValue("shipcountry"))
		{
			//Set Status of International Taxes to 'Ops to confirm taxes'
			nlapiSubmitField("salesorder",soId,"custbodystatus_of_international_taxes","1");
		}
		else
		{
			//Otherwise, set to N/A
			nlapiSubmitField("salesorder",soId,"custbodystatus_of_international_taxes","5");
		}
		
		//Store address object for user
		var addressObject = {
			attention : request.getParameter("custpage_attention"),
			addressee : request.getParameter("custpage_addressee"),
			address1 : request.getParameter("custpage_addr1"),
			address2 : request.getParameter("custpage_addr2"),
			city : request.getParameter("custpage_city"),
			state : request.getParameter("custpage_state"),
			zip : request.getParameter("custpage_zip"),
			country : request.getParameter("custpage_country"),
			phone : request.getParameter("custpage_phone")
		};
		
		nlapiLogExecution("debug","Address Object",JSON.stringify(addressObject));
		
		var ctx = nlapiGetContext();
		ctx.setSessionObject("addressObj",JSON.stringify(addressObject));
		
        var typeOfPostSaleValue =request.getParameter("selectfield");
		ctx.setSessionObject("postSaleType",typeOfPostSaleValue);
		
        if(typeOfPostSaleValue==1)// 1 for repair
        {
          Repair_Landing_Page(soRec,soId);
        }
        else if(typeOfPostSaleValue==2)// 2 for resize
        {
          Resize_Landing_Page(soRec,soId);
        }
        else if(typeOfPostSaleValue==3)// 3 for exchange 
        {
          Exchange_Landing_Page(soRec,soId);
        }
        else if(typeOfPostSaleValue==4)// 4 for set
        {
          Set_Landing_Page(soRec,soId);
        }
        else if(typeOfPostSaleValue==5)// 5 for engrave
        {
          Engrave_Landing_Page(soRec,soId);
        }
        else if(typeOfPostSaleValue==6)// 6 for upgrade
        {
          Upgrade_Landing_Page(soRec,soId);
        }
        else if(typeOfPostSaleValue==7)// 7 for Matched Wedding Band
        {
          Matched_Wedding_Band_Landing_Page(soRec,soId);
        }
      }
      else
      {
        var ctx = nlapiGetContext();
		
		if(request.getParameter('custpage_repair_id')=='1') // Start Repair 
        {	
	      //Capture item sublist data
		  var items = [];
		  for(var x=0; x < request.getLineItemCount('custpage_items'); x++)
		  {
		  	if(request.getLineItemValue('custpage_items','sublist_shipping_to_be',x+1)=='T')
			{
				items.push({
					item : request.getLineItemValue('custpage_items','sublist_item',x+1),
					qty : request.getLineItemValue('custpage_items','sublist_qty',x+1),
					ins : request.getLineItemValue('custpage_items','sublist_production_ins_value',x+1),
					desc : request.getLineItemValue('custpage_items','sublist_desc',x+1)
				});
			}
		  }
		  
		  nlapiLogExecution("debug","Items Returned",JSON.stringify(items));
		  ctx.setSessionObject("itemsReturned",JSON.stringify(items));
		
          var dropOff = request.getParameter('custpage_drop_off');
          var returnLabelStatus =request.getParameter("custpage_return_label_status");
          nlapiLogExecution("Debug","Drop Off Value Repair",dropOff);
          nlapiLogExecution("Debug","Return Label Status Repair",returnLabelStatus);
          if(dropOff == '1')
          {
            //Step 1 :: display the so data on respective landing page 
            Repair_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && (returnLabelStatus =="1" || returnLabelStatus =="2" || returnLabelStatus =="3" || returnLabelStatus =="4" ))
          {
            Repair_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && returnLabelStatus =="5")
          {
            //Step :: 2 Review the information for final submission
            Repair_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus);
          }
          else 
          {
            //Step:: 3 Final step create return label and send email with attachments.
            Repair_Final_Create_Label_Send_Email(form);
          }
        } //END REPAIR
        else if(request.getParameter('custpage_resize_id')=='2')  // Start Resize  
        {
          //Capture item sublist data
		  var items = [];
		  for(var x=0; x < request.getLineItemCount('custpage_items'); x++)
		  {
		  	if(request.getLineItemValue('custpage_items','sublist_shipping_to_be',x+1)=='T')
			{
				items.push({
					item : request.getLineItemValue('custpage_items','sublist_item',x+1),
					qty : request.getLineItemValue('custpage_items','sublist_qty',x+1),
					ins : request.getLineItemValue('custpage_items','sublist_production_ins_value',x+1),
					desc : request.getLineItemValue('custpage_items','sublist_desc',x+1)
				});
			}
		  }
		  
		  nlapiLogExecution("debug","Items Returned",JSON.stringify(items));
		  ctx.setSessionObject("itemsReturned",JSON.stringify(items));
		  
		  var dropOff = request.getParameter('custpage_drop_off');
          var returnLabelStatus =request.getParameter("custpage_return_label_status");
          nlapiLogExecution("Debug","Drop Off Value Resize",dropOff);
          nlapiLogExecution("Debug","Return Label Status Resize",returnLabelStatus);
          if(dropOff == '1')
          {
            //Step 1 :: display the so data on respective landing page 
            Resize_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && (returnLabelStatus =="1" || returnLabelStatus =="2" || returnLabelStatus =="3" || returnLabelStatus =="4" ))
          {
            Resize_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && returnLabelStatus =="5")
          {
            //Step :: 2 Review the information for final submission
            Resize_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus);
          }
          else 
          {
            //Step:: 3 Final step create return label and send email with attachments.
            Resize_Final_Create_Label_Send_Email(form); 
          }
        }// END RESIZE
        else if(request.getParameter('custpage_exchange_id')=='3')//Start Exchange
        {
          //Capture item sublist data
		  var items = [];
		  for(var x=0; x < request.getLineItemCount('custpage_items_returning'); x++)
		  {
		  	if(request.getLineItemValue('custpage_items_returning','custpage_items_returning_check',x+1)!=null && request.getLineItemValue('custpage_items_returning','custpage_items_returning_check',x+1)!='')
			{
				items.push({
					item : request.getLineItemValue('custpage_items_returning','custpage_items_returning_item',x+1),
					qty : request.getLineItemValue('custpage_items_returning','custpage_items_returning_qty',x+1),
					ins : request.getLineItemValue('custpage_items_returning','custpage_items_returning_production_ins_value',x+1),
					desc : request.getLineItemValue('custpage_items_returning','custpage_items_returning_desc',x+1),
					option : request.getLineItemValue('custpage_items_returning','custpage_items_returning_check',x+1)
				});
			}
		  }
		  
		  nlapiLogExecution("debug","Items Returned",JSON.stringify(items));
		  ctx.setSessionObject("itemsReturned",JSON.stringify(items));
		  
		  var dropOff = request.getParameter("custpage_drop_off");
          var returnLabelStatus =request.getParameter("custpage_return_label_status");
          nlapiLogExecution("Debug","Drop Off Value Exchange",dropOff);
          nlapiLogExecution("Debug","Return Label Status Exchange",returnLabelStatus);
          if(dropOff == '1')
          {
            //Step 1 :: display the so data on respective landing page 
            Exchange_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && (returnLabelStatus =="1" || returnLabelStatus =="2" || returnLabelStatus =="3" || returnLabelStatus =="4" ))
          {
            Exchange_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && returnLabelStatus =="5")
          {       
            //Step :: 2 Review the information for final submission
            Exchange_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus);    
          }
          else 
          {
            //Step:: 3 Final step create return label and send email with attachments.
            Exchange_Final_Create_Label_Send_Email(form,dropOff);
          }
        }  //END EXCHANGE
        else if(request.getParameter('custpage_engrave_id')=='5') // Start Engrave  
        {
          //Capture item sublist data
		  var items = [];
		  for(var x=0; x < request.getLineItemCount('custpage_items'); x++)
		  {
		  	if(request.getLineItemValue('custpage_items','sublist_shipping_to_be',x+1)=='T')
			{
				items.push({
					item : request.getLineItemValue('custpage_items','sublist_item',x+1),
					qty : request.getLineItemValue('custpage_items','sublist_qty',x+1),
					ins : request.getLineItemValue('custpage_items','sublist_production_ins_value',x+1),
					desc : request.getLineItemValue('custpage_items','sublist_desc',x+1)
				});
			}
		  }
		  
		  nlapiLogExecution("debug","Items Returned",JSON.stringify(items));
		  ctx.setSessionObject("itemsReturned",JSON.stringify(items));
		  
		  var dropOff = request.getParameter("custpage_drop_off");
          var returnLabelStatus =request.getParameter("custpage_return_label_status");
          nlapiLogExecution("Debug","Drop Off Value Engrave",dropOff);
          nlapiLogExecution("Debug","Return Label Status Engrave",returnLabelStatus);
          if(dropOff == '1')
          {
            //Step 1 :: display the so data on respective landing page 
            Engrave_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && (returnLabelStatus =="1" || returnLabelStatus =="2" || returnLabelStatus =="3" || returnLabelStatus =="4" ))
          {
            Engrave_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && returnLabelStatus =="5")
          {
            //Step :: 2 Review the information for final submission
            Engrave_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus);
          }
          else 
          {
            //Step:: 3 Final step create return label and send email with attachments.
            Engrave_Final_Create_Label_Send_Email(form);
          }
        }// END ENGRAVE
        else if(request.getParameter('custpage_matched_wedding_band_id')=='7') //Start Matched Wedding Band  
        {
          //Capture item sublist data
		  var items = [];
		  for(var x=0; x < request.getLineItemCount('custpage_items'); x++)
		  {
		  	if(request.getLineItemValue('custpage_items','sublist_shipping_to_be',x+1)=='T')
			{
				items.push({
					item : request.getLineItemValue('custpage_items','sublist_item',x+1),
					qty : request.getLineItemValue('custpage_items','sublist_qty',x+1),
					ins : request.getLineItemValue('custpage_items','sublist_production_ins_value',x+1),
					desc : request.getLineItemValue('custpage_items','sublist_desc',x+1)
				});
			}
		  }
		  
		  nlapiLogExecution("debug","Items Returned",JSON.stringify(items));
		  ctx.setSessionObject("itemsReturned",JSON.stringify(items));
		  
		  var dropOff = request.getParameter("custpage_drop_off");
          var returnLabelStatus =request.getParameter("custpage_return_label_status");
          nlapiLogExecution("Debug","Drop Off Value matched & wedding band",dropOff);
          nlapiLogExecution("Debug","Return Label Status matched & wedding band",returnLabelStatus);
          if(dropOff == '1')
          {
            //Step 1 :: display the so data on respective landing page 
            Matched_Wedding_Band_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && (returnLabelStatus =="1" || returnLabelStatus =="2" || returnLabelStatus =="3" || returnLabelStatus =="4" ))
          {
            Matched_Wedding_Band_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && returnLabelStatus =="5")
          {
            //Step :: 2 Review the information for final submission
            Matched_Wedding_Band_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus);
          }
          else 
          {
            //Step:: 3 Final step create return label and send email with attachments.
            Matched_Wedding_Band_Final_Create_Label_Send_Email(form);
          }
        }// End Of Matched Wedding band
        else if(request.getParameter('custpage_set_id')=='4') // Start Set  
        {
          //Capture item sublist data
		  var items = [];
		  for(var x=0; x < request.getLineItemCount('custpage_items'); x++)
		  {
		  	if(request.getLineItemValue('custpage_items','sublist_shipping_to_be',x+1)=='T')
			{
				items.push({
					item : request.getLineItemValue('custpage_items','sublist_item',x+1),
					qty : request.getLineItemValue('custpage_items','sublist_qty',x+1),
					ins : request.getLineItemValue('custpage_items','sublist_production_ins_value',x+1),
					desc : request.getLineItemValue('custpage_items','sublist_desc',x+1)
				});
			}
		  }
		  
		  nlapiLogExecution("debug","Items Returned",JSON.stringify(items));
		  ctx.setSessionObject("itemsReturned",JSON.stringify(items));
		  
		  var dropOff = request.getParameter("custpage_drop_off");
          var returnLabelStatus =request.getParameter("custpage_return_label_status");
          nlapiLogExecution("Debug","Drop Off Value Set",dropOff);
          nlapiLogExecution("Debug","Return Label Status Set",returnLabelStatus);
          if(dropOff == '1')
          {
            //Step 1 :: display the so data on respective landing page 
            Set_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && (returnLabelStatus =="1" || returnLabelStatus =="2" || returnLabelStatus =="3" || returnLabelStatus =="4" ))
          {
            Set_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && returnLabelStatus =="5")
          {
            //Step :: 2 Review the information for final submission
            Set_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus);
          }
          else 
          {
            //Step:: 3 Final step create return label and send email with attachments.
            Set_Final_Create_Label_Send_Email(form);
          }
        }// End Of Set
        else if(request.getParameter('custpage_upgrade_id')=='6')  // Start Upgrade  
        {
          //Capture item sublist data
		  var items = [];
		  for(var x=0; x < request.getLineItemCount('custpage_items_returning'); x++)
		  {
		  	if(request.getLineItemValue('custpage_items_returning','custpage_items_returning_check',x+1)!=null && request.getLineItemValue('custpage_items_returning','custpage_items_returning_check',x+1)!='')
			{
				items.push({
					item : request.getLineItemValue('custpage_items_returning','custpage_items_returning_item',x+1),
					qty : request.getLineItemValue('custpage_items_returning','custpage_items_returning_qty',x+1),
					ins : request.getLineItemValue('custpage_items_returning','custpage_items_returning_production_ins_value',x+1),
					desc : request.getLineItemValue('custpage_items_returning','custpage_items_returning_desc',x+1),
					option : request.getLineItemValue('custpage_items_returning','custpage_items_returning_check',x+1)
				});
			}
		  }
		  
		  nlapiLogExecution("debug","Items Returned",JSON.stringify(items));
		  ctx.setSessionObject("itemsReturned",JSON.stringify(items));
		  
		  var dropOff = request.getParameter("custpage_drop_off");
          var returnLabelStatus =request.getParameter("custpage_return_label_status");
          nlapiLogExecution("Debug","Drop Off Value repair Upgrade",dropOff);
          nlapiLogExecution("Debug","Return Label Status Upgrade",returnLabelStatus);
          if(dropOff == '1')
          {
            //Step 1 :: display the so data on respective landing page 
            Upgrade_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && (returnLabelStatus =="1" || returnLabelStatus =="2" || returnLabelStatus =="3" || returnLabelStatus =="4" ))
          {
            Upgrade_DropOff_One(dropOff,form);
          }
          else if(dropOff == '2' && returnLabelStatus =="5")
          {
            //Step :: 2 Review the information for final submission
            Upgrade_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus);  
          }
          else
          {
            //Step:: 3 Final step create return label and send email with attachments.
            Upgrade_Final_Create_Label_Send_Email(form,dropOff);
          }
        }  //END Upgrade
      
		  //Process international label
		  var ctx = nlapiGetContext();
		  var addressObj = ctx.getSessionObject("addressObj");
		  var itemsObj = ctx.getSessionObject("itemsReturned");
		  
		  if(addressObj!=null && addressObj!="")
		  {
		  	addressObj = JSON.parse(addressObj);
			itemsObj = JSON.parse(itemsObj);
			
			if(addressObj.country=="CA" || addressObj.country=="GB" || addressObj.country=="AU")
			{
				//Only create international label for Canada, United Kingdom, or Australia
				nlapiLogExecution("debug","Creating Post Sale International Return Label","Country: " + addressObj.country);
				
				//Find post-sales sales order
				var filters = [];
				filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
				filters.push(new nlobjSearchFilter("custbody_created_from",null,"is",request.getParameter("custpage_order_id")));
				var cols = [];
				cols.push(new nlobjSearchColumn("internalid").setSort(true));
				var results = nlapiSearchRecord("salesorder",null,filters,cols);
				if(results)
				{
					//Write value of address object to post-sales order
					nlapiSubmitField("salesorder",results[0].getId(),"custbody_intl_return_label_address_obj",JSON.stringify(addressObj));
				
					createIntlReturnLabelPdf(request.getParameter("custpage_order_id"),addressObj,ctx.getSessionObject("postSaleType"),results[0].getId(),itemsObj);
				}
			}
		  }	  
	  }
    }
  }
  catch(err)
  {
    nlapiLogExecution('debug','Error On Page',err.message);
  }
}



function calActualShipDate(_actualShipDate)
{
  var _actualShipDate = new Date(_actualShipDate).getTime();
  var currDate = new Date().getTime();
  var actualShipDateDay =  Math.abs(currDate - _actualShipDate)/1000/24/60/60 + 1;
  nlapiLogExecution("Debug","Actual Ship Date Day",parseInt(actualShipDateDay));
  return actualShipDateDay ;
}
function checkNumber(tranid,index)
{
  //nlapiLogExecution("Debug","index",index);
  // nlapiLogExecution("Debug","tranid",tranid);
  var filters = [];
  if(index==1)
    filters.push(new nlobjSearchFilter("tranid",null,"is",tranid));
  else
    filters.push(new nlobjSearchFilter("tranid",null,"is",tranid+index));
  filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
  var results = nlapiSearchRecord("salesorder",null,filters);
  if(results)
  {     
    return checkNumber(tranid,index+1);
  }
  else
  {
    if(index!=1)
      return tranid+index;
    else
      return tranid;
  }
}

function checkRaNumber(tranid,index)
{

  var filters = [];
  if(index==1)
    filters.push(new nlobjSearchFilter("tranid",null,"is",tranid));
  else
    filters.push(new nlobjSearchFilter("tranid",null,"is",tranid+index));
  filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
  var results = nlapiSearchRecord("returnauthorization",null,filters);
  if(results)
  {
    return checkNumber(tranid,index+1);
  }
  else
  {
    if(index!=1)
      return tranid+index;
    else
      return tranid;
  }
}
function  Order_Delivery_Information()
{

  retObj={
    customer:null,
    deliveryDate:null,
    deliveryDateFirm :null,
    orNotes : null,
    salesrep :null,
    datereceived :null,
    locationReceived :null,
    pickupLocation :null,
    addressee :null,
    attention :null,
    address1 :null,
    address2 :null,
    city :null,
    state :null,
    zipcode :null,
    country :null,
    country_hid :null,
    delivery_instruction :null,
    delivery_date_notes :null,
    pickup_at_be :null,
    so_notes : null,
    placeofsale : null,
    state_txt : null,
    num_times_repaired : null
  };

  var customer = request.getParameter("custpage_customer");
  var deliveryDate = request.getParameter("custpage_delivery_date");
  var deliveryDateFirm = request.getParameter("custpage_delivery_date_firm");
  var orNotes = request.getParameter("custpage_or_notes");
  var salesrep = request.getParameter("custpage_sales_rep");
  var datereceived = request.getParameter("custpage_date_received_at_be");
  var locationReceived = request.getParameter("custpage_location_received_at_be");
  var pickupLocation = request.getParameter("custpage_pickup_location");
  var so_notes = request.getParameter("custpage_so_notes");//Added on 03/06/2017


  //Get Shipping Information From Form


  var addressee = request.getParameter("custpage_addressee");
  var attention = request.getParameter("custpage_attention");
  var address1 = request.getParameter("custpage_address_1");
  var address2 = request.getParameter("custpage_address_2");
  var city = request.getParameter("custpage_city");
  var state = request.getParameter("custpage_state");
  nlapiLogExecution("Debug","State from list",state);
  var state_txt = request.getParameter("custpage_state_new");
  nlapiLogExecution("Debug","State from textbox",state_txt);
  var zipcode = request.getParameter("custpage_zip");
  var country = request.getParameter("custpage_country");
  var country_hid = request.getParameter("custpage_country_hidden");
  var delivery_instruction =request.getParameter('custpage_delivery_instruction');
  var delivery_date_notes = request.getParameter('custpage_delivery_date_notes');
  var pickup_at_be = request.getParameter('custpage_pickup_at_be');
  var placeofsale = request.getParameter("custpage_place_of_sale");
  nlapiLogExecution('debug','place of sale:',placeofsale); 
  var num_times_repaired = request.getParameter("custpage_num_times_repaired");
  retObj.customer =customer;
  retObj.deliveryDate =deliveryDate;
  retObj.deliveryDateFirm =deliveryDateFirm;
  retObj.orNotes =orNotes;
  retObj.salesrep =salesrep;
  retObj.datereceived =datereceived;
  retObj.locationReceived =locationReceived;
  retObj.pickupLocation =pickupLocation;
  retObj.addressee =addressee;
  retObj.attention =attention;
  retObj.address1 =address1;
  retObj.address2 =address2;

  retObj.city =city;
  retObj.state =state;
  retObj.state_txt =state_txt;
  retObj.zipcode =zipcode;
  retObj.country =country;
  retObj.country_hid =country_hid;
  retObj.delivery_instruction =delivery_instruction;
  retObj.delivery_date_notes =delivery_date_notes;
  retObj.pickup_at_be = pickup_at_be ;
  retObj.so_notes = so_notes ;
  retObj.placeofsale = placeofsale ;
  retObj.num_times_repaired = num_times_repaired ;
  return retObj;
}