export const ROLE_ACCESS = {
  ADMIN: ['/', '/employees', '/attendance', '/overtime', '/leave', '/payroll', '/departments', '/analytics', '/reports', '/alerts', '/settings'],
  HR_MANAGER: ['/', '/employees', '/attendance', '/overtime', '/leave', '/payroll', '/departments', '/analytics', '/reports', '/alerts', '/settings'],
  MANAGER: ['/', '/attendance', '/overtime', '/leave', '/alerts'],
}

export function canAccessPath(role, path) {
  return ROLE_ACCESS[role]?.includes(path) ?? false
}