/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Mode_Elsewhere_DetailInputs */

const en_invoicing_mode_elsewhere_detail = /** @type {(inputs: Invoicing_Mode_Elsewhere_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You write your documents elsewhere. Opusline keeps track of them: amounts, due dates, payments.`)
};

const fr_invoicing_mode_elsewhere_detail = /** @type {(inputs: Invoicing_Mode_Elsewhere_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vous éditez vos documents ailleurs. Opusline en garde la trace : montants, échéances, encaissements.`)
};

/**
* | output |
* | --- |
* | "You write your documents elsewhere. Opusline keeps track of them: amounts, due dates, payments." |
*
* @param {Invoicing_Mode_Elsewhere_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_mode_elsewhere_detail = /** @type {((inputs?: Invoicing_Mode_Elsewhere_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Mode_Elsewhere_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_mode_elsewhere_detail(inputs)
	return en_invoicing_mode_elsewhere_detail(inputs)
});