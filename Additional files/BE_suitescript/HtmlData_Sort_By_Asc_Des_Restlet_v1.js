var SO_Id = {};

function HtmlData_Sort_By_Asc_Des_Restlet(datain) {
    var html = "";
    try {
        nlapiLogExecution('Error', 'Request data of ASC or DES ', JSON.stringify(datain));
        var asc_des_val = datain.asc_des_val;
        if (asc_des_val == 1)
            nlapiLogExecution("Error", "Asc val", asc_des_val);
        else if (asc_des_val == 2)
            nlapiLogExecution("Error", "Des val", asc_des_val);
        var BackstockStatusOption = BackstockOption();
        //nlapiLogExecution('debug', 'BackstockStatusOption : ',BackstockStatusOption);
        var data = BackStock_Data(datain);
        nlapiLogExecution("Error", "data", JSON.stringify(data));
        if (asc_des_val == 1) {
            data = data.sort(numberAs);
            nlapiLogExecution("Error", "data sorted asc", JSON.stringify(data));
        } else if (asc_des_val == 2) {
            data = data.sort(numberDes);
            nlapiLogExecution("Error", "data sorted des", JSON.stringify(data));
        }
        var unique_id = 0;
        if (data != null && data != '' && data.length > 0) {
            html += "<input type='hidden' id='temp' ><style type='text/css'>#customers th { vertical-align: middle!important; text-align: center!important;}#customers td, #customers th { vertical-align: top;border: 1px solid #ddd;text-align: left;padding: 3px;}   \
.SO_Item{margin:-6px;}.SO_Item tr{background-color: transparent !important;}\
#customers tr:nth-child(even) {background-color: #f2f2f2;}#customers th {padding-top: 11px;padding-bottom: 11px;background-color: #607799 !important;color: white;}   \
\
table#customers {   \
font-size: 14px;   \
font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;   \
border-collapse: collapse;   \
border-spacing: 0;   \
width: 100%;   \
}   \
.Nested_td {border: 1px silver solid!important;   \
}   \
.Item\
{\
width:125px;\
}\
.Name\
{\
width:150px;\
}\
.Description\
{\
width:125px;\
}\
.price\
{\
width:125px;\
}\
.Match\
{\
width:125px;\
}\
.ItemPulled \
{\
width:125px; \
}\
</style> \
<div>   \
<table id='customers'>   \
<tr>   \
<th style='font-weight: bold;'>BACKSTOCK STATUS</th> \
<th style='font-weight: bold;'>SALES ORDER</th>   \
<th class='Order' style='font-weight: bold;' >ORDER STATUS</th>   \
<th class='Name' style='font-weight: bold;'>CUSTOMER</th>   \
<th style='font-weight: bold;'>NOTES</th>   \
<th class='Item' style='font-weight: bold;'>ITEM</th>   \
<th class='Description' style='font-weight: bold;'>DESCRIPTION</th>   \
<th class='price' style='font-weight: bold;'>AMOUNT</th>   \
<th class='Match' style='font-weight: bold;'>MATCH</th>   \
<th class='ItemPulled' style='font-weight: bold;'>ITEM PULLED</th> </tr>";
            // var item_pulled_line_item_parent_matches_parent_of_backstock_match_item='F';

            for (var i = 0; i < data.length; i++) {
                var c1 = [];
                var count = 0;
                var datas = data[i];
                var count = SO_Id[datas].length;
                var so_data = SO_Id[datas];

                //nlapiLogExecution("Error","so_data",JSON.stringify(so_data));
                if (so_data != null && so_data != '' && so_data.length > 0) {
                    html += "<tr>";
                    html += "<td><select name='BS_Status_1' data-id='" + so_data[0].SO_Id + "' >" + BackstockStatusOption + "</select></td>";
                    if (so_data[0].run_out_ring == 'T')
                        html += "<td style='background-color:#ead9fc;'>" + so_data[0].DocumentNumber + "</td>";
                    else
                        html += "<td>" + so_data[0].DocumentNumber + "</td>";
                    html += "<td class='orderstatus'> <span data-id='" + so_data[0].order_status_value + "'>" + so_data[0].OrderStatus + "</span></td>";
                    html += "<td class='Name' >" + so_data[0].Name + "</td> ";
                    // html += "<td style='height: 100%;'><textarea  style='height: 100%;' id='SO_Notes_1' data-id='" + so_data[0].SO_Id + "' data-text='" + so_notes_txt + "' >" + so_data[0].SO_Notes + "</textarea> </td>";
                    html += '<td style="height: 100%;"><textarea  style="height: 100%;" id="SO_Notes_1" data-id="' + so_data[0].SO_Id + '" data-text="' + so_data[0].SO_Notes + '" >' + so_data[0].SO_Notes + '</textarea> </td>';

                    html += "<td colspan='5'>";
                    html += "<table class='SO_Item' width='630px'>";
                    //var back_stock_item_internalid_arr =[];
                    for (var z = 0; z < so_data.length; z++) {
                        //var back_stock_item_internalid_arr =[];
                        var item_pulled_line_item_parent_matches_parent_of_backstock_match_item = 'F';
                        html += "<tr>";
                        html += "<td class='Nested_td Item'><p data-id ='" + so_data[z].ItemId + "'>" + so_data[z].Item + "</p></td>";
                        html += "<td class='Nested_td Description'>" + so_data[z].Description + "</td>";
                        html += "<td class='Nested_td Price'>" + so_data[z].Price + "</td>";
                        //html += "<td class='Nested_td '>"+so_data[z].Match +"</td>";
                        html += "<td class='Nested_td Match'>";
                        var match = so_data[z].Match.split(',');
                        //nlapiLogExecution("Error","Match",JSON.stringify(match));
                        var itemParent = so_data[z].item_parentText;
                        //nlapiLogExecution("Error","Item Parent Text",itemParent);
                        var back_stock_item_internalid = so_data[z].back_stock_item_internalid;
                        //nlapiLogExecution("Error","temp back stock item internalid",back_stock_item_internalid);
                        //var back_stock_item_internalid = temp_back_stock_item_internalid.split(',');
                        //nlapiLogExecution("Error","back stock item internalid",back_stock_item_internalid);
                        if (match != null && match != '' && match.length > 0) {
                            //var back_stock_item_internalid_arr =[];
                            //var filters=[];
                            for (var x = 0; x < match.length; x++) {
                                var itemParentBackStockMatch = match[x].split(':');
                                //nlapiLogExecution("Error","Item Parent Back Stock Match",itemParentBackStockMatch[0]);
                                if (itemParent.replace(/\s/g, '') == itemParentBackStockMatch[0].replace(/\s/g, '')) {
                                    // nlapiLogExecution("Error","test");
                                    // var back_stock_item_id='';
                                    item_pulled_line_item_parent_matches_parent_of_backstock_match_item = 'T';
                                    /*var item_name =  itemParentBackStockMatch[1].replace(/\s/g, '');
                                    filters.push(nlobjSearchFilter('itemid',null,'is',item_name));
                                    var resultObj = nlapiSearchRecord("inventoryitem",null,filters,null);
                                    if(resultObj)
                                     var back_stock_item_id= resultObj[0].getId();*/
                                    //if(back_stock_item_internalid_arr.length==0)
                                    //{
                                    if (so_data[z].Item == match[x])
                                        html += "<u style='background-color:yellow;' data-match='yes' data-id='" + back_stock_item_internalid[x] + "'>" + match[x] + "</u><br/>";
                                    //html += "<u style='background-color:yellow;' data-match='yes' data-id='"+ back_stock_item_id+"'>" + match[x] + "</u><br/>";
                                    else
                                        html += "<u data-match='no' data-id='" + back_stock_item_internalid[x] + "'>" + match[x] + "</u><br/>";
                                    //html += "<u data-match='no' data-id='"+back_stock_item_id+"'>" + match[x] + "</u><br/>";

                                    //back_stock_item_internalid.pop(back_stock_item_internalid[x]);
                                    //}
                                    /* else
                                    {
                                      for(var t =0; t<back_stock_item_internalid_arr.length;t++)
                                      {
                                        if(back_stock_item_internalid[x] != back_stock_item_internalid_arr[t])
                                        {
                                          if(so_data[z].Item  ==  match[x])
                                            html += "<u style='background-color:yellow;' data-match='yes' data-id='"+ back_stock_item_internalid[x]+"'>" + match[x] + "</u><br/>";
                                          else
                                            html += "<u data-match='no' data-id='"+ back_stock_item_internalid[x]+"'>" + match[x] + "</u><br/>";
                                        }
                                      }
                                    }

                                    back_stock_item_internalid_arr.push(back_stock_item_internalid[x]);*/
                                }
                            }
                        }
                        //nlapiLogExecution("Error","item_pulled_line_item_parent_matches_parent_of_backstock_match_item 33",item_pulled_line_item_parent_matches_parent_of_backstock_match_item);
                        //nlapiLogExecution("Error","so_data[0].item_pulled_for_cat_one_or_two",so_data[z].item_pulled_for_cat_one_or_two);
                        html += "</td>";
                        //if(item_pulled_line_item_parent_matches_parent_of_backstock_match_item == 'T' &&  so_data[z].item_pulled_for_cat_one_or_two == 'T')
                        if (item_pulled_line_item_parent_matches_parent_of_backstock_match_item == 'T') {
                            //html += "<td class='Nested_td ItemPulled'><select class='Nested_td ItemPulled' name='BS_Item_Pulled' data-id='" + so_data[z].ItemId + "' >" + so_data[z].pulled_item_option + "</select></td>";
                            //unique_id = unique_id + 1
                            //html += "<td class='Nested_td ItemPulled'><input type='text' class='Nested_td ItemPulled' name='BS_Item_Pulled' data-id='" + unique_id +"' /></td>";
                            html += '<td class="Nested_td ItemPulled"><a style="color: #607799;"onclick="return ItemPulled_Add(this);" id="ItemPulled_' + i + '_' + z + '" href="#" data-value="">Add Item</a></td>';
                            // item_pulled_line_item_parent_matches_parent_of_backstock_match_item ='F';
                        } else {

                            // html += '<td class="Nested_td ItemPulled"><a style="color: #607799;"onclick="return ItemPulled_Add(this);" id="ItemPulled_'+i+'_'+z+'" href="#" data-value="">Add Item</a></td>';
                            html += "<td class='Nested_td ItemPulled'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
                        }
                        html += "</tr> ";
                        c1.push(z);
                    }
                    // nlapiLogExecution("Error",'c1 legth',c1.length);
                    //alert(c1.length);
                    if (c1.length == 1) {
                        html += "<tr style='display:none;'> ";
                        // html += "<tr> ";
                        html += "<td class='Nested_td Item'><p data-id=''>test 1 </p></td>";
                        html += "<td>test 2 </td>";
                        html += "<td>test 3 </td>";
                        html += "<td class='Nested_td Match'><u data-id=''>test 4 </u></td>";
                        html += "<td class='Nested_td ItemPulled'><a data-value=''>test 5 </a></td>";
                        html += "</tr> ";
                        html += "<tr style='display:none;'> ";
                        // html += "<tr> ";
                        html += "<td class='Nested_td Item'><p data-id=''>test 5</p> </td>";
                        html += "<td>test 6 </td>";
                        html += "<td>test 7 </td>";
                        html += "<td class='Nested_td Match'><u data-id=''>test 8 </u></td>";
                        html += "<td class='Nested_td ItemPulled'><a data-value=''>test 9 </a></td>";
                        html += "</tr> ";

                        html += "<tr style='display:none;'> ";
                        //html += "<tr> ";
                        html += "<td class='Nested_td Item'><p data-id=''>test 9 </p></td>";
                        html += "<td>test 10 </td>";
                        html += "<td>test 11 </td>";
                        html += "<td class='Nested_td Match'><u data-id=''>test 12 </u></td>";
                        html += "<td class='Nested_td ItemPulled'><a data-value=''>test 13 </a></td>";
                        html += "</tr> ";
                    }
                    if (c1.length == 2) {
                        html += "<tr style='display:none;'> ";
                        //html += "<tr> ";
                        html += "<td class='Nested_td Item'><p data-id=''>test 1 </p></td>";
                        html += "<td>test 2 </td>";
                        html += "<td>test 3 </td>";
                        html += "<td class='Nested_td Match'><u data-id=''>test 4 </u></td>";
                        html += "<td class='Nested_td ItemPulled'><a data-value=''>test 5 </a></td>";
                        html += "</tr> ";
                        html += "<tr style='display:none;'> ";
                        // html += "<tr> ";
                        html += "<td class='Nested_td Item'><p data-id=''>test 5</p> </td>";
                        html += "<td>test 6 </td>";
                        html += "<td>test 7 </td>";
                        html += "<td class='Nested_td Match'><u data-id=''>test 8 </u></td>";
                        html += "<td class='Nested_td ItemPulled'><a data-value=''>test 9 </a></td>";
                        html += "</tr> ";
                    }
                    if (c1.length == 3) {
                        html += "<tr style='display:none;'> ";
                        // html += "<tr> ";
                        html += "<td class='Nested_td Item'><p data-id=''>test 9 </p></td>";
                        html += "<td>test 10 </td>";
                        html += "<td>test 11 </td>";
                        html += "<td class='Nested_td Match'><u data-id=''>test 12 </u></td>";
                        html += "<td class='Nested_td ItemPulled'><a data-value=''>test 13 </a></td>";
                        html += "</tr> ";
                    }
                    html += "</table> ";
                    html += "</td> ";
                    // html += "<td><select name='BS_Status_1' data-id='" + so_data[0].SO_Id + "' >" + BackstockStatusOption + "</select></td>";
                    html += "</tr>";
                }
            }
        } else {
            html += "<tr><td colspan='10'> No Record Found</td></tr>";
        }
        html += "</table>  </div>";
        //nlapiLogExecution('debug', 'HtmlData', html);
    } catch (err) {
        nlapiLogExecution('error', 'Error On HtmlData', err.message);
    }
    return html;
}

