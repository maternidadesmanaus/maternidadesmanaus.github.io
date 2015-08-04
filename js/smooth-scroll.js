var smoothScroll = (function (window, document, undefined) {

    var init = function(options) {

        if (options.src !== undefined) {
            getElement(options.src).onclick = function() {
                smoothScroll(options);
            };
        } else {
            smoothScroll(options);
        }

    };

    var getElement = function(elm) {
        return (typeof(elm) === "string")
            ? document.querySelector(elm)
            : elm;
    };

    var smoothScroll = function(options) {
        var eID      = getElement(options.target),
            discount = options.discount,
            startY   = currentYPosition(),
            stopY    = (options.discount !== undefined)
                ? elmYPosition(eID) + discount
                : elmYPosition(eID),
            distance = stopY > startY ? stopY - startY : startY - stopY;

        if (distance < 100) {
            scrollTo(0, stopY);
            return;
        }

        var speed = Math.round(distance / 100);
        if (speed >= 20) {
            speed = 20;
        }

        var step  = Math.round(distance / 25),
            leapY = stopY > startY ? startY + step : startY - step,
            timer = 0;

        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                window.setTimeout(
                    "window.scrollTo(0, " + leapY + ")",
                    timer * speed
                );

                leapY += step;
                if (leapY > stopY) {
                    leapY = stopY;
                }

                timer++;
            }
            return;
        }

        for ( var i=startY; i>stopY; i-=step ) {
            window.setTimeout(
                "window.scrollTo(0, " + leapY + ")",
                timer * speed
            );

            leapY -= step;
            if (leapY < stopY) {
              leapY = stopY;
            }

            timer++;
        }
    };

    var currentYPosition = function() {
        var yPosition = 0,
            doc       = document;

        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) {
            yPosition = self.pageYOffset;
        }

        // Internet Explorer 6 - standards mode
        if (doc.documentElement && doc.documentElement.scrollTop) {
            yPosition = doc.documentElement.scrollTop;
        }

        // Internet Explorer 6, 7 and 8
        if (doc.body.scrollTop) {
            yPosition = doc.body.scrollTop;
        }

        return yPosition;
    };

    var elmYPosition = function(eID) {
        var elm = (typeof(eID) === "string")
          ? document.getElementById(eID)
          : eID;
        var y = elm.offsetTop;
        var node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        } return y;
    };

    return {
        init : init
    };

})(window, document, undefined);