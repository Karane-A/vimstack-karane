import React from 'react';
import PlanForm from './form';

interface Props {
  hasDefaultPlan: boolean;
}

export default function CreatePlan({ hasDefaultPlan }: Props) {
  return <PlanForm hasDefaultPlan={hasDefaultPlan} />;
}