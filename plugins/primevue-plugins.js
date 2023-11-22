import {defineNuxtPlugin} from '#app';
import PrimeVue from 'primevue/config';

// import components of primevue

import Button from 'primevue/button';
import Card from 'primevue/card';
import Fieldset from 'primevue/fieldset';

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(PrimeVue, {ripple:true});
	nuxtApp.vueApp.component('Button', Button);
	nuxtApp.vueApp.component('Card', Card);
	nuxtApp.vueApp.component('FieldSet', Fieldset);

})
