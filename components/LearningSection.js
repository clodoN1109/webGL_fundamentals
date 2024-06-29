export default {
    props: {

        section: {
            type: Object,
            required: true,
        }

    },

    template:
    /*html*/
    `
    <div class="band-title-box">
    
        <div class="band-title-loose" >{{this.section.title}}</div>
    
    </div>
    
    <div :id="section.id" class="horizontal-bar">

        <card v-for="card in section.cards" :card="card"></card>

    </div>
    `
}