import React from 'react';
import Card from './Card';

export default function ChartCard({ title, children }){
  return (
    <Card className="chart-card">
      <div className="chart-head">
        <div className="chart-title">{title}</div>
      </div>
      <div className="chart-body">{children}</div>
    </Card>
  );
}
