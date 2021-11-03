var intervalId;

var canvasDots = function () {

    var a = window.innerWidth * window.innerHeight;

    var refreshInterval = 150;
    var mainDotAmount = 5;
    var dotAmount = Math.ceil(a / 4200) > 500 ? 500 : Math.ceil(a / 4200);
    var strokeMainDistance = Math.ceil(Math.sqrt(a) / 6.5);

    var strokeDistance = strokeMainDistance / 2;
    var dots = [];
    var mainDots = [];

    //get canvas and set size to window size
    var canvas = document.querySelector('#universeCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    //get drawing context
    var context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    context.lineWidth = 0.25;

    function Dot() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        //direction/speed
        this.vx = -.5 + Math.random();
        this.vy = -.5 + Math.random();

        this.radius = Math.random() * Math.random() * 5;
    }


    Dot.prototype = {
        draw: function () {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            context.fill();
        },
        move: function () {
            //reverse direction if dots hits border
            if (this.y < 0 || this.y > canvas.height) {
                this.vy = - this.vy;
            }
            else if (this.x < 0 || this.x > canvas.width) {
                this.vx = - this.vx;
            }
            //move dot
            this.x += this.vx;
            this.y += this.vy;
        }
    };

    function drawLines() {
        var inRange = [];
        //get all dots that are in range of a main dot
        for (m = 0; m < mainDots.length; m++) {
            for (i = 0; i < dots.length; i++) {
                //chek distance to main dot
                if (Math.hypot(dots[i].x - mainDots[m].x, dots[i].y - mainDots[m].y) < strokeMainDistance) {
                    inRange.push(dots[i]);
                }
            }
        }

        for (i = 0; i < inRange.length; i++) {
            for (j = 0; j < inRange.length; j++) {
                //check distance to next dot
                if (Math.hypot(inRange[j].x - inRange[i].x, inRange[j].y - inRange[i].y) < strokeDistance) {
                    context.beginPath();
                    context.moveTo(inRange[i].x, inRange[i].y);
                    context.lineTo(inRange[j].x, inRange[j].y);
                    context.stroke();
                    context.closePath();
                }
            }
        }
    }

    function refresh() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (i = 0; i < dots.length; i++) {
            dots[i].draw();
            dots[i].move();
        }

        for (i = 0; i < mainDots.length; i++) {
            mainDots[i].draw();
            mainDots[i].move();
        }

        drawLines();
    }

    //create dots
    for (i = 0; i < dotAmount; i++)
        dots.push(new Dot());

    //create main dots
    for (i = 0; i < mainDotAmount; i++)
        mainDots.push(new Dot());

    //set refresh interval
    intervalId = setInterval(refresh, refreshInterval);
};

//subscribe onload event
window.onload = function () {
    canvasDots();
};

function resize() {
    //stop old interval and start new animation
    clearInterval(intervalId);
    canvasDots();
}

window.addEventListener("resize", resize);