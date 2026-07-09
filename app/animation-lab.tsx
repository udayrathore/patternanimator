"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";

type EffectId = "grid-echo" | "signal-sweep";
type BackgroundId = "moss" | "ink" | "paper" | "plum";
type ShapeId = "square" | "circle" | "diamond" | "spark";
type FillId = "outline" | "mint" | "sun" | "coral";
type RadiusId = "sharp" | "soft" | "round";

type EffectSettings = {
  density: number;
  speed: number;
  variation: number;
};

type VisualSettings = {
  background: BackgroundId;
  fill: FillId;
  radius: RadiusId;
  shape: ShapeId;
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

type BackgroundPreset = {
  border: string;
  card: string;
  label: string;
  overlay: string;
  page: string;
  swatch: string;
  text: string;
};

type FillPreset = {
  faint: string;
  fill: string;
  glow: string;
  label: string;
  stroke: string;
  swatch: string;
};

const effectConfigs: Record<EffectId, EffectConfig> = {
  "grid-echo": {
    controls: [
      { key: "density", label: "Cells", min: 5, max: 13 },
      { key: "speed", label: "Speed", min: 2, max: 9 },
      { key: "variation", label: "Stagger", min: 10, max: 80 },
    ],
    label: "Grid Echo",
    status: "Shape repeat",
  },
  "signal-sweep": {
    controls: [
      { key: "density", label: "Bands", min: 4, max: 12 },
      { key: "speed", label: "Speed", min: 2, max: 9 },
      { key: "variation", label: "Offset", min: 10, max: 80 },
    ],
    label: "Signal Sweep",
    status: "Line repeat",
  },
};

const backgroundPresets: Record<BackgroundId, BackgroundPreset> = {
  moss: {
    border: "#28352f",
    card: "#16201c",
    label: "Moss",
    overlay:
      "radial-gradient(circle at 28% 18%, rgba(247, 215, 126, 0.25), transparent 32%), linear-gradient(140deg, rgba(40, 143, 122, 0.34), rgba(22, 32, 28, 0) 46%), linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))",
    page: "#f4f7f2",
    swatch: "linear-gradient(135deg, #16201c 0%, #2f7b69 54%, #f5d77e 100%)",
    text: "#17201d",
  },
  ink: {
    border: "#293244",
    card: "#111826",
    label: "Ink",
    overlay:
      "radial-gradient(circle at 70% 22%, rgba(105, 151, 255, 0.28), transparent 34%), linear-gradient(145deg, rgba(244, 139, 100, 0.22), rgba(17, 24, 38, 0) 44%), linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0))",
    page: "#eef2f7",
    swatch: "linear-gradient(135deg, #111826 0%, #375d9d 56%, #f48b64 100%)",
    text: "#151b29",
  },
  paper: {
    border: "#d4c4a7",
    card: "#efe6d1",
    label: "Paper",
    overlay:
      "radial-gradient(circle at 28% 18%, rgba(244, 139, 100, 0.24), transparent 33%), linear-gradient(138deg, rgba(88, 120, 109, 0.2), rgba(239, 230, 209, 0) 48%), linear-gradient(180deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0))",
    page: "#fbf4e8",
    swatch: "linear-gradient(135deg, #efe6d1 0%, #8aa69b 54%, #f48b64 100%)",
    text: "#2c241c",
  },
  plum: {
    border: "#3a2039",
    card: "#251528",
    label: "Plum",
    overlay:
      "radial-gradient(circle at 34% 18%, rgba(245, 215, 126, 0.24), transparent 31%), linear-gradient(142deg, rgba(130, 214, 197, 0.23), rgba(37, 21, 40, 0) 47%), linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))",
    page: "#f5eef7",
    swatch: "linear-gradient(135deg, #251528 0%, #704276 54%, #82d6c5 100%)",
    text: "#241a27",
  },
};

const fillPresets: Record<FillId, FillPreset> = {
  outline: {
    faint: "rgba(255, 255, 255, 0.04)",
    fill: "rgba(255, 255, 255, 0.05)",
    glow: "rgba(130, 214, 197, 0.32)",
    label: "Outline",
    stroke: "#82d6c5",
    swatch: "linear-gradient(135deg, transparent 0 44%, #82d6c5 45% 55%, transparent 56%)",
  },
  mint: {
    faint: "rgba(130, 214, 197, 0.18)",
    fill: "#82d6c5",
    glow: "rgba(130, 214, 197, 0.38)",
    label: "Mint",
    stroke: "#d9fff5",
    swatch: "#82d6c5",
  },
  sun: {
    faint: "rgba(245, 215, 126, 0.18)",
    fill: "#f5d77e",
    glow: "rgba(245, 215, 126, 0.38)",
    label: "Sun",
    stroke: "#fff4bf",
    swatch: "#f5d77e",
  },
  coral: {
    faint: "rgba(244, 139, 100, 0.18)",
    fill: "#f48b64",
    glow: "rgba(244, 139, 100, 0.36)",
    label: "Coral",
    stroke: "#ffd2bf",
    swatch: "#f48b64",
  },
};

const radiusPresets: Record<RadiusId, { label: string; value: number }> = {
  sharp: { label: "Sharp", value: 0 },
  soft: { label: "Soft", value: 3 },
  round: { label: "Round", value: 7 },
};

const shapeLabels: Record<ShapeId, string> = {
  circle: "Circle",
  diamond: "Diamond",
  spark: "SVG",
  square: "Square",
};

const initialSettings: Record<EffectId, EffectSettings> = {
  "grid-echo": {
    density: 9,
    speed: 5,
    variation: 42,
  },
  "signal-sweep": {
    density: 7,
    speed: 6,
    variation: 36,
  },
};

const initialVisuals: VisualSettings = {
  background: "moss",
  fill: "outline",
  radius: "soft",
  shape: "square",
};

export default function AnimationLab() {
  const [effect, setEffect] = useState<EffectId>("grid-echo");
  const [settingsByEffect, setSettingsByEffect] =
    useState<Record<EffectId, EffectSettings>>(initialSettings);
  const [visuals, setVisuals] = useState<VisualSettings>(initialVisuals);
  const settings = settingsByEffect[effect];
  const config = effectConfigs[effect];
  const background = backgroundPresets[visuals.background];

  const updateSetting = (key: ControlKey, value: number) => {
    setSettingsByEffect((current) => ({
      ...current,
      [effect]: {
        ...current[effect],
        [key]: value,
      },
    }));
  };

  const updateVisual = <Key extends keyof VisualSettings>(
    key: Key,
    value: VisualSettings[Key],
  ) => {
    setVisuals((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetControls = () => {
    setSettingsByEffect((current) => ({
      ...current,
      [effect]: initialSettings[effect],
    }));
    setVisuals(initialVisuals);
  };

  return (
    <main
      className="min-h-screen text-[#17201d]"
      style={
        {
          "--page-background": background.page,
          "--page-foreground": background.text,
          background: "var(--page-background)",
          color: "var(--page-foreground)",
        } as CSSProperties
      }
    >
      <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 px-5 py-5 lg:grid-cols-[minmax(420px,1fr)_390px] lg:px-8">
        <div className="flex min-h-[520px] items-center justify-center p-2 sm:p-8 lg:min-h-[calc(100vh-40px)]">
          <PatternCard
            config={config}
            effect={effect}
            settings={settings}
            visuals={visuals}
          />
        </div>

        <aside className="flex flex-col justify-center gap-5 lg:min-h-[calc(100vh-40px)]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#6c7970]">
              Motion Lab
            </p>
            <h1 className="mt-3 max-w-sm text-3xl font-semibold leading-[1.08] text-[var(--page-foreground)] sm:text-4xl">
              Pattern animator
            </h1>
          </div>

          <EffectTabs activeEffect={effect} setEffect={setEffect} />

          <ControlPanel
            config={config}
            resetControls={resetControls}
            settings={settings}
            updateSetting={updateSetting}
            updateVisual={updateVisual}
            visuals={visuals}
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
            aria-pressed={activeEffect === id}
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
  visuals,
}: {
  config: EffectConfig;
  effect: EffectId;
  settings: EffectSettings;
  visuals: VisualSettings;
}) {
  const background = backgroundPresets[visuals.background];
  const fill = fillPresets[visuals.fill];
  const duration = 10.5 - settings.speed;
  const style = {
    "--card-overlay": background.overlay,
    "--motion-duration": `${duration}s`,
    "--motion-variation": settings.variation / 100,
    "--shape-faint": fill.faint,
    "--shape-fill": fill.fill,
    "--shape-glow": fill.glow,
    "--shape-radius": radiusPresets[visuals.radius].value,
    "--shape-stroke": fill.stroke,
    background: background.card,
    borderColor: background.border,
  } as CSSProperties;

  return (
    <article
      className="relative aspect-[4/5] w-full max-w-[390px] overflow-hidden rounded-lg border bg-[#16201c] shadow-[0_30px_90px_rgba(18,25,23,0.32)]"
      style={style}
    >
      <div
        className="absolute inset-0"
        style={{ background: "var(--card-overlay)" }}
      />
      {effect === "grid-echo" ? (
        <GridEchoPattern settings={settings} visuals={visuals} />
      ) : (
        <SignalSweepPattern settings={settings} visuals={visuals} />
      )}
      <div className="absolute inset-x-7 bottom-7 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-[#b7c8bd]">{config.status}</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {config.label}
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner">
          <ShapeIcon shape={visuals.shape} />
        </div>
      </div>
    </article>
  );
}

function GridEchoPattern({
  settings,
  visuals,
}: {
  settings: EffectSettings;
  visuals: VisualSettings;
}) {
  const cells = useMemo(() => buildGridCells(settings), [settings]);

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 500"
    >
      <g className="grid-echo-layer">
        {cells.map((cell) => (
          <ShapeMark
            className="grid-echo-mark"
            key={cell.id}
            shape={visuals.shape}
            size={cell.size}
            style={{ animationDelay: `${cell.delay}s` }}
            x={cell.x}
            y={cell.y}
          />
        ))}
      </g>
    </svg>
  );
}

function SignalSweepPattern({
  settings,
  visuals,
}: {
  settings: EffectSettings;
  visuals: VisualSettings;
}) {
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
          <stop offset="0" stopColor="var(--shape-stroke)" stopOpacity="0" />
          <stop offset="0.42" stopColor="var(--shape-fill)" />
          <stop offset="1" stopColor="var(--shape-stroke)" stopOpacity="0.2" />
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
          <ShapeMark
            className="signal-sweep-node"
            key={node.id}
            shape={visuals.shape}
            size={node.size}
            style={{ animationDelay: `${node.delay}s` }}
            x={node.x}
            y={node.y}
          />
        ))}
      </g>
    </svg>
  );
}

