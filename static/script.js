tooglePage1();

function tooglePage1() {
  $(".covers").removeClass("up");
  setTimeout(() => $(".main header").toggleClass("loaded"), 50);
  setTimeout(() => $(".covers").toggleClass("loaded"), 600);
}

var $covers = $(".covers");
var scroll = 0;
var delta = 267;

function doScroll(scrollUp = false) {
  var listHeight = getComputedStyle(
    document.querySelector("ul.covers")
  ).getPropertyValue("height");

  if (!scrollUp && scroll < parseInt(listHeight) - delta * 2) {
    scroll += delta;
    $covers
      .removeClass("up")
      .find("li")
      .css("transform", `translateY(-${scroll}px)`);
  }

  if (scrollUp && scroll >= delta) {
    scroll -= delta;
    $covers
      .addClass("up")
      .find("li")
      .css("transform", `translateY(-${scroll}px)`);
  }
}

$("button.scrollDown").on("click", (evt) => doScroll());
$("button.scrollTop").on("click", (evt) => doScroll(true));

$("button.back").on("click", (evt) => {
  $(".main").toggleClass("page2");
  $(".total button").removeClass("success").text("CHECKOUT");
  tooglePage1();
});

$(".covers").on("click", "li", (evt) => {
  var data = getData();
  var index = evt.currentTarget.getAttribute("data-index");
  var movie = data.results[parseInt(index)];
  var txt =
    movie.overview.length >= 220
      ? movie.overview.substring(0, 220).concat("...")
      : movie.overview;

  var $sinopsis = $(".sinopsis");
  $sinopsis.find("h3").text(movie.title);
  $sinopsis.find("small").text(`Duration: ${movie.duration}`);
  $sinopsis
    .find("img")
    .attr("src", `/static/${movie.poster_path}`);

  var $mysection = $(".mysection");
  $mysection.find("p").text(txt);

  $("#trailer").attr("onclick",`window.open('${movie.trailer}')`);

  $("#cast1").attr("src", `/static/${movie.cast1}`);
  $("#castone").text(movie.castone);
  $("#cast2").attr("src", `/static/${movie.cast2}`);
  $("#casttwo").text(movie.casttwo);
  $("#cast3").attr("src", `/static/${movie.cast3}`);
  $("#castthree").text(movie.castthree);
  $("#cast4").attr("src", `/static/${movie.cast4}`);
  $("#castfour").text(movie.castfour);
  $("#cast5").attr("src", `/static/${movie.cast5}`);
  $("#castfive").text(movie.castfive);

  localStorage.setItem('currentSelection', movie.title)

  $(".main").toggleClass("page2");
  tooglePage1();
});

$("#booknow").click(function(){
  MicroModal.show('modal-1');
}); 

