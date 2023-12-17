<script setup lang="ts">
//import { SidebarMenu } from "#build/components";
//import Menu from "primevue/menu";
import "primeicons/primeicons.css";

const { data, status } = useAuth();
const user = data.value?.user?.name;

const items = ref([
  {
    label: "Profile",
    items: [
      { label: "Settings", icon: "pi pi-cog" },
      { label: "Logout", icon: "pi pi-sign-out" },
    ],
  },
]);
</script>

<template>
  <div class="titlepage">Exploring food throughout the world</div>
  <div class="subtitle">Discover local recipes from around the world</div>

  <!-- TODO: put button in center -->
  <Button label="Discover Recipes" />

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
      width="400px"
      height="400px"
      class="imageRigth"
    />
  </div>

  <div class="chunk">
    <Image
      src="/Pic2.png"
      alt="Image"
      width="400px"
      height="400px"
      class="imageLeft"
    />
    <div class="text-chunk-rigth">
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
      width="400px"
      height="400px"
      class="imageRigth"
    />
  </div>

  <Button label="Discover Recipes" />

  <div class="chunk">
    <div class="text-chunk">
      <Image
        src="/p1.png"
        alt="Image"
        width="200px"
        height="200px"
        class="imageCenter"
      />

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
      <Image
        src="/p2.png"
        alt="Image"
        width="200px"
        height="200px"
        class="imageCenter"
      />

      <div class="title-paragraph title-paragraph-center">Zui, South korea</div>

      <div class="text-paragraph">
        "I'm always looking for new recipe ideas, and [website name] is the
        perfect place to find them. I've found some really delicious recipes
        that I would never have thought of on my own."
      </div>
    </div>

    <div class="text-chunk">
      <Image
        src="/p3.png"
        alt="Image"
        width="200px"
        height="200px"
        class="imageCenter"
      />

      <div class="title-paragraph title-paragraph-center">vanja, sweden</div>

      <div class="text-paragraph">
        "I love connecting with other foodies on [website name]. We share
        recipes, tips, and tricks, and we've made some great friends."
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
  justify-content: center;
}

.text-chunk {
  align-items: start;
  padding: 1rem;
}

.text-chunk-rigth {
  align-items: end;
  padding: 1rem;
}

.imageRigth {
  align-items: end;
  padding: 1rem;
}

.imageCenter {
  align-items: center;
  padding: 1rem;
}

.imageLeft {
  align-items: start;
  padding: 1rem;
}
</style>
