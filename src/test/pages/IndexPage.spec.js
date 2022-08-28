import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import doggieResponseMock from '../mocks/doggieResponseMock.json';
import doggieDataMock from '../mocks/doggieDataMock.json';
import IndexPage from '@/pages/index.vue';
import contract from '~/contracts/theDoggiesContract';

jest.mock('~/contracts/theDoggiesContract');

contract.methods = {
  totalSupply: jest.fn(() => ({
    call: jest.fn(() => 10000),
  })),
  tokenURI: jest.fn(() => ({
    call: jest.fn(() => 'https://example.com/image.png'),
  })),
  ownerOf: jest.fn(() => ({
    call: jest.fn(() => '0x123'),
  })),
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(doggieResponseMock),
  })
);

describe('IndexPage', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('renders', () => {
    const wrapper = mount(IndexPage);

    expect(wrapper.vm).toBeTruthy();
  });

  it('renders the correct markup', () => {
    const wrapper = mount(IndexPage);

    expect(wrapper.html()).toContain('<h1>The Doggies Explorer</h1>');
  });

  it('sets doggie data after search', async () => {
    const wrapper = mount(IndexPage);
    await wrapper.setData({ doggieId: '0' });

    expect(wrapper.vm.isLoading).toBe(false);

    await wrapper.find('[search-button]').trigger('click');

    expect(wrapper.vm.isLoading).toBe(true);
    expect(wrapper.vm.doggieData).toBe(null);

    await flushPromises();

    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.doggieData).toStrictEqual(doggieDataMock);
  });

  it('sets random doggie data on random search', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1);
    const wrapper = mount(IndexPage);

    expect(wrapper.vm.isLoading).toBe(false);

    await wrapper.find('[random-button]').trigger('click');

    expect(wrapper.vm.doggieId).toBe('9999');
    expect(wrapper.vm.isLoading).toBe(true);
    expect(wrapper.vm.doggieData).toBe(null);

    await flushPromises();

    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.doggieData).toStrictEqual({
      ...doggieDataMock,
      id: '9999',
    });
  });

  it('renders error message in case of re-search', async () => {
    const errorMessage = 'Search for a different doggie.';
    const wrapper = mount(IndexPage);
    await wrapper.setData({ doggieData: doggieDataMock });
    await wrapper.setData({ doggieId: '0' });

    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.find('[error-text]').exists()).toBe(false);

    await wrapper.find('[search-button]').trigger('click');

    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.error).toBe(errorMessage);

    expect(wrapper.find('[error-text]').exists()).toBe(true);
    expect(wrapper.find('[error-text]').text()).toEqual(errorMessage);
  });

  it('renders error message in case of empty token id', async () => {
    const errorMessage = 'Enter a doggie id to search.';
    const wrapper = mount(IndexPage);

    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.find('[error-text]').exists()).toBe(false);

    await wrapper.find('[search-button]').trigger('click');

    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.error).toBe(errorMessage);

    expect(wrapper.find('[error-text]').exists()).toBe(true);
    expect(wrapper.find('[error-text]').text()).toEqual(errorMessage);
  });

  it('only allows correct number range on input', async () => {
    const wrapper = mount(IndexPage);
    const input = wrapper.find('[search-input]');

    input.element.value = '10000000';
    await input.trigger('change');
    expect(wrapper.vm.doggieId).toBe('9999');

    input.element.value = '-1';
    await input.trigger('change');
    expect(wrapper.vm.doggieId).toBe('0');

    input.element.value = 'a';
    await input.trigger('change');
    expect(wrapper.vm.doggieId).toBe('');
  });

  it('renders doggie profile component', async () => {
    const wrapper = mount(IndexPage);

    expect(wrapper.find('[doggie-profile]').exists()).toBe(false);

    await wrapper.setData({ doggieData: doggieDataMock });

    expect(wrapper.find('[doggie-profile]').exists()).toBe(true);
  });
});
