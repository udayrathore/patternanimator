"use client";

import { CSSProperties, useMemo, useState } from "react";

type EffectId = "grid-echo" | "signal-sweep";

type EffectSettings = {
  density: number;
  speed: number;
  intensity: number;
  variation: number;
};

type ControlKey = keyof EffectSettings;

type ControlConfig = {
  key: ControlKey;
  label: string;
  max: number;
  min: number;
};

type EffectConfig = {
  controls: ControlConfig[];
  label: string;
  status: string;
};

const effectConfigs: Record<EffectId, EffectConfig> = {
  "grid-echo": {
    controls: [
      { key: "density", label: "Cells", min: 5, max: 13 },
      { key: "speed", label: "Speed", min: 2, max: 9 },
      { key: "intensity", label: "Pulse", min: 20, max: 90 },
      { key: "variation", label: "Stagger", min: 10, max: 80 },
    ],
    label: "Grid Echo",
    status: "Square repeat",
  },
  "signal-sweep": {
    controls: [
      { key: "density", label: "Bands", min: 4, max: 12 },
      { key: "speed", label: "Speed", min: 2, max: 9 },
      { key: "intensity", label: "Glow", min: 20, max: 90 },
      { key: "variation", label: "Offset", min: 10, max: 80 },
    ],
    label: "Signal Sweep",
    status: "Line repeat",
  },
};

const initialSettings: Record<EffectId, EffectSettings> = {
  "grid-echo": {
    density: 9,
    intensity: 58,
    speed: 5,
    variation: 42,
  },
  "signal-sweep": {
    density: 7,
    intensity: 64,
    speed: 6,
    variation: 36,
  },
};

export default function AnimationLab() {
  const [effect, setEffect] = useState<EffectId>("grid-echo");
  const [settingsByEffect, setSettingsByEffect] =
    useState<Record<EffectId, EffectSettings>>(initialSettings);
  const settings = settingsByEffect[effect];
  const config = effectConfigs[effect];

  const updateSetting = (key: ControlKey, value: number) => {
    setSettingsByEffect((current) => ({
      ...current,
      [effect]: {
        ...current[effect],
        [key]: value,
      },
    }));
  };

  const resetEffect = () => {
    setSettingsByEffect((current) => ({
      ...current,
      [effect]: initialSettings[effect],
    }));
  };

  return (
    <main className="min-h-screen bg-[#f4f7f2] text-[#17201d]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 px-5 py-5 lg:grid-cols-[minmax(420px,1fr)_390px] lg:px-8">
        <div className="flex min-h-[520px] items-center justify-center p-2 sm:p-8 lg:min-h-[calc(100vh-40px)]">
          <PatternCard config={config} effect={effect} settings={settings} />
        </div>

        <aside className="flex flex-col justify-center gap-5 lg:min-h-[calc(100vh-40px)]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#6c7970]">
              Motion Lab
            </p>
            <h1 className="mt-3 max-w-sm text-3xl font-semibold leading-[1.08] text-[#17201d] sm:text-4xl">
              Pattern animator
            </h1>
          </div>

          <EffectTabs activeEffect={effect} setEffect={setEffect} />

          <ControlPanel
            config={config}
            resetEffect={resetEffect}
            settings={settings}
            updateSetting={updateSetting}
          />
        </aside>
      </section>
    </main>
  );
}

