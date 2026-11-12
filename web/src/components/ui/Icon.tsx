const paths = {
  logo: "M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19 13 11",
  home: "M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z",
  catalog: "M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12",
  pantry: "M3 9h18l-2 11H5zM8 9l4-6 4 6",
  favorites: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  history: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2",
  admin: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  alert: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v6M12 16.5v.5",
  check: "m5 12 5 5 9-10",
  cross: "M18 6 6 18M6 6l12 12",
  chevron: "m9 6 6 6-6 6",
  back: "m15 6-6 6 6 6",
  down: "m6 9 6 6 6-6",
  plus: "M12 5v14M5 12h14",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  shuffle: "M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5",
};

export type IconName = keyof typeof paths;

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}

export default function Icon({ name, size = 20, strokeWidth = 1.8, color = "currentColor", fill = "none" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d={paths[name]} />
    </svg>
  );
}
