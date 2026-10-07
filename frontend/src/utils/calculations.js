export const sumBy = (rows, key) => rows.reduce((total, row) => total + (Number(row[key]) || 0), 0)
export const averageBy = (rows, key) => rows.length ? sumBy(rows, key) / rows.length : 0
export const percentage = (value, total) => total ? (value / total) * 100 : 0