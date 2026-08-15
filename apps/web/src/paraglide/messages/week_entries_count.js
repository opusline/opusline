/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Week_Entries_CountInputs */

const en_week_entries_count = /** @type {(inputs: Week_Entries_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} entry`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} entries`);
	return /** @type {LocalizedString} */ ("week_entries_count");
};

const fr_week_entries_count = /** @type {(inputs: Week_Entries_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} entrée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} entrées`);
	return /** @type {LocalizedString} */ ("week_entries_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} entry" |
* | "other" | "{count} entries" |
*
* @param {Week_Entries_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_entries_count = /** @type {((inputs: Week_Entries_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Entries_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_entries_count(inputs)
	return en_week_entries_count(inputs)
});