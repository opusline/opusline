/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Week_Month_Business_DaysInputs */

const en_week_month_business_days = /** @type {(inputs: Week_Month_Business_DaysInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`of ${i?.count} business day`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`of ${i?.count} business days`);
	return /** @type {LocalizedString} */ ("week_month_business_days");
};

const fr_week_month_business_days = /** @type {(inputs: Week_Month_Business_DaysInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`sur ${i?.count} jour ouvré`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`sur ${i?.count} jours ouvrés`);
	return /** @type {LocalizedString} */ ("week_month_business_days");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "of {count} business day" |
* | "other" | "of {count} business days" |
*
* @param {Week_Month_Business_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_month_business_days = /** @type {((inputs: Week_Month_Business_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Month_Business_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_month_business_days(inputs)
	return en_week_month_business_days(inputs)
});