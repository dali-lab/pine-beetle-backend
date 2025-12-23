import sanitizeHtml from 'sanitize-html';

// Strip all HTML to avoid XSS; adjust options if limited markup should be allowed.
const SANITIZE_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
};

const sanitizeToText = (value = '') => {
  return sanitizeHtml(String(value), SANITIZE_OPTIONS).trim();
};

export default sanitizeToText;
