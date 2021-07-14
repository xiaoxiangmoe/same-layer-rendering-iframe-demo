import React, { useEffect, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';

function Counter({
  count,
  setCount,
  foo,
}: {
  readonly count: number;
  readonly setCount: (callback: (count: number) => number) => void;
  readonly foo: number;
}) {
  const [innerCount, setInnerCount] = useState(0);
  return (
    <div style={{ backgroundColor: 'red' }}>
      <div>
        count = {count}
        <button
          onClick={() => {
            setCount(x => x + 100);
          }}
        >
          count+100
        </button>
      </div>
      <div>foo = {foo}</div>
      <div>
        innerCount = {innerCount}
        <button
          onClick={() => {
            setInnerCount(x => x + 1);
          }}
        >
          innerCount+1
        </button>
      </div>
    </div>
  );
}

function App() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [counterIframeData, setCounterIframeData] = useState<
    | {
        readonly sender: 'my-webapp';
        readonly webappType: 'counter';
        readonly mountedId: string;
        readonly props: {
          readonly foo: number;
        };
      }
    | {
        readonly sender: 'my-webapp';
        readonly webappType: 'counter';
        readonly mountedId: undefined;
      }
  >({
    sender: 'my-webapp',
    webappType: 'counter',
    mountedId: undefined,
  });
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
        !(
          typeof e.data === 'object' &&
          e.data !== null &&
          e.data.sender === 'my-webapp'
        )
      ) {
        return;
      }

      setCounterIframeData(e.data);
    };
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const [count, setCount] = useState(0);

  return (
    <div>
      <button
        onClick={() => {
          setCount(x => x + 1);
        }}
      >
        +1
      </button>
      {count}
      <iframe src="/iframe.html" ref={ref}></iframe>
      {counterIframeData.mountedId &&
        ReactDOM.createPortal(
          <Counter
            count={count}
            setCount={setCount}
            foo={counterIframeData.props.foo}
          />,
          ref.current?.contentWindow?.document.getElementById(
            counterIframeData.mountedId
          )!
        )}
    </div>
  );
}

export default App;
