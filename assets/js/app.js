
// ==== VARIABLES ==== //
var animalsArray = ["Dog", "Cat", "Pig", "Cow", "Hippopotamus", "Elephants", "Otters", "Alligators"];
var favImgArray = [];
var gifsPresent = false;
var gifOffset = 0;
var gifLimit = 12;
var queryString = "";


// ==== FUNCTIONS ==== //
// creates menu buttons based on array indecies
function createButtons(arr){

    for (var i=0; i<arr.length; i++) {
        var menuItem = $('<div class="col-12 gif-button">');
        menuItem.attr('data-animal', arr[i]);
        var text = inputFormat(arr[i]);
        var abrv = abbreviate(text);
        menuItem.html('<strong>'+abrv+'</strong><p>'+text+"</p>");
        $("#animals-list").append(menuItem);
    }

}

function abbreviate(str){
    var retval = "";
    var arr = str.split(" ");
    for (var i=0; i<arr.length; i++) {
        retval += arr[i].charAt(0);
    }
    return retval;
}

// Swaps $(img) obj's src with it's data-gif-url value
function swapImgSrc(imgObj) {
    var currentImgSrc = imgObj.attr("src");
    var newImgSrc = imgObj.attr("data-gif-url");
    imgObj.attr("src", newImgSrc);
    imgObj.attr("data-gif-url", currentImgSrc);
}

// Builds html nodes using API response
function buildGif(response) {

    for (var i=0; i<response.data.length; i++) {

        // Build virtual nodes: columns and img
        // var displayCol = $('<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 gif-col">');
        // var gifcontainer = $('<div class="gif-container h-100">');
        var displayCard = $('<div class="card">');
        displayCard.html('<div class="favorite">Like</div><p class="card-text">'+(i+gifOffset-11)+'. Rating: ' + response.data[i].rating +'</p>');
        var animalImg = $('<img class="card-img">');

        // // Set image source
        animalImg.attr("src", response.data[i].images.downsized_still.url);
        animalImg.attr("data-gif-url", response.data[i].images.downsized.url);
        displayCard.prepend(animalImg);
        // displayCol.append(gifcontainer);
        $("#gif-body").append(displayCard);
    }
}

function inputFormat(string) {
    var wordsToIgnore = ["a", "after", "along", "an", "and", "around", "at", "be", "but", "by", "for", "in", "nor", "of", "or", "on", "so", "the", "with", "without", "yet"]

    var firstLetter = string.charAt(0).toUpperCase();
    string = firstLetter + string.substr(1);
    var wordArr = string.split(" ");
    
    for (var i=0; i<wordArr.length; i++) {
        if (!wordsToIgnore.includes(wordArr[i])) {
            var firstLetterI = wordArr[i].charAt(0).toUpperCase();
            wordArr[i] = firstLetterI + wordArr[i].substr(1);
        }
    }

    return wordArr.join(" ");
}

function buildQuery(queryString, gifLimit, gifOffset) {
    var retval = 'https://api.giphy.com/v1/gifs/search?q='+queryString+'&api_key=f0r4tctLW7KiDa2jKEuOa9uz5xnCR2xQ&limit='+gifLimit+'&offset='+gifOffset;
    return retval;
}

// ==== EVENT LISTENERS ==== //
$(document).ready(function () {

    createButtons(animalsArray);

    $('#sidebar-header').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('.gif-button strong').fadeToggle('fast');
        $( ".gif-button p" ).fadeToggle('fast');
    });

    
    $("#gif-add").on("click", function(event){
        // Prevent default form submission
        event.preventDefault();
    
        //Get user value
        var userInput = $("#gif-input").val().trim();
    
        if (userInput !== "") {

            // Format User Input for Menu Button
            var buttonPush = inputFormat(userInput);
        
            // Push to buttons array
            animalsArray.push(buttonPush);
        
            //Clear button displays and recreate
            $("#animals-list").empty();
            createButtons(animalsArray);

            // Empty Body for new gif load
            $("#gif-body").empty();
            
            // Take the userInput string and build query
            queryString = userInput;
            
            // Make API call
            $.ajax({
                url: buildQuery(queryString, gifLimit, gifOffset),
                method: "GET"
            }).then(function(response){
                gifOffset += gifLimit;
                buildGif(response);   
            });

            // Clear input value
            $("#gif-input").val("");

            $("#loadMore").removeClass("d-none");
        }
    });


    // Giphy loading 
    $(document).on("click", ".gif-button", function(){

        // Clear any content that might be in the display
        $("#gif-body").empty();

        // Take the buttons 'data-animal' value ang build query
        queryString = $(this).attr('data-animal');

        // Make API call
        $.ajax({
            url: buildQuery(queryString, gifLimit, gifOffset),
            method: "GET"
        }).then(function(response){
            console.log(response);
            gifOffset += gifLimit;
            buildGif(response);
            $("#loadMore").removeClass("d-none");   
        });     
    });

    // Listen for click to play/stop gifs
    $(document).on("click", "#gif-body .card-img", function() {
        swapImgSrc($(this));  
    });

    // Load more gifs
    $("#loadMore").on("click", function() {
        $.ajax({
            url: buildQuery(queryString, gifLimit, gifOffset),
            method: "GET"
        }).then(function(response){
            gifOffset += gifLimit;
            buildGif(response);   
        }); 
        
    });

    // Add to favorites
    $(document).on("click", "#gif-body .card .favorite", function() {
        $(this).toggleClass('added');
        var favImg = $(this).clone().siblings(".card-img");
        var favDisplay = $('<div class="col-3 fav-gif">');
        favDisplay.append(favImg);
        console.log(favDisplay);
        $("#favBody").append(favDisplay);
        // console.log(favDisplay);

    });

});
