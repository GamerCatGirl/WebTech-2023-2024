//  https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@sidebase/nuxt-auth", "@nuxtjs/color-mode", "nuxt-primevue", "nuxt3-leaflet"],

    // alls comments are from the documentation website of primevue
    primevue: {
        // Whether to install the PrimeVue plugin, defaults to true. Disable this option if you prefer to configure PrimeVue manually
        // e.g. with a Nuxt plugin.
        usePrimeVue: true,
        options: {
            unstyled: false,
            ripple: true,
            inputStyle: "filled",
        },
        // Configures the global pass through import path.
        // Pathe may also be a location within your application
        // ex importPT: { as: 'MyCustomPreset', from: path.resolve(__dirname, './assets/presets/mypreset.js')}
        // importPT: {as: 'Tailwind', from: 'primevue/passthrough/tailwind'},

        // Defines the CSS layer order setting for compatibility with libraries like Tailwind.
        cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
        // The components to import and register are defined with the include option using a string array.
        // When the value is ignored or set using the * alias, all of the components are registered.
        components: {
            // Component registration can be customized further by implementing the name function
            // that gets an object representing the import metadata. name is the label of the component,
            // as is the default export name and from is the import path.
            // ex name: ({name, as, from}) => {return name === 'Button' ? `My${name}`: name;}
            name: undefined,
            // ex include: ['Button', 'DataTable']
            // ex include: '*'
            include: "*",
            // ex if include: '*'
            // -> exclude: ['Carousel']
            exclude: undefined,
        },
        directives: {
            include: "*",
            exclude: undefined,
        },
        composables: {
            prefix: "",
            name: undefined,
            // Determines the composables to use, when default value is ignored or set as * all composables are imported.
            // ex include: ['useStyle']
            include: ["useStyle"],
            exclude: undefined,
        },
    },
    // config a prime vue team that needs to be used as css
    css: ["primeflex/primeflex.css", "primevue/resources/primevue.min.css", "primeicons/primeicons.css"],
});
