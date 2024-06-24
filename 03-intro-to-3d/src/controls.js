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
exports.initialize = exports.updateCanvasHeight = exports.updateCanvasWidth = void 0;
const config_js_1 = require("./config.js");
const Main = __importStar(require("./main.js"));
// Control Box functions
let updateCanvasWidth = function (width) {
    let canvas = document.getElementById("demo-canvas");
    config_js_1.config.CANVAS_WIDTH = window.innerWidth * width / 100;
    //Update controls displayed value
    $('#width-in-pixels').html(String(config_js_1.config.CANVAS_WIDTH.toFixed(2)) + "px");
    $('#width-proportion').html(String(width) + "%");
};
exports.updateCanvasWidth = updateCanvasWidth;
let updateCanvasHeight = function (height) {
    let canvas = document.getElementById("demo-canvas");
    config_js_1.config.CANVAS_HEIGHT = window.innerHeight * height / 100;
    //Update controls displayed value
    $('#height-in-pixels').html(String(config_js_1.config.CANVAS_HEIGHT.toFixed(2)) + "px");
    $('#height-proportion').html(String(height) + "%");
};
exports.updateCanvasHeight = updateCanvasHeight;
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
    document.getElementById('canvas-width').addEventListener('input', (event) => {
        let element = event.target;
        (0, exports.updateCanvasWidth)(element.value);
    });
    document.getElementById('canvas-height').addEventListener('input', (event) => {
        let element = event.target;
        (0, exports.updateCanvasHeight)(element.value);
    });
    $('#width-in-pixels').html(String(config_js_1.config.CANVAS_WIDTH) + "px");
    $('#width-proportion').html(String(100) + "%");
    $('#height-in-pixels').html(String(config_js_1.config.CANVAS_HEIGHT) + "px");
    $('#height-proportion').html(String(100) + "%");
    let canvas = document.getElementById("demo-canvas");
    canvas.width = config_js_1.config.CANVAS_WIDTH;
    canvas.height = config_js_1.config.CANVAS_HEIGHT;
};
exports.initialize = initialize;
