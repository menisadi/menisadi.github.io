---
layout: single
title: "The Jewish Leap-Year Rule Is Mathematically Optimal"
toc: true
toc_sticky: true
collection: posts
tags:
  - date
  - judaism
  - history
  - math
  - continius fractions
  - lecture
---

In a few days, the year 2025 will end.  
I want to use the opportunity (or the excuse)
to talk about a mathematically interesting difference between the Gregorian way of intercalation and the Jewish one.
In a certain sense the problems are similar in nature, but in practice they are quite different.

## Background: How We Compute a Year

### Gregorian Intercalation (Leap Days)

Let's start with a quick reminder of how the Gregorian calendar handles leap years.  
The year, by the definition used in the Western world today, is a solar year,
i.e., it is defined by the number of days it takes the Earth to orbit the Sun.
In a certain sense, this is the timescale that dictates the agricultural cycle and the seasons,
and therefore it's a natural periodicity to align ourselves with.

In fact, the year was not defined by the Earth's motion per se, but by the seasonal year: how long it takes until the Sun returns to the same position.
In other words, the number of days from one day–night equality (an equinox) to the next.

Such a year, as everyone knows, lasts 365 days.  
But of course, not *exactly* 365 days.
Already the ancients, who spent a lot of time analyzing the heavenly bodies,
noticed that it's about 365 and a quarter.
The calculation became more and more refined, and today we can say that the average length of a (mean) tropical year is approximately:

$$365.24219.$$

So what do we do? How do you run a calendar with that knowledge?  
You could ignore it. You'd get a drift of about a quarter of a day per year, fine.
But after a hundred years you already accumulate a drift of almost a month:
winter holidays are no longer really in winter,
and spring events can slide into winter.
The Muslims, for example, decided in a way,
in their lunar calendar, that they simply don't care about this.

Another option is “intercalation,” i.e., to make the year's length dynamic.
In this case, the system effectively adds about a quarter-day per year (implemented as a leap day every four years).
There is no such thing as a quarter-day in the calendar,
so we add a whole day once every 4 years,
and on average we added a quarter-day each year.

But the gap is actually a little less than a quarter,
which means some drift still remains.
In the classical Julian calendar the error was about 11 minutes per year,
or one day every 128 years.
After a bit more than 1500 years, this became a problem.
I won't get into the history, we'll jump to the solution used to this day,
the Gregorian calendar which uses the following rules:

**Every 4 years we add a day to February,
except once every 100 years, when we don't,
except once every 400 years, when we do.**

The current error dropped to about 27 seconds per year,
or one day every a bit more than 3200 years.

In terms of an average year length, the Gregorian rule is:

$$365 \frac{97}{400} = 365.2425.$$

### Jewish Intercalation (Leap Months)

In Judaism the story is a bit different.  
We have two yearly cycles: solar and lunar.
The solar year, as mentioned, is about 365 and a quarter days.
The lunar year, 12 cycles of the Moon around us, adds up to roughly 354 days.

There is a gap of about 11 days,
which could accumulate to roughly a month every 3 years
and push Passover out of the spring season.
As the Bible explicitly name Passover's month "the spring month",
Judaism aim to keep it so.
Therefore, we add an extra month about once every 3 years,
more precisely, 7 times every 19 years.

Let's put the exact rule aside for a moment,
and try to phrase the problem that Jewish intercalation is trying to solve.
The Hebrew calendar tries to create a situation where cycles of the lunar month produce a solar year.
So the question is: how many such lunar months do we need in a year?
12, as noted, won't be enough, so we need, like the added day in the Gregorian calendar,
to add “fractions of a year” by inserting a month from time to time.

More precisely: the average length of a lunar month[^lunar] is
[^lunar]: There is a whole separate system aimed at controlling the average month length to account for various religious constrains in the Jewish calendar. We will not get into that here.

$$29.53059,$$

We already mentioned the length of a solar year.
The ratio between them is:

$$12.36826592.$$

The Jewish approximation, those 7 leap years (with extra month) in a 19-year cycle,
resulting in $$12 7/19$$ months (on average) year.
This also has some deviation, we'll touch on that later.

I want to claim here, in the name of my number theory lecturer, Prof. Ido Efrat,
that the Jewish correction is optimal, while the Gregorian one is not.
To explain what that means, we need a bit, really just a bit,
of background and a reminder from the world of numbers.

## A Bit of Number Theory

### Types of Numbers

There are several kinds of numbers.
The simplest and most familiar are the *natural* numbers: 0, 1, 2, and so on.  
Of course that isn't enough for many things in life,
so humanity continued to invent (or discover) numbers.

After adding negative numbers, we also added fractions.
These are called the *rational* numbers.
The meaning is not “reasonable and logical” numbers,
but numbers that can be expressed as a ratio of two natural numbers,
rational in the sense of *ratio*.
This set includes one half, one third, 15 eighths, 60.6, and so on.

