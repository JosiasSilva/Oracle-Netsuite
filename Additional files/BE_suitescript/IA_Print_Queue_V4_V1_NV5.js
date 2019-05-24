nlapiLogExecution("audit","FLOStart",new Date().getTime());
function IA_Print_Queue(request,response)
{
  if(request.getMethod()=="GET")
  {
    var form = nlapiCreateForm("Print Insurance Appraisals");
    form.setScript("customscript_ia_print_queue_client_v2");

    var fld = form.addField("custpage_selected","integer","Selected");
    fld.setDisplayType("inline");
    fld.setDefaultValue("0");

    var orders = [];
    var order_ids = [];

    //Get order internal IDS
    var filters = [];
    filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
    filters.push(new nlobjSearchFilter("custbody110",null,"on","today"));
    //filters.push(new nlobjSearchFilter("custbody110",null,"within",["daysago12","daysago0"]));
    filters.push(new nlobjSearchFilter("custbody_materials_ready",null,"is","F"));
    filters.push(new nlobjSearchFilter("amount",null,"greaterthan","0.00"));
    filters.push(new nlobjSearchFilter("custbody87",null,"noneof",["2","3","4","10","17"]));
    filters.push(new nlobjSearchFilter("customform",null,"noneof",["152","169"]));
    filters.push(new nlobjSearchFilter("custbody152",null,"isempty"));
    var results = nlapiSearchRecord("salesorder",null,filters);
    if(results)
    {
      for(var x=0; x < results.length; x++)
      {
        order_ids.push(results[x].getId());
      }
    }

    //Run report to filter out exclusions - Halo and Eternity items
    var exclude_orders = [];
    var filters = [];
    if(order_ids!=null && order_ids!="" && order_ids.length > 0)
    {
      filters.push(new nlobjSearchFilter("internalid",null,"anyof",order_ids));
      var results = nlapiSearchRecord("salesorder","customsearch_ia_halo_eternity_exclusions",filters);
      if(results)
      {
        for(var x=0; x < results.length; x++)
        {
          exclude_orders.push(results[x].getId());
        }
      }
    }

    //Further filter Halo items
    var filters = [];
    if(order_ids!=null && order_ids!="" && order_ids.length > 0)
    {
      filters.push(new nlobjSearchFilter("internalid",null,"anyof",order_ids));
      //filters.push(new nlobjSearchFilter("custitem78","item","anyof","6")); //Collection = Halo Settings Collection
      filters.push(new nlobjSearchFilter("custitemhalo_setting","item","is","T")); //Collection = Halo Settings 
      var results = nlapiSearchRecord("salesorder",null,filters);
      if(results)
      {
        for(var x=0; x < results.length; x++)
        {
          exclude_orders.push(results[x].getId());
        }
      }
    }

    //Filter Loose Stone Orders
    if(order_ids != null && order_ids != "" && order_ids.length > 0)
    {
      var filters = [];
      filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
      filters.push(new nlobjSearchFilter("internalid",null,"anyof",order_ids));
      filters.push(new nlobjSearchFilter("custbody_category1",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
      filters.push(new nlobjSearchFilter("custbody_category2",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
      filters.push(new nlobjSearchFilter("custbody_category3",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
      filters.push(new nlobjSearchFilter("custbody_category4",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
      filters.push(new nlobjSearchFilter("custbody_category5",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
      filters.push(new nlobjSearchFilter("custbody_category6",null,"anyof",["@NONE@","31","15","14","20","18","7","8"]));
      var results = nlapiSearchRecord("salesorder",null,filters);
      if(results)
      {
        for(var x=0; x < results.length; x++)
        {
          exclude_orders.push(results[x].getId());
        }
      }
    }

    var numOrders = 0;

    var filters = [];
    filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
    //filters.push(new nlobjSearchFilter("custbody110",null,"within",["daysago12","daysago0"]));
    filters.push(new nlobjSearchFilter("custbody110",null,"on","today"));
    filters.push(new nlobjSearchFilter("amount",null,"greaterthan","0.00"));
    filters.push(new nlobjSearchFilter("custbody87",null,"noneof",["2","3","4","10","17"]));
    filters.push(new nlobjSearchFilter("customform",null,"noneof",["152","169"]));
    filters.push(new nlobjSearchFilter("custbody152",null,"isempty"));
   filters.push(new nlobjSearchFilter("custbody_materials_ready",null,"is","F"));
    filters.push(new nlobjSearchFilter("status",null,"noneof",["SalesOrd:C","SalesOrd:H","SalesOrd:G"]));
   // filters.push(new nlobjSearchFilter("internalid",null,"anyof",['9681643']));

    if(exclude_orders.length > 0)
    {
      filters.push(new nlobjSearchFilter("internalid",null,"noneof",exclude_orders));

    }
    var cols = [];
    cols.push(new nlobjSearchColumn("tranid"));
    cols.push(new nlobjSearchColumn("trandate"));
    cols.push(new nlobjSearchColumn("entity"));
    cols.push(new nlobjSearchColumn("custbody110")); //Date to Ship
    cols.push(new nlobjSearchColumn("custbody249")); //Date to Print
    cols.push(new nlobjSearchColumn("firstname","customer").setSort());
    cols.push(new nlobjSearchColumn("lastname","customer"));
    cols.push(new nlobjSearchColumn("custbody_materials_ready"));
    var results = nlapiSearchRecord("salesorder",null,filters,cols);
    if(results)
    {
      numOrders = results.length;
      var page = request.getParameter("page");
      if(page!=null && page!="")
        page = parseFloat(page);

      for(var x=0; x < results.length; x++)
      {
        var materials_ready = results[x].getValue("custbody_materials_ready");
        if(materials_ready=="T")
          materials_ready = "Yes";
        else
          materials_ready = "No";

        if(page==null || page=="" || page==0 || page==1)
        {
          if(x < 20)
          {
            orders.push({
              custpage_internalid : results[x].getId(),
              custpage_number : results[x].getValue("tranid"),
              custpage_date : results[x].getValue("trandate"),
              custpage_customer : results[x].getValue("firstname","customer") + " " + results[x].getValue("lastname","customer"),
              custpage_materials_ready : materials_ready
            });		
          }
        }
        else
        {
          if(x >= page && x < (page + 20))
          {
            orders.push({
              custpage_internalid : results[x].getId(),
              custpage_number : results[x].getValue("tranid"),
              custpage_date : results[x].getValue("trandate"),
              custpage_customer : results[x].getValue("firstname","customer") + " " + results[x].getValue("lastname","customer"),
              custpage_materials_ready : materials_ready
            });	
          }
        }
      }
    }

    var index = 1;

    if(numOrders > 20)
    {
      var pageFld = form.addField("custpage_page","select","Select Page");

      if(request.getParameter("page")!=null && request.getParameter("page")!="")
        var defaultSel = request.getParameter("page");
      else
        var defaultSel = 1;

      for(var i=0; i < Math.ceil(numOrders / 20); i++)
      {
        var isDefault = false;
        if(defaultSel == index)
          isDefault = true;

        var nextIndex = index + 19;
        if(nextIndex > numOrders)
          nextIndex = numOrders;
        pageFld.addSelectOption(index,index + " - " + nextIndex,isDefault);
        index = nextIndex + 1;
      }
    }

    var list = form.addSubList("custpage_orders","list","Sales Orders");
    list.addField("custpage_print","checkbox","Print?");
    list.addField("custpage_internalid","text","Sales Order Internal ID").setDisplayType("hidden");
    list.addField("custpage_number","text","Sales Order #");
    list.addField("custpage_date","date","Date");
    list.addField("custpage_customer","text","Customer");
    list.addField("custpage_materials_ready","text","Materials Ready");

    list.setLineItemValues(orders);

    //list.addMarkAllButtons();

    form.addButton("custpage_mark_all","Mark All","IA_Print_Queue_Mark_All()");
    form.addButton("custpage_unmark_all","Unmark All","IA_Print_Queue_Unmark_All()");

    form.addSubmitButton("Print Selected");

    response.writePage(form);
  }
  else
  {

    var load_data=[];
    load_data.push({
      haloMeleeSearchResult:[],
      salesOrder:[]		
    })
    var AllorderId=new Array();
    for(var x=0; x < request.getLineItemCount("custpage_orders"); x++)
    {
      if(request.getLineItemValue("custpage_orders","custpage_print",x+1)=="T")
      {
        AllorderId.push(request.getLineItemValue("custpage_orders","custpage_internalid",x+1));
        load_data[0].salesOrder.push({
          doucment_number:request.getLineItemValue("custpage_orders","custpage_number",x+1),
          internalid:request.getLineItemValue("custpage_orders","custpage_internalid",x+1),
          customer_name:'',
          currency:'',
          trandate:'',
          billaddress1:'',
          billcity:'',
          billstate:'',
          billzip:'',
          tranid:'',		 
          data_child:[]		 
        });
      }
    }		
    if(AllorderId.length>0)
    {
      PassData(load_data,AllorderId);
    }


  }
}

function PassData(load_data,AllorderId)
{

  nlapiLogExecution ( 'debug','All Id', AllorderId) ;
  var filters = [];
  filters.push(new nlobjSearchFilter("internalid",null,"anyOf",AllorderId));
  filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
  filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
  filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
  var cols = [];
  cols.push(new nlobjSearchColumn("firstname","customer"));
  cols.push(new nlobjSearchColumn("lastname","customer"));
  cols.push(new nlobjSearchColumn("currency"));
  cols.push(new nlobjSearchColumn("item"));
  cols.push(new nlobjSearchColumn("quantity"));
  cols.push(new nlobjSearchColumn("rate"));
  cols.push(new nlobjSearchColumn("fxamount"));
  cols.push(new nlobjSearchColumn("trandate"));
  cols.push(new nlobjSearchColumn("billaddress1"));
  cols.push(new nlobjSearchColumn("billcity"));
  cols.push(new nlobjSearchColumn("billstate"));
  cols.push(new nlobjSearchColumn("billzip"));
  cols.push(new nlobjSearchColumn("tranid"));
  cols.push(new nlobjSearchColumn("custitem20","item"));
  cols.push(new nlobjSearchColumn("custitem5","item"));
  cols.push(new nlobjSearchColumn("custitem28","item"));
  cols.push(new nlobjSearchColumn("custitem7","item"));
  cols.push(new nlobjSearchColumn("custitem19","item"));
  cols.push(new nlobjSearchColumn("custitem27","item"));
  cols.push(new nlobjSearchColumn("itemid","item"));
  cols.push(new nlobjSearchColumn("custitem18","item"));
  cols.push(new nlobjSearchColumn("parent","item"));
  cols.push(new nlobjSearchColumn("custitem1","item"));
  var results = nlapiSearchRecord("salesorder",null,filters,cols);
  if(results!=null)
  {
    var haloMeleeSearchResult_call=false; 
    var check_parent_id=new Array();		   
    for(var s=0;s<results.length;s++)
    {
      var main_orderId=results[s].getId();
      nlapiLogExecution ( 'debug','main_orderId', main_orderId) ;
      for(var f=0;f<load_data[0].salesOrder.length;f++)
      {
        var child_orderId=load_data[0].salesOrder[f].internalid;						
        if(main_orderId==child_orderId)
        {
          var currency = results[s].getValue("currency");
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
          load_data[0].salesOrder[f].customer_name=nlapiEscapeXML(results[s].getValue("firstname","customer")) + " " + nlapiEscapeXML(results[s].getValue("lastname","customer"));;
          load_data[0].salesOrder[f].currency=currency;
          load_data[0].salesOrder[f].trandate=results[s].getValue("trandate");
          load_data[0].salesOrder[f].billaddress1=nlapiEscapeXML(results[s].getValue("billaddress1"));
          load_data[0].salesOrder[f].billcity=nlapiEscapeXML(results[s].getValue("billcity"));
          load_data[0].salesOrder[f].billstate=nlapiEscapeXML(results[s].getValue("billstate"));
          load_data[0].salesOrder[f].billzip=results[s].getValue("billzip");
          load_data[0].salesOrder[f].tranid=results[s].getValue("tranid");                             
          if(results[s].getValue("custitem20","item")=="2"){haloMeleeSearchResult_call=true;check_parent_id.push(results[s].getValue("item"));}							 
          load_data[0].salesOrder[f].data_child.push({
            "item":results[s].getValue("item"),
            "quantity":results[s].getValue("quantity"),
            "rate":results[s].getValue("rate"),
            "fxamount":results[s].getValue("fxamount"),									
            "custitem20":results[s].getValue("custitem20","item"),
            "custitem5":results[s].getValue("custitem5","item"),
            "custitem28":results[s].getValue("custitem28","item"),
            "custitem7":results[s].getValue("custitem7","item"),
            "custitem19":results[s].getValue("custitem19","item"),
            "custitem27":results[s].getValue("custitem27","item"),
            "itemid":results[s].getValue("itemid","item"),
            "custitem18":results[s].getValue("custitem18","item"),
            "parent":results[s].getValue("parent","item"),
            "custitem1":results[s].getValue("custitem1","item"),

          });

        }

      }

    }
    if(haloMeleeSearchResult_call){load_data[0].haloMeleeSearchResult=haloMeleeSearchResult(check_parent_id);}
    nlapiGetContext().setSetting('SESSION', 'custpage_order_data',JSON.stringify(load_data)); 
    nlapiGetContext().setSetting('SESSION', 'custpage_print_data','');
    var param = new Array();
    param['index'] = 0;
    response.sendRedirect("SUITELET", "customscript_print_queue_v5", "customdeploy_print_queue_v5", false, param);

  }



}



function haloMeleeSearchResult(check_parent_id)
{
  var haloMeleeArr=[];
  var search_subitem=nlapiSearchRecord('item',null,[new nlobjSearchFilter('internalid',null,'anyof',check_parent_id),new nlobjSearchFilter('parent',null,'noneof','@NONE@')],new nlobjSearchColumn('parent'));
  if(search_subitem)
  {
  var search_parent_id=[];
  for(var h=0;h<search_subitem.length;h++)
   {
       search_parent_id.push(search_subitem[h].getValue('parent'));
   }
     nlapiLogExecution("debug","search_parent_id (Test )",JSON.stringify(search_parent_id));	
  var grpItemArr=[];
  var filters = [];    	
  filters[0] = nlobjSearchFilter("custrecord_center_shape",null,'is',1); //Shape= Round
  filters[1] = nlobjSearchFilter("custrecord_parent_halo",null,'is',search_parent_id);		
  var searchResult = nlapiSearchRecord("customrecord_halo_melee",4391,filters,new nlobjSearchColumn('custrecord_parent_halo'));


  if(searchResult)
  {
    var count=searchResult.length;
    if(searchResult.length>0)
    {
      for(i=0;i<searchResult.length;i++)
      {
        var ResultColm = searchResult[i].getAllColumns();
        var hmId = searchResult[i].getId(); 		
        var hmItemId = searchResult[i].getValue('custrecord_parent_halo');  
        var hmGemCount = searchResult[i].getValue('custrecord_gemstone_count');                            					
        var hmCenterSize = searchResult[i].getValue('custrecord_center_size');
        var hmMeleeSize = searchResult[i].getValue('custrecord_melee_size');
        var hmSize=0;
        if(hmCenterSize!='' && hmCenterSize!=null)
        {
          hmSize=hmCenterSize.replace('mm','');
        }							

        haloMeleeArr.push({hmId:hmId,hmSize:hmSize,hmGemCount:hmGemCount,hmMeleeSize:hmMeleeSize,hmParantItemId:hmItemId});				
      }	
      nlapiLogExecution("debug","haloMeleeArr (Test )",JSON.stringify(haloMeleeArr));	
      haloMeleeArr.sort(function(a, b) {
        return a.hmSize- b.hmSize;
      });


    }
  }
  }
  return haloMeleeArr;
}
