// Seeds the two demo accounts:
//   Member — Alex Rivera
//   Admin  — Morgan Adeyemi
//
// Run with: npm run seed

require("dotenv").config();
const pool = require("./pool");

// NOTE: stored as plain text per explicit request (not secure for real production use).
const DEMO_PASSWORD = "Demo@1234";

async function seed() {
  try {
    const demoUsers = [
      { name: "Alex Rivera", email: "alex.rivera@cinevault.demo", role: "member" },
      { name: "Morgan Adeyemi", email: "morgan.adeyemi@cinevault.demo", role: "admin" },
    ];

    for (const user of demoUsers) {
      const existing = await pool.query("SELECT id FROM users WHERE email = $1", [user.email]);

      if (existing.rows.length > 0) {
        console.log(`Skipped (already exists): ${user.name}`);
        continue;
      }

      await pool.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
        [user.name, user.email, DEMO_PASSWORD, user.role]
      );
      console.log(`Seeded: ${user.name} (${user.role})`);
    }

    console.log("\nDemo login password for both accounts:", DEMO_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
