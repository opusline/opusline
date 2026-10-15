/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Week_Billable_Fixed_PriceInputs */

const en_week_billable_fixed_price = /** @type {(inputs: Week_Billable_Fixed_PriceInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} on a forfait`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} on a forfait`);
	return /** @type {LocalizedString} */ ("week_billable_fixed_price");
};

const fr_week_billable_fixed_price = /** @type {(inputs: Week_Billable_Fixed_PriceInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} au forfait`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} au forfait`);
	return /** @type {LocalizedString} */ ("week_billable_fixed_price");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} on a forfait" |
* | "other" | "{count} on a forfait" |
*
* @param {Week_Billable_Fixed_PriceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_billable_fixed_price = /** @type {((inputs: Week_Billable_Fixed_PriceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Billable_Fixed_PriceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_billable_fixed_price(inputs)
	return en_week_billable_fixed_price(inputs)
});