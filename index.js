import esbuild from './node_modules/esbuild-wasm/esm/browser.js';

navigator.serviceWorker.register('service-worker.js');
  


async function compile(code) {
  await navigator.serviceWorker.ready
  await esbuild.initialize({
    wasmURL: '/node_modules/esbuild-wasm/esbuild.wasm',
  }).then(console.log).catch(console.error)
  // await esbuild.initialize({
  //   wasmURL: 'https://cdn.jsdelivr.net/npm/@netlify/esbuild-wasm@0.13.6/esbuild.wasm',
  // });

  const options = {
    loader: 'jsx'
  };

  try {
    const result = await esbuild.transform(code, options);
    return result.code;
  } catch (err) {
    console.log(err);
  }
}

const code = `
  import React from 'https://cdn.skypack.dev/react';
  import ReactDOM from 'https://cdn.skypack.dev/react-dom';


  function App() {
    const [count, setCount] = React.useState(0);

    const clicked = () => {
      setCount(count + 1)
    }

    return (
      <div className='container'>
        <div>Testing</div>
        <button onClick={clicked}>Clicked me times {count}</button>
      </div>
    );
  }

  ReactDOM.render(<App />, document.body);
  `;

compile(code).then(compiled => {
  console.log(compiled);
  const script = document.createElement('script');
  script.type = 'module';
  script.innerHTML = compiled;

  document.head.appendChild(script);  
});