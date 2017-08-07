$('.pushpin-demo-nav').each(function() {
    var $this = $(this);
    var $target = $('#' + $(this).attr('data-target'));
    $this.pushpin({
      top: $target.offset().top,
      bottom: $target.offset().top + $target.outerHeight() - $this.height()
    });
  });


$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );
$( document ).ready(function() {
    console.log( "ready!" );
    $.ajax({
        url: "https://api.mongolab.com/api/1/databases/cs590v/collections/nutrition2?l=10000&apiKey=####",
        type: "GET",
        contentType: "application/json",
        success: function(data,i) {
            searchGraphs(data);
            setSearch(data);
            setSelect(data);
            makeGraphs(data);
            searchGraphs(data);


        },
        error: function() { alert('Failed!'); }
    });

});



function setSelect(data) {
    var keys;
    data.forEach(function (d) {
        keys = Object.keys(d).slice(3,d.length);
        $("#dropdown1").val("Energ Kcal");
        $("#dropdown2").val("Protein (g)");
        $("#dropdown3").val(2);
    });
    var dropdown1 = document.getElementById("dropdown1");
    var dropdown2 = document.getElementById("dropdown2");

    for (i = 1; i <= keys.length -2; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(keys[i]));

        dropdown1.appendChild(li);
    }
    for (i = 1; i <= keys.length -2; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(keys[i]));
        dropdown2.appendChild(li);

    }
    for (i = 1; i <= 10; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(i));
        dropdown3.appendChild(li);

    }
};

var drop1 = document.getElementById('dropdown1');
drop1.onclick = function(event) {
    var target = event.target;
    //alert(event.target.innerHTML);
    $("#dropdown1").val(event.target.innerHTML);
    $("#dropdown1").trigger("contentChanged");
    console.log($("#dropdown1").val());
};

var drop2 = document.getElementById('dropdown2');
drop2.onclick = function(event) {
    var target = event.target;
    //alert(event.target.innerHTML);
    $("#dropdown2").val(event.target.innerHTML);
    $("#dropdown2").trigger("contentChanged");
    console.log($("#dropdown2").val());
};

var drop3 = document.getElementById('dropdown3');
drop3.onclick = function(event) {
    var target = event.target;
    //alert(event.target.innerHTML);
    $("#dropdown3").val(event.target.innerHTML);
    $("#dropdown3").trigger("contentChanged");
    console.log($("#dropdown3").val());
};


function setSearch(data){
 var d = {};
 var ids = {}
    for(var i = 0; i < data.length; i++){

        d[data[i]["Shrt Desc"]]= null;
        ids[data[i]["Shrt Desc"]]= data[i]["NDB No"];
    }
    console.log(ids["CHEESE,BLUE"]);
    $('#autocomplete-input').autocomplete({

    data: d,
    limit: 10000, // The max amount of results that can be shown at once. Default: Infinity.
    onAutocomplete: function(val) {
        $("#searchInput").val(ids[val]);
         $("#searchInput").trigger("contentChanged");


    },
    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.

  });


}




