import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';

import Message, { MESSAGE_SUBSCRIPTION } from './Message';

const cache = new InMemoryCache();

const mocks = [
  {
    request: {
      query: MESSAGE_SUBSCRIPTION,
      variables: {},
    },
    result: {
      data: {
        messageAdded: '2014-12-10T14:23:31.880000Z',
      },
    },
  },
];

describe('Message', () => {
  function Component() {
    return (
      <MockedProvider mocks={mocks} cache={cache}>
        <Message />
      </MockedProvider>
    );
  }

  it('renders message', async () => {
    const { container } = render(<Component />);

    expect(container).toHaveTextContent('Loading...');

    await waitFor(() => {
      expect(container).toHaveTextContent('2014-12-10T14:23:31.880000Z');
    });
  });
});
