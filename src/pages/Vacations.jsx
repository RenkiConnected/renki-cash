import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportVacationsVisuel } from '../utils/pdfExport';

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

// ISO week dates (Monday-based) for a given week/year
function getWeekDates(wn, year) {
  const jan4 = new Date(year, 0, 4);
  const dow = jan4.getDay();
  const dtm = dow === 0 ? -6 : 1 - dow;
  const startW1 = new Date(jan4); startW1.setDate(jan4.getDate() + dtm);
  const ws = new Date(startW1); ws.setDate(startW1.getDate() + (wn - 1) * 7);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return d; });
}

export default function Vacations() {
  const { employees, stores, leaveRequests, getVisibleStoreIds, isDirigeant } = useApp();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  // Scope to visible stores
  const visIds = getVisibleStoreIds ? getVisibleStoreIds() : stores.map(s => s.id);
  const visEmps = employees.filter(e => visIds.includes(e.storeId));

  // Days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Mon

  // Build vacation ranges for the month: per employee, which days are on leave (vacation type)
  // Convert each approved leave's weeks/days into actual dates within this month.
  const monthLeaves = [];
  leaveRequests.filter(r => r.status === 'approved').forEach(req => {
    const emp = visEmps.find(e => e.id === req.employeeId);
    if (!emp) return;
    (req.weeks || []).forEach(w => {
      const wd = getWeekDates(w.week, w.year);
      (w.days || []).forEach(di => {
        const date = wd[di];
        if (date && date.getMonth() === month && date.getFullYear() === year) {
          monthLeaves.push({ emp, date: date.getDate(), type: req.type || 'vacation', req });
        }
      });
    });
  });

  // Group by employee for the timeline
  const byEmp = {};
  monthLeaves.forEach(({ emp, date, type }) => {
    if (!byEmp[emp.id]) byEmp[emp.id] = { emp, days: new Set(), type };
    byEmp[emp.id].days.add(date);
  });
  const rows = Object.values(byEmp).map(r => ({ ...r, days: [...r.days].sort((a, b) => a - b) }))
    .sort((a, b) => a.emp.name.localeCompare(b.emp.name));

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const storeOf = emp => stores.find(s => s.id === emp.storeId);
  const dayList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const doExport = () => {
    exportVacationsVisuel({ rows, stores, month, year, daysInMonth });
  };

  return (
    <div className="anim-up">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 className="page-title">🏖️ Vacances</h1>
          <p className="page-sub">Qui est en vacances et quand · aperçu {isDirigeant ? '(toutes vos boutiques)' : ''}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={prevMonth}>‹</button>
          <div style={{ padding: '8px 16px', background: 'var(--teal)', color: '#fff', borderRadius: 10, fontWeight: 800, minWidth: 150, textAlign: 'center' }}>{MONTHS[month]} {year}</div>
          <button className="btn btn-ghost btn-sm" onClick={nextMonth}>›</button>
          <button className="btn btn-primary btn-sm" onClick={doExport}>📲 Aperçu / PDF</button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          Aucune vacance validée sur {MONTHS[month]} {year}.
        </div>
      ) : (
        <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
          {/* Timeline header */}
          <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${daysInMonth}, 26px)`, gap: 2, alignItems: 'center', marginBottom: 8, minWidth: 'fit-content' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)' }}>Employé</div>
            {dayList.map(d => {
              const dow = new Date(year, month, d).getDay();
              const we = dow === 0 || dow === 6;
              return <div key={d} style={{ fontSize: 10, textAlign: 'center', fontWeight: 700, color: we ? '#C8002B' : 'var(--muted)' }}>{d}</div>;
            })}
          </div>
          {/* Rows */}
          {rows.map(({ emp, days }) => {
            const st = storeOf(emp);
            const daySet = new Set(days);
            return (
              <div key={emp.id} style={{ display: 'grid', gridTemplateColumns: `180px repeat(${daysInMonth}, 26px)`, gap: 2, alignItems: 'center', marginBottom: 4, minWidth: 'fit-content' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: emp.color || 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{emp.name[0]}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{st?.name || '—'}</div>
                  </div>
                </div>
                {dayList.map(d => {
                  const on = daySet.has(d);
                  const dow = new Date(year, month, d).getDay();
                  const we = dow === 0 || dow === 6;
                  return <div key={d} style={{ height: 24, borderRadius: 5, background: on ? '#7C3AED' : (we ? '#F4F4F6' : 'var(--card2)'), border: on ? '1px solid #6D28D9' : '1px solid transparent' }} title={on ? `${emp.name} · ${d} ${MONTHS[month]}` : ''} />;
                })}
              </div>
            );
          })}
          <div style={{ marginTop: 14, display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: '#7C3AED', display: 'inline-block' }} /> En vacances</span>
            <span>{rows.length} personne(s) · {monthLeaves.length} jour(s) de vacances ce mois</span>
          </div>
        </div>
      )}
    </div>
  );
}