$("#confirmbooking").click(function(){
  const movie = localStorage.getItem('currentSelection')
  const seats = localStorage.getItem('selectedSeats')
  const showtime = localStorage.getItem('selectedMovieIndex')
  const payment = localStorage.getItem('selectedPaymentMethod')
  const seatsIndex = [];
  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  var values = { 
    movie : movie,
    seats: seats,
    showtime: showtime,
    payment: payment
  }

  $.ajax({
    url: "/postbooking",
    type: "post",
    data: values ,
    success: function (response) {
      if(response == "success") {
        MicroModal.close('modal-1')
        alert("Booked Successfully")
        
      } else {
        alert("Booking Failed! Try again")
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
       console.log(textStatus, errorThrown);
       alert("Booking Failed! Try again")
    }
  });
}); 

function showbooking(cid) {
  $.ajax({
    url: "/getbooking",
    type: "get",
    data: "" ,
    success: function (response) {
      if(response != "failed") {
        $("#bookeddata").html(response);
        MicroModal.show('modal-2');
      } else {
        
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
       console.log(textStatus, errorThrown);
       
    }
  });

  
}

function doMoviesRender(filter) {
  var movies = getData().results;
  var moviesRender = movies.map((item, index) => {
    var { title, genre_ids, poster_path, overview, duration } = item;

    var uri = `/static/${poster_path}`;
    var gid = genre_ids.toString();

    return gid.indexOf(filter) < 0
      ? ""
      : `
			<li data-index="${index}">
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8zw8AAhMBENYXhyAAAAAASUVORK5CYII=" style="background-image: url(${uri})">
				<span>${title}</span><small>Duration: ${duration}</small>
			</li>
		`;
  });

  $(".covers").html(moviesRender.join(""));
}

doMoviesRender(",");

var seats = [];
var initPos = 65;
for (var i = 0; i < 78; i++) {
  var row = String.fromCharCode(initPos + Math.floor(i / 9));
  var taken = i % 7 == 0 || i % 6 == 0 ? "taken" : "";

  var aisle = i % 9 === 1 ? "aisle-right" : i % 9 === 7 ? "aisle-left" : "";

  if (row === "I") aisle = "aisle-top";

  seats.push(`<div class="seat ${taken} ${aisle}">${row}${(i % 9) + 1}</div>`);
}
$(".seats").html(seats.join(""));

$(".seats").on("click", ".seat", (evt) => {
  var $seat = $(evt.currentTarget);

  if (!$seat.hasClass("taken")) {
    $seat.toggleClass("selected");

    var $sel = $seat.parent().find(".selected");
    var qty = $sel.length * 299;
    $(".total span").text(`Rs.${qty}`.substring(0, 6));
  }
});

$(".filter li").on("click", (evt) => {
  $(evt.currentTarget).addClass("selected").siblings().removeClass("selected");
  var $covers = $(".covers").removeClass("loaded").removeClass("up");
  var filter = evt.currentTarget.getAttribute("data-gid");
  doMoviesRender(filter);
  scroll = 0;
  setTimeout(() => $covers.toggleClass("loaded"), 100);
});

$(".total button").on("click", function (evt) {
  var $button = $(evt.currentTarget);
  var total = $(".total span").text();

  if (!$button.hasClass("success") && total !== "$0") {
    var $loader = $(".loader").show();
    $button.text("Booking...");

    setTimeout(() => {
      $loader.hide();
      $button.html('<i class="zmdi zmdi-check-circle"></i> Movie Booked');
      $button.addClass("success");
    }, 1600);
  }
});

function getData() {
  return {
    page: 1,
    total_results: 315519,
    total_pages: 15776,
    results: [
      {
        vote_count: 1724,
        id: 297762,
        video: false,
        vote_average: 7,
        title: "Kantara (Kannada)",
        popularity: 119.66635,
        poster_path: "1.jpg",
        original_language: "en",
        original_title: "Kantara (Kannada)",
        genre_ids: [0,3],
        backdrop_path: "1.jpg",
        adult: false,
        overview:
          "When greed paves the way for betrayal, scheming and murder, a young tribal reluctantly dons the traditions of his ancestors to seek justice",
        release_date: "2022-09-30",
        duration: "2h 30m",
        cast1: "1a.jpg",
        castone: "Rishab Shetty",
        cast2: "1b.jpg",
        casttwo: "Kishore Kumar G.",
        cast3: "1c.jpg",
        castthree: "Achyuth Kumar",
        cast4: "1d.jpg",
        castfour: "Sapthami Gowda",
        cast5: "1e.jpg",
        castfive: "Pramod Shetty",
        trailer: "https://www.youtube.com/watch?v=8mrVmf239GU"
      },
      {
        vote_count: 4194,
        id: 263115,
        video: false,
        vote_average: 7.5,
        title: "Avatar: The Way of Water (3D)",
        popularity: 80.401638,
        poster_path: "2.jpg",
        original_language: "en",
        original_title: "Avatar: The Way of Water (3D)",
        genre_ids: [0,1,3],
        backdrop_path: "2.jpg",
        adult: false,
        overview:
          "Jake Sully and Ney'tiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora. When an ancient threat resurfaces, Jake must fight a difficult war against the humans.",
        release_date: "2022-12-16",
        duration: "3h 12m",
        cast1: "2a.jpg",
        castone: "Sam Worthington",
        cast2: "2b.jpg",
        casttwo: "Zoe Saldanay",
        cast3: "2c.jpg",
        castthree: "Sigourney Weaver",
        cast4: "2d.jpg",
        castfour: "Stephen Lang",
        cast5: "2e.jpg",
        castfive: "Kate Winslet",
        trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0"
      },
      {
        vote_count: 3464,
        id: 321612,
        video: false,
        vote_average: 6.8,
        title: "Brahmastra Part One: Shiva",
        popularity: 73.33872,
        poster_path: "3.jpg",
        original_language: "en",
        original_title: "Brahmastra Part One: Shiva",
        genre_ids: [0,1,2],
        backdrop_path: "3.jpg",
        adult: false,
        overview:
          "A young man on the brink of falling in love gets his world turned upside down when he discovers he has the power to control fire and a connection to a secret society of guardians.",
        release_date: "2022-09-09",
        duration: "2h 48m",
        cast1: "3a.jpg",
        castone: "Amitabh Bachchan",
        cast2: "3b.jpg",
        casttwo: "Ranbir Kapoor",
        cast3: "3c.jpg",
        castthree: "Alia Bhatt",
        cast4: "3d.jpg",
        castfour: "Nagarjuna Akkineni",
        cast5: "3e.jpg",
        castfive: "Shah Rukh Khan",
        trailer: "https://www.youtube.com/watch?v=BUjXzrgntcY"
      },
      {
        vote_count: 591,
        id: 282035,
        video: false,
        vote_average: 5.2,
        title: "Kantara (Telagu)",
        popularity: 57.18406,
        poster_path: "4.jpg",
        original_language: "en",
        original_title: "Kantara (Telagu)",
        genre_ids: [0,3],
        backdrop_path: "4.jpg",
        adult: false,
        overview:
          "When greed paves the way for betrayal, scheming and murder, a young tribal reluctantly dons the traditions of his ancestors to seek justice",
        release_date: "2022-09-30",
        duration: "2h 30m",
        cast1: "1a.jpg",
        castone: "Rishab Shetty",
        cast2: "1b.jpg",
        casttwo: "Kishore Kumar G.",
        cast3: "1c.jpg",
        castthree: "Achyuth Kumar",
        cast4: "1d.jpg",
        castfour: "Sapthami Gowda",
        cast5: "1e.jpg",
        castfive: "Pramod Shetty",
        trailer: "https://www.youtube.com/watch?v=Mo-fv7b77t8"
      },
      {
        vote_count: 1309,
        id: 166426,
        video: false,
        vote_average: 6.6,
        title: "Jaya Jaya Jaya Jaya Hey",
        popularity: 37.717108,
        poster_path: "5.jpg",
        original_language: "en",
        original_title: "Jaya Jaya Jaya Jaya Hey",
        genre_ids: [0,2,3],
        backdrop_path: "5.jpg",
        adult: false,
        overview:
          "Young bride Jaya wants to complete her education, but she is mocked by her new husband. Jaya shocks everyone by fighting for herself and becomes an inspiration to other married women.",
        release_date: "2022-10-28",
        duration: "2h 20m",
        cast1: "5a.jpg",
        castone: "Basil Joseph",
        cast2: "5b.jpg",
        casttwo: "Anand Manmadhan",
        cast3: "5c.jpg",
        castthree: "Noby Marcose",
        cast4: "5d.jpg",
        castfour: "Azees Nedumangad",
        cast5: "5e.jpg",
        castfive: "Darshana Rajendran",
        trailer: "https://www.youtube.com/watch?v=FEnmY2kKq6k"
      },
      {
        vote_count: 1843,
        id: 293167,
        video: false,
        vote_average: 6.1,
        title: "Avatar: The Way of Water (2D)",
        popularity: 31.442202,
        poster_path: "6.jpg",
        original_language: "en",
        original_title: "Avatar: The Way of Water (2D)",
        genre_ids: [0,1,3],
        backdrop_path: "6.jpg",
        adult: false,
        overview:
          "Jake Sully and Ney'tiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora. When an ancient threat resurfaces, Jake must fight a difficult war against the humans.",
        release_date: "2022-12-16",
        duration: "3h 12m",
        cast1: "2a.jpg",
        castone: "Sam Worthington",
        cast2: "2b.jpg",
        casttwo: "Zoe Saldanay",
        cast3: "2c.jpg",
        castthree: "Sigourney Weaver",
        cast4: "2d.jpg",
        castfour: "Stephen Lang",
        cast5: "2e.jpg",
        castfive: "Kate Winslet",
        trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0"
      }
    ]
  };
}
