/* javascript for pope2.html, showing logistic & exponential models */
/* E. Baack, July 2022.  */

/* jshint esversion: 8 */
/* jshint browser: true */
/* jshint node: true */

'use strict';

var canvas, width, height, ctx;
var g1maxy, g1miny, g1maxx, g1minx;
var fontsz, maxpop, lastx, lasty, nextx, nexty, maxpopax, max_change, max_p_change, max_years;


function run_model() {
    initialize_graphs()
    let hlx = document.querySelector("#Hatchling_survival").value;
    hlx = parseFloat(hlx);
    // When adding, these were adding text, not integers!
    let hmx = document.querySelector("#Hatchling_reproduction").value;
    hmx = parseInt(hmx);
    let hn= document.querySelector("#Hatchling_count").value;
    hn = parseInt(hn);

    let jlx = document.querySelector("#Juvenile_survival").value;
    jlx = parseFloat(jlx);
    // When adding, these were adding text, not integers!
    let jmx = document.querySelector("#Juvenile_reproduction").value;
    jmx = parseInt(jmx);
    let jn= document.querySelector("#Juvenile_count").value;
    jn = parseInt(jn);


    let alx = document.querySelector("#Adult_survival").value;
    alx = parseFloat(alx);
    // When adding, these were adding text, not integers!
    let amx = document.querySelector("#Adult_reproduction").value;
    amx = parseInt(amx);
    let an= document.querySelector("#Adult_count").value;
    an = parseInt(an);


    let max_years = 100;

    // first do N vs t - use max N here for later steps for exponential
    var pop_size = [];
    var gen_array = [];
    var popN = hn + jn + an;
    
    pop_size.push(popN);
    gen_array.push(0);
    // console.log(popN);
    for (let gens = 1; gens <= max_years; gens++){
            let hn2 = Math.floor(an * .25 * amx);
            let jn2 = Math.floor(hn * hlx + jn * .97 * jlx);
            let an2 = Math.floor(an * alx + jn * .03 * jlx);
            an = an2;
            if (an > 10000){
                an = 10000;
            }
            hn = hn2;
            jn = jn2;
            if (jn > 20000) {
                jn = 20000;
            }
            popN = an + jn + hn;
            pop_size.push(popN);
            gen_array.push(gens);
            // console.log(hn, jn, an, popN)   
    }
    let years = max_years;
    let year_int = years / 10;
    for (let j = 0; j <= 10; j++) {
       ctx.fillText(j*year_int, g1minx + j/10 * (g1maxx - g1minx) - 12, canvas.height * .95);
    }
    let maxpop = Math.max(...pop_size);
    let pop_pwr = Math.floor(Math.log10(maxpop));
    maxpopax = (Math.floor(maxpop /(10** pop_pwr)) +  1) * (10**pop_pwr);
    
    let pop_int = maxpopax / 10;
    for (let j = 0; j <= 10; j++) {
        ctx.fillText(j * pop_int, g1minx * 0.3, g1maxy - (j * (g1maxy - g1miny)/10 - 10/height));
    }
    for (let g = 1; g <= max_years; g++) {
        let lastf = pop_size[g-1];

        lasty = g1maxy - lastf * (g1maxy-g1miny) / maxpopax;
        lastx = g1minx + (g1maxx-g1minx) / max_years * g;
        nextx = lastx + (g1maxx-g1minx) / max_years;
        nexty = g1maxy - pop_size[g] * (g1maxy-g1miny) / maxpopax;
        if (lastf <= maxpopax) {
            ctx.strokeStyle = 'rgb(0, 0, 255)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lastx,lasty);
            ctx.lineTo(nextx, nexty);
            ctx.stroke();
        }
    }
    ctx.fillText(pop_size[max_years-1], lastx, lasty - 15);
}


    

    

function initialize_graphs() {
    let canvas_width = width;
    if (width == 0) {
        width = screen.width; // for safari
    }

    height =  window.innerHeight;
    if (height == 0) {
        height = screen.height; // for safari
    }
    let canvas_height = height * 0.5;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    // make all dimensions in terms of fractions of width, height

    // make rectangle for graph
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas_width, canvas_height)
    // draw axes
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(g1minx, g1miny);
    ctx.lineTo(g1minx, g1maxy);
    ctx.stroke();
    ctx.lineTo(g1maxx, g1maxy);
    ctx.stroke()


    //label axes
    ctx.fillStyle = 'black';
    ctx.fillText("time (years)", g1maxx *0.48, canvas.height * 0.99);
    ctx.save();
    ctx.translate(g1minx * 0.25, g1maxy * 0.5);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText("N", 0, 0);
    ctx.restore();
    ctx.save();
    
    // omit putting on X axis, Y axis numeric labels until after data calculated
}

window.onload = function() {
    canvas = document.querySelector('#myCanvas');
    width  = window.innerWidth;
    if (width == 0) {
        width = screen.width; // for safari
    }
    canvas.width = width;
    height =  window.innerHeight;
    if (height == 0) {
        height = screen.height; // for safari
    }
    canvas.height = height * 0.5;
    
    canvas.style.top = height / 2 + 100;
    ctx = canvas.getContext('2d');
    g1maxy = canvas.height * 0.8;
    g1miny = canvas.height * 0.2;
    g1maxx = canvas.width * 0.9;
    g1minx = canvas.width * 0.05;
    fontsz = 24 / 1000 * height;
    ctx.font = (fontsz|0) + 'px Georgia';

    initialize_graphs();
}
