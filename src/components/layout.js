import React from "react"
import { css } from "@emotion/core"
import Header from "./header"
import {Helmet} from "react-helmet";
import { useStaticQuery, graphql } from "gatsby"

export default ({ children }) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  return (
    <div
      css={css`
        margin: 0 auto;
      `}
    >
      <Helmet>
        <title>{data.site.siteMetadata.title}</title>
        <link href="https://fonts.googleapis.com/css?family=Josefin+Sans&display=swap" rel="stylesheet"/>
      </Helmet>
      <Header/>
      {children}
    </div>
  )
}