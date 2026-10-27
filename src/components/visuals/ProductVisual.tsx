import React from 'react';

interface ProductVisualProps {
  visualKey: string;
  alt: string;
  className?: string;
}

/**
 * Studio-grade hardware photography SVG illustrations for Pixel Store products and categories.
 * Every product has both a primary front view and a secondary detail/angle view so desktop
 * hover image transitions feel genuinely informative and responsive without broken URLs.
 */
export const ProductVisual: React.FC<ProductVisualProps> = ({
  visualKey,
  alt,
  className = '',
}) => {
  const isSecondary =
    visualKey.endsWith('-side') ||
    visualKey.endsWith('-angle') ||
    visualKey.endsWith('-back') ||
    visualKey.endsWith('-lid') ||
    visualKey.endsWith('-switches') ||
    visualKey.endsWith('-dial') ||
    visualKey.endsWith('-wheel') ||
    visualKey.endsWith('-bottom') ||
    visualKey.endsWith('-mic') ||
    visualKey.endsWith('-cable') ||
    visualKey.endsWith('-case') ||
    visualKey.endsWith('-backplate') ||
    visualKey.endsWith('-chip') ||
    visualKey.endsWith('-io') ||
    visualKey.endsWith('-rgb') ||
    visualKey.endsWith('-installed') ||
    visualKey.endsWith('-cables') ||
    visualKey.endsWith('-interior') ||
    visualKey.endsWith('-ports');

  // Determine visual family
  const key = visualKey.toLowerCase();

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-gradient-to-b from-[#FAF9FC] to-[#ECEAF2] ${className}`}
      role="img"
      aria-label={alt}
    >
      {/* Subtle studio floor reflection */}
      <div className="absolute inset-x-6 bottom-3 h-3 rounded-full bg-black/6 blur-md pointer-events-none" />

      {/* 1. LAPTOPS */}
      {(key.includes('laptop') || key.includes('cat-laptops') || key.includes('sub-new-laptops') || key.includes('sub-used-laptops')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          <defs>
            <linearGradient id="scrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={key.includes('rog') ? '#8E4DEB' : key.includes('thinkpad') ? '#1F2937' : '#2563EB'} />
              <stop offset="55%" stopColor={key.includes('rog') ? '#D66C9D' : key.includes('thinkpad') ? '#111827' : '#7C3AED'} />
              <stop offset="100%" stopColor={key.includes('rog') ? '#EF875D' : '#0F172A'} />
            </linearGradient>
            <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#262936" />
              <stop offset="50%" stopColor="#3B3F52" />
              <stop offset="100%" stopColor="#1D1F2B" />
            </linearGradient>
          </defs>
          {!isSecondary ? (
            <g>
              {/* Open Front Studio View */}
              <rect x="44" y="24" width="172" height="108" rx="6" fill="#14161F" stroke="#2E3244" strokeWidth="2.5" />
              <rect x="50" y="30" width="160" height="94" rx="3" fill="url(#scrGrad)" />
              {/* Screen wallpaper geometric accent */}
              <polygon points="75,124 135,45 195,124" fill="rgba(255,255,255,0.12)" />
              <circle cx="165" cy="64" r="18" fill="rgba(239,135,93,0.28)" />
              {/* HUD / Spec overlay on screen */}
              <rect x="60" y="40" width="46" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
              <rect x="60" y="50" width="28" height="4" rx="1.5" fill="rgba(255,255,255,0.35)" />
              {/* Keyboard Deck */}
              <polygon points="24,154 44,132 216,132 236,154" fill="url(#chassisGrad)" stroke="#454A60" strokeWidth="1.5" />
              {/* RGB or Backlit keys */}
              <polygon points="48,146 56,136 204,136 212,146" fill="#181A24" />
              {key.includes('rog') || key.includes('loq') ? (
                <line x1="46" y1="155" x2="214" y2="155" stroke="#8E4DEB" strokeWidth="2.5" />
              ) : null}
              {/* Base lip */}
              <rect x="24" y="153" width="212" height="6" rx="3" fill="#181A24" />
              {/* Trackpad */}
              <polygon points="112,152 115,147 145,147 148,152" fill="#2D3142" />
            </g>
          ) : (
            <g>
              {/* Angled / Side Profile Studio View */}
              <polygon points="62,22 196,36 184,134 50,120" fill="#161822" stroke="#34384B" strokeWidth="2.5" />
              <polygon points="68,28 190,41 179,127 56,114" fill="url(#scrGrad)" />
              {/* Diagonal ROG/Pixel slash on lid/screen */}
              <line x1="80" y1="32" x2="165" y2="122" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
              {/* Angled Base with Cooling Vents & I/O Ports */}
              <polygon points="50,120 184,134 226,156 92,144" fill="url(#chassisGrad)" stroke="#494E66" strokeWidth="2" />
              {/* Side I/O Ports Detail */}
              <rect x="64" y="127" width="12" height="3" rx="1" fill="#8E4DEB" />
              <rect x="82" y="129" width="8" height="3" rx="1" fill="#EF875D" />
              <rect x="96" y="131" width="16" height="3" rx="1" fill="#111318" />
            </g>
          )}
        </svg>
      )}

      {/* 2. KEYBOARDS */}
      {(key.includes('kb-') || key.includes('keyboard') || key.includes('cat-accessories')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {!isSecondary ? (
            <g>
              {/* Top-Down Keyboard Chassis */}
              <rect
                x="28"
                y="54"
                width="204"
                height="82"
                rx={key.includes('pebble') ? '16' : '8'}
                fill={key.includes('mxkeys') || key.includes('pebble') ? '#2B2E3B' : '#161822'}
                stroke={key.includes('fizz') || key.includes('huntsman') ? '#8E4DEB' : '#43485E'}
                strokeWidth="2.5"
              />
              {/* RGB Under-glow for gaming keyboards */}
              {(key.includes('fizz') || key.includes('huntsman') || key.includes('sub-keyboards')) && (
                <rect x="33" y="59" width="194" height="72" rx="5" fill="none" stroke="#D66C9D" strokeWidth="1.5" strokeOpacity="0.6" />
              )}
              {/* Keycap Grid */}
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
          ) : (
            <g>
              {/* Close-Up Mechanical Switch / Profile View */}
              <polygon points="30,118 215,78 232,115 48,152" fill="#181A24" stroke="#8E4DEB" strokeWidth="2" />
              {/* Elevated Keycaps & Exposed Red/Optical Switches */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i} transform={`translate(${48 + i * 28}, ${105 - i * 6})`}>
                  {/* Switch stem */}
                  <rect x="6" y="6" width="10" height="7" fill="#EF875D" />
                  {/* Keycap */}
                  <polygon points="0,6 4,-6 20,-6 24,6" fill={i === 0 ? '#8E4DEB' : '#2D3245'} stroke="#D66C9D" strokeWidth="0.8" />
                </g>
              ))}
              <circle cx="195" cy="54" r="22" fill="#161822" stroke="#8E4DEB" strokeWidth="2.5" />
              <text x="195" y="58" textAnchor="middle" fill="#F4F3F7" fontSize="9" fontFamily="monospace">
                HOT-SWAP
              </text>
            </g>
          )}
        </svg>
      )}

      {/* 3. MICE */}
      {(key.includes('mouse') || key.includes('sub-mice')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {!isSecondary ? (
            <g>
              {/* Top Ergonomic / Symmetrical Mouse Shell */}
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
              {/* Split M1 / M2 Buttons */}
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
              {/* Scroll Wheel */}
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
              {/* Brand / DPI Accent */}
              <circle
                cx="130"
                cy="128"
                r="8"
                fill="none"
                stroke={key.includes('superlight') ? '#8E4DEB' : '#EF875D'}
                strokeWidth="2.5"
              />
            </g>
          ) : (
            <g>
              {/* Side Profile / PTFE Skates & Sensor View */}
              <path
                d="M44 134 C58 72, 134 56, 206 116 L214 134 Z"
                fill={key.includes('superlight') ? '#F3F2F8' : '#1B1E2B'}
                stroke="#8E4DEB"
                strokeWidth="2.5"
              />
              {/* Side Thumb Buttons */}
              <rect x="96" y="96" width="22" height="7" rx="3.5" fill="#D66C9D" />
              <rect x="122" y="98" width="18" height="7" rx="3.5" fill="#8E4DEB" />
              {/* Scroll wheel crest */}
              <circle cx="172" cy="94" r="9" fill="#EF875D" />
              {/* Base sensor glow */}
              <line x1="42" y1="136" x2="216" y2="136" stroke="#8E4DEB" strokeWidth="3" />
            </g>
          )}
        </svg>
      )}

      {/* 4. AUDIO (Headsets, IEM, Earbuds) */}
      {(key.includes('audio') || key.includes('cat-audio') || key.includes('sub-headsets') || key.includes('sub-earbuds') || key.includes('sub-iem')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {key.includes('iem') ? (
            <g>
              {/* Custom IEM Earphone Shells */}
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
              {/* Braided Silver Cable */}
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
              {/* Charging Case + Wireless Buds */}
              <rect x="78" y="64" width="104" height="84" rx="26" fill="#181B26" stroke="#8E4DEB" strokeWidth="2.5" />
              <line x1="78" y1="96" x2="182" y2="96" stroke="#363B52" strokeWidth="2" />
              <rect x="116" y="106" width="28" height="5" rx="2.5" fill="#10B981" />
              {/* Buds popping above */}
              <circle cx="106" cy="48" r="15" fill="#25293A" stroke="#D66C9D" strokeWidth="2" />
              <circle cx="154" cy="48" r="15" fill="#25293A" stroke="#8E4DEB" strokeWidth="2" />
            </g>
          ) : (
            <g>
              {/* Over-Ear Gaming Headset */}
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
              {/* Left & Right Earcups */}
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
              {/* Detachable Boom Mic */}
              <path
                d="M68 140 Q88 168 126 158"
                fill="none"
                stroke="#EF875D"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="130" cy="157" r="5" fill="#111318" stroke="#EF875D" strokeWidth="2" />
            </g>
          )}
        </svg>
      )}

      {/* 5. PC COMPONENTS (GPU, CPU, Mobo, RAM, SSD, PSU, Case) */}
      {(key.includes('comp-') || key.includes('cat-components') || key.includes('sub-gpu') || key.includes('sub-cpu') || key.includes('sub-mobo') || key.includes('sub-ram') || key.includes('sub-storage') || key.includes('sub-psu') || key.includes('sub-cases')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {key.includes('cpu') ? (
            <g>
              {/* AMD Ryzen / CPU Box & IHS Heatspreader */}
              <rect x="66" y="32" width="128" height="126" rx="12" fill="#1A1D28" stroke="#EF875D" strokeWidth="2.5" />
              <rect x="86" y="52" width="88" height="86" rx="8" fill="#9CA3AF" stroke="#374151" strokeWidth="2" />
              <rect x="98" y="64" width="64" height="62" rx="4" fill="#D1D5DB" />
              <text x="130" y="92" textAnchor="middle" fill="#111318" fontWeight="700" fontSize="13" fontFamily="monospace">
                RYZEN 7
              </text>
              <text x="130" y="108" textAnchor="middle" fill="#8E4DEB" fontWeight="700" fontSize="10" fontFamily="monospace">
                {isSecondary ? '96MB 3D V-CACHE' : '7800X3D'}
              </text>
            </g>
          ) : key.includes('ram') ? (
            <g>
              {/* Dual-Channel DDR5 RGB Memory Modules */}
              {[0, 1].map((idx) => (
                <g key={idx} transform={`translate(0, ${idx * 46})`}>
                  {/* Top RGB Diffuser Bar */}
                  <rect x="34" y="42" width="192" height="10" rx="3" fill={idx === 0 ? '#8E4DEB' : '#D66C9D'} />
                  {/* Aluminum Heatspreader */}
                  <rect x="34" y="50" width="192" height="28" rx="3" fill="#171923" stroke="#4B5563" strokeWidth="1.5" />
                  <text x="130" y="68" textAnchor="middle" fill="#F4F3F7" fontWeight="700" fontSize="11" fontFamily="monospace">
                    FURY DDR5 6000 CL30
                  </text>
                  {/* Gold PCB Contacts */}
                  <rect x="44" y="78" width="172" height="5" fill="#F59E0B" />
                </g>
              ))}
            </g>
          ) : key.includes('ssd') || key.includes('storage') ? (
            <g>
              {/* M.2 NVMe PCIe 4.0 Stick */}
              <rect x="28" y="70" width="204" height="52" rx="5" fill="#14161E" stroke="#8E4DEB" strokeWidth="2" />
              <rect x="38" y="77" width="166" height="38" rx="2" fill="#1F2433" />
              <text x="120" y="98" textAnchor="middle" fill="#F4F3F7" fontWeight="700" fontSize="13" fontFamily="monospace">
                KC3000 PCIe 4.0 NVMe M.2
              </text>
              <text x="120" y="110" textAnchor="middle" fill="#EF875D" fontWeight="700" fontSize="9" fontFamily="monospace">
                7000 MB/s READ · 1TB
              </text>
              {/* M.2 Gold Connector Notch */}
              <rect x="224" y="78" width="8" height="36" fill="#F59E0B" />
            </g>
          ) : key.includes('psu') ? (
            <g>
              {/* 850W 80+ Gold Modular Power Supply */}
              <rect x="46" y="36" width="168" height="118" rx="8" fill="#171922" stroke="#4B5563" strokeWidth="2.5" />
              <circle cx="106" cy="95" r="42" fill="#111318" stroke="#374151" strokeWidth="2" />
              <circle cx="106" cy="95" r="14" fill="#262A38" stroke="#EF875D" strokeWidth="2" />
              <rect x="160" y="54" width="40" height="22" rx="3" fill="#F59E0B" />
              <text x="180" y="69" textAnchor="middle" fill="#111318" fontWeight="800" fontSize="11" fontFamily="monospace">
                850W
              </text>
              <text x="180" y="94" textAnchor="middle" fill="#F4F3F7" fontWeight="700" fontSize="9" fontFamily="monospace">
                ATX 3.0
              </text>
              <text x="180" y="108" textAnchor="middle" fill="#F59E0B" fontWeight="700" fontSize="9" fontFamily="monospace">
                80+ GOLD
              </text>
            </g>
          ) : key.includes('mobo') ? (
            <g>
              {/* ATX Motherboard */}
              <rect x="56" y="20" width="148" height="150" rx="6" fill="#161821" stroke="#4B5563" strokeWidth="2" />
              {/* VRM Heatsinks */}
              <rect x="64" y="28" width="26" height="58" rx="3" fill="#374151" />
              <rect x="96" y="26" width="54" height="20" rx="3" fill="#374151" />
              {/* AM5 CPU Socket */}
              <rect x="104" y="54" width="38" height="38" rx="4" fill="#9CA3AF" stroke="#8E4DEB" strokeWidth="2" />
              {/* 4x DDR5 Slots */}
              {[0, 1, 2, 3].map((s) => (
                <rect key={s} x={154 + s * 7} y="48" width="4" height="50" fill={s % 2 === 0 ? '#8E4DEB' : '#374151'} />
              ))}
              {/* PCIe 5.0 Steel Slot */}
              <rect x="70" y="110" width="96" height="7" rx="2" fill="#D1D5DB" />
              {/* Chipset Heatsink */}
              <rect x="148" y="122" width="42" height="36" rx="4" fill="#282C3E" stroke="#EF875D" strokeWidth="1.5" />
            </g>
          ) : key.includes('case') ? (
            <g>
              {/* Panoramic Dual-Chamber ATX Case */}
              <rect x="68" y="20" width="124" height="150" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
              <rect x="76" y="28" width="108" height="134" rx="4" fill="#0F172A" />
              {/* 3x ARGB Vertical Fans */}
              {[0, 1, 2].map((f) => (
                <circle
                  key={f}
                  cx="158"
                  cy={52 + f * 38}
                  r="15"
                  fill="none"
                  stroke={f === 0 ? '#8E4DEB' : f === 1 ? '#D66C9D' : '#EF875D'}
                  strokeWidth="3"
                />
              ))}
              {/* Internal GPU & AIO Pump */}
              <rect x="86" y="96" width="56" height="18" rx="3" fill="#334155" stroke="#8E4DEB" strokeWidth="1.5" />
              <circle cx="112" cy="64" r="14" fill="#1E293B" stroke="#EF875D" strokeWidth="2.5" />
            </g>
          ) : (
            /* Graphics Card (GPU) Default for PC Components */
            <g>
              <rect x="28" y="48" width="204" height="94" rx="10" fill="#161822" stroke="#374151" strokeWidth="2.5" />
              {/* Accent Shroud Lines */}
              <polygon points="36,54 110,54 96,136 36,136" fill="#1F2332" />
              <line x1="28" y1="48" x2="232" y2="48" stroke="#8E4DEB" strokeWidth="3.5" />
              {!isSecondary ? (
                <>
                  {/* Dual Axial Cooling Fans */}
                  <circle cx="86" cy="95" r="34" fill="#0F1118" stroke="#8E4DEB" strokeWidth="2" />
                  <circle cx="86" cy="95" r="11" fill="#25293A" />
                  <circle cx="174" cy="95" r="34" fill="#0F1118" stroke="#D66C9D" strokeWidth="2" />
                  <circle cx="174" cy="95" r="11" fill="#25293A" />
                </>
              ) : (
                <>
                  {/* Metal Backplate View with Flow-Through Vent */}
                  <rect x="42" y="62" width="90" height="66" rx="4" fill="#25293A" />
                  <text x="87" y="98" textAnchor="middle" fill="#F4F3F7" fontWeight="700" fontSize="13" fontFamily="monospace">
                    GEFORCE RTX
                  </text>
                  <rect x="144" y="64" width="72" height="62" rx="6" fill="#0D0F16" stroke="#8E4DEB" strokeWidth="1.5" />
                </>
              )}
            </g>
          )}
        </svg>
      )}

      {/* 6. CUSTOM PC BUILDS & CHARGERS */}
      {(key.includes('build') || key.includes('cat-builds') || key.includes('charger') || key.includes('sub-chargers') || key.includes('acc-')) && (
        <svg viewBox="0 0 260 190" className="w-full h-full p-3">
          {key.includes('charger') || key.includes('sub-chargers') || key.includes('acc-') ? (
            <g>
              {/* 100W GaN Wall Charger */}
              <rect x="82" y="34" width="96" height="122" rx="16" fill="#1E212D" stroke="#8E4DEB" strokeWidth="2.5" />
              <rect x="94" y="46" width="72" height="44" rx="8" fill="#12141C" />
              <text x="130" y="72" textAnchor="middle" fill="#EF875D" fontWeight="700" fontSize="14" fontFamily="monospace">
                100W GaN
              </text>
              {/* USB-C Ports */}
              <rect x="118" y="104" width="24" height="7" rx="3.5" fill="#8E4DEB" />
              <rect x="118" y="118" width="24" height="7" rx="3.5" fill="#D66C9D" />
              <rect x="114" y="132" width="32" height="9" rx="2" fill="#374151" />
            </g>
          ) : (
            <g>
              {/* Custom Gaming PC Build Tower */}
              <rect x="64" y="16" width="132" height="158" rx="8" fill="#12141C" stroke="#8E4DEB" strokeWidth="2.5" />
              <rect x="72" y="24" width="116" height="142" rx="4" fill="#191C28" />
              {/* Top 360mm AIO Radiator Glow */}
              <rect x="80" y="28" width="100" height="8" rx="4" fill="#8E4DEB" />
              {/* AIO CPU Waterblock */}
              <circle cx="118" cy="70" r="18" fill="#0E1017" stroke="#D66C9D" strokeWidth="3" />
              <text x="118" y="73" textAnchor="middle" fill="#F4F3F7" fontWeight="700" fontSize="8" fontFamily="monospace">
                PIXEL
              </text>
              {/* RGB RAM Sticks */}
              <rect x="144" y="54" width="4" height="30" rx="2" fill="#EF875D" />
              <rect x="151" y="54" width="4" height="30" rx="2" fill="#8E4DEB" />
              {/* RTX GPU Horizontal Mount */}
              <rect x="78" y="102" width="96" height="24" rx="4" fill="#25293A" stroke="#EF875D" strokeWidth="2" />
              <text x="126" y="117" textAnchor="middle" fill="#F4F3F7" fontWeight="700" fontSize="9" fontFamily="monospace">
                RTX 4070 SUPER
              </text>
              {/* PSU Shroud */}
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
              <rect x="14" y="14" width="92" height="62" rx="10" fill="#171924" stroke="#8E4DEB" strokeWidth="2" />
              <path d="M40 52 L48 36 L72 36 L80 52" fill="none" stroke="#D66C9D" strokeWidth="3" strokeLinecap="round" />
              <circle cx="48" cy="46" r="4" fill="#EF875D" />
              <circle cx="72" cy="46" r="4" fill="#8E4DEB" />
            </g>
          )}
          {key.includes('office') && (
            <g>
              <rect x="14" y="14" width="92" height="62" rx="10" fill="#1F2432" stroke="#EF875D" strokeWidth="2" />
              <rect x="28" y="28" width="64" height="34" rx="4" fill="#F4F3F7" />
              <line x1="36" y1="38" x2="84" y2="38" stroke="#111318" strokeWidth="2.5" />
              <line x1="36" y1="46" x2="72" y2="46" stroke="#8E4DEB" strokeWidth="2.5" />
            </g>
          )}
          {key.includes('work') && (
            <g>
              <rect x="14" y="14" width="92" height="62" rx="10" fill="#191B26" stroke="#D66C9D" strokeWidth="2" />
              <polygon points="34,58 60,26 86,58" fill="none" stroke="#D66C9D" strokeWidth="2.5" />
              <circle cx="60" cy="45" r="7" fill="#8E4DEB" />
            </g>
          )}
          {key.includes('everyday') && (
            <g>
              <rect x="14" y="14" width="92" height="62" rx="10" fill="#1D202D" stroke="#EF875D" strokeWidth="2" />
              <circle cx="60" cy="45" r="18" fill="none" stroke="#EF875D" strokeWidth="2.5" />
              <path d="M53 45 L58 50 L69 39" fill="none" stroke="#F4F3F7" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}
        </svg>
      )}
    </div>
  );
};
