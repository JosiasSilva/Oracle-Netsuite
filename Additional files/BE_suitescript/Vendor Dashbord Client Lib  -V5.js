var send_data_qty=0;
function check_value_insert_create(user)
{
  po_id_obj=new Array();
  insurence_amount=new Array();
  var get_all_record=List_Without_box_record("F");
  if(get_all_record && get_all_record.length>0)
  {
    temp_data_obj=new Array();
    var new_record_create=Create_Box_Record_Obj(get_all_record);
    if(new_record_create && temp_data_obj.length>0)
    {
      console.log("new_record_create", JSON.stringify(new_record_create));// zag
      Call_Ajax_data_update(new_record_create,'new_record',user); 
    }
  }
}
function check_value_insert_update(user)
{
  var get_all_new_record=List_Without_box_record("F");
  var get_all_old_record=List_Without_box_record("T");
  get_all_old_record=Old_Record_marge_box(get_all_old_record);
  if( (get_all_new_record &&  get_all_new_record.length>0) || (get_all_old_record && get_all_old_record.length>0) )
  {
    temp_data_obj=new Array();
    var update_record_create=Update_Box_Record_Obj(get_all_new_record,get_all_old_record);
    if(update_record_create)
    {
      var old_record=update_record_create[0];
      var new_record=update_record_create[1];
      new_record=Create_Box_Record_Obj(new_record);
      if(old_record && old_record.length>0 )
      {
        Call_Ajax_data_update(old_record,'old_record',user); 
      }	
      if(new_record && new_record.length>0)
      {
        Call_Ajax_data_update(new_record,'new_record',user); 
      }
    }
  }

}

