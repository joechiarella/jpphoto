const cloudinary = require('cloudinary');
const slugify = require('slugify')

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const {
    createNode
  } = actions;
  const queryParams = {
    tags: true,
    type: 'upload',
    max_results: `24`,
    resource_type: 'image'
  };

  cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
  });

  const getImageOrientation = (width, height) => {
    if (height === width) {
      return 'square';
    } else if (height > width) {
      return 'portrait';
    } else {
      return 'landscape';
    }
  };
  const cloudName = `${process.env.CLOUDINARY_NAME}`

  const processMediaItem = (image, folder) => {
    const nodeId = createNodeId(`cloudinary-image-${image.public_id}`);
    const orientation = getImageOrientation(image.width, image.height);
    const thumb = `https://res.cloudinary.com/${cloudName}/image/upload/h_600/v${image.version}/${image.public_id}.${image.format}`;
    const imgUrl = orientation === 'portrait' ? `https://res.cloudinary.com/${cloudName}/image/upload/h_1200/v${image.version}/${image.public_id}.${image.format}` : `https://res.cloudinary.com/${cloudName}/image/upload/w_1200/v${image.version}/${image.public_id}.${image.format}`;
    const imageData = Object.assign({
      folder,
      imgUrl,
      thumb,
      orientation
    }, image);
    const nodeContent = JSON.stringify(imageData);
    const nodeData = Object.assign({}, imageData, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `CloudinaryImage`,
        content: nodeContent,
        contentDigest: createContentDigest(imageData)
      }
    });
    return nodeData;
  };
  const coverParams = {
    resource_type: `image`,
    max_results: 500
  }

  const getFolderName = (public_id) => {
    return public_id.substr(0, public_id.indexOf('/')); 
  }

  const coverResponse = await cloudinary.v2.api.resources_by_tag("cover", coverParams, (error, result) => result);
  console.log("COVERS", coverResponse)
  
  const folders = coverResponse.resources.map(resource => {
    return {
      created_at: resource.created_at,
      name: getFolderName(resource.public_id)
    }
  })

  console.log("FOLDERS", folders)

  for (const folder of folders) {
    queryParams.prefix = folder.name;

    const folderData = {
      name: folder.name
    }

    const childNodes = []

    const folderMediaItems = await cloudinary.v2.api.resources(queryParams, (error, result) => result);

    if (folderMediaItems.resources.length > 0) {
      folderMediaItems.resources.forEach(mediaItem => {
        console.log("FOUND MEDIA", mediaItem)
        const nodeData = processMediaItem(mediaItem, folder.name);
        createNode(nodeData);
        childNodes.push(nodeData.id)
      });
    } else {
      console.log(`\n No cloudinary files where found in the folder ${folder.name}, please check your node-config`);
    }

    console.log("Childnodes", childNodes)

    createNode({
      id: `cloudinary-folder-${folder.name}`,
      parent: null,
      children: childNodes,
      name: folder.name,
      slug: slugify(folder.name),
      internal: {
        type: `CloudinaryFolder`,
        contentDigest: createContentDigest(folderData)
      }
    })
  }
};

exports.createPages = async function({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allCloudinaryFolder {
        edges {
          node {
            slug
          }
        }
      }
    }
  `)
  data.allCloudinaryFolder.edges.forEach(edge => {
    const slug = edge.node.slug
    actions.createPage({
      path: slug,
      component: require.resolve(`./src/templates/photoGallery.js`),
      context: { slug: slug },
    })
  })
}