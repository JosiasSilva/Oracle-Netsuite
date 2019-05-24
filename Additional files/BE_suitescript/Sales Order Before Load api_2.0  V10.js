/**
  *@NApiVersion 2.x
  *@NScriptType UserEventScript
   */
define(['N/search','N/log','N/ui/serverWidget','N/runtime','N/record','N/url','N/redirect'],
       function(search,log,serverWidget,runtime,record,url,redirect) {
         function beforeLoad(context) {
           // Molds_SO(context,serverWidget,search,SalesRecord,log)
           if(context.type == context.UserEventType.VIEW|| context.type == context.UserEventType.EDIT)
           {
             if(runtime.executionContext != "USERINTERFACE" )
               return true; 

             var get_cad=  context.request.parameters.red;
             log.debug({ title: 'get_cad', details: get_cad});
             if(get_cad!="F")
             {
               var log_message="Sales Order ID =>"+context.newRecord.id +
                   ";\n TYPE  =>" +context.type+
                   ";\n execution Context  =>" +runtime.executionContext+
                   ";\n Start Time  =>  "+ new Date();
               try
               {

                 var falg_submit={}; 
                 var falg_submit_record=[]; 
                 // var SalesRecord = record.load({"type": record.Type.SALES_ORDER,"id": context.newRecord.id});
                 var SalesRecord = context.newRecord;

                 try{ Get_Mols_SO(search,SalesRecord,log,falg_submit_record); //Script Use 606	
                    }catch(er){
                      log_message+="\n Get_Mols_SO  Error  => "+er.message; 
                    }
                 try{ Cads_SO(search,SalesRecord,log,falg_submit_record); //Script Use 1152	
                    }catch(er){
                      log_message+="\n Cads_SO  Error  => "+er.message; 
                    }
                 try{ set_status_field(search,SalesRecord,log,falg_submit);//Script Use 448	
                    }catch(er){
                      log_message+="\n set_status_field  Error  => "+er.message; 
                    }
                 try{ Auto_SalesReps_On_SalesOrders(search,SalesRecord,log,falg_submit);//Script Use 518	
                    }catch(er){
                      log_message+="\n Auto_SalesReps_On_SalesOrders  Error  => "+er.message; 
                    }
                 var check_val=false;
                 if(falg_submit_record.length>0)
                 {
                   check_val=true;
                   var SalesRecord_load = record.load({"type": record.Type.SALES_ORDER,"id": SalesRecord.id});
                   if(falg_submit.salesrep!=null)
                   {
                     SalesRecord_load.setValue('salesrep',falg_submit.salesrep);
                   }
                   if(falg_submit.custbody227!=null)
                   {
                     SalesRecord_load.setValue('custbody227',falg_submit.custbody227);
                   }
                   if(falg_submit.custbody_ring_stack!=null)
                   {
                     SalesRecord_load.setValue('custbody_ring_stack',falg_submit.custbody_ring_stack);
                   }
                   for(var a=0;a<falg_submit_record.length;a++)
                   {
                     var get_value=falg_submit_record[a];
                     SalesRecord_load.setSublistValue(falg_submit_record[a]);
                   }			  
                   SalesRecord_load.save({enableSourcing: true,ignoreMandatoryFields: true});

                 }
                 else
                 {
                   var get_check=JSON.stringify(falg_submit);
                   if(get_check.length>5)
                   {
                     check_val=true;
                     record.submitFields({type: record.Type.SALES_ORDER,id: SalesRecord.id,values:falg_submit ,options: {
                       enableSourcing: false,ignoreMandatoryFields : true}});
                   }
                 }
                 if(check_val)
                 {						
                   var mode_value=true;
                   if(context.type == context.UserEventType.VIEW){mode_value=false;}
                   log_message+="\n End Time  => "+new Date();
                   log.debug({ title: 'Message', details: log_message});
                   redirect.toRecord({"type": record.Type.SALES_ORDER,id : SalesRecord.id,
                                      parameters: {'red':'F'} ,isEditMode:mode_value});

                 }
               }
               catch(er)
               {
                 log_message+="\n Save Record Error => "+er.message;
               }
               log_message+="\n End Time  => "+new Date();
               log.debug({ title: 'Message', details: log_message});
             }

           }
         }
         return {
           beforeLoad: beforeLoad
         };
       });


