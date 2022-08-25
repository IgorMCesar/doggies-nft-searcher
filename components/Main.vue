<script lang="ts">
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import axios from 'axios';
import { reactive, toRefs } from 'vue';
import abi from '../contracts/theDoggiesABI.json';

const web3 = new Web3('https://cloudflare-eth.com');
const contract = new web3.eth.Contract(
  abi as AbiItem[],
  '0xc7df86762ba83f2a6197e1ff9bb40ae0f696b9e6'
);

const getTotalDoggiesSupply = () => {
  return contract.methods.totalSupply().call();
};

interface State {
  totalSupply: number;
  doggieData: {
    id: string;
    ownerId: string;
    image: string;
    name: string;
    description: string;
    attributes: [];
    iframe: string;
  } | null;
  isLoading: boolean;
  error: unknown | null;
}

export default {
  name: 'MainComponent',
  setup() {
    const state = reactive<State>({
      totalSupply: 0,
      doggieData: null,
      isLoading: false,
      error: null,
    });

    getTotalDoggiesSupply().then((totalSupply: number) => {
      state.totalSupply = totalSupply;
    });

    const getDoggieData = async (doggieId: string) => {
      state.isLoading = true;

      try {
        const [tokenURI, ownerId] = await Promise.all([
          contract.methods.tokenURI(doggieId).call(),
          contract.methods.ownerOf(doggieId).call(),
        ]);

        const { data } = await axios.get(tokenURI);

        state.doggieData = {
          id: doggieId,
          ownerId,
          image: data.image,
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
  <div>
    <span>{{ totalSupply }}</span>
    <button @click="getRandomDoggieData">Get Randon Doggie</button>
    <div v-if="doggieData">
      <span>{{ doggieData.name }}</span>
    </div>
  </div>
</template>
