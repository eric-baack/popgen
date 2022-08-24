/* javascript for pope1.html, showing logistic & exponential models */

/* E. Baack, Feb 2022.  Started:  shows basic exponential / logistic. */
/* Next change to allow second scenario to be plotted */
/* may need to revise logic somewhat to make this work  efficiently */

/* jshint esversion: 8 */
/* jshint browser: true */
/* jshint node: true */

'use strict';

var canvas, width, height, ctx;
var g1maxy, g1miny, g1maxx, g1minx;
var g2maxy, g2miny, g2maxx, g2minx;
var g3maxy, g3miny, g3maxx, g3minx;
var fontsz, mtype, maxpop, lastx, lasty, nextx, nexty, maxpopax, max_change, max_p_change;


function run_model2() {
    let pop02 = document.querySelector("#N02").value;
    pop02 = parseInt(pop02,10);
    // When adding, these were adding text, not integers!
    let pop_r2 = document.querySelector("#r2").value;
    pop_r2 = parseFloat(pop_r2,10);

    let pop_K2 = document.querySelector("#K2").value;
    pop_K2 = parseInt(pop_K2,10);
    let max_gens = 500;

    // first do N vs t - use max N here for later steps for exponential
    var pop_size = [];
    var gen_array = [];
    var popN = pop02;
   
    pop_size.push(pop02);
    gen_array.push(0);
    console.log(mtype, pop02, pop_r2, pop_K2);
    for (let gens = 1; gens <= 500; gens++){
        if (mtype == "Exponential") {
            popN = popN + pop_r2 * popN;
            pop_size.push(popN);
            gen_array.push(gens);
            //console.log("E")
        } else {
            popN = popN + popN * (1 - (popN / pop_K2))* pop_r2;
            //console.log(gens, popN);
            pop_size.push(popN);
            gen_array.push(gens);
        }
    }
   
    for (let g = 1; g <= 500; g++) {
        let lastf = pop_size[g-1];
        lasty = g1maxy - lastf * (g1maxy-g1miny) / maxpopax;
        lastx = g1minx + (g1maxx-g1minx) / 500 * g;
        nextx = lastx + (g1maxx-g1minx) / 500;
        nexty = g1maxy - pop_size[g] * (g1maxy-g1miny) / maxpopax;
        if (lastf <= maxpopax) {
            ctx.strokeStyle = 'rgb(255, 0, 0)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lastx,lasty);
            ctx.lineTo(nextx, nexty);
            ctx.stroke();
        }
    }


    // then dN/dt vs N.  use Maxpopax for X; use N/2 calc for maxY

    console.log("second model, second graph")
    lasty = g2maxy;
    for (let g = 1; g <= maxpopax; g++) {
        lastx = g2minx + (g2maxx-g2minx) / maxpopax * (g-1);
        nextx = lastx + (g2maxx-g2minx) / maxpopax;
        if (mtype == "Logistic"){
            nexty = g2maxy - (g * (1 - g /pop_K2) * pop_r2)*(g2maxy-g2miny) / max_change;
        } else {
            nexty = g2maxy - (g*pop_r2)*(g2maxy-g2miny) / max_change;
        }
        lasty = nexty;
        console.log(nextx, nexty, lastx, lasty, g, pop_K2, pop_r2, max_change);
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lastx,lasty);
        ctx.lineTo(nextx, nexty);
        ctx.stroke();
    }

    // then 1/N dN/dt.  
    console.log("2nd model, 3rd graph")
     lasty = g3maxy;
     for (let g = 0; g <= maxpopax; g++){
        lastx = g3minx + (g3maxx-g3minx) / maxpopax * (g-1);
        nextx = lastx + (g3maxx-g3minx) / maxpopax;
        if (mtype == "Logistic"){
            nexty = g3maxy - ((1 - (g /pop_K2)) * pop_r2)*(g3maxy-g3miny) / max_p_change;
        } else {
            nexty = g3maxy - (pop_r2)*(g3maxy-g3miny) / max_p_change;
        }
        lasty = nexty;
        //console.log(nextx, nexty, lastx, lasty);
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lastx,lasty);
        ctx.lineTo(nextx, nexty);
        ctx.stroke();
     }
    ctx.fillStyle = 'blue';
    ctx.fillText("Model 1", g1maxx *0.8, canvas.height * 0.7);
    ctx.fillStyle = 'red';
    ctx.fillText("Model 2", g1maxx *0.8, canvas.height * 0.75);
}