String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
function Get_Mols_SO(search,SalesRecord,log,falg_submit_record)
{
  var molds_index_value_check=[];
  var molds_index_value_check_index=[];
  for(var x=0; x < SalesRecord.getLineCount({sublistId: 'item'}); x++)
  {

    var item =  SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x});
    var parent_data = search.lookupFields({type: 'item',id:item ,columns: ['parent','parent.vendor']});
    var parent = Get_Field_Value(parent_data.parent);
    var vendor = Get_Field_Value(parent_data['parent.vendor']);
    if (parent &&  vendor) {
      var molds=[];
      search.create({
        "type": "customrecord_mold",
        "filters": [
          ['custrecord_mold_item', search.Operator.ANYOF, parent],
          'and',
          ['custrecord_mold_vendor', search.Operator.ANYOF,vendor],
        ],
          "columns": ['name']
      }).run().each(function(result) {
        var get_molds_value=result.getValue("name");
        get_molds_value=get_molds_value.replaceAll(',','');
        get_molds_value=get_molds_value.replaceAll(';','');
        molds.push(get_molds_value);
        return true;
      });

      if(molds.length>0)
      {
        var molds_get=molds.join(';');
        molds_get=molds_get.replaceAll('<br>','');
        molds_get=molds_get.replaceAll(' ','');
        molds_get=encodeURI(molds_get);
        molds_get=molds_get.replaceAll('%0A','');
        molds_get=decodeURI(molds_get);
        var chkmoldsValue =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_molds_so',line: x});          
        if(chkmoldsValue)
        {
          chkmoldsValue=chkmoldsValue.replaceAll('<br>','');
          chkmoldsValue=chkmoldsValue.replaceAll(' ','');
          chkmoldsValue=encodeURI(chkmoldsValue);
          chkmoldsValue=chkmoldsValue.replaceAll('%0A','');
          chkmoldsValue=decodeURI(chkmoldsValue);
        }
        var get_new_molds_get=molds_get.replaceAll(';',';\n')
        get_new_molds_get=get_new_molds_get.substring(0,3000);
        var get_new_chkmoldsValue=chkmoldsValue.replaceAll(';',';\n')
        get_new_chkmoldsValue=get_new_chkmoldsValue.substring(0,3000);
        if(get_new_molds_get != get_new_chkmoldsValue )
        {
          molds_index_value_check.push(molds_get.replaceAll(';',';\n'));
          molds_index_value_check_index.push(x);
        }
      }

    }	
  }	
  if(molds_index_value_check.length>0)
  {

    var lineItemCount = SalesRecord.getLineCount({sublistId: 'item'});
    for (var x = 0; x < lineItemCount; x++) {
      var index_value=molds_index_value_check_index.indexOf(x);
      if(index_value>=0)
      {
        var set_molds_value=molds_index_value_check[index_value];
        if(set_molds_value.length>=3000)
        {
          set_molds_value=set_molds_value.substring(0,3000);
        }
        if(SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_molds_so',line: x})!=set_molds_value)
        {
          SalesRecord.setSublistValue({sublistId:'item',fieldId: 'custcol_molds_so', line:x,value:set_molds_value});
          falg_submit_record.push({sublistId:'item',fieldId: 'custcol_molds_so', line:x,value:set_molds_value});
        }
      }
    }
  }

}


