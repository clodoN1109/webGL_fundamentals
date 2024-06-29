import { createApp } from 'vue';
import App from './learning-app.js';
import LearningSection from './components/LearningSection.js';
import Card from './components/Card.js';
import HeaderA from './components/Header-A.js';
import LibrarySelector from './components/LibrarySelector.js';
import Sentence from './components/Sentence.js';


let app = createApp(App);
app.component('headerA', HeaderA);
app.component('learningSection', LearningSection);
app.component('card', Card);
app.component('librarySelector', LibrarySelector);
app.component('sentence', Sentence);
app.mount('#learning-app');


