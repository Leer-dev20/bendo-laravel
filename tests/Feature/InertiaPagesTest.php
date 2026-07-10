<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InertiaPagesTest extends TestCase
{
    use RefreshDatabase;
    public function test_home_page_renders(): void
    {
        $response = $this->get('/');

        $response->assertOk();
    }

    public function test_restaurants_page_renders(): void
    {
        $response = $this->get('/restaurants');

        $response->assertOk();
    }
}
