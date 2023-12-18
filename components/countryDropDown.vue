<script lang="ts">
import { Dropdown } from '#build/components';
const countries: Ref<Array<any>> = ref([]);

//countries are sorted by countryCode and not name
async function fetchCountryJSON() {
    const target = 'https://flagcdn.com/en/codes.json';
    const response = await fetch(target);
    const countryData = await response.json();
    for (const [key, value] of Object.entries(countryData)) {
        countries.value.push(value);
    }
}

//gets executed when page is fully mounted
fetchCountryJSON();
</script>

<template>
    <div>
        <!--:options="countries"-->
        <Dropdown placeholder="Select a Country">
        </Dropdown>
    </div>
</template>