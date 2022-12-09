# T.U.B.A

Analytics dashboard for Brackets(open source code editor platform)

Project Proposal
(Team: TUBA)

Problem Definition/Statement
Background
Brackets is an Open Source code editor, developed and previously maintained by Adobe. Since 1st
September 2021, Adobe has stopped supporting it officially. Like-minded developers from all over the
world made active open-source contributions to save the project. Thanks to the open-source
community, the platform still has monthly ~200K active users.

Why this project?
Brackets ahs multiple backend services to power the ecosystem. The community has also created a
Core Analytics Server with a library that interacts with these backend services to regularly collect
analytic events that are saved to a Wasabi storage. All these services currently generate
approximately ~5GB of log files on a monthly basis and the storage currently holds 4-5 months of
data. Currently there is no service that analyses the volume of incoming data which is why the open
source contributors have no means or insight to figure out how the current release is performing.
Additionally, there are approximately ~50 reported open issues on Github (and it is increasing) which
mostly remains unsolved due to lack of proper analysis or what language/platform to prioritize a fix
based on the current usage pattern.

Main Idea
We want to build an analytics platform for the brackets open-source project at a low cost which will
utilize big data tools and dashboards to analyse all the data. The project would provide valuable
insights through observable and predictive usage metrics to improve visualization of performance and
improve open-source developer response times. Metrics include the total number of count of various
eventTypes (fileOpen, fileSave, etc) per platform (MacOS, Windows) and programming languages
used (Python, Java, etc), calculate total number of unique users per platform, geographical
distribution of the number of users using a service that maps IP addresses to a country, alarm admins
incase predicted usage pattern falls below a threshold, predict possible outages using ML as a
prevention mechanism.

Why not use a Platform-as-a-Service product available on the market?
The current brackets project is completely unfunded, using Platform-as-a-service analytics products
available on the market turns out to be pretty expensive. For example, the pricing for Google Anayltics
360 (one of the most popular analytics service) is 150,000 USD per year.

Development Process
We plan to use Spark (for static analysis of past records by reading files and Spark Streams for real
time analytics), Brackets NodeJs APIs to read the analytics data as streams (Github Link), and
data-visualization front-end libraries (link).

Conclusion
By providing insights on the data in a dashboard format it allows the open-source developers a way to
visuzalize the performance of the current deployment and prioritize open issues. The usage metrics
provide explanatory observations on futuristic and causational behaviour of users and will allow
developers to set up alarm events when anomalies occur. Resulting in reduced developer response
times to pressing production issues. The analysis can also be used in future planning decisions to
save costs on geographical infrastructure decisions.
