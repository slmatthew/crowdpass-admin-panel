import { Button, ButtonProps } from '@/components/ui/Button';

interface HeaderButtonProps extends ButtonProps {}

export const HeaderButton = ({
  children,
  size = "sm",
  ...restProps
}: HeaderButtonProps) => (
  <Button
    size={size}
    {...restProps}
  >
    {children}
  </Button>
);

HeaderButton.displayName = 'HeaderButton';