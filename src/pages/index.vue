<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import DoggieProfile from '@/components/DoggieProfile.vue';
import Button from '@/components/atoms/Button.vue';
import contract from '~/contracts/theDoggiesContract';
import { DoggieData } from '~/types/doggie';

interface IState {
  totalSupply: number;
  doggieId: string;
  doggieData: DoggieData | null;
  isLoading: boolean;
  error: unknown | null;
}

export default defineComponent({
  name: 'IndexPage',
  components: {
    DoggieProfile,
    Button,
  },
  setup() {
    const state = reactive<IState>({
      // Total supply will never be lower than 10000.
      totalSupply: 10000,
      doggieId: '',
      doggieData: null,
      isLoading: false,
      error: null,
    });

    onMounted(async function getTotalDoggiesSupply() {
      try {
        state.totalSupply = await contract.methods.totalSupply().call();
      } catch (error) {
        state.error = error;
      }
    });

    const getDoggieData = async () => {
      // Don't re-search the current displayed doggie.
      if (state.doggieData?.id === state.doggieId) {
        state.error = 'Search for a different doggie.';
        return;
      }

      if (!state.doggieId) {
        state.error = 'Enter a doggie id to search.';
        return;
      }

      state.isLoading = true;
      state.error = null;

      try {
        const [tokenURI, ownerId] = await Promise.all([
          contract.methods.tokenURI(state.doggieId).call(),
          contract.methods.ownerOf(state.doggieId).call(),
        ]);

        const reponse = await fetch(tokenURI);
        const data = await reponse.json();

        state.doggieData = {
          id: state.doggieId,
          ownerId,
          imageUrl: data.image_url,
          name: data.name,
          description: data.description,
          attributes: data.attributes.filter(
            (attribute: { value: string }) => attribute.value !== ''
          ),
          iframeUrl: data.iframe_url,
        };
      } catch (error) {
        state.error = error;
      } finally {
        state.isLoading = false;
      }
    };

    const getRandomDoggieData = async () => {
      const randomDogId = String(
        Math.floor(Math.random() * (state.totalSupply - 1))
      );

      state.doggieId = randomDogId;
      const randomDoggieData = await getDoggieData();

      return randomDoggieData;
    };

    const handleChange = (e: Event) => {
      const target = e.currentTarget as HTMLInputElement;
      const value = Number(target.value);

      // Prevent empty value to be converted to 0.
      if (target.value === '') {
        state.doggieId = '';
        return;
      }

      // Ensure the value is in the range of 0 to totalSupply - 1.
      if (value > state.totalSupply - 1) {
        state.doggieId = String(state.totalSupply - 1);
      } else if (value < 0) {
        state.doggieId = String(0);
      } else {
        state.doggieId = String(value);
      }

      target.value = state.doggieId;
    };

    return {
      ...toRefs(state),
      getDoggieData,
      getRandomDoggieData,
      handleChange,
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <img
          src="~/static/logo.gif"
          class="header-image"
          alt="Doggies gif logo"
        />
        <h1>The Doggies Explorer</h1>
      </div>
    </div>
    <div class="token-search">
      <div class="search-input-wrapper">
        <input
          search-input
          :value="doggieId"
          class="search-input"
          type="number"
          min="0"
          :max="totalSupply"
          placeholder="Enter a Token ID"
          @change="handleChange"
        />
      </div>

      <div class="group-search-buttons">
        <Button
          search-button
          :on-click="getDoggieData"
          :is-loading="isLoading"
          full-width
          loading-spinner
        >
          Search
        </Button>
        <Button
          random-button
          :on-click="getRandomDoggieData"
          :is-loading="isLoading"
          icon-button
          color="secondary"
          style="margin-left: 8px"
        >
          <img
            src="~/static/icons/dice.svg"
            alt="A pair of dices"
            width="24px"
            height="24px"
          />
        </Button>
      </div>
      <div v-if="error" error-text class="error-text">{{ error }}</div>
    </div>
    <Transition name="bounce">
      <div v-if="doggieData" class="profile-container">
        <Transition name="bounce">
          <DoggieProfile
            v-if="!isLoading"
            :doggie-data="doggieData"
            doggie-profile
          />
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100vh;

  margin: 0 auto;
  padding: 3rem 1rem 2rem 1rem;
}

.profile-container {
  flex: 1;

  @media screen and (max-width: 642px) {
    min-height: 150vh;
  }
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  height: 100%;
  margin-top: auto;

  h1 {
    font-family: 'UnifrakturMaguntia';
    font-size: 2.5rem;
    font-weight: bold;
    letter-spacing: 5px;
    text-align: center;

    margin-top: 24px;
  }
}

.header-image {
  border: 8px solid #111519;
  border-radius: 50%;

  width: 160px;
  height: 160px;
}

.token-search {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  width: 100%;
  max-width: 400px;
  height: 100%;

  margin-top: 48px;
  margin-bottom: 64px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    left: 10px;

    width: 20px;
    height: 100%;

    background-image: url('~@/static/icons/magnifying-glass.svg');
    background-repeat: no-repeat;
    background-position: center;
  }
}

.search-input {
  color: rgb(17 24 39);
  background-color: rgb(249 250 251);
  border: 1px solid rgb(209 213 219);
  border-radius: 8px;
  font-size: 16px;

  padding: 12px 12px 12px 40px;
  width: 100%;
}

.group-search-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  margin-top: 12px;
}
.error-text {
  width: 100%;
  margin-top: 16px;

  color: #fca5a5;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.doggie-wrapper {
  flex-grow: 1;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
