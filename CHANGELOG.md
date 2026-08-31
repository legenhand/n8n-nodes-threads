# Changelog

All notable changes to this project will be documented in this file.

## [1.0.9] - 2026-08-31

### Added
- **Keyword & Topic Tag Search**: Added `searchMode` option to support Topic Tag (`TAG`) search in addition to keyword search (`KEYWORD`).
- **Search Ordering**: Added `searchType` option (`TOP` / `RECENT`).
- **Search Filters**: Added filters for `authorUsername`, `mediaType` (`ALL`, `TEXT`, `IMAGE`, `VIDEO`), `since`, and `until`.
- **Search Fields**: Expanded available search fields with `has_replies`, `is_quote_post`, and `is_reply`.
- **User Mentions**: Added `Get Mentions` operation under `User` resource (`GET /{userId}/mentions`) with cursor pagination and filters.
- **Recently Searched Keywords**: Added `recently_searched_keywords` field to `User` -> `Get Me`.
