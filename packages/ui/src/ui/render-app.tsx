import './appearance';
import './redefinitions';
import './common/hammer';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router';

import {createAppStore} from './store';

import App from './containers/App/App';

import {configure} from '@gravity-ui/uikit';

import '@gravity-ui/uikit/styles/styles.scss';

import './legacy-styles/legacy.scss';
import './styles/redefinitions/redefinitions.scss';
import UIFactory, {configureUIFactory} from './UIFactory';

configure({lang: 'en'});

function AppRoot({store, history}: ReturnType<typeof createAppStore>) {
    return (
        <Provider store={store}>
            <Router history={history}>{UIFactory.wrapApp(<App />)}</Router>
        </Provider>
    );
}

export function renderApp(overrides: Partial<typeof UIFactory>) {
    configureUIFactory(overrides);
    const {store, history} = createAppStore();
    render(<AppRoot {...{store, history}} />, document.getElementById('root'));
}
