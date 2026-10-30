fetch('https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js')
  .then(res => res.text())
  .then(src => {
    console.log('Quill 2.0 source size:', src.length);
    console.log('Contains table module:', src.includes('table'));
    console.log('Contains insertTable:', src.includes('insertTable'));
  });

