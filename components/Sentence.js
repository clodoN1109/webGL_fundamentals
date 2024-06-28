export default {
    props: {
        sentence: {
            type: String,
            required: true,
        }
    },
    template:
    /*html*/
    `
    <li>{{this.sentence}}</li>
    `

}