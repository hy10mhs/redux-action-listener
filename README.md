## Redux Action Listener

#### Middleware Setting

```
import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as reduxActionListenerMiddleware } from './withAction';

const middlewares = [reduxActionListenerMiddleware];

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  && process.env.NODE_ENV === `development`
  ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
    compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);
```

#### How to Use

```
import withAction from './withAction';

@withAction
class Sample extends Component {
  componentDidMount() {
    this.props.addActionListeners({
      'ACTION TYPE': this.handler, // You must bind this handler to this instance (ex: this.handler.bind(this) in constructor)
    });
  }
  
  handler() {
    ...
  }
}
```
