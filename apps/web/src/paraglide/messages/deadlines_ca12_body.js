/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Ca12_BodyInputs */

const en_deadlines_ca12_body = /** @type {(inputs: Deadlines_Ca12_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Under the réel simplifié the annual VAT return follows the income-tax season rather than the period, so Opusline does not compute its date. Check it on impots.gouv.fr.`)
};

const fr_deadlines_ca12_body = /** @type {(inputs: Deadlines_Ca12_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Au réel simplifié, la déclaration annuelle de TVA suit la campagne de l'impôt sur le revenu et non la période : Opusline n'en calcule pas la date. Vérifiez-la sur impots.gouv.fr.`)
};

/**
* | output |
* | --- |
* | "Under the réel simplifié the annual VAT return follows the income-tax season rather than the period, so Opusline does not compute its date. Check it on impot..." |
*
* @param {Deadlines_Ca12_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_ca12_body = /** @type {((inputs?: Deadlines_Ca12_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Ca12_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_ca12_body(inputs)
	return en_deadlines_ca12_body(inputs)
});