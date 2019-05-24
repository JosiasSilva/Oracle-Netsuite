function bindPendingAddrList(form, obj_result, number_of_result) {
    var html_subtab = form.addField('cutpage_subtab_pending_addr', 'inlineHTML', '', null, 'custpage_pending_addr_tab');
    var sublistPendingAddr = form.addSubList('custpage_pending_addr', 'list', "Pending Address", "custpage_pending_addr_tab");
    sublistPendingAddr.addField('custpage_chk_custpage_pending_addr', 'checkbox', 'Select');
    sublistPendingAddr.addField('custpage_so_doc_number_custpage_pending_addr', 'text', 'Sales Order Number');
    sublistPendingAddr.addField('custpage_so_internal_id_custpage_pending_addr', 'text', 'So Id').setDisplayType('hidden');
    sublistPendingAddr.addField('custpage_customer_custpage_pending_addr', 'text', 'Customer Name');
  	sublistPendingAddr.addField('custpage_ship_addr_custpage_pending_addr', 'text', 'Shipping Address');//.setDisplayType('entry');
    sublistPendingAddr.addField('custpage_edit_address_custpage_pending_addr', 'textarea');
  sublistPendingAddr.addField('custpage_attention_custpage_pending_addr', 'text', 'Attention').setDisplayType('hidden');
	sublistPendingAddr.addField('custpage_addressee_custpage_pending_addr', 'text', 'Addressee').setDisplayType('hidden');
	sublistPendingAddr.addField('custpage_address1_custpage_pending_addr', 'text', 'address1').setDisplayType('hidden');
	sublistPendingAddr.addField('custpage_address2_custpage_pending_addr', 'text', 'address2').setDisplayType('hidden');
	sublistPendingAddr.addField('custpage_city_custpage_pending_addr', 'text', 'city').setDisplayType('hidden');
	sublistPendingAddr.addField('custpage_state_custpage_pending_addr', 'text', 'state').setDisplayType('hidden');
	sublistPendingAddr.addField('custpage_zip_custpage_pending_addr', 'text', 'zip').setDisplayType('hidden');
	sublistPendingAddr.addField('custpage_country_custpage_pending_addr', 'text', 'country').setDisplayType('hidden');
 var fldShipMethod= sublistPendingAddr.addField('custpage_ship_method_custpage_pending_addr', 'select', 'Shipping Method');
  
  var objSO=nlapiCreateRecord('salesorder');
  var objField=objSO.getField('shipmethod');
  var options= objField.getSelectOptions();
   fldShipMethod.addSelectOption('','');
  for(var i=0;i<options.length;i++)
  {
    fldShipMethod.addSelectOption(options[i].getId(),options[i].getText());
  }
  
  sublistPendingAddr.addField('custpage_insurance_custpage_pending_addr', 'currency', 'Insurance').setDisplayType('entry');
   sublistPendingAddr.addField('custpage_box_record_custpage_pending_addr', 'textarea', 'Box Record');
   sublistPendingAddr.addField('custpage_box_record_hidden_custpage_pending_addr', 'text', 'Box Record').setDisplayType('hidden');
    sublistPendingAddr.addField('custpage_delivery_date_notes_custpage_pending_addr', 'textarea', 'Delivery Date Notes').setDisplayType('entry');
    sublistPendingAddr.addField('custpage_materials_tracking_no_custpage_pending_addr', 'text', 'Materials Tracking #').setDisplayType('entry')
     sublistPendingAddr.addField('custpage_item_ship_seperate_hidden_custpage_pending_addr', 'textarea', 'Items Shipping Separately').setDisplayType('hidden');
    sublistPendingAddr.addField('custpage_item_ship_seperate_custpage_pending_addr', 'textarea', 'Items Shipping Separately');
    sublistPendingAddr.addField('custpage_status_item_ship_seperate_custpage_pending_addr', 'select', 'Status of Items Shipping Separately','customlist465')
      

    sublistPendingAddr.addButton("custpage_update_pending_addr", "Update", "UpdateRecords('custpage_pending_addr')");
    sublistPendingAddr.addButton("custpage_markall_pending_addr", "Mark All", "MarkAll('custpage_pending_addr');");
    sublistPendingAddr.addButton("custpage_unmarkall_pending_addr", "Unmark All", "UnMarkAll('custpage_pending_addr');");
	//sublistPendingAddr.addButton("custpage_generate_label_pending_addr", "Generate Labels", "generateLabels('custpage_ready_to_ship');");

    bindPendingAddr(obj_result, sublistPendingAddr, number_of_result);
    var index = 1;
    var html_index;
    for (var i = 0; i < Math.ceil(number_of_result / divided_size); i++) {
        var nextIndex = index + paging_size;
        if (nextIndex > number_of_result)
            nextIndex = number_of_result;
        html_index += '<option value=' + index + '>' + index + ' - ' + nextIndex + '</option>';
        index = nextIndex + 1;
    }
    html_subtab.setDefaultValue("<table width='100%' cellpadding='2' >\
    <tr>\
<td rowspan='3' valign='bottom'>\
            <input style='width:100%' type='text' class='search_key' id='search_key_pending_addr' placeholder='Search By Document Number'>\
        </td>\
        <td rowspan='3' valign='bottom'>\
            <input class='btn_search_key' id='btn_search_key_pending_addr' type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: -1px -2px;    cursor: pointer;'>\
        </td>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >TOTAL RECORDS:</td>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >SELECTED RECORDS:</td>\
        <td rowspan='3' valign='top'  align='right'><br/><select class='page_all_pageing' id='page_all_pageing_pending_addr'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
        <td width='120px' valign='top' ><span class='number_of_record' id='number_of_record_pending_addr'>"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_pending_addr'></td>\
        <td width='120px' valign='top' ><span class='selected_records' id='selected_records_custpage_pending_addr'>0</span>\
        </td>\
    </tr>\
</table>");

var address_field= form.addField("custpage_inlinehtml_address_det_pndg_addr","inlinehtml",'',null,'custpage_pending_addr_tab');
var htmlAddress='\
<script>\
function iconPopPA(element){\
var rowNumber=element.id;\
rowNumber=rowNumber.split("_")[1];\
document.getElementById("rowId_pending_addr").value=rowNumber;\
var addressee=document.getElementsByName("custpage_addressee_custpage_pending_addr"+rowNumber)[0].value;\
 document.getElementById(\'thepopup_pending_addr\').style.display="block";\
 document.getElementById(\'blackoutdiv_pending_addr\').style.display="block";\
 document.getElementById("attention_pending_addr").value=document.getElementsByName("custpage_attention_custpage_pending_addr"+rowNumber)[0].value;\
 document.getElementById("addresse_pending_addr").value=document.getElementsByName("custpage_addressee_custpage_pending_addr"+rowNumber)[0].value;\
 document.getElementById("address1_pending_addr").value=document.getElementsByName("custpage_address1_custpage_pending_addr"+rowNumber)[0].value;\
 document.getElementById("address2_pending_addr").value=document.getElementsByName("custpage_address2_custpage_pending_addr"+rowNumber)[0].value;\
 document.getElementById("zip_pending_addr").value=document.getElementsByName("custpage_zip_custpage_pending_addr"+rowNumber)[0].value;\
if(document.getElementsByName("custpage_country_custpage_pending_addr"+rowNumber)[0].value=="230")\
{\
	 document.getElementById("state_pending_addr").value=document.getElementsByName("custpage_state_custpage_pending_addr"+rowNumber)[0].value;\
}\
else\
{\  document.getElementById("state_text_pending_addr").value=document.getElementsByName("custpage_state_custpage_pending_addr"+rowNumber)[0].value;\
}\
document.getElementById("city_pending_addr").value=document.getElementsByName("custpage_city_custpage_pending_addr"+rowNumber)[0].value;\
document.getElementById("country_pending_addr").value  =document.getElementsByName("custpage_country_custpage_pending_addr"+rowNumber)[0].value;\
}\
function iconUnPopPA(){\
    document.getElementById(\'thepopup_pending_addr\').style.display="none";\
    document.getElementById(\'blackoutdiv_pending_addr\').style.display="none";\
}\
function updateAddressPA()\
  {\
  var rowNumber=parseInt(document.getElementById("rowId_pending_addr").value);\
var rowCollection=document.getElementById("custpage_pending_addr_splits").rows;var addressFromCurrentRow=rowCollection[rowNumber].cells[4].innerHTML;var\ linesOfCurrentAddress=addressFromCurrentRow.split(\'<br>\');\
  var attention=document.getElementById("attention_pending_addr").value;\
  var addresse=document.getElementById("addresse_pending_addr").value;\
  var address1=document.getElementById("address1_pending_addr").value;\
  var address2=document.getElementById("address2_pending_addr").value;\
  var zip=document.getElementById("zip_pending_addr").value;\
 var country=document.getElementById("country_pending_addr");\
   var city=document.getElementById("city_pending_addr").value;\
   var CountryText=country.options[country.selectedIndex].text;\
var state="";\
if(country.value=="230")\
{\
  state =document.getElementById("state_pending_addr").value;\
}\
else\
{\
  state =document.getElementById("state_text_pending_addr").value;\
}\
	document.getElementsByName("custpage_attention_custpage_pending_addr"+rowNumber)[0].value=attention;\
	document.getElementsByName("custpage_addressee_custpage_pending_addr"+rowNumber)[0].value=addresse;\
	document.getElementsByName("custpage_address1_custpage_pending_addr"+rowNumber)[0].value= address1;\
	document.getElementsByName("custpage_address2_custpage_pending_addr"+rowNumber)[0].value =address2;\
	document.getElementsByName("custpage_zip_custpage_pending_addr"+rowNumber)[0].value=zip;\
	document.getElementsByName("custpage_state_custpage_pending_addr"+rowNumber)[0].value =state;\
	document.getElementsByName("custpage_city_custpage_pending_addr"+rowNumber)[0].value=city;\
	document.getElementsByName("custpage_country_custpage_pending_addr"+rowNumber)[0].value =country.value;\
var completeAddress=attention;\
if(addresse && addresse!=" ")\
                                  {\
                                  completeAddress+="<br>"+addresse;\
                                  }\
if(address1 && address1!=" ")\
                                  {\
                                  completeAddress+="<br>"+address1;\
                                  }\
if(address2 && address2!=" ")\
{\
completeAddress+="<br>"+address2;\
}\
 completeAddress+="<br>"+city+" "+state+" "+zip+"<br>"+CountryText;\
document.getElementById("custpage_chk_custpage_pending_addr"+rowNumber).onchange();\
 rowCollection[rowNumber].cells[4].innerHTML=completeAddress;\
iconUnPopPA();\
}\
function hideShowStatePA()\
{\
  var country= document.getElementById("country_pending_addr").value;\
  if(country=="230")\
  {\
   	document.getElementById("state_text_pending_addr").style.display = "none";\
	document.getElementById("state_pending_addr").style.display = "inline";\
  }\
  else\
  {\
      document.getElementById("state_text_pending_addr").style.display = "inline";\
 	  document.getElementById("state_pending_addr").style.display = "none";\
  }\
}\
</script>\
\
<!--this is the blackout div that blacks out the rest of the page when popup is popped:-->\
<div onclick="iconUnPopPA();" id="blackoutdiv_pending_addr" style="position:fixed; overflow: auto; width:100%; height:100%; top:0px; left:0px;background-color:#222;opacity:0.6;z-index:9999;display:none"></div>\
\
<!--this is the popup html:-->\
<div id="thepopup_pending_addr" style="position:fixed; width:350px; right:auto;buttom:auto;top:20%;left:auto; margin-left:-63%;border:3px solid #24385b;background-color:white;z-index:99999;padding:15px;-webkit-border-radius:5px;border-radius:5px;display:none;"><span id="popcontent_pending_addr"><table><tr><td></td><td><input type="hidden" id="rowId_pending_addr"/></td></tr><tr><td>Attention:</td><td><input type="text" id="attention_pending_addr"/></td></tr><tr><td>Addresee:</td><td><input type="text" id="addresse_pending_addr"/></td></tr><tr><td>Address1:</td><td><input type="text" id="address1_pending_addr"/></td></tr><tr><td>Address2:</td><td><input type="text" id="address2_pending_addr"/></td></tr><tr><td>City:</td><td><input type="text" id="city_pending_addr"/></td></tr><tr><td>Zip</td><td><input type="text" id="zip_pending_addr"/></td></tr><tr><td>Country</td><td><select id="country_pending_addr" onchange="hideShowStatePA();">';
	var objBox=nlapiCreateRecord('customrecord_box_record');
	var country=objBox.getField('custrecord_box_country');
	var countryOptions= country.getSelectOptions();
	for(var i=0;i<countryOptions.length;i++)
	{
	  htmlAddress+="<option value="+countryOptions[i].getId()+">"+countryOptions[i].getText()+"</option>";
	}
	htmlAddress+='</select></td></tr><tr><td>State:</td><td><select id="state_pending_addr"><option value=""></option><option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="AA">Armed Forces Americas</option><option value="AE">Armed Forces Europe</option><option value="AP">Armed Forces Pacific</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="DC">District of Columbia</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="PR">Puerto Rico</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option><option value="AB">Alberta, CA</option></select><input type="text" id="state_text_pending_addr" style="display:none" /> </td></tr><tr><td colspan="2">&nbsp;</td></tr> <tr><td colspan="2" align="center"><span onclick="updateAddressPA();" style="border: none;\
    background-color: #008CBA;\
    color: white;\
    padding: 5px 18px;\
    text-align: center;\
    text-decoration: none;\
    display: inline-block;\
    font-size: 12px;\
    margin: -1px -2px;\
    cursor: pointer;" title="Close Window!">Update</span> &nbsp;&nbsp;&nbsp;<span onclick="iconUnPopPA();" style="border: none;\
    background-color: #008CBA;\
    color: white;\
    padding: 5px 18px;\
    text-align: center;\
    text-decoration: none;\
    display: inline-block;\
    font-size: 12px;\
    margin: -1px -2px;\
    cursor: pointer;" title="Close Window!">Cancel</span></td></tr></table></span></div>';
	address_field.setDefaultValue(htmlAddress);


}


