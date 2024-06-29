import {config} from "./config.js";
import * as Main from "./main.js";
import * as utils from "./utils.js";
import * as Shapes from "./shapes.js";

// Control Box functions
let updateParameterValue = function (parameter_id, new_value) {
    config[parameter_id] = Number(new_value);
}
let updateTriangle = function(new_value, vertex_number, coordinate_number) {
    Shapes.triangleVertices[vertex_number * 2 + coordinate_number] = new_value;
    try {
        cancelAnimationFrame(Main.animationID);
        Main.motionDemonstration(Main.canvas);
    } 
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
}
export let updateCanvasWidth = function(width) {
    
    let canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;

    width = Number(width);

    config.CANVAS_WIDTH = window.innerWidth * width / 100;

    //Update controls displayed value
    $('#width-in-pixels').html(String(config.CANVAS_WIDTH.toFixed(2)) + "px");
    $('#width-proportion').html(String(width.toFixed(0)) + "%");

}

export let updateCanvasHeight = function(height) {
    
    let canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;

    height = Number(height);

    config.CANVAS_HEIGHT = window.innerHeight * height / 100;

    //Update controls displayed value
    $('#height-in-pixels').html(String(config.CANVAS_HEIGHT.toFixed(2)) + "px");
    $('#height-proportion').html(String(height.toFixed(0)) + "%")

}

let updateOffsetX = function(new_offsetX) {

    new_offsetX = Number(new_offsetX);

    config.OFFSET_X = new_offsetX;
    
    //Update controls displayed value
    $('#origin-x-in-pixels').html(String((config.CANVAS_WIDTH/2 * new_offsetX).toFixed(2)) + "px");
    $('#origin-x-proportion').html(String((100/2 * new_offsetX).toFixed(0)) + "%");


}
let updateOffsetY = function (new_offsetY) {
    config.OFFSET_Y = Number(new_offsetY);

    //Update controls displayed value
    $('#origin-y-in-pixels').html(String((config.CANVAS_HEIGHT/2 * new_offsetY).toFixed(2)) + "px");
    $('#origin-y-proportion').html(String((100/2 * new_offsetY).toFixed(0)) + "%");    


}
let updateScale = function(new_scale) {
    config.SCALE = Number(new_scale);

        //Update controls displayed value
        $('#scale-display-value').html(String((config.SCALE).toFixed(0)) + "X");

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
    
    document.querySelectorAll('.argument-input').forEach(element => {
        element.addEventListener('change', (event) => { 
            let target = event.target as HTMLInputElement;
            let value = Number(target.value);

            // Precation against SPAWN_TIME < 0
            if (value <= 0) {
                value = 0.005;
            }

            updateParameterValue(target.id, Number(value)) });
    }); 
    
    document.getElementById('canvas-width').addEventListener('input', (event) => {
        let element = event.target as HTMLInputElement;
        updateCanvasWidth(element.value)}
    );
    
    document.getElementById('canvas-height').addEventListener('input', (event) => {
        let element = event.target as HTMLInputElement;
        updateCanvasHeight(element.value)}
    );
    
    document.getElementById('offsetX').addEventListener('input', (event) => {
        let element = event.target as HTMLInputElement;
        updateOffsetX(element.value);
        }
    );
    
    document.getElementById('offsetY').addEventListener('input', (event) => {
        let element = event.target as HTMLInputElement;
        updateOffsetY(element.value);  
    }
        
    );
    
    document.getElementById('scale').addEventListener('input', (event) => {
        let element = event.target as HTMLInputElement;
        updateScale(element.value);
        }
    );

    $('#width-in-pixels').html(String(config.CANVAS_WIDTH) + "px");
    $('#width-proportion').html(String(100) + "%")
    $('#height-in-pixels').html(String(config.CANVAS_HEIGHT) + "px");
    $('#height-proportion').html(String(100) + "%")

};

