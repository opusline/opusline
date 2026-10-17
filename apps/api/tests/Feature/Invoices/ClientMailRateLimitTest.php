<?php

declare(strict_types=1);

test('client e-mails are rationed per account, so the instance cannot be made a relay', function (string $route): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $invoiceId = draftFor($user, $client);
    $quoteId = quoteDraftFor($user, $client);
    $path = str_replace(['{invoice}', '{quote}'], [$invoiceId, $quoteId], $route);

    foreach (range(1, 10) as $attempt) {
        expect($this->actingAs($user)->postJson($path)->status())->not->toBe(429);
    }

    $this->actingAs($user)->postJson($path)->assertTooManyRequests();
})->with([
    'an invoice' => ['/api/invoicing/invoices/{invoice}/email'],
    'a reminder' => ['/api/invoicing/invoices/{invoice}/reminders/send'],
    'a quote' => ['/api/invoicing/quotes/{quote}/email'],
]);

test('one account sending its allowance leaves another account its own', function (): void {
    $sender = issuableAccount();
    $invoiceId = draftFor($sender, billableClient($sender));

    foreach (range(1, 10) as $attempt) {
        $this->actingAs($sender)->postJson("/api/invoicing/invoices/{$invoiceId}/email");
    }

    $other = issuableAccount();
    $otherInvoiceId = draftFor($other, billableClient($other));

    expect($this->actingAs($other)->postJson("/api/invoicing/invoices/{$otherInvoiceId}/email")->status())->not->toBe(429);
});
