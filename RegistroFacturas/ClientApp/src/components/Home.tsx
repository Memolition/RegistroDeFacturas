import * as React from 'react';
import { connect } from 'react-redux';

import NewInvoiceForm from './NewInvoiceForm';

const Home = () => (
    <div>
        <NewInvoiceForm />
  </div>
);

export default connect()(Home);

