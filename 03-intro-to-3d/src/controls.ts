import {config} from "./config.js";
import * as Utils from "./utils.js";
import * as Main from "./main.js";

// Control Box functions

export let updateCanvasSize = function(width, height) {
    
    let canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;
    if (width === undefined) {
        width = 100 * canvas.width / window.innerWidth;
    }
    else{
        width = Number(width);  
    }
    if (height === undefined) {
        height = 100 * canvas.height / window.innerHeight;
    }
    else {
        height =  Number(height);
    }

    config.CANVAS_WIDTH = window.innerWidth * width / 100;
    config.CANVAS_HEIGHT = window.innerHeight * height / 100;

    //Update controls displayed value
    $('#width-in-pixels').html(String(config.CANVAS_WIDTH.toFixed(2)) + "px");
    $('#width-proportion').html(String(width.toFixed(0)) + "%");
    $('#height-in-pixels').html(String(config.CANVAS_HEIGHT.toFixed(2)) + "px");
    $('#height-proportion').html(String(height.toFixed(0)) + "%")


    try {
        cancelAnimationFrame(Main.animationID);
        Main.introTo3D(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, canvas);
    }
    catch(e) {
        Utils.showError(`Uncaught exception: ${e}`);
    } 
        

}

let playOrPauseAnimation = function(button_image) {
    if (button_image.attributes[2].nodeValue === 'playing') {
        button_image.attributes[2].nodeValue = 'paused';
        button_image.src = './assets/pause.png';
        Main.animationStatus[0] = 'paused';
    }
    else {
        button_image.attributes[2].nodeValue = 'playing';
        button_image.src = './assets/play.png';
        Main.animationStatus[0] = 'play';
    }
} 

export let initialize = () => {

    document.getElementById('play-pause-button').addEventListener('click', (event) => { playOrPauseAnimation(event.target); });    
    
    document.getElementById('canvas-width').addEventListener('input', (event) => {
        let element = event.target as HTMLInputElement;
        updateCanvasSize(element.value, undefined)}
    );
    
    document.getElementById('canvas-height').addEventListener('input', (event) => {
        let element = event.target as HTMLInputElement;
        updateCanvasSize(undefined, element.value)}
    );
    
    $('#width-in-pixels').html(String(config.CANVAS_WIDTH) + "px");
    $('#width-proportion').html(String(100) + "%")
    $('#height-in-pixels').html(String(config.CANVAS_HEIGHT) + "px");
    $('#height-proportion').html(String(100) + "%")
    
    let canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;
    canvas.width = config.CANVAS_WIDTH;
    canvas.height = config.CANVAS_HEIGHT;

};