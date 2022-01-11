import { gql, useSubscription } from '@apollo/client';

export const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    messageAdded
  }
`;

export default function Message() {
  const { loading, error, data } = useSubscription(MESSAGE_SUBSCRIPTION);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error!</p>;

  const { messageAdded } = data;

  return (
    <p>
      New message:
      {' '}
      {messageAdded}
    </p>
  );
}
