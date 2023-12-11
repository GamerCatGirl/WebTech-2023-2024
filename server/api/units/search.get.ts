export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    // if (!query.query) throw createError({ statusCode: 400, statusMessage: "`query` is not defined" });
    if (!query.unitType) throw createError({ statusCode: 400, statusMessage: "`unitType` is not defined" });
    const search = query.query ?? "";

    const res = await $fetch(
        `https://clinicaltables.nlm.nih.gov/api/ucum/v3/search?sf=cs_code,name,synonyms,cs_code_tokens,loinc_property&df=cs_code,name,loinc_property&terms=${search}&q=${query.unitType}&maxList`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );
    return (res[3] as [[string, string, string]])
        .filter(([_, __, loincProperty]) => loincProperty === query.unitType)
        .map(([code, name, _]) => [code, name]);
});
