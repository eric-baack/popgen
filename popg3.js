/* javascript for popg3.html, showing effects of drift on popn differentiation */
/* E. Baack, Feb 2022.  Working. */

/* jshint esversion: 8 */
/* jshint browser: true */
/* jshint node: true */

'use strict';

var year_array = [];
const canvas = document.querySelector('#myCanvas');
const width  = window.innerWidth;
canvas.width = width;

const height = window.innerHeight;
canvas.height = height * 0.5;
const ctx = canvas.getContext('2d');
const g1maxy = canvas.height * 0.9;
const g1miny = canvas.height * 0.05;
const g1maxx = canvas.width * 0.45;
const g1minx = canvas.width * 0.1;
const g2maxy = canvas.height * 0.9;
const g2miny = canvas.height * 0.05;
const g2maxx = canvas.width * 0.9;
const g2minx = canvas.width * 0.55;


function run_model() {
    let pop_size1 = document.querySelector("#N1").value;
    let pop_size2 = document.querySelector("#N2").value;
    // When adding, these were adding text, not integers!
    pop_size1 = parseInt(pop_size1,10);
    pop_size2 = parseInt(pop_size2,10)
    let gens = document.querySelector("#gens").value;
    var p0 = 0.5;
    var pops = 5;
    var freq_array = [];
    // store frequencies in array by population, population, gen_ct
    for (let p = 0; p < 2; p++) {
        let g_array = []
        for (let m = 0; m <= gens; m++) {
            let p_array = [];
            for (let n = 0; n < pops; n++) {
                p_array.push(p0);
            }
            g_array.push(p_array);
        }
        freq_array.push(g_array)
    }   
    
    let fA = p0;
    for (let gen_ct = 1; gen_ct <= gens; gen_ct++) {
        var last_gen = gen_ct - 1;
        for (let p = 0; p < 2; p++) {
            if (p == 0) {
                var pop_size = pop_size1;
            } else {
                var pop_size = pop_size2;
            }
            for(let k = 0; k < pops; k++) {
                year_array.push(gen_ct);
                let pop_ct = 0;
                let Geno_AA_ct = 0;
                let Geno_Aa_ct = 0;
                let Geno_aa_ct = 0;
                let WAA = 1;
                let WAa = 1;
                let Waa = 1;
                if (gen_ct > 0) {
                    fA = freq_array[p][gen_ct - 1][k];
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
                freq_array[p][gen_ct][k] = fA;
            }
    
        }
        var lastx, lasty, nextx, nexty;
        for (let p = 0; p < 2; p++) {
            for (let k = 0; k < 5; k++) {
                let lastf = freq_array[p][gen_ct-1][k];
                if (p == 0) {
                    lasty = g1maxy - lastf * (g1maxy-g1miny);
                    lastx = g1minx + (g1maxx-g1minx) / gens * last_gen;
                    nextx = lastx + (g1maxx-g1minx) / gens;
                    nexty = g1maxy - freq_array[p][gen_ct][k] * (g1maxy-g1miny);
                }
                else {
                    lasty = g2maxy - lastf * (g1maxy-g1miny);
                    lastx = g2minx + (g2maxx-g2minx) / gens * last_gen;
                    nextx = lastx + (g2maxx-g2minx) / gens;
                    nexty = g2maxy - freq_array[p][gen_ct][k] * (g2maxy-g2miny);
                }
                //console.log(k, lastx, lasty, nextx, nexty);
                switch(k) {
                    case 0:
                        ctx.strokeStyle = 'rgb(0, 0, 0)';
                        break;
                    case 1:
                        ctx.strokeStyle = 'rgb(255, 0, 0)';
                        break;
                    case 2:
                        ctx.strokeStyle = 'rgb(0, 255, 0)';
                        break;
                    case 3:
                        ctx.strokeStyle = 'rgb(0, 0, 255)';
                        break;
                    case 4:
                        ctx.strokeStyle = 'rgb(180, 180, 180)';
                }
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(lastx,lasty);
                ctx.lineTo(nextx, nexty);
                ctx.stroke();
            } 

        }
            
        //update arrays
        if (gen_ct % 50 == 0) {
                //console.log(freq_array);
                let P1A = document.querySelector("#P1A");
                let P1B = document.querySelector("#P1B");
                let P1C = document.querySelector("#P1C");
                let P1D = document.querySelector("#P1D");
                let P1E = document.querySelector("#P1E");
                let P2A = document.querySelector("#P2A");
                let P2B = document.querySelector("#P2B");
                let P2C = document.querySelector("#P2C");
                let P2D = document.querySelector("#P2D");
                let P2E = document.querySelector("#P2E");
                P1A.innerText = freq_array[0][gen_ct][0].toFixed(3);
                P1B.innerText = freq_array[0][gen_ct][1].toFixed(3);
                P1C.innerText = freq_array[0][gen_ct][2].toFixed(3);
                P1D.innerText = freq_array[0][gen_ct][3].toFixed(3);
                P1E.innerText = freq_array[0][gen_ct][4].toFixed(3);
                P2A.innerText = freq_array[1][gen_ct][0].toFixed(3);
                P2B.innerText = freq_array[1][gen_ct][1].toFixed(3);
                P2C.innerText = freq_array[1][gen_ct][2].toFixed(3);
                P2D.innerText = freq_array[1][gen_ct][3].toFixed(3);
                P2E.innerText = freq_array[1][gen_ct][4].toFixed(3);
        }
    }
    var fst_array = []
    for (let l = 0; l < 5; l++) {
        let p1 = freq_array[0][gens-1][l];
        let p2 = freq_array[1][gens-1][l];
        let pnum = ((p1 * pop_size1) + (p2 * pop_size2));
        let pden = (pop_size1 + pop_size2);
        let pbar = pnum / pden;
        let HT = 2 * pbar * (1 - pbar);  
        let HS = ((2 * p1 * (1-p1) * pop_size1) + (2 * p2 * (1-p2) * pop_size2)) / (pop_size1 + pop_size2);
        let Fst = (HT - HS)/ HT;
        fst_array.push(Fst);
    }
    let FSTA = document.querySelector("#Fst-A");
    let FSTB = document.querySelector("#Fst-B");
    let FSTC = document.querySelector("#Fst-C");
    let FSTD = document.querySelector("#Fst-D");
    let FSTE = document.querySelector("#Fst-E");
    FSTA.innerText = fst_array[0].toFixed(3);
    FSTB.innerText = fst_array[1].toFixed(3);
    FSTC.innerText = fst_array[2].toFixed(3);
    FSTD.innerText = fst_array[3].toFixed(3);
    FSTE.innerText = fst_array[4].toFixed(3);
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

    //label axes
    ctx.fillStyle = 'black';
    ctx.font = '24px georgia';
    ctx.fillText("Generations", g1maxx *0.48, canvas.height * 0.93);
    ctx.fillText("Generations", g2maxx *0.78, canvas.height * 0.93);
    ctx.save();
    ctx.translate(g1minx * 0.2, g1maxy * 0.5);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText("f(A)", 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(g2minx * 0.9, g2maxy * 0.5);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText("f(A)", 0, 0);
    ctx.restore();

    for (let j = 0; j <= 10; j++) {
        let i = j / 10;
        ctx.fillText(i, g1minx * 0.6, g1maxy - (i * (g1maxy - g1miny) - 11));
        ctx.fillText(i, g2minx * 0.93, g2maxy - (i * (g1maxy - g1miny) - 11));
    }
    // let years = 500;
    // let year_int = years / 10;
    // for (let j = 0; j <= 10; j++) {
    //     ctx.fillText(j*year_int, gminx + j/10 * (gmaxx - gminx) - 12, canvas.height * .85);
    // }
}

window.onload = function() {
    initialize_graphs();
};

// next, generate vector of positions.  Use existing code for gen_ct, fA
// translate gen_ct into x position:  xpos = gminx + (gmaxx - gminx) * (gen_ct / gen_max)
// translate f(A) into Y position:  ypos = gminy - f(A) * (gmaxy - gminy)
// This might work!

function degToRad(degrees) {
    return degrees * Math.PI / 180;
};