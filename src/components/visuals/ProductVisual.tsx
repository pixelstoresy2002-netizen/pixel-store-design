import React from 'react';

interface ProductVisualProps {
  visualKey: string;
  alt: string;
  className?: string;
}

/**
 * Determines which of the 5 gallery studio angles (1..5) a visualKey represents.
 */
export function resolveVisualAngleIndex(visualKey: string): 1 | 2 | 3 | 4 | 5 {
  const key = (visualKey || '')
    .toLowerCase()
    .trim()
    .replace(/\.(svg|png|webp|jpg|jpeg)$/i, '');
  if (key.endsWith('-kit') || key.endsWith('-view5') || key.endsWith('-5')) {
    return 5;
  }
  if (
    key.endsWith('-top') ||
    key.endsWith('-profile') ||
    key.endsWith('-grip') ||
    key.endsWith('-acoustic') ||
    key.endsWith('-pcb') ||
    key.endsWith('-view4') ||
    key.endsWith('-4')
  ) {
    return 4;
  }
  if (
    key.endsWith('-cooling') ||
    key.endsWith('-keycaps') ||
    key.endsWith('-sensor') ||
    key.endsWith('-driver') ||
    key.endsWith('-view3') ||
    key.endsWith('-3') ||
    (key.includes('laptop') && key.endsWith('-ports'))
  ) {
    return 3;
  }
  if (
    key.endsWith('-side') ||
    key.endsWith('-angle') ||
    key.endsWith('-back') ||
    key.endsWith('-lid') ||
    key.endsWith('-switches') ||
    key.endsWith('-dial') ||
    key.endsWith('-wheel') ||
    key.endsWith('-bottom') ||
    key.endsWith('-mic') ||
    key.endsWith('-cable') ||
    key.endsWith('-case') ||
    key.endsWith('-backplate') ||
    key.endsWith('-chip') ||
    key.endsWith('-io') ||
    key.endsWith('-rgb') ||
    key.endsWith('-installed') ||
    key.endsWith('-cables') ||
    key.endsWith('-interior') ||
    key.endsWith('-ports') ||
    key.endsWith('-view2') ||
    key.endsWith('-2')
  ) {
    return 2;
  }
  return 1;
}

/**
 * Studio-grade hardware SVG illustrations and local asset renderer for Pixel Store products, categories, and services.
 * Supports up to 5 distinct representative gallery angles per product/service family.
 */
