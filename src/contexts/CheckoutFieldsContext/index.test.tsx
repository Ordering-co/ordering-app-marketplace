import React from 'react';
import { render, renderHook, waitFor, act } from '@testing-library/react-native';

import { useApi, useConfig, useSession } from '@components';
import { CheckoutFieldsProvider, useProfileCompletion, useSuppressProfileGate } from './index';

const field = (code: string, overrides: any = {}) => ({
  order_type_id: 1,
  enabled: true,
  required: true,
  validation_field: { code },
  ...overrides,
});

const setSession = (session: any) => {
  (useSession as jest.Mock).mockReturnValue([session, { login: jest.fn(), logout: jest.fn() }]);
};

const setConfigs = (configs: any, loading = false) => {
  (useConfig as jest.Mock).mockReturnValue([{ configs, loading }]);
};

const mockFetchResult = (fields: any[]) => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    json: async () => ({ error: false, result: fields }),
  });
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CheckoutFieldsProvider>{children}</CheckoutFieldsProvider>
);

describe('useProfileCompletion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useApi as jest.Mock).mockReturnValue([{ root: 'https://api.test' }]);
    setConfigs({ default_order_type: { value: 'delivery' } });
    mockFetchResult([]);
  });

  it('nunca gatea a un invitado y no dispara el fetch', async () => {
    setSession({ auth: true, user: { id: 1, guest_id: 'g1' }, token: 'tok' });
    mockFetchResult([field('name')]);

    const { result } = renderHook(() => useProfileCompletion(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isRequired).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('no gatea a un usuario no autenticado', async () => {
    setSession({ auth: false, user: null, token: null });

    const { result } = renderHook(() => useProfileCompletion(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isRequired).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('gatea cuando faltan campos requeridos del default order type', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' });
    mockFetchResult([field('name'), field('lastname')]);

    const { result } = renderHook(() => useProfileCompletion(), { wrapper });

    await waitFor(() => expect(result.current.isRequired).toBe(true));
    expect(result.current.missingFields).toEqual(['name', 'lastname']);
    const codes = result.current.checkoutFields.map((f: any) => f?.validation_field?.code);
    expect(codes).toEqual(['name', 'lastname']);
  });

  it('no gatea a un usuario con todos los campos completos', async () => {
    setSession({ auth: true, user: { id: 7, name: 'Carlos', lastname: 'Gomez' }, token: 'tok' });
    mockFetchResult([field('name'), field('lastname')]);

    const { result } = renderHook(() => useProfileCompletion(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isRequired).toBe(false);
    expect(result.current.missingFields).toEqual([]);
  });

  it('fail-open: si el fetch falla, no gatea', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' });
    (global as any).fetch = jest.fn().mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useProfileCompletion(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isRequired).toBe(false);
  });

  it('fail-open: mientras carga, no gatea', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' });
    (global as any).fetch = jest.fn().mockReturnValue(new Promise(() => {})); // nunca resuelve

    const { result } = renderHook(() => useProfileCompletion(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(true));
    expect(result.current.isRequired).toBe(false);
  });

  it('skip() desactiva el gate en la sesión actual', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' });
    mockFetchResult([field('name')]);

    const { result } = renderHook(() => useProfileCompletion(), { wrapper });

    await waitFor(() => expect(result.current.isRequired).toBe(true));
    act(() => { result.current.skip(); });
    await waitFor(() => expect(result.current.isRequired).toBe(false));
  });

  it('canSkip refleja el flag profile_completion_skip_enabled', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' });
    setConfigs({ default_order_type: { value: 'delivery' }, profile_completion_skip_enabled: { value: '1' } });
    mockFetchResult([field('name')]);

    const { result } = renderHook(() => useProfileCompletion(), { wrapper });

    await waitFor(() => expect(result.current.canSkip).toBe(true));
  });

  it('useSuppressProfileGate desactiva el gate mientras la pantalla está montada y lo reactiva al desmontarla', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' });
    mockFetchResult([field('name')]);

    const captured: any = { current: null };
    const Suppressor = () => { useSuppressProfileGate(); return null; };
    const Reader = () => { captured.current = useProfileCompletion(); return null; };
    const Harness = ({ suppress }: { suppress: boolean }) => (
      <>
        <Reader />
        {suppress ? <Suppressor /> : null}
      </>
    );

    const { rerender } = render(<Harness suppress />, { wrapper });
    await waitFor(() => expect(captured.current.missingFields).toEqual(['name']));
    expect(captured.current.isRequired).toBe(false);

    rerender(<Harness suppress={false} />);
    await waitFor(() => expect(captured.current.isRequired).toBe(true));
  });
});
