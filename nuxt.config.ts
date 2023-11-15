// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@sidebase/nuxt-auth","@nuxtjs/color-mode" ],

    //alls comments are from the documentation website of primevue
    primevue: {
	//Whether to install the PrimeVue plugin, defaults to true. Disable this option if you prefer to configure PrimeVue manually 
	//e.g. with a Nuxt plugin.
	usePrimeVue: true,
        options: {},
	//Configures the global pass through import path.
	//Pathe may also be a location within your application 
	//ex importPT: { as: 'MyCustomPreset', from: path.resolve(__dirname, './assets/presets/mypreset.js')}
        importPT: undefined,
	//Defines the CSS layer order setting for compatibility with libraries like Tailwind.
        cssLayerOrder: undefined, //'tailwind-base, primevue, tailwind-utilities',
	//The components to import and register are defined with the include option using a string array. 
	//When the value is ignored or set using the * alias, all of the components are registered.
        components: {
	    //handy components we can use 
		//AutoComplete
		//Calender for profile (voor als er tijd over is)
		//cascade select a form component to select a value from a nested structure of options (handig voor recipies)
		//Checkbox (to check categories of your recipies)
		//Ships: ex username or @mail check in same input 
		//Colorpicker to select a theme 
		//Dropdown 
		//Editor: !!!! needed to add your recipies --- text editor 
		//InputGroup: meerdere inputs tesamen verwerken 
		//Mask: to show the format of the input 
		//InputNumber: to use for the ingredients 
		//InputSwitch: toggle 
		//InputText: for search bar, combine inputs with icons 
		//Knop: (eventueel voor tijd van recept aan te geven )
		//Listbox
		//MultiSelect 
		//Password 
		//RadioButton
		//Rating
		//SelectButton
		//Slider 
		//Textarea
		//ToggleButton
		//TreeSelect 
		//TriStateCheckbox: true, false or null selector 
		//Button
		//SpeedDial : eventueel voor recepten te editen of voor te linken 
		//DataTable 
		//DataView: voor de verschillende recepeten te displayen 
		//OrderList: voor de recepten de ordenen 
		//OrgChart: to watch de dependencies uit een recept (!!!later implementing)
		//Paginator: change page of recepies 
		//PickList 
		//Tree: (zoals file organisers)
		//TreeTable: 
		//TimeLine: vb voor verschillende stappen van het recept aan te duiden 
		//VirtualScroller: scroll through losts of data 
		//.....


	    //give a prefix to a register component 
            prefix: '',
	    //Component registration can be customized further by implementing the name function
	    //that gets an object representing the import metadata. name is the label of the component, 
	    //as is the default export name and from is the import path.
	    //ex name: ({name, as, from}) => {return name === 'Button' ? `My${name}`: name;}
            name: undefined,
	    //ex include: ['Button', 'DataTable']
	    //ex include: '*'
            include: ['Editor', 'InputNumber', 'InputSwitch', 'InputText', 'Password', 'Rating', 'Button', 'SpeedDial', 'DataView', 'OrderList'
	    	      'Paginator'],
	    //ex if include: '*'
	    //-> exclude: ['Carousel']
            exclude: undefined
        },
        directives: {
            prefix: '',
            name: undefined,
	    //The names of the directives to import and register are provided using the include property. 
	    //When the value is ignored or set using the * alias, all of the directives are registered.
            include: undefined,
            exclude: undefined
        },
        composables: {
            prefix: '',
            name: undefined,
	    //Determines the composables to use, when default value is ignored or set as * all composables are imported.
	    //ex include: ['useStyle']
            include: undefined,
            exclude: undefined
        }
    }
    //config a prime vue team that needs to be used as css 
    //css: ['primevue/resources/themes/lara-dark-teal/theme.css']
});
