import React from 'react';
import Card from './Card';

export default function StatsCard({ title, value, hint }){
  return (
    <Card className="stats-card">
      <div className="stats-top">
        <div className="stats-title">{title}</div>
        <div className="stats-value">{value}</div>
      </div>
      {hint && <div className="stats-hint">{hint}</div>}
    </Card>
  );
}
