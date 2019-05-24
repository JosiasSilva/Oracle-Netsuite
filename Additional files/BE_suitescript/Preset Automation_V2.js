nlapiLogExecution("audit","FLOStart",new Date().getTime());
function BeforeLoad(type)
{
  if(type=='edit' )
     {
	    var assemblyid=nlapiGetFieldValue('custrecord_assembly_bill_of_materials');
		if(assemblyid!=null && assemblyid!='')
		{
          nlapiSetRedirectURL('RECORD', 'assemblyitem' , assemblyid);
		  }
     }
}
function BeforeSubmite(type)
{

  
      if(type=='create')
	   {
        var loose_stone=nlapiGetFieldValue('custrecord_loose_stone');
		var loose_setting=nlapiGetFieldValue('custrecord_loose_setting');
	    var TotalItem=new Array();
		TotalItem.push(loose_setting);
		TotalItem.push(loose_stone);
		TotalItem.push('2131887');
           var vlaue_chk=nlapiGetFieldValue('custrecord_preset_diamond_pool');
	    if(vlaue_chk==7 || vlaue_chk==8 )
	     {
		   TotalItem.push('39300');
	     }
		var loose_stone_txt=nlapiGetFieldValue('custrecord_loose_stone_name');
		var loose_setting_txt=nlapiGetFieldValue('custrecord_loose_setting_name');
        var Itemcategory=nlapiGetFieldValue('custrecord_category');
		var columns = new Array();
	    columns.push(new nlobjSearchColumn('unitprice','pricing'));
	    columns.push(new nlobjSearchColumn('saleunit','pricing'));
        var price=nlapiSearchRecord('item',null,new nlobjSearchFilter("internalid",null,"anyOf",[loose_setting,loose_stone]),columns);
		
		//var loose_setting_price=price[1].getValue(columns[0])==null?0:price[1].getValue(columns[0])==''?0:price[1].getValue(columns[0]);
		//var loose_stone_price =price[0].getValue(columns[0])==null?0:price[0].getValue(columns[0])==''?0:price[0].getValue(columns[0]);
		var loose_setting_price='';
		var loose_stone_price ='';
		   
		   if(price!=null)
		   {
			   for(var h=0;h<price.length;h++)
			   {
				   var id=price[h].getId();
				   if(id==loose_setting)
				   {
					   loose_setting_price=price[h].getValue(columns[0])==null?0:price[h].getValue(columns[0])==''?0:price[h].getValue(columns[0]);
				   }
				   else if(id==loose_stone)
				   {
					   loose_stone_price =price[h].getValue(columns[0])==null?0:price[h].getValue(columns[0])==''?0:price[h].getValue(columns[0]);
				   }
			   }
		   }
		var total_price_amount=parseFloat(loose_stone_price)+parseFloat(loose_setting_price);
		var CreteItem=nlapiCreateRecord ( 'assemblyitem');
	    var how_produced=loose_stone_txt+'- $'+loose_stone_price +'\r\n' +loose_setting_txt+'- $'+loose_setting_price ;
		
		
		var lo_sett_purch=nlapiGetFieldValue('custrecordloose_setting_purchase_descrip');
		var lo_stone_purch=nlapiGetFieldValue('custrecordloose_stonpurchase_description');
		var lo_sett_sales=nlapiGetFieldValue('custrecordloose_setting_sales_descrip');	
		var lo_stone_sales=nlapiGetFieldValue('custrecord_loose_stone_sales_description');
		var purch_dec=''
		var sales_dec=''
		if(lo_sett_purch!=null && lo_sett_purch!='' && lo_stone_purch!=null && lo_stone_purch!='')
		{
		  purch_dec=lo_sett_purch+ ' with '+lo_stone_purch;
		}
		else
		{

		  if(lo_sett_purch!=null && lo_sett_purch!='')
		  {
		    purch_dec=lo_sett_purch;
		  }
		  if(lo_stone_purch!=null && lo_stone_purch!='')
		  {
		    purch_dec=lo_stone_purch;
		  }
		
		}
		
		if(lo_sett_sales!=null && lo_sett_sales!='' && lo_stone_sales!=null && lo_stone_sales!='')
		{
		  sales_dec=lo_sett_sales+ ' with '+lo_stone_sales;
		}
		else
		{

		  if(lo_sett_sales!=null && lo_sett_sales!='')
		  {
		    sales_dec=lo_sett_sales;
		  }
		  if(lo_stone_sales!=null && lo_stone_sales!='')
		  {
		    sales_dec=lo_stone_sales;
		  }
		
		}
		
		
		
	   CreteItem.setFieldValue('description',sales_dec);
	  CreteItem.setFieldValue('purchasedescription',purch_dec);
		
       if(Itemcategory==7)
       {  
	       CreteItem.setFieldValue('custitem200', nlapiGetFieldValue('custrecord_preset_diamond_pool'));
		   CreteItem.setFieldValue('custitem201', Subtypeof());
                 
                   var metaltype= nlapiGetFieldValue('custrecord_precious_metal');
                 if(metaltype==1)
		    CreteItem.setFieldValue('custitem202',1);
         		else if(metaltype==2)
                  	CreteItem.setFieldValue('custitem202',4);
                  else if(metaltype==3)
                     CreteItem.setFieldValue('custitem202',2);
                     
           CreteItem.setFieldValue('custitem20',35);
		   var certificate_number=nlapiGetFieldValue('custrecord_certificate_number');
		   if(certificate_number!=null && certificate_number!='')
		   {
			   CreteItem.setFieldValue('custitem46',certificate_number);
			   how_produced=how_produced+'\r\n Cert: '+certificate_number;
		   }
       }
       else 
       {
            
			  CreteItem.setFieldValue('custitem20',32);
       }
	   
	    var itemname=loose_setting_txt.replace('-N-','-'+loose_stone_txt+'-');	 
		CreteItem.setFieldValue('itemid',itemname);
        CreteItem.setFieldValue('assetaccount',400);
		CreteItem.setFieldValue('taxschedule',1);
		CreteItem.setFieldValue('custitem55',how_produced);
         for(var i=0;i<TotalItem.length;i++)
        {
        CreteItem.selectNewLineItem('member');		
		CreteItem.setCurrentLineItemValue ( 'member' , 'item' ,TotalItem[i] );
        CreteItem.commitLineItem ('member'); 
        }
          
       CreteItem.setLineItemMatrixValue('price', 'price',1,1,total_price_amount);		
       var id=  nlapiSubmitRecord ( CreteItem , true , true ); 
	   if(id!=null)
	   {
	        var date_end= new Date();
            date_end.setDate(date_end.getDate() +7);
            date_end= nlapiDateToString(date_end);
	        var workorder=nlapiCreateRecord ( 'workorder');
            workorder.setFieldValue('assemblyitem', id); 
			workorder.setFieldValue('enddate', date_end); 
			workorder.setFieldValue('orderstatus', 'A');
			workorder.setFieldValue('memo', 'Preset Ring for Inventory');		
			var workorderid=  nlapiSubmitRecord ( workorder , true , true );
            var workorderid_data=nlapiLoadRecord('workorder',workorderid);
			for(var t=1;t<=workorderid_data.getLineItemCount('item');t++)
			{
               var value=workorderid_data.getLineItemValue('item','createpo',t);
               if(value=='SpecOrd')
			   {
			   		workorderid_data.setLineItemValue('item','createpo',t,'');
				}			 
			}
		workorderid_data.setFieldValue('orderstatus','B');
		nlapiSubmitRecord ( workorderid_data, true, true);			 
		nlapiSetFieldValue('custrecord_assembly_bill_of_materials',id);
		nlapiSetFieldValue('custrecord_work_orders',workorderid);
       
        }
    }
 }
function AfterLoad(type)
{
	var assemblyid=nlapiGetFieldValue('custrecord_assembly_bill_of_materials');
	if(assemblyid!=null && assemblyid!='')
	{
	 nlapiSetRedirectURL('RECORD', 'assemblyitem' ,assemblyid);
	}
}

function Subtypeof()
{
  var subtype=nlapiGetFieldValue('custrecord_subtypeof');
  if(subtype==27160)
  {
    return 2;
  }
  else if(subtype==305428)
  {
    return 3;
  }
    else if(subtype==616245)
  {
    return 4;
  }
    else if(subtype==12816)
  {
    return 7;
  }
    else if(subtype==1097197)
  {
    return 5;
  }
    else if(subtype==490257)
  {
    return 6;
  }
    else if(subtype==13866)
  {
    return 1;
  }	
else if(subtype==3897257)
  {
    return 9;
  }
else if(subtype==1114368)
  {
    return 8;
  }
else if(subtype==2019578)
  {
    return 12;
  }
else if(subtype==491119)
  {
    return 11;
  }
else if(subtype==3310578)
  {
    return 10;
  }
else if(subtype==5041617)
  {
    return 13;
  }
  
   else 
  {
    return "";
  }
}




