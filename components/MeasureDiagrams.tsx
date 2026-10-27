import type { MeasurementGroup } from "@/lib/products";

/**
 * Line drawings for the custom-size step: a straight kameez and a straight trouser, each with its
 * finished measurements marked as dimension lines. Labels inherit the page font and are kept to one
 * word so they stay legible at the 180px the drawing gets beside its inputs.
 */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const dim = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, markerStart: "url(#m-a)", markerEnd: "url(#m-b)" } as const;
// Labels get a white halo (paint-order) so they stay readable where they cross a seam.
const text = { fontSize: 11, fontWeight: 500, letterSpacing: 0.8, textAnchor: "middle", fill: "currentColor", className: "[paint-order:stroke] stroke-white stroke-[6px]" } as const;

function Markers() {
  return (
    <defs>
      <marker id="m-a" viewBox="0 0 8 8" refX="1" refY="4" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M8 0 0 4 8 8" fill="none" stroke="currentColor" strokeWidth="1" />
      </marker>
      <marker id="m-b" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 8 4 0 8" fill="none" stroke="currentColor" strokeWidth="1" />
      </marker>
    </defs>
  );
}

/** A horizontal dimension line with its label sitting on a white gap in the middle. */
function Width({ y, x1, x2, label }: { y: number; x1: number; x2: number; label: string }) {
  const mid = (x1 + x2) / 2;
  const half = label.length * 3.6 + 4;
  return (
    <g>
      <line x1={x1} x2={mid - half} y1={y} y2={y} {...dim} markerEnd={undefined} />
      <line x1={mid + half} x2={x2} y1={y} y2={y} {...dim} markerStart={undefined} />
      <text x={mid} y={y + 4} {...text}>
        {label}
      </text>
    </g>
  );
}

export function KameezDiagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 460" role="img" aria-label="Kameez with its measurements marked" {...props}>
      <Markers />
      {/* Body */}
      <path d="M90 40 C110 58 190 58 210 40 L212 44 C204 70 200 100 220 124 L242 428 C180 446 120 446 58 428 L80 124 C100 100 96 70 88 44 Z" {...stroke} />
      {/* Neckline */}
      <path d="M118 34 C128 66 172 66 182 34" {...stroke} />
      {/* Sleeves */}
      <path d="M88 44 L34 196 L58 212 L80 124" {...stroke} />
      <path d="M212 44 L266 196 L242 212 L220 124" {...stroke} />
      {/* Widths */}
      <Width y={24} x1={90} x2={210} label="SHOULDER" />
      <Width y={128} x1={82} x2={218} label="BUST" />
      <Width y={196} x1={74} x2={226} label="WAIST" />
      <Width y={270} x1={68} x2={232} label="HIP" />
      <Width y={416} x1={60} x2={240} label="DAMAN" />
      {/* Front length */}
      <line x1={284} x2={284} y1={40} y2={428} {...dim} />
      <text x={284} y={240} {...text} transform="rotate(90 284 240)">
        FRONT LENGTH
      </text>
      {/* Sleeve length, along the left sleeve */}
      <line x1={72} x2={20} y1={36} y2={184} {...dim} />
      <text x={46} y={110} {...text} transform="rotate(-70.5 46 110)">
        SLEEVE
      </text>
      {/* Cuff */}
      <line x1={30} x2={56} y1={206} y2={222} {...dim} />
      <text x={34} y={240} {...text} textAnchor="start">
        CUFF
      </text>
      {/* Arm hole, right side */}
      <line x1={232} x2={232} y1={48} y2={118} {...dim} />
      <text x={232} y={83} {...text} transform="rotate(90 232 83)">
        ARM HOLE
      </text>
    </svg>
  );
}

export function TrouserDiagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 460" role="img" aria-label="Trouser with its measurements marked" {...props}>
      <Markers />
      {/* Waistband */}
      <path d="M90 40 C130 48 170 48 210 40 L210 56 C170 64 130 64 90 56 Z" {...stroke} />
      {/* Legs */}
      <path d="M90 56 C78 100 68 140 68 160 L82 430 L140 430 L150 150 L160 430 L218 430 L232 160 C232 140 222 100 210 56" {...stroke} />
      {/* Widths */}
      <Width y={26} x1={90} x2={210} label="WAIST" />
      <Width y={158} x1={68} x2={232} label="HIP" />
      <Width y={215} x1={153} x2={228} label="THIGH" />
      <Width y={310} x1={156} x2={224} label="KNEE" />
      <Width y={446} x1={160} x2={218} label="BOTTOM" />
      {/* Length */}
      <line x1={40} x2={40} y1={40} y2={430} {...dim} />
      <text x={40} y={240} {...text} transform="rotate(90 40 240)">
        LENGTH
      </text>
      {/* Rise */}
      <line x1={112} x2={112} y1={62} y2={150} {...dim} />
      <text x={112} y={106} {...text} transform="rotate(90 112 106)">
        RISE
      </text>
    </svg>
  );
}

export const diagrams: Record<MeasurementGroup, typeof KameezDiagram> = { top: KameezDiagram, bottom: TrouserDiagram };
