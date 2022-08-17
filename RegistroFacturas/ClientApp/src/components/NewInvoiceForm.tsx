import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Col, Row, Button, Table } from 'reactstrap';
import { ApplicationState } from '../store';
import * as ClientesStore from '../store/Clientes';
import * as ProductosStore from '../store/Productos';
import * as FacturasStore from '../store/Facturas';

import SearchCustomer from './SearchCustomer';
import NewInvoiceDetail from './NewInvoiceDetail';

type InvoiceProps =
    & ClientesStore.ClientesState
    & typeof ClientesStore.actionCreators;

type InvoiceState = {
    fecha: string;
    customer: ClientesStore.Cliente | null;
    productos: ProductosStore.Producto[];
}

class NewInvoiceForm extends React.PureComponent<InvoiceProps, InvoiceState> {
    constructor(props) {
        super(props);

        this.state = {
            fecha: (new Date()).toISOString().substring(0, 10),
            customer: null,
            productos: []
        };

        this.dateRef = React.createRef(null);
    }

    gotCustomer = (customer: ClientesStore.Cliente) => {
        this.dateRef?.current?.focus();
        this.setState({customer});
    }

    addProduct = (product) => {
        console.log('parent adding product', product);
        this.setState(prevState => ({
            productos: [
                ...prevState.productos,
                product
            ]
        }));
    }

    public render() {
        return (
            <Col>
                <Row>
                    <h1>Nueva Factura </h1>
                </Row>
                <Row className="py-2">
                    <Col>
                        <Input
                            type="date"
                            innerRef={ this.dateRef }
                            placeholder = "Fecha"
                            value = { this.state.fecha }
                            onChange = {(e) => {
                                const val = e.target.value;
                                this.setState({fecha: val})
                            }}
                        />
                    </Col>
                    <Col>
                        <Input
                            placeholder="No. Factura"
                        />
                    </Col>
                    <Col></Col>
                </Row>
                <SearchCustomer callback={this.gotCustomer} />

                {
                    this.state?.customer?.id && (
                        <Row>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <NewInvoiceDetail addProduct={this.addProduct} />

                                    {
                                        this.state.productos.map((producto: ProductosStore.Producto, productoIndex:number) => {
                                            return (
                                                <tr key={ `invoice_product_${producto.producto.id}_${productoIndex}`}>
                                                    <td>{producto.producto.nombre}</td>
                                                    <td>{producto.cantidad}</td>
                                                    <td>{producto.total.toFixed(2, "0")}</td>
                                                </tr>
                                                );
                                        })
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2">Total</td>
                                        <td>{
                                            this.state.productos.reduce((acc, curr) => acc + curr.total, 0).toFixed(2, "0")
                                        }</td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Row>
                    )
                }

                {
                    !!this.state.productos.length && (
                        <Row>
                            <Button
                                color="primary"
                                onClick={() => {
                                    this.props.persistFactura({
                                        noFactura: 0,
                                        fecha: this.state.fecha,
                                        total: this.state.productos.reduce((acc, curr) => acc + curr.total, 0).toFixed(2, "0"),
                                        clienteId: this.state.customer.id,
                                        productos: this.state.productos,
                                    });
                                }}
                            >Guardar Factura</Button>
                        </Row>
                    )
                }
                
            </Col>
        );
    };
}

export default connect(
    (state: ApplicationState) => ({...state.clientes, ...state.facturas}),
    {
        ...ClientesStore.actionCreators,
        ...FacturasStore.actionCreators,
    }
)(NewInvoiceForm as any);
