
function CreateCart(){
    var cartName ="foodcar"
    if( window.sessionStorage.getItem(cartName) == null ) {
        //alert("food create car!!");
        var cart = {};
        cart.items = [];
        window.sessionStorage.setItem(cartName, _toJSONString( cart ) );
        window.sessionStorage.setItem("food_car_total", "0" );
        window.sessionStorage.setItem("food_car_total_qty", "0" );

    }
}


function AddToCart() {
    if (parseInt(document.getElementById("item_count").textContent) !=0){
        //alert("AddToCart");
        var rest_id = window.sessionStorage.getItem("restaurant_id");
        var rest_name = window.sessionStorage.getItem("restaurant_name");
        var qty =  parseInt(document.getElementById("item_count").textContent);//_convertString( $form.find( ".qty" ).val() );
        var memo = document.getElementById("name").value;
        var price = parseInt(document.getElementById("dishInfo_price").textContent.replace('$',''));//_convertString( $product.data( "price" ) );
        var name = rest_id+"_"+rest_name+"_"+document.getElementById("dishInfo_name").textContent;
        
        //add by myself
        var cart = _toJSONObject( window.sessionStorage.getItem( "foodcar" ) );
        var items = cart.items;
        //*****

        var add_flag = true;
        if( items.length> 0 ) {
            for( var i = 0; i < items.length; ++i ) {
                var item = items[i];
                var product = item.product; 
                var previous_cart_qty = item.qty;
                var cart_price = item.price;    
                if( product == name ) {
                    var new_qty = qty;
                    name = product;
                    add_flag = false;
                    items.splice( i, 1 );
                    break
                }
            }
        }
        if (add_flag){
            var previous_cart_qty = 0;
            _addToCart({
                product: name,
                price: price,
                qty: qty,
                memo: memo
            });
        }else{
            newItems = items;
            var updatedCart = {};
            updatedCart.items = newItems;
            var cartObj = {
                    product: name,
                    price: price,
                    qty: new_qty,
                    memo: memo
            };
            updatedCart.items.push( cartObj );
            window.sessionStorage.setItem( "foodcar", _toJSONString( updatedCart ) );
        }


        var subTotal = qty * price;
        var total = _convertString( window.sessionStorage.getItem("food_car_total") );
        var sTotal = total + subTotal - previous_cart_qty*price;
        var pqty_total = _convertString( window.sessionStorage.getItem("food_car_total_qty") );
        var qtyTotal = pqty_total + qty - previous_cart_qty;
        window.sessionStorage.setItem("food_car_total", sTotal );
        window.sessionStorage.setItem("food_car_total_qty", qtyTotal );



        var token =_getToken();
        var id = window.sessionStorage.getItem("restaurant_id");
        window.location.assign("/menu?id="+id+"&token="+token);
    }
}  


function deleteProduct(delete_item) {
    //alert(delete_item.getAttribute('value'));
    var cart = _toJSONObject( window.sessionStorage.getItem( "foodcar" ) );
    var items = cart.items;
    if( items.length >0) {
        //e.preventDefault();        
        var productName = delete_item.getAttribute('value');
        var newItems = [];
        for( var i = 0; i < items.length; ++i ) {
            var item = items[i];
            var product = item.product; 
            if( product == productName ) {
                items.splice( i, 1 );
            }
        }

        newItems = items;
        var updatedCart = {};
        updatedCart.items = newItems;
        var updatedTotal = 0;
        var totalQty = 0;
        if( newItems.length == 0 ) {
            updatedTotal = 0;
            totalQty = 0;
        } else {
            for( var j = 0; j < newItems.length; ++j ) {
                var prod = newItems[j];
                var sub = prod.price * prod.qty;
                updatedTotal += sub;
                totalQty += prod.qty;
            }
        }


        window.sessionStorage.setItem( "food_car_total", _convertNumber( updatedTotal ) );
        window.sessionStorage.setItem( "foodcar", _toJSONString( updatedCart ) );
        window.sessionStorage.setItem("food_car_total_qty", totalQty );
        //location.reload();
        location.assign("/cart?token=123456");
        //document.getElementById("total_price2_id").textContent = "$ "+ window.sessionStorage.getItem("food_car_total");
        //self.$subTotal[0].innerHTML = self.currency + " " + self.storage.getItem( self.total );
    }
    
}


