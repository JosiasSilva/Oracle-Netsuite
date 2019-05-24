nlapiLogExecution("audit","FLOStart",new Date().getTime());
var incoming_trans=[];
var outgoing_trans=[];
var page_index_min=0;
var page_index_max=50;
var create_box=false; 
var outgoing_to_dashboard ='customsearch_outgoing_to_dashboards';
var incoming_to_dashboard ='customsearch_incoming_to_dashboard';

function Transfer_Order_Dashboard(request, response)
{

  {
    var form = nlapiCreateForm("Transfer Order Dashboard"); 
    var filter_incoming=new Array();
    var filter_outgoing=new Array();
    if(request.getParameter("page_index"))
    {
      page_index_min=parseInt(request.getParameter("page_index"))-1;
      page_index_max=page_index_min+50;
    }

    if(request.getParameter("search_document"))
    {
      filter_incoming.push(new nlobjSearchFilter("tranid",null,"contains",request.getParameter("search_document")));
      filter_outgoing.push(new nlobjSearchFilter("tranid",null,"contains",request.getParameter("search_document")));
    }
    if(request.getParameter("search_ship_date"))
    {
      filter_incoming.push(new nlobjSearchFilter("trandate",null,"on",request.getParameter("search_ship_date")));
      filter_outgoing.push(new nlobjSearchFilter("trandate",null,"on",request.getParameter("search_ship_date")));
    }
    else
    {
      //filter_incoming.push(new nlobjSearchFilter("trandate",null,"on",'today'));
      //filter_outgoing.push(new nlobjSearchFilter("trandate",null,"on",'today'));
    }
    if(request.getParameter("from_location"))
    {
      create_box=true;
      var get_filter_location_obj=[];
      var location_get_field=request.getParameter("from_location");
      get_filter_location_obj.push(location_get_field);
      var get_ex_location=nlapiSearchRecord('location',null,[new nlobjSearchFilter('custrecord_location_type',null,'noneof','2'),
                                                             new nlobjSearchFilter('isinactive',null,'is','F'),
                                                             new nlobjSearchFilter('custrecordshowroom_inventory_location',null,'noneof','@NONE@'),
                                                             new nlobjSearchFilter('internalid',null,'anyof',location_get_field)
                                                            ],
                                            new nlobjSearchColumn('custrecordshowroom_inventory_location'));
      if(get_ex_location)
      {
        for(var a=0;a<get_ex_location.length;a++)
        {
          get_filter_location_obj.push(get_ex_location[a].getValue('custrecordshowroom_inventory_location'));
        }
      }
      filter_incoming.push(new nlobjSearchFilter("location",null,"anyof",get_filter_location_obj));
      filter_outgoing.push(new nlobjSearchFilter("location",null,"anyof",get_filter_location_obj));
    }
    if(request.getParameter("to_location"))
    {
      var get_filter_location_obj=[];
      var location_get_field=request.getParameter("to_location");
      get_filter_location_obj.push(location_get_field);
      var get_ex_location=nlapiSearchRecord('location',null,[new nlobjSearchFilter('custrecord_location_type',null,'noneof','2'),
                                                             new nlobjSearchFilter('isinactive',null,'is','F'),
                                                             new nlobjSearchFilter('custrecordshowroom_inventory_location',null,'noneof','@NONE@'),
                                                             new nlobjSearchFilter('internalid',null,'anyof',location_get_field)
                                                            ],
                                            new nlobjSearchColumn('custrecordshowroom_inventory_location'));
      if(get_ex_location)
      {
        for(var a=0;a<get_ex_location.length;a++)
        {
          get_filter_location_obj.push(get_ex_location[a].getValue('custrecordshowroom_inventory_location'));
        }
      }
      filter_incoming.push(new nlobjSearchFilter("transferlocation",null,"anyof",get_filter_location_obj));
      filter_outgoing.push(new nlobjSearchFilter("transferlocation",null,"anyof",get_filter_location_obj));
    }
    if(request.getParameter("type")=='get_page_data')
    {
      if(request.getParameter("machine")=='custitem_list_incoming')
      {
        Page_Record(filter_incoming,incoming_to_dashboard,response);
      }
      else
      {
        Page_Record(filter_outgoing,outgoing_to_dashboard,response);
      }
    }
    else if(request.getParameter("machine")=='custitem_list_incoming')
    {
      Get_Incoming_Data(request,form,filter_incoming,null);
      response.writePage(form);
    }
    else if(request.getParameter("machine")=='custitem_list_outgoing')
    {
      Out_Going_Data(request,form,filter_outgoing,null,create_box,null,true);
      response.writePage(form);
    }



    else
    {
      First_time_load(request,form,filter_incoming,filter_outgoing);
      response.writePage(form);
    }
  }

}

