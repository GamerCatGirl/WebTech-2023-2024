
import { Container } from 'postcss';

import { Container } from 'postcss';
<template>
	<header>
		 <div id="headerBar"> 

			<Container id="headerLeft">
				<a> Logo with menu </a> 
			</Container>

			<Container id="headerRight">
				<input type="text" placeholder="Search..." />
				<button @click="openLoginPage"> Sign In </button>  <!-- If logged in change to profile pic -->
			</Container>

		 </div>
	</header>
</template>
