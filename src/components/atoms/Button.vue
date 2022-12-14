<script lang="ts">
import { defineComponent } from 'vue';
import { PropType } from 'vue/types/v3-component-props';

type Color = 'primary' | 'secondary';

export default defineComponent({
  name: 'Button',
  props: {
    onClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
    isLoading: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    color: {
      type: String as PropType<Color>,
      required: false,
      default: 'primary',
    },
    iconButton: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    fullWidth: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
    loadingSpinner: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },
});
</script>

<template>
  <button
    class="button"
    :class="[
      `button-${color}`,
      { 'icon-button': iconButton },
      { 'button-full-width': fullWidth },
    ]"
    :disabled="isLoading"
    @click="onClick"
  >
    <img
      v-if="isLoading && loadingSpinner"
      class="button-loading-spinner"
      src="~/static/icons/spinner.svg"
      alt="A loading spinner"
      width="24px"
      height="24px"
    />
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;

  border-radius: 8px;
  border: unset;
  color: rgb(255 255 255);
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;

  padding: 12px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.button-full-width {
  width: 100%;
}

.button-primary {
  background-color: rgb(108 43 217);
  &:hover {
    background-color: rgb(85 33 181);
  }
}

.button-secondary {
  background-color: #66636a;
  &:hover {
    background-color: #363538;
  }
}

.icon-button {
  padding: 10px;
}

.button-loading-spinner {
  margin-right: 12px;
}
</style>
