import { DataType, DATATYPE, DT, validMultiDataType } from './data-type';
import { isOptions, isTypeSchema, StrictOptions } from './interfaces';
import { matchesSchema } from './schema';

function validSchema(val: unknown) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AssignIfTest = (v: any) => boolean;

const validStr: AssignIfTest = v => typeof v === 'string';
const validBool: AssignIfTest = v => typeof v === 'boolean';
const validNum: AssignIfTest = v => typeof v === 'number' && !isNaN(v);

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

  constructor(opts: isOptions | null | undefined) {
    if (opts === null || opts === undefined) return;

    this._assignIf(validMultiDataType, opts, 'type');
    this._assignIf(validStr, opts, ['pattern', 'patternFlags']);
    this._assignIf(validBool, opts, ['exclEmpty', 'arrayAsObject']);
    this._assignIf(validNum, opts, ['min', 'max', 'multipleOf']);
    this._assignIf(validSchema, opts, 'schema');
  }

  private _assignIf<K extends keyof this>(test: AssignIfTest, opts: isOptions, keys: K | K[]) {
    for (const k of ([] as K[]).concat(keys)) {
      const val = opts[<keyof isOptions>k] as this[K] | undefined;

      if (val !== undefined) {
        if (!test(val)) {
          throw Error(`Invalid option provided: ${k}`);
        }
        this[k] = val;
      }
    }
  }
}