function run_model() {
    initialize_graphs();
    let pop0 = document.querySelector("#N0").value;
    pop0 = parseInt(pop0,10);
    // When adding, these were adding text, not integers!
    let pop_r = document.querySelector("#r").value;
    pop_r = parseFloat(pop_r,10);

    let pop_K = document.querySelector("#K").value;
    pop_K = parseInt(pop_K,10);
    let max_gens = 500;

    // first do N vs t - use max N here for later steps for exponential
    var pop_size = [];
    var gen_array = [];
    var popN = pop0;
   
    pop_size.push(pop0);
    gen_array.push(0);
    console.log(mtype, pop0, pop_r, pop_K);
    for (let gens = 1; gens <= 500; gens++){
        if (mtype == "Exponential") {
            popN = popN + pop_r * popN;
            pop_size.push(popN);
            gen_array.push(gens);
            //console.log("E")
        } else {
            popN = popN + popN * (1 - (popN / pop_K))* pop_r;
            //console.log(gens, popN);
            pop_size.push(popN);
            gen_array.push(gens);
        }
    }
    let years = 500;
    let year_int = years / 5;
    for (let j = 0; j <= 5; j++) {
       ctx.fillText(j*year_int, g1minx + j/5 * (g1maxx - g1minx) - 12, canvas.height * .95);
    }
    let maxpop = Math.max(...pop_size);
    console.log(maxpop);
    if (maxpop > 1000){
        maxpopax = 1000;
    } else {
        let pop_pwr = Math.floor(Math.log10(maxpop));
        maxpopax = (Math.floor(maxpop /(10** pop_pwr)) +  1) * (10**pop_pwr);
    }
    let pop_int = maxpopax / 5;
    for (let j = 0; j <= 5; j++) {
        ctx.fillText(j * pop_int, g1minx * 0.3, g1maxy - (j * (g1maxy - g1miny)/5 - 5/height));
    }
    for (let g = 1; g <= 500; g++) {
        let lastf = pop_size[g-1];

        lasty = g1maxy - lastf * (g1maxy-g1miny) / maxpopax;
        lastx = g1minx + (g1maxx-g1minx) / 500 * g;
        nextx = lastx + (g1maxx-g1minx) / 500;
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

    // then dN/dt vs N.  use Maxpopax for X; use N/2 calc for maxY
    pop_int = maxpopax / 5;
    if (mtype == "Logistic"){
        max_change = (pop_K / 2) * 0.5 * pop_r;
    } else {
        max_change = maxpopax * pop_r;
    }
 
    let change_int = max_change / 5;
    for (let j = 0; j <= 5; j++) {
        let popt = j*pop_int;
        let popts = popt.toFixed(0);
        let changet = j*change_int;
        let changets = changet.toFixed(1);
       ctx.fillText(popts, g2minx + j/5 * (g2maxx - g2minx) - 12, canvas.height * .95);
       ctx.fillText(changets, g2minx * 0.9, g2maxy - (j * (g2maxy - g2miny)/5 - 5/height));
    }
    lasty = g2maxy;
    for (let g = 1; g <= maxpopax; g++) {
        lastx = g2minx + (g2maxx-g2minx) / maxpopax * (g-1);
        nextx = lastx + (g2maxx-g2minx) / maxpopax;
        if (mtype == "Logistic"){
            nexty = g2maxy - (g * (1 - g /pop_K) * pop_r)*(g2maxy-g2miny) / max_change;
        } else {
            nexty = g2maxy - (g*pop_r)*(g2maxy-g2miny) / max_change;
        }
        lasty = nexty;
        //console.log(nextx, nexty, lastx, lasty);
        ctx.strokeStyle = 'rgb(0, 0, 255)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lastx,lasty);
        ctx.lineTo(nextx, nexty);
        ctx.stroke();
    }

    // then 1/N dN/dt.
    max_p_change = pop_r;  
    change_int = max_p_change / 5;
    for (let j = 0; j <= 5; j++) {
        let popt = j*pop_int;
        let popts = popt.toFixed(0);
        let changet = j*change_int;
        let changets = changet.toFixed(3);
        ctx.fillText(popts, g3minx + j/5 * (g3maxx - g3minx) - 12, canvas.height * .95);
        ctx.fillText(changets, g3minx * 0.94, g3maxy - (j * (g3maxy - g3miny)/5 - 5/height));
     }
     lasty = g3maxy;
     for (let g = 0; g <= maxpopax; g++){
        lastx = g3minx + (g3maxx-g3minx) / maxpopax * (g-1);
        nextx = lastx + (g3maxx-g3minx) / maxpopax;
        if (mtype == "Logistic"){
            nexty = g3maxy - ((1 - (g /pop_K)) * pop_r)*(g3maxy-g3miny) / max_p_change;
        } else {
            nexty = g3maxy - (pop_r)*(g3maxy-g3miny) / max_p_change;
        }
        lasty = nexty;
        //console.log(nextx, nexty, lastx, lasty);
        ctx.strokeStyle = 'rgb(0, 0, 255)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lastx,lasty);
        ctx.lineTo(nextx, nexty);
        ctx.stroke();
     }
    let button2 = document.querySelector("#Run2");
    button2.style.display ="block";

}

function initialize_graphs() {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    // make all dimensions in terms of fractions of width, height

    // make rectangle for graph
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, width, height)
    // draw axes
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(g1minx, g1miny);
    ctx.lineTo(g1minx, g1maxy);
    ctx.stroke();
    ctx.lineTo(g1maxx, g1maxy);
    ctx.stroke()

    ctx.beginPath();
    ctx.moveTo(g2minx, g2miny);
    ctx.lineTo(g2minx, g2maxy);
    ctx.stroke();
    ctx.lineTo(g2maxx, g2maxy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(g3minx, g3miny);
    ctx.lineTo(g3minx, g3maxy);
    ctx.stroke();
    ctx.lineTo(g3maxx, g3maxy);
    ctx.stroke();

    //label axes
    ctx.fillStyle = 'black';
    ctx.fillText("time (generations)", g1maxx *0.48, canvas.height * 0.99);
    ctx.fillText("N", g2maxx *0.78, canvas.height * 0.99);
    ctx.fillText("N", g3maxx *0.78, canvas.height * 0.99);
    ctx.save();
    ctx.translate(g1minx * 0.25, g1maxy * 0.5);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText("N", 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(g2minx * 0.9, g2maxy * 0.5);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText("dN/dt", 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(g3minx * 0.93, g3maxy * 0.5);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText("1/N dN/dt", 0, 0);
    ctx.restore();
    // omit putting on X axis, Y axis numeric labels until after data calculated
}

window.onload = function() {
    width  = window.innerWidth;

    canvas = document.querySelector('#myCanvas');
    canvas.width = width;
    if (width == 0) {
        width = screen.width; // for safari
    }

    height =  window.innerHeight;
    if (height == 0) {
        height = screen.height; // for safari
    }
    canvas.height = height * 0.5;
    ctx = canvas.getContext('2d');
    g1maxy = canvas.height * 0.9;
    g1miny = canvas.height * 0.1;
    g1maxx = canvas.width * 0.3;
    g1minx = canvas.width * 0.05;
    g2maxy = canvas.height * 0.9;
    g2miny = canvas.height * 0.1;
    g2maxx = canvas.width * 0.6;
    g2minx = canvas.width * 0.35;
    g3maxy = canvas.height * 0.9;
    g3miny = canvas.height * 0.1;
    g3maxx = canvas.width * 0.9;
    g3minx = canvas.width * 0.65;
    fontsz = 24 / 1000 * height;
    ctx.font = (fontsz|0) + 'px Georgia';

    mtype = document.querySelector("#model_type").value;
    initialize_graphs();
    let button2 = document.querySelector("#Run2");
    button2.style.display ="none";


}

function change_menu() {
    initialize_graphs();
    var pop_K_field = document.querySelector("#K");
    var pop_K2_field = document.querySelector("#K2");
    mtype = document.querySelector("#model_type").value;
    if (mtype == "Logistic") {
        pop_K_field.style.display = "block";
        pop_K2_field.style.display = "block";
    } else {
        pop_K_field.style.display = "none";
        pop_K2_field.style.display = "none";
    }
}

function reset() {
    document.location.reload();
}