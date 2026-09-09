export type Safe<T> = [error: null, data: T] | [error: Error, data: null]

export async function safe<T>(promise: Promise<T>): Promise<Safe<T>> {
  try {
    return [null, await promise]
  } catch (err) {
    return [err instanceof Error ? err : new Error(String(err)), null]
  }
}
