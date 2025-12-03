<?php

namespace App\Events;

use App\Models\Store;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StoreCreated
{
    use Dispatchable, SerializesModels;

    public $store;
    public $password;

    public function __construct(Store $store, $password = null)
    {
        $this->store = $store;
        $this->password = $password;
    }
}