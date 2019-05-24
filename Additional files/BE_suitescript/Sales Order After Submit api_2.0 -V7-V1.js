/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define(['N/record','N/search','N/log','N/runtime','N/format'],
       function(record,search,log,runtime,format) {
         function afterSubmit(context) {
           var log_message="Sales Order ID =>"+context.newRecord.id +
               ";\n TYPE  =>" +context.type+
               ";\n execution Context  =>" +runtime.executionContext+
               ";\n Start Time  =>  "+ new Date();
           try
           {
             var SalesRecord = record.load({
               type: record.Type.SALES_ORDER, 
               id: context.newRecord.id
             });
             var field_value={}
             var customer = search.lookupFields({
               type: 'customer',
               id: SalesRecord.getValue('entity'),
               columns: ['custentity_sales_order_1', 'custentity_sales_order_2', 'custentity_sales_order_3', 'custentity_sales_order_4','custentity_sales_order_5','custentity41']
             });

             try{Returning_Customer_Fraud_Data(search,context,SalesRecord,field_value,format,log,customer);}//Script Use 456
             catch(er){ log_message+=";\n Returning_Customer_Fraud_Data Error => "+er.message;}

             try{SetShippingZoneField(context,SalesRecord,field_value);}//Script Use 736
             catch(er){ log_message+=";\n SetShippingZoneField Error => "+er.message;}
             try{SetOrderCategoryItems(search,context,SalesRecord,field_value,runtime,log);}// Script Use 75
             catch(er){ log_message+=";\n SetOrderCategoryItems Error => "+er.message;}
             try{Return_Label_Insurance(search,context,SalesRecord,field_value,log);}// Script Use 1082
             catch(er){ log_message+=";\n Return_Label_Insurance Error => "+er.message;}    

             try{setTypeOfOrder(context,SalesRecord,field_value);}// Script Use 132
             catch(er){ log_message+=";\n setTypeOfOrder Error => "+er.message;}  

             try{Show_Price_On_Receipt(context,SalesRecord,field_value);}// Script Use 150
             catch(er){ log_message+=";\n Show_Price_On_Receipt Error => "+er.message;}  

             try{Connection_Opportunity_SO_AS(context,runtime,SalesRecord,search,field_value);}// Script Use 198
             catch(er){ log_message+=";\n Connection_Opportunity_SO_AS Error => "+er.message;}  

             try{Update_SO_Balance(context,runtime,search,SalesRecord,field_value);}//Script Use 330
             catch(er){ log_message+=";\n Update_SO_Balance Error => "+er.message;}

             try{calcSOContributionMargin(context,SalesRecord,format,search,field_value);}//Script Use 603
             catch(er){ log_message+=";\n calcSOContributionMargin Error => "+er.message;}

             try{My_Account_SO_Data_Integration(runtime,context,SalesRecord,field_value);}//Script Use 1030
             catch(er){ log_message+=";\n My_Account_SO_Data_Integration Error => "+er.message;}

             try{update_layaway_on_PO(context,SalesRecord,record);}//Script Use 2002
             catch(er){ log_message+=";\n update_layaway_on_PO Error => "+er.message;}

             try{setNotEligbleForReturn(context,runtime,search,SalesRecord);}//Script Use 924
             catch(er){ log_message+=";\n setNotEligbleForReturn Error => "+er.message;}



             try{Link_Custom_Diamond_SO(context,SalesRecord,search,record);}//Script Use 271
             catch(er){ log_message+=";\n Link_Custom_Diamond_SO Error => "+er.message;}



             try{EstateResizePurchaseOrders(SalesRecord,search,record,context);}//Script Use 701
             catch(er){ log_message+=";\n EstateResizePurchaseOrders Error => "+er.message;}


             //runtime.getCurrentSession().set({name: "myKey_SO"+SalesRecord.id, value: JSON.stringify(SalesRecord)});
             var get_val_cust=JSON.stringify(field_value);
             if(get_val_cust.length>0)
             {
               try
               {

                 record.submitFields({
                   type: record.Type.SALES_ORDER,
                   id: context.newRecord.id,
                   values:field_value ,
                   options: {
                     enableSourcing: false,
                     ignoreMandatoryFields : true
                   }

                 });




               }
               catch(er)
               {
                 log_message+=";\n  Error Save Data => "+er.message;
               }

             }     
           }
           catch(er)
           {
             log_message+=";\n  Error => "+er.message;
           }
           log_message+=";\n  End Time  => "+new Date();
           log.debug({ title: 'Message ', details:log_message });

         }
         return {
           afterSubmit: afterSubmit
         };
       });



function Update_SO_Balance(context,runtime,search,SalesRecord,field_value)
{

  if(runtime.executionContext != "USERINTERFACE" && runtime.executionContext!="USEREVENT" )
  {
    return true;
  }

  if(context.type==context.UserEventType.CREATE || context.type==context.UserEventType.EDIT)
  {
    var check_result=true;
    search.create({
      'type':'customerdeposit',
      'filters':[['mainline','is','T'],'and',['salesorder','anyof',SalesRecord.id]],
      'columns':[{'name':'fxamount','group':'sum'}]
    }).run().each(function (results){
      check_result=false;
      var deposit_total = results.getValue("fxamount",null,"sum");
      if(!deposit_total){ deposit_total = 0.00;}
      var get_order_total=SalesRecord.getValue('total');
      var balance = parseFloat(get_order_total) - parseFloat(deposit_total);
      if(SalesRecord.getValue('custbody_so_balance')!=balance)
      {
        //SalesRecord.setValue('custbody_so_balance',balance);
        field_value.custbody_so_balance=balance;
      }

    });


    if(check_result)
    {
      var get_deposit_total=parseFloat(SalesRecord.getValue('custbody_so_deposit_total'));
      var get_total=0;
      var get_blance=0;
      if(!SalesRecord.getValue('total'))
      {
        get_total=parseFloat(SalesRecord.getValue('total'));
      }
      if(!SalesRecord.getValue('custbody_so_balance'))
      {
        get_blance=parseFloat(SalesRecord.getValue('custbody_so_balance'));
      }
      if(get_deposit_total>0)
      {
        // SalesRecord.setValue('custbody_so_deposit_total',0.00);
        field_value.custbody_so_deposit_total=0.00;
      }
      if(get_blance!=get_total)
      {
        //SalesRecord.setValue('custbody_so_balance',SalesRecord.getValue("total"));
        field_value.custbody_so_balance=get_total;
      }
    }

  }
}


function Returning_Customer_Fraud_Data(search,context,SalesRecord,field_value,format,log,customer) {
  if (context.type == context.UserEventType.CREATE)
  {

    var get_custbody148=SalesRecord.getValue('custbody148');
    var get_custbody228=SalesRecord.getValue('custbody228');
    var customer_ID = SalesRecord.getValue('entity');
    var salesorder_IN_IDs = [];
    var customer_item = [];
    var salesorder_confirmed_frauds = [];
    var yellow_gold_flag = false;
    var engrave_ring_flag = false;
    var confirmed_fraud_flag = false;
    var returnning_custom = [];
    var salesorder_dates = [];
    var last_saleorder_date = null;
    if(customer_ID)
    {

      var customer_data={'custentity_sales_order_1':Get_Field_Value(customer.custentity_sales_order_1), 
                         'custentity_sales_order_2':Get_Field_Value(customer.custentity_sales_order_2),
                         'custentity_sales_order_3':Get_Field_Value(customer.custentity_sales_order_3),
                         'custentity_sales_order_4':Get_Field_Value(customer.custentity_sales_order_4),
                         'custentity_sales_order_5':Get_Field_Value(customer.custentity_sales_order_5)
                        }	
      if(customer_data.custentity_sales_order_1 && (customer_data.custentity_sales_order_1 !=SalesRecord.id) )
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_1);
      if(customer_data.custentity_sales_order_2 && (customer_data.custentity_sales_order_2 !=SalesRecord.id))
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_2);
      if(customer_data.custentity_sales_order_3 && (customer_data.custentity_sales_order_3 !=SalesRecord.id))
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_3);
      if(customer_data.custentity_sales_order_4 && (customer_data.custentity_sales_order_4 !=SalesRecord.id))
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_4);
      if(customer_data.custentity_sales_order_5 && (customer_data.custentity_sales_order_5 !=SalesRecord.id))
        salesorder_IN_IDs.push(customer_data.custentity_sales_order_5);
    }

    if(salesorder_IN_IDs.length>0)
    {
      //log.debug({ title: 'salesorder_IN_IDs', details:salesorder_IN_IDs});
      var mySearch = search.load({id:'customsearch_returning_customers_informa'});
      var mySearchFilter = search.createFilter('internalid',null,'anyof',salesorder_IN_IDs);
      mySearch.filters.push(mySearchFilter);
      var search_record = mySearch.run(); 
      var col=search_record.columns;
      var run_filter=0;
      search_record.each(function(result) {
        run_filter++;
        //log.debug({ title: 'run_filter', details:run_filter});
        var trandate=result.getValue(col[0]);
        var curr_item=result.getText(col[1]);
        var frad_check=result.getValue(col[2]);
        if(last_saleorder_date)
        {

          var parsed_trandate = format.parse({value: trandate,type: format.Type.DATE});
          var parsed_last_saleorder_date = format.parse({value: last_saleorder_date,type: format.Type.DATE});			
          if(parsed_trandate>parsed_last_saleorder_date){
            last_saleorder_date = trandate;
          }
        }
        else{
          last_saleorder_date = trandate;
        }	
        if(frad_check=='T')
        {
          confirmed_fraud_flag=true;
        }
        var pattern = /^be[152].*/im;
        var result = pattern.test(curr_item);
        if(result){
          if(curr_item.indexOf('18KY') != -1){
            yellow_gold_flag = true;
          }
        }
        if(curr_item == 'Engrave Ring'){
          engrave_ring_flag = true;
        }
        return true;
      });
      if(yellow_gold_flag){
        returnning_custom.push(1);
      }
      if(engrave_ring_flag){
        returnning_custom.push(2);
      }
      if(!yellow_gold_flag&&!engrave_ring_flag){
        returnning_custom.push(3);
      }
      if(confirmed_fraud_flag){
        returnning_custom.push(4);
      }
      if(last_saleorder_date){
        var salesorder_notes = SalesRecord.getValue('custbody148');
        if(salesorder_notes){
          salesorder_notes = "Returning Customer, Last order: "+ last_saleorder_date+";  "+salesorder_notes;
        }else{
          salesorder_notes = "Returning Customer, Last order: "+ last_saleorder_date;
        }

        if(SalesRecord.getValue('custbody148')!=salesorder_notes &&  salesorder_notes!=get_custbody148 )
        {			

          //SalesRecord.setValue('custbody148',salesorder_notes);
          field_value.custbody148=salesorder_notes;

        }
      }
      if(SalesRecord.getValue('custbody228')!=returnning_custom &&( returnning_custom.length>0 && returnning_custom!=get_custbody228)){

        //SalesRecord.setValue('custbody228',returnning_custom);
        field_value.custbody228=returnning_custom;

      }
    }
  }
}

