// Logica de la pagina: cambio de pestanas, carga de datos y formularios.
// Es JS "vanilla" (sin frameworks) usando modulos nativos del navegador.
import * as api from './api.js';

const MESES = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Cache simple en memoria: se vuelve a llenar cada vez que se recarga una pestana.
let empleadosCache = [];
let departamentosCache = [];

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}

function formatMoney(value) {
  const n = Number(value) || 0;
  return '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' });
}

function showMessage(elementId, text, isError) {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = 'form-message ' + (isError ? 'error' : 'ok');
}

// ===================== TABS =====================
function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
      panels.forEach((p) => p.classList.toggle('is-active', p.dataset.tab === tab));
      loadTab(tab);
    });
  });
}

function loadTab(tab) {
  if (tab === 'economia') return loadEconomia();
  if (tab === 'empleados') return loadEmpleados();
  if (tab === 'departamentos') return loadDepartamentos();
  if (tab === 'pagos') return loadPagos();
}

// ===================== DEPARTAMENTOS =====================
async function loadDepartamentos() {
  departamentosCache = await api.getDepartamentos();

  const tbody = document.querySelector('#tabla-departamentos tbody');
  tbody.innerHTML = departamentosCache.length
    ? departamentosCache.map((d) => `
      <tr>
        <td>${escapeHtml(d.nombre)}</td>
        <td>${formatMoney(d.presupuesto_mensual)}</td>
      </tr>
    `).join('')
    : '<tr class="empty-row"><td colspan="2">No hay departamentos cargados.</td></tr>';

  const select = document.getElementById('select-departamento-empleado');
  const seleccionActual = select.value;
  select.innerHTML = '<option value="">Sin asignar</option>' +
    departamentosCache.map((d) => `<option value="${d.id}">${escapeHtml(d.nombre)}</option>`).join('');
  select.value = seleccionActual;
}

