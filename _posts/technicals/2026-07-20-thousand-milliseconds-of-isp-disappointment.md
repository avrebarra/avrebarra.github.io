---
layout: post
title: "1000ms of ISP Disappointment"
date: 2026-07-20 00:00:00 +0000
highlighted: true
tags: [networking, debugging]
---

I just deployed **Presensia**, a lightweight presence API. Auth endpoint, basic CRUD, nothing fancy. Containerized it, put it behind a Cloudflare tunnel on a Jakarta VPS.

I hit the endpoint. An endpoint that does nothing but echo your token back. **Over a second** to respond.

That made no sense. I SSH'd into the VPS and tested locally. 5ms inside the container, 153ms via Docker NAT. The app was fast. The bottleneck was somewhere between my Mac and the server. But where?

## Suspect #1: Cloudflare must be playing dirty

My first instinct was Cloudflare. Free plan throttling. The QUIC fallback timeout — cloudflared tries UDP, gets blocked, waits one second, falls back to HTTP/2. I'd read about this bug on GitHub issues and Reddit threads.

I forced `--protocol http2`. Latency barely moved. Disabled HTTP/3 and 0-RTT in the dashboard. A tiny improvement, 1.18s to 1.11s. Tried `--region ap` to force Asia routing. Error 1033. Tried `network_mode: host`. 502 from broken Docker DNS.

Every change made things worse or did nothing. Cloudflare was not the culprit. At least, not in the way I expected.

## Suspect #2: Maybe the VPS just sucks

The Docker NAT overhead was suspicious — 148ms for something that should be under one millisecond. Maybe the VM was underpowered. Maybe GCE had bad networking in Jakarta.

Checked CPU. Idle. Memory. Plenty. Disk. Fine.

Direct test from my Mac to the VPS IP: **111ms**. Clean. Jakarta to my laptop was fast.

But the moment Cloudflare entered the picture: **1,164ms**. A 1,053ms gap that appeared from nowhere.

The app was fast. The VPS was fast. The network was fast. But the tunnel was adding a clean, round second. A number like that is never random. It's a timeout. Something was waiting for a response that was never coming.

## The Smoking Gun

I used curl's timing variables. The kind of command you run a hundred times and never read.

```bash
curl -w "DNS: %{time_namelookup}s
Connect: %{time_connect}s
TLS: %{time_appconnect}s
TTFB: %{time_starttransfer}s" ...
```

From the VPS itself:

```
DNS: 0.007s | Connect: 0.024s | TLS: 0.055s | TTFB: 0.204s
```

From my Mac:

```
DNS: 0.001s | Connect: 0.033s | TLS: 0.698s | TTFB: 1.996s
```

TLS handshake: **698ms from my Mac, 55ms from the VPS**. Same TLS 1.3. Same domain. Same tunnel. 12x slower.

I checked the `cf-ray` header.

From the VPS: `SIN` — Singapore.
From my Mac: `LAS` — Los Angeles.

There it was. Every request from my Mac was landing on the Cloudflare edge in **Los Angeles**. Not Singapore. Not Jakarta. Los Angeles. A 12,000 kilometer detour from Indonesia, then tunneling back to my Jakarta VPS across the Pacific.

It was never Cloudflare's tunnel. It was never GCE's hardware. My ISP was routing my Cloudflare traffic to the wrong continent.

## The Proof

I enabled Cloudflare WARP on my Mac. WARP bypasses your ISP's BGP routing — it runs your traffic through Cloudflare's own backbone instead.

TLS dropped from 698ms to **141ms**. TTFB crashed from 1.9s to **291ms**. The `cf-ray` header now read `SIN` — Singapore. Where it should have been all along.

WARP confirmed what the numbers suggested. My ISP, Indosat, peers with Cloudflare in a way that sends Indonesian traffic through Los Angeles. A single BGP routing decision I have zero control over. I can optimize my VPS, tune my containers, switch every protocol setting. None of it matters if the packet is pointed at the wrong hemisphere.

## The 1-Second Tax

A clean, round overhead number is never a performance issue. Performance issues are fuzzy — 37ms here, 82ms there. 1,000ms exactly means something is waiting for a response that never arrives, then falling back to something slower.

The second lesson is older and simpler. Proximity matters. Moving my VPS from the US to Jakarta cut direct latency 5x. But even that didn't help when my ISP overrode my infrastructure decisions with a bad BGP route.

The most informative debugging session I've had in months ended with zero code changes to Presensia. My ISP was the bottleneck all along. BGP routing is invisible until it isn't. And when it breaks, it breaks with surgical precision: exactly 1,000ms of ISP disappointment.
