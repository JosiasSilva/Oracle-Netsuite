nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com/ shivamupc73@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : SuiteletScript
 * Created Date  : July 18, 2016
 * Last Modified Date : December 02, 2016 (YAGYA KUMAR NAG)
 * Comments : Script will generate Shipper's Declaration Form on Sales Order Page
 * SB URL-1: /app/common/scripting/script.nl?id=990
 * SB URL-2: /app/common/scripting/script.nl?id=991 
 * PB URL-1: /app/common/scripting/script.nl?id=1026
 * PB URL-2: /app/common/scripting/script.nl?id=1027
*/

//User Event script to create button and apply before load function
function UserEvent(type,form)
{
  try
  {
    nlapiLogExecution('debug','Event Type is : ', type );		
    if (type =='view')
    {
      var sId = nlapiGetRecordId();	          
      var orderStatus=nlapiLookupField('salesorder',sId,'statusRef',true);		
      if(orderStatus=='Billed')
      {
        var url = nlapiResolveURL("SUITELET","customscript_shipper_declaration_sl","customdeploy_shipper_declaration_sl");
        url += "&record=" + sId+"&page=home&adds=T";		
        form.addButton("custpage_btn", "Shipper's Declr", "window.open('" + url + "', 'salesord', 'location=no,menubar=yes,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=yes,height=600,width=700')");
      }	
    }
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error raised on creation of shippers declaration is :",err.message);
  }
}
function SO_Data(sId)
{	
  var obj = nlapiLoadRecord("salesorder",sId);
  //Added by Sanjeet NS-819
  var shippingCountry=obj.getFieldValue('custbody271');	 
  //End
  var itemCount=obj.getLineItemCount("item");
  nlapiLogExecution("debug","Total Item: "+itemCount+" w.r.t. SoId :"+sId,sId);
  var itemcat = 0; 
  var itemArr=[];
  for(var i=1; i<= itemCount; i++)
  {
    var itemId = obj.getLineItemValue("item","item",i); 
    var itemType = obj.getLineItemValue("item","itemtype",i);
    if(itemType == "InvtPart")
    {
      itemcat = nlapiLookupField("inventoryitem",itemId,"custitem20");
      if(itemcat != 1 && itemcat != 12 && itemcat != 23 && itemcat != 30)
      {
        var itemDesc = obj.getLineItemValue("item","description",i);
        if(itemDesc != "" &&itemDesc != null)
        {
          var re = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
          itemDesc = itemDesc.replace('\n','').replace('\r','').replace('&','and').replace(re, "");
        }
        //var itemAmt = obj.getLineItemValue("item","amount",i);
        //Added  by Sanjeet NS-819
        var itemAmt;
        if(shippingCountry=='GB')
        {

          itemAmt = obj.getLineItemValue("item","custcol_item_price",i);
          if(itemAmt ==null)
          {
            itemAmt = obj.getLineItemValue("item","amount",i);
          }
        }
        else{
          itemAmt = obj.getLineItemValue("item","amount",i);
        }
        //end
        var itemQty = obj.getLineItemValue("item","quantity",i);
        itemArr.push({
          sublist_item:itemId,
          sublist_desc:itemDesc,
          sublist_amt:itemAmt,
          sublist_qty:itemQty	
        });
      }
    }
    else if(itemType == "Assembly")
    {
      itemcat = nlapiLookupField("assemblyitem",itemId,"custitem20");
      if(itemcat != 1 && itemcat != 12 && itemcat != 23 && itemcat != 30)
      {
        var itemDesc = obj.getLineItemValue("item","description",i);
        if(itemDesc != "" &&itemDesc != null)
        {
          itemDesc = itemDesc.replace('\n','').replace('\r','').replace('&','and').replace(re, "");
        }
        //var itemAmt = obj.getLineItemValue("item","amount",i);
        //added by sanjeet
        var itemAmt;
        if(shippingCountry=='GB')
        {
          itemAmt = obj.getLineItemValue("item","custcol_item_price",i);
          if(itemAmt ==null)
          {
            itemAmt = obj.getLineItemValue("item","amount",i);
          }
        }
        else{
          itemAmt = obj.getLineItemValue("item","amount",i);
        }
        //End
        var itemQty = obj.getLineItemValue("item","quantity",i);
        itemArr.push({
          sublist_item:itemId,
          sublist_desc:itemDesc,
          sublist_amt:itemAmt,
          sublist_qty:itemQty	
        });
      }
    }
  }
  return itemArr;
}
function ShippersDeclaration_BySuitelet(request,response)
{
  var sId = request.getParameter("record");
  /*if(request.getParameter("adds") == "T")
	{
		nlapiSubmitField('scriptdeployment' ,7290,'custscript_billaddress','', true );		
	}*/

  if(request.getMethod() == "GET")
  {
    try
    {
      var form = nlapiCreateForm('Items Returning to BE');
      var fld = form.addField('custpage_sofield', 'text', 'Record Id').setDisplayType('hidden').setDefaultValue(sId);				
      var url="https://'+window.location.host+'/app/site/hosting/scriptlet.nl?script=991&deploy=1&record="+sId+"&page=";
      var page=request.getParameter("page");

      if(page=='home')
      {
        itemArr=SO_Data(sId);
        if(itemArr.length>0)
        {
          form.addSubmitButton('Next'); 
          var select = form.addField('custpage_selectfield','select','IS THIS A MATCHED WEDDING BAND ORDER').setMandatory(true);				
          select.addSelectOption('1','No');
          select.addSelectOption('2','Yes');

          var BillStreet=	"";
          var BillCity = "";
          var BillState= "";
          var BillZipCode= "";
          var BillCountry	= "";					
          var BillOption = "";
          var CustName="";

          var edit_adds=nlapiLookupField('salesorder' ,sId,'custbody_shipper_bill_adds');

          if(edit_adds != null && edit_adds != "")
          {
            edit_adds	=	JSON.parse(edit_adds);
            BillStreet	=	edit_adds[0].street;
            BillCity 	=	edit_adds[0].city;
            BillState 	=	edit_adds[0].state;
            BillZipCode =	edit_adds[0].zip;
            BillCountry	= 	edit_adds[0].country;
            BillOption 	=	edit_adds[0].state;
            CustName    =   edit_adds[0].custname;
          }
          else
          {
            var soObj=nlapiLoadRecord('salesorder',sId);
            var billObj =soObj.viewSubrecord('billingaddress');
            if(billObj != null && billObj != "")
            {
              BillStreet=	billObj.getFieldValue('addr1');
              BillCity=	billObj.getFieldValue('city');
              BillState=	billObj.getFieldValue('state');
              BillZipCode=	billObj.getFieldValue('zip');
              BillCountry	= billObj.getFieldText('country');	
              if(BillCountry == "United States")
              {
                BillOption = SetBillState(BillState);							
              }
              else
              {
                BillOption = BillState;
              }


            }
          }
          var customerId=nlapiLookupField('salesorder' ,sId,'entity');
          var custFields = ['entityid', 'firstname', 'lastname'];
          var custRecord = nlapiLookupField('customer', customerId, custFields);
          if(custRecord )
          {
            if(!CustName)
            {
              CustName=custRecord.firstname +" "+ custRecord.lastname;
            }
          }
          var sublist = form.addSubList('custpage_items', 'inlineeditor', 'Items');
          sublist.addField('sublist_item','select', 'ITEM','item').setMandatory(true);
          sublist.addField('sublist_desc','textarea', 'DESCRIPTION');
          sublist.addField('sublist_amt','currency', 'AMOUNT').setMandatory(true);				
          sublist.addField('sublist_qty','integer', 'QUANTITY').setMandatory(true);
          sublist.setLineItemValues(itemArr);

          var htmlHeader = form.addField('custpage_test_edit', 'inlinehtml').setLayoutType('outsidebelow', 'startrow');
          htmlHeader.setDefaultValue("<table style='     font-size: small;   width: 700px;'><tr><td colspan='4' ><b>Billing Address<hr/></b></td></tr><tr><td>Customer Name:</td><td><input type='text' name='txtCustName' required value='"+CustName+"'/></td><td>Street:</td><td><input type='text' name='txtBillStreet' required value='"+BillStreet+"'/></td></tr><tr><td>State:</td><td><input type='text' name='txtBillState' required value='"+BillOption+"'/></td><td>City:</td><td><input type='text' required name='txtBillCity' value='"+BillCity+"'  /></td></tr><tr><td>Country:</td><td><input type='text' required name='txtBillCountry' value='"+BillCountry+"'/></td><td>Zip Code:</td><td><input type='text' name='txtBillZipCode' required value='"+BillZipCode+"'  /></td><td></td><td></td></tr></table>");  
          //htmlHeader.setDefaultValue("<table style='     font-size: small;   width: 700px;'><tr><td colspan='4' ><b>Billing Address<hr/></b></td></tr><tr><td>Street:</td><td><input type='text' name='txtBillStreet' required value='"+BillStreet+"'/></td><td>State:</td><td><select name='txtBillState' style='    width: 165px;'>"+BillOption+"</select></td></tr><tr><td>City:</td><td><input type='text' required name='txtBillCity' value='"+BillCity+"'  /></td><td>Country:</td><td>"+BillCountry+"</td></tr><tr><td>Zip Code:</td><td><input type='text' name='txtBillZipCode' required value='"+BillZipCode+"'  /></td><td></td><td></td></tr></table>");  
          form.addField('custpage_status', 'text', 'status').setDisplayType('hidden').setDefaultValue("address");	

        }
        else
        {				
          var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
          htmlHeader.setDefaultValue("<h1><b style='color:red; font-size:11pt; line-height: 12pt; '> The sales order# "+sId+" is not applicable to generate Shipper's declaration! </b></h1>"); 
        }
        form.addButton('custpage_close', 'Close', "window.close();" );
        response.writePage(form);
      }
    }
    catch(err)
    {
      nlapiLogExecution("error","Error raised on getting custom popup is :",err.message);
    }
  }
  else if(request.getMethod() == "POST")
  {
    var sId = request.getParameter("custpage_sofield");
    var status=request.getParameter('custpage_status');
    if(status=="address")
    {
      var baddress =[];
      baddress.push
      ({
        street	:	request.getParameter("txtBillStreet"),
        city	:	request.getParameter("txtBillCity"),
        state	:	request.getParameter("txtBillState"),
        zip		:	request.getParameter("txtBillZipCode"),
        country	:	request.getParameter("txtBillCountry"),
        custname:   request.getParameter("txtCustName")
      });
      //var baddress =	request.getParameter("txtBillStreet") +"|"+request.getParameter("txtBillCity") +" "+request.getParameter("txtBillState")+" "+request.getParameter("txtBillZipCode")+", "+request.getParameter("txtBillCountry");
      //nlapiSubmitField ( 'scriptdeployment' ,7290,'custscript_billaddress' , baddress , true );
      nlapiSubmitField('salesorder' ,sId,'custbody_shipper_bill_adds',JSON.stringify(baddress), true );
      nlapiLogExecution("debug","baddress",JSON.stringify(baddress));
    }
    try
    {
      if(request.getParameter('custpage_so_hide')==null)
      {
        var form = nlapiCreateForm('Review Items Returning to BE');		
        form.addSubmitButton('Execute');		
        form.addButton('custpage_back', 'Back', "window.history.go(-1);");
        form.addButton('custpage_close', 'Close', "window.close();" ); 			
        var sublist = form.addSubList('custpage_items_two', 'list', 'Items');
        sublist.addField('sublist_item_two','select', 'ITEM','item').setDisplayType("inline");
        sublist.addField('sublist_desc_two','textarea', 'DESCRIPTION');
        sublist.addField('sublist_amt_two','currency', 'AMOUNT');				
        sublist.addField('sublist_qty_two','integer', 'QUANTITY');
        var lines=[];			
        for(var i=1; i<=request.getLineItemCount("custpage_items"); i++)
        {

          lines.push({
            //sublist_check_two:request.getLineItemValue("custpage_items", "sublist_check", i)=='T'?'YES':'NO',	//Returning to BE Checkbox				
            sublist_item_two:request.getLineItemValue("custpage_items", "sublist_item", i),
            sublist_desc_two:request.getLineItemValue("custpage_items", "sublist_desc", i),
            sublist_amt_two:request.getLineItemValue("custpage_items", "sublist_amt", i),
            sublist_qty_two:request.getLineItemValue("custpage_items", "sublist_qty", i)			

          });
        }

        sublist.setLineItemValues(lines);
        var isCheck='F';
        if(request.getParameter('custpage_selectfield')=='1')
        {
          isCheck='T';
        }
        form.addField('custpage_hide_chk_wbo','text').setDisplayType('hidden').setDefaultValue(isCheck);				
        form.addField('custpage_so_hide','text').setDisplayType('hidden').setDefaultValue(request.getParameter('custpage_sofield'));
        var bill_add = nlapiLookupField('salesorder' ,sId,'custbody_shipper_bill_adds');
        if(bill_add != null && bill_add != "")
        {
          bill_add	=	JSON.parse(bill_add);
          bill_add = bill_add[0].street +", "+bill_add[0].city +" "+bill_add[0].state+" "+bill_add[0].zip+", "+bill_add[0].country;

          var adds = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
          adds.setDefaultValue("<h1><b style=' font-size:10pt; line-height: 10pt; '> Billing Address :</b> "+bill_add.replace("|",", ")+" </h1>"); 
        }
        response.writePage(form);				
      }
      else
      {
        var orderId=request.getParameter('custpage_so_hide');
        var lines=[];			
        for(var i=1; i<=request.getLineItemCount("custpage_items_two"); i++)
        {
          lines.push({
            sublist_item_two:request.getLineItemValue("custpage_items_two", "sublist_item_two", i),
            sublist_desc_two:request.getLineItemValue("custpage_items_two", "sublist_desc_two", i),
            sublist_amt_two:request.getLineItemValue("custpage_items_two", "sublist_amt_two", i),
            sublist_qty_two:request.getLineItemValue("custpage_items_two", "sublist_qty_two", i)			

          });
        }
        pdfView(lines,request,response,orderId);				  
      }
    }
    catch(err)
    {
      var form = nlapiCreateForm('Review Items Returning to BE');	
      form.addButton('custpage_close', 'Close', "window.close();" );
      var htmlHeader = form.addField('custpage_test_edit', 'inlinehtml').setLayoutType('outsidebelow', 'startrow');
      htmlHeader.setDefaultValue("<table style='color: red;font-size: large; width: 700px;'><tr><td style='color: black;font-weight: bold;' >Error Message: System found invalid data formate, Please check it.</td></tr><tr><td>"+err.message+"</td></tr></table>");  

      nlapiLogExecution("error","Error raised on next button click is :",err.message);
      response.writePage(form);
    }
  }	
}
function SetBillState(name) 
{
  var state = [{"value":"","text":""},{"value":"AL","text":"Alabama"},{"value":"AK","text":"Alaska"},{"value":"AZ","text":"Arizona"},{"value":"AR","text":"Arkansas"},{"value":"AA","text":"Armed Forces Americas"},{"value":"AE","text":"Armed Forces Europe"},{"value":"AP","text":"Armed Forces Pacific"},{"value":"CA","text":"California"},{"value":"CO","text":"Colorado"},{"value":"CT","text":"Connecticut"},{"value":"DE","text":"Delaware"},{"value":"DC","text":"District of Columbia"},{"value":"FL","text":"Florida"},{"value":"GA","text":"Georgia"},{"value":"HI","text":"Hawaii"},{"value":"ID","text":"Idaho"},{"value":"IL","text":"Illinois"},{"value":"IN","text":"Indiana"},{"value":"IA","text":"Iowa"},{"value":"KS","text":"Kansas"},{"value":"KY","text":"Kentucky"},{"value":"LA","text":"Louisiana"},{"value":"ME","text":"Maine"},{"value":"MD","text":"Maryland"},{"value":"MA","text":"Massachusetts"},{"value":"MI","text":"Michigan"},{"value":"MN","text":"Minnesota"},{"value":"MS","text":"Mississippi"},{"value":"MO","text":"Missouri"},{"value":"MT","text":"Montana"},{"value":"NE","text":"Nebraska"},{"value":"NV","text":"Nevada"},{"value":"NH","text":"New Hampshire"},{"value":"NJ","text":"New Jersey"},{"value":"NM","text":"New Mexico"},{"value":"NY","text":"New York"},{"value":"NC","text":"North Carolina"},{"value":"ND","text":"North Dakota"},{"value":"OH","text":"Ohio"},{"value":"OK","text":"Oklahoma"},{"value":"OR","text":"Oregon"},{"value":"PA","text":"Pennsylvania"},{"value":"PR","text":"Puerto Rico"},{"value":"RI","text":"Rhode Island"},{"value":"SC","text":"South Carolina"},{"value":"SD","text":"South Dakota"},{"value":"TN","text":"Tennessee"},{"value":"TX","text":"Texas"},{"value":"UT","text":"Utah"},{"value":"VT","text":"Vermont"},{"value":"VA","text":"Virginia"},{"value":"WA","text":"Washington"},{"value":"WV","text":"West Virginia"},{"value":"WI","text":"Wisconsin"},{"value":"WY","text":"Wyoming"}];
  for (i = 0; i < state.length; i++) 
  {
    if (state[i].value == name) 
    {
      return state[i].text;
    }
  }
  return '';
}


