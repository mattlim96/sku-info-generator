// ==================== //
// MODEL LEVEL (Button) //
// ==================== //

function generateModelLevelApi(input,itemInfo=true) {
  var shopId = input[0].split("_")[0]
  var itemId = input[0].split("_")[1]
  if (itemInfo){
    let URL="https://shopee.com.my/api/v2/item/get?itemid={{Item ID}}&shopid={{Shop ID}}";
    URL=URL.replace(/{{Item ID}}/gi,itemId);
    URL=URL.replace(/{{Shop ID}}/gi,shopId);
    return {'url': URL};
  }else{
    let URL='https://shopee.com.my/api/v2/shop/get?is_brief=1&shopid={{Shop ID}}'
    URL=URL.replace(/{{Shop ID}}/gi,shopId);
    return {'url': URL};
  }
}
  
function getModelLevelApiLinks() {
  var pullSheet=SpreadsheetApp.getActive().getSheetByName("MODEL LEVEL");
  var pullData=pullSheet.getRange("U3:U").getDisplayValues().filter(String);
  var itemApiArray = pullData.map(input => { var links = generateModelLevelApi(input); return links });
  var shopApiArray = pullData.map(input => { var links = generateModelLevelApi(input,false); return links });
  return [itemApiArray,shopApiArray]
}

function parseModelLevelJson(jsonResponse1,jsonResponse2) {
  var itemIdArr=[];var modelIdArr=[];var shopIdArr=[];var mainCatArr=[];var subCatArr=[];var l3CatArr=[];
  var itemNameArr=[];var pbdArr=[];var pmbdArr=[];var pmpArr=[];var itemStockArr=[];var modelNameArr=[];
  var mopArr=[];var mcpArr=[];var numSoldArr=[];
  var modelStockArr=[];var modelStatusArr=[];var itemRateArr=[];var shopRateArr=[]

  for (var k = 0; k < jsonResponse1.length; k++){
    try{
      var json = jsonResponse1[k].item
      var jsonShop = jsonResponse2[k].data
      var item_status = json.status
      // console.log(item_status)
      var models = json.models
      if (models.length >= 1){
        for (i in models) {
          itemIdArr.push([json.itemid])
          shopIdArr.push([json.shopid])
          mainCatArr.push([json.categories[0].display_name])
          try {subCatArr.push([json.categories[1].display_name])} catch(e){subCatArr.push([''])}
          try {l3CatArr.push([json.categories[2].display_name])} catch(e){l3CatArr.push([''])}
          itemNameArr.push([json.name])
          pbdArr.push([json.price_before_discount])
          pmbdArr.push([json.price_min_before_discount])
          pmpArr.push([json.price_min])
          itemStockArr.push([json.stock])
          itemRateArr.push([json.item_rating.rating_star])

          modelIdArr.push([json.models[i].modelid]);
          modelNameArr.push([json.models[i].name])
          mopArr.push([json.models[i].price_before_discount])
          mcpArr.push([json.models[i].price])
          modelStockArr.push([json.models[i].stock])
          numSoldArr.push([json.models[i].sold])
          
          if(item_status == 0){
            modelStatusArr.push(['Seller Deleted'])
          } else if(item_status == 1) {
            if(json.models[i].status == 1){
              modelStatusArr.push(['Normal'])
            } else {
              modelStatusArr.push([json.models[i].status])
            }
          } else if(item_status == 2) {
            modelStatusArr.push(['Reviewing'])
          } else if(item_status == 3) {
            modelStatusArr.push(['Banned'])
          } else if(item_status == 4) {
            modelStatusArr.push(['Admin Deleted'])
          } else if(item_status == 5) {
            modelStatusArr.push(['Admin Deleted Confirmed'])
          } else if(item_status == 6) {
            modelStatusArr.push(['Blacklisted'])
          } else if(item_status == 7) {
            modelStatusArr.push(['Auditing'])
          } else if(item_status == 8) {
            modelStatusArr.push(['Unlisted'])
          }

          shopRateArr.push([jsonShop.rating_star])
        }
      } else {
        modelIdArr.push(["None"]);
        modelNameArr.push(["None"])
        mopArr.push(["None"])
        mcpArr.push(["None"])
        modelStockArr.push(["None"])
        modelStatusArr.push(["None"])
        numSoldArr.push(["None"])
      }
    }catch(e){console.log(e)}
  }
  var responseArr = [itemIdArr,modelIdArr,shopIdArr,mainCatArr,subCatArr,l3CatArr,itemNameArr,pbdArr,pmbdArr,pmpArr,
                      itemStockArr,modelNameArr,mopArr,mcpArr,modelStockArr,numSoldArr,modelStatusArr,itemRateArr,shopRateArr]
  return responseArr
}

function modelLevelScrape() {
  var links = getModelLevelApiLinks()
  var scrape = parseModelLevelJson(fetchApi(links[0]),fetchApi(links[1]))
  var pull=SpreadsheetApp.getActive().getSheetByName("MODEL LEVEL");
  pull.getRange('R1').setValue('Data Pull Running...');
  var sheet=SpreadsheetApp.getActive().getSheetByName("raw_data");
  sheet.getRange(2, 2, sheet.getLastRow()-1,sheet.getLastColumn()-1).clearContent()
  var startingColumn = 2
  // console.log('scrape.length')
  // console.log(scrape.length)
  scrape.forEach(response => {
    // console.log(startingColumn)
    // console.log(response)
    sheet.getRange(2, startingColumn, response.length, 1).setValues(response)
    startingColumn += 1 // Populate next column
  })
  pull.getRange('R1').setValue('Data Pull Completed');
}

// ================ //
// HELPER FUNCTIONS //
// ================ //

function fetchApi(linkArray) {
  // console.log(linkArray)
  console.log('--- fetchApi Log Start ---')
  console.log('linkArray length:')
  console.log(linkArray.length)
  var chunk = 50; var toParse = []

  for (var i = 0, j = linkArray.length; i < j; i += chunk) {
    temparray = linkArray.slice(i, i + chunk);
    // console.log('temparray length:')
    // console.log(temparray.length)

    var count = 0; var maxTries = 49; var condition = true
    while (condition == true) {
      try {
        var response = UrlFetchApp.fetchAll(temparray)
        console.log('response length:')
        console.log(response.length)

        toParse.push(response)
        var condition = false

        // console.log('toParse length:')
        // console.log(toParse.length)

      } catch (e) {
        var count = count + 1
        if (count == maxTries) { throw e }
        console.log('Retry count: ' + count.toString())
        console.log('Error when fetching api')
      }
    }
  }

  try {
    console.log('toParse.flat().length')
    console.log(toParse.flat().length)

    var toReturn = toParse.flat().map(resp => {
      // console.log('resp.getContentText()')
      // console.log(resp.getContentText())
      return JSON.parse(resp)
    })

    console.log('toReturn length:')
    console.log(toReturn.length)

  } catch (e) {
    console.log(e)
    console.log('Error when parsing fetched data into JSON at fetchApi()')
  }
  console.log('--- fetchApi Log End ---')
  return toReturn
}