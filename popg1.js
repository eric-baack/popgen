/* javascript for popg1.html,  web replacement for UW PopG*/
/* E. Baack, Feb 2022 */

/* jshint esversion: 8 */
/* jshint browser: true */
/* jshint node: true */

'use strict';

const canvas = document.querySelector('#myCanvas');
var width  = window.innerWidth;
canvas.width = width;
if (width == 0) {
    width = screen.width; // for safari
}

var height =  window.innerHeight;
if (height == 0) {
    height = screen.height; // for safari
}
const ctx = canvas.getContext('2d');
const gmaxy = height * 0.65;
const gminy = height * 0.05;
const gmaxx = width * 0.9;
const gminx = width * 0.1;
canvas.height = height * 0.8;
var fontsz = 24 / 1000 * height;
ctx.font = (fontsz|0) + 'px Georgia';
var year_array = [];

function run_model() {
    initialize_graph();
    let pop_size = document.querySelector("#N").value;
    let p0 = document.querySelector("#p0").value;
    let gens = document.querySelector("#gens").value;
    let pops = document.querySelector("#pops").value;
    let WAA = document.querySelector("#WAA").value;
    let WAa = document.querySelector("#WAa").value;
    let Waa = document.querySelector("#Waa").value;
    var fA = p0;
    var freq_array = []
    for (let m = 0; m <= pops; m++) {
        let p_array = []
        for (let n = 0; n < gens; n++) {
            p_array.push(p0)
        }
        freq_array.push(p_array)
    }
 
    let year_int = gens / 5;
    for (let j = 0; j <= 10; j++) {
        ctx.fillText(j*year_int, gminx + j/5 * (gmaxx - gminx) - 12, canvas.height * 0.85);        
    }
    ctx.fillText("Blue line shows outcome without genetic drift", gmaxx *0.1, height * 0.72);
    for (let k = 0; k < pops; k++) {
        freq_array[k][0] = p0;
    }
    
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 1;
    
    for (let gen_ct = 1; gen_ct <= gens; gen_ct++) {
        var last_gen = gen_ct -1
        for(let k = 0; k < pops; k++) {
            year_array.push(gen_ct);
            let pop_ct = 0;
            let Geno_AA_ct = 0;
            let Geno_Aa_ct = 0;
            let Geno_aa_ct = 0;
            if (gen_ct > 0) {
                fA = freq_array[k][gen_ct - 1]
            }
            while (pop_ct <= pop_size) {
                let x = Math.random();
                let y = Math.random();
                let surv = Math.random();
                if (x <= fA) {
                    if (y <= fA){
                        if (surv <= WAA){
                            Geno_AA_ct++;
                            pop_ct++;
                        }
                    } else {
                        if (surv <= WAa){
                            Geno_Aa_ct++;
                            pop_ct++;
                        }
                    }
                } else {
                    if (y <= fA){
                        if (surv <= WAa){
                            Geno_Aa_ct++;
                            pop_ct++;
                        }
                    } else {
                        if (surv <= Waa){
                            Geno_aa_ct++;
                            pop_ct++;
                        }
                    }
                }
            }
            fA = (((2 * Geno_AA_ct) + Geno_Aa_ct)/(2 * pop_ct));
            freq_array[k][gen_ct] = fA;
            let lastf = freq_array[k][gen_ct-1];
            let lasty = gmaxy - lastf * (gmaxy-gminy);
            let lastx = gminx + (gmaxx-gminx) / gens * last_gen;
            let nextx = lastx + (gmaxx-gminx) / gens;
            let nexty = gmaxy - fA * (gmaxy-gminy);
            // console.log(k, lastx, lasty, nextx, nexty);
            ctx.strokeStyle = 'rgb(0, 0, 0)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lastx,lasty);
            ctx.lineTo(nextx, nexty);
            ctx.stroke();
        } 
        ctx.strokeStyle = 'rgb(0,0,255)';
        let lastf = freq_array[pops][gen_ct-1];
        let lasty = gmaxy - lastf * (gmaxy-gminy);
        let lastx = gminx + (gmaxx-gminx) / gens * last_gen;
        let nextx = lastx + (gmaxx-gminx) / gens;
        fA = (lastf * lastf * WAA + lastf * (1 - lastf) * WAa) / (lastf * lastf * WAA + 2 * lastf * (1 - lastf) * WAa + (1-lastf) * (1-lastf) * Waa)
        freq_array[pops][gen_ct] = fA
        let nexty = gmaxy - fA * (gmaxy-gminy);
        ctx.beginPath();
        ctx.moveTo(lastx,lasty);
        ctx.lineTo(nextx, nexty);
        ctx.stroke();

    }
    let fixct = 0;
    let lossct = 0;
    let polyct = 0;
    for (let q = 0; q < pops; q++) {
        if (freq_array[q][gens-1] == 1){
            fixct ++
        } 
        if (freq_array[q][gens-1] == 0){
            lossct++
        }
    }
    ctx.fillStyle = 'black';
    //ctx.font = '12px georgia';
    let fixmsg = "Fixed: " + fixct;
    let lossmsg = "Lost: " + lossct;
    ctx.fillText(fixmsg, gmaxx * 0.9, canvas.height * 0.05);
    ctx.fillText(lossmsg, gmaxx * 0.9, canvas.height * 0.9);
        
}


function initialize_graph() {
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
    ctx.moveTo(gminx, gminy);
    ctx.lineTo(gminx, gmaxy);
    ctx.stroke();
    ctx.lineTo(gmaxx, gmaxy)
    ctx.stroke()

    //label axes
    ctx.fillStyle = 'black';
    //ctx.font = '12px georgia';
    ctx.fillText("Generations", gmaxx * 0.48, height * 0.7);
    


    ctx.save();
    ctx.translate(gminx * 0.25, gmaxy * 0.5);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText("f(A)", 0, 0);
    ctx.restore();

    for (let j = 0; j <= 5; j++) {
        let i = j / 5;
        ctx.fillText(i, gminx * 0.4, gmaxy - (i * (gmaxy - gminy) - 10/height));
    }
    // let years = 500;
    // let year_int = years / 10;
    // for (let j = 0; j <= 10; j++) {
    //     ctx.fillText(j*year_int, gminx + j/10 * (gmaxx - gminx) - 12, canvas.height * .85);
    // }
}

window.onload = function() {
    initialize_graph();
};