As expected, the next ones are the *irrationals*:
numbers that cannot be expressed as a ratio of two natural numbers.
Famous examples are numbers like $\sqrt{2}$ or $\pi$,
the ratio between a circle's circumference and its diameter.
There are infinitely many others, but I hope the idea is familiar.

### Diophantine Approximations

But here we run into a technical problem.  
These irrational numbers, how do we deal with them in reality?
If we want to compute a circle's circumference from its radius, how do we work with that?

The obvious answer is that we don't care that $\pi$ is infinite and can't be written as a fraction,
an approximation of $\pi$ is enough.
The Sages, as is well known, treated $\pi$ simply as 3.
This is indeed good enough for the overwhelming majority of everyday needs.
If we need a bit more precision, we can go further and use 3.14.

But how do we get such an approximation?
How do we approximate an irrational number using fractions?  
This kind of approximation is called a *Diophantine approximation*.
It already troubled the Greeks,
who tried to compute this ratio that we now call $\pi$ using various geometric methods.
In fact it's a more general problem: how to approximate any number using simple fractions.

The most natural approach, at least for a modern person who thinks in decimals,
is just to "cut off" the digits somewhere.
So instead of $3.141592\ldots$ we stop after the 4,
and we get the famous 3.14, or in simple fractional language:

$$3 \frac{14}{100}$$

At this point I want us to notice that the denominator is 100.
I point this out to highlight that we can actually be “more efficient”:
instead of 3 and 14 hundredths we can take the approximation
$3 \frac{1}{7}$, i.e., about 3.1428.

Why do I say this approximation, the one the Greeks found, is better?  
Because on the one hand it is at least as close
(in fact closer: its gap from $\pi$ is smaller than that of 3.14),
and moreover it uses a smaller denominator, i.e., it is a less “complicated” fraction.
Think of the Greeks: to compute fractions they sometimes really had to divide physical things in the world.
Dividing something into 7 is much easier than working with hundredths.

This raises the question: how do we find an approximation that is as “efficient” as possible,
balancing the denominator size (the “complexity” of the fraction) against the accuracy it gives us?

### Continued Fractions

#### Meeting the Monster

The solution, as it turned out a few hundred years later,
lies in a strange creature called a *continued fraction*.  
A regular fraction is familiar: $\tfrac12$, $\tfrac59$, and so on.
A continued fraction is created when, in the denominator,
we insert a number that itself has a denominator with another fraction, and so on.
For example:

$$
1 + \frac{1}{1 + \frac{1}{1+1}}
$$

and

$$
1 + \frac{1}{2 + \frac{1}{3 + \frac{1}{4}}}.
$$

You can of course convert each of these into an ordinary fraction by a rather boring bottom-up arithmetic process,
like for example:

$$
1 + \frac{1}{2 + \frac{1}{3 + \frac{1}{4}}}
= 1 + \frac{1}{2 + \frac{1}{\frac{13}{4}}}
= 1 + \frac{1}{2 + \frac{4}{13}}
= 1 + \frac{1}{\frac{30}{13}}
= 1 + \frac{13}{30}
= \frac{43}{30}.
$$

So at this stage it's not completely clear why new form is good,
it's just complicated and takes up more space, no?

The topic becomes interesting when we ask the question that a good mathematician asks almost every time they meet a new concept:
“I wonder what happens if we continue this to infinity.”

Let's take a simple example that uses only the digit 1 :

$$
1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \cdots}}}.
$$

If we start from the top and each time “cut” the "monster" to look only at its beginning, then:

- In the first line we get simply $1$.
- One step deeper gives $1 + \frac{1}{1+1} = \frac{3}{2} = 1.5$.
- One more step gives $1 + \frac{1}{1 + \frac{1}{1+1}} = \frac{5}{3} = 1.6666\ldots$.
- And continuing gives $\frac{8}{5} = 1.6$, and so on.

We can keep deepening the fraction, each time extending it further.
What we discover is that the numbers we get do not just scatter randomly.
They converge closer and closer, to a particular point, which in this case is:

$$1.61803398875\ldots$$

For those who don't recognize it, this is the *golden ratio*,
a very interesting number that appears in many places in nature and in mathematics.

#### Why This Is Useful

Okay, so it can be aesthetic. Still doesn't really justify the mess.

The important insight is that continued fractions give us another way to represent rational numbers,
and more than that: another way to represent approximations of numbers,
a different way to “round” a number by “cutting” the representation.
Instead of truncating a decimal expansion after some digits,
we truncate the "inverted tower" of a fraction inside a fraction.

For example, if we look at the continued-fraction representation of $\pi$:

$$
\pi = 3 + \frac{1}{7 + \frac{1}{15 + \frac{1}{1 + \frac{1}{292 + \cdots}}}}.
$$

