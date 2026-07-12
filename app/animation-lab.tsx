"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type EffectId =
  | "practical-demo"
  | "section-grid"
  | "working-knowledge";
type BackgroundId = "moss" | "ink" | "paper" | "plum";
type ShapeId = "square" | "circle" | "diamond" | "spark";
type FillId = "outline" | "mint" | "sun" | "coral";
type RadiusId = "sharp" | "soft" | "round";
type CodeTab = "logic" | "css";
type ImageMode = "fill" | "tile" | "stretch" | "crop";
type TileBlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft-light" | "difference";
type ToolIconName = "apply" | "chevron-left" | "chevron-right" | "code" | "copy" | "fullscreen" | "grid" | "image" | "pattern" | "reset" | "sync" | "wave";

type EffectSettings = {
  density: number;
  speed: number;
  scale: number;
  variation: number;
  glow: number;
  attack: number;
  release: number;
  flickerSpeed: number;
  tileGap: number;
  sectionColor1: string;
  sectionColor2: string;
  sectionColor3: string;
  sectionColor4: string;
  rhythm?: number;
  patternOffset?: number;
  tileRadius?: number;
  fillOpacity?: number;
  strokeWidth?: number;
  strokeColor?: string;
  boxColor?: string;
  imageMode?: ImageMode;
  imageBrightness?: number;
  imageContrast?: number;
  imageSaturation?: number;
  tileBlendMode?: TileBlendMode;
  blendStrength?: number;
  topAmplitude: number;
  topAngle: number;
  topPosition: number;
  topSpeed: number;
  topWave: WaveStyleId;
  bottomAmplitude: number;
  bottomAngle: number;
  bottomPosition: number;
  bottomWave: WaveStyleId;
};

type WaveStyleId = "sine" | "triangle" | "square" | "saw" | "pulse";

type VisualSettings = {
  background: BackgroundId;
  fill: FillId;
  radius: RadiusId;
  shape: ShapeId;
};

type ControlKey = keyof EffectSettings;
type NumericControlKey = "density" | "speed" | "scale" | "variation" | "glow" | "attack" | "release" | "flickerSpeed" | "tileGap";

type ControlConfig = {
  key: NumericControlKey;
  label: string;
  max: number;
  min: number;
};

