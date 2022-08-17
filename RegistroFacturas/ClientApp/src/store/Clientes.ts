import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ClientesState {
    isLoading: boolean;
    clientes: Cliente[];
}

export interface Cliente {
    id: number;
    nombre: string;
    nit: string;
}

interface RequestAllClientesAction {
    type: 'REQUEST_ALL_CLIENTES';
}
interface ReceiveClientesAction {
    type: 'RECEIVE_CLIENTES';
    clientes: Cliente[];
}

interface RequestQueryClientesAction {
    type: 'REQUEST_QUERY_CLIENTES';
}
interface ReceiveQueryClientesAction {
    type: 'RECEIVE_QUERY_CLIENTES';
}

interface SetSelectedQueryClienteAction {
    type: 'SET_SELECTED_QUERY_CLIENTE';
}

interface PersistCliente {
    type: 'PERSIST_CLIENTE';
    cliente: Cliente;
}

type KnownAction = RequestAllClientesAction | ReceiveClientesAction | RequestQueryClientesAction | SetSelectedQueryClienteAction | PersistCliente;

export const actionCreators = {
    requestAllClientes: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.clientes) {
            fetch(`clientes`)
                .then(response => response.json() as Promise<Cliente[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_CLIENTES', clientes: data });
                });

            dispatch({ type: 'REQUEST_ALL_CLIENTES'});
        }
    },
    requestQueryClientes: (query:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.clientes) {
            fetch(`clientes/search/${query}`)
                .then(response => response.json() as Promise<Cliente[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_QUERY_CLIENTES', clientes: data, query });
                });

            dispatch({ type: 'REQUEST_QUERY_CLIENTES', query });
        }
    },
    setSelectedQueryCliente: (index: number | false) => (dispatch, getState) => {
        dispatch({
            type: 'SET_SELECTED_QUERY_CLIENTE',
            index,
        })
    },
    persistCliente: (cliente: Cliente): AppThunkAction<KnownAction> => (dispatch, getState) => {
        fetch(`clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        })
        .then(response => response.json() as Promise<Cliente>)
        .then(data => {
            dispatch({ type: 'PERSISTED_CLIENTE', clientes: [data] });
        });

        dispatch({ type: 'PERSIST_CLIENTE', cliente });
    },
};

const unloadedState: ClientesState = {
    allClientes: [],
    queryClientes: [],
    isLoading: false,
};

export const reducer: Reducer<ClientesState> = (state: ClientesState | undefined, incomingAction: Action): ClientesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_ALL_CLIENTES':
            return {
                ...state,
                isLoading: true
            };
            break;
        case 'RECEIVE_CLIENTES':
            return {
                ...state,
                allClientes: action.clientes
            };
            break;
        case 'REQUEST_QUERY_CLIENTES':
            return {
                ...state,
                isLoading: true
            };
            break;
        case 'RECEIVE_QUERY_CLIENTES':
            return {
                ...state,
                queryClientes: action.clientes,
                query: action.query,
                isLoading: false
            };
            break;
        case 'SET_SELECTED_QUERY_CLIENTE':
            return {
                ...state,
                queryClientes: state.queryClientes.map((cliente) => ({
                    ...cliente,
                    selected: cliente.id === action.index
                })),
            };
            break;
        case 'PERSIST_CLIENTE':
            return {
                ...state,
                isLoading: true,
                queryClientes: []
            };
            break;
        case 'PERSISTED_CLIENTE':
            console.log('persisted cliente', action);
            return {
                ...state,
                isLoading: false,
                queryClientes: action.clientes,
            };
            break;
    }

    return state;
};

