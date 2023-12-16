<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const props = defineProps<{ apiRoutes: ApiRoute[]; baseURL: string }>();

const toast = useToast();

// https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript/7220510#7220510
function syntaxHighlight(json: string, removeQoutes: boolean = false) {
    if (!json) return "";

    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        function (match) {
            let cls = "number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";
                    if (/^"deleteKey.*":/.test(match)) return "";
                } else if (/^("==COMMENT==)/.test(match)) {
                    match = match.slice(12);
                    cls = "comment";
                } else {
                    cls = "string";
                }
            } else if (/true|false/.test(match)) {
                cls = "boolean";
            } else if (/null/.test(match)) {
                cls = "null";
            }
            if (removeQoutes) match = match.replace(/"/g, "");
            return (
                '<span class="' +
                cls +
                '">' +
                match +
                "</span>" +
                (cls === "comment" ? "<span class='afterComment'> </span>" : "")
            );
        }
    );
}

function getURL(path: string) {
    return props.baseURL + path;
}

function copyExample(path: string) {
    navigator.clipboard.writeText(getURL(path));
    toast.add({
        severity: "success",
        detail: "Successfully copied URL.",
        life: 3000,
    });
}

function selectBlock(event: MouseEvent) {
    if (!process.client) return;
    event.preventDefault();
    const sel = window.getSelection();
    const range = document.createRange();
    // @ts-ignore
    if (event.target) range.selectNodeContents(event.target);
    sel?.removeAllRanges();
    sel?.addRange(range);
}
</script>

<template>
    <div v-for="topRoutes in apiRoutes" :key="topRoutes.title">
        <h2>{{ topRoutes.title }}</h2>
        <p>{{ topRoutes.description }}</p>
        <Accordion v-for="route in topRoutes.routes" :key="route.route" class="apiRoute" multiple>
            <AccordionTab>
                <template #header>
                    <Card :class="route.method">
                        <template #title>{{ route.method }}</template>
                    </Card>
                    <div>
                        <h3>{{ route.title }}</h3>
                        <p>{{ route.route }}</p>
                    </div>
                </template>
                <p>
                    {{ route.explanation }}
                </p>
                <Accordion multiple>
                    <AccordionTab v-if="route.authRequired || route.params" header="Query parameters">
                        <Card v-if="route.authRequired" class="queryParam">
                            <template #title>
                                <Tag value="Required" severity="danger" />
                                apiKey
                            </template>
                            <template #subtitle>string</template>
                            <template #content
                                >Your API key, this is used to authenticate you, so you should keep this a secret. If you
                                do not yet have an API key you can get one when you visit your profile.</template
                            >
                        </Card>
                        <Card v-for="param in route.params" :key="param.name" class="queryParam">
                            <template #title>
                                <Tag v-if="param.required" value="Required" severity="danger" />
                                {{ param.name }}
                            </template>
                            <template #subtitle>
                                <div class="typeDiv">
                                    {{ param.type }}
                                    <div v-if="param.values">: {{ param.values }}</div>
                                </div>
                                <div v-if="param.default">Default: {{ param.default }}</div>
                            </template>
                            <template #content> {{ param.description }} </template>
                            <template #footer>
                                <div v-if="param.info">
                                    <h4 class="m-0">More info</h4>
                                    <div v-for="info in param.info" :key="info.name">
                                        <NuxtLink :to="info.link">{{ info.name }}</NuxtLink>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </AccordionTab>
                    <AccordionTab v-if="route.bodyType" header="Request body">
                        <p v-if="route.bodyExplanation">{{ route.bodyExplanation }}</p>
                        <pre
                            :innerHTML="syntaxHighlight(JSON.stringify(route.bodyType, null, 2), true)"
                            class="highlightedJSON"
                            @dblclick="selectBlock"
                        />
                    </AccordionTab>
                    <AccordionTab v-if="route.returnType" header="Return type">
                        <p v-if="route.returnExplanation">{{ route.returnExplanation }}</p>
                        <pre
                            :innerHTML="syntaxHighlight(JSON.stringify(route.returnType, null, 2), true)"
                            class="highlightedJSON"
                            @dblclick="selectBlock"
                        />
                    </AccordionTab>
                    <AccordionTab header="Example">
                        <div class="exampleURL">
                            <p>{{ baseURL }}</p>
                            <InputText v-model="route.example.url" type="text" />
                            <Button
                                v-tooltip.top="'Copy into clipboard'"
                                icon="pi pi-copy"
                                severity="success"
                                class="ml-3"
                                @click="() => copyExample(route.example.url)"
                            />
                            <Button
                                v-if="route.example.run"
                                v-tooltip.top="'Run example query'"
                                label="run"
                                severity="info"
                                class="ml-2 py-3 m-auto"
                                icon="pi pi-sync"
                                @click="
                                    async () => {
                                        if (!route.example.run) return;
                                        if (!route.example.run.res.value)
                                            route.example.run.res.value = { status: 'pending' };
                                        route.example.run.res.value = await useFetch(getURL(route.example.url), {
                                            query: { apiKey: route.example.run.apiKey },
                                            method: route.method,
                                            body: route.example.body,
                                        });
                                    }
                                "
                            />
                        </div>
                        <div v-if="route.authRequired && route.example.run" class="runAuth">
                            <p>API key:</p>
                            <InputText v-model="route.example.run.apiKey" type="text" />
                        </div>
                        <div v-if="route.example.hasBody">
                            <h4>Body:</h4>
                            <Textarea v-model="route.example.body" class="w-full" rows="15" />
                        </div>
                        <div v-if="route.example.run?.res.value" class="exampleOutput">
                            <h4>Output:</h4>
                            <pre
                                v-if="route.example.run.res.value.status === 'success'"
                                class="highlightedJSON"
                                :innerHTML="syntaxHighlight(JSON.stringify(route.example.run.res.value.data, null, 2))"
                                @dblclick="selectBlock"
                            />
                            <Skeleton
                                v-else-if="route.example.run.res.value.status === 'pending'"
                                width="20rem"
                                height="3rem"
                            />
                            <div v-if="route.example.run.res.value.status === 'error'">
                                <div class="errorStatus">
                                    {{ route.example.run.res.value.error.statusCode }}:
                                    {{ route.example.run.res.value.error.statusMessage }}
                                </div>
                                {{ route.example.run.res.value.error.data.message }}
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
            </AccordionTab>
        </Accordion>
        <div class="apiRoute">
            <apiRoute v-if="topRoutes.subRoutes" :api-routes="topRoutes.subRoutes" :base-u-r-l="baseURL" />
        </div>
    </div>
