import { buildGateCheckoutFields, computeMissingProfileFields } from './profileFields';

const field = (code: string, overrides: any = {}) => ({
  order_type_id: 1,
  enabled: true,
  required: true,
  validation_field: { code },
  ...overrides,
});

const configs = { default_order_type: { value: 'delivery' } };

describe('computeMissingProfileFields', () => {
  it('devuelve los campos requeridos que el usuario no tiene', () => {
    const user = { id: 1, cellphone: '600100200' };
    const fields = [field('name'), field('lastname'), field('email')];
    expect(computeMissingProfileFields({ user, fields, configs })).toEqual(['name', 'lastname', 'email']);
  });

  it('devuelve [] si el usuario tiene todo', () => {
    const user = { id: 1, name: 'Carlos', lastname: 'Gomez', email: 'c@x.com' };
    const fields = [field('name'), field('lastname'), field('email')];
    expect(computeMissingProfileFields({ user, fields, configs })).toEqual([]);
  });

  it('nunca bloquea a un invitado', () => {
    const user = { id: 1, guest_id: 'abc' };
    const fields = [field('name')];
    expect(computeMissingProfileFields({ user, fields, configs })).toEqual([]);
  });

  it('ignora campos requeridos que no son atributos del usuario', () => {
    const user = { id: 1, name: 'Carlos' };
    const fields = [field('coupon'), field('driver_tip'), field('comments'), field('zipcode')];
    expect(computeMissingProfileFields({ user, fields, configs })).toEqual([]);
  });

  it('ignora campos de un order type que no es el default', () => {
    const user = { id: 1 };
    const fields = [field('name', { order_type_id: 2 })];
    expect(computeMissingProfileFields({ user, fields, configs })).toEqual([]);
  });

  it('ignora campos deshabilitados o no requeridos', () => {
    const user = { id: 1 };
    const fields = [field('name', { enabled: false }), field('lastname', { required: false })];
    expect(computeMissingProfileFields({ user, fields, configs })).toEqual([]);
  });

  it('exige cellphone cuando mobile_phone es requerido', () => {
    const user = { id: 1, name: 'Carlos' };
    const fields = [field('mobile_phone')];
    expect(computeMissingProfileFields({ user, fields, configs })).toEqual(['cellphone']);
  });

  it('exige cellphone cuando la verificación de teléfono es obligatoria', () => {
    const user = { id: 1 };
    const fields: any[] = [];
    const _configs = { ...configs, verification_phone_required: { value: '1' } };
    expect(computeMissingProfileFields({ user, fields, configs: _configs })).toEqual(['cellphone']);
  });

  it('exige email cuando la verificación de email es obligatoria aunque el checkout field no lo pida', () => {
    const user = { id: 1, cellphone: '600100200' };
    const fields: any[] = [];
    const _configs = { ...configs, verification_email_required: { value: '1' } };
    expect(computeMissingProfileFields({ user, fields, configs: _configs })).toEqual(['email']);
  });

  it('no duplica un campo exigido por dos vías', () => {
    const user = { id: 1 };
    const fields = [field('email')];
    const _configs = { ...configs, verification_email_required: { value: '1' } };
    expect(computeMissingProfileFields({ user, fields, configs: _configs })).toEqual(['email']);
  });

  it('fail-open si el default order type no resuelve', () => {
    const user = { id: 1 };
    const fields = [field('name')];
    expect(computeMissingProfileFields({ user, fields, configs: {} })).toEqual([]);
    expect(computeMissingProfileFields({ user, fields, configs: { default_order_type: { value: 'nope' } } })).toEqual([]);
  });

  it('fail-open si no hay usuario o no hay fields', () => {
    expect(computeMissingProfileFields({ user: null, fields: [field('name')], configs })).toEqual([]);
    expect(computeMissingProfileFields({ user: { id: 1 }, fields: undefined, configs })).toEqual([]);
  });
});

