/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Invoices_Covered_CountInputs */

const en_invoices_covered_count = /** @type {(inputs: Invoices_Covered_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} tracked time will be marked as invoiced and leave “to invoice”.`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} tracked times will be marked as invoiced and leave “to invoice”.`);
	return /** @type {LocalizedString} */ ("invoices_covered_count");
};

const fr_invoices_covered_count = /** @type {(inputs: Invoices_Covered_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} temps saisi sera marqué comme facturé et disparaîtra de « à facturer ».`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} temps saisis seront marqués comme facturés et disparaîtront de « à facturer ».`);
	return /** @type {LocalizedString} */ ("invoices_covered_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} tracked time will be marked as invoiced and leave “to invoice”." |
* | "other" | "{count} tracked times will be marked as invoiced and leave “to invoice”." |
*
* @param {Invoices_Covered_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_covered_count = /** @type {((inputs: Invoices_Covered_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Covered_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_covered_count(inputs)
	return en_invoices_covered_count(inputs)
});