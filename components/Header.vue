
import { Container } from 'postcss';

import { Container } from 'postcss';
<template>
	<header>
		 Amazing Header	
		 <div id="headerBar"> 
			<Container id="headerLeft">
				<button> Page redirection - dynamic screen </button>
			</Container>
			<Container id="headerRight">
				<input type="text" placeholder="Search recipies..." />
				<button @click="openLoginPage"> Login </button>  <!-- If logged in change to profile pic -->
			</Container>
		 </div>
	</header>
</template>
