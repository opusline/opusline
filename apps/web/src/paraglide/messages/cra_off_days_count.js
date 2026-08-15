/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Cra_Off_Days_CountInputs */

const en_cra_off_days_count = /** @type {(inputs: Cra_Off_Days_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} day`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} days`);
	return /** @type {LocalizedString} */ ("cra_off_days_count");
};

const fr_cra_off_days_count = /** @type {(inputs: Cra_Off_Days_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} jour`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} jours`);
	return /** @type {LocalizedString} */ ("cra_off_days_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} day" |
* | "other" | "{count} days" |
*
* @param {Cra_Off_Days_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_off_days_count = /** @type {((inputs: Cra_Off_Days_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Off_Days_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_off_days_count(inputs)
	return en_cra_off_days_count(inputs)
});