If we cut it very early, we get after the firs digit, we get simply $3$.  
If we add the next "part", we get $3 + \frac{1}{7}$.  
Note, that with this representation, when we "cut off" the representation after the second "level" we get the Greek approximation, once we mentioned is better than the famous $3.14$.
If we continue one more step, we get, after a bit of arithmetic:

$$3 + \frac{1}{7 + \frac{1}{15}} = 3 + \frac{15}{106} = \frac{333}{106} \approx 3.141509.$$

And if we add one more step:

$$3 + \frac{1}{7 + \frac{1}{15 + 1}} = 3 + \frac{16}{113} = \frac{355}{113} \approx 3.1415929.$$

At each stage we get a rational fraction that gives an increasingly better approximation to $\pi$.

Here comes the interesting part: it turns out that this way of generating approximations is the best that can be.
In other words, an approximation produced by truncating a continued fraction cannot be improved without increasing the denominator.
As we said, increasing the denominator is essentially increasing the “complexity” of the fraction.

So, to summarize: if we want to approximate a number optimally, we can convert it to a continued fraction and “cut” it somewhere.

## Back to Intercalation

### The Civil Calendar Could Have Done Better

Reminder: the designers of the civil (Julian/Gregorian) calendar needed to find an approximation to the number of days in a solar year, the number in Source 1.  
The approximation used in practice, after the Gregorian correction, is:

$$365 \frac{97}{400} = 365.242.$$

That's not bad. But let's enlist our new friends: continued fractions.

A continued fraction equal to the target number is:
$$
365 + \frac{1}{4 + \frac{1}{7 + \frac{1}{3 + \frac{1}{24 + \frac{1}{6 + \frac{1}{2 + \cdots}}}}}}.
$$

If we truncate it after one step we get the Julian approximation:

$$365 \frac{1}{4} = 365.25.$$

If we go one more step we get

$$365 \frac{7}{29}.$$

If we go another step, we get

$$365 \frac{8}{33}.$$

Already at this stage we've obtained an approximation that is better than the current one by about 50%.
But, you might say: a cycle of 8 leap years every 33 years is less memorable than the current system,
so the small improvement isn't worth it.
Fair enough.

Here is the interesting point: go one step further and we get

$$365 \frac{31}{128}.$$

What's exciting about that?  
You can arrange this approximation very easily:
intercalate every 4 years, as we do now, but once every 128 years, skip one intercalation.

So instead of the current system that includes three “levels” of rules,
we get a shorter and more accurate system.
How much more accurate?
More than 100×.
With such a calendar we would get a drift of one day only after about 400,000 years.

So while many people like to say the civil calendar is very accurate,
in a certain sense it is what we would call *suboptimal*.
<!-- Reviewed up to this point -->

### The Jews Are the Best

Now let's move to the Jewish calendar.  
Recall that in the Jewish case the ratio we are trying to approximate,
the number of lunar months in a solar year, is:

$$12.36826592.$$

The continued-fraction representation of this number is:

$$
12 + \frac{1}{2 + \frac{1}{1 + \frac{1}{2 + \frac{1}{1 + \frac{1}{1 + \frac{1}{17 + \frac{1}{2 + \dots }}}}}}}
$$

Which yields the following sequence of approximations:

$$
12 \tfrac{1}{2},\quad 12 \tfrac{1}{3},\quad 12 \tfrac{3}{8},\quad 12 \tfrac{4}{11}.
$$

The last two already look pretty good,
but in fact they would produce a full-day drift once every 5 and 7 years, respectively.
Over two thousand years of exile, that would accumulate into a dramatic drift.

The next approximation is the one we know:

$$12 \frac{7}{19} = 12.36842105.$$

This approximation reduces the drift to about one day per 200 years,
a significant improvement at a relatively low price.
In fact, you can say that it is the minimal approximation complexity that makes the calendar reasonably stable.

And as we said, since this approximation is obtained by truncating the continued fraction, it is optimal.
If we were searching for a better approximation,
we would necessarily have to increase the cycle length,
which is not short to begin with.

To complete the picture: the next approximation in line is
$12 \frac{81}{220}.$
As far as I know, there is no reasonable way to implement such a cycle.

## Conclusion

The civil (Gregorian) calendar is trying to approximate the number of days in a solar year.  
Their approximation is:

$$365 \frac{97}{400}.$$

Using continued fractions we showed that a better, some would say simpler, approximation is:

$$365 \frac{31}{128}.$$

The Jewish calendar is trying to approximate the number of lunar months in a solar year.  
The Hebrew approximation is:

$$12 \frac{7}{19}.$$

Here, the continued-fraction development shows that this is the optimal cycle:
any other approximation would either have a much larger drift or a much longer cycle.
