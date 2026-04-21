import { BookOpen, Calculator, Info } from 'lucide-react';

export function ModelInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold">Modelo Matemático</h3>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm font-medium text-slate-700 mb-2">
              Ecuación Diferencial Ordinaria
            </div>
            <div className="font-mono text-lg text-center bg-white rounded p-3 border border-slate-300 text-black">
              dP/dt = kP
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-sm font-medium text-slate-700 mb-2">
              Condición Inicial
            </div>
            <div className="font-mono text-lg text-center bg-white rounded p-3 border border-slate-300 text-black">
              P(0) = P₀
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium text-blue-700 mb-2">
              Solución Analítica
            </div>
            <div className="font-mono text-lg text-center bg-white rounded p-3 border border-blue-300 text-black">
              P(t) = P₀e<sup>kt</sup>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Calculator className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-bold">Variables del Modelo</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="font-mono font-bold text-blue-600 min-w-[3rem]">P(t)</div>
            <div className="text-slate-700">
              Población, biomasa o concentración en el tiempo t
            </div>
          </div>

          <div className="flex gap-3">
            <div className="font-mono font-bold text-green-600 min-w-[3rem]">k</div>
            <div className="text-slate-700">
              Tasa de crecimiento específica (constante positiva)
            </div>
          </div>

          <div className="flex gap-3">
            <div className="font-mono font-bold text-purple-600 min-w-[3rem]">P₀</div>
            <div className="text-slate-700">
              Población inicial en t = 0
            </div>
          </div>

          <div className="flex gap-3">
            <div className="font-mono font-bold text-orange-600 min-w-[3rem]">t</div>
            <div className="text-slate-700">
              Tiempo (variable independiente)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Info className="w-5 h-5 text-amber-600" />
          <h3 className="text-xl font-bold">Métodos de Solución</h3>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="space-y-2">
            <div className="font-semibold text-slate-900">
              1. Solución Analítica
            </div>
            <p>
              Obtenida por separación de variables e integración directa de la EDO.
              Proporciona valores exactos.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-slate-900">
              2. Solución Numérica (Euler)
            </div>
            <p>
              Aproximación iterativa usando el método de Euler con paso Δt = 0.1.
              Útil cuando no existe solución analítica.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 border border-amber-200">
        <h3 className="text-lg font-bold text-amber-900 mb-3">
          Conceptos Clave
        </h3>
        <div className="space-y-2 text-sm text-amber-800">
          <div className="flex gap-2">
            <span className="font-bold min-w-[10rem]">Tiempo de duplicación:</span>
            <span className="font-mono">t₂ = ln(2)/k</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[10rem]">Tasa de cambio:</span>
            <span>Proporcional a la población actual</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[10rem]">Aplicaciones:</span>
            <span>Microbiología, demografía, finanzas</span>
          </div>
        </div>
      </div>
    </div>
  );
}