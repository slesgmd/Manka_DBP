import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { dishPath } from "../routes";
import DishImage from "./ui/DishImage";

interface DishCardProps {
  id: number;
  name: string;
  minutes: number;
  protein?: string;
  footer?: ReactNode;
}

export default function DishCard({ id, name, minutes, protein, footer }: DishCardProps) {
  return (
    <li className="glass flex flex-col gap-2.5 rounded-card p-2.5">
      <Link to={dishPath(id)} state={{ name }} className="flex flex-col gap-2.5 rounded-[20px]">
        <DishImage name={name} className="aspect-[4/3] w-full rounded-[20px]" />
        <span className="flex flex-col gap-[3px] px-1.5 pb-1.5">
          <span className="text-[16px] font-medium leading-[21px] tracking-[-0.01em]">{name}</span>
          <span className="text-footnote text-ink-2">{minutes} min{protein && ` · ${protein}`}</span>
        </span>
      </Link>
      {footer}
    </li>
  );
}
