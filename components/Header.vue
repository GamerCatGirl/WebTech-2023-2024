
import { Container } from 'postcss';

import { Container } from 'postcss';
<template>
	<header>
		 <div id="headerBar"> 

			<Container id="headerLeft">			
				<a> <img src="../assets/images/LOGO.png"> </a> 
				<ul id="menu">
					<li>Home</li>
					<li>Map</li>
					<li>My Recipies</li>
					<li @click="openProfile">Profile </li>
				</ul>
			</Container>

			<Container id="headerRight">
				<input type="text" placeholder="Search..." />
				<button @click="openLoginPage"> Sign In </button>  <!-- If logged in change to profile pic -->
				<a> <img src="../assets/images/SUN.png"></a>
			</Container>

		 </div>
	</header>
</template>

<style>
	@import url("../assets/css/header.css");
</style>