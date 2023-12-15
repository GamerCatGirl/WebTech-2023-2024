<template>
    <footer>
        <Menubar>
            <template #start>
                <NuxtLink class="apiDocs" to="/api">API documentation</NuxtLink>
            </template>
            <template #end>
                <div class="made">Made by &ensp;</div>
                <div class="names">Merlijn Devroede, Silken Heynderickx, Elyesa Cakirbey and Pieter Verbessem</div>
            </template>
        </Menubar>
    </footer>
</template>

<style scoped>
footer {
    margin: 8px 0px;
}

.p-menubar {
    flex-wrap: wrap;
}

:deep(.made) {
    flex-grow: 1;
}

:deep(.names) {
    max-width: 18em;
}

:deep(.p-menubar-end) {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
}

.apiDocs {
    color: var(--text-color);
}
</style>
