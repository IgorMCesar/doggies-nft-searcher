import Web3 from 'web3';
import abi from './theDoggiesABI';
import { ETH_PROVIDER_URL, TOKEN_ADDRESS } from '~/constants';

const web3 = new Web3(ETH_PROVIDER_URL);
const contract = new web3.eth.Contract(abi, TOKEN_ADDRESS);

export default contract;
