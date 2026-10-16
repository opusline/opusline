/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Expenses_Platform_Inbox_SyncedInputs */

const en_expenses_platform_inbox_synced = /** @type {(inputs: Expenses_Platform_Inbox_SyncedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} new supplier invoice recorded.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} new supplier invoices recorded.`);
	return /** @type {LocalizedString} */ ("expenses_platform_inbox_synced");
};

const fr_expenses_platform_inbox_synced = /** @type {(inputs: Expenses_Platform_Inbox_SyncedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} nouvelle facture fournisseur enregistrée.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} nouvelles factures fournisseurs enregistrées.`);
	return /** @type {LocalizedString} */ ("expenses_platform_inbox_synced");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} new supplier invoice recorded." |
* | "other" | "{count} new supplier invoices recorded." |
*
* @param {Expenses_Platform_Inbox_SyncedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_platform_inbox_synced = /** @type {((inputs: Expenses_Platform_Inbox_SyncedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Platform_Inbox_SyncedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_platform_inbox_synced(inputs)
	return en_expenses_platform_inbox_synced(inputs)
});