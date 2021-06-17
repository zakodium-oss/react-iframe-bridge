import clsx from 'clsx';

export default function HomeSelector(props: {
  selected: boolean;
  onClick: () => void;
  text: string;
}) {
  return (
    <div
      className={clsx(
        'p-1 border rounded cursor-pointer border-neutral-400',
        props.selected && 'bg-primary-50 shadow-inner',
      )}
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
}
