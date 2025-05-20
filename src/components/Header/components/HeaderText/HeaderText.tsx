import clsx from "clsx";
import { HTMLAttributes } from "react";

interface HeaderTextProps extends HTMLAttributes<HTMLHeadingElement> {}

export const HeaderText = ({ children, className }: HeaderTextProps) => (
  <h1 className={clsx(className, 'text-3xl font-bold')}>{children}</h1>
);

HeaderText.displayName = 'HeaderText';