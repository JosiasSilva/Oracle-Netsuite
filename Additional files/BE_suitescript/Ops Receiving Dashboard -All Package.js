function Add_field_on_Sublist_all_package(form,results)
{
  try
  {
    var Sublist_all_package = form.addSubList('custpage_all_packages', 'list',"All Packages","custpage_all_tab_one");
    Sublist_all_package.addField('custpage_received_chk','checkbox','Received');
    Sublist_all_package.addField('custpage_team','select','Team','customlist_team');  
    Sublist_all_package.addField('custpage_sales_order_all_package','text','Sales Order / Return Authorization Link');   
    Sublist_all_package.addField('custpage_cdp_all_package','text','CPR LINK'); 
    Sublist_all_package.addField('custpage_tracking_id','text','Tracking ID');
    Sublist_all_package.addField('custpage_status','textarea','Status');
    Sublist_all_package.addField('custpage_shipped_by','text','Shipped by').setDisplayType('entry');
    Sublist_all_package.addField('custpage_shipper_address','text','Shipper Address');
    Sublist_all_package.addField('custpage_recipient_contact_name','text','Recipient Contact Name').setDisplayType("hidden");
    Sublist_all_package.addField('custpage_recipient_address','text','Recipient Address');
    Sublist_all_package.addField('custpage_account_number','text','Account_Number').setDisplayType("hidden");
    Sublist_all_package.addField('custpage_reference','text','Reference');
    Sublist_all_package.addField('custpage_or_items_package','textarea','OR Items').setDisplayType("hidden");
    Sublist_all_package.addField('custpage_or_items_old_package','textarea').setDisplayType("hidden");
    Sublist_all_package.addField('custpage_internal_id', 'text', 'ID').setDisplayType('hidden');
    Sublist_all_package.addField('custpage_received_chk_old', 'checkbox').setDisplayType('hidden');
    Sublist_all_package.addField('custpage_team_old','select','Team','customlist_team').setDisplayType('hidden');
    Sublist_all_package.addField('custpage_shipped_by_old','text','Shipped by').setDisplayType("hidden");
    Sublist_all_package.addRefreshButton();
    Sublist_all_package.addButton("custpage_add_package", "Add Package","window.onbeforeunload = null;nlOpenWindow('/app/common/custom/custrecordentry.nl?rectype=548&label=Package Record&target=custpage_all_packages:custpage_team1','Package Record',800,500,'custcol_package_record',true)");
    Sublist_all_package.addButton("custpage_update_package", "Update Orders","Update_Order_Package()");
    var Sublist_all_package_Arr=[];
    if(results)
    {   
      try
      {
        var col=results[0].getAllColumns();  
        for(var i=0;i<results.length;i++)
        {

          var sales_order_link='';
          var transction_id_get=results[i].getValue('custrecord_transaction_record');
          if(transction_id_get)
          {
            var get_trans_info= nlapiLookupField ( 'transaction' , transction_id_get ,['type','tranid'] );
            var type_value=get_trans_info.type;
            type_value=type_value.toLowerCase();           
            sales_order_link='<a href=/app/accounting/transactions/'+type_value+'.nl?id=' + transction_id_get + ' target=_blank>'+ get_trans_info.tranid +'</a>';
          }
          Sublist_all_package_Arr.push({
            custpage_cdp_all_package        :   results[i].getValue(col[0]),
            custpage_tracking_id		    :	results[i].getValue(col[1]),
            custpage_status				    :	results[i].getValue(col[2]),
            custpage_internal_id            :   results[i].getId(),
            custpage_team				    :	results[i].getValue('custrecord_team'),
            custpage_team_old:results[i].getValue('custrecord_team'),
            custpage_shipped_by			    :	results[i].getValue('custrecord_shipped_by'),
            custpage_shipper_address	    :	results[i].getValue('custrecord_shipper_address'),
            custpage_recipient_contact_name :	results[i].getValue('custrecord_recipient_contact_name'),
            custpage_recipient_address	    :	results[i].getValue('custrecord_recipient_address'),
            custpage_account_number		    :	results[i].getValue('custrecord_account_number'),
            custpage_reference			    :	results[i].getValue('custrecord_reference'),
            custpage_received_chk_old       :   results[i].getValue('custrecord_received'),
            custpage_sales_order_all_package:   sales_order_link,
            custpage_shipped_by_old:results[i].getValue('custrecord_shipped_by')
          });
        }
      }
      catch(er){nlapiLogExecution ( 'debug' ,er.message ) }
      Sublist_all_package.setLineItemValues(Sublist_all_package_Arr);
    }
  }
  catch(er)
  {
    nlapiLogExecution ( 'debug' ,er.message ) 
  }
}
function Paging_first(numOrders,form,page_index,team,drop_off,search_key,selected_order)
{
 // nlapiLogExecution ( 'debug' ,'search_key' ,search_key);
  var select_status=['','','','','',''];
  if(selected_order)
  {
    if(selected_order=='1')
    {
      select_status[1]="selected='selected'";
    }
    else if(selected_order=='2')
    {
      select_status[2]="selected='selected'";
    }
    else if(selected_order=='3')
    {
      select_status[3]="selected='selected'";
    }
    else if(selected_order=='4')
    {
      select_status[4]="selected='selected'";
    }
    else if(selected_order=='5')
    {
      select_status[5]="selected='selected'";
    }
    else if(selected_order=='6')
    {
      select_status[6]="selected='selected'";
    }
  }
  else
  {
    select_status[0]="selected='selected'";
  }


  var select_team=['','','','','','',''];
  if(team)
  {
    if(team=='0')
    {
      select_team[0]="selected='selected'";
    }
    if(team=='1')
    {
      select_team[2]="selected='selected'";
    }
    else if(team=='2')
    {
      select_team[3]="selected='selected'";
    }
    else if(team=='3')
    {
      select_team[4]="selected='selected'";
    }
    else if(team=='4')
    {
      select_team[5]="selected='selected'";
    }
    else if(team=='5')
    {
      select_team[6]="selected='selected'";
    }
  }
  else
  {
    select_team[1]="selected='selected'";
  }

  var select_drop_off=['','','',''];
  if(drop_off)
  {
    if(drop_off=='0')
    {
      select_drop_off[0]="selected='selected'";
    }
    else if(drop_off=='1')
    {
      select_drop_off[2]="selected='selected'";
    }
    else if(drop_off=='2')
    {
      select_drop_off[3]="selected='selected'";
    }

  }
  else
  {
    select_drop_off[1]="selected='selected'";
  }




  //nlapiLogExecution ( 'debug' , 'Test 1') ;
  var html_subtab= form.addField('cutpage_subtab_all_package','inlineHTML','',null,'custpage_all_tab_one');
  var index = 1;
  var defaultSel = 1;
  if(page_index)
  {
    defaultSel = parseInt(page_index);
  }
  //nlapiLogExecution ( 'debug' , 'Test 2') ;
  if(numOrders > divided_size)
  {
    var html="<select style='width:100%' onchange='cutpage_package_paging(this.value)'>";
    for(var i=0; i < Math.ceil(numOrders / divided_size); i++)
    {
      var isDefault = false;
      if(defaultSel == index)
        isDefault = true;
      var nextIndex = index + paging_size;
      if(nextIndex > numOrders)
        nextIndex = numOrders;
      html+="<option value="+index+">"+index + " - " + nextIndex+"</option>";
      index = nextIndex + 1;
    }

   // nlapiLogExecution ( 'debug' ,'search_key -1' ,search_key);

    html+"</select>"; 
    html_subtab.setDefaultValue("<table width='100%' cellpadding='2'><tr>\
<td width='25%'>\
<h1>Last updated : </h1><span id='span_all_package'>"+date_time+"</span>\
</td>\
<td width='27%'>\
<br/><table  width='100%' cellpadding='0'><tr><td><input   style='width:100%' type='text' id='myInputpackage' placeholder='Search By Tracking Id/ Sales order' value="+search_key+"  >\
</td>\
<td><input type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: 4px -2px;    cursor: pointer;' onclick=Search_All('myInputpackage','all_package_team','all_package_droup_off',false,'custpage_all_tab_one',event)></td></tr></table></td>\
<td  width='15%' align='right'>\
<table width='100%'><tr><td width='100%'>STATUS<select  style='width:100%' id='custrecord_status' onchange=status_change(this.value)>\
<option value='' "+select_status[0]+" ></option>\
<option value=1 "+select_status[1]+">LABEL CREATED</option>\
<option value=2 "+select_status[2]+">PICKED UP</option>\
<option value=3 "+select_status[3]+">IN TRANSIT </option>\
<option value=4 "+select_status[4]+">EXCEPTION/DELAY</option>\
<option value=5 "+select_status[5]+">HELD FOR PICKUP</option>\
<option value=6 "+select_status[6]+">DELIVERED</option>\
</select>\
</td></tr></table>\
</td>\
<td  width='15%' align='right'> \
<table width='100%'><tr><td width='100%'>TEAM<select  style='width:100%' id='all_package_team' onchange=TEAM(this.value)><option value='' "+select_team[1]+" ></option><option value=0 "+select_team[0]+">All</option> <option value=1 "+select_team[2]+">OPS RECEIVING</option> <option value=2 "+select_team[3]+">PRODUCTION</option><option value=3 "+select_team[4]+">GR</option><option value=4 "+select_team[5]+">INVENTORY</option><option value=5 "+select_team[6]+">PERSONAL/MISC</option></select></td></table>\
</td>\
<td  width='10%' align='right'>\
<table width='100%'><tr><td width='100%'> DROP OFF<select id='all_package_droup_off' style='width:100%' onchange='Droup_Off_Pakage(this.value,1)'> <option value='' "+select_drop_off[1]+"></option> <option value='0' "+select_drop_off[0]+">ALL</option><option value=1 "+select_drop_off[2]+">YES</option> <option value=2 "+select_drop_off[3]+">NO</option></select></td></table>\
</td>\
<td  width='10%' align='right'><br/>"+html+"</td>\
<td width='10%'><h1>Records : </h1> <span>"+numOrders+"</span></td>\
</tr></table>");
  }
  else
  {

    //nlapiLogExecution ( 'debug' ,'search_key -2' ,search_key);
    html_subtab.setDefaultValue("<table width='100%' cellpadding='2'><tr>\
<td width='25%'>\
<h1>Last updated : </h1><span id='span_all_package'>"+date_time+"</span>\
</td>\
<td width='27%'>\
<br/><table  width='100%' cellpadding='0'><tr><td> <input   style='width:100%' type='text' id='myInputpackage' placeholder='Search By Tracking Id/ Sales order' value="+search_key+"  >\
</td>\
<td><input type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: 4px -2px;    cursor: pointer;' onclick=Search_All('myInputpackage','all_package_team','all_package_droup_off',false,'custpage_all_tab_one',event)></td></tr></table></td>\
<td  width='15%' align='right'>\
<table width='100%'><tr><td width='100%'>STATUS<select  style='width:100%' id='custrecord_status' onchange=status_change(this.value)>\
<option value='' "+select_status[0]+" ></option>\
<option value=1 "+select_status[1]+">LABEL CREATED</option>\
<option value=2 "+select_status[2]+">PICKED UP</option>\
<option value=3 "+select_status[3]+">IN TRANSIT</option>\
<option value=4 "+select_status[4]+">EXCEPTION/DELAY</option>\
<option value=5 "+select_status[5]+">HELD FOR PICKUP</option>\
<option value=6 "+select_status[6]+">DELIVERED</option>\
</select>\
</td></tr></table>\
</td>\
<td  width='15%' align='right'> \
<table width='100%'><tr><td width='100%'>TEAM<select  style='width:100%' id='all_package_team' onchange=TEAM(this.value)><option value='' "+select_team[1]+" ></option><option value=0 "+select_team[0]+">All</option> <option value=1 "+select_team[2]+">OPS RECEIVING</option> <option value=2 "+select_team[3]+">PRODUCTION</option><option value=3 "+select_team[4]+">GR</option><option value=4 "+select_team[5]+">INVENTORY</option><option value=5 "+select_team[6]+">PERSONAL/MISC</option></select></td></table>\
</td>\
<td  width='10%' align='right'>\
<table width='100%'><tr><td width='100%'>DROP OFF<select id='all_package_droup_off' style='width:100%' onchange='Droup_Off_Pakage(this.value,1)'> <option value='' "+select_drop_off[1]+"></option> <option value='0' "+select_drop_off[0]+">ALL</option><option value=1 "+select_drop_off[2]+">YES</option> <option value=2 "+select_drop_off[3]+">NO</option></select></td></table>\
</td>\
<td  width='10%' align='right'><br/></td>\
<td width='10%'><h1>Records : </h1> <span>"+numOrders+"</span></td>\
</tr></table>");
  }
}


