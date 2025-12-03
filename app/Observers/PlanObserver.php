<?php

namespace App\Observers;

use App\Models\Plan;

class PlanObserver
{
    /**
     * Handle the Plan "deleting" event.
     */
    public function deleting(Plan $plan): bool
    {
        // Prevent deletion of default plan
        if ($plan->is_default) {
            return false;
        }

        return true;
    }
}