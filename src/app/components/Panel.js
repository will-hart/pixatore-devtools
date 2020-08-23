import React, { Component } from 'react';
import "./Panel.css"

var globalBrowser = typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null;

export class Panel extends Component {
  constructor() {
    super();

    this.state = {
      data: {},
      lastFps: 0,
      fpsSmoothed: 0,
      events: []
    };

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
    const { events } = this.state

    events.push(data)
    this.setState({ events: events.slice(events.length - 20) })
  }

  processData(data) {
    const lastFps = 1000 / data

    // use EMA to smooth over 60ps, smoothing rate K
    const K = 2 / 5
    const nextFps = Math.floor(lastFps * K + this.state.fpsSmoothed * (1 - K))

    this.setState({ fpsSmoothed: nextFps, lastFps: Math.floor(lastFps) })
  }

  render() {
    const { data, events, fpsSmoothed, lastFps } = this.state;

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
      <div class="wrapper">
        <header>
          Executing at {lastFps}fps, recent average {fpsSmoothed}fps
      </header>
        <main>
          <div id="state">
            State
        </div>
          <div id="events">
            Events
        </div>
        </main>
      </div>
    );
  }
}
