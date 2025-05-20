import {
  ReactElement,
  ReactNode,
  isValidElement,
  HTMLAttributes,
} from "react";
import clsx from "clsx";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HeaderText } from "./components/HeaderText/HeaderText";
import { HeaderButton } from "./components/HeaderButton/HeaderButton";
import React from "react";

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function getDisplayName(child: ReactElement): string | undefined {
  const type = child.type;
  if (typeof type === "string") return undefined;
  return (type as any).displayName || (type as any).name;
}

const HeaderComponent = ({ children, className, ...props }: HeaderProps) => {
  const isMobile = useIsMobile();

  const allChildren = React.Children.toArray(children).filter(
    (child): child is ReactElement => isValidElement(child)
  );

  const text = allChildren.find(
    (child) => getDisplayName(child) === "HeaderText"
  );

  const buttons = allChildren.filter(
    (child) => getDisplayName(child) === "HeaderButton"
  );

  if (isMobile) {
    return (
      <div className={className} {...props}>
        {text}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {buttons}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        className,
        "flex items-center justify-between gap-4"
      )}
      {...props}
    >
      {text}
      <div className="flex gap-2">{buttons}</div>
    </div>
  );
};

HeaderComponent.Text = HeaderText;
HeaderComponent.Button = HeaderButton;
HeaderComponent.displayName = "Header";

export const Header = Object.assign(HeaderComponent, {
  Text: HeaderText,
  Button: HeaderButton,
});