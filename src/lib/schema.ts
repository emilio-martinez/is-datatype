import { isTypeSchema } from './interfaces';
import { DATATYPE, DataType, DT, validMultiDataType } from './data-type';
import { isOneOfMultipleTypes } from './is';

/**
 * Tests an value against an schema.
 */
export function matchesSchema(val: unknown, schema: isTypeSchema | isTypeSchema[] | null): boolean {
  return (
    schema === null ||
    (<isTypeSchema[]>[]).concat(schema).some(({ type: sType, props, items, options }) => {
      const type: DataType | DataType[] | null =
        sType === undefined ? <DT>DATATYPE.any : validMultiDataType(sType) ? sType : null;

      if (type === null) return false;

      const typeValid = type === <DT>DATATYPE.any || isOneOfMultipleTypes(val, type, options);

      /**
       * Prop checks
       */

      const propKeys: string[] =
        props !== undefined && props !== null && typeof props === 'object'
          ? Object.keys(props)
          : [];

      const requiredPropsValid = propKeys.every(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
        (p) => (props![p].required === true ? (val as any)[p] !== undefined : true)
      );

      const propTypesAreValid = propKeys.every((p) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
        val && (val as any)[p] !== undefined ? matchesSchema((val as any)[p], props![p]) : true
      );

      /**
       * Items check
       */

      const itemsValid =
        items !== undefined &&
        ((type === <DT>DATATYPE.array && typeValid) ||
          (type === <DT>DATATYPE.any && Array.isArray(val)))
          ? (val as unknown[]).every((i) => matchesSchema(i, items))
          : true;

      return typeValid && requiredPropsValid && propTypesAreValid && itemsValid;
    })
  );
}
