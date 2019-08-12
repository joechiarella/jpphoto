import React from "react"
import { css } from "@emotion/core"
import Header from "./header"
import {Helmet} from "react-helmet";

export default ({ children }) => {
  return (
    <div
      css={css`
        margin: 0 auto;
      `}
    >
      <Helmet>
        <link href="https://fonts.googleapis.com/css?family=Josefin+Sans&display=swap" rel="stylesheet"/>
      </Helmet>
      <Header/>
      {children}
    </div>
  )
}