function emptyCart() {
    var cart = _toJSONObject(window.sessionStorage.getItem( "foodcar" )) ;
    if( cart ) {
        _emptyCart();
    }
}

function showCart() {
    var cart = _toJSONObject(window.sessionStorage.getItem( "foodcar" )) ;
    var items = cart.items;
    var total_qty = 0;
    var total_price = 0;
    for( var j = 0; j < items.length; ++j ) {
        total_qty += items[j].qty;
        total_price += (items[j].qty*items[j].price);
    }
    if(total_qty==0){
        document.getElementById("showcart").style.display = 'none';
    }
    document.getElementById("menu_total_price").textContent = "$ "+ total_price;
    document.getElementById("menu_total_qty").textContent = "小計 "+ total_qty + " 份餐點";
}


function showDish() {
    var cart = _toJSONObject(window.sessionStorage.getItem( "foodcar" )) ;
    var items = cart.items;
    for( var j = 0; j < items.length; ++j ) {
        var product_item = items[j].product.split("_");
        var show_dish = product_item[0]+"_"+product_item[2];
        if(product_item[0]==window.sessionStorage.getItem( "restaurant_id" )){
            document.getElementById(show_dish).textContent = items[j].qty;
            document.getElementById(show_dish).style="visibility:block"
        }
    }
}

function displayCart() {
    var cart = _toJSONObject( window.sessionStorage.getItem( "foodcar" ) );
    if (cart){
        var items = cart.items;
        //var $CartBody = $("body").find(".cart_list");
        //var $ListBody = $CartBody.find(".container");
        var $ListBody = $("body").find(".shop_items");
    
            //整理資料呈現
            restaurant_menus = _generateRestaurantArray(items);
    
            //display and generate html
            var total = 0;
            for (var key in restaurant_menus){
                var dish_html ="";
                var rest_html = '<div class="restInfo"><div id="restInfo_name">'+key+'</div></div><div class="cart_list"><div class="container">';
                for(var i = 0; i < restaurant_menus[key].length; i++){
                    t_items = restaurant_menus[key][i];
                    var product = t_items.product.split("_")[2];
                    var price = t_items.price;
                    var qty = t_items.qty;
                    var stotal = qty*price;
                    var memos = t_items.memo;
                    if(memos!=""){
                        var memo_html = "";
                        var result = memos.split("; ");
                        for( var i = 0; i < result.length-1; ++i ) {
                            memo_html += "<div class='dish_require' >"+result[i]+"</div>";
                        }
                    }
                    total += stotal;
                    if(memos!=""){
                        html = '<div class="row dish"><div class="dish_info col-12"><div class="dish_name" value='+t_items.product+'>'+ product +'</div><div class="dish_money" >$'+ price+'</div>'+memo_html+'<table class="dish_quantity"><tr><td id="quantity1">X '+ qty +'</td><td id="quantity2">$ '+stotal+'</td></tr></table></div>';
                    }else{
                        html = '<div class="row dish"><div class="dish_info col-12"><div class="dish_name" value='+t_items.product+'>'+ product +'</div><div class="dish_money" >$'+ price+'</div><table class="dish_quantity"><tr><td id="quantity1">X '+ qty +'</td><td id="quantity2">$ '+stotal+'</td></tr></table></div>';
                    }
                    delete_html = '<div class="col-0" value="'+t_items.product+ '"onclick="deleteProduct(this)"><div class="dish_delete"><div class="delete_icon" style="background-image: url(img/trash-2.png);"></div></div></div></div>';
                    dish_html += html+delete_html;
                }
                tmep = rest_html + dish_html +"</div></div>";
                $ListBody.append(tmep);
            }
            window.sessionStorage.setItem( "food_car_total", _convertNumber(total) );
            document.getElementById("selectstation").textContent = window.sessionStorage.getItem("station");
        document.getElementById("total_price2_id").textContent = "$ "+ window.sessionStorage.getItem("food_car_total");
    }else{


    }
    
}

