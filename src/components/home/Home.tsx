import { HomeContextProvider } from './HomeContext';
import HomeHeader from './HomeHeader';
import HomeIframe from './HomeIframe';
import HomeNoSample from './HomeNoSample';
import HomeSamples from './HomeSamples';

export function Home() {
  return (
    <HomeContextProvider>
      <div className="flex flex-col w-screen h-screen">
        <HomeHeader />
        <div className="flex flex-row flex-1 mt-2 border-t border-neutral-300 ">
          <div className="flex flex-col w-48 px-2 pt-4 space-y-3 border-r h-100 border-neutral-300">
            <HomeNoSample />
            <HomeSamples />
          </div>
          <HomeIframe />
        </div>
      </div>
    </HomeContextProvider>
  );
}
