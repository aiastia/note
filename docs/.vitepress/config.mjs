export default {
  title: "My Docs",
  description: "Docs with versioning",

  themeConfig: {
    nav: [
      {
        text: "版本",
        items: [
          { text: "v2 (最新)", link: "/v2/" },
          { text: "v1", link: "/v1/" }
        ]
      }
    ],

    sidebar: {
      "/v1/": [
        {
          text: "v1 文档",
          items: [
            { text: "介绍", link: "/v1/" }
          ]
        }
      ],
      "/v2/": [
        {
          text: "v2 文档",
          items: [
            { text: "介绍", link: "/v2/" }
          ]
        }
      ]
    }
  }
}
