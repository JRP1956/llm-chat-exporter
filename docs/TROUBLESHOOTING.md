## Diagnostic Checklist

1. **Check Chrome Extension Page**
   - Navigate to `chrome://extensions/`. Look for the Universal LLM Chat Exporter.
   - Click "Errors" if a button appears.
   - *Next Step*: Address syntax or permission errors printed.
2. **Check Debugger Attachment**
   - When visiting Claude/ChatGPT, a browser bar reading "Universal LLM Chat Exporter started debugging this browser" must appear.
   - *Next Step*: If missing, the extension is inactive or disabled for that platform in settings.
3. **Check Network Logs**
   - Right-click the export button > Inspect. Open the Console tab.
   - *Next Step*: Note any red error messages thrown by `ExportOrchestrator`.

## Error Reference

### "No conversation data intercepted yet."
**Meaning:** The orchestrator tried to export but the memory cache is empty.
**Cause:** The user clicked Export before the platform's API responded, or the user refreshed the page and the backend didn't fetch the whole history.
**Fix:** Reload the page or navigate to a different chat and click back.
**If the fix doesn't work:** File a bug report; the platform may have changed their endpoint regex.

### "Export failed: Export is disabled for this platform in options."
**Meaning:** The pipeline aborted execution.
**Cause:** The active platform is toggled to `false` inside the `enabledPlatforms` configuration object.
**Fix:** Click the extension popup icon, navigate to Settings, and check the platform box.

### ERROR_CODE: `chrome.debugger.attach()` throws `Cannot access a chrome:// URL`
**Meaning:** The debugger failed to bind.
**Cause:** Attempting to run the extension on an invalid or privileged Chrome tab.
**Fix:** Only use the extension on supported `https://` LLM platform URLs.

## Known Issues

| Issue | Affected Versions | Workaround | Fix ETA |
|-------|------------------|------------|---------|
| Blank export files on page reload | 1.0.0 | Navigate away and back to the chat to trigger network fetch | Phase 2 |
| Missing SVG inline icons | 1.0.0 | Ignore missing visuals | Won't Fix |

## Collecting Debug Information

To collect data for a bug report:
1. Open the platform page.
2. Press F12 to open Developer Tools.
3. Go to the Network tab, filter by `XHR/Fetch`.
4. Refresh the page and find the conversation JSON endpoint.
5. Provide the URL of the endpoint in your bug report (masking any personal tokens).

## Getting Help

For support, open a thread in the GitHub Discussions tab of the repository. Maintainers typically respond within 1 business day.

*Last updated: 2026-05-30*
