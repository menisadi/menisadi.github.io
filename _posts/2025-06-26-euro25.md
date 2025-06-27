---
layout: single
title: "Votes vs. Plays: Eurovision 2025 on Spotify"
toc: true
# toc_label: "Eurovision 2025 on Spotify"
collection: posts
---

I'll admit it: I've always had a soft spot for music competitions. There's
something about the thrill of unknown performers showcasing their talents that
draws me in. And year after year, Eurovision is one of the most exciting events on the calendar. While some might see it as a campy extravagance, I've grown to appreciate the diversity and energy that Eurovision brings, both musically and culturally.

This year, when the glitter settled on Basel’s St. Jakobshalle, Austria’s operatic club anthem [**“Wasted Love” by JJ**](https://www.youtube.com/watch?v=onOex2WXjbA) had lifted the crystal microphone with 436 points. A few days later, on the first quiet Tuesday after the contest, I opened the Spotify app to listen to some of the songs from the finals, and wondered how those songs were behaving in the real-world marketplace, more precisely, of Spotify plays. After taking a quick look at the Global Chart, I though that relying on the global chart alone is quite risky because a single stream from Berlin counts exactly the same as one from Reykjavík, even though Germany’s listeners' base is about 25 times larger.

So I pulled the daily top-200 chart **for every country I could find a Spotify chart** and for each, I looked for all the songs from the finals and which location on the chart they were. The result was a matrix: rows are the charting country, columns are the Eurovision songs (identified by the country they represented). Positions run from 1 to 200; blanks mean the track missed the top-200. I omitted columns which were all blank.

![Cross Table]({{ '/assets/euro25/cross.png' | relative_url }})

## Week-one snapshot - hype everywhere

Two simple points arise from the above:

**1. Countries loved their own song**
This is quite an obvious and non-surprising observation. Still, it is worth noting that every finalist managed to crack its own domestic top-200. In fact, the median placing at home was an impressive number 3, with five delegations (Austria, Israel, Netherlands, Portugal and Sweden) debuting at number 1! Only Denmark and the United Kingdom saw their songs stall outside the top 50, maybe due to lower local enthusiasm or maybe just a stronger competition that week in the chart.

**2. Reach versus rank**
Counting how many national charts a track entered gives a people-powered view of popularity. The natural thing to do is to compare it to the competition result.

![Charts vs Score]({{ '/assets/euro25/scatter.png' | relative_url }})

The scatter plot above compares that count with the Eurovision scoreboard. The line slopes up but not perfectly (correlation is about 0.53). It seems that the correlation is higher on the top entries which kinda makes sense, either by people searches focusing on them later to listen to the "winners", or the other way around as the more we go up the scoreboard the more the competition is really heated.

If we focus just on the chart count we can present it in the following form:

![Bars Count]({{ '/assets/euro25/bar_count.png' | relative_url }})

Some numbers:

- Austria - ["Wasted Love"](https://www.youtube.com/watch?v=-ieSTNpxvio) was the winner on stage and on Spotify, landing in 30 of 31 possible national charts. Anyone want to give the winner another listen. It is possible that even those who didn't watch saw the headlines and looked for the song.
- Estonia - ["Espresso Macchiato"](https://www.youtube.com/watch?v=5MS_Fczs_98) was, in my view, the dark horse of this year. A bit silly ([and maybe offensive](https://www.theguardian.com/tv-and-radio/2025/feb/20/italy-estonia-offensive-eurovision-entry-tommy-cash)) but really catchy song, not only got up to the third place but also almost tied with Austria for reach (29 charts).
- Germany - I didn't see this coming. Germany's ["Baller"](https://www.youtube.com/watch?v=zJplC4-9Scs) got only 15th on the scoreboard yet tight for second-highest reach, appearing in 29 charts. I guess I will give it another listen.
- Norway - The second clear outlier on the graph. Norway's ["Lighter"](https://www.youtube.com/watch?v=pUjWzQ671MQ) was, in my personal taste, quite generic and not so tight on stage, so I'm a bit surprised it did so well on the charts.

### Side note - the **Eurovibe level**

After looking at the heatmap above, I though that maybe Spotify’s country charts can let us approximate how much listeners embrace the contest on each country, not just their own entry. I counted, for every country, how many of the 26 finalist songs entered the local top-200 in the first post-Eurovision snapshot to create a "score":

![Eurovibe bars]({{ '/assets/euro25/eurovibe_bars.png' | relative_url }})

Next, I decided that it might be better to group countries into four intuitive bands.
I'm curious to see if this is consistent through the years.
By the way, I'm open to better naming for this made up metric.

| Eurovibe level | Definition                     | Markets that qualify                                                                                                         | Quick read                                                                                                                                     |
| -------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Heatwave**   | 20 - 26 finalist songs charted | Austria, Estonia, Finland, Germany, Iceland, Latvia, Lithuania, Luxembourg, Netherlands, Norway, Poland, Sweden, Switzerland | These places, at least for this week, seems to breathe Eurovision. The Nordics and Baltics cluster is quite clear here but they are not alone. |
| **Warm**       | 10 - 19 songs                  | Belgium, Denmark, Greece, Israel, Ukraine                                                                                    | Solid interest: plenty of cross-border listening yet not quite full-playlist devotion.                                                         |
| **Mild**       | 4 - 9 songs                    | Spain, United Kingdom, Italy, Portugal, Czech Republic, Belarus, Hungary, Ireland, Slovakia                                  | These audiences mostly stream their own act plus a handful of viral standouts (often the winner and one or two uptempo bops).                  |
| **Frosty**     | 0 - 3 songs                    | France, Bulgaria, Romania                                                                                                    | Maybe they just posed a serious competition on the chart, but maybe those countries just didn't connect with Eurovision music.                 |

---

## One month later - who stuck around?

A month passed, the world moved on. Few days ago I heard my son singing to himself a familiar tune "Espresso Macchiato ...". I was curious and asked him where did he picked it from. He told me that its the songs everyone is singing in his school. So, I went back to the charts. I repeated the scrape I ran four weeks ago. Most tracks had slipped away, but some endured. Here is my second snapshot:

![One Month Later - heatmatp]({{ '/assets/euro25/cross_later.png' | relative_url }})

![One Month Later - bars]({{ '/assets/euro25/bar_count_later.png' | relative_url }})

Three observations emerge:

1. **Estonia holds the crown for staying power.** “Espresso Macchiato” stayed on most charts, by keeping 16 of its initial 29 placements, a retention rate of 55%. That might suggests organic replay rather than just a momentary meme. If you want, Tommy Cash is the true empirical winner of this year, or at least the true hit maker.
2. **Slow-burners rise:** Norway is still strong, I give up, I don't get it. Also Germany and [Sweden](https://www.youtube.com/watch?v=WK3HOMhAeQY) (disclaimer: my favorite song). Also, Portugal’s ["Deslocado"](https://www.youtube.com/watch?v=-s1Cc2uEj3U), an intimate, low-key ballad preserved nearly 44 percent of its early traction. I really like this little song, which came only 21 on the finals, so its relative success made me smile.
3. **Winners fade faster than you think.** JJ’s victorious “Wasted Love” slipped to a 17 percent survival rate. I wonder if this strengthen the case of [those](https://www.wired.com/story/eurovision-app-voting-uk-and-bias/) [criticizing](https://www.theguardian.com/tv-and-radio/2025/may/21/eurovision-public-vote-israeli-near-win-social-media-campaigns) [the scoring system](https://www.reddit.com/r/eurovision/comments/1cr2fch/i_think_the_current_voting_system_is_broken/), or maybe it is just a common phenomenon.

---

## Takeaways?

Not much, just that, maybe, a high final rank guarantees initial curiosity, not durability. Oh, and that some countries are really into Eurovision songs while some are not.

In the end, all these numbers were collected out of pure curiosity and for the fun of comparing Eurovision hype with real-world listening. They rely on two isolated Spotify snapshots and ignore dozens of other platforms, cultural quirks and release-week coincidences. Treat the Eurovibe tiers and survival ratios as conversation starters, not precision metrics, and assume we are certainly missing plenty of factors that shape each country’s musical landscape.

_[Code available [here](https://github.com/menisadi/eurovision2025)]_
