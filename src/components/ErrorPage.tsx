import { ReactNode } from 'react';

interface ErrorPageProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <div className="max-w-2xl m-auto md:max-w-4xl">
      <div className="flex justify-between px-2 pt-4">
        <div className="min-w-0">
          <h1 className="text-5xl font-bold sm:mt-16 text-primary-900">
            {props.title}
          </h1>
          <h2 className="mt-16 text-lg sm:mt-8">{props.subtitle}</h2>
          <div className="mt-4">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