function displayPayment(from_where,content) {
    if (from_where=="from_cart"){
        var cart = _toJSONObject( window.sessionStorage.getItem( "foodcar" ) );
    }else{
        var cart = _toJSONObject( content );
    }
    if (cart){
        var $ListBody = $("body").find(".shop_items");
        var total = 0;
        if (from_where=="from_cart"){
            //alert("from cart");
            var items = cart.items;
            //整理資料呈現
            restaurant_menus = _generateRestaurantArray(items);
        }else{
            //alert('from history');
            restaurant_menus = cart;
        }
        //display and generate html
        for (var key in restaurant_menus){
            var html ="";
            var rest_name = (from_where=="from_cart") ? key : key.split("_")[1];
            var rest_html = '<ul class="dish_list" style="list-style-type:none;"><li class="list_restname">'+ rest_name +'</li>';
            var rest_total = 0;
            for(var i = 0; i < restaurant_menus[key].length; i++){
                t_items = restaurant_menus[key][i];
                var product = (from_where=="from_cart") ? t_items.product.split("_")[2] : t_items.product;
                var price = t_items.price;
                var qty = t_items.qty;
                var stotal = qty*price;
                rest_total += stotal;
                html +=' <li class="list"><div class="list_name">'+product+'</div><div class="list_num"> X '+ qty +'</div><div class="price">$ '+ stotal +'</div></li>';
            }
            total += rest_total;
            var tail_html = '<li class="list">小計<div class="calc_price">'+rest_total+'</div></li><li class="list"><S>服務費 5%</S><div class="discount">免服務費</div><div class="price">$ 0</div></li></ul>'
            temp = rest_html+html+tail_html;
            $ListBody.append(temp);
        }

        window.sessionStorage.setItem( "food_car_total", _convertNumber(total) );
        document.getElementById("selectstation").textContent = window.sessionStorage.getItem("station");
        document.getElementById("totalprice_money").textContent = "$ "+ window.sessionStorage.getItem("food_car_total");
    }else{
        //$('paybutton').click(function(){return false;});
        //$('#paybutton').off('click');
        document.getElementById("pay_buttom").textContent = "訂單已成立"
    }
}


function displayOrder(content,station) {
    var cart = _toJSONObject( content );
    var $ListBody = $("body").find(".shop_items");
    //display and generate html
    var total = 0;
    for (var key in cart){
        var html ="";
        var rest_html = '<ul class="dish_list" style="list-style-type:none;"><li class="list_restname" style="font-size: 17px;">'+key.split("_")[1]+'</li>';
        var rest_total = 0;
        for(var i = 0; i < cart[key].length; i++){
            t_items = cart[key][i];
            var product = t_items.product;
            var price = t_items.price;
            var qty = t_items.qty;
            var stotal = qty*price;
            rest_total += stotal;

            var memos = t_items.memo;
            if(memos!=""){
                var memo_html = "";
                var result = memos.split("; ");
                for( var s = 0; s < result.length-1; ++s ) {
                    memo_html += "<div class='dish_require' style='font-size: 14px; color:#FF0000;height:20px;'>"+result[s]+"</div>";
                }
            }
            html +='<li class="list"><div class="list_name" style="font-size: 16px;">'+product+'</div><div class="list_num" style="font-size: 16px;"> X '+qty+'</div><div class="price" style="font-size: 16px;">$ '+price+'</div></li>';
            if(memos!=""){
                html +='<li class="list">'+memo_html+"<div style='height:10px;'></div></li>"
            }
        }
        total += rest_total;
        var tail_html = '<li class="list" style="font-size: 16px;">小計</div><div class="calc_price" style="font-size: 16px;">$ '+rest_total+'</div></li><li class="list"><S>服務費</S><div class="discount">(免服務費)</div><div class="price">$ 0</div></li>'
        temp = rest_html+html+tail_html;
        $ListBody.append(temp);
    }
    document.getElementById("selectstation").textContent = station;
    document.getElementById("totalprice_money").textContent = "$ "+ total;
}


