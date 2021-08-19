// ====================== //
// PRODUCT LEVEL (Button) //
// ====================== //

function generateProductLevelApi(input,type) {
    var shopId = input[0].split("_")[0]
    var itemId = input[0].split("_")[1]
    if (type == 'item'){
      let URL="https://shopee.com.my/api/v2/item/get?itemid={{Item ID}}&shopid={{Shop ID}}";
      URL=URL.replace(/{{Item ID}}/gi,itemId);
      URL=URL.replace(/{{Shop ID}}/gi,shopId);
      return {'url': URL};
    }else if (type == 'shop'){
      let URL='https://shopee.com.my/api/v2/shop/get?is_brief=1&shopid={{Shop ID}}'
      URL=URL.replace(/{{Shop ID}}/gi,shopId);
      return {'url': URL};
    }else if (type == 'shipping'){
      let URL='https://shopee.com.my/api/v0/shop/{{Shop ID}}/item/{{Item ID}}/shipping_info_to_address/?city=KL%20City&district=&state=Kuala%20Lumpur'
      URL=URL.replace(/{{Item ID}}/gi,itemId);
      URL=URL.replace(/{{Shop ID}}/gi,shopId);
      return {'url': URL};
    }
  }
  
  function getProductLevelApiLinks() {
    var pullSheet=SpreadsheetApp.getActive().getSheetByName("PRODUCT LEVEL (Button)");
    var pullData=pullSheet.getRange("AJ2:AJ").getDisplayValues().filter(String);
    var itemApiArray = pullData.map(input => { var links = generateProductLevelApi(input,'item'); return links });
    var shopApiArray = pullData.map(input => { var links = generateProductLevelApi(input,'shop'); return links });
    var shippingApiArray = pullData.map(input => { var links = generateProductLevelApi(input,'shipping'); return links });
    // console.log([itemApiArray,shopApiArray,shippingApiArray])
    return [itemApiArray,shopApiArray,shippingApiArray]
  }
  
  function parseProductLevelJson(itemJson,shopJson,shippingJson) {
    // console.log(itemJson.length)
    // console.log(shopJson.length)
    // console.log(shippingJson.length)
  
    var mallArr=[];var cbArr=[];var mainCatArr=[];var subCatArr=[];var l3CatArr=[];
    var usernameArr=[];var shopIdArr=[];var itemIdArr=[]
    var itemNameArr=[];var itemStockArr=[];var shopRateArr=[];var oriPriceArr=[];var currentPriceArr=[]
    var itemRateArr=[];var image1Arr=[];var image2Arr=[];var image3Arr=[];
    var minOrderTotalArr=[];var shopPromoOnlyMinCostArr=[]
    var shopeeMinCostArr=[];var numSoldArr=[];var itemStatusArr=[];var addOnDealArr=[];var bundleDealArr=[]
  
    for (var k = 0; k < itemJson.length; k++){
      try{
        var itemData = itemJson[k].item
        var shopData = shopJson[k].data
        var shippingData = shippingJson[k]
  
        // Item Info
        itemIdArr.push([itemData.itemid])
        shopIdArr.push([itemData.shopid])
        mainCatArr.push([itemData.categories[0].display_name])
        try {subCatArr.push([itemData.categories[1].display_name])} catch(e){subCatArr.push([''])}
        try {l3CatArr.push([itemData.categories[2].display_name])} catch(e){l3CatArr.push([''])}
        itemNameArr.push([itemData.name])
        itemStockArr.push([itemData.stock])
        itemRateArr.push([Number(Math.round(itemData.item_rating.rating_star+"e1")+"e-1")])
        image1Arr.push([itemData.images[0]])
        image2Arr.push([itemData.images[1]])
        image3Arr.push([itemData.images[2]])
        currentPriceArr.push([itemData.price_min/100000])
        if(itemData.price_min_before_discount < 0){oriPriceArr.push([itemData.price_min/100000])} else {oriPriceArr.push([itemData.price_min_before_discount/100000])}
        if(itemData.add_on_deal_info == null){addOnDealArr.push(['None'])}else{addOnDealArr.push([itemData.add_on_deal_info.add_on_deal_label])}
        if(itemData.bundle_deal_info == null){bundleDealArr.push(['None'])}else{bundleDealArr.push([itemData.bundle_deal_info.bundle_deal_label])}
  
        // Shop Info
        if(shopData.is_official_shop == true){mallArr.push(["Yes"])} else {mallArr.push(["No"])}
        if(shopData.cb_option == 1){cbArr.push(["Yes"])} else {cbArr.push(["No"])}
        shopRateArr.push([Number(Math.round(shopData.rating_star+"e1")+"e-1")])
        usernameArr.push([shopData.account.username])
        
        // Shipping Info
        minOrderTotalArr.push([shippingData.promotion_rules[0].extra_data.min_order_total])
        try{
          shopPromoOnlyMinCost = shippingData['logistic_service_types']['standard_delivery']['consolidated_logistic_info']['shop_promo_only_min_cost']
          shopeeMinCost = shippingData['logistic_service_types']['standard_delivery']['consolidated_logistic_info']['shopee_min_cost']
        }catch(e){
          try{
            shopPromoOnlyMinCost = shippingData['logistic_service_types']['overseas_delivery']['consolidated_logistic_info']['shop_promo_only_min_cost']
            shopeeMinCost = shippingData['logistic_service_types']['overseas_delivery']['consolidated_logistic_info']['shopee_min_cost']
          }catch(e){
            try{
              shopPromoOnlyMinCost = shippingData['logistic_service_types']['others']['consolidated_logistic_info']['shop_promo_only_min_cost']
              shopeeMinCost = shippingData['logistic_service_types']['others']['consolidated_logistic_info']['shopee_min_cost']
            }catch(e){
              shopPromoOnlyMinCost = ""
              shopeeMinCost = ""
            }
          }
        }
        shopPromoOnlyMinCostArr.push([shopPromoOnlyMinCost])
        shopeeMinCostArr.push([shopeeMinCost])
        numSoldArr.push([itemData.historical_sold])
  
        var itemStatus = itemData.status
        if(itemStatus == 1){
          itemStatusPush = 'Normal'
        }else if(itemStatus == 2){
          itemStatusPush = 'Reviewing'
        }else if(itemStatus == 3){
          itemStatusPush = 'Banned'        
        }else if(itemStatus == 4){
          itemStatusPush = 'Admin Deleted'        
        }else if(itemStatus == 5){
          itemStatusPush = 'Admin Deleted Confirmed'        
        }else if(itemStatus == 6){
          itemStatusPush = 'Blacklisted'        
        }else if(itemStatus == 7){
          itemStatusPush = 'Auditing'        
        }else if(itemStatus == 8){
          itemStatusPush = 'Unlisted'        
        }
        itemStatusArr.push([itemStatusPush])
  
      }catch(e){console.log(e)}
    }
    var responseArr = [mallArr,cbArr,mainCatArr,subCatArr,l3CatArr,usernameArr,shopIdArr,itemIdArr,itemNameArr,oriPriceArr,currentPriceArr,itemStockArr,shopRateArr,itemRateArr,numSoldArr,itemStatusArr,addOnDealArr,bundleDealArr,image1Arr,image2Arr,image3Arr,minOrderTotalArr,shopPromoOnlyMinCostArr,shopeeMinCostArr]
    // console.log(responseArr)
    return responseArr
  }
  
  function productLevelScrape() {
    var links = getProductLevelApiLinks()
    var scrape = parseProductLevelJson(fetchApi(links[0]),fetchApi(links[1]),fetchApi(links[2]))
    var sheet=SpreadsheetApp.getActive().getSheetByName("PRODUCT LEVEL (Button)");
    sheet.getRange(2, 1, sheet.getMaxRows()-1,sheet.getLastColumn()).clearContent()
  
    var startingColumn = 2
    scrape.forEach(response => {
      // console.log(startingColumn)
      if(startingColumn == 12 || startingColumn == 16) {
        sheet.getRange(2, startingColumn, response.length, 1).setValues(response)
        startingColumn += 2 // Populate next column
      } else if(startingColumn == 21){
        sheet.getRange(2, startingColumn, response.length, 1).setValues(response)
        startingColumn += 7
      } else {
        sheet.getRange(2, startingColumn, response.length, 1).setValues(response)
        startingColumn += 1
      }
    })
  }