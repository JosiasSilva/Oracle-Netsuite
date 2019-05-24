nlapiLogExecution("audit","FLOStart",new Date().getTime());
var data_send_obj=new Array();
var temp_data_obj=new Array();
function VBD_FC(type,name,linenum)
{
  if(type=="custpage_list" && (name=="custpage_list_date_sent_from_sf" || name=="custpage_list_status" || name=="custpage_list_notes" || name=="custpage_list_gem_notif"))
  {
    nlapiSetLineItemValue("custpage_list","custpage_list_changed",linenum,"T");
  }
  else if(name=="custpage_vendor" || name=='custpage_status' || name=='custpage_item')
  {
    var url = nlapiResolveURL("SUITELET","customscript_vendor_box_dashboard","customdeploy_vendor_box_dashboard");
    url += "&custpage_vendor=" + nlapiGetFieldValue("custpage_vendor")+"&custpage_status="+nlapiGetFieldValue("custpage_status")+"&custpage_item="+nlapiGetFieldValue("custpage_item");

    window.onbeforeunload = null;
    window.location.href = url;
  }
  else if(name=='custpage_vendor_box_item_name')
  {
    var url=nlapiResolveURL ('suitelet','customscript_vendor_box_dashboard','customdeploy_vendor_box_dashboard' );
    var get_item_id=nlapiGetCurrentLineItemValue ( 'custpage_vendor_list' , 'custpage_vendor_box_item_name' );
    var responseData = nlapiRequestURL(url,{get_price:get_item_id },null, "GET");       
    var get_amount=responseData.getBody().toString();
    if(get_amount){ get_amount=(parseFloat(get_amount)*.8).toFixed(2);}else { get_amount=0;}
    nlapiSetCurrentLineItemValue ( 'custpage_vendor_list' , 'custpage_vendor_box_insurance',get_amount );
    //nlapiSetCurrentLineItemValue ( 'custpage_vendor_list' , 'custpage_vendor_box_sf_date',new Date() );

  }
}

function VBD_Print()
{
  var url = nlapiResolveURL("SUITELET","customscript_vbd_print","customdeploy_vbd_print");

  window.open(url,'printWindow','location=no,menubar=yes,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=yes,height=600,width=800');
}