function displayMemo_Number(dish_name,options) {
    var cart = _toJSONObject(window.sessionStorage.getItem( "foodcar" )) ;
    var items = cart.items;
    for( var j = 0; j < items.length; ++j ) {
        var product_item = items[j].product.split("_");
        var show_dish = product_item[0]+"_"+product_item[2];
        if(product_item[0]==window.sessionStorage.getItem( "restaurant_id" ) && product_item[2]==dish_name){
            if(!options){
                document.getElementById('name').value = items[j].memo;
                document.getElementById('item_count_nooption').textContent = items[j].qty;
                document.getElementById('item_count').textContent = items[j].qty;
            }
            else{
                memos = items[j].memo.split("; ");
                var temp = 0;
                for( var i = 0; i < memos.length-1; ++i ) {
                    var option_name = memos[i].split("*")[0];
                    var option_qty = memos[i].split("*")[1];
                    var ele_id = "item_count_"+option_name;
                    document.getElementById(ele_id).textContent = option_qty;
                    temp += Number(option_qty);
                    //alert(memos[i]);
                    //alert(temp);
                }
                document.getElementById('item_count').textContent = temp;
                document.getElementById('options_count_total').textContent = "總計 "+temp+ " 件商品";
            }
        }
    }
}



function _addToCart( values ) {
    var cart = window.sessionStorage.getItem("foodcar");
    var cartObject = _toJSONObject(cart);
    var cartCopy = cartObject;
    var items = cartCopy.items;
        items.push( values );
    window.sessionStorage.setItem( "foodcar", _toJSONString( cartCopy ) );
}


function _generateRestaurantArray(items){
    restaurant_menus = new Array();
    for( var i = 0; i < items.length; ++i ) {
        var item = items[i];
        var product = item.product;
        var price = item.price;
        var qty = item.qty;
        var restaurant = product.split("_")[1];

        if(restaurant_menus[restaurant] === undefined ){
            restaurant_menus[restaurant] = [item]
        }else{
            restaurant_menus[restaurant].push(item);
        }
    }
    return restaurant_menus;
}


function _emptyCart() {
    window.sessionStorage.clear();
}

function _toJSONString( obj ) {
    var str = JSON.stringify( obj );
    return str;
}

function _toJSONObject( str ) {
            var obj = JSON.parse( str );
            return obj;
}

function _convertNumber( n ) {
            var str = n.toString();
            return str;
}

function _convertString( numStr ) {
            var num;
            if( /^[-+]?[0-9]+\.[0-9]+$/.test( numStr ) ) {
                num = parseFloat( numStr );
            } else if( /^\d+$/.test( numStr ) ) {
                num = parseInt( numStr, 10 );
            } else {
                num = Number( numStr );
            }
            
            if( !isNaN( num ) ) {
                return num;
            } else {
                console.warn( numStr + " cannot be converted into a number" );
                return false;
            }
}

function _getToken(){
    var strUrl = location.search;
    var getPara, ParaVal;
    var aryPara = [];
    if (strUrl.indexOf("?") != -1) {
        var getSearch = strUrl.split("?");
        getPara = getSearch[1].split("&");
        for (i = 0; i < getPara.length; i++) {
            ParaVal = getPara[i].split("=");
            aryPara.push(ParaVal[0]);
            aryPara[ParaVal[0]] = ParaVal[1];
        }
    }
    var token = aryPara['token'];
    return token;
}



