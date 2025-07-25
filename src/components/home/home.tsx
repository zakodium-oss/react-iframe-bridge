import { useEffect } from 'react';

import { HomeContextProvider, useHomeDispatchContext } from './home_context.js';
import HomeHeader from './home_header.js';
import HomeIframe from './home_iframe.js';
import HomeNoSample from './home_no_sample.js';
import HomeSamples from './home_samples.js';

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
   * List of possible page paths. Used for autocomplete in the path input.
   */
  pages?: string[];
  /**
   * Opt out of selecting a sample / selecting no sample before loading the iframe.
   * The sample selection UI will be hidden and the iframe will automatically load without a selected sample.
   */
  noSampleSelection?: boolean;
}

export function Home(props: HomeProps) {
  const { baseUrl, noSampleSelection, rocUrl, database, defaultPath, pages } =
    props;
  return (
    <HomeContextProvider
      rocUrl={rocUrl}
      database={database}
      defaultPath={defaultPath}
    >
      <HomeInternal
        noSampleSelection={noSampleSelection}
        baseUrl={baseUrl}
        pages={pages}
      />
    </HomeContextProvider>
  );
}

function HomeInternal(
  props: Pick<HomeProps, 'baseUrl' | 'noSampleSelection' | 'pages'>,
) {
  const { noSampleSelection, baseUrl, pages } = props;
  const homeDispatch = useHomeDispatchContext();
  useEffect(() => {
    if (noSampleSelection) {
      homeDispatch({
        type: 'OPEN_NO_SAMPLE',
      });
    }
  }, [noSampleSelection, homeDispatch]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
      }}
    >
      <HomeHeader pages={pages} />
      <div
        style={{
          marginTop: '0.5rem',
          display: 'flex',
          minHeight: 0,
          flex: 1,
          flexDirection: 'row',
          borderTop: '1px solid #d1d5dc',
        }}
      >
        {!noSampleSelection && (
          <div
            style={{
              display: 'flex',
              width: '12rem',
              flexDirection: 'column',
              gap: '0.75rem',
              overflow: 'auto',
              borderRight: '1px solid #d1d5dc',
              paddingInline: '0.5rem',
              paddingTop: '1rem',
            }}
          >
            <HomeNoSample />
            <HomeSamples />
          </div>
        )}
        <HomeIframe baseUrl={baseUrl} />
      </div>
    </div>
  );
}