function SetShippingZoneField(context,SalesRecord,field_value)
{
  // log.debug({ title: 'SetShippingZoneField', details:'OK'});
  if( context.type == context.UserEventType.CREATE|| context.type == context.UserEventType.EDIT || context.type == context.UserEventType.XEDIT || context.type == context.UserEventType.USEREVENT)
  {
    var shipCountry= new Array();
    var shipCountries="AS,AU,BN,CK,CN,FJ,FM,GU,HK,ID,JP,KH,KI,LA,MH,MM,MN,MO,MP,MV,MY,NC,NR,NU,NZ,PF,PG,PH,PW,SB,SG,TH,TL,TO,TV,TW,VN,VU,WF,WS";
    var shipCountry=shipCountries.split(',');						
    var shipZones= new Array();
    var shipZones1= ShippingZone_data();

    var ShippingZone=0;
    var shipZones=shipZones1.split(',');
    var itemCount=shipZones.length;
    var shipZipCode=SalesRecord.getValue('shipzip');
    var shipCountryCode=SalesRecord.getValue('shipcountry');
    var matchZipIndex = shipZones.indexOf(shipZipCode);
    var matchCountryIndex=shipCountry.indexOf(shipCountryCode);			
    if(matchZipIndex >= 0)
    {
      ShippingZone=1;
    }
    else
    {

      ShippingZone=2;				
      if(matchCountryIndex >=0)
      {
        ShippingZone=1;
      }

    }
    var get_custbody283=SalesRecord.getValue('custbody283');
    if(SalesRecord.getValue('custbody283')!=ShippingZone && ShippingZone!=get_custbody283)
    {

      //SalesRecord.setValue('custbody283',ShippingZone);
      field_value.custbody283=ShippingZone;
    }
  }
}
function SetOrderCategoryItems(search,context,SalesRecord,field_value,runtime,log)
{
  //log.debug({ title: 'SetOrderCategoryItems', details:'OK'});
  // if(context.type == context.UserEventType.CREATE ||	context.type == context.UserEventType.EDIT 	||      context.type == context.UserEventType.APPROVE 	||	context.type == context.UserEventType.XEDIT || context.type == context.UserEventType.USEREVENT)
  if(context.type == context.UserEventType.CREATE ||	context.type == context.UserEventType.EDIT )
  {

    //  if(runtime.executionContext != "USERINTERFACE" && runtime.executionContext != "WEBSERVICES" && runtime.executionContext != "USEREVENT" )
    if(runtime.executionContext == "SCHEDULED" )
      return true;
    var mySearch = search.load({id:'customsearch_sales_order_item_category'});
    var mySearchFilter = search.createFilter('internalid',null,'anyof',SalesRecord.id);
    mySearch.filters.push(mySearchFilter);
    var search_record = mySearch.run(); 
    if(search_record)
    {
      var col=search_record.columns;
      var count=0;
      search_record.each(function(result) {
        if(result.getValue(col[2]))
        {
          var item_value=result.getValue(col[2]);
          if(result.getValue(col[0])==0.00 && (result.getValue(col[2])=="4" || result.getValue(col[2])=="5" || result.getValue(col[2])=="9" || result.getValue(col[2])=="34"))
          {
            item_value='37';
          }
          switch(count)
          {
            case 0:
              if(SalesRecord.getValue('custbody_category1')!=item_value)
              { 
                //SalesRecord.setValue('custbody_category1',item_value);
                field_value.custbody_category1=item_value;
                break;
              }
            case 1:
              if(SalesRecord.getValue('custbody_category2')!=item_value)
              {
                //SalesRecord.setValue('custbody_category2',item_value);
                field_value.custbody_category2=item_value;
                break;
              }
            case 2:
              if(SalesRecord.getValue('custbody_category3')!=item_value)
              {
                //SalesRecord.setValue('custbody_category3',item_value);
                field_value.custbody_category3=item_value;
                break;
              }
            case 3:
              if(SalesRecord.getValue('custbody_category4')!=item_value)
              {
                //SalesRecord.setValue('custbody_category4',item_value);
                field_value.custbody_category4=item_value;
                break;
              }
            case 4:
              if(SalesRecord.getValue('custbody_category5')!=item_value)
              {
                // SalesRecord.setValue('custbody_category5',item_value);
                field_value.custbody_category5=item_value;
                break;
              }
            case 5:
              if(SalesRecord.getValue('custbody_category6')!=item_value)
              {
                //SalesRecord.setValue('custbody_category6',item_value);
                field_value.custbody_category6=item_value;
                break;
              }
          }
        }
        count++;
        return true;
      });
    }

    if( ! SalesRecord.getValue('custbody_run_item_date_fields_update') &&  count>0)
    {

      //SalesRecord.setValue('custbody_run_item_date_fields_update',true);
      field_value.custbody_run_item_date_fields_update=true;
    }

  }	
}
function Return_Label_Insurance(search,context,SalesRecord,field_value,log)
{
  // log.debug({ title: 'Return_Label_Insurance', details:context.type});
  if( context.type == context.UserEventType.CREATE|| context.type == context.UserEventType.EDIT || context.type == context.UserEventType.XEDIT || context.type == context.UserEventType.USEREVENT)
  {

    // log.debug({ title: 'returnInsurance_data', details:'Return_Label_Insurance'});
    var returnInsurance = 0.00;			
    var typeOfSendBack = SalesRecord.getValue("custbody35");
    var typeOfOrder = SalesRecord.getValue("custbody87");
    if(typeOfOrder &&  typeOfOrder.length==1)
    {
      typeOfOrder=typeOfOrder[0];
    }
    else
    {
      typeOfOrder='';
    }


    var count_list= SalesRecord.getLineCount({sublistId: 'item'});
    if(typeOfSendBack=="2")
    {
      for(var x=0; x < count_list; x++)
      {
        var get_amount=parseFloat(SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_full_insurance_value',line: x}));
        if(get_amount){returnInsurance +=get_amount}
      }
    }
    else if(typeOfOrder=="4")
    {
      //Type of Order = Exchange
      var createdFrom = SalesRecord.getValue("custbody_created_from");
      if(createdFrom)
      {

        var returnInsurance_data = search.lookupFields({
          type: 'salesorder',
          id: createdFrom,
          columns: ['custbody_full_insurance_amount']
        });
        // log.debug({ title: 'returnInsurance_data', details:returnInsurance_data});
        var get_ins_amount=parseFloat(returnInsurance_data.custbody_full_insurance_amount);
        if(get_ins_amount)
        {
          returnInsurance =get_ins_amount ;
        }
      }
    }
    else
    {
      for(var x=0; x < count_list; x++)
      {

        if(SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_category',line: x})=="12")
        {
          var get_ins_amount_value=parseFloat( SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_full_insurance_value',line: x}));
          if(get_ins_amount_value)
          {
            returnInsurance += get_ins_amount_value;
          }
        }
      }
    }
    if(SalesRecord.getValue('custbody_return_label_insurance')!=returnInsurance)
    {

      //SalesRecord.setValue('custbody_return_label_insurance',returnInsurance);
      field_value.custbody_return_label_insurance=returnInsurance;
    }
  }
}




function setTypeOfOrder(context,SalesRecord,field_value)
{
  if (context.type == context.UserEventType.CREATE  )
  {
    var Place_Of_Sale = SalesRecord.getValue("class");
    var Order_Number = SalesRecord.getValue("tranid");
    var get_value=SalesRecord.getValue("custbody87");

    if(get_value && get_value.length==1)
    {
      get_value=get_value[0];
    }
    else
    {
      get_value='';
    }



    if(get_value!="1" &&(Place_Of_Sale=="1" && /^\d+$/.test(Order_Number)))
    {
      //SalesRecord.setValue("custbody87","1");
      field_value.custbody87="1";
    }
    else if(get_value!="2" &&(Order_Number.indexOf("SZ")!=-1 || Order_Number.indexOf("sz")!=-1))
    {
      //SalesRecord.setValue("custbody87","2");
      field_value.custbody87="2";
    }
    else if (get_value!="3" &&(Order_Number.indexOf("RP")!=-1 || Order_Number.indexOf("rp")!=-1))
    {
      //SalesRecord.setValue("custbody87","3");
      field_value.custbody87="3";
    }
    else if(get_value !="4" && (Order_Number.indexOf("EX")!=-1 || Order_Number.indexOf("ex")!=-1))
    {
      //SalesRecord.setValue("custbody87","4");
      field_value.custbody87="4";
    }
    else if(get_value!="5" && (Order_Number.indexOf("WB")!=-1 || Order_Number.indexOf("wb")!=-1))
    {
      // SalesRecord.setValue("custbody87","5");
      field_value.custbody87="5";
    }
    else if(get_value!="10" && (Order_Number.indexOf("UP")!=-1 || Order_Number.indexOf("up")!=-1))
    {
      //SalesRecord.setValue("custbody87","10");
      field_value.custbody87="10";
    }   
    else if(get_value!="1" && /^\d+$/.test(Order_Number))
    {
      //SalesRecord.setValue("custbody87","1"); //If no string values, set to New Order
      field_value.custbody87="1";
    }
  }
}
function Show_Price_On_Receipt(context,SalesRecord,field_value)
{

  if(SalesRecord.getValue("customform")!="130" && !SalesRecord.getValue("custbody97")&&(context.type == context.UserEventType.CREATE||(context.type == context.UserEventType.EDIT)))
  {
    //SalesRecord.setValue("customform","130");
    field_value.customform="130";
  }
}

function Connection_Opportunity_SO_AS(context,runtime,SalesRecord,search,field_value)
{

  //  if(context.type == context.UserEventType.CREATE  && runtime.executionContext != "USERINTERFACE" )
  {
    var  length_customer=0;
    var opportunity_id;
    var mySearch=search.create({
      "type": "opportunity",
      "filters": [
        ['entity', search.Operator.ANYOF, SalesRecord.getValue('entity')], 'and',
        ['entitystatus', search.Operator.ANYOF, [7,6,11,8,9,17,15]]
      ]
    }).run().each(function(result) {
      opportunity_id=result.id;
      length_customer++;
      if(length_customer>1)
        return false;
      return true;
    });

    if(SalesRecord.getValue("opportunity")!=opportunity_id && length_customer==1)
    {

      //SalesRecord.setValue("opportunity",opportunity_id);
      field_value.opportunity=opportunity_id;
    }
  }

}


function update_layaway_on_PO(context,SalesRecord,record){
  if((context.type==context.UserEventType.APPROVE  ||  context.type==context.UserEventType.EDIT) && SalesRecord.getValue('custbody111'))
  {
    for(var x=0;x<SalesRecord.getLineCount({sublistId: 'item'});x++)
    {
      var get_po=SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'poid',line: x});
      if(get_po)
      {
        record.submitFields({
          type: record.Type.PURCHASE_ORDER,
          id: get_po,
          values:{'custbody111':true} ,
          options: {
            enableSourcing: false,
            ignoreMandatoryFields : true
          }
        });		   
      }
    }
  }
}

function setNotEligbleForReturn(context,runtime,search,SalesRecord)
{
  if(context==context.UserEventType.CREATE || context==context.UserEventType.EDIT  )
  {

    if(runtime.executionContext != "USERINTERFACE" && runtime.executionContext!="USEREVENT" )
    {
      return true;
    }

    var neiArr=[];
    if(SalesRecord.getValue('custbody87') && SalesRecord.getValue('custbody87').length==1 && SalesRecord.getValue('custbody87')[0]=='4')
    {
      neiArr.push('1'); 
    }
    if(SalesRecord.getValue('custbodyfinal_sale')=='1')
    {
      neiArr.push('4');
    }
    for(var x=0;x<SalesRecord.getLineCount({sublistId: 'item'});x++)
    {
      var itemId =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x}); 
      var itemType =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'itemtype',line: x});
      if(itemId=='782')
      {	   
        var item_itemCategory = search.lookupFields({ type: 'item', id: itemId, columns: ['custitem20']});
        if(Get_Field_Value(item_itemCategory.custitem20)=='12')
        {			
          neiArr.push('2'); 
        }
      }
      else if(itemId=='2158514')
      {
        var item_itemCategory = search.lookupFields({ type: 'item', id: itemId, columns: ['custitem20']});
        if(Get_Field_Value(item_itemCategory.custitem20)=='12')
        {			
          neiArr.push('3'); 
        }
      }   
      else if(itemId=='39300')
      {
        neiArr.push('5'); // set Engraving
      }
    }

    var get_eligible_for_return_list=SalesRecord.getValue("custbodynot_eligible_for_return_list");
    if(!get_eligible_for_return_list){get_eligible_for_return_list=[]}
    neiArr.sort();
    get_eligible_for_return_list.sort();

    var get_new_neiArr=JSON.stringify(neiArr);
    var get_get_eligible_for_return_list=JSON.stringify(get_eligible_for_return_list);
    if(get_new_neiArr!=get_get_eligible_for_return_list)
    {
      // SalesRecord.setValue("custbodynot_eligible_for_return_list",neiArr);
      field_value.custbodynot_eligible_for_return_list=neiArr;
    }
  }
}


