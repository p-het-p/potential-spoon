import fs from 'fs';
import path from 'path';
import { pool } from '../config/database.js';
async function runMigration() {
    try {
        const migrationPath = path.resolve(process.cwd(), 'migrations', '006_add_leader_features.sql');
        let sql = fs.readFileSync(migrationPath, 'utf8');
        // Add drops to the beginning
        sql = `
      DROP TABLE IF EXISTS volunteer_tasks CASCADE;
      DROP TABLE IF EXISTS announcements CASCADE;
      DROP TABLE IF EXISTS fundraisers CASCADE;
    ` + sql;
        console.log('Running migration: 006_add_leader_features.sql');
        await pool.query(sql);
        console.log('Migration completed successfully');
    }
    catch (err) {
        console.error('Migration failed:', err);
    }
    finally {
        await pool.end();
    }
}
runMigration();
//# sourceMappingURL=run_migration.js.map