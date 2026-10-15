/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Group_SentInputs */

const en_cra_group_sent = /** @type {(inputs: Cra_Group_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting signature`)
};

const fr_cra_group_sent = /** @type {(inputs: Cra_Group_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En attente de signature`)
};

/**
* | output |
* | --- |
* | "Awaiting signature" |
*
* @param {Cra_Group_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_group_sent = /** @type {((inputs?: Cra_Group_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Group_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_group_sent(inputs)
	return en_cra_group_sent(inputs)
});