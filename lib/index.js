var IntlMixin = require('react-intl').IntlMixin;

var IntlHelperMixin = {

    mixins : [IntlMixin],

    /**
     * Translate function that returns a message from the intl file.
     * The message returned is dependent on the language of the browser.
     * Defaults to en-us if the message doesn't exist for the current language.
     * If neither is found, the final portion of the path is returned
     *
     * @param  {string} path   The path of the message in the intl file
     * @return {string}        Translated message
     */
    t : function(path)
    {
        var message;
        var languages = this.props.locales || this.context.locales;

        // Iterate through each language to get a translated string
        for (var i in languages) {
            var lang = languages[i];

            message = this._getTranslatedMessage(lang, path);
            if (message) {
                return message;
            }
        }

        // if a message was not found, return the end of the path
        var pathParts = path.split('.');
        return pathParts[pathParts.length-1];
    },

    /**
     * Iterates over a list of validation messages which are returned from the API as constants,
     * and uses the translate function to map the list to localized validation messages.
     *
     * @param  {object} messages      The response from the API, an object of arrays of error constants, keyed by field
     * @param  {string} key           Get validation messages for this specific field out of an API response
     * @param  {string} translatePath The prefix of the intl message, for example 'validation.someEntity'
     * @param  {string} status        Status for styling validation messages, defaults to 'error'
     * @return {object}               An object containing a list of mapped messages and status string
     */
    getValidationMessagesForKey : function(messages, key, translatePath, status)
    {
        var component = this;
        var status    = status || 'error';

        if (typeof messages[key] !== 'undefined') {
            return {
                status   : status,
                messages : _.map(messages[key], function(constant) {
                    return component.t(translatePath + '.' + key + '.' + constant);
                })
            };
        }
    },

    /**
     * Checks for a translation string using a specific locale and dot-namespaced identifier
     * Returns false if not found
     *
     * @param {string} lang Locale string ("en-US", etc)
     * @param {string} path Identifier ("test.My String")
     * @returns {boolean|string}
     */
    _getTranslatedMessage: function(lang, path)
    {
        var langPath  = lang.toLowerCase() + '.' + path;
        var pathParts = langPath.split('.');
        var messages  = this.props.messages || this.context.messages;
        try {
            return pathParts.reduce(function (obj, pathPart) {
                return obj[pathPart];
            }, messages);
        } catch(e) {
            return false;
        }
    }
}

module.exports = IntlHelperMixin;
