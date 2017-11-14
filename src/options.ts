import { DataType, DATATYPE, DT, validDataType } from './data-type'
import { isOptions, isTypeSchema, StrictOptions } from './interfaces'
import { NEGATIVE_INFINITY, POSITIVE_INFINITY } from './constants'
import { matchesSchema } from './schema'

function validSchema (val: any) {
  return val === null || matchesSchema(val, {
    /** `isTypeSchema` is always an object */
    props: {
      items: {
        items: { type: <DT> DATATYPE.object },
        type: [<DT> DATATYPE.object, <DT> DATATYPE.array]
      },
      options: { type: <DT> DATATYPE.object },
      props: { type: <DT> DATATYPE.object },
      required: { type: <DT> DATATYPE.boolean },
      type: {
        items: { type: <DT> DATATYPE.number },
        type: [<DT> DATATYPE.number, <DT> DATATYPE.array]
      }
    },
    type: <DT> DATATYPE.object
  })
}

export class Options implements StrictOptions {
  // from StrictOptionsObject
  readonly allowNull: boolean = false
  readonly arrayAsObject: boolean = false
  // from StrictOptionsMinMax
  readonly min: number = NEGATIVE_INFINITY
  readonly max: number = POSITIVE_INFINITY
  readonly exclMin: number = NEGATIVE_INFINITY
  readonly exclMax: number = POSITIVE_INFINITY
  // from StrictOptionsNumber
  readonly multipleOf: number = 0
  // from StrictOptionsString
  readonly pattern: string = '[sS]*'
  readonly patternFlags: string = ''
  readonly exclEmpty: boolean = false
  // from StrictOptionsSchema
  readonly schema: isTypeSchema | isTypeSchema[] | null = null
  // from StrictOptionsArray
  readonly type: DataType | DataType[] = <DT> DATATYPE.any

  constructor (options: isOptions | null | undefined) {
    // tslint:disable-next-line strict-boolean-expressions
    if (typeof options !== 'object' || !options) return

    for (const k in options) {
      const val = options[<keyof isOptions> k]
      if (this.hasOwnProperty(k) && val !== undefined) {
        if (
          (<keyof isOptions> k === 'type' && validDataType(<isOptions['type']> val)) ||
          (typeof val === 'string' && /^(pattern|patternFlags)$/.test(k)) ||
          (typeof val === 'boolean' && /^(exclEmpty|allowNull|arrayAsObject)$/.test(k)) ||
          (typeof val === 'number' && !isNaN(val) && /^(min|max|exclMin|exclMax|multipleOf)$/.test(k)) ||
          (<keyof isOptions> k === 'schema' && validSchema(val))
        ) {
          this[<keyof isOptions> k] = val
        } else {
          throw Error(`Provided invalid options param '${k}' in object ${JSON.stringify(options)}`)
        }
      }
    }
  }

  /**
   * Verifies whether the options object passed is already an instance of Options.
   * Otherwise creates an instance of Options
   */
  static ensure (options: isOptions | null | undefined): Options {
    // tslint:disable-next-line strict-boolean-expressions
    return options && options.constructor === Options ? <Options> options : new Options(options)
  }
}
