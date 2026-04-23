'use client';

import { useState } from 'react';
import { GrowthSimulator } from './components/GrowthSimulator';
import { ModelInfo } from './components/ModelInfo';
import { FlaskConical, TrendingUp, Users } from 'lucide-react';

export default function Page() {
  const [selectedScenario, setSelectedScenario] = useState<'bacteria' | 'yeast' | 'population'>('bacteria');

  const scenarios = {
    bacteria: {
      name: 'Crecimiento de Bacterias',
      icon: FlaskConical,
      description: 'Modelo de reproducción bacteriana en medio de cultivo óptimo',
      k: 0.5,
      P0: 100,
      unit: 'UFC/mL',
      color: '#10b981'
    },
    yeast: {
      name: 'Fermentación (Levaduras)',
      icon: TrendingUp,
      description: 'Crecimiento de levaduras en proceso de fermentación',
      k: 0.3,
      P0: 50,
      unit: 'g/L',
      color: '#f59e0b'
    },
    population: {
      name: 'Crecimiento Poblacional',
      icon: Users,
      description: 'Modelo simplificado de crecimiento demográfico',
      k: 0.15,
      P0: 1000,
      unit: 'individuos',
      color: '#3b82f6'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">
            Modelado y Simulación de Procesos de Crecimiento
          </h1>
          <p className="text-lg text-slate-600">
            Ecuaciones Diferenciales Ordinarias - Modelo Exponencial
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(scenarios).map(([key, scenario]) => {
            const Icon = scenario.icon;
            const isSelected = selectedScenario === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedScenario(key as typeof selectedScenario)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                  <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                    {scenario.name}
                  </h3>
                </div>
                <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                  {scenario.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GrowthSimulator scenario={scenarios[selectedScenario]} />
          </div>

          <div className="lg:col-span-1">
            <ModelInfo scenario={scenarios[selectedScenario]} />
          </div>
        </div>
      </div>
    </div>
  );
}