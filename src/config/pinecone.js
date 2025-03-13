const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const getIndex = async () => {
    const index = process.env.PINECONE_INDEX_NAME || 'drive-search';

    try {
        const response = await pc.listIndexes();
        const indexes = response.indexes;  // Access the 'indexes' property

        console.log('Indexes:', indexes);  // Log the output to check the actual indexes array

            const existingIndex = indexes.some(i => i.name === index);

            if (!existingIndex) {
                // Specify the 'spec' (pods or serverless configuration)
                await pc.createIndex({
                    name: index,
                    dimension: 1024,
                    metric: 'cosine',
                    spec:{
                        serverless:{
                            cloud: 'aws',
                            region: 'us-east-1',
                        }
                    }
                });

                let isReady = false;
                while (!isReady) {
                    const indexDesc = await pc.describeIndex(index);
                    isReady = indexDesc.status.ready;
                    if (!isReady) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            return pc.index(index);
        
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Rethrow the error to handle it upstream if needed
    }
};

module.exports = {
    getIndex,
};
