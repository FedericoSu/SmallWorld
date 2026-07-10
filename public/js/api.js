// Funciones que hablan con la API. Cada una devuelve una Promise con el JSON
// ya parseado, o lanza un error con el mensaje que mando el backend.
const BASE = '/api';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

export function getEmpleados() {
  return fetch(`${BASE}/empleados`).then(handleResponse);
}

export function crearEmpleado(empleado) {
  return fetch(`${BASE}/empleados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(empleado),
  }).then(handleResponse);
}

export function actualizarSalario(id, salario) {
  return fetch(`${BASE}/empleados/${id}/salario`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salario }),
  }).then(handleResponse);
}

export function eliminarEmpleado(id) {
  return fetch(`${BASE}/empleados/${id}`, { method: 'DELETE' }).then(handleResponse);
}

export function getDepartamentos() {
  return fetch(`${BASE}/departamentos`).then(handleResponse);
}

export function getPagos() {
  return fetch(`${BASE}/pagos`).then(handleResponse);
}

export function registrarPago(pago) {
  return fetch(`${BASE}/pagos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pago),
  }).then(handleResponse);
}

export function getPagosPorMes() {
  return fetch(`${BASE}/economia/pagos-por-mes`).then(handleResponse);
}

export function getSalariosPorDepartamento() {
  return fetch(`${BASE}/economia/salarios-por-departamento`).then(handleResponse);
}
