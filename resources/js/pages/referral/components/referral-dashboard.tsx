import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Copy, Check, Users, DollarSign, FileText, TrendingUp, Award, Clock } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { formatSuperadminCurrency } from '@/utils/helpers';


interface ReferralDashboardProps {
  userType: string;
  stats: any;
  referralLink?: string;
}

export default function ReferralDashboard({ userType, stats, referralLink }: ReferralDashboardProps) {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  const copyReferralLink = async () => {
    if (referralLink) {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success(t('Referral link copied to clipboard'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (userType === 'superadmin') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Referral Users')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReferralUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Pending Payouts')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayouts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Commission Paid')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSuperadminCurrency(stats.totalCommissionPaid)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Companies')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topCompanies?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('Top Referring Companies')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCompanies?.length > 0 ? (
                  stats.topCompanies.map((company: any, index: number) => (
                    <div key={company.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">{company.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{company.referral_count} {t('referrals')}</p>
                        <p className="text-sm text-green-600 font-medium">{formatSuperadminCurrency(company.total_earned)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>{t('No referring companies yet')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Monthly Performance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('Referral Signups')}</h4>
                  <div className="text-2xl font-bold">
                    {Object.values(stats.monthlyReferrals || {}).reduce((a: any, b: any) => a + b, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('This year')}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t('Payouts Processed')}</h4>
                  <div className="text-2xl font-bold">
                    {formatSuperadminCurrency(stats.totalMonthlyPayouts || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('This year')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Total Referrals')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Total Earned')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSuperadminCurrency(stats.totalEarned)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Available Balance')}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSuperadminCurrency(stats.availableBalance)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Payout Requests')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayoutRequests}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('Your Referral Link')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={referralLink || ''}
              readOnly
              className="flex-1"
            />
            <Button
              onClick={copyReferralLink}
              variant="outline"
              size="icon"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {t('Share this link to earn commissions when users sign up and purchase plans')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}