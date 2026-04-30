'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: boolean;
}

export default function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className={`admin-stat-card${accent ? ' admin-stat-accent' : ''}`}>
      <div className="admin-stat-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className="admin-stat-info">
        <span className="admin-stat-value">{value}</span>
        <span className="admin-stat-label">{label}</span>
      </div>
    </div>
  );
}
