nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SetStandardMeleeItem()
{
  nlapiLogExecution("DEBUG","Inventory Item Id : "+ nlapiGetRecordId());
  var obj = nlapiLoadRecord('inventoryitem',nlapiGetRecordId());
  var itemid = obj.getFieldValue('itemid');
  var val1 = itemid.indexOf('BE1M');
  var val2 = itemid.indexOf('BE2M');
  var form = obj.getFieldValue('customform');
  var category = obj.getFieldValue('custitem20');
  
  
  if(form == 21)
  {
	UpdateRepairResizeReturnAuthorization(obj);	    
  }
  else if(form == 1)
  {
	 UpdateRepairResizeReturnAuthorization(obj); 
	 UpdateStandardMeleeItem(obj);
  }
  else if( form == 76)
  {
     UpdateStandardMeleeItem(obj);    
  } //form if end 

} //Main function end


 // Update Repair Resize Status of ReturnAuthorization
 function UpdateRepairResizeReturnAuthorization(obj)
 {
	var returnEstateStatus = obj.getFieldValue('custitem179');
    //if(category == 24)
    //{
      if(returnEstateStatus == 4 || returnEstateStatus == 2)
      {
        var filters = [];
        filters[0] = new nlobjSearchFilter('item', null, 'is', nlapiGetRecordId());
        var searchresults = nlapiSearchRecord('returnauthorization', null, filters, []); 
        if(searchresults != null)
        {
          for(var i=0; i < searchresults.length; i++)
          {
             var internalId = searchresults[i].id;
             UpdateReturnAuthorization(internalId);
          }               
        }
      }
    //} 
 }
 
 function UpdateReturnAuthorization(id)
 {
   var retAuthObj = nlapiLoadRecord('returnauthorization',id);
   retAuthObj.setFieldValue('custbody142',20);
   var Id = nlapiSubmitRecord(retAuthObj,true,true);
   nlapiLogExecution("DEBUG","Updated Return Authorization Id : "+ Id);
 } 
 
 
 function UpdateStandardMeleeItem(obj)
 {
	var subitemId1 = obj.getFieldValue('custitem9');
    var subitemId2 = obj.getFieldValue('custitem11');
    var subitemId3 = obj.getFieldValue('custitem13');
    var subitemId4 = obj.getFieldValue('custitem94');
    var subitemId5 = obj.getFieldValue('custitem_sub_item_5');
    var subitemId6 = obj.getFieldValue('custitem_sub_item_6');
    var subitemId7 = obj.getFieldValue('custitem_sub_item_7');
    var activeStatus = obj.getFieldValue('custitem160');
    var dateInactive = obj.getFieldValue('custitem163');
    var parentNo = 0;

    //Get Previous subitems id
    var ctx = nlapiGetContext();
    var oldSubitemId1 = ctx.getSessionObject('oldSubitemId1');
    var oldSubitemId2 = ctx.getSessionObject('oldSubitemId2');
    var oldSubitemId3 = ctx.getSessionObject('oldSubitemId3');
    var oldSubitemId4 = ctx.getSessionObject('oldSubitemId4');
    var oldSubitemId5 = ctx.getSessionObject('oldSubitemId5');
    var oldSubitemId6 = ctx.getSessionObject('oldSubitemId6');
    var oldSubitemId7 = ctx.getSessionObject('oldSubitemId7');

    nlapiLogExecution("DEBUG"," Sub Item1 Id before submit : "+ oldSubitemId1);
    nlapiLogExecution("DEBUG"," Sub Item2 Id before submit : "+ oldSubitemId2);
    nlapiLogExecution("DEBUG"," Sub Item3 Id before submit : "+ oldSubitemId3);
    nlapiLogExecution("DEBUG"," Sub Item4 Id before submit : "+ oldSubitemId4);
    nlapiLogExecution("DEBUG"," Sub Item5 Id before submit : "+ oldSubitemId5);
    nlapiLogExecution("DEBUG"," Sub Item6 Id before submit : "+ oldSubitemId6);
    nlapiLogExecution("DEBUG"," Sub Item7 Id before submit : "+ oldSubitemId7);

    nlapiLogExecution("DEBUG"," Sub Item1 Id after submit : "+ subitemId1);
    nlapiLogExecution("DEBUG"," Sub Item2 Id after submit : "+ subitemId2);
    nlapiLogExecution("DEBUG"," Sub Item3 Id after submit : "+ subitemId3);
    nlapiLogExecution("DEBUG"," Sub Item4 Id after submit : "+ subitemId4);
    nlapiLogExecution("DEBUG"," Sub Item5 Id after submit : "+ subitemId5);
    nlapiLogExecution("DEBUG"," Sub Item6 Id after submit : "+ subitemId6);
    nlapiLogExecution("DEBUG"," Sub Item7 Id after submit : "+ subitemId7);
              
    //if(val1 == -1 && val2 == -1)
    //{
     if(subitemId1 != null || subitemId2 != null || subitemId3 != null || subitemId4 != null || subitemId5 != null || subitemId6 != null || subitemId7 != null)
     {
        if(subitemId1 != null)
        {               
          parentNo = GetParentItemNo(subitemId1); 
          if( parentNo == 1)
          {
              if( activeStatus == 3 || dateInactive != null)
              {
                 UncheckStandardMelee(subitemId1); 
              }
              else if( activeStatus != 3 && dateInactive == null)
              {
                 CheckStandardMelee(subitemId1); 
              } 
          }
          else if( parentNo > 1 )
          {                       
             if( activeStatus != 3 && dateInactive == null)
             { 
                UncheckStandardMelee(subitemId1);                                         
             }
             else if( activeStatus == 3 || dateInactive != null)           
             {
                CheckStandardMelee(subitemId1); 
             }
          }  
        }
        else if(oldSubitemId1 != null)
        {
           UncheckStandardMelee(oldSubitemId1); 
        }

        if(subitemId2 != null)
        {             
           parentNo = GetParentItemNo(subitemId2);
           if( parentNo == 1)
           {
              if( activeStatus == 3 || dateInactive != null)
              {
                 UncheckStandardMelee(subitemId2); 
              }
              else if( activeStatus != 3 && dateInactive == null)
              {
                 CheckStandardMelee(subitemId2); 
              } 
           }
           else if( parentNo > 1 )
           {               
              if( activeStatus != 3 && dateInactive == null)
              { 
                //CheckStandardMelee(subitemId2); 
                UncheckStandardMelee(subitemId2);                                  
              }
              else if( activeStatus == 3 || dateInactive != null)
              {
                //UncheckStandardMelee(subitemId2); 
                CheckStandardMelee(subitemId2); 
              } 
           } 
        }
        else if(oldSubitemId2 != null)
        {
           UncheckStandardMelee(oldSubitemId2); 
        }

        if(subitemId3 != null)
        {             
          parentNo = GetParentItemNo(subitemId3);
          if( parentNo == 1)
          {
              if( activeStatus == 3 || dateInactive != null)
              {
                 UncheckStandardMelee(subitemId3); 
              }
              else if( activeStatus != 3 && dateInactive == null)
              {
                 CheckStandardMelee(subitemId3); 
              } 
          }
          else if( parentNo > 1 )
          {                  
             if( activeStatus != 3 && dateInactive == null)
             { 
               //CheckStandardMelee(subitemId3); 
               UncheckStandardMelee(subitemId3);                                  
             }
             else if( activeStatus == 3 || dateInactive != null)
             {
               //UncheckStandardMelee(subitemId3); 
               CheckStandardMelee(subitemId3);    
             } 
          } 
        }
        else if(oldSubitemId3 != null)
        {
           UncheckStandardMelee(oldSubitemId3); 
        }

        if(subitemId4 != null)
        {              
           parentNo = GetParentItemNo(subitemId4);
           if( parentNo == 1)
           {
              if( activeStatus == 3 || dateInactive != null)
              {
                 UncheckStandardMelee(subitemId4); 
              }
              else if( activeStatus != 3 && dateInactive == null)
              {
                 CheckStandardMelee(subitemId4); 
              } 
           }
           else if( parentNo > 1 )
           {                   
              if( activeStatus != 3 && dateInactive == null)
              { 
                //CheckStandardMelee(subitemId4); 
                UncheckStandardMelee(subitemId4);                                  
              }
              else if( activeStatus == 3 || dateInactive != null)
              {
                //UncheckStandardMelee(subitemId4); 
                CheckStandardMelee(subitemId4); 
              }
           }  
        }
        else if(oldSubitemId4 != null)
        {
           UncheckStandardMelee(oldSubitemId4); 
        }

        if(subitemId5 != null)
        {            
           if( parentNo == 1)
           {
              if( activeStatus == 3 || dateInactive != null)
              {
                 UncheckStandardMelee(subitemId5); 
              }
              else if( activeStatus != 3 && dateInactive == null)
              {
                 CheckStandardMelee(subitemId5); 
              } 
           }
           else if( parentNo > 1 )
           {    
              parentNo = GetParentItemNo(subitemId5);             
              if( activeStatus != 3 && dateInactive == null)
              { 
                //CheckStandardMelee(subitemId5); 
                UncheckStandardMelee(subitemId5);                                  
              }
              else if( activeStatus == 3 || dateInactive != null)
              {
                //UncheckStandardMelee(subitemId5); 
                CheckStandardMelee(subitemId5); 
              } 
           }   
        }
        else if(oldSubitemId5 != null)
        {
           UncheckStandardMelee(oldSubitemId5); 
        }

        if(subitemId6 != null)
        {              
           parentNo = GetParentItemNo(subitemId6);
           if( parentNo == 1)
           {
              if( activeStatus == 3 || dateInactive != null)
              {
                 UncheckStandardMelee(subitemId6); 
              }
              else if( activeStatus != 3 && dateInactive == null)
              {
                 CheckStandardMelee(subitemId6); 
              } 
           }
           else if( parentNo > 1 )
           {                   
              if( activeStatus != 3 && dateInactive == null)
              { 
                //CheckStandardMelee(subitemId6);
                UncheckStandardMelee(subitemId6);                                   
              }
              else if( activeStatus == 3 || dateInactive != null)
              {
                //UncheckStandardMelee(subitemId6); 
                CheckStandardMelee(subitemId6); 
              } 
           } 
        }
        else if(oldSubitemId6 != null)
        {
           UncheckStandardMelee(oldSubitemId6); 
        }

        if(subitemId7 != null)
        {              
           parentNo = GetParentItemNo(subitemId7);
           if( parentNo == 1)
           {
              if( activeStatus == 3 || dateInactive != null)
              {
                 UncheckStandardMelee(subitemId7); 
              }
              else if( activeStatus != 3 && dateInactive == null)
              {
                 CheckStandardMelee(subitemId7); 
              } 
           }
           else if( parentNo > 1 )
           {                   
              if( activeStatus != 3 && dateInactive == null)
              { 
                 //CheckStandardMelee(subitemId7); 
                 UncheckStandardMelee(subitemId7);                                  
              }
              else if( activeStatus == 3 || dateInactive != null)
              {
                 //UncheckStandardMelee(subitemId7); 
                 CheckStandardMelee(subitemId7); 
              }
           }  
        }
        else if(oldSubitemId7 != null)
        {
           UncheckStandardMelee(oldSubitemId7); 
        }

     }//if end of subitems codition
     else
     {
        if(oldSubitemId1 != null)
        {
           UncheckStandardMelee(oldSubitemId1);
        }    
        if(oldSubitemId2 != null)
        {
           UncheckStandardMelee(oldSubitemId2);
        }    
        if(oldSubitemId3 != null)
        {
           UncheckStandardMelee(oldSubitemId3);
        }    
        if(oldSubitemId4 != null)
        {
           UncheckStandardMelee(oldSubitemId4);
        }    
        if(oldSubitemId5 != null)
        {
           UncheckStandardMelee(oldSubitemId5);
        }    
        if(oldSubitemId6 != null)
        {
           UncheckStandardMelee(oldSubitemId6);
        }    
        if(oldSubitemId7 != null)
        {
           UncheckStandardMelee(oldSubitemId7);
        }     
     } //else end
	 
    //}//if BE1M end	 
 }
 
  
 function CheckStandardMelee(id)
 {
     var meleeObj = nlapiLoadRecord('inventoryitem',id);
     var category = meleeObj.getFieldValue('custitem20');
     if(category == 1 || category == 23 || category == 30)
     {
       meleeObj.setFieldValue('custitem175','T'); 
       var Id = nlapiSubmitRecord(meleeObj,true,true);

       var flag = nlapiLookupField('inventoryitem',Id,'custitem175');       
       nlapiLogExecution("DEBUG","Standard Melee Checkbox status : "+ flag);
       nlapiLogExecution("DEBUG","Checked Standard Melee Item Id : "+ Id);
     }
 } 

 function UncheckStandardMelee(id)
 {
     var meleeObj = nlapiLoadRecord('inventoryitem',id);
     var category = meleeObj.getFieldValue('custitem20');
     if(category == 1 || category == 23 || category == 30)
     {
       meleeObj.setFieldValue('custitem175','F'); 
       var Id = nlapiSubmitRecord(meleeObj,true,true);
      
       var flag = nlapiLookupField('inventoryitem',Id,'custitem175');       
       nlapiLogExecution("DEBUG","Standard Melee Checkbox status : "+ flag);
       nlapiLogExecution("DEBUG","UnChecked Standard Melee Item Id : "+ Id);
     }
 }


