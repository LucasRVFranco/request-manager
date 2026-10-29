import type { KeyValueRow } from "../types";

interface Props {
  rows: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
}

export function KeyValueTable({ rows, onChange }: Props) {
  function update(id: string, patch: Partial<KeyValueRow>) {
    const next = rows.map((row) => (row.id === id ? { ...row, ...patch } : row));
    ensureTrailingEmptyRow(next);
    onChange(next);
  }

  function remove(id: string) {
    const next = rows.filter((row) => row.id !== id);
    ensureTrailingEmptyRow(next);
    onChange(next);
  }

  function ensureTrailingEmptyRow(list: KeyValueRow[]) {
    const last = list.at(-1);
    if (!last || last.key !== "" || last.value !== "") {
      list.push({ id: crypto.randomUUID(), key: "", value: "", enabled: true });
    }
  }

  return (
    <table className="kv-table">
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>
              <input
                type="checkbox"
                checked={row.enabled}
                onChange={(e) => update(row.id, { enabled: e.currentTarget.checked })}
              />
            </td>
            <td>
              <input
                placeholder="key"
                value={row.key}
                onChange={(e) => update(row.id, { key: e.currentTarget.value })}
              />
            </td>
            <td>
              <input
                placeholder="value"
                value={row.value}
                onChange={(e) => update(row.id, { value: e.currentTarget.value })}
              />
            </td>
            <td>
              <button className="icon-button" onClick={() => remove(row.id)} title="Remover">
                ×
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
