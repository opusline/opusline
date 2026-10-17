/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ document: NonNullable<unknown> }} Paste_Prompt_IntroInputs */

const en_paste_prompt_intro = /** @type {(inputs: Paste_Prompt_IntroInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`You are writing ${i?.document} for a French freelancer. I will paste your answer into my invoicing software, Opusline, which only reads the format below.`)
};

const fr_paste_prompt_intro = /** @type {(inputs: Paste_Prompt_IntroInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tu rédiges ${i?.document} pour un freelance français. Je vais coller ta réponse dans mon logiciel de facturation, Opusline, qui ne lit que le format ci-dessous.`)
};

/**
* | output |
* | --- |
* | "You are writing {document} for a French freelancer. I will paste your answer into my invoicing software, Opusline, which only reads the format below." |
*
* @param {Paste_Prompt_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_intro = /** @type {((inputs: Paste_Prompt_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_intro(inputs)
	return en_paste_prompt_intro(inputs)
});