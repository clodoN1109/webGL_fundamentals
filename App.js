export default {

    data() {
        return {
          showCardExtension: false,
        }
    },

    methods: {

        extendCard(card) {

            this.showCardExtension = true;
            let cardExtension = card.getElementsByClassName('card-extension')[0];
            cardExtension.style.opacity = 1;
            cardExtension.style.width = 'max-content';
            
            let cardCover = card.getElementsByClassName('card-cover')[0];
            cardCover.src = `./assets/${card.id}.gif`;
        },
        shrinkCard(card) {

            this.showCardExtension = false;
            let cardExtension = card.getElementsByClassName('card-extension')[0];
            cardExtension.style.opacity = 0;
            cardExtension.style.width = '0';

            let cardCover = card.getElementsByClassName('card-cover')[0];
            cardCover.src = `./assets/${card.id}.png`;
        }

    },

    template: 
        /*html*/
        `
        <div class="horizontal-bar">
        
            <div class="card" id="shapes" @mouseenter="extendCard($event.target)" @mouseleave="shrinkCard($event.target)">

                <img class="card-cover" src="./assets/shapes.png" alt="Shapes and Colors"/>

                <div class="card-extension" v-show="showCardExtension" >

                    <p class="card-title">SHAPES AND COLORS</p>
                
                    <ul class="card-description">
                        <li> Understand the clip space abstraction</li> 
                        <li> Draw euclidean polygons </li>
                        <li> Define color patterns </li>
                        <li> Set position and scale with units </li> 
                        <li> Understand the Canvas and the 3D context objects </li>
                    </ul>

                    <div class="links-container">

                        <div class="card-links">

                            <a href="" > 
                                <img src="./assets/github.png" alt="Project's Source Code">
                            </a>
                            <a href="" > 
                                <img src="./assets/youtube.png" alt="Video Tutorials">
                            </a>
                            <a href="" > 
                                <img src="./assets/medium.png" alt="Text Tutorials">
                            </a>
                            <a href="./01-shapes/index.html" > 
                                <img src="./assets/web.png" alt="Online Demo">
                            </a>

                        </div>

                        <p class="link-description">SOURCE CODE</p>


                    </div>

                </div>
                
            </div>

            <div class="card" id="3D" @mouseenter="extendCard($event.target)" @mouseleave="shrinkCard($event.target)">

            <img class="card-cover" src="./assets/3D.png" alt="Shapes and Colors"/>

            <div class="card-extension" v-show="showCardExtension" >

                <p class="card-title">SHAPES AND COLORS</p>
            
                <ul class="card-description">
                    <li> Understand the clip space abstraction</li> 
                    <li> Draw euclidean polygons </li>
                    <li> Define color patterns </li>
                    <li> Set position and scale with units </li> 
                    <li> Understand the Canvas and the 3D context objects </li>
                </ul>

                <div class="links-container">

                    <div class="card-links">

                        <a href="" > 
                            <img src="./assets/github.png" alt="Project's Source Code">
                        </a>
                        <a href="" > 
                            <img src="./assets/youtube.png" alt="Video Tutorials">
                        </a>
                        <a href="" > 
                            <img src="./assets/medium.png" alt="Text Tutorials">
                        </a>
                        <a href="./01-shapes/index.html" > 
                            <img src="./assets/web.png" alt="Online Demo">
                        </a>

                    </div>

                    <p class="link-description">SOURCE CODE</p>


                </div>

            </div>
            
        </div>


        </div>


    `

}
