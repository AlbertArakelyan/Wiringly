import { createContext } from 'react';

import type { IAppStateContext } from './types';

// null means no provider above, which useAppState turns into a thrown error
export const AppStateContext = createContext<IAppStateContext | null>(null);
