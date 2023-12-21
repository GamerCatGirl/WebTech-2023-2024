interface keyValueType {
    [key: string]: string;
};

export const countries = ref<keyValueType>(await fetchCountryJSON());

//countries are sorted by countryCode and not name
async function fetchCountryJSON() {
    const target = 'https://flagcdn.com/en/codes.json';
    const response = await fetch(target);
    const countryData = await response.json();
    const refObject = ref<keyValueType>({})
    for (const [key, value] of Object.entries(countryData)) {
        //@ts-ignore
        refObject.value[key] = value;
    }
    return refObject.value;
}

export function fetchCountryFlag(countryKey: string) {
    const flagSize = "w80";
    return 'https://flagcdn.com/' + flagSize + '/' + countryKey + '.png';
}

export function fetchChosenCountryKey(countryName: string) {
    return Object.keys(countries.value).find(key => countries.value[key] === countryName);
}

export function fetchCountryValue(countryKey: string) {
    return countries.value[countryKey];
}