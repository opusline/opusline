/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Empty_BodyInputs */

const en_treasury_empty_body = /** @type {(inputs: Treasury_Empty_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record your balance or import a statement from the Business account screen — the transferable amount is worked out from it.`)
};

const fr_treasury_empty_body = /** @type {(inputs: Treasury_Empty_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Renseignez votre solde ou importez un relevé depuis Compte pro : le montant virable en est déduit.`)
};

/**
* | output |
* | --- |
* | "Record your balance or import a statement from the Business account screen — the transferable amount is worked out from it." |
*
* @param {Treasury_Empty_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_empty_body = /** @type {((inputs?: Treasury_Empty_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Empty_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_empty_body(inputs)
	return en_treasury_empty_body(inputs)
});