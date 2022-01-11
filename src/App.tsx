import Films from './components/Films';
import AddFilms from './components/AddFilms';
import Message from './components/Message';

export default function App() {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>Star Wars Films</h2>
      <Films />
      <AddFilms />
      <Message />
    </div>
  );
}
