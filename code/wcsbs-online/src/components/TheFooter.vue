<template>
  <footer>
    <div class="container">
      <router-link class="logo-font" :to="{ name: 'home', params: {} }"
        >WCSBS学修平台</router-link
      >
      <span class="attribution"
        >乃至菩提果，皈依诸佛陀。亦依正法宝，菩萨诸圣众。</span
      >
    </div>
  </footer>
</template>

<script>
export default {
  name: "RwvFooter"
};
</script>
