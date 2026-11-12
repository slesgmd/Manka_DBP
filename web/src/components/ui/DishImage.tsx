import { useState } from "react";
import { cx } from "../../utils/cx";
import { slugify } from "../../utils/slug";

interface DishImageProps {
  name: string;
  className?: string;
}

export default function DishImage({ name, className }: DishImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div role="img" aria-label={name} className={cx("glass glass-thin flex items-center justify-center overflow-hidden", className)}>
        <span aria-hidden="true" className="text-[40px] font-light text-title">{name.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      src={`/platos/${slugify(name)}.jpg`}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cx("object-cover", className)}
    />
  );
}
