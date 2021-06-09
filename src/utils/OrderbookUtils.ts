import { LevelWithTotal } from 'src/types/LevelWithTotal';
import { Level } from 'src/types/Level';

/**
 * Takes an ordered array of levels and calculates the total for each level based on previous levels.
 * @param levels
 * @returns Level array with new total field.
 */
export function getLevelsWithTotal(levels: Level[]): LevelWithTotal[] {
  const results: LevelWithTotal[] = [];

  levels.forEach((level, index) => {
    const prevTotal = results[index - 1]?.total ?? 0;

    results.push({
      ...level,
      total: prevTotal + level.size,
    });
  });

  return results;
}

/**
 * Converts the level tuple from the API to a Level object
 * @param param0 The tuple being converted.
 * @returns Returns a level object.
 */
export function convertTupleToLevel([price, size]: [number, number]): Level {
  return {
    price,
    size,
  };
}

export function getLevelsGroupedByPrice(levels: Level[], grouping: number): Level[] {
  const levelMap: Map<number, Level> = new Map();

  levels.forEach((level) => {
    const groupedPrice = Math.floor(level.price / grouping) * grouping;
    const groupedLevel = levelMap.get(groupedPrice);

    if (groupedLevel) {
      groupedLevel.size += level.size;
    } else {
      levelMap.set(groupedPrice, { ...level, price: groupedPrice });
    }
  });

  return [...levelMap.values()];
}

/**
 * Updates an array of levels, with an array of level updates.
 * @param currentLevels Levels currently in the orderbook.
 * @param levelUpdates Level update tuples from the websocket API
 * @param isAscending True / false if levels should ascend or descend based on price.
 * @returns Updated levels array.
 */
export function getUpdatedLevels(
  currentLevels: Level[],
  levelUpdates: [number, number][] = [],
  isAscending: Boolean
): Level[] {
  if (levelUpdates.length === 0) {
    return currentLevels;
  }

  const levelMap: Map<number, Level> = new Map();

  currentLevels.forEach((level) => {
    levelMap.set(level.price, level);
  });

  levelUpdates.forEach(([price, size]) => {
    if (size === 0) {
      levelMap.delete(price);
    } else {
      levelMap.set(price, { price, size });
    }
  });

  const results = [...levelMap.values()];

  if (isAscending) {
    return results.sort((a, b) => {
      return a.price - b.price;
    });
  } else {
    return results.sort((a, b) => {
      return b.price - a.price;
    });
  }
}
