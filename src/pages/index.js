import { React, useCallback } from "react"
import Layout from "../components/layout"
import { graphql, navigate } from 'gatsby'
import Gallery from "react-photo-gallery";
import ImageRenderer from "../components/imageRenderer"

function Index({ data }) { 
  console.log("data", data.allCloudinaryFolder.edges)
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

  console.log("COVER IMAGES", photos)
  
  const nav = useCallback((event, { photo }) => {
    navigate(`/${photo.slug}/`)
  }, []);

  const imageRenderer = useCallback(
    ({ left, top, key, photo, onClick }) => (
      <ImageRenderer
        key={key}
        margin={"1px"}
        photo={photo}
        left={left}
        top={top}
        onClick={onClick}
      />
    ),
    []
  );
  

  return (
  <Layout>
    <Gallery photos={photos} onClick={nav} targetRowHeight={400} renderImage={imageRenderer} />  
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