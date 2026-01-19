import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string | number;
        isUp: boolean;
        label?: string;
    };
}

export function MetricCard({ title, value, icon: Icon, trend }: MetricCardProps) {
    return (
        <div className="ds-metric-card">
            <div className="ds-metric-header">
                <span className="ds-metric-title">{title}</span>
                <Icon size={18} className="ds-metric-icon" strokeWidth={1.5} />
            </div>
            <div className="ds-metric-value">{value}</div>
            {trend && (
                <div className={`ds-trend ${trend.isUp ? 'ds-trend-up' : 'ds-trend-down'}`}>
                    {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{trend.value}</span>
                    {trend.label && <span className="text-muted-foreground ml-1">vs last month</span>}
                </div>
            )}
        </div>
    );
}
