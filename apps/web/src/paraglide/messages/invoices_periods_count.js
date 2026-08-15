/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Invoices_Periods_CountInputs */

const en_invoices_periods_count = /** @type {(inputs: Invoices_Periods_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} period awaiting an invoice`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} periods awaiting an invoice`);
	return /** @type {LocalizedString} */ ("invoices_periods_count");
};

const fr_invoices_periods_count = /** @type {(inputs: Invoices_Periods_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} période en attente de facture`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} périodes en attente de facture`);
	return /** @type {LocalizedString} */ ("invoices_periods_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} period awaiting an invoice" |
* | "other" | "{count} periods awaiting an invoice" |
*
* @param {Invoices_Periods_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_periods_count = /** @type {((inputs: Invoices_Periods_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Periods_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_periods_count(inputs)
	return en_invoices_periods_count(inputs)
});