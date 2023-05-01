export const cloneArray = items =>
  items.map(item =>
    Array.isArray(item)
      ? cloneArray(item)
      : item
    )