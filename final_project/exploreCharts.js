function makeGraphs(data) {
    var dataset = data;
    dataset.forEach(function(d,i) {
        d[i] = +d[i];
    });

    var ndx = crossfilter(dataset);


    /****************-- Scatter Plot -- ************************/

     // Define the charts globally so that they don't get redefined across multiple calls to draw_graphs()
    var scatterplot = dc.scatterPlot("#scatter");
    var  rowChart    = dc.rowChart("#bar1");
    var attr1 = $('#dropdown1').val();
    var attr2 = $('#dropdown2').val();
    // Functions to access the quantities needed to update the K-Means scatterplot
    function kmAccessor(d){return [d[attr1], d[attr2], d.cluster, d.recId];};
    function clusterAccessor(d){return d.cluster};
    function recIdAccessor(d){return [d.recId];};
    function attrAccessor(d){return [d[attr1],d[attr2]];};
    function attr1Accessor(d){return d[attr1]};
    function attr2Accessor(d){return d[attr2]};


    // Function that acts as a callback for checkboxes and is used to initialize the page
    function draw_graphs(redrawAll){


        dataset.forEach(function(d,i) {
          d[attr1]=+d[attr1];
          d[attr2]=+d[attr2];
          /* Here we're creating a placeholder for the PCA coordinate values. We also need to create a record
             ID so that when we have the filtered data, we can know which records to update in the full dataset.
             Later, we'll have a callback that will change the values of c1 and c2, replacing them with the
             actual PCA components. */
          d.cluster=0; //assign all points to cluster 0 for now
          d.recId=i;
        });

        // Create a crossfilter index
        var ndx = crossfilter(dataset);

        /* Create a dimension that groups by (c1,c2,recID), which ensures that every record has a unique group.
           Then, we create the scatterplot, which we'll modify in the callback functions. */
        var kmDim=ndx.dimension(kmAccessor),
            kmGroup=kmDim.group();
        scatterplot
          .dimension(kmDim).group(kmGroup)
          .x(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr1Accessor)]))
          .y(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr2Accessor)]))
           .title(function(d,i) {return (d.key[2] + "\n" + $('#dropdown1').val() + ": " + d.key[0]) + "\n" + $('#dropdown2').val() + ": " + d.key[1] })
          .xAxisLabel(attr1)
          .yAxisLabel(attr2)
          .width($('#scatter').width()).height($('#scatter').height())
          .margins({
            top: 10,
            right: 30,
            bottom: 60,
            left: 70
          })
          .clipPadding(10)
          .excludedOpacity(0.5)
          .brushOn(false)
          .colorAccessor(function(d){return d.key[2];});

          $("#dropdown1").on("contentChanged", function(){
              var attr1 = $('#dropdown1').val();
                var attr2 = $('#dropdown2').val();
               function kmAccessor(d){return [d[attr1], d[attr2], d.cluster, d.recId];};
                function clusterAccessor(d){return d.cluster};
                function recIdAccessor(d){return [d.recId];};
                function attrAccessor(d){return [d[attr1],d[attr2]];};
                function attr1Accessor(d){return d[attr1]};
                function attr2Accessor(d){return d[attr2]};
              scatterplot
              .dimension(kmDim).group(kmGroup)
          .x(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr1Accessor)]))
          .y(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr2Accessor)]))
          .xAxisLabel(attr1)
          .yAxisLabel(attr2)
          .width($('#scatter').width()).height($('#scatter').height())
          .clipPadding(10)
          .excludedOpacity(0.5)
          .brushOn(false)
          .colorAccessor(function(d){return d.key[2];});
            scatterplot.render();
            });

         $("#dropdown2").on("contentChanged", function(){
              var attr1 = $('#dropdown1').val();
                var attr2 = $('#dropdown2').val();
               function kmAccessor(d){return [d[attr1], d[attr2], d.cluster, d.recId];};
                function clusterAccessor(d){return d.cluster};
                function recIdAccessor(d){return [d.recId];};
                function attrAccessor(d){return [d[attr1],d[attr2]];};
                function attr1Accessor(d){return d[attr1]};
                function attr2Accessor(d){return d[attr2]};
              scatterplot
              .dimension(kmDim).group(kmGroup)
          .x(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr1Accessor)]))
          .y(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr2Accessor)]))
          .xAxisLabel(attr1)
          .yAxisLabel(attr2)
          .width($('#scatter').width()).height($('#scatter').height())
          .clipPadding(10)
          .excludedOpacity(0.5)
          .brushOn(false)
          .colorAccessor(function(d){return d.key[2];});
            scatterplot.render();
            });

        /* This is the callback to recompute the PCA in response to changes in the filter/checkboxes. Every chart
           that can update the crossfilter must either A) specify this function as the callback for the "filtered"
           event, or B) use a callback function that subsequently calls this function. Otherwise, the PCA will not
           be recomputed on the newly filtered data. */
        function update_clusters() {
          /* Retrieve the number of clusters to use. */

            var k = +$("#dropdown3").val();
          console.log(k);

          /* Get the data that satisfies the current filters. Then, create a K-Means object and use it to assign
             cluster labels to the records.  */
          var filtData   = kmDim.top(Infinity),
              filtRecIDs = filtData.map(recIdAccessor),
              kmData     = filtData.map(kmAccessor),
              kmResult   = new ML.Clust.kmeans(kmData, k, {}),
              kmClusters = kmResult.clusters;
          /* For each record in the filtered set, update its PCA coordinates in the dataset. */
          for(var i=0; i<kmClusters.length; i++){
            var id = filtRecIDs[i];
            dataset[id].cluster = kmClusters[i];
          }
          /* Redefine the pca dimension and group to incorporate the newly computed values. */
          kmDim   = ndx.dimension(kmAccessor);
          kmGroup = kmDim.group();
          /* Finally, replace the scatterplot's dimension and group with the new ones. */
          scatterplot
            .dimension(kmDim).group(kmGroup)
            .x(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr1Accessor)]))
            .y(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr2Accessor)]))
            .data(filtData.map(function(d){return {key:kmAccessor(d), value:1};}))
            .colorAccessor(function(d){return d.key[2];})

             $("#dropdown3").on("contentChanged", function(){
                   var k = +$("#dropdown3").val();

          var filtData   = kmDim.top(Infinity),
              filtRecIDs = filtData.map(recIdAccessor)
              kmData     = filtData.map(kmAccessor),
              kmResult   = new ML.Clust.kmeans(kmData, k, {}),
              kmClusters = kmResult.clusters;

          for(var i=0; i<kmClusters.length; i++){
            var id = filtRecIDs[i];
            dataset[id].cluster = kmClusters[i];
          }

          kmDim   = ndx.dimension(kmAccessor);
          kmGroup = kmDim.group();

          scatterplot
            .dimension(kmDim).group(kmGroup)
            .x(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr1Accessor)]))
            .y(d3.scale.linear().domain([0, 1.1*d3.max(dataset,attr2Accessor)]))
            .data(filtData.map(function(d){return {key:kmAccessor(d), value:1};}))
            .colorAccessor(function(d){return d.key[2];});
             });
        };

        // Call the update function to get the correct PCA coordinates
        update_clusters();
        scatterplot.on("filtered", update_clusters);
         var chart1 = dc.rowChart("#bar1");

    var rowDim = ndx.dimension(function(d){return d["group"]});
    var row = rowDim.group().reduce(reduceAddAvg('Protein (g)'), reduceRemoveAvg('Protein (g)'), reduceInitAvg);
    //var bar = barDim.group().reduceSum(function(d) {return d['Protein (g)']});;
    var w1 = $('.right-col').width();
    var h1 = $('.right-col').height();


    rowChart
        .width(w1)
        .height(h1)
        .margins({
            top: 10,
            right: 30,
            bottom: 30,
            left: 10
          })
         .title(function(d) {
              return "Group "+ (d.key) + "\nAverage Protein: "+ ( d.value["avg"]);})
        .dimension(rowDim)
        .group(row)
        .elasticX(true)
        .controlsUseVisibility(true)

        .valueAccessor(function (p){return p.value.avg;})
        .on("filtered", update_clusters);  // IMPORTANT: Make sure update_pca gets called on filter updates ***


        /* Redraw the whole screen if needed, otherwise just update the PCA scatterplot using its internal render
           function (which causes it to update smoothly when checkboxes are toggled). */
        if(redrawAll){
          dc.renderAll();
        }
        scatterplot.redrawGroup();

    }
    draw_graphs(true);



    /************************************************************/
};

function reduceAddAvg(attr) {
  return function(p,v) {
    ++p.count
    p.sum += v[attr];
    p.avg = p.sum/p.count;
    //console.log(p);
    return p;
  };
}
function reduceRemoveAvg(attr) {
  return function(p,v) {
    --p.count
    p.sum -= v[attr];
    p.avg = p.sum/p.count;
    return p;
  };
}
function reduceInitAvg() {
  return {count:0, sum:0, avg:0};
}
