<template>
	<header>
		<div class="card">
			<Menubar :model="items">
				<template #end>
					<div class="flex align-items-center gap-2">
						<InputText placeholder="Search" type="text" class="w-8rem sm:w-auto" />
						<Avatar image="Tiramisu.png" shape="circle" />
						<!-- Bedoeling dat hieronder de profile subtab komt maar ik weet hoe -->
					</div>
				</template>
			</Menubar>
		</div>
	</header>
</template>

<script setup lang="ts">
const items = ref([
	{
		label: "Home",
		icon: "pi pi-home",
		command: () => {
			navigateTo("home");
		},
	},
	{
		label: "Recipies",
		icon: "pi pi-star",
		items: [
			{
				label: "Discover",
				icon: "pi pi-globe",
				command: () => {
					navigateTo("recipies");
				},
			},
			{
				label: "New",
				icon: "pi pi-plus",
				command: () => {
					navigateTo("recipies/add");
				},
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

	{
		label: "Profile",
		icon: "pi pi-user",
		items: [
			{ label: "Login", icon: "pi pi-user",
			  command: () => {
			  	navigateTo("login");
				},
			},
			{ label: "Account", icon: "pi pi-user",
			  command: () => {
			  	navigateTo("profile/username");
				},
			},
			{ label: "Settings", icon: "pi pi-cog" },
			{ label: "Logout", icon: "pi pi-sign-out" },
		],
	},

	//	{end: true},

	//	{label: "test"},
]);

//const homeButton = document.getElementById("home-button");
//console.log("homebutton: " + homeButton);
//homeButton?.onclick = () => {
//	console.log("Clicked on home button");
//};
</script>
