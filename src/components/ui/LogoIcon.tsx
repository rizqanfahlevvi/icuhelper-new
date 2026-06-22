import React from 'react';

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function LogoIcon(props: LogoIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <rect width="512" height="512" rx="120" fill="#3192a0" />
      <rect x="85" y="110" width="342" height="235" rx="20" stroke="white" strokeWidth="28" fill="none" />
      <path d="M210 345 V385 H180 A10 10 0 0 0 180 405 H332 A10 10 0 0 0 332 385 H302 V345 Z" fill="white" />
      <path d="M 120 235 H 180 L 195 210 L 220 290 L 255 130 L 290 320 L 315 210 L 330 235 H 370" stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="312" y="292" width="130" height="130" rx="24" fill="#206974" />
      <path d="M 335 400 L 335 325 L 375 320 L 375 405 Z" fill="white" />
      <path d="M 380 323 L 420 330 L 420 395 L 380 405 Z" fill="white" />
      <path d="M 395 365 H 405 M 400 360 V 370" stroke="#206974" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
