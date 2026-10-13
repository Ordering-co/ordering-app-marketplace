import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useApi, useConfig, useSession } from '@components';
import { buildGateCheckoutFields, computeMissingProfileFields } from './profileFields';

interface CheckoutFieldsState {
  fields: any[];
  loading: boolean;
  error: any;
  fetchedForUserId: number | null;
}

interface CheckoutFieldsContextValue {
  state: CheckoutFieldsState;
  suppressCount: number;
  suppress: () => void;
  release: () => void;
  skipped: boolean;
  skip: () => void;
}

const initialState: CheckoutFieldsState = { fields: [], loading: false, error: null, fetchedForUserId: null };

const CheckoutFieldsContext = createContext<CheckoutFieldsContextValue>({
  state: initialState,
  suppressCount: 0,
  suppress: () => {},
  release: () => {},
  skipped: false,
  skip: () => {},
});

export const CheckoutFieldsProvider = ({ children }: { children: React.ReactNode }) => {
  const [ordering] = useApi();
  const [{ auth, user, token }] = useSession();
  const [state, setState] = useState<CheckoutFieldsState>(initialState);
  const [suppressCount, setSuppressCount] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const suppress = useCallback(() => {
    setSuppressCount(count => count + 1);
  }, []);

  const release = useCallback(() => {
    setSuppressCount(count => Math.max(0, count - 1));
  }, []);

  const skip = useCallback(() => {
    setSkipped(true);
  }, []);

  const isGuest = !!user?.guest_id;

  useEffect(() => {
    let cancelled = false;
    setSkipped(false);

    const getCheckoutFields = async () => {
      if (!auth || isGuest || !token) {
        setState(initialState);
        return;
      }
      setState({ fields: [], loading: true, error: null, fetchedForUserId: null });
      try {
        const response = await fetch(`${ordering.root}/validation_field_order_types`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const content = await response.json();
        if (cancelled) return;
        if (content?.error) {
          setState({ fields: [], loading: false, error: content?.result, fetchedForUserId: null });
          return;
        }
        setState({ fields: content?.result ?? [], loading: false, error: null, fetchedForUserId: user?.id ?? null });
      } catch (err: any) {
        if (cancelled) return;
        setState({ fields: [], loading: false, error: err?.message ?? true, fetchedForUserId: null });
      }
    };

    getCheckoutFields();
    return () => {
      cancelled = true;
    };
  }, [auth, isGuest, token, user?.id, ordering?.root]);

  const contextValue = useMemo<CheckoutFieldsContextValue>(
    () => ({ state, suppressCount, suppress, release, skipped, skip }),
    [state, suppressCount, suppress, release, skipped, skip],
  );

  return (
    <CheckoutFieldsContext.Provider value={contextValue}>
      {children}
    </CheckoutFieldsContext.Provider>
  );
};

export const useCheckoutFields = () => useContext(CheckoutFieldsContext).state;

/** Keeps the gate off while the screen is mounted, so a stack swap cannot interrupt
 *  an order the user is placing. */
export const useSuppressProfileGate = () => {
  const { suppress, release } = useContext(CheckoutFieldsContext);

  useEffect(() => {
    suppress();
    return () => {
      release();
    };
  }, [suppress, release]);
};

export const useProfileCompletion = () => {
  const { fields, loading, error, fetchedForUserId } = useCheckoutFields();
  const { suppressCount, skipped, skip } = useContext(CheckoutFieldsContext);
  const [{ auth, user }] = useSession();
  const [{ configs, loading: configsLoading }] = useConfig();

  // Backend flag, not implemented server-side yet: when absent the gate stays mandatory.
  const canSkip = configs?.profile_completion_skip_enabled?.value === '1';

  const missingFields = useMemo(
    () => computeMissingProfileFields({ user, fields, configs }),
    [user, fields, configs],
  );

  const checkoutFields = useMemo(
    () => buildGateCheckoutFields({ fields, configs, missingFields }),
    [fields, configs, missingFields],
  );

  const isRequired =
    !!auth &&
    !user?.guest_id &&
    !loading &&
    !error &&
    !configsLoading &&
    !!user?.id &&
    fetchedForUserId === user?.id &&
    missingFields.length > 0 &&
    suppressCount === 0 &&
    !skipped;

  return { isRequired, missingFields, checkoutFields, loading, canSkip, skip };
};
