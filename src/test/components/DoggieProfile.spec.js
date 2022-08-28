import { mount } from '@vue/test-utils';
import doggieDataMock from '../mocks/doggieDataMock.json';
import DoggieProfile from '@/components/DoggieProfile.vue';

describe('DoggieProfile', () => {
  it('renders', () => {
    const wrapper = mount(DoggieProfile, {
      propsData: {
        doggieData: doggieDataMock,
      },
    });

    expect(wrapper.vm).toBeTruthy();
  });

  it('renders the correct markup', () => {
    const wrapper = mount(DoggieProfile, {
      propsData: {
        doggieData: doggieDataMock,
      },
    });

    expect(wrapper.html()).toContain('<h3>Doggy #0000</h3>');
  });
});
