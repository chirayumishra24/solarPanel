import React, { Suspense, lazy } from 'react';

const SunTrackerSetup = lazy(() => import('./activities/SunTrackerSetup'));
const SolarTeamWiring = lazy(() => import('./activities/SolarTeamWiring'));
const BudgetSpaceOptimizer = lazy(() => import('./activities/BudgetSpaceOptimizer'));
const SolarApplicationMatcher = lazy(() => import('./activities/SolarApplicationMatcher'));
const ManufacturerLab = lazy(() => import('./activities/ManufacturerLab'));
const SubsidyCalculator = lazy(() => import('./activities/SubsidyCalculator'));

const ACTIVITY_TITLES = {
  'sun-tracker': 'Sun Tracker Sandbox',
  'solar-wiring': 'Build the Solar Team',
  'space-optimizer': 'Roof Space Optimizer',
  'application-matcher': 'Solar Application Matcher',
  'manufacturer-lab': 'Manufacturer Comparison Lab',
  'subsidy-calculator': 'Subsidy Calculator',
};

export function ActivityBlock({ block }) {
  if (!block || !block.activityId) return null;

  const renderActivity = () => {
    switch (block.activityId) {
      case 'sun-tracker':
        return <SunTrackerSetup />;
      case 'solar-wiring':
        return <SolarTeamWiring />;
      case 'space-optimizer':
        return <BudgetSpaceOptimizer />;
      case 'application-matcher':
        return <SolarApplicationMatcher />;
      case 'manufacturer-lab':
        return <ManufacturerLab />;
      case 'subsidy-calculator':
        return <SubsidyCalculator />;
      default:
        return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Unknown Activity: {block.activityId}</div>;
    }
  };

  const title = ACTIVITY_TITLES[block.activityId] || 'Interactive Activity';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Simulation Title Card */}
      <div className="simulation-title-card">
        <div className="simulation-title-badge">
          <span className="simulation-title-icon">🔬</span>
        </div>
        <div className="simulation-title-text">SIMULATION</div>
        <div className="simulation-title-subtitle">{title}</div>
        <div className="simulation-title-glow" />
      </div>

      {/* Activity Container */}
      <div className="content-card activity-card" style={{ padding: '0', overflow: 'hidden', height: '700px', backgroundColor: '#0d1117', borderRadius: '0 0 15px 15px', border: '1px solid #30363d', borderTop: 'none' }}>
        <Suspense fallback={<div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading Interactive Activity...</div>}>
          {renderActivity()}
        </Suspense>
      </div>
    </div>
  );
}
