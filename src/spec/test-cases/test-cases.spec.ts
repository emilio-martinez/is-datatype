import { DataType } from '../../is.func';
import * as NSTC from './non-schema.spec';

/**
 * NOTE:
 * This file aggregates several DataType test cases.
 * The use of this is to have a set of all DataType
 * tests to run against every DataType, exclusing
 * the DataType in question, and making sure that
 * it returns `false`.
 */

let aggregateUseCases = [];
aggregateUseCases[DataType.number] = [ ...NSTC.validNumberUseCases, ...NSTC.validNumberNegativeUseCases, ...NSTC.invalidNumberUseCases ];
aggregateUseCases[DataType.string] = [ ...NSTC.validStringUseCases ];
aggregateUseCases[DataType.boolean] = [ ...NSTC.validBooleanUseCases ];
aggregateUseCases[DataType.function] = [ ...NSTC.validFunctionUseCases ];
aggregateUseCases[DataType.array] = NSTC.validArrayUseCases.slice().map( n => n.test );
aggregateUseCases[DataType.object] = [ ...NSTC.validObjectUseCases ];
aggregateUseCases[DataType.undefined] = [ ...NSTC.validUndefinedUseCases ];

export { aggregateUseCases };
export * from './non-schema.spec';
export * from './schema.spec';