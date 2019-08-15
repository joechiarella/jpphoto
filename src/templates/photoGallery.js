import { React, useState, useCallback } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { css } from "@emotion/core"

function PhotoGallery({data}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const folder = data.cloudinaryFolder
  const photos = folder.childrenCloudinaryImage.map((img) => (
    {
      src: img.thumb,
      full: img.imgUrl,
      width: img.width,
      height: img.height
    })
  )

  return (
    <Layout>
      <div css={css`
        text-decoration: none;
        font-style: normal;
        font-size: 2.0em;
        margin: 0.2em;
        `}>
        {folder.name}
      </div>
      <Gallery photos={photos} onClick={openLightbox} targetRowHeight={400} margin={1}/>
      <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={photos.map(x => ({
                  ...x,
                  src: x.full,
                  caption: x.title
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
    </Layout>
  )
}
export default PhotoGallery

export const query = graphql`
  query($slug: String!) {
    cloudinaryFolder(slug: {eq: $slug}) {
      childrenCloudinaryImage {
        thumb
        width
        height
        imgUrl
      }
      name
    }
  }
`