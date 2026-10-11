import React from 'react';
import { Input as ControlUiInput } from '@/components/control-ui/ui/input';

export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <ControlUiInput
      type={type}
      className={className}
      ref={ref}
      {...props}
    />
  )
});
Input.displayName = "Input"
