'use strict';

if (!window.__PIXATORE_DEVTOOLS_INJECTED) {

  function sendMessage(type, data) {
    window.postMessage({
      id: 'pixatore-devtools',
      method: type,
      data,
    }, '*');
  }

  window.addEventListener('pixatore-world-created', e => {
    if (!window.__PIXATORE_DEVTOOLS) {
      window.__PIXATORE_DEVTOOLS = {
        world: null,
        eventBus: null,
      };
    }

    window.__PIXATORE_DEVTOOLS.world = e.detail.world;
    window.__PIXATORE_DEVTOOLS.eventBus = e.detail.eventBus;

    class DevToolsSystem {
      queryMap = {}

      constructor() {
        window.__PIXATORE_DEVTOOLS.eventBus.subscribe('*', (event) => {
          // log('Received event', event.type)
          sendMessage('eventBusEvent', event)
        })
      }

      execute(deltaT, world) {
        // log('Updating world', JSON.stringify(world.entities))
        sendMessage('refreshData', { deltaT, world: JSON.stringify(world.entities) });
      }
    }

    window.__PIXATORE_DEVTOOLS.world.registerSystem(new DevToolsSystem())
    sendMessage('worldCreated', {});
  });

  function log() {
    var args = Array.from(arguments);
    args.unshift('background: #9999ff; color: #ffffff;');
    args.unshift(`%c Pixatore Devtools `);

    console.log.apply(console, args);
  }

  log('PixatoreInspector injected', document.location.href);

  window.__PIXATORE_DEVTOOLS_INJECTED = true;
}
