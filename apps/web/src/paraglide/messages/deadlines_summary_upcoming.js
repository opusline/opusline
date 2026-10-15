/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Summary_UpcomingInputs */

const en_deadlines_summary_upcoming = /** @type {(inputs: Deadlines_Summary_UpcomingInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} coming up`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} coming up`);
	return /** @type {LocalizedString} */ ("deadlines_summary_upcoming");
};

const fr_deadlines_summary_upcoming = /** @type {(inputs: Deadlines_Summary_UpcomingInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} à venir`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} à venir`);
	return /** @type {LocalizedString} */ ("deadlines_summary_upcoming");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} coming up" |
* | "other" | "{count} coming up" |
*
* @param {Deadlines_Summary_UpcomingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_summary_upcoming = /** @type {((inputs: Deadlines_Summary_UpcomingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Summary_UpcomingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_summary_upcoming(inputs)
	return en_deadlines_summary_upcoming(inputs)
});