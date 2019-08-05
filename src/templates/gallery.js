import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
  const folder = data.cloudinaryFolder
  return (
    <Layout>
      {
        folder.childrenCloudinaryImage.map(({ thumb }) => (
        <div key={thumb}>
          <img src={ thumb }/>
        </div>
        ))
      }
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    cloudinaryFolder(slug: {eq: $slug}) {
      childrenCloudinaryImage {
        thumb
      }
    }
  }
`