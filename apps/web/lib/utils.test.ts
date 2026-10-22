import { describe, expect, it } from "vitest"
import { clamp, initials, slugify } from "./utils"
import { formatDate, formatTime, splitDay } from "./format"

describe("utils", () => {
  it("slugifies Spanish names", () => {
    expect(slugify("Copa Cadejos 3x3")).toBe("copa-cadejos-3x3")
    expect(slugify("  Niño del Año  ")).toBe("nino-del-ano")
  })

  it("limits values", () => {
    expect(clamp(12, 0, 10)).toBe(10)
    expect(clamp(-3, 0, 10)).toBe(0)
  })

  it("builds initials", () => {
    expect(initials("Valeria Rivas")).toBe("VR")
    expect(initials("Tornuti")).toBe("T")
  })

  it("formats in the Salvadoran timezone regardless of the runtime", () => {
    expect(formatTime("2026-11-07T21:00:00Z")).toBe("3:00 p. m.")
    expect(formatDate("2026-11-07T21:00:00Z")).toContain("7 de noviembre de 2026")
    expect(splitDay("2026-11-07T21:00:00Z")).toEqual({ day: "07", month: "NOV" })
  })
})
