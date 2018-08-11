import { isTypeSchema } from './interfaces';
import { DATATYPE, DataType, DT, validMultiDataType } from './data-type';
import { isOneOfMultipleTypes } from './is';

/**
 * Tests an value against an schema.
 */
export function matchesSchema(val: any, schema: isTypeSchema | isTypeSchema[] | null): boolean {
  return (
    !schema ||
    (<isTypeSchema[]>[]).concat(schema).some(({ type: sType, props, items, options }) => {
      const type: DataType | DataType[] | null =
        sType === undefined ? <DT>DATATYPE.any : validMultiDataType(sType) ? sType : null;

      // tslint:disable-next-line:strict-boolean-expressions
      if (!type) return false;

      const typeValid = type === <DT>DATATYPE.any || isOneOfMultipleTypes(val, type, options);

      /**
       * Prop checks
       */

      const propKeys: string[] = props && typeof props === 'object' ? Object.keys(props) : [];
      const hasPropKeys = propKeys.length > 0;

      const requiredPropsValid =
        !hasPropKeys ||
        // tslint:disable-next-line:no-non-null-assertion
        propKeys.every(p => (props![p].required === true ? val[p] !== undefined : true));

      const propTypesAreValid =
        !hasPropKeys ||
        propKeys.every(
          // tslint:disable-next-line:no-non-null-assertion
          p => (val && val[p] !== undefined ? matchesSchema(val[p], props![p]) : true)
        );

      /**
       * Items check
       */

      const itemsValid =
        items &&
        ((type === <DT>DATATYPE.array && typeValid) ||
          (type === <DT>DATATYPE.any && Array.isArray(val)))
          ? (val as any[]).every(i => matchesSchema(i, items))
          : true;

      return typeValid && requiredPropsValid && propTypesAreValid && itemsValid;
    })
  );
}
