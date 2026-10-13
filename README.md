# Subnet Calc Version 0.8

A fast, no-install IPv4 subnet calculator that runs entirely in your browser. Enter an address and a CIDR prefix and get the network details and a table of the subnets around your address.

I built this as a hobby project and as part of my developer portfolio. I deliberately wrote all the subnetting math myself instead of using an existing library, because it was a good way to check that I understood the concepts.

## Features

- **Full network summary:** network address, subnet mask, wildcard mask, broadcast address, subnets in this block, addresses per subnet, usable hosts, first host and last host.
- **Subnet table:** the subnets that share the leading octets of your address, each with its network address, address range and broadcast address.
- **Prefixes /1 to /32**, including the special cases below.
- **Input validation:** rejects out-of-range octets, missing or extra octets and leading zeros.
- **Plain-English help:** hover over, or tab to, any result label to see what the term means.
- **Remembers your last input** using the browser's local storage.
- **Responsive and accessible:** works on phones, supports keyboard use and screen readers, and follows your system's light or dark setting.
- **Private:** there is no server and no data leaves your browser.

## Using it

There is nothing to build or install. Open `index.html` in a modern browser.

1. Type an IPv4 address, for example `192.168.5.77`.
2. Choose a CIDR prefix from the list.
3. Press **Calculate** (or Enter).

For `192.168.5.77` with `/20` you get:

| Result | Value |
| ------ | ----- |
| Network address | 192.168.0.0 |
| Subnet mask | 255.255.240.0 |
| Broadcast address | 192.168.15.255 |
| Wildcard mask | 0.0.15.255 |
| Subnets in this block | 16 |
| Addresses per subnet | 4,096 |
| Usable hosts | 4,094 |
| First host | 192.168.0.1 |
| Last host | 192.168.15.254 |

## What "Subnets in this block" means

The calculator steps through the octet where the prefix ends and keeps the earlier octets fixed. "Subnets in this block" is how many subnets of your chosen size fit in that block, and the subnet table lists them.

For a /20 the block is the /16 that shares your first two octets (`192.168.x.x`), and 16 /20 subnets fit in it. It is not a count across the whole IPv4 address space.

At most 256 subnets are shown, because that is how many values one octet can take.

## How /31 and /32 are handled

| Prefix | Broadcast | Usable hosts | Notes |
| ------ | --------- | ------------ | ----- |
| /32 | N/A | 1 | A single host. First and last host are the same address. |
| /31 | N/A | 2 | Point-to-point link, as described in [RFC 3021](https://datatracker.ietf.org/doc/html/rfc3021). Both addresses are usable. |
| /30 and larger | Shown | addresses − 2 | The first address is the network and the last is the broadcast. |

## Accuracy

The calculation functions were checked against an independent bitwise implementation (and against Python's `ipaddress` module) across every prefix from /1 to /32. The checks covered:

- every value of every octet position at every prefix,
- 300,000 random address and prefix combinations,
- every row of the subnet table,
- the IP address validator against valid and invalid inputs.

That is 463,840 calculation cases with no mismatches.

## Known limitations

- **IPv4 only.** There is no IPv6 support yet.
- **No whole-address-space count.** The tool counts and lists subnets within one block, as described above.
- **No /0 option** in the prefix list.
- The "not enough usable hosts" message in the page is a placeholder and is never shown.

## Project structure

```
index.html       Page markup
css/styles.css   Styles (light and dark themes, responsive layout)
js/scripts.js    Validation, subnet math and page updates
```

There are no dependencies and no build step.

## Browser support

Any current browser should work. The page uses:

- `localStorage` to remember the last input (if it is unavailable the calculator still works),
- `querySelector`,
- a native `<dialog>` for the About box, opened with the `commandfor` and `command` attributes. Older browsers need the [invokers polyfill](https://github.com/keithamus/invokers-polyfill), which the page loads only when needed.

## Roadmap

- [ ] Show the total number of networks across the whole address space.
- [ ] A VLSM planner: allocate subnets for a list of host counts.
- [ ] A binary view that highlights the network and host bits.
- [ ] IPv6 support.
- [ ] Add a favicon.
- [ ] Add comments to the JavaScript for people who want to follow along.
- [ ] Check that local storage works in Opera.

## License

Released under the [GNU General Public License v3.0](LICENSE). You are welcome to use this however you like and to borrow any code you find useful.

## Author

Dwayne Davies
