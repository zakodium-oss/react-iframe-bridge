import type { CSSProperties } from 'react';

export default function HomeSelector(props: {
  selected: boolean;
  onClick: () => void;
  text: string;
}) {
  const style: CSSProperties = {
    padding: '0.25rem',
    border: '1px solid #99a1af',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  };
  if (props.selected) {
    style.backgroundColor = '#f3f4f6';
    style.boxShadow = 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)';
  }
  return (
    <div style={style} onClick={props.onClick}>
      {props.text}
    </div>
  );
}
