const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.GOOGLE_API_KEY;

const getLighthouseMetrics = async (req, res) => {
  const { pageURL } = req.query;

  if (!pageURL) {
    return res.status(400).json({
      message: 'Bad Request: please provide pageURL in query params'
    })
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    pageURL
  )}&key=${apiKey}&strategy=desktop&category=performance&category=accessibility&category=seo&category=best-practices&category=pwa`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data.lighthouseResult;

    const screenshotBase64 = data.audits['final-screenshot'].details.data;

    // Aggregate scores by category
    const scores = {
      performanceScore: data.categories.performance.score,
      accessibilityScore: data.categories.accessibility.score,
      seoScore: data.categories.seo.score,
      bestPracticesScore: data.categories["best-practices"].score,
      pwaScore: data.categories?.pwa?.score,
    };

    // Individual audits for each category
    const audits = data.audits;
    const metrics = {
      ...scores,
      // Core Web Vitals
      coreWebVitals: {
        firstContentfulPaint: audits["first-contentful-paint"].displayValue,
        largestContentfulPaint: audits["largest-contentful-paint"].displayValue,
        cumulativeLayoutShift: audits["cumulative-layout-shift"].displayValue,
        totalBlockingTime: audits["total-blocking-time"].displayValue,
        speedIndex: audits["speed-index"].displayValue,
        colorContrast: audits["color-contrast"].score,
        metaDescription: audits["meta-description"].score,
      },

      screenshotImageUrl: `data:image/png;base64,${screenshotBase64}`,

      // jS execution time 
      totalBlockingTime: data.audits['total-blocking-time'].displayValue,
      timeToInteractive: data.audits['interactive'].displayValue,

      // Render Blocking Resources
      renderBlockingResources: data.audits['render-blocking-resources'].details.items.map(item => ({
        url: item.url,
        type: item.resourceType,
        startTime: item.startTime,
        duration: item.duration,
      })),

      // Resource Timing - Detailed Info on Assets Loaded
      resourceTiming: data.audits['resource-summary'].details.items.map(item => ({
        url: item.url,
        type: item.resourceType,
        transferSize: item.transferSize,
        responseTime: item.responseTime,
        startTime: item.startTime,
        duration: item.duration,
      })),

      diagnostics: data.audits['diagnostics'].details.items.map(item => ({
        url: item.url,
        message: item.message,
      }))
    };

    return res.status(200).json({
      message: 'Lighthouse metrics fetched successfully',
      data: metrics
    });
  } catch (error) {
    console.error("Error fetching Lighthouse metrics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getLighthouseMetrics
