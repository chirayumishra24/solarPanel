import React, { Suspense, lazy } from 'react';

const SunTrackerSetup = lazy(() => import('./activities/SunTrackerSetup'));
const SolarTeamWiring = lazy(() => import('./activities/SolarTeamWiring'));
const BudgetSpaceOptimizer = lazy(() => import('./activities/BudgetSpaceOptimizer'));
const SolarApplicationMatcher = lazy(() => import('./activities/SolarApplicationMatcher'));
const ManufacturerLab = lazy(() => import('./activities/ManufacturerLab'));
const SubsidyCalculator = lazy(() => import('./activities/SubsidyCalculator'));

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

  return (
    <div className="content-card activity-card" style={{ padding: '0', overflow: 'hidden', height: '700px', backgroundColor: '#0d1117', borderRadius: '15px', border: '1px solid #30363d' }}>
      <Suspense fallback={<div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading Interactive Activity...</div>}>
        {renderActivity()}
      </Suspense>
    </div>
  );
}
