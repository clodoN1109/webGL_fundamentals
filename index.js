import { createApp } from 'vue';
import Card from './components/Card.js';
import Sentence from './components/Sentence.js';
import App from './App.js';

let app = createApp(App);
app.component('card', Card);
app.component('sentence', Sentence);
app.mount('#lessons-app');