function calcSOContributionMargin(context,SalesRecord,format,search,field_value)
{
  if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT || context.type == context.UserEventType.APPROVE)
  {


    if(!SalesRecord.getValue("custbody_contribution_margin") && SalesRecord.getValue("orderstatus")!="A"  && SalesRecord.getValue("status")!="In Progress")
    {
      var lineItems = new Array()
      var revenue = 0.00;
      var COGS = 0;
      var contributionMargin = 0;
      var netamountnotax=0;
      var flag_return=true;
      search.create({
        type:'salesorder',
        filters:[['internalid','anyof',SalesRecord.id],'and',['shipping','is','F'],'and',['taxline','is','F']],
        columns:['netamountnotax','quantityuom','purchaseorder','purchaseorder.status','purchaseorder.amount','item.lastpurchaseprice']

      }).run().each( function (result){

        var get_netamountnotax=result.getValue('netamountnotax');
        var get_quantityuom=result.getValue('quantityuom');
        var get_purchaseorder=result.getValue('purchaseorder');
        var get_purchaseorder_status=result.getValue({name:'status',join:'purchaseorder'});
        var get_purchaseorder_amount=result.getValue({name:'amount',join:'purchaseorder'});
        var get_item_lastpurchaseprice=result.getValue({name:'lastpurchaseprice',join:'item'});

        if(get_netamountnotax)
        {
          revenue +=parseFloat(get_netamountnotax);		 
        }
        if(get_purchaseorder)
        {
          if(get_purchaseorder_status=='fullyBilled')
          {

            if(get_purchaseorder_amount)
            {
              COGS +=parseFloat(get_purchaseorder_amount);
            }
          }
          else
          {
            flag_return= false;
          }					  
        }
        else
        {
          if(!get_item_lastpurchaseprice)
          {
            get_item_lastpurchaseprice=0;
          }
          if(!get_quantityuom)
          {
            get_quantityuom=0;
          }
          COGS += (parseFloat(get_item_lastpurchaseprice) *parseFloat(get_quantityuom));
        }	
        return true;

      });

      if(flag_return)
      {
        if(revenue> 0)
        {
          contributionMargin =  Math.round(parseFloat((1 - (COGS / parseFloat(revenue))) * 100) * 10)/10	
        }
        var contributionMarginAmount = format.format({value: (revenue - COGS),type: format.Type.CURRENCY});

        if(SalesRecord.getValue('custbody_contribution_margin')!=contributionMargin || SalesRecord.getValue('custbody_contribution_margin_amt')!=contributionMarginAmount)
        {		

          // SalesRecord.setValue('custbody_contribution_margin',contributionMargin);
          //SalesRecord.setValue('custbody_contribution_margin_amt',contributionMarginAmount);
          field_value.custbody_contribution_margin=contributionMargin;
          field_value.custbody_contribution_margin_amt=contributionMarginAmount;
        }
      }

    }
  }
}

function Link_Custom_Diamond_SO(context,SalesRecord,search,record)
{
  if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT )
  {


    var set_value={};
    for(var x=0; x < SalesRecord.getLineCount({sublistId: 'item'}); x++)
    {
      var itemID = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x});
      var item = SalesRecord.getSublistText({sublistId: 'item',fieldId: 'item',line: x});
      if(itemID=="487937" || itemID=="14375" || itemID=="487942" || itemID=="502780" || itemID=="537603"
         || itemID=="487938" || itemID=="487939" || itemID=="487941" || itemID=="487940" || itemID=="14385")
      {
        set_value['custrecord_diamond_inventory_location']="2";
      }
      if(item.substring(0,3)=="BE1" || item.substring(0,3)=="BE5")
      {
        set_value['custrecord_custom_diamond_setting']=SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x});
        break;
      }

    }

    for(var x=0; x < SalesRecord.getLineCount({sublistId: 'item'}); x++)
    {
      var search_result=true;
      search.create({
        type:'customrecord_custom_diamond',
        filters:[['custrecord_be_diamond_stock_number','anyof',SalesRecord.getSublistValue({sublistId: "item", fieldId:"item", line:x })],'and',
                 ['custrecord_diamond_so_order_number','anyof',SalesRecord.id],'and',
                 ['custrecord_custom_diamond_request_type','noneof',["3","4","5","9"]]],
        columns:['custrecord_diamond_customer_name']						 
      }).run().each(function (result){				
        search_result=false;
        var diamond_stock_field={};
        diamond_stock_field["custrecord_diamond_so_order_number"]=SalesRecord.id;

        if(set_value.custrecord_diamond_inventory_location)
        {
          diamond_stock_field["custrecord_diamond_inventory_location"]=set_value.custrecord_diamond_inventory_location;
        }
        else
        {
          diamond_stock_field["custrecord_diamond_inventory_location"]=SalesRecord.getSublistValue({sublistId:"item", fieldId:"location", line:x});							
        }
        if(set_value.custrecord_custom_diamond_setting)
        {
          diamond_stock_field["custrecord_custom_diamond_setting"]=set_value.custrecord_custom_diamond_setting;
        }				
        if(!result.getValue('custrecord_diamond_customer_name'))
        {
          diamond_stock_field["custrecord_diamond_customer_name"]=SalesRecord.getValue("entity");
        }			

        record.submitFields({ type:'customrecord_custom_diamond',id: result.id,values:diamond_stock_field , options: {enableSourcing: false,ignoreMandatoryFields : true}});						
        return true;

      });	
      if(search_result)
      {

        search.create({
          type:'customrecord_custom_diamond',
          filters:[['custrecord_be_diamond_stock_number','anyof',SalesRecord.getSublistValue({sublistId: "item", fieldId:"item", line:x })],'and',
                   ['custrecord_custom_diamond_request_type','anyof',["3","4"]],'and',
                   ['custrecord_diamond_customer_name','anyof',"@NONE@"]]
        }).run().each(function (result){				   
          record.submitFields({ type:'customrecord_custom_diamond',id: result.id,values:{'custrecord_diamond_customer_name':SalesRecord.getValue('entity')} , options: {enableSourcing: false,ignoreMandatoryFields : true}});
          return true;
        });

      }
    }
  }
}

