<?php

arch()->preset()->php();

arch('the domain layer is independent of the http delivery layer')
    ->expect('App\Domain')
    ->not->toUse('App\Http');
