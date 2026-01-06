import DOMPurify from 'dompurify';

/**
 * Safely converts markdown-like text to HTML with XSS sanitization
 */
export function formatMarkdownSafe(text: string): string {
  const html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n/gim, '<br />');
  
  // Sanitize HTML to prevent XSS attacks
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'li', 'ul', 'ol', 'a', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
