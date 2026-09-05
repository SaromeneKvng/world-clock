import logoDot from "../assets/logo-dot.svg";
import logoMark from "../assets/logo-mark.svg";

type IconProps = { className?: string; strokeWidth?: number };

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`}>
      <img src={logoMark} alt="" className="size-[19px] rounded-full dark:bg-white/95 dark:p-px" />
      <span className="relative font-sans text-[18px] font-bold leading-none text-[#131a2b] dark:text-white">
        elsewhere
        <img src={logoDot} alt="" className="absolute -top-1 -right-2 size-[7px]" />
      </span>
    </div>
  );
}

export function MoonIcon({ className = "size-4", strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export function SunIcon({ className = "size-4", strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </svg>
  );
}

export function ListIcon({ className = "size-4", strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export function GridIcon({ className = "size-4", strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

export function PlusIcon({ className = "size-4", strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function XIcon({ className = "size-4", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "size-4", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ArrowLeftRightIcon({ className = "size-4", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4v13M7 17l-3.5-3.5M7 17l3.5-3.5" />
      <path d="M17 20V7M17 7l3.5 3.5M17 7l-3.5 3.5" />
    </svg>
  );
}

export function BriefcaseIcon({ className = "size-4", strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8.5 7.5V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8v1.7M3 13h18" />
    </svg>
  );
}

export function SunriseIcon({ className = "size-[18px]", strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M5.6 9.6l1.4 1.4M18.4 9.6 17 11M2 18h20M4 14.5A8 8 0 0 1 20 14.5" />
      <path d="M9 18a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function SunsetIcon({ className = "size-[18px]", strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4M5.6 9.6l1.4 1.4M18.4 9.6 17 11M2 18h20M4 14.5A8 8 0 0 1 20 14.5" />
      <path d="M9 18a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function SearchIcon({ className = "size-4", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function TrashIcon({ className = "size-4", strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m3 0-.8 12.1A2 2 0 0 1 15.2 21H8.8a2 2 0 0 1-2-1.9L6 7" />
    </svg>
  );
}
