import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Col, Row, Table } from 'reactstrap';
import { ApplicationState } from '../store';
import * as FacturasStore from '../store/Facturas';

type InvoicesTableProps =
    & FacturasStore.FacturasState
    & typeof FacturasStore.actionCreators;

type InvoicesTableState = {
    invoices: FacturasStore.Factura[];
}

class InvoicesTable extends React.PureComponent<InvoicesTableProps, InvoicesTableState> {
    componentDidMount() {
        console.log(this.props);
    }

    componentDidUpdate() {
        console.log(this.props);
    }

    public render () {
        return (
            <Row>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NIT</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.invoices?.map((invoice: FacturasStore.Factura) => {
                                return (
                                    <tr key={`invoice_item_${invoice.id}`}>
                                        <td>{invoice.noFactura}</td>
                                        <td>{invoice.cliente.nit}</td>
                                        <td>{invoice.cliente.nombre}</td>
                                        <td>{invoice.fecha}</td>
                                        <td>{invoice.id}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </Row>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.facturas,
    FacturasStore.actionCreators
)(InvoicesTable as any);
