'use client';

import { useState, useMemo, useCallback } from 'react';
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

export function GrowthSimulator({ scenario }: GrowthSimulatorProps) {
  const [k, setK] = useState(scenario.k);
  const [P0, setP0] = useState(scenario.P0);
  const [tMax, setTMax] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTime, setCurrentTime] = useState(10);

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
    const data = [];
    const step = tMax / 100;
    for (let t = 0; t <= (isAnimating ? currentTime : tMax); t += step) {
      data.push({
        t: parseFloat(t.toFixed(2)),
        Analítica: parseFloat(analyticalSolution(t).toFixed(2)),
        Numérica: numericalSolution.find(p => Math.abs(p.t - t) < step)?.P || 0
      });
    }
    return data;
  }, [tMax, currentTime, isAnimating, numericalSolution, analyticalSolution]);

  const handleAnimate = () => {
    setIsAnimating(true);
    setCurrentTime(0);
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= tMax) {
          clearInterval(interval);
          setIsAnimating(false);
          return tMax;
        }
        return prev + tMax / 50;
      });
    }, 50);
  };

  const handleReset = () => {
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
              Tiempo máximo (t)
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
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="t"
              label={{ value: 'Tiempo (t)', position: 'insideBottom', offset: -5 }}
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
          <div className="text-sm text-blue-700 font-medium mb-1">Valor Final</div>
          <div className="text-2xl font-bold text-blue-900">
            {finalValue.toFixed(2)}
          </div>
          <div className="text-xs text-blue-600 mt-1">{scenario.unit}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1">Tiempo de Duplicación</div>
          <div className="text-2xl font-bold text-purple-900">
            {doublingTime.toFixed(2)}
          </div>
          <div className="text-xs text-purple-600 mt-1">unidades de tiempo</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">Factor de Crecimiento</div>
          <div className="text-2xl font-bold text-green-900">
            {(finalValue / P0).toFixed(2)}×
          </div>
          <div className="text-xs text-green-600 mt-1">veces el valor inicial</div>
        </div>
      </div>
    </div>
  );
}