describe('buildGateCheckoutFields', () => {
  it('sintetiza una entrada mobile_phone habilitada cuando la verificación de teléfono la exige y no existe', () => {
    const fields: any[] = [];
    const _configs = { ...configs, verification_phone_required: { value: '1' } };
    const result = buildGateCheckoutFields({ fields, configs: _configs, missingFields: ['cellphone'] });
    const phone = result.filter((f: any) => f?.validation_field?.code === 'mobile_phone');
    expect(phone).toHaveLength(1);
    expect(phone[0].enabled).toBe(true);
    expect(phone[0].required).toBe(true);
  });

  it('sintetiza una entrada email habilitada cuando la verificación de email la exige y no existe', () => {
    const fields: any[] = [];
    const _configs = { ...configs, verification_email_required: { value: '1' } };
    const result = buildGateCheckoutFields({ fields, configs: _configs, missingFields: ['email'] });
    const email = result.filter((f: any) => f?.validation_field?.code === 'email');
    expect(email).toHaveLength(1);
    expect(email[0].enabled).toBe(true);
    expect(email[0].required).toBe(true);
  });

  it('reemplaza una fila real DESHABILITADA de mobile_phone en vez de duplicarla', () => {
    const fields = [field('mobile_phone', { enabled: false, required: false })];
    const result = buildGateCheckoutFields({ fields, configs, missingFields: ['cellphone'] });
    const phone = result.filter((f: any) => f?.validation_field?.code === 'mobile_phone');
    expect(phone).toHaveLength(1);
    expect(phone[0].enabled).toBe(true);
    expect(phone[0].required).toBe(true);
  });

  it('reemplaza una fila real DESHABILITADA de email en vez de duplicarla', () => {
    const fields = [field('email', { enabled: false, required: false })];
    const _configs = { ...configs, verification_email_required: { value: '1' } };
    const result = buildGateCheckoutFields({ fields, configs: _configs, missingFields: ['email'] });
    const email = result.filter((f: any) => f?.validation_field?.code === 'email');
    expect(email).toHaveLength(1);
    expect(email[0].enabled).toBe(true);
    expect(email[0].required).toBe(true);
  });

  it('no sintetiza para un código que ya tiene una entrada habilitada (no duplica)', () => {
    const fields = [field('email', { enabled: true, required: true })];
    const result = buildGateCheckoutFields({ fields, configs, missingFields: ['email'] });
    const email = result.filter((f: any) => f?.validation_field?.code === 'email');
    expect(email).toHaveLength(1);
  });

  it('deja pasar sin tocar una fila deshabilitada de un código que NO está en missingFields', () => {
    const fields = [field('birthdate', { enabled: false, required: false })];
    const result = buildGateCheckoutFields({ fields, configs, missingFields: [] });
    const birthdate = result.find((f: any) => f?.validation_field?.code === 'birthdate');
    expect(birthdate.enabled).toBe(false);
    expect(birthdate.required).toBe(false);
  });

  it('preserva los fields reales del default order type y excluye los de otros order types', () => {
    const fields = [field('name'), field('lastname', { order_type_id: 2 })];
    const result = buildGateCheckoutFields({ fields, configs, missingFields: [] });
    const codes = result.map((f: any) => f?.validation_field?.code);
    expect(codes).toContain('name');
    expect(codes).not.toContain('lastname');
  });

  it('no muta los objetos de entrada', () => {
    const original = field('mobile_phone', { enabled: false, required: false });
    buildGateCheckoutFields({ fields: [original], configs, missingFields: ['cellphone'] });
    expect(original.enabled).toBe(false);
    expect(original.required).toBe(false);
  });

  it('no inventa una fila sintética para un campo que no sea cellphone/email (p. ej. name)', () => {
    const fields: any[] = [];
    const result = buildGateCheckoutFields({ fields, configs, missingFields: ['name'] });
    expect(result).toEqual([]);
  });

  it('devuelve [] si el default order type no resuelve', () => {
    const fields = [field('name')];
    expect(buildGateCheckoutFields({ fields, configs: {}, missingFields: [] })).toEqual([]);
  });
});
