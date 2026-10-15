/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Esn_Card_NoteInputs */

const en_clients_esn_card_note = /** @type {(inputs: Clients_Esn_Card_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This client's missions will ask for an <strong>end client</strong>, and will enable the monthly CRA by default.`)
};

const fr_clients_esn_card_note = /** @type {(inputs: Clients_Esn_Card_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les missions de ce client demanderont un <strong>client final</strong>, et activeront le CRA mensuel par défaut.`)
};

/**
* | output |
* | --- |
* | "This client's missions will ask for an <strong>end client</strong>, and will enable the monthly CRA by default." |
*
* @param {Clients_Esn_Card_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_esn_card_note = /** @type {((inputs?: Clients_Esn_Card_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Esn_Card_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_esn_card_note(inputs)
	return en_clients_esn_card_note(inputs)
});