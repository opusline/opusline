/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Invoicing_Open_InvoicesInputs */

const en_invoicing_open_invoices = /** @type {(inputs: Invoicing_Open_InvoicesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} open invoice`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} open invoices`);
	return /** @type {LocalizedString} */ ("invoicing_open_invoices");
};

const fr_invoicing_open_invoices = /** @type {(inputs: Invoicing_Open_InvoicesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} facture ouverte`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} factures ouvertes`);
	return /** @type {LocalizedString} */ ("invoicing_open_invoices");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} open invoice" |
* | "other" | "{count} open invoices" |
*
* @param {Invoicing_Open_InvoicesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_open_invoices = /** @type {((inputs: Invoicing_Open_InvoicesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Open_InvoicesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_open_invoices(inputs)
	return en_invoicing_open_invoices(inputs)
});