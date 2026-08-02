// Snake_case (Postgres) <-> camelCase (frontend/Mongoose-shaped) field mapping.
// Keeps API route responses byte-for-byte compatible with the old Mongoose
// output (`_id` as the primary key, camelCase field names) so frontend
// components need no changes after the Supabase migration.

const toCamelKey = (key) => key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
const toSnakeKey = (key) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

const INTERNAL_COLUMNS = new Set(['legacy_id', 'search']);

export function rowToClient(row) {
  if (!row) return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    if (INTERNAL_COLUMNS.has(key)) continue;
    if (key === 'id') {
      out._id = value;
      continue;
    }
    out[toCamelKey(key)] = value;
  }
  return out;
}

export function rowsToClient(rows) {
  return (rows || []).map(rowToClient);
}

// Converts a client-supplied (camelCase) object into snake_case columns for
// insert/update. Drops `_id`/`id` - the primary key is never write-able from
// a request body.
export function clientToRow(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === '_id' || key === 'id') continue;
    out[toSnakeKey(key)] = value;
  }
  return out;
}