function List_Without_box_record(chek_type)
{
  var record_item=[];
  var vendor_id=[];
  for(var a=1;a<=nlapiGetLineItemCount('custpage_list');a++)
  {
    if(nlapiGetLineItemValue('custpage_list','custpage_list_insurance_value',a) && nlapiGetLineItemValue('custpage_list','custpage_list_box_created',a)==chek_type && nlapiGetLineItemValue('custpage_list','custpage_list_status',a)=='3')
    {
      var get_vendor=nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a);
      var index_no= vendor_id.indexOf(get_vendor);
      var get_insu_value=nlapiGetLineItemValue('custpage_list','custpage_list_packing_slip_insurnce_value',a);
      if(get_insu_value){get_insu_value=parseFloat(get_insu_value);}else{get_insu_value=0;}
      if(get_insu_value>=70000 || index_no==-1)
      {
        record_item.push({
          "vendor":get_vendor,
          "total_insurence_val":0,
          "box_id":'',
          "line_item":[]
        }); 

        if(index_no==-1 && get_insu_value<70000)
        {		 
          vendor_id.push(get_vendor); 
        }
        else
        {
          vendor_id.push(get_vendor+'_'+a+''); 
        }
        index_no=record_item.length-1;
      }
      record_item[index_no].total_insurence_val+=get_insu_value;
      var po_id_get=nlapiGetLineItemValue('custpage_list','custpage_list_po',a);
      var index_po=po_id_obj.indexOf(po_id_get);
      if(index_po==-1)
      {
        po_id_obj.push(po_id_get);
        insurence_amount.push(get_insu_value);
      }
      else
      {
        insurence_amount[index_po]+=get_insu_value;
      }	  
      record_item[index_no].line_item.push({
        sublist_type:'1',
        vendor:get_vendor,
        item_id:nlapiGetLineItemValue('custpage_list','custpage_list_item',a),
        po_id:nlapiGetLineItemValue('custpage_list','custpage_list_po',a),
        po_doc:nlapiGetLineItemValue('custpage_list','custpage_list_po_document_number',a),
        insurance_value:get_insu_value,
        insurance_value_old:nlapiGetLineItemValue('custpage_list','custpage_list_insurance_value_old',a),
        checked:false,
        notes:'',
        date_send_from_sf:'',
        description:encodeURIComponent(encodeURIComponent(nlapiGetLineItemValue('custpage_list','custpage_list_packing_slip_description',a))),
        line_id:nlapiGetLineItemValue('custpage_list','custpage_list_po_line',a),
        qa_id:'',
        index_number:a,
        box_id_value:nlapiGetLineItemValue('custpage_list','custpage_list_box_id',a),
        line_internalid:''
      });
    }
  }
  for(var a=1;a<=nlapiGetLineItemCount('custpage_vendor_list');a++)
  {

    if(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_insurance',a) && nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_created',a)==chek_type)
    {
      var get_vendor=nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a);
      var index_no= vendor_id.indexOf(get_vendor);
      var get_insu_value=nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_insurance',a);
      if(get_insu_value){get_insu_value=parseFloat(get_insu_value);}else{get_insu_value=0;}
      if(get_insu_value>=70000 || index_no==-1)
      {
        record_item.push({
          "vendor":get_vendor,
          "total_insurence_val":0,
          "box_id":0,
          "line_item":[]}) 

        if(index_no==-1 && get_insu_value<70000)
        {
          vendor_id.push(get_vendor);  
        }
        else
        {
          vendor_id.push(get_vendor+'_'+a+''); 
        }
        index_no=record_item.length-1;	
      }		  
      record_item[index_no].total_insurence_val+=get_insu_value;	
      var get_po_number=nlapiGetLineItemText('custpage_vendor_list','custpage_vendor_box_po_number',a);
      if(get_po_number){ get_po_number=  get_po_number.replace('Purchase Order #','');  }
      record_item[index_no].line_item.push({
        sublist_type:'3',
        vendor:get_vendor,
        item_id:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_item_name',a),
        po_id:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_po_number',a),
        po_doc:get_po_number,
        insurance_value:get_insu_value,
        insurance_value_old:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_insurance_old',a),
        checked:false,
        notes:encodeURIComponent(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_note',a)),
        date_send_from_sf:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_sf_date',a),
        description:encodeURIComponent(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_desc',a)),
        line_id:'',
        qa_id:'',
        index_number:a,
        box_id_value:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_id',a),
        line_internal_id: nlapiGetLineItemValue('custpage_vendor_list','custpage_line_internal_id',a), 
      });

    }
  }
  for(var a=1;a<=nlapiGetLineItemCount('custpage_qa_list');a++)
  {


    if(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_insurance_val',a) &&  nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_created',a)==chek_type)
    {
      var get_vendor=nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a);
      var index_no;
      var get_insu_value=nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_insurance_val',a);
      if(get_insu_value){get_insu_value=parseFloat(get_insu_value);}else{get_insu_value=0;}
      if(get_vendor=='7773')
      {
        var get_vendor_list=get_vendor+"_2";
        index_no= vendor_id.indexOf(get_vendor_list);
        if(get_insu_value>=70000 || index_no==-1)
        {
          record_item.push(
            {
              "vendor":get_vendor_list,
              "total_insurence_val":0,
              "box_id":'',
              "line_item":[]
            }) 

          if(index_no==-1 && get_insu_value<70000)
          {
            vendor_id.push(get_vendor_list); 
          }
          else
          {
            vendor_id.push(get_vendor+'_'+a+''); 
          }
          index_no=record_item.length-1;
        }		
      }
      else
      {
        index_no= vendor_id.indexOf(get_vendor);

        if(get_insu_value>=70000 || index_no==-1 )
        {
          record_item.push(
            {
              "vendor":get_vendor,
              "total_insurence_val":0,
              "box_id":'',
              "line_item":[]
            });

          if(index_no==-1 && get_insu_value<70000)
          {
            vendor_id.push(get_vendor);  
          }
          else
          {
            vendor_id.push(get_vendor+'_'+a+''); 
          }
          index_no=record_item.length-1;
        }
      }
      record_item[index_no].total_insurence_val+=get_insu_value;		  
      record_item[index_no].line_item.push({
        sublist_type:'2',
        vendor:get_vendor,
        item_id:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_item_master_id',a),
        po_id:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_po_id',a),
        po_doc:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_po',a),
        insurance_value:get_insu_value,
        insurance_value_old:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_insurance_val_old',a),
        checked:false,
        notes:'',
        date_send_from_sf:'',
        description:encodeURIComponent(nlapiGetLineItemValue('custpage_qa_list','memo',a)),
        line_id:'',
        qa_id:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_record_id',a),
        index_number:a,
        box_id_value:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_id',a),
        line_internal_id:''
      });
    }
  }

  return record_item;
}
function Number_of_box_create(insu_value,vendor)
{
  var get_insu_val=[];
  if(insu_value<=70000 && vendor!='7773_2')
  {
    get_insu_val.push(70000);
  }
  else if(insu_value<=50000 && vendor=='7773_2')
  {
    get_insu_val.push(50000);
  }
  else
  { 
    var get_insu_check=50000;
    var get_val= parseInt(insu_value/50000);
    for(var a=1;a<=get_val;a++)
    {
      get_insu_val.push(50000);                  
      insu_value=insu_value-get_insu_check;
      if(insu_value<=70000)
      {
        break;
      }
    }
    get_insu_val.push(70000);
  }
  return get_insu_val;
}
function Create_Box_Record_Obj(record_item)
{
  var send_record=[];
  if(record_item)
  {   
    for(var a=0;a<record_item.length;a++)
    {
      var get_vendor=record_item[a].vendor;
      if(get_vendor=='153')
      {
        if(send_record.length==0)
        {
          temp_data_obj.push('1');
          send_record.push({
            "vendor":get_vendor,
            "total_insurence_val":record_item[a].total_insurence_val,
            "box_id":0,
			"box_counter":"", // zag : Added
            "line_item":[]			 
          });
        }
        var get_line_item=record_item[a].line_item;
        for(var b=0;b<get_line_item.length;b++)
        {
          get_line_item[b].checked=true;		
          send_record[0].line_item.push(get_line_item[b]);
        }
      }
    }
    for(var a=0;a<record_item.length;a++)
    {
      var total_insurence_val=record_item[a].total_insurence_val;
      var line_item_count=record_item[a].line_item.length;
      var get_vendor=record_item[a].vendor;
      if(total_insurence_val>70000 && line_item_count==1)
      {

        temp_data_obj.push('1');
        send_record.push({
          "vendor":get_vendor,
          "total_insurence_val":total_insurence_val,
          "box_id":0,
		  "box_counter":"", // zag : Added
          "line_item":[]
        });
        var get_line_item=record_item[a].line_item;
        for(var b=0;b<get_line_item.length;b++)
        {
          get_line_item[b].checked=true;
          send_record[send_record.length-1].line_item.push(get_line_item[b]);
        }
      }
    }
    for(var a=0;a<record_item.length;a++)
    {
      var get_vendor=record_item[a].vendor;
      var get_insu_amount=record_item[a].total_insurence_val;
      var get_line_item=record_item[a].line_item;
      var chek_number_of_insurence=Number_of_box_create(get_insu_amount,get_vendor);
      for(var c=0;c<chek_number_of_insurence.length;c++)
      {
        var amount_compair=chek_number_of_insurence[c];
        var bool_val=true;
        var insu_value=0;
        for(var b=0;b<get_line_item.length;b++)
        {
          if(!get_line_item[b].checked)
          {

            if(bool_val)
            {
              temp_data_obj.push('1');
              send_record.push({
                "vendor":get_vendor.replace('_2',''),
                "box_id":0,
                "total_insurence_val":0,
				"box_counter":"", // zag : Added
                "line_item":[]			 
              });
              bool_val=false;
            }
            var get_insu=parseFloat(get_line_item[b].insurance_value);
            var ck_get_insu=parseFloat(get_line_item[b].insurance_value);	
            var sublist_type=get_line_item[b].sublist_type;
            var index_obj;
            if(sublist_type=='1')
            {
              var get_po_id=get_line_item[b].po_id;
              index_obj=po_id_obj.indexOf(get_po_id);
              var get_max_insurence= parseFloat(insurence_amount[index_obj]);	
              if(get_max_insurence>=get_insu)			
              {
                ck_get_insu=get_max_insurence;
                if(nlapiGetUser ( ) =='13905298')
                {

                }
              }
            }
            var insu_value_temp=ck_get_insu+insu_value;
            if(insu_value_temp<=amount_compair)
            {
              if(get_line_item[b].sublist_type=='1' && index_obj>=0)
              {
                if(nlapiGetUser ( ) =='13905298')
                {

                }
                insurence_amount[index_obj]-=get_insu;
                if(nlapiGetUser ( ) =='13905298')
                {

                }
              }
              insu_value=get_insu+insu_value;
              get_line_item[b].checked=true;
              send_record[send_record.length-1].total_insurence_val=insu_value;
              send_record[send_record.length-1].line_item.push(get_line_item[b]);
            }
          }
        }
      }
    }
  }
  return send_record;
}
function Old_Record_marge_box(record)
{
  var get_marge_record=[];
  var get_box_obj=[];
  if(record)
  {
    for(var a=0;a<record.length;a++)
    {
      var line_item=record[a].line_item;
      if(line_item)
      {

        for(var b=0;b<line_item.length;b++)
        {

          var get_box_id_value=line_item[b].box_id_value;
          var index_number=get_box_obj.indexOf(get_box_id_value);
          if(index_number==-1)
          {
            get_box_obj.push(get_box_id_value);
            get_marge_record.push({
              "vendor":record[a].vendor,
              "total_insurence_val":line_item[b].insurance_value,
              "box_id":get_box_id_value,
              "line_item":[],
            });
            get_marge_record[get_marge_record.length-1].line_item.push(line_item[b]);

          }
          else
          {
            get_marge_record[index_number].line_item.push(line_item[b]);	
            get_marge_record[index_number].total_insurence_val+= parseFloat(line_item[b].insurance_value);
          }
        }
      }
    }
    return get_marge_record;
  }
}

