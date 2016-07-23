/**
 * Register go to top
 *
 * @return {Void}
 */
function goToTop() {
    smoothScroll.init({
        target : document.body
    });
}

/**
 * Register modal configurations
 *
 * @param  {String}  url
 * @param  {Integer} width
 * @param  {Integer} height
 * @return {Void}
 */
function openModalSharer(url, width, height) {
    var left = (screen.width/2)-(width/2);
    var top  = ((screen.height/2)-(height/2))-20;
    window.open(url, '', 'width=' + width + ', height=' + height + ', scrollbars=no, left=' + left + ', top=' + top);
}

function resizeCharts() {
    var charts = window.globalCharts;
    console.log(window.innerWidth);
    if (window.innerWidth <= 800) {
        for (var i = 0; i < charts.length; i++) {
            if (charts[i].container.classList.contains("ct-octave")) {
                charts[i].container.classList.remove("ct-octave");
                charts[i].container.classList.add("ct-square");
                charts[i].update();
            } else if (charts[i].container.classList.contains("ct-golden-section")) {
                charts[i].container.classList.remove("ct-golden-section");
                charts[i].container.classList.add("ct-square");
                charts[i].update();
            }
        }
    } else {
        // for (var i = 0; i < charts.length; i++) {
        //     if (charts[i].container.classList.contains("ct-square")) {
        //         charts[i].container.classList.remove("ct-square");
        //         charts[i].container.classList.add("ct-octave");
        //         charts[i].update();
        //     }
        // }
    }
}

// register menu navigation events
document.querySelector("#main-nav .menu").addEventListener("click", function(event) {
    this.parentNode.classList.toggle("active");
}, false);

// register go to top navigation
document.querySelector("#go-to-top").addEventListener("click", function(event) {
    smoothScroll.init({
        target : document.body
    });
}, false);

document.querySelector("#share").addEventListener("click", function(event) {
    this.parentNode.classList.toggle("active");
}, false);

document.querySelector("#float-share-bar .close").addEventListener("click", function(event) {
    this.parentNode.classList.toggle("active");
}, false);

var containerReviewDetails = document.getElementById("review-detail");
var trs = document.querySelectorAll("#general-ranking table tbody tr");
for (var i = 0; i < trs.length; i++) {
    trs[i].addEventListener("click", function(event) {

        // show layer
        document.getElementById("review-detail").style.display = "block";

        // get review details
        var reviewDetails = JSON.parse(this.getAttribute("data-review-details"));

        containerReviewDetails.querySelector(".detail-maternity-name").innerHTML = reviewDetails.name;
        containerReviewDetails.querySelector(".qty-reviews").innerHTML = reviewDetails.reviews;
        containerReviewDetails.querySelector(".pregnant-reviews").innerHTML = reviewDetails.pregnant;
        containerReviewDetails.querySelector(".recent-reviews").innerHTML = reviewDetails.recent;

        containerReviewDetails.querySelector(".excelente span").innerHTML = reviewDetails.values.Excelente;
        containerReviewDetails.querySelector(".otimo span").innerHTML = reviewDetails.values.Ótimo;
        containerReviewDetails.querySelector(".bom span").innerHTML = reviewDetails.values.Bom;
        containerReviewDetails.querySelector(".ruim span").innerHTML = reviewDetails.values.Ruim;
        containerReviewDetails.querySelector(".pessimo span").innerHTML = reviewDetails.values.Péssimo;

        containerReviewDetails.querySelector(".score span").innerHTML = reviewDetails.rank;
        if (reviewDetails.rank > 0) {
            containerReviewDetails.querySelector(".score").classList.remove("negative");
            containerReviewDetails.querySelector(".score").classList.add("positive");
        } else {
            containerReviewDetails.querySelector(".score").classList.remove("positive");
            containerReviewDetails.querySelector(".score").classList.add("negative");
        }
    }, false);
}

var closeGeneralRanking = document.querySelector("#general-ranking .close");
if (closeGeneralRanking) {
    closeGeneralRanking.addEventListener("click", function(event) {
        this.parentNode.parentNode.style.display = "none";
    }, false);
}

window.addEventListener("scroll", function(){
    var bar = document.getElementById("float-share-bar");

    // if (!bar.classList.contains("active")) {
    //     bar.style.display = (window.pageYOffset > 2200)
    //         ? "block"
    //         : bar.style.display = "none";
    // }

    bar.style.display = (window.pageYOffset > 300)
        ? "block"
        : bar.style.display = "none";
});

// register lazy loading images
echo.init({
    offset   : 100,
    throttle : 100,
    unload   : false
});
