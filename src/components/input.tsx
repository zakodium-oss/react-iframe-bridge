import type { CSSProperties, ChangeEvent } from 'react';

interface InputProps {
  name: string;
  style?: CSSProperties;
  value: string;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  list?: string;
}

export default function Input(props: InputProps) {
  const { style, ...otherProps } = props;
  return (
    <input
      type="text"
      style={{
        appearance: 'none',
        border: '1px solid #4a5565',
        backgroundColor: 'white',
        paddingInline: '0.75rem',
        paddingBlock: '0.5rem',
        fontSize: '1rem',
        lineHeight: 1,
        ...style,
      }}
      {...otherProps}
    />
  );
}