function Cads_SO(search,SalesRecord,log,falg_submit_record) {
  var cads_index_value_check=[];
  var cads_index_value_check_index=[];
  var lineItemCount = SalesRecord.getLineCount({sublistId: 'item'});
  for (var x = 0; x < lineItemCount; x++) {
    var cads = [];
    var item = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x});
    var description =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'description',line: x});
    if(description)
    {	
      var des = description.split('Size');
      var ring_size_value=des[1];
      ring_size_value= parseFloat(ring_size_value); 
      if(ring_size_value)
      {
        var parent_data = search.lookupFields({type: 'item',id:item ,columns: ['parent','parent.vendor']});
        var parent = Get_Field_Value(parent_data.parent);
        var vendor = Get_Field_Value(parent_data['parent.vendor']);
        if (!parent )
          continue;
        if (parent &&  vendor) {
          search.create({
            "type": "customrecord_internal_cad",
            "filters": [
              ['custrecord_icr_parent_sku', search.Operator.ANYOF, parent],
              'and',
              ['custrecord_icr_ring_size', search.Operator.BETWEEN,[(ring_size_value - 1),(ring_size_value + 1)]],
              //'and',
              //['custrecord_icr_vendor', search.Operator.ANYOF,vendor]
            ],
              "columns": ['custrecord_icr_ring_size', 'custrecord_dimensions_n_shape']
          }).run().each(function(result) {
            var get_cads_value=result.getValue("custrecord_dimensions_n_shape");
            get_cads_value=get_cads_value.replaceAll(',','');
            get_cads_value=get_cads_value.replaceAll(';','');
            cads.push(get_cads_value);
            return true;
          });
        }
        if(cads.length>0)
        {
          var cads_get=cads.join(';');
          cads_get=cads_get.replaceAll('<br>','');
          cads_get=cads_get.replaceAll(' ','');
          cads_get=encodeURI(cads_get);
          cads_get=cads_get.replaceAll('%0A','');
          cads_get=decodeURI(cads_get);
          var chkCadValue =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_cad_so',line: x});          
          if(chkCadValue)
          {
            chkCadValue=chkCadValue.replaceAll('<br>','');
            chkCadValue=chkCadValue.replaceAll(' ','');
            chkCadValue=encodeURI(chkCadValue);
            chkCadValue=chkCadValue.replaceAll('%0A','');
            chkCadValue=decodeURI(chkCadValue);
          }
          var get_new_cads_get=cads_get.replaceAll(';',';\n')
          get_new_cads_get=get_new_cads_get.substring(0,3000);
          var get_new_chkCadValue=chkCadValue.replaceAll(';',';\n')
          get_new_chkCadValue=get_new_chkCadValue.substring(0,3000);
          if(get_new_cads_get != get_new_chkCadValue )
          {
            cads_index_value_check.push(cads_get.replaceAll(';',';\n'));
            cads_index_value_check_index.push(x);
          }
        }
      }
    }
  }

  if(cads_index_value_check.length>0)
  {

    var lineItemCount = SalesRecord.getLineCount({sublistId: 'item'});
    for (var x = 0; x < lineItemCount; x++) {
      var index_value=cads_index_value_check_index.indexOf(x);
      if(index_value>=0)
      {
        var set_cad_value=cads_index_value_check[index_value];
        if(set_cad_value.length>=3000)
        {
          set_cad_value=set_cad_value.substring(0,3000);
        }
        if(SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_cad_so',line: x})!=set_cad_value)
        {			 
          SalesRecord.setSublistValue({sublistId:'item',fieldId: 'custcol_cad_so', line:x,value:set_cad_value});
          falg_submit_record.push({sublistId:'item',fieldId: 'custcol_cad_so', line:x,value:set_cad_value});
        }
      }
    }
  }
}


