// https://github.com/import-js/eslint-plugin-import/issues/1810

import { postMessage, registerHandler } from 'iframe-bridge/main';
import { useEffect, useState } from 'react';

import { useHomeContext } from './home_context.js';

interface AdminMessage {
  type: 'admin.connect';
  windowID: number;
}

interface HomeIframeProps {
  baseUrl?: string;
}

export default function HomeIframe(props: HomeIframeProps) {
  const { baseUrl } = props;
  const { database, iframePath, rocUrl, selectedSample, iframeMode } =
    useHomeContext();

  const [windowId, setWindowId] = useState<number>();

  useEffect(() => {
    registerHandler('admin', (message: AdminMessage) => {
      switch (message.type) {
        case 'admin.connect': {
          setWindowId(message.windowID);
          break;
        }
        default:
          throw new Error('unreachable');
      }
    });
  }, []);

  useEffect(() => {
    if (windowId === undefined) return;
    postMessage(
      'tab.data',
      {
        couchDB: {
          url: rocUrl,
          database,
        },
        uuid: selectedSample,
      },
      windowId,
    );
  }, [windowId, database, rocUrl, selectedSample]);

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {iframeMode !== 'closed' ? (
        <iframe
          key={selectedSample}
          allowFullScreen
          src={`${baseUrl || ''}${iframePath}`}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <div>Please select something</div>
      )}
    </div>
  );
}