</template>

<style scoped>
:deep(.p-accordion-header .p-card-content) {
    padding: 0px;
}

:deep(.p-accordion-header .p-card-body) {
    padding: 0.9rem;
}

:deep(.p-accordion-header .p-card-title) {
    margin: 0px;
}

:deep(.p-accordion-header .p-card.GET) {
    background-color: var(--green-300);
}

:deep(.p-accordion-header .p-card.POST) {
    background-color: var(--blue-300);
}

:deep(.p-accordion-header .p-card.DELETE) {
    background-color: var(--red-300);
}

:deep(.p-accordion-toggle-icon) {
    display: none;
}

:deep(.p-accordion-header *) {
    color: var(--text-color);
}

:deep(.p-accordion-header h3) {
    margin: 0px;
    margin-left: 0.5rem;
    font-size: 1.7em;
}

:deep(.p-accordion-header p) {
    margin: 0px;
    margin-left: 0.5rem;
    font-size: 1.2em;
    color: var(--text-color);
}

:deep(.p-accordion-header div) {
    display: flex;
    flex-direction: column;
}

:deep(.p-accordion-header-action) {
    padding: 1rem;
}

:deep(.queryParam .p-card-subtitle .typeDiv) {
    display: flex;
}

:deep(.queryParam .p-card-content) {
    padding: 0.5rem 0px;
}

:deep(.queryParam .p-card-body) {
    padding: 0.5rem var(--content-padding);
}

.queryParam {
    margin: 1rem 0px;
}

/* This selects the `Query parameters` accordion tab */
:deep(.p-accordion-content:has(.queryParam):not(:has(.p-accordion))) {
    /* Some padding is required here for adding the border correctly*/
    padding: 0.01rem var(--content-padding);
}

.exampleURL {
    display: flex;
    flex-wrap: wrap;
}

:deep(.exampleURL .p-inputtext) {
    padding: 0.6rem;
    padding-left: 0.2rem;
    margin: auto 0px;
    flex-grow: 1;
}

.errorStatus {
    color: var(--red-500);
}

.exampleOutput code {
    background-color: var(--highlight-bg);
    max-width: 90%;
    word-wrap: break-word;
}

:deep(.string) {
    color: green;
}
:deep(.number) {
    color: #c000c0;
}
:deep(.boolean) {
    color: blue;
}
:deep(.null) {
    color: magenta;
}
:deep(.key) {
    color: red;
}

:deep(.comment) {
    color: grey;
}

/* This hides the comma that would normally come after the comment */
:deep(.afterComment) {
    background-color: var(--surface-card);
    width: 1em;
    position: absolute;
}

.highlightedJSON {
    overflow: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.runAuth {
    display: flex;
}

.runAuth .p-inputtext {
    padding: 0.6rem;
    margin: auto 0.8em;
    flex-grow: 1;
}

.apiRoute {
    width: 98%;
    margin: 0px auto;
}
</style>
