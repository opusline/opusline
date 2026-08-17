/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Week_Billable_DetailInputs */

const en_week_billable_detail = /** @type {(inputs: Week_Billable_DetailInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`over ${i?.count} entry`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`over ${i?.count} entries`);
	return /** @type {LocalizedString} */ ("week_billable_detail");
};

const fr_week_billable_detail = /** @type {(inputs: Week_Billable_DetailInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`sur ${i?.count} entrée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`sur ${i?.count} entrées`);
	return /** @type {LocalizedString} */ ("week_billable_detail");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "over {count} entry" |
* | "other" | "over {count} entries" |
*
* @param {Week_Billable_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_billable_detail = /** @type {((inputs: Week_Billable_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Billable_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_billable_detail(inputs)
	return en_week_billable_detail(inputs)
});