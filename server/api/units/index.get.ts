export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    if (!query.fromUnit) throw createError({ statusCode: 400, statusMessage: "`fromUnit` is not defined" });
    if (!query.toUnit) throw createError({ statusCode: 400, statusMessage: "`toUnit` is not defined" });
    const quantity = query.quantity ?? 1;
    const toUnit = (query.toUnit as string).replace("[", "%5B").replace("]", "%5D");
    const fromUnit = (query.fromUnit as string).replace("[", "%5B").replace("]", "%5D");
	if (toUnit === fromUnit) return quantity;

    const res = await $fetch(
        `https://ucum.nlm.nih.gov/ucum-service/v1/ucumtransform/${quantity}/from/${fromUnit}/to/${toUnit}`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );
    const response = res.UCUMWebServiceResponse.Response;
    if (typeof response === "string") throw createError({ statusCode: 400, statusMessage: response });
    const amount: number = response.ResultQuantity;
    return amount;
});
