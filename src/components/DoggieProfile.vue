<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { marked } from 'marked';
import { PropType } from 'vue/types/v3-component-props';
import DOMPurify from 'isomorphic-dompurify';

import { DoggieData } from '~/types/doggie';
import { OPENSEA_URL } from '~/constants';

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
      getOpenSeaLink() {
        return `${OPENSEA_URL}/${doggieData.value.ownerId}`;
      },
      getFormattedOwnerId() {
        return doggieData.value.ownerId.slice(2, 8);
      },
      markdownDescriptionToHtml() {
        const html = marked(doggieData.value.description);
        const sanitizedHtml = DOMPurify.sanitize(html);
        return sanitizedHtml;
      },
    };
  },
});
</script>

<template>
  <div class="doggie-profile-container">
    <div class="gradient-blur" />
    <div class="doggie-profile-card">
      <div class="doggie-info-container">
        <div class="doggie-image-container">
          <img :src="doggieData.imageUrl" class="doggie-image" />
        </div>
        <div class="doggie-text-container">
          <div>
            <h3>{{ doggieData.name }}</h3>
            <p class="owner-text">
              Owned by:
              <a :href="getOpenSeaLink()" target="_blank">{{
                getFormattedOwnerId()
              }}</a>
            </p>
          </div>
          <div>
            <h4>Description</h4>
            <div
              class="description-markdown-container__doggie-profile"
              v-html="markdownDescriptionToHtml()"
            />
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
  </div>
</template>

<style lang="scss" scoped>
.doggie-profile-container {
  position: relative;
}

.gradient-blur {
  position: absolute;
  z-index: -1;

  width: 100%;
  height: 100%;

  filter: blur(18px);
  background-image: linear-gradient(to bottom, #a855f7, #6366f1);
}

.doggie-profile-card {
  background-color: #121113;
  border-radius: 16px;

  padding: 24px;
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
    font-size: 1.2rem;
    margin: 48px 0 12px;

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
    color: #9061f9;
    text-decoration: none;
    text-transform: uppercase;
  }
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 12px;
  grid-auto-rows: 1fr;

  text-align: center;

  margin-top: 24px;
}

.attribute-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: #2a292a;
  border: 1px solid #111519;
  border-radius: 12px;

  padding: 12px;
}

.attribute-type {
  color: #ac94fa;

  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;

  margin-bottom: 8px;
}

.attribute-value {
  display: flex;
  align-items: center;
  flex: 1;

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
  border-radius: 16px;

  aspect-ratio: 1;
  width: 100%;
  height: 100%;
}
</style>

<styled lang="scss">
.description-markdown-container__doggie-profile {
  p {
    color: #94a3b8;
    text-decoration: none;
  }
  a {
    color: #9061f9;
    text-decoration: none;
  }
}
</styled>