function BackstockOption() {
    var BackstockStatusOption = '';
    try {
        var customList = getListValues('customlist_backstock_item_match_status');
        //nlapiLogExecution('debug', 'BackstockOption list : ', customList.length);
        for (var j = 0; j < customList.length; j++) {
            if (customList[j] == null) {
                customList[j] = "";
            }
            BackstockStatusOption += " <option value=" + j + ">" + customList[j] + "</option> ";
        }
    } catch (err) {
        nlapiLogExecution('error', 'Error On BackstockOption', err.message);
    }
    return BackstockStatusOption;
}

function getListValues(listScriptId) {
    var listArray = new Array();
    try {
        var searchColumn = new nlobjSearchColumn('name');
        //nlapiLogExecution('debug', 'listScriptId : ', listScriptId);
        var searchResultslist = nlapiSearchRecord(listScriptId, null, null, searchColumn);
        if (searchResultslist != null && searchResultslist != '' && searchResultslist.length > 0) {
            for (i in searchResultslist) {
                listArray[searchResultslist[i].id] = searchResultslist[i].getValue(searchColumn);
            }
        }

    } catch (err) {
        nlapiLogExecution('error', 'Error On getListValues', err.message);
    }
    //nlapiLogExecution('debug', 'getListValues', listArray.length);
    return listArray;
}

