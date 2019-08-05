module.exports = {
  siteMetadata: {
    title: 'Joseph Patrick Photography',
    description: 'Photographer',
    language: 'en-us',
    email: 'joe@josephpatrickphoto.com',
    siteFacebookURL: 'https://www.facebook.com/joe.takes.pictures/',
    siteInstagramURL: 'https://www.instagram.com/i_am_the_joe/',
  },
  plugins: [
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'data',
    //     path: `${__dirname}/src/data/`,
    //   },
    // },
    'gatsby-transformer-sharp',
    // 'gatsby-transformer-yaml',
    // {
    //   resolve: 'gatsby-plugin-manifest',
    //   options: {
    //     name: 'Joseph Patrick Photography',
    //     short_name: 'jpphoto',
    //     start_url: '/',
    //     background_color: '#3d3d3d',
    //     theme_color: '#f8485e',
    //     display: 'standalone',
    //     icon: 'src/assets/favicon.png',
    //     legacy: true,
    //   },
    // },
    // 'gatsby-plugin-offline',
    // 'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    // 'gatsby-plugin-styled-components',
    // 'gatsby-plugin-typescript',
  ],
};