function set_status_field(search,SalesRecord,log,falg_submit){

  var CheckCombination ={
    ComparisonShopper	:	 false,
    RingStack			:	 false
  };

  var RingStackField ='';
  var salesOrderID = SalesRecord.id
  var Highlight_status = [];
  var loose_diamond_flag = false;
  var order_status_array_sort = null;  
  var order_status = SalesRecord.getValue('custbody227');
  var paymentMethod = SalesRecord.getValue('custbody153');
  var order_status_array = [];
  if(order_status){
    order_status_array_sort=order_status.sort();
  }

  // 1 .Setting to be  added later Highlight conditions
  var setting_to_be_added_later = SalesRecord.getValue('custbody221');//get the field Value of "Setting to be added later"
  var categorys = [];
  var category_flag = true;
  var category1 = SalesRecord.getValue('custbody_category1');
  var category2 = SalesRecord.getValue('custbody_category2');
  var category3 = SalesRecord.getValue('custbody_category3');
  var category4 = SalesRecord.getValue('custbody_category4');
  var category5 = SalesRecord.getValue('custbody_category5');
  var category6 = SalesRecord.getValue('custbody_category6');
  categorys.push(category1,category2,category3,category4,category5,category6);
  for(var i=0;i<categorys.length;i++){
    var curr_category = categorys[i];
    if(curr_category == 7){
      loose_diamond_flag = true;
    }
    if(curr_category == 2 ||curr_category == 3){
      category_flag = false;
    }
  }
  if(setting_to_be_added_later && category_flag){
    Highlight_status.push('1');
  }


  //2 Pending Balance-Layaway Highlight conditions

  var layaway = SalesRecord.getValue('custbody111');
  var terms = SalesRecord.getValue('custbody225');
  var total = SalesRecord.getValue('total');
  var customdeposit_total = 0;
  search.create({
    "type": "customerdeposit",
    "filters": ['salesorder', search.Operator.ANYOF, salesOrderID],
    "columns": [ { name:'fxamount',summary: 'sum'}]
  }).run().each(function(result) {
    if(result.getValue("fxamount",null,"sum"))
      customdeposit_total+=parseFloat(result.getValue({ name:'fxamount',summary: 'sum'}));
  });

  var rate_customdeposit_total = customdeposit_total/parseFloat(total) ;
  if(layaway && (rate_customdeposit_total < 0.2)){
    Highlight_status.push('2');
  }

  //3 Pending Balance Highlight conditions
  var plaOfSale = SalesRecord.getValue('class');//test the condition is 'Website : Amazon Checkout' or 'Website : Paypal Express Checkout'
  var payMethod = SalesRecord.getValue('custbody153');//test the condition is 'GE Money' 
  var equal1 = (plaOfSale != '10');
  var equal2 = (plaOfSale != '11');
  var equal3 = (payMethod != '6');
  if(!terms){
    if(!layaway && (rate_customdeposit_total < 0.5)){

      if(plaOfSale != '10' && plaOfSale != '11' && payMethod != '6')
        Highlight_status.push('3');
    }
  }

  //4 Pending Diamond Confirmation Highlight conditions
  var diamond_confirmed_new = SalesRecord.getValue('custbody132');//get the field value of "Diamond Confirmed New"
  if(loose_diamond_flag ){
    if(diamond_confirmed_new != '1'){//diamond confirmed new != Yes
      Highlight_status.push('4'); 
    }
  }

  //5 Comparison Shopper Highlight conditions
  var SO_Items_parent = [];
  var BE1_SO_Items_Size = [];
  var BE2_SO_Items_Size = [];
  var SO_parent_flag = false;
  var SO_Size_flag = false;
  var SO_item_count =  SalesRecord.getLineCount({sublistId: 'item'});
  for(var i=0;i<SO_item_count;i++){
    var curr_so_item_stocknum = SalesRecord.getSublistText({sublistId: 'item',fieldId: 'item',line: i});
    var BE_pattern = /^be.*/im;
    var BE_result = BE_pattern.test(curr_so_item_stocknum);
    if(BE_result){
      SO_Items_parent.push(curr_so_item_stocknum.split(':')[0]);
    }
    var pattern = /^be[15].*/im;
    var result = pattern.test(curr_so_item_stocknum);
    var patternForBe2 = /^be[2].*/im;
    var be2Result = patternForBe2.test(curr_so_item_stocknum);
    if(result){
      BE1_SO_Items_Size.push(curr_so_item_stocknum.split('-')[curr_so_item_stocknum.split('-').length -1]);
    }
    if(be2Result){
      BE2_SO_Items_Size.push(curr_so_item_stocknum.split('-')[curr_so_item_stocknum.split('-').length -1]);
    }

  } 

  var SO_Items_parent_sort = SO_Items_parent.sort();
  var BE1_SO_Items_Size_sort = BE1_SO_Items_Size.sort();
  var BE2_SO_Items_Size_sort = BE1_SO_Items_Size.sort();
  if(SO_Items_parent.length>1){
    for(var i=0;i<SO_Items_parent.length;i++){
      if(SO_Items_parent_sort[i] == SO_Items_parent_sort[i+1]){
        SO_parent_flag = true;
      }
    }
  }
  if(BE1_SO_Items_Size.length>1){
    for(var i=0;i<BE1_SO_Items_Size.length;i++){
      if(BE1_SO_Items_Size[i] == BE1_SO_Items_Size[i+1]){
        SO_Size_flag = true;
      }
    }
  }
  if(BE2_SO_Items_Size.length>1){
    for(var i=0;i<BE2_SO_Items_Size.length;i++){
      if(BE2_SO_Items_Size[i] == BE2_SO_Items_Size[i+1]){
        SO_Size_flag = true;
      }
    }
  }
  if(SO_parent_flag ||SO_Size_flag)
  {
    CheckCombination  = RingStack(SalesRecord,CheckCombination);
    if(!CheckCombination.ComparisonShopper)
    {
      Highlight_status.push('5');		
    }
  }

  //6 Info needed from CS Highlight conditions
  var Ops_CS_Status = SalesRecord.getValue('custbodyops_cs_status');//get the field value of "Ops/CS Status"
  if(Ops_CS_Status == '1'){
    Highlight_status.push('6');
  }


  //7 New setting added Highlight conditions

  var salesOrder_status = SalesRecord.getValue('orderstatus');
  var new_setting_add_flag = false;
  if(salesOrder_status == 'B'){
    for(var i=0;i<SO_item_count;i++){
      var curr_so_item_name = SalesRecord.getSublistText({sublistId: 'item',fieldId: 'item',line: i});;
      var pattern = /^be[152].*/im;
      var result = pattern.test(curr_so_item_name);
      if(result){
        var curr_so_Relate_PO =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'createpo',line: i});
        var curr_so_item_description = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'description',line: i});          
        var hasBackstockText = true;
        if(curr_so_item_description)
        {
          if(curr_so_item_description.indexOf('backstock.') != -1)
            hasBackstockText = false;
        }

        if(!curr_so_Relate_PO && hasBackstockText){
          new_setting_add_flag = true;
          break;
        }
      }
    }

  }
  if(new_setting_add_flag){
    Highlight_status.push('7');
  }

  //8 Ready to Order Highlight conditions
  if(Highlight_status.length == 0 || paymentMethod == '11'){
    Highlight_status.push('8');
  }
  var Highlight_status_sort = Highlight_status.sort();
  var Highlight_status_change_flag = false;
  if(order_status_array_sort){
    if(Highlight_status_sort.length == order_status_array_sort.length){
      for(var i=0;i<Highlight_status_sort.length;i++){
        if(Highlight_status_sort[i]!= order_status_array_sort[i]){
          Highlight_status_change_flag = true;
          break;
        }
      }
    }else{
      Highlight_status_change_flag = true;
    }
  }

  else
  {
    Highlight_status_change_flag = true;
  }

  var temp_ring_stack =  SalesRecord.getValue('custbody_ring_stack');
  if((!temp_ring_stack && CheckCombination.RingStack ) ||( temp_ring_stack && !CheckCombination.RingStack ))
  {
    Highlight_status_change_flag = true;
  }

  if(Highlight_status_change_flag)
  {
    try
    {
      var get_old_Highlight_status_obj=[];
      var get_old_Highlight_status=order_status;
      if(get_old_Highlight_status){get_old_Highlight_status_obj=get_old_Highlight_status.sort();}				
      Highlight_status=Highlight_status.sort();				
      var string_old_status=JSON.stringify(get_old_Highlight_status);
      var string_new_status=JSON.stringify(Highlight_status);				
      var get_old_ring_stack=SalesRecord.getValue("custbody_ring_stack");
      if(CheckCombination.RingStack )
      {
        if((SalesRecord.getValue('custbody227')!=Highlight_status || !SalesRecord.getValue('custbody_ring_stack')) &&  (string_old_status !=string_new_status || !get_old_ring_stack))
        {

          SalesRecord.setValue('custbody227',Highlight_status);
          SalesRecord.setValue('custbody_ring_stack',true);
          falg_submit.custbody227=Highlight_status;
          falg_submit.custbody_ring_stack=true;
        }
      }
      else
      {
        if((SalesRecord.getValue('custbody227')!=Highlight_status || SalesRecord.getValue('custbody_ring_stack')) && (string_old_status !=string_new_status || get_old_ring_stack))
        {
          SalesRecord.setValue('custbody227',Highlight_status);
          SalesRecord.setValue('custbody_ring_stack',false);
          falg_submit.custbody227=Highlight_status;
          falg_submit.custbody_ring_stack=false;
        }
      }
    }
    catch(e)
    {

    }
  }
}