function BackStock_Data(datain) {
    try {
        var Search = '';
        //sort match column on dashboard
        if (datain.match_col_asc_des == "true") {
            nlapiLogExecution("Error", "Match Column Desc Value", datain.match_col_asc_des);
            Search = create_Saved_Search_Match_Col_DES();
        } else if (datain.match_col_asc_des == "false") {
            nlapiLogExecution("Error", "Match Column Asc Value", datain.match_col_asc_des);
            Search = create_Saved_Search_Match_Col_ASC();
        } //End Match Sort
        // Sort Customer on Dashboard
        else if (datain.customer_col_asc_des == "true") {
            nlapiLogExecution("Error", "Customer Column Desc Value", datain.customer_col_asc_des);
            Search = create_Saved_Search_Customer_Col_DES();
        } else if (datain.customer_col_asc_des == "false") {
            nlapiLogExecution("Error", "Customer Column Asc Value", datain.customer_col_asc_des);
            Search = create_Saved_Search_Customer_Col_ASC();
        } //End sort customer
        // Sort by Order status
        else if (datain.order_status_col_asc_des == "true") {
            nlapiLogExecution("Error", "Order Status Column Desc Value", datain.order_status_col_asc_des);
            Search = create_Saved_Search_Order_Status_Col_DES();
        } else if (datain.order_status_col_asc_des == "false") {
            nlapiLogExecution("Error", "Order Status Column Asc Value", datain.order_status_col_asc_des);
            Search = create_Saved_Search_Order_Status_Col_ASC();
        } //End Sort Order Status
        // Sort by Item Col
        else if (datain.item_col_asc_des == "true") {
            nlapiLogExecution("Error", "Item Column Desc Value", datain.item_col_asc_des);
            Search = create_Saved_Search_Item_Col_DES();
        } else if (datain.item_col_asc_des == "false") {
            nlapiLogExecution("Error", "Item Column Asc Value", datain.item_col_asc_des);
            Search = create_Saved_Search_Item_Col_ASC();
        } //End Sort by Item Col
        // Sort by Amount Col
        else if (datain.amount_col_asc_des == "true") {
            nlapiLogExecution("Error", "Item Column Desc Value", datain.amount_col_asc_des);
            Search = create_Saved_Search_Amount_Col_DES();
        } else if (datain.amount_col_asc_des == "false") {
            nlapiLogExecution("Error", "Item Column Asc Value", datain.amount_col_asc_des);
            Search = create_Saved_Search_Amount_Col_ASC();
        } //End Sort by Amount Col
        else
            Search = nlapiLoadSearch(null, 'customsearch_backstock_dashboard');

        var results = Search.runSearch();
        var resultsArr = [];
        var so_arr = [];
        var searchid = 0;
        var count = 0;
        var indexRow = 0;
        var sales_order = [];
        do {
            var AllRows = results.getResults(searchid, searchid + 1000);
            //alert("AllRows.length"+"\n"+AllRows.length);
            if (AllRows != null && AllRows != '' && AllRows.length > 0) {
                var allCol = AllRows[0].getAllColumns();
                for (var rs in AllRows) {
                    var item_pulled_for_cat_one_or_two = 'F';
                    var pulled_item_option = '';
                    var soid = AllRows[rs].id;
                    var customerid = AllRows[rs].getValue(allCol[2]);
                    //var Percent= calcPercentPaid(soid,customerid);
                    //if(Percent!=null && Percent!="" && parseFloat(Percent)>50.00)
                    //{
                    var backstock_match = '';
                    var parent = AllRows[rs].getValue(allCol[9]);
                    var internalid = AllRows[rs].getValue(allCol[7]);
                    var order_status_value = AllRows[rs].getValue(allCol[1]);
                    var item_parentText = AllRows[rs].getText(allCol[9]);
                    var run_out_ring = AllRows[rs].getValue(allCol[10]);
                    var item_id = AllRows[rs].getValue(allCol[8]);
                    var item_cat = nlapiLookupField("inventoryitem", item_id, "custitem20");
                    //pulled_item_option += "<option value ='-1'>Select Item</option>";
                    if (item_cat == 2 || item_cat == 3) {
                        //pulled_item_option += "<option value='"+rs+"'>" + AllRows[rs].getValue(allCol[4]) + "</option> ";
                        item_pulled_for_cat_one_or_two = 'T';
                    }

                    if (parent != '' && parent != '' && internalid != '' && internalid != null) {
                        internalid = internalid.split(',');
                        var filter = [];
                        filter.push(new nlobjSearchFilter('internalid', null, 'anyof', internalid));
                        filter.push(new nlobjSearchFilter('parent', null, 'is', parent));
                        var col = [];
                        col.push(new nlobjSearchColumn('itemid'));
                        var resultMatch = nlapiSearchRecord('inventoryitem', null, filter, col);
                        //nlapiLogExecution('debug','test', JSON.stringify(resultMatch));
                        var backstock_match_arr = [];
                        if (resultMatch != null && resultMatch != '' && resultMatch.length > 0) {
                            for (var i = 0; i < resultMatch.length; i++) {
                                backstock_match_arr.push(resultMatch[i].getValue('itemid'));
                            }
                            backstock_match = backstock_match_arr.join(',');
                        }
                    }

                    var link_soId = "<a  target='_blank' title='Click here to Open SO' href='/app/accounting/transactions/salesord.nl?id=" + AllRows[rs].id + "' style='color: #255599;    text-decoration: none;' >" + AllRows[rs].getValue(allCol[0]) + "</a>";
                    var link_cust = "<a  target='_blank' title='Click here to Open Customer' href='/app/common/entity/custjob.nl?id=" + AllRows[rs].getValue(allCol[2]) + "' style='color: #255599;    text-decoration: none;' >" + AllRows[rs].getText(allCol[2]) + "</a>";
                    var price = AllRows[rs].getValue(allCol[6]);
                    if (price == "" || price == null) {
                        price = 0.00;
                    }
                    price = "$" + price;
                    resultsArr.push({
                        DocumentNumber: link_soId,
                        OrderStatus: AllRows[rs].getText(allCol[1]).replace(",", ",<br/>"),
                        Name: link_cust,
                        SO_Notes: AllRows[rs].getValue(allCol[3]),
                        Item: AllRows[rs].getValue(allCol[4]),
                        Description: AllRows[rs].getValue(allCol[5]),
                        Price: price,
                        Match: backstock_match,
                        //Match: AllRows[rs].getText(allCol[7]),
                        BackstockStatus: null,
                        ItemId: AllRows[rs].getValue(allCol[8]),
                        SO_Id: AllRows[rs].id,
                        item_parentText: item_parentText,
                        item_pulled_for_cat_one_or_two: item_pulled_for_cat_one_or_two,
                        //pulled_item_option : pulled_item_option,
                        run_out_ring: run_out_ring,
                        back_stock_item_internalid: internalid,
                        order_status_value: order_status_value

                    });
                    //}
                    searchid++;
                }
            }
        }
        while (AllRows.length >= 1000);
        //nlapiLogExecution("Error", "Itemarray", JSON.stringify(resultsArr));
        var groups = resultsArr;
        var SO_IdName = [];
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            if (typeof SO_Id[group.SO_Id] === "undefined") {
                SO_Id[group.SO_Id] = [];
                SO_IdName.push(group.SO_Id);
                //SO_IdName.sort();
            }
            SO_Id[group.SO_Id].push({
                DocumentNumber: group.DocumentNumber,
                OrderStatus: group.OrderStatus,
                Name: group.Name,
                SO_Notes: group.SO_Notes,
                Item: group.Item,
                Description: group.Description,
                Price: group.Price,
                Match: group.Match,
                BackstockStatus: group.BackstockStatus,
                ItemId: group.ItemId,
                SO_Id: group.SO_Id,
                item_parentText: group.item_parentText,
                item_pulled_for_cat_one_or_two: group.item_pulled_for_cat_one_or_two,
                //pulled_item_option : group.pulled_item_option,
                run_out_ring: group.run_out_ring,
                back_stock_item_internalid: group.back_stock_item_internalid,
                order_status_value: group.order_status_value
            });
        }
        nlapiLogExecution("Error", "SO_IdName", JSON.stringify(SO_IdName));
        //alert("2" +"\n"+ JSON.stringify(SO_IdName));
        return SO_IdName;
    } catch (er) {
        nlapiLogExecution("error", "Error on load Record", er.message);
    }
}