function ShapeMark({
  className,
  shape,
  size,
  style,
  x,
  y,
}: {
  className: string;
  shape: ShapeId;
  size: number;
  style?: CSSProperties;
  x: number;
  y: number;
}) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  if (shape === "circle") {
    return (
      <circle
        className={className}
        cx={centerX}
        cy={centerY}
        r={size / 2}
        style={style}
      />
    );
  }

  if (shape === "diamond") {
    return (
      <polygon
        className={className}
        points={`${centerX},${y} ${x + size},${centerY} ${centerX},${
          y + size
        } ${x},${centerY}`}
        style={style}
      />
    );
  }

  if (shape === "spark") {
    return (
      <path className={className} d={buildSparkPath(x, y, size)} style={style} />
    );
  }

  return (
    <rect
      className={className}
      height={size}
      rx="var(--shape-radius)"
      style={style}
      width={size}
      x={x}
      y={y}
    />
  );
}

function ControlPanel({
  config,
  resetControls,
  settings,
  updateSetting,
  updateVisual,
  visuals,
}: {
  config: EffectConfig;
  resetControls: () => void;
  settings: EffectSettings;
  updateSetting: (key: ControlKey, value: number) => void;
  updateVisual: <Key extends keyof VisualSettings>(
    key: Key,
    value: VisualSettings[Key],
  ) => void;
  visuals: VisualSettings;
}) {
  return (
    <div className="rounded-lg border border-[#d2dbd1] bg-[#fbfcf8] p-5 shadow-[0_18px_50px_rgba(23,32,29,0.08)]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#17201d]">Controls</h2>
        <button
          className="rounded-md border border-[#cad4ca] px-3 py-2 text-sm font-semibold text-[#4b5751] transition hover:bg-[#eef4ea]"
          onClick={resetControls}
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

      <div className="mt-6 space-y-5 border-t border-[#e1e7df] pt-5">
        <BackgroundSelector
          onChange={(background) => updateVisual("background", background)}
          value={visuals.background}
        />
        <ShapeSelector
          onChange={(shape) => updateVisual("shape", shape)}
          value={visuals.shape}
        />
        <FillSelector
          onChange={(fill) => updateVisual("fill", fill)}
          value={visuals.fill}
        />
        {visuals.shape === "square" ? (
          <RadiusSelector
            onChange={(radius) => updateVisual("radius", radius)}
            value={visuals.radius}
          />
        ) : null}
      </div>
    </div>
  );
}