function My_Account_SO_Data_Integration(runtime,context,SalesRecord,field_value)
{
  if(runtime.executionContext != "USERINTERFACE" )
    return true;
  if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT ||context.type == context.UserEventType.APPROVE ||context.type == context.UserEventType.CANCEL)
  {
    var orderType=SalesRecord.getValue("custbody87"); 

    if(orderType && orderType.length==1)
    {
      orderType=orderType[0];
    }
    else
    {
      orderType='';
    }



    var soStatus=SalesRecord.getValue("orderstatus");
    var MyAccount_LastUpdated=SalesRecord.getValue("custbody_my_account_info_last_updated");
    if(SalesRecord.getValue('custbody_my_account_info_on_web') && soStatus=="A" &&(orderType=='1' || orderType=='5'))
    {
      //SalesRecord.setValue('custbody_my_account_info_on_web',false);
      field_value.custbody_my_account_info_on_web=false;
    }
    else if( ! SalesRecord.getValue("custbody_my_account_info_on_web") && (context.type == context.UserEventType.APPROVE ||context.type == context.UserEventType.CANCEL ))
    {
      //SalesRecord.setValue("custbody_my_account_info_on_web",true);
      field_value.custbody_my_account_info_on_web=true;
    }
    else if(context.type == context.UserEventType.EDIT )
    {
      if(SalesRecord.getValue('custbody_my_account_info_on_web')&& soStatus=="A" &&  (orderType=='1'|| orderType=='5') )
      {
        // SalesRecord.setValue('custbody_my_account_info_on_web',false);
        field_value.custbody_my_account_info_on_web=false;

      }
      else if((orderType=='1' || orderType=='5') && soStatus!="A")
      {
        var get_new_record=Set_Data_My_Account_Data_Integration(SalesRecord);
        var get_old_record=Set_Data_My_Account_Data_Integration(context.oldRecord);
        var new_json_data=JSON.stringify(get_new_record);
        var old_json_data=JSON.stringify(get_old_record);
        if( (!SalesRecord.getValue("custbody_my_account_info_on_web") || SalesRecord.getValue("custbody_my_account_data_integration")!=new_json_data ) && (old_json_data && new_json_data!=old_json_data))
        {
          //SalesRecord.setValue("custbody_my_account_info_on_web",true);
          //SalesRecord.setValue("custbody_my_account_data_integration",new_json_data);
          field_value.custbody_my_account_info_on_web=true;
          field_value.custbody_my_account_data_integration=new_json_data;
        }

      }

    }

  }
}

function Set_Data_My_Account_Data_Integration(SalesRecord_order)
{

  var get_new_record={
    tranid:SalesRecord_order.getValue('tranid'),
    custbody71:SalesRecord_order.getValue('custbody71'),
    custbody6:SalesRecord_order.getValue('custbody6'),
    custbody53:SalesRecord_order.getValue('custbody53'),
    custbody_pickup_location:SalesRecord_order.getValue('custbody_pickup_location'),
    taxitem:SalesRecord_order.getValue('taxitem'),
    taxrate:SalesRecord_order.getValue('taxrate'),
    taxtotal:SalesRecord_order.getValue('taxtotal'),
    discounttotal:SalesRecord_order.getValue('discounttotal'),
    shippingcost:SalesRecord_order.getValue('shippingcost'),
    subtotal:SalesRecord_order.getValue('subtotal'),
    custbody_truebalanceamount:SalesRecord_order.getValue('custbody_truebalanceamount'),
    orderstatus:SalesRecord_order.getValue('orderstatus'),
    custbody310:SalesRecord_order.getValue('custbody310'),
    custbody69:SalesRecord_order.getValue('custbody69'),
    line_id:[]					
  };

  for(var x=0; x< SalesRecord_order.getLineCount({sublistId: 'item'}); x++)
  {
    var itemType = SalesRecord_order.getSublistValue({sublistId: 'item',fieldId: 'itemtype',line: x});
    if(itemType == "InvtPart")
    {		

      get_new_record.line_id.push({
        description: SalesRecord_order.getSublistValue({sublistId: 'item',fieldId: 'description',line: x}),
        amount:SalesRecord_order.getSublistValue({sublistId: 'item',fieldId: 'amount',line: x})	
      });
    }
  }
  return get_new_record;
}

function EstateResizePurchaseOrders(SalesRecord,search,record,context)
{
  if(context.type == context.UserEventType.APPROVE )
  {
    var insuranceVal = 0; var desc = '';
    var resizeItemDesc = ''; var note = '';
    for(var i=0; i< SalesRecord.getLineCount({sublistId: 'item'}); i++)
    {
      var itemId =  SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: i});
      var itemType = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'itemtype',line:i});
      var poId = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'poid',line: i});
      if( itemType == 'InvtPart')
      {

        var itemCategory= SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_category',line:i});
        if(itemCategory == 24 && itemId != '1093360')
        {
          insuranceVal =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_full_insurance_value',line: i});
          desc = SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'description',line: i});
          if(desc)
          {
            desc =desc.split(',')[0];
          }
        }
        else if(itemId == '1093360')
        { 

          var resizeVal =SalesRecord.getSublistValue({sublistId: 'item',fieldId: 'description',line: i});
          if(resizeVal)
          {
            resizeVal = resizeVal.split(',');
            resizeVal = resizeVal[resizeVal.length - 1].split(' ');
            resizeVal = resizeVal[resizeVal.length - 1];
          }
          if(desc)
          {
            if(resizeVal)
            {
              resizeItemDesc = desc +', Resize to Size'+' '+resizeVal;
              note = 'Resize to Size'+' '+resizeVal;
            }
            else
            {
              resizeItemDesc = desc;
            }
          }
          if(poId)
          {
            var PurchaseRecord = record.load({type: record.Type.PURCHASE_ORDER, id: poId });//, isDynamic: true
            for(var x=0; x < PurchaseRecord.getLineCount({sublistId: 'item'}); x++)
            {
              var poItemId = PurchaseRecord.getSublistValue({sublistId: 'item',fieldId: 'item',line: x});
              if(poItemId == itemId)
              {          
                PurchaseRecord.setSublistValue({sublistId: 'item',fieldId: 'custcol_full_insurance_value',line:x,value:insuranceVal});
                PurchaseRecord.setSublistValue({sublistId: 'item',fieldId: 'description',line:x,value:resizeItemDesc});
                PurchaseRecord.setSublistValue({sublistId: 'item',fieldId: 'custcol5',line:x ,value:note });
              }
            }
            PurchaseRecord.save({enableSourcing: true,ignoreMandatoryFields: true});
          }
        }
      }
    }
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


