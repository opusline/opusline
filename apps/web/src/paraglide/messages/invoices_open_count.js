/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Invoices_Open_CountInputs */

const en_invoices_open_count = /** @type {(inputs: Invoices_Open_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} open invoice`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} open invoices`);
	return /** @type {LocalizedString} */ ("invoices_open_count");
};

const fr_invoices_open_count = /** @type {(inputs: Invoices_Open_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} facture ouverte`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} factures ouvertes`);
	return /** @type {LocalizedString} */ ("invoices_open_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} open invoice" |
* | "other" | "{count} open invoices" |
*
* @param {Invoices_Open_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_open_count = /** @type {((inputs: Invoices_Open_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Open_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_open_count(inputs)
	return en_invoices_open_count(inputs)
});