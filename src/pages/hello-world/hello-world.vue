<template>
  <div>
    <p @click="clickMe" class="name">Hello World</p>
  </div>
</template>

<script>
  export default{
    name: 'hello-world',
    data() {
      return {

      }
    },
    methods: {
      clickMe() {
        alert('hello');
      }
    }
  }
</script>

<style lang="scss">
  .name {
    background-color: #00a680;
  }
</style>
