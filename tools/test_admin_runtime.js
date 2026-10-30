const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('tools/admin_script.jsx', 'utf-8');

fetch('https://unpkg.com/@babel/standalone/babel.min.js')
  .then(res => res.text())
  .then(babelSrc => {
    const rootEl = {
      innerHTML: '',
      children: [],
      appendChild: () => {},
      addEventListener: () => {},
      style: {}
    };

    const ctx = {
      window: {
        addEventListener: () => {},
        location: { hash: '#/' },
        localStorage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      },
      document: {
        getElementById: (id) => (id === 'root' ? rootEl : null),
        createElement: () => ({ style: {}, setAttribute: () => {} }),
        body: rootEl,
        head: rootEl,
        addEventListener: () => {}
      },
      navigator: { userAgent: 'node' },
      console: console,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval,
      fetch: () => Promise.resolve({ json: () => Promise.resolve([]) }),
      Quill: function() { return { on: () => {}, root: { innerHTML: '' } }; }
    };

    vm.createContext(ctx);
    vm.runInContext(babelSrc, ctx);

    // Mock React & ReactDOM
    const transformed = ctx.Babel.transform(code, { presets: ['react'] }).code;
    console.log('Transformed size:', transformed.length, 'bytes');

    // Run React check: check for any undefined identifiers or broken scopes
    try {
      new Function(transformed);
      console.log('Script parses into valid JS function without SyntaxError!');
    } catch (e) {
      console.error('Function parsing error:', e);
    }
  })
  .catch(err => console.error('Fetch error:', err));

