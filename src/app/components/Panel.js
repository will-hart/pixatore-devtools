import React, { Component } from 'react';

var globalBrowser = typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null;

const DEFAULT_SETTINGS = {
  showDebug: false,
  showConsole: false,
  showComponents: true,
  showEntities: true,
  showQueries: true,
  showSystems: true,
  showGraphsStatus: {
    all: false,
    groups: {
      systems: false,
      components: false,
      queries: false,
      entities: false
    },
    individuals: {
      systems: {},
      components: {},
      queries: {},
      entities: {}
    }
  },
  showStats: false,
  showHighlight: true,
};

class App extends Component {

  loadSettingsFromStorage() {
    // @todo Use localstorage if running from web?
    if (globalBrowser.storage) {
      globalBrowser.storage.local.get(["settings"], (results) => {
        var settings = results.settings;
        settings = Object.assign({}, DEFAULT_SETTINGS, settings);
        this.setState({
          showDebug: settings.showDebug,
          showConsole: settings.showConsole,
          showComponents: settings.showComponents,
          showEntities: settings.showEntities,
          showQueries: settings.showQueries,
          showSystems: settings.showSystems,
          showGraphsStatus: settings.showGraphsStatus,
          showStats: settings.showStats,
          showHighlight: settings.showHighlight
        });
      });
    }
  }

  saveSettingsToStorage() {
    // @todo Use localstorage if running from web?
    if (globalBrowser.storage) {
      globalBrowser.storage.local.set({
        settings: {
          showDebug: this.state.showDebug,
          showConsole: this.state.showConsole,
          showComponents: this.state.showComponents,
          showEntities: this.state.showEntities,
          showQueries: this.state.showQueries,
          showSystems: this.state.showSystems,
          showGraphsStatus: this.state.showGraphsStatus,
          showStats: this.state.showStats,
          showHighlight: this.state.showHighlight
        }
      });
    }
  }

  constructor() {
    super();

    this.stats = {
      components: {},
      queries: {},
      systems: {}
    };

    this.commandsHistory = [];

    this.state = {
      remoteConnectionData: {
        remoteId: ''
      },
      remoteConnection: false,
      remoteConnectionMessage: '',
      ecsyVersion: '',
      worldExist: false,

      showDebug: false,
      showConsole: false,
      showComponents: true,
      showEntities: true,
      showQueries: true,
      showSystems: true,
      showStats: false,
      showHighlight: true,

      showGraphsStatus: {
        all: false,
        groups: {
          systems: false,
          components: false,
          queries: false,
          entities: false
        },
        individuals: {
          systems: {},
          components: {},
          queries: {},
          entities: {}
        }
      },
      overComponents: [],
      prevOverComponents: [],
      overQueries: [],
      prevOverQueries: [],
      overSystem: false,
      graphConfig: {
        components: {
          globalMin: Number.MAX_VALUE,
          globalMax: Number.MIN_VALUE
        },
        systems: {
          globalMin: Number.MAX_VALUE,
          globalMax: Number.MIN_VALUE
        },
        queries: {
          globalMin: Number.MAX_VALUE,
          globalMax: Number.MIN_VALUE
        },
      }
    };

    this.loadSettingsFromStorage();

    this.commandsHistoryPos = 0;

    if (globalBrowser && globalBrowser.devtools) {
      var backgroundPageConnection = globalBrowser.runtime.connect({
        name: "devtools"
      });

      backgroundPageConnection.postMessage({
        name: 'init',
        tabId: globalBrowser.devtools.inspectedWindow.tabId
      });

      backgroundPageConnection.onMessage.addListener(m => {
        if (m.method === 'refreshData') {
          this.processData(m.data);
        } else if (m.method === 'disabled') {
          this.setState({ data: null });
        } else if (m.method === 'eventBusEvent') {
          this.processEventBusEvent(m.data)
        }
      });
    } else {
      window.addEventListener('refreshData', (evt) => {
        this.processData(evt.detail);
      });
    }
  }

  processEventBusEvent(data) {
    console.log('EBE', data)
  }

  processData(data) {
    console.log('EDU', data)
    this.setstate({ data })
  }

  render() {
    const { data } = this.state;

    if (!data && this.state.remoteConnection) {
      return (
        <div style={{ backgroundColor: '#AAA' }}>
          <h1>Remote connection done!</h1>
          <h2>{this.state.remoteConnectionMessage}</h2>
        </div>
      );
    }

    if (!data) {
      return (
        <p>Pixatore not detected</p>
      );
    }

    return (
      <div id="header">Pixatore dev tools</div>
    );
  }
}

export default App;
