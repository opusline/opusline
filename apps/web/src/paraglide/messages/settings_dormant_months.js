/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Settings_Dormant_MonthsInputs */

const en_settings_dormant_months = /** @type {(inputs: Settings_Dormant_MonthsInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`After ${i?.count} month`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`After ${i?.count} months`);
	return /** @type {LocalizedString} */ ("settings_dormant_months");
};

const fr_settings_dormant_months = /** @type {(inputs: Settings_Dormant_MonthsInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Au bout d’${i?.count} mois`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Au bout de ${i?.count} mois`);
	return /** @type {LocalizedString} */ ("settings_dormant_months");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "After {count} month" |
* | "other" | "After {count} months" |
*
* @param {Settings_Dormant_MonthsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_dormant_months = /** @type {((inputs: Settings_Dormant_MonthsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Dormant_MonthsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_dormant_months(inputs)
	return en_settings_dormant_months(inputs)
});