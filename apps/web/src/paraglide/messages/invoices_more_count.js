/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Invoices_More_CountInputs */

const en_invoices_more_count = /** @type {(inputs: Invoices_More_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`+ ${i?.count} more`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`+ ${i?.count} more`);
	return /** @type {LocalizedString} */ ("invoices_more_count");
};

const fr_invoices_more_count = /** @type {(inputs: Invoices_More_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`+ ${i?.count} autre`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`+ ${i?.count} autres`);
	return /** @type {LocalizedString} */ ("invoices_more_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "+ {count} more" |
* | "other" | "+ {count} more" |
*
* @param {Invoices_More_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_more_count = /** @type {((inputs: Invoices_More_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_More_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_more_count(inputs)
	return en_invoices_more_count(inputs)
});