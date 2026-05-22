import { Phone } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackGAConversion } from "@/lib/gaConversions";

export const PHONE_NUMBER_DISPLAY = "541-306-5757";
export const PHONE_NUMBER_TEL = "+15413065757";

interface PhoneCallButtonProps extends Omit<ButtonProps, "asChild" | "onClick"> {
  source: string;
  label?: string;
  showIcon?: boolean;
}

const PhoneCallButton = ({
  source,
  label,
  showIcon = true,
  variant = "hero",
  size = "default",
  className,
  ...rest
}: PhoneCallButtonProps) => {
  const handleClick = () => {
    trackGAConversion("phone_call_click", { source, phone: PHONE_NUMBER_DISPLAY });
  };

  return (
    <Button variant={variant} size={size} className={className} asChild {...rest}>
      <a href={`tel:${PHONE_NUMBER_TEL}`} onClick={handleClick} aria-label={`Call ${PHONE_NUMBER_DISPLAY}`}>
        {showIcon && <Phone className="h-4 w-4" />}
        {label ?? `Call ${PHONE_NUMBER_DISPLAY}`}
      </a>
    </Button>
  );
};

export default PhoneCallButton;