// ===================== EMPLEADOS =====================
async function loadEmpleados() {
  if (departamentosCache.length === 0) await loadDepartamentos();
  empleadosCache = await api.getEmpleados();

  const tbody = document.querySelector('#tabla-empleados tbody');
  tbody.innerHTML = empleadosCache.length
    ? empleadosCache.map((e) => `
      <tr data-id="${e.id}">
        <td>${escapeHtml(e.nombre)} ${escapeHtml(e.apellido)}</td>
        <td>${escapeHtml(e.email)}</td>
        <td>${escapeHtml(e.puesto || '-')}</td>
        <td>${escapeHtml(e.departamento || 'Sin asignar')}</td>
        <td>${formatMoney(e.salario)}</td>
        <td>${formatDate(e.fecha_ingreso)}</td>
        <td>
          <div class="row-actions">
            <input type="number" min="0" step="0.01" value="${e.salario}" data-role="input-salario" />
            <button type="button" data-action="guardar-salario">Guardar</button>
            <button type="button" class="danger" data-action="eliminar">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('')
    : '<tr class="empty-row"><td colspan="7">No hay empleados cargados.</td></tr>';

  const selectPago = document.getElementById('select-empleado-pago');
  const seleccionActual = selectPago.value;
  selectPago.innerHTML = empleadosCache
    .map((e) => `<option value="${e.id}">${escapeHtml(e.nombre)} ${escapeHtml(e.apellido)}</option>`)
    .join('');
  selectPago.value = seleccionActual;
}

function initFormEmpleado() {
  const form = document.getElementById('form-empleado');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const empleado = {
      nombre: formData.get('nombre').trim(),
      apellido: formData.get('apellido').trim(),
      email: formData.get('email').trim(),
      puesto: formData.get('puesto').trim() || null,
      salario: Number(formData.get('salario')),
      fecha_ingreso: formData.get('fecha_ingreso') || null,
      departamento_id: formData.get('departamento_id') || null,
    };

    try {
      await api.crearEmpleado(empleado);
      form.reset();
      showMessage('msg-empleado', 'Empleado creado correctamente.', false);
      await loadEmpleados();
    } catch (error) {
      showMessage('msg-empleado', error.message, true);
    }
  });

  document.querySelector('#tabla-empleados tbody').addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const row = button.closest('tr');
    const id = row.dataset.id;

    if (button.dataset.action === 'guardar-salario') {
      const input = row.querySelector('[data-role="input-salario"]');
      try {
        await api.actualizarSalario(id, Number(input.value));
        await loadEmpleados();
      } catch (error) {
        alert(error.message);
      }
    }

    if (button.dataset.action === 'eliminar') {
      if (!confirm('¿Eliminar este empleado? Tambien se borran sus pagos registrados.')) return;
      try {
        await api.eliminarEmpleado(id);
        await loadEmpleados();
      } catch (error) {
        alert(error.message);
      }
    }
  });
}

// ===================== PAGOS =====================
async function loadPagos() {
  if (empleadosCache.length === 0) await loadEmpleados();
  const pagos = await api.getPagos();
  const nombrePorId = new Map(empleadosCache.map((e) => [e.id, `${e.nombre} ${e.apellido}`]));

  const tbody = document.querySelector('#tabla-pagos tbody');
  tbody.innerHTML = pagos.length
    ? pagos.map((p) => `
      <tr>
        <td>${escapeHtml(nombrePorId.get(p.empleado_id) || `Empleado #${p.empleado_id}`)}</td>
        <td>${MESES[p.mes]}</td>
        <td>${p.anio}</td>
        <td>${formatMoney(p.monto_pagado)}</td>
        <td>${formatDate(p.fecha_pago)}</td>
      </tr>
    `).join('')
    : '<tr class="empty-row"><td colspan="5">No hay pagos registrados.</td></tr>';
}

function initFormPago() {
  const form = document.getElementById('form-pago');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const pago = {
      empleado_id: Number(formData.get('empleado_id')),
      mes: Number(formData.get('mes')),
      anio: Number(formData.get('anio')),
      monto_pagado: Number(formData.get('monto_pagado')),
      fecha_pago: formData.get('fecha_pago') || null,
    };

    try {
      await api.registrarPago(pago);
      form.reset();
      showMessage('msg-pago', 'Pago registrado correctamente.', false);
      await loadPagos();
    } catch (error) {
      showMessage('msg-pago', error.message, true);
    }
  });
}

// ===================== ECONOMIA =====================
function meterSeverity(pct) {
  if (pct >= 100) return { color: 'var(--status-critical)', statusClass: 'critical', label: 'Sobre presupuesto' };
  if (pct >= 80) return { color: 'var(--status-warning)', statusClass: 'warning', label: 'Cerca del limite' };
  return { color: 'var(--accent)', statusClass: 'good', label: 'Normal' };
}

async function loadEconomia() {
  const [salariosPorDepto, pagosPorMes, empleados] = await Promise.all([
    api.getSalariosPorDepartamento(),
    api.getPagosPorMes(),
    empleadosCache.length ? Promise.resolve(empleadosCache) : api.getEmpleados(),
  ]);
  empleadosCache = empleados;

  const presupuestoTotal = salariosPorDepto.reduce((sum, d) => sum + Number(d.presupuesto_mensual), 0);
  const ultimoMes = pagosPorMes[0];

  document.getElementById('stat-row').innerHTML = `
    <div class="stat-tile">
      <div class="label">Empleados</div>
      <div class="value">${empleados.length}</div>
    </div>
    <div class="stat-tile">
      <div class="label">Departamentos</div>
      <div class="value">${salariosPorDepto.length}</div>
    </div>
    <div class="stat-tile">
      <div class="label">Presupuesto mensual total</div>
      <div class="value">${formatMoney(presupuestoTotal)}</div>
    </div>
    <div class="stat-tile">
      <div class="label">${ultimoMes ? `Pagado en ${MESES[ultimoMes.mes]} ${ultimoMes.anio}` : 'Pagado el ultimo mes'}</div>
      <div class="value">${formatMoney(ultimoMes ? ultimoMes.total_pagado : 0)}</div>
    </div>
  `;

  document.getElementById('meters').innerHTML = salariosPorDepto.length
    ? salariosPorDepto.map((d) => {
      const presupuesto = Number(d.presupuesto_mensual);
      const totalSalarios = Number(d.total_salarios);
      const pct = presupuesto > 0 ? (totalSalarios / presupuesto) * 100 : (totalSalarios > 0 ? 100 : 0);
      const severity = meterSeverity(pct);
      const anchoBarra = Math.min(pct, 100);

      return `
        <div class="meter-row">
          <div class="meter-name">${escapeHtml(d.departamento)}</div>
          <div class="meter-track"><div class="meter-fill" style="width:${anchoBarra}%;background:${severity.color}"></div></div>
          <div class="meter-pct">${pct.toFixed(0)}%</div>
          <div class="meter-status ${severity.statusClass}">${severity.label}</div>
        </div>
      `;
    }).join('')
    : '<p class="form-message">No hay departamentos para mostrar.</p>';

  const tbody = document.querySelector('#tabla-pagos-mes tbody');
  tbody.innerHTML = pagosPorMes.length
    ? pagosPorMes.map((p) => `
      <tr>
        <td>${p.anio}</td>
        <td>${MESES[p.mes]}</td>
        <td>${p.cantidad_pagos}</td>
        <td>${formatMoney(p.total_pagado)}</td>
      </tr>
    `).join('')
    : '<tr class="empty-row"><td colspan="4">No hay pagos registrados todavia.</td></tr>';
}

// ===================== INIT =====================
async function init() {
  initTabs();
  initFormEmpleado();
  initFormPago();

  await loadDepartamentos();
  await loadEmpleados();
  await loadEconomia();
}

init();
