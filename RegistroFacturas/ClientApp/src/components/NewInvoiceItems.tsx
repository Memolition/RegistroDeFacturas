import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Col, Row, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { ApplicationState } from '../store';
import throttle from 'lodash.throttle';
import * as FacturasStore from '../store/Facturas';
import * as ProductosStore from '../store/Productos';

type NewInvoiceItemsProps =
    & ProductosStore.ClientesState
    & typeof ProductosStore.actionCreators;

type NewInvoiceItemsState = {
    query: string;
    producto: ProductosStore.Producto;
    quantity: number;
    total: number;
    newProduct: ProductosStore.Producto;
    isSearching: boolean;
}

class NewInvoiceItems extends React.PureComponent<NewInvoiceItemsProps, NewInvoiceItemsState > {
    constructor(props) {
        super(props);

        this.state = {
            isSearching: false,
            query: "",
            producto: null,
            quantity: 1,
            total: 0.00,
            newProduct: {
                nombre: "",
                precio: 0.00
            }
        };

        this.throttledQuery = throttle(this.queryProduct, 1000);
    }

    queryProduct() {
        this.props.requestQueryProductos(this.state.query);
    }

    componentDidUpdate(prevProps: InvoiceDetailProps, prevState: InvoiceDetailState) {
        if (prevState.query !== this.state.query) {
            this.throttledQuery();
        }
        console.log(this.props, this.state);
    }

    public render() {
        return (
            <Table>
                <thead></thead>
            </Table>
        );
    };
}

export default connect(
    (state: ApplicationState) => ({...state.productos, ...state.facturas }),
    {
        ...ProductosStore.actionCreators,
        ...FacturasStore.actionCreators,
    }
)(NewInvoiceItems as any);

