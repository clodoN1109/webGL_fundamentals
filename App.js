export default {

    data() {
        return {
            animationDuration: 0.5 // seconds
        }
    },

    methods: {

        extendCard(card) {

            let cardID = card.id;
        
            let cardExtension = $(`#${cardID}`).find('.card-extension')[0];
            cardExtension.style.transition = `${this.animationDuration}s width, ${this.animationDuration}s ${this.animationDuration/2}s opacity`;
            cardExtension.style.opacity = 1;
            cardExtension.style.width = '30vw';
            
            let cardCover = card.getElementsByClassName('card-cover')[0];
            cardCover.src = `./assets/${card.id}.gif`;

            cardExtension.childNodes.forEach(element => {
                element.style.display = 'initial';
            });;
        },
        shrinkCard(card) {

            let cardID = card.id;

            let cardExtension = $(`#${cardID}`).find('.card-extension')[0];
            cardExtension.style.transition = `${this.animationDuration/2}s ${this.animationDuration/2}s width, ${this.animationDuration}s opacity`;
            cardExtension.style.opacity = 0;
            cardExtension.style.width = '0';
            
            setTimeout(() => {
                cardExtension.childNodes.forEach(element => {
                    element.style.display = 'none';
                });;
                    
            }, this.animationDuration);
            
            let cardCover = card.getElementsByClassName('card-cover')[0];
            cardCover.src = `./assets/${card.id}.png`;
        },
        updateLinkDescription(element) {
            element.parentNode.parentNode.parentNode.getElementsByClassName('link-description')[0].innerHTML = element.alt;
            $(`${element.id}`).innerHTML = element.alt;
        },
        clearLinkDescription(element) {
            element.parentNode.parentNode.parentNode.getElementsByClassName('link-description')[0].innerHTML = '';
        }

    },

    template: 
        /*html*/
        `
        <div class="horizontal-bar">
        
            <div class="card" id="shapes" @mouseenter="extendCard($event.target)" @mouseleave="shrinkCard($event.target)">

                <img class="card-cover" src="./assets/shapes.png" alt="Shapes and Colors"/>

                <div class="card-extension" >

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
                                <img class="link-img" src="./assets/github.png" alt="Source Code" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                            </a>
                            <a href="" > 
                                <img class="link-img" src="./assets/youtube.png" alt="Video Tutorials" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                            </a>
                            <a href="" > 
                                <img class="link-img" src="./assets/medium.png" alt="Text Tutorials" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                            </a>
                            <a href="./01-shapes/index.html" > 
                                <img class="link-img" src="./assets/web.png" alt="Online Demo" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                            </a>

                        </div>

                        <p class="link-description"></p>


                    </div>

                </div>
                
            </div>

            <div class="card" id="3D" @mouseenter="extendCard($event.target)" @mouseleave="shrinkCard($event.target)">

                <img class="card-cover" src="./assets/3D.png" alt="Shapes and Colors"/>

                <div class="card-extension" >

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
                                <img class="link-img" src="./assets/github.png" alt="Source Code" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                            </a>
                            <a href="" > 
                                <img class="link-img" src="./assets/youtube.png" alt="Video Tutorials" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                            </a>
                            <a href="" > 
                                <img class="link-img" src="./assets/medium.png" alt="Text Tutorials" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                            </a>
                            <a href="./01-shapes/index.html" > 
                                <img class="link-img" src="./assets/web.png" alt="Online Demo" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                            </a>

                        </div>

                        <p class="link-description"></p>


                    </div>

                </div>
                
            </div>


        </div>


    `

}
