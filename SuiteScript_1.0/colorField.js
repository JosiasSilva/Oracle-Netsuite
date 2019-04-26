/**  
 *      custom id = (id= 2634)
 * 
 *      TYPE ---> User Event
        NAME ---> changeColorField
        ID -----> customscript_changecolorfield
 * @NApiVersion 1.x
 * @NScriptType ClientScript
 */
// In SuiteScript 1.0   

jQuery(ducument).ready(
    function changeColor() {
       f();
    });

function f()
{
    var e = document.getElementById('trandate_fs_lbl_uir_label');
    var p = e.parentElement;
    p.setAttribute('style', 'background:yellow !important');

}