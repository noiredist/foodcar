function CheckSessionExpire(){
  alert('IN CSE')
  if( window.sessionStorage.getItem('timestamp') == null ) {
    alert('null')
    $.ajax({
              method: 'post',
              url: '/getts',
              data:{'1':1},
              success:function(response) {
                alert('response.ts')
                  alert(response.time_stamp)
                  window.sessionStorage.setItem('timestamp',response.time_stamp)
              },
              error: function (xhr) {
                  alert('EEEEEEEEEEEError!!');
                  location.reload();      
              }
        });
  }else{
    alert('not null '+window.sessionStorage.getItem('timestamp'));
    var now = new Date();
    //var now = new Date(1523776401*1000)
    var ts_date = new Date(window.sessionStorage.getItem('timestamp')*1000);
    alert(now+'---'+ts_date);

    if (now.getTime() > ts_date.getTime()){
      alert('CCCCCCcart expired');
      $('#SessionExpiredModal').modal('show');
        var cart = {};
        cart.items = [];
        $.ajax({
              method: 'post',
              url: '/getts',
              data:{'1':1},
              success:function(response) {
                  alert(response.time_stamp)
                  window.sessionStorage.setItem('timestamp',response.time_stamp)
                  window.sessionStorage.setItem("foodcar", _toJSONString( cart ) );
                  window.sessionStorage.setItem("food_car_total", "0" );
                  window.sessionStorage.setItem("food_car_total_qty", "0" );
              },
              error: function (xhr) {
                  alert('EEEEEEEEEEEError!!');
                  location.reload();      
              }
        });
    }
  }
}