function Add_Sub_List_empty_all_pakage(form)
{

  var Sublist_all_package = form.addSubList('custpage_all_packages', 'list',"All Packages","custpage_all_tab_one");
  Sublist_all_package.addField('custpage_received_chk','checkbox','Received');
  Sublist_all_package.addField('custpage_team','select','Team','customlist_team');  
  Sublist_all_package.addField('custpage_sales_order_all_package','text','Sales Order / Return Authorization Link');   
  Sublist_all_package.addField('custpage_cdp_all_package','text','CPR LINK'); 
  Sublist_all_package.addField('custpage_tracking_id','text','Tracking ID');
  Sublist_all_package.addField('custpage_status','textarea','Status');
  Sublist_all_package.addField('custpage_shipped_by','text','Shipped by').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_shipper_address','text','Shipper Address');
  Sublist_all_package.addField('custpage_recipient_contact_name','text','Recipient Contact Name').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_recipient_address','text','Recipient Address');
  Sublist_all_package.addField('custpage_account_number','text','Account_Number').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_reference','text','Reference');
  Sublist_all_package.addField('custpage_or_items_package','textarea','OR Items').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_or_items_old_package','textarea').setDisplayType("hidden");
  Sublist_all_package.addField('custpage_internal_id', 'text', 'ID').setDisplayType('hidden');
  Sublist_all_package.addField('custpage_received_chk_old', 'checkbox').setDisplayType('hidden');
  Sublist_all_package.addField('custpage_team_old','select','Team','customlist_team').setDisplayType('hidden');
  Sublist_all_package.addRefreshButton();
  Sublist_all_package.addButton("custpage_add_package", "Add Package","window.onbeforeunload = null;nlOpenWindow('/app/common/custom/custrecordentry.nl?rectype=548&label=Package Record&target=custpage_all_packages:custpage_team1','Package Record',800,500,'custcol_package_record',true)");
  Sublist_all_package.addButton("custpage_update_package", "Update Orders","Update_Order_Package()");
}
