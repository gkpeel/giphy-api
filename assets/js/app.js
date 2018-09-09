var animalsArray = ["Dog", "Cat", "Pig", "Cow"];

for (var i=0; i<animalsArray.length; i++) {
    var menuItem = $("<li>");
    var menuLink = $("<a>");
    $(menuItem).append(menuLink);
    menuLink.attr('data-animal', animalsArray[i]);
    menuLink.text(animalsArray[i]);
    menuLink.addClass('gif-button');
    console.log(menuItem);
    $("#animals-list").append(menuItem);
}




$(document).ready(function () {

    $('#sidebar-header').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

});

$("#gif-add").on("click", function(event){

    // Prevent default form submission
    event.preventDefault();
    console.log($("#gif-input").val());


    // Clear input value
    $("#gif-input").val("")

});

$(document).on("click", ".gif-button", function(){

    var animal = $(this).attr('data-animal');
    var queryURL = 'http://api.giphy.com/v1/gifs/search?q='+animal+'&api_key=f0r4tctLW7KiDa2jKEuOa9uz5xnCR2xQ&limit=5';

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response.data);

        for (var i=0; i<response.data.length; i++) {
            var displayCol = $('<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">');
            var animalImg = $("<img>").addClass("img-fluid");
            animalImg.attr("src", response.data[i].images.original.url);
            displayCol.append(animalImg);
            $("#gif-body").append(displayCol);
        }

    });

});