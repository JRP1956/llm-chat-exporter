## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes |
| < 1.0.0 | ❌ No |

## Reporting a Vulnerability

If you discover a vulnerability affecting the extension, please do NOT file a public issue. 
Instead, report it via GitHub Security Advisories by clicking "Report a vulnerability" on the repository's Security tab. You will receive an initial response within 48 hours.

## Security Architecture

The Universal LLM Chat Exporter is designed with a strict zero-trust model regarding external networks.
- **Data Handling:** All conversation data intercepted by the `chrome.debugger` API remains strictly within the V8 isolate of the active Chrome tab and background service worker.
- **Persistence:** Intercepted JSON is never written to disk, `chrome.storage`, `IndexedDB`, or `localStorage`. It is entirely ephemeral and flushed from memory when the tab closes.
- **External Communications:** The extension makes **zero** outbound network requests. No telemetry, no analytics, no remote configuration.
- **Trust Boundaries:** The extension executes code entirely offline within the browser. It trusts the active DOM of the LLM platform only to mount a button.

## Known Security Considerations

The extension relies on the `chrome.debugger` API to intercept network traffic. 
- Chrome will display a persistent warning banner ("Universal LLM Chat Exporter started debugging this browser") whenever this API is active. This is an intentional security feature by Chromium to prevent silent surveillance.
- Because the debugger can read all network traffic on the active tab, you should disable the extension or avoid running it on shared machines or tabs containing sensitive financial data, though the extension strictly filters for LLM endpoints.

## Dependency Audit

To audit the project's dependencies for known vulnerabilities, navigate to the project root and execute:

```bash
npm audit
```

This will run the native npm security audit against the development dependencies (Webpack, Jest, Babel). Note that this project ships with zero production dependencies, completely mitigating software supply chain attacks in the compiled extension.

*Last updated: 2026-05-30*
