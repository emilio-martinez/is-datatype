// tslint:disable no-object-literal-type-assertion object-literal-sort-keys

import { DataType } from '../../src/data-type';
import { isOptions } from '../../src/interfaces';

export const arraySchemaUseCases: Array<{
  description: string,
  test: object[],
  options: isOptions,
  expect: boolean
}> = [
  {
    description: 'Array of objects with string value properties.',
    test: [
      { label: 'item1', url: '/path' },
      { label: 'item2', url: '/path' },
      { label: 'item3', url: '/path' }
    ],
    options: <isOptions>{
      schema: {
        type: DataType.array,
        items: {
          type: DataType.object,
          props: {
            label: { type: DataType.string },
            url: { type: DataType.string }
          }
        }
      }
    },
    expect: true
  },
  {
    description: 'Array of objects with an additional property.',
    test: [
      { label: 'item1', url: '/path' },
      { labele: 'item2', url: '/path' },
      { label: 'item3', url: '/path' }
    ],
    options: <isOptions>{
      schema: {
        type: DataType.array,
        items: {
          type: DataType.object,
          props: {
            label: { type: DataType.string },
            url: { type: DataType.string }
          }
        }
      }
    },
    expect: true
  },
  {
    description: 'Array of objects with an additional property.',
    test: [
      { label: 'item1', url: '/path' },
      { labele: 'item2', url: '/path' },
      { label: 'item3', url: '/path' }
    ],
    options: <isOptions>{
      schema: {
        type: DataType.array,
        items: {
          type: DataType.object,
          props: {
            label: { type: DataType.string, required: true },
            url: { type: DataType.string }
          }
        }
      }
    },
    expect: false
  },
  {
    description: 'Array of arrays testing schema array.',
    test: [['label', 'url'], ['labele', 'url'], ['label', 'url']],
    options: <isOptions>{
      schema: {
        type: DataType.array,
        items: [
          {
            type: DataType.array,
            items: {
              type: DataType.string
            }
          }
        ]
      }
    },
    expect: true
  },
  {
    description: 'Array of arrays testing schema array.',
    test: [
      { portfolio: 'item1', assets: ['stocks', 'bonds'] },
      { portfolio: 'item2', assets: ['small stocks'] },
      { portfolio: 'item3', assets: ['cash', 'midstocks'] }
    ],
    options: <isOptions>{
      schema: {
        type: DataType.array,
        items: [
          {
            type: DataType.object,
            props: {
              portfolio: { type: DataType.string },
              assets: {
                type: DataType.array,
                items: { type: DataType.string }
              }
            }
          }
        ]
      }
    },
    expect: true
  },
  {
    description: 'Array of arrays testing schema array.',
    test: [
      { portfolio: 'item1', assets: ['stocks', 'bonds'] },
      { portfolio: 'item2', assets: 'small stocks' },
      { portfolio: 'item3', assets: ['cash', 'midstocks'] }
    ],
    options: <isOptions>{
      schema: {
        type: DataType.array,
        items: [
          {
            type: DataType.object,
            props: {
              portfolio: { type: DataType.string },
              assets: [
                {
                  type: DataType.array,
                  items: { type: DataType.string }
                },
                { type: DataType.string }
              ]
            }
          }
        ]
      }
    },
    expect: true
  },
  {
    description: 'Array of arrays testing schema array.',
    test: [
      { portfolio: 'item1', assets: ['stocks', 'bonds'] },
      { portfolio: 'item2', assets: 'small stocks' },
      { portfolio: 'item3', assets: 0 }
    ],
    options: <isOptions>{
      schema: {
        type: DataType.array,
        items: [
          {
            type: DataType.object,
            props: {
              portfolio: { type: DataType.string },
              assets: [
                {
                  type: DataType.array,
                  items: { type: DataType.string }
                },
                { type: DataType.string }
              ]
            }
          }
        ]
      }
    },
    expect: false
  }
];

