import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ProductoState {
    query: string;
    isLoading: boolean;
    queryProductos: Producto[];
}

export interface Producto {
    id: number;
    nombre: string;
    precio: float;
}

interface RequestQueryProductosAction {
    type: 'REQUEST_QUERY_PRODUCTOS';
    query: string
}
interface ReceiveQueryProductosAction {
    type: 'RECEIVE_QUERY_PRODUCTOS';
    productos: Producto[]
}

interface SetSelectedQueryProductoAction {
    type: 'SET_SELECTED_QUERY_PRODUCTO';
}

interface PersistProducto{
    type: 'PERSIST_PRODUCTO';
    producto: Producto;
}

type KnownAction = RequestQueryProductosAction | SetSelectedQueryProductoseAction | PersistProducto;

export const actionCreators = {
    requestQueryProductos: (query:string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        fetch(`productos/search/${query}`)
            .then(response => response.json() as Promise<Producto[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_QUERY_PRODUCTOS', productos: data });
            });

        dispatch({ type: 'REQUEST_ALL_PRODUCTOS'});
    },
    
    setSelectedQueryProducto: (index: number | false) => (dispatch, getState:any) => {
        dispatch({
            type: 'SET_SELECTED_QUERY_PRODUCTO',
            index,
        })
    },

    persistProducto: (producto: Producto): AppThunkAction<KnownAction> => (dispatch, getState) => {
        fetch(`producto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        })
        .then(response => response.json() as Promise<Producto>)
        .then(data => {
            dispatch({ type: 'PERSISTED_PRODUCTO', productos: [data] });
        });

        dispatch({ type: 'PERSIST_PRODUCTO', producto });
    },
};

const unloadedState: ProductosState = {
    query: "",
    queryProductos: [],
    isLoading: false,
};

export const reducer: Reducer<ProductosState> = (state: ProductosState | undefined, incomingAction: Action): ProductosState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_QUERY_PRODUCTOS':
            return {
                ...state,
                isLoading: true
            };
            break;
        case 'RECEIVE_QUERY_PRODUCTOS':
            return {
                ...state,
                queryProductos: action.productos,
                query: action.query,
                isLoading: false
            };
            break;
        case 'SET_SELECTED_QUERY_PRODUCTO':
            return {
                ...state,
                queryProductos: state.queryProductos.map((producto) => ({
                    ...producto,
                    selected: producto.id === action.index
                })),
            };
            break;
        case 'PERSIST_PRODUCTO':
            return {
                ...state,
                isLoading: true,
                queryProducto: []
            };
            break;
        case 'PERSISTED_PRODUCTO':
            return {
                ...state,
                isLoading: false,
                queryProducto: action.productos,
            };
            break;
    }

    return state;
};