function bindPendingAddr(results, sublistPendingAddr, number_of_result) {
    if (results) {
        var sublistPendingAddr_Arr = [];
        try {
            var col = results[0].getAllColumns();
            for (var i = 0; i < results.length; i++) {
            var index_value_new=(i+1)+'';
			var item_ship_sep_obj=[];
			var get_item_ship_sep_value=results[i].getValue(col[8]);
			if(get_item_ship_sep_value){item_ship_sep_obj=get_item_ship_sep_value.split(','); }    
			var item_ship_sep_html= bindItemShipSepPA(item_ship_sep_obj,index_value_new,'custpage_pending_addr');
            var box_ids='',box_id_hidden='';
            var columns=new Array();
            columns.push(new nlobjSearchColumn('internalid').setSort(true));//custrecord_box_country
            columns.push(new nlobjSearchColumn('custrecord_box_country'));
            columns.push(new nlobjSearchColumn('custrecord_box_attention'));
            columns.push(new nlobjSearchColumn('custrecord_box_addressee'));
            columns.push(new nlobjSearchColumn('custrecord_box_address1'));
            columns.push(new nlobjSearchColumn('custrecord_box_address2'));
            columns.push(new nlobjSearchColumn('custrecord_box_city'));
            columns.push(new nlobjSearchColumn('custrecord_box_state'));
            columns.push(new nlobjSearchColumn('custrecord_box_zip'));
            columns.push(new nlobjSearchColumn('custrecord_box_tracking_id'));
            columns.push(new nlobjSearchColumn('custrecord_box_shipping_method'));
            columns.push(new nlobjSearchColumn('custrecord_box_insurance_value'));

            var search=nlapiSearchRecord('customrecord_box_record',null,new nlobjSearchFilter('custrecord_box_record_transaction',null,'anyof',results[i].getId()),columns);
            var shipping_addr='',custrecord_box_country='',custrecord_box_country_id='',custrecord_box_attention='',custrecord_box_addressee='',custrecord_box_address1='';
			var custrecord_box_address2='',custrecord_box_city='',custrecord_box_state='',custrecord_box_zip='';
            var custrecord_box_tracking_id='';
            var custrecord_box_shipping_method='';
            var custrecord_box_insurance_value='';
            if(search)
            {
               box_ids="<a href='/app/common/custom/custrecordentry.nl?rectype=707&id="+search[0].getId()+"' target='_blank' style='color:blue' >"+search[0].getId()+"</a>";
			   box_id_hidden=search[0].getId();
               custrecord_box_country=search[0].getText('custrecord_box_country'); 
			   custrecord_box_country_id=search[0].getValue('custrecord_box_country'); 
                custrecord_box_attention=search[0].getValue('custrecord_box_attention');
               custrecord_box_addressee=search[0].getValue('custrecord_box_addressee');
                custrecord_box_address1=search[0].getValue('custrecord_box_address1');
                custrecord_box_address2=search[0].getValue('custrecord_box_address2');
                custrecord_box_city=search[0].getValue('custrecord_box_city');
                custrecord_box_state=search[0].getValue('custrecord_box_state');
                custrecord_box_zip=search[0].getValue('custrecord_box_zip');
				
				var shipping_addr=custrecord_box_attention;
             	if(custrecord_box_addressee && custrecord_box_addressee!=" ")
				{
                	shipping_addr+="<br>"+custrecord_box_addressee;
                }
				if(custrecord_box_address1 && custrecord_box_address1!=" ")
				{
					shipping_addr+="<br>"+custrecord_box_address1;
				}
				if(custrecord_box_address2 && custrecord_box_address2!=" ")
				{
				shipping_addr+="<br>"+custrecord_box_address2;
				}
				 shipping_addr+="<br>"+custrecord_box_city+" "+custrecord_box_state+" "+custrecord_box_zip+"<br>"+custrecord_box_country;
				
             //  shipping_addr=custrecord_box_addressee+"<br/>"+custrecord_box_address1+"<br/>"+custrecord_box_address2+"<br/>"+custrecord_box_city+", "+custrecord_box_state+", "+custrecord_box_zip+"<br/>"+custrecord_box_country;
              
                custrecord_box_tracking_id=search[0].getValue('custrecord_box_tracking_id');
                custrecord_box_shipping_method=search[0].getValue('custrecord_box_shipping_method');
                custrecord_box_insurance_value=search[0].getValue('custrecord_box_insurance_value');
            }
              
			  var editAddrPop='';
			  if(box_ids)
			  {
				 editAddrPop =getEditPopUpPA(results[i].getValue(col[2]),i);
			  }

                sublistPendingAddr_Arr.push({
                  //  custpage_so_doc_number_custpage_ready_to_ship: results[i].getValue(col[0]),
                   custpage_so_doc_number_custpage_pending_addr:"<a href='/app/accounting/transactions/salesord.nl?id="+results[i].getId()+"' target='_blank' style='color:blue' >"+results[i].getValue(col[0])+"</a>",
                  	custpage_so_internal_id_custpage_pending_addr: results[i].getId(),
                  //  custpage_customer_custpage_ready_to_ship: results[i].getValue(col[1]),
                   custpage_customer_custpage_pending_addr: "<a href='/app/common/entity/custjob.nl?id="+results[i].getValue(col[1])+"' target='_blank' style='color:blue' >"+results[i].getText(col[1])+"</a>",
                   custpage_ship_addr_custpage_pending_addr: shipping_addr,
				   	custpage_edit_address_custpage_pending_addr:editAddrPop,
                    custpage_ship_method_custpage_pending_addr: custrecord_box_shipping_method,
		            custpage_insurance_custpage_pending_addr: custrecord_box_insurance_value,
                    custpage_box_record_custpage_pending_addr: box_ids,  
					custpage_box_record_hidden_custpage_pending_addr: box_id_hidden,
                    custpage_delivery_date_notes_custpage_pending_addr: results[i].getValue(col[6]),
                    custpage_materials_tracking_no_custpage_pending_addr: custrecord_box_tracking_id,
                    custpage_item_ship_seperate_hidden_custpage_pending_addr: get_item_ship_sep_value,
                    custpage_item_ship_seperate_custpage_pending_addr: item_ship_sep_html,
                    custpage_status_item_ship_seperate_custpage_pending_addr: results[i].getValue(col[9]),
                  custpage_attention_custpage_pending_addr:custrecord_box_attention ,
					custpage_addressee_custpage_pending_addr:custrecord_box_addressee ,
					custpage_address1_custpage_pending_addr: custrecord_box_address1 ,
					custpage_address2_custpage_pending_addr: custrecord_box_address2 ,
					custpage_city_custpage_pending_addr:custrecord_box_city ,
					custpage_state_custpage_pending_addr:custrecord_box_state ,
					custpage_zip_custpage_pending_addr : custrecord_box_zip ,
					custpage_country_custpage_pending_addr: custrecord_box_country_id
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in Pending Address', er.message);
        }
        sublistPendingAddr.setLineItemValues(sublistPendingAddr_Arr);
    }
}
function bindItemShipSepPA(item_ship_sep_id,index_number)
{

  var function_call= "onclick=setValueItemShipSepPndgAddr("+index_number+")";
  var item_ship_sep_field="<select multiple width='100px' id='iss_multi_pa_"+index_number+"' "+function_call+">";
  for(var c=0;c<arr_item_ship_sep_value.length;c++)
  {
    var select_value='';
    if(item_ship_sep_id.indexOf(arr_item_ship_sep_value[c])!=-1)
    {
      select_value="selected='true'";
    }     
    item_ship_sep_field+="<option value="+arr_item_ship_sep_value[c]+"  "+select_value+">"+arr_item_ship_sep_text[c]+"</option>";
  }
  item_ship_sep_field+="</select>";
  return item_ship_sep_field;
}
function getEditPopUpPA(shippingAddress,id)
{
  var rownumber=parseInt(id)+1;
  var html='<span><a href="javascript:void(0)" id="row_'+ rownumber +'" onclick="iconPopPA(this);"><img  src="/core/media/media.nl?id=25997732&c=666639&h=d7712bc97b1d8bd5f731"/></a></span>';
  return html;
}