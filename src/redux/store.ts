import { combineSlices, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Importa o localStorage para a web

// Reducers
import appReducer from "./reducers/appReducer";
import authReducer from "./reducers/authReducer";
import cartReducer from "./reducers/cartReducer";

// 1. Configuração do Persist
const persistConfig = {
  key: 'root', // Chave onde o estado será salvo no localStorage
  storage, // Usa o localStorage do navegador
  // Lista branca: Apenas o 'cart' será salvo e carregado,
  // pois 'app' e 'auth' (se contiverem estados sensíveis ou voláteis)
  // não precisam ser persistidos na maioria dos casos.
  whitelist: ['cart'], 
};

const rootReducer = combineSlices({
  app: appReducer,
  auth: authReducer,
  cart: cartReducer,
});

// 2. Cria o Reducer Persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

// 3. Configura a Store com o Reducer Persistido
const store = configureStore({
  reducer: persistedReducer, // Usa o reducer persistido
  // 4. Adiciona o middleware para ignorar as ações do redux-persist
  // Isso evita avisos de não-serialização no console durante o processo de persistência/reidratação
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Exporta o Persistor
export const persistor = persistStore(store);

export default store;
