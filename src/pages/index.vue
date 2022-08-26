<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import Web3 from 'web3';
import abi from '../contracts/theDoggiesABI';

import { DoggieData } from '~/types/doggie';
import { ETH_PROVIDER_URL, TOKEN_ADDRESS } from '~/constants';

interface IState {
  totalSupply: number;
  doggieId: string;
  doggieData: DoggieData | null;
  isLoading: boolean;
  error: unknown | null;
}

const web3 = new Web3(ETH_PROVIDER_URL);
const contract = new web3.eth.Contract(abi, TOKEN_ADDRESS);

export default defineComponent({
  name: 'IndexPage',
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
          iframe: data.iframe,
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

      if (Number.isNaN(value)) {
        return;
      }

      if (value > state.totalSupply - 1) {
        state.doggieId = String(state.totalSupply - 1);
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
      <input
        :value="doggieId"
        class="search-input"
        type="number"
        min="0"
        :max="totalSupply"
        placeholder="Enter a Token ID"
        @change="handleChange"
      />
      <div class="group-search-buttons">
        <button class="search-button" @click="getDoggieData">Search</button>
        <button class="random-button" @click="getRandomDoggieData">
          <img
            src="~/static/icons/dice.svg"
            alt="A pair of dices"
            width="24px"
            height="24px"
          />
        </button>
      </div>
    </div>
    <Transition name="bounce">
      <div v-if="doggieData" class="profile-container">
        <Transition name="bounce">
          <DoggieProfile v-if="!isLoading" :doggie-data="doggieData" />
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
    min-height: 200vh;
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
  margin-bottom: 48px;
}

.search-input {
  color: rgb(17 24 39);
  background-color: rgb(249 250 251);
  border: 1px solid rgb(209 213 219);
  border-radius: 8px;
  font-size: 16px;

  padding: 12px;
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

.search-button {
  background-color: rgb(108 43 217);
  border-radius: 8px;
  border: unset;
  color: rgb(255 255 255);
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;

  padding: 12px;
  width: 100%;

  &:hover {
    background-color: rgb(85 33 181);
  }
}

.random-button {
  background-color: #66636a;
  border-radius: 8px;
  border: unset;
  color: rgb(255 255 255);
  cursor: pointer;

  padding: 8px;
  margin-left: 8px;

  &:hover {
    background-color: #363538;
  }
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
