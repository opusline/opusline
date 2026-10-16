# Feature flags

Unfinished features merge into `main` switched off, behind a flag, so a long
piece of work can land rung by rung without changing anything for current
users. Accounts can try a flagged feature early by opting into its beta.

## How a flag resolves

Each flag is a case of `App\Domain\Features\Enums\FeatureFlag`. Its key (for
example `invoicing`) is what Pennant stores, what the route middleware takes
and what the environment variable spells.

The instance decides first, through `config/features.php` (`FEATURE_<KEY>`):

| Value  | Who sees the feature                                         |
| ------ | ------------------------------------------------------------ |
| `on`   | every account                                                |
| `off`  | no account, whatever it chose                                |
| `beta` | the accounts that opted in, from Réglages → Avant-première |

`beta` is the default. A mistyped value counts as `off`. An account's choice
is stored by Laravel Pennant, in the `features` table, and only matters while
the flag is in `beta` (`App\Domain\Features\FeatureFlags`).

The API exposes the result in `UserData.features`, so the SPA knows a user's
flags as soon as it boots.

## Adding a flag

1. **The flag itself.** Add a case to `FeatureFlag`, with its key, and the key
   to `config/features.php`.
2. **Its copy.** Give it a title and a description in `FEATURE_COPY`
   (`apps/web/src/features/settings/components/beta-features-card.tsx`) and the
   catalogs.
3. **The API.** Put its routes behind `EnsureFeatureIsActive::class.':<key>'`.
   With the flag off they answer 404, as if they did not exist. Add the routes
   to the list in `FeatureFlagsTest`.
4. **The web app.**
   - Guard its screens in their route's `beforeLoad`, as `requireInvoicing`
     does.
   - Hide its entry points with `useFeature`.
   - Mark its surfaces with the « Bêta » badge.
5. **The tests.**
   - API: `phpunit.xml` switches the flag `on`, so the suites exercise it.
   - E2E: the stack keeps the default `beta`, and a spec about the feature
     opts in first (`joinInvoicingBeta`).

With the flag off, everything else must behave exactly as it did before the
feature.

## Releasing a feature

Removing the flag is part of the release:

1. Delete the case and its config key.
2. Delete the middleware on its routes, the route guards, the `useFeature`
   checks, the badge and the card copy.
3. Keep the code the flag guarded.
4. Write a migration that deletes the flag's rows from `features`.
