import { BadRequestException } from '@nestjs/common';

export const toNumber = (value: unknown) => {
  const number = Number(value);
  if (Number.isNaN(number)) {
    throw new BadRequestException(`Unable to convert '${value}' to a number.`);
  }
  return number;
};
export const toNumberArray = (array: unknown): number[] => {
  if (!Array.isArray(array)) {
    throw new BadRequestException(`value ${array} is not an array`);
  }
  const numberArray: number[] = [];

  for (const value of array) {
    const number = toNumber(value);
    numberArray.push(number);
  }
  return numberArray;
};

export const toDateArray = (array: unknown): Date[] => {
  if (!Array.isArray(array)) {
    throw new BadRequestException(`value ${array} is not an array`);
  }
  const dateArray: Date[] = [];
  for (const value of array) {
    const date = new Date(value);
    const time = date.getTime();
    if (isNaN(time) === true) {
      throw new BadRequestException(`Unable to convert ${value} to a Date`);
    }
    dateArray.push(date);
  }
  return dateArray;
};
