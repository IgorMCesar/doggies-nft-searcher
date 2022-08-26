<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { marked } from 'marked';
import { PropType } from 'vue/types/v3-component-props';

import { DoggieData } from './Main.vue';

const OPENSEA_URL = 'https://opensea.io';

export default defineComponent({
  name: 'DoggieProfile',
  props: {
    doggieData: {
      type: Object as PropType<DoggieData>,
      required: true,
    },
  },
  setup(props) {
    const { doggieData } = toRefs(props);

    return {
      openSeaLink() {
        return `${OPENSEA_URL}/${doggieData.value.ownerId}`;
      },
      getFormattedOwnerId() {
        return doggieData.value.ownerId.slice(2, 8);
      },
      markdownDescriptionToHtml() {
        return marked.parse(doggieData.value.description);
      },
    };
  },
});
</script>

<template>
  <div class="doggie-profile-container">
    <div class="doggie-info-container">
      <div class="doggie-image-container">
        <img :src="doggieData.imageUrl" class="doggie-image" />
      </div>
      <div class="doggie-text-container">
        <div>
          <h3>{{ doggieData.name }}</h3>
          <p class="owner-text">
            Owned by: <a :href="openSeaLink()">{{ getFormattedOwnerId() }}</a>
          </p>
        </div>
        <div>
          <h4>Description</h4>
          <div v-html="markdownDescriptionToHtml()"></div>
        </div>
      </div>
    </div>
    <div class="attributes-grid">
      <div
        v-for="attribute in doggieData.attributes"
        :key="attribute.trait_type"
        class="attribute-container"
      >
        <p class="attribute-type">{{ attribute.trait_type }}</p>
        <p class="attribute-value">{{ attribute.value }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.doggie-profile-container {
  background-color: #121113;
  padding: 24px;
  border-radius: 16px;
}

.doggie-info-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0;
  }

  h4 {
    margin: 48px 0 12px;
    font-size: 1.2rem;

    @media screen and (max-width: 642px) {
      margin: 24px 0 12px;
    }
  }

  @media screen and (max-width: 642px) {
    flex-direction: column;
  }
}

.owner-text {
  margin: 12px 0;

  a {
    text-transform: uppercase;
    color: #9061f9;
    text-decoration: none;
  }
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 12px;
  grid-auto-rows: 1fr;
  margin-top: 24px;
  text-align: center;
}

.attribute-container {
  padding: 12px;
  border: 1px solid #111519;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #2a292a;
}

.attribute-type {
  font-size: 0.7rem;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
  color: #ac94fa;
}

.attribute-value {
  display: flex;
  flex: 1;
  align-items: center;
  font-size: 0.9rem;
}

.doggie-image-container {
  width: 320px;
  height: 320px;
  margin-right: 42px;

  @media screen and (max-width: 642px) {
    width: 100%;
    height: 100%;
    margin-right: 0px;
    margin-bottom: 24px;
  }
}

.doggie-text-container {
  flex: 1;
}

.doggie-image {
  width: 100%;
  height: 100%;
  border-radius: 16px;
}
</style>