function BackgroundSelector({
  onChange,
  value,
}: {
  onChange: (value: BackgroundId) => void;
  value: BackgroundId;
}) {
  return (
    <ControlGroup label="Backdrop">
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(backgroundPresets) as BackgroundId[]).map((id) => (
          <SwatchButton
            active={value === id}
            key={id}
            label={backgroundPresets[id].label}
            onClick={() => onChange(id)}
            swatch={backgroundPresets[id].swatch}
          />
        ))}
      </div>
    </ControlGroup>
  );
}

function ShapeSelector({
  onChange,
  value,
}: {
  onChange: (value: ShapeId) => void;
  value: ShapeId;
}) {
  return (
    <ControlGroup label="Shape">
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(shapeLabels) as ShapeId[]).map((id) => (
          <button
            aria-pressed={value === id}
            className={`flex h-14 items-center justify-center rounded-md border text-[#4b5751] transition ${
              value === id
                ? "border-[#17201d] bg-[#17201d] text-white"
                : "border-[#d8e0d7] bg-white hover:border-[#aebaae]"
            }`}
            key={id}
            onClick={() => onChange(id)}
            title={shapeLabels[id]}
            type="button"
          >
            <ShapeIcon shape={id} />
          </button>
        ))}
      </div>
    </ControlGroup>
  );
}

