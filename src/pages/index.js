import { React, useCallback } from "react"
import Layout from "../components/layout"
import { graphql, navigate } from 'gatsby'
import Gallery from "react-photo-gallery";
import ImageRenderer from "../components/imageRenderer"
import {useTransition, animated, config} from 'react-spring'


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

  const transitions = useTransition(photos, item => item.src, {
    config: config.default,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    trail: 80
    })

  const imageRenderer = useCallback(
    ({ left, top, key, photo, onClick }) => {
      console.log("TCL: transitions", transitions)
      const trans = transitions.find(trans => trans.item.src === photo.src)
      console.log("TCL: trans", trans)
      return <animated.div style={trans.props}>
          <ImageRenderer
            key={key}
            margin={"1px"}
            photo={photo}
            left={left}
            top={top}
            onClick={onClick}
            />
        </animated.div>
    },
    [transitions]
  );
  
  

  

  return (
  <Layout>
    <Gallery 
      photos={photos} 
      onClick={nav} 
      // targetRowHeight={400} 
      renderImage={imageRenderer} 
      limitNodeSearch={30}
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