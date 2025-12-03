<?php

namespace App\Console\Commands;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Console\Command;

class AssignDefaultPlanToUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:assign-default-plan';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign default plan to company users without a plan';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $defaultPlan = Plan::getDefaultPlan();
        
        if (!$defaultPlan) {
            $this->error(__('No default plan found. Please create a default plan first.'));
            return 1;
        }
        
        $count = User::where('type', 'company')
            ->whereNull('plan_id')
            ->update(['plan_id' => $defaultPlan->id, 'plan_is_active' => 1]);
            
        $this->info("Successfully assigned default plan to {$count} users.");
        
        return 0;
    }
}