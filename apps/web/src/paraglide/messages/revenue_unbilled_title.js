/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Revenue_Unbilled_TitleInputs */

const en_revenue_unbilled_title = /** @type {(inputs: Revenue_Unbilled_TitleInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} unbilled work period`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} unbilled work periods`);
	return /** @type {LocalizedString} */ ("revenue_unbilled_title");
};

const fr_revenue_unbilled_title = /** @type {(inputs: Revenue_Unbilled_TitleInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} période travaillée non facturée`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} périodes travaillées non facturées`);
	return /** @type {LocalizedString} */ ("revenue_unbilled_title");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} unbilled work period" |
* | "other" | "{count} unbilled work periods" |
*
* @param {Revenue_Unbilled_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_unbilled_title = /** @type {((inputs: Revenue_Unbilled_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Unbilled_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_unbilled_title(inputs)
	return en_revenue_unbilled_title(inputs)
});