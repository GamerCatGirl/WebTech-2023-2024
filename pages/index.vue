<template>
  <div>
  <div class="titlepage">Exploring food throughout the world</div>
  <div class="subtitle">Discover local recipes from around the world</div>

  <!-- TODO: put button in center -->
  <div class="w-full">
	<div class="mx-auto w-fit">
	  <Button><NuxtLink to="/recipes">Discover recipes</NuxtLink></Button> 
	</div>
  </div>

  <div class="chunk">
    <div class="text-chunk">
      <div class="title-paragraph">
        Where every bite is your password to the new world
      </div>
      <div class="text-paragraph">
        Imagine a world where every dish whispers tales of ancient traditions,
        where flavors dance on your tongue like a symphony of cultures, and
        where every culinary creation is a masterpiece born from the heart.
        Welcome to [website name], a digital haven where the culinary world
        unfolds before your very eyes, inviting you to share and discover meals.
      </div>
    </div>
    <Image
      src="/Pic1.png"
      alt="Image"
      width="300px"
      height="300px"
      class="imageRigth"
    />
  </div>

  <div class="chunk flex-wrap">
    <Image
      src="/Pic2.png"
      alt="Image"
      width="300px"
      height="300px"
      class="imageLeft"
    />
    <div class="text-chunk-right">
      <div class="title-paragraph">
        Join a community of passionate foodies, united by their love for
        gastronomy
      </div>
      <div class="text-paragraph">
        Step into a world where foodies from all walks of life gather, their
        love for food a common thread that binds them together. Share your
        culinary adventures, exchange recipes, and learn from the collective
        wisdom of this global community of food enthusiasts.
      </div>
    </div>
  </div>

  <div class="chunk">
    <div class="text-chunk">
      <div class="title-paragraph">
        Elevate your culinary skills, from novice to culinary maestro
      </div>
      <div class="text-paragraph">
        Whether you're a seasoned chef or a curious novice, this is your
        culinary classroom. Learn from experienced chefs, fellow foodies, and a
        vast library of culinary resources, honing your skills and expanding
        your culinary repertoire.
      </div>
    </div>
    <Image
      src="/Pic3.png"
      alt="Image"
      width="300px"
      height="300px"
      class="imageRigth"
    />
  </div>

  <div class="w-full">
	<div class="mx-auto w-fit">
	  <Button><NuxtLink to="/recipes">Discover recipes</NuxtLink></Button> 
	</div>
  </div>

  <div class="chunk interviews">
    <div class="text-chunk">
	  <div class="imageCenter" >
		  <Image
			src="/p1.png"
			alt="Image"
			width="200px"
			height="200px"
		  />
	  </div>

      <div class="title-paragraph title-paragraph-center">
        Michael, Switzerland
      </div>

      <div class="text-paragraph">
        "I've learned so much about different cultures through [website name].
        I've tried dishes I never would have tried before, and I've found some
        new favorites."
      </div>
    </div>
    <div class="text-chunk">
	  <div class="imageCenter" >
		  <Image
			src="/p2.png"
			alt="Image"
			width="200px"
			height="200px"
		  />
	  </div>

      <div class="title-paragraph title-paragraph-center">Zui, South korea</div>

      <div class="text-paragraph">
        "I'm always looking for new recipe ideas, and [website name] is the
        perfect place to find them. I've found some really delicious recipes
        that I would never have thought of on my own."
      </div>
    </div>

    <div class="text-chunk">
	  <div class="imageCenter" >
		  <Image
			src="/p3.png"
			alt="Image"
			width="200px"
			height="200px"
		  />
	  </div>

      <div class="title-paragraph title-paragraph-center">vanja, sweden</div>

      <div class="text-paragraph">
        "I love connecting with other foodies on [website name]. We share
        recipes, tips, and tricks, and we've made some great friends."
      </div>
    </div>
  </div>
  </div>
</template>

<!-- TODO: make image go under text when screen gets smaller -->
<style>
.titlepage {
  font-family: "Newsreader";
  font-size: 64px;
  font-weight: 400;
  font-style: italic;
  padding: 2rem;
  text-align: center;
  word-break: break-word;
}

.subtitle {
  font-family: "Inter";
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  text-transform: uppercase;
  padding: 1rem;
}

.title-paragraph {
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
}

.title-paragraph-center {
  align-items: center;
  text-align: center;
}

.text-paragraph {
  font-family: Inter;
  font-weight: 300;
  font-size: 20px;
  text-align: justify;
}

.chunk {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap-reverse;
}

.text-chunk {
  align-items: start;
  padding: 1rem;
}

.text-chunk-right {
  align-items: end;
  padding: 1rem;
}

.imageRigth {
  align-items: end;
  padding: 1rem;
}

.imageCenter {
  margin:  0.8em auto;
  width: fit-content;
}

.imageLeft {
  align-items: start;
  padding: 1rem;
}

.text-chunk, .text-chunk-right {
	max-width: calc(100% - 400px);
	min-width: 20rem;
}

.interviews .text-chunk {
	max-width: 32%;
	min-width: 20rem;
}

.p-button a {
	color: var(--primary-color-text);
	text-decoration: none;
	font-weight: 700;
}

.p-img {
	max-width: 95%;
}

@media screen and (max-width: 780px) {
	.text-chunk,
	.text-chunk-right {
		max-width: 95%;
		min-width: 0px;
	}
}

@media screen and (max-width: 987px) {
	.interviews .text-chunk {
		max-width: 95%;
		min-width: 0px;
	}
}
</style>
