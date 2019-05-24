function Highlight_Return_Authorization_column(type, form) {
    //Highlight Return Authorization column Diamond Return Date (custcol_diamond_return_date)  Fields
    try {
        if (type == "view") {
            var RAid = nlapiGetRecordId();
            var type = nlapiGetRecordType();
            var load_RAobj = nlapiLoadRecord(type, RAid);
            //Bussiness day logic start
            var current_date = new Date();
            var calculated = 0;
            var date_obj = [];
            var offDays = [];
            do {

                current_date = nlapiAddDays(current_date, 1);
                var get_day = current_date.getDay();
                if (get_day != 0 && get_day != 6) {

                    var workingDays = nlapiDateToString(current_date);
                    date_obj.push(workingDays);
                    calculated++;
                } else {
                    var leaveDay = nlapiDateToString(current_date);
                    offDays.push(leaveDay);
                }

            } while (calculated < 5);
            current_date = nlapiDateToString(current_date);
            //end
            var highlightLine = form.addField("custpagehighlightline", "inlinehtml", "Highlight Fields", null, "custom");
            var highlightRAcolumnGreen = "<script type='text/javascript'>";
            highlightRAcolumnGreen += 'var items = document.getElementById("item_splits");';
            var itemCount = load_RAobj.getLineItemCount('item');
            for (var i = 1; i <= itemCount; i++) {
                var itemId = load_RAobj.getLineItemValue('item', 'item', i);
                var expectedRTDate = load_RAobj.getLineItemValue('item', 'custcol_diamond_return_date', i);
                if (expectedRTDate) {
                    var date1 = new Date(expectedRTDate);
var date2 = new Date(date_obj[4]);
var milliseconds1 = date1.getTime();
var milliseconds2 = date2.getTime(); 
if(milliseconds2 >= milliseconds1 ) {
                        highlightRAcolumnGreen += 'var row = items.rows[' + i + '];';
                        highlightRAcolumnGreen += 'for ( var j = 0; j < row.cells.length; j++ ) {';
                        highlightRAcolumnGreen += 'var cell = row.cells[j];';
                        highlightRAcolumnGreen += 'cell.style.setProperty("background-color","#7ac10f","important");';
                        highlightRAcolumnGreen += '}';
                    }
                }
             }
           highlightRAcolumnGreen += "</script>";
           highlightLine.setDefaultValue(highlightRAcolumnGreen); //set default value
           }
        } catch (err) {
            nlapiLogExecution("debug", "Error Occur during highlight RA Line is : ", err.message);
        }
    }