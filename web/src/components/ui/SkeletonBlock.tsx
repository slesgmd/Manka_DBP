import { cx } from "../../utils/cx";

export default function SkeletonBlock({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx("glass glass-thin skeleton", className)} />;
}
