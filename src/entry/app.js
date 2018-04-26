import Vue from 'vue';
import router from '../widget/router';
import App from '../page/app.vue';

new Vue({
    el: '#app',
    render: h => h(App),
    router
});