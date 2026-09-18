/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Liberating_Ended_TitleInputs */

const en_declarations_liberating_ended_title = /** @type {(inputs: Declarations_Liberating_Ended_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The versement libératoire has not applied since ${i?.date}`)
};

const fr_declarations_liberating_ended_title = /** @type {(inputs: Declarations_Liberating_Ended_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le versement libératoire ne s'applique plus depuis le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "The versement libératoire has not applied since {date}" |
*
* @param {Declarations_Liberating_Ended_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_ended_title = /** @type {((inputs: Declarations_Liberating_Ended_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Ended_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_liberating_ended_title(inputs)
	return en_declarations_liberating_ended_title(inputs)
});