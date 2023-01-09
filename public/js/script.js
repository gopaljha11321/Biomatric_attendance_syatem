$(document).ready(function () {
  $("#search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
// var today = new Date();
// var day = today.getDay();
// var date = today.getDate() +'-'+(today.getMonth()+1)+'-'+ today.getFullYear();
// var hours = today.getHours();
// var AmOrPm = hours >= 12 ? 'pm' : 'am';
// hours = (hours % 12) || 12;
// var time = hours + ":" + today.getMinutes() + ":" + today.getSeconds();
// var dateTime = date+'  --  '+time;
// var elem = document.querySelectorAll('.dateAndtime');
// // console.log(elem);
// for(const data of elem){
//     data.innerHTML = dateTime + " " + AmOrPm;