<template>
    <header>
        <Toast />
        <div class="card">
            <Menubar :model="items">
                <template #item="{ item, props, hasSubmenu }">
                    <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                            <span :class="item.icon" />
                            <span class="ml-2">{{ item.label }}</span>
                        </a>
                    </NuxtLink>
                    <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                    </a>
                </template>
                <template #end>
                    <ToggleButton
                        v-model="useLightTheme"
                        class="toggleTheme"
                        on-icon="pi pi-sun"
                        off-icon="pi pi-moon"
                        on-label=""
                        off-label=""
                    />
                    <div v-if="status === 'authenticated'" class="flex">
                        <Button unstyled class="avatarButton" @click="(event: any) => menu.toggle(event)">
                            <Avatar :image="userIcon" size="normal" shape="circle" />
                        </Button>
                        <Menu id="overlay_menu" ref="menu" :model="accountItems" :popup="true">
                            <template #item="{ item, props }">
                                <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                                        <span :class="item.icon" />
                                        <span class="ml-2">{{ item.label }}</span>
                                    </a>
                                </NuxtLink>
                                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                                    <span :class="item.icon" />
                                    <span class="ml-2">{{ item.label }}</span>
                                </a>
                            </template>
                        </Menu>
                    </div>
                    <div v-else-if="route.name === 'login'" />
                    <NuxtLink
                        v-else-if="status === 'unauthenticated'"
                        v-ripple
                        to="/login"
                        class="p-button p-ripple loginButton"
                    >
                        Login
                    </NuxtLink>
                    <Skeleton v-else shape="circle" size="2rem" />
                </template>
            </Menubar>
        </div>
    </header>
</template>

<script setup lang="ts">
import { getTheme, Theme } from "~/composables/theme";

const theme = getTheme();
const { signOut, status, data } = useAuth();
const userIcon = data.value?.user?.image ?? "/placeholder.svg";
const route = useRoute();
const menu = ref();
const useLightTheme = ref(theme.value === Theme.light);
watch(useLightTheme, () => (theme.value = useLightTheme.value ? Theme.light : Theme.dark));

const items = ref([
    {
        label: "Home",
        icon: "pi pi-home",
        route: "/",
    },
    {
        label: "Recipes",
        icon: "pi pi-star",
        items: [
            {
                label: "Discover",
                icon: "pi pi-globe",
                route: "/recipes",
            },
            {
                label: "New",
                icon: "pi pi-plus",
                route: "/recipes/add",
            },
        ],
    },
]);
const accountItems = ref([
    {
        label: "Account",
        icon: "pi pi-user",
        route: `/profile/${data.value?.user?.id}`,
    },
    {
        label: "Edit profile",
        icon: "pi pi-cog",
        route: `/profile/edit`,
    },
    { label: "Logout", icon: "pi pi-sign-out", command: () => signOut() },
]);
</script>

<style scoped>
a {
    text-decoration: none;
}

.avatarButton {
    border: none;
    background-color: inherit;
}

.p-avatar {
    transition: filter 0.3s;
}

.p-avatar:hover {
    filter: brightness(0.8);
    transition: filter 0.3s;
}

.toggleTheme,
.loginButton {
    background-color: inherit;
    border: none;
    box-shadow: 0 0 0 0;
    color: var(--text-color);
}

.toggleTheme {
    margin-right: 5px;
}

.toggleTheme:hover,
.loginButton:hover {
    background-color: var(--surface-c);
}

:deep(.toggleTheme .p-button-icon) {
    color: var(--text-color);
}

:deep(.p-menubar-end) {
    display: flex;
}

:deep(.avatarButton .p-ink),
:deep(.avatarButton .p-ink-active) {
    display: none;
}
</style>
