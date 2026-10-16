/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown>, late: NonNullable<unknown> }} Invoicing_Open_Invoices_LateInputs */

const en_invoicing_open_invoices_late = /** @type {(inputs: Invoicing_Open_Invoices_LateInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} open invoice · ${i?.late} late`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} open invoices · ${i?.late} late`);
	return /** @type {LocalizedString} */ ("invoicing_open_invoices_late");
};

const fr_invoicing_open_invoices_late = /** @type {(inputs: Invoicing_Open_Invoices_LateInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} facture ouverte · ${i?.late} en retard`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} factures ouvertes · ${i?.late} en retard`);
	return /** @type {LocalizedString} */ ("invoicing_open_invoices_late");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} open invoice · {late} late" |
* | "other" | "{count} open invoices · {late} late" |
*
* @param {Invoicing_Open_Invoices_LateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_open_invoices_late = /** @type {((inputs: Invoicing_Open_Invoices_LateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Open_Invoices_LateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_open_invoices_late(inputs)
	return en_invoicing_open_invoices_late(inputs)
});