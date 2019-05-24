function bindReadyToShipList(form, obj_result, number_of_result) {
    var html_subtab = form.addField('cutpage_subtab_ready_to_ship', 'inlineHTML', '', null, 'custpage_ready_to_ship_tab');
    var sublistReadyToShip = form.addSubList('custpage_ready_to_ship', 'list', "Ready to Ship", "custpage_ready_to_ship_tab");
	sublistReadyToShip.addField('custpage_chk_custpage_ready_to_ship', 'checkbox', 'Select');
	sublistReadyToShip.addField('custpage_so_doc_number_custpage_ready_to_ship', 'text', 'Sales Order Number');
	sublistReadyToShip.addField('custpage_so_internal_id_custpage_ready_to_ship', 'text', 'So Id').setDisplayType('hidden');
	sublistReadyToShip.addField('custpage_customer_custpage_ready_to_ship', 'text', 'Customer Name');
	sublistReadyToShip.addField('custpage_ship_addr_custpage_ready_to_ship', 'text', 'Shipping Address');//.setDisplayType('entry');
	sublistReadyToShip.addField('custpage_edit_address', 'textarea');
 	sublistReadyToShip.addField('custpage_attention_custpage_ready_to_ship', 'text', 'Attention').setDisplayType('hidden');
	sublistReadyToShip.addField('custpage_addressee_custpage_ready_to_ship', 'text', 'Addressee').setDisplayType('hidden');
	sublistReadyToShip.addField('custpage_address1_custpage_ready_to_ship', 'text', 'address1').setDisplayType('hidden');
	sublistReadyToShip.addField('custpage_address2_custpage_ready_to_ship', 'text', 'address2').setDisplayType('hidden');
	sublistReadyToShip.addField('custpage_city_custpage_ready_to_ship', 'text', 'city').setDisplayType('hidden');
	sublistReadyToShip.addField('custpage_state_custpage_ready_to_ship', 'text', 'state').setDisplayType('hidden');
	sublistReadyToShip.addField('custpage_zip_custpage_ready_to_ship', 'text', 'zip').setDisplayType('hidden');
	sublistReadyToShip.addField('custpage_country_custpage_ready_to_ship', 'text', 'country').setDisplayType('hidden');
	
  var fldShipMethod= sublistReadyToShip.addField('custpage_ship_method_custpage_ready_to_ship', 'select', 'Shipping Method');
  var objSO=nlapiCreateRecord('salesorder');
  var objField=objSO.getField('shipmethod');
  var options= objField.getSelectOptions();
  fldShipMethod.addSelectOption('','');
  for(var i=0;i<options.length;i++)
  {
    fldShipMethod.addSelectOption(options[i].getId(),options[i].getText());
  }

  sublistReadyToShip.addField('custpage_insurance_custpage_ready_to_ship', 'currency', 'Insurance').setDisplayType('entry');
   sublistReadyToShip.addField('custpage_box_record_custpage_ready_to_ship', 'textarea', 'Box Record');
   sublistReadyToShip.addField('custpage_box_record_hidden_custpage_ready_to_ship', 'text', 'Box Record').setDisplayType('hidden');
    sublistReadyToShip.addField('custpage_delivery_date_notes_custpage_ready_to_ship', 'textarea', 'Delivery Date Notes').setDisplayType('entry');
    sublistReadyToShip.addField('custpage_materials_tracking_no_custpage_ready_to_ship', 'text', 'Materials Tracking #').setDisplayType('entry')
     sublistReadyToShip.addField('custpage_item_ship_seperate_hidden_custpage_ready_to_ship', 'textarea', 'Items Shipping Separately').setDisplayType('hidden');
    sublistReadyToShip.addField('custpage_item_ship_seperate_custpage_ready_to_ship', 'textarea', 'Items Shipping Separately');
    sublistReadyToShip.addField('custpage_status_item_ship_seperate_custpage_ready_to_ship', 'select', 'Status of Items Shipping Separately','customlist465')
      

    sublistReadyToShip.addButton("custpage_update_ready_to_ship", "Update", "UpdateRecords('custpage_ready_to_ship')");
    sublistReadyToShip.addButton("custpage_markall_ready_to_ship", "Mark All", "MarkAll('custpage_ready_to_ship');");
    sublistReadyToShip.addButton("custpage_unmarkall_ready_to_ship", "Unmark All", "UnMarkAll('custpage_ready_to_ship');");
	sublistReadyToShip.addButton("custpage_generate_label_ready_to_ship", "Generate Labels", "generateLabels('custpage_ready_to_ship');");

    bindReadyToShip(obj_result, sublistReadyToShip, number_of_result);
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
            <input style='width:100%' type='text' class='search_key' id='search_key_ready_to_ship' placeholder='Search By Document Number'>\
        </td>\
        <td rowspan='3' valign='bottom'>\
            <input class='btn_search_key' id='btn_search_key_ready_to_ship' type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: -1px -2px;    cursor: pointer;'>\
        </td>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >TOTAL RECORDS:</td>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >SELECTED RECORDS:</td>\
        <td rowspan='3' valign='top'  align='right'><br/><select class='page_all_pageing' id='page_all_pageing_ready_to_ship'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
        <td width='120px' valign='top' ><span class='number_of_record' id='number_of_record_ready_to_ship'>"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_ready_to_ship'></td>\
        <td width='120px' valign='top' ><span class='selected_records' id='selected_records_custpage_ready_to_ship'>0</span>\
        </td>\
    </tr>\
</table>");


