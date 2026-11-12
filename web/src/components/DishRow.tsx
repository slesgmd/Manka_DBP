import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { dishPath } from "../routes";
import DishImage from "./ui/DishImage";
import Icon from "./ui/Icon";

interface DishRowProps {
  id: number;
  name: string;
  meta?: string;
  note?: string;
  lead?: ReactNode;
  actions?: ReactNode;
  linkState?: object;
}

export default function DishRow({ id, name, meta, note, lead, actions, linkState }: DishRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-[28px] py-2.5 pl-2.5 pr-3.5 transition-colors duration-200 ease-mk hover:bg-[var(--mk-g-thin)] md:gap-5">
      {lead}
      <Link to={dishPath(id)} state={{ name, ...linkState }} className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] md:gap-5">
        <DishImage name={name} className="h-[72px] w-24 shrink-0 rounded-[18px] md:h-24 md:w-32 md:rounded-[20px]" />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-[17px] font-medium leading-[22px] tracking-[-0.015em] md:text-[19px] md:leading-6">{name}</span>
          {meta && <span className="text-subhead text-ink-2">{meta}</span>}
          {note && <span className="text-footnote text-ink-2">{note}</span>}
        </span>
      </Link>
      {actions ?? <Icon name="chevron" size={18} />}
    </li>
  );
}
