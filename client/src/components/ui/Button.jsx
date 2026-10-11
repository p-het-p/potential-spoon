import React from 'react';
import { Button as ControlUiButton } from '@/components/control-ui/ui/button';

export function Button({ className, variant = 'primary', ...props }) {
  let mappedVariant = 'solid';
  let mappedTone = 'accent';

  if (variant === 'secondary') {
    mappedVariant = 'outline';
    mappedTone = 'neutral';
  } else if (variant === 'text') {
    mappedVariant = 'quiet';
    mappedTone = 'neutral';
  }

  return (
    <ControlUiButton
      className={className}
      variant={mappedVariant}
      tone={mappedTone}
      {...props}
    />
  );
}
