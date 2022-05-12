---
layout: post
title: Outline for Getting Jiggy with Loki
description: Presentation Draft for Getting Jiggy with Loki
summary:
tags: [tech]
---

Eheh, this is my presentation draft for sharing session about Grafana Loki.

---

```
# getting jiggy w/ loki

## loki for browsing log
1. show how usual logfiles actually are in a filesystem
1. how to read logfile manually using cat
1. piping things in cli `awk '{ print toupper($0) }'` `tr a-z A-Z`
1. searching logfile by piping to `grep`: also explain multiple grepping
1. reading logfile using loki: also explain about timerange, logstream, indexed label, loki concept
1. grep searching logfile using loki piping `{path="/@worker/bulkcashin",service="peucang"} |= "01G2R6MB1PHTKD23PDFPTHZNJ4" | line_format "{{.path}}"`
   - `|=` Log line contains string
   - `!=` Log line does not contain string
   - `|~` Log line contains a match to the regular expression
   - `!~` Log line does not contain a match to the regular expression
1. advanced searching
   - searching by label value `{service="peucang"} | path="/@worker/bulkcashin/callback-bni"`
   - promoting json value as label `{service="peucang"} | path="/@worker/bulkcashin/callback-bni" | json resptime="rt"`
   - searching with comparators `{service="peucang"} | path="/@worker/bulkcashin/callback-bni" | json resptime="rt" | resptime > 1000`
     - `==` or `=` for equality.
     - `!=` for inequality.
     - `>` and `>=` for greater than and greater than or equal.
     - `>` and `<=` for lesser than and lesser than or equal.

refs:
- https://grafana.com/docs/loki/latest/logql/log_queries/

## loki for metrics
1. explain timeseries data concept: https://www.google.com/search?q=timeseries+data
1. explain vector: instant vector, ranged vector: https://satyanash.net/software/2021/01/04/understanding-prometheus-range-vectors.html
1. converting log occurence to metrics
   - `count_over_time({service="peucang"} | path="/@worker/bulkcashin/callback-bni" | json resptime="rt"[1s])`
   - `count_over_time({service="peucang"} | path="/@worker/bulkcashin/callback-bni" | json resptime="rt"[5s])`
   - `count_over_time({service="peucang"} | path="/@worker/bulkcashin/callback-bni" | json resptime="rt"[1m])`
1. aggregating things
   - `sum(count_over_time({service="peucang"} != "inquiry" | json resptime="rt"[1m])) by (path)`
   - `sum(count_over_time({service="peucang"} |= "inquiry" | json resptime="rt", msisdn="req.msisdn"[1m])) by (msisdn)`
1. aggregating values instead of log occurences
   - `avg(rate({service="peucang"} != "inquiry" | json resptime="rt" | unwrap resptime [1m])) by (path)`
   - `max(rate({service="peucang"} != "inquiry" | json resptime="rt" | unwrap resptime [1m])) by (path)`
   - `quantile_over_time(0.99,{service="peucang"} != "inquiry" | json resptime="rt" | unwrap resptime [1m]) by (path)`
1. applying to grafana dashboard
   - `sum(rate({service="peucang"} | path="/@worker/bulkcashin" | json amt_attempt="addData.disburse_amount_attempted" | unwrap amt_attempt [1m]))`

refs:
- https://satyanash.net/software/2021/01/04/understanding-prometheus-range-vectors.html
- https://grafana.com/docs/loki/latest/logql/metric_queries/

```
