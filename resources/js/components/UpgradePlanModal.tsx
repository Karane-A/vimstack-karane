import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CreditCard, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatSuperadminCurrency } from '@/utils/helpers';

interface Plan {
  id: number;
  name: string;
  price: string;
  duration: string;
  description?: string;
  features?: string[];
  is_active?: boolean;
  is_current?: boolean;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planId: number) => void;
  plans: Plan[];
  currentPlanId?: number;
  companyName: string;
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  onConfirm,
  plans,
  currentPlanId,
  companyName
}: UpgradePlanModalProps) {
  const { t } = useTranslation();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  
  // Debug currency settings
  React.useEffect(() => {
    if (isOpen) {
      console.log('=== Modal Currency Debug ===');
      console.log('Plans:', plans);
      const testFormat = formatSuperadminCurrency(100);
      console.log('Test format result:', testFormat);
    }
  }, [isOpen]);
  
  // Initialize with current plan ID
  useEffect(() => {
    if (isOpen && plans && plans.length > 0) {
      // Find the current plan
      const currentPlan = plans.find(plan => plan.is_current === true);
      
      // If there's a current plan, select it
      if (currentPlan) {
        setSelectedPlanId(currentPlan.id);
      } else if (currentPlanId) {
        setSelectedPlanId(currentPlanId);
      } else {
        setSelectedPlanId(plans[0].id);
      }
    }
  }, [isOpen, plans, currentPlanId]);
  
  const handleConfirm = () => {
    if (selectedPlanId) {
      onConfirm(selectedPlanId);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("Upgrade Plan for")} {companyName}</DialogTitle>
          <DialogDescription>
            {t("Select a new plan for this company")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={selectedPlanId?.toString() || ""} 
            onValueChange={(value) => setSelectedPlanId(parseInt(value))}
            className="space-y-4"
          >
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex items-center space-x-3 rounded-lg border p-4 ${
                    selectedPlanId === plan.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                  } ${plan.is_current ? 'bg-blue-50' : ''}`}
                >
                  <div className="relative">
                    <RadioGroupItem 
                      value={plan.id.toString()} 
                      id={`plan-${plan.id}`} 
                      className="h-5 w-5"
                    />
                    {selectedPlanId === plan.id && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor={`plan-${plan.id}`}
                    className="flex flex-1 cursor-pointer items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <p className="text-base font-medium">{plan.name}</p>
                        {plan.is_current && (
                          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                            {t("Current")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="mr-1.5 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {(() => {
                            // Extract numeric value from formatted price (e.g., "$49.99" -> 49.99)
                            const numericPrice = parseFloat(plan.price.replace(/[^0-9.-]+/g, ''));
                            return isNaN(numericPrice) ? plan.price : formatSuperadminCurrency(numericPrice);
                          })()} / {plan.duration.toLowerCase()}
                        </p>
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      )}
                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-muted-foreground">
                              <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedPlanId || selectedPlanId === currentPlanId}
          >
            {t("Upgrade Plan")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}