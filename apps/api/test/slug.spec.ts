import { slugify, uniqueSlug } from "../src/common/utils/slug"

describe("slugify", () => {
  it("normalizes accents and spaces", () => {
    expect(slugify("Copa Cadejos 3x3")).toBe("copa-cadejos-3x3")
    expect(slugify("Ajedrez del Barrio")).toBe("ajedrez-del-barrio")
    expect(slugify("Óscar Cañas")).toBe("oscar-canas")
  })

  it("removes punctuation and trims separators", () => {
    expect(slugify("  Liguilla Aura: Valorant!  ")).toBe("liguilla-aura-valorant")
    expect(slugify("---")).toBe("")
  })

  it("limits the length of generated slugs", () => {
    expect(slugify("a".repeat(120))).toHaveLength(60)
  })
})

describe("uniqueSlug", () => {
  it("adds numeric suffixes until a free slug is found", async () => {
    const taken = new Set(["copa", "copa-2", "copa-3"])
    const slug = await uniqueSlug("Copa", async (candidate) => taken.has(candidate))
    expect(slug).toBe("copa-4")
  })

  it("falls back to a usable root when the input has no characters", async () => {
    const slug = await uniqueSlug("---", async () => false)
    expect(slug).toBe("tornuti")
  })
})