function First_time_load(request,form,filter_incoming,filter_outgoing)
{

  form.setScript("customscript_transfer_order_client");
  var get_ex_location=nlapiSearchRecord('location',null,[new nlobjSearchFilter('custrecord_location_type',null,'noneof','2'),
                                                         new nlobjSearchFilter('isinactive',null,'is','F'),
                                                         new nlobjSearchFilter('custrecordshowroom_inventory_location',null,'noneof','@NONE@')],
                                        new nlobjSearchColumn('custrecordshowroom_inventory_location'));
  var get_filter_location=[];
  var get_filter_from_incoming_location=[];
  get_filter_location.push(new nlobjSearchFilter('isinactive',null,'is','F'));
  get_filter_from_incoming_location.push(new nlobjSearchFilter('isinactive',null,'is','F'));
  var chk_location_obj=[];
  if(get_ex_location)
  {
    for(var a=0;a<get_ex_location.length;a++)
    {
      chk_location_obj.push(get_ex_location[a].getValue('custrecordshowroom_inventory_location'));
    }
    get_filter_location.push(new nlobjSearchFilter('internalid',null,'noneof', chk_location_obj));
    get_filter_from_incoming_location.push(new nlobjSearchFilter('internalid',null,'noneof', chk_location_obj));
  }
  get_filter_location.push(new nlobjSearchFilter('custrecord_location_type',null,'anyof','1'));
  get_filter_from_incoming_location.push(new nlobjSearchFilter('custrecord_location_type',null,'anyof',['1','3']));
  var get_location_search=nlapiSearchRecord('location',null,get_filter_location,new nlobjSearchColumn('name'));
  var get_from_incoming_location=nlapiSearchRecord('location',null,get_filter_from_incoming_location,new nlobjSearchColumn('name')); 
  var default_loaction="";
  var flag_set_location=false;
  try
  {
    default_loaction= nlapiLookupField ( 'employee' , nlapiGetUser ( ) , 'custentity85' );
    if(default_loaction && get_location_search)
    {
      for(var n=0;n<get_location_search.length;n++)
      {
        if(default_loaction==get_location_search[n].getId())
        {
          var get_filter_location_obj=[];
          var location_get_field=default_loaction;
          get_filter_location_obj.push(location_get_field);
          var get_ex_location=nlapiSearchRecord('location',null,[new nlobjSearchFilter('custrecord_location_type',null,'noneof','2'),
                                                                 new nlobjSearchFilter('isinactive',null,'is','F'),
                                                                 new nlobjSearchFilter('custrecordshowroom_inventory_location',null,'noneof','@NONE@'),
                                                                 new nlobjSearchFilter('internalid',null,'anyof',location_get_field)
                                                                ],
                                                new nlobjSearchColumn('custrecordshowroom_inventory_location'));
          if(get_ex_location)
          {
            for(var a=0;a<get_ex_location.length;a++)
            {
              get_filter_location_obj.push(get_ex_location[a].getValue('custrecordshowroom_inventory_location'));
            }
          }
          filter_incoming.push(new nlobjSearchFilter("transferlocation",null,"anyof",get_filter_location_obj));
          filter_outgoing.push(new nlobjSearchFilter("location",null,"anyof",get_filter_location_obj));
        }
      }
    }
  }
  catch(er)
  {

  }
  var get_length_incoming= Get_Incoming_Data(request,form,filter_incoming,get_location_search,get_from_incoming_location,default_loaction);
  var get_length_outgoing= Out_Going_Data(request,form,filter_outgoing,get_location_search,false,default_loaction,false);

}
function Get_Incoming_Data(request,form,filter_incoming,location_list,get_from_incoming_location,default_loaction)
{
  var result_incoming_load = nlapiLoadSearch(null, incoming_to_dashboard);
  var get_filter=result_incoming_load.getFilters();
  for(var a=0;a<get_filter.length;a++)
  {
    filter_incoming.push(get_filter[a]);
  }
  result_incoming_load.addFilters(filter_incoming);
  var resultset_result_incoming = result_incoming_load.runSearch();
  var result_incoming = resultset_result_incoming.getResults(page_index_min, page_index_max);
  incoming_list(form,request,location_list,result_incoming,get_from_incoming_location,default_loaction);
  return result_incoming;
}
function Out_Going_Data(request,form,filter_outgoing,location_list,create_box,default_loaction,data_load)
{ 
  var result_outgoing =null;
 if(data_load)
 {
   result_outgoing = nlapiSearchRecord(null, outgoing_to_dashboard,filter_outgoing);
 }
 outgoing_tab(form,request,location_list,result_outgoing,create_box,default_loaction);
}


function Page_Record(filter,search_id,responce)
{

  var search_column=[];
  var obj_data=[];
  search_column.push(new nlobjSearchColumn('internalid',null,'COUNT'));
  if(search_id==outgoing_to_dashboard)
  {
    search_column.push(new nlobjSearchColumn('formulanumeric',null,'SUM').setFormula("CASE WHEN {status}='Pending Fulfillment' THEN 1 ELSE 0 END"));
    //  search_column.push(new nlobjSearchColumn('formulanumeric',null,'SUM').setFormula("CASE WHEN {status}='Pending Receipt' THEN 0 ELSE 1 END"));
    search_column.push(new nlobjSearchColumn('formulanumeric',null,'SUM').setFormula("CASE WHEN {status}='Pending Receipt' THEN 1 ELSE 0 END"));
    search_column.push(new nlobjSearchColumn('formulanumeric',null,'SUM').setFormula("CASE WHEN LENGTH({custbody_box_record})>0 THEN 1 ELSE 0 END"));
    search_column.push(new nlobjSearchColumn('formulanumeric',null,'SUM').setFormula("CASE WHEN LENGTH({custbody_box_record.custrecord_box_packing_slip})>0 THEN 1 ELSE 0 END"));
    search_column.push(new nlobjSearchColumn('formulanumeric',null,'SUM').setFormula("CASE WHEN LENGTH({custbody_box_record.custrecord_box_shipping_label})>0 THEN 1 ELSE 0 END"));
  }
  var result_outgoing=nlapiSearchRecord(null,search_id,filter,search_column);

  if(result_outgoing)
  {
    for(var col=0;col<search_column.length;col++)
    {
      obj_data.push(result_outgoing[0].getValue(search_column[col]));
    }
  }
  responce.write( JSON.stringify(obj_data));
}