function pdfView(lines,request,response,orderId)
{
  nlapiLogExecution("debug","Pdf View Lines :"+lines.length, JSON.stringify(lines));
  var soId=orderId;	
  //var isCheck_wbo=request.getParameter('custpage_chk_wbo'); //commented as per Chelsea's feedback datedd:08/08/2016
  var isCheck_wbo=request.getParameter('custpage_hide_chk_wbo');	

  //nlapiLogExecution("debug","Pdf View Lines :"+lines.length+", isCheck_wbo:"+isCheck_wbo,soId);

  var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
  xml += "<pdf>\n";
  /*var xml = "";
	xml += "<?xml version=\"1.0\"?>";
	xml += "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">";
	xml += "<pdf>";*/
  xml += "<head>";
  xml += "<link name='freightDispPro' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_book.otf'/>";
  xml += "<link name='freightDispSB' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_semibold.otf'/>";
  xml += "<link name='brandonMed' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/Brandon_med.otf'/>";
  xml += "<link name='brandon' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/Brandon_reg.otf'/>";
  xml += "<link name='brandonBold' type='font' subtype='opentype' src='http://www.brilliantearth.com/media/style/bearth/fonts/Brandon_bld.otf'/>";
  xml += "<style>";
  xml += " .brandonGrotesqueMed {font-family:brandonMed;}";
  xml += " .brandonGrotesque {font-family:brandon;}";
  xml += " .brandonGrotesqueBold {font-family:brandonBset form url old;}";
  xml += " .freightDispProSB {font-family:freightDispSB;}";
  xml += " .freightDispPro {font-family:freightDispPro;}";
  xml += " .pt9 {font-size:9pt; line-height: 11pt;}";
  xml += " .pt10 {font-size:10pt; line-height: 14pt;}";
  xml += " .pt12 {font-size:11pt; line-height: 12pt;}";
  xml += " .photo {}";
  xml += " .topborder {border-top: 1px solid black; margin-left: 400px;}";
  xml += "</style>";
  xml += "<macrolist>";
  xml += "<macro id='nlfooter'>";
  //xml += "<p class='freightDispPro' color='#959595' align='center'>26 O'Farrell Street &#8226; 10th Floor &#8226; San Francisco, CA 94108 &#8226; 800.691.0952 &#8226; BrilliantEarth.com</p>";
  xml += "</macro>";
  xml += "</macrolist>";
  xml += "</head>";
  xml+= "<body size='letter' footer='nlfooter' footer-height='0.5in'>";

  var soFields = ['entity', 'currency','billaddress', 'shipaddress','custbodyloose_gem_order','custbody110','custbody_shipper_bill_adds'];
  var soRecord = nlapiLookupField('salesorder', soId, soFields);
  var customerId = soRecord.entity;
  var billAdds=soRecord.billaddress;
  var DATE_TO_SHIP=soRecord.custbody110;
  var looseGemOrder=soRecord.custbodyloose_gem_order;

  //var custFields = ['entityid', 'firstname', 'lastname', 'altemail', 'altname'];
  //var custRecord = nlapiLookupField('customer', customerId, custFields);
  //var firstName = custRecord.firstname;
  //var lastName = custRecord.lastname;
  //Get Address in break
  var billAddsArr='';
  var billAddStr='';		
  var bill_add = soRecord.custbody_shipper_bill_adds;
  if(bill_add != null && bill_add != "")
  {
    bill_add	=	JSON.parse(bill_add);
    billAdds =  bill_add[0].custname+ ', '+bill_add[0].street +"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+bill_add[0].city +" "+bill_add[0].state+" "+bill_add[0].zip+", "+bill_add[0].country;			
  }
  else
  {			
    if(billAdds != '' && billAdds != null)
    {
      billAddsArr=billAdds.split('\n');
      for(var k=0;k<billAddsArr.length;k++)
      {
        if(k<=1)
        {      

          if(billAddStr=='')
          {
            billAddStr=billAddsArr[k];
          }
          else
          {
            billAddStr=billAddStr+', '+billAddsArr[k];
          }
        }
        else
        {
          if(k==2)
          {
            billAddStr=billAddStr+"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+billAddsArr[k];
          }
          else
          {
            billAddStr=billAddStr+', '+billAddsArr[k];
          }
        }
      }
    }
    billAdds=billAddStr;
  }
  ///End Adds
  var currency=soRecord.currency;
  if(currency)
  {
    currency=nlapiSearchRecord('currency',null,new nlobjSearchFilter('internalid',null,'anyof',currency),new nlobjSearchColumn('symbol'))[0].getValue('symbol');
  }


  //Start//
  var itemArr1=new Array();
  var itemArr2=new Array();
  var itemArr=new Array();
  for(var i=0;i<lines.length;i++)
  {
    var itemId=lines[i].sublist_item_two;
    var itemName=lines[i].sublist_desc_two
    var itemAmt=lines[i].sublist_amt_two;
    var item_qty=lines[i].sublist_qty_two;
    //var itemName=nlapiLookupField('item',itemId,'itemid'); 
    var itemCategory=nlapiLookupField('item',itemId,'custitem20'); 

    if(itemCategory=='2' || itemCategory=='7' || itemCategory=='8' || itemCategory=='14' || itemCategory=='15' || itemCategory=='18' || itemCategory=='20' || itemCategory=='31') 
    {   
      itemArr1.push({itemName:itemName,itemAmt:itemAmt,itemCategory:itemCategory,item_qty:item_qty});
    }
    else
    {
      itemArr2.push({itemName:itemName,itemAmt:itemAmt,item_qty:item_qty});
    }
  }


  itemArr1.sort(function(a, b) {
    return a.itemCategory- b.itemCategory;
  });

  nlapiLogExecution("debug","itemArr1 Shorted List of SoId:"+soId,JSON.stringify(itemArr1));

  if(itemArr1.length>0)
  {
    var totAmt1=0;
    var itemDes='';
    var cnt=0;
    var item_qty_val=1;
    for(var j=0; j<itemArr1.length;j++)
    {
      totAmt1=parseFloat(totAmt1) + parseFloat(itemArr1[j].itemAmt);
      var catId=itemArr1[j].itemCategory;
      if(catId==2)
      {
        if(itemDes=='')
        {
          itemDes=itemArr1[j].itemName;
        }
        else
        {
          itemDes=itemDes+'<br/>'+itemArr1[j].itemName;
        }
      }
      else
      {
        cnt=parseInt(cnt)+1;
        if(cnt==1)
        {
          if(looseGemOrder =='T')
          {					    
            itemDes=itemDes+'<br/>'+itemArr1[j].itemName;
          }
          else
          {					    
            itemDes=itemDes+'<br/><b>Set with</b> '+itemArr1[j].itemName;
          }
        }
        else
        {
          itemDes=itemDes+'<br/>'+itemArr1[j].itemName;
        }

      }
    } //end of loop
    itemArr.push({itemName:itemDes,itemAmt:totAmt1,item_qty:item_qty_val});
  }


  if(itemArr2.length>0)
  {
    //  itemArr.push(itemArr2);
    for(var k=0;k<itemArr2.length;k++)
    {
      itemArr.push({itemName:itemArr2[k].itemName,itemAmt:itemArr2[k].itemAmt,item_qty:itemArr2[k].item_qty});
    }
  }
  //End//

  var htmlStr="<h4 align='center' style='padding:50px 0px 0px 0px;' class='pt12'>Foreign Shipper's Declaration of U.S. Goods Returned</h4><br/><br/>";
  htmlStr +="<table width='500' border='0' align='center' cellpadding='2' cellspacing='1' style='font-family:Arial, Helvetica, sans-serif'>";
  var userName=bill_add[0].custname;
  var p1="I, <b>"+userName+"</b> declare that to the best of my knowledge and belief that the articles herein specified were exported from the United States, from the port of <b><i>San Francisco</i></b> on or about <b>"+DATE_TO_SHIP+"</b>, and that they are returned without having been advanced in value or improved in condition by any process of manufacturing or other means."
  htmlStr +="<tr><td class='pt10'>"+p1+"</td></tr>";
  htmlStr +="</table><br/>";
  htmlStr +="<table width='500' align='center' cellpadding='2' cellspacing='1' style='font-family:Arial, Helvetica, sans-serif'>";
  htmlStr +="<tr>"
  htmlStr +="<td class='pt10' height='25' valign='top' align='left' style='padding:10px !important; background:#efefef; display:block; border-bottom:solid; border-top:solid;  border-left:solid; border-right:solid'><b>Marks</b></td>";
  htmlStr +="<td class='pt10' height='25' valign='top' align='left' style='padding:10px !important; background:#efefef; display:block; border-bottom:solid; border-top:solid; border-right:solid'><b>Number</b></td>";
  htmlStr +="<td class='pt10' height='25' valign='top' align='left' style='padding:10px !important; background:#efefef; display:block; border-bottom:solid; border-top:solid; border-right:solid'><b>Quantity</b></td>";
  htmlStr +="<td class='pt10' height='25' valign='top' align='left' style='padding:10px !important; background:#efefef; display:block; border-bottom:solid; border-top:solid; border-right:solid'><b>Ring or Jewelry Setting Description</b></td>";
  htmlStr +="<td class='pt10' height='25' valign='top' align='left' style='padding:10px !important; background:#efefef; display:block; border-bottom:solid; border-top:solid; border-right:solid'><b>Currency</b></td>";
  htmlStr +="<td class='pt10' height='25' valign='top' align='left' style='padding:10px !important; background:#efefef; display:block; border-bottom:solid; border-top:solid; border-right:solid'><b>Total Value before tax</b></td>";
  htmlStr +="</tr>";
  var itemDesc='';
  var totAmt=0;
  var toNetAmt=0;
  var grandTot=0;
  for(var n=0;n<itemArr.length;n++)
  {

    var itemDesc=itemArr[n].itemName; 
    var item_qty=itemArr[n].item_qty;
    var totAmt=parseFloat(itemArr[n].itemAmt); 			
    if(totAmt=='' || totAmt==null)
    {
      totAmt=0;
    }
    nlapiLogExecution("debug","Test1",itemDesc);
    grandTot= parseFloat(grandTot) + parseFloat(totAmt);
    totAmt=totAmt.toFixed(2);
    htmlStr +="<tr>";
    htmlStr +="<td class='pt10' height='20'  valign='middle' align='center' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-left:solid; border-right:solid'>BE Stamp</td>";
    htmlStr +="<td class='pt10' height='20' valign='middle' align='center' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'>N/A</td>";
    htmlStr +="<td class='pt10' height='20' valign='middle' align='center' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'>"+item_qty+"</td>";
    //htmlStr +="<td class='pt10' height='20' valign='middle' align='left' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'>"+itemDesc+"</td>";	
    htmlStr +="<td class='pt10' height='20' valign='middle' align='left' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'>"+itemDesc+"</td>";				
    htmlStr +="<td class='pt10' height='20' valign='middle' align='center' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'>"+currency+"</td>";
    htmlStr +="<td class='pt10' height='20' valign='middle' align='right' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'>"+totAmt+"</td>";
    htmlStr +="</tr>";
  }
  grandTot=grandTot.toFixed(2);
  if(currency=='USD')
  {
    currency='$';
  }
  htmlStr +="<tr>";		
  htmlStr +="<td class='pt10' height='20' colspan='5' valign='middle' align='right' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-left:solid; border-right:solid'><b>Total</b></td>";		
  //htmlStr +="<td height='20' valign='middle' align='right' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'><b>"+currency+" "+grandTot+"</b></td>";
  htmlStr +="<td class='pt10' height='20' valign='middle' align='right' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'><b>"+grandTot+"</b></td>";
  htmlStr +="</tr>";
  htmlStr +="</table>";	


  if(isCheck_wbo=='T')
  {			
    htmlStr +="<table border='0' align='center' cellpadding='2' cellspacing='1' width='500' style='font-family:Arial, Helvetica, sans-serif'><tr><td width='30px'><input type='checkbox' id='chk_wto' name='chk_wto' checked='1' style='width:25px; height:25px;'/></td>";//" text='The goods did not confirm to contract specifications given by the importer to the manufacture or supplier, or because of a fault or defect in the goods.'/>";
    htmlStr +="<td class='pt10' >The goods did not confirm to contract specifications given by the importer to the manufacturer or supplier, or because of a fault or defect in the goods.</td>";
    htmlStr +="</tr></table>";
  }
  else
  {
    htmlStr +="<table border='0' align='center'  cellpadding='2' cellspacing='1' width='500' style='font-family:Arial, Helvetica, sans-serif'><tr><td width='30px'><input type='checkbox' id='chk_wto' name='chk_wto' style='width:25px; height:25px;'/></td>";//" text='The goods did not confirm to contract specifications given by the importer to the manufacture or supplier, or because of a fault or defect in the goods.'/>";
    htmlStr +="<td class='pt10'>The goods did not confirm to contract specifications given by the importer to the manufacturer or supplier, or because of a fault or defect in the goods.</td>";
    htmlStr +="</tr></table>";			
  }
  nlapiLogExecution("debug","Bill Address SoId:"+soId,billAdds);

  var today = new Date();
  today = nlapiDateToString(today,"date");

  htmlStr +="<br/><table cellpadding='2' cellspacing='1' width='500' align='center' style='font-family:Arial, Helvetica, sans-serif'>";		
  htmlStr +="<tr><td width='200'></td><td colspan='2'></td></tr>";

  htmlStr +="<tr><td width='225'></td><td align='left' colspan='2' class='pt10'><b>Date:</b>&nbsp;"+today+"</td></tr>";	
  htmlStr +="<tr><td colspan='3'></td></tr>";		
  htmlStr +="<tr><td width='225'></td><td align='left' colspan='2' class='pt10'><b>Address:</b>&nbsp;<span class='pt10'>"+billAdds+"</span></td></tr>";
  htmlStr +="<tr><td colspan='3'></td></tr>";
  htmlStr +="<tr><td colspan='3'></td></tr>";
  //htmlStr +="<tr><td colspan='3'></td></tr>";
  htmlStr +="<tr><td colspan='3'></td></tr>";
  htmlStr +="<tr><td colspan='3'></td></tr>"; 		
  htmlStr +="<tr><td width='225'></td><td align='left' colspan='2' class='pt10'><b>Signature:</b>________________________________</td></tr>";	
  htmlStr +="<tr><td colspan='3'></td></tr>";		
  htmlStr +="<tr><td colspan='3'></td></tr>";		
  //htmlStr +="<tr><td colspan='3'></td></tr>";		
  htmlStr +="<tr><td width='225'></td><td align='left' colspan='2' class='pt10'><b>Capacity: Owner</b></td></tr>";
  htmlStr +="<tr><td colspan='3'></td></tr>";
  //htmlStr +="<tr><td width='225'></td><td align='left' colspan='2' class='pt10'><b>Company: Brilliant Earth</b></td></tr>";
  htmlStr +="<tr><td width='225'></td><td align='left' colspan='2' class='pt10'><b>Company: N/A</b></td></tr>";
  htmlStr +="<tr><td colspan='3'></td></tr>";	
  htmlStr +="<tr><td colspan='3'></td></tr>";		
  htmlStr +="</table>";

  xml += htmlStr; 		
  //xml += "</body></pdf>";		
  xml += "</body>\n</pdf>";



  var file = nlapiXMLToPDF(xml);
  var fileNameStr="ShipperDeclaration_"+soId+".pdf";
  response.setContentType("PDF",fileNameStr,"inline");
  //response.write(file.getValue());

  file.setName(fileNameStr);		
  file.setFolder(7671491);
  file.setEncoding('UTF-8');
  var fileId = nlapiSubmitFile(file);
  nlapiSubmitField("salesorder",soId,"custbody320",fileId,true);	
  nlapiLogExecution("debug","Shippers file id is :",fileId);	
  var PDFurl = nlapiLoadFile(fileId).getURL();
  nlapiLogExecution("debug","Shippers PDF URL is :",PDFurl);	
  var form = nlapiCreateForm('Items Returning to BE');
  //form.addButton('custpage_close', 'Close', "window.close();" ); 

  var htmlHeader = form.addField('custpage_header1', 'inlinehtml');
  //htmlHeader.setDefaultValue("<script>window.opener.location.reload();</script><object width='100%'  data='"+PDFurl+"'></object>"); 
  htmlHeader.setDefaultValue("<script>window.location.assign('"+PDFurl+"');</script>");
  //response.writePage("<script>window.location.assign('https://system.sandbox.netsuite.com');</script>");
  //nlapiRequestURL('https://system.sandbox.netsuite.com/core/media/media.nl?id=17835987&c=666639&h=8d7157c1995d2ede77af&_xt=.pdf');
  //response.writePage("<script>window.opener.location.reload();</script><object width='100%'  data='"+PDFurl+"'></object>");
  response.writePage(form);
  //response.writePage("<script>window.location.assign('"+PDFurl+"');</script>");

}

