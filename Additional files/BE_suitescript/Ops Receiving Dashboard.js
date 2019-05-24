var or_item_materials_id=['13','7','5','6','15','14','12','18'];
var or_item_materials_text=['Antique Appraisal','Cert','Cleaner','Mats','Mats - Reincorporated','Promotional Item' ,'Work and Release of Liability','Promo Item- Reincorporated'];
var or_item_materials_internal=['antique_appraisal_box','cert_box','cleaner_box','mats_box','mats_reincorporated_box','promotional_item_box','work_and_release_of_liability_box','promo_item_reincorporated'];
var or_item_box_id=['9','4','2','3','11','1','10','16','17'];
var or_item_box_text=['2 Single Boxes','Customer Box','Double Box','Extra Small Box','Pendant Box' ,'Single Box','Single Box - Reincorporated','Double Box Reincorporated','Kraft Box'];
var or_item_box_internal=['two_single_boxes_materials','customer_box_materials','double_box_materials','extra_small_box_materials','pendant_box_materials','single_box_materials','single_box_reincorporated_materials','double_box_reincorporated','kraft_box'];
var location_id=['','2','3','4','6'];
var location_text=['','San Francisco','Los Angeles','Item Sent to SF (Ops Only Status)','Boston'];
var paging_size=49;
var divided_size=50;
var date_time=new Date();
var sales_search_one='customsearch_custom_package_record';
var save_search_two='customsearch_custom_package_record_2_2';
var save_searh_three='customsearch_custom_package_record_3_2';


