import React from "react"
import Layout from "../components/layout"
import { graphql } from 'gatsby'

export default ({ data }) => (
  <Layout>
    <h1>Concert Photography</h1>
    {data.allCloudinaryFolder.edges.map(({ node }, index) => (
              <div key={node.name}>
                { node.name }
                <img src={ data.allCloudinaryImage.edges.find(edge => edge.node.folder===node.name).node.thumb}/>
              </div>
            ))}
  </Layout>
)

export const query = graphql`
  query {
    allCloudinaryFolder {
      edges {
        node {
          name
          slug
        }
      }
    }
    allCloudinaryImage(filter: {tags: {eq: "cover"}}) {
      edges {
        node {
          folder
          thumb
        }
      }
    }
  }
`