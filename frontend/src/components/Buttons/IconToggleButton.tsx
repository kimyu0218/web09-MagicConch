import { ButtonSize } from './CustomButton';
import IconButton from './IconButton';

interface IconToggleButtonProps {
  activeIcon: string;
  disabledIcon: string;
  iconSize?: number;
  buttonSize?: ButtonSize;
  onClick?: () => void;
  active: boolean;
}

export default function IconToggleButton({
  activeIcon,
  disabledIcon,
  iconSize,
  buttonSize,
  onClick,
  active,
}: IconToggleButtonProps) {
  return (
    <IconButton
      icon={active ? activeIcon : disabledIcon}
      iconSize={iconSize}
      iconColor={active ? 'textWhite' : 'textDefault'}
      buttonSize={buttonSize}
      buttonColor={active ? 'active' : 'cancel'}
      onClick={onClick}
      circle
    />
  );
}