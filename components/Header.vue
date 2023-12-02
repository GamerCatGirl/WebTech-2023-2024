<template>
    <header>
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
                    <div v-if="status === 'authenticated'" class="flex align-items-center gap-2">
                        <Button unstyled class="avatarButton" @click="(event: any) => menu.toggle(event)">
                            <Avatar image="Tiramisu.png" size="normal" shape="circle" />
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
                    <NuxtLink v-else-if="status === 'unauthenticated'" v-ripple to="/login" class="p-button p-ripple"
                        >Login</NuxtLink
                    >
                    <Skeleton v-else shape="circle" size="2rem" />
                </template>
            </Menubar>
        </div>
    </header>
</template>

<script setup lang="ts">
import { theme, Theme } from "~/composables/theme";
const { signOut, status } = useAuth();
const route = useRoute();
const menu = ref();
const useLightTheme = ref(theme.value === Theme.light);
watch(useLightTheme, () => (theme.value = useLightTheme.value ? Theme.light : Theme.dark));

const items = ref([
    {
        label: "Home",
        icon: "pi pi-home",
        route: "/home",
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
            { label: "Edit", icon: "pi pi-pencil" },
            { label: "Saved", icon: "pi pi-bookmark" },
        ],
    },

    {
        label: "Inbox",
        icon: "pi pi-envelope",
        items: [
            { label: "Notifications", icon: "pi pi-inbox", badge: 3 },

            { label: "Comments", icon: "pi pi-comments", badge: 2 },
        ],
    },
]);
const accountItems = ref([
    {
        label: "Account",
        icon: "pi pi-user",
        route: "/profile/username",
    },
    { label: "Settings", icon: "pi pi-cog" },
    { label: "Logout", icon: "pi pi-sign-out", command: signOut },
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

.toggleTheme {
    background-color: inherit;
    border: none;
    box-shadow: 0 0 0 0;
}

.toggleTheme:hover {
    background-color: var(--surface-c);
}

:deep(.toggleTheme .p-button-icon) {
    color: var(--text-color);
}
</style>
