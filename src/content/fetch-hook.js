(function () {
  if (window.__llmExporterInjected) return;
  window.__llmExporterInjected = true;

  var patterns = [
    /\/api\/[^"]*(conversation|chat|thread|org)[^"]*/i,
    /\/backend-api\//,
  ];

  function matches(url) {
    return patterns.some(function (p) { return p.test(url); });
  }

  function dispatch(url, data) {
    window.dispatchEvent(new CustomEvent('__LLM_EXPORTER_DATA', { detail: { url: url, data: data } }));
  }

  var origFetch = window.fetch;
  window.fetch = async function () {
    var response = await origFetch.apply(this, arguments);
    var url = typeof arguments[0] === 'string' ? arguments[0] : arguments[0] && arguments[0].url ? arguments[0].url : '';
    if (matches(url)) {
      response.clone().text().then(function (body) {
        try { var d = JSON.parse(body); if (Object.keys(d).length) dispatch(url, d); } catch (e) {}
      });
    }
    return response;
  };

  var origOpen = XMLHttpRequest.prototype.open;
  var origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__llmUrl = typeof url === 'string' ? url : '';
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    if (this.__llmUrl && matches(this.__llmUrl)) {
      this.addEventListener('load', function () {
        try { var d = JSON.parse(this.responseText); if (Object.keys(d).length) dispatch(this.__llmUrl, d); } catch (e) {}
      });
    }
    return origSend.apply(this, arguments);
  };
})();
