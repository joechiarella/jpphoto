require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: 'Joseph Patrick Photography',
    email: 'joe@josephpatrickphoto.com',
    siteFacebookURL: 'https://www.facebook.com/joe.takes.pictures/',
    siteInstagramURL: 'https://www.instagram.com/i_am_the_joe/',
  },
  plugins: [
    `gatsby-plugin-emotion`,
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `${process.env.GA_KEY}`
      },
    }
  ],
};