export const ProductVisual: React.FC<ProductVisualProps> = ({
  visualKey,
  alt,
  className = '',
}) => {
  const key = (visualKey || '').toLowerCase();
  const angleIndex = resolveVisualAngleIndex(key);
  const isSecondary = angleIndex === 2;

  // Support external/local raster & SVG image paths (/assets/services/*, /assets/aistudio/*, etc.)
  if (
    key.startsWith('http://') ||
    key.startsWith('https://') ||
    key.startsWith('/assets/')
  ) {
    const isServiceAsset = key.startsWith('/assets/services/');
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-gradient-to-b from-[#FAF9FC] to-[#ECEAF2] ${className}`}
        data-visual-key={visualKey}
        data-angle-index={angleIndex}
      >
        <img
          src={visualKey}
          alt={alt}
          loading={isServiceAsset ? 'eager' : 'lazy'}
          className={
            isServiceAsset
              ? 'w-full h-full object-cover'
              : 'w-full h-full object-contain p-2'
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-gradient-to-b from-[#FAF9FC] to-[#ECEAF2] ${className}`}
      role="img"
      aria-label={alt}
      data-visual-key={visualKey}
      data-angle-index={angleIndex}
    >
      {/* Subtle studio floor reflection */}
      <div className="absolute inset-x-6 bottom-3 h-3 rounded-full bg-black/6 blur-md pointer-events-none" />

      {/* 1. LAPTOPS */}
      {(key.includes('laptop') ||
        key.includes('cat-laptops') ||
        key.includes('sub-new-laptops') ||
        key.includes('sub-used-laptops')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          <defs>
            <linearGradient id="scrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={
                  key.includes('rog')
                    ? '#8E4DEB'
                    : key.includes('thinkpad')
                    ? '#1F2937'
                    : '#2563EB'
                }
              />
              <stop
                offset="55%"
                stopColor={
                  key.includes('rog')
                    ? '#D66C9D'
                    : key.includes('thinkpad')
                    ? '#111827'
                    : '#7C3AED'
                }
              />
              <stop
                offset="100%"
                stopColor={key.includes('rog') ? '#EF875D' : '#0F172A'}
              />
            </linearGradient>
            <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#262936" />
              <stop offset="50%" stopColor="#3B3F52" />
              <stop offset="100%" stopColor="#1D1F2B" />
            </linearGradient>
          </defs>

          {angleIndex === 1 && (
            <g>
              {/* Angle 1: Open Front Studio View */}
              <rect
                x="44"
                y="24"
                width="172"
                height="108"
                rx="6"
                fill="#14161F"
                stroke="#2E3244"
                strokeWidth="2.5"
              />
              <rect
                x="50"
                y="30"
                width="160"
                height="94"
                rx="3"
                fill="url(#scrGrad)"
              />
              <polygon
                points="75,124 135,45 195,124"
                fill="rgba(255,255,255,0.12)"
              />
              <circle cx="165" cy="64" r="18" fill="rgba(239,135,93,0.28)" />
              <rect
                x="60"
                y="40"
                width="46"
                height="6"
                rx="2"
                fill="rgba(255,255,255,0.65)"
              />
              <rect
                x="60"
                y="50"
                width="28"
                height="4"
                rx="1.5"
                fill="rgba(255,255,255,0.35)"
              />
              <polygon
                points="24,154 44,132 216,132 236,154"
                fill="url(#chassisGrad)"
                stroke="#454A60"
                strokeWidth="1.5"
              />
              <polygon
                points="48,146 56,136 204,136 212,146"
                fill="#181A24"
              />
              {key.includes('rog') || key.includes('loq') ? (
                <line
                  x1="46"
                  y1="155"
                  x2="214"
                  y2="155"
                  stroke="#8E4DEB"
                  strokeWidth="2.5"
                />
              ) : null}
              <rect
                x="24"
                y="153"
                width="212"
                height="6"
                rx="3"
                fill="#181A24"
              />
              <polygon
                points="112,152 115,147 145,147 148,152"
                fill="#2D3142"
              />
            </g>
          )}

          {angleIndex === 2 && (
            <g>
              {/* Angle 2: Angled / Side Profile Studio View */}
              <polygon
                points="62,22 196,36 184,134 50,120"
                fill="#161822"
                stroke="#34384B"
                strokeWidth="2.5"
              />
              <polygon
                points="68,28 190,41 179,127 56,114"
                fill="url(#scrGrad)"
              />
              <line
                x1="80"
                y1="32"
                x2="165"
                y2="122"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="3"
              />
              <polygon
                points="50,120 184,134 226,156 92,144"
                fill="url(#chassisGrad)"
                stroke="#494E66"
                strokeWidth="2"
              />
              <rect x="64" y="127" width="12" height="3" rx="1" fill="#8E4DEB" />
              <rect x="82" y="129" width="8" height="3" rx="1" fill="#EF875D" />
              <rect x="96" y="131" width="16" height="3" rx="1" fill="#111318" />
            </g>
          )}

          {angleIndex === 3 && (
            <g>
              {/* Angle 3: Side I/O Ports & Connectivity Close-up */}
              <rect
                x="22"
                y="66"
                width="216"
                height="48"
                rx="8"
                fill="#181B26"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              {/* Exhaust Fin Array */}
              {[0, 1, 2, 3, 4, 5].map((fin) => (
                <rect
                  key={fin}
                  x={34 + fin * 10}
                  y="76"
                  width="6"
                  height="28"
                  rx="1.5"
                  fill="#2D3246"
                />
              ))}
              {/* RJ45 / HDMI 2.1 / Dual USB-C Thunderbolt / USB-A */}
              <rect
                x="104"
                y="80"
                width="22"
                height="16"
                rx="2"
                fill="#111318"
                stroke="#EF875D"
                strokeWidth="1.5"
              />
              <rect
                x="134"
                y="84"
                width="16"
                height="8"
                rx="4"
                fill="#111318"
                stroke="#8E4DEB"
                strokeWidth="1.5"
              />
              <rect
                x="156"
                y="84"
                width="16"
                height="8"
                rx="4"
                fill="#111318"
                stroke="#D66C9D"
                strokeWidth="1.5"
              />
              <rect
                x="180"
                y="81"
                width="22"
                height="12"
                rx="2"
                fill="#111318"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              <circle cx="216" cy="87" r="5" fill="#111318" stroke="#94A3B8" strokeWidth="1.5" />
              <text
                x="130"
                y="138"
                textAnchor="middle"
                fill="#111318"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                HDMI 2.1 · THUNDERBOLT 4 · USB-A 3.2
              </text>
            </g>
          )}

          {angleIndex === 4 && (
            <g>
              {/* Angle 4: Dual-Fan Vapor Chamber / Heatpipe Thermal Architecture */}
              <rect
                x="38"
                y="26"
                width="184"
                height="136"
                rx="10"
                fill="#141722"
                stroke="#374151"
                strokeWidth="2.5"
              />
              {/* Dual Turbine Cooling Fans */}
              <circle
                cx="86"
                cy="78"
                r="30"
                fill="#0D0F17"
                stroke="#38BDF8"
                strokeWidth="2"
              />
              <circle cx="86" cy="78" r="10" fill="#1E293B" />
              <circle
                cx="174"
                cy="78"
                r="30"
                fill="#0D0F17"
                stroke="#8E4DEB"
                strokeWidth="2"
              />
              <circle cx="174" cy="78" r="10" fill="#1E293B" />
              {/* Copper Heatpipes */}
              <path
                d="M72 48 L188 48 M86 112 L174 112 M116 78 L144 78"
                stroke="#EF875D"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <rect
                x="62"
                y="128"
                width="136"
                height="20"
                rx="4"
                fill="#1F2433"
                stroke="#8E4DEB"
                strokeWidth="1"
              />
              <text
                x="130"
                y="141"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="700"
                fontSize="9.5"
                fontFamily="monospace"
              >
                DUAL-ARC FLOW THERMAL ARCHITECTURE
              </text>
            </g>
          )}

          {angleIndex === 5 && (
            <g>
              {/* Angle 5: Complete Studio Package (Closed Lid + Power Brick + Spec Card) */}
              <rect
                x="34"
                y="34"
                width="134"
                height="96"
                rx="7"
                fill="#181A24"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <line
                x1="46"
                y1="118"
                x2="154"
                y2="46"
                stroke="#D66C9D"
                strokeWidth="2.5"
                strokeOpacity="0.7"
              />
              <circle cx="101" cy="82" r="14" fill="#25293A" stroke="#EF875D" strokeWidth="2" />
              {/* GaN Power Adapter */}
              <rect
                x="180"
                y="54"
                width="48"
                height="76"
                rx="6"
                fill="#111318"
                stroke="#475569"
                strokeWidth="2"
              />
              <text
                x="204"
                y="94"
                textAnchor="middle"
                fill="#EF875D"
                fontWeight="700"
                fontSize="9.5"
                fontFamily="monospace"
              >
                AC PD
              </text>
              <rect
                x="34"
                y="140"
                width="194"
                height="20"
                rx="4"
                fill="#111318"
              />
              <text
                x="131"
                y="153"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="700"
                fontSize="9.5"
                fontFamily="monospace"
              >
                COMPLETE RETAIL BUNDLE · VERIFIED
              </text>
            </g>
          )}
        </svg>
      )}

      {/* 2. KEYBOARDS */}
      {(key.includes('kb-') ||
        key.includes('keyboard') ||
        key.includes('cat-accessories')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {angleIndex === 1 && (
            <g>
              <rect
                x="28"
                y="54"
                width="204"
                height="82"
                rx={key.includes('pebble') ? '16' : '8'}
                fill={
                  key.includes('mxkeys') || key.includes('pebble')
                    ? '#2B2E3B'
                    : '#161822'
                }
                stroke={
                  key.includes('fizz') || key.includes('huntsman')
                    ? '#8E4DEB'
                    : '#43485E'
                }
                strokeWidth="2.5"
              />
              {(key.includes('fizz') ||
                key.includes('huntsman') ||
                key.includes('sub-keyboards')) && (
                <rect
                  x="33"
                  y="59"
                  width="194"
                  height="72"
                  rx="5"
                  fill="none"
                  stroke="#D66C9D"
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
              )}
              {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 11 }).map((__, col) => {
                  const isAccentKey =
                    (row === 0 && col === 0) ||
                    (row === 2 && col === 10) ||
                    (row === 3 && col >= 3 && col <= 6);
                  const fill = isAccentKey
                    ? key.includes('mxkeys') || key.includes('pebble')
                      ? '#4B5066'
                      : '#8E4DEB'
                    : key.includes('fizz') && col > 1 && col < 9
                    ? '#F4F3F7'
                    : '#252836';
                  return (
                    <rect
                      key={`${row}-${col}`}
                      x={38 + col * 16.5}
                      y={64 + row * 16}
                      width="13.5"
                      height="12.5"
                      rx={key.includes('pebble') ? '6' : '2.5'}
                      fill={fill}
                    />
                  );
                })
              )}
            </g>
          )}

          {angleIndex === 2 && (
            <g>
              <polygon
                points="30,118 215,78 232,115 48,152"
                fill="#181A24"
                stroke="#8E4DEB"
                strokeWidth="2"
              />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g
                  key={i}
                  transform={`translate(${48 + i * 28}, ${105 - i * 6})`}
                >
                  <rect x="6" y="6" width="10" height="7" fill="#EF875D" />
                  <polygon
                    points="0,6 4,-6 20,-6 24,6"
                    fill={i === 0 ? '#8E4DEB' : '#2D3245'}
                    stroke="#D66C9D"
                    strokeWidth="0.8"
                  />
                </g>
              ))}
              <circle
                cx="195"
                cy="54"
                r="22"
                fill="#161822"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <text
                x="195"
                y="58"
                textAnchor="middle"
                fill="#F4F3F7"
                fontSize="9"
                fontFamily="monospace"
              >
                SWITCHES
              </text>
            </g>
          )}

          {angleIndex === 3 && (
            <g>
              {/* Angle 3: Double-Shot PBT Keycap & Switch Cross-Section */}
              <rect
                x="44"
                y="34"
                width="76"
                height="76"
                rx="12"
                fill="#181B26"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <text
                x="82"
                y="78"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="800"
                fontSize="24"
                fontFamily="monospace"
              >
                ESC
              </text>
              <rect
                x="138"
                y="34"
                width="76"
                height="76"
                rx="12"
                fill="#181B26"
                stroke="#EF875D"
                strokeWidth="2.5"
              />
              {/* Cross stem */}
              <circle
                cx="176"
                cy="72"
                r="18"
                fill="#111318"
                stroke="#D66C9D"
                strokeWidth="2"
              />
              <line
                x1="166"
                y1="72"
                x2="186"
                y2="72"
                stroke="#EF875D"
                strokeWidth="4"
              />
              <line
                x1="176"
                y1="62"
                x2="176"
                y2="82"
                stroke="#EF875D"
                strokeWidth="4"
              />
              <rect
                x="44"
                y="126"
                width="170"
                height="24"
                rx="5"
                fill="#111318"
              />
              <text
                x="129"
                y="142"
                textAnchor="middle"
                fill="#EF875D"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                PBT KEYCAPS & ACTUATION DETAIL
              </text>
            </g>
          )}

          {angleIndex === 4 && (
            <g>
              {/* Angle 4: Acoustic Gasket & Typing Tilt Angle Profile */}
              <polygon
                points="28,124 228,88 232,110 32,142"
                fill="#161924"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <line
                x1="36"
                y1="130"
                x2="224"
                y2="98"
                stroke="#D66C9D"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              {/* Adjustable Kickstand Feet */}
              <polygon points="204,114 222,110 228,136 210,136" fill="#EF875D" />
              <text
                x="130"
                y="58"
                textAnchor="middle"
                fill="#111318"
                fontWeight="700"
                fontSize="11"
                fontFamily="monospace"
              >
                ERGONOMIC 6° / 9° TYPING PROFILE
              </text>
            </g>
          )}

          {angleIndex === 5 && (
            <g>
              {/* Angle 5: Complete Coiled USB-C Cable + Keycap Puller Kit */}
              <rect
                x="28"
                y="40"
                width="154"
                height="66"
                rx="8"
                fill="#181A24"
                stroke="#8E4DEB"
                strokeWidth="2"
              />
              {/* Coiled Aviator USB-C Cable */}
              <path
                d="M192 52 C214 52, 214 66, 192 66 C214 66, 214 80, 192 80 C214 80, 214 94, 192 94"
                fill="none"
                stroke="#EF875D"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <rect
                x="28"
                y="124"
                width="204"
                height="24"
                rx="5"
                fill="#111318"
              />
              <text
                x="130"
                y="140"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="700"
                fontSize="9.5"
                fontFamily="monospace"
              >
                USB-C CABLE & SWITCH PULLER INCLUDED
              </text>
            </g>
          )}
        </svg>
      )}

      {/* 3. MICE */}
      {(key.includes('mouse') || key.includes('sub-mice')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {angleIndex === 1 && (
            <g>
              <rect
                x="92"
                y="24"
                width="76"
                height="140"
                rx="38"
                fill={key.includes('superlight') ? '#F8F8FA' : '#1B1D29'}
                stroke={key.includes('superlight') ? '#D1CFE0' : '#3A3F54'}
                strokeWidth="2.5"
              />
              <line
                x1="130"
                y1="24"
                x2="130"
                y2="82"
                stroke={key.includes('superlight') ? '#B5B2C8' : '#454B66'}
                strokeWidth="2"
              />
              <path
                d="M94 82 Q130 92 166 82"
                fill="none"
                stroke={key.includes('superlight') ? '#B5B2C8' : '#454B66'}
                strokeWidth="2"
              />
              <rect
                x="124"
                y="40"
                width="12"
                height="26"
                rx="6"
                fill={key.includes('mxmaster') ? '#9CA3AF' : '#8E4DEB'}
                stroke="#111318"
                strokeWidth="1.5"
              />
              <circle
                cx="130"
                cy="128"
                r="8"
                fill="none"
                stroke={key.includes('superlight') ? '#8E4DEB' : '#EF875D'}
                strokeWidth="2.5"
              />
            </g>
          )}

          {angleIndex === 2 && (
            <g>
              <path
                d="M44 134 C58 72, 134 56, 206 116 L214 134 Z"
                fill={key.includes('superlight') ? '#F3F2F8' : '#1B1E2B'}
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <rect x="96" y="96" width="22" height="7" rx="3.5" fill="#D66C9D" />
              <rect x="122" y="98" width="18" height="7" rx="3.5" fill="#8E4DEB" />
              <circle cx="172" cy="94" r="9" fill="#EF875D" />
              <line
                x1="42"
                y1="136"
                x2="216"
                y2="136"
                stroke="#8E4DEB"
                strokeWidth="3"
              />
            </g>
          )}

          {angleIndex === 3 && (
            <g>
              {/* Angle 3: Bottom PTFE Glides & Optical Sensor Lens */}
              <rect
                x="92"
                y="22"
                width="76"
                height="142"
                rx="38"
                fill="#141620"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              {/* Virgin PTFE Skates */}
              <path
                d="M104 34 Q130 26 156 34 L152 48 Q130 44 108 48 Z"
                fill="#F8FAFC"
              />
              <path
                d="M104 148 Q130 156 156 148 L152 136 Q130 140 108 136 Z"
                fill="#F8FAFC"
              />
              {/* Optical Sensor Aperture */}
              <rect
                x="118"
                y="80"
                width="24"
                height="28"
                rx="6"
                fill="#0D0F16"
                stroke="#EF875D"
                strokeWidth="2"
              />
              <circle cx="130" cy="94" r="5" fill="#D66C9D" />
            </g>
          )}

          {angleIndex === 4 && (
            <g>
              {/* Angle 4: Front M1/M2 Triggers & USB-C Charging Port */}
              <path
                d="M66 132 C68 68, 192 68, 194 132 Z"
                fill="#181A26"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <line
                x1="130"
                y1="68"
                x2="130"
                y2="132"
                stroke="#475569"
                strokeWidth="2"
              />
              <rect
                x="122"
                y="74"
                width="16"
                height="28"
                rx="8"
                fill="#EF875D"
              />
              <rect
                x="118"
                y="116"
                width="24"
                height="8"
                rx="4"
                fill="#111318"
                stroke="#8E4DEB"
                strokeWidth="1.5"
              />
            </g>
          )}

          {angleIndex === 5 && (
            <g>
              {/* Angle 5: 2.4GHz Wireless Dongle Receiver + Braided Paracord Kit */}
              <rect
                x="56"
                y="34"
                width="64"
                height="118"
                rx="32"
                fill="#1B1D29"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <rect
                x="148"
                y="54"
                width="54"
                height="36"
                rx="6"
                fill="#141620"
                stroke="#EF875D"
                strokeWidth="2"
              />
              <text
                x="175"
                y="76"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="700"
                fontSize="9.5"
                fontFamily="monospace"
              >
                2.4GHz
              </text>
              <rect
                x="148"
                y="102"
                width="54"
                height="24"
                rx="4"
                fill="#8E4DEB"
              />
              <text
                x="175"
                y="117"
                textAnchor="middle"
                fill="#FFFFFF"
                fontWeight="700"
                fontSize="8.5"
                fontFamily="monospace"
              >
                DONGLE KIT
              </text>
            </g>
          )}
        </svg>
      )}

      {/* 4. AUDIO (Headsets, IEM, Earbuds) */}
      {(key.includes('audio') ||
        key.includes('cat-audio') ||
        key.includes('sub-headsets') ||
        key.includes('sub-earbuds') ||
        key.includes('sub-iem')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {angleIndex === 3 ? (
            <g>
              {/* Angle 3: Acoustic Neodymium Driver Cross-Section */}
              <circle
                cx="130"
                cy="88"
                r="52"
                fill="#161924"
                stroke="#8E4DEB"
                strokeWidth="3"
              />
              <circle
                cx="130"
                cy="88"
                r="36"
                fill="#1F2434"
                stroke="#D66C9D"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <circle
                cx="130"
                cy="88"
                r="18"
                fill="#EF875D"
                stroke="#111318"
                strokeWidth="2.5"
              />
              <text
                x="130"
                y="162"
                textAnchor="middle"
                fill="#111318"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                HIGH-DEFINITION ACOUSTIC TRANSDUCER
              </text>
            </g>
          ) : angleIndex === 4 ? (
            <g>
              {/* Angle 4: Memory Foam Cushion & Headband / Shell Ergonomics */}
              <rect
                x="48"
                y="46"
                width="72"
                height="96"
                rx="36"
                fill="#181A24"
                stroke="#8E4DEB"
                strokeWidth="3"
              />
              <rect
                x="62"
                y="62"
                width="44"
                height="64"
                rx="22"
                fill="#262A3A"
              />
              <rect
                x="140"
                y="46"
                width="72"
                height="96"
                rx="36"
                fill="#181A24"
                stroke="#EF875D"
                strokeWidth="3"
              />
              <rect
                x="154"
                y="62"
                width="44"
                height="64"
                rx="22"
                fill="#262A3A"
              />
            </g>
          ) : angleIndex === 5 ? (
            <g>
              {/* Angle 5: Audio Bundle (Carrying Case + USB-C Wireless Transmitter / DAC) */}
              <rect
                x="38"
                y="38"
                width="116"
                height="112"
                rx="20"
                fill="#181A24"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <text
                x="96"
                y="98"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="700"
                fontSize="12"
                fontFamily="monospace"
              >
                PRO CASE
              </text>
              <rect
                x="170"
                y="58"
                width="52"
                height="72"
                rx="8"
                fill="#111318"
                stroke="#EF875D"
                strokeWidth="2"
              />
              <text
                x="196"
                y="98"
                textAnchor="middle"
                fill="#EF875D"
                fontWeight="700"
                fontSize="9.5"
                fontFamily="monospace"
              >
                DAC / USB
              </text>
            </g>
          ) : key.includes('iem') ? (
            <g>
              <path
                d="M68 78 C58 52, 98 42, 114 68 C126 88, 102 124, 78 116 C62 110, 72 92, 68 78 Z"
                fill="#222634"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <path
                d="M148 78 C138 52, 178 42, 194 68 C206 88, 182 124, 158 116 C142 110, 152 92, 148 78 Z"
                fill="#2E3346"
                stroke="#EF875D"
                strokeWidth="2.5"
              />
              <path
                d="M92 48 Q130 16 172 48 M92 118 Q130 165 170 118"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="3"
                strokeDasharray={isSecondary ? '4 2' : undefined}
              />
              <circle cx="92" cy="82" r="8" fill="#D66C9D" />
              <circle cx="172" cy="82" r="8" fill="#8E4DEB" />
            </g>
          ) : key.includes('earbuds') ? (
            <g>
              <rect
                x="78"
                y="64"
                width="104"
                height="84"
                rx="26"
                fill="#181B26"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <line
                x1="78"
                y1="96"
                x2="182"
                y2="96"
                stroke="#363B52"
                strokeWidth="2"
              />
              <rect
                x="116"
                y="106"
                width="28"
                height="5"
                rx="2.5"
                fill="#10B981"
              />
              <circle
                cx="106"
                cy={isSecondary ? '60' : '48'}
                r="15"
                fill="#25293A"
                stroke="#D66C9D"
                strokeWidth="2"
              />
              <circle
                cx="154"
                cy={isSecondary ? '60' : '48'}
                r="15"
                fill="#25293A"
                stroke="#8E4DEB"
                strokeWidth="2"
              />
            </g>
          ) : (
            <g>
              <path
                d="M72 106 A58 58 0 0 1 188 106"
                fill="none"
                stroke="#1F2330"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M78 102 A52 52 0 0 1 182 102"
                fill="none"
                stroke="#8E4DEB"
                strokeWidth="3"
              />
              <rect
                x="54"
                y="88"
                width="32"
                height="58"
                rx="14"
                fill="#181A24"
                stroke="#D66C9D"
                strokeWidth="2.5"
                transform={isSecondary ? 'rotate(-12 70 117)' : undefined}
              />
              <rect
                x="174"
                y="88"
                width="32"
                height="58"
                rx="14"
                fill="#181A24"
                stroke="#8E4DEB"
                strokeWidth="2.5"
                transform={isSecondary ? 'rotate(12 190 117)' : undefined}
              />
              <path
                d="M68 140 Q88 168 126 158"
                fill="none"
                stroke="#EF875D"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                cx="130"
                cy="157"
                r="5"
                fill="#111318"
                stroke="#EF875D"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      )}

      {/* 5. PC COMPONENTS (GPU, CPU, Mobo, RAM, SSD, PSU, Case) */}
      {(key.includes('comp-') ||
        key.includes('cat-components') ||
        key.includes('sub-gpu') ||
        key.includes('sub-cpu') ||
        key.includes('sub-mobo') ||
        key.includes('sub-ram') ||
        key.includes('sub-storage') ||
        key.includes('sub-psu') ||
        key.includes('sub-cases')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {angleIndex === 3 ? (
            <g>
              {/* Angle 3: Nickel-Plated Fin Stack & Thermal Dissipation Detail */}
              <rect
                x="30"
                y="44"
                width="200"
                height="98"
                rx="8"
                fill="#151822"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              {Array.from({ length: 14 }).map((_, i) => (
                <line
                  key={i}
                  x1={44 + i * 13}
                  y1="54"
                  x2={44 + i * 13}
                  y2="132"
                  stroke="#64748B"
                  strokeWidth="3"
                />
              ))}
              <line
                x1="36"
                y1="76"
                x2="224"
                y2="76"
                stroke="#EF875D"
                strokeWidth="5"
              />
              <line
                x1="36"
                y1="108"
                x2="224"
                y2="108"
                stroke="#EF875D"
                strokeWidth="5"
              />
              <text
                x="130"
                y="162"
                textAnchor="middle"
                fill="#111318"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                HIGH-DENSITY THERMAL HEATSINK ARRAY
              </text>
            </g>
          ) : angleIndex === 4 ? (
            <g>
              {/* Angle 4: Multi-Layer Black PCB & Gold Contact Architecture */}
              <rect
                x="36"
                y="36"
                width="188"
                height="116"
                rx="6"
                fill="#111318"
                stroke="#D66C9D"
                strokeWidth="2.5"
              />
              <rect
                x="96"
                y="62"
                width="68"
                height="64"
                rx="6"
                fill="#1E293B"
                stroke="#8E4DEB"
                strokeWidth="2"
              />
              {[0, 1, 2, 3].map((vrm) => (
                <rect
                  key={vrm}
                  x="52"
                  y={52 + vrm * 22}
                  width="26"
                  height="14"
                  rx="2"
                  fill="#374151"
                />
              ))}
              {[0, 1, 2, 3].map((vrm) => (
                <rect
                  key={vrm}
                  x="182"
                  y={52 + vrm * 22}
                  width="26"
                  height="14"
                  rx="2"
                  fill="#374151"
                />
              ))}
              <rect x="64" y="152" width="132" height="6" fill="#F59E0B" />
            </g>
          ) : angleIndex === 5 ? (
            <g>
              {/* Angle 5: Retail Box & Factory Sealed Spec Badge */}
              <rect
                x="44"
                y="26"
                width="172"
                height="136"
                rx="8"
                fill="#161822"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <polygon points="44,26 144,26 108,162 44,162" fill="#1E2231" />
              <rect
                x="62"
                y="50"
                width="136"
                height="48"
                rx="4"
                fill="#111318"
                stroke="#EF875D"
                strokeWidth="1.5"
              />
              <text
                x="130"
                y="79"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="800"
                fontSize="13"
                fontFamily="monospace"
              >
                PIXEL HARDWARE
              </text>
              <text
                x="130"
                y="128"
                textAnchor="middle"
                fill="#EF875D"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                RETAIL BOX & ACCESSORIES
              </text>
            </g>
          ) : key.includes('cpu') ? (
            <g>
              <rect
                x="66"
                y="32"
                width="128"
                height="126"
                rx="12"
                fill="#1A1D28"
                stroke="#EF875D"
                strokeWidth="2.5"
              />
              <rect
                x="86"
                y="52"
                width="88"
                height="86"
                rx="8"
                fill="#9CA3AF"
                stroke="#374151"
                strokeWidth="2"
              />
              <rect x="98" y="64" width="64" height="62" rx="4" fill="#D1D5DB" />
              <text
                x="130"
                y="92"
                textAnchor="middle"
                fill="#111318"
                fontWeight="700"
                fontSize="13"
                fontFamily="monospace"
              >
                RYZEN 7
              </text>
              <text
                x="130"
                y="108"
                textAnchor="middle"
                fill="#8E4DEB"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                {isSecondary ? '96MB 3D V-CACHE' : '7800X3D'}
              </text>
            </g>
          ) : key.includes('ram') ? (
            <g>
              {[0, 1].map((idx) => (
                <g key={idx} transform={`translate(0, ${idx * 46})`}>
                  <rect
                    x="34"
                    y="42"
                    width="192"
                    height="10"
                    rx="3"
                    fill={
                      isSecondary
                        ? idx === 0
                          ? '#EF875D'
                          : '#8E4DEB'
                        : idx === 0
                        ? '#8E4DEB'
                        : '#D66C9D'
                    }
                  />
                  <rect
                    x="34"
                    y="50"
                    width="192"
                    height="28"
                    rx="3"
                    fill="#171923"
                    stroke="#4B5563"
                    strokeWidth="1.5"
                  />
                  <text
                    x="130"
                    y="68"
                    textAnchor="middle"
                    fill="#F4F3F7"
                    fontWeight="700"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    FURY DDR5 6000 CL30
                  </text>
                  <rect x="44" y="78" width="172" height="5" fill="#F59E0B" />
                </g>
              ))}
            </g>
          ) : key.includes('ssd') || key.includes('storage') ? (
            <g>
              <rect
                x="28"
                y="70"
                width="204"
                height="52"
                rx="5"
                fill="#14161E"
                stroke="#8E4DEB"
                strokeWidth="2"
              />
              <rect x="38" y="77" width="166" height="38" rx="2" fill="#1F2433" />
              <text
                x="120"
                y="98"
                textAnchor="middle"
                fill="#F4F3F7"
                fontWeight="700"
                fontSize="13"
                fontFamily="monospace"
              >
                KC3000 PCIe 4.0 NVMe M.2
              </text>
              <text
                x="120"
                y="110"
                textAnchor="middle"
                fill="#EF875D"
                fontWeight="700"
                fontSize="9"
                fontFamily="monospace"
              >
                {isSecondary ? 'GRAPHENE HEATSINK' : '7000 MB/s READ · 1TB'}
              </text>
              <rect x="224" y="78" width="8" height="36" fill="#F59E0B" />
            </g>
          ) : key.includes('psu') ? (
            <g>
              <rect
                x="46"
                y="36"
                width="168"
                height="118"
                rx="8"
                fill="#171922"
                stroke="#4B5563"
                strokeWidth="2.5"
              />
              <circle
                cx="106"
                cy="95"
                r="42"
                fill="#111318"
                stroke="#374151"
                strokeWidth="2"
              />
              <circle
                cx="106"
                cy="95"
                r="14"
                fill="#262A38"
                stroke="#EF875D"
                strokeWidth="2"
              />
              <rect x="160" y="54" width="40" height="22" rx="3" fill="#F59E0B" />
              <text
                x="180"
                y="69"
                textAnchor="middle"
                fill="#111318"
                fontWeight="800"
                fontSize="11"
                fontFamily="monospace"
              >
                850W
              </text>
              <text
                x="180"
                y="94"
                textAnchor="middle"
                fill="#F4F3F7"
                fontWeight="700"
                fontSize="9"
                fontFamily="monospace"
              >
                {isSecondary ? '16-PIN GEN5' : 'ATX 3.0'}
              </text>
              <text
                x="180"
                y="108"
                textAnchor="middle"
                fill="#F59E0B"
                fontWeight="700"
                fontSize="9"
                fontFamily="monospace"
              >
                80+ GOLD
              </text>
            </g>
          ) : key.includes('mobo') ? (
            <g>
              <rect
                x="56"
                y="20"
                width="148"
                height="150"
                rx="6"
                fill="#161821"
                stroke="#4B5563"
                strokeWidth="2"
              />
              <rect x="64" y="28" width="26" height="58" rx="3" fill="#374151" />
              <rect x="96" y="26" width="54" height="20" rx="3" fill="#374151" />
              <rect
                x="104"
                y="54"
                width="38"
                height="38"
                rx="4"
                fill="#9CA3AF"
                stroke="#8E4DEB"
                strokeWidth="2"
              />
              {[0, 1, 2, 3].map((s) => (
                <rect
                  key={s}
                  x={154 + s * 7}
                  y="48"
                  width="4"
                  height="50"
                  fill={s % 2 === 0 ? '#8E4DEB' : '#374151'}
                />
              ))}
              <rect x="70" y="110" width="96" height="7" rx="2" fill="#D1D5DB" />
              <rect
                x="148"
                y="122"
                width="42"
                height="36"
                rx="4"
                fill="#282C3E"
                stroke="#EF875D"
                strokeWidth="1.5"
              />
            </g>
          ) : key.includes('case') ? (
            <g>
              <rect
                x="68"
                y="20"
                width="124"
                height="150"
                rx="8"
                fill="#F8FAFC"
                stroke="#94A3B8"
                strokeWidth="2.5"
              />
              <rect x="76" y="28" width="108" height="134" rx="4" fill="#0F172A" />
              {[0, 1, 2].map((f) => (
                <circle
                  key={f}
                  cx="158"
                  cy={52 + f * 38}
                  r="15"
                  fill="none"
                  stroke={
                    f === 0 ? '#8E4DEB' : f === 1 ? '#D66C9D' : '#EF875D'
                  }
                  strokeWidth="3"
                />
              ))}
              <rect
                x="86"
                y="96"
                width="56"
                height="18"
                rx="3"
                fill="#334155"
                stroke="#8E4DEB"
                strokeWidth="1.5"
              />
              <circle
                cx="112"
                cy="64"
                r="14"
                fill="#1E293B"
                stroke="#EF875D"
                strokeWidth="2.5"
              />
            </g>
          ) : (
            <g>
              <rect
                x="28"
                y="48"
                width="204"
                height="94"
                rx="10"
                fill="#161822"
                stroke="#374151"
                strokeWidth="2.5"
              />
              <polygon points="36,54 110,54 96,136 36,136" fill="#1F2332" />
              <line
                x1="28"
                y1="48"
                x2="232"
                y2="48"
                stroke="#8E4DEB"
                strokeWidth="3.5"
              />
              {!isSecondary ? (
                <>
                  <circle
                    cx="86"
                    cy="95"
                    r="34"
                    fill="#0F1118"
                    stroke="#8E4DEB"
                    strokeWidth="2"
                  />
                  <circle cx="86" cy="95" r="11" fill="#25293A" />
                  <circle
                    cx="174"
                    cy="95"
                    r="34"
                    fill="#0F1118"
                    stroke="#D66C9D"
                    strokeWidth="2"
                  />
                  <circle cx="174" cy="95" r="11" fill="#25293A" />
                </>
              ) : (
                <>
                  <rect
                    x="42"
                    y="62"
                    width="90"
                    height="66"
                    rx="4"
                    fill="#25293A"
                  />
                  <text
                    x="87"
                    y="98"
                    textAnchor="middle"
                    fill="#F4F3F7"
                    fontWeight="700"
                    fontSize="13"
                    fontFamily="monospace"
                  >
                    GEFORCE RTX
                  </text>
                  <rect
                    x="144"
                    y="64"
                    width="72"
                    height="62"
                    rx="6"
                    fill="#0D0F16"
                    stroke="#8E4DEB"
                    strokeWidth="1.5"
                  />
                </>
              )}
            </g>
          )}
        </svg>
      )}

      {/* 6. CUSTOM PC BUILDS & CHARGERS */}
      {(key.includes('build') ||
        key.includes('cat-builds') ||
        key.includes('charger') ||
        key.includes('sub-chargers') ||
        key.includes('acc-')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {angleIndex === 3 ? (
            <g>
              {/* Angle 3: Liquid Cooling Loop & Airflow Telemetry View */}
              <rect
                x="44"
                y="26"
                width="172"
                height="136"
                rx="10"
                fill="#131620"
                stroke="#38BDF8"
                strokeWidth="2.5"
              />
              {[0, 1, 2].map((fan) => (
                <circle
                  key={fan}
                  cx={78 + fan * 52}
                  cy="68"
                  r="20"
                  fill="#0D0F17"
                  stroke="#8E4DEB"
                  strokeWidth="2.5"
                />
              ))}
              <rect
                x="62"
                y="112"
                width="136"
                height="28"
                rx="5"
                fill="#1E293B"
                stroke="#EF875D"
                strokeWidth="1.5"
              />
              <text
                x="130"
                y="130"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                THERMAL & POWER PROTECTION
              </text>
            </g>
          ) : angleIndex === 4 ? (
            <g>
              {/* Angle 4: Clean Cable Routing / GaN Internal Architecture */}
              <rect
                x="52"
                y="24"
                width="156"
                height="142"
                rx="8"
                fill="#161822"
                stroke="#D66C9D"
                strokeWidth="2.5"
              />
              <path
                d="M82 42 L82 148 M112 42 L112 148 M146 42 L146 148"
                stroke="#8E4DEB"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <rect
                x="72"
                y="82"
                width="116"
                height="26"
                rx="4"
                fill="#111318"
                stroke="#EF875D"
                strokeWidth="1.5"
              />
              <text
                x="130"
                y="99"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                PRECISION ROUTING & CIRCUITRY
              </text>
            </g>
          ) : angleIndex === 5 ? (
            <g>
              {/* Angle 5: Complete System / Charger Ready-to-Run Kit */}
              <rect
                x="38"
                y="30"
                width="184"
                height="128"
                rx="10"
                fill="#12141D"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <rect
                x="54"
                y="48"
                width="152"
                height="56"
                rx="6"
                fill="#1D2130"
              />
              <text
                x="130"
                y="81"
                textAnchor="middle"
                fill="#EF875D"
                fontWeight="800"
                fontSize="13"
                fontFamily="monospace"
              >
                STRESS-TESTED & VERIFIED
              </text>
              <text
                x="130"
                y="132"
                textAnchor="middle"
                fill="#F8FAFC"
                fontWeight="700"
                fontSize="10"
                fontFamily="monospace"
              >
                PLUG & PLAY READY · PIXEL LAB
              </text>
            </g>
          ) : key.includes('charger') ||
            key.includes('sub-chargers') ||
            key.includes('acc-') ? (
            <g>
              <rect
                x="82"
                y="34"
                width="96"
                height="122"
                rx="16"
                fill="#1E212D"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <rect x="94" y="46" width="72" height="44" rx="8" fill="#12141C" />
              <text
                x="130"
                y="72"
                textAnchor="middle"
                fill="#EF875D"
                fontWeight="700"
                fontSize="14"
                fontFamily="monospace"
              >
                {isSecondary ? 'PD 3.0 PPS' : '100W GaN'}
              </text>
              <rect
                x="118"
                y="104"
                width="24"
                height="7"
                rx="3.5"
                fill="#8E4DEB"
              />
              <rect
                x="118"
                y="118"
                width="24"
                height="7"
                rx="3.5"
                fill="#D66C9D"
              />
              <rect x="114" y="132" width="32" height="9" rx="2" fill="#374151" />
            </g>
          ) : (
            <g>
              <rect
                x="64"
                y="16"
                width="132"
                height="158"
                rx="8"
                fill="#12141C"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              <rect x="72" y="24" width="116" height="142" rx="4" fill="#191C28" />
              <rect x="80" y="28" width="100" height="8" rx="4" fill="#8E4DEB" />
              <circle
                cx="118"
                cy="70"
                r="18"
                fill="#0E1017"
                stroke="#D66C9D"
                strokeWidth="3"
              />
              <text
                x="118"
                y="73"
                textAnchor="middle"
                fill="#F4F3F7"
                fontWeight="700"
                fontSize="8"
                fontFamily="monospace"
              >
                PIXEL
              </text>
              <rect x="144" y="54" width="4" height="30" rx="2" fill="#EF875D" />
              <rect x="151" y="54" width="4" height="30" rx="2" fill="#8E4DEB" />
              <rect
                x="78"
                y="102"
                width="96"
                height="24"
                rx="4"
                fill="#25293A"
                stroke="#EF875D"
                strokeWidth="2"
              />
              <text
                x="126"
                y="117"
                textAnchor="middle"
                fill="#F4F3F7"
                fontWeight="700"
                fontSize="9"
                fontFamily="monospace"
              >
                RTX 4070 SUPER
              </text>
              <rect x="72" y="138" width="116" height="28" rx="2" fill="#10121A" />
              <rect x="82" y="148" width="44" height="6" rx="3" fill="#8E4DEB" />
            </g>
          )}
        </svg>
      )}

      {/* 7. USE-CASE SELECTOR VISUALS */}
      {key.startsWith('usecase-') && (
        <svg viewBox="0 0 120 90" className="w-full h-full p-2">
          {key.includes('gaming') && (
            <g>
              <rect
                x="14"
                y="14"
                width="92"
                height="62"
                rx="10"
                fill="#171924"
                stroke="#8E4DEB"
                strokeWidth="2"
              />
              <path
                d="M40 52 L48 36 L72 36 L80 52"
                fill="none"
                stroke="#D66C9D"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="48" cy="46" r="4" fill="#EF875D" />
              <circle cx="72" cy="46" r="4" fill="#8E4DEB" />
            </g>
          )}
          {key.includes('office') && (
            <g>
              <rect
                x="14"
                y="14"
                width="92"
                height="62"
                rx="10"
                fill="#1F2432"
                stroke="#EF875D"
                strokeWidth="2"
              />
              <rect x="28" y="28" width="64" height="34" rx="4" fill="#F4F3F7" />
              <line
                x1="36"
                y1="38"
                x2="84"
                y2="38"
                stroke="#111318"
                strokeWidth="2.5"
              />
              <line
                x1="36"
                y1="46"
                x2="72"
                y2="46"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
            </g>
          )}
          {key.includes('work') && (
            <g>
              <rect
                x="14"
                y="14"
                width="92"
                height="62"
                rx="10"
                fill="#191B26"
                stroke="#D66C9D"
                strokeWidth="2"
              />
              <polygon
                points="34,58 60,26 86,58"
                fill="none"
                stroke="#D66C9D"
                strokeWidth="2.5"
              />
              <circle cx="60" cy="45" r="7" fill="#8E4DEB" />
            </g>
          )}
          {key.includes('everyday') && (
            <g>
              <rect
                x="14"
                y="14"
                width="92"
                height="62"
                rx="10"
                fill="#1D202D"
                stroke="#EF875D"
                strokeWidth="2"
              />
              <circle
                cx="60"
                cy="45"
                r="18"
                fill="none"
                stroke="#EF875D"
                strokeWidth="2.5"
              />
              <path
                d="M53 45 L58 50 L69 39"
                fill="none"
                stroke="#F4F3F7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>
      )}

      {/* 8. TECHNICAL SERVICES & WORKSHOP VISUALS (Cooling, Maintenance, Security Cameras) */}
      {key.startsWith('service-') && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {key.includes('cooling') ? (
            <g>
              {/* Cooling Service 5-Image Gallery Angles */}
              <rect
                x="22"
                y="18"
                width="216"
                height="154"
                rx="10"
                fill="#0F172A"
                stroke="#38BDF8"
                strokeWidth="2.5"
              />
              {angleIndex === 1 && (
                <g>
                  {/* Angle 1: Dual Turbine Heatsink + Thermal Compound Renewal */}
                  <circle
                    cx="82"
                    cy="78"
                    r="32"
                    fill="#1E293B"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                  />
                  <circle cx="82" cy="78" r="11" fill="#0F172A" />
                  <circle
                    cx="178"
                    cy="78"
                    r="32"
                    fill="#1E293B"
                    stroke="#8E4DEB"
                    strokeWidth="2.5"
                  />
                  <circle cx="178" cy="78" r="11" fill="#0F172A" />
                  <path
                    d="M82 44 L178 44 M82 112 L178 112 M114 78 L146 78"
                    stroke="#EF875D"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <rect
                    x="114"
                    y="62"
                    width="32"
                    height="32"
                    rx="4"
                    fill="#38BDF8"
                    stroke="#0F172A"
                    strokeWidth="2"
                  />
                  <text
                    x="130"
                    y="148"
                    textAnchor="middle"
                    fill="#38BDF8"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    THERMAL PASTE & HEATSINK RENEWAL
                  </text>
                </g>
              )}
              {angleIndex === 2 && (
                <g>
                  {/* Angle 2: High-Density Fin Stack & Fan Blade Dust Clearing */}
                  <rect
                    x="38"
                    y="36"
                    width="184"
                    height="82"
                    rx="6"
                    fill="#1E293B"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={i}
                      x1={50 + i * 14.5}
                      y1="44"
                      x2={50 + i * 14.5}
                      y2="110"
                      stroke="#38BDF8"
                      strokeWidth="3"
                    />
                  ))}
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    FIN STACK & AIRFLOW RESTORATION
                  </text>
                </g>
              )}
              {angleIndex === 3 && (
                <g>
                  {/* Angle 3: VRM & VRAM Thermal Pads Replacement */}
                  <rect
                    x="44"
                    y="34"
                    width="172"
                    height="86"
                    rx="6"
                    fill="#111827"
                    stroke="#8E4DEB"
                    strokeWidth="2"
                  />
                  {[0, 1, 2, 3].map((p) => (
                    <rect
                      key={p}
                      x={56 + p * 38}
                      y="48"
                      width="28"
                      height="16"
                      rx="2"
                      fill="#38BDF8"
                    />
                  ))}
                  <rect
                    x="98"
                    y="72"
                    width="64"
                    height="36"
                    rx="4"
                    fill="#EF875D"
                  />
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#EF875D"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    CPU/GPU DIE & VRM THERMAL PADS
                  </text>
                </g>
              )}
              {angleIndex === 4 && (
                <g>
                  {/* Angle 4: Pre vs Post Load Temperature Telemetry */}
                  <rect
                    x="42"
                    y="40"
                    width="78"
                    height="76"
                    rx="6"
                    fill="#450A0A"
                    stroke="#F43F5E"
                    strokeWidth="2"
                  />
                  <text
                    x="81"
                    y="76"
                    textAnchor="middle"
                    fill="#FDA4AF"
                    fontWeight="800"
                    fontSize="16"
                    fontFamily="monospace"
                  >
                    88°C
                  </text>
                  <text
                    x="81"
                    y="96"
                    textAnchor="middle"
                    fill="#FDA4AF"
                    fontWeight="700"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    BEFORE
                  </text>
                  <rect
                    x="140"
                    y="40"
                    width="78"
                    height="76"
                    rx="6"
                    fill="#064E3B"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <text
                    x="179"
                    y="76"
                    textAnchor="middle"
                    fill="#6EE7B7"
                    fontWeight="800"
                    fontSize="16"
                    fontFamily="monospace"
                  >
                    76°C
                  </text>
                  <text
                    x="179"
                    y="96"
                    textAnchor="middle"
                    fill="#6EE7B7"
                    fontWeight="700"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    AFTER
                  </text>
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#38BDF8"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    PRE & POST THERMAL VERIFICATION
                  </text>
                </g>
              )}
              {angleIndex === 5 && (
                <g>
                  {/* Angle 5: ESD-Safe Bench & Complete Thermal Report */}
                  <rect
                    x="48"
                    y="38"
                    width="164"
                    height="78"
                    rx="8"
                    fill="#1E293B"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <path
                    d="M108 78 L124 92 L154 62"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#6EE7B7"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    ESD-SAFE PROTOCOL · STABILITY CHECK
                  </text>
                </g>
              )}
            </g>
          ) : key.includes('cameras') ? (
            <g>
              {/* Security Cameras Service 5-Image Gallery Angles */}
              <rect
                x="22"
                y="18"
                width="216"
                height="154"
                rx="10"
                fill="#111318"
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              {angleIndex === 1 && (
                <g>
                  {/* Angle 1: 4K IP Bullet & Dome Camera Pair */}
                  <rect
                    x="48"
                    y="48"
                    width="96"
                    height="46"
                    rx="10"
                    fill="#F8FAFC"
                    stroke="#8E4DEB"
                    strokeWidth="2.5"
                  />
                  <circle cx="122" cy="71" r="14" fill="#111318" />
                  <circle cx="122" cy="71" r="6" fill="#38BDF8" />
                  <circle
                    cx="188"
                    cy="76"
                    r="28"
                    fill="#F8FAFC"
                    stroke="#EF875D"
                    strokeWidth="2.5"
                  />
                  <circle cx="188" cy="76" r="12" fill="#111318" />
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    IP & HD CCTV SURVEILLANCE SYSTEMS
                  </text>
                </g>
              )}
              {angleIndex === 2 && (
                <g>
                  {/* Angle 2: Infrared Night Vision Array */}
                  <circle
                    cx="130"
                    cy="78"
                    r="42"
                    fill="#1E293B"
                    stroke="#EF875D"
                    strokeWidth="2.5"
                  />
                  <circle cx="130" cy="78" r="18" fill="#0F172A" />
                  {[0, 60, 120, 180, 240, 300].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    return (
                      <circle
                        key={deg}
                        cx={130 + Math.cos(rad) * 29}
                        cy={78 + Math.sin(rad) * 29}
                        r="4"
                        fill="#F43F5E"
                      />
                    );
                  })}
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#EF875D"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    IR NIGHT VISION & WEATHERPROOF IP67
                  </text>
                </g>
              )}
              {angleIndex === 3 && (
                <g>
                  {/* Angle 3: NVR/DVR Recorder & Surveillance HDD Storage */}
                  <rect
                    x="42"
                    y="48"
                    width="176"
                    height="56"
                    rx="6"
                    fill="#1E293B"
                    stroke="#8E4DEB"
                    strokeWidth="2"
                  />
                  <circle cx="64" cy="76" r="6" fill="#10B981" />
                  <circle cx="82" cy="76" r="6" fill="#38BDF8" />
                  <rect
                    x="110"
                    y="62"
                    width="90"
                    height="28"
                    rx="4"
                    fill="#0F172A"
                  />
                  <text
                    x="155"
                    y="80"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontWeight="700"
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    NVR 24/7 HDD
                  </text>
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#D66C9D"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    NVR / DVR CONTINUOUS RECORDING
                  </text>
                </g>
              )}
              {angleIndex === 4 && (
                <g>
                  {/* Angle 4: PoE Network Switch & Structured Conduit Cabling */}
                  <rect
                    x="46"
                    y="52"
                    width="168"
                    height="48"
                    rx="6"
                    fill="#1E293B"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                  {Array.from({ length: 8 }).map((_, p) => (
                    <rect
                      key={p}
                      x={58 + p * 18}
                      y="66"
                      width="12"
                      height="18"
                      rx="2"
                      fill="#0F172A"
                      stroke="#EF875D"
                      strokeWidth="1.2"
                    />
                  ))}
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#38BDF8"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    8-PORT PoE SWITCH & CLEAN CABLING
                  </text>
                </g>
              )}
              {angleIndex === 5 && (
                <g>
                  {/* Angle 5: Remote Mobile & Desktop Live View Grid */}
                  <rect
                    x="56"
                    y="34"
                    width="148"
                    height="84"
                    rx="8"
                    fill="#1E293B"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <rect x="64" y="42" width="62" height="32" rx="3" fill="#0F172A" />
                  <rect x="134" y="42" width="62" height="32" rx="3" fill="#0F172A" />
                  <rect x="64" y="80" width="62" height="30" rx="3" fill="#0F172A" />
                  <rect x="134" y="80" width="62" height="30" rx="3" fill="#0F172A" />
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#6EE7B7"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    LIVE MOBILE & DESKTOP MONITORING
                  </text>
                </g>
              )}
            </g>
          ) : (
            <g>
              {/* Hardware Maintenance, Upgrades & Custom PC Assembly 5-Image Gallery Angles */}
              <rect
                x="22"
                y="18"
                width="216"
                height="154"
                rx="10"
                fill="#111318"
                stroke="#EF875D"
                strokeWidth="2.5"
              />
              {angleIndex === 1 && (
                <g>
                  {/* Angle 1: Hardware Diagnostics Bench & Motherboard Inspection */}
                  <rect
                    x="44"
                    y="36"
                    width="172"
                    height="82"
                    rx="8"
                    fill="#1E293B"
                    stroke="#8E4DEB"
                    strokeWidth="2"
                  />
                  <rect
                    x="62"
                    y="50"
                    width="54"
                    height="54"
                    rx="6"
                    fill="#0F172A"
                    stroke="#EF875D"
                    strokeWidth="2"
                  />
                  <line
                    x1="132"
                    y1="56"
                    x2="196"
                    y2="56"
                    stroke="#8E4DEB"
                    strokeWidth="4"
                  />
                  <line
                    x1="132"
                    y1="74"
                    x2="184"
                    y2="74"
                    stroke="#D66C9D"
                    strokeWidth="4"
                  />
                  <line
                    x1="132"
                    y1="92"
                    x2="192"
                    y2="92"
                    stroke="#10B981"
                    strokeWidth="4"
                  />
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#EF875D"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    HARDWARE DIAGNOSTICS & REPAIR LAB
                  </text>
                </g>
              )}
              {angleIndex === 2 && (
                <g>
                  {/* Angle 2: DDR5 RAM & Gen4 NVMe Storage Upgrade */}
                  <rect
                    x="44"
                    y="44"
                    width="172"
                    height="30"
                    rx="4"
                    fill="#1E293B"
                    stroke="#8E4DEB"
                    strokeWidth="2"
                  />
                  <text
                    x="130"
                    y="63"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontWeight="700"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    DDR5 DUAL-CHANNEL UPGRADE
                  </text>
                  <rect
                    x="44"
                    y="84"
                    width="172"
                    height="30"
                    rx="4"
                    fill="#1E293B"
                    stroke="#EF875D"
                    strokeWidth="2"
                  />
                  <text
                    x="130"
                    y="103"
                    textAnchor="middle"
                    fill="#EF875D"
                    fontWeight="700"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    PCIe 4.0 NVMe SSD MIGRATION
                  </text>
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#D66C9D"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    COMPATIBILITY-VERIFIED UPGRADES
                  </text>
                </g>
              )}
              {angleIndex === 3 && (
                <g>
                  {/* Angle 3: Custom PC Assembly & Clean Cable Management */}
                  <rect
                    x="56"
                    y="32"
                    width="148"
                    height="88"
                    rx="8"
                    fill="#1E293B"
                    stroke="#8E4DEB"
                    strokeWidth="2"
                  />
                  <path
                    d="M84 44 L84 108 M114 44 L114 108 M144 44 L144 108 M174 44 L174 108"
                    stroke="#8E4DEB"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    CUSTOM RIG ASSEMBLY & CABLE ROUTING
                  </text>
                </g>
              )}
              {angleIndex === 4 && (
                <g>
                  {/* Angle 4: BIOS Update, XMP/EXPO & Custom Fan Curve Tuning */}
                  <rect
                    x="44"
                    y="36"
                    width="172"
                    height="82"
                    rx="6"
                    fill="#0F172A"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                  <polyline
                    points="58,102 92,94 128,74 164,52 198,46"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="3.5"
                  />
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#38BDF8"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    BIOS UPDATE · EXPO & FAN CURVES
                  </text>
                </g>
              )}
              {angleIndex === 5 && (
                <g>
                  {/* Angle 5: Full System Stress Test & Quality Handover */}
                  <rect
                    x="48"
                    y="38"
                    width="164"
                    height="78"
                    rx="8"
                    fill="#1E293B"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <text
                    x="130"
                    y="82"
                    textAnchor="middle"
                    fill="#6EE7B7"
                    fontWeight="800"
                    fontSize="13"
                    fontFamily="monospace"
                  >
                    100% STRESS-TESTED
                  </text>
                  <text
                    x="130"
                    y="146"
                    textAnchor="middle"
                    fill="#6EE7B7"
                    fontWeight="800"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    VERIFIED STABILITY BEFORE HANDOVER
                  </text>
                </g>
              )}
            </g>
          )}
        </svg>
      )}
    </div>
  );
};