//Function to check remove subitem
 function CheckRemoveSubItem(type)
 {
   if(type == 'edit')
   {
   nlapiLogExecution("DEBUG","Inventory Item Id before submit : "+ nlapiGetRecordId());
   var objInvt = nlapiLoadRecord('inventoryitem',nlapiGetRecordId());
    
   var subitemId1 = objInvt.getFieldValue('custitem9');
   var subitemId2 = objInvt.getFieldValue('custitem11');
   var subitemId3 = objInvt.getFieldValue('custitem13');
   var subitemId4 = objInvt.getFieldValue('custitem94');
   var subitemId5 = objInvt.getFieldValue('custitem_sub_item_5');
   var subitemId6 = objInvt.getFieldValue('custitem_sub_item_6');
   var subitemId7 = objInvt.getFieldValue('custitem_sub_item_7');

   var ctx = nlapiGetContext();
   ctx.setSessionObject('oldSubitemId1',subitemId1);
   ctx.setSessionObject('oldSubitemId2',subitemId2);
   ctx.setSessionObject('oldSubitemId3',subitemId3);
   ctx.setSessionObject('oldSubitemId4',subitemId4);
   ctx.setSessionObject('oldSubitemId5',subitemId5);
   ctx.setSessionObject('oldSubitemId6',subitemId6);
   ctx.setSessionObject('oldSubitemId7',subitemId7);
   }   
 }