function numberAs(a, b) {
    return a - b;
}

function numberDes(a, b) {
    return b - a;
}
//Sort by Match Column
function create_Saved_Search_Match_Col_ASC() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null);
    newcolumns[2] = new nlobjSearchColumn('entity', null, null);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null);
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null);
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null).setSort(false);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Saved Search Temp Table create_Saved_Search_Match_Col_ASC()", "Saved Search id has been added successfully");
    return search;
}

function create_Saved_Search_Match_Col_DES() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null);
    newcolumns[2] = new nlobjSearchColumn('entity', null, null);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null);
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null);
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null).setSort(true);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Saved Search Temp Table create_Saved_Search_Match_Col_DES()", "Saved Search id has been added successfully");
    return search;
}

// Sort Customer by ASC Order

function create_Saved_Search_Customer_Col_ASC() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null);
    newcolumns[2] = new nlobjSearchColumn('entity', null, null).setSort(false);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null);
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null);
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Temp Saved Search Table for Customer Col ASC", "Temp Saved Search id for customer sort(ASC) has been added successfully");
    return search;
}

// Sort Customer by ASC Order
function create_Saved_Search_Customer_Col_DES() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null);
    newcolumns[2] = new nlobjSearchColumn('entity', null, null).setSort(true);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null);
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null);
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Temp Saved Search Table for Customer Col DSC", "Temp Saved Search id for customer sort(DSC) has been added successfully");
    return search;
}

