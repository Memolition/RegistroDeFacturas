import * as Clientes from './Clientes';
import * as Facturas from './Facturas';
import * as Productos from './Productos';

// The top-level state object
export interface ApplicationState {
    clientes: Clientes.ClientesState | undefined;
    facturas: Facturas.ClientesState | undefined;
    productos: Productos.ClientesState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    clientes: Clientes.reducer,
    facturas: Facturas.reducer,
    productos: Productos.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

