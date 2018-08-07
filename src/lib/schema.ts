import { isTypeSchema } from './interfaces';
import { DATATYPE, DataType, DT, validMultiDataType } from './data-type';
import { isOneOfMultipleTypes } from './is';

/**
 * Tests an object against an object schema.
 */
export function matchesSchema(val: any, schema: isTypeSchema | isTypeSchema[]): boolean {
  const schemas = (<isTypeSchema[]>[]).concat(schema);

  /** Test every schema until at least one of them matches */
  for (const s of schemas) {
    /** Ensure DataType or DataType[]. If invalid, will set null. */
    const sType: DataType | DataType[] | null =
      s.type === undefined ? <DT>DATATYPE.any : validMultiDataType(s.type) ? s.type : null;

    /** Schema is considered false, so skip iteration. */
    if (sType === null) continue;

    /** Test if any of the data types matches */
    const sTypeValid = isOneOfMultipleTypes(val, sType, s.options);

    /** Extract the properties to test for into an array */
    const sProps = !!s.props && typeof s.props === 'object' ? s.props : {};
    const sPropKeys: string[] = Object.keys(sProps);
    const hasPropKeys = sPropKeys.length > 0;

    /** Whether the required properties are present. */
    const sRequiredValid = hasPropKeys
      ? sPropKeys.every(p => (sProps[p].required === true ? val[p] !== undefined : true))
      : true;

    /** Whether the properties match what's reflected in the schema. */
    const sPropsValid = hasPropKeys
      ? sPropKeys.every(
          p => (!!s.props && val && val[p] !== undefined ? matchesSchema(val[p], s.props[p]) : true)
        )
      : true;

    /** If `type` is Any, check whether value is array. If so, check items */
    const inferredArray = sType === <DT>DATATYPE.any && Array.isArray(val);

    /**
     * Whether Array items are valid
     * If we're dealing with an array, even if inferred, check the `items`. Otherwise, true.
     */
    const sItemsValid =
      (sType === <DT>DATATYPE.array || inferredArray) && sTypeValid && s.items !== undefined
        ? (val as any[]).every(i => matchesSchema(i, s.items as isTypeSchema | isTypeSchema[]))
        : true;

    if (sTypeValid && sRequiredValid && sPropsValid && sItemsValid) return true;
  }

  return false;
}
