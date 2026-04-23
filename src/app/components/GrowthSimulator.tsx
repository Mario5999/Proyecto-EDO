'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, RotateCcw } from 'lucide-react';

interface Scenario {
  name: string;
  description: string;
  k: number;
  P0: number;
  unit: string;
  color: string;
}

interface GrowthSimulatorProps {
  scenario: Scenario;
}

const MULTI_K_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444'];
const MULTI_K_VALUES = [0.1, 0.3, 0.5, 0.8];

export function GrowthSimulator({ scenario }: GrowthSimulatorProps) {
  const [k, setK] = useState(scenario.k);
  const [P0, setP0] = useState(scenario.P0);
  const [tMax, setTMax] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTime, setCurrentTime] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setK(scenario.k);
    setP0(scenario.P0);
    setTMax(10);
  }, [scenario]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const analyticalSolution = useCallback((t: number) => P0 * Math.exp(k * t), [k, P0]);

  const numericalSolution = useMemo(() => {
    const dt = 0.1;
    const steps = Math.floor(tMax / dt);
    const result = [{ t: 0, P: P0 }];
    let P = P0;
    for (let i = 1; i <= steps; i++) {
      const t = i * dt;
      const dP = k * P * dt;
      P = P + dP;
      result.push({ t: parseFloat(t.toFixed(2)), P });
    }
    return result;
  }, [k, P0, tMax]);

  const chartData = useMemo(() => {
    const maxT = isAnimating ? currentTime : tMax;
    return numericalSolution
      .filter(({ t }) => t <= maxT)
      .map(({ t, P }) => ({
        t,
        'Analítica': parseFloat((P0 * Math.exp(k * t)).toFixed(2)),
        'Numérica': parseFloat(P.toFixed(2)),
      }));
  }, [numericalSolution, k, P0, isAnimating, currentTime, tMax]);

  const tableData = useMemo(() => {
    const steps = Math.round(tMax);
    return Array.from({ length: steps + 1 }, (_, i) => {
      const t = i;
      const analytic = P0 * Math.exp(k * t);
      const eulerPoint = numericalSolution.find(p => Math.abs(p.t - t) < 0.05);
      const euler = eulerPoint?.P ?? analytic;
      const error = ((Math.abs(analytic - euler) / analytic) * 100);
      return { t, analytic, euler, error };
    });
  }, [k, P0, tMax, numericalSolution]);

  const multiKData = useMemo(() => {
    return Array.from({ length: 101 }, (_, i) => {
      const t = parseFloat((i * tMax / 100).toFixed(2));
      const point: Record<string, number> = { t };
      MULTI_K_VALUES.forEach(ki => {
        point[`k=${ki}`] = parseFloat((P0 * Math.exp(ki * t)).toFixed(2));
      });
      return point;
    });
  }, [P0, tMax]);

  const handleAnimate = () => {
    setIsAnimating(true);
    setCurrentTime(0);

    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= tMax) {
          clearInterval(intervalRef.current!);
          setIsAnimating(false);
          return tMax;
        }
        return prev + tMax / 50;
      });
    }, 50);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setK(scenario.k);
    setP0(scenario.P0);
    setTMax(10);
    setCurrentTime(10);
    setIsAnimating(false);
  };

  const finalValue = analyticalSolution(tMax);
  const doublingTime = Math.log(2) / k;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Simulador Interactivo</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Tasa de crecimiento (k)
            </label>
            <input
              type="number"
              value={k}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) setK(val);
              }}
              disabled={isAnimating}
              className="w-full text-center font-mono text-sm bg-slate-100 rounded px-3 py-2 text-black border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:text-slate-400 disabled:bg-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Población inicial (P₀)
            </label>
            <input
              type="number"
              value={P0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) setP0(val);
              }}
              disabled={isAnimating}
              className="w-full text-center font-mono text-sm bg-slate-100 rounded px-3 py-2 text-black border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:text-slate-400 disabled:bg-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Tiempo máximo (h)
            </label>
            <input
              type="number"
              value={tMax}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) setTMax(val);
              }}
              disabled={isAnimating}
              className="w-full text-center font-mono text-sm bg-slate-100 rounded px-3 py-2 text-black border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:text-slate-400 disabled:bg-slate-200"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAnimate}
            disabled={isAnimating}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            {isAnimating ? 'Animando...' : 'Animar Crecimiento'}
          </button>
          <button
            onClick={handleReset}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-xs font-medium text-slate-500 mb-2">
          Figura 2 — Solución analítica vs. Método de Euler (Δt = 0.1 h)
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="t"
              label={{ value: 'Tiempo (h)', position: 'insideBottom', offset: -5 }}
              stroke="#64748b"
            />
            <YAxis
              label={{ value: `Población (${scenario.unit})`, angle: -90, position: 'insideLeft' }}
              stroke="#64748b"
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Analítica"
              stroke={scenario.color}
              strokeWidth={3}
              dot={false}
              name="Solución Analítica"
            />
            <Line
              type="monotone"
              dataKey="Numérica"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Solución Numérica (Euler)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">Valor Final P({tMax}h)</div>
          <div className="text-2xl font-bold text-blue-900">{finalValue.toFixed(2)}</div>
          <div className="text-xs text-blue-600 mt-1">{scenario.unit}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1">Tiempo de Duplicación</div>
          <div className="text-2xl font-bold text-purple-900">{doublingTime.toFixed(2)}</div>
          <div className="text-xs text-purple-600 mt-1">horas (t₂ = ln2/k)</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">Factor de Crecimiento</div>
          <div className="text-2xl font-bold text-green-900">{(finalValue / P0).toFixed(2)}×</div>
          <div className="text-xs text-green-600 mt-1">veces el valor inicial</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <p className="text-xs font-medium text-slate-500 px-4 pt-4 pb-2">
          Tabla 1 — Comparación solución analítica vs. Euler (k = {k}, P₀ = {P0} {scenario.unit})
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">t (h)</th>
                <th className="px-4 py-2">P analítica ({scenario.unit})</th>
                <th className="px-4 py-2">P Euler ({scenario.unit})</th>
                <th className="px-4 py-2">Error relativo (%)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(({ t, analytic, euler, error }) => (
                <tr key={t} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2 text-left font-mono text-slate-700">{t}</td>
                  <td className="px-4 py-2 font-mono text-blue-700">{analytic.toFixed(2)}</td>
                  <td className="px-4 py-2 font-mono text-red-600">{euler.toFixed(2)}</td>
                  <td className={`px-4 py-2 font-mono font-medium ${error < 2 ? 'text-green-600' : error < 4 ? 'text-amber-600' : 'text-red-600'}`}>
                    {error.toFixed(3)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-xs font-medium text-slate-500 mb-2">
          Figura 4 — Comparación de curvas para k ∈ {'{0.1, 0.3, 0.5, 0.8}'} h⁻¹ (P₀ = {P0} {scenario.unit})
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={multiKData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="t"
              label={{ value: 'Tiempo (h)', position: 'insideBottom', offset: -5 }}
              stroke="#64748b"
            />
            <YAxis
              label={{ value: `Población (${scenario.unit})`, angle: -90, position: 'insideLeft' }}
              stroke="#64748b"
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
            />
            <Legend />
            {MULTI_K_VALUES.map((ki, idx) => (
              <Line
                key={ki}
                type="monotone"
                dataKey={`k=${ki}`}
                stroke={MULTI_K_COLORS[idx]}
                strokeWidth={2}
                dot={false}
                name={`k = ${ki} h⁻¹`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
