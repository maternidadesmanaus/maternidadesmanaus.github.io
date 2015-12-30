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