type EffectConfig = {
  controlMode?: "dial" | "slider";
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

type AppliedCssMap = Record<EffectId, string>;
type CodeSnippetMap = Record<CodeTab, string>;

const effectConfigs: Record<EffectId, EffectConfig> = {
  "practical-demo": {
    controls: [
      { key: "density", label: "Columns", min: 14, max: 30 },
      { key: "scale", label: "Scale", min: 4, max: 24 },
      { key: "tileGap", label: "Card Gap", min: 0, max: 24 },
      { key: "speed", label: "Step Speed", min: 0, max: 9 },
      { key: "glow", label: "Glow", min: 0, max: 100 },
      { key: "attack", label: "Attack", min: 1, max: 100 },
      { key: "release", label: "Release", min: 1, max: 100 },
      { key: "flickerSpeed", label: "Flicker Speed", min: 0, max: 100 },
      { key: "variation", label: "Flicker Spread", min: 0, max: 100 },
    ],
    label: "Practical Demo",
    status: "Pixel field",
  },
  "section-grid": {
    controls: [
      { key: "density", label: "Columns", min: 3, max: 9 },
      { key: "scale", label: "Tile Scale", min: 24, max: 72 },
      { key: "speed", label: "Pattern Speed", min: 0, max: 9 },
      { key: "variation", label: "Fill Variation", min: 0, max: 100 },
    ],
    label: "Fourfold Pattern",
    status: "Section fill",
  },
  "working-knowledge": {
    controls: [
      { key: "density", label: "Bars", min: 28, max: 56 },
    ],
    label: "Working Knowledge",
    status: "Waveform",
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

const waveStyleLabels: Record<WaveStyleId, string> = {
  sine: "Sine",
  triangle: "Triangle",
  square: "Square",
  saw: "Saw",
  pulse: "Pulse",
};

const initialSettings: Record<EffectId, EffectSettings> = {
  "practical-demo": {
    density: 18,
    speed: 5,
    scale: 15,
    variation: 48,
    glow: 58,
    attack: 35,
    release: 55,
    flickerSpeed: 55,
    tileGap: 8,
    sectionColor1: "#f5c542",
    sectionColor2: "#50d6b2",
    sectionColor3: "#ff6f61",
    sectionColor4: "#7c6cff",
    boxColor: "#9d927d",
    imageMode: "crop",
    imageBrightness: 100,
    imageContrast: 100,
    imageSaturation: 100,
    tileBlendMode: "multiply",
    blendStrength: 100,
    topAmplitude: 50,
    topAngle: 0,
    topPosition: 0,
    topSpeed: 50,
    topWave: "sine",
    bottomAmplitude: 50,
    bottomAngle: 0,
    bottomPosition: 0,
    bottomWave: "sine",
  },
  "section-grid": {
    density: 5,
    speed: 5,
    scale: 52,
    variation: 68,
    glow: 50,
    attack: 35,
    release: 55,
    flickerSpeed: 50,
    tileGap: 8,
    sectionColor1: "#f5c542",
    sectionColor2: "#50d6b2",
    sectionColor3: "#ff6f61",
    sectionColor4: "#7c6cff",
    rhythm: 50,
    patternOffset: 0,
    tileRadius: 0,
    fillOpacity: 100,
    strokeWidth: 0,
    strokeColor: "#ffffff",
    topAmplitude: 50,
    topAngle: 0,
    topPosition: 0,
    topSpeed: 50,
    topWave: "sine",
    bottomAmplitude: 50,
    bottomAngle: 0,
    bottomPosition: 0,
    bottomWave: "sine",
  },
  "working-knowledge": {
    density: 46,
    speed: 5,
    scale: 14,
    variation: 68,
    glow: 50,
    attack: 35,
    release: 55,
    flickerSpeed: 50,
    tileGap: 8,
    sectionColor1: "#f5c542",
    sectionColor2: "#50d6b2",
    sectionColor3: "#ff6f61",
    sectionColor4: "#7c6cff",
    topAmplitude: 58,
    topAngle: 0,
    topPosition: 0,
    topSpeed: 56,
    topWave: "sine",
    bottomAmplitude: 52,
    bottomAngle: 0,
    bottomPosition: 0,
    bottomWave: "triangle",
  },
};

const initialVisuals: VisualSettings = {
  background: "moss",
  fill: "outline",
  radius: "soft",
  shape: "square",
};

const codeSnippets: Record<string, CodeSnippetMap> = {
  "grid-echo": {
    logic: `function GridEchoPattern({ settings, visuals }) {
  // density controls how many squares appear.
  // variation changes how much each square is offset in time.
  // shape controls the mark style you see in the card.
  const cells = useMemo(() => buildGridCells(settings), [settings]);

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500">
      <g className="grid-echo-layer">
        {cells.map((cell) => (
          <ShapeMark
            className="grid-echo-mark"
            key={cell.id}
            shape={visuals.shape}
            size={cell.size}
            style={{ animationDelay: \`\${cell.delay}s\` }}
            x={cell.x}
            y={cell.y}
          />
        ))}
      </g>
    </svg>
  );
}

function buildGridCells(settings) {
  // Higher density makes the grid tighter and more crowded.
  const density = settings.density;
  // Total number of squares in the field.
  const count = density * density;
  // Smaller gap means denser spacing between marks.
  const gap = 280 / Math.max(density - 1, 1);
  // Larger density makes each mark a little smaller.
  const size = Math.max(7, 18 - density * 0.62);

  return Array.from({ length: count }, (_, index) => {
    const column = index % density;
    const row = Math.floor(index / density);

    return {
      // Bigger variation creates more stagger between marks.
      delay: (column * 0.07 + row * 0.11) * -(settings.variation / 58),
      id: \`\${column}-\${row}\`,
      size,
      x: 60 + column * gap,
      y: 105 + row * gap,
    };
  });
}`,
    css: `.grid-echo-layer {
  /* Glow around the whole grid field. Increase this to make the card feel softer. */
  filter: drop-shadow(0 0 14px var(--shape-glow));
}

.grid-echo-mark {
  /* Each mark animates independently, so changing duration shifts the whole rhythm. */
  animation: gridEcho var(--motion-duration, 5.5s) ease-in-out infinite;
  /* This is the faint fill color for each square. */
  fill: var(--shape-faint);
  /* Opacity makes the pattern feel lighter or denser. */
  opacity: 0.42;
  /* Stroke is the outline color around each square. */
  stroke: var(--shape-stroke);
  stroke-width: 1.35;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes gridEcho {
  0%, 100% {
    /* Start and end in a quiet state. */
    opacity: 0.28;
    transform: scale(0.88) rotate(0deg);
  }

  42% {
    /* This is the strongest pulse in the motion. */
    opacity: 0.88;
    transform: scale(1.04) rotate(18deg);
  }

  70% {
    /* A softer mid-beat before looping back. */
    opacity: 0.5;
    transform: scale(0.96) rotate(36deg);
  }
}`,
  },
  "signal-sweep": {
    logic: `function SignalSweepPattern({ settings, visuals }) {
  // density changes how many sweep lines and nodes appear.
  // variation changes how far the field spreads across the card.
  const bands = useMemo(() => buildSweepBands(settings), [settings]);
  const nodes = useMemo(() => buildSweepNodes(settings), [settings]);

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500">
      <defs>
        <linearGradient id="sweepStroke" x1="0" x2="1" y1="0" y2="0">
          // The stroke fades out at the ends and stays bright in the center.
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
            style={{ animationDelay: \`\${band.delay}s\`, strokeWidth: band.width }}
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
            style={{ animationDelay: \`\${node.delay}s\` }}
            x={node.x}
            y={node.y}
          />
        ))}
      </g>
    </svg>
  );
}`,
    css: `.sweep-field {
  /* This glow shifts the whole band cluster a bit vertically. */
  filter: drop-shadow(0 0 19px var(--shape-glow));
  transform: translateY(calc(28px * var(--motion-variation, 0.4)));
}

.signal-sweep-band {
  /* Longer duration means the sweep travels more slowly across the card. */
  animation: signalSweep var(--motion-duration, 4.5s) ease-in-out infinite;
  fill: none;
  opacity: 0.2;
  stroke: url(#sweepStroke);
  stroke-linecap: round;
  transform-box: fill-box;
  transform-origin: center;
}

.signal-sweep-node {
  /* These are the small markers that blink along the sweep. */
  animation: nodeBlink var(--motion-duration, 4.5s) ease-in-out infinite;
  fill: var(--shape-fill);
  opacity: 0.14;
  stroke: var(--shape-stroke);
  stroke-width: 0.85;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes signalSweep {
  0%, 100% { opacity: 0.1; transform: translateX(-34px); }
  46% { opacity: 0.84; transform: translateX(42px); }
  72% { opacity: 0.24; transform: translateX(18px); }
}`,
  },
  "practical-demo": {
    logic: `function PracticalDemoCard({ settings }) {
  // density controls how many columns appear.
  // speed controls the average leftward step interval for each row.
  const rows = useMemo(() => buildPracticalRows(settings), [settings]);
  const columns = settings.density;

  return (
    <article className="practical-card relative aspect-[4/5] w-full max-w-[390px]">
      <svg className="absolute left-9 top-10 h-[180px] w-[calc(100%-72px)]" viewBox="0 0 318 166">
        {rows.map((row) => (
          <g key={row.id} style={{ animationDelay: \`\${row.delay}s\` }}>
            {Array.from({ length: columns + 2 }, (_, index) => {
              const tile = row.tiles[index];

              return (
                <rect
                  className="practical-tile"
                  height={tile.size}
                  key={tile.key}
                  style={{
                    fill: tile.color,
                    "--tile-step": \`\${tile.step}px\`,
                  }}
                  width={tile.size}
                  x={tile.x}
                  y={tile.y}
                />
              );
            })}
          </g>
        ))}
      </svg>

      <div className="absolute inset-x-8 top-[245px]">
        <h2 className="font-serif text-[41px] leading-[0.95] text-[#554b3a]">
          Practical<br />Demonstration
        </h2>
        <p className="mt-8 max-w-[310px] text-[19px] leading-[1.55] text-[#7d725f]">
          Detailed walkthroughs of designing interfaces, identifying opportunities,
          and improving through refinement.
        </p>
      </div>
    </article>
  );
}`,
    css: `.practical-card {
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid #e2d6bf;
  background: #f2e8d4;
  box-shadow: 0 30px 90px rgba(32, 26, 18, 0.24);
  font-family: Arial, Helvetica, sans-serif;
}

.practical-row {
  animation: practicalRow var(--row-duration, 2.2s) steps(1, end) infinite;
  transform-box: fill-box;
  transform-origin: center;
}

.practical-tile {
  opacity: 0.94;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes practicalRow {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(calc(-1 * var(--row-step, 19px)));
  }
}`,
  },
  "section-grid": {
    logic: `function FourfoldPatternCard({ settings }) {
  // Each tile contains four triangular sections.
  // Pattern Speed changes their fill rhythm without moving the tiles.
  return <FourfoldTileGrid settings={settings} />;
}`,
    css: `.fourfold-tile {
  /* The tile stays fixed; only its four section fills change. */
  overflow: hidden;
}`,
  },
  "working-knowledge": {
    logic: `function WorkingKnowledgeCard({ settings }) {
  // density controls how many bars appear.
  const bars = useMemo(() => buildWorkingKnowledgeBars(settings), [settings]);

  return (
    <article className="relative aspect-[45/58] w-full max-w-[360px] overflow-hidden rounded-[24px] bg-[#e54f10]">
      <svg className="absolute left-6 top-6 h-48 w-[312px]" preserveAspectRatio="none" viewBox="0 0 312 192">
        {bars.map((bar) => (
          <line
            className="waveform-bar"
            key={bar.id}
            x1={bar.x}
            x2={bar.x}
            y1={bar.y1}
            y2={bar.y2}
          />
        ))}
      </svg>

      <h2 className="absolute left-6 top-[232px] font-serif text-[36px] leading-9 text-[#ffffc2]">
        Working<br />Knowledge
      </h2>
      <p className="absolute left-6 top-[316px] w-[312px] text-base leading-6 text-[#ffffc2]/70">
        Frameworks, principles, and models I've learned and developed that you
        will be able to immediately apply to your practice.
      </p>
    </article>
  );
}`,
    css: `.waveform-bar {
  stroke: #ffffc2;
  stroke-linecap: square;
  stroke-width: 3.4;
}`,
  },
};

const initialAppliedCss: AppliedCssMap = {
  "practical-demo": codeSnippets["practical-demo"].css,
  "section-grid": codeSnippets["section-grid"].css,
  "working-knowledge": codeSnippets["working-knowledge"].css,
};

export default function AnimationLab() {
  const [effect, setEffect] = useState<EffectId>("practical-demo");
  const [settingsByEffect, setSettingsByEffect] =
    useState<Record<EffectId, EffectSettings>>(initialSettings);
  const [visuals, setVisuals] = useState<VisualSettings>(initialVisuals);
  const [codeTab, setCodeTab] = useState<CodeTab>("logic");
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [codeCollapsed, setCodeCollapsed] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(390);
  const [animationOnly, setAnimationOnly] = useState(false);
  const [practicalImage, setPracticalImage] = useState<string | null>(null);
  const [workingImage, setWorkingImage] = useState<string | null>(null);
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>({});
  const [appliedCssByEffect, setAppliedCssByEffect] =
    useState<AppliedCssMap>(initialAppliedCss);
  const settings = settingsByEffect[effect];
  const config = effectConfigs[effect];
  const background = backgroundPresets[visuals.background];
  const cssDraftKey = `${effect}:css`;
  const logicDraftKey = `${effect}:logic`;
  const cssDraft = codeDrafts[cssDraftKey] ?? codeSnippets[effect].css;
  const logicDraft = codeDrafts[logicDraftKey] ?? codeSnippets[effect].logic;
  const appliedCss = appliedCssByEffect[effect];
  const displayCode =
    codeTab === "css"
      ? resolveCssText(cssDraft, visuals)
      : logicDraft;
  const cssColors = codeTab === "css" ? extractHexColors(displayCode) : [];
  const copyCode = () => {
    void navigator.clipboard?.writeText(displayCode);
  };

  const updateSetting = <K extends ControlKey>(key: K, value: EffectSettings[K]) => {
    setSettingsByEffect((current) => {
      const next = {
        ...current,
        [effect]: {
          ...current[effect],
          [key]: value,
        },
      };

      setCodeDrafts((drafts) => ({
        ...drafts,
        [logicDraftKey]: buildLogicDraft(effect, next[effect], visuals),
      }));

      return next;
    });
  };

  const updateVisual = <Key extends keyof VisualSettings>(
    key: Key,
    value: VisualSettings[Key],
  ) => {
    setVisuals((current) => {
      const next = {
        ...current,
        [key]: value,
      };

      setCodeDrafts((drafts) => ({
        ...drafts,
        [logicDraftKey]: buildLogicDraft(effect, settings, next),
      }));

      return next;
    });
  };

  const resetControls = () => {
    setSettingsByEffect((current) => ({
      ...current,
      [effect]: initialSettings[effect],
    }));
    setVisuals(initialVisuals);
  };

  const updateCssDraft = (value: string) => {
    setCodeDrafts((current) => ({
      ...current,
      [cssDraftKey]: value,
    }));
  };

  const replaceCssColor = (previousColor: string, nextColor: string) => {
    setCodeDrafts((current) => ({
      ...current,
      [cssDraftKey]: (current[cssDraftKey] ?? codeSnippets[effect].css).replaceAll(
        previousColor,
        nextColor,
      ),
    }));
  };

  const updateLogicDraft = (value: string) => {
    setCodeDrafts((current) => ({
      ...current,
      [logicDraftKey]: value,
    }));
  };

  const applyCssDraft = () => {
    setAppliedCssByEffect((current) => ({
      ...current,
      [effect]: cssDraft,
    }));
  };

  const resetCssDraft = () => {
    setCodeDrafts((current) => {
      const next = { ...current };
      delete next[cssDraftKey];
      return next;
    });
    setAppliedCssByEffect((current) => ({
      ...current,
      [effect]: codeSnippets[effect].css,
    }));
  };

  const resetLogicDraft = () => {
    setCodeDrafts((current) => {
      const next = { ...current };
      delete next[logicDraftKey];
      return next;
    });
  };

  const syncLogicDraft = () => {
    setCodeDrafts((current) => ({
      ...current,
      [logicDraftKey]: buildLogicDraft(effect, settings, visuals),
    }));
  };
  const uploadBackgroundImage = (target: EffectId, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (target === "working-knowledge") setWorkingImage(result);
      else setPracticalImage(result);
    };
    reader.readAsDataURL(file);
  };
  const layoutColumns = controlsCollapsed
    ? codeCollapsed
      ? "48px minmax(0,1fr) 48px"
      : "48px minmax(0,1fr) minmax(260px,20%)"
    : codeCollapsed
      ? "minmax(240px,20%) minmax(0,1fr) 48px"
      : "minmax(240px,20%) minmax(0,60%) minmax(260px,20%)";
  const previewAspect = 10 / 16;
  const previewScale = previewWidth / 390;
  const animationBackground = effect === "practical-demo" ? "#f2e8d4" : effect === "section-grid" ? "#17233f" : "#e54f10";

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
      <section
        className="mx-auto grid min-h-screen w-full max-w-[1680px] gap-5 px-4 py-4 lg:px-6"
        style={{
          gridTemplateAreas: '"controls canvas code"',
          gridTemplateColumns: layoutColumns,
        }}
      >
        <aside className="flex min-h-[calc(100vh-32px)] min-w-0 flex-col gap-5 overflow-hidden" style={{ gridArea: "controls" }}>
          <div>
            <div className="flex items-center justify-between gap-2">
              {!controlsCollapsed ? (
                <p className="text-sm font-semibold uppercase text-[#6c7970]">Controls</p>
              ) : null}
              <IconButton icon={controlsCollapsed ? "chevron-right" : "chevron-left"} label={controlsCollapsed ? "Expand controls" : "Collapse controls"} onClick={() => setControlsCollapsed((value) => !value)} />
            </div>
          </div>

          {!controlsCollapsed ? (
            <>
              <EffectTabs activeEffect={effect} setEffect={setEffect} />
              <ControlPanel
                config={config}
                effect={effect}
                resetControls={resetControls}
                settings={settings}
                updateSetting={updateSetting}
                updateVisual={updateVisual}
                visuals={visuals}
                onImageUpload={(file) => uploadBackgroundImage(effect, file)}
              />
            </>
          ) : null}
        </aside>

        <div className="flex min-h-[calc(100vh-32px)] items-stretch" style={{ gridArea: "code" }}>
          <div className="w-full rounded-xl border border-[#d2dbd1] bg-[#fbfcf8] p-4 shadow-[0_18px_50px_rgba(23,32,29,0.08)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              {!codeCollapsed ? <div>
                <p className="text-xs font-semibold uppercase text-[#7a857d]">
                  Code
                </p>
                <h2 className="mt-1 text-base font-semibold text-[#17201d]">
                  {config.label}
                </h2>
              </div> : null}
              {!codeCollapsed ? <div className="flex gap-1">
                <IconButton icon="copy" label="Copy code" onClick={copyCode} />
                <IconButton icon="apply" label="Apply CSS" onClick={applyCssDraft} />
                <IconButton icon="sync" label="Sync code" onClick={syncLogicDraft} />
                <IconButton icon="reset" label="Reset code" onClick={codeTab === "css" ? resetCssDraft : resetLogicDraft} />
              </div> : null}
              <IconButton icon={codeCollapsed ? "chevron-left" : "chevron-right"} label={codeCollapsed ? "Expand code" : "Collapse code"} onClick={() => setCodeCollapsed((value) => !value)} />
            </div>

            {codeCollapsed ? null : (
              <>

            <div className="flex gap-1">
              {(["logic", "css"] as CodeTab[]).map((tab) => (
                <button
                  aria-pressed={codeTab === tab}
                  className={`icon-tool relative flex h-8 w-8 items-center justify-center rounded-md transition ${
                    codeTab === tab
                      ? "bg-[#17201d] text-white"
                      : "bg-[#eef4ea] text-[#56615b] hover:bg-[#e2eadf]"
                  }`}
                  key={tab}
                  onClick={() => setCodeTab(tab)}
                  title={tab === "logic" ? "Logic" : "CSS"}
                  type="button"
                >
                  <ToolIcon name="code" />
                </button>
              ))}
            </div>

            {codeTab === "css" ? (
              <div className="mt-4 rounded-md border border-[#d7dfd5] bg-white p-3">
                <p className="text-xs font-semibold uppercase text-[#7a857d]">
                  Colors
                </p>
                <div className="mt-3 grid gap-2">
                  {cssColors.length > 0 ? (
                    cssColors.map((color) => (
                      <label
                        className="flex items-center gap-3 rounded-md border border-[#e4e9e1] px-3 py-2"
                        key={color}
                      >
                        <input
                          aria-label={`Change ${color}`}
                          className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0"
                          onChange={(event) =>
                            replaceCssColor(color, event.target.value)
                          }
                          type="color"
                          value={color}
                        />
                        <span className="font-mono text-xs text-[#56615b]">
                          {color}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-[#6f7a72]">No hex colors found.</p>
                  )}
                </div>
              </div>
            ) : null}

            <textarea
              className="h-[calc(100vh-176px)] min-h-[540px] w-full resize-none rounded-md border border-[#d7dfd5] bg-[#101411] p-4 font-mono text-xs leading-5 text-[#eaf3e8] outline-none transition focus:border-[#7e8d81]"
              onChange={(event) =>
                codeTab === "css"
                  ? updateCssDraft(event.target.value)
                  : updateLogicDraft(event.target.value)
              }
              spellCheck={false}
              value={displayCode}
            />
              </>
            )}
          </div>
        </div>

        <div
          className={`${animationOnly ? "fixed inset-0 z-50 bg-[#0f1211]" : "relative min-h-[calc(100vh-32px)] rounded-xl border border-[#d2dbd1] bg-[#e8ebe7] shadow-[0_18px_50px_rgba(23,32,29,0.08)]"} flex items-center justify-center overflow-hidden p-4`}
          style={{ gridArea: "canvas" }}
        >
          <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-3 rounded-md border border-[#cbd3ca] bg-white px-3 py-2 shadow-sm">
            {!animationOnly ? (
              <label className="flex items-center gap-2 text-xs font-semibold text-[#4d5a53]">
                Size
                <input className="motion-slider w-32" max={720} min={240} onChange={(event) => setPreviewWidth(Number(event.target.value))} type="range" value={previewWidth} />
                <span className="w-10 text-right">{previewWidth}</span>
              </label>
            ) : null}
            <IconButton icon="fullscreen" label={animationOnly ? "Exit full screen" : "Animation full screen"} onClick={() => setAnimationOnly((value) => !value)} />
          </div>
          <div
            className={`animation-only animation-stage ${animationOnly ? "h-full w-full" : "relative overflow-hidden border border-[#c8cfca]"}`}
            style={animationOnly ? { background: animationBackground } : { width: `${previewWidth}px`, height: `${previewWidth * previewAspect}px`, maxWidth: "100%", background: animationBackground }}
          >
            <div style={animationOnly ? { width: "100%", height: "100%" } : { width: "390px", height: `${390 * previewAspect}px`, transform: `scale(${previewScale})`, transformOrigin: "left top" }}>
              <style>{appliedCss}</style>
              {effect === "practical-demo" ? (
                <PracticalDemoCard image={practicalImage} settings={settings} />
              ) : effect === "section-grid" ? (
                <SectionGridCard settings={settings} />
              ) : effect === "working-knowledge" ? (
                <WorkingKnowledgeCard image={workingImage} settings={settings} />
              ) : (
                <PatternCard config={config} effect={effect} settings={settings} visuals={visuals} />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function resolveCssText(css: string, visuals: VisualSettings) {
  const background = backgroundPresets[visuals.background];
  const fill = fillPresets[visuals.fill];
  const radius = radiusPresets[visuals.radius];

  return css
    .replaceAll("var(--shape-glow)", fill.glow)
    .replaceAll("var(--shape-faint)", fill.faint)
    .replaceAll("var(--shape-fill)", fill.fill)
    .replaceAll("var(--shape-stroke)", fill.stroke)
    .replaceAll("var(--card-overlay)", background.overlay)
    .replaceAll("var(--motion-duration, 5.5s)", "5.5s")
    .replaceAll("var(--motion-duration, 4.5s)", "4.5s")
    .replaceAll("var(--motion-variation, 0.4)", "0.4")
    .replaceAll("var(--wave-shift, 0.7)", "0.7")
    .replaceAll("var(--shape-radius)", String(radius.value));
}

function extractHexColors(css: string) {
  const matches = css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  return Array.from(new Set(matches.map((color) => color.toLowerCase())));
}

function buildLogicDraft(
  effect: EffectId,
  settings: EffectSettings,
  visuals: VisualSettings,
) {
  const header = `// Live state
// effect: ${effect}
// density: ${settings.density}
// scale: ${settings.scale}
// speed: ${settings.speed}
// variation: ${settings.variation}
// background: ${visuals.background}
// fill: ${visuals.fill}
// radius: ${visuals.radius}
// shape: ${visuals.shape}

`;

  return `${header}${codeSnippets[effect].logic}`;
}

function IconButton({ icon, label, onClick }: { icon: ToolIconName; label: string; onClick: () => void }) {
  return (
    <button aria-label={label} className="icon-tool relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#cad4ca] text-[#4b5751] transition hover:bg-[#eef4ea]" onClick={onClick} title={label} type="button">
      <ToolIcon name={icon} />
    </button>
  );
}

function ToolIcon({ name }: { name: ToolIconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.8 };
  const paths: Record<ToolIconName, ReactNode> = {
    apply: <><path d="M5 12l4 4L19 6" /><path d="M4 20h16" /></>,
    "chevron-left": <path d="M15 18l-6-6 6-6" />,
    "chevron-right": <path d="M9 18l6-6-6-6" />,
    code: <><path d="M8 9l-3 3 3 3" /><path d="M16 9l3 3-3 3" /><path d="M14 5l-4 14" /></>,
    copy: <><rect height="12" rx="2" width="12" x="8" y="8" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    fullscreen: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></>,
    grid: <><rect height="6" width="6" x="3" y="3" /><rect height="6" width="6" x="15" y="3" /><rect height="6" width="6" x="3" y="15" /><rect height="6" width="6" x="15" y="15" /></>,
    image: <><rect height="16" rx="2" width="18" x="3" y="4" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 20" /></>,
    pattern: <><path d="M3 3l9 9L3 21z" /><path d="M21 3l-9 9 9 9z" /><path d="M3 3h18L12 12z" /><path d="M3 21h18l-9-9z" /></>,
    reset: <><path d="M4 10a8 8 0 1 1 2 7" /><path d="M4 4v6h6" /></>,
    sync: <><path d="M20 7h-5V2" /><path d="M4 17h5v5" /><path d="M6.2 6.2A8 8 0 0 1 20 7M4 17a8 8 0 0 0 13.8.8" /></>,
    wave: <path d="M3 12c3-8 6 8 9 0s6 8 9 0" />,
  };
  return <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" {...common}>{paths[name]}</svg>;
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
      <div className="flex gap-1">
        {(Object.keys(effectConfigs) as EffectId[]).map((id) => (
          <button
            aria-pressed={activeEffect === id}
            className={`icon-tool relative flex h-9 w-9 items-center justify-center rounded-md transition ${
              activeEffect === id
                ? "bg-[#17201d] text-white"
                : "bg-transparent text-[#56615b] hover:bg-[#eef4ea]"
            }`}
            key={id}
            onClick={() => setEffect(id)}
            title={effectConfigs[id].label}
            type="button"
          >
            <ToolIcon name={id === "practical-demo" ? "grid" : id === "section-grid" ? "pattern" : "wave"} />
          </button>
        ))}
      </div>
    </div>
  );
}

function PracticalDemoCard({ image, settings }: { image: string | null; settings: EffectSettings }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      setTime(now / 1000);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const rows = useMemo(() => buildPracticalRows(settings), [settings]);

  return (
    <article
      className="practical-card relative aspect-[4/5] w-full overflow-hidden rounded-[30px] border border-[#e2d6bf] bg-[#f2e8d4] shadow-[0_30px_90px_rgba(32,26,18,0.24)]"
    >
      {image ? (
        <div
          className="animation-image-layer absolute inset-0"
          style={practicalImageStyle(image, settings)}
        />
      ) : null}
      <svg
        aria-hidden="true"
        className="absolute left-9 top-10 h-[180px] w-[calc(100%-72px)]"
        preserveAspectRatio="none"
        viewBox="0 0 318 166"
      >
        {rows.map((row) => (
          <g
            className="practical-row"
            key={row.id}
          >
            {row.tiles.map((tile) => (
              <rect
                className="practical-tile"
                height={tile.size}
                key={tile.key}
                style={
                  {
                    fill: tile.color,
                    mixBlendMode: settings.tileBlendMode ?? "multiply",
                    opacity: practicalTileOpacity(tile, time, settings),
                    "--tile-step": `${tile.step}px`,
                  } as CSSProperties
                }
                width={tile.size}
                x={
                  ((tile.x -
                    (Math.floor((time - row.delay) / row.duration) %
                      row.tiles.length) *
                      row.step) %
                    (row.tiles.length * row.step) +
                    row.tiles.length * row.step) %
                    (row.tiles.length * row.step)
                }
                y={tile.y}
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="absolute inset-x-8 top-[245px]">
        <h2 className="font-serif text-[41px] leading-[0.95] tracking-normal text-[#554b3a]">
          Practical
          <br />
          Demonstration
        </h2>
        <p className="mt-8 max-w-[310px] text-[19px] leading-[1.55] text-[#7d725f]">
          Detailed walkthroughs of designing interfaces, identifying
          opportunities, and improving through refinement.
        </p>
      </div>
    </article>
  );
}

function SectionGridCard({ settings }: { settings: EffectSettings }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      setTime(now / 1000);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const columns = settings.density;
  const tileSize = Math.min(286 / columns, settings.scale);
  const gap = settings.tileGap;
  const gridWidth = columns * tileSize + (columns - 1) * gap;
  const rows = Math.ceil(166 / (tileSize + gap));
  const colors = [
    settings.sectionColor1,
    settings.sectionColor2,
    settings.sectionColor3,
    settings.sectionColor4,
  ];
  const speed = settings.speed / 5;
  const fillOpacity = (settings.fillOpacity ?? 100) / 100;
  const strokeWidth = settings.strokeWidth ?? 0;
  const strokeColor = settings.strokeColor ?? "#ffffff";

  return (
    <article className="relative aspect-[4/5] w-full overflow-hidden rounded-[30px] bg-[#17233f] shadow-[0_30px_90px_rgba(18,25,60,0.35)]">
      <svg
        aria-hidden="true"
        className="absolute left-8 top-8 h-[190px] w-[calc(100%-64px)]"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 318 190"
      >
        {Array.from({ length: columns * rows }, (_, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);
          const x = (318 - gridWidth) / 2 + column * (tileSize + gap);
          const y = 8 + row * (tileSize + gap);
          const tilePhase = tileNoise(column, row, settings.variation);
          const clipId = `fourfold-clip-${index}`;
          return (
            <g key={`fourfold-${index}`} transform={`translate(${x} ${y})`}>
              <defs><clipPath id={clipId}><rect height={tileSize} rx={settings.tileRadius ?? 0} width={tileSize} /></clipPath></defs>
              <g clipPath={`url(#${clipId})`} stroke={strokeColor} strokeWidth={strokeWidth}>
                <polygon points={`0,0 ${tileSize / 2},${tileSize / 2} 0,${tileSize}`} fill={colors[0]} opacity={sectionFillOpacity(0, tilePhase, time, speed, settings.variation, settings.rhythm ?? 50, settings.patternOffset ?? 0) * fillOpacity} />
                <polygon points={`${tileSize},0 ${tileSize / 2},${tileSize / 2} ${tileSize},${tileSize}`} fill={colors[1]} opacity={sectionFillOpacity(1, tilePhase, time, speed, settings.variation, settings.rhythm ?? 50, settings.patternOffset ?? 0) * fillOpacity} />
                <polygon points={`0,0 ${tileSize},0 ${tileSize / 2},${tileSize / 2}`} fill={colors[2]} opacity={sectionFillOpacity(2, tilePhase, time, speed, settings.variation, settings.rhythm ?? 50, settings.patternOffset ?? 0) * fillOpacity} />
                <polygon points={`0,${tileSize} ${tileSize / 2},${tileSize / 2} ${tileSize},${tileSize}`} fill={colors[3]} opacity={sectionFillOpacity(3, tilePhase, time, speed, settings.variation, settings.rhythm ?? 50, settings.patternOffset ?? 0) * fillOpacity} />
              </g>
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-x-8 top-[250px] text-[#f1f4ff]">
        <h2 className="font-serif text-[41px] leading-[0.95]">Pattern<br />Language</h2>
        <p className="mt-8 max-w-[310px] text-[19px] leading-[1.55] text-[#b9c8e6]">
          A repeated four-part system where the color fields change without shifting the underlying geometry.
        </p>
      </div>
    </article>
  );
}

function sectionFillOpacity(section: number, tilePhase: number, time: number, speed: number, variation: number, rhythm: number, offset: number) {
  if (speed === 0) return 0.45;
  const phase = time * speed * 0.7 + tilePhase * (1 + variation / 100) + section * (0.25 + rhythm / 80) + offset / 20;
  return 0.25 + (Math.sin(phase) * 0.5 + 0.5) * 0.75;
}

function WorkingKnowledgeCard({ image, settings }: { image: string | null; settings: EffectSettings }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      setTime(now / 1000);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const bars = useMemo(
    () => buildWorkingKnowledgeBars(settings, time),
    [settings, time],
  );

  return (
    <article
      className="relative aspect-[45/58] w-full overflow-hidden rounded-[24px] bg-[#e54f10] shadow-[0_30px_90px_rgba(24,14,8,0.35)]"
    >
      {image ? (
        <div className="animation-image-layer absolute inset-0" style={practicalImageStyle(image, settings)} />
      ) : null}
      <svg
        aria-hidden="true"
        className="absolute left-6 top-6 h-48 w-[312px]"
        preserveAspectRatio="none"
        viewBox="0 0 312 192"
      >
        {bars.map((bar) => (
          <line
            className="waveform-bar"
            key={bar.id}
            x1={bar.x}
            x2={bar.x}
            y1={bar.y1}
            y2={bar.y2}
            style={{
              mixBlendMode: settings.tileBlendMode ?? "multiply",
              opacity: (settings.blendStrength ?? 100) / 100,
            }}
          />
        ))}
      </svg>

      <h2 className="absolute left-6 top-[232px] whitespace-pre-line font-serif text-[36px] leading-9 tracking-normal text-[#ffffc2]">
        Working
        <br />
        Knowledge
      </h2>
      <div className="absolute left-6 top-[316px] w-[312px]">
        <p className="text-base leading-6 text-[#ffffc2]/70">
          Frameworks, principles, and models I&apos;ve learned and developed
          that you will be able to immediately apply to your practice.
        </p>
      </div>
    </article>
  );
}

function PatternCard({
  config,
  effect,
  settings,
  visuals,
}: {
  config: EffectConfig;
  effect: string;
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
  effect,
  onImageUpload,
  resetControls,
  settings,
  updateSetting,
  updateVisual,
  visuals,
}: {
  config: EffectConfig;
  effect: EffectId;
  onImageUpload: (file: File | null) => void;
  resetControls: () => void;
  settings: EffectSettings;
  updateSetting: <K extends ControlKey>(key: K, value: EffectSettings[K]) => void;
  updateVisual: <Key extends keyof VisualSettings>(
    key: Key,
    value: VisualSettings[Key],
  ) => void;
  visuals: VisualSettings;
}) {
  return (
    <div className="rounded-lg border border-[#d2dbd1] bg-[#fbfcf8] p-3 shadow-[0_12px_32px_rgba(23,32,29,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#17201d]">Controls</h2>
        <IconButton icon="reset" label="Reset controls" onClick={resetControls} />
      </div>
      {effect === "section-grid" ? null : config.controlMode === "dial" ? (
        <div className="mt-3 grid grid-cols-3 gap-1">
          {config.controls.map((control) => (
            <Dial
              key={control.key}
              label={control.label}
              max={control.max}
              min={control.min}
              onChange={(value) => updateSetting(control.key, value)}
              value={settings[control.key]}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 space-y-3">
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
      )}

      {effect === "practical-demo" ? (
        <div className="mt-4 space-y-4 border-t border-[#e1e7df] pt-4">
          <ControlSection title="Appearance">
            <ColorInput label="Box Color" onChange={(value) => updateSetting("boxColor", value)} value={settings.boxColor ?? "#9d927d"} />
          </ControlSection>
          <ControlSection title="Tile + Image">
            <label className="block text-[11px] font-medium text-[#5c6760]">
              <span className="mb-1 block">Blend Mode</span>
              <select className="h-8 w-full rounded-md border border-[#d7dfd5] bg-white px-2 text-xs text-[#4d5a53]" onChange={(event) => updateSetting("tileBlendMode", event.target.value as TileBlendMode)} value={settings.tileBlendMode ?? "multiply"}>
                {(["normal", "multiply", "screen", "overlay", "soft-light", "difference"] as TileBlendMode[]).map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </label>
            <Slider label="Blend Strength" max={100} min={0} onChange={(value) => updateSetting("blendStrength", value)} value={settings.blendStrength ?? 100} />
          </ControlSection>
          <ControlSection title="Background Image">
            <label className="icon-tool relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#cad4ca] text-[#4b5751] hover:bg-[#eef4ea]" title="Upload image">
              <ToolIcon name="image" />
              <input accept="image/*" className="sr-only" onChange={(event) => onImageUpload(event.target.files?.[0] ?? null)} type="file" />
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(["fill", "tile", "stretch", "crop"] as ImageMode[]).map((mode) => (
                <button aria-pressed={(settings.imageMode ?? "crop") === mode} className={`rounded-md border px-1 py-2 text-[10px] capitalize ${(settings.imageMode ?? "crop") === mode ? "border-[#17201d] bg-[#17201d] text-white" : "border-[#d7dfd5] bg-white text-[#5c6760]"}`} key={mode} onClick={() => updateSetting("imageMode", mode)} title={mode} type="button">{mode}</button>
              ))}
            </div>
            <Slider label="Brightness" max={200} min={0} onChange={(value) => updateSetting("imageBrightness", value)} value={settings.imageBrightness ?? 100} />
            <Slider label="Contrast" max={200} min={0} onChange={(value) => updateSetting("imageContrast", value)} value={settings.imageContrast ?? 100} />
            <Slider label="Saturation" max={200} min={0} onChange={(value) => updateSetting("imageSaturation", value)} value={settings.imageSaturation ?? 100} />
          </ControlSection>
        </div>
      ) : null}

      {effect === "working-knowledge" ? (
        <div className="mt-4 space-y-3 border-t border-[#e1e7df] pt-4">
          <WavePicker
            label="Top Wave"
            onChange={(value) => updateSetting("topWave", value)}
            value={settings.topWave}
          />
          <Slider
            label="Top Amplitude"
            max={100}
            min={0}
            onChange={(value) => updateSetting("topAmplitude", value)}
            value={settings.topAmplitude}
          />
          <Slider
            label="Top Position"
            max={60}
            min={-60}
            onChange={(value) => updateSetting("topPosition", value)}
            value={settings.topPosition}
          />
          <Slider
            label="Top Tilt"
            max={20}
            min={-20}
            onChange={(value) => updateSetting("topAngle", value)}
            value={settings.topAngle}
          />
          <Slider
            label="Top Speed"
            max={100}
            min={0}
            onChange={(value) => updateSetting("topSpeed", value)}
            value={settings.topSpeed}
          />
          <WavePicker
            label="Bottom Wave"
            onChange={(value) => updateSetting("bottomWave", value)}
            value={settings.bottomWave}
          />
          <Slider
            label="Bottom Amplitude"
            max={100}
            min={0}
            onChange={(value) => updateSetting("bottomAmplitude", value)}
            value={settings.bottomAmplitude}
          />
          <Slider
            label="Bottom Position"
            max={60}
            min={-60}
            onChange={(value) => updateSetting("bottomPosition", value)}
            value={settings.bottomPosition}
          />
          <Slider
            label="Bottom Tilt"
            max={20}
            min={-20}
            onChange={(value) => updateSetting("bottomAngle", value)}
            value={settings.bottomAngle}
          />
          <Slider
            label="Wave Speed"
            max={100}
            min={0}
            onChange={(value) => updateSetting("speed", value)}
            value={settings.speed}
          />
        </div>
      ) : null}

      {effect === "working-knowledge" ? (
        <div className="mt-4 space-y-4 border-t border-[#e1e7df] pt-4">
          <ControlSection title="Bars + Image">
            <label className="block text-[11px] font-medium text-[#5c6760]">
              <span className="mb-1 block">Blend Mode</span>
              <select className="h-8 w-full rounded-md border border-[#d7dfd5] bg-white px-2 text-xs text-[#4d5a53]" onChange={(event) => updateSetting("tileBlendMode", event.target.value as TileBlendMode)} value={settings.tileBlendMode ?? "multiply"}>
                {(["normal", "multiply", "screen", "overlay", "soft-light", "difference"] as TileBlendMode[]).map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </label>
            <Slider label="Blend Strength" max={100} min={0} onChange={(value) => updateSetting("blendStrength", value)} value={settings.blendStrength ?? 100} />
          </ControlSection>
          <ControlSection title="Background Image">
            <label className="icon-tool relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#cad4ca] text-[#4b5751] hover:bg-[#eef4ea]" title="Upload image">
              <ToolIcon name="image" />
              <input accept="image/*" className="sr-only" onChange={(event) => onImageUpload(event.target.files?.[0] ?? null)} type="file" />
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(["fill", "tile", "stretch", "crop"] as ImageMode[]).map((mode) => (
                <button aria-pressed={(settings.imageMode ?? "crop") === mode} className={`rounded-md border px-1 py-2 text-[10px] capitalize ${(settings.imageMode ?? "crop") === mode ? "border-[#17201d] bg-[#17201d] text-white" : "border-[#d7dfd5] bg-white text-[#5c6760]"}`} key={mode} onClick={() => updateSetting("imageMode", mode)} title={mode} type="button">{mode}</button>
              ))}
            </div>
            <Slider label="Brightness" max={200} min={0} onChange={(value) => updateSetting("imageBrightness", value)} value={settings.imageBrightness ?? 100} />
            <Slider label="Contrast" max={200} min={0} onChange={(value) => updateSetting("imageContrast", value)} value={settings.imageContrast ?? 100} />
            <Slider label="Saturation" max={200} min={0} onChange={(value) => updateSetting("imageSaturation", value)} value={settings.imageSaturation ?? 100} />
          </ControlSection>
        </div>
      ) : null}

      {effect === "section-grid" ? (
        <div className="mt-4 space-y-4">
          <ControlSection title="Structure">
            <Slider label="Columns" max={9} min={3} onChange={(value) => updateSetting("density", value)} value={settings.density} />
            <Slider label="Scale" max={72} min={24} onChange={(value) => updateSetting("scale", value)} value={settings.scale} />
            <Slider label="Gap" max={24} min={0} onChange={(value) => updateSetting("tileGap", value)} value={settings.tileGap} />
          </ControlSection>
          <ControlSection title="Motion">
            <Slider label="Speed" max={9} min={0} onChange={(value) => updateSetting("speed", value)} value={settings.speed} />
            <Slider label="Rhythm" max={100} min={0} onChange={(value) => updateSetting("rhythm", value)} value={settings.rhythm ?? 50} />
            <Slider label="Offset" max={100} min={-100} onChange={(value) => updateSetting("patternOffset", value)} value={settings.patternOffset ?? 0} />
          </ControlSection>
          <ControlSection title="Appearance">
            <div className="grid grid-cols-2 gap-3">
            {([1, 2, 3, 4] as const).map((section) => {
              const key = `sectionColor${section}` as const;
              return (
                <ColorInput
                  key={key}
                  label={`Section ${section}`}
                  onChange={(value) => updateSetting(key, value)}
                  value={settings[key]}
                />
              );
            })}
            </div>
            <Slider label="Radius" max={24} min={0} onChange={(value) => updateSetting("tileRadius", value)} value={settings.tileRadius ?? 0} />
            <Slider label="Fill" max={100} min={0} onChange={(value) => updateSetting("fillOpacity", value)} value={settings.fillOpacity ?? 100} />
            <Slider label="Stroke" max={8} min={0} onChange={(value) => updateSetting("strokeWidth", value)} value={settings.strokeWidth ?? 0} />
            <ColorInput label="Stroke Color" onChange={(value) => updateSetting("strokeColor", value)} value={settings.strokeColor ?? "#ffffff"} />
          </ControlSection>
        </div>
      ) : null}

      {effect === "practical-demo" || effect === "working-knowledge" || effect === "section-grid" ? null : (
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
      )}
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

function WavePicker({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: WaveStyleId) => void;
  value: WaveStyleId;
}) {
  return (
    <ControlGroup label={label}>
      <div className="grid grid-cols-5 gap-2">
        {(Object.keys(waveStyleLabels) as WaveStyleId[]).map((id) => (
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
            {waveStyleLabels[id]}
          </button>
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

function ControlSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-4 border-t border-[#dfe5dd] pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-semibold uppercase text-[#7a857d]">{title}</h3>
      {children}
    </section>
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

function Dial({
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
  const percent = ((value - min) / (max - min)) * 100;
  const angle = -135 + percent * 2.7;

  return (
    <label className="block text-center">
      <span
        className="relative mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#d9dfd6] bg-[#fffdf8] shadow-inner"
        style={{
          background: `conic-gradient(#17201d ${percent}%, #e5ece3 0)`,
        }}
      >
        <span className="absolute h-[42px] w-[42px] rounded-full bg-[#fffdf8]" />
        <span
          className="absolute h-[17px] w-[2px] origin-bottom rounded-full bg-[#17201d]"
          style={{ transform: `translateY(-8px) rotate(${angle}deg)` }}
        />
        <span className="relative mt-5 text-[10px] font-semibold text-[#4d5a53]">
          {value}
        </span>
        <input
          aria-label={label}
          className="dial-input absolute inset-0"
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.target.value))}
          type="range"
          value={value}
        />
      </span>
      <span className="mt-1 block truncate text-[10px] font-medium text-[#657068]" title={label}>
        {label}
      </span>
    </label>
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
      <span className="mb-0 flex items-center justify-between text-[11px] font-medium text-[#5c6760]">
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

function ColorInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="flex items-center justify-between rounded-md border border-[#d7dfd5] bg-white px-3 py-2 text-sm font-semibold text-[#4d5a53]">
      <span>{label}</span>
      <input
        aria-label={label}
        className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
        onChange={(event) => onChange(event.target.value)}
        type="color"
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

function buildPracticalRows(settings: EffectSettings) {
  const size = settings.scale;
  const gap = settings.tileGap;
  const step = size + gap;
  const columns = Math.max(settings.density, Math.ceil(318 / step) + 2);
  const rows = Math.max(
    Math.max(12, Math.min(20, Math.round(settings.density * 0.85))),
    Math.ceil(166 / step) + 1,
  );
  const startX = 6;
  const startY = 0;
  const palette = [settings.boxColor ?? "#9d927d"];

  return Array.from({ length: rows }, (_, row) => {
    const rowSeed = tileNoise(row, settings.speed, settings.variation);
    // Step Speed is a real time control. At zero, Infinity keeps the row
    // permanently at its current step instead of allowing it to move.
    const duration =
      settings.speed === 0
        ? Number.POSITIVE_INFINITY
        : (1.1 + rowSeed * 1.9) / (settings.speed / 5);
    const offset = tileNoise(row + 9, settings.density, settings.scale) * step;

    return {
      delay: settings.speed === 0 ? 0 : -(rowSeed * duration),
      duration,
      id: `practical-row-${row}`,
      step,
      tiles: Array.from({ length: columns + 2 }, (_, column) => {
        const x = startX + (column - 1) * step + offset;
        const y = startY + row * step;
        const paletteIndex = (column * 5 + row * 7) % palette.length;
        return {
          color: palette[paletteIndex],
          key: `${row}-${column}`,
          phase: tileNoise(column + row * 17, row + settings.variation, settings.scale),
          size,
          step,
          x,
          y,
        };
      }),
    };
  });
}

function tileNoise(x: number, y: number, seed: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 0.21) * 43758.5453;
  return value - Math.floor(value);
}

function practicalTileOpacity(
  tile: { phase: number },
  time: number,
  settings: EffectSettings,
) {
  if (settings.flickerSpeed === 0) {
    return 0.72 * ((settings.blendStrength ?? 100) / 100);
  }

  const cycle = (1.2 + tile.phase * 0.9) / (settings.flickerSpeed / 50);
  const phase = ((time / cycle + tile.phase) % 1 + 1) % 1;
  const attack = Math.max(0.15, settings.attack / 35);
  const release = Math.max(0.15, settings.release / 35);
  const envelope =
    phase < 0.5
      ? Math.pow(phase * 2, attack)
      : Math.pow((1 - phase) * 2, release);
  const glow = settings.glow / 100;

  return (0.04 + envelope * (0.5 + glow * 0.46)) * ((settings.blendStrength ?? 100) / 100);
}

function practicalImageStyle(image: string, settings: EffectSettings): CSSProperties {
  const mode = settings.imageMode ?? "crop";
  const backgrounds: Record<ImageMode, Pick<CSSProperties, "backgroundPosition" | "backgroundRepeat" | "backgroundSize">> = {
    fill: { backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "contain" },
    tile: { backgroundPosition: "left top", backgroundRepeat: "repeat", backgroundSize: "96px auto" },
    stretch: { backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" },
    crop: { backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" },
  };

  return {
    backgroundImage: `url(${image})`,
    filter: `brightness(${settings.imageBrightness ?? 100}%) contrast(${settings.imageContrast ?? 100}%) saturate(${settings.imageSaturation ?? 100}%)`,
    ...backgrounds[mode],
  };
}

function buildWorkingKnowledgeBars(settings: EffectSettings, time: number) {
  const count = settings.density;
  const gap = 312 / Math.max(count - 1, 1);
  const topBase = 18 + settings.topPosition;
  const bottomBase = 166 + settings.bottomPosition;
  // Each speed is a true time multiplier. A value of zero produces a frozen
  // wave instead of leaving a hidden base speed or phase offset behind.
  const topPhase = time * (settings.topSpeed / 100) * 0.9;
  const bottomPhase = time * (settings.speed / 100) * 0.9;
  // Amplitude must be allowed to reach exactly zero so the wave becomes flat.
  const topAmp = settings.topAmplitude * 0.28;
  const bottomAmp = settings.bottomAmplitude * 0.28;
  // The centered tilt controls shear each wave across the bar field:
  // negative tilts clockwise, positive tilts anti-clockwise.
  const topSkew = settings.topAngle / 20;
  const bottomSkew = settings.bottomAngle / 20;

  return Array.from({ length: count }, (_, index) => {
    const progress = count <= 1 ? 0 : index / (count - 1);
    const topWave = evaluateWave(settings.topWave, progress + topPhase, 0.35);
    const bottomWave = evaluateWave(settings.bottomWave, progress + bottomPhase, 2.1);
    const tiltX = (progress - 0.5) * 72;
    // Tilt describes the slope of the wave, so it scales with amplitude too.
    // This keeps an amplitude of zero visibly flat instead of leaving a
    // slanted residual line behind.
    const topY = topBase + topWave * topAmp + tiltX * topSkew * 0.8 * (topAmp / 28);
    const bottomY = bottomBase - bottomWave * bottomAmp + tiltX * bottomSkew * 0.8 * (bottomAmp / 28);
    const inset = 2 + Math.sin(progress * Math.PI * 2) * 0.8;
    const fullHeight = index % 2 === 0;

    return {
      id: `wave-${index}`,
      x: index * gap,
      y1: fullHeight ? 0 : Math.min(topY, bottomY - 10) + inset,
      y2: fullHeight ? 192 : Math.max(bottomY, topY + 10) - inset,
    };
  });
}

function evaluateWave(style: WaveStyleId, phase: number, seed: number) {
  const angle = phase * Math.PI * 2 + seed;
  const sine = Math.sin(angle) * 0.5 + 0.5;

  if (style === "triangle") {
    return 1 - Math.abs(((phase % 1) * 2) - 1);
  }

  if (style === "square") {
    return sine > 0.5 ? 1 : 0.1;
  }

  if (style === "saw") {
    return phase % 1;
  }

  if (style === "pulse") {
    return Math.max(0, 1 - Math.abs(Math.sin(angle * 2)) * 1.5);
  }

  return sine;
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
