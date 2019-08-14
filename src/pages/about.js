import { React } from "react"
import Layout from "../components/layout"
import { graphql } from 'gatsby'

function Index({ data }) { 
  return (
  <Layout>
    <a href={data.site.siteMetadata.siteFacebookURL}>Facebook</a>
    <br/>
    <a href={data.site.siteMetadata.siteInstagramURL}>Instagram</a>
  </Layout>
)
}
export default Index

export const query = graphql`
  query {
    site {
      siteMetadata {
        siteFacebookURL
        siteInstagramURL
      }
    }
  }
`