function VBD_PI()
{
  jQuery('input[name^="inpt_custpage_list_status"]').each(function(){
    if(jQuery(this).val()=="Progress")
    {
      jQuery(this).parent().parent().parent().parent().children().each(function(){
        jQuery(this).style('background-color','#FFD78E','important');
      });
    }
    else if(jQuery(this).val()=="Completed")
    {
      jQuery(this).parent().parent().parent().parent().children().each(function(){
        jQuery(this).style('background-color','#76AF76','important');
      });
    }
    else if(jQuery(this).val()=="Not Started")
    {
      jQuery(this).parent().parent().parent().parent().children().each(function(){
        jQuery(this).style('background-color','#FF8E8E','important');
      });
    }
  });

  jQuery('input[name^="custpage_list_so_status"]').each(function(){
    var status = jQuery(this).val();
    //alert(status);
    if(status ==  "closed")
    {
      jQuery(this).parent().parent().children().each(function(){
        jQuery(this).style('background-color','#f9a47a','important');
      });
    }
  });

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

function check_value_insert(type)
{
  if(type=='1')
  {

    check_value_insert_create();
  }
  else if(type=='2')
  {

    check_value_insert_update();
  }
}
function check_value_insert_update()
{

  data_send_obj=new Array();
  temp_data_obj=new Array();
  var box_id_value=[];
  var record_item=[];
  var vendor_id=[];

  for(var a=1;a<=nlapiGetLineItemCount('custpage_list');a++)
  {
    if(nlapiGetLineItemValue('custpage_list','custpage_list_box_created',a)=='T')
    {
      if(nlapiGetLineItemValue('custpage_list','custpage_list_box_id',a))
      {
        if(box_id_value.indexOf(nlapiGetLineItemValue('custpage_list','custpage_list_box_id',a))==-1)
        {
          // alert('list  ' +nlapiGetLineItemValue('custpage_list','custpage_list_box_id',a) );
          box_id_value.push(nlapiGetLineItemValue('custpage_list','custpage_list_box_id',a));
        }
      }
    }
  }
  for(var a=1;a<=nlapiGetLineItemCount('custpage_qa_list');a++)
  {
    if(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_created',a)=='T')
    {
      if(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_id',a))
      {
        if(box_id_value.indexOf(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_id',a))==-1)
        {
          //alert('QA  ' +nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_id',a) );
          box_id_value.push(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_id',a));
        }
      }
    }
  }
  for(var a=1;a<=nlapiGetLineItemCount('custpage_vendor_list');a++)
  {
    if(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_created',a)=='T')
    {
      if(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_id',a))
      {
        if(box_id_value.indexOf(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_id',a))==-1)
        {
          //alert('vendor_list  ' +nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_id',a) );
          box_id_value.push(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_id',a));
        }
      }
    }
  }

  if(box_id_value.length>0)
  {  
    temp_data_obj.push('1');
  }

  for(var a=1;a<=nlapiGetLineItemCount('custpage_list');a++)
  {
    if(nlapiGetLineItemValue('custpage_list','custpage_list_insurance_value',a) && nlapiGetLineItemValue('custpage_list','custpage_list_box_created',a)=='T' && nlapiGetLineItemValue('custpage_list','custpage_list_status',a)=='3')
    {
      var index_no= vendor_id.indexOf(nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a));
      if(index_no==-1)
      {  
        record_item.push({vendor:nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a),item_details:[]}); 
        vendor_id.push(nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a)); 
        index_no=record_item.length-1;	 
      }
      record_item[index_no].item_details.push({
        sublist_type:'1',
        vendor:nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a),
        item_id:nlapiGetLineItemValue('custpage_list','custpage_list_item',a),
        po_id:nlapiGetLineItemValue('custpage_list','custpage_list_po',a),
        po_doc:nlapiGetLineItemValue('custpage_list','custpage_list_po_document_number',a),
        insurance_value:nlapiGetLineItemValue('custpage_list','custpage_list_insurance_value',a),
        checked:false,
        notes:'',
        date_send_from_sf:'',
        description:'',
        line_id:nlapiGetLineItemValue('custpage_list','custpage_list_po_line',a),
        qa_id:'',
        index_number:a,
        item_link:nlapiGetLineItemValue('custpage_list','custpage_list_item_link_id',a),
      });
    }
  }
  for(var a=1;a<=nlapiGetLineItemCount('custpage_qa_list');a++)
  {


    if(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_insurance_val',a) &&  nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_created',a)=='T')
    {
      var index_no= vendor_id.indexOf(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a));
      if(index_no==-1)
      {  
        record_item.push({vendor:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a),item_details:[]}) 
        vendor_id.push(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a));  
        index_no=record_item.length-1;	 
      }
      record_item[index_no].item_details.push({
        sublist_type:'2',
        vendor:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a),
        item_id:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_item_master_id',a),
        po_id:'',
        po_doc:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_po',a),
        insurance_value:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_insurance_val',a),
        checked:false,
        notes:'',
        date_send_from_sf:'',
        description:'',
        line_id:'',
        qa_id:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_record_id',a),
        index_number:a,
        item_link:'',
      });
    }
  }
  for(var a=1;a<=nlapiGetLineItemCount('custpage_vendor_list');a++)
  {
    if(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_insurance',a) && nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_created',a)=='T')
    {
      var index_no= vendor_id.indexOf(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a));
      if(index_no==-1)
      {  
        record_item.push({vendor:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a),item_details:[]}) 
        vendor_id.push(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a));  
        index_no=record_item.length-1;	 
      }
      record_item[index_no].item_details.push({
        sublist_type:'3',
        vendor:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a),
        item_id:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_item_name',a),
        po_id:'',
        po_doc:'',
        insurance_value:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_insurance',a),
        checked:false,
        notes:encodeURIComponent(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_note',a)),
        date_send_from_sf:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_sf_date',a),
        description:encodeURIComponent(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_desc',a)),
        line_id:'',
        qa_id:'',
        index_number:a,
        item_link:'',
      });
    }
  }

  Create_Box_Record_Obj(record_item,box_id_value);


}
function check_value_insert_create()
{

  data_send_obj=new Array();
  temp_data_obj=new Array();
  var record_item=[];
  var vendor_id=[];
  for(var a=1;a<=nlapiGetLineItemCount('custpage_list');a++)
  {
    if(nlapiGetLineItemValue('custpage_list','custpage_list_insurance_value',a) && nlapiGetLineItemValue('custpage_list','custpage_list_box_created',a)!='T' && nlapiGetLineItemValue('custpage_list','custpage_list_status',a)=='3')
    {
      var index_no= vendor_id.indexOf(nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a));
      if(index_no==-1)
      {  
        record_item.push({vendor:nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a),item_details:[]}); 
        vendor_id.push(nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a)); 
        index_no=record_item.length-1;	 
      }
      record_item[index_no].item_details.push({
        sublist_type:'1',
        vendor:nlapiGetLineItemValue('custpage_list','custpage_list_vendor',a),
        item_id:nlapiGetLineItemValue('custpage_list','custpage_list_item',a),
        po_id:nlapiGetLineItemValue('custpage_list','custpage_list_po',a),
        po_doc:nlapiGetLineItemValue('custpage_list','custpage_list_po_document_number',a),
        insurance_value:nlapiGetLineItemValue('custpage_list','custpage_list_insurance_value',a),
        checked:false,
        notes:'',
        date_send_from_sf:'',
        description:'',
        line_id:nlapiGetLineItemValue('custpage_list','custpage_list_po_line',a),
        qa_id:'',
        index_number:a,
        item_link:nlapiGetLineItemValue('custpage_list','custpage_list_item_link_id',a),
      });
    }
  }
  for(var a=1;a<=nlapiGetLineItemCount('custpage_qa_list');a++)
  {


    if(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_insurance_val',a) &&  nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_box_created',a)!='T')
    {
      var index_no= vendor_id.indexOf(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a));
      if(index_no==-1)
      {  
        record_item.push({vendor:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a),item_details:[]}) 
        vendor_id.push(nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a));  
        index_no=record_item.length-1;	 
      }
      record_item[index_no].item_details.push({
        sublist_type:'2',
        vendor:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_vendor_id',a),
        item_id:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_item_master_id',a),
        po_id:'',
        po_doc:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_po',a),
        insurance_value:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_insurance_val',a),
        checked:false,
        notes:'',
        date_send_from_sf:'',
        description:'',
        line_id:'',
        qa_id:nlapiGetLineItemValue('custpage_qa_list','custpage_qa_list_qa_record_id',a),
        index_number:a,
        item_link:'',
      });
    }
  }
  for(var a=1;a<=nlapiGetLineItemCount('custpage_vendor_list');a++)
  {
    //  alert(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_insurance',a));
    // alert(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_created',a));
    if(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_insurance',a) && nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_box_created',a)!='T')
    {
      //  alert('add_vendor_list');
      var index_no= vendor_id.indexOf(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a));
      if(index_no==-1)
      {  
        record_item.push({vendor:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a),item_details:[]}) 
        vendor_id.push(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a));  
        index_no=record_item.length-1;	 
      }
      record_item[index_no].item_details.push({
        sublist_type:'3',
        vendor:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_vendor_master',a),
        item_id:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_item_name',a),
        po_id:'',
        po_doc:'',
        insurance_value:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_insurance',a),
        checked:false,
        notes:encodeURIComponent(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_note',a)),
        date_send_from_sf:nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_sf_date',a),
        description:encodeURIComponent(nlapiGetLineItemValue('custpage_vendor_list','custpage_vendor_box_desc',a)),
        line_id:'',
        qa_id:'',
        index_number:a,
        item_link:'',
      });

    }
  }
  var box_id_value=[];
  Create_Box_Record_Obj(record_item,box_id_value);
}


