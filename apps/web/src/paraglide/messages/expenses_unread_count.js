/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Expenses_Unread_CountInputs */

const en_expenses_unread_count = /** @type {(inputs: Expenses_Unread_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} receipt to link`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} receipts to link`);
	return /** @type {LocalizedString} */ ("expenses_unread_count");
};

const fr_expenses_unread_count = /** @type {(inputs: Expenses_Unread_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} facture à lier`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} factures à lier`);
	return /** @type {LocalizedString} */ ("expenses_unread_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} receipt to link" |
* | "other" | "{count} receipts to link" |
*
* @param {Expenses_Unread_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_unread_count = /** @type {((inputs: Expenses_Unread_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Unread_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_unread_count(inputs)
	return en_expenses_unread_count(inputs)
});