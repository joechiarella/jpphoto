import { React, useCallback } from "react"
import Gallery from "react-photo-gallery";
import {useTransition, animated, config} from 'react-spring'
import ImageRenderer from './imageRenderer'

function GridGallery({ photos, onClick }) {

  
  const transitions = useTransition(photos, item => item.src, {
    config: config.default,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    trail: 80
    })

  const imageRenderer = useCallback(
    ({ left, top, key, photo, index }) => {
      const trans = transitions.find(trans => trans.item.src === photo.src)
      return <animated.div style={trans.props} key={photo.src} >
          <ImageRenderer
            key={key}
            margin={"1px"}
            photo={photo}
            left={left}
            top={top}
            onClick={() => {onClick(photo, index)}}
            />
        </animated.div>
    },
    [transitions]
  );

  return (
      <Gallery 
        photos={photos} 
        // targetRowHeight={400} 
        renderImage={imageRenderer} 
        limitNodeSearch={30}
      />
  )
}

export default GridGallery