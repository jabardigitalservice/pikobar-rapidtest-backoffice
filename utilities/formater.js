export function getChipColor(status) {
  const chipColor =
    status === 'PUBLISHED' || status === 'APPROVED' ? 'success' : 'default'
  return chipColor
}

export function toCapitalizeCase(word) {
  return word
    .split(' ')
    .map((text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
    .join(' ')
}
