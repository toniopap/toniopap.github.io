const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    if (!req.body) {
        context.res = { status: 400, body: { success: false, message: 'Empty body' } };
        return;
    }

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const pid = (data.pid || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '');
    const ts = Date.now();
    const blobName = `${pid}_${ts}.json`;

    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connStr) {
        context.log.error('AZURE_STORAGE_CONNECTION_STRING not set');
        context.res = { status: 500, body: { success: false, message: 'Storage not configured' } };
        return;
    }

    try {
        const client = BlobServiceClient.fromConnectionString(connStr);
        const container = client.getContainerClient('survey-responses');
        await container.createIfNotExists();
        const blob = container.getBlockBlobClient(blobName);
        const content = JSON.stringify(data);
        await blob.upload(content, Buffer.byteLength(content), {
            blobHTTPHeaders: { blobContentType: 'application/json' }
        });
        context.res = { status: 200, body: { success: true, blob: blobName } };
    } catch (err) {
        context.log.error('Blob upload failed:', err.message);
        context.res = { status: 500, body: { success: false, message: err.message } };
    }
};
