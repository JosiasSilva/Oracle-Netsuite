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
              if(expectedRTDate){
                var ss = expectedRTDate.split('/');
                var mm = ss[0];
                var dd = ss[1];
                var yy = ss[2];
                if (dd < 10) {
                    var dd1 = '0' + dd;
                    var diamnondRD = mm + '/' + dd1 + '/' + yy;
                } else {
                    var diamnondRD = mm + '/' + dd + '/' + yy;
                }
              }
                var businessDay = date_obj[4].split('/');
                var bdmm = businessDay[0];
                var bddd = businessDay[1];
                var bdyy = businessDay[2];
                if (bddd < 10) {
                    var bddd1 = '0' + bddd;
                    var dateObj = bdmm + '/' + bddd1 + '/' + bdyy;
                } else {
                    var dateObj = bdmm + '/' + bddd + '/' + bdyy;
                }
                if (dateObj >= diamnondRD) {
                    highlightRAcolumnGreen += 'var row = items.rows[' + i + '];';
                    highlightRAcolumnGreen += 'for ( var j = 0; j < row.cells.length; j++ ) {';
                    highlightRAcolumnGreen += 'var cell = row.cells[j];';
                    highlightRAcolumnGreen += 'cell.style.setProperty("background-color","#7ac10f","important");';
                    highlightRAcolumnGreen += '}';
                }



            }
            highlightRAcolumnGreen += "</script>";
            nlapiLogExecution('DEBUG', 'Field Value:', highlightRAcolumnGreen);

            highlightLine.setDefaultValue(highlightRAcolumnGreen); //set default value
        }
    } catch (err) {
        nlapiLogExecution("debug", "Error Occur during highlight RA Line is : ", err.message);
    }
}