/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Load_One_FailedInputs */

const en_missions_load_one_failed = /** @type {(inputs: Missions_Load_One_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This mission could not be loaded. Try again in a moment.`)
};

const fr_missions_load_one_failed = /** @type {(inputs: Missions_Load_One_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger cette mission. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "This mission could not be loaded. Try again in a moment." |
*
* @param {Missions_Load_One_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_load_one_failed = /** @type {((inputs?: Missions_Load_One_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Load_One_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_load_one_failed(inputs)
	return en_missions_load_one_failed(inputs)
});