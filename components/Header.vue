<template>
  <header>
    <div class="card">
      <Menubar :model="items">
        <template #end>
          <div class="flex align-items-center gap-2">
            <InputText
              placeholder="Search"
              type="text"
              class="w-8rem sm:w-auto"
            />
            <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
          </div>
        </template>
      </Menubar>
    </div>
    <!--
		 <div id="headerBar"> 

			<Container id="headerLeft">			
				<a> <img src="../assets/images/logo.png"> </a> 
				<ul id="menu">
					<li>Home</li>
					<li>Map</li>
					<li>My Recipies</li>
					<li @click="openProfile">Profile </li>
				</ul>
			</Container>

			<Container id="headerRight">
				<input type="text" placeholder="Search..." />
				<button @click="openLoginPage"> Sign In </button> 
				 If logged in change to profile pic 
				<a> <img src="../assets/images/sun.png"></a>
			</Container>

		 </div> -->
  </header>
</template>

<script setup lang="ts">

//const toast = useToast();
const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
  },
  {
    label: "Features",
    icon: "pi pi-star",
  },
  {
    label: "Projects",
    icon: "pi pi-search",
    items: [
      {
        label: "Components",
        icon: "pi pi-bolt",
      },
      {
        label: "Blocks",
        icon: "pi pi-server",
      },
      {
        label: "UI Kit",
        icon: "pi pi-pencil",
      },
      {
        label: "Templates",
        icon: "pi pi-palette",
        items: [
          {
            label: "Apollo",
            icon: "pi pi-palette",
          },
          {
            label: "Ultima",
            icon: "pi pi-palette",
          },
        ],
      },
    ],
  },
  {
    label: "Contact",
    icon: "pi pi-envelope",
  },
]);
</script>
