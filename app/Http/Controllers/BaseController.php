<?php

namespace App\Http\Controllers;

use App\Traits\AutoApplyPermissionCheck;

class BaseController extends Controller
{
    use AutoApplyPermissionCheck;
}