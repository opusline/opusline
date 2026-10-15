/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_IntroInputs */

const en_release_notes_intro = /** @type {(inputs: Release_Notes_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline is self-hosted: each release is an update you apply yourself. Database migrations run automatically and are reversible.`)
};

const fr_release_notes_intro = /** @type {(inputs: Release_Notes_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline est auto-hébergé : chaque version est une mise à jour que vous appliquez vous-même. Les migrations de base de données sont automatiques et réversibles.`)
};

/**
* | output |
* | --- |
* | "Opusline is self-hosted: each release is an update you apply yourself. Database migrations run automatically and are reversible." |
*
* @param {Release_Notes_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_intro = /** @type {((inputs?: Release_Notes_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_intro(inputs)
	return en_release_notes_intro(inputs)
});