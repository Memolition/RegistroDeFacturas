import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Col, Row, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { ApplicationState } from '../store';
import throttle from 'lodash.throttle';
import * as FacturasStore from '../store/Facturas';
import * as ProductosStore from '../store/Productos';

type InvoiceDetailProps =
    & ProductosStore.ClientesState
    & typeof ProductosStore.actionCreators
    & {
        addProduct: Function;
    };

type InvoiceDetailState = {
    query: string;
    producto: ProductosStore.Producto;
    quantity: number;
    total: number;
    newProduct: ProductosStore.Producto;
    isSearching: boolean;
}

class InvoiceDetail extends React.PureComponent<InvoiceDetailProps, InvoiceDetailState> {
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
            <tr>
                <td>
                    <Input
                        placeholder="Producto"
                        onChange={(e) => {
                            const val = e.target.value;

                            this.setState({ query: val, isSearching: true });
                            }
                        }
                    />
                    {
                        (this.state.isSearching || !this.state?.producto?.id) && (
                            <ListGroup>
                                {
                                    this.props.queryProductos?.map(product => (
                                        <ListGroupItem
                                            key={ `product_item_${product.id}`}
                                            onClick={() => {
                                                this.setState({
                                                    producto: product,
                                                    isSearching: false,
                                                });
                                            }}
                                    > { product.nombre} </ListGroupItem>
                                    ))
                                }

                                <ListGroupItem>
                                    <Row>
                                        <Col>   
                                            <span>
                                                Crear nuevo Producto "{this.state.query}"
                                            </span>
                                        </Col>
                                        <Col>
                                            <Input
                                                value={this.state.newProduct.price}

                                                onChange={(e) => {
                                                    const valPrice = e.target.value.replace(/[^\d.], ""/);
                                                    const floatPrice = parseFloat(valPrice);
                                                    const realPrice = isNaN(floatPrice) ? 0 : floatPrice;

                                                    this.setState(prevState => ({
                                                        newProduct: {
                                                            ...prevState.newProduct,
                                                            price: realPrice,
                                                        }
                                                    }))
                                                }}
                                                onBlur={() => {
                                                    this.setState({
                                                        isSearching: false,
                                                    })
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <Button
                                                onClick={
                                                    () => {
                                                        console.log('new product', this.state.newProduct);
                                                    }
                                                }
                                            >
                                                Guardar
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            </ListGroup>
                        )
                    }
                < /td>
                < td >
                        <Input
                            placeholder="Cantidad"
                            onChange={(e) => {
                                const val = e.target.value?.replace(/[^\d]/, "");
                                const quantityInt = parseInt(val);
                                const quantityValidated = isNaN(quantityInt) ? 1 : quantityInt;

                                this.setState(prevState => ({
                                    quantity: quantityValidated,
                                    total: quantityValidated * (prevState.producto?.precio ?? 0)
                                }));
                            }}
                        />
                    < /td>
            < td >
                        {(this.state.total ?? 0.00).toFixed(2, ".").toString()}
                        </td>
                        <td>
                            <Button
                                onClick={() => {
                                    console.log('adding product');
                                    this.props.addProduct({
                                        producto: this.state.producto,
                                        cantidad: this.state.quantity,
                                        total: this.state.total,
                                    });
                                }}
                            >Agregar</Button>
                        </td>
                    < /tr>
        );
    };
}

export default connect(
    (state: ApplicationState) => ({...state.productos, ...state.facturas }),
    {
                                                ...ProductosStore.actionCreators,
        ...FacturasStore.actionCreators,
    }
)(InvoiceDetail as any);

