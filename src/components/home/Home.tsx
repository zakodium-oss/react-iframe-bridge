import { useEffect } from 'react';

import { HomeContextProvider, useHomeDispatchContext } from './HomeContext';
import HomeHeader from './HomeHeader';
import HomeIframe from './HomeIframe';
import HomeNoSample from './HomeNoSample';
import HomeSamples from './HomeSamples';

export interface HomeProps {
  /**
   * URL of the rest-on-couch instance.
   * @default 'http://localhost:3000/api/fake-roc'
   */
  rocUrl?: string;
  /**
   * Name of the rest-on-couch database.
   * @default 'eln'
   */
  database?: string;
  /**
   * Base url loaded by the iframe
   */
  baseUrl?: string;
  /**
   * Default path the iframe should load, if no path is found in local storage
   */
  defaultPath?: string;
  /**
   * Opt out of selecting a sample / selecting no sample before loading the iframe.
   * The sample selection UI will be hidden and the iframe will automatically load without a selected sample.
   */
  noSampleSelection?: boolean;
}

export function Home(props: HomeProps) {
  const { baseUrl, noSampleSelection, rocUrl, database, defaultPath } = props;
  return (
    <HomeContextProvider
      rocUrl={rocUrl}
      database={database}
      defaultPath={defaultPath}
    >
      <HomeInternal noSampleSelection={noSampleSelection} baseUrl={baseUrl} />
    </HomeContextProvider>
  );
}

function HomeInternal(props: Pick<HomeProps, 'baseUrl' | 'noSampleSelection'>) {
  const homeDispatch = useHomeDispatchContext();
  useEffect(() => {
    if (props.noSampleSelection) {
      homeDispatch({
        type: 'OPEN_NO_SAMPLE',
      });
    }
  }, [props.noSampleSelection, homeDispatch]);
  return (
    <div className="flex flex-col w-screen h-screen">
      <HomeHeader />
      <div className="flex flex-row flex-1 mt-2 border-t border-neutral-300 min-h-0">
        {!props.noSampleSelection && (
          <div className="flex flex-col w-48 px-2 pt-4 space-y-3 border-r border-neutral-300 overflow-auto">
            <HomeNoSample />
            <HomeSamples />
          </div>
        )}
        <HomeIframe baseUrl={props.baseUrl} />
      </div>
    </div>
  );
}