function RingStack(SalesRecord,CheckCombination)
{
  var flag = false;
  try
  {
    var soId = SalesRecord.id;
    try
    {
      var myObject = [];	
      var count =  SalesRecord.getLineCount({sublistId: 'item'});
      for (var z = 0; z < count; z++) 
      {
        var ItemId =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: z});
        var ItemArr = search.lookupFields({type: 'item',id:ItemId ,columns: ['custitem1','custitem2','parent']});		  
        var parent = Get_Field_Value(ItemArr.parent);
        var ItemMetal= Get_Field_Value(ItemArr.custitem1);
        var ItemSize= Get_Field_Value(ItemArr.custitem2);
        if(parent && ItemMetal && ItemSize)
        {
          myObject.push({
            ItemId: ItemId,
            parent: parent,
            Metal: ItemMetal,
            Size: ItemSize
          });
        }								
      } 
      if (myObject.length > 2) 
      {

        var groups = myObject;
        var Size = {};
        var SizeName = [];
        for (var i = 0; i < groups.length; i++) 
        {
          var group = groups[i];
          if (typeof Size[group.Size] === "undefined") 
          {
            Size[group.Size] = [];
            SizeName.push(group.Size);
            SizeName.sort();
          }
          Size[group.Size].push({
            ItemId: group.ItemId,
            parent: group.parent,
            Metal: group.Metal,
            Size: group.Size
          });
        }
        var groups = myObject;
        var Metal = {};
        var MetalName = [];

        for (var i = 0; i < groups.length; i++) 
        {
          var group = groups[i];

          if (typeof Metal[group.Metal] === "undefined") 
          {
            Metal[group.Metal] = [];
            MetalName.push(group.Metal);
            MetalName.sort();
          }
          Metal[group.Metal].push({
            ItemId: group.ItemId,
            parent: group.parent,
            Metal: group.Metal,
            Size: group.Size
          });
        }
        if (SizeName.length > 0) 
        {
          for (var x = 0; x < SizeName.length; x++) 
          {
            var CurrentSizeName = SizeName[x];
            if (Size[CurrentSizeName].length > 2) 
            {
              var groups = Size[CurrentSizeName];
              var Metal = {};
              var MetalName = [];
              for (var i = 0; i < groups.length; i++) 
              {
                var group = groups[i];
                if (typeof Metal[group.Metal] === "undefined") 
                {
                  Metal[group.Metal] = [];
                  MetalName.push(group.Metal);
                  MetalName.sort();
                }
                Metal[group.Metal].push({
                  ItemId: group.ItemId,
                  parent: group.parent,
                  Metal: group.Metal,
                  Size: group.Size
                });
              }
              for (var w = 0; w < MetalName.length; w++) 
              {
                var CurrentMetalName = MetalName[w];
                var SameMetalMetal = Metal[CurrentMetalName];
                if (SameMetalMetal.length > 0) 
                {
                  CheckCombination = Combination(SameMetalMetal,CheckCombination);	
                  if(CheckCombination.ComparisonShopper || CheckCombination.RingStack)
                  {										
                    flag = true;																		
                    break;
                  }
                }
              }
              if(flag)	
              {
                break;
              }	
            }
          }
        }
      }
    }
    catch(ex)
    {
    }
  }
  catch(e)
  {
  }
  return CheckCombination;
}



