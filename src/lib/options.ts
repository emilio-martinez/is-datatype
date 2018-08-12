import { DataType, DATATYPE, DT, validMultiDataType } from './data-type';
import { isOptions, isTypeSchema, StrictOptions } from './interfaces';
import { matchesSchema } from './schema';

function validSchema(val: any) {
  return (
    val === null ||
    matchesSchema(val, {
      /** `isTypeSchema` is always an object */
      props: {
        items: {
          items: { type: <DT>DATATYPE.object },
          type: [<DT>DATATYPE.object, <DT>DATATYPE.array]
        },
        options: { type: <DT>DATATYPE.object },
        props: { type: <DT>DATATYPE.object },
        required: { type: <DT>DATATYPE.boolean },
        type: {
          items: { type: <DT>DATATYPE.number },
          type: [<DT>DATATYPE.number, <DT>DATATYPE.array]
        }
      },
      type: <DT>DATATYPE.object
    })
  );
}

const toKeyRegex = (arr: (keyof isOptions)[]) => RegExp(`^(${arr.join('|')})$`);

const stringParamRegex = toKeyRegex(['pattern', 'patternFlags']);
const booleanParamRegex = toKeyRegex(['exclEmpty', 'arrayAsObject']);
const numberParamRegex = toKeyRegex(['min', 'max', 'multipleOf']);

export class Options implements StrictOptions {
  // from StrictOptionsObject
  readonly arrayAsObject: boolean = false;
  // from StrictOptionsMinMax
  readonly min: number = Number.NEGATIVE_INFINITY;
  readonly max: number = Number.POSITIVE_INFINITY;
  // from StrictOptionsNumber
  readonly multipleOf: number = 0;
  // from StrictOptionsString
  readonly pattern: string = '[sS]*';
  readonly patternFlags: string = '';
  readonly exclEmpty: boolean = false;
  // from StrictOptionsSchema
  readonly schema: isTypeSchema | isTypeSchema[] | null = null;
  // from StrictOptionsArray
  readonly type: DataType | DataType[] = <DT>DATATYPE.any;

  constructor(options: isOptions | null | undefined) {
    if (options === null || options === undefined) return;

    for (const k in options) {
      const val = options[<keyof isOptions>k];
      if (this.hasOwnProperty(k) && val !== undefined) {
        if (
          (<keyof isOptions>k === 'type' && validMultiDataType(<isOptions['type']>val)) ||
          (typeof val === 'string' && stringParamRegex.test(k)) ||
          (typeof val === 'boolean' && booleanParamRegex.test(k)) ||
          (typeof val === 'number' && !isNaN(val) && numberParamRegex.test(k)) ||
          (<keyof isOptions>k === 'schema' && validSchema(<isOptions['schema']>val))
        ) {
          this[<keyof isOptions>k] = val;
        } else {
          throw Error(`Provided invalid options param '${k}' in object ${JSON.stringify(options)}`);
        }
      }
    }
  }
}
