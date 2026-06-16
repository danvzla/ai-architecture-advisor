/**
 * api-client.js
 * Shared API client. Swap the provider config object to switch between
 * Claude (Anthropic) and OpenAI without touching any agent file.
 *
 * CLAUDE:  window.ApiClient.provider = window.ApiClient.providers.claude;
 * OPENAI:  window.ApiClient.provider = window.ApiClient.providers.openai;
 */
window.ApiClient = {

  providers: {
    claude: {
      name: 'Claude (Anthropic)',
      model: 'claude-haiku-4-5-20251001',
      endpoint: 'https://api.anthropic.com/v1/messages',
      headers(apiKey) {
        return {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        };
      },
      body(prompt, maxTokens, model) {
        return JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        });
      },
      extractText(data) {
        return data.content?.find(b => b.type === 'text')?.text || '';
      },
      validateKey(k) { return k.startsWith('sk-ant-'); },
      keyHint: 'sk-ant-...',
      keyError: 'Please enter a valid Anthropic key starting with sk-ant-',
    },

    openai: {
      name: 'OpenAI',
      model: 'gpt-4o-mini',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      headers(apiKey) {
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
      },
      body(prompt, maxTokens, model) {
        return JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        });
      },
      extractText(data) {
        return data.choices?.[0]?.message?.content || '';
      },
      validateKey(k) { return k.startsWith('sk-'); },
      keyHint: 'sk-...',
      keyError: 'Please enter a valid OpenAI key starting with sk-',
    },
  },

  // Active provider — default to Claude, override in app.js if needed
  provider: null,

  init(providerName = 'claude') {
    this.provider = this.providers[providerName];
  },

  /**
   * Make one API call and return raw response text.
   * @param {string} apiKey
   * @param {string} prompt
   * @param {number} maxTokens
   * @returns {Promise<string>}
   */
  async call(apiKey, prompt, maxTokens = 3000) {
    const p = this.provider;
    const res = await fetch(p.endpoint, {
      method: 'POST',
      headers: p.headers(apiKey),
      body: p.body(prompt, maxTokens, p.model),
    });
    if (!res.ok) {
      const e = await res.json();
      throw new Error(e.error?.message || `API error ${res.status}`);
    }
    const data = await res.json();
    return p.extractText(data);
  },

  /**
   * 5-attempt JSON repair chain.
   * Handles: code fences, control chars, truncated arrays/objects.
   * @param {string} raw
   * @returns {object}
   */
  parseJSON(raw) {
    const first = raw.indexOf('{');
    const last  = raw.lastIndexOf('}');
    if (first === -1) throw new Error('No JSON object found in response.');
    const chunk = raw.substring(first, last + 1);

    const attempts = [
      // 1. Direct parse
      s => JSON.parse(s),
      // 2. Strip non-printable control characters
      s => JSON.parse(s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')),
      // 3. Collapse literal newlines inside strings
      s => JSON.parse(s.replace(/\r?\n|\t/g, ' ')),
      // 4. Collapse all whitespace runs
      s => JSON.parse(s.replace(/\s{2,}/g, ' ')),
      // 5. Close unclosed arrays/objects (handles token-limit truncation)
      s => {
        let f = s.replace(/,\s*$/, '');
        const openBrackets = (f.match(/\[/g) || []).length - (f.match(/\]/g) || []).length;
        const openBraces   = (f.match(/\{/g) || []).length - (f.match(/\}/g) || []).length;
        for (let i = 0; i < openBrackets; i++) f += ']';
        for (let i = 0; i < openBraces;   i++) f += '}';
        return JSON.parse(f);
      },
    ];

    for (const fn of attempts) {
      try { return fn(chunk); } catch { /* try next */ }
    }
    throw new Error('Response JSON was malformed after 5 repair attempts. Please try again.');
  },
};
