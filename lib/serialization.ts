import { Prisma } from '@prisma/client';

export function serializePrisma<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value instanceof Prisma.Decimal) {
        return value.toNumber();
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    })
  );
}