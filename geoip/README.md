# Offline IP country data

IP geolocation by [DB-IP](https://db-ip.com/), provided under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The unmodified DB-IP Lite country MMDB is redistributed by [sapics/ip-location-db](https://github.com/sapics/ip-location-db).

`SOURCE.json` records the actual downloaded release SHA-256 and source update date. Country lookups support IPv4 and IPv6 and run locally with [mmdb-lib](https://github.com/runk/mmdb-lib); no visitor IP is sent to a lookup service. Private and unrecognized addresses are displayed as unknown/local. Anycast, VPNs and outdated allocations may make inferred country differ from a visitor’s physical location.

The database is bundled with the release. Refresh it from the publisher periodically, verifying the individual GitHub release asset digest before replacing this file. Review the publisher’s current license and preserve attribution.
