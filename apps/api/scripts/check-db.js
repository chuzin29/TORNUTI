require("dotenv").config({ path: ".env" })
const postgres = require("postgres")

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1 })

async function main() {
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `
  console.log("TABLAS EN SUPABASE:")
  tables.forEach((t) => console.log(" -", t.table_name))
  await sql.end()
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})