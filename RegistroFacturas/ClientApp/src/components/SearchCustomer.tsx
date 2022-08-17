import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Row, Col, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { ApplicationState } from '../store';
import * as ClientesStore from '../store/Clientes';
import throttle from 'lodash.throttle';

type SearchCustomerProps =
    & ClientesStore.ClientesState
    & typeof ClientesStore.actionCreators
    & {
        callback?: Function;
    };

type SearchCustomerState = {
    query: string;
    customer: ClientesStore.Cliente | null | false;
    validTaxId: null | boolean;
    create: boolean;
    saveState: string;
};

class SearchCustomer extends React.PureComponent<SearchCustomerProps, SearchCustomerState> {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            customer: null,
            validTaxId: null,
            create: false,
            saveState: "primary",
        };

        this.throttledQuery = throttle(this.queryCustomer, 1000);

        this.nombreRef = React.createRef(null);
        this.queryRef = React.createRef(null);
    }

    componentDidUpdate(prevProps) {
        if(
            this.props.isLoading === false
            && this.state.create === true
        ) {
            if(this.props.queryClientes.length > 0) {
                this.setState({
                    saveState: "success",
                    customer: this.props.queryClientes[0]
                });

                if(!!this.props.callback)
                    this.props.callback(this.props.queryClientes[0]);
            } else {
                this.setState({saveState: "danger"});
            }
        }
    }

    queryCustomer = () => {
        this.props.requestQueryClientes(this.state.query);
    }

    isEdited = () => {
        if (!!this.state?.customer?.id) {
            const stateCustomer = this.props.queryClientes.find(customer => customer.id === this.state.customer.id);

            return this.state.customer !== stateCustomer;
        }

        return false;
    }

    public render() {
        return (
            <Row className="py-2">
                <Col>
                    <Input
                        innerRef={this.nombreRef}
                        type="text"
                        placeholder="Nombre"
                        value={
                            this.state.customer?.nombre ?? ""
                        }
                        onChange={(e) => {
                            const val = e.target.value;

                            this.setState(state => ({
                                customer: {
                                    ...state.customer,
                                    nombre: val
                                }
                            }));
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                //TODO - Validate customer's name and tax id
                                if(
                                    this.state.customer.nombre.length > 3
                                    && this.state.query.length > 3
                                    && this.state.query.indexOf('-') > 1
                                ) {
                                    this.props.persistCliente({
                                        nombre: this.state.customer.nombre,
                                        nit: this.state.query,
                                    });

                                    this.setState({create: true});
                                }
                            }
                        }}
                    />
                </Col>
                <Col>
                    <Input
                        autoFocus
                        type="text"
                        placeholder="NIT"
                        value={this.state.query}
                        valid={this.state.validTaxId === true}
                        invalid={this.state.validTaxId === false}
                        onKeyDown={(e) => {
                            if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && this.props.queryClientes.length > 0) {
                                e.preventDefault();

                                const selectedClient = this.props.queryClientes.find(stateCustomer => stateCustomer.selected);
                                let nextSelected = this.props.queryClientes[0].id;

                                if (!!selectedClient) {
                                    nextSelected = e.key === "ArrowDown" ? selectedClient.id + 1 : selectedClient.id - 1;
                                }

                                const nextSelectedExists = this.props.queryClientes.find(stateCustomer => stateCustomer.id === nextSelected);
                                if (e.key === "ArrowDown" && !nextSelectedExists) {
                                    nextSelected = this.props.queryClientes[0].id;
                                }

                                if (e.key === "ArrowUp" && !nextSelectedExists) {
                                    nextSelected = this.props.queryClientes[this.props.queryClientes.length - 1].id;
                                }

                                this.props.setSelectedQueryCliente(nextSelected);
                            } else if (e.key === "Enter") {
                                e.preventDefault();

                                const selectedCustomer = this.props.queryClientes.find(customer => customer.selected);

                                this.setState(state => ({
                                    query: selectedCustomer ? selectedCustomer.nit : state.query,
                                    customer: selectedCustomer ? selectedCustomer : false,
                                }));

                                if (!selectedCustomer) {
                                    this.nombreRef?.current?.focus();
                                } else if(!!this.props.callback){
                                    this.props.callback(selectedCustomer);
                                }
                            }
                        }}
                        onBlur={() => {
                            //TODO Validate Tax ID
                            this.setState(state => ({
                                validTaxId: state.query.indexOf("-") >= 0
                            }));
                        }}
                        onChange={(e: any) => {
                            const val = e.target.value;

                            this.setState((state: SearchCustomerQuery) => ({
                                query: val,
                                customer: null,
                            }));

                            this.throttledQuery(val);
                        }}
                    />

                    {
                        !this.state.customer && this.state.query.length > 2 && this.props.queryClientes.length > 0 && (
                            <div>
                                <ListGroup>
                                    {
                                        this.props?.queryClientes?.map((queryCustomer: ClientesStore.Cliente, queryCustomerIndex: number) => {
                                            return (
                                                <ListGroupItem
                                                    key={`query_customer_item_${queryCustomerIndex}`}
                                                    className={["list-group-item", (queryCustomer.selected && "active")].join(" ")}
                                                    action
                                                    tag="button"
                                                    onClick={() => {
                                                        this.setState(state => ({
                                                            query: queryCustomer.nit,
                                                            customer: queryCustomer,
                                                        }));
                                                    }}
                                                >
                                                    {queryCustomer?.nit} - {queryCustomer?.nombre}
                                                </ListGroupItem>
                                            );
                                        })
                                    }
                                </ListGroup>
                            </div>
                        )
                    }
                </Col>

                <Col>
                    <Button
                        type="button"
                        color={this.state.saveState}
                        disabled={
                            //disabled when
                            //Existing customer not edited - TODO
                            //New customer tax ID invalid
                            //New customer invalid name
                            !!this.props?.isLoading || (!!this.state?.customer?.id ? this.isEdited() : (
                                (this.state?.customer?.nombre ?? "").trim().length < 3
                            ))
                        }
                    >
                        {
                            !this.state?.customer?.id ? "Guardar" : "Editar"
                        }
                    </Button>
                </Col>
            </Row>
        );
    };
}

export default connect(
    (state: ApplicationState) => state.clientes,
    ClientesStore.actionCreators
)(SearchCustomer as any);
