"""Source-linked evidence additions, researched 17 October 2026.
All chart widths use zero-based axes. Forecasts are visually distinguished.
"""
from html import escape

SOURCES = {
 'deloitte26':('Deloitte, Digital Media Trends 2026','https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey.html'),
 'deloitte25':('Deloitte, Digital Media Trends 2025','https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html'),
 'ofcom25':('Ofcom, children’s online lives, June 2025','https://www.ofcom.org.uk/media-use-and-attitudes/media-habits-children/top-trends-from-our-latest-look-at-uk-childrens-online-lives'),
 'iab':('IAB, Creator Economy Ad Spend & Strategy Report 2025','https://www.iab.com/insights/2025-creator-economy-ad-spend-strategy-report/'),
 'goldman':('Goldman Sachs Research, April 2023','https://www.goldmansachs.com/insights/articles/the-creator-economy-could-approach-half-a-trillion-dollars-by-2027'),
 'youtube':('YouTube, Made on YouTube, September 2025','https://blog.youtube/news-and-events/made-on-youtube-2025/'),
 'investment':('Dude Perfect announcement, April 9, 2024','https://www.prnewswire.com/news-releases/dude-perfect-and-highmount-capital-announce-partnership-inclusive-of-strategic-growth-capital-302111238.html'),
 'fox':('FOX, June 16, 2025','https://www.foxcorporation.com/news/corp-press-releases/2025/fox-advertising-launches-enhanced-brand-storytelling-program-with-strategic-investment-in-the-lighthouse/'),
 'tubi':('Tubi, October 29, 2025','https://corporate.tubitv.com/press/tubi-announces-four-film-slate-with-hartbeat-in-first-exclusive-creator-content-deal/'),
 'bbc':('YouTube / BBC / NFTS, May 15, 2026','https://blog.youtube/news-and-events/youtube-bbc-nfts-skills-program/'),
 'disney':('Disney, October 15, 2026','https://thewaltdisneycompany.com/news/dude-perfect-creative-partnership/'),
}

def source(key, note):
 title,url=SOURCES[key]
 return f'<div class="chart-source"><a href="{url}" target="_blank" rel="noopener">{title} ↗</a><br>{note}</div>'

def bar(label,value,maximum=100,suffix='%',style=''):
 return f'<div class="bar-row {style}"><div class="bar-label"><span>{label}</span><b>{value:g}{suffix}</b></div><div class="bar-track"><div class="bar-fill" style="--value:{value/maximum*100:.2f}%"></div></div></div>'

def axis(maximum=100,suffix='%'):
 return '<div class="chart-axis">'+''.join(f'<span>{maximum*i/4:g}{suffix}</span>' for i in range(5))+'</div>'

def chart(ident,title,subtitle,body,note):
 return f'<div class="research-visual"><h3 class="chart-head">{title}</h3><p class="chart-sub">{subtitle}</p><div class="chart" id="{ident}">{body}</div><button class="replay" data-replay="{ident}">↻ Replay chart</button>{note}</div>'

def section(ident,kicker,title,intro,body,light=True):
 return f'<section class="section research-section {"light" if light else "dark-chart"}" id="{ident}"><div class="wrap"><p class="eyebrow">{kicker}</p><h2 class="reveal">{title}</h2><p class="research-intro">{intro}</p>{body}</div></section>'

def donut(value,label):
 return f'<div class="donut-metric"><svg viewBox="0 0 160 160" aria-hidden="true"><circle class="donut-base" cx="80" cy="80" r="66"/><circle class="donut-arc" cx="80" cy="80" r="66" pathLength="100" style="--arc:{value}"/></svg><strong>{value}%</strong><p>{label}</p></div>'

