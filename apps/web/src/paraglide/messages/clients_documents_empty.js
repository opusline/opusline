/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Documents_EmptyInputs */

const en_clients_documents_empty = /** @type {(inputs: Clients_Documents_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No documents for this client. Contracts, quotes and signed CRAs will come here.`)
};

const fr_clients_documents_empty = /** @type {(inputs: Clients_Documents_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun document pour ce client. Contrats, devis et CRA signés viendront ici.`)
};

/**
* | output |
* | --- |
* | "No documents for this client. Contracts, quotes and signed CRAs will come here." |
*
* @param {Clients_Documents_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_documents_empty = /** @type {((inputs?: Clients_Documents_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Documents_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_documents_empty(inputs)
	return en_clients_documents_empty(inputs)
});