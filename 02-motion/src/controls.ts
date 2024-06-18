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
        Main.motionDemonstration(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Main.canvas);
    } 
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
}
export let updateCanvasSize = function(width, height) {
    
    let canvas = document.getElementById("demo-canvas") as HTMLCanvasElement;
    if (width === undefined) {
        width = 100 * canvas.width / window.innerWidth;
    }
    if (height === undefined) {
        height = 100 * canvas.height / window.innerHeight;
    }

    width = Number(width);
    height = Number(height);

    config.CANVAS_WIDTH = window.innerWidth * width / 100;
    config.CANVAS_HEIGHT = window.innerHeight * height / 100;

   

    //Update controls displayed value
    $('#width-in-pixels').html(String(config.CANVAS_WIDTH.toFixed(2)) + "px");
    $('#width-proportion').html(String(width.toFixed(0)) + "%");
    $('#height-in-pixels').html(String(config.CANVAS_HEIGHT.toFixed(2)) + "px");
    $('#height-proportion').html(String(height.toFixed(0)) + "%")

    try {
        
        Main.interval_ID_UpdateParametersDisplay_List.forEach(intervalID => {
            clearInterval(intervalID);                    
        });

        Main.interval_ID_UpdateBoundingBox_List.forEach(intervalID => {
            clearInterval(intervalID);                    
        });

        $('#objects-list').empty();

        cancelAnimationFrame(Main.animationID);
        Main.motionDemonstration(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Main.canvas);
    }
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
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
            updateParameterValue(target.id, Number(target.value)) });
    }); 
    
    document.getElementById('canvas-width').addEventListener('change', (event) => {
        let element = event.target as HTMLInputElement;
        updateCanvasSize(element.value, undefined)}
    );
    
    document.getElementById('canvas-height').addEventListener('change', (event) => {
        let element = event.target as HTMLInputElement;
        updateCanvasSize(undefined, element.value)}
    );
    
    document.getElementById('offsetX').addEventListener('change', (event) => {
        let element = event.target as HTMLInputElement;
        updateOffsetX(element.value);
        }
    );
    
    document.getElementById('offsetY').addEventListener('change', (event) => {
        let element = event.target as HTMLInputElement;
        updateOffsetY(element.value);  
    }
        
    );
    
    document.getElementById('scale').addEventListener('change', (event) => {
        let element = event.target as HTMLInputElement;
        updateScale(element.value);
        }
    );

    $('#width-in-pixels').html(String(config.CANVAS_WIDTH) + "px");
    $('#width-proportion').html(String(100) + "%")
    $('#height-in-pixels').html(String(config.CANVAS_HEIGHT) + "px");
    $('#height-proportion').html(String(100) + "%")

};

