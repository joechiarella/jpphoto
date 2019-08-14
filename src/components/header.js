import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"
import { css } from "@emotion/core"

export default props => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            email
          }
        }
      }
    `
  )
  return <div css={css`
      display: flex; 
      align-items: baseline;
    `}>
    <Link to={`/`} css={css`
        text-decoration: none;
        font-style: normal;
        font-size: 2.5em;
        margin: 0.2em;
        `}>
      {data.site.siteMetadata.title}
    </Link>
    <Link
      to={`/about/`}
      css={css`
        margin-left: 3em;
        font-size: 1.5em;
        text-decoration: none;
      `}
      >
      About
    </Link>
    <div css={css`
      flex-grow: 1;
      text-align: right;
      font-size: 1.5em;
      `}>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
      {data.site.siteMetadata.email} // ATL
    </div>
  </div>
}