function EffectTabs({
  activeEffect,
  setEffect,
}: {
  activeEffect: EffectId;
  setEffect: (effect: EffectId) => void;
}) {
  return (
    <div className="rounded-lg border border-[#d2dbd1] bg-[#fbfcf8] p-3 shadow-[0_18px_50px_rgba(23,32,29,0.08)]">
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(effectConfigs) as EffectId[]).map((id) => (
          <button
            className={`rounded-md px-4 py-3 text-left text-sm font-semibold transition ${
              activeEffect === id
                ? "bg-[#17201d] text-white"
                : "bg-transparent text-[#56615b] hover:bg-[#eef4ea]"
            }`}
            key={id}
            onClick={() => setEffect(id)}
            type="button"
          >
            {effectConfigs[id].label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PatternCard({
  config,
  effect,
  settings,
}: {
  config: EffectConfig;
  effect: EffectId;
  settings: EffectSettings;
}) {
  const duration = 10.5 - settings.speed;
  const style = {
    "--motion-duration": `${duration}s`,
    "--motion-intensity": settings.intensity / 100,
    "--motion-variation": settings.variation / 100,
    "--pulse-scale": 1 + settings.intensity / 220,
  } as CSSProperties;

  return (
    <article
      className="relative aspect-[4/5] w-full max-w-[390px] overflow-hidden rounded-lg border border-[#28352f] bg-[#16201c] shadow-[0_30px_90px_rgba(18,25,23,0.32)]"
      style={style}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(247,215,126,0.25),transparent_32%),linear-gradient(140deg,rgba(40,143,122,0.34),rgba(22,32,28,0)_46%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
      {effect === "grid-echo" ? (
        <GridEchoPattern settings={settings} />
      ) : (
        <SignalSweepPattern settings={settings} />
      )}
      <div className="absolute inset-x-7 bottom-7 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-[#b7c8bd]">{config.status}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {config.label}
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5d77e]" />
        </div>
      </div>
    </article>
  );
}

function GridEchoPattern({ settings }: { settings: EffectSettings }) {
  const cells = useMemo(() => buildGridCells(settings), [settings]);

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 500"
    >
      <defs>
        <linearGradient id="gridStroke" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f5d77e" />
          <stop offset="0.52" stopColor="#82d6c5" />
          <stop offset="1" stopColor="#f48b64" />
        </linearGradient>
      </defs>
      <g className="grid-echo-layer">
        {cells.map((cell) => (
          <rect
            className="grid-echo-cell"
            height={cell.size}
            key={cell.id}
            rx="2"
            style={{ animationDelay: `${cell.delay}s` }}
            width={cell.size}
            x={cell.x}
            y={cell.y}
          />
        ))}
      </g>
    </svg>
  );
}

function SignalSweepPattern({ settings }: { settings: EffectSettings }) {
  const bands = useMemo(() => buildSweepBands(settings), [settings]);
  const nodes = useMemo(() => buildSweepNodes(settings), [settings]);

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 500"
    >
      <defs>
        <linearGradient id="sweepStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f48b64" stopOpacity="0" />
          <stop offset="0.42" stopColor="#f5d77e" />
          <stop offset="1" stopColor="#82d6c5" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <g className="sweep-field">
        {bands.map((band) => (
          <path
            className="signal-sweep-band"
            d={band.path}
            key={band.id}
            style={{
              animationDelay: `${band.delay}s`,
              strokeWidth: band.width,
            }}
          />
        ))}
      </g>
      <g>
        {nodes.map((node) => (
          <circle
            className="signal-sweep-node"
            cx={node.x}
            cy={node.y}
            key={node.id}
            r={node.radius}
            style={{ animationDelay: `${node.delay}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

function ControlPanel({
  config,
  resetEffect,
  settings,
  updateSetting,
}: {
  config: EffectConfig;
  resetEffect: () => void;
  settings: EffectSettings;
  updateSetting: (key: ControlKey, value: number) => void;
}) {
  return (
    <div className="rounded-lg border border-[#d2dbd1] bg-[#fbfcf8] p-5 shadow-[0_18px_50px_rgba(23,32,29,0.08)]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#17201d]">Controls</h2>
        <button
          className="rounded-md border border-[#cad4ca] px-3 py-2 text-sm font-semibold text-[#4b5751] transition hover:bg-[#eef4ea]"
          onClick={resetEffect}
          type="button"
        >
          Reset
        </button>
      </div>
      <div className="mt-5 space-y-5">
        {config.controls.map((control) => (
          <Slider
            key={control.key}
            label={control.label}
            max={control.max}
            min={control.min}
            onChange={(value) => updateSetting(control.key, value)}
            value={settings[control.key]}
          />
        ))}
      </div>
    </div>
  );
}

function Slider({
  label,
  max,
  min,
  onChange,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-sm font-semibold text-[#4d5a53]">
        <span>{label}</span>
        <span>{value}</span>
      </span>
      <input
        className="motion-slider"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function buildGridCells(settings: EffectSettings) {
  const density = settings.density;
  const count = density * density;
  const gap = 280 / Math.max(density - 1, 1);
  const size = Math.max(7, 18 - density * 0.62);
  const startX = 60;
  const startY = 105;
  const stagger = settings.variation / 58;

  return Array.from({ length: count }, (_, index) => {
    const column = index % density;
    const row = Math.floor(index / density);

    return {
      delay: (column * 0.07 + row * 0.11) * -stagger,
      id: `${column}-${row}`,
      size,
      x: startX + column * gap,
      y: startY + row * gap,
    };
  });
}

function buildSweepBands(settings: EffectSettings) {
  const count = settings.density;
  const spread = 42 + settings.variation * 0.92;
  const baseY = 106 - spread / 2;

  return Array.from({ length: count }, (_, index) => {
    const y = baseY + index * (spread / Math.max(count - 1, 1));
    const lift = Math.sin(index * 0.9) * 22;

    return {
      delay: -index * 0.19,
      id: `band-${index}`,
      path: `M -88 ${y} C 70 ${y + lift}, 178 ${y + 76 - lift}, 488 ${y + 22}`,
      width: 1.2 + settings.intensity / 32,
    };
  });
}

function buildSweepNodes(settings: EffectSettings) {
  const count = settings.density * 2;
  const radius = 2.2 + settings.intensity / 38;

  return Array.from({ length: count }, (_, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);

    return {
      delay: -index * 0.13,
      id: `node-${index}`,
      radius,
      x: 95 + column * 65 + Math.sin(index) * settings.variation * 0.22,
      y: 150 + row * 48 + Math.cos(index * 0.8) * 18,
    };
  });
}
