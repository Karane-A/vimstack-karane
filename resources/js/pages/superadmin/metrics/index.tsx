import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { DataTable } from '@/components/ui/data-table';
import { formatCurrency } from '@/utils/helpers';
import {
    DollarSign,
    Users,
    TrendingUp,
    UserMinus,
    Clock,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    PieChart,
    Target,
    Zap,
    Users2,
    Briefcase,
    ShoppingCart
} from 'lucide-react';

interface MetricsProps {
    ceoMetrics: {
        active_paying_merchants: number;
        mrr: number;
        net_growth: number;
        churn_rate: number;
        grace_period: number;
        failed_payments: { count: number; value: number };
        plan_mix: Array<{ name: string; count: number; value: number }>;
    };
    opsMetrics: {
        time_to_first_order_hours: number;
        orders_per_merchant: number;
        payment_success_rate: number;
    };
    growthMetrics: {
        merchants_by_source: Array<{ used_referral_code: string | null; count: number }>;
        partner_conversion: number;
        commission_cost: number;
    };
}

export default function MetricsIndex({ ceoMetrics, opsMetrics, growthMetrics }: MetricsProps) {
    const { t } = useTranslation();

    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto pb-20">
            <Head title={t('Superadmin Metrics')} />

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {t('System Metrics')}
                </h1>
                <p className="text-slate-500 font-medium">{t('Comprehensive overview of platform performance and growth.')}</p>
            </div>

            <Tabs defaultValue="ceo" className="space-y-6">
                <TabsList className="bg-slate-100/50 p-1 rounded-xl">
                    <TabsTrigger value="ceo" className="rounded-lg px-6 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {t('CEO View')}
                    </TabsTrigger>
                    <TabsTrigger value="ops" className="rounded-lg px-6 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Zap className="w-4 h-4 mr-2" />
                        {t('Ops View')}
                    </TabsTrigger>
                    <TabsTrigger value="growth" className="rounded-lg px-6 font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Target className="w-4 h-4 mr-2" />
                        {t('Growth View')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="ceo" className="space-y-8">
                    {/* CEO Top Row Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title={t('Active Paying Merchants')}
                            value={ceoMetrics.active_paying_merchants.toLocaleString()}
                            icon={Users}
                            description={t('Paid + active in last 30 days')}
                        />
                        <MetricCard
                            title={t('Monthly Recurring Revenue')}
                            value={formatCurrency(ceoMetrics.mrr)}
                            icon={DollarSign}
                            description={t('Total paid subscriptions')}
                        />
                        <MetricCard
                            title={t('Net Merchant Growth')}
                            value={ceoMetrics.net_growth.toString()}
                            icon={TrendingUp}
                            trend={{
                                value: ceoMetrics.net_growth >= 0 ? t('Growth') : t('Decline'),
                                isUp: ceoMetrics.net_growth >= 0
                            }}
                        />
                        <MetricCard
                            title={t('Churn Rate (Monthly)')}
                            value={`${ceoMetrics.churn_rate}%`}
                            icon={UserMinus}
                            trend={{
                                value: ceoMetrics.churn_rate < 5 ? t('Healthy') : t('High'),
                                isUp: ceoMetrics.churn_rate < 5
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard
                            title={t('Accounts in Grace Period')}
                            value={ceoMetrics.grace_period.toString()}
                            icon={Clock}
                            description={t('Pending payment past 7 days')}
                        />
                        <MetricCard
                            title={t('Failed Payments Count')}
                            value={ceoMetrics.failed_payments.count.toString()}
                            icon={AlertCircle}
                            description={t('Failed this month')}
                        />
                        <MetricCard
                            title={t('Failed Payments Value')}
                            value={formatCurrency(ceoMetrics.failed_payments.value)}
                            icon={DollarSign}
                            description={t('Potential cash leakage')}
                        />
                    </div>

                    {/* Plan Mix Table */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-xl">{t('Plan Mix breakdown')}</CardTitle>
                            <CardDescription>{t('Distribution of merchants across subscription plans.')}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable
                                columns={[
                                    {
                                        key: 'name',
                                        header: t('Plan Name'),
                                        render: (row) => <span className="font-bold text-slate-900">{row.name}</span>
                                    },
                                    {
                                        key: 'count',
                                        header: t('Merchant Count'),
                                        render: (row) => <span className="font-medium">{row.count}</span>
                                    },
                                    {
                                        key: 'value',
                                        header: t('Monthly Value'),
                                        render: (row) => <span className="font-bold text-indigo-600">{formatCurrency(row.value)}</span>
                                    },
                                ]}
                                data={ceoMetrics.plan_mix}
                                keyExtractor={(item) => item.name}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ops" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard
                            title={t('Time to First Order')}
                            value={`${opsMetrics.time_to_first_order_hours}h`}
                            icon={Clock}
                            description={t('Avg hours from signup to sale')}
                        />
                        <MetricCard
                            title={t('Orders per Merchant')}
                            value={opsMetrics.orders_per_merchant.toString()}
                            icon={ShoppingCart}
                            description={t('Platform usage intensity')}
                        />
                        <MetricCard
                            title={t('Payment Success Rate')}
                            value={`${opsMetrics.payment_success_rate}%`}
                            icon={CheckCircle2}
                            trend={{
                                value: opsMetrics.payment_success_rate > 90 ? t('Good') : t('Reviewing'),
                                isUp: opsMetrics.payment_success_rate > 90
                            }}
                        />
                    </div>

                    <Card className="rounded-2xl border-slate-100 shadow-sm p-8 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <BarChart3 className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">{t('Operational Deep Dive')}</h3>
                            <p className="text-slate-500 max-w-sm">{t('More detailed operational tracking for support volume and infrastructure health is being integrated.')}</p>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="growth" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MetricCard
                            title={t('Partner Conversion')}
                            value={growthMetrics.partner_conversion.toString()}
                            icon={Users2}
                            description={t('Referred users on paid plans')}
                        />
                        <MetricCard
                            title={t('Commission Cost')}
                            value={formatCurrency(growthMetrics.commission_cost)}
                            icon={DollarSign}
                            description={t('Total commissions earned/payouts')}
                        />
                    </div>

                    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-xl">{t('Merchants by Source')}</CardTitle>
                            <CardDescription>{t('Tracking where our most successful merchants are coming from.')}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable
                                columns={[
                                    {
                                        key: 'source',
                                        header: t('Source / Referral Code'),
                                        render: (row) => <span className="font-bold text-slate-900">{row.used_referral_code || t('Direct / Unknown')}</span>
                                    },
                                    {
                                        key: 'count',
                                        header: t('Merchant Count'),
                                        render: (row) => <span className="font-medium">{row.count}</span>
                                    },
                                ]}
                                data={growthMetrics.merchants_by_source}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

MetricsIndex.layout = (page: React.ReactNode) => <AppSidebarLayout>{page}</AppSidebarLayout>;
