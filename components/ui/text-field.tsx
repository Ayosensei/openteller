"use client";

import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";

interface TextFieldProps extends AriaTextFieldProps {
  label: string;
  description?: string;
  errorMessage?: string;
}

export function TextField({
  description,
  errorMessage,
  label,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField {...props} className="text-field">
      <Label className="text-field__label">{label}</Label>
      <Input className="text-field__input" />
      {description ? (
        <Text slot="description" className="text-field__help">
          {description}
        </Text>
      ) : null}
      <FieldError className="text-field__error">{errorMessage}</FieldError>
    </AriaTextField>
  );
}
