import {
  getLevelsWithTotal,
  convertTupleToLevel,
  getLevelsGroupedByPrice,
  getUpdatedLevels,
} from 'src/utils/OrderbookUtils';

describe('Unit | Utils | OrderbookUtils', () => {
  it('calculates correct level totals', () => {
    const levels = [
      { price: 1, size: 30 },
      { price: 2, size: 40 },
      { price: 3, size: 50 },
      { price: 4, size: 60 },
    ];

    const expectedResults = [
      {
        price: 1,
        size: 30,
        total: 30,
      },
      {
        price: 2,
        size: 40,
        total: 70,
      },
      {
        price: 3,
        size: 50,
        total: 120,
      },
      {
        price: 4,
        size: 60,
        total: 180,
      },
    ];
    expect(getLevelsWithTotal(levels)).toEqual(expectedResults);
  });

  it('converts tuples to levels', () => {
    expect(convertTupleToLevel([1, 2])).toEqual({ price: 1, size: 2 });
    expect(convertTupleToLevel([1.222222, 2.333333])).toEqual({ price: 1.222222, size: 2.333333 });
    expect(convertTupleToLevel([0, 0])).toEqual({ price: 0, size: 0 });
  });

  it('can group levels by price group', () => {
    const levels = [
      { price: 0.5, size: 30 },
      { price: 1, size: 40 },
      { price: 1.5, size: 50 },
      { price: 2, size: 60 },
      { price: 2.5, size: 60 },
      { price: 3.5, size: 60 },
      { price: 4.0, size: 60 },
      { price: 4.5, size: 60 },
    ];

    expect(getLevelsGroupedByPrice(levels, 0.5)).toEqual(levels);
    expect(getLevelsGroupedByPrice(levels, 1)).toEqual([
      { price: 0, size: 30 },
      { price: 1, size: 90 },
      { price: 2, size: 120 },
      { price: 3, size: 60 },
      { price: 4, size: 120 },
    ]);
    expect(getLevelsGroupedByPrice(levels, 2.5)).toEqual([
      { price: 0, size: 180 },
      { price: 2.5, size: 240 },
    ]);
  });

  it('can group levels by price group for decimals', () => {
    const levels = [
      { price: 0.05, size: 30 },
      { price: 0.1, size: 40 },
      { price: 0.15, size: 50 },
      { price: 0.2, size: 60 },
      { price: 0.25, size: 60 },
      { price: 0.35, size: 60 },
      { price: 0.4, size: 60 },
      { price: 0.45, size: 60 },
    ];

    expect(getLevelsGroupedByPrice(levels, 0.05)).toEqual([
      { price: 0.05, size: 30 },
      { price: 0.1, size: 90 },
      { price: 0.2, size: 60 },
      { price: 0.25, size: 60 },
      { price: 0.3, size: 60 },
      { price: 0.4, size: 60 },
      { price: 0.45, size: 60 },
    ]);
    expect(getLevelsGroupedByPrice(levels, 0.1)).toEqual([
      { price: 0, size: 30 },
      { price: 0.1, size: 90 },
      { price: 0.2, size: 120 },
      { price: 0.3, size: 60 },
      { price: 0.4, size: 120 },
    ]);
    expect(getLevelsGroupedByPrice(levels, 0.25)).toEqual([
      { price: 0, size: 180 },
      { price: 0.25, size: 240 },
    ]);
  });

  it('it can update levels with a list of level updates', () => {
    const levels = [
      { price: 0.5, size: 30 },
      { price: 1, size: 40 },
      { price: 1.5, size: 50 },
      { price: 2, size: 60 },
    ];

    expect(getUpdatedLevels(levels, [], true)).toEqual(levels);
    expect(
      getUpdatedLevels(
        levels,
        [
          [0.5, 10],
          [5, 10],
        ],
        true
      )
    ).toEqual([
      { price: 0.5, size: 10 },
      { price: 1, size: 40 },
      { price: 1.5, size: 50 },
      { price: 2, size: 60 },
      { price: 5, size: 10 },
    ]);
    expect(
      getUpdatedLevels(
        levels,
        [
          [0.5, 0],
          [5, 0],
        ],
        true
      )
    ).toEqual([
      { price: 1, size: 40 },
      { price: 1.5, size: 50 },
      { price: 2, size: 60 },
    ]);
    expect(
      getUpdatedLevels(
        levels,
        [
          [0.5, 0],
          [5, 0],
          [0.5, 20],
          [5, 20],
        ],
        true
      )
    ).toEqual([
      { price: 0.5, size: 20 },
      { price: 1, size: 40 },
      { price: 1.5, size: 50 },
      { price: 2, size: 60 },
      { price: 5, size: 20 },
    ]);
  });

  it('updating levels with an empty list returns the original array', () => {
    const levels = [
      { price: 1.5, size: 50 },
      { price: 1, size: 40 },
      { price: 2, size: 60 },
      { price: 0.5, size: 30 },
    ];

    expect(getUpdatedLevels(levels, [], true)).toStrictEqual(levels);
    expect(getUpdatedLevels(levels, [], false)).toStrictEqual(levels);
  });

  it('when updating levels the level list is returned sorted', () => {
    const levels = [
      { price: 1.5, size: 50 },
      { price: 1, size: 40 },
      { price: 2, size: 60 },
      { price: 0.5, size: 30 },
    ];

    const sortedLevels = [
      { price: 1.5, size: 50 },
      { price: 1, size: 40 },
      { price: 2, size: 60 },
      { price: 0.5, size: 30 },
    ];

    expect(getUpdatedLevels(levels, [[1.5, 40]], true)).toEqual([
      { price: 0.5, size: 30 },
      { price: 1, size: 40 },
      { price: 1.5, size: 40 },
      { price: 2, size: 60 },
    ]);

    expect(getUpdatedLevels(levels, [[1.5, 40]], false)).toEqual([
      { price: 2, size: 60 },
      { price: 1.5, size: 40 },
      { price: 1, size: 40 },
      { price: 0.5, size: 30 },
    ]);
  });
});
