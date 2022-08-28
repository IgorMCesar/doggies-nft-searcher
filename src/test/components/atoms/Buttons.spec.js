import { mount } from '@vue/test-utils';
import Button from '@/components/atoms/Button.vue';

const onClick = jest.fn();

const defaultWrapper = mount(Button, {
  propsData: {
    onClick,
  },
  slots: {
    default: 'Button',
  },
});

const customWrapper = mount(Button, {
  propsData: {
    onClick: () => {},
    color: 'secondary',
    iconButton: true,
    fullWidth: true,
    isLoading: true,
  },
  slots: {
    default: 'Button',
  },
});

describe('Button', () => {
  it('renders', () => {
    expect(defaultWrapper.vm).toBeTruthy();
  });

  it('renders the correct markup with slots', () => {
    expect(defaultWrapper.text()).toContain('Button');
  });

  it('calls the onClick method when clicked', () => {
    defaultWrapper.trigger('click');
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Customize Button', () => {
  it('renders', () => {
    expect(customWrapper.vm).toBeTruthy();
  });

  it('renders the correct markup with custom class and slots', () => {
    expect(customWrapper.text()).toContain('Button');

    expect(customWrapper.classes('button-secondary')).toBe(true);
    expect(customWrapper.classes('button-full-width')).toBe(true);
    expect(customWrapper.classes('icon-button')).toBe(true);

    expect(customWrapper.attributes('disabled')).toBe('disabled');
  });
});