function Update_Box_Record_Obj(get_all_new_record,get_all_old_record)
{
  var get_data_update=[];
  for(var a=0;a<get_all_old_record.length;a++)
  { 
    var flag=false;
    var get_vendor=get_all_old_record[a].vendor;
    var get_insu_val=get_all_old_record[a].total_insurence_val;
    if(get_insu_val){get_insu_val=parseFloat(get_insu_val)}else{get_insu_val=0;}
    var get_insu_compare=0;
    if(get_insu_val>50000 && get_insu_val<70000)
    {
      get_insu_compare=70000;
    }
    else if(get_insu_val<50000)
    {
      get_insu_compare=50000;
    }

    if(get_insu_compare==50000 || get_insu_compare==70000)
    {
      for(var b=0;b<get_all_new_record.length;b++)
      {
        var child_vendor=get_all_new_record[b].vendor;       
        if(child_vendor==get_vendor)
        {

          var get_line=get_all_new_record[b].line_item;
          if(get_line)
          {
            for(var c=0;c<get_line.length;c++)
            {
              if(!get_line[c].checked)
              {
                var get_ins_child=get_line[c].insurance_value;
                if(get_ins_child){get_ins_child=parseFloat(get_ins_child)}else{get_ins_child=0;}

                var ck_get_insu=get_ins_child;			
                var index_obj;			
                if(get_line[c].sublist_type=='1')
                {
                  var get_po_id=get_line[c].po_id;
                  index_obj=po_id_obj.indexOf(get_po_id);
                  var get_max_insurence= parseFloat(insurence_amount[index_obj]);	
                  if(get_max_insurence>=get_ins_child)			
                  {
                    ck_get_insu=get_max_insurence;

                  }					
                }
                var temp_bj_new=get_insu_val+ck_get_insu;

                if((get_insu_compare==70000 && temp_bj_new<=70000)|| (get_insu_compare==50000 && temp_bj_new<=50000))
                {

                  if(get_line[c].sublist_type=='1' && index_obj>=0)
                  {
                    insurence_amount[index_obj]-=get_ins_child;
                  }

                  get_insu_val +=get_ins_child;
                  get_all_new_record[b].total_insurence_val-=get_ins_child;
                  get_line[c].checked=true;
                  get_all_old_record[a].line_item.push(get_line[c]);
                  get_all_old_record[a].total_insurence_val+=get_ins_child;
                  flag=true;
                }	
              }
            }
          }
        }
      }
    }
    if(flag)
    {
      temp_data_obj.push('1');
      get_data_update.push(get_all_old_record[a]);
    }
    else
    {
      var get_line=get_all_old_record[a].line_item;
      if(get_line)
      {
        for(var e=0;e<get_line.length;e++)
        {
          var get_ins_child=get_line[e].insurance_value;
          var get_ins_child_old=get_line[e].insurance_value_old;
          if(get_ins_child){get_ins_child=parseFloat(get_ins_child);}else{get_ins_child=0;}
          if(get_ins_child_old){get_ins_child_old=parseFloat(get_ins_child_old);}else{get_ins_child_old=0;}
          if(get_ins_child!=get_ins_child_old)
          {
            flag=true;
            break;
          }

        }
        if(flag)
        {
          temp_data_obj.push('1');
          get_data_update.push(get_all_old_record[a]);
        }
      }
    }
  }
  return [get_data_update,get_all_new_record]
}
function Call_Ajax_data_update(data_update,url_string,user)
{
  Page_Content_Update(); 
  box_counter(data_update); //ZAG: Added
  var send_data_record=[];

  for(var c=0;c<data_update.length;c++)
  {
    var send_data={
      type:url_string,
      send_data:data_update[c]
    }
    var send_data=JSON.stringify(send_data);
    send_data_record.push(send_data);
  }
  if(send_data_record.length>0)
  {
   send_data_qty=0;
   loadDoc(send_data_record,user); 
  }
}
//ZAG:Start
function box_counter(data_update)
{
  var vendorTotal = {};
  var vendorCounter = {};
  for(var id=0;id<data_update.length;id++){
	var temp_data = data_update[id];
    //console.log('temp_data', temp_data);
	var vendorId = temp_data['vendor'];

	  if(Object.keys(vendorTotal).indexOf(vendorId) == -1){
	    	vendorTotal[vendorId] = 1;
	  }else{
		   var tempCounter = vendorTotal[vendorId];
		   tempCounter++;
		   vendorTotal[vendorId] = tempCounter;
	  }
  }
  //console.log('vendorTotal', JSON.stringify(vendorTotal));
  
  for(var id=0;id<data_update.length;id++){
	var temp_data = data_update[id];
    var vendorId = temp_data['vendor'];
	if(Object.keys(vendorTotal).indexOf(vendorId) > -1){
	    var TotalCount = vendorTotal[vendorId];
		var tempCounter = 1;
		if(Object.keys(vendorCounter).indexOf(vendorId) == -1){
	    vendorCounter[vendorId] = tempCounter;
		}else{
		var tempCounter = vendorCounter[vendorId];
		tempCounter++;
		vendorCounter[vendorId] = tempCounter;
		}
		temp_data['box_counter'] = '' + tempCounter + ' of ' + TotalCount + '';
	  }
	//console.log('temp_data - upd', temp_data);
  }
  
}
//ZAG:End
function loadDoc(send_data,user) {

  var restUrl = nlapiResolveURL('RESTLET', 'customscript_vendor_box_created', 'customdeploy_vendor_box_created');
  jQuery.ajax({
    type: 'POST',
    contentType: "application/json;",
    url:restUrl,
    data: send_data[send_data_qty],
    dataType: "json",
    success: function(get_return_value) { 
      send_data_qty++;
      Page_Content_Update();
      if(send_data_qty<(send_data.length))
      {
        loadDoc(send_data,user);
      }
      else
      {
        Page_Redirect_Check(user);
      }
    }

  });

}

