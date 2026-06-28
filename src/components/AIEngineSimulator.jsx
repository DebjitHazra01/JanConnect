import React, { useState } from 'react';
import { 
  Play, Cpu, Layers, Search, Sparkles, 
  Code, RefreshCw, CheckCircle, Database 
} from 'lucide-react';

export default function AIEngineSimulator({ issues, setIssues }) {
  const [currentStep, setCurrentStep] = useState(0); // 0: Idle, 1 to 7: Pipeline Steps
  const [logs, setLogs] = useState([
    { type: 'info', text: 'AI Ingestion Sandbox ready. Select a mock scenario to run ingestion simulation.' }
  ]);
  const [activeScenario, setActiveScenario] = useState(null);

  const scenarios = [
    {
      id: 'scen-1',
      name: 'Severe Water Main Burst',
      text: 'Water pipe burst at Sector 5 main junction. Flooding market place and cutting water supply to 500 households.',
      image: 'Water Pipe Leakage',
      category: 'Water',
      expectedScore: 92,
      department: 'Water & Sanitation'
    },
    {
      id: 'scen-2',
      name: 'Pothole Report (De-duplication demo)',
      text: 'Deep pothole on Sector 4 Main Road near high school. Posing vehicle accident risks.',
      image: 'Pothole / Road Damage',
      category: 'Road',
      expectedScore: 68,
      department: 'Public Works',
      isDuplicate: true
    },
    {
      id: 'scen-3',
      name: 'Sparks from Transformer',
      text: 'Transformer pole is producing massive sparks and loud humming noise. Electricity fluctuating in street 2B.',
      image: 'Power Line Sparks',
      category: 'Electricity',
      expectedScore: 84,
      department: 'Grid & Energy'
    }
  ];

  const addLog = (type, text) => {
    setLogs(prev => [...prev, { type, text }]);
  };

  const runSimulation = async (scenario) => {
    if (currentStep > 0) return; // Prevent double running
    
    setActiveScenario(scenario);
    setLogs([]);
    addLog('info', `>>> Initializing Ingestion Request: ${scenario.name}`);
    addLog('info', `Raw Input Text: "${scenario.text}"`);
    addLog('info', `Raw Attached Image: [${scenario.image}]`);

    // Step 1: NLP Parsing
    setCurrentStep(1);
    addLog('info', '[Step 1] NLP Engine: Running tokenization & named entity extraction...');
    await delay(1200);
    addLog('success', 'NLP Engine: Extracted core nouns: "water pipe", "flooding", "market place", "500 households". Detected Language: English.');

    // Step 2: Image Recognition
    setCurrentStep(2);
    addLog('info', `[Step 2] Image Recognition: Running Convolutional Neural Net on "${scenario.image}"...`);
    await delay(1200);
    addLog('success', `Image Recognition: Class label matches "${scenario.category === 'Water' ? 'Water Leakage' : scenario.category === 'Road' ? 'Road Pothole' : 'Electric Transformer'}" with 96.4% confidence.`);

    // Step 3: Classification
    setCurrentStep(3);
    addLog('info', '[Step 3] Classification Engine: Checking taxonomic categories...');
    await delay(1200);
    addLog('success', `Classification Engine: Routed to category [${scenario.category}] -> Department: "${scenario.department}"`);

    // Step 4: Priority Scoring
    setCurrentStep(4);
    addLog('info', '[Step 4] Priority Scoring Algorithm: Weighting factors (Affected Pop, Location Proximity, Asset type)...');
    await delay(1200);
    addLog('success', `Priority Score Calculated: [${scenario.expectedScore} / 100]. High risk factor due to public infrastructure proximity.`);

    // Step 5: De-duplication Check
    setCurrentStep(5);
    addLog('info', '[Step 5] De-duplication Database Check: Querying historical issues within 100-meter geo-radius...');
    await delay(1200);
    
    if (scenario.isDuplicate) {
      addLog('warning', 'De-duplication Match: Found active duplicate issue (WO-1024 "Sector 4 School Road Pothole").');
      addLog('warning', 'Action: Merging reports. Incremented affected population count by 350. Flagging MP Dashboard.');
      setCurrentStep(7); // Jump straight to finished since duplicate doesn't map new pin
      addLog('success', '>>> Simulation Run Completed (Duplicate merged). Database entry updated.');
      setTimeout(() => setCurrentStep(0), 4000);
      return;
    } else {
      addLog('success', 'De-duplication Match: 0 active conflicts found. Proceeding to digital twin insertion.');
    }

    // Step 6: Twin Mapping
    setCurrentStep(6);
    addLog('info', '[Step 6] Geospatial Layering: Geotagging coordinates & creating live digital twin node...');
    await delay(1200);
    // Generate Random coordinates for visual
    const x = Math.floor(Math.random() * 400) + 200;
    const y = Math.floor(Math.random() * 250) + 100;
    addLog('success', `Twin Mapping: Registered Node coordinates: Lat 12.9716, Lon 77.5946 -> Visual map pin placed at x:${x}, y:${y}`);

    // Step 7: Auto Routing & Dispatch
    setCurrentStep(7);
    addLog('info', `[Step 7] Workflow Manager: Creating draft Work Order & auto-assigning to ${scenario.department}...`);
    await delay(1200);
    
    const newId = `WO-${Date.now().toString().slice(-4)}`;
    const newIssue = {
      id: newId,
      title: scenario.name,
      description: scenario.text,
      category: scenario.category,
      priorityScore: scenario.expectedScore,
      status: 'Pending',
      affectedPopulation: Math.floor(Math.random() * 1000) + 400,
      estCost: scenario.expectedScore * 75,
      department: scenario.department,
      coordinates: { x, y },
      createdAt: new Date().toISOString()
    };

    setIssues(prev => [newIssue, ...prev]);
    addLog('success', `Workflow Manager: Work Order ${newId} Dispatched successfully! Queue updated.`);
    addLog('success', '>>> Simulation Run Completed. Twin database state synchronized.');
    
    setTimeout(() => {
      setCurrentStep(0);
      setActiveScenario(null);
    }, 3000);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Cpu style={{ color: 'var(--warning)', filter: 'drop-shadow(0 0 8px rgba(255, 183, 0, 0.4))' }} /> AI Pipeline Analysis Engine
        </h1>
        <p style={{ marginTop: '0.25rem' }}>Interactive visualization of raw citizen data ingestion, classification, scoring, and de-duplication</p>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Pipeline flowchart */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} style={{ color: 'var(--primary)' }} /> Live Data Pipeline
          </h2>

          {/* Steps Horizontal visualization */}
          <div className="pipeline-container">
            <div className="pipeline-steps">
              {/* Animated progress bar fill */}
              <div 
                className="step-flow-indicator" 
                style={{ width: `${currentStep > 0 ? ((currentStep - 1) / 6) * 90 + 5 : 0}%` }}
              ></div>

              {[
                { label: 'NLP Engine', step: 1 },
                { label: 'Image Vision', step: 2 },
                { label: 'Classification', step: 3 },
                { label: 'Priority Score', step: 4 },
                { label: 'De-duplication', step: 5 },
                { label: 'Twin Mapping', step: 6 },
                { label: 'Auto Routing', step: 7 }
              ].map((s) => {
                let statusClass = '';
                if (currentStep === s.step) statusClass = 'active';
                else if (currentStep > s.step) statusClass = 'completed';

                return (
                  <div key={s.step} className={`pipeline-step ${statusClass}`}>
                    <div className="step-node">
                      {currentStep > s.step ? <CheckCircle size={16} /> : s.step}
                    </div>
                    <span className="step-label">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trigger scenarios */}
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Select Scenario to Inject:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {scenarios.map(scen => (
                <div 
                  key={scen.id}
                  className="glass-panel-interactive"
                  onClick={() => runSimulation(scen)}
                  style={{
                    padding: '1rem',
                    border: activeScenario?.id === scen.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    background: activeScenario?.id === scen.id ? 'rgba(0,240,255,0.03)' : 'rgba(255,255,255,0.01)',
                    opacity: currentStep > 0 && activeScenario?.id !== scen.id ? 0.4 : 1,
                    pointerEvents: currentStep > 0 ? 'none' : 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{scen.name}</span>
                    <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {scen.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Console/Logs Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '350px' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={18} style={{ color: 'var(--primary)' }} /> Real-time System Logs
          </h2>
          
          <div className="console-panel">
            {logs.map((log, idx) => (
              <div key={idx} className={`console-line ${log.type}`}>
                {log.type === 'success' ? '[SUCCESS] ' : log.type === 'warning' ? '[WARN] ' : '[SYSTEM] '}
                {log.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Pipeline Rate: 450 requests/sec</span>
            {currentStep > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)' }} className="marker-pulse">
                <RefreshCw size={12} className="map-layer-accent" /> Simulating...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
