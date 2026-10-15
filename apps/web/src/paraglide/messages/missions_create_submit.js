/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Create_SubmitInputs */

const en_missions_create_submit = /** @type {(inputs: Missions_Create_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the mission`)
};

const fr_missions_create_submit = /** @type {(inputs: Missions_Create_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Créer la mission`)
};

/**
* | output |
* | --- |
* | "Create the mission" |
*
* @param {Missions_Create_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_create_submit = /** @type {((inputs?: Missions_Create_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Create_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_create_submit(inputs)
	return en_missions_create_submit(inputs)
});