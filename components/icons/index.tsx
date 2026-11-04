import type { ReactNode, SVGProps } from "react";

export interface IconProps {
  size?: 16 | 20 | 24;
  className?: string;
  title?: string;
}

function IconFrame({
  children,
  className,
  size = 24,
  title,
}: IconProps & { children: ReactNode }) {
  const accessibility: SVGProps<SVGSVGElement> = title
    ? { "aria-label": title, role: "img" }
    : { "aria-hidden": true };

  return (
    <svg
      {...accessibility}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const CopyIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M8 8h11v11H8z" /><path d="M5 16H3V3h13v2" /></IconFrame>
);
export const CheckIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="m5 12 4.5 4.5L19 7" /></IconFrame>
);
export const ClockIcon = (props: IconProps) => (
  <IconFrame {...props}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></IconFrame>
);
export const ArrowUpRightIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M7 17 17 7M8 7h9v9" /></IconFrame>
);
export const ChevronDownIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="m6 9 6 6 6-6" /></IconFrame>
);
export const ChevronRightIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="m9 6 6 6-6 6" /></IconFrame>
);
export const CloseIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="m6 6 12 12M18 6 6 18" /></IconFrame>
);
export const PlusIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M12 5v14M5 12h14" /></IconFrame>
);
export const TrashIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></IconFrame>
);
export const DragHandleIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M6 8h12M6 12h12M6 16h12" /></IconFrame>
);
export const DownloadIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14v-3" /></IconFrame>
);
export const LinkIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="m9.5 14.5-2 2a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0M14.5 9.5l2-2a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0M8 12h8" /></IconFrame>
);
export const QrIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-6v-2h4z" /></IconFrame>
);
export const WalletIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M4 6h15v13H4zM4 9h16v6h-5v-3h5M7 6V4h10v2" /></IconFrame>
);
export const WarningIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M12 3 21 20H3zM12 9v5M12 17h.01" /></IconFrame>
);
export const RefreshIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M19 8V4l-2 2a8 8 0 1 0 2.5 9M5 16v4l2-2" /></IconFrame>
);
export const SearchIcon = (props: IconProps) => (
  <IconFrame {...props}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" /></IconFrame>
);
export const SpinnerIcon = (props: IconProps) => (
  <IconFrame {...props}><path d="M20 12a8 8 0 1 1-8-8" /></IconFrame>
);
export const TriangleIcon = ({ className }: Pick<IconProps, "className">) => (
  <svg className={className} width="6" height="8" viewBox="0 0 6 8" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M0 0v8l6-4z" />
  </svg>
);