// Sort  Order Status by ASC Order

function create_Saved_Search_Order_Status_Col_ASC() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null).setSort(false); // order status
    newcolumns[2] = new nlobjSearchColumn('entity', null, null);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null);
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null);
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);

    nlapiLogExecution("Error", "Temp Saved Search Table for Order Status Col ASC", "Temp Saved Search id for order status sort(ASC) has been added successfully");
    return search;
}

// Sort  Order Status by DESC Order
function create_Saved_Search_Order_Status_Col_DES() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null).setSort(true); // order status
    newcolumns[2] = new nlobjSearchColumn('entity', null, null);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null);
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null);
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Temp Saved Search Table for Order Status Col DSC", "Temp Saved Search id for order status sort(DSC) has been added successfully");
    return search;
}

// Sort  Item by ASC Order

function create_Saved_Search_Item_Col_ASC() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null);
    newcolumns[2] = new nlobjSearchColumn('entity', null, null);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null).setSort(false); //// Item
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null);
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Temp Saved Search Table for Item Col ASC", "Temp Saved Search id for item sort(ASC) has been added successfully");
    return search;
}

// Sort  Item by DESC Order
function create_Saved_Search_Item_Col_DES() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null);
    newcolumns[2] = new nlobjSearchColumn('entity', null, null);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null).setSort(true); // Item
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null);
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Temp Saved Search Table for Item Col DSC", "Temp Saved Search id for item sort(DSC) has been added successfully");
    return search;
}

