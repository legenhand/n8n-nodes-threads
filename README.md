# @rizkifirmansyah/n8n-nodes-threads-api

![Threads Node](nodes/Threads/threads.svg)

An official community node package for **n8n** to interact with the **Meta Threads API**.

Manage your Threads presence at scale: create posts (text, images, videos, carousels), moderate replies, fetch user profiles, retrieve insights/analytics, search posts, and listen to webhook events.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Credentials & Authentication](#credentials--authentication)
  - [1. OAuth2 Authentication](#1-oauth2-authentication)
  - [2. User Access Token Authentication](#2-user-access-token-authentication)
- [Available Resources & Operations](#available-resources--operations)
  - [Post](#post)
  - [Reply](#reply)
  - [User](#user)
  - [Insight](#insight)
  - [Search](#search)
  - [Threads Trigger (Webhook)](#threads-trigger-webhook)
- [Meta Threads API Requirements](#meta-threads-api-requirements)
- [Development & Contributing](#development--contributing)
- [License](#license)

---

## Features

- ✨ **Seamless Post Creation**: Auto-handles the 2-step media container creation & publishing workflow in a single action.
- 🖼️ **Multi-Format Support**: Create **Text**, **Single Image**, **Single Video**, and multi-media **Carousels** (2–10 items).
- 💬 **Reply & Conversation Management**: Create replies, view full discussion threads, and hide/unhide replies.
- 📊 **Rich Analytics**: Retrieve engagement metrics (views, likes, replies, reposts, quotes) for posts and user accounts.
- 🔍 **Keyword & Topic Tag Search**: Discover and monitor public Threads conversations by keyword or topic tag (`#`), with ordering (`TOP` / `RECENT`) and media/author filters.
- 📬 **User Mentions & REST API**: Retrieve posts and replies mentioning a user.
- ⚡ **Webhook Trigger**: Receive real-time events (`threads_mentions`, `threads_replies`) with automated Meta Hub challenge verification.

---

## Installation

### Community Nodes (Recommended)
1. Go to **Settings > Community Nodes** in your n8n instance.
2. Select **Install**.
3. Enter `@rizkifirmansyah/n8n-nodes-threads-api` in the **npm Package Name** field.
4. Agree to the risks and select **Install**.

### Manual Installation (Self-Hosted / Docker)
Inside your n8n root directory or custom nodes directory:
```bash
npm install @rizkifirmansyah/n8n-nodes-threads-api
```

---

## Credentials & Authentication

The node supports two authentication methods:

### 1. OAuth2 Authentication
Best for multi-user apps or standard OAuth authorization flows.

1. Create an App in the [Meta Developer Dashboard](https://developers.facebook.com/).
2. Add the **Threads API** use case.
3. Configure your OAuth redirect URI (found in the n8n credential setup).
4. Enter the **Client ID** and **Client Secret** into n8n.
5. Click **Connect my account** to authorize with your Threads profile.

### 2. User Access Token Authentication
Best for personal automation and bot accounts using Long-Lived User Tokens (valid for 60 days).

1. Generate a Threads User Access Token via the Meta Graph API Explorer or Token Exchange endpoint.
2. Paste the **Access Token** into the n8n **Threads API** credential.

---

## Available Resources & Operations

### Post
| Operation | Description |
| :--- | :--- |
| **Create and Publish** | Creates media container (Text, Image, Video, Carousel) and immediately publishes it |
| **Create Media Container** | Creates a media container ID without publishing |
| **Publish Container** | Publishes a previously created media container using its `creation_id` |
| **Get** | Retrieves details of a specific post or media by ID |
| **Get Many** | Lists posts published by the user with pagination and date filters |
| **Delete** | Deletes a post by its ID |

### Reply
| Operation | Description |
| :--- | :--- |
| **Create** | Replies to a specific post or reply |
| **Get Many** | Retrieves direct replies made to a post |
| **Get Conversation** | Retrieves all replies in a conversation thread |
| **Manage (Hide/Unhide)** | Toggles visibility of a reply on your post (`hide=true/false`) |

### User
| Operation | Description |
| :--- | :--- |
| **Get Me** | Retrieves the authenticated user's profile info (`id`, `username`, `name`, `profile picture`, `bio`, `recently searched keywords`) |
| **Get Mentions** | Retrieves posts and replies where a user has been mentioned (`/{userId}/mentions`) |
| **Get Profile** | Retrieves profile details for a given Threads User ID |
| **Get Publishing Limit** | Retrieves current rate limit and quota usage (`/me/threads_publishing_limit`) |
| **Exchange for Long-Lived Token** | Exchanges a short-lived token (1 hour) for a 60-day long-lived token |
| **Refresh Long-Lived Token** | Refreshes an unexpired long-lived token to reset its 60 days validity |

### Insight
| Operation | Description |
| :--- | :--- |
| **Get Media Insights** | Retrieves post performance (`views`, `likes`, `replies`, `reposts`, `quotes`) |
| **Get User Insights** | Retrieves account-level metrics over time with optional date range (`since`/`until`) |

### Search
| Operation | Description |
| :--- | :--- |
| **Keyword / Topic Tag Search** | Searches public Threads posts matching a keyword or topic tag (`#`) with ordering (`TOP` / `RECENT`) and filters (`mediaType`, `authorUsername`, `since`, `until`) |

### Threads Trigger (Webhook)
Listens for incoming webhooks from Meta:
- **Automatic Challenge Verification**: Responds to Meta `GET` challenge requests with `hub.challenge`.
- **Event Filtering**: Supports `All Events`, `threads_mentions`, and `threads_replies`.
- **Payload Extraction**: Cleanly separates changes or passes the full JSON payload.

---

## Meta Threads API Requirements

- **Media URLs**: Any image or video URL passed to Threads API must be publicly accessible on the web.
- **Publishing Limits**: Meta enforces a standard quota of 250 posts per 24-hour window per user.
- **Scopes Required**:
  - `threads_basic` (profile reading & general API access)
  - `threads_content_publish` (posting content)
  - `threads_read_replies` / `threads_manage_replies` (reply management)
  - `threads_manage_insights` (analytics)
  - `threads_keyword_search` (search)

---

## Development & Contributing

To contribute or build locally:

```bash
# Clone repository
git clone https://github.com/legenhand/n8n-nodes-threads.git
cd n8n-nodes-threads

# Install dependencies
npm install

# Build
npm run build

# Lint
npm run lint

# Start n8n in dev mode with live reload
npm run dev
```

---

## License

[MIT](LICENSE) © [Rizki Firmansyah](https://github.com/legenhand)

