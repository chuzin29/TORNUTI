/**
 * Canal de sincronización entre StretchyButton y el guante del cursor.
 * Cada botón publica su nivel de agarre (0..1) mientras el puntero está
 * dentro de su radio; el guante lee el máximo reciente y lo decae.
 * Módulo compartido en cliente: mantiene el estado fuera del DOM.
 */
export const gripBus = {
  value: 0,
}

/** Publica el nivel de agarre del paso actual del botón. */
export function publishGrip(value: number) {
  if (value > gripBus.value) gripBus.value = value
}

/** El guante decae el valor cada fotograma para que vuelva a cero. */
export function decayGrip(rate = 0.045) {
  gripBus.value = Math.max(0, gripBus.value - rate)
}