function FillSelector({
  onChange,
  value,
}: {
  onChange: (value: FillId) => void;
  value: FillId;
}) {
  return (
    <ControlGroup label="Fill">
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(fillPresets) as FillId[]).map((id) => (
          <SwatchButton
            active={value === id}
            key={id}
            label={fillPresets[id].label}
            onClick={() => onChange(id)}
            swatch={fillPresets[id].swatch}
          />
        ))}
      </div>
    </ControlGroup>
  );
}

function RadiusSelector({
  onChange,
  value,
}: {
  onChange: (value: RadiusId) => void;
  value: RadiusId;
}) {
  return (
    <ControlGroup label="Corners">
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(radiusPresets) as RadiusId[]).map((id) => (
          <button
            aria-pressed={value === id}
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
              value === id
                ? "border-[#17201d] bg-[#17201d] text-white"
                : "border-[#d8e0d7] bg-white text-[#4b5751] hover:border-[#aebaae]"
            }`}
            key={id}
            onClick={() => onChange(id)}
            type="button"
          >
            {radiusPresets[id].label}
          </button>
        ))}
      </div>
    </ControlGroup>
  );
}

function ControlGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#4d5a53]">{label}</p>
      {children}
    </div>
  );
}

function SwatchButton({
  active,
  label,
  onClick,
  swatch,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  swatch: string;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`h-14 rounded-md border p-1 transition ${
        active
          ? "border-[#17201d] bg-[#17201d]"
          : "border-[#d8e0d7] bg-white hover:border-[#aebaae]"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <span
        className="block h-full rounded-[4px]"
        style={{ background: swatch }}
      />
    </button>
  );
}

function ShapeIcon({ shape }: { shape: ShapeId }) {
  if (shape === "circle") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          fill="currentColor"
          opacity="0.72"
          r="7"
        />
      </svg>
    );
  }

  if (shape === "diamond") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M12 4 L20 12 L12 20 L4 12 Z" fill="currentColor" opacity="0.72" />
      </svg>
    );
  }

  if (shape === "spark") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
        <path
          d="M12 3 L14.4 9.6 L21 12 L14.4 14.4 L12 21 L9.6 14.4 L3 12 L9.6 9.6 Z"
          fill="currentColor"
          opacity="0.72"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <rect
        fill="currentColor"
        height="14"
        opacity="0.72"
        rx="3"
        width="14"
        x="5"
        y="5"
      />
    </svg>
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
      width: 2.8,
    };
  });
}

function buildSweepNodes(settings: EffectSettings) {
  const count = settings.density * 2;
  const size = 8.5;

  return Array.from({ length: count }, (_, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);

    return {
      delay: -index * 0.13,
      id: `node-${index}`,
      size,
      x: 95 + column * 65 + Math.sin(index) * settings.variation * 0.22,
      y: 150 + row * 48 + Math.cos(index * 0.8) * 18,
    };
  });
}

function buildSparkPath(x: number, y: number, size: number) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const outer = size / 2;
  const inner = size / 5;

  return [
    `M ${centerX} ${centerY - outer}`,
    `L ${centerX + inner} ${centerY - inner}`,
    `L ${centerX + outer} ${centerY}`,
    `L ${centerX + inner} ${centerY + inner}`,
    `L ${centerX} ${centerY + outer}`,
    `L ${centerX - inner} ${centerY + inner}`,
    `L ${centerX - outer} ${centerY}`,
    `L ${centerX - inner} ${centerY - inner}`,
    "Z",
  ].join(" ");
}
