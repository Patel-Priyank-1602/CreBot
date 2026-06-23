type CreBotLogoProps = {
  size?: number;
  className?: string;
};

export default function CreBotLogo({ size = 64, className = "" }: CreBotLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer hex chat shape */}
      <path
        d="M512 72L850 265V648L650 762L512 952L174 760V376L374 262L512 72Z"
        fill="currentColor"
      />

      {/* Inner cutout */}
      <path
        d="M512 155L778 307V608L628 692L512 842L246 690V418L396 334L512 155Z"
        fill="transparent"
      />

      {/* Top antenna */}
      <circle cx="512" cy="88" r="52" fill="currentColor" />
      <rect x="486" y="120" width="52" height="150" rx="26" fill="currentColor" />

      {/* Main bot face */}
      <path
        d="M330 385H694C746 385 790 429 790 481V585C790 637 746 681 694 681H604L512 770L420 681H330C278 681 234 637 234 585V481C234 429 278 385 330 385Z"
        fill="transparent"
      />

      {/* White curved body highlights */}
      <path
        d="M250 430C305 310 458 276 605 331C701 367 767 438 788 514C735 456 642 407 542 389C423 367 316 386 250 430Z"
        fill="currentColor"
      />

      <path
        d="M276 624C342 717 483 763 625 729C694 712 750 678 790 637C746 758 594 826 446 785C354 760 294 701 276 624Z"
        fill="currentColor"
      />

      {/* Eyes */}
      <circle cx="430" cy="533" r="43" fill="currentColor" />
      <circle cx="594" cy="533" r="43" fill="currentColor" />

      {/* Chat tail */}
      <path
        d="M610 660L792 735L642 758L512 865L555 720L610 660Z"
        fill="currentColor"
      />
    </svg>
  );
}