//Function for getting parent item no of a single subitem
function GetParentItemNo(subitemId)
 {
   //For Filters logic subitem1
   var filters1 = new Array();
   filters1[0] = new nlobjSearchFilter('custitem9', null, 'is',subitemId);				 
   var columns1 = new Array(); // new array for columns of the search
   columns1[0] = new nlobjSearchColumn('internalid');							 
   var SavedSearch1 = nlapiSearchRecord('inventoryitem', null, filters1, columns1);
   var length1 = 0;
                
   if(SavedSearch1 != null)
   {      
      length1 = SavedSearch1.length;                  
   }
   
   //For Filters logic subitem2
   var filters2 = new Array();
   filters2[0] = new nlobjSearchFilter('custitem11', null, 'is',subitemId);
   var columns2 = new Array(); // new array for columns of the search
   columns2[0] = new nlobjSearchColumn('internalid'); 
   var SavedSearch2 = nlapiSearchRecord('inventoryitem', null, filters2, columns2);
   var length2 = 0;
                   
   if(SavedSearch2 != null)
   {      
      length2 = SavedSearch2.length;  
   }
    
   //For Filters logic subitem3 
   var filters3 = new Array();
   filters3[0] = new nlobjSearchFilter('custitem13', null, 'is',subitemId);
   var columns3 = new Array(); // new array for columns of the search
   columns3[0] = new nlobjSearchColumn('internalid'); 
   SavedSearch3 = nlapiSearchRecord('inventoryitem', null, filters3, columns3);
   var length3 = 0;
                  
   if(SavedSearch3 != null)
   {      
      length3 = SavedSearch3.length; 
   }

   //For Filters logic subitem4
   var filters4 = new Array();
   filters4[0] = new nlobjSearchFilter('custitem94', null, 'is',subitemId);
   var columns4 = new Array(); // new array for columns of the search
   columns4[0] = new nlobjSearchColumn('internalid'); 
   SavedSearch4 = nlapiSearchRecord('inventoryitem', null, filters4, columns4);
   var length4 = 0;
                      
   if(SavedSearch4 != null)
   {      
      length4 = SavedSearch4.length; 
   }

   //For Filters logic subitem5
   var filters5 = new Array();
   filters5[0] = new nlobjSearchFilter('custitem_sub_item_5', null, 'is',subitemId);
   var columns5 = new Array(); // new array for columns of the search
   columns5[0] = new nlobjSearchColumn('internalid'); 
   SavedSearch5 = nlapiSearchRecord('inventoryitem', null, filters5, columns5);
   var length5 = 0;
                            
   if(SavedSearch5 != null)
   {      
      length5 = SavedSearch5.length; 
   } 

   //For Filters logic subitem6
   var filters6 = new Array();
   filters6[0] = new nlobjSearchFilter('custitem_sub_item_6', null, 'is',subitemId);
   var columns6 = new Array(); // new array for columns of the search
   columns6[0] = new nlobjSearchColumn('internalid'); 
   SavedSearch6 = nlapiSearchRecord('inventoryitem', null, filters6, columns6);
   var length6 = 0;
                                
   if(SavedSearch6 != null)
   {      
      length6 = SavedSearch6.length; 
   }

    //For Filters logic subitem7
    var filters7 = new Array();
    filters7[0] = new nlobjSearchFilter('custitem_sub_item_7', null, 'is',subitemId);
    var columns7 = new Array(); // new array for columns of the search
    columns7[0] = new nlobjSearchColumn('internalid'); 
    SavedSearch7 = nlapiSearchRecord('inventoryitem', null, filters7, columns7);
    var length7 = 0;
                                    
    if(SavedSearch7 != null)
    {       
      length7 = SavedSearch7.length; 
    }
    
    var length = length1 + length2 + length3 + length4 + length5 + length6 + length7;
    return length;
 }




