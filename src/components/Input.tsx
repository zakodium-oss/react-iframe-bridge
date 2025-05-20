import clsx from 'clsx';
import type { ChangeEvent } from 'react';

interface InputProps {
  name: string;
  className?: string;
  value: string;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  return (
    <input
      name={props.name}
      type="text"
      className={clsx(
        'appearance-none border border-neutral-600 bg-white px-3 py-2 text-base leading-none',
        props.className,
      )}
      value={props.value}
      readOnly={props.readOnly}
      onChange={props.onChange}
    />
  );
}
