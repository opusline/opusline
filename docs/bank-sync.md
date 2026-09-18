# Bank sync

Opusline can read your business account's movements straight from your bank
instead of waiting for you to export and import a statement file. It goes
through [Enable Banking](https://enablebanking.com), a licensed PSD2
account-information provider, using **your own** Enable Banking application:
Opusline never sees your bank login, and the data goes from your bank to your
instance.

Any bank Enable Banking reaches in your country works — Shine, Qonto, Revolut,
Boursorama and most French banks among them. Enable Banking lists some of them,
Shine included, as beta: its connector works, but may be less polished.

## What it costs

Nothing, as long as the application only reads accounts you own. Enable
Banking's *restricted* production mode is free and needs no contract: an
application in that mode can only reach the accounts its owner linked in
Enable Banking's portal, which is exactly the use here. Each Opusline account
brings its own application, so on an instance shared by several people each
one sets up their own.

## Setting it up

1. **Create an application.** Sign up at [enablebanking.com](https://enablebanking.com),
   open the control panel and register a new application, choosing the
   **production** environment. Your browser downloads a `.pem` file: that is the
   application's private key. Keep it; Enable Banking does not show it again.
2. **Whitelist the redirect URL.** Opusline shows it under **Settings →
   Integrations**. It is your instance's address followed by `/bank-account`,
   for instance `https://opusline.example.com/bank-account`. It must be `https`.
3. **Activate the application by linking your account.** In the control panel,
   use *Activate by linking accounts* and authorize your business account at
   your bank. Link only the account Opusline should follow: it keeps the
   connection step below from asking which one to use.
4. **Save the application in Opusline.** Under **Settings → Integrations**, paste
   the application ID and the contents of the `.pem` file (or import the file).
   Opusline asks Enable Banking about the application before saving it, and
   tells you what to fix if the key is refused, the redirect URL is missing or
   the application is not active yet.
5. **Connect your bank.** On the **Business account** page, choose *Connect my
   bank*, pick your bank, and authorize Opusline at the bank. You come back to
   the page, and the first sync runs right away.

## How the sync works

- **Every night at 05:00** (server time) the `scheduler` container reads the new
  booked movements of every connected account. **Sync** on the Business account
  page does the same on demand.
- Synced movements go through the same reconciliation as an imported statement:
  credits are matched to your sent invoices, debits to your expenses and
  subscriptions.
- They all sit on one statement row in **Imported statements**, which grows
  with each sync.
- The balance your bank reports is recorded like a statement's closing balance.
  A balance you typed yourself still wins, and syncs roll it forward.
- **Each day's movements come from one source.** A day an imported statement
  already covers is left to that statement, and importing a statement adds
  nothing for days the sync already holds — so importing before, or alongside,
  the sync never doubles a movement. The limit: movements booked *later on the
  day* of your last imported statement are not synced, since that day belongs
  to the file. If that matters, import that day's statement again once the day
  is over.
- The first sync reads up to **90 days back**, about what banks serve; later
  syncs re-read the last week, to catch card payments booked late.
- Only **booked** movements are read, not pending card payments.

## Limits worth knowing

- **Consent lasts up to 180 days**, the maximum PSD2 allows. The Business
  account page warns you two weeks before it ends. After that, choose
  *Reconnect* and authorize again at the bank. The sync resumes where it
  stopped.
- **Banks allow about four unattended reads a day** per account. The nightly
  sync uses one. A sync you start yourself does not count against it, because
  you are there. If a bank refuses anyway, the page says so and the next sync
  tries again.
- **One account per Opusline account.** If your authorization covers several,
  Opusline asks which one to follow.

## Disconnecting

*Disconnect* on the Business account page ends the consent at the bank.
Removing the application under **Settings → Integrations** does the same and
forgets the key. Either way, the movements already synced stay.
