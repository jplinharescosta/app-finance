import pg from 'pg';

const { Pool } = pg;

const env = process.env;

export const pool = new Pool({
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
});

export const PostgresHelper = {
    query: async (query, params) => {
        const client = await pool.connect();
        const results = await client.query(query, params);
        await client.release();
        return results.rows;
    },
};
