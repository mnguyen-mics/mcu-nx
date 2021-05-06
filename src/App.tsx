import './styles/index.less';
import { HashRouter as Router } from 'react-router-dom';
import Main from './containers/main/Main';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Main />
      </Router>
    </Provider>
  );
}

export default App;
