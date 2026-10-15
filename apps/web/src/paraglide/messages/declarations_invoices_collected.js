/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Declarations_Invoices_CollectedInputs */

const en_declarations_invoices_collected = /** @type {(inputs: Declarations_Invoices_CollectedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} invoice collected`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} invoices collected`);
	return /** @type {LocalizedString} */ ("declarations_invoices_collected");
};

const fr_declarations_invoices_collected = /** @type {(inputs: Declarations_Invoices_CollectedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} facture encaissée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} factures encaissées`);
	return /** @type {LocalizedString} */ ("declarations_invoices_collected");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} invoice collected" |
* | "other" | "{count} invoices collected" |
*
* @param {Declarations_Invoices_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_invoices_collected = /** @type {((inputs: Declarations_Invoices_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Invoices_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_invoices_collected(inputs)
	return en_declarations_invoices_collected(inputs)
});