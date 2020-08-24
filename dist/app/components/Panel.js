import React, { Component } from 'react';
import { FiActivity } from "react-icons/fi";
import JSONTree from 'react-json-tree'
import { Sparklines, SparklinesLine, SparklinesSpots, SparklinesReferenceLine } from 'react-sparklines'

import "./Panel.css"

var globalBrowser = typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null;

export class Panel extends Component {
  fpsUpdateCounter = 0
  fptTotal = 0

  constructor() {
    super();

    this.state = {
      events: [],
      world: null,
      fps: [],
      entityCounts: []
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
          this.setState({ events: [], world: null, fps: [] });
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
    const MAX_EVENTS = 20
    const newEvents = [...(events.length === MAX_EVENTS ? events.slice(1) : events), data]

    this.setState({ events: newEvents })
  }

  processData(data) {
    const FPS_SMOOTHING = 30
    const HISTORY_LENGTH = 25

    this.fpsTotal += 1000 / data.deltaT
    this.fpsUpdateCounter++
    const world = JSON.parse(data.world)

    if (this.fpsUpdateCounter > FPS_SMOOTHING) {
      let fps = [...this.state.fps, Math.floor(this.fpsTotal / FPS_SMOOTHING)]
      fps = fps.slice(Math.max(0, fps.length - HISTORY_LENGTH))

      let entityCounts = [...this.state.entityCounts, world.length]
      entityCounts = entityCounts.slice(Math.max(0, entityCounts.length - HISTORY_LENGTH))

      this.fpsUpdateCounter = 0
      this.fpsTotal = 0

      this.setState({ fps, entityCounts, world })
    } else {
      this.setState({ world })
    }
  }

  render() {
    const { events, entityCounts, fps, world } = this.state;

    if (!events && !world) {
      return (
        <p>Pixatore not detected</p>
      );
    }

    return (
      <div class="wrapper">
        <header>
          <div className="stat">
            <span className="stat-value">{fps[fps.length - 1] || '?'}</span>
            <span className="stat-label">FPS</span>
          </div>
          <div className="thin-sparkline">
            {fps.length < 20 ? <FiActivity /> : <Sparklines data={fps} width="150" height="40" min={0} max={150}>
              <SparklinesLine color="#1c8cdc" />
              <SparklinesSpots />
              <SparklinesReferenceLine type="mean" />
            </Sparklines>}
          </div>

          <div className="stat">
            <span className="stat-value">{entityCounts[entityCounts.length - 1] || '?'}</span>
            <span className="stat-label">ENTS</span>
          </div>
          <div className="thin-sparkline">
            {entityCounts.length < 20 ? <FiActivity /> : <Sparklines data={entityCounts} width="150" height="40" min={0}>
              <SparklinesLine color="#1c8cdc" />
              <SparklinesSpots />
              <SparklinesReferenceLine type="mean" />
            </Sparklines>}
          </div>
        </header>

        <main>
          <div id="state">
            <h3>State</h3>
            <JSONTree data={world} />
          </div>
          <div id="events">
            <h3>Events</h3>
            <p>Storing {events.length} events</p>
            <ul>
              {events.map((evt, idx) => (<li key={`evt_${idx}`}>{evt.type}</li>))}
            </ul>
          </div>
        </main>
      </div>
    );
  }
}
