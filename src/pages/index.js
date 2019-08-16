import { React } from "react"
import Layout from "../components/layout"
import { graphql, navigate } from 'gatsby'
import GridGallery from "../components/gridGallery"


function Index({ data }) {
  const photos = data.allCloudinaryFolder.edges.flatMap(({ node }) => {
    const coverImages = data.allCloudinaryImage.edges.filter(edge => edge.node.folder===node.name)
    
    return coverImages.map(image => {
      const imgNode = image.node
      return {
        src: imgNode.thumb,
        width: imgNode.width,
        height: imgNode.height,
        slug: node.slug,
        folder: imgNode.folder
      }
    })
  })

  const nav = (photo, index) => {
    navigate(`/${photo.slug}/`)
  }

  const overlay = (photo) => {
    return photo.folder
  }

  return (
  <Layout>
    <GridGallery 
      photos={photos} 
      onClick={nav}
      overlay={overlay}
    />  
  </Layout>
)
}
export default Index

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
          width
          height
        }
      }
    }
  }
`