var address_field= form.addField("custpage_inlinehtml_address_det","inlinehtml",'',null,'custpage_ready_to_ship_tab');
var htmlAddress='\
<script>\
function iconPop(element){\
var rowNumber=element.id;\
document.getElementById("rowId").value=rowNumber;\
var addressee=document.getElementsByName("custpage_addressee_custpage_ready_to_ship"+rowNumber)[0].value;\
 document.getElementById(\'thepopup\').style.display="block";\
 document.getElementById(\'blackoutdiv\').style.display="block";\
document.getElementById("attention").value=document.getElementsByName("custpage_attention_custpage_ready_to_ship"+rowNumber)[0].value;\
 document.getElementById("addresse").value=document.getElementsByName("custpage_addressee_custpage_ready_to_ship"+rowNumber)[0].value;\
 document.getElementById("address1").value=document.getElementsByName("custpage_address1_custpage_ready_to_ship"+rowNumber)[0].value;\
 document.getElementById("address2").value=document.getElementsByName("custpage_address2_custpage_ready_to_ship"+rowNumber)[0].value;\
 document.getElementById("zip").value=document.getElementsByName("custpage_zip_custpage_ready_to_ship"+rowNumber)[0].value;\
if(document.getElementsByName("custpage_country_custpage_ready_to_ship"+rowNumber)[0].value=="230")\
{\
   document.getElementById("state").value=document.getElementsByName("custpage_state_custpage_ready_to_ship"+rowNumber)[0].value;\
}\
else\
{\
   document.getElementById("state_text").value=document.getElementsByName("custpage_state_custpage_ready_to_ship"+rowNumber)[0].value;\
}\
document.getElementById("city").value=document.getElementsByName("custpage_city_custpage_ready_to_ship"+rowNumber)[0].value;\
document.getElementById("country").value  =document.getElementsByName("custpage_country_custpage_ready_to_ship"+rowNumber)[0].value;\
}\
function iconUnPop(){\
    document.getElementById(\'thepopup\').style.display="none";\
    document.getElementById(\'blackoutdiv\').style.display="none";\
}\
function updateAddress()\
  {\
  var rowNumber=parseInt(document.getElementById("rowId").value);\
var rowCollection=document.getElementById("custpage_ready_to_ship_splits").rows;var addressFromCurrentRow=rowCollection[rowNumber].cells[4].innerHTML;var\ linesOfCurrentAddress=addressFromCurrentRow.split(\'<br>\');\
  var attention=document.getElementById("attention").value;\
  var addresse=document.getElementById("addresse").value;\
  var address1=document.getElementById("address1").value;\
  var address2=document.getElementById("address2").value;\
  var zip=document.getElementById("zip").value;\
   var city=document.getElementById("city").value;\
  var country=document.getElementById("country");\
  var CountryText=country.options[country.selectedIndex].text;\
var state="";\
if(country.value=="230")\
{\
  state =document.getElementById("state").value;\
}\
else\
{\
  state =document.getElementById("state_text").value;\
}\
	document.getElementsByName("custpage_attention_custpage_ready_to_ship"+rowNumber)[0].value=attention;\
	document.getElementsByName("custpage_addressee_custpage_ready_to_ship"+rowNumber)[0].value=addresse;\
	document.getElementsByName("custpage_address1_custpage_ready_to_ship"+rowNumber)[0].value= address1;\
	document.getElementsByName("custpage_address2_custpage_ready_to_ship"+rowNumber)[0].value =address2;\
	document.getElementsByName("custpage_zip_custpage_ready_to_ship"+rowNumber)[0].value=zip;\
	document.getElementsByName("custpage_state_custpage_ready_to_ship"+rowNumber)[0].value =state;\
	document.getElementsByName("custpage_city_custpage_ready_to_ship"+rowNumber)[0].value=city;\
	document.getElementsByName("custpage_country_custpage_ready_to_ship"+rowNumber)[0].value =country.value;\
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
document.getElementById("custpage_chk_custpage_ready_to_ship"+rowNumber).onchange();\
 rowCollection[rowNumber].cells[4].innerHTML=completeAddress;\
