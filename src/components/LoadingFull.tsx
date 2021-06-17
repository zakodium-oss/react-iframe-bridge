import Spinner from './Spinner';

export default function LoadingFull() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner className="w-10 h-10 text-alternative-500" />
    </div>
  );
}
