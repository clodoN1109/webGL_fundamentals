"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.updateCanvasSize = void 0;
const config_js_1 = require("./config.js");
const Main = __importStar(require("./main.js"));
const utils = __importStar(require("./utils.js"));
const Shapes = __importStar(require("./shapes.js"));
// Control Box functions
let updateParameterValue = function (parameter_id, new_value) {
    config_js_1.config[parameter_id] = Number(new_value);
};
let updateTriangle = function (new_value, vertex_number, coordinate_number) {
    Shapes.triangleVertices[vertex_number * 2 + coordinate_number] = new_value;
    try {
        cancelAnimationFrame(Main.animationID);
        Main.motionDemonstration(config_js_1.config.CANVAS_WIDTH, config_js_1.config.CANVAS_HEIGHT, Main.canvas);
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
    width = Number(width);
    height = Number(height);
    config_js_1.config.CANVAS_WIDTH = window.innerWidth * width / 100;
    config_js_1.config.CANVAS_HEIGHT = window.innerHeight * height / 100;
    //Update controls displayed value
    $('#width-in-pixels').html(String(config_js_1.config.CANVAS_WIDTH.toFixed(2)) + "px");
    $('#width-proportion').html(String(width.toFixed(0)) + "%");
    $('#height-in-pixels').html(String(config_js_1.config.CANVAS_HEIGHT.toFixed(2)) + "px");
    $('#height-proportion').html(String(height.toFixed(0)) + "%");
    try {
        Main.interval_ID_UpdateParametersDisplay_List.forEach(intervalID => {
            clearInterval(intervalID);
        });
        Main.interval_ID_UpdateBoundingBox_List.forEach(intervalID => {
            clearInterval(intervalID);
        });
        $('#objects-list').empty();
        cancelAnimationFrame(Main.animationID);
        Main.motionDemonstration(config_js_1.config.CANVAS_WIDTH, config_js_1.config.CANVAS_HEIGHT, Main.canvas);
    }
    catch (e) {
        utils.showError(`Uncaught exception: ${e}`);
    }
};
exports.updateCanvasSize = updateCanvasSize;
let updateOffsetX = function (new_offsetX) {
    new_offsetX = Number(new_offsetX);
    config_js_1.config.OFFSET_X = new_offsetX;
    //Update controls displayed value
    $('#origin-x-in-pixels').html(String((config_js_1.config.CANVAS_WIDTH / 2 * new_offsetX).toFixed(2)) + "px");
    $('#origin-x-proportion').html(String((100 / 2 * new_offsetX).toFixed(0)) + "%");
};
let updateOffsetY = function (new_offsetY) {
    config_js_1.config.OFFSET_Y = Number(new_offsetY);
    //Update controls displayed value
    $('#origin-y-in-pixels').html(String((config_js_1.config.CANVAS_HEIGHT / 2 * new_offsetY).toFixed(2)) + "px");
    $('#origin-y-proportion').html(String((100 / 2 * new_offsetY).toFixed(0)) + "%");
};
let updateScale = function (new_scale) {
    config_js_1.config.SCALE = Number(new_scale);
    //Update controls displayed value
    $('#scale-display-value').html(String((config_js_1.config.SCALE).toFixed(0)) + "X");
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
let initialize = () => {
    document.getElementById('play-pause-button').addEventListener('click', (event) => { playOrPauseAnimation(event.target); });
    document.querySelectorAll('.argument-input').forEach(element => {
        element.addEventListener('change', (event) => {
            let target = event.target;
            updateParameterValue(target.id, Number(target.value));
        });
    });
    document.getElementById('canvas-width').addEventListener('change', (event) => {
        let element = event.target;
        (0, exports.updateCanvasSize)(element.value, undefined);
    });
    document.getElementById('canvas-height').addEventListener('change', (event) => {
        let element = event.target;
        (0, exports.updateCanvasSize)(undefined, element.value);
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
    $('#width-in-pixels').html(String(config_js_1.config.CANVAS_WIDTH) + "px");
    $('#width-proportion').html(String(100) + "%");
    $('#height-in-pixels').html(String(config_js_1.config.CANVAS_HEIGHT) + "px");
    $('#height-proportion').html(String(100) + "%");
};
exports.initialize = initialize;
