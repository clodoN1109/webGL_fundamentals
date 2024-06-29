export default {

    data() {
        return {
            animationDuration: 0.5, // seconds
        }
    },

    methods: {

        extendCard(card) {

            let sectionID = card.parentNode.id;
            let cardID = card.id;

            let cardExtension = $(`#${sectionID}`).find(`#${cardID}`).find('.card-extension')[0];
            cardExtension.style.transition = `${this.animationDuration}s width, ${this.animationDuration}s ${this.animationDuration/2}s opacity`;
            cardExtension.style.opacity = 1;
            cardExtension.style.width = '30vw';
            
            let cardCover = card.getElementsByClassName('card-cover')[0];
            cardCover.src = `./assets/${cardID}.gif`;
            cardCover.style.opacity = 1;

            cardExtension.childNodes.forEach(element => {
                element.style.display = 'initial';
            });;
        },
        shrinkCard(card) {
            
            let sectionID = card.parentNode.id;
            let cardID = card.id;

            let cardExtension = $(`#${sectionID}`).find(`#${cardID}`).find('.card-extension')[0];
            cardExtension.style.transition = `${this.animationDuration/2}s ${this.animationDuration/2}s width, ${this.animationDuration}s opacity`;
            cardExtension.style.opacity = 0;
            cardExtension.style.width = '0';
            
            setTimeout(() => {
                cardExtension.childNodes.forEach(element => {
                    element.style.display = 'none';
                });;
                    
            }, this.animationDuration);
            
            let cardCover = card.getElementsByClassName('card-cover')[0];
            cardCover.src = `./assets/${cardID}.png`;
            cardCover.style.opacity = 0.75;

        },
        updateLinkDescription(element) {
            element.parentNode.parentNode.parentNode.getElementsByClassName('link-description')[0].innerHTML = element.alt;
            $(`${element.id}`).innerHTML = element.alt;
        },
        clearLinkDescription(element) {
            element.parentNode.parentNode.parentNode.getElementsByClassName('link-description')[0].innerHTML = '';
        }

    },

    props: {

        card: { type: Object, required: true },

    },

    computed: {
        imgURL () {
            return `./assets/${this.card.id}.png`;
        },
        

    },

    template:
        /*html*/
        `
        <div class="card" :id="card.id" @mouseenter="extendCard($event.target)" @mouseleave="shrinkCard($event.target)">

            <img class="card-cover" :src="imgURL" alt="Shapes and Colors"/>

            <div class="card-extension" >
            
                <p class="card-title">{{ this.card.title }}</p>
            
                <ul class="card-description">
                    <sentence v-for="sentence in card.description" :sentence="sentence"></sentence>
                </ul>

                <div class="links-container">

                    <div class="card-links">

                        <a target="_blank" :href="card.links.repository" > 
                            <img class="link-img" src="./assets/github.png" alt="Source Code" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                        </a>
                        <a target="_blank" :href="card.links.video" > 
                            <img class="link-img" src="./assets/youtube.png" alt="Video Tutorials" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                        </a>
                        <a target="_blank" :href="card.links.article" > 
                            <img class="link-img" src="./assets/medium.png" alt="Text Tutorials" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                        </a>
                        <a target="_blank" :href="card.links.online_demo" > 
                            <img class="link-img" src="./assets/web.png" alt="Online Demo" @mouseenter="updateLinkDescription($event.target)" @mouseleave="clearLinkDescription($event.target)">
                        </a>

                    </div>

                    <p class="link-description"></p>


                </div>

            </div>
            
        </div>
        ` 
    ,


}