iconUnPop();\
}\
function hideShowState()\
{\
  var country= document.getElementById("country").value;\
  if(country=="230")\
  {\
   	document.getElementById("state_text").style.display = "none";\
	document.getElementById("state").style.display = "inline";\
  }\
  else\
  {\
      document.getElementById("state_text").style.display = "inline";\
 	  document.getElementById("state").style.display = "none";\
  }\
}\
</script>\
\
<!--this is the blackout div that blacks out the rest of the page when popup is popped:-->\
<div onclick="iconUnPop();" id="blackoutdiv" style="position:fixed; overflow: auto; width:100%; height:100%; top:0px; left:0px;background-color:#222;opacity:0.6;z-index:9999;display:none"></div>\
\
<!--this is the popup html:-->\
<div id="thepopup" style="position:fixed; width:350px; right:auto;buttom:auto;top:20%;left:auto; margin-left:-63%;border:3px solid #24385b;background-color:white;z-index:99999;padding:15px;-webkit-border-radius:5px;border-radius:5px;display:none;"><span id="popcontent"><table><tr><td></td><td><input type="hidden" id="rowId"/></td></tr><tr><td>Attention:</td><td><input type="text" id="attention"/></td></tr><tr><td>Addresee:</td><td><input type="text" id="addresse"/></td></tr><tr><td>Address1:</td><td><input type="text" id="address1"/></td></tr><tr><td>Address2:</td><td><input type="text" id="address2"/></td></tr><tr><td>City:</td><td><input type="text" id="city"/></td></tr><tr><td>Zip</td><td><input type="text" id="zip"/></td></tr><tr><td>Country</td><td><select id="country" onchange="hideShowState();">';
	var objBox=nlapiCreateRecord('customrecord_box_record');
	var country=objBox.getField('custrecord_box_country');
	var countryOptions= country.getSelectOptions();
	for(var i=0;i<countryOptions.length;i++)
	{
	  htmlAddress+="<option value="+countryOptions[i].getId()+">"+countryOptions[i].getText()+"</option>";
	}
	htmlAddress+='</select></td></tr><tr><td>State:</td><td><select id="state"><option value=""></option><option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="AA">Armed Forces Americas</option><option value="AE">Armed Forces Europe</option><option value="AP">Armed Forces Pacific</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="DC">District of Columbia</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="PR">Puerto Rico</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option><option value="AB">Alberta, CA</option></select><input type="text" id="state_text" style="display:none" /> </td></tr><tr><td colspan="2">&nbsp;</td></tr> <tr><td colspan="2" align="center"><span onclick="updateAddress();" style="border: none;\
    background-color: #008CBA;\
    color: white;\
    padding: 5px 18px;\
    text-align: center;\
    text-decoration: none;\
    display: inline-block;\
    font-size: 12px;\
    margin: -1px -2px;\
    cursor: pointer;" title="Close Window!">Update</span> &nbsp;&nbsp;&nbsp;<span onclick="iconUnPop();" style="border: none;\
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