function ShippingZone_data()
{
  var shipZones_value="82922,82930,82931,83001,83002,83011,83012,83013,83014,83025,83101,83110,83111,83112,83114,83116,83118,83119,83120,83121,83122,83124,83126,83127,83128,83201,83202,83203,83204,83205,83206,83209,83210,83211,83212,83213,83214,83215,83217,83218,83220,83221,83223,83226,83227,83228,83229,83230,83231,83232,83233,83234,83235,83236,83237,83238,83239,83241,83243,83244,83245,83246,83250,83251,83252,83253,83254,83255,83256,83260,83261,83262,83263,83271,83272,83274,83276,83277,83278,83280,83281,83283,83285,83286,83287,83301,83302,83303,83311,83312,83313,83314,83316,83318,83320,83321,83322,83323,83324,83325,83326,83327,83328,83330,83332,83333,83334,83335,83336,83337,83338,83340,83341,83342,83343,83344,83346,83347,83348,83349,83350,83352,83353,83354,83355,83401,83402,83403,83404,83405,83406,83407,83408,83409,83410,83411,83412,83413,83414,83415,83420,83421,83422,83423,83424,83425,83427,83428,83429,83431,83433,83434,83435,83436,83437,83438,83440,83441,83442,83443,83444,83445,83446,83447,83448,83449,83450,83451,83452,83454,83455,83460,83462,83463,83464,83465,83466,83467,83468,83469,83542,83547,83549,83601,83602,83604,83605,83606,83607,83610,83611,83612,83615,83616,83617,83619,83622,83623,83624,83626,83627,83628,83629,83630,83631,83632,83633,83634,83635,83636,83637,83638,83639,83641,83642,83643,83644,83645,83646,83647,83648,83650,83651,83652,83653,83654,83655,83656,83657,83659,83660,83661,83666,83669,83670,83671,83672,83676,83677,83680,83686,83687,83701,83702,83703,83704,83705,83706,83707,83708,83709,83710,83711,83712,83713,83714,83715,83716,83717,83718,83719,83720,83721,83722,83723,83724,83725,83726,83727,83728,83729,83730,83731,83732,83733,83734,83735,83744,83756,83757,83788,83799,84000,84001,84002,84003,84004,84005,84006,84007,84008,84010,84011,84012,84013,84014,84015,84016,84017,84018,84020,84021,84022,84023,84024,84025,84026,84027,84028,84029,84031,84032,84033,84034,84035,84036,84037,84038,84039,84040,84041,84042,84043,84044,84045,84047,84049,84050,84051,84052,84053,84054,84055,84056,84057,84058,84059,84060,84061,84062,84063,84064,84065,84066,84067,84068,84069,84070,84071,84072,84073,84074,84075,84076,84077,84078,84079,84080,84081,84082,84083,84084,84085,84086,84087,84088,84089,84090,84091,84092,84093,84094,84095,84096,84097,84098,84100,84101,84102,84103,84104,84105,84106,84107,84108,84109,84110,84111,84112,84113,84114,84115,84116,84117,84118,84119,84120,84121,84122,84123,84124,84125,84126,84127,84128,84129,84130,84131,84132,84133,84134,84135,84136,84137,84138,84139,84140,84141,84142,84143,84144,84145,84146,84147,84148,84149,84150,84151,84152,84153,84154,84155,84156,84157,84158,84159,84160,84161,84162,84163,84164,84165,84166,84167,84168,84169,84170,84171,84172,84173,84174,84175,84176,84177,84178,84179,84180,84181,84182,84183,84184,84185,84186,84187,84188,84189,84190,84191,84192,84193,84196,84197,84198,84199,84201,84244,84301,84302,84304,84305,84306,84307,84308,84309,84310,84311,84312,84313,84314,84315,84316,84317,84318,84319,84320,84321,84322,84323,84324,84325,84326,84327,84328,84329,84330,84331,84332,84333,84334,84335,84336,84337,84338,84339,84340,84341,84401,84402,84403,84404,84405,84406,84407,84408,84409,84410,84411,84412,84413,84414,84415,84416,84417,84418,84419,84420,84421,84422,84423,84424,84425,84426,84427,84428,84429,84430,84431,84432,84433,84434,84435,84436,84437,84438,84439,84440,84441,84442,84443,84444,84445,84446,84447,84448,84449,84450,84451,84452,84453,84454,84455,84456,84457,84458,84459,84460,84461,84462,84463,84464,84465,84466,84467,84468,84469,84470,84471,84472,84473,84474,84475,84476,84477,84478,84479,84480,84481,84482,84483,84484,84485,84486,84487,84488,84489,84490,84491,84492,84493,84494,84495,84496,84497,84498,84499,84501,84513,84516,84518,84520,84521,84522,84523,84526,84527,84528,84529,84533,84537,84539,84542,84601,84602,84603,84604,84605,84606,84620,84621,84622,84623,84624,84626,84627,84628,84629,84630,84631,84632,84633,84634,84635,84636,84637,84638,84639,84640,84642,84643,84644,84645,84646,84647,84648,84649,84651,84652,84653,84654,84655,84656,84657,84660,84662,84663,84664,84665,84667,84701,84710,84711,84712,84713,84714,84715,84716,84718,84719,84720,84721,84722,84723,84724,84725,84726,84728,84729,84730,84731,84732,84733,84734,84735,84736,84737,84738,84739,84740,84741,84742,84743,84744,84745,84746,84747,84749,84750,84751,84752,84753,84754,84755,84756,84757,84758,84759,84760,84761,84762,84763,84764,84765,84766,84767,84770,84771,84772,84773,84774,84775,84776,84778,84779,84780,84781,84782,84783,84784,84790,84791,85001,85002,85003,85004,85005,85006,85007,85008,85009,85010,85011,85012,85013,85014,85015,85016,85017,85018,85019,85020,85021,85022,85023,85024,85025,85026,85027,85028,85029,85030,85031,85032,85033,85034,85035,85036,85037,85038,85039,85040,85041,85042,85043,85044,85045,85046,85047,85048,85049,85050,85051,85052,85053,85054,85055,85056,85057,85058,85059,85060,85061,85062,85063,85064,85065,85066,85067,85068,85069,85070,85071,85072,85073,85074,85075,85076,85077,85078,85079,85080,85081,85082,85083,85084,85085,85086,85087,85088,85098,85117,85118,85119,85120,85121,85122,85123,85127,85128,85130,85131,85132,85135,85137,85138,85139,85140,85141,85142,85143,85147,85172,85173,85178,85190,85191,85192,85193,85194,85200,85201,85202,85203,85204,85205,85206,85207,85208,85209,85210,85211,85212,85213,85214,85215,85216,85217,85218,85219,85220,85221,85222,85223,85224,85225,85226,85227,85228,85230,85231,85232,85233,85234,85235,85236,85237,85238,85239,85240,85241,85242,85243,85244,85246,85247,85248,85249,85250,85251,85252,85253,85254,85255,85256,85257,85258,85259,85260,85261,85262,85263,85264,85265,85266,85267,85268,85269,85271,85272,85273,85274,85275,85277,85278,85280,85281,85282,85283,85284,85285,85286,85287,85289,85290,85291,85292,85293,85294,85295,85296,85297,85298,85299,85301,85302,85303,85304,85305,85306,85307,85308,85309,85310,85311,85312,85313,85318,85320,85321,85322,85323,85324,85325,85326,85327,85328,85329,85331,85332,85333,85334,85335,85336,85337,85338,85339,85340,85341,85342,85343,85344,85345,85346,85347,85348,85349,85350,85351,85352,85353,85354,85355,85356,85357,85358,85359,85360,85361,85362,85363,85364,85365,85366,85367,85368,85369,85371,85372,85373,85374,85375,85376,85377,85378,85379,85380,85381,85382,85383,85385,85387,85388,85390,85392,85395,85396,85501,85502,85532,85537,85539,85541,85542,85544,85545,85547,85550,85553,85554,85901,85902,85911,85912,85920,85922,85923,85924,85925,85926,85927,85928,85929,85930,85931,85932,85933,85934,85935,85936,85937,85938,85939,85940,85941,85942,85943,86000,86001,86002,86003,86004,86005,86011,86015,86016,86017,86018,86020,86021,86022,86023,86024,86025,86028,86029,86030,86031,86032,86033,86034,86035,86036,86038,86039,86040,86042,86043,86044,86045,86046,86047,86052,86053,86054,86301,86302,86303,86304,86305,86312,86313,86314,86315,86320,86321,86322,86323,86324,86325,86326,86327,86329,86330,86331,86332,86333,86334,86335,86336,86337,86338,86339,86340,86341,86342,86343,86351,86401,86402,86403,86404,86405,86406,86409,86411,86412,86413,86426,86427,86429,86430,86431,86432,86433,86434,86436,86437,86438,86439,86440,86441,86442,86443,86444,86445,86446,88901,88905,89001,89002,89003,89004,89005,89006,89007,89008,89009,89010,89011,89012,89013,89014,89015,89016,89017,89018,89019,89020,89021,89022,89023,89024,89025,89026,89027,89028,89029,89030,89031,89032,89033,89034,89036,89037,89039,89040,89041,89042,89043,89044,89045,89046,89047,89048,89049,89052,89053,89054,89060,89061,89067,89070,89074,89077,89081,89084,89085,89086,89087,89101,89102,89103,89104,89105,89106,89107,89108,89109,89110,89111,89112,89113,89114,89115,89116,89117,89118,89119,89120,89121,89122,89123,89124,89125,89126,89127,89128,89129,89130,89131,89132,89133,89134,89135,89136,89137,89138,89139,89140,89141,89142,89143,89144,89145,89146,89147,89148,89149,89150,89151,89152,89153,89154,89155,89156,89157,89158,89159,89160,89161,89162,89163,89164,89165,89166,89169,89170,89173,89177,89178,89179,89180,89183,89185,89191,89193,89195,89199,89301,89310,89311,89314,89315,89316,89317,89318,89319,89402,89403,89404,89405,89406,89407,89408,89409,89410,89411,89412,89413,89414,89415,89418,89419,89420,89421,89422,89423,89424,89425,89426,89427,89428,89429,89430,89431,89432,89433,89434,89435,89436,89438,89439,89440,89441,89442,89443,89444,89445,89446,89447,89448,89449,89450,89451,89452,89460,89496,89501,89502,89503,89504,89505,89506,89507,89508,89509,89510,89511,89512,89513,89514,89515,89516,89517,89518,89519,89520,89521,89522,89523,89524,89525,89526,89527,89528,89529,89530,89531,89532,89533,89534,89535,89536,89537,89538,89539,89540,89541,89542,89543,89544,89545,89546,89547,89548,89549,89550,89551,89552,89553,89555,89556,89557,89558,89559,89560,89561,89562,89563,89565,89566,89567,89568,89569,89570,89571,89572,89573,89574,89575,89576,89577,89578,89579,89580,89581,89582,89583,89584,89585,89586,89587,89588,89589,89590,89591,89592,89593,89594,89595,89596,89597,89598,89599,89701,89702,89703,89704,89705,89706,89710,89711,89712,89713,89714,89721,89801,89802,89803,89815,89820,89821,89822,89823,89824,89825,89826,89828,89829,89830,89831,89832,89833,89834,89835,89883,90001,90002,90003,90004,90005,90006,90007,90008,90009,90010,90011,90012,90013,90014,90015,90016,90017,90018,90019,90020,90021,90022,90023,90024,90025,90026,90027,90028,90029,90030,90031,90032,90033,90034,90035,90036,90037,90038,90039,90040,90041,90042,90043,90044,90045,90046,90047,90048,90049,90050,90051,90052,90053,90054,90055,90056,90057,90058,90059,90060,90061,90062,90063,90064,90065,90066,90067,90068,90069,90070,90071,90072,90073,90074,90075,90076,90077,90078,90079,90080,90081,90082,90083,90084,90085,90086,90087,90088,90089,90090,90091,90092,90093,90094,90095,90096,90097,90098,90099,90100,90101,90102,90103,90104,90105,90106,90107,90108,90109,90110,90111,90112,90113,90114,90115,90116,90117,90118,90119,90120,90121,90122,90123,90124,90125,90126,90127,90128,90129,90130,90131,90132,90133,90134,90135,90136,90137,90138,90139,90140,90141,90142,90143,90144,90145,90146,90147,90148,90149,90150,90151,90152,90153,90154,90155,90156,90157,90158,90159,90160,90161,90162,90163,90164,90165,90166,90167,90168,90169,90170,90171,90172,90173,90174,90175,90176,90177,90178,90179,90180,90181,90182,90183,90184,90185,90186,90187,90188,90189,90190,90191,90192,90193,90194,90195,90196,90197,90198,90199,90201,90202,90209,90210,90211,90212,90213,90214,90215,90220,90221,90222,90223,90224,90226,90230,90231,90232,90233,90239,90240,90241,90242,90245,90247,90248,90249,90250,90251,90254,90255,90260,90261,90262,90263,90264,90265,90266,90267,90270,90272,90274,90275,90277,90278,90280,90290,90291,90292,90293,90294,90295,90296,90301,90302,90303,90304,90305,90306,90307,90308,90309,90310,90311,90312,90313,90397,90398,90401,90402,90403,90404,90405,90406,90407,90408,90409,90410,90411,90412,90413,90414,90415,90416,90417,90418,90419,90420,90421,90422,90423,90424,90425,90426,90427,90428,90429,90430,90431,90432,90433,90434,90435,90436,90437,90438,90439,90440,90441,90442,90443,90444,90445,90446,90447,90448,90449,90450,90451,90452,90453,90454,90455,90456,90457,90458,90459,90460,90461,90462,90463,90464,90465,90466,90467,90468,90469,90470,90471,90472,90473,90474,90475,90476,90477,90478,90479,90480,90481,90482,90483,90484,90485,90486,90487,90488,90489,90490,90491,90492,90493,90494,90495,90496,90497,90498,90499,90501,90502,90503,90504,90505,90506,90507,90508,90509,90510,90601,90602,90603,90604,90605,90606,90607,90608,90609,90610,90611,90612,90620,90621,90622,90623,90624,90630,90631,90632,90633,90637,90638,90639,90640,90650,90651,90652,90659,90660,90661,90662,90665,90670,90680,90701,90702,90703,90704,90706,90707,90710,90711,90712,90713,90714,90715,90716,90717,90720,90721,90723,90731,90732,90733,90734,90740,90742,90743,90744,90745,90746,90747,90748,90749,90755,90801,90802,90803,90804,90805,90806,90807,90808,90809,90810,90813,90814,90815,90822,90831,90832,90833,90834,90835,90840,90844,90845,90846,90847,90848,90853,90888,90895,90899,91001,91003,91006,91007,91008,91009,91010,91011,91012,91016,91017,91020,91021,91023,91024,91025,91030,91031,91040,91041,91042,91043,91046,91050,91051,91066,91077,91101,91102,91103,91104,91105,91106,91107,91108,91109,91110,91111,91112,91113,91114,91115,91116,91117,91118,91119,91120,91121,91122,91123,91124,91125,91126,91127,91128,91129,91130,91131,91132,91133,91134,91135,91136,91137,91138,91139,91140,91141,91142,91143,91144,91145,91146,91147,91148,91149,91150,91151,91152,91153,91154,91155,91156,91157,91158,91159,91160,91161,91162,91163,91164,91165,91166,91167,91168,91169,91170,91171,91172,91173,91174,91175,91176,91177,91178,91179,91180,91182,91184,91185,91186,91187,91188,91189,91191,91199,91201,91202,91203,91204,91205,91206,91207,91208,91209,91210,91211,91212,91214,91221,91222,91224,91225,91226,91301,91302,91303,91304,91305,91306,91307,91308,91309,91310,91311,91312,91313,91316,91319,91320,91321,91322,91323,91324,91325,91326,91327,91328,91329,91330,91331,91333,91334,91335,91336,91337,91340,91341,91342,91343,91344,91345,91346,91347,91348,91349,91350,91351,91352,91353,91354,91355,91356,91357,91358,91359,91360,91361,91362,91363,91364,91365,91366,91367,91368,91369,91370,91371,91372,91373,91374,91375,91376,91377,91380,91381,91382,91383,91384,91385,91386,91387,91388,91390,91392,91393,91394,91395,91396,91399,91401,91402,91403,91404,91405,91406,91407,91408,91409,91410,91411,91412,91413,91414,91415,91416,91417,91418,91419,91420,91421,91422,91423,91424,91425,91426,91427,91428,91429,91430,91431,91432,91433,91434,91435,91436,91437,91438,91439,91440,91441,91442,91443,91444,91445,91446,91447,91448,91449,91450,91451,91452,91453,91454,91455,91456,91457,91458,91459,91460,91461,91462,91463,91464,91465,91466,91467,91468,91469,91470,91471,91472,91473,91474,91475,91476,91477,91478,91479,91480,91481,91482,91483,91484,91485,91486,91487,91488,91489,91490,91491,91492,91493,91494,91495,91496,91497,91498,91499,91500,91501,91502,91503,91504,91505,91506,91507,91508,91509,91510,91511,91512,91513,91514,91515,91516,91517,91518,91519,91520,91521,91522,91523,91526,91600,91601,91602,91603,91604,91605,91606,91607,91608,91609,91610,91611,91612,91613,91614,91615,91616,91617,91618,91619,91620,91621,91622,91623,91624,91625,91626,91627,91628,91629,91630,91631,91632,91633,91701,91702,91706,91708,91709,91710,91711,91715,91716,91722,91723,91724,91729,91730,91731,91732,91733,91734,91735,91737,91739,91740,91741,91743,91744,91745,91746,91747,91748,91749,91750,91752,91754,91755,91756,91758,91759,91761,91762,91763,91764,91765,91766,91767,91768,91769,91770,91771,91772,91773,91775,91776,91777,91778,91780,91784,91785,91786,91788,91789,91790,91791,91792,91793,91795,91797,91798,91799,91801,91802,91803,91804,91808,91809,91810,91811,91841,91896,91899,91901,91902,91903,91905,91906,91908,91909,91910,91911,91912,91913,91914,91915,91916,91917,91921,91931,91932,91933,91934,91935,91941,91942,91943,91944,91945,91946,91947,91948,91950,91951,91962,91963,91976,91977,91978,91979,91980,91987,91990,92002,92003,92004,92007,92008,92009,92010,92011,92013,92014,92018,92019,92020,92021,92022,92023,92024,92025,92026,92027,92028,92029,92030,92033,92036,92037,92038,92039,92040,92046,92049,92051,92052,92053,92054,92055,92056,92057,92058,92059,92060,92061,92064,92065,92066,92067,92068,92069,92070,92071,92072,92074,92075,92078,92079,92081,92082,92083,92084,92085,92086,92088,92090,92091,92092,92093,92096,92100,92101,92102,92103,92104,92105,92106,92107,92108,92109,92110,92111,92112,92113,92114,92115,92116,92117,92118,92119,92120,92121,92122,92123,92124,92125,92126,92127,92128,92129,92130,92131,92132,92133,92134,92135,92136,92137,92138,92139,92140,92141,92142,92143,92144,92145,92146,92147,92148,92149,92150,92151,92152,92153,92154,92155,92156,92157,92158,92159,92160,92161,92162,92163,92164,92165,92166,92167,92168,92169,92170,92171,92172,92173,92174,92175,92176,92177,92178,92179,92180,92181,92182,92183,92184,92185,92186,92187,92188,92189,92190,92191,92192,92193,92194,92195,92196,92197,92198,92199,92201,92202,92203,92210,92211,92220,92222,92223,92225,92226,92227,92230,92231,92232,92233,92234,92235,92236,92239,92240,92241,92242,92243,92244,92247,92248,92249,92250,92251,92252,92253,92254,92255,92256,92257,92258,92259,92260,92261,92262,92263,92264,92266,92267,92268,92269,92270,92272,92273,92274,92275,92276,92277,92278,92280,92281,92282,92283,92284,92285,92286,92300,92301,92304,92305,92307,92308,92309,92310,92311,92312,92313,92314,92315,92316,92317,92318,92319,92320,92321,92322,92323,92324,92325,92326,92327,92328,92329,92331,92332,92333,92334,92335,92336,92337,92338,92339,92340,92341,92342,92344,92345,92346,92347,92350,92352,92354,92356,92357,92358,92359,92363,92364,92365,92366,92368,92369,92371,92372,92373,92374,92375,92376,92377,92378,92382,92384,92385,92386,92389,92391,92392,92393,92394,92395,92397,92398,92399,92401,92402,92403,92404,92405,92406,92407,92408,92409,92410,92411,92412,92413,92414,92415,92416,92417,92418,92420,92423,92424,92427,92501,92502,92503,92504,92505,92506,92507,92508,92509,92510,92511,92512,92513,92514,92515,92516,92517,92518,92519,92520,92521,92522,92523,92530,92531,92532,92536,92539,92543,92544,92545,92546,92548,92549,92550,92551,92552,92553,92554,92555,92556,92557,92561,92562,92563,92564,92567,92570,92571,92572,92581,92582,92583,92584,92585,92586,92587,92589,92590,92591,92592,92593,92595,92596,92599,92601,92602,92603,92604,92605,92606,92607,92609,92610,92612,92614,92615,92616,92617,92618,92619,92620,92623,92624,92625,92626,92627,92628,92629,92630,92637,92640,92641,92643,92644,92645,92646,92647,92648,92649,92650,92651,92652,92653,92654,92655,92656,92657,92658,92659,92660,92661,92662,92663,92672,92673,92674,92675,92676,92677,92678,92679,92683,92684,92685,92688,92690,92691,92692,92693,92694,92697,92698,92701,92702,92703,92704,92705,92706,92707,92708,92709,92710,92711,92712,92718,92719,92721,92722,92723,92724,92725,92726,92727,92728,92729,92735,92780,92781,92782,92799,92801,92802,92803,92804,92805,92806,92807,92808,92809,92810,92811,92812,92813,92814,92815,92816,92817,92818,92819,92820,92821,92822,92823,92824,92825,92826,92827,92828,92829,92830,92831,92832,92833,92834,92835,92836,92837,92838,92839,92840,92841,92842,92843,92844,92845,92846,92847,92848,92849,92850,92851,92852,92853,92854,92855,92856,92857,92858,92859,92860,92861,92862,92863,92864,92865,92866,92867,92868,92869,92870,92871,92872,92873,92874,92875,92877,92878,92879,92880,92881,92882,92883,92884,92885,92886,92887,92888,92889,92890,92891,92892,92893,92894,92895,92896,92897,92898,92899,93001,93002,93003,93004,93005,93006,93007,93008,93009,93010,93011,93012,93013,93014,93015,93016,93017,93020,93021,93022,93023,93024,93030,93031,93032,93033,93034,93035,93036,93040,93041,93042,93043,93044,93060,93061,93062,93063,93064,93065,93066,93067,93093,93094,93099,93101,93102,93103,93104,93105,93106,93107,93108,93109,93110,93111,93116,93117,93118,93120,93121,93127,93130,93131,93132,93140,93141,93146,93150,93160,93167,93190,93199,93201,93202,93203,93204,93205,93206,93207,93208,93210,93212,93214,93215,93216,93218,93219,93220,93221,93222,93223,93224,93225,93226,93227,93228,93230,93231,93232,93234,93235,93237,93238,93239,93240,93241,93242,93243,93244,93245,93246,93247,93249,93250,93251,93252,93254,93255,93256,93257,93258,93260,93261,93262,93263,93265,93266,93267,93268,93270,93271,93272,93274,93275,93276,93277,93278,93279,93280,93282,93283,93285,93286,93287,93290,93291,93292,93301,93302,93303,93304,93305,93306,93307,93308,93309,93311,93312,93313,93314,93380,93381,93382,93383,93384,93385,93386,93387,93388,93389,93390,93401,93402,93403,93405,93406,93407,93408,93409,93410,93412,93420,93421,93422,93423,93424,93426,93427,93428,93429,93430,93431,93432,93433,93434,93435,93436,93437,93438,93440,93441,93442,93443,93444,93445,93446,93447,93448,93449,93450,93451,93452,93453,93454,93455,93456,93457,93458,93460,93461,93463,93464,93465,93475,93483,93499,93501,93502,93504,93505,93510,93512,93513,93514,93515,93516,93517,93518,93519,93522,93523,93524,93526,93527,93528,93529,93530,93531,93532,93534,93535,93536,93537,93538,93539,93541,93542,93543,93544,93545,93546,93549,93550,93551,93552,93553,93554,93555,93556,93558,93560,93561,93562,93563,93581,93584,93586,93590,93591,93592,93596,93599,93601,93602,93603,93604,93605,93606,93607,93608,93609,93610,93611,93612,93613,93614,93615,93616,93618,93619,93620,93621,93622,93623,93624,93625,93626,93627,93628,93629,93630,93631,93633,93634,93635,93636,93637,93638,93639,93640,93641,93642,93643,93644,93645,93646,93647,93648,93649,93650,93651,93652,93653,93654,93656,93657,93660,93661,93662,93664,93665,93666,93667,93668,93669,93670,93673,93675,93701,93702,93703,93704,93705,93706,93707,93708,93709,93710,93711,93712,93713,93714,93715,93716,93717,93718,93719,93720,93721,93722,93723,93724,93725,93726,93727,93728,93729,93730,93731,93732,93733,93734,93735,93736,93737,93738,93739,93740,93741,93742,93743,93744,93745,93746,93747,93748,93749,93750,93751,93752,93753,93754,93755,93756,93757,93758,93759,93760,93761,93762,93763,93764,93765,93766,93767,93768,93769,93770,93771,93772,93773,93774,93775,93776,93777,93778,93779,93780,93781,93782,93783,93784,93785,93786,93787,93788,93789,93790,93791,93792,93793,93794,93844,93888,93901,93902,93903,93904,93905,93906,93907,93908,93909,93910,93911,93912,93913,93914,93915,93920,93921,93922,93923,93924,93925,93926,93927,93928,93930,93932,93933,93940,93941,93942,93943,93944,93950,93953,93954,93955,93960,93962,94002,94005,94010,94011,94013,94014,94015,94016,94017,94018,94019,94020,94021,94022,94023,94024,94025,94026,94027,94028,94030,94035,94037,94038,94039,94040,94041,94042,94043,94044,94060,94061,94062,94063,94064,94065,94066,94067,94070,94074,94080,94083,94085,94086,94087,94088,94089,94096,94097,94098,94101,94102,94103,94104,94105,94106,94107,94108,94109,94110,94111,94112,94113,94114,94115,94116,94117,94118,94119,94120,94121,94122,94123,94124,94125,94126,94127,94128,94129,94130,94131,94132,94133,94134,94135,94136,94137,94138,94139,94140,94141,94142,94143,94144,94145,94146,94147,94148,94150,94151,94152,94153,94154,94155,94156,94158,94159,94160,94161,94162,94163,94164,94170,94171,94172,94175,94177,94180,94188,94199,94203,94204,94205,94206,94207,94208,94209,94211,94229,94230,94232,94234,94235,94236,94237,94239,94240,94244,94246,94247,94248,94249,94250,94252,94254,94256,94257,94258,94259,94261,94262,94263,94267,94268,94269,94271,94273,94274,94277,94279,94280,94282,94283,94284,94285,94286,94287,94288,94289,94290,94291,94293,94294,94295,94296,94297,94298,94299,94301,94302,94303,94304,94305,94306,94307,94308,94309,94310,94311,94312,94313,94314,94315,94316,94317,94318,94319,94320,94321,94322,94323,94324,94325,94326,94327,94328,94329,94330,94331,94332,94333,94334,94335,94336,94337,94338,94339,94340,94341,94342,94343,94344,94345,94346,94347,94348,94349,94350,94351,94352,94353,94354,94355,94356,94357,94358,94359,94360,94361,94362,94363,94364,94365,94366,94367,94368,94369,94370,94371,94372,94373,94374,94375,94376,94377,94378,94379,94380,94381,94382,94383,94384,94385,94386,94387,94388,94389,94390,94391,94392,94393,94394,94395,94396,94397,94398,94399,94401,94402,94403,94404,94497,94501,94502,94503,94505,94506,94507,94508,94509,94510,94511,94512,94513,94514,94515,94516,94517,94518,94519,94520,94521,94522,94523,94524,94525,94526,94527,94528,94529,94530,94531,94533,94534,94535,94536,94537,94538,94539,94540,94541,94542,94543,94544,94545,94546,94547,94548,94549,94550,94551,94552,94553,94555,94556,94557,94558,94559,94560,94561,94562,94563,94564,94565,94566,94567,94568,94569,94570,94571,94572,94573,94574,94575,94576,94577,94578,94579,94580,94581,94582,94583,94585,94586,94587,94588,94589,94590,94591,94592,94595,94596,94597,94598,94599,94601,94602,94603,94604,94605,94606,94607,94608,94609,94610,94611,94612,94613,94614,94615,94616,94617,94618,94619,94620,94621,94622,94623,94624,94625,94626,94627,94628,94629,94630,94631,94632,94633,94634,94635,94636,94637,94638,94639,94640,94641,94642,94643,94644,94645,94646,94647,94648,94649,94650,94651,94652,94653,94654,94655,94656,94657,94658,94659,94660,94661,94662,94663,94664,94665,94666,94668,94700,94701,94702,94703,94704,94705,94706,94707,94708,94709,94710,94712,94720,94801,94802,94803,94804,94805,94806,94807,94808,94810,94820,94850,94901,94903,94904,94912,94913,94914,94915,94920,94922,94923,94924,94925,94926,94927,94928,94929,94930,94931,94933,94934,94937,94938,94939,94940,94941,94942,94945,94946,94947,94948,94949,94950,94951,94952,94953,94954,94955,94956,94957,94960,94963,94964,94965,94966,94970,94971,94972,94973,94974,94975,94976,94977,94978,94979,94998,94999,95001,95002,95003,95004,95005,95006,95007,95008,95009,95010,95011,95012,95013,95014,95015,95016,95017,95018,95019,95020,95021,95022,95023,95024,95026,95030,95031,95032,95033,95035,95036,95037,95038,95039,95041,95042,95043,95044,95045,95046,95050,95051,95052,95053,95054,95055,95056,95060,95061,95062,95063,95064,95065,95066,95067,95070,95071,95073,95075,95076,95077,95101,95102,95103,95104,95105,95106,95107,95108,95109,95110,95111,95112,95113,95114,95115,95116,95117,95118,95119,95120,95121,95122,95123,95124,95125,95126,95127,95128,95129,95130,95131,95132,95133,95134,95135,95136,95137,95138,95139,95140,95141,95142,95143,95144,95145,95146,95147,95148,95149,95150,95151,95152,95153,95154,95155,95156,95157,95158,95159,95160,95161,95162,95163,95164,95165,95166,95167,95168,95169,95170,95171,95172,95173,95174,95175,95176,95177,95178,95179,95180,95181,95182,95183,95184,95185,95186,95187,95188,95189,95190,95191,95192,95193,95194,95195,95196,95197,95198,95201,95202,95203,95204,95205,95206,95207,95208,95209,95210,95211,95212,95213,95215,95219,95220,95221,95222,95223,95224,95225,95226,95227,95228,95229,95230,95231,95232,95233,95234,95236,95237,95240,95241,95242,95245,95246,95247,95248,95249,95250,95251,95252,95253,95254,95255,95257,95258,95267,95269,95290,95296,95297,95298,95301,95303,95304,95305,95306,95307,95309,95310,95311,95312,95313,95314,95315,95316,95317,95318,95319,95320,95321,95322,95323,95324,95325,95326,95327,95328,95329,95330,95331,95333,95334,95335,95336,95337,95338,95339,95340,95341,95342,95343,95344,95345,95346,95347,95348,95350,95351,95352,95353,95354,95355,95356,95357,95358,95360,95361,95363,95364,95365,95366,95367,95368,95369,95370,95372,95373,95374,95375,95376,95377,95378,95379,95380,95381,95382,95383,95384,95385,95386,95387,95388,95389,95390,95391,95397,95400,95401,95402,95403,95404,95405,95406,95407,95409,95410,95411,95412,95413,95414,95415,95416,95417,95418,95419,95420,95421,95422,95423,95424,95425,95426,95427,95428,95429,95430,95431,95432,95433,95435,95436,95437,95439,95440,95441,95442,95443,95444,95445,95446,95448,95449,95450,95451,95452,95453,95454,95455,95456,95457,95458,95459,95460,95461,95462,95463,95464,95465,95466,95467,95468,95469,95470,95471,95472,95473,95476,95477,95480,95481,95482,95485,95486,95487,95488,95489,95490,95492,95493,95494,95495,95497,95501,95502,95503,95511,95514,95518,95519,95521,95524,95525,95526,95527,95528,95531,95532,95534,95536,95537,95538,95540,95542,95543,95545,95546,95547,95548,95549,95550,95551,95552,95553,95554,95555,95556,95558,95559,95560,95562,95563,95564,95565,95567,95568,95569,95570,95571,95573,95585,95587,95589,95595,95601,95602,95603,95604,95605,95606,95607,95608,95609,95610,95611,95612,95613,95614,95615,95616,95617,95618,95619,95620,95621,95622,95623,95624,95625,95626,95627,95628,95629,95630,95631,95632,95633,95634,95635,95636,95637,95638,95639,95640,95641,95642,95643,95644,95645,95646,95648,95650,95651,95652,95653,95654,95655,95656,95658,95659,95660,95661,95662,95663,95664,95665,95666,95667,95668,95669,95670,95671,95672,95673,95674,95675,95676,95677,95678,95679,95680,95681,95682,95683,95684,95685,95686,95687,95688,95689,95690,95691,95692,95693,95694,95695,95696,95697,95698,95699,95701,95703,95704,95709,95712,95713,95714,95715,95716,95717,95720,95721,95722,95724,95725,95726,95727,95728,95735,95736,95741,95742,95743,95746,95747,95756,95757,95758,95759,95762,95763,95765,95776,95798,95811,95812,95813,95814,95815,95816,95817,95818,95819,95820,95821,95822,95823,95824,95825,95826,95827,95828,95829,95830,95831,95832,95833,95834,95835,95836,95837,95838,95840,95841,95842,95843,95851,95852,95853,95857,95860,95864,95865,95866,95867,95873,95887,95894,95899,95901,95903,95910,95912,95913,95914,95915,95916,95917,95918,95919,95920,95922,95923,95924,95925,95926,95927,95928,95929,95930,95932,95934,95935,95936,95937,95938,95939,95940,95941,95942,95943,95944,95945,95946,95947,95948,95949,95950,95951,95952,95953,95954,95955,95956,95957,95958,95959,95960,95961,95962,95963,95965,95966,95967,95968,95969,95970,95971,95972,95973,95974,95975,95976,95977,95978,95979,95980,95981,95982,95983,95984,95986,95987,95988,95991,95992,95993,96001,96002,96003,96006,96007,96008,96009,96010,96011,96013,96014,96015,96016,96017,96019,96020,96021,96022,96023,96024,96025,96027,96028,96029,96032,96033,96034,96035,96037,96038,96039,96040,96041,96042,96044,96045,96046,96047,96048,96049,96050,96051,96052,96053,96054,96055,96056,96057,96058,96059,96061,96062,96063,96064,96065,96067,96068,96069,96070,96071,96073,96074,96075,96076,96078,96079,96080,96084,96085,96086,96087,96088,96089,96090,96091,96092,96093,96094,96095,96096,96097,96099,96101,96103,96104,96105,96106,96107,96108,96109,96110,96111,96112,96113,96114,96115,96116,96117,96118,96119,96120,96121,96122,96123,96124,96125,96126,96127,96128,96129,96130,96132,96133,96134,96135,96136,96137,96140,96141,96142,96143,96145,96146,96148,96150,96151,96152,96154,96155,96156,96157,96158,96160,96161,96162,96326,96624,96701,96703,96704,96705,96706,96707,96708,96709,96710,96712,96713,96714,96715,96716,96717,96718,96719,96720,96721,96722,96725,96726,96727,96728,96729,96730,96731,96732,96733,96734,96737,96738,96739,96740,96741,96742,96743,96744,96745,96746,96747,96748,96749,96750,96751,96752,96753,96754,96755,96756,96757,96759,96760,96761,96762,96763,96764,96765,96766,96767,96768,96769,96770,96771,96772,96773,96774,96776,96777,96778,96779,96780,96781,96782,96783,96784,96785,96786,96788,96789,96790,96791,96792,96793,96795,96796,96797,96801,96802,96803,96804,96805,96806,96807,96808,96809,96810,96811,96812,96813,96814,96815,96816,96817,96818,96819,96820,96821,96822,96823,96824,96825,96826,96827,96828,96830,96835,96836,96837,96838,96839,96840,96841,96842,96843,96844,96845,96846,96847,96848,96849,96850,96853,96854,96857,96858,96859,96860,96861,96862,96863,96898,97001,97002,97003,97004,97005,97006,97007,97008,97009,97010,97011,97013,97014,97015,97016,97017,97018,97019,97020,97021,97022,97023,97024,97025,97026,97027,97028,97029,97030,97031,97032,97033,97034,97035,97036,97037,97038,97039,97040,97041,97042,97043,97044,97045,97048,97049,97050,97051,97053,97054,97055,97056,97057,97058,97060,97062,97063,97064,97065,97067,97068,97070,97071,97072,97075,97076,97077,97078,97080,97086,97089,97099,97101,97102,97103,97106,97107,97108,97109,97110,97111,97112,97113,97114,97115,97116,97117,97118,97119,97121,97122,97123,97124,97125,97127,97128,97130,97131,97132,97133,97134,97135,97136,97137,97138,97140,97141,97142,97143,97144,97145,97146,97147,97148,97149,97201,97202,97203,97204,97205,97206,97207,97208,97209,97210,97211,97212,97213,97214,97215,97216,97217,97218,97219,97220,97221,97222,97223,97224,97225,97226,97227,97228,97229,97230,97231,97232,97233,97236,97238,97239,97240,97242,97251,97253,97254,97255,97256,97258,97259,97266,97267,97268,97271,97272,97280,97281,97282,97283,97286,97290,97291,97292,97293,97294,97296,97298,97299,97301,97302,97303,97304,97305,97306,97307,97308,97309,97310,97311,97312,97313,97314,97317,97321,97322,97324,97325,97326,97327,97329,97330,97331,97332,97333,97334,97335,97336,97338,97339,97341,97342,97343,97344,97345,97346,97347,97348,97350,97351,97352,97355,97357,97358,97360,97361,97362,97364,97365,97366,97367,97368,97369,97370,97371,97372,97373,97374,97375,97376,97377,97378,97380,97381,97383,97384,97385,97386,97388,97389,97390,97391,97392,97393,97394,97396,97401,97402,97403,97404,97405,97406,97407,97408,97409,97410,97411,97412,97413,97414,97415,97416,97417,97418,97419,97420,97423,97424,97425,97426,97427,97429,97430,97431,97432,97433,97434,97435,97436,97437,97438,97439,97440,97441,97442,97443,97444,97445,97446,97447,97448,97449,97450,97451,97452,97453,97454,97455,97456,97457,97458,97459,97460,97461,97462,97463,97464,97465,97466,97467,97468,97469,97470,97471,97472,97473,97475,97476,97477,97478,97479,97480,97481,97482,97484,97486,97487,97488,97489,97490,97491,97492,97493,97494,97495,97496,97497,97498,97499,97500,97501,97502,97503,97504,97520,97522,97523,97524,97525,97526,97527,97528,97530,97531,97532,97533,97534,97535,97536,97537,97538,97539,97540,97541,97543,97544,97601,97602,97603,97604,97620,97621,97622,97623,97624,97625,97626,97627,97630,97632,97633,97634,97635,97636,97637,97638,97639,97640,97641,97701,97702,97703,97704,97705,97706,97707,97708,97709,97710,97711,97712,97720,97721,97722,97730,97731,97732,97733,97734,97735,97736,97737,97738,97739,97740,97741,97750,97751,97752,97753,97754,97756,97758,97759,97760,97761,97820,97823,97825,97830,97845,97848,97856,97864,97865,97869,97873,97874,97901,97902,97903,97904,97906,97907,97908,97909,97910,97911,97913,97914,97917,97918,97920,98001,98002,98003,98004,98005,98006,98007,98008,98009,98010,98011,98012,98013,98014,98015,98019,98020,98021,98022,98023,98024,98025,98026,98027,98028,98029,98030,98031,98032,98033,98034,98035,98036,98037,98038,98039,98040,98041,98042,98043,98045,98046,98047,98048,98050,98051,98052,98053,98054,98055,98056,98057,98058,98059,98061,98062,98063,98064,98065,98068,98070,98071,98072,98073,98074,98075,98077,98082,98083,98087,98089,98092,98093,98101,98102,98103,98104,98105,98106,98107,98108,98109,98110,98111,98112,98113,98114,98115,98116,98117,98118,98119,98120,98121,98122,98124,98125,98126,98127,98129,98131,98132,98133,98134,98136,98138,98139,98141,98144,98145,98146,98148,98151,98154,98155,98158,98160,98161,98164,98165,98166,98168,98170,98171,98174,98175,98177,98178,98181,98184,98185,98188,98190,98191,98194,98195,98198,98199,98201,98203,98204,98205,98206,98207,98208,98213,98220,98221,98222,98223,98224,98225,98226,98227,98228,98229,98230,98231,98232,98233,98235,98236,98237,98238,98239,98240,98241,98243,98244,98245,98246,98247,98248,98249,98250,98251,98252,98253,98255,98256,98257,98258,98259,98260,98261,98262,98263,98264,98266,98267,98268,98270,98271,98272,98273,98274,98275,98276,98277,98278,98279,98280,98281,98282,98283,98284,98286,98287,98288,98290,98291,98292,98293,98294,98295,98296,98297,98303,98304,98305,98310,98311,98312,98313,98314,98315,98320,98321,98322,98323,98324,98325,98326,98327,98328,98329,98330,98331,98332,98333,98334,98335,98336,98337,98338,98339,98340,98342,98343,98344,98345,98346,98348,98349,98350,98351,98352,98353,98354,98355,98356,98357,98358,98359,98360,98361,98362,98363,98364,98365,98366,98367,98368,98370,98371,98372,98373,98374,98375,98376,98377,98378,98380,98381,98382,98383,98384,98385,98386,98387,98388,98390,98391,98392,98393,98394,98395,98396,98397,98398,98401,98402,98403,98404,98405,98406,98407,98408,98409,98411,98412,98413,98415,98416,98417,98418,98419,98421,98422,98424,98430,98431,98433,98434,98438,98439,98442,98443,98444,98445,98446,98447,98448,98450,98455,98460,98464,98465,98466,98467,98471,98472,98477,98478,98481,98482,98490,98492,98493,98494,98496,98497,98498,98499,98501,98502,98503,98504,98505,98506,98507,98508,98509,98511,98512,98513,98516,98520,98522,98524,98526,98527,98528,98530,98531,98532,98533,98535,98536,98537,98538,98539,98540,98541,98542,98544,98546,98547,98548,98550,98551,98552,98554,98555,98556,98557,98558,98559,98560,98561,98562,98563,98564,98565,98566,98568,98569,98570,98571,98572,98575,98576,98577,98579,98580,98581,98582,98583,98584,98585,98586,98587,98588,98589,98590,98591,98592,98593,98595,98596,98597,98599,98601,98602,98603,98604,98605,98606,98607,98609,98610,98611,98612,98613,98614,98616,98617,98619,98620,98621,98622,98623,98624,98625,98626,98628,98629,98631,98632,98635,98637,98638,98639,98640,98641,98642,98643,98644,98645,98647,98648,98649,98650,98651,98660,98661,98662,98663,98664,98665,98666,98667,98668,98670,98671,98672,98673,98674,98675,98682,98683,98684,98685,98686,98687,99501,99502,99503,99504,99505,99506,99507,99508,99509,99510,99511,99512,99513,99514,99515,99516,99517,99518,99519,99520,99521,99522,99523,99524,99526,99529,99530,99540,99545,99546,99547,99548,99549,99550,99551,99552,99553,99554,99555,99556,99557,99558,99559,99561,99563,99564,99565,99566,99567,99568,99569,99571,99572,99573,99574,99575,99576,99577,99578,99579,99580,99581,99583,99584,99585,99586,99587,99588,99589,99590,99591,99602,99603,99604,99605,99606,99607,99608,99609,99610,99611,99612,99613,99614,99615,99619,99620,99621,99622,99623,99624,99625,99626,99627,99628,99629,99630,99631,99632,99633,99634,99635,99636,99637,99638,99639,99640,99641,99643,99644,99645,99647,99648,99649,99650,99651,99652,99653,99654,99655,99656,99657,99658,99659,99660,99661,99662,99663,99664,99665,99666,99667,99668,99669,99670,99671,99672,99674,99675,99676,99677,99678,99679,99680,99681,99682,99683,99684,99685,99686,99687,99688,99689,99690,99691,99692,99693,99694,99695,99697,99701,99702,99703,99704,99705,99706,99707,99708,99709,99710,99711,99712,99714,99716,99720,99721,99722,99723,99724,99725,99726,99727,99729,99730,99731,99732,99733,99734,99736,99737,99738,99739,99740,99741,99742,99743,99744,99745,99746,99747,99748,99749,99750,99751,99752,99753,99754,99755,99756,99757,99758,99759,99760,99761,99762,99763,99764,99765,99766,99767,99768,99769,99770,99771,99772,99773,99774,99775,99776,99777,99778,99779,99780,99781,99782,99783,99784,99785,99786,99788,99789,99790,99791,99801,99802,99803,99811,99812,99820,99821,99824,99825,99826,99827,99829,99830,99832,99833,99835,99836,99840,99841,99850,99901,99903,99918,99919,99921,99922,99923,99925,99926,99927,99928,99929,99950";
  return shipZones_value;
}