# CSE 135 TEAM MONSTER
Ruinan Ma, Haochen Jiang, Will Luo

---
## Our page
[link to our page: reporting.cse135.monster](https://reporting.cse135.monster/)

---
## Grader Account (server):
We use SSH to log in to our server, so please download the `grader_key` (private key) and use the following command to log into the server (replace the path):  
```
ssh -i /path/to/private_key/grader_key grader@134.209.213.47
```
We recommend you to save the private key to your `.ssh` directory or other hidden directory.  If it prompts to ask you to continue connecting, just type `yes`.  
**Note:** If you see an error message like **"WARNING: UNPROTECTED PRIVATE KEY FILE!"**, please enter the command: (replace the path)
```
chmod 600 /path/to/private_key/grader_key
```
Then you should be good to log in. If there're still issues to log in, please contact r7ma@ucsd.edu.   
The `sudo` password is `cse135grader`.

## Grader Account (website):
<!-- TODO -->
1. Grader Basic Login
2. Grader Admin Login

---
## Dashboard
When designing the dashboard, I carefully considered the data we wanted to display and chose chart types that effectively communicate the relevant metrics to the users. Here's an explanation of my design decisions and the reasoning behind them:

1. Daily Bounce Rate Line Chart:
The line chart was chosen to represent the daily bounce rate because it effectively displays trends and patterns over time. The x-axis represents the dates, while the y-axis represents the bounce rate percentage. This chart type allows users to easily identify any spikes or dips in the bounce rate, helping them understand the overall performance of the website over a given period. It provides a clear visualization of the daily fluctuations and helps track progress in reducing the bounce rate.

However, it's important to note that our current statistics do not provide an extensive data set to generate a detailed, daily bounce rate chart. As such, the data points on our chart are quite sparse, often represented as either 1, 0, or 0.5, reflecting a high level of bounce rate volatility. This limitation could potentially be misleading, suggesting drastic fluctuations in user behavior when in reality it might be a byproduct of our limited dataset.

As we collect more data on viewer statistics over time, the daily bounce rate chart will become more informative and reliable. With a more robust dataset, the chart can yield valuable insights to identify patterns, recognize issues, and implement strategies for improvement. It would allow us to effectively track and analyze bounce rates, forming the basis for data-driven decisions to enhance user engagement and website performance.

2. Histograms for Average Load Time by Languages and Browsers:
Histograms were chosen to represent the average load time by languages and browsers. Histograms are suitable for displaying the distribution of continuous data and are ideal for comparing different categories. The x-axis represents the load time ranges, and the y-axis represents the frequency or count.

By using histograms, users can quickly identify the load time ranges that are most common and assess the performance of various languages and browsers. This information can help identify potential bottlenecks and prioritize optimization efforts. Users can easily compare the performance of different languages and browsers by analyzing the height and distribution of the bars. It provides a clear understanding of how load times vary across different categories.

The histograms highlight the differences in load times among various languages and browsers. The zh-CN language histogram shows a higher average load time compared to the en-US one, suggesting the website might need optimization for users who prefer the zh-CN language. It's crucial to address this disparity as it can affect user satisfaction and overall website performance. The histograms also help pinpoint specific load time ranges where optimization can have the most significant impact.

3. Grids for Browser Usage and Language Usage:
Grids were chosen to display the number of browser usage and language usage. A grid provides a concise and structured view of the data, allowing users to quickly scan and compare values. The grids present the raw count of users for each browser and language without the need for complex visualizations.

The grid for browser usage helps users understand which browsers are most popular among their website visitors. This information can be valuable for optimizing website compatibility and ensuring a seamless user experience across different browsers.

Similarly, the grid for language usage provides insights into the languages preferred by website visitors. It helps users assess the need for multilingual support or target specific languages for content localization.

The chart indicates that Chrome users experience significantly longer load times compared to Firefox and Safari users. It's imperative to investigate the root causes of these load time differences. They could be due to specific browser settings, the handling of web content by the browsers, or even differences in the network environments where users are accessing the website.

A striking observation from the language/loading-time chart is the strong presence of zh-CN users, with a notable correlation between these users and Chrome browser usage. Haochen, in particular, stands out as a significant contributor to both these stats.

This correlation suggests a few possibilities. There might be specific browser settings or extensions used by these zh-CN Chrome users that could be slowing down load times. Alternatively, it could be the case that users accessing the website from regions where zh-CN is predominant might have slower internet speeds.

To summarize, it's clear that website optimization efforts should prioritize improving load times for Chrome and zh-CN users, especially when Haochen is considered. These insights demonstrate the importance of tailoring website performance to user demographics and the technologies they use for an optimal user experience. However, these are preliminary findings and require further investigation to confirm. Long-term, it's recommended to continually monitor and analyze these metrics to maintain and improve website performance over time.


In summary, I made the following design decisions:

- Daily Bounce Rate: Line chart to visualize trends and patterns in bounce rate over time.
- Average Load Time by Languages and Browsers: Histograms to compare load times across different categories and identify performance variations.
- Browser Usage and Language Usage: Grids to present the raw count of users for each browser and language, allowing for quick comparison and analysis.

These design decisions were made with user-centered thinking in mind, considering the clarity, ease of interpretation, and relevance of the metrics for the users of the dashboard.

---
## Report
Guiding question: what is the bounce rate of our website? 

The detailed page for bounce rate analytics provides valuable insights into user behavior on the website, particularly regarding how quickly users leave the site after entering. The chosen data visualizations—grid, histogram, and pie chart—serve different purposes and provide a comprehensive understanding of bounce rates. Here's a discussion of the data and its significance for users:

1. Grid showing users by time intervals:
The grid breaks down the number of users based on time intervals, such as users who enter and leave the website in less than 5 seconds, between 5 seconds to 1 minute, and so on. This grid allows users to see the exact count of users falling within each time interval, providing a detailed breakdown of bounce rates at different engagement levels. Users can quickly assess which time intervals have the highest bounce rates and investigate potential issues.

For example, if a significant number of users are leaving the website within the first few seconds, it may indicate a problem with the landing page, such as slow loading times or irrelevant content. By examining the specific time intervals, users can identify critical points in the user journey where improvements are needed.

2. Histogram showing users by time intervals:
The histogram complements the grid by visualizing the distribution of users across time intervals. It provides a graphical representation of the same data, showing the frequency or count of users in each interval. The x-axis represents the time intervals, and the y-axis represents the number of users.

The histogram enables users to quickly grasp the overall distribution pattern of bounce rates and identify any trends or outliers. Users can observe the shape of the histogram, such as whether it is skewed to the left or right, indicating a concentration of bounce rates within specific time ranges. This information is valuable for identifying patterns and understanding user engagement levels.

3. Pie chart showing bounce rate vs. non-bounce rate:
The pie chart illustrates the proportion of bounce rates compared to non-bounce rates. It presents a clear visual representation of the percentage of users who leave the website immediately (bounce) versus those who engage further (non-bounce).

The pie chart allows users to quickly gauge the overall bounce rate as a percentage of total visitors. This information is essential for assessing the effectiveness of the website in capturing and retaining user interest. Users can easily compare the sizes of the bounce rate and non-bounce rate segments, identifying the proportion of users who bounce as opposed to those who continue exploring the site.

In summary, the chosen data visualizations effectively convey the bounce rate analytics:

- The grid provides a detailed breakdown of users by time intervals, helping users identify critical points where users leave the site.
- The histogram visualizes the distribution of users across time intervals, enabling users to spot patterns and outliers.
- The pie chart offers a clear comparison between bounce rates and non-bounce rates, allowing users to assess the overall bounce rate as a percentage of total visitors.

These design decisions were made with user-centered thinking in mind, ensuring that the chosen chart types align with the data and present it in an understandable way. The combination of the grid, histogram, and pie chart provides a comprehensive understanding of bounce rates, assisting users in identifying areas for improvement and optimizing user engagement.