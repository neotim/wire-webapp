/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from './module/reducer';
import thunk from 'redux-thunk';

export const configureStore = (thunkArguments = {}) => {
  const store = createStore(combineReducers(reducers), createMiddleware(thunkArguments));
  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./module/reducer/index.js', () => {
        store.replaceReducer(combineReducers(require('./module/reducer/index.js').default));
      });
    }
  }
  return store;
};

const createMiddleware = thunkArguments => {
  const middlewares = [thunk.withExtraArgument(thunkArguments)];
  const composeEnhancers = process.env.NODE_ENV !== 'production' ? composeWithDevTools : compose;
  return composeEnhancers(applyMiddleware(...middlewares));
};

export default configureStore;
