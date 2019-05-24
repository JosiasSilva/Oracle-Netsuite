nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com/ shivamupc73@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : SuiteletScript
 * Created Date  : July 18, 2016
 * Last Modified Date : 
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
        //Added by ajay 01March 2017
        var context = nlapiGetContext();
        var contextType = context.getExecutionContext();
        if(contextType!="userinterface")
        {
	         nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
	         return true;
        }
        //Ended by ajay 01March 2017

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
					itemDesc = itemDesc.replace('\n','').replace('\r','');
				}
				var itemAmt = obj.getLineItemValue("item","amount",i);
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
					itemDesc = itemDesc.replace('\n','').replace('\r','');
				}
				var itemAmt = obj.getLineItemValue("item","amount",i);
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
					var sublist = form.addSubList('custpage_items', 'inlineeditor', 'Items');
					sublist.addField('sublist_item','select', 'ITEM','item').setMandatory(true);
					sublist.addField('sublist_desc','textarea', 'DESCRIPTION');
					sublist.addField('sublist_amt','currency', 'AMOUNT').setMandatory(true);				
					sublist.addField('sublist_qty','integer', 'QUANTITY').setMandatory(true);
					sublist.setLineItemValues(itemArr);
					
					var htmlHeader = form.addField('custpage_test_edit', 'inlinehtml').setLayoutType('outsidebelow', 'startrow');
					htmlHeader.setDefaultValue("<table style='     font-size: small;   width: 700px;'><tr><td colspan='4' ><b>Billing Address<hr/></b></td></tr><tr><td>Street:</td><td><input type='text' name='txtBillStreet' required value='"+BillStreet+"'/></td><td>State:</td><td><input type='text' name='txtBillState' required value='"+BillOption+"'/></td></tr><tr><td>City:</td><td><input type='text' required name='txtBillCity' value='"+BillCity+"'  /></td><td>Country:</td><td><input type='text' required name='txtBillCountry' value='"+BillCountry+"'/></td></tr><tr><td>Zip Code:</td><td><input type='text' name='txtBillZipCode' required value='"+BillZipCode+"'  /></td><td></td><td></td></tr></table>");  
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
					country	:	request.getParameter("txtBillCountry")
					});
			//var baddress =	request.getParameter("txtBillStreet") +"|"+request.getParameter("txtBillCity") +" "+request.getParameter("txtBillState")+" "+request.getParameter("txtBillZipCode")+", "+request.getParameter("txtBillCountry");
			//nlapiSubmitField ( 'scriptdeployment' ,7290,'custscript_billaddress' , baddress , true );
			nlapiSubmitField('salesorder' ,sId,'custbody_shipper_bill_adds',JSON.stringify(baddress), true );
			nlapiLogExecution("debug","baddress",JSON.stringify(baddress));
		}
	    if(request.getParameter('custpage_so_hide')==null)
		{
			try
			{				
				/*if(request.getParameter('custpage_so_hide')=='T')
				{
					-
				}*/
				var form = nlapiCreateForm('Review Items Returning to BE');		
				form.addSubmitButton('Execute');		
				form.addButton('custpage_back', 'Back', "window.history.go(-1);");
				form.addButton('custpage_close', 'Close', "window.close();" ); 	
				//var select = form.addField('custpage_selectfield_two','select','IS THIS A MATCHED WEDDING BAND ORDER').setMandatory(true).setDisplayType("inline");				
				//select.addSelectOption('1','No');
				//select.addSelectOption('2','Yes');
				//select.setDefaultValue(request.getParameter('custpage_selectfield'));				
				var sublist = form.addSubList('custpage_items_two', 'list', 'Items');
				//sublist.addField("sublist_check_two","text","Returning to BE");
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
				//form.addField('custpage_chk_wbo','checkbox', 'Is this a matched wedding band order').setDefaultValue(isCheck); //commented as per Chelsea's feedback datedd:08/08/2016
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
			catch(err)
			{
				nlapiLogExecution("error","Error raised on next button click is :",err.message);
			}
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
}
function SetBillState(name) 
{
    var state = [{"value":"","text":""},{"value":"AL","text":"Alabama"},{"value":"AK","text":"Alaska"},{"value":"AZ","text":"Arizona"},{"value":"AR","text":"Arkansas"},{"value":"AA","text":"Armed Forces Americas"},{"value":"AE","text":"Armed Forces Europe"},{"value":"AP","text":"Armed Forces Pacific"},{"value":"CA","text":"California"},{"value":"CO","text":"Colorado"},{"value":"CT","text":"Connecticut"},{"value":"DE","text":"Delaware"},{"value":"DC","text":"District of Columbia"},{"value":"FL","text":"Florida"},{"value":"GA","text":"Georgia"},{"value":"HI","text":"Hawaii"},{"value":"ID","text":"Idaho"},{"value":"IL","text":"Illinois"},{"value":"IN","text":"Indiana"},{"value":"IA","text":"Iowa"},{"value":"KS","text":"Kansas"},{"value":"KY","text":"Kentucky"},{"value":"LA","text":"Louisiana"},{"value":"ME","text":"Maine"},{"value":"MD","text":"Maryland"},{"value":"MA","text":"Massachusetts"},{"value":"MI","text":"Michigan"},{"value":"MN","text":"Minnesota"},{"value":"MS","text":"Mississippi"},{"value":"MO","text":"Missouri"},{"value":"MT","text":"Montana"},{"value":"NE","text":"Nebraska"},{"value":"NV","text":"Nevada"},{"value":"NH","text":"New Hampshire"},{"value":"NJ","text":"New Jersey"},{"value":"NM","text":"New Mexico"},{"value":"NY","text":"New York"},{"value":"NC","text":"North Carolina"},{"value":"ND","text":"North Dakota"},{"value":"OH","text":"Ohio"},{"value":"OK","text":"Oklahoma"},{"value":"OR","text":"Oregon"},{"value":"PA","text":"Pennsylvania"},{"value":"PR","text":"Puerto Rico"},{"value":"RI","text":"Rhode Island"},{"value":"SC","text":"South Carolina"},{"value":"SD","text":"South Dakota"},{"value":"TN","text":"Tennessee"},{"value":"TX","text":"Texas"},{"value":"UT","text":"Utah"},{"value":"VT","text":"Vermont"},{"value":"VA","text":"Virginia"},{"value":"WA","text":"Washington"},{"value":"WV","text":"West Virginia"},{"value":"WI","text":"Wisconsin"},{"value":"WY","text":"Wyoming"}];
    //var option = '';
    for (i = 0; i < state.length; i++) 
	{
		if (state[i].value == name) 
		{
            return state[i].text;
        }
        /*if (state[i].value == name) 
		{
            option = option + '<option value="' + state[i].value + '" selected >' + state[i].text + '</option>';
        }
		else 
		{
            option = option + '<option value="' + state[i].value + '">' + state[i].text + '</option>';
        }*/
    }
	return '';
    //return option;
}


function pdfView(lines,request,response,orderId)
{
	try
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
		
		var custFields = ['entityid', 'firstname', 'lastname', 'altemail', 'altname'];
        var custRecord = nlapiLookupField('customer', customerId, custFields);
        var firstName = custRecord.firstname;
        var lastName = custRecord.lastname;
	    //Get Address in break
		var billAddsArr='';
		var billAddStr='';		
		var bill_add = soRecord.custbody_shipper_bill_adds;
		if(bill_add != null && bill_add != "")
		{
			bill_add	=	JSON.parse(bill_add);
			billAdds = firstName +' ' + lastName + ', '+bill_add[0].street +"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+bill_add[0].city +" "+bill_add[0].state+" "+bill_add[0].zip+", "+bill_add[0].country;			
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
		switch(currency)
		{
			case "1":
				currency = "USD";
				break;
			case "3":
				currency = "CAD";
				break;
			case "5":
				currency = "AUD";
				break;
			default:
				currency = "USD";
				break;
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
			//var itemName=nlapiLookupField('item',itemId,'itemid'); 
			var itemCategory=nlapiLookupField('item',itemId,'custitem20'); 
			
			if(itemCategory=='2' || itemCategory=='7' || itemCategory=='8' || itemCategory=='14' || itemCategory=='15' || itemCategory=='18' || itemCategory=='20' || itemCategory=='31') 
			{   
				itemArr1.push({itemName:itemName,itemAmt:itemAmt,itemCategory:itemCategory});
			}
			else
			{
				itemArr2.push({itemName:itemName,itemAmt:itemAmt});
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
			itemArr.push({itemName:itemDes,itemAmt:totAmt1});
		}
		
      
		if(itemArr2.length>0)
		{
		    //  itemArr.push(itemArr2);
			for(var k=0;k<itemArr2.length;k++)
			{
				itemArr.push({itemName:itemArr2[k].itemName,itemAmt:itemArr2[k].itemAmt});
			}
		}
		//End//
			
		var htmlStr="<h4 align='center' style='padding:50px 0px 0px 0px;' class='pt12'>Foreign Shipper's Declaration of U.S. Goods Returned</h4><br/><br/>";
		htmlStr +="<table width='500' border='0' align='center' cellpadding='2' cellspacing='1' style='font-family:Arial, Helvetica, sans-serif'>";
		var userName=firstName+' '+lastName;
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
			var totAmt=parseFloat(itemArr[n].itemAmt); 			
			if(totAmt=='' || totAmt==null)
			{
				totAmt=0;
			}
			nlapiLogExecution("debug","Test1",itemDesc);
			grandTot= parseFloat(grandTot) + parseFloat(totAmt);
			totAmt=totAmt.toFixed(2);
			htmlStr +="<tr>";
			htmlStr +="<td class='pt10' height='20'  valign='middle' align='center' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-left:solid; border-right:solid'>N/A</td>";
			htmlStr +="<td class='pt10' height='20' valign='middle' align='center' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'>N/A</td>";
			htmlStr +="<td class='pt10' height='20' valign='middle' align='center' bgcolor='#fff' style='padding:10px !important; border-bottom:solid; border-right:solid'>1</td>";
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
		//response.setContentType("PDF","ShipperDeclaration_"+soId+".pdf","attachment"); // for direct doenload on client browser
		response.write(file.getValue());
		
        file.setName(fileNameStr);		
		file.setFolder(7671491);
		file.setEncoding('UTF-8');
		var fileId = nlapiSubmitFile(file);
        nlapiSubmitField("salesorder",soId,"custbody320",fileId);
	    //  nlapiSetRedirectURL('record', 'salesorder',soId,true);	
	    nlapiLogExecution("debug","Shippers file id is :",fileId);		
	
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error raised on creation of PDF :",err.message);
	}
	
	
}

