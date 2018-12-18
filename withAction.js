import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

const listener = (() => {
  const _listeners = {};

  const middleware = store => next => ({ type, ...rest }) => {
    _listeners[type] && _listeners[type].forEach(lst => lst(rest));
    next({ type, ...rest });
  }

  const addListener = (type, fn) => {
    if (_listeners[type]) {
      _listeners[type] = [..._listeners[type].filter(f => f != fn), fn];
    } else {
      _listeners[type] = [fn];
    }

    return () => {
      _listeners[type] = _listeners[type].filter(f => f != fn);
    }
  }

  return {
    middleware,
    addListener,
  }
})();

export const middleware = listener.middleware;
const addActionListener = listener.addListener;

export default (WrappedComponent) => {
  class ListenerComponent extends React.Component {
    static WrappedComponent = WrappedComponent;

    static displayName = `withAction(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    unsub = [];

    componentWillUnmount() {
      this.unsub.forEach(fn => fn());
    }

    addActionListeners = (listeners) => {
      this.unsub = Object.keys(listeners).reduce((pv, type) => ([
          ...pv,
          addActionListener(type, listeners[type]),
        ]), [])
    }

    render() {
      return (
        <WrappedComponent addActionListeners={this.addActionListeners} {...this.props} />
      )
    }
  }

  return hoistNonReactStatics(ListenerComponent, WrappedComponent);
};