function Page_Redirect_Check(user)
{
  var get_url=nlapiResolveURL ( "suitelet" , 'customscript_queue_for_packing_slip' , 'customdeploy_queue_for_packing_slip' );

  // var body="All vendor box records have been created.<br /><br /><a href="+(window.location.hostname+get_url)+">Packing Slip Print Queue</a>";
  var body="All vendor box records have been created.<br /><br /><a href="+get_url+">Packing Slip Print Queue</a>";
  nlapiSendEmail (user , user  , "Box Record Creation Complete",body) ;  
  window.onbeforeunload = null;
  window.location=get_url+"&sc=T";
}
function Page_Content_Update()
{
  document.getElementById("div__body").innerHTML ="<tr><td><center style=background-color:white; border-color:white ><div><table width=450 ><tr><td align=center width=35 ><img width=29 height=30 src=/core/media/media.nl?id=21335244&c=666639&h=79562ac1c842739a8938&whence= ></td><td valign=center style=color:#4d5f79;font-family:OpenSans,Helvetica,sans-serif;font-size:20px;font-weight:bold; >Creating  Box Record's "+send_data_qty+" out of "+temp_data_obj.length+"</td></tr></table></div><center></td></tr>";
}

(function($) {    
  if ($.fn.style) {
    return;
  }

  // Escape regex chars with \
  var escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // For those who need them (< IE 9), add support for CSS functions
  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
  if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
      this.setAttribute(styleName, value);
      var priority = typeof priority != 'undefined' ? priority : '';
      if (priority != '') {
        // Add priority manually
        var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                              '(\\s*;)?', 'gmi');
        this.cssText =
          this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
      }
    };
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    };
    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
      var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                            'gmi');
      return rule.test(this.cssText) ? 'important' : '';
    }
  }

  // The style function
  $.fn.style = function(styleName, value, priority) {
    // DOM node
    var node = this.get(0);
    // Ensure we have a DOM node
    if (typeof node == 'undefined') {
      return this;
    }
    // CSSStyleDeclaration
    var style = this.get(0).style;
    // Getter/Setter
    if (typeof styleName != 'undefined') {
      if (typeof value != 'undefined') {
        // Set style property
        priority = typeof priority != 'undefined' ? priority : '';
        style.setProperty(styleName, value, priority);
        return this;
      } else {
        // Get style property
        return style.getPropertyValue(styleName);
      }
    } else {
      // Get CSSStyleDeclaration
      return style;
    }
  };
})(jQuery);

