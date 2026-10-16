/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Expenses_Platform_Inbox_CountInputs */

const en_expenses_platform_inbox_count = /** @type {(inputs: Expenses_Platform_Inbox_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} supplier invoice this month, filed with its PDF.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} supplier invoices this month, filed with their PDF.`);
	return /** @type {LocalizedString} */ ("expenses_platform_inbox_count");
};

const fr_expenses_platform_inbox_count = /** @type {(inputs: Expenses_Platform_Inbox_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} facture fournisseur ce mois-ci, classée avec son PDF.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} factures fournisseurs ce mois-ci, classées avec leur PDF.`);
	return /** @type {LocalizedString} */ ("expenses_platform_inbox_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} supplier invoice this month, filed with its PDF." |
* | "other" | "{count} supplier invoices this month, filed with their PDF." |
*
* @param {Expenses_Platform_Inbox_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_platform_inbox_count = /** @type {((inputs: Expenses_Platform_Inbox_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Platform_Inbox_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_platform_inbox_count(inputs)
	return en_expenses_platform_inbox_count(inputs)
});