function bindReadyToShip(results, sublistReadyToShip, number_of_result) {
    if (results) {
        var sublistReadyToShip_Arr = [];
        try {
            var col = results[0].getAllColumns();
            for (var i = 0; i < results.length; i++) {
            var index_value_new=(i+1)+'';
			var item_ship_sep_obj=[];
			var get_item_ship_sep_value=results[i].getValue(col[8]);
			if(get_item_ship_sep_value){item_ship_sep_obj=get_item_ship_sep_value.split(','); }    
			var item_ship_sep_html= bindItemShipSep(item_ship_sep_obj,index_value_new,'custpage_ready_to_ship');
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
				 editAddrPop =getEditPopUp(results[i].getValue(col[2]),i);
			  }

                sublistReadyToShip_Arr.push({
                  //  custpage_so_doc_number_custpage_ready_to_ship: results[i].getValue(col[0]),
                   custpage_so_doc_number_custpage_ready_to_ship:"<a href='/app/accounting/transactions/salesord.nl?id="+results[i].getId()+"' target='_blank' style='color:blue' >"+results[i].getValue(col[0])+"</a>",
                  	custpage_so_internal_id_custpage_ready_to_ship: results[i].getId(),
                  //  custpage_customer_custpage_ready_to_ship: results[i].getValue(col[1]),
                   custpage_customer_custpage_ready_to_ship: "<a href='/app/common/entity/custjob.nl?id="+results[i].getValue(col[1])+"' target='_blank' style='color:blue' >"+results[i].getText(col[1])+"</a>",
                    custpage_ship_addr_custpage_ready_to_ship: shipping_addr,
					custpage_edit_address:editAddrPop,
                    custpage_ship_method_custpage_ready_to_ship: custrecord_box_shipping_method,
                    custpage_insurance_custpage_ready_to_ship: custrecord_box_insurance_value,
                    custpage_box_record_custpage_ready_to_ship: box_ids,  
					custpage_box_record_hidden_custpage_ready_to_ship: box_id_hidden,					
                    custpage_delivery_date_notes_custpage_ready_to_ship: results[i].getValue(col[6]),
                    custpage_materials_tracking_no_custpage_ready_to_ship: custrecord_box_tracking_id,
                    custpage_item_ship_seperate_hidden_custpage_ready_to_ship: get_item_ship_sep_value,
                    custpage_item_ship_seperate_custpage_ready_to_ship: item_ship_sep_html,
                    custpage_status_item_ship_seperate_custpage_ready_to_ship: results[i].getValue(col[9]),
                    custpage_attention_custpage_ready_to_ship: custrecord_box_attention,
					custpage_addressee_custpage_ready_to_ship:custrecord_box_addressee ,
					custpage_address1_custpage_ready_to_ship : custrecord_box_address1 ,
					custpage_address2_custpage_ready_to_ship: custrecord_box_address2 ,
					custpage_city_custpage_ready_to_ship:custrecord_box_city ,
					custpage_state_custpage_ready_to_ship:custrecord_box_state ,
					custpage_zip_custpage_ready_to_ship : custrecord_box_zip ,
					custpage_country_custpage_ready_to_ship: custrecord_box_country_id
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in Ready to Ship', er.message);
        }
        sublistReadyToShip.setLineItemValues(sublistReadyToShip_Arr);
    }
}
function bindItemShipSep(item_ship_sep_id,index_number,sublistId)
{
  var function_call= "onclick=setValueItemShipSep("+index_number+")";
  var item_ship_sep_field="<select multiple width='100px' id='iss_multi_"+index_number+"' "+function_call+">";
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
function getEditPopUp(shippingAddress,id)
{
  var rownumber=parseInt(id)+1;
  var html='<span><a href="javascript:void(0)" id="'+ rownumber +'" onclick="iconPop(this);"><img  src="/core/media/media.nl?id=25997732&c=666639&h=d7712bc97b1d8bd5f731"/></a></span>';
  return html;
}