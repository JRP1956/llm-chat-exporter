# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- DeepSeek reasoning adapter.
- Perplexity reasoning steps extraction.

## [1.0.0] - 2026-05-30
### Added
- Complete MV3 architectural base utilizing the Adapter Pattern.
- `NetworkInterceptor` utilizing the Chrome Debugger API to bypass DOM scraping.
- `ClaudeAdapter` capable of parsing Claude flat-array structures and extended thinking blocks.
- `ChatGPTAdapter` capable of parsing complex N-ary tree structures and o-series reasoning models.
- History API monkey-patching for seamless integration with SPA navigations.
- `MarkdownBuilder` for compiling intercepted payloads into pristine GitHub-Flavored Markdown.
- Unit testing suite across parsers using Jest.
- Full commercial-grade documentation suite.
