import * as Config from "./config.js";
import * as Main from "./main.js";
import * as utils from "./utils.js";
// Control Box functions
let updateParameterValue = function (parameter_id, new_value) {
    Config.config[parameter_id] = Number(new_value);
};
let updateTriangle = function (new_value, vertex_number, coordinate_number) {
    Main.triangleVertices[vertex_number * 2 + coordinate_number] = new_value;
    try {
        cancelAnimationFrame(Main.animationID);
        Main.motionAndColor(Config.config.CANVAS_WIDTH, Config.config.CANVAS_HEIGHT, Config.config.SCALE, Config.config.OFFSET_X, Config.config.OFFSET_Y);
    }
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
};
let updateCanvasSize = function (width, height) {
    let canvas = document.getElementById("demo-canvas");
    if (width === undefined) {
        width = 100 * canvas.width / window.innerWidth;
    }
    if (height === undefined) {
        height = 100 * canvas.height / window.innerHeight;
    }
    Config.config.CANVAS_WIDTH = window.innerWidth * width / 100;
    Config.config.CANVAS_HEIGHT = window.innerHeight * height / 100;
    try {
        cancelAnimationFrame(Main.animationID);
        Main.motionAndColor(Config.config.CANVAS_WIDTH, Config.config.CANVAS_HEIGHT, Config.config.SCALE, Config.config.OFFSET_X, Config.config.OFFSET_Y);
    }
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
};
let updateOffsetX = function (new_offsetX) {
    Config.config.OFFSET_X = new_offsetX / 100 * window.innerWidth;
    try {
        cancelAnimationFrame(Main.animationID);
        Main.motionAndColor(Config.config.CANVAS_WIDTH, Config.config.CANVAS_HEIGHT, Config.config.SCALE, Config.config.OFFSET_X, Config.config.OFFSET_Y);
    }
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
};
let updateOffsetY = function (new_offsetY) {
    Config.config.OFFSET_Y = new_offsetY / 100 * window.innerHeight;
    try {
        cancelAnimationFrame(Main.animationID);
        Main.motionAndColor(Config.config.CANVAS_WIDTH, Config.config.CANVAS_HEIGHT, Config.config.SCALE, Config.config.OFFSET_X, Config.config.OFFSET_Y);
    }
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
};
let updateScale = function (new_scale) {
    Config.config.SCALE = new_scale;
    try {
        cancelAnimationFrame(Main.animationID);
        Main.motionAndColor(Config.config.CANVAS_WIDTH, Config.config.CANVAS_HEIGHT, Config.config.SCALE, Config.config.OFFSET_X, Config.config.OFFSET_Y);
    }
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
};
let playOrPauseAnimation = function (button_image) {
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
};
export let createEventListeners = () => {
    document.getElementById('play-pause-button').addEventListener('click', (event) => { playOrPauseAnimation(event.target); });
    document.querySelectorAll('.argument-input').forEach(element => {
        element.addEventListener('change', (event) => {
            let target = event.target;
            updateParameterValue(target.id, Number(target.value));
        });
    });
    document.getElementById('canvas-width').addEventListener('change', (event) => {
        let element = event.target;
        updateCanvasSize(element.value, undefined);
    });
    document.getElementById('canvas-height').addEventListener('change', (event) => {
        let element = event.target;
        updateCanvasSize(undefined, element.value);
    });
    document.getElementById('offsetX').addEventListener('change', (event) => {
        let element = event.target;
        updateOffsetX(element.value);
    });
    document.getElementById('offsetY').addEventListener('change', (event) => {
        let element = event.target;
        updateOffsetY(element.value);
    });
    document.getElementById('scale').addEventListener('change', (event) => {
        let element = event.target;
        updateScale(element.value);
    });
};
