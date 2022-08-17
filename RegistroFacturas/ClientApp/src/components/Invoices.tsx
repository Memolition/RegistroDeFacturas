import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Col, Row, Table } from 'reactstrap';
import { ApplicationState } from '../store';
import InvoicesTable from './InvoicesTable';
import * as FacturasStore from '../store/Facturas';

type InvoicesTableProps =
    & FacturasStore.FacturasState
    & typeof FacturasStore.actionCreators;

type InvoicesTableState = {
    invoices: any[];
}

class Invoices extends React.PureComponent<InvoicesTableProps, InvoicesTableState> {
    constructor(props) {
        super(props);

        this.state = {
            invoices: [],
        };
    }

    componentDidMount() {
        if (!this.props.allFacturas?.length) {
            this.props.requestAllFacturas();
        }
    }

    componentDidUpdate() {
        console.log(this.props);
    }

    public render () {
        return (
            <InvoicesTable invoices={this.props.allFacturas} />
        );
    }
}

export default connect(
    (state: ApplicationState) => state.facturas,
    FacturasStore.actionCreators
)(Invoices as any);
