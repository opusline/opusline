/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Dialog_IntroInputs */

const en_deadlines_dialog_intro = /** @type {(inputs: Deadlines_Dialog_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add this address to your calendar once. It will poll it several times a day: the coming months' deadlines arrive on their own, a moved date corrects itself, a collected invoice takes its reminder away.`)
};

const fr_deadlines_dialog_intro = /** @type {(inputs: Deadlines_Dialog_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajoutez cette adresse à votre agenda une seule fois. Il l'interrogera plusieurs fois par jour : les échéances des prochains mois arriveront d'elles-mêmes, une date modifiée se corrigera, une facture encaissée fera disparaître son rappel.`)
};

/**
* | output |
* | --- |
* | "Add this address to your calendar once. It will poll it several times a day: the coming months' deadlines arrive on their own, a moved date corrects itself, ..." |
*
* @param {Deadlines_Dialog_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_dialog_intro = /** @type {((inputs?: Deadlines_Dialog_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Dialog_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_dialog_intro(inputs)
	return en_deadlines_dialog_intro(inputs)
});