function Create_Box_Record_Obj(record_item,box_id_value)
{
  if(record_item)
  {
    var send_record=[];
    for(var a=0;a<record_item.length;a++)
    {
      var get_vendor=record_item[a].vendor;
      var insu_value=0;
      if(get_vendor=='153')
      {
        send_record.push({
          "vendor":get_vendor,
          "total_insurence_val":0,
          "line_item":[]			 
        });
        temp_data_obj.push('1');
        var get_line_item=record_item[a].item_details;
        for(var b=0;b<get_line_item.length;b++)
        {           
          insu_value+=parseFloat(get_line_item[b].insurance_value);    
          get_line_item[b].checked=true;		
          send_record[send_record.length-1].line_item.push(get_line_item[b]);
        }		 
        send_record[send_record.length-1].total_insurence_val=insu_value;		  
      }	
    }

    for(var a=0;a<record_item.length;a++)
    {
      var amount_compair=70000;
      var get_vendor=record_item[a].vendor;
      if(get_vendor=='7773')
      {
        var get_line_item=record_item[a].item_details;
        var check_val=true;		
        do
        {
          var insu_value=0;
          var insu_value_temp=0;
          var obj_value_insert=[];
          for(var b=0;b<get_line_item.length;b++)
          {
            insu_value_temp=insu_value;
            if(!get_line_item[b].checked && get_line_item[b].sublist_type=='2')
            {			  
              var get_insu=parseFloat(get_line_item[b].insurance_value);	
              insu_value_temp+=get_insu;
              if(insu_value_temp<=amount_compair)
              {
                insu_value+=get_insu;    
                get_line_item[b].checked=true;		
                obj_value_insert.push(get_line_item[b]);
              }
            }
          }
          if(obj_value_insert.length>0)
          {
            send_record.push({
              "vendor":get_vendor,
              "total_insurence_val":insu_value,
              "line_item":[]
            });
            for(var n=0;n<obj_value_insert.length;n++)
            {
              send_record[send_record.length-1].line_item.push(obj_value_insert[n]);
            }
            amount_compair=50000;
            temp_data_obj.push('1');
          }
          else
          {
            check_val=false;
          }

        }while(check_val);
      }	
    }




    for(var a=0;a<record_item.length;a++)
    {
      var amount_compair=70000;
      var get_vendor=record_item[a].vendor;
      var get_line_item=record_item[a].item_details;
      var check_val=true;		
      do
      {
        var insu_value=0;
        var insu_value_temp=0;
        var obj_value_insert=[];
        for(var b=0;b<get_line_item.length;b++)
        {
          insu_value_temp=insu_value;
          if(!get_line_item[b].checked)
          {			  
            var get_insu=parseFloat(get_line_item[b].insurance_value);	
            insu_value_temp+=get_insu;
            if(insu_value_temp<=amount_compair)
            {
              insu_value+=get_insu;    
              get_line_item[b].checked=true;				  
              obj_value_insert.push(get_line_item[b]);
            }
          }
        }
        if(obj_value_insert.length>0)
        {
          send_record.push({
            "vendor":get_vendor,
            "total_insurence_val":insu_value,
            "line_item":[]			 
          });
          for(var n=0;n<obj_value_insert.length;n++)
          {
            send_record[send_record.length-1].line_item.push(obj_value_insert[n]);
          }
          amount_compair=50000;
          temp_data_obj.push('1');
        }
        else
        {
          check_val=false;
        }	

      }while(check_val);
    }
    if(send_record.length>0 || box_id_value.length>0)
    {
      document.getElementById("div__body").innerHTML ="Please wait."
      Call_Ajax_data_update(send_record,box_id_value);
    }
  }
}



function Call_Ajax_data_update(data_update,box_id_value)
{

  //var send_data='send_data='+encodeURIComponent(JSON.stringify(data_update[0]));
  //loadDoc(send_data);
  // alert(JSON.stringify(data_update));
  for(var c=0;c<data_update.length;c++)
  {
    var send_data='send_data='+encodeURIComponent(JSON.stringify(data_update[c]));
    loadDoc(send_data);
  }

  if(box_id_value)
  {
    if(box_id_value.length>0)
    {
      var send_data='qa_delete='+box_id_value.join(',');
      loadDoc(send_data);
    }
  }
}
function loadDoc(send_data) {  
  jQuery.ajax({
    type: 'POST',
    url: '/app/site/hosting/scriptlet.nl?script=618&deploy=1&data_save=T',
    data: send_data,
    dataType: "text",
    success: function(msgesem) {
      data_send_obj.push('');
      if(data_send_obj.length==temp_data_obj.length)
      {
        window.onbeforeunload = null;
        // self.close();
        location.reload();
      }
    }
  });
}



