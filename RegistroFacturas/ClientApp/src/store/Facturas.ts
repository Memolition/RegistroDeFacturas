import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { Cliente } from './Clientes';

export interface FacturasState {
    isLoading: boolean;
    allFacturas: Factura[];
    queryFacturas: Factura[];
}

export interface Factura {
    id: number;
    fecha: Date;
    noFactura: string;
    clienteId: number;
    cliente?: Cliente,
    detalles?: any[];
}

interface RequestAllFacturasAction {
    type: 'REQUEST_ALL_FACTURAS';
}
interface ReceiveAllFacturasAction {
    type: 'RECEIVE_ALL_FACTURAS';
    clientes: Factura[];
}

interface PersistFactura {
    type: 'PERSIST_FACTURA';
}
interface PersistedFactura {
    type: 'PERSISTED_FACTURA';
    facturas: Factura[];
}

type KnownAction = RequestAllFacturasAction | ReceiveAllFacturasAction;

export const actionCreators = {
    requestAllFacturas: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.clientes) {
            fetch(`facturas`)
                .then(response => response.json() as Promise<Factura[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_ALL_FACTURAS', facturas: data });
                });

            dispatch({ type: 'REQUEST_ALL_FACTURAS'});
        }
    },
    persistFactura: (factura: Factura): AppThunkAction<KnownAction> => (dispatch, getState) => {
        fetch(`facturas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(factura)
        })
        .then(response => response.json() as Promise<Factura>)
        .then(data => {
            dispatch({ type: 'PERSISTED_FACTURA', facturas: [data] });
        });

        dispatch({ type: 'PERSIST_FACTURA' });
    },
};

const unloadedState: FacturasState = {
    allFacturas: [],
    queryFacturas: [],
    isLoading: false,
};

export const reducer: Reducer<ClientesState> = (state: FacturasState | undefined, incomingAction: Action): FacturasState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_ALL_FACTURAS':
            return {
                ...state,
                isLoading: true
            };
            break;
        case 'RECEIVE_ALL_FACTURAS':
            return {
                ...state,
                allFacturas: action.facturas
            };
            break;
        case 'PERSIST_FACTURA':
            return {
                ...state,
                queryFacturas: [],
                isLoading: true,
            };
            break;
        case 'PERSISTED_FACTURA':
            return {
                ...state,
                isLoading: false,
                queryFacturas: action.facturas 
            };
            break;
    }

    return state;
};