function OpsReceivingDashboard(request,response)
{
  try
  {
    if (request.getMethod() == 'GET') 
    {
      var form = nlapiCreateForm('OPS Receiving Dashboard',true,true);
      form.setScript("customscript_ops_rece_dash_client");
      form.addTab("custpage_all_tab_one","All Packages");
      form.addTab("custpage_all_tab_two","Post Sale Intake");
      form.addTab("custpage_all_tab_three","Incoming International");
      var numOrders_first=0;
      var numOrders_scound=0;
      var numOrders_third=0;

      var tab_name=request.getParameter("tab");

      var all_pakage_team_id='';
      var all_searh_key_pakage='';
      var all_searh_key_post_sales='';
      var all_searh_key_incoming='';
      var droup_of_value_package='';
      var droup_of_value_post_sales='';
      var custrecord_status=''
      if(request.getParameter("team_id"))
      {
        all_pakage_team_id=request.getParameter("team_id");
      }


      var filter_first=[];
      if(tab_name=='custpage_all_tab_one')
      {
        if(request.getParameter("search_key"))
        {
          all_searh_key_pakage=request.getParameter("search_key");
        }
        if(request.getParameter("custbody_drop_off"))
        {
          droup_of_value_package=request.getParameter("custbody_drop_off");
        }
        if(droup_of_value_package=='1' || droup_of_value_package=='2')
        {
          filter_first.push(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','anyof',droup_of_value_package));
        }
        else if(droup_of_value_package=='0')
        {
          filter_first.push(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','noneof','@NONE@')); 
        }
        if(all_pakage_team_id )
        {
          if(all_pakage_team_id=='0' )
          {
            filter_first.push(new nlobjSearchFilter('custrecord_team',null,'noneof','@NONE@'));
          }
          else
          {
            filter_first.push(new nlobjSearchFilter('custrecord_team',null,'anyof',all_pakage_team_id));
          }

        }
        if(request.getParameter("custrecord_status"))
        {
          custrecord_status=request.getParameter("custrecord_status");
          filter_first.push(new nlobjSearchFilter('custrecord_status',null,'anyof',custrecord_status));
        }
        if(all_searh_key_pakage)
        {
          // filter_first.push(new nlobjSearchFilter('numbertext','custrecord_transaction_record','contains',all_searh_key_pakage).setOr(true).setLeftParens('1'));
          //filter_first.push(new nlobjSearchFilter('custrecord_tracking_id',null,'contains',all_searh_key_pakage).setRightParens('1'));
          filter_first.push(new nlobjSearchFilter('custrecord_document_number',null,'contains',all_searh_key_pakage).setOr(true).setLeftParens('1'));
          filter_first.push(new nlobjSearchFilter('custrecord_tracking_id',null,'contains',all_searh_key_pakage).setRightParens('1'));
        }
      }

      var number_record_sublist_first=nlapiSearchRecord(null, sales_search_one,filter_first,new nlobjSearchColumn('internalid',null,'count'));
      if(number_record_sublist_first)
      {
        var col=number_record_sublist_first[0].getAllColumns();
        numOrders_first=parseInt(number_record_sublist_first[0].getValue(col[0]));
      }

      var  filter_secound=[];
      if(tab_name=='custpage_all_tab_two')
      {
        if(request.getParameter("search_key"))
        {
          all_searh_key_post_sales=request.getParameter("search_key");
        }
        if(request.getParameter("custbody_drop_off"))
        {
          droup_of_value_post_sales=request.getParameter("custbody_drop_off");
        }
        if(droup_of_value_post_sales=='1' || droup_of_value_post_sales=='2')
        {
          filter_secound.push(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','anyof',droup_of_value_post_sales));
          filter_secound.addFilter(new nlobjSearchFilter('mainline','custrecord_transaction_record','is','T')); 
        }
        else if(droup_of_value_post_sales=='0')
        {
          filter_secound.push(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','noneof','@NONE@')); 
          filter_secound.addFilter(new nlobjSearchFilter('mainline','custrecord_transaction_record','is','T')); 
        }
        if(all_searh_key_post_sales)
        {
          //filter_secound.push(new nlobjSearchFilter('numbertext','custrecord_transaction_record','contains',all_searh_key_post_sales).setOr(true).setLeftParens('1'));
          filter_secound.push(new nlobjSearchFilter('custrecord_document_number',null,'contains',all_searh_key_post_sales).setOr(true).setLeftParens('1'));
          filter_secound.push(new nlobjSearchFilter('custrecord_tracking_id',null,'contains',all_searh_key_post_sales).setRightParens('1'));
        }
      }

      var number_record_sublist_scound=nlapiSearchRecord(null, save_search_two,filter_secound,new nlobjSearchColumn('internalid',null,'count'));
      if(number_record_sublist_scound)
      {
        var col=number_record_sublist_scound[0].getAllColumns();
        numOrders_scound=parseInt(number_record_sublist_scound[0].getValue(col[0]));
      }

      var  filter_third=[];
      if(tab_name=='custpage_all_tab_three')
      {
        if(request.getParameter("search_key"))
        {
          all_searh_key_incoming=request.getParameter("search_key");
        }
        if(all_searh_key_incoming)
        {

          //filter_third.push(new nlobjSearchFilter('numbertext','custrecord_transaction_record','contains',all_searh_key_incoming).setOr(true).setLeftParens('1'));
          filter_third.push(new nlobjSearchFilter('custrecord_document_number',null,'contains',all_searh_key_incoming).setOr(true).setLeftParens('1'));
          filter_third.push(new nlobjSearchFilter('custrecord_tracking_id',null,'contains',all_searh_key_incoming).setRightParens('1'));
        }
      }
      var number_record_sublist_third=nlapiSearchRecord(null,save_searh_three,filter_third,new nlobjSearchColumn('internalid',null,'count'));
      if(number_record_sublist_third)
      {
        var col=number_record_sublist_third[0].getAllColumns();
        numOrders_third=parseInt(number_record_sublist_third[0].getValue(col[0]));
      }
      var page_package=request.getParameter("cutpage_page_package");
      Paging_first(numOrders_first,form,page_package,all_pakage_team_id,droup_of_value_package,all_searh_key_pakage,custrecord_status);
      if(numOrders_first>0)
      {

        var index_page_package=1;
        if(page_package){index_page_package=parseInt(page_package);}
        var st_ed_index_page_package=(index_page_package-1);
        var results_first = nlapiLoadSearch(null,sales_search_one);
        if(tab_name=='custpage_all_tab_one')
        {
          if(all_pakage_team_id )
          {
            if(all_pakage_team_id=='0' )
            {
              results_first.addFilter(new nlobjSearchFilter('custrecord_team',null,'noneof','@NONE@'));
            }
            else
            {
              results_first.addFilter(new nlobjSearchFilter('custrecord_team',null,'anyof',all_pakage_team_id));
            }

          }

          if(custrecord_status)
          {
            results_first.addFilter(new nlobjSearchFilter('custrecord_status',null,'anyof',custrecord_status));
          }
          if(droup_of_value_package=='1' || droup_of_value_package=='2')
          {
            results_first.addFilter(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','anyof',droup_of_value_package));
            results_first.addFilter(new nlobjSearchFilter('mainline','custrecord_transaction_record','is','T')); 
          }
          else if(droup_of_value_package=='0')
          {
            results_first.addFilter(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','noneof','@NONE@')); 
            results_first.addFilter(new nlobjSearchFilter('mainline','custrecord_transaction_record','is','T')); 
          }
          if(all_searh_key_pakage)
          {

            // results_first.addFilter(new nlobjSearchFilter('numbertext','custrecord_transaction_record','contains',all_searh_key_pakage).setOr(true).setLeftParens('1'));
            results_first.addFilter(new nlobjSearchFilter('custrecord_document_number',null,'contains',all_searh_key_pakage).setOr(true).setLeftParens('1'));
            results_first.addFilter(new nlobjSearchFilter('custrecord_tracking_id',null,'contains',all_searh_key_pakage).setRightParens('1'));
          }
        }
        var resultSet_first = results_first.runSearch();
        var results_package = resultSet_first.getResults(st_ed_index_page_package,(st_ed_index_page_package+paging_size));
        Add_field_on_Sublist_all_package(form,results_package);
      }
      else
      {
        Add_Sub_List_empty_all_pakage(form);
      }
      var page_sale_intake=request.getParameter("cutpage_page_sale_intake");
      Paging_secound(numOrders_scound,form,page_sale_intake,droup_of_value_post_sales,all_searh_key_post_sales);
      if(numOrders_scound>0)
      {


        var index_page_sale_intake=1;
        if(page_sale_intake){index_page_sale_intake=parseInt(page_sale_intake);}
        var st_ed_index_page_sale_intake=(index_page_sale_intake-1);
        var results_scound = nlapiLoadSearch(null, save_search_two);
        if(tab_name=='custpage_all_tab_two')
        {
          if(droup_of_value_post_sales=='1' || droup_of_value_post_sales=='2')
          {
            results_scound.addFilter(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','anyof',droup_of_value_post_sales));
            results_scound.addFilter(new nlobjSearchFilter('mainline','custrecord_transaction_record','is','T')); 
          }
          else if(droup_of_value_post_sales=='0')
          {
            results_scound.addFilter(new nlobjSearchFilter('custbody_drop_off','custrecord_transaction_record','noneof','@NONE@')); 
            results_scound.addFilter(new nlobjSearchFilter('mainline','custrecord_transaction_record','is','T')); 
          }
          if(all_searh_key_post_sales)
          {

            results_scound.addFilter(new nlobjSearchFilter('custrecord_document_number',null,'contains',all_searh_key_post_sales).setOr(true).setLeftParens('1'));
            results_scound.addFilter(new nlobjSearchFilter('custrecord_tracking_id',null,'contains',all_searh_key_post_sales).setRightParens('1'));
          }
        }
        var resultSet_scound = results_scound.runSearch();
        var results_post_sale_intake = resultSet_scound.getResults(st_ed_index_page_sale_intake,(st_ed_index_page_sale_intake+paging_size));
        Add_field_on_Sublist_post_sale_intake(form,results_post_sale_intake);	
      }
      else
      {
        Add_Sub_List_empty_sale_intake(form);
      }
      var page_internationale=request.getParameter("cutpage_page_internationale");
      Paging_third(numOrders_third,form,page_internationale,all_searh_key_incoming);
      if(numOrders_third>0)
      {
        var index_page_internationale=1;
        if(page_internationale){index_page_internationale=parseInt(page_internationale);}
        var st_ed_index_page_internationale=(index_page_internationale-1);
        var results_third = nlapiLoadSearch(null, save_searh_three);
        if(tab_name=='custpage_all_tab_three')
        {
          if(all_searh_key_incoming)
          {
            results_third.addFilter(new nlobjSearchFilter('custrecord_document_number',null,'contains',all_searh_key_incoming).setOr(true).setLeftParens('1'));
            results_third.addFilter(new nlobjSearchFilter('custrecord_tracking_id',null,'contains',all_searh_key_incoming).setRightParens('1'));
          }
        }
        var resultSet_third = results_third.runSearch();
        var results_incoming_international = resultSet_third.getResults(st_ed_index_page_internationale,(st_ed_index_page_internationale+paging_size));

        Add_field_on_Sublist_incoming_international(form,results_incoming_international);
      }
      else
      {
        Add_Sub_List_empty_incoming_international(form);
      }
      response.writePage(form);
    }
  }
  catch(err)
  {
    response.writePage(err);
    nlapiLogExecution('debug','Error on Page',err.message);
  }
}
function Add_Package()
{
  window.onbeforeunload = null;
  nlOpenWindow('/app/common/custom/custrecordentry.nl?rectype=529&label=Package Record&target=custpage_all_packages:custpage_team1','Package Record',800,500,'custcol_package_record',true);

}