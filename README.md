# Subnet Calc
This is a simple subnet calculator written in JavaScript. I created this mostly as a hobby project and as part of my developer portfolio.

I chose not to use any existing code that might exist to help perform this task. It was more fun to write the code to do all this math for me, especially as it helped me verify that I have some grasp of subnetting concepts.

You can use this however you like and not just for helping you figure out subnetting. You may steal some of my code if you find it useful.

You will probably find that most things are done in a simple way, without anything tricky. Not that performance is likely to be an issue, as there are not a lot of complicated operations here and there is no server-side data. Everything is calculated by your browser.

It is currently somewhat mobile responsive and might display fairly well on your phone. I will likely improve this in an update in the near future.

It is currently in beta. Things seem to work, but there are some edge cases I have not yet accounted for or which I could handle differently. For example, could I handle a CIDR value of /32 (subnet mask 255.255.255.255) diffently? Perhaps. 
