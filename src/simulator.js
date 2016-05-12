(function() {
		
    var $elPrice = $('.price');
    var stock = {
        price: 75.00,
        inc: .01,
        ranNum : 0
    }

    setInterval(function() {
        
        stock.ranNum = Math.random();
        var inc = stock.ranNum > .50 ? .01 : -.01;
        stock.price = Number(stock.price) + Number(inc);
         
        // $elPrice.text(stock.price.toFixed(2));
    }, 500);

})();