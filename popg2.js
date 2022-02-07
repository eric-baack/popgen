/* javascript for popg2.html, showing effects of drift on diversity */
/* E. Baack, Feb 2022.  Working. */

/* jshint esversion: 8 */
/* jshint browser: true */
/* jshint node: true */

'use strict';

const canvas = document.querySelector('#myCanvas');
const width  = window.innerWidth;
canvas.width = width;

const height =  window.innerHeight;
const ctx = canvas.getContext('2d');
const gmaxy = height * .65;
const gminy = height * .05;
const gmaxx = width * .9;
const gminx = width * .1;
canvas.height = height * .8;
var year_array = [];

function run_model() {
    initialize_graph();
    let pop_size = document.querySelector("#N").value;
    var p0 = 0.2;
    var gens = 1000;
    var freq_array = [];
    // freqs stored by generation; 5 freqs per generation
    for (let m = 0; m <= gens; m++) {
        let p_array = [0.2, 0.2, 0.2, 0.2, 0.2];
        freq_array.push(p_array);
    }
 
    let year_int = gens / 10;
    for (let j = 0; j <= 10; j++) {
        ctx.fillText(j*year_int, gminx + j/10 * (gmaxx - gminx) - 12, canvas.height * .85);
    }
    
    let fA = p0;
    for (let gen_ct = 1; gen_ct <= gens; gen_ct++) {
        //console.log(gen_ct);
        var last_gen = gen_ct -1;
        year_array.push(gen_ct);
        let allele_ct = 0;
        let allele_array = [0,0,0,0,0];
        while (allele_ct <= 2 * pop_size) {
            let x = Math.random();
            var determined = false;
            let i = 0;
            let freqsum = 0;
            while (! determined) {
                freqsum += freq_array[last_gen][i];
                if (x <= freqsum) {
                    allele_array[i]++;
                    allele_ct++;
                    determined = true;
                }
                i++;
            }
        }
        for (let j = 0; j < 5; j++) {
            freq_array[gen_ct][j] = allele_array[j] / (pop_size * 2)
        }
        for (let k = 0; k < 5; k++) {
            let lastf = freq_array[gen_ct-1][k];
            let lasty = gmaxy - lastf * (gmaxy-gminy);
            let lastx = gminx + (gmaxx-gminx) / gens * last_gen;
            let nextx = lastx + (gmaxx-gminx) / gens;
            let nexty = gmaxy - freq_array[gen_ct][k] * (gmaxy-gminy);
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
    let fixct = 0
    let lossct = 0
    let polyct = 0
    for (let q = 0; q < 5; q++) {
        if (freq_array[gens-1][q] == 1){
            fixct ++;
        } 
        if (freq_array[gens-1][q] == 0){
            lossct++;
        }
    }
    ctx.fillStyle = 'black';
    ctx.font = '12px georgia';
    let remmsg = "Alleles remaining: " + (5 - fixct - lossct)
    ctx.fillText(remmsg, gmaxx * 0.8, canvas.height * 0.9);

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
    ctx.font = '12px georgia';
    ctx.fillText("Generations", gmaxx *0.48, canvas.height * 0.9)
    ctx.fillText("Five alleles at one locus, each with starting frequency of 0.2", gmaxx *.35, canvas.height * 0.92);
    ctx.fillText("All genotypes have equivalent fitnesses.", gmaxx *0.35, canvas.height * 0.94);


    ctx.save();
    ctx.translate(gminx * .2, gmaxy * .5);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText("f(A)", 0, 0);
    ctx.restore();

    for (let j = 1; j <= 10; j++) {
        let i = j / 10;
        ctx.fillText(i, gminx * 0.5, gmaxy - (i * (gmaxy - gminy) - 11));
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

// next, generate vector of positions.  Use existing code for gen_ct, fA
// translate gen_ct into x position:  xpos = gminx + (gmaxx - gminx) * (gen_ct / gen_max)
// translate f(A) into Y position:  ypos = gminy - f(A) * (gmaxy - gminy)
// This might work!

function degToRad(degrees) {
    return degrees * Math.PI / 180;
};