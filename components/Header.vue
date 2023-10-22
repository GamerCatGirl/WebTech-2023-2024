
import { Container } from 'postcss';

import { Container } from 'postcss';
<template>
	<header>
		 <div id="headerBar"> 

			<Container id="headerLeft">			
				<a> <img src="../assets/images/LOGO.png" @click="showMenu"> </a> 
			</Container>

			<Container id="headerRight">
				<input type="text" placeholder="Search..." />
				<button @click="openLoginPage"> Sign In </button>  <!-- If logged in change to profile pic -->
				<a> <img src="../assets/images/SUN.png"></a>
			</Container>

		 </div>
	</header>
</template>