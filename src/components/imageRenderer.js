import { React, useState } from "react"
import { css } from "@emotion/core"
import {useSpring, animated} from 'react-spring'


const cont = {
  backgroundColor: "#eee",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative"
};

const ImageRenderer = ({
  photo,
  margin,
  onClick,
  overlay
}) => {

  const [isMouseOver, setMouseOver] = useState(false);
  const props = useSpring({
    config: {
      tension: 500,
      clamp: true
    },
    opacity: isMouseOver ? 1 : 0, 
    from: {
      opacity: isMouseOver ? 0 : 1
    }
  })

  return (
    <div
      style={{ margin, height: photo.height, width: photo.width, ...cont }}
      onMouseEnter={() => { setMouseOver(true) }}
      onMouseLeave={() => { setMouseOver(false) }}
      onClick={onClick}
      >
      <img
        alt={photo.title}
        {...photo}
        
        />
      { overlay && <animated.div style={props}
        css={css`
        position: absolute; 
        bottom: 0px; 
        left: 0; 
        width: 100%; 
        color: white; 
        margin: 0.5em;
      `}>
        <span css={css`color: white; 
          background: rgb(0, 0, 0); /* fallback color */
          background: rgba(0, 0, 0, 0.4);
          padding: 0.2em; `
          }>
          {overlay(photo)}
        </span>
        </animated.div> }
    </div>
  );
};

export default ImageRenderer;
