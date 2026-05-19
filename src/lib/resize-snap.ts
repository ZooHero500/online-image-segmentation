export interface SnapGuide {
  pos: number
  type: "edge" | "center"
}

export interface SnapResult {
  snappedX: number
  snappedY: number
  guidesX: SnapGuide[]
  guidesY: SnapGuide[]
}

export function calculateSnap(
  imageX: number,
  imageY: number,
  imageW: number,
  imageH: number,
  artboard: { width: number; height: number },
  threshold: number
): SnapResult {
  let snappedX = imageX
  let snappedY = imageY
  const guidesX: SnapGuide[] = []
  const guidesY: SnapGuide[] = []

  // Horizontal snap
  const imgLeft = imageX
  const imgRight = imageX + imageW
  const imgCenterX = imageX + imageW / 2
  const abCenterX = artboard.width / 2

  let bestDx = threshold + 1

  const dLeft = Math.abs(imgLeft - 0)
  if (dLeft < bestDx) { bestDx = dLeft; snappedX = 0 }

  const dRight = Math.abs(imgRight - artboard.width)
  if (dRight < bestDx) { bestDx = dRight; snappedX = artboard.width - imageW }

  const dCenterX = Math.abs(imgCenterX - abCenterX)
  if (dCenterX < bestDx) { bestDx = dCenterX; snappedX = abCenterX - imageW / 2 }

  if (bestDx <= threshold) {
    if (snappedX === 0) guidesX.push({ pos: 0, type: "edge" })
    else if (snappedX === artboard.width - imageW) guidesX.push({ pos: artboard.width, type: "edge" })
    else guidesX.push({ pos: abCenterX, type: "center" })
  } else {
    snappedX = imageX
  }

  // Vertical snap
  const imgTop = imageY
  const imgBottom = imageY + imageH
  const imgCenterY = imageY + imageH / 2
  const abCenterY = artboard.height / 2

  let bestDy = threshold + 1

  const dTop = Math.abs(imgTop - 0)
  if (dTop < bestDy) { bestDy = dTop; snappedY = 0 }

  const dBottom = Math.abs(imgBottom - artboard.height)
  if (dBottom < bestDy) { bestDy = dBottom; snappedY = artboard.height - imageH }

  const dCenterY = Math.abs(imgCenterY - abCenterY)
  if (dCenterY < bestDy) { bestDy = dCenterY; snappedY = abCenterY - imageH / 2 }

  if (bestDy <= threshold) {
    if (snappedY === 0) guidesY.push({ pos: 0, type: "edge" })
    else if (snappedY === artboard.height - imageH) guidesY.push({ pos: artboard.height, type: "edge" })
    else guidesY.push({ pos: abCenterY, type: "center" })
  } else {
    snappedY = imageY
  }

  return { snappedX, snappedY, guidesX, guidesY }
}
