import { create } from 'ipfs-http-client';

const projectId = import.meta.env.VITE_INFURA_PROJECT_ID;
const projectSecret = import.meta.env.VITE_INFURA_API_SECRET;
const auth = 'Basic ' + btoa(projectId + ':' + projectSecret);

export const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const uploadToIPFS = async (data: any) => {
  try {
    const result = await ipfsClient.add(JSON.stringify(data));
    return result.path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const getFromIPFS = async (hash: string) => {
  try {
    const stream = ipfsClient.cat(hash);
    const decoder = new TextDecoder();
    let data = '';
    
    for await (const chunk of stream) {
      data += decoder.decode(chunk);
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};