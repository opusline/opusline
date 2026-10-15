/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Week_Billable_UnratedInputs */

const en_week_billable_unrated = /** @type {(inputs: Week_Billable_UnratedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} without a rate`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} without a rate`);
	return /** @type {LocalizedString} */ ("week_billable_unrated");
};

const fr_week_billable_unrated = /** @type {(inputs: Week_Billable_UnratedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} sans tarif`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} sans tarif`);
	return /** @type {LocalizedString} */ ("week_billable_unrated");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} without a rate" |
* | "other" | "{count} without a rate" |
*
* @param {Week_Billable_UnratedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_billable_unrated = /** @type {((inputs: Week_Billable_UnratedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Billable_UnratedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_billable_unrated(inputs)
	return en_week_billable_unrated(inputs)
});