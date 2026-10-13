/** Must stay in sync with the order type table in @components OrderContext. */
export const ORDER_TYPE_ID_BY_SLUG: { [slug: string]: number } = {
  delivery: 1,
  pickup: 2,
  eatin: 3,
  curbside: 4,
  drivethru: 5,
  catering_delivery: 7,
  catering_pickup: 8,
};

/** Only user attributes the profile form can persist may gate the app: anything else
 *  could never be cleared, locking the user on the gate screen forever. */
export const GATEABLE_FIELD_CODES = [
  'name',
  'lastname',
  'middle_name',
  'second_lastname',
  'email',
  'cellphone',
  'birthdate',
];

interface ComputeParams {
  user?: any;
  fields?: any[];
  configs?: any;
}

export const computeMissingProfileFields = ({ user, fields, configs }: ComputeParams): string[] => {
  if (!user || user?.guest_id) return [];
  if (!Array.isArray(fields)) return [];

  const defaultOrderTypeId = ORDER_TYPE_ID_BY_SLUG[configs?.default_order_type?.value];
  if (!defaultOrderTypeId) return [];

  const defaultTypeFields = fields.filter(
    (field: any) => field?.order_type_id === defaultOrderTypeId && field?.enabled,
  );

  const missing: string[] = [];
  const addMissing = (code: string) => {
    if (!user?.[code] && !missing.includes(code)) missing.push(code);
  };

  defaultTypeFields.forEach((field: any) => {
    const code = field?.validation_field?.code;
    if (!field?.required || !GATEABLE_FIELD_CODES.includes(code)) return;
    addMissing(code);
  });

  const isRequiredField = (code: string) =>
    defaultTypeFields.some((field: any) => field?.validation_field?.code === code && field?.required);

  if (isRequiredField('mobile_phone') || configs?.verification_phone_required?.value === '1') {
    addMissing('cellphone');
  }
  if (isRequiredField('email') || configs?.verification_email_required?.value === '1') {
    addMissing('email');
  }

  return missing;
};

interface BuildGateCheckoutFieldsParams {
  fields?: any[];
  configs?: any;
  missingFields?: string[];
}

const GATE_FIELD_BY_USER_ATTRIBUTE: { [attribute: string]: { code: string; name: string } } = {
  cellphone: { code: 'mobile_phone', name: 'Mobile phone' },
  email: { code: 'email', name: 'Email' },
};

export const buildGateCheckoutFields = ({ fields, configs, missingFields }: BuildGateCheckoutFieldsParams): any[] => {
  const defaultOrderTypeId = ORDER_TYPE_ID_BY_SLUG[configs?.default_order_type?.value];
  if (!defaultOrderTypeId) return [];

  const realFields = Array.isArray(fields)
    ? fields.filter((field: any) => field?.order_type_id === defaultOrderTypeId)
    : [];

  const codesToSynthesize = new Set<string>();
  (missingFields ?? []).forEach((attribute: string) => {
    const synthetic = GATE_FIELD_BY_USER_ATTRIBUTE[attribute];
    if (!synthetic) return;

    const hasEnabledEntry = realFields.some(
      (field: any) => field?.validation_field?.code === synthetic.code && field?.enabled,
    );
    if (hasEnabledEntry) return;

    codesToSynthesize.add(synthetic.code);
  });

  const fallbackNameByCode: { [code: string]: string } = {};
  Object.values(GATE_FIELD_BY_USER_ATTRIBUTE).forEach(({ code, name }) => {
    fallbackNameByCode[code] = name;
  });

  const result: any[] = [];
  const handledCodes = new Set<string>();

  realFields.forEach((field: any) => {
    const code = field?.validation_field?.code;
    if (code && handledCodes.has(code)) return;
    if (code) handledCodes.add(code);

    if (code && codesToSynthesize.has(code)) {
      result.push({
        ...field,
        enabled: true,
        required: true,
        validation_field: {
          ...field.validation_field,
          name: field?.validation_field?.name || fallbackNameByCode[code],
        },
      });
      return;
    }

    result.push(field);
  });

  codesToSynthesize.forEach((code: string) => {
    if (handledCodes.has(code)) return;

    result.push({
      order_type_id: defaultOrderTypeId,
      enabled: true,
      required: true,
      validation_field: { code, name: fallbackNameByCode[code] },
    });
  });

  return result;
};
