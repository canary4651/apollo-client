import { render } from '@testing-library/react';

import App from './App';

jest.mock('@apollo/client', () => ({
  gql: jest.fn((x) => x),
  useQuery: jest.fn(() => ({
    loading: false,
    error: undefined,
    data: {
      allFilms: {
        films: [],
      },
    },
  })),
}));

describe('App', () => {
  it('renders greeting message', () => {
    const { container } = render(<App />);

    expect(container).toHaveTextContent('Hello, world!');
  });
});
