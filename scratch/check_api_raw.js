const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let d = ''; res.on('data', c => d += c);
  res.on('end', async () => {
    const tabs = JSON.parse(d);
    const page = tabs.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `
            (async () => {
              const u = localStorage.getItem('user');
              const t = u ? JSON.parse(u).token : localStorage.getItem('token');
              const res = await fetch('/api/assistancerequests', {
                headers: { 'Authorization': 'Bearer ' + t }
              });
              return await res.json();
            })()
          `,
          awaitPromise: true,
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === 1) {
        console.log('FULL MSG:', JSON.stringify(msg, null, 2));
        process.exit(0);
      }
    };
  });
});
