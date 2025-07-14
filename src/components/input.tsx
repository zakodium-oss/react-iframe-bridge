import type { CSSProperties, ChangeEvent } from 'react';

interface InputProps {
  name: string;
  style?: CSSProperties;
  value: string;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  return (
    <input
      name={props.name}
      type="text"
      style={{
        appearance: 'none',
        border: '1px solid #4a5565',
        backgroundColor: 'white',
        paddingInline: '0.75rem',
        paddingBlock: '0.5rem',
        fontSize: '1rem',
        lineHeight: 1,
        ...props.style,
      }}
      value={props.value}
      readOnly={props.readOnly}
      onChange={props.onChange}
    />
  );
}
