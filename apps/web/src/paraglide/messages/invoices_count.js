/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Invoices_CountInputs */

const en_invoices_count = /** @type {(inputs: Invoices_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} invoice`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} invoices`);
	return /** @type {LocalizedString} */ ("invoices_count");
};

const fr_invoices_count = /** @type {(inputs: Invoices_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} facture`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} factures`);
	return /** @type {LocalizedString} */ ("invoices_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} invoice" |
* | "other" | "{count} invoices" |
*
* @param {Invoices_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_count = /** @type {((inputs: Invoices_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_count(inputs)
	return en_invoices_count(inputs)
});