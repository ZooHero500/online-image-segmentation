interface Point {
  x: number
  y: number
}

interface Size {
  w: number
  h: number
}

interface WorkspaceBounds {
  width: number
  height: number
}

export function calculateWorkspaceBounds(
  positions: Point[],
  sizes: Size[]
): WorkspaceBounds {
  if (positions.length === 0 || sizes.length === 0) {
    return { width: 1, height: 1 }
  }

  let maxRight = 1
  let maxBottom = 1

  for (let index = 0; index < Math.max(positions.length, sizes.length); index++) {
    const position = positions[index]
    const size = sizes[index]
    if (!position || !size) continue

    maxRight = Math.max(maxRight, position.x + size.w)
    maxBottom = Math.max(maxBottom, position.y + size.h)
  }

  return {
    width: maxRight,
    height: maxBottom,
  }
}
