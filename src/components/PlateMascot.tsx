type PlateMascotProps = {
  className?: string;
  hideArms?: boolean;
  label?: string;
};

export function PlateMascot({ className, hideArms = false, label }: PlateMascotProps) {
  const classes = ['plate-mascot', className].filter(Boolean).join(' ');

  return (
    <svg
      className={classes}
      viewBox="0 0 260 210"
      fill="none"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {label ? <title>{label}</title> : null}
      <ellipse cx="130" cy="195" rx="55" ry="8" fill="#d0d0d0" opacity="0.5" />

      <g className="plate-float">
        {!hideArms ? (
          <>
            <g>
              <path
                d="M48 108 C36 100, 24 92, 28 80 C30 74, 34 70, 36 68"
                stroke="#555"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M24 72 C18 74, 14 82, 18 88 C20 92, 28 94, 32 90 L28 84"
                stroke="#555"
                strokeWidth="2.5"
                fill="#f0f0f0"
                strokeLinecap="round"
              />
              <path
                d="M28 68 C26 58, 30 46, 36 44 C42 42, 44 48, 42 54 L38 64"
                stroke="#555"
                strokeWidth="2.5"
                fill="#f5f5f5"
                strokeLinecap="round"
              />
              <path d="M20 78 L26 80" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M19 83 L25 85" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            <g>
              <path
                d="M212 112 C220 118, 228 128, 230 140 L232 152"
                stroke="#555"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M226 146 C230 150, 236 156, 234 164 C232 170, 224 172, 222 166 L224 156"
                stroke="#555"
                strokeWidth="2.5"
                fill="#f0f0f0"
                strokeLinecap="round"
              />
              <path
                d="M228 158 C232 162, 234 168, 230 170"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M226 160 C228 166, 228 172, 224 172"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </>
        ) : null}

        <circle cx="130" cy="100" r="75" fill="#eaeaea" stroke="#555" strokeWidth="3" />
        <circle cx="130" cy="100" r="58" fill="#f0f0f0" stroke="#d8d8d8" strokeWidth="2" />
        <circle cx="130" cy="100" r="42" fill="#f8f8f8" stroke="#e0e0e0" strokeWidth="1.5" />

        <path
          d="M106 76 Q114 66, 122 74"
          stroke="#444"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M138 74 Q146 66, 154 76"
          stroke="#444"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        <g className="plate-eyes">
          <ellipse cx="114" cy="88" rx="7" ry="9" fill="#444" />
          <circle cx="116" cy="85" r="2.5" fill="#fff" />

          <ellipse cx="146" cy="88" rx="7" ry="9" fill="#444" />
          <circle cx="148" cy="85" r="2.5" fill="#fff" />
        </g>

        <path
          d="M108 106 Q118 128, 130 130 Q142 128, 152 106"
          stroke="#444"
          strokeWidth="2.5"
          fill="#fff"
          strokeLinecap="round"
        />
        <path d="M112 110 L148 110" stroke="#ddd" strokeWidth="1" />
      </g>
    </svg>
  );
}