export const objectSchemaUseCases: Array<{
  description: string,
  test: object
  options: isOptions,
  expect: boolean
}> = [
  {
    description: `Expect to validate that props are the correct type`,
    test: {
      headline: 'test1',
      length: 1,
      items: []
    },
    options: <isOptions>{
      schema: {
        props: {
          headline: { type: DataType.string },
          length: { type: DataType.number },
          items: { type: DataType.array }
        }
      }
    },
    expect: true
  },
  {
    description: `Expect to validate that props are the correct type`,
    test: {
      headline: 'test2',
      length: '2',
      items: []
    },
    options: <isOptions>{
      schema: {
        props: {
          headline: { type: DataType.string },
          length: { type: DataType.number },
          items: { type: DataType.array }
        }
      }
    },
    expect: false
  },
  {
    description: `Expect to validate required properties`,
    test: {
      headline: 'test3',
      length: '3',
      items: []
    },
    options: <isOptions>{
      schema: {
        props: {
          headline: { type: DataType.string },
          length: { type: DataType.any, required: true },
          items: { type: DataType.array }
        }
      }
    },
    expect: true
  },
  {
    description: `Expect to validate required properties`,
    test: {
      headline: 'test4',
      items: []
    },
    options: <isOptions>{
      schema: {
        props: {
          headline: { type: DataType.string, required: true },
          length: { required: true },
          items: { type: DataType.array }
        }
      }
    },
    expect: false
  },
  {
    description: `Expect to validate an array of a single type`,
    test: { headline: [0, 0] },
    options: <isOptions>{
      schema: {
        props: {
          headline: { type: DataType.array, options: { type: DataType.number } }
        }
      }
    },
    expect: true
  },
  {
    description: `Expect to validate an array of a single type`,
    test: { headline: [0, '0', 0] },
    options: <isOptions>{
      schema: {
        props: {
          headline: { type: DataType.array, options: { type: DataType.number } }
        }
      }
    },
    expect: false
  },
  {
    description: `Expect to validate an array of multiple possible types`,
    test: { headline: [0, '0', 0] },
    options: <isOptions>{
      schema: {
        props: {
          headline: { type: [DataType.array, DataType.string] }
        }
      }
    },
    expect: true
  },
  {
    description: `Expect to validate an array of multiple possible types`,
    test: { headline: "[ 0, '0', 0 ]" },
    options: <isOptions>{
      schema: {
        props: {
          headline: { type: [DataType.array, DataType.string] }
        }
      }
    },
    expect: true
  },
  {
    description: `Expect to validate an array with nested properties`,
    test: { stats: { name: 'John', age: 40 } },
    options: <isOptions>{
      schema: {
        props: {
          stats: {
            type: DataType.object,
            props: {
              name: { type: DataType.string },
              age: { type: DataType.number }
            }
          }
        }
      }
    },
    expect: true
  },
  {
    description: `Expect to validate an array with nested properties`,
    test: { stats: { name: 'John', page: 40 } },
    options: <isOptions>{
      schema: {
        props: {
          stats: {
            type: DataType.object,
            props: {
              name: { type: DataType.string },
              age: { type: DataType.number, required: true }
            }
          }
        }
      }
    },
    expect: false
  },
  {
    description: `Expect to mock address to validate`,
    test: {
      lines: ['1600 Pennsylvania Avenue Northwest'],
      zip: 'DC 20500',
      city: 'Washington',
      country: 'USA'
    },
    options: <isOptions>{
      schema: {
        type: DataType.object,
        props: {
          lines: {
            type: DataType.array,
            items: { type: DataType.string }
          },
          zip: { type: DataType.string },
          city: { type: DataType.string },
          country: { type: DataType.string, required: true }
        }
      }
    },
    expect: true
  },
  {
    description: `Expect to validate regardless of additional items.`,
    test: {
      foo: 0,
      additional1: 1,
      bar: {
        baz: 'abc',
        additional2: 2
      }
    },
    options: <isOptions>{
      schema: {
        props: {
          foo: { type: DataType.number },
          bar: {
            props: { baz: { type: DataType.string } }
          }
        }
      }
    },
    expect: true
  }
];
