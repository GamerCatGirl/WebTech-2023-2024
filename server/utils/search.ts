export function getSeachVars(query: any) {
    let pageSize = (query.size?.valueOf() as number) ?? 20;
    pageSize = pageSize > 100 ? 100 : pageSize;
    const page = (query.page?.valueOf() as number) ?? 0;
    const search = query.query?.valueOf();
    return { pageSize, page, query: search };
}
