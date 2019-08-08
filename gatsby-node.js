const cloudinary = require('cloudinary');
const slugify = require('slugify')

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});

const cloudName = `${process.env.CLOUDINARY_NAME}`

const getImageOrientation = (width, height) => {
  if (height === width) {
    return 'square';
  } else if (height > width) {
    return 'portrait';
  } else {
    return 'landscape';
  }
};

const getFolderName = (public_id) => {
  return public_id.substr(0, public_id.indexOf('/')); 
}

const createImageNodeData = (image, folder, createNodeId, createContentDigest) => {
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

const getCoverImages = async () => {
  const coverParams = {
    resource_type: `image`,
    max_results: 500
  }

  const coverResponse = cloudinary.v2.api.resources_by_tag("cover", coverParams, (error, result) => result);

  return coverResponse;
}

const getFolders = (covers) => {
  return covers.resources.map(resource => {
    return {
      created_at: resource.created_at,
      name: getFolderName(resource.public_id)
    }
  })
}

const getImagesForFolder = async (folderName) => {
  const queryParams = {
    tags: true,
    type: 'upload',
    max_results: `24`,
    resource_type: 'image',
    prefix: folderName
  };

  return cloudinary.v2.api.resources(queryParams, (error, result) => result);
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest
}) => {
  const {
    createNode
  } = actions;

  const covers = await getCoverImages()
  console.log("COVERS", covers)
 
  const folders = getFolders(covers)

  console.log("FOLDERS", folders)


  for (const folder of folders) {
    const folderMediaItems = await getImagesForFolder(folder.name)
    
    const nodeDatas = folderMediaItems.resources.map(mediaItem => {
      return createImageNodeData(mediaItem, folder.name, createNodeId, createContentDigest)
    })

    nodeDatas.forEach(data => createNode(data))
    const childNodes = nodeDatas.map(data => data.id)

    const folderData = {
      name: folder.name
    }
    const folderNodeData = {
      id: createNodeId(`cloudinary-folder-${folder.name}`),
      parent: null,
      children: childNodes,
      name: folder.name,
      slug: slugify(folder.name),
      internal: {
        type: `CloudinaryFolder`,
        contentDigest: createContentDigest(folderData)
      }
    }

    createNode(folderNodeData)
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