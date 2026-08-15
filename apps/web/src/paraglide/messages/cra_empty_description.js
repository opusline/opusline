/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Empty_DescriptionInputs */

const en_cra_empty_description = /** @type {(inputs: Cra_Empty_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable “Monthly CRA required” on a day-billed mission: its months will pile up here.`)
};

const fr_cra_empty_description = /** @type {(inputs: Cra_Empty_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activez « CRA mensuel requis » sur une mission facturée à la journée : ses mois viendront s'empiler ici.`)
};

/**
* | output |
* | --- |
* | "Enable “Monthly CRA required” on a day-billed mission: its months will pile up here." |
*
* @param {Cra_Empty_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_empty_description = /** @type {((inputs?: Cra_Empty_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Empty_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_empty_description(inputs)
	return en_cra_empty_description(inputs)
});