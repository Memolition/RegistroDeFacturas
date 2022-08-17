import * as React from 'react';
import { Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Invoices from './components/Invoices';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/historial' component={Invoices} />
    </Layout>
);

