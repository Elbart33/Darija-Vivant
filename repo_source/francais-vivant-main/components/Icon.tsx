import { IconName } from "@/types";

const paths: Record<IconName, JSX.Element> = {
  stethoscope: (
    <path
      d="M6 3v6a4 4 0 0 0 8 0V3M10 17a5 5 0 0 0 5-5v-1M18 9v2a1 1 0 1 1-2 0V9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  phone: (
    <path
      d="M5 4h3l2 4-2 1.5a11 11 0 0 0 5 5L14.5 12l4 2v3a1.5 1.5 0 0 1-1.6 1.5A15 15 0 0 1 4.5 5.6 1.5 1.5 0 0 1 5 4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  file: (
    <path
      d="M7 3h6l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM13 3v4h4M9 12h6M9 15h6M9 9h2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  basket: (
    <path
      d="M4 9h16l-1.5 9.5a1.5 1.5 0 0 1-1.48 1.28H6.98A1.5 1.5 0 0 1 5.5 18.5L4 9ZM8 9 10 4M16 9 14 4M9 13v3M12 13v3M15 13v3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  card: (
    <path
      d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11ZM3 10h18M6.5 14.5h4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export default function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
