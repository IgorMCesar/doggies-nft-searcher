<script lang="ts">
import { defineComponent } from 'vue';

import { DoggieData } from './Main.vue';

export default defineComponent({
  name: 'DoggieProfile',
  props: {
    doggieData: {
      type: Object as () => DoggieData,
      required: true,
    },
  },
  setup(props) {
    console.log(props.doggieData);
  },
});
</script>

<template>
  <div>
    <p>{{ doggieData.name }}</p>
    <p>{{ doggieData.ownerId }}</p>
    <p>{{ doggieData.description }}</p>
    <p>{{ doggieData.imageUrl }}</p>
    <img :src="doggieData.imageUrl" width="100px" />
    <div>
      <p v-for="attribute in doggieData.attributes" :key="attribute.trait_type">
        {{ attribute.trait_type }}: {{ attribute.value }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