def build_research():
 youth=chart('children-chart','Video is part of everyday discovery','UK internet users ages 8–14 · Published June 2025',
 '<div class="donut-pair">'+donut(96,'Reached by YouTube in a month')+donut(52,'Share of measured online time spent on YouTube and Snapchat combined')+'</div>',
 source('ofcom25','Passive measurement across smartphones, tablets and computers. TV sets and consoles are outside this measure. Monthly reach and share of time are different measures; the circles are not parts of one total.'))
 s=section('young-viewers','04 / Growing up with video','A world of stories.<br><em>Within reach.</em>','Video platforms are familiar places for young audiences to discover people, ideas and interests. A wildlife story can become part of that discovery.',youth)
 rows=''
 for gen,discovery,community in [('Boomers',23,30),('Gen X',46,53),('Millennials',68,67),('Gen Z',73,71)]:
  rows+=f'<div class="generation-pair"><h4>{gen}</h4>'+bar('Discover through social',discovery,style='discovery-bar')+bar('Follow across platforms',community,style='community-bar')+'</div>'
 genchart=chart('generation-chart','How fans discover and follow their interests','Share of U.S. fans agreeing with each statement · 2026 report',rows+axis(),source('deloitte26','n=2,977 U.S. fans; fieldwork October–November 2025. Discovery: social media is their primary way of learning about new entertainment. Cross-platform: fandom leads them across streaming, social, commerce and live events. These are attitudes, not viewing-time shares.'))
 notes='<details class="research-notes"><summary>Which generations are included?</summary><p>Deloitte defines Gen Z as born 1997–2011, millennials 1983–1996, Gen X 1966–1982, and boomers 1947–1965. Gen Alpha is not included in this survey. The separate UK child study above uses ages, not generation labels. These studies cannot be combined into one population.</p></details>'
 s+=section('generations','05 / Different generations, different habits','Discovery starts<br><em>in the feed.</em>','Social discovery and shared interests connect audiences across formats. The pattern is especially pronounced among younger fans.',genchart+notes)
 comparison=bar('Social media + user-generated video',154,200,'', 'discovery-bar')+bar('TV and movies',74,200,'', 'community-bar')+axis(200,'')
 comparison=chart('time-chart','Gen Z’s time, relative to the average consumer','Index: average consumer = 100 for each activity · U.S. · 2025 report','<div class="indexed-chart"><span class="index-baseline" aria-hidden="true"></span>'+comparison+'</div>',source('deloitte25','n=3,595 U.S. consumers ages 14+; October 2024 survey. Indices derived from reported differences: 54% more time on social/UGC; 26% less on TV/movies. These are not percentages of a day or a comparison of the two activities’ absolute hours. TV/movies includes streaming, not just broadcast.'))
 s+=section('media-time','06 / A different media mix','New viewing habits.<br><em>New creative openings.</em>','There is more than one route into a young person’s world. Creator video and television can complement one another, with stories travelling between them.',comparison)
 columns=''
 for i,(year,value,forecast) in enumerate([('2021',13.9,False),('2024',29.5,False),('2025',37,True),('2026',44,True)]):
  columns+=f'<div class="spend-column"><div class="column-space"><div class="column-fill {"forecast" if forecast else ""}" style="--height:{value/50*100}%;--column-delay:{i*.12}s"><b>${value:g}B</b></div></div><strong>{year}</strong><span>{"Forecast" if forecast else "Reported estimate"}</span></div>'
 spending=chart('spend-chart','U.S. creator advertising spending','USD billions · IAB’s November 2025 report','<div class="spend-scale" aria-hidden="true"><span>$50B</span><span>$25B</span><span>$0</span></div><div class="spend-columns">'+columns+'</div>',source('iab','2021 and 2024 are historical estimates; 2025 and 2026 are forecasts published with the 2025 report, rounded as shown on IAB’s summary page. This measures advertising spending, not venture investment or total creator revenue. Forecasts are hatched.'))
 s+=section('creator-spending','07 / Advertising follows audiences','Creators are becoming<br><em>a media channel.</em>','Brands are allocating real budgets to creator partnerships. IAB’s historical estimates more than doubled between 2021 and 2024.',spending)
 market=chart('market-chart','A forecast of the global creator-economy opportunity','Total addressable market · USD billions · Forecast published April 2023',bar('2023 estimate',250,500,'B')+bar('2027 forecast',480,500,'B','forecast-row')+axis(500,'B'),source('goldman','Goldman Sachs Research estimated a $250B market and projected $480B by 2027. This is an older forward-looking market estimate, not observed 2027 revenue or capital invested. It has a different scope from IAB’s U.S. advertising measure.'))
 payout='<article class="payout-card reveal"><p class="eyebrow">Money already paid out</p><strong>$100B+</strong><h3>To creators, artists<br>and media companies.</h3><p>YouTube reported this global payout over the four years preceding September 2025.</p>'+source('youtube','Company-reported cumulative payments. Includes artists and media companies, not only independent creators. This is neither annual revenue nor investment funding.')+'</article>'
 investment='<article class="payout-card investment-card reveal"><p class="eyebrow">A creator-business investment</p><strong>9 figures</strong><h3>Growth capital for Dude Perfect.</h3><p>Dude Perfect announced a nine-figure investment through its partnership with Highmount Capital in April 2024, supporting new projects and business expansion.</p>'+source('investment','One company’s announced investment, not a market-wide total. The announcement did not disclose an exact dollar amount.')+'</article>'
 s+=section('market-scale','08 / The economics of creation','An industry with<br><em>real momentum.</em>','Advertising, market size, platform payouts and investment tell different parts of the story. They are shown separately here and should not be added together.','<div class="market-pair">'+market+payout+'</div>'+investment)
 cards=''
 for key,date,name,title,copy in [
 ('fox','June 2025','FOX × The Lighthouse','Investing in creator collaboration','FOX announced a strategic investment in a creator studio and campus, alongside a creator-led intellectual-property initiative. The announcement did not disclose the investment amount.'),
 ('tubi','October 2025','Tubi × Hartbeat','Commissioning creator-led stories','Tubi announced a four-film creator-driven slate for 2026 through its Tubi for Creators programme.'),
 ('bbc','May 2026','BBC × YouTube × NFTS','Bringing the crafts together','The partners launched Create x Connect, a skills programme linking digital creators, television producers and journalists.'),
 ('disney','October 2026','Disney × Dude Perfect','Building around creator channels','Disney announced a company-wide creative partnership: new content for Dude Perfect’s own channels, plus selected content across Disney+, ESPN and Disney social platforms.')]:
  cards+=f'<article class="industry-card reveal"><p class="eyebrow">{date} / {name}</p><h3>{title}</h3><p>{copy}</p>'+source(key,'Company announcement.')+'</article>'
 s+=section('industry-moves','09 / Traditional media is responding','Different worlds.<br><em>More shared ground.</em>','Studios and broadcasters are building relationships with creators through investment, commissioning, training and creative partnerships. These are industry examples, not Follow the Wild partners.','<div class="industry-grid">'+cards+'</div>')
 s+='<section class="section research-methods"><div class="wrap reading"><p class="eyebrow">Reading the evidence</p><h2>Different measures.<br><em>One clearer picture.</em></h2><p>Research reviewed 17 October 2026. Each chart names its geography, population, date and source. U.S. fans, U.S. teens and UK children are different groups. Discovery, monthly reach, daily use and time spent answer different questions.</p><p>The evidence shows where audiences and industry activity are moving. It does not establish that screen time causes interest in wildlife, or measure Follow the Wild’s impact. Our ambition is to turn those creative openings into curiosity about the natural world.</p></div></section>'
 return s
