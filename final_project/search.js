function searchGraphs(data){

 var dataset = data;
var newData = [];
dataset.forEach(function(d,i) {
    d[i] = +d[i];


});

    for(var i=0; i< dataset.length; i++){
         var arr = {};
    arr["Shrt Desc"] = dataset[i]["Shrt Desc"];
    arr["group"] = dataset[i]["group"];
    arr["Protein (g)"] = dataset[i]["Protein (g)"];
    arr["Lipid Tot (g)"] = dataset[i]["Lipid Tot (g)"];

    arr["Fiber TD (g)"] = dataset[i]["Fiber TD (g)"];

    arr["Sugar Tot (g)"] = dataset[i]["Sugar Tot (g)"];
    arr["Calcium (mg)"] = dataset[i]["Calcium (mg)"];
    arr["Iron (mg)"] = dataset[i]["Iron (mg)"];
    arr["Sodium (mg)"] = dataset[i]["Sodium (mg)"];
    arr["Vit C (mg)"] = dataset[i]["Vit C (mg)"];

    newData.push(arr);
    }



/*The parallel coordinates graph was based off of this example http://bl.ocks.org/eesur/1a2514440351ec22f176*/

var pc0;
var colorgen = d3.scale.ordinal()
    .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
            "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
            "#cab2d6","#6a3d9a","#ffff99","#b15928"]);

  var color = function(d,i) { console.log(newData[0]["group"]);return colorgen(newData[i]['group']); };

pc0 = d3.parcoords()("#parallel")
  .data(newData)

    .hideAxis(["Shrt Desc"])
    .color(color)
    .composite("darker")
    .alpha(0.25)
    .mode("queue")
     .margin({ top: 24, left: 250, bottom: 5, right: 0 })
	.render()
	.brushMode("1D-axes")
	.interactive();



  pc0.svg.selectAll("text")
    .style("font", "10px sans-serif");

// create data table, row hover highlighting*/
 var grid = d3.divgrid();
  d3.select("#grid")
    .datum(newData.slice(0,10))
    .call(grid)
    .selectAll(".row.table")
    .on({
      "mouseover": function(d) {pc0.highlight([d]) },
      "mouseout": pc0.unhighlight

    });

  // update data table on brush event
  pc0.on("brush", function(d) {
      d3.select("#grid")
          .datum(d.slice(0, 10))
          .call(grid)
          .selectAll(".row.table")
          .on({
              "mouseover": function (d) {pc0.highlight([d]);},
             "mouseout": pc0.unhighlight});
  });
    var food = [];
     $("#searchInput").on("contentChanged",function () {
         var val = $("#searchInput").val();
         console.log(val);
          $.ajax({
            url:"https://api.mongolab.com/api/1/databases/cs590v/collections/nutrition2?q={\"NDB No\":" + val +"}&l=10&apiKey=cabg87YgyofisIfvY2Tz2vkRIXtghkOb",
            type: "GET",
            contentType: "application/json",

            success: function(result) {

            var arr = {};
            arr["Shrt Desc"] = result[0]["Shrt Desc"];
            arr["group"] = result[0]["group"];
            arr["Protein (g)"] = result[0]["Protein (g)"];
            arr["Lipid Tot (g)"] = result[0]["Lipid Tot (g)"];

            arr["Fiber TD (g)"] = result[0]["Fiber TD (g)"];

            arr["Sugar Tot (g)"] = result[0]["Sugar Tot (g)"];
            arr["Calcium (mg)"] = result[0]["Calcium (mg)"];
            arr["Iron (mg)"] = result[0]["Iron (mg)"];
            arr["Sodium (mg)"] = result[0]["Sodium (mg)"];
            arr["Vit C (mg)"] = result[0]["Vit C (mg)"];



               console.log(arr);
                 pc0.highlight([arr,arr]);
         d3.select("#grid")
          .datum([arr,arr].slice(1))
          .call(grid)
          .selectAll(".row.table")

        },
        error: function() { console.log("failed"); }
         });



    });



}


