/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Open_CrasInputs */

const en_missions_open_cras = /** @type {(inputs: Missions_Open_CrasInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open the activity reports`)
};

const fr_missions_open_cras = /** @type {(inputs: Missions_Open_CrasInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir les comptes rendus`)
};

/**
* | output |
* | --- |
* | "Open the activity reports" |
*
* @param {Missions_Open_CrasInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_open_cras = /** @type {((inputs?: Missions_Open_CrasInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Open_CrasInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_open_cras(inputs)
	return en_missions_open_cras(inputs)
});