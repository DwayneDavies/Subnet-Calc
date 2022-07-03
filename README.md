# Subnet Calc 0.6 (Beta One)
This is a simple subnet calculator written in JavaScript. I created this mostly as a hobby project and as part of my developer portfolio.

I chose not to use any existing code that might exist to help perform this task. It was more fun to write the code to do all this math for me, especially as it helped me verify that I have some grasp of subnetting concepts.

You can use this however you like and not just for helping you figure out subnetting. You may steal some of my code if you find it useful.

You will probably find that most things are done in a simple way, without anything tricky. Not that performance is likely to be an issue, as there are not a lot of complicated operations here and there is no server-side data. Everything is calculated by your browser.

It is currently somewhat mobile responsive and might display fairly well on your phone. I will likely improve this in an update in the near future.

It is currently in BETA. Things seem to work, but there are some edge cases I have not yet accounted for or which I could handle differently. I have handled CIDR values of /31 and /32 differently. This could be improved and explained further.

This application uses the local storage feature of modern browsers. Not all browsers support this feature. For a list of supported browsers,  [check this link](<https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#browser_compatibility)> "Local storage browser support").

It uses the querySelector method. This has been widely supported by almost all modern browsers since its introduction in 2013.

Things that need doing, which I have not done or finished doing: 

- [ ] Optimizing the CSS to check for redundancies.
- [ ] The JavaScript is largely self-documentating and very modular. I have hence, felt little need to comment my code. I may add a few comments to clarify what I am doing for those that wish to follow along.
- [ ] Tweak styling, including the help text to make more mobile friendly and nicer looking.
- [ ] The local storage is not working in Opera, at least not on my machine. I need to test this on other machines. It might work fine for you.
- [ ] Add a favicon.