function Combination(SameSizeMetal,CheckCombination)
{
  var Type = 0;
  var Combination2 = 0;
  var CombArr2 = ['3319487','3319285','3319386'];//['BE266LCY ','BE266LCB','BE266LCP '];
  var be1_Type = 0;
  var be2_Type = 0;
  var Combination1 = 0;
  var CombArr1 = ['3258147','3266526','3266602'];//['BE1D35PR ','BE1D40RD ','BE1D53PS '];

  var Combination3 = 0;
  var CombArr3 = ['3245555','3498869','2495371'];//['BE2133 ','BE2564LD','BE2564 '];

  var Combination4 = 0;
  var CombArr4 = ['17755','19118','2030815'];//['BE2BZD20R30 ','BE250BDE ','BE260E '];

  var Combination5 = 0;
  var CombArr5 = ['4338','4338','868129'];//['BE2PD50R50 ','BE2PD50R50 ','BE2M254P '];


  for (var v = 0; v < SameSizeMetal.length; v++) 
  {
    var CurrentItemName = SameSizeMetal[v].parent;
    var CurrentMetalName = SameSizeMetal[v].Metal;
    if (CurrentItemName == CombArr1[0] || CurrentItemName == CombArr1[1] || CurrentItemName == CombArr1[2]) 
    {
      CombArr1[CombArr1.indexOf[CurrentItemName]]='';
      Combination1++;
    }
    else if (CurrentItemName == CombArr2[0] || CurrentItemName == CombArr2[1] || CurrentItemName == CombArr2[2]) 
    {
      if(CurrentMetalName == "1" || CurrentMetalName == "2" || CurrentMetalName == "7")
      {
        CombArr2[CombArr2.indexOf[CurrentItemName]]='';
        Combination2++;
      }			
    }
    else if (CurrentItemName == CombArr3[0] || CurrentItemName == CombArr3[1] || CurrentItemName == CombArr3[2]) 
    {
      CombArr3[CombArr3.indexOf[CurrentItemName]]='';
      Combination3++;
    }
    else if (CurrentItemName == CombArr4[0] || CurrentItemName == CombArr4[1] || CurrentItemName == CombArr4[2]) 
    {
      CombArr4[CombArr4.indexOf[CurrentItemName]]='';
      Combination4++;
    }
    else if (CurrentItemName == CombArr5[0] || CurrentItemName == CombArr5[1] || CurrentItemName == CombArr5[2]) 
    {
      CombArr5[CombArr5.indexOf[CurrentItemName]]='';
      Combination5++;
    }
    var CurrentItemText = search.lookupFields({type: 'item',id:ItemId ,columns: ['item']});		  
    var CurrentItemText =  Get_Field_Text(CurrentItemText);			
    var patternBE1 = /^be[1].*/im;			
    if( patternBE1.test(CurrentItemText))
    {
      be1_Type++;
    }
    var patternBE2 = /^be[2].*/im;	
    if(patternBE2.test(CurrentItemText))
    {					
      be2_Type++;
      if(CurrentMetalName == "1" || CurrentMetalName == "2" || CurrentMetalName == "7")
      {
        Type++;
      }
    }
  }
  if (Combination1 > 2 || Combination2 > 2 || Combination3 > 2 || Combination4 > 2 || Combination5 > 2 ) 
  {
    if(((Combination3 > 2 || Combination4 > 2 || Combination5 > 2) && be2_Type == 3) || (Combination2 > 2 && Type == 3 ) || (Combination1 > 2 && be1_Type == 3 ))
    {
      CheckCombination.ComparisonShopper = true;		
    }
    CheckCombination.RingStack = true;		
  }
  return CheckCombination;
}




function Auto_SalesReps_On_SalesOrders(search,SalesRecord,log,falg_submit){	
  var EMP_ID = SalesRecord.getValue('salesrep');
  var set_seles_rep=false;
  if ( EMP_ID == '-5' || EMP_ID == '1877' ) {
    set_seles_rep=true;
  }else if(EMP_ID){
    var inActive = search.lookupFields({type: 'employee',id:EMP_ID ,columns: 'isinactive'});
    inActive=inActive.isinactive;
    if(inActive){
      set_seles_rep=true;
    }
  }
  if(set_seles_rep && !SalesRecord.getValue('salesrep'))
  {
    SalesRecord.setValue('salesrep','');
    falg_submit.salesrep='';
  }
}




function Get_Field_Value(data_value)
{

  if(data_value)
  {
    if(data_value[0])
    {
      if(data_value[0].value)
      {
        return data_value[0].value;
      }
    }
  }
  return "";
}
function Get_Field_Text(data_value)
{
  if(data_value)
  {
    if(data_value[0])
    {
      if(data_value[0].text)
      {
        return data_value[0].text;
      }
    }
  }
  return "";
}