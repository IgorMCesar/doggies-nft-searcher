<script lang="ts">
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import axios from 'axios';
import { reactive, toRefs } from 'vue';
import abi from '../contracts/theDoggiesABI.json';

export interface DoggieData {
  id: string;
  ownerId: string;
  imageUrl: string;
  name: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  iframe: string;
}

interface State {
  totalSupply: number;
  doggieId: string;
  doggieData: DoggieData | null;
  isLoading: boolean;
  error: unknown | null;
}

const web3 = new Web3('https://cloudflare-eth.com');
const contract = new web3.eth.Contract(
  abi as AbiItem[],
  '0xc7df86762ba83f2a6197e1ff9bb40ae0f696b9e6'
);

const getTotalDoggiesSupply = () => {
  return contract.methods.totalSupply().call();
};

export default {
  name: 'MainComponent',
  setup() {
    const state = reactive<State>({
      totalSupply: 0,
      doggieId: '',
      doggieData: null,
      isLoading: false,
      error: null,
    });

    getTotalDoggiesSupply().then((totalSupply: number) => {
      state.totalSupply = totalSupply;
    });

    const getDoggieData = async (doggieId: string = state.doggieId) => {
      state.isLoading = true;

      console.log(doggieId);

      try {
        const [tokenURI, ownerId] = await Promise.all([
          contract.methods.tokenURI(doggieId).call(),
          contract.methods.ownerOf(doggieId).call(),
        ]);

        const { data } = await axios.get(tokenURI);

        state.doggieData = {
          id: doggieId,
          ownerId,
          imageUrl: data.image_url,
          name: data.name,
          description: data.description,
          attributes: data.attributes,
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
      const randomDoggieData = await getDoggieData(randomDogId);

      return randomDoggieData;
    };

    return {
      ...toRefs(state),
      getDoggieData,
      getRandomDoggieData,
    };
  },
};
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <img src="~/static/logo.gif" class="header-image" />
        <h1>The Doggies Explorer</h1>
      </div>
    </div>
    <div class="token-search">
      <h4>Token ID</h4>
      <input
        v-model="doggieId"
        class="search-input"
        type="number"
        min="0"
        :max="totalSupply"
      />
      <div class="group-search-buttons">
        <button class="search-button" @click="getDoggieData()">Search</button>
        <button class="random-button" @click="getRandomDoggieData">
          <img src="~/static/card-random.svg" width="24px" height="24px" />
        </button>
      </div>
    </div>
    <DoggieProfile v-if="doggieData" :doggie-data="doggieData" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 490px;
  height: calc(100% - 560px);
  min-height: 380px;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  margin-top: auto;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: black;
    margin-bottom: 0;
  }
}

.header-image {
  width: 160px;
  height: 160px;
  border: 8px solid #111519;
  border-radius: 50%;
}

.token-search {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  height: 100%;
  margin-top: 32px;

  h4 {
    font-size: 1.5rem;
    font-weight: bold;
    color: black;
    margin-bottom: 12px;
  }
}

.search-input {
  color: rgb(17 24 39);
  background-color: rgb(249 250 251);
  padding: 12px;
  border: 1px solid rgb(209 213 219);
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
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
  font-weight: 500;
  padding: 8px 16px;
  color: rgb(255 255 255);
  background-color: rgb(108 43 217);
  padding: 12px;
  border: 1px solid rgb(209 213 219);
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgb(85 33 181);
  }
}

.random-button {
  padding: 8px 16px;
  color: rgb(255 255 255);
  background-color: #1f2937;
  padding: 8px;
  border: 1px solid rgb(209 213 219);
  border-radius: 8px;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    background-color: #111827;
  }
}

.doggie-wrapper {
  flex-grow: 1;
}
</style>
