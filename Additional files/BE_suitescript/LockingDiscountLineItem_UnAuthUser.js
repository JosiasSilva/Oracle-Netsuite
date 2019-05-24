nlapiLogExecution("audit","FLOStart",new Date().getTime());
function PageInit()
{
 
  //nlapiSetLineItemDisabled('item', 'istaxable', true, null);
}

function Locking_Discount_VALIDATE_FIELD(type, name)
{
    if (name == 'istaxable')
    {
         ChkRoll();
    }
    return true;
}

function Locking_Discount_LINE_INIT()
{
    ChkRoll();
}

function ChkRoll()
{
    var user_role = nlapiGetRole();
    //alert("your Role: "+user_role );
    if ((user_role != null) && (user_role != ''))
    {

        if ((user_role == '1007') || (user_role == '1026')|| (user_role == '18'))
        {
            return true;
        }
        else
        {
            var item = nlapiGetCurrentLineItemValue('item', 'item');
            var index = nlapiGetCurrentLineItemIndex('item');
            if (item == 15037)
            {
                nlapiSetLineItemDisabled('item', 'istaxable', true, index);
            }
            else
            {
                nlapiSetLineItemDisabled('item', 'istaxable', false, index);
            }
        }
    }

}
// 1007 	Custom Brilliant Earth - Billing,
// 1026	    Custom Brilliant Earth - Finance Associate,
// 18		Full Access,
// ?		Administrator
// if ((user_role == '1007') || (user_role == '1026') || (user_role != '18'))




