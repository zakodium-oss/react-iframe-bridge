import { registerHandler, postMessage } from 'iframe-bridge/main';
import { useEffect, useState } from 'react';

import { useHomeContext } from './HomeContext';

interface AdminMessage {
  type: 'admin.connect';
  windowID: number;
}

export default function HomeIframe() {
  const { database, iframePage, rocUrl, selectedSample, iframeMode } =
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
    <div className="flex items-center justify-center flex-1">
      {iframeMode !== 'closed' ? (
        <iframe
          key={selectedSample}
          allowFullScreen
          src={`http://localhost:3000${iframePage}`}
          className="w-full h-full"
        />
      ) : (
        <div>Please select something</div>
      )}
    </div>
  );
}
