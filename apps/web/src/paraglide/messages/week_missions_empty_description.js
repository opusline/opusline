/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Missions_Empty_DescriptionInputs */

const en_week_missions_empty_description = /** @type {(inputs: Week_Missions_Empty_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The grid shows one row per mission. Create a client, then its first mission, and the week fills in as you track.`)
};

const fr_week_missions_empty_description = /** @type {(inputs: Week_Missions_Empty_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La grille affiche une ligne par mission. Créez un client, puis sa première mission, et la semaine se remplit à la saisie.`)
};

/**
* | output |
* | --- |
* | "The grid shows one row per mission. Create a client, then its first mission, and the week fills in as you track." |
*
* @param {Week_Missions_Empty_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_missions_empty_description = /** @type {((inputs?: Week_Missions_Empty_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Missions_Empty_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_missions_empty_description(inputs)
	return en_week_missions_empty_description(inputs)
});