// Sort  Amount by ASC Order
function create_Saved_Search_Amount_Col_ASC() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null);
    newcolumns[2] = new nlobjSearchColumn('entity', null, null);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null);
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null).setSort(false); //// Amount
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Temp Saved Search Table for Amount Col ASC", "Temp Saved Search id for amount sort(ASC) has been added successfully");
    return search;
}

// Sort  Amount by DESC Order
function create_Saved_Search_Amount_Col_DES() {
    var search = nlapiCreateSearch('salesorder', null, null);
    var newcolumns = new Array();
    newcolumns[0] = new nlobjSearchColumn('tranid', null, null);
    newcolumns[1] = new nlobjSearchColumn('custbody227', null, null)
    newcolumns[2] = new nlobjSearchColumn('entity', null, null);
    newcolumns[3] = new nlobjSearchColumn('custbody58', null, null);
    newcolumns[4] = new nlobjSearchColumn('itemid', 'item', null);
    newcolumns[5] = new nlobjSearchColumn('salesdescription', 'item', null);
    newcolumns[6] = new nlobjSearchColumn('baseprice', 'item', null).setSort(true); // Amount
    newcolumns[7] = new nlobjSearchColumn('custbody_backstock_item_matches', null, null);
    newcolumns[8] = new nlobjSearchColumn('internalid', 'item', null);
    newcolumns[9] = new nlobjSearchColumn('parent', 'item', null);
    newcolumns[10] = new nlobjSearchColumn('custbody338', null, null);

    search.setColumns(newcolumns);
    var newFilterExpression = [
        ["type", "anyof", "SalesOrd"], "AND", ["status", "anyof", "SalesOrd:A"], "AND", ["custbody111", "is", "F"], "AND", ["custbody227", "noneof", "1", "5"], "AND", ["custbody87", "noneof", "2", "3", "4", "5", "20"], "AND", ["custbody_backstock_item_match_status", "anyof", "@NONE@"], "AND", ["custbody_percent_paid", "isnotempty", ""], "AND", [
            ["custbody_pot_backstock_ring_match", "is", "T"], "OR", ["custbody338", "is", "T"]
        ], "AND", ["item.custitem20", "anyof", "2", "3", "7", "8", "14", "15", "18", "20", "31"], "AND", ["custbody227", "anyof", "8"]
    ];

    search.setFilterExpression(newFilterExpression);
    search.setIsPublic(true);
    nlapiLogExecution("Error", "Temp Saved Search Table for Amount Col DSC", "Temp Saved Search id for amount sort(DSC) has been added successfully");
    return search;
}